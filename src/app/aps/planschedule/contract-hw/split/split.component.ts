import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { PlanscheduleHWContractSplitChildComponent } from "./child-contract/child.component";
import { PlanscheduleHWContractService } from "../query.service";
import { NgForm } from "@angular/forms";
import { decimal } from "@shared";

@Component({
  selector: 'planschedule-hw-contract-split',
  templateUrl: './split.component.html',
  styles: [
    `
      .delBtn {
        color: red; 
        display: inline; 
        border: none;
      }
      .listHeader {
        display: flex; 
        justify-content: space-between; 
        align-items: center;
        padding-right: 8px;
      }
    `
  ],
  providers: [PlanscheduleHWContractService]
})
export class PlanscheduleHWContractSplitComponent implements OnInit {
  sourceContract: any = {};
  i: any = {};
  serialNum: string = '';
  subContractId = ''; // 子合同 id
  childContracts = []; // 包含子合同和变更协议
  lastSave: any = {};
  plantOptions = [];
  contractStateOptions = [];
  contractTypeOptions = [];
  contractSteelTypeOptions = [];
  prodNameOptions = [];
  contractSurfaceOptions = [];
  materialOptions = [];
  isSplit: boolean = false; //是否已拆分保存
  isChildLoading: boolean = false; // 子合同加载
  taxRate: any = 13;
  
  @ViewChild('f', { static: true })f: NgForm;

  reg = /_.*\.pdf$/;

  attachInfoList = [];

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
    public modalHelper: ModalHelper,
    private appconfig: AppConfigService,
    private splitService: PlanscheduleHWContractService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    this.serialNum = this.splitService.generateSerial();
    this.isChildLoading = true;
    this.splitService.getOne(this.sourceContract.id).subscribe(res => {
      if(res.code === 200) {
        this.sourceContract = res.data;
        this.i = Object.assign({}, this.sourceContract);
        // 查询子合同
        this.splitService.getContracts({
          affiliatedContract: this.i.contractCode,
          pageIndex: 1,
          pageSize: 2
        }).subscribe(res => {
          if(res.data.content.length > 0) {
            res.data.content.forEach(d => {
              if(d.contractBusinessType === 'SEPARATE') {
                this.isSplit = true;
                this.childContracts.push(d);
                if(d.contractType === '30') {
                  this.subContractId = d.id;
                }
              }
            })
          }
          this.isChildLoading = false;
        })
      }
    });
    this.loadOptions();
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
    // 获取合同模板内容
    this.splitService.findAttachList().subscribe(res => {
      res.data.forEach(d => {
        this.attachInfoList.push({
          label: d.fileName,
          value: d.id,
        });
      })
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

  generateListContent(item) {
    const contractTypeOption = this.contractTypeOptions.find(o => o.value === item.contractType);
    const contractType = !contractTypeOption ? '' : contractTypeOption.label;
    return `${item.contractCode} 【${contractType}】`;
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
    this.i.taxRate = data.tax || 13;
  }

  clearCus() {
    this.i.cusCode = '';
    this.i.plantCode = null;
    this.i.taxRate = 13;
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
    const contract = Object.assign({}, this.i, {
      affiliatedMonth: this.splitService.formatDateTime2(this.i.affiliatedMonth, 'yyyy-MM'),
      signingDate: this.splitService.formatDate(this.i.signingDate),
      deliveryDate: this.splitService.formatDate(this.i.deliveryDate),
    });
    const params = [
      contract,
      ...this.childContracts
    ]
    this.splitService.splitSave(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.isSplit = true;
        res.data.forEach(d => {
          if (d.contractType === '30') {
            this.subContractId = d.contractId
          }
          if(d.enableFlag === 'Y') {
            this.i.contractId = d.contractId;
            this.i.enableFlag = 'Y';
          } else {
            const index = this.childContracts.findIndex(cc => cc.contractCode === d.contractCode);
            if(index !== -1) {
              this.childContracts[index].contractId = d.contractId;
              // 此时子合同已存在数据库汇总，设置子合同id
              this.childContracts[index].id = d.contractId;
              this.childContracts[index].enableFlag = 'N';
            } else {
              this.childContracts = [Object.assign({}, d, { id:d.contractId }), ...this.childContracts];
            }
          }
        });
        // this.lastSave = Object.assign({}, this.i);
        this.f.control.markAsPristine();
        // this.isChildSave = true;
        // this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  submit(value) {
    const params = [
      {
        contractId: this.i.contractId || this.i.id,
        enableFlag: this.i.enableFlag || 'Y'
      },
      ...this.childContracts.map(cc => ({
        contractId: cc.contractId || cc.id,
        enableFlag: cc.enableFlag || 'N'
      }))
    ];
    // this.splitService.splitSubmit(params).subscribe(res => {
    //   if(res.code === 200) {
    //     this.msgSrv.success(this.appTranslationService.translate('提交成功'));
    //     this.modal.close(true);
    //   } else {
    //     this.msgSrv.error(this.appTranslationService.translate(res.msg));
    //   }
    // });
    this.splitService.goToIdeContractFlow(this.subContractId || this.i.id, {
      modalRef: this.modal,
      submitParams: {
        url: this.splitService.splitSubmitUrl,
        method: 'POST',
        params,
      },
      isSplit: true,
      splitAffId: this.i.id // 父合同id
    })
  }

  addChild(dataItem?: any) {
    this.modalHelper.static(
      PlanscheduleHWContractSplitChildComponent, {
        sourceContract: dataItem === undefined ? 
          Object.assign({}, this.sourceContract, { id: null }) : dataItem,
        isModify: dataItem === undefined ? false : true,
        isExisted: this.isSplit,
      }
    ).subscribe((value) => {
      if(value) {
        if(!value.isModify) {
          this.childContracts = [...this.childContracts, value.contract];
        } else {
          const index = this.childContracts.findIndex(cc => cc.contractCode === value.contract.contractCode);
          if(index !== -1) {
            this.childContracts = [...this.childContracts.slice(0, index), value.contract, ...this.childContracts.slice(index+1)];
          }
        }
        if(value.isDirty) {
          this.f.control.markAsDirty();
        }
      }
      
    })
  }

  delChild() {
    if(this.isSplit) {
      this.isChildLoading = true;
      this.splitService.deleteContract(this.childContracts.map(c => c.id), this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('删除成功'));
          this.isChildLoading = false;
          if(this.i.contractState === '100') {
            // 拆分驳回删除子合同，需要显示原合同状态为已审核30
            this.i.contractState = '30';
          }
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    } else {
      this.msgSrv.success(this.appTranslationService.translate('删除成功'));
    }
    this.childContracts.length = 0;
  }

  /**
   * 控制保存按钮置灰状态
   * @param f 
   * @returns true 置灰 false 可点击
   */
  verifySave(f: NgForm) {
    return !f.dirty || this.childContracts.length === 0;
  }
  /**
   * 控制提交按钮置灰状态
   * @param f 
   * @returns true 置灰 false 可点击
   */
   verifySubmit(f: NgForm) {
    return f.dirty || this.childContracts.length === 0;
  }

  close() {
    this.modal.destroy();
  }
  
}