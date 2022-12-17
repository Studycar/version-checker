/*
 * @Author: WRJ
 * @contact: 王瑞杰
 * @Date: 2018-08-01 17:49:16
 * @LastEditors: zhangwh17
 * @LastEditTime: 2021-09-29 10:54:38
 * @Note: 更改物料工序弹出高度
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { MaterialmaintenanceService } from '../../../modules/generated_module/services/materialmaintenance-service';
import { zip, Subject } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { FormBuilder } from '@angular/forms';
import { PlantMaintainService } from '../../../modules/generated_module/services/plantmaintain-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { QueryService } from './query.service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ItemOperationProcessImportComponent } from './import/item-op-process-import.component';
import { ItemOperationLeadTimeImportComponent } from './import/item-op-lead-time-import.component';
import { MaterialmanagementMaterialProcessGridComponent } from '../material-process-grid/material-process-grid.component';
import { MaterialMaintenanceEnumService } from './material-maintenance-enum.service';
import { map, tap } from 'rxjs/internal/operators';
import { MyAgGridStateDirective } from '../../../modules/base_module/components/custom-aggrid-state.directive';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { ImportsModalComponent } from 'app/modules/base_module/components/imports-modal/imports-modal.component';
import { ActivatedRoute } from '@angular/router';

const GET_LOOK_UP_BY_TYPE =
  '/afs/serverbaseworkbench/workbench/getlookupbytype?type=';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-materialmaintenance',
  templateUrl: './materialmaintenance.component.html',
  providers: [QueryService],
})
export class MaterialmanagementMaterialmaintenanceComponent
  extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<
    any
  >;
  @ViewChild('excelExport', { static: true })
  excelExport: CustomExcelExportComponent;
  @ViewChild('excelLeadTimeExport', { static: true })
  excelLeadTimeExport: CustomExcelExportComponent;
  @ViewChild('excelItemProcessExport', { static: true })
  excelItemProcessExport: CustomExcelExportComponent;
  @ViewChild(MyAgGridStateDirective, { static: true }) agGridStateDirective;
  allColumns = [];

  /** 工厂下拉数据 */
  organizationIds: any[] = [];

  /** 物料类型下拉数据 */
  itemTypes: any[] = [];

  /** 物料状态下拉数据 */
  itemStatus: any[] = [];

  unitOptions: any[] = [];

  /** 物料弹出框列显示字段*/
  columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100',
    },
  ];

  /** 查询物料数据 */
  gridViewItems: GridDataResult = {
    data: [],
    total: 0,
  };

  /** 搜索框关联字段 */
  queryParams = {
    defines: [
      {
        field: 'strPlantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.organizationIds },
        eventNo: 3,
      },
      {
        field: 'strItemCodeFrom',
        title: '物料编码',
        ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 1,
          extraEvent: {
            RowSelectEventNo: 2,
          },
        },
      },
      /*{
        field: 'strItemCodeTo', title: '物料结束值', ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 2,
        },
      },*/
      {
        field: 'strDescriptionsCn',
        title: '物料描述',
        ui: { type: UiType.string },
      },
      {
        field: 'strItemType',
        title: '物料类型',
        ui: { type: UiType.select, options: this.itemTypes },
      },
      {
        field: 'strItemStatus',
        title: '物料状态',
        ui: { type: UiType.select, options: this.itemStatus },
      },
    ],
    values: {
      strPlantCode: this.appConfigService.getPlantCode(),
      strItemCodeFrom: { value: '', text: '' },
      // strItemCodeTo: { value: '', text: '' },
      strDescriptionsCn: '',
      strItemType: '',
      strItemStatus: '',
    },
  };

  /** 制造采购数据映射字段 */
  makeBuyCodes: any[] = [];

  /** 供应类型数据映射字段 */
  wipSupplyTypes: any[] = [];

  /** 是否有效数据映射字段 */
  yesNos: any[] = [];

  /** 物料导出列 */
  expColumns = [
    {
      field: 'itemCode',
      title: '物料',
      width: 110,
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: 120,
    },
    {
      field: 'unitOfMeasure',
      width: 90,
      title: '计量单位',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
    {
      field: 'itemType',
      width: 90,
      title: '物料类型',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'makeBuyCode',
      width: 90,
      title: '制造/采购',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'itemStatusCode',
      width: 120,
      title: '物料状态',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'drawingNo',
      title: '图号',
      width: 90,
    },
    {
      field: 'enableFlag',
      width: 90,
      title: '是否有效',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'buyer',
      width: 120,
      title: '采购员',
    },
    {
      field: 'CATEGORY_CODE',
      width: 120,
      title: '采购品类',
    },
    {
      field: 'planner',
      width: 120,
      title: '计划员',
    },
    // {
    //   field: 'bondedFlag',
    //   width: 120,
    //   title: '保税标识',
    // },
    // {
    //   field: 'importLocalFlag',
    //   width: 120,
    //   title: '本地/进口标识',
    // },
    {
      field: 'grossUnitWeight',
      width: 120,
      title: '单位毛重',
    },
    {
      field: 'netUnitWeight',
      width: 120,
      title: '单位净重',
    },
    {
      field: 'weightUom',
      width: 120,
      title: '重量单位',
    },
    {
      field: 'unitLength',
      width: 120,
      title: '长',
    },
    {
      field: 'unitWidth',
      width: 120,
      title: '宽',
    },
    {
      field: 'unitHeight',
      width: 120,
      title: '高',
    },
    {
      field: 'dimensionUom',
      width: 120,
      title: '维度单位',
    },
    // {
    //   field: 'unitVolume',
    //   width: 120,
    //   title: '体积',
    // },
    // {
    //   field: 'volumeUom',
    //   width: 120,
    //   title: '体积单位',
    // },
    {
      field: 'grossUnitWeight',
      width: 120,
      title: '处理提前期',
    },
    {
      field: 'preprocessingLeadTime ',
      width: 120,
      title: '前处理提前期',
    },
    {
      field: 'postprocessingLeadTime',
      width: 120,
      title: '后处理提前期',
    },
    {
      field: 'fixedDaysSupply',
      width: 120,
      title: '固定供应天数',
    },
    {
      field: 'maximumOrderQuantity',
      width: 120,
      title: '最大订货量',
    },
    {
      field: 'minimumOrderQuantity',
      width: 120,
      title: '最小订货量',
    },
    // {
    //   field: 'fixedLotMultiplie',
    //   width: 120,
    //   title: '固定批次增加',
    // },
    {
      field: 'fixedLeadTime',
      width: 120,
      title: '固定提前期',
    },
    {
      field: 'keyItemFlag',
      width: 120,
      title: '关键物料标志',
    },
    {
      field: 'deliveryMode',
      width: 120,
      title: '交货模式',
    },
    {
      field: 'inspectionRequiredFlag',
      width: 120,
      title: '需要检验标识',
    },
    {
      field: 'defaultReceivingSubinv',
      width: 120,
      title: '默认接收仓库',
    },
    // {
    //   field: 'expirationPeriod',
    //   width: 120,
    //   title: '保质天数',
    // },
    {
      field: 'attribute1',
      width: 120,
      title: 'BOM材料',
    },
    {
      field: 'attribute2',
      width: 120,
      title: '配料含量',
    },
    {
      field: 'attribute3',
      width: 120,
      title: '系数1',
    },
    {
      field: 'creationDate',
      width: 120,
      title: '创建时间',
    },
    {
      field: 'createdBy',
      width: 120,
      title: '创建人',
    },
    {
      field: 'lastUpdateDate',
      width: 120,
      title: '更新时间',
    },
    {
      field: 'lastUpdatedBy',
      width: 120,
      title: '更新人',
    },
    {
      field: 'enableLotControl',
      width: 120,
      title: '启用批次管理',
    },
    {
      field: 'wipSupplyType',
      width: 120,
      title: '供应类型',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'oldItemCode',
      width: 120,
      title: '旧物料编码',
    },
    // {
    //   field: 'shrinkageRate',
    //   width: 120,
    //   title: '装配件损耗率',
    // },
    // {
    //   field: 'ratio',
    //   width: 70,
    //   title: 'QPA',
    // },
    // {
    //   field: 'division',
    //   width: 70,
    //   title: '产品类型',
    // },
    // {
    //   field: 'singleMachine',
    //   width: 120,
    //   title: '单机编码',
    // },
    // {
    //   field: 'semiProduct',
    //   width: 120,
    //   title: '半成品编码',
    // },
    // {
    //   field: 'testNote',
    //   width: 120,
    //   title: '试条编码',
    // }
  ];

  /** 物料导出下拉 */
  expColumnsOptions = [
    { field: 'itemType', options: this.itemTypes },
    { field: 'makeBuyCode', options: this.makeBuyCodes },
    { field: 'enableFlag', options: this.yesNos },
    { field: 'itemStatusCode', options: this.itemStatus },
    { field: 'wipSupplyType', options: this.wipSupplyTypes },
  ];

  /** 物料工序导出 */
  expItemProcessColumns = [
    { field: 'plantCode', title: '工厂', width: 80 },
    { field: 'itemCode', title: '物料号', width: 100 },
    { field: 'ITEM_DESC', title: '物料描述', width: 120 },
    { field: 'PROCESS_CODE', title: '前工序编码', width: 120 },
    { field: 'PROCESS_CODE_DESC', title: '前工序描述', width: 140 },
    { field: 'NEXT_PROCESS_CODE', title: '后工序编码', width: 120 },
    { field: 'NEXT_PROCESS_CODE_DESC', title: '后工序描述', width: 140 },
    { field: 'PROCESS_SEQ', title: '顺序号', width: 100 },
    { field: 'RELATION_TYPE', title: '提前期相关性', width: 100 },
    { field: 'LEAD_TIME', title: '提前期（小时）', width: 100 },
  ];

  /** 工序提前期 */
  expLeadTimeColumns = [
    { field: 'plantCode', title: '工厂', width: 70 },
    { field: 'CATEGORY', title: '类型', width: 80 },
    { field: 'CATEGORY_VALUE', title: '物料', width: 150 },
    { field: 'UPSTREAM_PROCESS_CODE', title: '上游工序编码', width: 120 },
    { field: 'UPSTREAM_PROCESS_NAME', title: '上游工序描述', width: 120 },
    { field: 'DOWNSTREAM_PROCESS_CODE', title: '下游工序编码', width: 120 },
    { field: 'DOWNSTREAM_PROCESS_NAME', title: '下游工序描述', width: 120 },
    { field: 'RELATION_TYPE', title: '工序相关性', width: 120 },
    { field: 'LEAD_TIME', title: '提前小时', width: 100 },
    { field: 'USAGE', title: '单位用量', width: 100 },
    { field: 'enableFlag', title: '是否有效', width: 100 },
  ];

  /** 页签 */
  tabs = [
    {
      index: 1,
      active: true,
      name: '主要',
    },
    {
      index: 2,
      active: false,
      name: '物理属性',
    },
    {
      index: 3,
      active: false,
      name: '提前期',
    },
    {
      index: 4,
      active: false,
      name: '采购与接收',
    },
    {
      index: 5,
      active: false,
      name: '计划',
    },
    {
      index: 6,
      active: false,
      name: ' 库存与车间管理',
    },
    {
      index: 7,
      active: false,
      name: '其他',
    },
  ];

  /** 当前页签(tab) */
  selectIndex = 1;

  tabSubject = new Subject<{
    index: number;
    curColDef: any[];
    columnApi: any;
    gridApi: any;
  }>();

  stateKey = 'newmaterialmaintance';

  get curTabKey() {
    return 'newmaterialmaintance' + this.selectIndex;
  }

  tabFirstFlag = Array(this.tabs.length).fill(true);

  // 页签选择 & 个性化加载
  showColumns: any[] = [];

  /** 页签对应的agGrid需要隐藏的列 */
  hideObjs = [
    {
      tabIndex: 1,
      columns: [
        {
          field: 'attribute1',
        },
        {
          field: 'attribute2',
        },
        {
          field: 'attribute3',
        },
        {
          field: 'oldItemCode',
        },
        {
          field: 'buyer',
        },
        {
          field: 'planner',
        },
        // {
        //   field: 'bondedFlag',
        // },
        // {
        //   field: 'importLocalFlag',
        // },
        {
          field: 'grossUnitWeight',
        },
        {
          field: 'netUnitWeight',
        },
        {
          field: 'weightUom',
        },
        {
          field: 'unitLength',
        },
        {
          field: 'unitWidth',
        },
        {
          field: 'unitHeight',
        },
        {
          field: 'dimensionUom',
        },
        // {
        //   field: 'unitVolume',
        // },
        // {
        //   field: 'volumeUom',
        // },
        {
          field: 'grossUnitWeight',
        },
        {
          field: 'preprocessingLeadTime ',
        },
        {
          field: 'postprocessingLeadTime',
        },
        {
          field: 'fixedDaysSupply',
        },
        {
          field: 'maximumOrderQuantity',
        },
        {
          field: 'minimumOrderQuantity',
        },
        // {
        //   field: 'fixedLotMultiplie',
        // },
        {
          field: 'fixedLeadTime',
        },
        {
          field: 'keyItemFlag',
        },
        {
          field: 'deliveryMode',
        },
        {
          field: 'inspectionRequiredFlag',
        },
        {
          field: 'defaultReceivingSubinv',
        },
        // {
        //   field: 'expirationPeriod',
        // },
        {
          field: 'creationDate',
        },
        {
          field: 'createdBy',
        },
        {
          field: 'lastUpdateDate',
        },
        {
          field: 'lastUpdatedBy',
        },
        {
          field: 'enableLotControl',
        },
        {
          field: 'wipSupplyType',
        },
        // {
        //   field: 'shrinkageRate',
        // },
        // {
        //   field: 'bakeTime',
        // },
        // {
        //   field: 'debugTime',
        // },
      ],
    },
    {
      tabIndex: 2,
      columns: [
        // {
        //   field: 'ratio',
        // },
        // {
        //   field: 'division',
        // },
        // {
        //   field: 'singleMachine',
        // },
        // {
        //   field: 'semiProduct',
        // },
        // {
        //   field: 'testNote',
        // },
        {
          field: 'attribute1',
        },
        {
          field: 'attribute2',
        },
        {
          field: 'attribute3',
        },
        {
          field: 'descriptionsCn',
        },
        {
          field: 'descriptionsUs',
        },

        {
          field: 'drawingNo',
        },
        {
          field: 'oldItemCode',
        },
        {
          field: 'buyer',
        },

        {
          field: 'planner',
        },
        {
          field: 'makeBuyCode',
        },
        {
          field: 'itemStatusCode',
        },
        {
          field: 'enableFlag',
        },
        // {
        //   field: 'bondedFlag',
        // },
        // {
        //   field: 'importLocalFlag',
        // },
        {
          field: 'grossUnitWeight',
        },
        {
          field: 'preprocessingLeadTime ',
        },
        {
          field: 'postprocessingLeadTime',
        },
        {
          field: 'fixedDaysSupply',
        },
        {
          field: 'maximumOrderQuantity',
        },
        {
          field: 'minimumOrderQuantity',
        },
        // {
        //   field: 'fixedLotMultiplie',
        // },
        {
          field: 'fixedLeadTime',
        },
        {
          field: 'keyItemFlag',
        },
        {
          field: 'deliveryMode',
        },
        {
          field: 'inspectionRequiredFlag',
        },
        {
          field: 'defaultReceivingSubinv',
        },
        // {
        //   field: 'expirationPeriod',
        // },
        {
          field: 'creationDate',
        },
        {
          field: 'createdBy',
        },
        {
          field: 'lastUpdateDate',
        },
        {
          field: 'lastUpdatedBy',
        },
        {
          field: 'enableLotControl',
        },
        {
          field: 'wipSupplyType',
        },
        // {
        //   field: 'shrinkageRate',
        // },
        // {
        //   field: 'bakeTime',
        // },
        // {
        //   field: 'debugTime',
        // },
      ],
    },
    {
      tabIndex: 3,
      columns: [
        // {
        //   field: 'ratio',
        // },
        // {
        //   field: 'division',
        // },
        // {
        //   field: 'singleMachine',
        // },
        // {
        //   field: 'semiProduct',
        // },
        // {
        //   field: 'testNote',
        // },
        {
          field: 'attribute1',
        },
        {
          field: 'attribute2',
        },
        {
          field: 'attribute3',
        },
        {
          field: 'descriptionsCn',
        },
        {
          field: 'descriptionsUs',
        },

        {
          field: 'drawingNo',
        },
        {
          field: 'oldItemCode',
        },
        {
          field: 'buyer',
        },

        {
          field: 'planner',
        },
        {
          field: 'makeBuyCode',
        },
        {
          field: 'itemStatusCode',
        },
        {
          field: 'enableFlag',
        },
        // {
        //   field: 'bondedFlag',
        // },
        // {
        //   field: 'importLocalFlag',
        // },
        {
          field: 'grossUnitWeight',
        },
        {
          field: 'netUnitWeight',
        },
        {
          field: 'weightUom',
        },
        {
          field: 'unitLength',
        },
        {
          field: 'unitWidth',
        },

        {
          field: 'unitHeight',
        },
        {
          field: 'dimensionUom',
        },
        // {
        //   field: 'unitVolume',
        // },
        // {
        //   field: 'volumeUom',
        // },
        {
          field: 'fixedDaysSupply',
        },
        {
          field: 'maximumOrderQuantity',
        },
        {
          field: 'minimumOrderQuantity',
        },
        // {
        //   field: 'fixedLotMultiplie',
        // },

        {
          field: 'keyItemFlag',
        },
        {
          field: 'deliveryMode',
        },
        {
          field: 'inspectionRequiredFlag',
        },
        {
          field: 'defaultReceivingSubinv',
        },
        // {
        //   field: 'expirationPeriod',
        // },
        {
          field: 'creationDate',
        },
        {
          field: 'createdBy',
        },
        {
          field: 'lastUpdateDate',
        },
        {
          field: 'lastUpdatedBy',
        },
        {
          field: 'enableLotControl',
        },
        {
          field: 'wipSupplyType',
        },
        // {
        //   field: 'shrinkageRate',
        // },
      ],
    },
    {
      tabIndex: 4,
      columns: [
        // {
        //   field: 'ratio',
        // },
        // {
        //   field: 'division',
        // },
        // {
        //   field: 'singleMachine',
        // },
        // {
        //   field: 'semiProduct',
        // },
        // {
        //   field: 'testNote',
        // },
        {
          field: 'attribute1',
        },
        {
          field: 'attribute2',
        },
        {
          field: 'attribute3',
        },
        {
          field: 'descriptionsCn',
        },

        {
          field: 'drawingNo',
        },
        {
          field: 'oldItemCode',
        },

        {
          field: 'planner',
        },
        {
          field: 'makeBuyCode',
        },
        {
          field: 'itemStatusCode',
        },
        {
          field: 'enableFlag',
        },
        // {
        //   field: 'bondedFlag',
        // },
        // {
        //   field: 'importLocalFlag',
        // },
        {
          field: 'grossUnitWeight',
        },
        {
          field: 'netUnitWeight',
        },
        {
          field: 'weightUom',
        },
        {
          field: 'unitLength',
        },
        {
          field: 'unitWidth',
        },

        {
          field: 'unitHeight',
        },
        {
          field: 'dimensionUom',
        },
        // {
        //   field: 'unitVolume',
        // },
        // {
        //   field: 'volumeUom',
        // },
        {
          field: 'grossUnitWeight',
        },
        {
          field: 'preprocessingLeadTime ',
        },
        {
          field: 'postprocessingLeadTime',
        },
        {
          field: 'fixedDaysSupply',
        },
        {
          field: 'maximumOrderQuantity',
        },
        {
          field: 'minimumOrderQuantity',
        },
        // {
        //   field: 'fixedLotMultiplie',
        // },
        {
          field: 'fixedLeadTime',
        },
        {
          field: 'keyItemFlag',
        },
        // {
        //   field: 'expirationPeriod',
        // },
        {
          field: 'creationDate',
        },
        {
          field: 'createdBy',
        },
        {
          field: 'lastUpdateDate',
        },
        {
          field: 'lastUpdatedBy',
        },
        {
          field: 'enableLotControl',
        },
        {
          field: 'wipSupplyType',
        },
        // {
        //   field: 'shrinkageRate',
        // },
        // {
        //   field: 'bakeTime',
        // },
        // {
        //   field: 'debugTime',
        // },
      ],
    },
    {
      tabIndex: 5,
      columns: [
        // {
        //   field: 'ratio',
        // },
        // {
        //   field: 'division',
        // },
        // {
        //   field: 'singleMachine',
        // },
        // {
        //   field: 'semiProduct',
        // },
        // {
        //   field: 'testNote',
        // },
        {
          field: 'attribute1',
        },
        {
          field: 'attribute2',
        },
        {
          field: 'attribute3',
        },
        {
          field: 'descriptionsCn',
        },
        {
          field: 'descriptionsUs',
        },

        {
          field: 'drawingNo',
        },
        {
          field: 'oldItemCode',
        },

        {
          field: 'buyer',
        },

        {
          field: 'makeBuyCode',
        },
        {
          field: 'itemStatusCode',
        },
        {
          field: 'enableFlag',
        },
        // {
        //   field: 'bondedFlag',
        // },
        // {
        //   field: 'importLocalFlag',
        // },
        {
          field: 'grossUnitWeight',
        },
        {
          field: 'netUnitWeight',
        },
        {
          field: 'weightUom',
        },
        {
          field: 'unitLength',
        },
        {
          field: 'unitWidth',
        },

        {
          field: 'unitHeight',
        },
        {
          field: 'dimensionUom',
        },
        // {
        //   field: 'unitVolume',
        // },
        // {
        //   field: 'volumeUom',
        // },
        {
          field: 'grossUnitWeight',
        },
        {
          field: 'preprocessingLeadTime ',
        },
        {
          field: 'postprocessingLeadTime',
        },

        {
          field: 'fixedLeadTime',
        },
        {
          field: 'deliveryMode',
        },
        {
          field: 'inspectionRequiredFlag',
        },
        {
          field: 'defaultReceivingSubinv',
        },
        // {
        //   field: 'expirationPeriod',
        // },
        {
          field: 'creationDate',
        },
        {
          field: 'createdBy',
        },
        {
          field: 'lastUpdateDate',
        },
        {
          field: 'lastUpdatedBy',
        },
        {
          field: 'enableLotControl',
        },
        {
          field: 'wipSupplyType',
        },
        // {
        //   field: 'bakeTime',
        // },
        // {
        //   field: 'debugTime',
        // },
      ],
    },
    {
      tabIndex: 6,
      columns: [
        // {
        //   field: 'ratio',
        // },
        // {
        //   field: 'division',
        // },
        // {
        //   field: 'singleMachine',
        // },
        // {
        //   field: 'semiProduct',
        // },
        // {
        //   field: 'testNote',
        // },
        {
          field: 'attribute1',
        },
        {
          field: 'attribute2',
        },
        {
          field: 'attribute3',
        },
        {
          field: 'descriptionsCn',
        },
        {
          field: 'descriptionsUs',
        },

        {
          field: 'drawingNo',
        },
        {
          field: 'oldItemCode',
        },

        {
          field: 'buyer',
        },

        {
          field: 'planner',
        },
        {
          field: 'makeBuyCode',
        },
        {
          field: 'itemStatusCode',
        },
        {
          field: 'enableFlag',
        },
        // {
        //   field: 'bondedFlag',
        // },
        // {
        //   field: 'importLocalFlag',
        // },
        {
          field: 'grossUnitWeight',
        },
        {
          field: 'netUnitWeight',
        },
        {
          field: 'weightUom',
        },
        {
          field: 'unitLength',
        },
        {
          field: 'unitWidth',
        },

        {
          field: 'unitHeight',
        },
        {
          field: 'dimensionUom',
        },
        // {
        //   field: 'unitVolume',
        // },
        // {
        //   field: 'volumeUom',
        // },
        {
          field: 'grossUnitWeight',
        },
        {
          field: 'preprocessingLeadTime ',
        },
        {
          field: 'postprocessingLeadTime',
        },
        {
          field: 'fixedDaysSupply',
        },
        {
          field: 'maximumOrderQuantity',
        },
        {
          field: 'minimumOrderQuantity',
        },
        // {
        //   field: 'fixedLotMultiplie',
        // },
        {
          field: 'fixedLeadTime',
        },
        {
          field: 'keyItemFlag',
        },
        {
          field: 'deliveryMode',
        },
        {
          field: 'inspectionRequiredFlag',
        },
        {
          field: 'defaultReceivingSubinv',
        },
        // {
        //   field: 'expirationPeriod',
        // },
        {
          field: 'creationDate',
        },
        {
          field: 'createdBy',
        },
        {
          field: 'lastUpdateDate',
        },
        {
          field: 'lastUpdatedBy',
        },
        // {
        //   field: 'shrinkageRate',
        // },
        // {
        //   field: 'bakeTime',
        // },
        // {
        //   field: 'debugTime',
        // },
      ],
    },
    {
      tabIndex: 7,
      columns: [
        // {
        //   field: 'ratio',
        // },
        // {
        //   field: 'division',
        // },
        // {
        //   field: 'singleMachine',
        // },
        // {
        //   field: 'semiProduct',
        // },
        // {
        //   field: 'testNote',
        // },
        {
          field: 'descriptionsCn',
        },
        {
          field: 'descriptionsUs',
        },

        {
          field: 'drawingNo',
        },
        {
          field: 'oldItemCode',
        },

        {
          field: 'buyer',
        },

        {
          field: 'planner',
        },
        {
          field: 'makeBuyCode',
        },
        {
          field: 'itemStatusCode',
        },
        {
          field: 'enableFlag',
        },
        {
          field: 'grossUnitWeight',
        },
        {
          field: 'netUnitWeight',
        },
        {
          field: 'weightUom',
        },
        {
          field: 'unitLength',
        },
        {
          field: 'unitWidth',
        },

        {
          field: 'unitHeight',
        },
        {
          field: 'dimensionUom',
        },
        // {
        //   field: 'unitVolume',
        // },
        // {
        //   field: 'volumeUom',
        // },
        {
          field: 'grossUnitWeight',
        },
        {
          field: 'preprocessingLeadTime ',
        },
        {
          field: 'postprocessingLeadTime',
        },
        {
          field: 'fixedDaysSupply',
        },
        {
          field: 'maximumOrderQuantity',
        },
        {
          field: 'minimumOrderQuantity',
        },
        // {
        //   field: 'fixedLotMultiplie',
        // },
        {
          field: 'fixedLeadTime',
        },
        {
          field: 'keyItemFlag',
        },
        {
          field: 'deliveryMode',
        },
        {
          field: 'inspectionRequiredFlag',
        },
        {
          field: 'defaultReceivingSubinv',
        },
        {
          field: 'enableLotControl',
        },
        {
          field: 'wipSupplyType',
        },
        // {
        //   field: 'shrinkageRate',
        // },
        // {
        //   field: 'bakeTime',
        // },
        // {
        //   field: 'debugTime',
        // },
      ],
    },
  ];

  /***/
  hiddenColumns = [];

  /** 页码 */
  lastPageNo = this._pageNo;

  /** 每页显示条数 */
  lastPageSize = this._pageSize;

  curTabColumns = [];

  constructor(
    private formBuilder: FormBuilder,
    private materialMaintenanceEnumService: MaterialMaintenanceEnumService,
    private plantMaintainService: PlantMaintainService,
    private materialMaintenanceService: MaterialmaintenanceService,
    private commonQueryService: CommonQueryService,
    private modalService: NzModalService,
    public pro: BrandService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private exportImportService: ExportImportService,
    private route: ActivatedRoute
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    /** 列头国际化i18n */
    this.headerNameTranslate(this.columns);
    super.setTopMargin(209);
  }

  public ngOnInit(): void {
    /** agGrid列 */
    this.allColumns = [
      {
        colId: 0,
        field: '',
        headerName: '操作',
        width: 80,
        pinned: this.pinnedAlign,
        lockPinned: true,
        headerComponentParams: {
          template: this.headerTemplate,
        },
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate,
        },
        suppressSizeToFit: true,
      },
      {
        field: 'itemCode',
        headerName: '物料编码',
        width: 150,
        locked: true,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'descriptionsCn',
        headerName: '物料描述',
        width: 200,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'itemType',
        width: 110,
        headerName: '物料类型',
        valueFormatter: 'ctx.optionsFind(value,1).label',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'unitOfMeasure',
        width: 110,
        headerName: '计量单位',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'makeBuyCode',
        width: 110,
        headerName: '制造/采购',
        valueFormatter: 'ctx.optionsFind(value,2).label',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'itemStatusCode',
        width: 120,
        headerName: '物料状态',
        valueFormatter: 'ctx.optionsFind(value,4).label',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'drawingNo',
        headerName: '图号',
        width: 90,
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'enableFlag',
        width: 110,
        headerName: '是否有效',
        valueFormatter: 'ctx.optionsFind(value,3).label',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'buyer',
        width: 120,
        headerName: '采购员',
        menuTabs: ['filterMenuTab'],
      },

      {
        field: 'planner',
        width: 120,
        headerName: '计划员',
        menuTabs: ['filterMenuTab'],
      },
      // {
      //   field: 'bondedFlag',
      //   width: 120,
      //   headerName: '保税标识',
      //   menuTabs: ['filterMenuTab'],
      // },
      // {
      //   field: 'importLocalFlag',
      //   width: 150,
      //   headerName: '本地/进口标识',
      //   menuTabs: ['filterMenuTab'],
      // },
      {
        field: 'grossUnitWeight',
        width: 120,
        headerName: '单位毛重',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'netUnitWeight',
        width: 120,
        headerName: '单位净重',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'weightUom',
        width: 120,
        headerName: '重量单位',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'unitLength',
        width: 120,
        headerName: '长',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'unitWidth',
        width: 120,
        headerName: '宽',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'unitHeight',
        width: 120,
        headerName: '高',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'dimensionUom',
        width: 120,
        headerName: '维度单位',
        menuTabs: ['filterMenuTab'],
      },
      // {
      //   field: 'unitVolume',
      //   width: 120,
      //   headerName: '体积',
      //   menuTabs: ['filterMenuTab'],
      // },
      // {
      //   field: 'volumeUom',
      //   width: 120,
      //   headerName: '体积单位',
      //   menuTabs: ['filterMenuTab'],
      // },
      {
        field: 'grossUnitWeight',
        width: 120,
        headerName: '处理提前期',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'preprocessingLeadTime ',
        width: 120,
        headerName: '前处理提前期',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'postprocessingLeadTime',
        width: 120,
        headerName: '后处理提前期',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'fixedDaysSupply',
        width: 120,
        headerName: '固定供应天数',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'maximumOrderQuantity',
        width: 120,
        headerName: '最大订货量',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'minimumOrderQuantity',
        width: 120,
        headerName: '最小订货量',
        menuTabs: ['filterMenuTab'],
      },
      // {
      //   field: 'fixedLotMultiplie',
      //   width: 120,
      //   headerName: '固定批次增加',
      //   menuTabs: ['filterMenuTab'],
      // },
      {
        field: 'fixedLeadTime',
        width: 120,
        headerName: '固定提前期',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'keyItemFlag',
        width: 120,
        headerName: '关键物料标志',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'deliveryMode',
        width: 120,
        headerName: '交货模式',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'inspectionRequiredFlag',
        width: 120,
        headerName: '需要检验标识',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'defaultReceivingSubinv',
        width: 120,
        headerName: '默认接收仓库',
        menuTabs: ['filterMenuTab'],
      },
      // {
      //   field: 'expirationPeriod',
      //   width: 120,
      //   headerName: '保质天数',
      //   menuTabs: ['filterMenuTab'],
      // },
      {
        field: 'attribute1',
        width: 120,
        headerName: 'BOM材料',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'attribute2',
        width: 120,
        headerName: '配料含量',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'attribute3',
        width: 120,
        headerName: '系数1',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'creationDate',
        width: 120,
        headerName: '创建时间',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'createdBy',
        width: 120,
        headerName: '创建人',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'lastUpdateDate',
        width: 120,
        headerName: '更新时间',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'lastUpdatedBy',
        width: 120,
        headerName: '更新人',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'enableLotControl',
        width: 120,
        headerName: '启用批次管理',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'wipSupplyType',
        width: 120,
        headerName: '供应类型',
        valueFormatter: 'ctx.optionsFind(value,5).label',
        menuTabs: ['filterMenuTab'],
      },
      {
        field: 'oldItemCode',
        width: 120,
        headerName: '旧物料编码',
        menuTabs: ['filterMenuTab'],
      },
      // {
      //   field: 'shrinkageRate',
      //   width: 120,
      //   headerName: '装配件损耗率',
      //   menuTabs: ['filterMenuTab'],
      // },
      // {
      //   field: 'bakeTime',
      //   width: 150,
      //   headerName: '原材料烘料时间',
      //   menuTabs: ['filterMenuTab'],
      // },
      // {
      //   field: 'debugTime',
      //   width: 120,
      //   headerName: '调试时间',
      //   menuTabs: ['filterMenuTab'],
      // },
      // {
      //   field: 'ratio',
      //   width: 70,
      //   headerName: 'QPA',
      //   menuTabs: ['filterMenuTab'],
      // },
      // {
      //   field: 'division',
      //   width: 70,
      //   headerName: '产品类型',
      //   menuTabs: ['filterMenuTab'],
      // },
      // {
      //   field: 'singleMachine',
      //   width: 120,
      //   headerName: '单机编码',
      //   menuTabs: ['filterMenuTab'],
      // },
      // {
      //   field: 'semiProduct',
      //   width: 120,
      //   headerName: '半成品编码',
      //   menuTabs: ['filterMenuTab'],
      // },
      // {
      //   field: 'testNote',
      //   width: 120,
      //   headerName: '试条编码',
      //   menuTabs: ['filterMenuTab'],
      // },
    ];
    this.loadOptions();

    const showAttribute = this.route.snapshot.paramMap.get('showAttribute');
    // attribute属性只在8001显示，8002不显示(默认显示)
    if (!this.isNull(showAttribute) || showAttribute === 'N') {
      const removeColumns = ['attribute1', 'attribute2', 'attribute3'];
      this.allColumns = this.allColumns.filter(t => removeColumns.findIndex(r => r === t.field) === -1);
      this.expColumns = this.expColumns.filter(t => removeColumns.findIndex(r => r === t.field) === -1);
    }
  }

  tabSelect(arg: any): void {
    if (arg.index == null) {
      this.selectIndex = 1;
    } else {
      this.selectIndex = arg.index;
    }

    /** 切换 stateKey */
    const curDisabledColumns = this.hideObjs.find(
      h => h.tabIndex === this.selectIndex,
    ).columns;
    this.curTabColumns = this.allColumns.filter(
      c => !curDisabledColumns.find(cc => cc.field === c.field),
    );
    this.tabSubject.next({
      index: this.selectIndex,
      curColDef: this.curTabColumns,
      columnApi: this.gridColumnApi,
      gridApi: this.gridApi,
    });
    this.gridApi.redrawRows();
    this.initGridWidth();
  }

  showloading() {
    this.gridApi.showLoadingOverlay();
  }

  /**
   * 数据映射字段匹配
   * @param {string} value 字段的值
   * @param {number} optionsIndex 对应字典
   * */
  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.itemTypes;
        break;
      case 2:
        options = this.makeBuyCodes;
        break;
      case 3:
        options = this.yesNos;
        break;
      case 4:
        options = this.itemStatus;
        break;
      case 5:
        options = this.wipSupplyTypes;
        break;
      case 6:
        options = this.unitOptions;
        break;
    }
    return options.find(x => x.value === value.toString());
  }

  /**
   * 返回查询参数
   * @return {any}
   */
  getQueryParamsValue(): any {
    return {
      plantCode: this.queryParams.values.strPlantCode || null,
      itemCode: this.queryParams.values.strItemCodeFrom.text || null,
      // ItemCodeTo: this.queryParams.values.strItemCodeTo.text || null,
      itemType: this.queryParams.values.strItemType || null,
      itemStatus: this.queryParams.values.strItemStatus || null,
      descriptionsCn: this.queryParams.values.strDescriptionsCn,
      categorySetCode: '库存分类',
      itemCategory: '',
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  /**
   * 加载查询下拉选项和数据映射字典
   * */
  private loadOptions() {
    /** 当前用户对应工厂 */
    this.queryParams.values.strPlantCode = this.appConfigService.getPlantCode();

    /** 初始化下拉框和gird数据字段 */
    zip(
      this.materialMaintenanceEnumService.getOrganizationIds(),
      this.materialMaintenanceEnumService.getMakeBuyCodes(),
      this.materialMaintenanceEnumService.getItemTypes(),
      this.materialMaintenanceEnumService.getItemStatus(),
      this.materialMaintenanceEnumService.getYesNos(),
      this.materialMaintenanceEnumService.getWipSupplyTypes(),
      this.materialMaintenanceEnumService.getUnitOptions(),
    )
      .pipe(
        tap(([r1, r2, r3, r4, r5, r6, r7]) => {
          this.organizationIds.length = 0;
          this.makeBuyCodes.length = 0;
          this.itemTypes.length = 0;
          this.itemStatus.length = 0;
          this.yesNos.length = 0;
          this.wipSupplyTypes.length = 0;
          this.unitOptions.length = 0;

          this.organizationIds.push(...r1);
          this.makeBuyCodes.push(...r2);
          this.itemTypes.push(...r3);
          this.itemStatus.push(...r4);
          this.yesNos.push(...r5);
          this.wipSupplyTypes.push(...r6);
          this.unitOptions.push(...r7);
        }),
      )
      .subscribe(() => this.query());
  }

  query() {
    super.query();
    this.queryCommon();
  }

  /**
   * 获取agGrid及页码数据
   */
  private queryCommon() {
    const queryValues = this.getQueryParamsValue();
    // queryValues.pageIndex = this._pageNo;
    // queryValues.pageSize = this._pageSize;
    this.commonQueryService.loadGridViewNew(
      { url: this.materialMaintenanceService.seachUrl, method: 'GET' },
      queryValues,
      this.context,
    );
  }

  /**
   * 物料弹出查询
   * 起始与结束公用一个
   * @param {any} e
   */
  public searchItems(e: any) {
    if (
      !this.queryParams.values.strPlantCode ||
      this.queryParams.values.strPlantCode === undefined
    ) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请先选择工厂！'),
      );
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.queryParams.values.strPlantCode,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载物料
   * @param {string} plantCode 工厂代码
   * @param {string} itemCode  物料代码
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
  public loadItems(
    plantCode: string,
    itemCode: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.commonQueryService
      .getUserPlantItemPageList(
        plantCode || '',
        itemCode || '',
        '',
        PageIndex,
        PageSize,
        ''
      )
      .subscribe(res => {
        this.gridViewItems.data = res.data.content;
        this.gridViewItems.total = res.data.totalElements;
      });
  }

  /**
   * 物料弹窗行选中事件
   * @param Row 选中行详细信息对象（DESCRIPTIONS_CN，ITEM_CODE，ITEM_ID，ROWINDEX，UNIT_OF_MEASURE，WIP_SUPPLY_TYPE）
   * @param Text this.queryParams.values.strItemCodeFrom.text值
   * @param Value this.queryParams.values.strItemCodeFrom.value值
   * @param sender 弹出组件实例
   */
  rowSelect({ Row, Text, Value, sender }) {
    this.queryParams.values.strItemCodeFrom.text = Text;
    this.queryParams.values.strItemCodeFrom.value = Value;
  }

  /**
   * 初始化查询参数
   */
  public clear() {
    this.queryParams.values = {
      strPlantCode: this.appConfigService.getPlantCode(),
      strItemCodeFrom: { value: '', text: '' },
      // strItemCodeTo: { value: '', text: '' },
      strDescriptionsCn: '',
      strItemType: null,
      strItemStatus: null,
    };
  }

  /**
   * 当工厂切换初始化物料
   * @param {string} event
   * @constructor
   */
  public ClearItemCodes(event: string) {
    this.queryParams.values.strItemCodeFrom.text = '';
    this.queryParams.values.strItemCodeFrom.value = '';
    // this.queryParams.values.strItemCodeTo.text = '';
    // this.queryParams.values.strItemCodeTo.value = '';
  }

  /**
   * 物料导出
   */
   public export() {
    // super.export();
    const queryValues = this.getQueryParamsValue();
    this.commonQueryService.exportEasyPoi(this.materialMaintenanceService.NewExportUrl, queryValues, this);
  }
  // public export() {
    // super.export();
    // const queryValues = this.getQueryParamsValue();
    // this.commonQueryService.exportAction(
    //   {
    //     url: this.materialMaintenanceService.ExportUrl,
    //     method: 'POST',
    //   },
    //   queryValues,
    //   this.excelExport,
    //   this.context,
    // );
    // jianl，改用新的导出方式
    // this.exportImportService.exportCompatibilityWithProgress(
    //   {
    //     url: '/api/ps/psItem/pageItem',
    //     method: 'GET',
    //   },
    //   queryValues,
    //   this.expColumns,
    //   'MaterialExport',
    //   this,
    //   '物料导出.xlsx'
    // );
    
  // }

  /**
   * 页码切换
   * @param {any} pageNo
   * @param {any} pageSize
   */
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

  /**
   * grid初始化加载
   * @param params aggrid回调参数
   */
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.tabSelect({ index: 1 });
  }

  /**
   * 提前期导入
   */
  leadTimeImport() {
    this.modal
      .static(ItemOperationLeadTimeImportComponent, {}, 'md')
      .subscribe();
  }

  /**
   * 提前期导出
   */
  leadTimeExport() {
    super.export();
    const params = {
      plantCode: this.queryParams.values.strPlantCode,
      CATEGORY: '',
      CATEGORY_FROM: this.queryParams.values.strItemCodeFrom.text,
      // CATEGORY_END: this.queryParams.values.strItemCodeTo.text,
    };

    // this.commonQueryService.export(
    //   {
    //     url: '/afs/serverpsoperationleadtime/OperationLeadTime/GetData',
    //     method: 'GET',
    //   },
    //   params,
    //   this.excelLeadTimeExport,
    //   this,
    // );

    this.commonQueryService.export(
      {
        url: '/api/ps//psOperationLeadTime/getData',
        method: 'GET',
      },
      params,
      this.excelLeadTimeExport,
      this,
    );
  }

  /**
   * 工序导入
   */
  itemProcessImport() {
    this.modal
      .static(ItemOperationProcessImportComponent, {}, 'md')
      .subscribe();
  }

  /**
   * 工序导出
   */
  itemProcessExport() {
    super.export();
    const params = {
      plantCode: this.queryParams.values.strPlantCode,
      itemCodeFrom: this.queryParams.values.strItemCodeFrom.text,
      // itemCodeTo: this.queryParams.values.strItemCodeTo.text,
    };

    this.commonQueryService.exportAction(
      {
        url: '/afs/serverpsmaterialprocess/psmaterialprocess/queryExport',
        method: 'GET',
      },
      params,
      this.excelItemProcessExport,
      this,
    );
  }

  /**
   * aggrid模板事件
   * 物料工序
   * @param dataItem
   */
  process(dataItem: any) {
    this.modal
      .static(
        MaterialmanagementMaterialProcessGridComponent,
        {
          plantCode: dataItem.plantCode,
          itemCode: dataItem.itemCode,
          itemId: dataItem.itemId,
          height: 350,
        },
        850,
        400,
      )
      .subscribe(value => { });
  }

  /**
   * 物料导入
   */
  itemImport() {
    // this.exportImportService.import('ITEM_IMPORT').subscribe(result => {
    //   if (result) {
    //     this.query();
    //   }
    // });
  }
}
