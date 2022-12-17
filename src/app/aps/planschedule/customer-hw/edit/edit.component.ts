import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { HttpRequest, HttpResponse } from "@microsoft/signalr";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { CommonUploadComponent } from "app/modules/base_module/components/common-upload/common-upload.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { IdeSubmitService } from "app/modules/base_module/services/ide-submit.service";
import { OssFileService } from "app/modules/base_module/services/oss-file.service";
import { NzModalRef, NzMessageService, UploadFile, UploadXHRArgs } from "ng-zorro-antd";
import { PlanscheduleHWCustomerService } from "../query.service";

@Component({
  selector: 'planschedule-hw-customer-edit',
  templateUrl: './edit.component.html',
  providers: [PlanscheduleHWCustomerService]
})
export class PlanscheduleHWCustomerEditComponent implements OnInit {
  /**false：新增信息，true：编辑信息 */
  isModify: boolean = false;
  i: any; 
  saveItem: any = {}; // 保存最近一次保存的对象
  iClone: any;
  plantOptions = [];
  cusStateOptions = [];
  regionOptions = [];
  domesticOptions = [];
  currencyOptions = [];
  changeDetail = false;
  annexs:any = [];
  cusGradeOptions: any[] = [];
  cusTypeOptions: any[] = [];

  fileTypes = {
    'application/pdf': 'pdf',
    'image/jpeg': '图片',
    'image/png': '图片',
    'video/mp4': '视频',
  };

  @ViewChild('f', { static: true }) f: NgForm;
  @ViewChild('commonUpload', { static: true }) commonUpload: CommonUploadComponent;

  // 绑定客户
  public gridViewCustoms: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsCustoms: any[] = [
    {
      field: 'cusCode',
      title: '客户编码',
      width: '100'
    },
    {
      field: 'cusName',
      title: '客户名称',
      width: '100'
    }
  ];

  constructor(
    private modal: NzModalRef,
    private editService: PlanscheduleHWCustomerService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    public router: Router,
    private ossFileService: OssFileService,
    private ideSubmitService: IdeSubmitService
  ) { }

  ngOnInit(): void {
    if(this.i.id) {
      this.isModify = true;
      this.editService.getById(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
          this.annexs = this.formatAnnex(this.i.annex);
        }
      })
    } else {
      // 新增时填写默认信息
      // 1. 客户状态默认待审核
      this.i.cusState = '10';
      this.i.initialCredit = 0;
      this.i.domestic = '10';
      this.f.control.markAsDirty();
    }
    this.loadOptions();
  }

  formatAnnex(annex) {
    const newAnnex = JSON.parse(annex);
    const annexs = [];
    for(let key in newAnnex) {
      annexs.push({
        id: key,
        name: newAnnex[key].fileName || newAnnex[key],
      })
    }
    return annexs;
  }

  loadOptions() {
    this.editService.GetLookupByTypeRefAll({
      'PS_CUSTOMER_STATUS': this.cusStateOptions,
      'PS_CUS_GRADE': this.cusGradeOptions,
      'CUS_TYPE': this.cusTypeOptions,
      'PS_CUS_DOMESTIC': this.domesticOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_CUS_REGION': this.regionOptions,
    });
    this.editService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: d.descriptions,
          value: d.plantCode,
        })
      })
    });
  }

  /**
   * 客户弹出查询
   * @param {any} e
   */
   public searchCustoms(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadCustoms(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载客户
   * @param {string} CUS_NAME  客户名称
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
  public loadCustoms(
    CUS_NAME: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.editService
      .getCustoms({
        cusName: CUS_NAME,
        pageIndex: PageIndex,
        pageSize: PageSize,
      })
      .subscribe(res => {
        this.gridViewCustoms.data = res.data.content;
        this.gridViewCustoms.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.i.affiliatedCus = e.Value;
  }

  onPopupSelectTextChanged(event: any) {
    const plantCode = this.i.plantCode;
    const itemCode = event.Text.trim();
    this.i.affiliatedCus = event.Text.trim();
    console.log(this.i.affiliatedCus);
    // if(itemCode == '') { 
    //   this.i.itemId = '';
    //   this.i.descriptions = '';
    //   this.i.unitOfMeasure = '';
    //   return; 
    // }
    // // 加载物料
    // this.editService.getUserPlantItemPageList(plantCode, itemCode, '').subscribe(res => {
    //   if (res.data.content.length > 0) {
    //     this.i.itemId = res.data.content[0].itemId;
    //     this.i.descriptions = res.data.content[0].descriptionsCn;
    //     this.i.unitOfMeasure = res.data.content[0].unitOfMeasure;
    //   }
    // });
  }

  OnSelectTextChange(text) {
    if(text === '') {
      this.i.affiliatedCus = '';
    }
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  checkTax() {
    const reg = /^([^IOZSV][A-Z0-9]){15}$|^([^IOZSV][A-Z0-9]){18}$|^([^IOZSV][A-Z0-9]){20}$/;
    const reReg = /^[^IOZSV]$/; // 不能包含 IOZSV
    return reg.test(this.i.taxNum) && reReg.test(this.i.taxNum);
  }

  async uploadFile() {
    const fileList = this.commonUpload.getUploadFileList();
    if(fileList.length > 0) {
      const res = await this.ossFileService.upload2Save(fileList).toPromise();
      if(res.code === 200) {
        this.saveAnnex(fileList, res.data);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        return false;
      }
    } else {
      this.saveAnnex([], {});
    }
    return true;
  }

  saveAnnex(fileList, data) {
    let annexs = this.commonUpload.annexs;
    annexs = this.commonUpload.annexs.slice(0, annexs.length - fileList.length);
    this.i.annex = Object.assign({}, ...annexs.map(a => ({ [a.id] : a.name })), data);
  }

  async save(value) {
    const deleteRes = await this.commonUpload.deleteFile();
    if(!deleteRes) {
      return;
    }
    const uploadFileRes = await this.uploadFile();
    if(!uploadFileRes) {
      return;
    } 
    const params = Object.assign({}, this.i, {
      annex: JSON.stringify(this.i.annex)
    })
    this.editService.edit(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        if(!this.i.id) {
          this.i.id = res.data.id;
        }
        this.f.control.markAsPristine();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  submit(value) {
    this.modal.close(true);
    this.ideSubmitService.navigate('ideCustomerInfo', {
      getFormParams: {
        url: this.editService.getByIdUrl,
        method: 'GET',
        params: {
          id: this.i.id,
        }
      },
      submitParams: {
        url: this.editService.submitUrl,
        method: 'POST',
        params: {
          ids: [this.i.id]
        }
      },
    })
  }

  /**
   * 控制保存按钮置灰状态
   * @param f 
   * @returns true 置灰 false 可点击
   */
  verifySave(f: NgForm) {
    return f.invalid || !f.dirty || this.commonUpload.annexs.length === 0;
  }
  /**
   * 控制提交按钮置灰状态
   * @param f 
   * @returns true 置灰 false 可点击
   */
   verifySubmit(f: NgForm) {
    return f.invalid || f.dirty;
  }

  close() {
    this.modal.destroy();
  }
  
}