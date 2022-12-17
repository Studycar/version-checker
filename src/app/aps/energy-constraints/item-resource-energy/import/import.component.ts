import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { ItemResourceEnergyService } from '../query.service';

@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  providers: [ItemResourceEnergyService]
})
export class ItemResourceEnergyImportComponent implements OnInit {

  /**用户有权限的工厂列表 */
  plantCodeList: any[] =[];
  /**能源类型 */
  energyTypeOptions = [];
  scheduleGroupExist: boolean;
  resourceCodeExist: boolean;
  itemCodeExist: boolean;
  itemId: string;
  impColumns = {
    columns: ['工厂', '能源类型', '能源单位', '单位能耗值', '计划组编码', '资源编码', '物料编码'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'energyType', title: '能源类型', columnIndex: 2, constraint: { notNull: true, sequence: [], sequenceValue: []} },
      { field: 'unitSymbol', title: '能源单位', columnIndex: 3, constraint: { notNull: true, sequence: []} },
      { field: 'douValue', title: '单位能耗值', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'scheduleGroupCode', title: '计划组编码', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'resourceCode', title: '资源编码', columnIndex: 6, constraint: { notNull: true, } },
      { field: 'itemCode', title: '物料编码', columnIndex: 7, constraint: { notNull: true, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'energyType', title: '能源类型', width: 150, locked: false },
    { field: 'unitSymbol', title: '能源单位', width: 150, locked: false },
    { field: 'douValue', title: '单位能耗值', width: 150, locked: false },
    { field: 'scheduleGroupCode', title: '计划组编码', width: 150, locked: false },
    { field: 'resourceCode', title: '资源编码', width: 150, locked: false },
    { field: 'itemCode', title: '物料编码', width: 150, locked: false },
    { field: 'failMessage', title: '错误信息', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    this.verify(tempData).then((errData)=>{
      this.queryService.Import(tempData).subscribe(res => {
        if (res.data) {
          if (errData.length > 0) {
            this.excelexport.export(errData);
            this.msgSrv.info(this.appTranslationService.translate(`导入成功${tempData.length}条，导入失败${errData.length}条，请查看导出信息`));
          } else {
            this.msgSrv.success(this.appTranslationService.translate("导入成功"));
          }
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    });
   
  }

  constructor(
    private modal: NzModalRef,
    private queryService: ItemResourceEnergyService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
  ) { }

  ngOnInit() {
    /**初始化 工厂信息 */
    this.queryService.GetUserPlantNew(this.appconfig.getUserId()).subscribe(result => {
      result.data.forEach(d => {
        this.plantCodeList.push(d.plantCode);
      });
    });
    this.loadOptions();
  }

  loadOptions() {
    this.queryService.GetLookupByTypeLang('PS_ENERGY_TYPE', '').subscribe(result => {
      this.energyTypeOptions.length = 0;
      result.Extra.forEach(d => {
        this.energyTypeOptions.push({
          label: d.meaning,
          value: d.lookupCode,
          attribute1: d.attribute1
        });
      });
      // energyType
      this.impColumns.paramMappings[1].constraint.sequence = this.energyTypeOptions.map(type => type.label);
      this.impColumns.paramMappings[1].constraint.sequenceValue = this.energyTypeOptions.map(type => type.value);
      this.impColumns.paramMappings[2].constraint.sequence = this.energyTypeOptions.map(type => type.attribute1);
    });
  }

  close() {
    this.modal.destroy();
  }

  private async verify(tempData: any[]) {
    let errData = [];
    for(let i = 0; i < tempData.length; i++) {
      let failMessage = '';
      let isDelete = false;
      if(this.verifyPlantCode(tempData[i].plantCode)) {
        failMessage += '工厂无效；'
        isDelete = true;
      } else {
        await this.verifyScheduleGroup(tempData[i].plantCode, tempData[i].scheduleGroupCode);
        if(!this.scheduleGroupExist) {
          failMessage += '计划组无效；'
          isDelete = true;
        } else {
          await this.verifyResource(tempData[i].plantCode, tempData[i].scheduleGroupCode, tempData[i].resourceCode);
          if(!this.resourceCodeExist) {
            failMessage += '资源无效；'
            isDelete = true;
          }
        }
      } 
      await this.verifyItem(tempData[i].itemCode, tempData[i].plantCode);
      if(!this.itemCodeExist) {
        failMessage += '物料无效；'
        isDelete = true;
      }else {
        tempData[i].itemId = this.itemId;
      }
      if(this.verifyUnitSymbol(tempData[i].energyType, tempData[i].unitSymbol)) {
        failMessage += '能源类型与能源单位对应错误；';
        isDelete = true;
      }
      if(tempData[i].douValue <= 0) {
        failMessage += '单位能耗值必须大于0；';
        isDelete = true;
      }
      if(isDelete) {
        tempData[i].failMessage = failMessage;
        tempData[i].energyType = this.energyTypeOptions.find(type => type.value == tempData[i].energyType).label;
        errData.push(tempData[i]);
        tempData.splice(i, 1);
        i--;
      }
    }
    return errData;
  }

  private verifyPlantCode(plantCode: string) {
    if(this.plantCodeList.findIndex(plant => plant == plantCode) > -1) {
      return false;
    }
    // 工厂无效
    return true;
  }

  public async verifyScheduleGroup(plantCode: string, scheduleGroupCode: string) {
    /** 根据工厂获取计划组编码*/
    let data = (await this.queryService.http.get<ResponseDto>(this.queryService.getScheduleGroupCodeUrl+plantCode).toPromise()).data;
    this.scheduleGroupExist = data.findIndex(d => d.scheduleGroupCode == scheduleGroupCode) > -1;
  }

  public async verifyResource(plantCode: string, scheduleGroupCode: string, resourceCode: string) {
    /** 根据计划组获取资源*/
    let data = (await this.queryService.http.get<ResponseDto>(
      this.queryService.getResourceUrl + '?txtPlantCode=' + plantCode + '&txtScheduleGroupCode=' + scheduleGroupCode + '&txtResourceCode=' + resourceCode,
      {}).toPromise()).data.content;
    this.resourceCodeExist = data.length > 0;
  }

  private async verifyItem(itemCode: string, plantCode: string) {
    let data = (await this.queryService.http.get<ResponseDto>(
      this.queryService.getItemByItemCode + itemCode
    ).toPromise()).data;
    if(data != null) {
      // 判断存在的物料编码是否在该工厂里
      let data1 = (await this.queryService.http.get<ResponseDto>(
        this.queryService.getItemById + data.itemId + '&plantCode=' + plantCode
      ).toPromise()).data;
      if(data1 != null) {
        this.itemCodeExist = true;
        this.itemId = data.itemId;
      } else {
        this.itemCodeExist = false;
      }
    }else {
      this.itemCodeExist = false;
    }
  }

  private verifyUnitSymbol(type: string, unitSymbol: string) {
    // 能源类型与能源单位对应错误
    let option = this.energyTypeOptions.find(t => t.value == type);
    if((option || '') == '' || unitSymbol != option.attribute1) {
      return true;
    }
    return false;
  }
  
}
