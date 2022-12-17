import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { FormBuilder } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { QueryService } from './edit.service';
import { DemandOrderSplitMergeService } from '../../../modules/generated_module/services/demand-order-split-merge';
import { DemandOrderManagementDemandOrderSplitMergeEditComponent } from './edit/edit.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import Timer = NodeJS.Timer;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demand-order-split-merge',
  templateUrl: './demand-order-split-merge.component.html',
  providers: [QueryService]
})
export class DemandOrderManagementDemandOrderSplitMergeComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public sourceoptions: any[] = [];
  public typeoptions: any[] = [];
  context = this;
  pageIndex = 1;
  pageSize = 10;
  randomUserUrl: string;
  k: string;
  plantOptions: any[] = [];

  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantOptions, ngModelChange: this.onPlantChange } },
      { field: 'txtSourceType', title: '类别', ui: { type: UiType.select, options: this.typeoptions, eventNo: 1 } },
      { field: 'txtSourceCode', title: '类别值', ui: { type: UiType.scrollSelect, options: this.sourceoptions, extraEvent: { ScrollEventNo: 2, SearchEventNo: 3 } } },
    ],
    values: {
      plantCode: this.AppconfigService.getPlantCode(),
      txtSourceType: null,
      txtSourceCode: null
    }
  };

  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 100,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,       // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1,
      cellClass: '',
      field: '',
      headerName: '',
      width: 40,
      pinned: 'left',
      lockPinned: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'sourceTypeText', headerName: '类别', menuTabs: ['filterMenuTab'] },
    { field: 'sourceCode', headerName: '类别值', menuTabs: ['filterMenuTab'] },
    { field: 'description', headerName: '描述', menuTabs: ['filterMenuTab'] },
    // { field: 'splitQty', headerName: '拆分基数', menuTabs: ['filterMenuTab'] },
    { field: 'mergeQty', headerName: '拆分合并基数', menuTabs: ['filterMenuTab'] },
    { field: 'splitTolerance', headerName: '拆分允差（%）', menuTabs: ['filterMenuTab'] },
    { field: 'deliveryTime', headerName: '交期弹性小时数', menuTabs: ['filterMenuTab'] }
  ];

  constructor(
    public pro: BrandService,
    public http: _HttpClient,
    private modal: ModalHelper,
    private formBuilder: FormBuilder,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    private editService: QueryService,
    private demandordersplitmerge: DemandOrderSplitMergeService,
    public AppconfigService: AppConfigService,
    public translateservice: AppTranslationService,
    public commonQuery: CommonQueryService
  ) {
    super({ pro: pro, appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: AppconfigService });
    this.headerNameTranslate(this.columns);
  }

  public clear() {
    this.queryParams.values = {
      txtSourceType: null,
      txtSourceCode: null,
      plantCode: this.AppconfigService.getPlantCode()
    };
  }

  onPlantChange(val: string) {
    if (this.queryParams.values.txtSourceType) {
      this.typeChange(this.queryParams.values.txtSourceType);
    }
  }

  httpAction = {
    url: this.demandordersplitmerge.searchUrl,
    method: 'GET'
  };

  public query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    this.commonQuery.loadGridViewNew(this.httpAction, this.getQueryParams(), this.context);
  }

  getQueryParams() {
    return {
      plantCode: this.queryParams.values.plantCode,
      sourceType: this.queryParams.values.txtSourceType,
      sourceCode: this.queryParams.values.txtSourceCode,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  typeChange(value: any) {
    this.sourceoptions.length = 0;
    this.queryParams.values.txtSourceCode = null;
    this.pageIndex = 1;
    this.k = '';
    if (value === '1') {
      this.loadItems(
        this.sourceoptions,
        this.queryParams.values.plantCode,
        this.k,
        this.pageIndex,
        this.pageSize,
        true
      );
    } else {
      this.loadCategories(
        this.sourceoptions,
        this.queryParams.values.plantCode,
        this.k,
        this.pageIndex,
        this.pageSize,
        true
      );
    }
  }

  loadCategories(
    options: any[],
    plantCode: string,
    categoryCode: string,
    pageIndex: number,
    pageSize: number,
    isNew: boolean,
  ) {
    this.demandordersplitmerge.getCategories(plantCode, categoryCode, pageIndex, pageSize).subscribe(res => {
      if (isNew) {
        options.length = 0;
      }
      res.data.forEach(item => {
        options.push({
          label: item,
          value: item,
        });
      });
    });
  }

  loadItems(
    options: any[],
    plantCode: string,
    itemCode: string,
    pageIndex: number,
    pageSize: number,
    isNew: boolean
  ) {
    this.commonQuery.getUserPlantItemPageList(plantCode, itemCode, '', pageIndex, pageSize).subscribe(res => {
      if (isNew) {
        options.length = 0;
      }
      res.data.content.forEach(item => {
        options.push({
          label: item.itemCode,
          value: item.itemCode,
        });
      });
    });
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();

    this.typeoptions.push({
      label: '物料',
      value: '1'
    });
    this.typeoptions.push({
      label: '排程分类',
      value: '2'
    });
    this.commonQuery.GetUserPlantNew().subscribe(res => {
      res.data.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode,
        });
      });
    });
  }

  add(item?: any) {
    this.modal
      .static(
        DemandOrderManagementDemandOrderSplitMergeEditComponent,
        { i: item ? item : { id: null } },
        'lg',
      ).subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  public remove(item: any) {
    this.demandordersplitmerge.delete([item.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.translateservice.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.translateservice.translate(res.msg));
      }
    });
  }

  RemoveBath() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.error(this.translateservice.translate('请选择要删除的数据!'));
      return;
    }
    this.modalService.confirm({
      nzContent: this.translateservice.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.demandordersplitmerge.delete(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.translateservice.translate('删除成功'));
            this.query();
          } else {
            this.msgSrv.error(this.translateservice.translate(res.msg));
          }
        });
      },
    });
  }

  LandMoreItem() {
    this.pageIndex++;
    if (this.queryParams.values.txtSourceType === '1') {
      this.loadItems(
        this.sourceoptions,
        this.queryParams.values.plantCode,
        this.k,
        this.pageIndex,
        this.pageSize,
        false
      );
    } else {
      this.loadCategories(
        this.sourceoptions,
        this.queryParams.values.plantCode,
        this.k,
        this.pageIndex,
        this.pageSize,
        false
      );
    }
  }

  searchEvent: Timer;
  onSearch(value: string): void {
    this.k = value;
    this.pageIndex = 1;
    if (this.searchEvent) {
      clearTimeout(this.searchEvent);
    }
    this.searchEvent = setTimeout(() => {
      if (this.queryParams.values.txtSourceType === '1') {
        this.loadItems(
          this.sourceoptions,
          this.queryParams.values.plantCode,
          this.k,
          this.pageIndex,
          this.pageSize,
          true
        );
      } else {
        this.loadCategories(
          this.sourceoptions,
          this.queryParams.values.plantCode,
          this.k,
          this.pageIndex,
          this.pageSize,
          true
        );
      }
    }, 500);
  }

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
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
