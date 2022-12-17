import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { QueryService } from './edit.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SopLongTermItemManageEditComponent } from './edit/edit.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { SopLongTermItemManageService } from '../../../modules/generated_module/services/soplongtermitem-manage-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { SopLongTermItemImportComponent } from './import/import.component';
import { PsItemRoutingsService } from './../../../modules/generated_module/services/ps-item-routings-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';

@Component({
  selector: 'soplongtermitem-manage',
  templateUrl: './soplongtermitem.component.html',
  providers: [QueryService, PsItemRoutingsService],
})
export class SopLongTermItemManageComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  
  expandForm = false;
  applicationOptions: any[] = [];
  application: any[] = [];
  public changes: any = {};
  public mySelection: any[] = [];
  context = this;
  YesOrNo: any[] = [];

  //工厂编码 
  public plantCodeOptions: any[] = [];
  //物料编码
  public itemCodeOptions: any[] = [];
  //当前选中的工厂
  currentPlantCode: { label: '', value: '', scheduleRegionCode: '' };
  currentItemCode: { itemId:'',itemCode:'',unitOfMeasure:'',descriptionsCn:'' };

    // 物料的选择框
    gridViewItems: GridDataResult = {
      data: [],
      total: 0,
    };
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
  


  public queryParams = {
    defines: [
      { field: 'strPlantCode', title: '工厂', ui: { type: UiType.select, options: this.plantCodeOptions, eventNo: 4 }, required: true },
      {
        field: 'strItemCodeFrom', title: '物料编码', ui: {
          type: UiType.popupSelect,
          valueField: 'itemCode',
          textField: 'itemCode',
          gridView: this.gridViewItems,
          columns: this.columnsItems,
          eventNo: 2,
        },
      },
      { field: 'strLeadTime', title: '采购周期', ui: { type: UiType.text } },
      { field: 'enableFlag', title: '是否有效', ui: { type: UiType.select, options: this.YesOrNo } }
    ],
    values: {
      strPlantCode: '',
      strItemCodeFrom: { value: '', text: '' },
      strItemDescribe: '',
      strLeadTime: '',
      enableFlag: '',
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
    { field: 'itemDescribe', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'leadTime', headerName: '采购周期（天）', menuTabs: ['filterMenuTab'] }, {
      field: 'enableFlag',
      headerName: '是否有效',
      valueFormatter: function (params) {
        return params.value === 'Y' ? '是' : '否';
      },
      menuTabs: ['filterMenuTab']
    }
  ];

  // 工厂切换动态清除物料
  public ClearItemCodes(event: string) {
    this.queryParams.values.strItemCodeFrom.text = '';
    this.queryParams.values.strItemCodeFrom.value = '';
  }
  public clear() {
    this.queryParams.values = {
      strPlantCode: this.appService.getPlantCode(),
      strItemDescribe: '',
      strItemCodeFrom: { value: '', text: '' },
      strLeadTime: null,
      enableFlag: '',
    }; 
  }

  httpAction = {
    url: this.sopLongTermItemManageService.seachUrl,
    method: 'GET',
    data: false
  };

  getQueryParams(): { [key: string]: any } {
    return {
      plantCode: this.queryParams.values.strPlantCode,
      itemCode: this.queryParams.values.strItemCodeFrom.value,
      leadTime: this.queryParams.values.strLeadTime,
      enableFlag: this.queryParams.values.enableFlag,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }
    // 事业部切换动态加载工厂
    public LoadPlantCodes(event: string) {
      this.queryParams.values.strPlantCode = null;
      this.queryParams.values.strItemCodeFrom.text = '';
      this.queryParams.values.strItemCodeFrom.value = '';
      this.commonquery.GetUserPlant(event).subscribe(result => {
        this.plantCodeOptions.length = 0;
        result.Extra.forEach(d => {
          this.plantCodeOptions.push({ value: d.plantCode, label: d.plantCode });
        });
      });
    }

  public query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.queryservice.loadGridViewNew(this.httpAction, this.getQueryParams(), this.context);
  }

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,  // 模态对话框
    private formBuilder: FormBuilder,
    public queryservice: QueryService,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    private translateservice: AppTranslationService,
    private sopLongTermItemManageService: SopLongTermItemManageService,
    private commonquery: CommonQueryService,
    private appService: AppConfigService,
    public psItemRoutingsService: PsItemRoutingsService,
  ) {
    super({ pro: pro, appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: appService });
    this.headerNameTranslate(this.columns);
  }

  public add(item?: any) {
    this.modal
      .static(
        SopLongTermItemManageEditComponent,
        { i: { id: (item !== undefined ? item.id : null) } },
        'md',
      )
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  removeBath() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }

    this.modalService.confirm({
      nzContent: this.translateservice.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.sopLongTermItemManageService.RemoveBath(this.selectionKeys).subscribe(res => {
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

  remove(value: any) {
    this.sopLongTermItemManageService.RemoveBath([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.translateservice.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.translateservice.translate(res.msg));
      }
    });
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.queryservice.read(this.httpAction, this.queryParams);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
    this.commonquery.GetLookupByTypeNew('FND_YES_NO').subscribe(res => {
      res.data.forEach(element => {
        this.YesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
    this.getPlantCodesAndItemCodes();
  }

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
  // 加载工厂
  getPlantCodesAndItemCodes() {
    this.commonquery.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodeOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode,
        });
        this.currentPlantCode = this.plantCodeOptions[0];
        this.loadItem();
      });
    });
  }
  //加载物料
  public loadItem(): void {
    this.psItemRoutingsService.SearchItemInfo(this.currentPlantCode.value).subscribe(resultMes => {
      this.itemCodeOptions = resultMes.data;
    });
  }
  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    this.plantCodeOptions.forEach(ele=>{
      if(ele.value===value){
        this.currentPlantCode = ele;
      }
    })
    
    this.loadItem();
  }


   // 物料弹出查询
   public searchItemsFrom(e: any) {
    if (!this.queryParams.values.strPlantCode) {
      this.msgSrv.warning(this.translateservice.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.strPlantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  public searchItemsTo(e: any) {
    if (!this.queryParams.values.strPlantCode) {
      this.msgSrv.warning(this.translateservice.translate('请先选择工厂！'));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.queryParams.values.strPlantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonquery.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  import() {
    this.modal
      .static(SopLongTermItemImportComponent, {}, 'md')
      .subscribe(() => {
        this.query();
      });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'enableFlag', options: this.YesOrNo }
  ];
 
    
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {    
      this.excelexport.export(this.gridData);
    });
  }
}
