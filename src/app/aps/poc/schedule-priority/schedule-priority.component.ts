import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ModalHelper } from '@delon/theme';
import { SchedulePriorityService } from './schedule-priority.service';
import { SchedulePriorityEditComponent } from './edit/edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'schedule-priority',
  templateUrl: './schedule-priority.component.html',
  styleUrls: ['./schedule-priority.component.css'],
  providers: [SchedulePriorityService]
})
export class SchedulePriorityComponent extends CustomBaseContext implements OnInit {

  /**查询路径 */
  httpAction = { url: this.queryService.queryUrl, method: 'GET' };
  plantOptions: any[] = [];
  constraintOptions: any[] = [];
  context = this;
  queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions },
      },
      {
        field: 'itemCode',
        title: '产品编码',
        ui: { type: UiType.text, },
      },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: '',
      constraint: null,
    },
  };
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  columns = [
    {
      colId: 'select',
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
        template: this.headerTemplate,
      },
      suppressSizeToFit: true,
    },
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
    { field: 'plantCode', headerName: '工厂', width: 100, menuTabs: ['filterMenuTab'], },
    { field: 'itemCode', headerName: '产品编码', width: 110, menuTabs: ['filterMenuTab'], },
    { field: 'itemDesc', headerName: '产品描述', width: 150, menuTabs: ['filterMenuTab'], },
    { field: 'priorty', headerName: '排产优先级', width: 120, menuTabs: ['filterMenuTab'], },
    { field: 'constrain', headerName: '排产约束', width: 110, menuTabs: ['filterMenuTab'], valueFormatter: 'ctx.optionsFind(value,1).label', },
  ];

  constructor(
    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private modalService: NzModalService,
    private modal: ModalHelper,
    private queryService: SchedulePriorityService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  /** 初始化*/
  ngOnInit() {
    this.columns[1].cellRendererParams.customTemplate = this.customTemplate;
    this.loadOptions();
    this.query();
  }

  /** 加载对象*/
  loadOptions() {
    this.commonQueryService.GetUserPlantNew().subscribe(res => {
      res.data.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode,
        });
      });
    });

    this.commonQueryService.GetLookupByType('PS_SCHEDULE_CONSTRAIN').subscribe(res => {
      res.Extra.forEach(item => {
        this.constraintOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }


  query() {
    super.query();
    this.commonQuery();
  }

  /** 查询*/
  commonQuery() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.getQueryParams(), this.context);
  }

  /** 获取查询参数*/
  getQueryParams() {
    return {
      plantCode: this.queryParams.values.plantCode,
      itemCode: this.queryParams.values.itemCode,
      constraint: this.queryParams.values.constraint,
      PageIndex: this._pageNo,
      PageSize: this._pageSize,
    };
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: '',
      constraint: null,
    };
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.constraintOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  add(data?: any) {
    this.modal.static(
      SchedulePriorityEditComponent,
      { i: data ? data : { id: null } },
      'lg'
    ).subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  remove(data: any) {
    this.queryService.remove([data.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '删除失败'));
      }
    });
  }

  removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择要删除的数据'));
      return;
    }
    this.modalService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.queryService.remove(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('删除成功'));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg || '删除失败'));
          }
        });
      }
    });
  }

  onSelectionChanged() {
    this.getGridSelectionKeys('id');
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
