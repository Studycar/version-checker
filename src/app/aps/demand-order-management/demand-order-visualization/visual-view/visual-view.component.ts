import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { _HttpClient } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PopupSelectComponent } from '../../../../modules/base_module/components/popup-select.component';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { DemandclearupnoticeService } from '../../../../modules/generated_module/services/demandclearupnotice-service';
import { PsItemRoutingsService } from '../../../../modules/generated_module/services/ps-item-routings-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'visual-view',
  templateUrl: './visual-view.component.html',
  styles: [`
    .steps-item-container-inner {
      background:#aeb1ea;
      width: 80px;
      height: 80px;
      padding-top: 10px; 
      border-radius: 50%; 
      text-align: center;
      opacity: 0.5;
    }
    .steps-item-container-inner:hover {
      cursor: pointer;
    }
    .ant-steps-item-title1::after {
        position: absolute;
        top: 0;
        left: 135%;
        display: block;
        width: 9999px;
        height: 1px;
        background: #e8e8e8;
        content: '';
    }
    .steps-item-title {
      line-height: 20px;
      color: #505050;
      font-weight: bold;
    }
    .active {
      opacity: 1;
    }
    .desc-div {
      float: left;
      width: 20%;
      margin-bottom: 8px;
    }
    .fl-right {
      float: right;
    }
    .desc-title {
      color: rgba(0, 0, 0, 0.85);
      font-weight: normal;
      font-size: 13px;
      line-height: 1.5;
      white-space: nowrap;
      display: inline-block;
    }
    .desc-value {
      white-space: nowrap;
      display: inline-block;
    }
    .plan::after {
      background: #1890ff;
    }
  `],
  providers: [PsItemRoutingsService,QueryService],
})

export class VisualView implements OnInit {

  title: String = '需求管理';

  queryParams: any[] = [];
  i: any;

  orderInfo: any[] = [];
  moEndDate: String = '';
  chartData: any[] = [];
  propsData = {};
  completionRateData: any = {};
  // {
      //   label: '计划完成时间',
      //   value: this.i.moEndDate
      // }
  stepsData: any[] = [
    {
      label: '需求管理',
      iconSrc: '/assets/icons/order-history.svg'
    },
    {
      label: '车间排程',
      iconSrc: '/assets/icons/shop-scheduling.svg'
    },
    {
      label: '生产备料',
      iconSrc: '/assets/icons/production-preparation.svg'
    },
    {
      label: '完工齐套',
      iconSrc: '/assets/icons/completed-sleeve.svg'
    }
  ]

  activeIndex: any = 0;

  public panelActive1 = true;
  public panelActive2 = false;
  public panelActive3 = false;
  public panelTitle1 = this.appTranslationService.translate('主要信息');
  public panelTitle2 = this.appTranslationService.translate('销售信息');
  public panelTitle3 = this.appTranslationService.translate('非标信息');

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private commonQueryService: CommonQueryService,
    public demandclearupnoticeService: DemandclearupnoticeService,
    private appConfigService: AppConfigService,
    private apiService: QueryService
  ) { }

  ngOnInit(): void {
    // 订单信息
    this.orderInfo = [
      {
        label: '需求订单号',
        value: this.i.reqNumber,
        width: '22'
      },
      {
        label: '项目号码',
        value: this.i.projectNumber,
        width: '23'
      },
      {
        label: '需求数量',
        value: this.i.reqQty,
        width: '12'
      },
      {
        label: '物料编码',
        value: this.i.itemCode,
      },
      // {
      //   label: '物料描述',
      //   value: this.i.descriptionsCn
      // },
      {
        label: '总装工单号',
        value: this.i.moNumber,
        width: '23'
      },
      {
        label: '工单状态',
        value: this.i.moStatusStr,
        width: '22'
      },
      {
        label: '工单数量',
        value: this.i.moQuantity,
        width: '23'
      },
      {
        label: '计划开始时间',
        value: this.i.moStartDate,
        width: '23'
      },
      {
        label: '计划完成时间',
        value: this.i.moEndDate,
        width: '23'
      }
    ];
    this.moEndDate = this.i.moEndDate
    
    this.stepsData[0].plan = this.i.moNumber ? true : false
    this.getPieData();
    this.completionRate();
  }
  
  public getPieData() {
      this.apiService.getPieData({
          // moNumber: 'MO-S0410060020',
          moNumber: this.i.moNumber,
      }).subscribe(res => {
        this.chartData = res.data
        this.stepsData[1].plan = this.chartData.length ? true : false
      })
      this.getShopBill()
  }
  public getShopBill () {
    this.apiService.queryPurchaseKitStatus({
      // moNumber: 'MO-S0410060020',
      kitStatus: '缺料',
      plantCode: this.i.plantCode,
      makeOrderNum: this.i.moNumber,
      pageIndex: 1,
      pageSize: 100
    }).subscribe(res => {
      this.propsData = res.data;
        if(!this.stepsData[1].plan) this.stepsData[1].plan = res.data.content.length ? true : false
    })
  }
  completionRate() {
      this.apiService.queryCalcMakeOrderCompletionRate({
        plantCode: this.i.plantCode,
        // plantCode: 'M08',
        // makeOrderNum: 'MO-test210910200000001'
        makeOrderNum: this.i.moNumber,
    }).subscribe(res => {
      this.completionRateData =  res.data;
      if(res.data) this.stepsData[2].plan = res.data.rate > 0;
    });

  }
  close() {
    this.modal.destroy();
  }

  handleActive(val) {
    this.activeIndex = val;
    switch(val) {
      case 0:
        this.title = '需求管理';
        break;
      case 1:
        this.title = '车间排程';
        break;
      case 2:
        this.title = '生产备料';
        break;
      case 3:
        this.title = '完工齐套';
        break;
    }
  }
}
