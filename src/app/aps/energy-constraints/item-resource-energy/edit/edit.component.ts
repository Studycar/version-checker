import { Component, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { ItemResourceEnergyService } from '../query.service';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  providers: [ItemResourceEnergyService]
})
export class EnergyConstraintsItemResourceEnergyEditComponent implements OnInit {

  isModify: boolean = false;
  i: any;
  iClone: any;

  /**用户有权限的工厂 */
  plantCodeList = [];
  /**工厂对应的计划组列表 */
  scheduleGroupList = [];
  /**计划组对应的资源列表 */
  resourceCodeList = [];
  /**能源类型 */
  energyTypeOptions = [];

  // 绑定物料
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];

  constructor(
    private modal: NzModalRef,
    private queryService: ItemResourceEnergyService,
    private appconfig: AppConfigService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) { 
  }

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    this.queryService.GetEnergyTypeByTypeRef('PS_ENERGY_TYPE', this.energyTypeOptions);
    
    if(this.i.id != null) {
      this.isModify = true;
      this.queryService.GetItemResourceEnergyItem(this.i.id).subscribe(result => {
        this.i = result.data;
        this.queryService.SearchItemInfoByID(this.i.itemId).subscribe(res => {
          this.i.itemCode = res.data.itemCode;
          this.i.descriptions = res.data.descriptions;
          this.i.unitOfMeasure = res.data.unitOfMeasure;
          this.iClone = Object.assign({}, this.i);
        })
        if(this.energyTypeOptions.length) { this.changeUnitSymbol(); }
        this.loadScheduleGroup();
      })
    }
    /**初始化 工厂信息 */
    this.queryService.GetUserPlantNew(this.appconfig.getUserId()).subscribe(result => {
      result.data.forEach(d => {
        this.plantCodeList.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
      if(this.i.id == null) {
        this.i.plantCode = this.appconfig.getActivePlantCode();
      }
      this.loadScheduleGroup();
    });
  }

  public loadScheduleGroup() {
    /** 根据工厂获取计划组编码  下拉框*/
    this.scheduleGroupList.length = 0;
    this.queryService.GetScheduleGroupCode(this.i.plantCode).subscribe(result => {
      result.data.forEach(d => {
        this.scheduleGroupList.push({
          label: d.scheduleGroupCode,
          value: d.scheduleGroupCode,
        });
      });
      // if(this.i.id == null) {
      //   if(result.data.length) {
      //     this.i.scheduleGroupCode = result.data[0].scheduleGroupCode; 
      //     this.loadResource();
      //   } else {
      //     this.i.scheduleGroupCode = null; 
      //   }
      // }
      // else { 
      //   this.loadResource();
      // }
    });
  }

  public loadResource() {
    /** 根据计划组获取资源  下拉框*/
    this.resourceCodeList.length = 0;
    this.queryService.GetResourceBySchedule(this.i.plantCode, this.i.scheduleGroupCode).subscribe(result => {
      result.data.content.forEach(d => {
        this.resourceCodeList.push({
          label: d.resourceCode,
          value: d.resourceCode,
        });
      });
      if(this.i.id == null) {
        if(result.data.content.length) { this.i.resourceCode = result.data.content[0].resourceCode; }
        else { this.i.resourceCode = null; }
      }
    });
  }

  /**
   * 物料弹出查询
   * @param {any} e
   */
   public searchItems(e: any) {
    if (
      !this.i.plantCode ||
      this.i.plantCode === undefined
    ) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请先选择工厂！'),
      );
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.i.plantCode,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载物料
   * @param {string} PLANT_CODE 工厂代码
   * @param {string} ITEM_CODE  物料代码
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
  public loadItems(
    PLANT_CODE: string,
    ITEM_CODE: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.queryService
      .getUserPlantItemPageList(
        PLANT_CODE || '',
        ITEM_CODE || '',
        '',
        PageIndex,
        PageSize,
      )
      .subscribe(res => {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.totalElements;
      });
  }

  changeUnitSymbol() {
    let option = this.energyTypeOptions
      .find(option => option.value === this.i.energyType);
    // 判断 option 是否为空
    if((option || '') === '') { this.i.unitSymbol = null; }
    else { this.i.unitSymbol = option.attribute1; }
  }

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.i.itemId = e.Value;
    this.i.unitOfMeasure = null;
    // 给物料描述赋值
    this.queryService.SearchItemInfoByID(e.Value).subscribe(resultMes => {
      this.i.itemCode = e.Text;
      this.i.descriptions = resultMes.data.descriptions;
      this.i.unitOfMeasure = resultMes.data.unitOfMeasure;
    });
  }

  onPopupSelectTextChanged(event: any) {
    const plantCode = this.i.plantCode;
    const itemCode = event.Text.trim();
    if(itemCode == '') { 
      this.i.itemId = '';
      this.i.descriptions = '';
      this.i.unitOfMeasure = '';
      return; 
    }
    // 加载物料
    this.queryService.getUserPlantItemPageList(plantCode, itemCode, '').subscribe(res => {
      if (res.data.content.length > 0) {
        this.i.itemId = res.data.content[0].itemId;
        this.i.descriptions = res.data.content[0].descriptionsCn;
        this.i.unitOfMeasure = res.data.content[0].unitOfMeasure;
      }
    });
  }

  OnSelectTextChange(text) {
    if(text === '') {
      this.i.itemCode = '';
      this.i.itemId = '';
      this.i.descriptions = '';
      this.i.unitOfMeasure = '';
    }
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
    this.loadScheduleGroup();
  }

  close() {
    this.modal.destroy();
  }

  save(value: any) {
    this.i.id = this.i.id || '';
    if (this.i.id !== '') {
      value.id = this.i.id;
      value.unitSymbol = this.i.unitSymbol;
    } else {
      value.id = null;
    }
    let item = {
      id: this.i.id,
      plantCode: this.i.plantCode,
      energyType: this.i.energyType,
      unitSymbol: this.i.unitSymbol,
      douValue: this.i.douValue,
      scheduleGroupCode: this.i.scheduleGroupCode,
      resourceCode: this.i.resourceCode,
      itemId: this.i.itemId
    };
    
    this.queryService.SaveItem(item).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate('保存失败'));
      }
    });
  }

  public verify() {
    if(!this.i.itemId || !this.i.energyType || !this.i.plantCode 
      || !this.i.scheduleGroupCode || !this.i.resourceCode) {
      return true;
    } else if((this.i.douValue||'') == '' || this.i.douValue <= 0) {
      return true;
    }
    return false;
  }
}
