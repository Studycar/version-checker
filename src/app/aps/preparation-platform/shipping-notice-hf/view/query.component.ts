import { Component, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService, NzModalRef, NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { ShippingNoticeHfService } from '../../../../modules/generated_module/services/shipping-notice-hf-service';
import { GridDataResult } from '../../../../../../node_modules/@progress/kendo-angular-grid';
import { NoticeQueryCancelService } from '../../../../modules/generated_module/services/notice-query-cancel-service';
import { PopupSelectComponent } from 'app/modules/base_module/components/popup-select.component';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'query',
  templateUrl: './query.component.html',
  providers: [ShippingNoticeHfService, NoticeQueryCancelService],
})
export class PreparationPlatformShippingNoticeHfQueryComponent implements OnInit {
  queryParams: any = {};
  dtCagetoryType: any[] = [];
  dtCagetoryTypeSelect: any[] = [];
  sCagetoryType: any;
  treeLevel = 0;
  gridViewItem: GridDataResult = {
    data: [],
    total: 0
  };
  columnItem: any[] = [
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

  columnCagetoryType: any[] = [
    { field: 'categoryCode', title: '编码', width: '200px' },
    { field: 'descriptions', title: '描述', width: '200px' }
  ];

  @ViewChild('selMaterItem', { static: true }) selMaterItem: PopupSelectComponent;
  constructor(
    public http: _HttpClient,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private noticeQueryCancelService: NoticeQueryCancelService,
    private appconfig: AppConfigService,
    private shippingNoticeHfService: ShippingNoticeHfService
  ) { }

  ngOnInit() {
    const category = this.queryParams.cagetoryType;
    if (this.queryParams.load) {
      this.Reload(); // 重置
      // 初始化数据
      this.shippingNoticeHfService.loadQueryData().subscribe(res => {
        this.queryParams.dtPlant = res.data.dtPlant;
        if (this.queryParams.load && this.queryParams.dtPlant.length > 0) {
          this.queryParams.plantCode = this.appconfig.getPlantCode(); // this.queryParams.dtPlant[0].plantCode;
        }
        this.plantChange(this.queryParams.plantCode);
        this.queryParams.dtBuyer = res.data.dtBuyer;
        if (this.queryParams.load && this.queryParams.dtBuyer.length > 0) {
          this.queryParams.buyer = this.queryParams.dtBuyer[0].employeeNumber;
        }
        this.queryParams.dtFdStatus = res.data.dtFdStatusType;
        if (this.queryParams.load && this.queryParams.dtFdStatus.length > 0) {
          this.queryParams.fdStatus = this.queryParams.dtFdStatus[0].lookupCode;
        }
      });

    } else {
      this.dtCagetoryTypeSelect = this.queryParams.dtCagetoryTypeSelect;
      if (this.queryParams.itemCode) {
        this.selMaterItem.Text = this.queryParams.itemCode;
      }
    }
  }

  plantChange(strValue: String) {
    // 工厂联动计划类型和采购品类
    this.shippingNoticeHfService.listCalendarType(strValue).subscribe(res => {
      this.queryParams.dtCalendarType = res.data;
      if (this.queryParams.dtCalendarType.length > 0 && this.queryParams.load) {
        this.queryParams.calendarType = this.queryParams.dtCalendarType[0].deliveryCalendarCode;
      }
      this.queryCagetoryType(strValue, this.queryParams.calendarType);
    });
  }

  // 计划类型改变
  calendarTypeChange(strValue: String) {
    this.queryCagetoryType(this.queryParams.plantCode, strValue);
  }

  // 加载采购品类
  queryCagetoryType(plantCode: String, calendarType: String) {
    // 根据组织和计划类型加载物料类别
    this.shippingNoticeHfService.listPurCagetory(plantCode, calendarType).subscribe(res => {
      this.queryParams.dtCagetoryType = res.data;
    });
  }

  query() {
    let msg = '';
    if (this.queryParams.plantCode === undefined || this.queryParams.plantCode === '') {
      msg = this.appTranslationService.translate('库存组织不能为空');
      this.msgSrv.info(msg);
      return;
    }
    if (this.queryParams.buyer === undefined || this.queryParams.buyer === '') {
      msg = this.appTranslationService.translate('采购员不能为空');
      this.msgSrv.info(msg);
      return;
    }
    if (this.queryParams.fdStatus === undefined || this.queryParams.fdStatus === '' || this.queryParams.fdStatus === null) {
      msg = this.appTranslationService.translate('备料方式不能为空');
      this.msgSrv.info(msg);
      return;
    }
    if (this.queryParams.calendarType === undefined || this.queryParams.calendarType === '') {
      msg = this.appTranslationService.translate('计划类型不能为空');
      this.msgSrv.info(msg);
      return;
    }
    this.queryParams.cagetoryType = [];
    this.dtCagetoryTypeSelect.forEach(x => { this.queryParams.cagetoryType.push(x['categoryCode']); });
    this.queryParams.dtCagetoryTypeSelect = this.dtCagetoryTypeSelect;
    this.queryParams.itemCode = this.selMaterItem.Text;
    this.queryParams.refresh = true;
    this.modal.close(true);
  }

  checkData(strValue: any) {
    return strValue === undefined || strValue === '';
  }

  Reload() {
    // 库存组织
    let plantCode = '';
    if (this.queryParams.dtPlant && this.queryParams.dtPlant.length > 0) {
      plantCode = this.queryParams.dtPlant[0].plantCode;
    }
    // 采购员
    let buyer = '';
    if (this.queryParams.dtBuyer && this.queryParams.dtBuyer.length > 0) {
      buyer = this.queryParams.dtBuyer[0].employeeNumber;
    }
    // 计划类型
    let calendarType = '';
    if (this.queryParams.dtCalendarType && this.queryParams.dtCalendarType.length > 0) {
      calendarType = this.queryParams.dtCalendarType[0].deliveryCalendarCode;
    }
    // 物料类别
    this.queryCagetoryType(plantCode, calendarType);
    this.dtCagetoryTypeSelect = [];
    this.queryParams.dtCagetoryTypeSelect = [];
    this.queryParams.plantCode = plantCode;
    this.queryParams.buyer = buyer;
    this.queryParams.fdStatus = null;
    this.queryParams.calendarType = calendarType;
    this.queryParams.cagetoryType = this.sCagetoryType;
    this.queryParams.itemCode = '';
    this.queryParams.noZeroDemand = true;
    this.queryParams.noZeroSupply = true;

    if (this.selMaterItem) {
      this.selMaterItem.Value = '';
      this.selMaterItem.Text = '';
    }
  }

  searchItem(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  public loadItems(plantCode: string, itemCode: string, pageIndex: number, pageSize: number) {
    // 加载物料
    this.noticeQueryCancelService.pagePurchaseItem(plantCode, itemCode, pageIndex, pageSize).subscribe(res => {
      this.gridViewItem.data = res.data.content;
      this.gridViewItem.total = res.data.totalElements;
    });
  }
}
