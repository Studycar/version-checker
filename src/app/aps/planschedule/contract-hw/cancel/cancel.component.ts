import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { decimal } from "@shared";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { IdeSubmitService } from "app/modules/base_module/services/ide-submit.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { PlanscheduleHWContractService } from "../query.service";

@Component({
  selector: 'planschedule-hw-contract-modify',
  templateUrl: './cancel.component.html',
  providers: [PlanscheduleHWContractService]
})
export class PlanscheduleHWContractCancelComponent implements OnInit {
  i: any = {}; 
  lastSave: any = {};
  serialNum: string = ''; // 流水号
  sourceContract: any = {}; // 原合同信息
  cancelContractId: ''; // 解除协议 id
  plantOptions = [];
  contractStateOptions = [];
  contractTypeOptions = [];
  contractSteelTypeOptions = [];
  prodNameOptions = [];
  contractSurfaceOptions = [];
  materialOptions = [];
  attachInfoList = [];
  firstSave: boolean = false;

  constructor(
    private modal: NzModalRef,
    private editService: PlanscheduleHWContractService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private ideSubmitService: IdeSubmitService,
  ) { }

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
      field: 'plantCode',
      width: 120,
      title: '所属公司'
    },
    {
      field: 'creditCus',
      width: 120,
      title: '信用单位'
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
      field: 'cusGrade',
      width: 120,
      title: '客户等级',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'cusType',
      width: 120,
      title: '客户类型',
      valueFormatter: 'ctx.optionsFind(value,3).label',
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
      field: 'initialCredit',
      width: 120,
      title: '客户初始额度'
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
    {
      field: 'credit',
      width: 120,
      title: '信用额度'
    },
    {
      field: 'zyQuota',
      width: 120,
      title: '占用额度'
    },
    {
      field: 'temCredit',
      width: 120,
      title: '临时信用额度'
    },
    {
      field: 'balance',
      width: 120,
      title: '账户余额'
    },
    {
      field: 'salesmanCode',
      width: 120,
      title: '业务员编码',
    },
    {
      field: 'salesman',
      width: 120,
      title: '业务员',
    },
    {
      field: 'departmentCode',
      width: 120,
      title: '部门编码',
    },
    {
      field: 'department',
      width: 120,
      title: '分管部门',
    },
    {
      field: 'creditControl',
      width: 120,
      title: '是否控制信用额度',
      valueFormatter: 'ctx.optionsFind(value,7).label',
    },
    {
      field: 'tax',
      width: 120,
      title: '税率'
    },
    {
      field: 'disableTime',
      width: 120,
      title: '停用时间'
    },
    {
      field: 'reason',
      width: 120,
      title: '驳回原因'
    },
  ];
  customersOptions = {
    1: { 'PS_CUSTOMER_STATUS': [] },
    2: { 'PS_CUS_GRADE': [] },
    3: { 'CUS_TYPE': [] },
    4: { 'PS_CUS_REGION': [] },
    5: { 'PS_CUS_DOMESTIC': [] },
    6: { 'PS_CURRENCY': [] },
    7: { 'PS_YES_NOT': [] },
  };

  // 绑定合同
  public gridViewContracts: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsContracts: any[] = [
    {
      field: 'contractCode',
      title: '合同编码',
      width: '100'
    },
    {
      field: 'contractState',
      title: '合同状态',
      width: '100'
    }
  ];

  updateLastSave() {
    this.lastSave = Object.assign({}, this.i);
  }

  ngOnInit(): void {
    this.serialNum = this.editService.generateSerial(2);
    this.editService.getOne(this.sourceContract.id).subscribe(res => {
      if(res.code === 200) {
        this.sourceContract = res.data;
        this.i = Object.assign({}, this.sourceContract, {
          contractState: '30',
          contractType: '40', // 合同类型：解除协议
          contractCode: this.sourceContract.contractCode + this.serialNum,
          affiliatedContract: this.sourceContract.contractCode,
          attribute1: this.sourceContract.id,
          priceTime: this.sourceContract.priceTime,
          signingDate: this.editService.formatDate(new Date()),
          id: null,
        });
        this.updateLastSave();
        // 原合同大类为2B时，取消协议为 100（2B-合同取消模板），其它产品大类则对应 90（合同取消模板）
        const contractTemplateCode = this.i.categoryCode === '10' ? '100' : '90'
        this.setTemplate(contractTemplateCode)
      }
    });
    this.loadOptions();
  }

  setTemplate(contractTemplateCode) {
    this.editService.findAttachList(contractTemplateCode).subscribe(res1 => {
      if(res1.code === 200 && res1.data && res1.data.length > 0) {
        res1.data.forEach(d => {
          this.attachInfoList.push({
            label: d.fileName,
            value: d.id
          })
        });
        this.i.fileId = res1.data[0].id;
        this.i.fileName = res1.data[0].fileName;
        this.updateLastSave();
      }
    });
  }

  loadOptions() {
    this.editService.GetLookupByTypeRefAll({
      'PS_CONTRACT_STATE': this.contractStateOptions,
      'PS_CONTRACT_TYPE': this.contractTypeOptions,
      'PS_CONTRACT_STEEL_TYPE': this.contractSteelTypeOptions,
      'PS_CONTRACT_SURFACE': this.contractSurfaceOptions,
      'PS_PROD_NAME': this.prodNameOptions,
      'HOUBO': this.materialOptions,
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
   * 生成金额：基价 * 数量
   */
   generateMoney() {
    const quantity = this.i.quantity || 0;
    const basePrice = this.i.basePrice || 0;
    this.i.money = decimal.mul(quantity, basePrice);
    // 金额更新时：更新锁价定金
    this.generateDeposit();
  }

  /**
   * 生成锁价定金：定金比例 * 金额
   */
  generateDeposit() {
    const money = this.i.money || 0;
    const depositRatio = this.i.depositRatio || 0;
    this.i.deposit = decimal.mul(money, depositRatio, 0.01);
  }

  uploadFile(event: Event) {
    const node = event.target as HTMLInputElement;
    console.log(node.files);
  }
  
  /**
   * 合同弹出查询
   * @param {any} e
   */
   public searchContracts(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadContracts(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载合同
   * @param {string} CONTRACT_CODE  合同编码
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
   public loadContracts(
    CONTRACT_CODE: string,
    PageIndex: number,
    PageSize: number,
  ) {
    // this.editService
    //   .getCustoms()
    //   .subscribe(res => {
    //     this.gridViewCustoms.data = res.data.content;
    //     this.gridViewCustoms.total = res.data.totalElements;
    //   });
  }

  //  行点击事件， 给参数赋值
  onRowSelectContracts(e: any) {
    this.i.affiliatedContract = e.Value;
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
   * @param {string} cusName  客户名称
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
  public loadCustoms(
    cusName: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.editService
      .getCustoms({
        cusName: cusName,
        pageIndex: PageIndex,
        pageSize: PageSize,
        isCusCodeNotNull: true
      })
      .subscribe(res => {
        this.gridViewCustoms.data = res.data.content;
        this.gridViewCustoms.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onRowSelectCustoms(e: any) {
    this.setCus(e.Row);
  }

  setCus(data) {
    this.i.cusCode = data.cusCode;
    this.i.plantCode = data.plantCode;
  }

  clearCus() {
    this.i.cusCode = '';
    this.i.plantCode = null;
  }

  onPopupSelectTextChanged(event: any) {
    const cusName = event.Text.trim();
    if(cusName !== '') {
      this.editService
      .getCustoms({
        cusName: cusName,
        isCusCodeNotNull: true
      })
      .subscribe(res => {
        if(res.data.content.length > 0) {
          this.setCus(res.data.content[0]);
        } else {
          this.clearCus();
          this.msgSrv.info(this.appTranslationService.translate('该客户名称无效！'))
        }
      });
    } else {
      this.clearCus();
    }
  }

  OnSelectTextChange(text) {
    if(text === '') {
      this.i.affiliatedCus = '';
    }
  }

  equalLastSave() {
    for(let key in this.i) {
      if(!this.lastSave.hasOwnProperty(key)) {
        if((this.i[key] || '') === '' || key === 'updateReason') { continue; }
        else { return false; }
      } else if ((this.i[key] || '') !== (this.lastSave[key] || '')) {
        return false;
      }
    }
    return true;
  }

  /**
   * 控制保存按钮置灰状态
   * @param f 
   * @returns true 置灰 false 可点击
   */
   verifySave(f: NgForm) {
    // 如果已经保存未提交，则置灰
    if(this.equalLastSave()) {
      return true;
    }
    return f.invalid;
  }
  /**
   * 控制提交按钮置灰状态
   * @param f 
   * @returns true 置灰 false 可点击
   */
   verifySubmit(f: NgForm) {
    // 如果还未保存则置灰
    if(!this.equalLastSave() || !this.firstSave) {
      return true;
    }
    return f.invalid;
  }

  save(value) {
    const params = Object.assign({}, this.i, {
      affiliatedMonth: this.editService.formatDateTime2(this.i.affiliatedMonth, 'yyyy-MM'),
      deliveryDate: this.editService.formatDate(this.i.deliveryDate),
    })
    this.editService.modifySave(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        if (res.data) {
          this.cancelContractId = res.data
          if(!this.i.id) {
            this.i.id = res.data;
          }
        }
        this.updateLastSave()
        this.firstSave = true;
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  submit(value) {
    this.editService.goToIdeContractFlow(this.cancelContractId || this.i.id, {
      modalRef: this.modal,
      submitParams: {
        url: this.editService.cancelSubmitUrl,
        method: 'POST',
        params: {
          id: this.cancelContractId || this.i.id
        }
      },
      isCancel: true,
    })
  }

  close() {
    this.modal.destroy();
  }
}