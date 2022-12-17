import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { BrandService } from "app/layout/pro/pro.service";
import { CommonUploadComponent } from "app/modules/base_module/components/common-upload/common-upload.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { OssFileService } from "app/modules/base_module/services/oss-file.service";
import { NzModalRef, NzMessageService, NzModalService, UploadFile, UploadXHRArgs } from "ng-zorro-antd";
import { CustomerComplaintQueryService } from "../../query.service";

@Component({
  selector: 'customer-complaint-detail-edit',
  templateUrl: './edit.component.html',
  providers: [CustomerComplaintQueryService],
  styles: [
    `
      ::ng-deep .ant-list-sm .ant-list-item {
        padding: 0;
      }
      .file-list {
        display: flex;
        justify-content: space-between;
        color: rgba(0, 0, 0, 0.65);
        font-size: 13px;
        line-height: 1.5;
      }
    `
  ],
})
export class CustomerComplaintDetailEditComponent implements OnInit {
  isModify: Boolean = false;
  isResolve: Boolean = false;
  i: any = {};
  iClone: any = {};
  steelTypeOptions: any[] = []; 
  surfaceOptions: any[] = [];
  thTypeOptions: any[] = [];
  gjszdOptions: any[] = [];
  stateOptions: any[] = [];
  currencyOptions = [];
  payTypeOptions = [];
  cailiaoTypeOptions: any[] = [];
  plantOptions: any[] = [];
  plantCode: string = '';
  cusCode: string = '';
  yesNoOptions = []
  annexs: any[] = [];
  @ViewChild('f', { static: true }) f: NgForm;
  @ViewChild('commonUpload', { static: true }) commonUpload: CommonUploadComponent;

  // 绑定发货单明细
  public gridViewInvoicesDetail: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsInvoicesDetail: any[] = [
    {
      field: 'invoiceBillCode',
      width: 120,
      title: '发货单号'
    },
    {
      field: 'detailedNum',
      width: 120,
      title: '明细行号'
    },
    {
      field: 'state',
      width: 120,
      title: '发货单行状态',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'salesOrderType',
      width: 120,
      title: '销售类型',
      valueFormatter: 'ctx.optionsFind(value,2).label'
    },
    {
      field: 'batchNum',
      width: 120,
      title: '批号',
    },
    {
      field: 'steelType',
      width: 120,
      title: '钢种',
      valueFormatter: 'ctx.optionsFind(value,3).label'
    },
    {
      field: 'standardsType',
      width: 120,
      title: '规格尺寸',
    },
    {
      field: 'distributionWarehouse',
      width: 120,
      title: '配送公仓',
    },
    {
      field: 'quantity',
      width: 120,
      title: '数量',
    },
    {
      field: 'cusCode',
      width: 120,
      title: '客户编码'
    },
    {
      field: 'stockCode',
      width: 120,
      title: '存货编码'
    },
    {
      field: 'shippingAddress',
      width: 120,
      title: '送货地址'
    },
  ];
  invoiceDetailedOptions = {
    1: { 'PS_INVOICE_DETAILED_STATE': [] },
    2: { 'PS_SALES_ORDER_TYPE': [] },
    3: { 'PS_CONTRACT_STEEL_TYPE': [] },
  }

  pflxOptions = [
    {
      label: '吨钢赔付（元/吨）',
      value: 1
    },
    {
      label: '按张赔付（元/张）',
      value: 2
    },
  ];
  pflx: number = 1;

