import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { ModalHelper } from '@delon/theme';
import {UiType} from '../../../modules/base_module/components/custom-form-query.component';
import {CustomOperateCellRenderComponent} from '../../../modules/base_module/components/custom-operatecell-render.component';
import {FileDownloadUploadService} from '../../../modules/base_module/services/file-download-upload-service';
import { AttachInfoService } from '../attachInfo/attachInfo.service';
import { AttachInfoEditComponent } from './edit/edit.component';
import { OssFileService } from 'app/modules/base_module/services/oss-file.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'contract-template',
  templateUrl: './contract-template.component.html',
  providers: [AttachInfoService]
})
export class ContractTemplateComponent extends CustomBaseContext implements OnInit {
  @ViewChild('excelExport', { static: true }) excelExport: CustomExcelExportComponent;
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  constructor(
    private pro: BrandService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private modal: ModalHelper,
    private confirmationService: NzModalService,
    private contractService: AttachInfoService,
    private ossFileService: OssFileService,
    public fileDownloadUploadService: FileDownloadUploadService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
  }

  i: any;
  selectBy = 'id';
  context = this;

  businessTypeOptions: any[] = [];
  templateYesNo: any[] = [];
  contractTemplates: any[] = [];
  template: any;

  public queryParams = {
    defines: [
      {
        field: 'busType',
        title: '业务模块',
        readonly: true,
        ui: {
          type: UiType.select,
          options: this.businessTypeOptions
        },
      },
      {
        field: 'fileName',
        title: '附件名称'
      },
      { field: 'attribute2',
        title: '是否模板',
        readonly: true,
        ui: { type: UiType.select, options: this.templateYesNo }
      },

    ],
    values: {
      busType: 'PS_CONTRACT',
      fileName: '',
      attribute2: 'findTemplate'
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {template: this.headerTemplate},
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {customTemplate: null}
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {template: this.headerTemplate}
    },

    { field: 'busType', headerName: '业务模块', width: 100, valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab', 'columnsMenuTab']},
    { field: 'fileName', headerName: '文件名称', width: 300, menuTabs: ['filterMenuTab', 'columnsMenuTab'], },
    { field: 'fileType', headerName: '文件格式', width: 50, menuTabs: ['filterMenuTab', 'columnsMenuTab'], },
    { field: 'fileSize', headerName: '文件大小', width: 50, menuTabs: ['filterMenuTab', 'columnsMenuTab'], },
    { field: 'fileUrl', headerName: '文件路径', width: 500, menuTabs: ['filterMenuTab', 'columnsMenuTab'], 
      valueFormatter: (params) => {
        return decodeURI(params.value);
      } },
    { field: 'attribute5', headerName: '模板类型', width: 300, valueFormatter: 'ctx.optionsFind(value,3).label', menuTabs: ['filterMenuTab', 'columnsMenuTab']},
  ];


  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.headerNameTranslate(this.columns);
    this.query();
    this.loadData().then(() => {
      this.gridApi.setRowData(this.gridData);
    });
  }

  async loadData () {

    /** 业务类型 */
    await this.commonQueryService.GetLookupByTypeRef('PS_BUSINESS_TYPE', this.businessTypeOptions);

    await this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.templateYesNo)

    await this.commonQueryService.GetLookupByTypeRef('PS_CONTRACT_TEMPLATE', this.contractTemplates)

  }


  /**
   * 查询列表
   */
  query() {
    super.query();
    this.queryCommon();
  }

  /**
   * 填充table
   */
  queryCommon() {
    this.commonQueryService.loadGridViewNew(
      { url: this.contractService.url, method: 'GET' },
      this.getQueryParams(),
      this.context,
    );
  }

  /**
   * 查询参数
   * @param isExport
   */
  getQueryParams(isExport: boolean = false) {
    return {
      busType: this.queryParams.values.busType,
      fileName: this.queryParams.values.fileName,
      attribute2: this.queryParams.values.attribute2,
      isExport: isExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      export: isExport
    };
  }

  /**
   * 清空文本框
   */
  clear() {
    this.queryParams.values = {
      busType: 'PS_CONTRACT',
      fileName: null,
      attribute2: 'Y'
    };
  }

  /**
   * 导出
   */
  expColumnsOptions: any[] = [
    { field: 'busType', options: this.businessTypeOptions }
  ];
  exportFile() {
    super.export();
    this.commonQueryService.exportAction(
      { url: this.contractService.url, method: 'GET' },
      this.getQueryParams(true),
      this.excelExport,
      this.context,
    );
  }

  /**
   * 添加
   * @param item
   */
  public add(item?: any) {
    this.modal
      .static(AttachInfoEditComponent, {i: {id: (item !== undefined ? item.id : null)}})
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  /**
   * 批量删除
   */
  public removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要删除的记录！'));
      return;
    }
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除' + '<b><font color="red">&nbsp;' + this.selectionKeys.length + '&nbsp;</font></b>' + '条数据吗？'),
      nzOnOk: () => {
        this.ossFileService
          .deleteFile(this.selectionKeys)
          .subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success(this.appTranslationService.translate('删除成功'));
              this.queryCommon();
            } else {
              this.msgSrv.error(this.appTranslationService.translate(res.msg));
            }
          });
      },
    });
  }

  /**
   * 删除
   * @param data
   */
  delete(data: any) {
    this.ossFileService.deleteFile([data.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  /**
   * 下载附件
   * @param item
   */
  download (item?: any) {
    this.ossFileService.download(item.id, item.fileName);
  }


  /**
   * 附件预览
   * @param item
   */
  public previewFile(item?: any) {
    this.ossFileService.preview(item.id, this.chooseFileType(item.fileType));
  }

  chooseFileType(fileType) {
    switch (fileType) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.pdf':
        return 'application/pdf';
      default: return '';
    }
  }

  /**
   * 行选中改变
   * @param event
   */
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  // 页码切换
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;

  /**
   * 页码切换
   * @param pageNo
   * @param pageSize
   */
  onPageChanged({pageNo, pageSize}) {
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

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.businessTypeOptions;
        break;
      case 2:
        options = this.templateYesNo;
        break;
      case 3:
        options = this.contractTemplates;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

}
