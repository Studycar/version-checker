import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FormBuilder } from '@angular/forms';
import { PlantMaintainService } from 'app/modules/generated_module/services/plantmaintain-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { EditService } from './queryService1';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-momanager-open',
  templateUrl: './open.component.html',
  providers: [EditService]
})
export class TilesPlanscheduleMomanagerOpenComponent extends CustomBaseContext implements OnInit {
  expandForm = false;
  public gridView: GridDataResult;
  public gridData: any[] = [];
  public pageSize = 10;
  public skip = 0;
  UserPlantOptions: any[] = []; // 组织
  lookuptype: any[] = [];
  optionListItem2: any[] = [];
  production_line_group: any;
  makeordertype: any[] = [];
  makeorderstatus: any[] = [];
  linegroupoptions: any[] = []; // 计划组绑定源
  PlantGroupLineoptions: any[] = []; // 生产线绑定源
  MOSTATUS: any[] = []; // MO状态绑定源
  standardfalgoptions: any[] = []; // 工单标准类型
  enableOptions: any[] = [];
  orderid: string;
  PLANT_CODE: string;

  itemtypes: any[] = [];
  makebuycodes: any[] = [];
  itemstatus: any[] = [];
  wipsupplytypes: any[] = [];
  yesnos: any[] = [];
  organizationids: any[] = [{ label: '  ', value: '' }];
  itemcodes: any[] = [{ label: '  ', value: '' }];
  Istrue = false;
  httpAction = { url: this.editService.queryform, method: 'GET', data: false };
  selectIndex = 1;
  public mySelection: any[] = [];
  queryParams: any = {};
  queryParamstemp: any;
  queryObj: any = {};
  selectKeys = 'MAKE_ORDER_NUM';
  constructor(
    private formBuilder: FormBuilder,
    public editService: EditService,
    private plantmaintainService: PlantMaintainService,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    public QueryService: CommonQueryService,
    private appConfigService: AppConfigService,
    private appTranslationService: AppTranslationService
  ) { super({
    appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 240;
   }
  // tabs = [
  //   {
  //     index: 1,
  //     active: true,
  //     name: '主要',
  //   },
  //   {
  //     index: 2,
  //     active: false,
  //     name: '需求',
  //   },
  //   {
  //     index: 3,
  //     active: false,
  //     name: '时间',
  //   },
  //   {
  //     index: 4,
  //     active: false,
  //     name: '其他',
  //   }
  // ];
  // hideObjs = [
  //   {
  //     tabIndex: 1,
  //     columns: [
  //       {
  //         field: 'CREATION_DATE'
  //       },
  //       {
  //         field: 'DEMAND_DATE'
  //       },
  //       {
  //         field: 'ALTERNATE_BOM_DESIGNATOR'
  //       },
  //       {
  //         field: 'EARLIEST_START_TIME'
  //       },
  //       {
  //         field: 'FIX_SCHEDULE_TIME'
  //       },
  //       {
  //         field: 'FPS_TIME'
  //       },
  //       {
  //         field: 'LPS_TIME'
  //       },
  //       {
  //         field: 'INSPECTION_TIME'
  //       },
  //       {
  //         field: 'FULFILL_TIME'
  //       },
  //       {
  //         field: 'OFFSET_LEAD_TIME'
  //       },
  //       {
  //         field: 'SWITCH_TIME'
  //       },
  //       {
  //         field: 'SCHEDULE_FLAG'
  //       },
  //       {
  //         field: 'BACKLOG_FLAG'
  //       },
  //       {
  //         field: 'BACKLOG_REASON'
  //       },
  //       {
  //         field: 'BONDED_FLAG'
  //       },
  //       {
  //         field: 'MOUDLE_CODE'
  //       },
  //       {
  //         field: 'MO_WARNNING_FLAG'
  //       },
  //       {
  //         field: 'RELEASED_DATE'
  //       },
  //       {
  //         field: 'RELEASED_BY'
  //       },
  //       {
  //         field: 'COMPLETED_DATE'
  //       },
  //       {
  //         field: 'CLOSED_DATE'
  //       },
  //       {
  //         field: 'CLOSED_BY'
  //       },
  //       {
  //         field: 'REQ_NUMBER'
  //       },
  //       {
  //         field: 'REQ_LINE_NUM'
  //       },
  //       {
  //         field: 'REQ_TYPE'
  //       },
  //       {
  //         field: 'CUSTOMER_NAME'
  //       },
  //       {
  //         field: 'DERIVED_FLAG'
  //       },
  //       {
  //         field: 'ORI_MO_NUMBER'
  //       },
  //       {
  //         field: 'ORI_MO_QTY'
  //       }
  //     ]
  //   },
  //   {
  //     tabIndex: 2,
  //     columns: [
  //       {
  //         field: 'CREATION_DATE'
  //       },
  //       {
  //         field: 'SCHEDULE_GROUP_CODE'
  //       },
  //       {
  //         field: 'RESOURCE_CODE'
  //       },
  //       {
  //         field: 'MAKE_ORDER_TYPE'
  //       },
  //       {
  //         field: 'MAKE_ORDER_STATUS'
  //       },
  //       {
  //         field: 'PROJECT_NUMBER'
  //       },
  //       {
  //         field: 'MO_QTY'
  //       },
  //       {
  //         field: 'COMPLETE_NUM'
  //       },
  //       {
  //         field: 'RESIDUE_NUM'
  //       },
  //       {
  //         field: 'DELIVERY_NUM'
  //       },
  //       {
  //         field: 'DESCRIPTIONS_CN'
  //       },
  //       {
  //         field: 'UNIT_OF_MEASURE'
  //       },
  //       {
  //         field: 'ALTERNATE_BOM_DESIGNATOR'
  //       },
  //       {
  //         field: 'EARLIEST_START_TIME'
  //       },
  //       {
  //         field: 'FIX_SCHEDULE_TIME'
  //       },
  //       {
  //         field: 'FPS_TIME'
  //       },
  //       {
  //         field: 'FPC_TIME'
  //       },
  //       {
  //         field: 'LPS_TIME'
  //       },
  //       {
  //         field: 'LPC_TIME'
  //       },
  //       {
  //         field: 'FULFILL_TIME'
  //       },
  //       {
  //         field: 'OFFSET_LEAD_TIME'
  //       },
  //       {
  //         field: 'SWITCH_TIME'
  //       },
  //       {
  //         field: 'SCHEDULE_FLAG'
  //       },
  //       {
  //         field: 'BACKLOG_FLAG'
  //       },
  //       {
  //         field: 'BACKLOG_REASON'
  //       },
  //       {
  //         field: 'STANDARD_FLAG'
  //       },
  //       {
  //         field: 'COMPLETION_SUBINVENTORY'
  //       },
  //       {
  //         field: 'MOUDLE_CODE'
  //       },
  //       {
  //         field: 'MO_WARNNING_FLAG'
  //       },
  //       {
  //         field: 'REMARK'
  //       },
  //       {
  //         field: 'RELEASED_DATE'
  //       },
  //       {
  //         field: 'RELEASED_BY'
  //       },
  //       {
  //         field: 'COMPLETED_DATE'
  //       },
  //       {
  //         field: 'CLOSED_DATE'
  //       },
  //       {
  //         field: 'CLOSED_BY'
  //       },
  //       {
  //         field: 'TOP_MO_NUM'
  //       },
  //       {
  //         field: 'TOP_MO_START_DATE'
  //       },
  //       {
  //         field: 'TOP_MO_STATUS'
  //       },
  //       {
  //         field: 'PARENT_MO_NUM'
  //       },
  //       {
  //         field: 'PARENT_MO_START_DATE'
  //       },
  //       {
  //         field: 'PARENT_MO_STATUS'
  //       },
  //       {
  //         field: 'DERIVED_FLAG'
  //       },
  //       {
  //         field: 'ORI_MO_NUMBER'
  //       },
  //       {
  //         field: 'ORI_MO_QTY'
  //       },
  //       {
  //         field: 'INSPECTION_TIME'
  //       }

  //     ]
  //   },
  //   {
  //     tabIndex: 3,
  //     columns: [
  //       {
  //         field: 'SCHEDULE_GROUP_CODE'
  //       },
  //       {
  //         field: 'RESOURCE_CODE'
  //       },
  //       {
  //         field: 'MAKE_ORDER_TYPE'
  //       },
  //       {
  //         field: 'MAKE_ORDER_STATUS'
  //       },
  //       {
  //         field: 'PROJECT_NUMBER'
  //       },
  //       {
  //         field: 'MO_QTY'
  //       },
  //       {
  //         field: 'COMPLETE_NUM'
  //       },
  //       {
  //         field: 'RESIDUE_NUM'
  //       },
  //       {
  //         field: 'DELIVERY_NUM'
  //       },
  //       {
  //         field: 'DESCRIPTIONS_CN'
  //       },
  //       {
  //         field: 'UNIT_OF_MEASURE'
  //       },
  //       {
  //         field: 'DEMAND_DATE'
  //       },
  //       {
  //         field: 'ALTERNATE_BOM_DESIGNATOR'
  //       },
  //       {
  //         field: 'EARLIEST_START_TIME'
  //       },
  //       {
  //         field: 'SCHEDULE_FLAG'
  //       },
  //       {
  //         field: 'BACKLOG_FLAG'
  //       },
  //       {
  //         field: 'BACKLOG_REASON'
  //       },
  //       {
  //         field: 'STANDARD_FLAG'
  //       },
  //       {
  //         field: 'BONDED_FLAG'
  //       },
  //       {
  //         field: 'COMPLETION_SUBINVENTORY'
  //       },
  //       {
  //         field: 'MOUDLE_CODE'
  //       },
  //       {
  //         field: 'MO_WARNNING_FLAG'
  //       },
  //       {
  //         field: 'REMARK'
  //       },
  //       {
  //         field: 'REQ_NUMBER'
  //       },
  //       {
  //         field: 'REQ_LINE_NUM'
  //       },
  //       {
  //         field: 'REQ_TYPE'
  //       },
  //       {
  //         field: 'CUSTOMER_NAME'
  //       },
  //       {
  //         field: 'TOP_MO_NUM'
  //       },
  //       {
  //         field: 'TOP_MO_START_DATE'
  //       },
  //       {
  //         field: 'TOP_MO_STATUS'
  //       },
  //       {
  //         field: 'PARENT_MO_NUM'
  //       },
  //       {
  //         field: 'PARENT_MO_START_DATE'
  //       },
  //       {
  //         field: 'PARENT_MO_STATUS'
  //       },
  //       {
  //         field: 'DERIVED_FLAG'
  //       },
  //       {
  //         field: 'ORI_MO_NUMBER'
  //       },
  //       {
  //         field: 'ORI_MO_QTY'
  //       },
  //       {
  //         field: 'EXCEPTION_MESSAGE'
  //       },
  //       {
  //         field: 'COMMENTS'
  //       }
  //     ]
  //   },
  //   {
  //     tabIndex: 4,
  //     columns: [
  //       {
  //         field: 'SCHEDULE_GROUP_CODE'
  //       },
  //       {
  //         field: 'RESOURCE_CODE'
  //       },
  //       {
  //         field: 'MAKE_ORDER_TYPE'
  //       },
  //       {
  //         field: 'MAKE_ORDER_STATUS'
  //       },
  //       {
  //         field: 'PROJECT_NUMBER'
  //       },
  //       {
  //         field: 'MO_QTY'
  //       },
  //       {
  //         field: 'DEMAND_DATE'
  //       },
  //       {
  //         field: 'RESIDUE_NUM'
  //       },
  //       {
  //         field: 'EARLIEST_START_TIME'
  //       },
  //       {
  //         field: 'FIX_SCHEDULE_TIME'
  //       },
  //       {
  //         field: 'FPS_TIME'
  //       },
  //       {
  //         field: 'FPC_TIME'
  //       },
  //       {
  //         field: 'LPS_TIME'
  //       },
  //       {
  //         field: 'LPC_TIME'
  //       },
  //       {
  //         field: 'INSPECTION_TIME'
  //       },
  //       {
  //         field: 'FULFILL_TIME'
  //       },
  //       {
  //         field: 'OFFSET_LEAD_TIME'
  //       },
  //       {
  //         field: 'SWITCH_TIME'
  //       },
  //       {
  //         field: 'STANDARD_FLAG'
  //       },
  //       {
  //         field: 'BONDED_FLAG'
  //       },
  //       {
  //         field: 'COMPLETION_SUBINVENTORY'
  //       },
  //       {
  //         field: 'REMARK'
  //       },
  //       {
  //         field: 'RELEASED_DATE'
  //       },
  //       {
  //         field: 'RELEASED_BY'
  //       },
  //       {
  //         field: 'COMPLETED_DATE'
  //       },
  //       {
  //         field: 'CLOSED_DATE'
  //       },
  //       {
  //         field: 'CLOSED_BY'
  //       },
  //       {
  //         field: 'REQ_NUMBER'
  //       },
  //       {
  //         field: 'REQ_LINE_NUM'
  //       },
  //       {
  //         field: 'REQ_TYPE'
  //       },
  //       {
  //         field: 'CUSTOMER_NAME'
  //       },
  //       {
  //         field: 'TOP_MO_NUM'
  //       },
  //       {
  //         field: 'PARENT_MO_NUM'
  //       },
  //       {
  //         field: 'CREATION_DATE'
  //       },
  //       {
  //         field: 'COMPLETE_NUM'
  //       },
  //       {
  //         field: 'DELIVERY_NUM'
  //       },
  //       {
  //         field: 'DESCRIPTIONS_CN'
  //       },
  //       {
  //         field: 'UNIT_OF_MEASURE'
  //       },
  //       {
  //         field: 'EXCEPTION_MESSAGE'
  //       },
  //       {
  //         field: 'TOP_MO_START_DATE'
  //       },
  //       {
  //         field: 'TOP_MO_STATUS'
  //       },
  //       {
  //         field: 'PARENT_MO_START_DATE'
  //       },
  //       {
  //         field: 'PARENT_MO_STATUS'
  //       },
  //       {
  //         field: 'ORI_MO_NUMBER'
  //       },
  //       {
  //         field: 'LEVEL_NUM'
  //       }
  //     ]
  //   }
  // ];
  public hiddenColumns: any[] = [];
  public optionsFind(value: any, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.makeordertype;
        break;
      case 2:
        options = this.makeorderstatus;
        break;
      case 3:
        options = this.standardfalgoptions;
        break;
      case 4:
        options = this.enableOptions;
        break;
      case 5:
        options = this.wipsupplytypes;
        break;
      case 6:
        if (value === 0 || value === '0') {
          return {
            label: '<i class="anticon anticon-plus"></i>',
            value: '<i class="anticon anticon-plus"></i>'
          };
        } else
          return {
            label: '',
          };
    }
    return options.find(x => x.value === value) || { label: value };
  }

  public columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    {
      field: 'MAKE_ORDER_NUM', headerName: '工单号'
    },
    {
      field: 'ITEM_CODE', headerName: '物料编码'
    },
    {
      field: 'DESCRIPTIONS_CN', headerName: '物料描述', tooltipField: 'DESCRIPTIONS_CN'
    },
    { field: 'CREATION_DATE', headerName: '创建时间' },
    { field: 'SCHEDULE_GROUP_CODE', headerName: '计划组' },
    {
      field: 'RESOURCE_CODE', headerName: '资源'
    },
    { field: 'MAKE_ORDER_TYPE', headerName: '工单类型', tooltipField: 'MAKE_ORDER_TYPE' },
    {
      field: 'MAKE_ORDER_STATUS', headerName: '工单状态', valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'PROJECT_NUMBER', headerName: '项目号', tooltipField: 'PROJECT_NUMBER'
    },
    {
      field: 'MO_QTY', headerName: '工单数量'
    },
    {
      field: 'COMPLETE_NUM', headerName: '完工数量'
    },
    {
      field: 'RESIDUE_NUM', headerName: '剩余数量', tooltipField: 'RESIDUE_NUM'
    },
    {
      field: 'DELIVERY_NUM', headerName: '发料数量'
    },
    {
      field: 'UNIT_OF_MEASURE', headerName: '单位'
    },
    {
      field: 'DEMAND_DATE', headerName: '需求日期'
    },
    {
      field: 'ALTERNATE_BOM_DESIGNATOR', headerName: '替代BOM'
    },
    {
      field: 'EARLIEST_START_TIME', headerName: '最早开始时间'
    },
    {
      field: 'FIX_SCHEDULE_TIME', headerName: '固定时间'
    },
    {
      field: 'FPS_TIME', headerName: '首件开始时间'
    },
    {
      field: 'FPC_TIME', headerName: '首件完成时间'
    },
    {
      field: 'LPS_TIME', headerName: '末件开始时间'
    },
    {
      field: 'LPC_TIME', headerName: '末件完成时间'
    },
    {
      field: 'INSPECTION_TIME', headerName: '验货时间'
    },
    {
      field: 'FULFILL_TIME', headerName: '最终完成时间'
    },
    {
      field: 'OFFSET_LEAD_TIME', headerName: '提前量'
    },
    {
      field: 'SWITCH_TIME', headerName: '切换时间'
    },
    {
      field: 'SCHEDULE_FLAG', headerName: '参与排产标识', valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'BACKLOG_FLAG', headerName: '尾数标识', valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'BACKLOG_REASON', headerName: '尾数原因'
    },
    {
      field: 'STANDARD_FLAG', headerName: '标准类型', valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'BONDED_FLAG', headerName: '是否保税', valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'COMPLETION_SUBINVENTORY', headerName: '完工子库'
    },
    {
      field: 'MOUDLE_CODE', headerName: '模具编码'
    },
    {
      field: 'MO_WARNNING_FLAG', headerName: 'MO警告标识', valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'EXCEPTION_MESSAGE', headerName: '例外信息'
    },
    {
      field: 'COMMENTS', headerName: '备注'
    },
    {
      field: 'RELEASED_DATE', headerName: '发放日期'
    },
    {
      field: 'RELEASED_BY', headerName: '发放人'
    },
    {
      field: 'COMPLETED_DATE', headerName: '完成日期'
    },
    {
      field: 'CLOSED_DATE', headerName: '关闭日期'
    },
    {
      field: 'CLOSED_BY', headerName: '关闭者'
    },
    {
      field: 'REQ_NUMBER', headerName: '需求订单号'
    },
    {
      field: 'REQ_LINE_NUM', headerName: '需求订单行号'
    },
    {
      field: 'REQ_TYPE', headerName: '需求订单类型'
    },
    {
      field: 'CUSTOMER_NAME', headerName: '客户名称'
    },
    {
      field: 'TOP_MO_NUM', headerName: '顶层工单'
    },
    {
      field: 'TOP_MO_START_DATE', headerName: '顶层工单开始时间'
    },
    {
      field: 'TOP_MO_STATUS', headerName: '顶层工单状态', valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'PARENT_MO_NUM', headerName: '父工单'
    },
    {
      field: 'PARENT_MO_START_DATE', headerName: '父工单开始时间'
    },
    {
      field: 'PARENT_MO_STATUS', headerName: '父工单状态', valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'DERIVED_FLAG', headerName: '拆分标识', valueFormatter: 'ctx.optionsFind(value,4).label'
    },
    {
      field: 'ORI_MO_NUMBER', headerName: '原工单号'
    },
    {
      field: 'ORI_MO_QTY', headerName: '原始MO数量'
    },
    {
      field: 'LEVEL_NUM', headerName: '跟单层级'
    }
  ];


