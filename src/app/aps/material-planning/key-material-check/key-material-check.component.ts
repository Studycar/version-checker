import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { ModalHelper } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomOperateCellRenderComponent } from '../../../modules/base_module/components/custom-operatecell-render.component';
import { KeyMaterialDetailComponent } from './detail/detail.component';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'key-material-check',
  templateUrl: './key-material-check.component.html',
  styleUrls: ['./key-material-check.component.css']
})
export class KeyMaterialCheckComponent extends CustomBaseContext implements OnInit {

  constructor(public pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private modal: ModalHelper,
    private commonQueryService: CommonQueryService,
    public httpClient: _HttpClient, ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  plantOption: any[] = [];
  categoriesOption: any[] = [];
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

  columnCagetoryType: any[] = [
    { field: 'CATEGORY_CODE', title: '编码', width: '200px' },
    { field: 'DESCRIPTIONS', title: '描述', width: '200px' }
  ];
  queryParams = {
    defines: [
      {
        field: 'PLANT_CODE',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOption, ngModelChange: this.onPlantCodeChange },
        required: true
      },
      {
        field: 'StockCategory',
        title: '库存分类',
        required: true,
        ui: {
          type: UiType.treeSelect,
          valueLevel: 0,
          options: [],
          columns: this.columnCagetoryType,
          keyField: 'CATEGORY_CODE',
          valueField: 'CATEGORY_CODE',
          selection: [],
        },
      },
      {
        field: 'ITEM_CODE',
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
    ],
    values: {
      PLANT_CODE: this.appConfigService.getPlantCode(),
      StockCategory: '',
      ITEM_CODE: { text: '', value: '' },
    }
  };
  columns = [
    {
      colId: 'action',
      field: '',
      headerName: '操作',
      width: 70,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
      suppressSizeToFit: true,
    },
    { field: 'plantCode', headerName: '工厂', width: 80, menuTabs: ['filterMenuTab'] },
    { field: 'makeOrderNum', headerName: '工单号', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', width: 130, menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', width: 180, menuTabs: ['filterMenuTab'] },
    { field: 'moQty', headerName: '数量', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'fpcTime', headerName: '计划日期', width: 110, menuTabs: ['filterMenuTab'] },
    { field: 'suggestMsg', headerName: '建议', width: 180, menuTabs: ['filterMenuTab'] },
    { field: 'suggestTime', headerName: '建议日期', width: 120, menuTabs: ['filterMenuTab'] },
  ];
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadPlantOption(this.appConfigService.getDefaultScheduleRegionCode());
    this.queryCagetoryType();
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonQueryService.loadGridViewNew(
      { url: '/api/mrp/mrpKeyMaterialCheck/queryKeyMaterialCheck', method: 'GET' },
      this.getQueryParams(),
      this.context
    );
  }

  // 加载库存分类
  queryCagetoryType() {
    this.GetPurCagetory(this.queryParams.values.PLANT_CODE).subscribe(res => {
      const data = [];
      res.data.forEach(x => {
        data.push({ CATEGORY_CODE: x.categoryCode, DESCRIPTIONS: x.descriptions });
      });
      this.queryParams.defines.find(t => t.field === 'StockCategory').ui.options = data;
    });
  }

  GetPurCagetory(plantCode: String): Observable<ResponseDto> {
    return this.httpClient.get<ResponseDto>('/api/ps/psMrpKeyMaterialCheck/queryStockCategory', {plantCode});
  }

  getQueryParams() {
    const data = [];
    this.get_control_obj('StockCategory').ui.selection.forEach(x => { data.push(x['CATEGORY_CODE']); });
    console.log(this.get_control_obj('StockCategory').ui.selection, '=====');
    return {
      plantCode: this.queryParams.values.PLANT_CODE,
      itemCode: this.queryParams.values.ITEM_CODE.text,
      categoryCodeList: data,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
  }

  onPlantCodeChange(val: string) {
    this.queryParams.values.ITEM_CODE.text = '';
    this.queryParams.values.ITEM_CODE.value = '';
    this.queryParams.values.StockCategory = '';
    this.get_control_obj('StockCategory').ui.selection = [];
    this.queryCagetoryType();
  }

  clear() {
    this.queryParams.values = {
      PLANT_CODE: this.appConfigService.getPlantCode(),
      ITEM_CODE: { text: '', value: '' },
      StockCategory: ''
    };
    this.get_control_obj('StockCategory').ui.selection = [];
  }

  get_control_obj(field: string) {
    return this.queryParams.defines.find(t => t.field === field);
  }


  detail(data: any) {
    console.log(data, '=========');
    this.modal.static(
      KeyMaterialDetailComponent,
      { data: data },
      'lg'
    ).subscribe(res => { });
  }

  loadPlantOption(businessUnitCode: string) {
    this.commonQueryService.GetUserPlant(businessUnitCode, '').subscribe(res => {
      this.plantOption.length = 0;
      res.Extra.forEach(item => {
        this.plantOption.push({
          label: item.plantCode,
          value: item.plantCode
        });
      });
    });
  }

  rowSelect({ Row, Text, Value, sender }) {
    this.queryParams.values.ITEM_CODE.text = Text;
    this.queryParams.values.ITEM_CODE.value = Value;
  }

  searchItems(e: any) {
    if (!this.queryParams.values.PLANT_CODE) {
      this.msgSrv.warning(this.appTranslationService.translate(this.appTranslationService.translate('请先选择工厂！')));
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(
      this.queryParams.values.PLANT_CODE,
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
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
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
}
