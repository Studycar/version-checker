import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { IdeSubmitService } from "app/modules/base_module/services/ide-submit.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { PlanscheduleHWContractService } from "../query.service";
import { decimal } from '@shared';

@Component({
  selector: 'planschedule-hw-contract-edit',
  templateUrl: './edit.component.html',
  providers: [PlanscheduleHWContractService]
})
export class PlanscheduleHWContractEditComponent implements OnInit {
  /**false：新增信息，true：编辑信息 */
  isModify: boolean = false;
  isSave: boolean = false; // 是否已保存
  i: any; 
  iClone: any;
  lastSave: any = {};
  plantOptions = [];
  contractStateOptions = [];
  contractTypeOptions = [];
  contractSteelTypeOptions = [];
  contractSurfaceOptions = [];
  prodNameOptions = [];
  materialOptions = [];
  contractTempOptions = [];
  attachInfoList = [];
  serialNum: string = ''; // 流水号
  taxRate: any = 13; // 税额：从客户信息带出，默认为13

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
    private editService: PlanscheduleHWContractService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    public router: Router,
    private ideSubmitService: IdeSubmitService
  ) { }

  affId: string = ''; // 父合同id
  ngOnInit(): void {
    if(this.i.id) {
      this.isModify = true;
      this.editService.getOne(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
          this.lastSave = Object.assign({}, this.i);
        }
      })
      // 变更协议需要获取父合同id
      if(this.i.contractType === '20' && this.i.affiliatedContract) {
        this.editService.getContracts({
          contractCode: this.i.affiliatedContract,
          pageIndex: 1,
          pageSize: 1
        }).subscribe(res => {
          if(res.code === 200) {
            this.affId = res.data.content[0].id;
          }
        })
      }
    } else {
      this.i.contractState = '10';
      this.i.contractType = '10'; // 合同类型：销售合同
      this.serialNum = this.editService.generateSerial(4);
      this.loadAttachInfo();
    }
    this.loadOptions();
  }

  loadOptions() {
    this.editService.GetLookupByTypeRefAll({
      'PS_CONTRACT_STATE': this.contractStateOptions,
      'PS_CONTRACT_STEEL_TYPE': this.contractSteelTypeOptions,
      'PS_CONTRACT_SURFACE': this.contractSurfaceOptions,
      'PS_PROD_NAME': this.prodNameOptions,
      'HOUBO': this.materialOptions,
    });
    this.editService.GetLookupByType('PS_CONTRACT_TEMPLATE').subscribe(res => {
      if(res.Success) {
        res.Extra.forEach(d => {
          this.contractTempOptions.push({
            label: d.meaning,
            value: d.lookupCode,
            additionCode: d.attribute1,
          })
        })
      }
    });
    this.editService.GetLookupByType('PS_CONTRACT_TYPE').subscribe(res => {
      if(res.Success) {
        res.Extra.forEach(d => {
          // 编辑为子合同、变更协议、解除协议可添加所有，否则只能添加10,50
          if((this.isModify && ['20','30','40'].includes(this.i.contractType)) || ['10', '50'].indexOf(d.lookupCode) > -1) {
            this.contractTypeOptions.push({
              label: d.meaning,
              value: d.lookupCode,
            });
          }
        });
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

  productCategoryOptions: any[] = [];
  async loadAttachInfo() {
    this.productCategoryOptions = await this.editService.getUserProCates();
    // 获取合同模板内容
    this.editService.findAttachList().subscribe(res => {
      res.data.forEach(d => {
        if(['80','90','100'].indexOf(d.attribute5) === -1) {
          if(this.productCategoryOptions.findIndex(item => item.value === d.categoryCode) > -1) {
            this.attachInfoList.push({
              label: d.fileName,
              value: d.id,
              productCategory: d.attribute5,
              categoryCode: d.categoryCode,
            })
          }
        }
      })
    });
  }

  attachChange(e) {
    const product = this.getProduct();
    this.generateContractCode('attach', product.additionCode);
    this.i.categoryCode = product.categoryCode;
  }

  /**
   * 生成合同编码：产品大类+工厂前3位+年月日（20220627）+四位随机数
   */
  produCatPar: string = '';
  plantCodePar: string = '';
  datePar: string = '';
  generateContractCode(type, produCatPar?: string) {
    if(!this.isModify) {
      switch (type) {
        case 'attach':
          this.produCatPar = produCatPar;
          break;
        case 'plantCode':
          this.plantCodePar = this.i.plantCode ? this.i.plantCode.slice(0,3) : '';
          break;
        case 'signingDate':
          this.datePar = this.i.signingDate ? this.editService.formatDate(this.i.signingDate).replace(/[-:\s]/g,'') : '';
          break;
      
        default:
          break;
      }
      this.i.contractCode = this.produCatPar + this.plantCodePar + this.datePar + this.serialNum;
    }
  }

  getProduct() {
    if(!this.i.fileId) {
      return {additionCode: '', categoryCode: ''};
    }
    const attach = this.attachInfoList.find(a => a.value === this.i.fileId);
    const productCategory = attach.productCategory;
    const produCatOption = this.contractTempOptions.find(d => d.value === productCategory);
    return produCatOption ? 
      {additionCode: produCatOption.additionCode, categoryCode: attach.categoryCode} :
      {additionCode: '', categoryCode: ''};
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
   * @param {string} cusAbbreviation  客户简称
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
    this.generateContractCode('plantCode');
  }

  clearCus() {
    this.i.cusCode = '';
    this.i.plantCode = null;
    this.taxRate = 13;
    // 税率更新时：更新未税金额货款
    this.generateAmountWithoutTax();
    this.generateContractCode('plantCode');
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
      this.i.affiliatedContract = '';
    }
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  save(f: NgForm) {
    this.i.quantity = this.i.quantity || 0;
    this.i.quantitySy = this.i.weightTon;
    this.i.quantityUnshipped = this.i.weightTon; // 剩余量
    if(!this.isModify) {
      this.i.quantityDj = 0;
      this.i.quantityShipped = 0; // 已发量
    }
    const params = Object.assign({}, this.i, {
      affiliatedMonth: this.editService.formatDateTime2(this.i.affiliatedMonth, 'yyyy-MM'),
      signingDate: this.editService.formatDate(this.i.signingDate),
      deliveryDate: this.editService.formatDate(this.i.deliveryDate),
    });
    this.editService.save(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        if(!this.i.id) {
          this.i.id = res.data;
        }
        this.lastSave = Object.assign({}, this.i);
        this.isSave = true;
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  submit(f: NgForm) {
    const type = this.isModify ? 'edit' : 'save';
    // this.editService.submit(this.i.id, type).subscribe(res => {
    //   if(res.code === 200) {
    //     this.msgSrv.success(this.appTranslationService.translate('提交成功'));
    //     this.modal.close(true);
    //   } else {
    //     this.msgSrv.error(this.appTranslationService.translate('提交失败'));
    //   }
    // });

    // this.modal.close(true);

    // this.ideSubmitService.navigate('ideContract', {
    //   getFormParams: {
    //     url: this.editService.getFormUrl,
    //     method: 'POST',
    //     params: {
    //       id: this.i.id,
    //     }
    //   },
    //   submitParams: {
    //     url: this.editService[type + 'SubmitUrl'],
    //     method: 'POST',
    //     params: {
    //       id: this.i.id
    //     }
    //   }
    // })

    if(this.i.contractType === '20' && this.affId) {
      const params = {
        attribute1: this.i.attribute1,
        id: this.i.id,
        updateReason: this.i.updateReason
      }
      this.editService.goToIdeContractFlow(this.i.id, {
        modalRef: this.modal,
        submitParams: {
          url: this.editService.modifySubmitUrl,
          method: 'POST',
          params: params
        },
        isModify: true,
        modifyAffId: this.affId // 父合同id
      })
    } else if (this.i.contractType === '40') {
      this.editService.goToIdeContractFlow(this.i.id, {
        modalRef: this.modal,
        submitParams: {
          url: this.editService.cancelSubmitUrl,
          method: 'POST',
          params: {
            id: this.i.id
          }
        },
        isCancel: true,
      })
    } else {
      this.editService.goToIdeContractFlow(this.i.id, {
        modalRef: this.modal,
        submitParams: {
          url: this.editService[type + 'SubmitUrl'],
          method: 'POST',
          params: {
            id: this.i.id
          }
        },
      })
    }
  }

  isNull(value) {
    return value === null || value === '' || value === undefined;
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

  verifyDisabled(type) {
    switch (type) {
      case 'contractType': 
        return this.isModify && ['20', '30', '40'].includes(this.i.contractType);
      default:
        return false;
    }
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
    return f.invalid || !f.dirty;
  }
  /**
   * 控制提交按钮置灰状态
   * @param f 
   * @returns true 置灰 false 可点击
   */
   verifySubmit(f: NgForm) {
    // 如果还未保存则置灰
    if(this.equalLastSave() && !f.invalid) {
      return false;
    }
    return !f.pristine || f.invalid;
  }

  close() {
    this.modal.destroy(this.isSave);
  }
  
}