import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { ShipmentNoteService } from './shipment-note.service';
import { LoadCapacityRuleService } from '../load-capacity-rule/load-capacity-rule.service';
import { ShipmentNoteDetailComponent } from './detail/detail.component';
import { LoadShiftsService } from '../load-shifts/load-shifts.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'shipment-note',
  templateUrl: './shipment-note.component.html',
  providers: [ShipmentNoteService, LoadCapacityRuleService, LoadShiftsService],
})
export class ShipmentNoteComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;
  @ViewChild('customTemplate2', { static: true }) customTemplate2: TemplateRef<any>;

  // 工厂
  public plantCodes: any[] = [];
  // 装运点
  public loadLocations: any[] = [];
  // 开始时间
  public loadInternals: any[] = [];
  // 查询参数
  queryParams = {
    defines: [
      { field: 'strPlantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.plantCodes, eventNo: 1 } },
      { field: 'strLoadLocation', title: '装运点', required: false, ui: { type: UiType.select, options: this.loadLocations } },
      { field: 'strDnCode', title: 'DN单号', required: false, ui: { type: UiType.text } },
      { field: 'strDateRange', title: '日期范围', required: false, ui: { type: UiType.dateRange } }
    ],
    values: {
      strPlantCode: this.appConfigService.getPlantCode(),
      strLoadLocation: '',
      strDnCode: '',
      strDateRange: []
    }
  };
  // 网格列定义
  columns = [
    {
      field: 'check', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'plantCode', headerName: '工厂', title: '工厂', tooltipField: 'plantCode', menuTabs: ['filterMenuTab'] },
    { field: 'dnCode', headerName: 'DN单号', title: 'DN单号', tooltipField: 'dnCode', menuTabs: ['filterMenuTab'] },
    { field: 'productMetTime', headerName: '生产可满足时段', title: '生产可满足时段', tooltipField: 'productMetTime', menuTabs: ['filterMenuTab'] },
    { field: 'originalDate', headerName: '原始发运日期', title: '原始发运日期', tooltipField: 'originalDate', menuTabs: ['filterMenuTab'] },
    {
      field: 'shipmentDate', headerName: '计划发运日期', title: '计划发运日期', tooltipField: 'shipmentDate',
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      },
      menuTabs: ['filterMenuTab']
    },
    {
      field: 'planTime', headerName: '计划发运时段', title: '计划发运时段', tooltipField: 'planTime',
      editable: true, cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        if (params.colDef.field === 'planTime') {
          const values = [''];
          this.loadInternals.forEach(pro => values.push(pro.label));
          return { values: values };
        }
      },
      menuTabs: ['filterMenuTab']
    },
    {
      field: 'expectedDate', headerName: '期望发运日期', title: '期望发运日期', tooltipField: 'expectedDate',
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      },
      menuTabs: ['filterMenuTab']
    },
    { field: 'dnGroupCode', headerName: 'DN组号', title: 'DN组号', tooltipField: 'dnGroupCode', menuTabs: ['filterMenuTab'] },
    { field: 'forwarder', headerName: '运输商', title: '运输商', tooltipField: 'forwarder', menuTabs: ['filterMenuTab'] },
    { field: 'transpotType', headerName: '运输方式', title: '运输方式', tooltipField: 'transpotType', menuTabs: ['filterMenuTab'] },
    { field: 'deleveryWeight', headerName: '货物总重量', title: '货物总重量', tooltipField: 'deleveryWeight', menuTabs: ['filterMenuTab'] },
    { field: 'lastPlanTime', headerName: '上次计划运行时间', title: '上次计划运行时间', tooltipField: 'lastPlanTime', menuTabs: ['filterMenuTab'] },
    { field: 'unmatchReason', headerName: '不满足原因', title: '不满足原因', tooltipField: 'unmatchReason', menuTabs: ['filterMenuTab'] }
  ];

  doubleClickFlag = false;

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public shipmentNoteService: ShipmentNoteService,
    public loadCapacityRuleService: LoadCapacityRuleService,
    public loadShiftsService: LoadShiftsService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[5].cellRendererParams.customTemplate = this.customTemplate1;
    this.columns[7].cellRendererParams.customTemplate = this.customTemplate2;
    this.clear();
    this.initPlantCodes();
    this.query();
  }

  clear() {
    this.queryParams.values = {
      strPlantCode: this.appConfigService.getPlantCode(),
      strLoadLocation: null,
      strDnCode: '',
      strDateRange: []
    };
  }

  /** 初始化 组织  下拉框*/
  initPlantCodes() {
    // 当前用户对应工厂
    this.queryParams.values.strPlantCode = this.appConfigService.getPlantCode();
    this.shipmentNoteService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodes.push({ value: d.plantCode, label: d.plantCode });
      });

      if (this.plantCodes.length > 0) {
        this.plantCodeChanged(this.queryParams.values.strPlantCode);
      }
    });
  }

  /** 初始化 装运点  下拉框*/
  plantCodeChanged(event: any) {
    const dto = {
      PLANT_CODE: event
    };
    this.loadLocations.length = 0;
    this.loadCapacityRuleService.QueryLocation(event).subscribe(result => {
      result.data.forEach(d => {
        this.loadLocations.push({ value: d, label: d });
      });
      if (this.loadLocations.length > 0) {
        this.queryParams.values.strLoadLocation = this.loadLocations[0].value;
      }
      else{
        this.queryParams.values.strLoadLocation =null;
      }
    });

    this.loadInternals.length = 0;
    this.loadShiftsService.QueryInternals(dto).subscribe(result => {
      result.data.content.forEach(d => {
        this.loadInternals.push({ value: d.internal, label: d.attribute1 });
      });
    });
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    const httpAction = { url: this.shipmentNoteService.querysSummaryUrl, method: 'POST' };

    const dto = {
      plantCode: this.queryParams.values.strPlantCode,
      loadLocation: this.queryParams.values.strLoadLocation,
      dnCode: this.queryParams.values.strDnCode,
      fromDateTime: this.commonQueryService.formatDate(this.queryParams.values.strDateRange[0]),
      endDateTime: this.commonQueryService.formatDate(this.queryParams.values.strDateRange[1]),
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      export: false
    };

    this.commonQueryService.loadGridViewNew(httpAction, dto, this.context);
  }

  // 单元格双击
  onCellDoubleClicked(event) {
    if (event.colDef.field === 'dnCode') {
      if (this.doubleClickFlag) {
        return;
      }
      this.doubleClickFlag = true;

      const dto = {
        plantCode: this.queryParams.values.strPlantCode,
        loadLocation: this.queryParams.values.strLoadLocation,
        dnCode: event.data.dnCode,
        fromDateTime: this.commonQueryService.formatDate(this.queryParams.values.strDateRange[0]),
        endDateTime: this.commonQueryService.formatDate(this.queryParams.values.strDateRange[1]),
        pageIndex: this._pageNo,
        pageSize: this._pageSize,
        export: false
      };
      this.modal.static(ShipmentNoteDetailComponent, { querysDetaiDto: dto }, 'lg').subscribe(() => {
        this.doubleClickFlag = false;
      });
    }
  }

  UpdateDnDtos: any[] = [];
  // 单元格内容改变
  onCellValueChanged(event) {
    let updateDate = this.UpdateDnDtos.find(dn => dn.PLANT_CODE === event.data.PLANT_CODE && dn.DN_CODE === event.data.DN_CODE);
    if (updateDate === undefined) {
      updateDate = {
        plantCode: event.data.plantCode,
        dnCode: event.data.dnCode,
        shipmentDate: event.data.shipmentDate,
        planTime: event.data.planTime,
        expectedDate: event.data.expectedDate
      };

      this.UpdateDnDtos.push(updateDate);
    }

    if (event.colDef.field === 'shipmentDate') {
      updateDate.shipmentDate = event.newValue;
    } else if (event.colDef.field === 'planTime') {
      updateDate.planTime = event.newValue;
    } else if (event.colDef.field === 'expectedDate') {
      updateDate.expectedDate = event.newValue;
    }
  }

  // 行选中改变
  onSelectionChanged() {
    const gridSelectRows = this.gridApi.getSelectedRows();
    this.selectionKeys = [];
    if (!this.isNull(gridSelectRows) && gridSelectRows.length > 0) {
      gridSelectRows.forEach(d => {
        if (this.selectionKeys.filter(p => p === d['dnCode']).length === 0)
          this.selectionKeys.push(d['dnCode']);
      });
    }
  }


  UpdateDN() {
    this.UpdateDnDtos = [];
    if (this.selectionKeys && this.selectionKeys.length > 0) {
      this.selectionKeys.forEach(key => {
        const selectData = this.gridData.find(dn => dn.dnCode === key);
        this.UpdateDnDtos.push({
          plantCode: selectData.plantCode,
          dnCode: selectData.dnCode,
          shipmentDate: selectData.shipmentDate,
          planTime: selectData.planTime,
          expectedDate: selectData.expectedDate
        });
      });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择数据'));
      return;
    }

    this.shipmentNoteService.UpdateDN(this.UpdateDnDtos).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('更新成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = {
      plantCode: this.queryParams.values.strPlantCode,
      loadLocation: this.queryParams.values.strLoadLocation,
      dnCode: this.queryParams.values.strDnCode,
      fromDateTime: this.commonQueryService.formatDate(this.queryParams.values.strDateRange[0]),
      endDateTime: this.commonQueryService.formatDate(this.queryParams.values.strDateRange[1]),
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      export: true
    };
    this.commonQueryService.export({ url: this.shipmentNoteService.querysSummaryUrl, method: 'POST' }, dto, this.excelexport, this.context);
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
}
