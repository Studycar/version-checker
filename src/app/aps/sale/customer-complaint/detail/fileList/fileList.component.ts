import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper } from '@delon/theme';
import { AttachInfoService } from 'app/aps/sale/attachInfo/attachInfo.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { OssFileService } from 'app/modules/base_module/services/oss-file.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';


@Component({
  selector: 'customer-complaint-detail-annex',
  templateUrl: './fileList.component.html',
  providers: [AttachInfoService]
})
export class CustomerComplaintDetailAnnexComponent extends CustomBaseContext implements OnInit {

  isResolve:boolean = false;
  state: string = '';

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: AttachInfoService,
    public ossFileService: OssFileService,
    public commonQueryService: CommonQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 120, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {template: this.headerTemplate},
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {customTemplate: null}
    },
    { field: 'fileName', headerName: '文件名称', width: 300, menuTabs: ['filterMenuTab', 'columnsMenuTab'], },
    { field: 'fileType', headerName: '文件格式', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'], },
    { field: 'fileSize', headerName: '文件大小', width: 120, menuTabs: ['filterMenuTab', 'columnsMenuTab'], },
    { field: 'fileUrl', headerName: '文件路径', width: 500, menuTabs: ['filterMenuTab', 'columnsMenuTab'], 
      valueFormatter: (params) => {
        return decodeURI(params.value);
      } },
  ];

  id: string = '';

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: '/api/ps/attachInfo/query', method: 'GET' };
  queryCommon() {
    this.commonQueryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context
    )
  }

  getQueryParamsValue() {
    return {
      busId: this.id,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
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

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

}
