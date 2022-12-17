// import { Injectable } from '@angular/core';
// import { IdeCustomerInfoComponent } from './pages/customer-info/ide-customer-info.component';
// import { IdeCustomerInfoChangeComponent } from './pages/customer-info-change/ide-customer-info-change.component';
// import { IdeCustomerDetailInfoChangeComponent } from './pages/customer-detail-info-change/ide-customer-detail-info-change.component';
// import { IdeCustomerStatusComponent } from './pages/customer-status/ide-customer-status.component';
// import { IdeContractComponent } from './pages/contract/ide-contract.component';
// import { IdeCustomerChangeOrderComponent } from './pages/customer-change-order/ide-customer-change-order.component';
// import { IdeSalesOrderComponent } from './pages/sales-order/ide-sales-order.component';
// import { IdeCreditLineComponent } from './pages/credit-line/ide-credit-line.component';
// import { IdeComplaintHandleComponent } from './pages/complaint-handle/ide-complaint-handle.component';
// import { IdeComplaintRectifyComponent } from './pages/complaint-rectify/ide-complaint-rectify.component';
// import { IdeRefundClaimComponent } from './pages/refund-claim/ide-refund-claim.component';

export const routeTable = [
  // 客户信息审核
  // formData 加入 businessType: 'customerInfo'
  {
    path: 'ideCustomerInfo',
    formCode: 'CUS_INFO_FORM',
    // component: IdeCustomerInfoComponent,
    flowName: '客户信息审核'
  },

  // 客户信息变更
  // 重用【客户信息审核】流程模型，formData 加入 businessType: 'customerInfoChange'
  {
    path: 'ideCustomerInfoChange',
    formCode: 'CUS_INFO_FORM',
    // component: IdeCustomerInfoChangeComponent,
    flowName: '客户信息主数据变更'
  },

  // 客户明细信息变更
  // 重用【客户信息审核】流程模型，formData 加入 businessType: 'customerDetailInfoChange'
  {
    path: 'ideCustomerDetailInfoChange',
    formCode: 'CUS_INFO_FORM',
    // component: IdeCustomerDetailInfoChangeComponent,
    flowName: '客户信息账套数据变更'
  },

  // 客户状态变更
  {
    path: 'ideCustomerStatus',
    formCode: 'CUS_STATE_FORM',
    // component: IdeCustomerStatusComponent,
    flowName: '客户状态变更'
  },

  // 客户银行信息变更
  {
    path: 'ideCustomerBanksChange',
    formCode: 'CUS_BANK_CHANGE',
    // component: IdeCustomBankComponent,
    flowName: '客户银行信息变更'
  },
  
  // 正常盘价合同审批
  {
    path: 'ideContract',
    formCode: 'CONTRACT_NORMAL_PRICE_FORM',
    // component: IdeContractComponent,
    flowName: '正常盘价合同审批'
  },

  // 差异价格合同审批
  {
    path: 'ideContractDiff',
    formCode: 'CONTRACT_DIFF_PRICE_FORM',
    // component: IdeContractComponent,
    flowName: '差异价格合同审批'
  },
  
  // 正常盘价合同审批-拆分
  {
    path: 'ideContractSplit',
    formCode: 'CONTRACT_NORMAL_PRICE_FORM',
    formCodeType: 'split',
    // component: IdeContractSplitComponent,
    flowName: '正常盘价合同审批'
  },

  // 差异价格合同审批-拆分
  {
    path: 'ideContractSplitDiff',
    formCode: 'CONTRACT_DIFF_PRICE_FORM',
    formCodeType: 'split',
    // component: IdeContractSplitComponent,
    flowName: '差异价格合同审批'
  },
  
  // 正常盘价合同审批-变更
  {
    path: 'ideContractModify',
    formCode: 'CONTRACT_NORMAL_PRICE_FORM',
    formCodeType: 'modify',
    // component: IdeContractSplitComponent,
    flowName: '正常盘价合同审批'
  },

  // 差异价格合同审批-变更
  {
    path: 'ideContractModifyDiff',
    formCode: 'CONTRACT_DIFF_PRICE_FORM',
    formCodeType: 'modify',
    // component: IdeContractSplitComponent,
    flowName: '差异价格合同审批'
  },

  // 正常盘价合同取消
  {
    path: 'ideContractCancel',
    formCode: 'CONTRACT_NORMAL_PRICE_FORM',
    flowName: '解除合同审批流程',
    formCodeType: 'cancel',
  },

  // 差异价格合同取消
  {
    path: 'ideContractCancelDiff',
    formCode: 'CONTRACT_DIFF_PRICE_FORM',
    flowName: '解除合同审批流程',
    formCodeType: 'cancel',
  },

  // 客户订单变更审批
  {
    path: 'ideCustomerChangeOrder',
    formCode: 'CHANGE_ORDER_FORM',
    // component: IdeCustomerChangeOrderComponent,
    flowName: '客户订单变更审批'
  },

  // 价格模型审批
  // { path: 'idePriceModel', formCode: 'PRICE_MODAL' },

  // 销售订单价格复核审批
  {
    path: 'ideSalesOrder',
    formCode: 'SALE_ORDER_PRICE_REVIEW',
    // component: IdeSalesOrderComponent,
    flowName: '销售订单价格复核'
  },

  // 销售订单按合同高价先出审批
  {
    path: 'ideSalesOrderHighPrice',
    formCode: 'HIGHER_SALES_CONTRACT',
    // component: IdeSalesOrderComponent,
    flowName: '销售合同高价先出'
  },

  // 信用额度申请审批
  {
    path: 'ideCreditLine',
    formCode: 'CREDIT_APPLY_FORM',
    // component: IdeCreditLineComponent,
    flowName: '临时信用额度申请'
  },

  // 年度信用额度申请审批
  {
    path: 'ideAnnualCreditLine',
    formCode: 'CREDIT_APPLY_ANNUAL_FORM',
    // component: IdeCreditLineComponent,
    flowName: '年度信用额度申请'
  },

  // 客诉处理意见审批(小额)
  {
    path: 'ideComplaintHandleSmall',
    formCode: 'COMPLAINT_SMALL_FORM',
    // component: IdeComplaintHandleComponent,
    flowName: '小额客诉处理意见审批'
  },

  // 客诉处理意见审批(大额)
  {
    path: 'ideComplaintHandleLarge',
    formCode: 'COMPLAINT_LARGE_FORM',
    // component: IdeComplaintHandleComponent,
    flowName: '大额客诉处理意见审批'
  },

  // 客诉处理退/换货审批
  {
    path: 'ideComplaintHandleReturnOrExchange',
    formCode: 'RETURN_ORDER_FORM',
    // component: IdeComplaintHandleComponent,
    flowName: '退换货审批'
  },

  // 发起客诉整改
  {
    path: 'ideComplaintRectify',
    formCode: 'COMPLAINT_RECTIFY_FORM',
    // component: IdeComplaintRectifyComponent,
    flowName: '整改建议审批'
  },

  // 手工退款申请
  {
    path: 'ideRefundClaim',
    formCode: 'REFUND_REQUEST_FORM',
    // component: IdeRefundClaimComponent,
    flowName: '手工退款申请'
  },

  // 正常现货合同新增
  {
    path: 'ideCurContractAdd',
    formCode: 'SPOT_CONTRACT',
    formCodeType: 'add',
    // component: IdeCurContractComponent,
    flowName: '正常现货合同新增审批'
  },

  // 正常现货合同取消
  {
    path: 'ideCurContractCancel',
    formCode: 'SPOT_CONTRACT',
    formCodeType: 'cancel',
    // component: IdeCurContractComponent,
    flowName: '正常现货合同取消审批'
  },

  // 正常现货合同变更
  {
    path: 'ideCurContractChange',
    formCode: 'SPOT_CONTRACT',
    formCodeType: 'change',
    // component: IdeCurContractComponent,
    flowName: '正常现货合同变更审批'
  },

  // 差异现货合同新增
  {
    path: 'ideCurContractAddDiff',
    formCode: 'DIFF_SPOT_CONTRACT',
    formCodeType: 'add',
    // component: IdeCurContractComponent,
    flowName: '差异现货合同新增审批'
  },

  // 差异现货合同取消
  {
    path: 'ideCurContractCancelDiff',
    formCode: 'DIFF_SPOT_CONTRACT',
    formCodeType: 'cancel',
    // component: IdeCurContractComponent,
    flowName: '差异现货合同取消审批'
  },

  // 差异现货合同变更
  {
    path: 'ideCurContractChangeDiff',
    formCode: 'DIFF_SPOT_CONTRACT',
    formCodeType: 'change',
    // component: IdeCurContractComponent,
    flowName: '差异现货合同变更审批'
  },
];

// @Injectable()
// export class IdeRouteTableService {
//   getData() {
//     return routeTable || []
//   }
// }
