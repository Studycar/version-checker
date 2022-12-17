/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:12
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-25 14:11:02
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { FormBuilder } from '@angular/forms';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { QueryService } from './editservice';
import { MoManagerService } from '../../../modules/generated_module/services/mo-manager-service';
import { TilesPlanscheduleMomanagerEditComponent } from './edit/edit.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { TilesPlanscheduleMomanagerOpenComponent } from './open/open.component';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';
import { MoUpdateAgComponent } from '../../planschedule/mo-update/mo-update-ag.component';
import { ActivatedRoute } from '@angular/router';
import { PlanscheduleDigitalizationWorkbenchSplitMoComponent } from '../../planschedule/digitalization-workbench/splitMo/splitMo.component';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { TilesDetailComponent } from './detail/detail.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-momanager',
  templateUrl: './momanager.component.html',
  providers: [QueryService],
})
export class PlanscheduleTilesMomanagerComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;

  context = this;
  public selectth: String;
  Privilege: string; // 用户修改权限变量
  itemtypes: any[] = [];
  makebuycodes: any[] = [];
  itemstatus: any[] = [];
  wipsupplytypes: any[] = [];
  yesnos: any[] = [];
  OAResultList: any[] = [];
  plantoptions: any[] = [];
  groupoptions: any[] = [];
  resourceoptions: any[] = [];
  numoptions: any[] = [];
  selectIndex = 1;
  PlantList: any[] = [];
  OrgPlantList: any[] = [];
  isVisible = false;
  OrgPlantCode: string;
  canShow: boolean = false;

  selectedPlantCode: string;
  // grid当前选中行
  public gridSelectRow: any;
  checkMoRows = 0;

  gridOptions2: any = Object.assign(this.gridOptions, {
    isRowSelectable: function (node) {
      //控制显示勾选框显示   checkboxSelection

      return true;
      //return node.data.modifyPrivilageFlag;
    },
  });

  // public cells: any = {
  //   border: '1px solid black',
  //   'font-family': 'Arial',
  //   textAlign: 'center',
  // };
  public changes: any = {};
  YesOrNo: any[] = [];
  typeoptions: any[] = [];
  isCheck = true;

  yesNum: number;
  noNum: number;
  updateSchedule: any[] = [];
  //gridHeight = 342;

  public queryParams = {
    defines: [
      {
        field: 'strPlantCode',
        title: '生产基地',
        ui: { type: UiType.select, options: this.plantoptions, eventNo: 1 },
      },
      // {
      //   field: 'strScheduleGroupCode',
      //   title: '车间',
      //   ui: { type: UiType.select, options: this.groupoptions, eventNo: 2 },
      // },
      {
        field: 'strResourceCode',
        title: '窑炉',
        ui: { type: UiType.select, options: this.resourceoptions },
      },
      {
        field: 'strMakeOrderNum',
        title: '工单号',
        ui: { type: UiType.textarea },
      },
      {
        field: 'strMakeOrderStatus',
        title: '工单状态',
        ui: { type: UiType.select, options: this.typeoptions },
      },
      {
        field: 'strItemCode',
        title: '生产型号',
        ui: { type: UiType.text },
        // ui: {
        //   type: UiType.popupSelect,
        //   valueField: 'itemModel',
        //   textField: 'itemModel',
        //   gridView: this.gridViewItems,
        //   columns: this.columnsItems,
        //   eventNo: 3,
        //   extraEvent: {
        //     RowSelectEventNo: 4,
        //   },
        // },
      },
      {
        field: 'stritemseries',
        title: '产品系列',
        ui: { type: UiType.textarea },
      },
      { field: 'stritemspecs', title: '规格', ui: { type: UiType.textarea } },
      // {
      //   field: 'stritemthickness',
      //   title: '厚度',
      //   ui: { type: UiType.textarea },
      // },
      // {
      //   field: 'startrange',
      //   title: '排产结束日期范围',
      //   ui: { type: UiType.dateRange },
      // },
      {
        field: 'endTime',
        title: '排产开始日期截止',
        ui: { type: UiType.date },
      },
      {
        field: 'oemOrderNum',
        title: 'OEM订单号',
        ui: { type: UiType.textarea },
      },
      // {
      //   field: 'strDerivedFlag',
      //   title: '拆分标识',
      //   ui: { type: UiType.select, options: this.YesOrNo },
      // },
    ],
    values: {
      strUserID: this.appconfig.getUserId(),
      strPlantCode: null,
      strScheduleGroupCode: '',
      strResourceCode: '',
      oemOrderNum: '',
      strMakeOrderNum: '',
      strMakeOrderStatus: '',
      strItemCode: '',
      strDerivedFlag: '',
      startrange: '',
      endTime: null,
      stritemseries: '',
      stritemspecs: '',
      stritemthickness: '',
      pageIndex: 1,
      pageSize: this.gridState.take,
      backlogFlag: '',
      strItemModel: '',
    },
  };

  GetqueryParams() {
    return {
      strUserID: this.appconfig.getUserId(),
      strPlantCode: this.queryParams.values.strPlantCode,
      //strScheduleGroupCode: this.queryParams.values.strScheduleGroupCode,
      strScheduleGroupCode: '',
      strResourceCode: this.queryParams.values.strResourceCode,
      strMakeOrderNum: this.queryParams.values.strMakeOrderNum,
      oemOrderNum: this.queryParams.values.oemOrderNum,
      strMakeOrderStatus: this.queryParams.values.strMakeOrderStatus,
      // strItemCode: this.queryParams.values.strItemCode.text,
      strDerivedFlag: this.queryParams.values.strDerivedFlag,
      // startTime: this.queryParams.values.startrange[0],
      // endTime: this.queryParams.values.startrange[1],
      endTime: this.queryParams.values.endTime,
      strItemSeries: this.queryParams.values.stritemseries,
      strItemSpecs: this.queryParams.values.stritemspecs,
      strItemThickness: this.queryParams.values.stritemthickness,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      strItemModel: this.queryParams.values.strItemCode,
      backlogFlag: this.queryParams.values.backlogFlag,
    };
  }

  constructor(
    public pro: BrandService,
    private formBuilder: FormBuilder,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    public editService: QueryService,
    private momanager: MoManagerService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private appTrans: AppTranslationService,
    private appGridStateService: AppGridStateService,
    private route: ActivatedRoute,
    private exportImportService: ExportImportService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTrans,
      msgSrv: msgSrv,
      appConfigSrv: appconfig,
    });
    this.headerNameTranslate(this.columns);
    // super.setTopMargin(209);
  }
  //#region   表格内容
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
  // {
  //   index: 4,
  //   active: false,
  //   name: '其他',
  // },
  // ];
  // hideObjs = [
  //   {
  //     tabIndex: 1,
  //     columns: [
  //       {
  //         field: 'creationDate',
  //       },
  //       {
  //         field: 'TECH_VERSION',
  //       },
  //       {
  //         field: 'MAKE_ORDER_TYPE',
  //       },
  //       {
  //         field: 'scheduleFlag',
  //       },
  //       {
  //         field: 'PROJECT_NUMBER',
  //       },
  //       {
  //         field: 'STOCK_USE_QTY',
  //       },
  //       {
  //         field: 'descriptionsCn',
  //       },
  //       {
  //         field: 'unitOfMeasure',
  //       },
  //       {
  //         field: 'DEMAND_DATE',
  //       },
  //       {
  //         field: 'ISSUED_DATE',
  //       },
  //       {
  //         field: 'ALTERNATE_BOM_DESIGNATOR',
  //       },
  //       {
  //         field: 'earliestStartTime',
  //       },
  //       {
  //         field: 'fixScheduleTime',
  //       },
  //       {
  //         field: 'FPS_TIME',
  //       },
  //       {
  //         field: 'FPC_TIME',
  //       },
  //       {
  //         field: 'LPS_TIME',
  //       },
  //       {
  //         field: 'LPC_TIME',
  //       },
  //       // {
  //       //   field: 'INSPECTION_TIME',
  //       // },
  //       {
  //         field: 'FULFILL_TIME',
  //       },
  //       {
  //         field: 'OFFSET_LEAD_TIME',
  //       },
  //       {
  //         field: 'switchTime',
  //       },
  //       {
  //         field: 'backlogFlag',
  //       },
  //       {
  //         field: 'BACKLOG_REASON',
  //       },
  //       {
  //         field: 'STANDARD_FLAG',
  //       },
  //       {
  //         field: 'BONDED_FLAG',
  //       },
  //       {
  //         field: 'COMPLETION_SUBINVENTORY',
  //       },
  //       {
  //         field: 'MOULD_CODE',
  //       },
  //       {
  //         field: 'MO_WARNNING_FLAG',
  //       },
  //       {
  //         field: 'RELEASED_DATE',
  //       },
  //       {
  //         field: 'RELEASED_BY',
  //       },
  //       {
  //         field: 'completedDate',
  //       },
  //       {
  //         field: 'CLOSED_DATE',
  //       },
  //       {
  //         field: 'CLOSED_BY',
  //       },
  //       {
  //         field: 'REQ_LINE_NUM',
  //       },
  //       {
  //         field: 'REQ_TYPE',
  //       },
  //       {
  //         field: 'CUSTOMER_NAME',
  //       },
  //       {
  //         field: 'TOP_MO_NUM',
  //       },
  //       {
  //         field: 'TOP_MO_START_DATE',
  //       },
  //       {
  //         field: 'TOP_MO_STATUS',
  //       },
  //       {
  //         field: 'PARENT_MO_NUM',
  //       },
  //       {
  //         field: 'PARENT_MO_START_DATE',
  //       },
  //       {
  //         field: 'PARENT_MO_STATUS',
  //       },
  //       {
  //         field: 'SHIPMENT_SET_NAME',
  //       },
  //       {
  //         field: 'STANDARD_KIT_STATUS',
  //       },
  //       {
  //         field: 'needPackageConsign',
  //       },
  //       {
  //         field: 'PACKAGE_CONSIGN_QTY',
  //       },
  //       {
  //         field: 'DEMAND_DATE',
  //       },
  //       // {
  //       //   field: 'INSPECTION_TIME',
  //       // },
  //       {
  //         field: 'reqNumber',
  //       },
  //       {
  //         field: 'oriMoQty',
  //       },
  //       {
  //         field: 'orgClient',
  //       },
  //       {
  //         field: 'CREATED_BY',
  //       },
  //       {
  //         field: 'diliverTime',
  //       },
  //       {
  //         field: 'DILIVERED_BY',
  //       },
  //     ],
  //   },
  // {
  //   tabIndex: 2,
  //   columns: [
  //     {
  //       field: 'plantCode',
  //     },
  //     {
  //       field: 'scheduleGroupCode',
  //     },
  //     {
  //       field: 'creationDate',
  //     },
  //     {
  //       field: 'resourceCode',
  //     },
  //     {
  //       field: 'startDate',
  //     },
  //     {
  //       field: 'finishDate',
  //     },
  //     {
  //       field: 'itemSpecs',
  //     },
  //     {
  //       field: 'itemThickness',
  //     },
  //     {
  //       field: 'itemSeries',
  //     },
  //     {
  //       field: 'itemGlaze',
  //     },
  //     {
  //       field: 'itemBody',
  //     },
  //     {
  //       field: 'COLOR_MATCH_FLAG_TEXT',
  //     },
  //     {
  //       field: 'testCode',
  //     },
  //     {
  //       field: 'testPlant',
  //     },
  //     {
  //       field: 'completeNum',
  //     },
  //     {
  //       field: 'PLAN_QTY',
  //     },
  //     {
  //       field: 'startTime',
  //     },
  //     {
  //       field: 'finishTime',
  //     },
  //     {
  //       field: 'productionDuration',
  //     },
  //     {
  //       field: 'OLD_MO_QTY',
  //     },
  //     {
  //       field: 'TECH_VERSION',
  //     },
  //     {
  //       field: 'MAKE_ORDER_TYPE',
  //     },
  //     {
  //       field: 'makeOrderStatus',
  //     },
  //     {
  //       field: 'scheduleFlag',
  //     },
  //     {
  //       field: 'PROJECT_NUMBER',
  //     },
  //     {
  //       field: 'moQty',
  //     },
  //     {
  //       field: 'STOCK_USE_QTY',
  //     },
  //     {
  //       field: 'descriptionsCn',
  //     },
  //     {
  //       field: 'unitOfMeasure',
  //     },
  //     {
  //       field: 'ISSUED_DATE',
  //     },
  //     {
  //       field: 'ALTERNATE_BOM_DESIGNATOR',
  //     },
  //     {
  //       field: 'earliestStartTime',
  //     },
  //     {
  //       field: 'fixScheduleTime',
  //     },
  //     {
  //       field: 'FPS_TIME',
  //     },
  //     {
  //       field: 'FPC_TIME',
  //     },
  //     {
  //       field: 'LPS_TIME',
  //     },
  //     {
  //       field: 'LPC_TIME',
  //     },
  //     {
  //       field: 'FULFILL_TIME',
  //     },
  //     {
  //       field: 'OFFSET_LEAD_TIME',
  //     },
  //     {
  //       field: 'switchTime',
  //     },
  //     {
  //       field: 'backlogFlag',
  //     },
  //     {
  //       field: 'BACKLOG_REASON',
  //     },
  //     {
  //       field: 'STANDARD_FLAG',
  //     },
  //     {
  //       field: 'BONDED_FLAG',
  //     },
  //     {
  //       field: 'COMPLETION_SUBINVENTORY',
  //     },
  //     {
  //       field: 'MOULD_CODE',
  //     },
  //     {
  //       field: 'MO_WARNNING_FLAG',
  //     },
  //     {
  //       field: 'exceptionMessage',
  //     },
  //     {
  //       field: 'comments',
  //     },
  //     {
  //       field: 'RELEASED_DATE',
  //     },
  //     {
  //       field: 'RELEASED_BY',
  //     },
  //     {
  //       field: 'completedDate',
  //     },
  //     {
  //       field: 'CLOSED_DATE',
  //     },
  //     {
  //       field: 'CLOSED_BY',
  //     },
  //     {
  //       field: 'REQ_LINE_NUM',
  //     },
  //     {
  //       field: 'REQ_TYPE',
  //     },
  //     {
  //       field: 'CUSTOMER_NAME',
  //     },
  //     {
  //       field: 'TOP_MO_NUM',
  //     },
  //     {
  //       field: 'TOP_MO_START_DATE',
  //     },
  //     {
  //       field: 'TOP_MO_STATUS',
  //     },
  //     {
  //       field: 'PARENT_MO_NUM',
  //     },
  //     {
  //       field: 'PARENT_MO_START_DATE',
  //     },
  //     {
  //       field: 'PARENT_MO_STATUS',
  //     },
  //     {
  //       field: 'derivedFlag',
  //     },
  //     {
  //       field: 'oriMoNumber',
  //     },
  //     {
  //       field: 'SHIPMENT_SET_NAME',
  //     },
  //     {
  //       field: 'STANDARD_KIT_STATUS',
  //     },
  //     {
  //       field: 'CREATED_BY',
  //     },
  //     {
  //       field: 'diliverTime',
  //     },
  //     {
  //       field: 'DILIVERED_BY',
  //     },
  //   ],
  // },
  // {
  //   tabIndex: 3,
  //   columns: [
  //     {
  //       field: 'plantCode',
  //     },
  //     {
  //       field: 'scheduleGroupCode',
  //     },
  //     {
  //       field: 'resourceCode',
  //     },
  //     {
  //       field: 'PACKAGE_CODE',
  //     },
  //     {
  //       field: 'itemSpecs',
  //     },
  //     {
  //       field: 'itemThickness',
  //     },
  //     {
  //       field: 'itemSeries',
  //     },
  //     {
  //       field: 'itemGlaze',
  //     },
  //     {
  //       field: 'itemBody',
  //     },
  //     {
  //       field: 'testCode',
  //     },
  //     {
  //       field: 'testPlant',
  //     },
  //     {
  //       field: 'completeNum',
  //     },
  //     {
  //       field: 'PLAN_QTY',
  //     },
  //     {
  //       field: 'OLD_MO_QTY',
  //     },
  //     {
  //       field: 'TECH_VERSION',
  //     },
  //     {
  //       field: 'MAKE_ORDER_TYPE',
  //     },
  //     {
  //       field: 'makeOrderStatus',
  //     },
  //     {
  //       field: 'scheduleFlag',
  //     },
  //     {
  //       field: 'PROJECT_NUMBER',
  //     },
  //     {
  //       field: 'moQty',
  //     },
  //     {
  //       field: 'STOCK_USE_QTY',
  //     },
  //     {
  //       field: 'descriptionsCn',
  //     },
  //     {
  //       field: 'unitOfMeasure',
  //     },
  //     {
  //       field: 'DEMAND_DATE',
  //     },
  //     {
  //       field: 'ISSUED_DATE',
  //     },
  //     {
  //       field: 'ALTERNATE_BOM_DESIGNATOR',
  //     },
  //     {
  //       field: 'earliestStartTime',
  //     },
  //     {
  //       field: 'FPS_TIME',
  //     },
  //     {
  //       field: 'FPC_TIME',
  //     },
  //     {
  //       field: 'LPS_TIME',
  //     },
  //     {
  //       field: 'LPC_TIME',
  //     },
  //     // {
  //     //   field: 'INSPECTION_TIME',
  //     // },
  //     {
  //       field: 'FULFILL_TIME',
  //     },
  //     {
  //       field: 'OFFSET_LEAD_TIME',
  //     },
  //     {
  //       field: 'switchTime',
  //     },
  //     {
  //       field: 'backlogFlag',
  //     },
  //     {
  //       field: 'BACKLOG_REASON',
  //     },
  //     {
  //       field: 'STANDARD_FLAG',
  //     },
  //     {
  //       field: 'BONDED_FLAG',
  //     },
  //     {
  //       field: 'COMPLETION_SUBINVENTORY',
  //     },
  //     {
  //       field: 'MOULD_CODE',
  //     },
  //     {
  //       field: 'MO_WARNNING_FLAG',
  //     },
  //     {
  //       field: 'exceptionMessage',
  //     },
  //     {
  //       field: 'comments',
  //     },
  //     {
  //       field: 'RELEASED_DATE',
  //     },
  //     {
  //       field: 'RELEASED_BY',
  //     },
  //     {
  //       field: 'completedDate',
  //     },
  //     {
  //       field: 'CLOSED_DATE',
  //     },
  //     {
  //       field: 'CLOSED_BY',
  //     },
  //     {
  //       field: 'REQ_LINE_NUM',
  //     },
  //     {
  //       field: 'REQ_TYPE',
  //     },
  //     {
  //       field: 'CUSTOMER_NAME',
  //     },
  //     {
  //       field: 'TOP_MO_NUM',
  //     },
  //     {
  //       field: 'TOP_MO_START_DATE',
  //     },
  //     {
  //       field: 'TOP_MO_STATUS',
  //     },
  //     {
  //       field: 'PARENT_MO_NUM',
  //     },
  //     {
  //       field: 'PARENT_MO_START_DATE',
  //     },
  //     {
  //       field: 'PARENT_MO_STATUS',
  //     },
  //     {
  //       field: 'derivedFlag',
  //     },
  //     {
  //       field: 'oriMoNumber',
  //     },
  //     {
  //       field: 'SHIPMENT_SET_NAME',
  //     },
  //     {
  //       field: 'STANDARD_KIT_STATUS',
  //     },
  //     {
  //       field: 'needPackageConsign',
  //     },
  //     {
  //       field: 'PACKAGE_CONSIGN_QTY',
  //     },
  //     {
  //       field: 'DEMAND_DATE',
  //     },
  //     // {
  //     //   field: 'INSPECTION_TIME',
  //     // },
  //     {
  //       field: 'reqNumber',
  //     },
  //     {
  //       field: 'ORG_ORDER_AMOUNT',
  //     },
  //     {
  //       field: 'orgClient',
  //     },
  //     {
  //       field: 'oriMoQty',
  //     },
  //   ],
  // },
  // {
  //   tabIndex: 4,
  //   columns: [
  //     {
  //       field: 'SHIPMENT_SET_NAME',
  //     },
  //     {
  //       field: 'resourceCode',
  //     },
  //     {
  //       field: 'TECH_VERSION',
  //     },
  //     {
  //       field: 'MAKE_ORDER_TYPE',
  //     },
  //     {
  //       field: 'makeOrderStatus',
  //     },
  //     {
  //       field: 'PROJECT_NUMBER',
  //     },
  //     {
  //       field: 'moQty',
  //     },
  //     {
  //       field: 'DEMAND_DATE',
  //     },
  //     {
  //       field: 'earliestStartTime',
  //     },
  //     {
  //       field: 'fixScheduleTime',
  //     },
  //     {
  //       field: 'scheduleFlag',
  //     },
  //     {
  //       field: 'FPS_TIME',
  //     },
  //     {
  //       field: 'FPC_TIME',
  //     },
  //     {
  //       field: 'LPS_TIME',
  //     },
  //     {
  //       field: 'LPC_TIME',
  //     },
  //     {
  //       field: 'INSPECTION_TIME',
  //     },
  //     {
  //       field: 'FULFILL_TIME',
  //     },
  //     {
  //       field: 'OFFSET_LEAD_TIME',
  //     },
  //     {
  //       field: 'switchTime',
  //     },
  //     {
  //       field: 'STANDARD_FLAG',
  //     },
  //     {
  //       field: 'BONDED_FLAG',
  //     },
  //     {
  //       field: 'COMPLETION_SUBINVENTORY',
  //     },
  //     {
  //       field: 'REMARK',
  //     },
  //     {
  //       field: 'RELEASED_DATE',
  //     },
  //     {
  //       field: 'RELEASED_BY',
  //     },
  //     {
  //       field: 'completedDate',
  //     },
  //     {
  //       field: 'CLOSED_DATE',
  //     },
  //     {
  //       field: 'CLOSED_BY',
  //     },
  //     {
  //       field: 'REQ_LINE_NUM',
  //     },
  //     {
  //       field: 'REQ_TYPE',
  //     },
  //     {
  //       field: 'CUSTOMER_NAME',
  //     },
  //     {
  //       field: 'TOP_MO_NUM',
  //     },
  //     {
  //       field: 'PARENT_MO_NUM',
  //     },
  //     {
  //       field: 'creationDate',
  //     },
  //     { field: 'STOCK_USE_QTY' },
  //     {
  //       field: 'descriptionsCn',
  //     },
  //     {
  //       field: 'unitOfMeasure',
  //     },
  //     {
  //       field: 'exceptionMessage',
  //     },
  //     {
  //       field: 'TOP_MO_START_DATE',
  //     },
  //     {
  //       field: 'TOP_MO_STATUS',
  //     },
  //     {
  //       field: 'PARENT_MO_START_DATE',
  //     },
  //     {
  //       field: 'PARENT_MO_STATUS',
  //     },
  //     {
  //       field: 'oriMoNumber',
  //     },
  //   ],
  // },
  // ];

  expColumnsOptions = [{ field: 'colorMatchFlag', options: this.YesOrNo }];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.itemtypes;
        break;
      case 2:
        options = this.makebuycodes;
        break;
      case 3:
        options = this.YesOrNo;
        break;
      case 4:
        options = this.itemstatus;
        break;
      case 5:
        options = this.wipsupplytypes;
        break;
      case 6:
        options = this.OAResultList;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 100,
      needexport: false,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1,
      cellClass: '',
      field: '',
      needexport: false,
      headerName: '',
      width: 40,
      pinned: 'left',
      lockPinned: true,
      checkboxSelection: dataItem => {
        //[gridOptions]="gridOptions2"  是否展示勾选框
        // if (dataItem.data.scheduleFlag === '否') {
           return true;
        // }
        // return false;
       // return dataItem.data.modifyPrivilageFlag;
      },
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    {
      field: 'makeOrderNum',
      headerName: '工单号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'makeOrderStatus',
      headerName: '工单状态',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'saleCompany',
      headerName: '销售公司',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'plantCode',
      headerName: '生产基地',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'scheduleGroupCode',
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
      field: 'resourceCode',
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
      field: 'itemThickness',
      headerName: '厚度',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    // {
    //   field: 'GLAZE_LINE',
    //   headerName: '釉线',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    {
      field: 'polishLine',
      headerName: '抛光线',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'itemSeries',
      headerName: '产品系列',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'itemSpecs',
      headerName: '规格',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'productGrade',
      headerName: '产品等级',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'itemModel',
      headerName: '生产型号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'customerModel',
      headerName: '销售型号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'packModel',
      headerName: '包装型号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    { field: 'descriptionsCn', headerName: '产品名称', width: 150, tooltipField: 'descriptionsCn', menuTabs: ['filterMenuTab', 'columnsMenuTab'] },
    {
      field: 'itemType',
      width: 150,
      headerName: '销售分类',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'itemAttribute1',
      width: 150,
      headerName: '产品大类',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'moQty',
      headerName: '工单数量',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'unitOfMeasure',
      headerName: '单位',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'startDate',
      headerName: '排产开始日期',
      valueFormatter: function (params) {
        if (params.data.resourceCode === 'unplan-resouce-00') {
          return '';
        }
        return params.value;
      },
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'finishDate',
      headerName: '排产结束日期',
      valueFormatter: function (params) {
        if (params.data.resourceCode === 'unplan-resouce-00') {
          return '';
        }
        return params.value;
      },
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'productionDuration',
      headerName: '生产时长（天）',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'switchTime',
      headerName: '切换时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'startTime',
      headerName: '排产开始时间',
      valueFormatter: function (params) {
        if (params.data.resourceCode === 'unplan-resouce-00') {
          return '';
        }
        return params.value;
      },
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'finishTime',
      headerName: '排产完成时间',
      valueFormatter: function (params) {
        if (params.data.resourceCode === 'unplan-resouce-00') {
          return '';
        }
        return params.value;
      },
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'processStatus',
      headerName: '工单进度',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'demandDateStr',
      headerName: '客户要求提货日期',
      width: 190,
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'itemGlaze',
      headerName: '釉料',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'testCode',
      headerName: '试制编号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'testPlant',
      headerName: '试制基地',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'itemBody',
      headerName: '坯体',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'colorMatchFlag',
      width: 150,
      headerName: '坯体是否配色',
      valueFormatter: 'ctx.optionsFind(value,3).label',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'needPackageConsign',
      headerName: '是否打托',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'palletQty',
      headerName: '打托数量',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'completeNum',
      headerName: '已入仓量',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'completeNumPercentStr',
      headerName: '入仓百分比',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'testComplete',
      headerName: '试制完成时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'prodStart',
      headerName: '实际生产开始时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'prodComplete',
      headerName: '实际生产完成时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: '',
      headerName: '打包数量',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'comments',
      headerName: '备注',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'oemOrderNum',
      headerName: 'OEM订单号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'oaResult',
      headerName: 'OEM订单流程状态',
      valueFormatter: 'ctx.optionsFind(value,6).label',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'oemPlanNum',
      headerName: 'OEM排产申请单号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    // {
    //   field: 'PLAN_QTY',
    //   headerName: '需求订单数量',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    {
      field: 'derivedFlag',
      headerName: '拆分标识',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'oriMoNumber',
      headerName: '原工单号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'oriMoQty',
      headerName: '原工单数量',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'reqNumber',
      headerName: '来源计划单号',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'reqQty',
      headerName: '来源计划单量',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'orgClient',
      headerName: '来源客户',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'fixScheduleTime',
      headerName: '固定时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      //field: 'CREATED_BY',
      field: 'createdByName',
      headerName: '工单创建者',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'diliverTime',
      headerName: '工单拆分时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      //field: 'DILIVERED_BY',
      field: 'diliveredByName',
      headerName: '工单拆分者',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'exceptionMessage',
      headerName: '例外信息',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'creationDate',
      headerName: '工单创建时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    // {
    //   field: 'PROJECT_NUMBER',
    //   headerName: '计划单号',
    //   tooltipField: 'PROJECT_NUMBER',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    {
      field: 'completedDate',
      headerName: '完成日期',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    {
      field: 'earliestStartTime',
      headerName: '最早开始时间',
      menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    },
    // {
    //   field: 'TECH_VERSION',
    //   headerName: '工艺版本',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'MAKE_ORDER_TYPE',
    //   headerName: '工单类型',
    //   tooltipField: 'MAKE_ORDER_TYPE',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'scheduleFlag',
    //   headerName: '参与排产标识',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'STOCK_USE_QTY',
    //   headerName: '库存消耗',
    //   tooltipField: 'STOCK_USE_QTY',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'descriptionsCn',
    //   headerName: '物料描述',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'ISSUED_DATE',
    //   headerName: '下达时间',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'ALTERNATE_BOM_DESIGNATOR',
    //   headerName: '替代BOM',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'earliestStartTime',
    //   headerName: '最早开始时间',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'FPS_TIME',
    //   headerName: '首件开始时间',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'LPC_TIME',
    //   headerName: '首件完成时间',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'LPS_TIME',
    //   headerName: '末件开始时间',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'LPC_TIME',
    //   headerName: '末件完成时间',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'FULFILL_TIME',
    //   headerName: '最终完成时间',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'OFFSET_LEAD_TIME',
    //   headerName: '提前量',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'backlogFlag',
    //   headerName: '尾数标识',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'BACKLOG_REASON',
    //   headerName: '尾数原因',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'STANDARD_FLAG',
    //   headerName: '标准类型',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'BONDED_FLAG',
    //   headerName: '是否保税',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'COMPLETION_SUBINVENTORY',
    //   headerName: '完工子库',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'MOULD_CODE',
    //   headerName: '模具编码',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'MO_WARNNING_FLAG',
    //   headerName: 'MO警告标识',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'RELEASED_DATE',
    //   headerName: '发放日期',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'RELEASED_BY',
    //   headerName: '发放人',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'CLOSED_DATE',
    //   headerName: '关闭日期',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'CLOSED_BY',
    //   headerName: '关闭者',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'REQ_LINE_NUM',
    //   headerName: '需求订单行号',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'REQ_TYPE',
    //   headerName: '需求订单类型',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'CUSTOMER_NAME',
    //   headerName: '客户名称',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'TOP_MO_NUM',
    //   headerName: '顶层工单',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'TOP_MO_START_DATE',
    //   headerName: '顶层工单开始时间',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'TOP_MO_STATUS',
    //   headerName: '顶层工单状态',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'PARENT_MO_NUM',
    //   headerName: '父工单',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'PARENT_MO_START_DATE',
    //   headerName: '父工单开始时间',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'PARENT_MO_STATUS',
    //   headerName: '父工单状态',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'exceptionMessage',
    //   headerName: '例外信息',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'SHIPMENT_SET_NAME',
    //   headerName: '发运集',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // {
    //   field: 'STANDARD_KIT_STATUS',
    //   headerName: '齐套状态',
    //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // },
    // // {
    // //   field: 'INSPECTION_TIME',
    // //   headerName: '在线验货日期',
    // //   menuTabs: ['filterMenuTab', 'columnsMenuTab'],
    // // },
  ];

  // tabFirstFlag = Array(this.tabs.length).fill(true);
  // stateKey = 'momanager';
  // tabSubject = new Subject<{
  //   index: number;
  //   curColDef: any[];
  //   columnApi: any;
  //   gridApi: any;
  // }>();
  // curTabColumns: any[] = [];

  // tabSelect(arg: any): void {
  //   if (arg.index == null) {
  //     this.selectIndex = 1;
  //   } else {
  //     this.selectIndex = arg.index;
  //   }

  //   /** 切换 stateKey */
  //   // const curDisabledColumns = this.hideObjs.find(
  //   //   h => h.tabIndex === this.selectIndex,
  //   // ).columns;
  //   // this.curTabColumns = this.columns.filter(
  //   //   c => !curDisabledColumns.find(cc => cc.field === c.field),
  //   // );
  //   // this.tabSubject.next({
  //   //   index: this.selectIndex,
  //   //   curColDef: this.curTabColumns,
  //   //   columnApi: this.gridColumnApi,
  //   //   gridApi: this.gridApi,
  //   // });
  // }

  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.gridData = [];
    this.loadItems();
    this.isCheck = !this.isCheck;
    this.yesNum = 0;
    this.noNum = 0;

    const showAttribute = this.route.snapshot.paramMap.get('showAttribute');
    if (showAttribute == 'normal') this.canShow = false;
    else this.canShow = true;

    this.expColumns.length = 0;
    this.columns.forEach(c => {
      if (c.needexport != false) {
        this.expColumns.push({
          field: c.field,
          width: c.width,
          title: c.headerName,
        });
      }
    });
  }

  loadItems() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode,
        });
        if (element.plantCode === this.appconfig.getPlantCode()) {
          this.queryParams.values.strPlantCode = element.plantCode;
        }
      });
    });

    // this.momanager.GetNum().subscribe(res => {
    //   res.Extra.forEach(element => {
    //     this.numoptions.push({
    //       label: element.makeOrderNum,
    //       value: element.makeOrderNum,
    //     });
    //   });
    // });

    this.commonquery
      .GetLookupByTypeLang('PS_MAKE_ORDER_STATUS', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.typeoptions.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });

    this.commonquery
      .GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.YesOrNo.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });

    this.commonquery
      .GetLookupByTypeLang('OA_RESULT_STATUS', this.appconfig.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.OAResultList.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });
    this.plantchange(this.appconfig.getPlantCode());
  }

  plantchange(value: any) {
    this.resourceoptions.length = 0;
    this.groupoptions.length = 0;
    this.queryParams.values.strScheduleGroupCode = null;
    this.queryParams.values.strResourceCode = null;
    this.momanager.GetGroup(value).subscribe(res => {
      res.data.forEach(element => {
        this.groupoptions.push({
          label: element.scheduleGroupCode,
          value: element.scheduleGroupCode,
        });
      });
      if (
        this.groupoptions.length == 1 &&
        this.groupoptions[0].value != 'undefined' &&
        this.groupoptions[0].value != undefined
      ) {
        this.queryParams.values.strScheduleGroupCode = this.groupoptions[0].value;
        this.groupchange(this.queryParams.values.strScheduleGroupCode);
      }
    });
  }

  public groupchange(value: any) {
    this.resourceoptions.length = 0;
    this.momanager
      .GetResource(this.queryParams.values.strScheduleGroupCode)
      .subscribe(res => {
        res.data.forEach(element => {
          this.resourceoptions.push({
            label: element.resourceCode,
            value: element.resourceCode,
          });
        });
        this.resourceoptions.push({ label: '待定', value: 'unplan-resouce-00' })
      });
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.editService.loadGridView(
      this.httpAction,
      this.GetqueryParams(),
      this.context,
    );
  }

  /**
   * create by jianl
   */
  public gridLoadCallback() {
    // 派生类可以做一些自己的逻辑
    this.setLoading(false);
  }

  public clear() {
    const defaultParams = {
      strUserID: this.appconfig.getUserId(),
      strPlantCode: null,
      strScheduleGroupCode: null,
      strResourceCode: null,
      oemOrderNum: null,
      strMakeOrderNum: '',
      strMakeOrderStatus: null,
      strItemCode: '',
      strDerivedFlag: null,
      startrange: '',
      endTime: null,
      stritemseries: '',
      stritemspecs: '',
      stritemthickness: '',
      pageIndex: 1,
      pageSize: this.gridState.take,
      backlogFlag: '',
      strItemModel: '',
    };
    if (
      this.plantoptions.findIndex(
        it => it.value === this.appconfig.getPlantCode(),
      ) >= 0
    ) {
      defaultParams.strPlantCode = this.appconfig.getPlantCode();
    } else {
      defaultParams.strPlantCode = null;
    }
    this.queryParams.values = defaultParams;
    this.plantchange(this.queryParams.values.strPlantCode);
  }

  public doAdd(item?: any) {
    this.modal
      .static(
        TilesPlanscheduleMomanagerEditComponent,
        {
          i: {
            id: item !== undefined ? item.id : null,
            plantCode: item ? item.plantCode : '',
          },
          readOnly: false,
        },
        'xl',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  public add(item?: any) {
    this.Privilege = 'N';
    //待排产区的工单，不做校验
    if (item.resourceCode === 'unplan-resouce-00') {
      this.doAdd(item);
      return;
    }
    this.momanager
      .GetPrivilege(
        this.appconfig.getUserId(),
        item.plantCode,
        item.scheduleGroupCode,
        item.resourceCode,
      )
      .subscribe(res => {
        console.log("权限     :"+res);
        if (res.data !== null) {
          this.Privilege = res.data;
          if (this.Privilege) {
            this.doAdd(item);
          } else {
            this.msgSrv.error(
              this.appTrans.translate(
                '当前用户没有该产线的工单修改权限，请联系管理员',
              ),
            );
          }
        } else {
          this.msgSrv.error(
            this.appTrans.translate(
              '当前用户没有该产线的工单修改权限，请联系管理员',
            ),
          );
        }
      });
  }

  public OpenLevel(item?: any) {
    this.modal
      .static(
        TilesPlanscheduleMomanagerOpenComponent,
        {
          orderid: item.makeOrderNum,
          plantCode: item.plantCode,
        },
        'lg',
      )
      .subscribe(res => {
        if (res) {
          this.query();
        }
      });
  }
  newSearchUrl = "/api/tp/tpCommon/getDate"
  // expColumns = this.columns;
  httpAction = { url: this.newSearchUrl, method: 'GET' };
  httpExportAction = { url: this.momanager.exportUrl, method: 'POST' };
  expData: any[] = [];
  // public export() {
  //   this.exportImportService.exportCompatibilityWithProgress(
  //     this.httpExportAction,
  //     this.GetqueryParams(),
  //     this.expColumns,
  //     'MakeOrderExport',
  //     this,
  //     '工单导出.xlsx',
  //     {
  //       resourceCode: [{ label: '待排产区', value: 'unplan-resouce-00' }],
  //       scheduleGroupCode: [{ label: '待排产区', value: 'unplan-group-00' }],
  //       oaResult: this.OAResultList,
  //     },
  //   );
  // }

  // 定义查询条件的时间
  startBegin: Date = null;
  startEnd: Date = null;
  endBegin: Date = null;
  endEnd: Date = null;
  // tslint:disable-next-line:no-inferrable-types
  endOpen1: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  endOpen2: boolean = false;

  // 根据开始时间，定义不可选择的时间
  disabledStartDate1 = (startBegin: Date): boolean => {
    if (!startBegin || !this.startEnd) {
      return false;
    }
    return startBegin.getTime() > this.startEnd.getTime();
  };

  disabledEndDate1 = (startEnd: Date): boolean => {
    if (!startEnd || !this.startBegin) {
      return false;
    }
    return startEnd.getTime() <= this.startBegin.getTime();
  };

  // 选择时间后，返回选择时间的回调
  onStartChange1(date: Date): void {
    this.startBegin = date;
  }
  onEndChange1(date: Date): void {
    this.startEnd = date;
  }

  showDetail(row: any) {
    this.modal.create(
      TilesDetailComponent,
      {
        i: { groupID2: row.GROUP_ID2 },
      },
    ).subscribe(res => {
      console.log('detail', res);
    })
  }

  // 行选中
  onRowSelected(event) {
    // console.log(event);
    this.setCurrentSelectedRow(event.data);
    var defaultValue = 0;
    if (event.node.data.scheduleGroupCode !== '合计') {
      if (event.node.selected === true) {
        this.checkMoRows += 1;
      } else {
        this.checkMoRows -= 1;
      }
    }
    // this.batchModifyService.selectRowData = event.data;
  }

  // 设置当前选中行
  private setCurrentSelectedRow(rowData: any) {
    if (!this.isNull(rowData)) {
      // 保存当前选中行
      this.gridSelectRow = rowData;
    }
  }

  // 参与排产
  takeSchedule() {
    this.modalService.confirm({
      nzContent: this.appTrans.translate('确定要修改吗？'),
      nzOnOk: () => {
        this.momanager.changeSchedule(this.updateSchedule).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTrans.translate('修改成功'));
            this.query();
            this.isCheck = true;
            this.noNum = 0;
            this.yesNum = 0;
            this.selectionKeys = [];
          } else {
            this.msgSrv.error(this.appTrans.translate(res.msg));
          }
        });
      },
    });
  }
  ChangePlant() {
    const selectRows = this.gridApi.getSelectedRows();
    if (selectRows == null || selectRows.length == 0) {
      this.msgSrv.info('请勾选至少一条记录');
      return;
    }

    this.PlantList.length = 0;
    this.OrgPlantCode = selectRows[0].plantCode;

    this.OrgPlantList.length = 0;
    this.OrgPlantList.push({
      value: this.OrgPlantCode,
      label: this.OrgPlantCode,
    });
    this.commonquery.GetAllPlant().subscribe(res => {
      res.data.forEach(element => {
        if (element.plantCode != this.OrgPlantCode) {
          this.PlantList.push({
            value: element.plantCode,
            label: element.descriptions,
          });
        }
      });
    });

    this.selectedPlantCode = null;
    this.isVisible = true;
  }
  // 计划单拆分
  public splitMo(dataItem: any) {
    this.modal
      .static(
        PlanscheduleDigitalizationWorkbenchSplitMoComponent,
        { dataItem: dataItem },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    if (this.selectedPlantCode == null) {
      this.msgSrv.info('新基地不能为空');
      return;
    }
    this.isVisible = false;

    this.modalService.confirm({
      nzContent: this.appTrans.translate('确定要转基地吗？'),
      nzOnOk: () => {
        this.editService
          .ExchangePlant_java(
            this.selectedPlantCode,
            this.getGridSelectionKeys('id'),
          )
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTrans.translate('转基地成功'));
              this.query();
              this.isCheck = true;
              this.noNum = 0;
              this.yesNum = 0;
              this.selectionKeys = [];
            } else {
              this.msgSrv.error(this.appTrans.translate(res.Message));
            }
          });
      },
    });

    // this.msgSrv.success(this.selectedPlantCode);
    //TODO:确认改变plantcode
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  CheckedChange(value: any) {
    value.forEach(element => {
      // if (element.scheduleFlag === '是') {
      //   this.yesNum++;
      //   this.isCheck = true;
      // } else {
      //   this.noNum++;
      //   this.updateSchedule.push(element.Id);
      //   this.isCheck = false;
      // }

      this.noNum++;
      this.updateSchedule.push(element.Id);
      this.isCheck = false;
    });

    if (this.noNum > 0) {
      this.isCheck = false;
    } else {
      this.isCheck = true;
    }
    this.noNum = 0;
    this.yesNum = 0;
  }

  selectKeys = 'scheduleFlag';
  selectKeys_2 = 'scheduleFlag';
  // 行选中改变
  onSelectionChanged(event) {
    const gridSelectRows = this.gridApi.getSelectedRows();
    this.CheckedChange(gridSelectRows);
  }
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
  // grid初始化加载
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.columns;
    // this.tabSelect({
    //   index: 1,
    //   active: true,
    //   name: '主要',
    // });
  }

  /**
   * 物料弹出查询
   * @param {any} e
   */
  // public searchItems(e: any) {
  //   // if (
  //   //   !this.queryParams.values.strPlantCode ||
  //   //   this.queryParams.values.strPlantCode === undefined
  //   // ) {
  //   //   this.msgSrv.warning(this.appTrans.translate('请先选择工厂！'));
  //   //   return;
  //   // }
  //   const PageIndex = e.Skip / e.PageSize + 1;
  //   this.queryItems(
  //     this.queryParams.values.strPlantCode,
  //     e.SearchValue,
  //     PageIndex,
  //     e.PageSize,
  //   );
  // }

  // /**
  //  * 加载物料
  //  * @param {string} plantCode 工厂代码
  //  * @param {string} ITEM_CODE  物料代码
  //  * @param {number} PageIndex  页码
  //  * @param {number} PageSize   每页条数
  //  */
  // public queryItems(
  //   plantCode: string,
  //   itemModel: string,
  //   PageIndex: number,
  //   PageSize: number,
  // ) {
  //   this.editService
  //     .GetItemModels(plantCode || '', itemModel || '', PageIndex, PageSize)
  //     .subscribe(res => {
  //       this.gridViewItems.data = res.Result;
  //       this.gridViewItems.total = res.TotalCount;
  //     });
  // }

  /**
   * 物料弹窗行选中事件
   * @param Row 选中行详细信息对象（DESCRIPTIONS_CN，ITEM_CODE，ITEM_ID，ROWINDEX，UNIT_OF_MEASURE，WIP_SUPPLY_TYPE）
   * @param Text this.queryParams.values.strItemCodeFrom.text值
   * @param Value this.queryParams.values.strItemCodeFrom.value值
   * @param sender 弹出组件实例
   */
  // rowSelect({ Row, Text, Value, sender }) {
  //   this.queryParams.values.strItemCode.text = Text;
  //   this.queryParams.values.strItemCode.value = Value;
  // }

  // 重读组件
  // readMoRequirement() {
  //   const gridSelectRows = this.gridApi.getSelectedRows();
  //   let plantCode = '';
  //   const listMos = [];
  //   // let errMo = '';
  //   gridSelectRows.forEach(d => {
  //     listMos.push(d.makeOrderNum);
  //     plantCode = d.plantCode;
  //     // if (d.makeOrderStatus !== 'S') {
  //     //   errMo += d.makeOrderNum + ',';
  //     // }
  //   });
  //   // if (errMo !== '') {
  //   //   this.msgSrv.info(this.appTrans.translate('工单[' + errMo + ']状态不是未发放，不能重读'));
  //   //   return;
  //   // }
  //   if (listMos.length === 0) {
  //     this.msgSrv.info(this.appTrans.translate('请选择要重读的工单'));
  //     return;
  //   }
  //   this.modalService.confirm({
  //     nzContent: this.appTrans.translate('确定要重读组件吗？'),
  //     nzOnOk: () => {
  //       this.editService.ReLoadMoRequirement(plantCode, listMos).subscribe(res => {
  //         if (res.Success) {
  //           this.msgSrv.success(this.appTrans.translate('重读组件成功'));
  //         } else {
  //           this.msgSrv.error(this.appTrans.translate(res.Message));
  //         }
  //       });
  //     },
  //   });
  // }

  /**更新工单最早开始时间 */
  public updateMoEarliestStartTime() {
    const gridSelectRows = this.gridApi.getSelectedRows();
    console.log('updateMoEarliestStartTime......', gridSelectRows);
    if (this.isNull(gridSelectRows) || gridSelectRows.length === 0) {
      this.msgSrv.warning(this.appTrans.translate('请选中记录'));
      return;
    }
    const moNums = gridSelectRows.map(it => it.makeOrderNum);
    console.log('updateMoEarliestStartTime......', moNums);
    this.modal
      .static(
        MoUpdateAgComponent,
        {
          i: {},
          moNumbers: moNums,
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }
}
