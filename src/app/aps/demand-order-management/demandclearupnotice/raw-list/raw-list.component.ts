
import { Component, OnInit, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { DemandOrderManagementDemandclearupnoticeChooseRawComponent } from './choose-raw/choose-raw.component';
import { QueryService } from './query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demandclearupnotice-raw-list',
  templateUrl: './raw-list.component.html',
  providers: [QueryService]
})
export class DemandOrderManagementDemandclearupnoticeRawListComponent extends CustomBaseContext implements OnInit, AfterViewInit {

  demandOrder: any = {}; // 需求订单信息
  isEditValid: Boolean = false;
  isCanDelete: Boolean = false;
  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: QueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    // { field: 'rawUniqueCode', headerName: '原料信息', width: '200' },
    // { field: 'rawWhCode', headerName: '仓库编码', width: '120' },
    { field: 'rawWhName', headerName: '存货仓库', width: '120' },
    { field: 'rawSkuCode', headerName: '产品编码', width: '120' },
    { field: 'rawSkuName', headerName: '产品名称', width: '120' },
    { field: 'rawSpec', headerName: '规格尺寸', width: '120', filter: 'standardsTypeFilter' },
    { field: 'rawActHeight', headerName: '实厚', width: '100' },
    { field: 'rawSteelGrade', headerName: '钢种', width: '100' },
    { field: 'rawSurface', headerName: '表面', width: '100' },
    { field: 'rawGrade', headerName: '等级', width: '100' },
    { field: 'rawBatchCode', headerName: '批号', width: '120' },
    { field: 'rawQuantity', headerName: '现存量', width: '100' },
    { field: 'rawWhPosCode', headerName: '库位编码', width: '120' },
    // { field: 'rawWhPosName', headerName: '库位名称', width: '120' },
    { field: 'rawInnerGrade', headerName: '内控等级', width: '100' },
    { field: 'rawCr', headerName: '化学成分Cr', width: '100' },
    { field: 'rawProducer', headerName: '产地', width: '120' },
    { field: 'rawCreatedTime', headerName: '入库时间', width: '120' },
    { field: 'quality', headerName: '品质信息', width: '120' },
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        break;
    }
    const option = options.find(x => x.value === value) || { label: value };
    return option;
  }

  queryParams = {
    defines: [
    ],
    values: {
    }
  };

  clear() {
    this.queryParams.values = {
    }
  }

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
  }

  ngAfterViewInit() {
    if(!this.isEditValid) {
      // 不满足可操作条件时，隐藏复选框、操作栏
      this.agGrid.api.setColumnDefs(this.columns.slice(2) as any[]);
    }
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'GET' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue(isExport = false) {
    const params: any = { ...this.queryParams.values };
    params.plantCode = this.demandOrder.plantCode;
    params.projectNumber = this.demandOrder.projectNumber;
    return params;
  }

  add() {
    this.modal.static(
      DemandOrderManagementDemandclearupnoticeChooseRawComponent,
      {
        demandOrder: this.demandOrder
      }
    ).subscribe((value) => {
      if (value) {
        this.query();
      }
    })
  }

  remove(dataItem?: any) {
    const dtos = dataItem === undefined ? this.gridApi.getSelectedRows() : [dataItem];
    if (dtos.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请先勾选数据'));
      return;
    } else {
      // 弹出确认框
      if (dataItem === undefined) {
        this.confirmationService.confirm({
          nzContent: this.appTranslationService.translate('确定要删除吗？'),
          nzOnOk: () => {
            this.delete(dtos);
          },
        });
      } else {
        this.delete(dtos);
      }
    }
  }

  delete(dtos) {
    this.queryService.delete(dtos).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  expColumnsOptions: any[] = [
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.exportFile();
  }

  exportFile() {
    this.queryService.exportAction(
      this.httpAction,
      this.getQueryParamsValue(true),
      this.excelexport,
      this.context
    );
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

}
