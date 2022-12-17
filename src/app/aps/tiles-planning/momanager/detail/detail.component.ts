import { Component, OnInit, } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../editservice';
import { MoManagerService } from 'app/modules/generated_module/services/mo-manager-service';

@Component({
  selector: 'oem-production-plan-detail',
  templateUrl: './detail.component.html',
  providers: [QueryService]
})
export class TilesDetailComponent extends CustomBaseContext implements OnInit {
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService,
    public editService: QueryService,
    private momanager: MoManagerService,
  ) {
    super({
      appTranslationSrv: appTranslationService,
    })
  }

  httpAction = { url: this.momanager.searchUrl, method: 'POST' };

  public i: any;

  gridHeight = 400;

  OAResultList: any[] = [];

  public columns = [
    {
      field: 'MAKE_ORDER_NUM',
      headerName: '工单号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'MAKE_ORDER_STATUS',
      headerName: '工单状态',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'SALE_COMPANY',
      headerName: '销售公司',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'PLANT_CODE',
      headerName: '生产基地',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'SCHEDULE_GROUP_CODE',
      headerName: '车间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      valueFormatter: function (params) {
        if (params.value === 'unplan-group-00') {
          return '待排产区';
        }
        return params.value;
      },
    },
    {
      field: 'RESOURCE_CODE',
      headerName: '窑炉',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
      valueFormatter: function (params) {
        if (params.value === 'unplan-resouce-00') {
          return '待排产区';
        }
        return params.value;
      },
    },
    {
      field: 'ITEM_THICKNESS',
      headerName: '厚度',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'POLISH_LINE',
      headerName: '抛光线',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_SERIES',
      headerName: '产品系列',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_SPECS',
      headerName: '规格',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'PRODUCT_GRADE',
      headerName: '产品等级',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_MODEL',
      headerName: '生产型号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'CUSTOMER_MODEL',
      headerName: '销售型号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'PACK_MODEL',
      headerName: '包装型号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    { field: 'DESCRIPTIONS_CN', headerName: '产品名称', width: 150, tooltipField: 'DESCRIPTIONS_CN', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    {
      field: 'ITEM_TYPE',
      width: 150,
      headerName: '销售分类',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_ATTRIBUTE1',
      width: 150,
      headerName: '产品大类',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'MO_QTY',
      headerName: '工单数量',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'UNIT_OF_MEASURE',
      headerName: '单位',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'START_DATE',
      headerName: '排产开始日期',
      valueFormatter: function (params) {
        if (params.data.RESOURCE_CODE === 'unplan-resouce-00') {
          return '';
        }
        return params.value;
      },
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'FINISH_DATE',
      headerName: '排产结束日期',
      valueFormatter: function (params) {
        if (params.data.RESOURCE_CODE === 'unplan-resouce-00') {
          return '';
        }
        return params.value;
      },
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'PRODUCTION_DURATION',
      headerName: '生产时长（天）',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'SWITCH_TIME',
      headerName: '切换时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'START_TIME',
      headerName: '排产开始时间',
      valueFormatter: function (params) {
        if (params.data.RESOURCE_CODE === 'unplan-resouce-00') {
          return '';
        }
        return params.value;
      },
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'FINISH_TIME',
      headerName: '排产完成时间',
      valueFormatter: function (params) {
        if (params.data.RESOURCE_CODE === 'unplan-resouce-00') {
          return '';
        }
        return params.value;
      },
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'PROCESS_STATUS',
      headerName: '工单进度',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'DEMAND_DATE_STR',
      headerName: '客户要求提货日期',
      width: 190,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_GLAZE',
      headerName: '釉料',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'TEST_CODE',
      headerName: '试制编号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'TEST_PLANT',
      headerName: '试制基地',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ITEM_BODY',
      headerName: '坯体',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'COLOR_MATCH_FLAG',
      width: 150,
      headerName: '坯体是否配色',
      valueFormatter: 'ctx.optionsFind(value,3).label',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'NEED_PACKAGE_CONSIGN',
      headerName: '是否打托',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'PALLET_QTY',
      headerName: '打托数量',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'COMPLETE_NUM',
      headerName: '已入仓量',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'COMPLETE_NUM_PERCENT_STR',
      headerName: '入仓百分比',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'TEST_COMPLETE',
      headerName: '试制完成时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'PROD_START',
      headerName: '实际生产开始时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'PROD_COMPLETE',
      headerName: '实际生产完成时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: '',
      headerName: '打包数量',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'COMMENTS',
      headerName: '备注',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'OEM_ORDER_NUM',
      headerName: 'OEM订单号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'OA_RESULT',
      headerName: 'OEM订单流程状态',
      valueFormatter: 'ctx.optionsFind(value,6).label',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'OEM_PLAN_NUM',
      headerName: 'OEM排产申请单号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'OLD_MO_QTY',
      headerName: '原需求数量',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'PLAN_QTY',
      headerName: '需求订单数量',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'DERIVED_FLAG',
      headerName: '拆分标识',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ORI_MO_NUMBER',
      headerName: '原工单号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'REQ_NUMBER',
      headerName: '来源计划单号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ORI_MO_QTY',
      headerName: '来源订单数量',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'ORG_CLIENT',
      headerName: '来源客户',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'FIX_SCHEDULE_TIME',
      headerName: '固定时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      //field: 'CREATED_BY',
      field: 'CREATED_BY_NAME',
      headerName: '工单创建者',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'DILIVER_TIME',
      headerName: '工单拆分时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      //field: 'DILIVERED_BY',
      field: 'DILIVERED_BY_NAME',
      headerName: '工单拆分者',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'EXCEPTION_MESSAGE',
      headerName: '例外信息',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'CREATION_DATE',
      headerName: '工单创建时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'COMPLETED_DATE',
      headerName: '完成日期',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
  ];


  formartOAResult(params) {
    const value = params.value;
    const target = this.OAResultList.find(item => item.value === value)
    if (target) return target.label;
    return value;
  }

  ngOnInit() {
    this.loadData();
    this.columns.forEach(item => {
      if (item.field === 'OA_RESULT') {
        item.valueFormatter = this.formartOAResult.bind(this);
      }
    })
    this.query();
  }

  public getQueryParams(): any {
    return {
      // ITEM_ID_LIST: [this.i.ITEM_ID],
     dto:{ groupID2: this.i.groupID2,pageIndex:1,pageSize:10000}
    };
  }

  public loadData() {
    this.OAResultList.length = 0;
    this.commonQueryService
      .GetLookupByTypeLang('OA_RESULT_STATUS', this.appConfigService.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.OAResultList.push({
            label: element.MEANING,
            value: element.LOOKUP_CODE,
          });
        });
      });
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.editService.loadGridView(
      this.httpAction,
      this.getQueryParams(),
      this.context,
    );
  }

  confirm() {
    this.modal.close(true);
  }

  close() {
    this.modal.destroy();
  }

  // 页码切换
  onPageChanged({ pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.queryCommon();
  }
}

function formatRESOURCE_CODE(params) {
  if (params.value === 'unplan-resouce-00') {
    return '待定';
  }
  return params.value;
}
