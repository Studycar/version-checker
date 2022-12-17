import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { decimal } from "@shared";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { PlanscheduleHWContractService } from "../../query.service";

@Component({
  selector: 'planschedule-hw-contract-split-child',
  templateUrl: './child.component.html',
  providers: [PlanscheduleHWContractService]
})
export class PlanscheduleHWContractSplitChildComponent implements OnInit {
  i: any = {};
  lastSave: any = {};
  isModify = false;
  sourceContract: any = {};
  serialNum: string = '';
  plantOptions = [];
  contractStateOptions = [];
  contractTypeOptions = [];
  contractSteelTypeOptions = [];
  prodNameOptions = [];
  contractSurfaceOptions = [];
  materialOptions = [];
  taxRate: any = 13;

  attachInfoList = [];
  @ViewChild('f', { static: true }) f: NgForm;

  isExisted: boolean = false; // 子合同是否已存在数据库，已存在则需调用编辑接口
  iClone: any = {};
  
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

  constructor(
    private modal: NzModalRef,
    private splitService: PlanscheduleHWContractService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit() {
    // 重新生成子合同流水号，
    this.serialNum = this.splitService.generateSerial(2);
    if(this.sourceContract.id) {
      this.isModify = true;
      this.splitService.getOne(this.sourceContract.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
          this.lastSave = Object.assign({}, this.i);
        }
      });
    } else {
      this.i = Object.assign({}, this.sourceContract);
      // 子合同新增时进行数据初始化
      if(!this.isModify) {
        Object.assign(this.i, {
          contractState: '10',
          contractType: '30',
          contractCode: this.sourceContract.contractCode + this.serialNum,
          priceTime: this.sourceContract.priceTime,
          affiliatedContract: this.sourceContract.contractCode
        });
      }
      this.lastSave = Object.assign({}, this.i);
      this.f.control.markAsDirty();
    }
    this.loadOptions();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  loadOptions() {
    this.splitService.GetLookupByTypeRefAll({
      'PS_CONTRACT_STATE': this.contractStateOptions,
      'PS_CONTRACT_TYPE': this.contractTypeOptions,
      'PS_CONTRACT_STEEL_TYPE': this.contractSteelTypeOptions,
      'PS_CONTRACT_SURFACE': this.contractSurfaceOptions,
      'PS_PROD_NAME': this.prodNameOptions,
      'HOUBO': this.materialOptions,
    });
    this.splitService.findAttachList('', 'PS_CONTRACT', 'Y', this.i.categoryCode).subscribe(res1 => {
      if(res1.code === 200 && res1.data && res1.data.length > 0) {
        res1.data.forEach(d => {
          if(d.attribute5 !== '100') {
            this.attachInfoList.push({
              label: d.fileName,
              value: d.id
            })
          }
        });
        if(!this.i.id) {
          this.i.fileId = res1.data[0].id;
          this.i.fileName = res1.data[0].fileName;
          this.i.categoryCode = res1.data[0].categoryCode;
          this.lastSave = Object.assign({}, this.i);
        }
      }
    });
    this.splitService.GetAppliactioPlant().subscribe(res => {
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
   * 生成锁价定金：定金比例(%) * 金额
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
    // this.splitService
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
    this.splitService
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
      this.splitService
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

  save(value) {
    if(this.i.id) {
      const params = Object.assign({}, this.i, {
        affiliatedMonth: this.splitService.formatDateTime2(this.i.affiliatedMonth, 'yyyy-MM'),
        signingDate: this.splitService.formatDate(this.i.signingDate),
        deliveryDate: this.splitService.formatDate(this.i.deliveryDate),
        quantitySy: this.i.weightTon,
        quantityUnshipped: this.i.weightTon,
      })
      this.splitService.save(params).subscribe(res => {
        if(res.code === 200) {
          this.modal.close({
            contract: this.i,
            isModify: this.isModify,
            isSave: true
          })
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      })
    } else {
      this.i.quantity = this.i.quantity || 0;
      const contract = Object.assign({}, this.i, {
        affiliatedMonth: this.i.affiliatedMonth instanceof Date ? this.splitService.formatDateTime2(this.i.affiliatedMonth, 'yyyy-MM') : this.i.affiliatedMonth,
        signingDate: this.i.signingDate instanceof Date ? this.splitService.formatDate(this.i.signingDate) : this.i.signingDate,
        quantitySy: this.i.weightTon,
        quantityUnshipped: this.i.weightTon,
        quantityDj: 0,
        quantityShipped: 0,
      });
      this.modal.close({
        contract: contract,
        isModify: this.isModify,
        isSave: true,
        isDirty: this.f.dirty
      })
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
    if(this.equalLastSave()) {
      return true;
    }
    return f.invalid || !f.dirty;
  }

  add() {
    
  }

  close() {
    this.modal.destroy();
  }
  
}