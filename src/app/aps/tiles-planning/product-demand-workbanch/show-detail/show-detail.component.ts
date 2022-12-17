import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { identity } from 'rxjs';
import { QueryService } from '../query.service';

@Component({
  selector: 'show-detail',
  templateUrl: 'show-detail.component.html',
  providers: [QueryService],
})
export class TilesShowDetailComponent extends CustomBaseContext implements OnInit {
  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
  }
  //   queryParams: any;
  id: any;
  //未开单量
  url_unpalletqty =
    '/afs/ServerPPProuctDemand/ProductDemandService/QueryUnpalletDetails';
  //销售库存量
  url_inventoryqty =
    '/afs/ServerPPProuctDemand/ProductDemandService/QueryInventoryDetails';
  //在排产量
  url_scheduleqty =
    '/afs/ServerPPProuctDemand/ProductDemandService/QueryScheduleDetails';
  url: any;
  detailType: string;
  optionListReqType: any[];

  loadReqType(): void {
    this.commonQueryService
      .GetLookupByType('PP_PLN_ORDER_LINE_TYPE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.optionListReqType.push({
            label: d.MEANING,
            value: d.LOOKUP_CODE,
          });
        });
      });
  }

  columns_unpalletqty = [
    {
      field: 'CREATION_DATE',
      headerName: '数据推送时间',
      width: 150,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'SUP_COMPANY_CODE',
      headerName: '销售公司',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'REQ_NUMBER',
      headerName: '订单编号',
      width: 120,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'REQ_LINE_NUM',
      headerName: '订单行号',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'REQ_TYPE',
      headerName: '需求类型',
      width: 120,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_CATEGORY',
      headerName: '品种代码',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'DESCRIPTIONS_CN',
      headerName: '产品名称',
      width: 120,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_SPECS',
      headerName: '规格',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_MODEL',
      headerName: '生产型号',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'CUSTOMER_MODEL',
      headerName: '销售型号',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'PACK_MODEL',
      headerName: '包装型号',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'UNIT_OF_MEASURE',
      headerName: '单位',
      width: 70,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_PACKAGE',
      headerName: '包装片数',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ORIGINAL_QTY',
      headerName: '订单数量',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'PALLET_QTY',
      headerName: '打托数量',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'PRODUCT_GRADE',
      headerName: '产品等级',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_TYPE',
      headerName: '类别',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'CUSTOMER_NUMBER',
      headerName: '客户代码',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'CUSTOMER_NAME',
      headerName: '客户名称',
      width: 250,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'REQ_COMMENT',
      headerName: '订单备注',
      width: 200,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'CANCEL_NUMBER',
      headerName: '退单编号',
      width: 120,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'CANCEL_QTY',
      headerName: '退单数量',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'SHIP_QTY',
      headerName: '已开单量',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'PLANT_CODE',
      headerName: '生产基地',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'DEST_ADDRESS',
      headerName: '运输目的地',
      width: 200,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'SALESREP_WORK',
      headerName: '跟单员',
      width: 90,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'SALESREP_CONTACT',
      headerName: '业务员',
      width: 90,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'CONTRACT',
      headerName: '贸易合同号',
      width: 120,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'packbz',
      headerName: '包装要求',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'REQ_QTY',
      headerName: '未开单量',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'REQ_DATE_STR',
      headerName: '客户要求提货日期',
      width: 150,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'APPROVED_DATE',
      headerName: '审批通过时间',
      width: 150,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'SOURCE',
      headerName: '来源系统',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'OEM_PROVINCE',
      headerName: 'OEM省份',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
  ];
  columns_inventoryqty = [
    {
      field: 'PLANT_CODE',
      headerName: '生产基地',
      width: 150,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_CATEGORY',
      headerName: '品种',
      width: 150,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_SPECS',
      headerName: '规格',
      width: 200,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_MODEL',
      headerName: '型号',
      width: 150,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'INVENTORY_DESTROY_QTY',
      headerName: '销存量',
      width: 150,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
  ];
  columns_scheduleqty = [
    {
      field: 'PLANT_CODE',
      headerName: '生产基地',
      width: 110,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_CATEGORY',
      headerName: '品种',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_SPECS',
      headerName: '规格',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_MODEL',
      headerName: '型号',
      width: 130,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'MAKE_ORDER_NUMBER',
      headerName: '工单号',
      width: 120,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'FPC_TIME',
      headerName: '排产开始日期',
      width: 130,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'LPC_TIME',
      headerName: '排产结束日期',
      width: 130,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'MO_QTY',
      headerName: '工单量',
      width: 100,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'COMP_QTY',
      headerName: '工单入仓量',
      width: 130,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'SCHEDULE_QTY',
      headerName: '在排产量',
      width: 120,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
  ];
  ngOnInit(): void {
    if (this.detailType === 'UNPALLET_QTY') {
      this.loadReqType();
      this.columns = this.columns_unpalletqty;
      this.url = this.url_unpalletqty;
    }
    if (this.detailType === 'INVENTORY_DESTROY_QTY') {
      this.columns = this.columns_inventoryqty;
      this.url = this.url_inventoryqty;
    }
    if (this.detailType === 'SCHEDULE_QTY') {
      this.columns = this.columns_scheduleqty;
      this.url = this.url_scheduleqty;
    }
    this.query();
  }
  query() {
    super.query();
    this.commonQueryService.loadGridView(
      {
        url: this.url,
        method: 'POST',
      },
      { id: this.id },
      this.context,
    );
  }// 获取数据后统计
  loadGridDataCallback(result) {
    setTimeout(() => {
      const isFilter = this.gridApi.isColumnFilterPresent();
      let data = [];
      if (isFilter) {
        this.gridApi.forEachNodeAfterFilter(item => {
          data.push(item.data);
        });
      } else {
        data =
          result.Result && Array.isArray(result.Result) ? result.Result : [];
      }
      this.setTotalBottomRow(data);
    });
  }

  // 过滤后重新统计
  onFilterChanged(event) {
    const data: any[] = [];
    this.gridApi.forEachNodeAfterFilter(item => {
      data.push(item.data);
    });
    this.setTotalBottomRow(data);
  }

  // 统计方法
  setTotalBottomRow(data: any[]) {

    if (this.detailType === 'UNPALLET_QTY') {
      
    // 显示"总计"的列
    const totalField = 'CREATION_DATE';
    // 需要统计的列数组
    const fields = ['REQ_QTY'];
    super.setTotalBottomRow(data, totalField, fields);
      }
      if (this.detailType === 'INVENTORY_DESTROY_QTY') {
       
    // 显示"总计"的列
    const totalField = 'PLANT_CODE';
    // 需要统计的列数组
    const fields = ['INVENTORY_DESTROY_QTY'];
    super.setTotalBottomRow(data, totalField, fields);
      }
      if (this.detailType === 'SCHEDULE_QTY') {
       
    // 显示"总计"的列
    const totalField = 'PLANT_CODE';
    // 需要统计的列数组
    const fields = ['MO_QTY','COMP_QTY', 'SCHEDULE_QTY'];
    super.setTotalBottomRow(data, totalField, fields);
      }
  }
}
