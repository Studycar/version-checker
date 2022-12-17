import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { CommonUploadComponent } from "app/modules/base_module/components/common-upload/common-upload.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { IdeSubmitService } from "app/modules/base_module/services/ide-submit.service";
import { OssFileService } from "app/modules/base_module/services/oss-file.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { PlanscheduleHWCustomerService } from "../query.service";

@Component({
  selector: 'planschedule-hw-customer-edit',
  templateUrl: './edit.component.html',
  providers: [PlanscheduleHWCustomerService]
})
export class PlanscheduleHWCustomerNewEditComponent implements OnInit {
  /**false：新增信息，true：编辑信息 */
  isModify: boolean = false;
  i: any; 
  head: any = {}; 
  saveItem: any = {}; // 保存最近一次保存的对象
  iClone: any;
  plantOptions = [];
  cusStateOptions = [];
  regionOptions = [];
  domesticOptions = [];
  YesNoOptions = [];
  currencyOptions = [];
  changeDetail = false;
  annexs:any = [];
  cusGradeOptions: any[] = [];
  cusTypeOptions: any[] = [];
  isHeadModify: boolean = true; // 表头是否新增
  columns: any[] = [];
  taxNumPattern = /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/;

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
      width: 120,
      title: '客户编码'
    },
    {
      field: 'affiliatedCus',
      width: 120,
      title: '所属客户'
    },
    {
      field: 'cusState',
      width: 120,
      title: '客户状态',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'cusName',
      width: 120,
      title: '客户名称'
    },
    {
      field: 'cusAbbreviation',
      width: 120,
      title: '客户简称'
    },
    {
      field: 'taxNum',
      width: 120,
      title: '税号'
    },
    {
      field: 'contact',
      width: 120,
      title: '联系人'
    },
    {
      field: 'region',
      width: 120,
      title: '地区分类',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'address',
      width: 120,
      title: '地址'
    },
    {
      field: 'telNum',
      width: 120,
      title: '联系电话'
    },
    {
      field: 'bank',
      width: 120,
      title: '开户银行'
    },
    {
      field: 'bankNum',
      width: 120,
      title: '银行账号'
    },
    {
      field: 'bankArchives',
      width: 120,
      title: '银行档案'
    },
    {
      field: 'domestic',
      width: 120,
      title: '是否国内',
      valueFormatter: 'ctx.optionsFind(value,5).label',
    },
    {
      field: 'currency',
      width: 120,
      title: '币种',
      valueFormatter: 'ctx.optionsFind(value,6).label',
    },
  ];
  customersOptions = {
    1: {'PS_CUSTOMER_STATUS': []},
    2: {'PS_CUS_REGION': []},
    3: {'PS_CUS_DOMESTIC': []},
    4: {'PS_CURRENCY': []},
  };

  // 绑定业务员
  public gridViewUsers: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsUsers: any[] = [
    {
      field: 'plantCode',
      title: '工厂编码',
      width: '100'
    },
    {
      field: 'personCode',
      title: '人员编码',
      width: '100'
    },
    {
      field: 'personName',
      title: '人员名称',
      width: '100'
    },
    {
      field: 'depCode',
      title: '部门编码',
      width: '100'
    },
    {
      field: 'depName',
      title: '部门名称',
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
    this.getColumns();
    if(this.i.id) {
      this.isModify = true;
      this.isHeadModify = true;
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
      this.i.creditControl = '0';
      this.i.initialCredit = 0;
      this.i.tax = 13;
      this.i.defaultFlag = '1';
      this.i.domestic = '10'; // 是否国内：国内
      this.i.currency = '人民币'; // 币种：人民币
      this.i.cusGrade = '40'; // 客户等级：普通客户
      this.i.cusType = '40'; // 客户类型：普通客户
      this.i.creditControl = '1'; // 是否控制信用额度：是
      this.i.developmentDate = new Date();
      this.f.control.markAsDirty();
      if(this.head.taxNum) {
        this.isHeadModify = true;
        this.setHead(this.head);
      }
    }
    this.loadOptions();
  }

  // 获取动态列
  getColumns() {
    this.editService.GetLookupByType('PS_CUS_CUSTOMIZATION').subscribe(res => {
      if(res.Success && res.Extra.length > 0) {
        this.columns.splice(this.columns.length - 4, 0, ...res.Extra.map(d => ({
          field: d.lookupCode,
          headerName: d.meaning,
        })));
        this.f.form.updateValueAndValidity();
      }
    })
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

  async loadOptions() {
    this.editService.GetLookupByTypeRefAll({
      'PS_CUSTOMER_STATUS': this.cusStateOptions,
      'PS_CUS_GRADE': this.cusGradeOptions,
      'CUS_TYPE': this.cusTypeOptions,
      'PS_CUS_DOMESTIC': this.domesticOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_CUS_REGION': this.regionOptions,
      'PS_YES_NOT': this.YesNoOptions,
    });
    this.plantOptions.push(...await this.editService.getUserPlants());
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
      .getCustomsFull({
        cusName: CUS_NAME,
        isCusCodeNotNull: true,
        pageIndex: PageIndex,
        pageSize: PageSize,
      })
      .subscribe(res => {
        this.gridViewCustoms.data = res.data.content;
        this.gridViewCustoms.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onRowSelect(e: any, valueKey: string) {
    this.i[valueKey] = e.Value;
  }

  onPopupSelectTextChanged(event: any, valueKey: string, key?: string) {
    const value = event.Text.trim();
    if(value !== '') {
      this.editService
      .getCustomsFull({
        cusName: value,
        isCusCodeNotNull: true,
        pageIndex: 1,
        pageSize: 1,
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.i[valueKey] = res.data.content[0][key ? key : 'cusName'];
        } else {
          this.i[valueKey] = '';
        }
      });
    }
  }

  taxNumChanged(e) {
    if((e || '') === '' || !this.taxNumPattern.test(e)) {
      this.isHeadModify = true;
      return;
    }
    // 查询表头
    this.editService.getByTaxNum(e).subscribe(res => {
      if(res.code === 200 && res.data) {
        this.isHeadModify = true;
        this.setHead(res.data);
      } else {
        this.isHeadModify = false;
        this.clearHead();
      }
    });
  }

  cusNameChanged(e) {
    if((e || '') === '') { return; }
    this.i.accountName = e;
  }

  setHead(data) {
    this.i.taxNum = data.taxNum;
    this.i.cusCode = data.cusCode;
    this.i.affiliatedCus = data.affiliatedCus;
    this.i.cusName = data.cusName;
    this.i.cusAbbreviation = data.cusAbbreviation;
    this.i.region = data.region;
    this.i.address = data.address;
    this.i.telNum = data.telNum;
    this.i.branch = data.bank;
    this.i.accountNum = data.bankNum;
    this.i.accountName = data.accountName;
    this.i.branchId = data.branchId;
    this.i.bankArchives = data.bankArchives;
    this.i.developmentDate = data.developmentDate;
    this.i.domestic = data.domestic;
    this.i.currency = data.currency;
  }

  clearHead() {
    if(this.i.cusCode) {
      this.i.cusCode = '';
      this.i.affiliatedCus = '';
      this.i.cusName = '';
      this.i.cusAbbreviation = '';
      this.i.region = null;
      this.i.address = '';
      this.i.telNum = '';
      this.i.branch = '';
      this.i.accountNum = '';
      this.i.accountName = '';
      this.i.branchId = '';
      this.i.bankArchives = '';
      this.i.developmentDate = null;
      this.i.domestic = '10'; // 是否国内：国内
      this.i.currency = '人民币'; // 币种：人民币
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
    return true
  }

  saveAnnex(fileList, data) {
    let annexs = this.commonUpload.annexs;
    annexs = this.commonUpload.annexs.slice(0, annexs.length - fileList.length);
    this.i.annex = Object.assign({}, ...annexs.map(a => ({ [a.id] : a.name })), data);
  }

  async save(value) {
    if (!this.isHeadModify && this.i.cusName === this.i.cusAbbreviation) {
      this.msgSrv.warning(this.appTranslationService.translate('客户名称不能与客户简称重复！'));
      return;
    }
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
   * 业务员弹出查询
   * @param {any} e
   */
   public searchUsers(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadUsers(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载客户
   * @param {string} userName  用户名
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadUsers(
    userName: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.editService.getSalemans({
      personName: userName,
      pageIndex: pageIndex,
      pageSize: pageSize
    }).subscribe(res => {
      this.gridViewUsers.data = res.data.content;
      this.gridViewUsers.total = res.data.totalElements;
    })
  }

  //  行点击事件， 给参数赋值
  onUsersSelect(e: any) {
    this.setSalesMan(e.Row);
  }

  onUsersTextChanged(event: any) {
    this.i.salesman = event.Text.trim();
    if(this.i.salesman !== '') {
      this.editService
      .getSalemans({
        personName: this.i.salesman,
        pageIndex: 1,
        pageSize: 1 
      })
      .subscribe(res => {
        if(res.data.content.length === 0) {
          this.msgSrv.info(this.appTranslationService.translate('业务员无效'));
          this.clearSalesMan();
        } else {
          this.setSalesMan(res.data.content[0]);
        }
      });
    } else {
      this.clearSalesMan();
    }
  }

  setSalesMan(data) {
    this.i.salesman = data.personName;
    this.i.salesmanCode = data.personCode;
    this.i.department = data.depName;
    this.i.departmentCode = data.depCode;
  }

  clearSalesMan() {
    this.i.salesman = '';
    this.i.salesmanCode = '';
    this.i.department = '';
    this.i.departmentCode = '';
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