import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { QueryService } from './queryService';
import { ItemCategoryService } from 'app/modules/generated_module/services/item-category-service';
import { PreparationPlatformItemcategoryView2EditComponent } from '../view2-edit/view2-edit.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-itemcategory-view2',
  templateUrl: './view2.component.html',
  providers: [QueryService]
})
export class PreparationPlatformItemcategoryView2Component extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  record: any = {};
  k: any;
  Context = this;
  schudlegroups: any[] = [];
  constructor(
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private apptranslate: AppTranslationService,
    private appconfig: AppConfigService,
    private queryService: QueryService,
    private querydata: ItemCategoryService,
    private commonQuery: CommonQueryService,
    private translateservice: AppTranslationService,
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
    { field: 'scheduleGroupCode', headerName: '计划组编码' },
    { field: 'scheduleGroupCode', valueFormatter: 'ctx.optionsFind(value,1).label', headerName: '计划组描述' }
  ];

  queryParams = {
    plantCode: '',
    categoryCode: '',
    deliveryRegionCode: ''
  };

  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.queryParams = {
      plantCode: this.k.plantCode,
      categoryCode: this.k.categoryCode,
      deliveryRegionCode: this.k.deliveryRegionCode
    };
    this.query();
  }

  httpAction = {
    url: this.querydata.view2Url,
    method: 'GET'
  };

  query() {
    super.query();
    this.LoadData();
    this.queryService.loadGridViewNew(this.httpAction, this.queryParams, this);
  }

  LoadData() {
    this.commonQuery.GetUserPlantGroup(this.queryParams.plantCode).subscribe(res => {
      res.Extra.forEach(element => {
        this.schudlegroups.push({
          label: element.descriptions,
          value: element.scheduleGroupCode,
        });
      });
    });
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.schudlegroups;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  add(item?: any) {
    this.modal
      .static(
        PreparationPlatformItemcategoryView2EditComponent,
        {
          s: {
            id: (item !== undefined ? item.id : null),
            plantCode: this.k.plantCode,
            categoryCode: this.k.categoryCode,
            deliveryRegionCode: this.k.deliveryRegionCode,
            schudlegroups:this.schudlegroups
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
    this.querydata.View2Delete([value.id]).subscribe(res => {
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
      nzContent: this.translateservice.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.querydata.View2Delete(this.selectionKeys).subscribe(res => {
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
