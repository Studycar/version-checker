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
import { ExpandedOutputRateService } from './expanded-output-rate.service';
import { ExpandedOutputRateEditComponent } from './edit/edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'expanded-output-rate',
  templateUrl: './expanded-output-rate.component.html',
  styleUrls: ['./expanded-output-rate.component.css'],
  providers: [ExpandedOutputRateService],
})
export class ExpandedOutputRateComponent extends CustomBaseContext implements OnInit {

  constructor(
    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private modalService: NzModalService,
    private modal: ModalHelper,
    private queryService: ExpandedOutputRateService,
  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  httpAction = {
    url: this.queryService.queryUrl,
    method: 'GET',
  };
  plantOptions: any[] = [];
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
        ui: { type: UiType.text,  },
      },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: ''
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
    { field: 'PLANT_CODE', headerName: '工厂', width: 100, menuTabs: ['filterMenuTab'], },
    { field: 'ITEM_CODE', headerName: '产品编码', width: 110, menuTabs: ['filterMenuTab'], },
    { field: 'ITEM_DESC', headerName: '产品描述', width: 150, menuTabs: ['filterMenuTab'], },
    { field: 'INPUT_QTY', headerName: '给料数（KG）', width: 120, menuTabs: ['filterMenuTab'], },
    { field: 'OUTPUT_QTY', headerName: '产出数（KG）', width: 120, menuTabs: ['filterMenuTab'], },
    { field: 'FIX_LOSS_QTY', headerName: '冲洗返工（KG）', width: 130, menuTabs: ['filterMenuTab'], },
  ];

  ngOnInit() {
    this.columns[1].cellRendererParams.customTemplate = this.customTemplate;
    this.getPlantOptions();
    this.query();
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonQueryService.loadGridView(
      this.httpAction,
      this.getQueryParams(),
      this.context,
    );
  }

  getQueryParams() {
    return {
      PLANT_CODE: this.queryParams.values.plantCode,
      ITEM_CODE: this.queryParams.values.itemCode,
      QueryParams: {
        PageIndex: this._pageNo,
        PageSize: this._pageSize,
      },
    };
  }

  clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      itemCode: '',
    };
  }

  getPlantOptions() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.PLANT_CODE,
          value: item.PLANT_CODE,
        });
      });
    });
  }

  add(data?: any) {
    this.modal.static(
      ExpandedOutputRateEditComponent,
      { i: data ? data : { Id: null } },
      'lg'
    ).subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  remove(data: any) {
    this.queryService.remove([data.Id]).subscribe(res => {
      if (res.Success) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message || '删除失败'));
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
          if (res.Success) {
            this.msgSrv.success(this.appTranslationService.translate('删除成功'));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.Message || '删除失败'));
          }
        });
      }
    });
  }

  onSelectionChanged() {
    this.getGridSelectionKeys('Id');
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
