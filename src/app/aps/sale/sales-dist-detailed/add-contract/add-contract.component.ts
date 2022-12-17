import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { decimal } from "@shared";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { IdeSubmitService } from "app/modules/base_module/services/ide-submit.service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { SalesCurContractQueryService } from "../../sales-cur-contract/query.service";
import { SalesDistDetailedQueryService } from "../query.service";

@Component({
  selector: 'add-contract',
  templateUrl: './add-contract.component.html',
  providers: [SalesDistDetailedQueryService, SalesCurContractQueryService]
})
export class AddContractComponent implements OnInit {
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
  productCategoryOptions = [];
  prodNameOptions = [];
  materialOptions = [];
  contractTempOptions = [];
  attachInfoList = [];
  serialNum: string = ''; // 流水号
  salesDistDetailedDTOList: any[] = [];
  produCatPar: string = ''; // 保存产品大类标识，用于合同编号命名

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
    private salesDistDetailedQueryService: SalesDistDetailedQueryService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    public router: Router,
    public salesCurContractQueryService: SalesCurContractQueryService,
    private ideSubmitService: IdeSubmitService
  ) { }

  ngOnInit(): void {
    if(this.i.id) {
      this.isModify = true;
      this.salesCurContractQueryService.getOne(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
          this.lastSave = Object.assign({}, this.i);
        }
      })
    } else {
      this.i.contractState = '10';
      this.i.contractType = '70'; // 合同类型：现货合同
      this.i.deliveryDate = new Date();
      this.i.categoryCode = this.salesDistDetailedDTOList[0].productCategory;
      {
        // 客户信息
        this.i.cusCode = this.salesDistDetailedDTOList[0].cusCode;
        this.i.cusAbbreviation = this.salesDistDetailedDTOList[0].cusAbbreviation;
        this.i.plantCode = this.salesDistDetailedDTOList[0].plantCode;
      }
      this.serialNum = this.salesDistDetailedQueryService.generateSerial(4);
    }
    this.loadOptions();
  }

  loadOptions() {
    this.salesCurContractQueryService.GetLookupByTypeRefAll({
      'PS_CONTRACT_STATE': this.contractStateOptions,
      'PS_CONTRACT_TYPE': this.contractTypeOptions,
    });
    this.salesCurContractQueryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
          descriptions: d.descriptions
        })
      })
    });
    this.salesCurContractQueryService.findAttachList('', 'PS_CONTRACT', 'xhht').subscribe(res1 => {
      if(res1.code === 200 && res1.data && res1.data.length > 0) {
        res1.data.forEach(d => {
          this.attachInfoList.push({
            label: d.fileName,
            value: d.id,
            fileUrl: d.fileUrl
          })
        });
      }
    });
    this.salesCurContractQueryService.GetLookupByType('PS_PRODUCT_CATEGORY').subscribe(res => {
      if(res.Success && res.Extra && res.Extra.length > 0) {
        for(let i = 0; i < res.Extra.length; i++) {
          if(res.Extra[i].lookupCode === this.i.categoryCode) {
            this.produCatPar = res.Extra[i].additionCode;
            this.i.contractCode = this.produCatPar;
            break;
          }
        }
      }
    })
  }

  attachChange(e) {
    this.i.attachInfoPath = this.attachInfoList.find(item => item.value === this.i.attachInfoId).fileUrl;
  }

  plantChange(e) {
    this.i.plantName = this.plantOptions.find(item => item.value === this.i.plantCode).descriptions;
  }

  /**
   * 生成合同编码：工厂前3位+年月日（20220627）+四位随机数
   */
  plantCodePar: string = '';
  datePar: string = '';
  generateContractCode(type, produCatPar?: string) {
    if(!this.isModify) {
      switch (type) {
        case 'plantCode':
          this.plantCodePar = this.i.plantCode ? this.i.plantCode.slice(0,3) : '';
          break;
        case 'signingDate':
          this.datePar = this.i.signingDate ? this.salesCurContractQueryService.formatDate(this.i.signingDate).replace(/[-:\s]/g,'') : '';
          break;
      
        default:
          break;
      }
      this.i.contractCode = this.produCatPar + this.plantCodePar + this.datePar + this.serialNum;
    }
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
    this.salesCurContractQueryService
      .getContracts({})
      .subscribe(res => {
        this.gridViewContracts.data = res.data.content;
        this.gridViewContracts.total = res.data.totalElements;
      });
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
    this.salesCurContractQueryService
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
    this.i.cusAbbreviation = data.cusAbbreviation;
    this.i.plantCode = data.plantCode;
    this.generateContractCode('plantCode');
    this.plantChange(null);
  }

  clearCus() {
    this.i.cusCode = '';
    this.i.cusAbbreviation = '';
    this.i.plantCode = null;
    this.i.plantName = null;
    this.generateContractCode('plantCode');
  }

  onPopupSelectTextChanged(event: any) {
    const cusName = event.Text.trim();
    if(cusName !== '') {
      this.salesCurContractQueryService
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
      this.i.affiliatedContract = '';
    }
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  save(f: NgForm) {
    const params = Object.assign({}, this.i, {
      affiliatedMonth: this.salesCurContractQueryService.formatDateTime2(this.i.affiliatedMonth, 'yyyy-MM'),
      signingDate: this.salesCurContractQueryService.formatDate(this.i.signingDate),
      salesDistDetailedDTOList: this.salesDistDetailedDTOList,
    });
    this.salesCurContractQueryService.save(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.i = res.data;
        this.lastSave = Object.assign({}, this.i);
        this.isSave = true;
        localStorage.setItem('SALES_CUR_CONTRACT_CODE', this.i.contractCode);
        this.router.navigateByUrl(`/sale/salesCurContractDetail`);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  submit(f: NgForm) {

    this.salesCurContractQueryService.goToIdeCurContractFlow(this.i.id, {
      modalRef: this.modal,
      contractCode: this.i.contractCode,
      businessType: 'add'
    })
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
    if(this.equalLastSave()) {
      return false;
    }
    return !f.pristine || f.invalid;
  }

  close() {
    this.modal.destroy(this.isSave);
  }
  
}