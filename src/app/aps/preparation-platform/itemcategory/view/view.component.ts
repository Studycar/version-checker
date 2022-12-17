/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:13
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 09:54:25
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from './queryService';
import { ItemCategoryService } from '../../../../modules/generated_module/services/item-category-service';
import { PreparationPlatformItemcategoryViewEditComponent } from '../view-edit/view-edit.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { PreparationPlatformItemcategoryView2Component } from '../view2/view2.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-itemcategory-view',
  templateUrl: './view.component.html',
  providers: [QueryService]

})
export class PreparationPlatformItemcategoryViewComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  record: any = {};
  j: any;
  mySelection: any[] = [];
  context = this;
  enableOptions: any[] = [];
  constructor(
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private queryService: QueryService,
    private querydata: ItemCategoryService,
    private apptranslate: AppTranslationService,
    private appconfig: AppConfigService,
    private modalService: NzModalService
  ) {
    super({ appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 270;
  }

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
    { field: 'plantCode', headerName: '工厂', width: 100 },
    { field: 'categoryCode', headerName: '物料类别', width: 120 },
    { field: 'deliveryRegionCode', headerName: '送货区域', width: 200 },
    { field: 'enableFlag', headerName: '是否有效', valueFormatter: 'ctx.optionsFind(value,1).label', width: 100 }
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.enableOptions;
        break;

    }
    return options.find(x => x.value === value) || { label: value };
  }
  httpAction = {
    url: this.querydata.viewUrl,
    method: 'GET'
  };

  queryParams = {
    plantCode: '',
    categoryCode: ''
  };

  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.enableOptions = this.j.enableOptions,
    console.log(this.enableOptions);
      this.queryParams = {
        plantCode: this.j.plantCode,
        categoryCode: this.j.categoryCode
      };
    this.query();
  }

  query() {
    super.query();
    this.queryService.loadGridViewNew(this.httpAction, this.queryParams, this);
  }

  add(item?: any) {
    this.modal
      .static(
        PreparationPlatformItemcategoryViewEditComponent,
        {
          i: { id: (item !== undefined ? item.id : null), plantCode: this.j.plantCode, categoryCode: this.j.categoryCode }
        },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }

  detail(item?: any) {
    this.modal
      .static(
        PreparationPlatformItemcategoryView2Component,
        {
          k: {
            plantCode: item.plantCode,
            categoryCode: item.categoryCode,
            deliveryRegionCode: item.deliveryRegionCode
          }
        },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }

  remove(value: any) {
    this.querydata.ViewDelete([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(this.apptranslate.translate(res.msg));
      }
    });
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.apptranslate.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata.ViewDelete(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success('删除成功');
            this.query();
          } else {
            this.msgSrv.error(this.apptranslate.translate(res.msg));
          }
        });
      },
    });
  }

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
