import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { decimal } from "@shared";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzSelectComponent } from "ng-zorro-antd";
import { PlanscheduleHWContractService } from "../query.service";

@Component({
  selector: 'planschedule-hw-contract-modify',
  templateUrl: './modify.component.html',
  providers: [PlanscheduleHWContractService]
})
export class PlanscheduleHWContractModifyComponent implements OnInit {
  i: any = {}; 
  lastSave: any = {};
  serialNum: string = ''; // 流水号
  sourceContract: any = {}; // 原合同信息
  changeContractId: ''; // 变更协议 id
  plantOptions = [];
  contractStateOptions = [];
  contractTypeOptions = [];
  contractSteelTypeOptions = [];
  prodNameOptions = [];
  contractSurfaceOptions = [];
  materialOptions = [];
  attachInfoList = [];
  firstSave: boolean = false;
  taxRate: any = 13;

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

  @ViewChild('f', {static: true}) f : NgForm;
  constructor(
    private modal: NzModalRef,
    private editService: PlanscheduleHWContractService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit() {
    this.serialNum = this.editService.generateSerial(2);
    this.editService.getOne(this.sourceContract.id).subscribe(res => {
      if(res.code === 200) {
        this.sourceContract = res.data;
        this.i = Object.assign({}, this.sourceContract, {
          contractState: '10',
          contractType: '20', // 合同类型：变更协议
          contractCode: this.sourceContract.contractCode + this.serialNum,
          affiliatedContract: this.sourceContract.contractCode,
          attribute1: this.sourceContract.id,
          priceTime: this.sourceContract.priceTime,
          fileId: this.i.fileId,
          fileName: this.i.fileName,
          filePath: this.i.filePath,
          id: null
        });
        this.lastSave = Object.assign({}, this.i);
      }
    });
    
    this.loadOptions();
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
    this.editService.findAttachList('80').subscribe(res1 => {
      if(res1.code === 200 && res1.data && res1.data.length > 0) {
        res1.data.forEach(d => {
          this.attachInfoList.push({
            label: d.fileName,
            value: d.id
          })
        });
        if(this.attachInfoList.length > 0) {
          this.i.fileId = this.attachInfoList[0].value;
          this.i.fileName = this.attachInfoList[0].label;
          this.lastSave = Object.assign({}, this.i);
        }
      }
    });
    this.editService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        })
      })
    });
  }
  
  /**
   * 生成金额：基价 * 数量
   */
   generateMoney() {
    const weightTon = this.i.weightTon || 0;
    const basePrice = this.i.basePrice || 0;
    this.i.money = decimal.mul(weightTon, basePrice);
    // 金额更新时：更新锁价定金、未税金额货款
    this.generateDeposit();
    this.generateAmountWithoutTax();
  }

  /**
   * 生成未税金额货款：金额 / (1+税率)
   */
   generateAmountWithoutTax() {
    const taxRate = this.taxRate;
    const money = this.i.money || 0;
    this.i.amountWithoutTax = decimal.roundFixed(decimal.div(money, decimal.add(1, decimal.div(taxRate, 100))), 2);
    // 未税金额货款更新时：更新税额
    this.generateTaxAmount();
  }

  /**
   * 生成税额：金额 - 未税金额货款
   */
  generateTaxAmount() {
    const money = this.i.money || 0;
    const amountWithoutTax = this.i.amountWithoutTax || 0;
    this.i.taxAmount = decimal.roundFixed(decimal.minus(money, amountWithoutTax), 2);
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
   * @param {string} cusAbbreviation  客户名称
   * @param {number} PageIndex  页码
   * @param {number} PageSize   每页条数
   */
  public loadCustoms(
    cusAbbreviation: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.editService
      .getCustoms({
        cusAbbreviation: cusAbbreviation,
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
    this.taxRate = data.tax || 13;
    // 税率更新时：更新未税金额货款
    this.generateAmountWithoutTax();
  }

  clearCus() {
    this.i.cusCode = '';
    this.i.plantCode = null;
    this.taxRate = 13;
    // 税率更新时：更新未税金额货款
    this.generateAmountWithoutTax();
  }

  onPopupSelectTextChanged(event: any) {
    const cusAbbreviation = event.Text.trim();
    if(cusAbbreviation !== '') {
      this.editService
      .getCustoms({
        cusAbbreviation: cusAbbreviation,
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
        if((this.i[key] || '') === '') { continue; }
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
      signingDate: this.editService.formatDate(this.i.signingDate),
      deliveryDate: this.editService.formatDate(this.i.deliveryDate),
    })
    this.editService.modifySave(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        if (res.data) {
          if(!this.i.id) {
            this.i.id = res.data;
            this.changeContractId = res.data
          }
        }
        this.lastSave = Object.assign({}, this.i);
        this.firstSave = true;
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  submit(value) {
    const params = {
      attribute1: this.i.attribute1,
      id: this.i.id,
      updateReason: this.i.updateReason
    }
    // this.editService.modifySubmit(params).subscribe(res => {
    //   if(res.code === 200) {
    //     this.msgSrv.success(this.appTranslationService.translate('提交成功'));
    //     this.modal.close(true);
    //   } else {
    //     this.msgSrv.error(this.appTranslationService.translate('提交失败'));
    //   }
    // });
    this.editService.goToIdeContractFlow(this.changeContractId || this.i.id, {
      modalRef: this.modal,
      submitParams: {
        url: this.editService.modifySubmitUrl,
        method: 'POST',
        params
      },
      isModify: true,
      modifyAffId: this.sourceContract.id // 父合同id
    })
  }

  close() {
    this.modal.destroy();
  }
}