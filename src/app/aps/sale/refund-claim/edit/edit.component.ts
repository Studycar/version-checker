import { Component, OnInit, SimpleChanges } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { GridDataResult } from "@progress/kendo-angular-grid";
import { RefundClaimQueryService } from '../query.service';
import * as moment from 'moment';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  providers: [RefundClaimQueryService]
})
export class RefundClaimEditComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: RefundClaimQueryService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
  ) {

  }

  loading = false;
  isModify = false;
  i: any;
  iClone: any;

  businessTypeOptions = [];
  filteredBusinessTypeOptions = [];
  refundStateOptions = []
  payTypeOptions = [];
  payStatusOptions = []
  currencyOptions = []
  YesNoOptions = []
  plantOptions = []
  orgReflectOptions = []

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

  // 初始化
  ngOnInit(): void {
    if (this.i.id) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    } else {
      // 新增
      this.i = {
        currency: '人民币',
        payType: '01',
        personnel: '1',
        urgent: '0'
      }
    }
    this.loadOptions();
  }

  async loadOptions() {
    await this.queryService.GetLookupByTypeRefZip({
      'PS_REFUND_STATE': this.refundStateOptions,
      'PS_PAY_STATUS': this.payStatusOptions,
      'PS_CURRENCY': this.currencyOptions,
      'PS_YES_NOT': this.YesNoOptions,
      'PS_REFUND_TYPE': this.businessTypeOptions,
      'PS_PAY_TYPE': this.payTypeOptions,
      'PS_ORG_REFLECT': this.orgReflectOptions,
    });
    // 业务类型过滤掉“客诉赔付”
    if (this.businessTypeOptions) {
      this.filteredBusinessTypeOptions = (this.businessTypeOptions || []).filter(item => item.value !== 'KSPF')
    }
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
    this.queryService
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
  }

  // 保存
  save(value: any) {
    const params = { ...this.i }
    if (!this.isModify) {
      params.refundState = '10' // 默认“待审批”
      params.payStatus = '10' // 默认“待付款”
      params.endData = moment(new Date()).format('YYYY-MM-DD')
    }
    this.loading = true
    this.queryService.save(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
      this.loading = false
    })
  }

  // 关闭
  close() {
    this.modal.destroy();
  }

  // 重置
  clear() {
    this.i = Object.assign({}, this.iClone);
  }

}