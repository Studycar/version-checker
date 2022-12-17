import { MixedResourceIssuedPlanOrderComponent } from './plan-order/plan-order.component';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { MixedResourceIssuedResourceIssuedEditService } from './edit.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { MixedResourceIssuedSearchRequestComponent } from './search-request/search-request.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ActivatedRoute } from '@angular/router';

// import 'ag-grid-enterprise';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'resource-issued-platform-ag',
  templateUrl: './resource-issued-platform-ag.component.html',
  // styleUrls: ['./resource-issued-platform.component.css'],
  providers: [MixedResourceIssuedResourceIssuedEditService],
})
export class MixedResourceIssuedResourceIssuedPlatformAgComponent
  extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;
  @ViewChild('customTemplate2', { static: true }) customTemplate2: TemplateRef<any>;
  @ViewChild('customTemplate3', { static: true }) customTemplate3: TemplateRef<any>;
  @ViewChild('customTemplate4', { static: true }) customTemplate4: TemplateRef<any>;
  @ViewChild('customTemplate5', { static: true }) customTemplate5: TemplateRef<any>;

  params: any = {};
  i: any = {};
  markOrderList = '';
  assMarkOrderList = '';
  isExpand = false; // 展开
  ImgSrc = '全部收缩'; // 全部展开样式

  // grid 修改的列
  updatedItems: any[] = [];
  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['工艺版本', '资源', '备注'];
  applicationYesNo: any[] = [];

  visible;

  closePopUp() {
    this.visible = false;
    setTimeout(() => {
      this.visible = undefined;
    });
  }

  columns = [
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
        customTemplate: this.customTemplate4,
      },
    },
    {
      colId: 1,
      cellClass: '',
      field: 'check',
      headerName: '',
      width: 40,
      pinned: 'left',
      lockPinned: true,
      checkboxSelection: dataItem => {
        // console.log('kkkkkkkkkkkkkkkkkk' + dataItem.data );

        return this.canChecked(dataItem.data);
      },
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    // { field: 'MAKE_ORDER_NUM', headerName: '生产工单号', tooltipField: 'MAKE_ORDER_NUM', width: 150, pinned: 'left', lockPinned: true },
    {
      headerName: '工单状态',
      field: 'makeOrderStatus',
      tooltipField: 'makeOrderStatus',
      width: 120,
      valueFormatter: 'ctx.optionsFind(value,1).label',
      cellStyle: function(params) {
        return { 'background-color': params.data.makeOrderColor };
      },
      menuTabs: ['filterMenuTab'],
    },

    {
      field: 'plantCode',
      headerName: '工厂',
      tooltipField: 'plantCode',
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '项目号',
      field: 'projectNumber',
      tooltipField: 'projectNumber',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    // { field: 'BRAND', headerName: '品牌', width: 80, valueFormatter: 'ctx.optionsBrandFind(value).label' },
    // { headerName: '材质', field: 'MATERIAL', width: 80 },
    // { headerName: '一级品类', field: 'FIRST_CATEGORY', width: 100 },
    // { headerName: '二级品类', field: 'SECOND_CATEGORY', width: 100 },
    {
      headerName: '需求类型',
      field: 'reqType',
      width: 100,
      valueFormatter: 'ctx.optionsReqTypeFind(value).label',
      menuTabs: ['filterMenuTab'],
    },
    // { headerName: '生产产品经理', field: 'PD_PRODUCT_MANAGER', width: 120 },

    {
      headerName: '物料编码',
      field: 'itemCode',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '物料描述',
      field: 'descriptions',
      tooltipField: 'descriptions',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '物料状态',
      field: 'itemStatusCode',
      width: 100,
      valueFormatter: 'ctx.optionsItemFind(value).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '系数',
      field: 'attribute3',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    // { headerName: '采购工单号', field: 'PRUCHASE_ORDER', width: 120 },
    {
      headerName: '层级',
      field: 'levelNum',
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '数量',
      field: 'moQty',
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '单位',
      field: 'unitOfMeasure',
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '建议开工时间',
      field: 'fpcTime',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '建议完工时间',
      field: 'lpcTime',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    // { headerName: '工单生产时间', field: 'PRODUCT_DAYS', width: 150 },
    // { headerName: '工单承诺时间', field: 'PROMISE_DATE', width: 150 },
    {
      headerName: '创建时间',
      field: 'creationDate',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '下达时间',
      field: 'issuedDate',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '备注',
      field: 'comments',
      width: 150,
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: this.customTemplate,
      },
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '需求备注',
      field: 'reqComments',
      width: 120,
      tooltipField: '需求备注',
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '冗余工单',
      field: 'redundantJobFlag',
      width: 150,
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: this.customTemplate1,
      },
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '残缺BOM',
      field: 'uncompletedBom',
      width: 150,
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: this.customTemplate2,
      },
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '资源异常',
      field: 'resourceExcFlag',
      width: 150, // 未维护工艺路线
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: this.customTemplate3,
      },
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '混流工艺路线异常',
      field: 'resourceMixFlag',
      width: 150, // 未维护混流工艺路线
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: this.customTemplate5,
      },
      menuTabs: ['filterMenuTab'],
    },
    // {
    //   headerName: '预测/工单', field: 'SOURCE', width: 150, cellRendererFramework: CustomOperateCellRenderComponent,
    //   cellRendererParams: {
    //     customTemplate:
    //       `<input type="checkbox" [checked]="dataItem.SOURCE!='Y'" disabled />`
    //   }
    // },
    // {
    //   headerName: '未维护物料工序', field: 'HAS_ITEM_PROCESS', width: 150, cellRendererFramework: CustomOperateCellRenderComponent,
    //   cellRendererParams: {
    //     customTemplate: `<input type="checkbox" [checked]="!dataItem.HAS_ITEM_PROCESS" disabled />`
    //   }
    // },

    {
      headerName: '计划组',
      field: 'scheduleGroupCode',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    // { headerName: '资源', field: 'RESOURCE_CODE', width: 100 , menuTabs: ['filterMenuTab']},
    {
      field: 'resourceCode',
      headerName: '资源',
      width: 100,
      editable: params => {
        // console.log('FFFF' + params.data.PROCESS_SCHEDULE_FLAG);
        if (
          params.data.processScheduleFlag !== 'Y' ||
          (params.data.makeOrderStatus !== 'A' &&
            params.data.makeOrderStatus !== 'G' &&
            params.data.makeOrderStatus !== 'B' &&
            params.data.makeOrderStatus !== 'S')
        ) {
          return false;
        } else {
          return true;
        }
      },
      cellEditor: 'agSelectCellEditor',
      menuTabs: ['filterMenuTab'],
      cellEditorParams: params => {
        if (params.colDef.field === 'resourceCode') {
          const dataItem = params.data;
          if (!dataItem.ResourceCodes || dataItem.ResourceCodes.length === 0) {
            dataItem.ResourceCodes = this.loadLine(
              dataItem.plantCode,
              dataItem.itemId,
              dataItem.techVersion,
            );
          }
          console.log(dataItem.ResourceCodes, 'dataItem.ResourceCodes');
          return dataItem.ResourceCodes;
        }
      },
    },

    //  { headerName: '工艺版本', field: 'TECH_VERSION', width: 100 , menuTabs: ['filterMenuTab']},

    {
      field: 'techVersion',
      headerName: '工艺版本',
      width: 200,
      editable: params => {
        if (
          params.data.processScheduleFlag !== 'Y' ||
          (params.data.makeOrderStatus !== 'A' &&
            params.data.makeOrderStatus !== 'G' &&
            params.data.makeOrderStatus !== 'B' &&
            params.data.makeOrderStatus !== 'S')
        ) {
          return false;
        } else {
          return true;
        }
      },
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: params => {
        if (params.colDef.field === 'techVersion') {
          const dataItem = params.data;
          return this.loadVersion(dataItem);
        }
      },
    },

    {
      headerName: '库存分类',
      field: 'invCategoryCode',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '计划分类',
      field: 'planCategoryCode',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      headerName: '出错信息',
      field: 'errorMessage',
      width: 100,
      tooltipField: 'errorMessage',
      menuTabs: ['filterMenuTab'],
    },
  ];

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: MixedResourceIssuedResourceIssuedEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService,
    private route: ActivatedRoute,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
    this.setGridHeight({ topMargin: 120, bottomMargin: 65 });
    this.groupDefaultExpanded = -1;
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate4;
    this.columns[17].cellRendererParams.customTemplate = this.customTemplate;
    this.columns[19].cellRendererParams.customTemplate = this.customTemplate1;
    this.columns[20].cellRendererParams.customTemplate = this.customTemplate2;
    this.columns[21].cellRendererParams.customTemplate = this.customTemplate3;
    this.columns[22].cellRendererParams.customTemplate = this.customTemplate5;
    this.gridData = [];
    this.initParams();
    this.loadRateType();
    this.loadItemType();
    this.loadYesNo();
    this.FindRequest();
    this.loadReqType();
    this.loadBrand();

    this.getDataPath = function(data) {
      return data.makeOrderNumPath.split('/');
    };

    this.getRowNodeId = function(data) {
      return data.id;
    };

    this.autoGroupColumnDef = {
      headerName: this.appTranslationService.translate('派单号'),
      width: 250,
      // headerCheckboxSelection: true,
      cellRendererParams: {
        // checkbox: (dataItem) => {
        //   return this.canChecked(dataItem);
        // },
        checkbox: false,
        suppressCount: true,
        // innerRenderer: 'fileCellRenderer'
      },
    };

    const showAttribute = this.route.snapshot.paramMap.get('showAttribute');
    // attribute属性只在8001显示，8002不显示(默认显示)
    if (!this.isNull(showAttribute) && showAttribute === 'N') {
      const removeColumns = ['attribute1', 'attribute2', 'attribute3'];
      this.columns = this.columns.filter(
        t => removeColumns.findIndex(r => r === t.field) === -1,
      );
      this.expColumns = this.expColumns.filter(
        t => removeColumns.findIndex(r => r === t.field) === -1,
      );
    }
    this.gridApi.collapseAll();
  }

  selectKeys = 'makeOrderNum';

  // 行选中改变
  onSelectionChanged(event) {
    // console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');
    // console.log(event.api.selectionController.selectedNodes);

    // event.api.selectionController.selectedNodes.forEach((d: { allLeafChildren: { forEach: (arg0: (item: any) => void) => void; }; }) => {

    // d.allLeafChildren.forEach(item => {
    //       item.selected = true;
    //       });
    //     });

    this.getGridSelectionKeys(this.selectKeys);
  }

  /**更新计划组 */
  updateLineGroup(
    plantCode: any,
    itemID: any,
    resourceCode: any,
    techVersion: any,
    targetRow: any,
  ) {
    const lineGroup = this.loadLineGroup(
      plantCode,
      itemID,
      resourceCode,
      techVersion,
    );
    console.log(lineGroup, 'scheduleGroupCode');
    if (targetRow) {
      targetRow.data.scheduleGroupCode = lineGroup;
    }
    this.gridData = this.clone(this.gridData);
  }

  // 单元格内容改变
  onCellValueChanged(event) {
    console.log(event);
    if (
      this.isNullDefault(event.oldValue, '').toString() !==
      this.isNullDefault(event.newValue, '').toString() &&
      this.editColumnHeaders.findIndex(x => x === event.colDef.headerName) > -1
    ) {
      // 修改更新标记
      this.editService.update(event.data);
    }

    if (
      event.colDef.field === 'resourceCode' &&
      event.oldValue !== event.newValue
    ) {
      // const lineGroup = this.loadLineGroup(
      //   event.data.PLANT_CODE,
      //   event.data.ITEM_ID,
      //   event.newValue,
      //   event.data.TECH_VERSION,
      // );
      // console.log(lineGroup, 'SCHEDULE_GROUP_CODE');
      // event.data.SCHEDULE_GROUP_CODE = lineGroup;
      // this.gridData = this.clone(this.gridData);
      // add by jianl更新计划组
      this.updateLineGroup(
        event.data.plantCode,
        event.data.itemId,
        event.newValue,
        event.data.techVersion,
        event,
      );
    }

    if (
      event.colDef.field === 'techVersion' &&
      event.oldValue !== event.newValue
    ) {
      const resourceCodes = this.loadLine(
        event.data.plantCode,
        event.data.itemId,
        event.newValue,
      );
      console.log(resourceCodes, 'resourceCodes');
      event.data.ResourceCodes = resourceCodes;
      event.data.resourceCode = resourceCodes.values[0];
      // add by jianl更新计划组
      this.updateLineGroup(
        event.data.plantCode,
        event.data.itemId,
        event.data.resourceCode,
        event.newValue,
        event,
      );
      this.gridData = this.clone(this.gridData);
    }
  }

  initParams() {
    this.params.plantCode = '';
    this.params.startBegin = '';
    this.params.startEnd = '';
    this.params.endBegin = '';
    this.params.endEnd = '';
    this.params.makeOrderStatus = '';
    this.params.projectNumber = '';
    this.params.makeOrderNum = '';
    this.params.itemId = '';
    this.params.makeOrderStatusA = false;
    this.params.redundantJobFlag = false;
    this.params.makeOrderStatusG = false;
    this.params.resourceCode = '';
    this.params.scheduleGroupCode = '';
    this.params.selection = [];
    this.params.expand = [];
    this.params.treeDataTable = [];
    // this.params.pageIndex = 1;
    // this.params.pageSize = 10;
    this.params.listBrand = [];
    this.params.listReqType = [];
    this.params.listProductManager = [];
    this.params.listCategory1 = [];
    this.params.listCategory2 = [];
    this.params.optionBrandSelection = [];
    this.params.optionReqTypeSelection = [];
    this.params.optionProductManagerSelection = [];
    this.params.optionCategory1Selection = [];
    this.params.optionCategory2Selection = [];

    this.i.Params = this.params;
    this.i.daysDisable = false;
    this.i.othersDisable = true;
  }

  // 物料工艺路线缓存 （查询时加载）
  public itemlines = [];

  // 加载物料   工艺版本
  private loadVersion(dataItem: any): any {
    const lineVersionValues = [''];
    if (this.itemlines.length > 0) {
      const lines = this.itemlines.filter(
        x =>
          x.plantCode === dataItem.plantCode &&
          x.itemId === dataItem.itemId,
      );
      lines.forEach(x => {
        if (x.techVersion !== null && x.techVersion !== '') {
          if (lineVersionValues.indexOf(x.techVersion) < 0) {
            lineVersionValues.push(x.techVersion);
          }
        }
      });
    }
    return { values: lineVersionValues };
  }

  // 加载物料工艺路线（资源）
  private loadLine(plantCode: string, itemId: string, techVersion: any): any {
    const lineSelectValues = [];
    if (this.itemlines.length > 0) {
      if (techVersion === '') {
        techVersion = null;
      }
      const lines = this.itemlines.filter(
        x =>
          x.PLANT_CODE === plantCode &&
          x.ITEM_ID === itemId &&
          x.TECH_VERSION === techVersion,
      );
      lines.forEach(x => {
        if (lineSelectValues.indexOf(x.resourceCode) < 0) {
          lineSelectValues.push(x.resourceCode);
        }
      });
    }
    return { values: lineSelectValues };
  }

  // 加载物料工艺路线（计划组）
  private loadLineGroup(
    plantCode: string,
    itemId: string,
    resource_code: string,
    techVersion: any,
  ): any {
    let lineGroup: any = '';
    if (this.itemlines.length > 0) {
      if (techVersion === '') {
        techVersion = null;
      }
      lineGroup = this.itemlines.find(
        x =>
          x.plantCode === plantCode &&
          x.itemId === itemId &&
          x.techVersion === techVersion &&
          x.resourceCode === resource_code,
      );
    }
    if (lineGroup) {
      return lineGroup.scheduleGroupCode;
    }
    return lineGroup;
  }

  // 编辑备注
  finishEdit(item: any): void {
    this.editService.updateMake(item).subscribe(resultMes => {
    });
  }

  // 行选择
  onRowSelected(event) {
    const context = this;
    if (event.node.selected === true) {
      this.gridApi.forEachNode(function(node) {
        // if ( event.data.REDUNDANT_JOB_FLAG !== 'undefined' && event.data.REDUNDANT_JOB_FLAG !== 'Y' && event.data.UNCOMPLETED_BOM !== 'Y' && event.data.RESOURCE_EXC_FLAG !== 'Y' &&
        // (event.data.MAKE_ORDER_STATUS === 'A' || event.data.MAKE_ORDER_STATUS === 'G' || event.data.MAKE_ORDER_STATUS === 'B') && node.data.MAKE_ORDER_NUM_PATH.indexOf(event.data.MAKE_ORDER_NUM_PATH) > -1) {
        if (
          context.canChecked(node.data) &&
          // node.data.makeOrderNumPath.indexOf(
          //   event.data.makeOrderNumPath,
          // ) > -1 &&
          event.data.projectNumber.indexOf(node.data.projectNumber) > -1
        ) {
          node.setSelected(true);
        }
      });
    } else {
      this.gridApi.forEachNode(function(node) {
        if (
          context.canChecked(node.data) &&
          // node.data.makeOrderNumPath.indexOf(
          //   event.data.makeOrderNumPath,
          // ) > -1 &&
          event.data.projectNumber.indexOf(node.data.projectNumber) > -1
        ) {
          node.setSelected(false);
        }
      });
    }
  }

  // 下发
  send() {
    if (
      this.i.Params.plantCode === 'underfind' ||
      this.i.Params.plantCode === ''
    ) {
      this.msgSrv.error(this.appTranslationService.translate('请先查询生产工单'));
      return;
    }

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认下达生产工单?'),
      nzOnOk: () => {
        this.markOrderList = '';
        this.assMarkOrderList = '';

        const gridSelectRows = this.gridApi.getSelectedRows();
        if (gridSelectRows) {
          gridSelectRows.forEach(item => {
            if (this.agCanChecked(item)) {
              if (item.levelNum === 0) {
                this.markOrderList += item.makeOrderNum + ',';
              } else {
                this.assMarkOrderList += item.makeOrderNum + ',';
              }
            }
          });
        }
        if (
          this.markOrderList.length === 0 &&
          this.assMarkOrderList.length === 0
        ) {
          this.msgSrv.error(this.appTranslationService.translate('请选择要下发的生产工单'));
        } else {
          this.updatedItems = this.editService.getUpdateItems();

          const dtos = []; // 调整参数列表
          this.updatedItems.forEach(x => {
            // console.log('++++++++++' + x.RESOURCE_CODE);
            // 传给服务的参数
            const dto = {
              id: x.Id,
              techVersion: x.techVersion,
              plantCode: x.plantCode,
              resourceCode: x.resourceCode,
            };
            dtos.push(dto);
            // tslint:disable-next-line:no-unused-expression
            // console.log('++++++++++TTTT') + dto.RESOURCE_CODE;
          });

          // this.editService.SendVersion(this.updatedItems).subscribe(res => {
          //   if (res.Success === true) {

          //   } else {
          //     this.msgSrv.error(res.Message);
          //   }
          // });

          this.editService
            .SendMarkOrder(
              this.i.Params.plantCode,
              this.markOrderList,
              this.assMarkOrderList,
              this.updatedItems,
            )
            .subscribe(res => {
              if (res.code === 200) {
                this.query(false);
                // this.msgSrv.success('生产工单下达请求已提交，请等候处理');
                this.msgSrv.success(this.appTranslationService.translate(res.msg));
              } else {
                this.msgSrv.error(this.appTranslationService.translate(res.msg));
              }
            });
        }
      },
    });
  }

  public canChecked(dataItem: any) {
    const exception = [];
    if (
      dataItem.redundantJobFlag === 'undefined' ||
      dataItem.redundantJobFlag === 'Y' ||
      dataItem.uncompletedBom === 'Y' ||
      dataItem.resourceMixFlag === 'Y' ||
      dataItem.resourceExcFlag === 'Y' ||
      (dataItem.makeOrderStatus !== 'A' &&
        dataItem.makeOrderStatus !== 'G' &&
        dataItem.makeOrderStatus !== 'B') &&
      exception.indexOf(dataItem.projectNumber) >= -1
    ) {
      exception.push(dataItem.projectNumber);
      return false;
    }
    return true;
  }

  agCanChecked(dataItem: any) {
    if (
      dataItem.redundantJobFlag === 'undefined' ||
      dataItem.redundantJobFlag === 'Y' ||
      dataItem.uncompletedBom === 'Y' ||
      dataItem.resourceMixFlag === 'Y' ||
      dataItem.resourceExcFlag === 'Y' ||
      (dataItem.makeOrderStatus !== 'A' &&
        dataItem.makeOrderStatus !== 'G' &&
        dataItem.makeOrderStatus !== 'B')
    ) {
      return false;
    }
    return true;
  }

  // 全部刷新
  reload() {
    if (
      this.i.Params.plantCode === 'underfind' ||
      this.i.Params.plantCode === ''
    ) {
      this.msgSrv.error(this.appTranslationService.translate('请先查询工单'));
      return;
    }

    this.markOrderList = '';
    const gridSelectRows = this.gridApi.getSelectedRows();
    if (gridSelectRows) {
      gridSelectRows.forEach(item => {
        if (this.agCanChecked(item) && item.levelNum === 0) {
          this.markOrderList += item.makeOrderNum + ',';
        }
      });
    }

    if (this.markOrderList.length === 0) {
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate(
          '没有选择生产工单，继续提交将刷新需求日期为' +
          this.refreshDays +
          '天内的生产工单，是否继续刷新?',
        ),
        nzOnOk: () => {
          this.editService.reload(this.i.Params.plantCode).subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('刷新请求已提交，请等候处理'));
              this.query(false);
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
        },
      });
    } else {
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate(
          '系统将刷新已选择的生产工单，是否继续刷新?',
        ),
        nzOnOk: () => {
          this.editService
            .reload(this.i.Params.plantCode, this.markOrderList)
            .subscribe(res => {
              if (res.code === 200) {
                this.msgSrv.success(this.appTranslationService.translate('刷新请求已提交，请等候处理'));
                this.query(false);
              } else {
                this.msgSrv.error(this.appTranslationService.translate(res.msg));
              }
            });
        },
      });
    }
  }

  // 单个刷新
  loadMark(item: any) {
    this.editService.loadMark(item).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(
          this.appTranslationService.translate('刷新生产工单号为 ' +
            item.makeOrderNum +
            ' 的请求已提交，请等候处理'),
        );
        this.query(false);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  createPlanOrder(item: any) {
    this.editService.hasMrpSupply(item.plantCode, item.makeOrderNum).subscribe(res => {
      if (res.code === 200 && res.data) {
        this.modal
        .static(MixedResourceIssuedPlanOrderComponent, {
          plantCode: item.plantCode,
          makeOrderNum: item.makeOrderNum,
          lpcTime: item.lpcTime,
        }, 'lg')
        .subscribe((value) => {
          if (value) {
            
          }
        });
      } else {
        this.msgSrv.warning(this.appTranslationService.translate("没有运行MRP！"));
      }
    })
  }

  // 查找请求
  FindRequest() {
    this.i.IsRefresh = false;
    this.modal
      .static(
        MixedResourceIssuedSearchRequestComponent,
        { i: this.i },
        1000,
        850,
      )
      .subscribe(value => {
        if (this.i.IsRefresh) {
          this.query(true);
        }
      });
  }

  // 查询菜单数据
  query(firstFlag: boolean) {
    if (firstFlag) {
      super.query();
    }
    // this.i.Params.pageIndex = this.lastPageNo;
    // this.i.Params.pageSize = this.lastPageSize;
    const lineCodes = [];
    // 获取选中资源编码
    this.i.Params.selection.forEach(x => {
      if (x.level === 1) {
        lineCodes.push(x.code);
      }
    });

    // 转换选中的编码
    this.i.Params.selection = lineCodes;

    // // 开始加载
    // this.commonQueryService.loadGridView({
    //   url: '/afs/serverppmixedresourceissued/ppmixedresourceissued/QueryMixedResourceIssuedAG',
    //   method: 'POST'
    // }, this.i.Params, this.context);

    this.setLoading(true);
    this.editService.SearchGetMenuInfoAG(this.i.Params).subscribe(resultMes => {
      if (resultMes !== null && resultMes.data.length >= 0) {
        this.editService.reset();
        this.gridData = resultMes.data;
        this.itemlines = resultMes.extra; // 物料工艺路线
      }
      // 加载完毕
      this.setLoading(false);
      setTimeout(x => {
        this.gridApi.collapseAll();
      }, 500);
    });
  }

  // 刷新天数
  refreshDays = 30;

  // 加载刷新天数快码
  loadRefreshDays() {
    this.commonQueryService
      .GetLookupByType('PPASSPLAN_REFRESH')
      .subscribe(res => {
        const extra = res.Extra;
        if (extra !== null) {
          const option = extra.find(x => x.lookupCode === 'DAYS');
          this.refreshDays =
            option !== null ? option.additionCode : this.refreshDays;
        }
      });
  }

  applicationRateType: any[] = [];
  // 过滤替换 列表中快码的值
  // optionsFind(value: string): any {
  //   return this.applicationRateType.find(x => x.value === value);
  // }

  // 工单状态
  loadRateType(): void {
    this.commonQueryService
      .GetLookupByType('PS_MAKE_ORDER_STATUS')
      .subscribe(result => {
        this.applicationRateType.length = 0;
        result.Extra.forEach(d => {
          this.applicationRateType.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }

  loadYesNo(): void {
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      this.applicationYesNo.length = 0;
      result.Extra.forEach(d => {
        this.applicationYesNo.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  applicationItemType: any[] = [];

  // 物料状态
  loadItemType(): void {
    this.commonQueryService
      .GetLookupByType('PP_MTL_ITEM_STATUS')
      .subscribe(result => {
        this.applicationItemType.length = 0;
        result.Extra.forEach(d => {
          this.applicationItemType.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }

  // 过滤替换 列表中快码的值
  optionsItemFind(value: string): any {
    return this.applicationItemType.find(x => x.value === value);
  }

  hasItemProcessOptions = [
    { value: true, label: 'N' },
    { value: false, label: 'Y' },
  ];

  // 绑定品牌
  optionBrand = [];

  // 品牌 PP_PLN_BRAND_TYPE
  loadBrand(): void {
    this.commonQueryService
      .GetLookupByType('PP_PLN_BRAND_TYPE')
      .subscribe(result => {
        this.optionBrand.length = 0;
        result.Extra.forEach(d => {
          this.optionBrand.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }

  // 过滤替换 列表中快码的值
  optionsBrandFind(value: string): any {
    let option = this.optionBrand.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  // 绑定需求类型
  optionListReqType = [];

  loadReqType(): void {
    this.commonQueryService
      .GetLookupByType('PP_PLN_ORDER_TYPE')
      .subscribe(result => {
        this.optionListReqType.length = 0;
        result.Extra.forEach(d => {
          this.optionListReqType.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }

  // 过滤替换 列表中快码的值
  optionsReqTypeFind(value: string): any {
    let option = this.optionListReqType.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  // 导出列
  expColumns = [
    {
      field: 'makeOrderNum',
      title: '派单号',
      tooltipField: 'makeOrderNum',
      width: 150,
      pinned: 'left',
      lockPinned: true,
    },
    {
      title: '状态',
      field: 'makeOrderStatus',
      tooltipField: 'makeOrderStatus',
      width: 120,
      menuTabs: ['filterMenuTab'],
    },

    {
      field: 'plantCode',
      title: '工厂',
      tooltipField: 'plantCode',
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '项目号',
      field: 'projectNumber',
      tooltipField: 'projectNumber',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },

    {
      title: '需求类型',
      field: 'reqType',
      width: 100,
      valueFormatter: 'ctx.optionsReqTypeFind(value).label',
      menuTabs: ['filterMenuTab'],
    },

    {
      title: '物料编码',
      field: 'itemCode',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '物料描述',
      field: 'descriptions',
      tooltipField: 'descriptions',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '物料状态',
      field: 'itemStatusCode',
      width: 100,
      valueFormatter: 'ctx.optionsItemFind(value).label',
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '系数',
      field: 'attribute3',
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '层级',
      field: 'levelNum',
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '数量',
      field: 'moQty',
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '单位',
      field: 'unitOfMeasure',
      width: 80,
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '建议开工时间',
      field: 'fpcTime',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '建议完工时间',
      field: 'lpcTime',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },

    {
      title: '创建时间',
      field: 'creationDate',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '下达时间',
      field: 'issuedDate',
      width: 150,
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '备注',
      field: 'comments',
      width: 150,
    },
    {
      title: '需求备注',
      field: 'reqComments',
      width: 120,
      tooltipField: '需求备注',
      menuTabs: ['filterMenuTab'],
    },

    {
      title: '冗余工单',
      field: 'redundantJobFlag',
      width: 150,
    },
    {
      title: '残缺BOM',
      field: 'uncompletedBom',
      width: 150,
    },
    {
      title: '未维护工艺路线',
      field: 'resourceExcFlag',
      width: 150,
    },
    {
      title: '未维护混流工艺路线',
      field: 'resourceMixFlag',
      width: 150,
    },
    {
      title: '计划组',
      field: 'scheduleGroupCode',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '资源',
      field: 'resourceCode',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },

    {
      title: '工艺版本',
      field: 'techVersion',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },

    {
      title: '库存分类',
      field: 'invCategoryCode',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '计划分类',
      field: 'planCategoryCode',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      title: '出错信息',
      field: 'errorMessage',
      width: 100,
      tooltipField: 'errorMessage',
      menuTabs: ['filterMenuTab'],
    },
  ];

  expColumnsOptions: any[] = [
    { field: 'makeOrderStatus', options: this.applicationRateType },
    { field: 'itemStatusCode', options: this.applicationItemType },
    { field: 'hasItemProcess', options: this.hasItemProcessOptions },
    { field: 'brand', options: this.optionBrand },
    { field: 'reqType', options: this.optionListReqType },
    { field: 'redundantJobFlag', options: this.applicationYesNo },
    { field: 'uncompletedBom', options: this.applicationYesNo },
    { field: 'resourceExcFlag', options: this.applicationYesNo },
    { field: 'resourceMixFlag', options: this.applicationYesNo },
  ];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;

  export() {
    // super.export();
    this.commonQueryService.exportAction(
      {
        url:
          '/api/ps/ppMixedResourceIssued/QueryMixedResourceIssued',
        method: 'POST',
      },
      this.i.Params,
      this.excelexport,
      this,
    );
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
      this.query(false);
    } else {
      this.setLoading(false);
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // params.api.sizeColumnsToFit();
  }

  expandAll() {
    this.gridApi.expandAll();
  }

  collapseAll() {
    this.gridApi.collapseAll();
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applicationRateType;
        break;
      case 2:
        options = this.applicationYesNo;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  // 全部展开
  showMinus() {
    if (this.isExpand) {
      this.gridApi.expandAll(); // 当前展开
      this.isExpand = false;
      this.ImgSrc = '全部收缩'; // 全部展开样式
    } else {
      this.gridApi.collapseAll(); // 当前收缩
      this.isExpand = true;
      this.ImgSrc = '全部展开'; // 全部收缩
    }
  }
}
