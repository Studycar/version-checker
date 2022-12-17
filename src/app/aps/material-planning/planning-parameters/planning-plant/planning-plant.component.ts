import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { PlanningParametersService } from '../planning-parameters.service';
import { ModalHelper } from '@delon/theme';
import { PlanningPlantEditComponent } from '../planning-plant-edit/planning-plant-edit.component';
import { CheckboxModalComponent } from '../checkbox-modal/checkbox-modal.component';
import { GlobalParametersComponent } from '../global-parameters/global-parameters.component';
import { MrpOperatorLibraryComponent } from '../mrp-operator-library/mrp-operator-library.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planning-plant',
  templateUrl: './planning-plant.component.html',
  providers: [PlanningParametersService]
})
export class PlanningPlantComponent extends CustomBaseContext implements OnInit {

  constructor(
    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private queryService: PlanningParametersService,
    private modal: ModalHelper,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  planName: string;
  plantOptions: any[] = [];
  queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: { type: UiType.select, options: this.plantOptions }
      },
      {
        field: 'plantDesc',
        title: '工厂描述',
        ui: { type: UiType.text }
      }
    ],
    values: {
      plantCode: null,
      plantDesc: ''
    }
  };
  columns = [
    {
      colId: 'action',
      field: '',
      headerName: '操作',
      width: 160,
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
    {
      field: 'plantCode',
      headerName: '工厂',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'plantDesc',
      headerName: '工厂描述',
      width: 200,
      menuTabs: ['filterMenuTab'],
    },
  ];
  expColumns = [
    { field: 'plantCode', title: '工厂', width: 150, locked: false },
    { field: 'plantDesc', title: '工厂描述', width: 150, locked: false },
  ];
  @ViewChild('excelexport', { static: true }) excelExport: CustomExcelExportComponent;
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadPlantOptions();
    this.query();
  }

  clear() {
    this.queryParams.values = {
      plantCode: null,
      plantDesc: ''
    };
  }

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonQueryService.loadGridViewNew(
      { url: this.queryService.planningPlantQueryUrl, method: 'POST' },
      this.getQueryParams(),
      this.context
    );
  }

  getQueryParams(isExport: boolean = false) {
    return {
      planName: this.planName,
      plantCode: this.queryParams.values.plantCode,
      plantDesc: this.queryParams.values.plantDesc,
      IS_EXPORT: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  loadPlantOptions() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      this.plantOptions.length = 0;
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode,
          plantDesc: item.descriptions
        });
      });
    });
  }

  add() {
    this.modal.static(
      PlanningPlantEditComponent,
      { planName: this.planName },
      'lg'
    ).subscribe(res => {
      if (res) {
        this.query();
      }
    });
  }

  exportFile() {
    this.commonQueryService.exportAction(
      { url: this.queryService.planningPlantQueryUrl, method: 'POST' },
      this.getQueryParams(true),
      this.excelExport,
      this.context
    );
  }

  demand(data) {
    this.modal.static(
      CheckboxModalComponent,
      {
        title: '需求',
        type: 'demand',
        planName: this.planName,
        plantCode: data.plantCode
      },
      'lg'
    ).subscribe(res => { });
  }

  supply(data) {
    this.modal.static(
      CheckboxModalComponent,
      {
        title: '供应',
        type: 'supply',
        planName: this.planName,
        plantCode: data.plantCode
      },
      'lg'
    ).subscribe(res => { });
  }

  operationParameter(data) {
    this.modal.static(
      GlobalParametersComponent,
      {
        title: '运算参数',
        type: 'operation',
        planName: this.planName,
        plantCode: data.plantCode
      },
      'lg'
    ).subscribe(res => { });
  }

  mrpOperatorLibrary(data) {
    this.modal.static(
      MrpOperatorLibraryComponent,
      {
        planName: this.planName,
        plantCode: data.plantCode,
      },
      'lg'
    ).subscribe(res => { });
  }

  remove(data) {
    const listIds = [data.Id];
    this.queryService.removePlanPlant(data).subscribe(res => {
      if (res.code = 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功！'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
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