  // tabSelect(arg: any): void {
  //   this.selectIndex = arg.index;
  //   this.hiddenColumns.length = 0;
  //   this.hideObjs.forEach(e => {
  //     if (e.tabIndex === this.selectIndex) {
  //       e.columns.forEach(i => { this.hiddenColumns.push(i.field); });
  //       this.gridColumnApi.resetColumnState();
  //       this.gridColumnApi.setColumnsVisible(this.hiddenColumns, false);
  //       return;
  //     }
  //   });
  // }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.QueryService.GetLookupByType('PS_MAKE_ORDER_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.makeordertype.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });

    /** 初始化 MO状态  下拉框*/
    this.QueryService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.MOSTATUS.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
        this.makeorderstatus.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });

    /** 初始化 工单标准类型 */
    this.QueryService.GetLookupByType('STANDARD_FALG').subscribe(result => {
      result.Extra.forEach(d => {
        this.standardfalgoptions.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });

    /** 初始化 用户权限下的快码  下拉框*/
    this.QueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      result.Extra.forEach(d => {
        this.enableOptions.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });

    this.clear();
    // this.queryFromByMo();
    this.query();
  }

  public queryFromByMo() {
    let gridData = [];
    const PAGE_INDEX = this._pageNo;
    const PAGE_SIZE = this._pageSize;
    this.editService.QueryFrom(this.PLANT_CODE, this.orderid, PAGE_INDEX, PAGE_SIZE).subscribe(res => {
      gridData = res.Result;
      // 接着修改排序让总装排第一个
      // gridData.sort(d => d.MAKE_ORDER_NUM);
      gridData.sort(d => this.compareAB(d.MAKE_ORDER_NUM, this.orderid));
      this.gridView = {
        data: gridData,
        total: res.TotalCount
      };
      res.Result.forEach(d => {
        this.mySelection.push(d.MAKE_ORDER_NUM);
      });
    });
  }
  // 判断是否相等
  public compareAB(a: string, b: string) {
    if (a === b)
      return -1;
    else
      return 1;
  }

  query() {
    super.query();
    const objParmQuery = {
      plantCode: this.PLANT_CODE,
      moNum: this.orderid,
      PAGE_INDEX: this._pageNo,
      PAGE_SIZE: this._pageSize
    };
    this.editService.loadGridView(this.httpAction, objParmQuery, this.context);
  }

  public groupChange(value: any) {
    this.loadLine();
  }

  public loadLine() {
    this.PlantGroupLineoptions = [];
    this.editService.GetUserPlantGroupLine(this.queryParams.PlantCode, this.queryParams.ProdLineGroupCode)
      .subscribe(result => {
        if (result.Extra !== undefined && result.Extra !== null) {
          result.Extra.forEach(x => {
            this.PlantGroupLineoptions.push({
              label: x.RESOURCE_CODE + '-' + x.DESCRIPTIONS,
              value: x.RESOURCE_CODE,
            });
          });
        }
      });
  }

  expColumns = [
    { field: 'MAKE_ORDER_NUM', title: '工单号', width: 200, locked: false },
    { field: 'ITEM_CODE', title: '物料编码', width: 200, locked: false },
    { field: 'DESCRIPTIONS_CN', title: '物料描述', width: 200, locked: false },
    { field: 'SCHEDULE_GROUP_CODE', title: '计划组', width: 200, locked: false },
    { field: 'CREATION_DATE', title: '创建时间', locked: false },
    { field: 'RESOURCE_CODE', title: '资源', width: 200, locked: false },
    { field: 'MAKE_ORDER_TYPE', title: '工单类型', width: 200, locked: false },
    { field: 'MAKE_ORDER_STATUS', title: '工单状态', width: 200, locked: false },
    { field: 'PROJECT_NUMBER', title: '项目号', width: 200, locked: false },
    { field: 'MO_QTY', title: '工单数量', width: 200, locked: false },
    { field: 'COMPLETE_NUM', title: '完工数量', width: 200, locked: false },
    { field: 'DELIVERY_NUM', title: '发料数量', width: 200, locked: false },
    { field: 'UNIT_OF_MEASURE', title: '单位', width: 200, locked: false },
    { field: 'DEMAND_DATE', title: '需求日期', width: 200, locked: false },
    { field: 'ALTERNATE_BOM_DESIGNATOR', title: '替代bom', width: 200, locked: false },
    { field: 'EARLIEST_START_TIME', title: '最早开始时间', width: 200, locked: false },
    { field: 'FIX_SCHEDULE_TIME', title: '固定排产时间', width: 200, locked: false },
    { field: 'FPS_TIME', title: '首件开始时间', width: 200, locked: false },
    { field: 'FPC_TIME', title: '首件完成时间', width: 200, locked: false },
    { field: 'LPS_TIME', title: '末件开始时间', width: 200, locked: false },
    { field: 'LPC_TIME', title: '末件结束时间', width: 200, locked: false },
    { field: 'INSPECTION_TIME', title: '验货时间', width: 200, locked: false },
    { field: 'FULFILL_TIME', title: '最终完成时间', width: 200, locked: false },
    { field: 'OFFSET_LEAD_TIME', title: '偏移量', width: 200, locked: false },
    { field: 'SWITCH_TIME', title: '切换时间', width: 200, locked: false },
    { field: 'SCHEDULE_FLAG', title: '参与排产标识', width: 200, locked: false },
    { field: 'BACKLOG_FLAG', title: '尾数标识', width: 200, locked: false },
    { field: 'BACKLOG_REASON', title: '尾数原因', width: 200, locked: false },
    { field: 'STANDARD_FLAG', title: '标准类型', width: 200, locked: false },
    { field: 'BONDED_FLAG', title: '是否保税', width: 200, locked: false },
    { field: 'COMPLETION_SUBINVENTORY', title: '完工子库', width: 200, locked: false },
    { field: 'MOUDLE_CODE', title: '模具编码', width: 200, locked: false },
    { field: 'MO_WARNNING_FLAG', title: 'MO警告标志', width: 200, locked: false },
    { field: 'COMMENTS', title: '备注', width: 200, locked: false },
    { field: 'RELEASED_DATE', title: '发放日期', width: 200, locked: false },
    { field: 'RELEASED_BY', title: '发放人', width: 200, locked: false },
    { field: 'COMPLETED_DATE', title: '完成日期', width: 200, locked: false },
    { field: 'CLOSED_DATE', title: '关闭日期', width: 200, locked: false },
    { field: 'CLOSED_BY', title: '关闭人', width: 200, locked: false },
    { field: 'ORDER_NUMBER', title: '需求订单号', width: 200, locked: false },
    { field: 'ORDER_LINE_NUMBER', title: '需求订单行号', width: 200, locked: false },
    { field: 'ORDER_TYPE', title: '需求订单类型', width: 200, locked: false },
    { field: 'CUSTOMER_NAME', title: '客户名称', width: 200, locked: false },
    { field: 'TOP_MO_NUM', title: '顶层工单', width: 200, locked: false },
    { field: 'TOP_MO_START_DATE', title: '顶层工单开始时间', width: 200, locked: false },
    { field: 'TOP_MO_STATUS', title: '顶层工单状态', width: 200, locked: false },
    { field: 'PARENT_MO_NUM', title: '父工单', width: 200, locked: false },
    { field: 'PARENT_MO_START_DATE', title: '父工单开始时间', width: 200, locked: false },
    { field: 'PARENT_MO_STATUS', title: '父工单状态', width: 200, locked: false },
    { field: 'DERIVED_FLAG', title: '拆分标识', width: 200, locked: false },
    { field: 'ORI_MO_NUMBER', title: '原工单号', width: 200, locked: false },
    { field: 'ORI_MO_QTY', title: '原始MO数量', width: 200, locked: false },
    { field: 'LEVEL_NUM', title: '跟单层级', width: 200, locked: false }
  ];

  expColumnsOptions: any[] = [
    { field: 'MAKE_ORDER_STATUS', options: this.makeorderstatus },
    { field: 'SCHEDULE_FLAG', options: this.enableOptions },
    { field: 'BACKLOG_FLAG', options: this.enableOptions },
    { field: 'STANDARD_FLAG', options: this.enableOptions },
    { field: 'BONDED_FLAG', options: this.enableOptions },
    { field: 'MO_WARNNING_FLAG', options: this.enableOptions },
    { field: 'TOP_MO_STATUS', options: this.makeorderstatus },
    { field: 'PARENT_MO_STATUS', options: this.makeorderstatus },
  ];

  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    const objParmQuery = {
      plantCode: this.PLANT_CODE,
      moNum: this.orderid
    };
    this.editService.exportAction({ url: this.editService.excUrlForm, method: 'POST' }, objParmQuery, this.excelexport);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
   // grid初始化加载
   public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.tabSelect({index: 1});
  }
}