  fileTypes = {
    'application/pdf': 'pdf',
    'image/jpeg': '图片',
    'image/png': '图片',
    'video/mp4': '视频',
  };

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: CustomerComplaintQueryService,
    private ossFileService: OssFileService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit() {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.getDetailedOne(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
          this.annexs = JSON.parse(this.i.annex).map(f => (
            {
              id:f.id, 
              name:f.fileName,
              url:f.fileUrl,
              size:f.fileSize,
            }));
        }
      });
    } else {
      this.i.state = '10';
      this.i.plantCode = this.plantCode;
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_GJSZD': this.gjszdOptions,
      'PS_KSCLZT_DETAILED': this.stateOptions,
      'TH_TYPE': this.thTypeOptions,
      'CAILIAO_TYPE': this.cailiaoTypeOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_PAY_TYPE': this.payTypeOptions,
      'PS_YES_NOT': this.yesNoOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  generatePFJE() {
    const pf = this.pflx === 1 ? this.i.dgpf : this.i.azpf;
    const blpKg = this.i.blpKg;
    this.i.pfje = (pf * blpKg) || 0;
  }

  clearPFLX(value) {
    if(value === 1) {
      this.i.azpf = null;
    } else {
      this.i.dgpf = null;
    }
    this.i.pfje = null;
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  isNumberNull(number) {
    return number === undefined || number === null || number === '';
  }

  save(value) {
    if(this.isResolve) {
      const pf = this.pflx === 1 ? this.i.dgpf : this.i.azpf;
      const blpKg = this.i.blpKg;
      if(this.isNumberNull(pf) && !this.isNumberNull(blpKg)) {
        this.msgSrv.warning(`${this.pflxOptions.find(o => o.value === this.pflx).label} 不能为空`);
        return;
      } else if(!this.isNumberNull(pf) && this.isNumberNull(blpKg)) {
        this.msgSrv.warning(`不良重量/吨 不能为空`);
        return;
      }
    }
    const params = Object.assign({}, this.i, {
    });
    this.queryService.saveDetailed(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        if(!this.isModify) {
          this.i.id = res.data;
        }
        this.updateFile();
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  updateFile() {
    this.commonUpload.deleteFile();
    this.uploadFile();
  }

  uploadFile() {
    const fileList = this.commonUpload.getUploadFileList();
    if(fileList.length > 0) {
      this.ossFileService.batchUploadSave(this.commonUpload.getUploadFileList(), this.i.id).subscribe(res => {
        if(res.code !== 200) {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    }
  }

  /**
   * 钢卷号弹出查询
   * @param {any} e
   */
  public searchInvoicesDetail(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadInvociesDetail(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
     * 加载发货单明细
     * @param {string} batchNum  钢卷号
     * @param {number} pageIndex  页码
     * @param {number} pageSize   每页条数
     */
   public loadInvociesDetail(
    batchNum: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService
      .getInvoiceBillOrderDetail({
        batchNum: batchNum,
        cusCode: this.cusCode,
        plantCode: this.plantCode,
        stateList: ['50', '70'], // 过滤状态列表
        filterKsBatchCode: true, // 过滤客诉明细已存在批号
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewInvoicesDetail.data = res.data.content;
        this.gridViewInvoicesDetail.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onInvoiceDetailSelect(e: any) {
    this.saveInvoiceDetail(e.Row);
  }

  saveInvoiceDetail(data) {
    this.i.batchNum = data.batchNum;
    this.i.steelType = data.steelType;
    this.i.standardsType = data.steelStandart;
    this.i.weigthKg = data.weigthKg;
    this.i.surface = data.surface;
    this.f.form.markAsDirty();
  }

  clearInvoiceDetail() {
    this.i.batchNum = '';
    this.i.steelType = '';
    this.i.standardsType = '';
    this.i.weigthKg = '';
    this.i.surface = '';
  }

  onInvoiceDetailTextChanged(event: any) {
    this.i.batchNum = event.Text.trim();
    if(this.i.batchNum !== '') {
      this.queryService
      .getInvoiceBillOrderDetail({
        batchNum: this.i.batchNum,
        cusCode: this.cusCode,
        plantCode: this.plantCode,
        stateList: ['50', '70'], // 过滤状态列表
        filterKsBatchCode: true, // 过滤客诉明细已存在批号
        pageIndex: 1,
        pageSize: 1
      })
      .subscribe(res => {
        if(res.data.content.length === 0) {
          this.msgSrv.info(this.appTranslationService.translate('钢卷号无效'));
          this.clearInvoiceDetail();
        } else {
          this.saveInvoiceDetail(res.data.content[0]);
        }
      });
    } else {
      this.clearInvoiceDetail();
    }
  }

}