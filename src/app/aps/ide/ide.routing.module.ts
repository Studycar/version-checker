import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IdeListComponent } from "./list/ide-list.component";
import { IdePortalComponent } from "./portal/ide-portal.component";
import { IdeCustomerInfoComponent } from "./pages/customer-info/ide-customer-info.component";
import { IdeCustomerInfoChangeComponent } from "./pages/customer-info-change/ide-customer-info-change.component";
import { IdeCustomerDetailInfoChangeComponent } from "./pages/customer-detail-info-change/ide-customer-detail-info-change.component";
import { IdeCustomerStatusComponent } from "./pages/customer-status/ide-customer-status.component";
import { IdeContractComponent } from "./pages/contract/ide-contract.component";
import { IdeContractCancelComponent } from "./pages/contract-cancel/ide-contract-cancel.component";
import { IdeCustomerChangeOrderComponent } from "./pages/customer-change-order/ide-customer-change-order.component";
import { IdeSalesOrderComponent } from "./pages/sales-order/ide-sales-order.component";
import { IdeCreditLineComponent } from "./pages/credit-line/ide-credit-line.component";
import { IdeComplaintHandleComponent } from "./pages/complaint-handle/ide-complaint-handle.component";
import { IdeComplaintRectifyComponent } from "./pages/complaint-rectify/ide-complaint-rectify.component";
import { IdeRefundClaimComponent } from "./pages/refund-claim/ide-refund-claim.component";
import { IdeCurContractComponent } from "./pages/cur-contract/ide-cur-contract.component";
import { IdeAnnualCreditLineComponent } from "./pages/annual-credit-line/ide-annual-credit-line.component";
import { IdeCustomBankComponent } from "./pages/custom-bank/ide-custom-bank.component";
import { IdeContractSplitComponent } from "./pages/contract-split/ide-contract-split.component";
import { IdeContractModifyComponent } from "./pages/contract-modify/ide-contract-modify.component";

export const routes: Routes = [
  { path: 'ideList', component: IdeListComponent },
  // 中转路由
  { path: 'idePortal', component: IdePortalComponent },
  // 客户信息审核
  { path: 'ideCustomerInfo', component: IdeCustomerInfoComponent },
  // 客户信息变更
  { path: 'ideCustomerInfoChange', component: IdeCustomerInfoChangeComponent },
  // 客户明细信息变更
  { path: 'ideCustomerDetailInfoChange', component: IdeCustomerDetailInfoChangeComponent },
  // 客户状态变更
  { path: 'ideCustomerStatus', component: IdeCustomerStatusComponent },
  // 客户银行信息变更
  { path: 'ideCustomerBanksChange', component: IdeCustomBankComponent },
  // 正常盘价合同
  { path: 'ideContract', component: IdeContractComponent },
  // 差异价格合同审批
  { path: 'ideContractDiff', component: IdeContractComponent },
  // 正常盘价合同
  { path: 'ideContractSplit', component: IdeContractSplitComponent },
  // 差异价格合同审批
  { path: 'ideContractSplitDiff', component: IdeContractSplitComponent },
  // 正常盘价合同
  { path: 'ideContractModify', component: IdeContractModifyComponent },
  // 差异价格合同审批
  { path: 'ideContractModifyDiff', component: IdeContractModifyComponent },
  // 正常盘价合同取消
  { path: 'ideContractCancel', component: IdeContractCancelComponent },
  // 差异价格合同取消
  { path: 'ideContractCancelDiff', component: IdeContractCancelComponent },
  // 客户订单变更审批
  { path: 'ideCustomerChangeOrder', component: IdeCustomerChangeOrderComponent },
  // 价格模型审批

  // 销售订单价格复核审批
  { path: 'ideSalesOrder', component: IdeSalesOrderComponent },
  // 销售订单按合同高价先出审批
  { path: 'ideSalesOrderHighPrice', component: IdeSalesOrderComponent },
  // 信用额度申请审批
  { path: 'ideCreditLine', component: IdeCreditLineComponent },
  // 客诉处理意见审批(小额)
  { path: 'ideComplaintHandleSmall', component: IdeComplaintHandleComponent },
  // 客诉处理意见审批(大额)
  { path: 'ideComplaintHandleLarge', component: IdeComplaintHandleComponent },
  // 客诉处理退/换货审批
  { path: 'ideComplaintHandleReturnOrExchange', component: IdeComplaintHandleComponent },
  // 发起客诉整改
  { path: 'ideComplaintRectify', component: IdeComplaintRectifyComponent },
  // 手工退款申请
  { path: 'ideRefundClaim', component: IdeRefundClaimComponent },
  // 正常现货合同新增
  { path: 'ideCurContractAdd', component: IdeCurContractComponent },
  // 差异现货合同新增
  { path: 'ideCurContractAddDiff', component: IdeCurContractComponent },
  // 正常现货合同变更
  { path: 'ideCurContractChange', component: IdeCurContractComponent },
  // 差异现货合同变更
  { path: 'ideCurContractChangeDiff', component: IdeCurContractComponent },
  // 正常现货合同取消
  { path: 'ideCurContractCancel', component: IdeCurContractComponent },
  // 差异现货合同取消
  { path: 'ideCurContractCancelDiff', component: IdeCurContractComponent },
  // 申请年度信用额度
  { path: 'ideAnnualCreditLine', component: IdeAnnualCreditLineComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdeRoutingModule { }