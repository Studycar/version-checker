import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { ItemJointHDEditService } from './edit.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { MaterialmanagementItemcycletimeViewComponent } from 'app/aps/materialmanagement/itemcycletime/view/view.component';
import { ItemJointHDEditComponent } from './edit/edit.component';
import { ItemJointHDImportComponent } from './import/import.component';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'item-joint-hd',
  templateUrl: './item-joint-hd.component.html',
  providers: [ItemJointHDEditService],
})
export class ItemJointHDComponent extends CustomBaseContext implements OnInit {

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public gridViewItems1: GridDataResult = {
    data: [],
    total: 0
  };
  public gridViewItems2: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsItems: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料',
      width: '100'
    },
    {
      field: 'DESCRIPTIONS_CN',
      title: '物料描述',
      width: '100'
    }
  ];

  plantCodeList: any[] = [];
  resourceCodeMasterList: any[] = [];
  resourceCodeJointList: any[] = [];
  public queryParams = {
    defines: [
      { field: 'PLANT_CODE_MASTER', title: '主产品排产工厂', ui: { type: UiType.select, options: this.plantCodeList, eventNo: 1 } },
      { field: 'RESOURCE_CODE_MASTER', title: '主产品排产资源', ui: { type: UiType.select, options: this.resourceCodeMasterList } },
      {
        field: 'ITEM_ID_MASTER', title: '主产品物料', ui: {
          type: UiType.popupSelect, valueField: 'ITEM_CODE', textField: 'ITEM_CODE', gridView: this.gridViewItems1,
          columns: this.columnsItems, eventNo: 2
        }
      },
      { field: 'PLANT_CODE_JOINT', title: '联产品排产工厂', ui: { type: UiType.select, options: this.plantCodeList, eventNo: 3 } },
      { field: 'RESOURCE_CODE_JOINT', title: '联产品排产资源', ui: { type: UiType.select, options: this.resourceCodeJointList } },
      {
        field: 'ITEM_ID_JOINT', title: '联产品物料', ui: {
          type: UiType.popupSelect, valueField: 'ITEM_CODE', textField: 'ITEM_CODE', gridView: this.gridViewItems2,
          columns: this.columnsItems, eventNo: 4
        }
      },
    ],
    values: {
      PLANT_CODE_MASTER: this.appconfig.getPlantCode(),
      RESOURCE_CODE_MASTER: null,
      ITEM_ID_MASTER: { value: '', text: '' },
      PLANT_CODE_JOINT: null,
      RESOURCE_CODE_JOINT: null,
      ITEM_ID_JOINT: { value: '', text: '' }
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 90, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: { template: this.headerTemplate }
    },
    { field: 'PLANT_CODE_MASTER', headerName: '主产品排产工厂', title: '主产品排产工厂', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'RESOURCE_CODE_MASTER', headerName: '主产品排产资源', title: '主产品排产资源', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'ITEM_ID_MASTER', headerName: '主产品物料', title: '主产品物料', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'ATTRIBUTE1', headerName: '主产品物料描述', title: '主产品物料描述', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'PLANT_CODE_JOINT', headerName: '联产品排产工厂', title: '联产品排产工厂', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'RESOURCE_CODE_JOINT', headerName: '联产品排产资源', title: '联产品排产资源', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'ITEM_ID_JOINT', headerName: '联产品物料', title: '联产品物料', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'ATTRIBUTE2', headerName: '联产品物料描述', title: '联产品物料描述', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'QTY_TRANSFER', headerName: '数量转换关系', title: '数量转换关系', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'TIME_INTERVAL', headerName: '开始时间间隔', title: '开始时间间隔', width: 150, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'SPLIT_QTY', headerName: '合并数量上限', title: '合并数量上限', width: 100, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'ROUNDING_VALUE', headerName: '舍入值', title: '舍入值', width: 100, locked: true, menuTabs: ['filterMenuTab'] }
  ];

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    public editService: ItemJointHDEditService,
    private commonqueryService: CommonQueryService,
    private appconfig: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.getPlantCodeList();
  }

  getPlantCodeList() {
    // 当前用户对应工厂
    this.queryParams.values.PLANT_CODE_MASTER = this.appconfig.getPlantCode();
    this.editService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodeList.push({ value: d.PLANT_CODE, label: d.PLANT_CODE });
      });

      if (this.plantCodeList.length > 0) {
        this.plantCodeChanged1(this.queryParams.values.PLANT_CODE_MASTER);
        this.query();
      }
    });
  }

  plantCodeChanged1(plantCode: any) {
    this.resourceCodeMasterList.length = 0;
    this.queryParams.values.RESOURCE_CODE_MASTER = null;
    this.editService.GetResourceCodes({ PLANT_CODE_MASTER: plantCode }).subscribe(result => {
      result.Extra.forEach(d => {
        this.resourceCodeMasterList.push({ value: d.RESOURCE_CODE, label: d.RESOURCE_CODE });
      });
    });
  }

  plantCodeChanged2(plantCode: any) {
    this.resourceCodeJointList.length = 0;
    this.queryParams.values.RESOURCE_CODE_JOINT = null;
    this.editService.GetResourceCodes({ PLANT_CODE_MASTER: plantCode }).subscribe(result => {
      result.Extra.forEach(d => {
        this.resourceCodeJointList.push({ value: d.RESOURCE_CODE, label: d.RESOURCE_CODE });
      });
    });
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    const dto = {
      PLANT_CODE_MASTER: this.queryParams.values.PLANT_CODE_MASTER,
      RESOURCE_CODE_MASTER: this.queryParams.values.RESOURCE_CODE_MASTER,
      ITEM_ID_MASTER: this.queryParams.values.ITEM_ID_MASTER.text,
      PLANT_CODE_JOINT: this.queryParams.values.PLANT_CODE_JOINT,
      RESOURCE_CODE_JOINT: this.queryParams.values.RESOURCE_CODE_JOINT,
      ITEM_ID_JOINT: this.queryParams.values.ITEM_ID_JOINT.text,
      QueryParams: { PageIndex: this._pageNo, PageSize: this._pageSize },
      IsExport: false
    };
    this.commonqueryService.loadGridView({ url: this.editService.seachUrl, method: 'POST' }, dto, this.context);
  }

  // 新增、编辑
  public add(item: any) {
    this.modal.static(ItemJointHDEditComponent, {
      originDto: item !== undefined ? item : null
    }, 'lg').subscribe((value) => {
      if (value) {
        this.queryCommon();
      }
    });
  }

  // 删除
  public remove(item: any) {
    this.editService.Delete({ IDs: [item.Id] }).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success('删除成功');
        this.queryCommon();
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  // 批量删除
  removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.Delete({ IDs: this.selectionKeys }).subscribe(() => {
          this.msgSrv.success('删除成功');
          this.queryCommon();
        });
      },
    });
  }

  // 重置
  public clear() {
    this.queryParams.values = {
      PLANT_CODE_MASTER: this.appconfig.getPlantCode(),
      RESOURCE_CODE_MASTER: null,
      ITEM_ID_MASTER: { value: '', text: '' },
      PLANT_CODE_JOINT: null,
      RESOURCE_CODE_JOINT: null,
      ITEM_ID_JOINT: { value: '', text: '' }
    };

    this.plantCodeChanged1(this.queryParams.values.PLANT_CODE_MASTER);
    this.resourceCodeJointList.length = 0;
  }

  // 物料弹出查询 
  public searchItems1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;

    // 加载物料
    this.commonqueryService.GetUserPlantItemPageList(this.queryParams.values.PLANT_CODE_MASTER || '', e.SearchValue || '', '',
      PageIndex, e.PageSize).subscribe(res => {
        this.gridViewItems1.data = res.Result;
        this.gridViewItems1.total = res.TotalCount;
      });
  }

  public searchItems2(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;

    // 加载物料
    this.commonqueryService.GetUserPlantItemPageList(this.queryParams.values.PLANT_CODE_JOINT || '', e.SearchValue || '', '',
      PageIndex, e.PageSize).subscribe(res => {
        this.gridViewItems2.data = res.Result;
        this.gridViewItems2.total = res.TotalCount;
      });
  }

  selectBy = 'Id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  // 导入
  public import() {
    this.modal.static(ItemJointHDImportComponent, {}, 'md')
      .subscribe((value) => {
        this.queryCommon();
      });
  }

  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = {
      PLANT_CODE_MASTER: this.queryParams.values.PLANT_CODE_MASTER,
      RESOURCE_CODE_MASTER: this.queryParams.values.RESOURCE_CODE_MASTER,
      ITEM_ID_MASTER: this.queryParams.values.ITEM_ID_MASTER.value,
      PLANT_CODE_JOINT: this.queryParams.values.PLANT_CODE_JOINT,
      RESOURCE_CODE_JOINT: this.queryParams.values.RESOURCE_CODE_JOINT,
      ITEM_ID_JOINT: this.queryParams.values.ITEM_ID_JOINT.value,
      QueryParams: { PageIndex: this._pageNo, PageSize: this._pageSize },
      IsExport: true
    };
    this.commonqueryService.export({ url: this.editService.seachUrl, method: 'POST' }, dto, this.excelexport, this.context);
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
