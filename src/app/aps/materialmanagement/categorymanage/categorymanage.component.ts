/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-08-10 11:28:17
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-22 14:23:19
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { State, process } from '@progress/kendo-data-query';
import { map } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { QueryService } from './edit.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MaterialmanagementCategorymanageEditComponent } from './edit/edit.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { MaterialmanagementCategorymanageService } from '../../../modules/generated_module/services/materialmanagement-categorymanage-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { CategoryManagerImportComponent } from './import/import.component';
import { ModalPlusService } from '@shared/components/modal-plus/modal-plus.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-categorymanage',
  templateUrl: './categorymanage.component.html',
  providers: [QueryService],
})
export class MaterialmanagementCategorymanageComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  expandForm = false;
  applicationOptions: any[] = [];
  application: any[] = [];
  public changes: any = {};
  public mySelection: any[] = [];
  context = this;
  YesOrNo: any[] = [];

  public queryParams = {
    defines: [
      { field: 'txtCategorySet', title: '类别集', ui: { type: UiType.text } },
      { field: 'txtCategorySetDesc', title: '类别集描述', ui: { type: UiType.text } },
      { field: 'txtCategory', title: '类别', ui: { type: UiType.text } },
      { field: 'txtCategoryDesc', title: '参数描述', ui: { type: UiType.text } },
      { field: 'txtSection', title: '段数', ui: { type: UiType.text } },
      { field: 'cobYesOrNo', title: '是否有效', ui: { type: UiType.select, options: this.YesOrNo } }
    ],
    values: {
      txtCategory: '',
      txtCategoryDesc: '',
      txtCategorySet: '',
      txtCategorySetDesc: '',
      txtSection: '',
      cobYesOrNo: '',
      page: this._pageNo,
      pageSize: this._pageSize
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
    { field: 'categorySetCode', headerName: '类别集', menuTabs: ['filterMenuTab'] },
    { field: 'categorySetDesc', headerName: '类别集描述', menuTabs: ['filterMenuTab'] },
    { field: 'categoryCode', headerName: '类别', menuTabs: ['filterMenuTab'] },
    { field: 'descriptions', headerName: '参数描述', menuTabs: ['filterMenuTab'] },
    { field: 'priority', headerName: '优先级', menuTabs: ['filterMenuTab'] },
    { field: 'segmentsQty', headerName: '段数', menuTabs: ['filterMenuTab'] },
    { field: 'segment1', headerName: '段数一', menuTabs: ['filterMenuTab'] },
    { field: 'segment2', headerName: '段数二', menuTabs: ['filterMenuTab'] },
    { field: 'segment3', headerName: '段数三', menuTabs: ['filterMenuTab'] },
    { field: 'segment4', headerName: '段数四', menuTabs: ['filterMenuTab'] },
    { field: 'segment5', headerName: '段数五', menuTabs: ['filterMenuTab'] },
    { field: 'segment6', headerName: '段数六', menuTabs: ['filterMenuTab'] },
    { field: 'segment7', headerName: '段数七', menuTabs: ['filterMenuTab'] },
    { field: 'segment8', headerName: '段数八', menuTabs: ['filterMenuTab'] },
    { field: 'segment9', headerName: '段数九', menuTabs: ['filterMenuTab'] },
    { field: 'segment10', headerName: '段数十', menuTabs: ['filterMenuTab'] },
    {
      field: 'enableFlag',
      headerName: '是否有效',
      valueFormatter:  function(params) {
        return params.value === 'Y' ? '是' : '否';
      },
      menuTabs: ['filterMenuTab']
    }
  ];

  public clear() {
    this.queryParams.values = {
      txtCategory: '', txtCategoryDesc: '', txtCategorySet: '', txtCategorySetDesc: '', txtSection: '', cobYesOrNo: null, page: this._pageNo,
      pageSize: this._pageSize
    };
  }

  httpAction = {
    url: this.categorymanageservice.seachUrl,
    method: 'GET',
    data: false
  };

  getQueryParams(): {[key: string]: any} {
    return {
      categoryCode: this.queryParams.values.txtCategory,
      categoryDesc: this.queryParams.values.txtCategoryDesc,
      categorySetCode: this.queryParams.values.txtCategorySet,
      categorySetDesc: this.queryParams.values.txtCategorySetDesc,
      enableFlag: this.queryParams.values.cobYesOrNo,
      segment: this.queryParams.values.txtSection,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
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
    private categorymanageservice: MaterialmanagementCategorymanageService,
    private commonquery: CommonQueryService,
    private appService: AppConfigService,
    private modalPlusService: ModalPlusService,
  ) {
    super({ pro: pro, appTranslationSrv: translateservice, msgSrv: msgSrv, appConfigSrv: appService });
    this.headerNameTranslate(this.columns);
  }

  public add(item?: any) {
    /*
    this.modal
      .static(
        MaterialmanagementCategorymanageEditComponent,
        { i: { id: (item !== undefined ? item.id : null) } },
        'lg',
      )
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
    */
    // /*
    this.modalPlusService.create(
      MaterialmanagementCategorymanageEditComponent,
      { i: { id: (item !== undefined ? item.id : null) } },
    )
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
    // */
  }

  removeBath() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }

    this.modalService.confirm({
      nzContent: this.translateservice.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.categorymanageservice.RemoveBath(this.selectionKeys).subscribe(res => {
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
    this.categorymanageservice.RemoveBath([value.id]).subscribe(res => {
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

  import() {
    this.modal
      .static(CategoryManagerImportComponent, {}, 'md')
      .subscribe(() => {
        this.query();
      });
  }
}
