import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SafeStockEditService } from '../edit.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { formatDate } from '@angular/common';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-safestock-edit',
  templateUrl: './edit.component.html',
  providers: [SafeStockEditService]
})
export class DemandOrderManagementSafestockEditComponent implements OnInit {
  i: any;
  iClone: any;
  Istrue: boolean;
  disabled1 = false;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: SafeStockEditService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService,    
    private appTranslationService: AppTranslationService
  ) { 
    
  }


  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadplant();
    if (this.i.id) {
      this.Istrue = true;
      this.disabled1 = true;
      this.i = Object.assign({}, this.i);
      this.iClone = Object.assign({}, this.i);
    } else {
      this.Istrue = false;
      this.disabled1 = false;
      this.i.plantCode = this.appConfigService.getPlantCode();
      this.i.startTime = new Date();
    }

  }

  save() {
    // this.i.ITEM_ID = this.selMater1.Value;
    if (this.i.itemId === '') {
      this.msgSrv.warning('请选择物料！');
      return;
    }
    if (this.i.endTime !== null && this.i.endTime !== '' && this.i.endTime !== undefined) {
      if (this.i.endTime < this.i.startTime) {
        this.msgSrv.warning('生效日期不能大于失效日期');
        return;
      }
    }
    if (this.i.maxQuantity < this.i.minQuantity) {
      this.msgSrv.warning('最小数量不能大于最大数量');
      return;
    }

    const params = Object.assign({}, this.i);
    params.startTime = formatDate(params.startTime, 'yyyy-MM-dd HH:mm:ss', 'zh-Hans');
    if (params.endTime) {
      params.endTime = formatDate(params.endTime, 'yyyy-MM-dd HH:mm:ss', 'zh-Hans');
    }

    this.editService.Edit(params).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  // 绑定页面的下拉框Plant
  optionListPlant = [];
  public loadplant(): void {
    /** 初始化  工厂*/
    this.commonQueryService.GetUserPlantNew().subscribe(result => {
      result.data.forEach(item => {
        this.optionListPlant.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  onPlantChange(val: any) {
    this.i.itemId = '';
    this.i.itemCode = '';
    this.i.descriptionsCn = '';
    this.i.unitOfMeasure = '';
    this.i.categoryCode = '';
  }

  // 绑定物料
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: this.appTranslationService.translate('物料编码'),
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: this.appTranslationService.translate('物料描述'),
      width: '100'
    }

  ];

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }


  // @ViewChild('selMater1', { static: true }) selMater1: PopupSelectComponent;

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.i.itemId = e.Value;
    this.i.itemCode = e.Text;
    this.i.descriptionsCn = e.Row.descriptionsCn;
    this.i.unitOfMeasure = e.Row.unitOfMeasure;
    this.i.categoryCode = e.Row.categoryCode;

    //this.msgSrv.error(e.Row.categoryCode);
  }


  onTextChanged(e: any) {

    this.commonQueryService.getUserPlantItemPageList(this.i.plantCode, e.Text, '').subscribe(res => {
    
      if (res.data.content.length === 0) {
        this.msgSrv.error('物料无效');
        this.i.itemId = '';
        this.i.itemCode = '';
        this.i.descriptionsCn = '';
        this.i.unitOfMeasure = '';
        this.i.categoryCode = '';
      } else {
        this.i.itemId = res.data.content[0].itemId;
        this.i.itemCode = res.data.content[0].itemCode;
        this.i.descriptionsCn = res.data.content[0].descriptionsCn;
        this.i.unitOfMeasure = res.data.content[0].unitOfMeasure;
        this.i.categoryCode = res.data.content[0].categoryCode;
        //this.msgSrv.error(res.data.content[0].categoryCode);
        console.log('物料类别：' + res.data.content[0].categoryCode);
      }
    });
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
