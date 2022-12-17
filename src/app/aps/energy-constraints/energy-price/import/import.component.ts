import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { EnergyPriceService } from '../query.service';

@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  providers: [EnergyPriceService]
})
export class EnergyPriceImportComponent implements OnInit {

  /**用户有权限的工厂列表 */
  plantCodeList: any[] =[];
  /**能源类型 */
  energyTypeOptions = [];
  /**价格类型 */
  planTypeOptions = [];
  /**峰平谷类型 */
  rateNumberOptions = [
    {
      label: '峰',
      value: '1'
    },
    {
      label: '平',
      value: '2'
    },
    {
      label: '谷',
      value: '3'
    },
    {
      label: '尖',
      value: '4'
    }
  ];
  
  impColumns = {
    columns: ['工厂', '能源类型', '价格类型', '能源单位', '单价', '峰平谷类型', '时间从', '时间至'],
    paramMappings: [
      { field: 'plantCode', title: '工厂', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'energyType', title: '能源类型', columnIndex: 2, constraint: { notNull: true, sequence: [], sequenceValue: []} },
      { field: 'planType', title: '价格类型', columnIndex: 3, constraint: { notNull: true, sequence: [], sequenceValue: []} },
      { field: 'unitSymbol', title: '能源单位', columnIndex: 4, constraint: { notNull: true, sequence: ['度','立方']} },
      { field: 'price', title: '单价', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'rateNumber', title: '峰平谷类型', columnIndex: 6, constraint: { notNull: false, sequence: [], sequenceValue: [] } },
      { field: 'startTime', title: '时间从', columnIndex: 7, constraint: { notNull: false, } },
      { field: 'endTime', title: '时间至', columnIndex: 8, constraint: { notNull: false, } },
    ]
  };

  expData: any[] = [];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'energyType', title: '能源类型', width: 150, locked: false },
    { field: 'planType', title: '价格类型', width: 150, locked: false },
    { field: 'unitSymbol', title: '能源单位', width: 150, locked: false },
    { field: 'priceResult', title: '单价', width: 150, locked: false },
    { field: 'rateNumber', title: '峰平谷类型', width: 150, locked: false},
    { field: 'startTime', title: '时间从', width: 150, locked: false },
    { field: 'endTime', title: '时间至', width: 150, locked: false },
    { field: 'failMessage', title: '错误信息', width: 150, locked: false },
  ];
  expColumnsOptions: any[] = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public excelDataProcess(tempData: any[]) {
    let errData = [];
    [tempData, errData] = this.verifyEnergyPrice(tempData);
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
  }

  constructor(
    private modal: NzModalRef,
    private queryService: EnergyPriceService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService
  ) { }

  ngOnInit() {
    /**初始化 工厂信息 */
    this.queryService.GetUserPlantNew(this.appconfig.getUserId()).subscribe(result => {
      result.data.forEach(d => {
        this.plantCodeList.push(d.plantCode);
      });
    });
    this.loadOptions();
    
    // rateNumber
    this.impColumns.paramMappings[5].constraint.sequence = this.rateNumberOptions.map(type => type.label);
    this.impColumns.paramMappings[5].constraint.sequenceValue = this.rateNumberOptions.map(type => type.value);
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
    this.queryService.GetLookupByTypeLang('PS_ENERGY_PRICE_TYPE', '').subscribe((result) => {
      this.planTypeOptions.length = 0;
      result.Extra.forEach(d => {
        this.planTypeOptions.push({
          label: d.meaning,
          value: d.lookupCode
        });
      });
      // planType
      this.impColumns.paramMappings[2].constraint.sequence = this.planTypeOptions.map(type => type.label);
      this.impColumns.paramMappings[2].constraint.sequenceValue = this.planTypeOptions.map(type => type.value);
    });
  }

  close() {
    this.modal.destroy();
  }

  private verifyEnergyPrice(tempData: any[]) {
    tempData = tempData.map(item => {
      // 固定价 格式化 峰平谷类型、时间从、时间至参数
      if(item.planType == '1') {
        item.rateNumber = '';
        item.startTime = '';
        item.endTime = '';
      }
      return item;
    })
    
    let errData = [];
    for(let i = 0; i < tempData.length; i++) {
      let failMessage = '';
      let isDelete = false;
      if(this.verifyPlantCode(tempData[i].plantCode)) {
        failMessage += '工厂无效；'
        isDelete = true;
      }
      if(this.verifyTime(tempData[i].startTime, tempData[i].endTime)) {
        failMessage += '时间从和时间至不符合要求；';
        isDelete = true;
      }
      if(this.verifyUnitSymbol(tempData[i].energyType, tempData[i].unitSymbol)) {
        failMessage += '能源类型与能源单位对应错误；';
        isDelete = true;
      }
      if(isDelete) {
        tempData[i].failMessage = failMessage;
        tempData[i].energyType = this.energyTypeOptions.find(type => type.value == tempData[i].energyType).label;
        tempData[i].planType = this.planTypeOptions.find(type => type.value == tempData[i].planType).label;
        tempData[i].rateNubmer = this.rateNumberOptions.find(type => type.value == tempData[i].rateNubmer).label;
        errData.push(tempData[i]);
        tempData.splice(i, 1);
        i--;
      }
    }
    
    return [tempData, errData];
  }

  private verifyPlantCode(plantCode: string) {
    if(this.plantCodeList.findIndex(plant => plant == plantCode) > -1) {
      return false;
    }
    // 工厂无效
    return true;
  }

  private verifyUnitSymbol(type: string, unitSymbol: string) {
    // 能源类型与能源单位对应错误
    let option = this.energyTypeOptions.find(t => t.value == type);
    if((option || '') == '' || unitSymbol != option.attribute1) {
      return true;
    }
    return false;
  }

  private verifyTime(startTime: string, endTime: string) {
    let startTimeInt = parseInt(startTime.split(":").join(""));
    let endTimeInt = parseInt(endTime.split(":").join(""));
    if(startTimeInt < 0 || endTimeInt >= 240000 || startTimeInt > endTimeInt) {
      // 时间从和时间至不符合要求
      return true;
    }
    return false;
  }

}
