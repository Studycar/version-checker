import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from '../queryService';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-technical-modify-item-category-select',
  templateUrl: './item-category-select.component.html',
  providers: [QueryService]
})
export class PlanschedulePsTechnicalModifyItemCategorySelectComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private modalRef: NzModalRef,
    private queryService: QueryService,
    private msgSrv: NzMessageService,
    private appconfig: AppConfigService,
    private apptranslate: AppTranslationService,
    private modalService: NzModalService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
    this.headerNameTranslate(this.categoryColumns);
    this.headerNameTranslate(this.itemColumns);
  }

  inputParam: any;
  // 参数格式
  // inputParam = {
  //     selectType: '', // 类型：item-物料，category-车型分类
  //     plantCode: dataItem.plantCode,
  //     itemCode: dataItem.afterItemCode,
  //     showSelectText: false, // 是否显示已选
  //     selectText: '', // 已选择内容
  //     multiple: false, // 是否多选
  //     selectRow: null, // 选择行
  //   };

  rowSelectionMode = '';
  listPlant: any[] = [];
  public queryParams = {
    defines: [
      { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.listPlant } },
      { field: 'models', title: '车型', ui: { type: UiType.text } },
      { field: 'itemCode', title: '物料号', ui: { type: UiType.text } },
    ],
    values: {
      plantCode: null, // this.appconfig.getPlantCode(),
      models: '',
      itemCode: '',
    }
  };

  public columns = [];

  selectColum = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
    },
  ];

  categoryColumns = [
    { field: 'categoryCode', headerName: '类别', menuTabs: ['filterMenuTab'] },
    { field: 'descriptions', headerName: '参数描述', menuTabs: ['filterMenuTab'] }
  ];

  itemColumns = [
    { field: 'itemCode', headerName: '物料', menuTabs: ['filterMenuTab'] },
    { field: 'descriptionsCn', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'unitOfMeasure', headerName: '物料单位', menuTabs: ['filterMenuTab'] },
  ];

  ngOnInit() {
    this.clear();

    this.selectColum[0].headerCheckboxSelection = this.inputParam.multiple; // 是否可以多选
    if (!this.inputParam.multiple) {
      this.rowSelectionMode = 'single';
    } else {
      this.rowSelectionMode = 'multiple';
    }

    if (this.inputParam.selectType === 'category') {
      // 选择车型分类
      this.queryParams.defines = [
        { field: 'models', title: '车型', ui: { type: UiType.text } },
      ];

      this.columns = [...this.selectColum, ... this.categoryColumns];
    }
    if (this.inputParam.selectType === 'item') {
      // 选择物料
      this.queryParams.defines = [
        { field: 'plantCode', title: '工厂', required: true, ui: { type: UiType.select, options: this.listPlant } },
        { field: 'itemCode', title: '物料号', ui: { type: UiType.text } },
      ];

      this.columns = [...this.selectColum, ... this.itemColumns];
    }

    this.inputParam.itemCode = '';
    this.loadData();
    this.query();
  }

  loadData() {
    // 当前用户对应工厂
    this.queryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.listPlant.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }

  getQueryParams() {
    return {
      plantCode: this.queryParams.values.plantCode,
      categorySetCode: '车型分类',
      categoryCode: this.queryParams.values.models,
      itemCode: this.queryParams.values.itemCode,
      isExport: false,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    let queryUrl = '';
    if (this.inputParam.selectType === 'category') {
      // 选择车型分类
      queryUrl = '/api/ps/pscategories/QueryPage';
    }
    if (this.inputParam.selectType === 'item') {
      // 选择物料
      queryUrl = '/api/ps/psItem/pageItem';
    }
    const httpAction = { url: queryUrl, method: 'GET' };
    this.queryService.loadGridViewNew(httpAction, this.getQueryParams(), this);
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.inputParam.plantCode,
      models: '',
      itemCode: this.inputParam.itemCode,
    };
  }

  // 行选中改变
  onSelectionChanged(event) {
    // console.log(event);
    // this.setSelectText();
  }

  onRowSelected(event) {
    this.setSelectText(event.data, event.node.selected);
  }

  selectConfrim(event) {
    if (!this.inputParam.multiple) {
      this.inputParam.selectRow = event.data;

      this.modalRef.destroy(true);
    } else {
      // this.setSelectText();
    }
  }

  setSelectText(dataItem: any, selected: boolean) {
    // 原数据
    const list = [];
    if (this.inputParam.selectText !== null && this.inputParam.selectText !== '') {
      const strText = this.inputParam.selectText.replace(' ', ',').replace('，', ',').replace('\n', ',');
      strText.split(',').forEach(p => { list.push(p); });
    }
    // 选择或取消选择的数据
    let selectKey = '';
    if (this.inputParam.selectType === 'category') {
      // 选择车型分类
      selectKey = 'categoryCode';
    }
    if (this.inputParam.selectType === 'item') {
      // 选择物料
      selectKey = 'itemCode';
    }
    const strSelect = dataItem[selectKey];

    if (selected) {
      // 选中，增加到后面
      if (!list.find(q => q === strSelect)) {
        list.push(strSelect);
      }
    } else {
      // 取消选中，删除数据
      const index = list.findIndex(q => q === strSelect);
      if (index > -1) {
        list.splice(index, 1);
      }
    }

    this.inputParam.selectText = '';
    list.forEach(p => {
      if (this.inputParam.selectText !== '') {
        this.inputParam.selectText += ',';
      }
      this.inputParam.selectText += p;
    });
  }

  save() {
    if (!this.gridData || this.gridData.length === 0) {
      this.msgSrv.success(this.apptranslate.translate('当前没有数据，请重新查询'));
      return;
    }

    if (this.inputParam.multiple) {
      if (this.inputParam.selectText === null || this.inputParam.selectText === '') {
        const msg = this.apptranslate.translate('请勾选数据！');
        this.msgSrv.info(msg);
        return;
      }
    } else {
      // 单选
      const listSelect = this.gridApi.getSelectedRows();
      if (listSelect.length === 0) {
        const msg = this.apptranslate.translate('请勾选数据！');
        this.msgSrv.info(msg);
        return;
      }
      this.inputParam.selectRow = listSelect[0];
    }

    this.modalRef.destroy(true);
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
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
}
