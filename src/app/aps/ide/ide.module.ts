import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "@shared";
import { AgGridModule } from "ag-grid-angular";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { BaseModule } from "app/modules/base_module/base.module";
import { IdeRoutingModule } from "./ide.routing.module";
import { IdePortalComponent } from "./portal/ide-portal.component";
import { IdeListComponent } from "./list/ide-list.component";
import { IdeFlowPageComponent } from './flow-page/flow-page.component';
import { IdeFlowIframeComponent } from './flow-iframe/flow-iframe.component';
import { IdeCustomerInfoComponent } from "./pages/customer-info/ide-customer-info.component";
import { IdeCustomerInfoFormComponent } from "./pages/customer-info/form/form.component";
import { IdeCustomerInfoChangeComponent } from "./pages/customer-info-change/ide-customer-info-change.component";
import { IdeCustomerInfoChangeFormComponent } from "./pages/customer-info-change/form/form.component";
import { IdeCustomerDetailInfoChangeComponent } from "./pages/customer-detail-info-change/ide-customer-detail-info-change.component";
import { IdeCustomerDetailInfoChangeFormComponent } from "./pages/customer-detail-info-change/form/form.component";
import { IdeContractComponent } from "./pages/contract/ide-contract.component";
import { IdeContractFormComponent } from "./pages/contract/form/form.component";
import { IdeContractCancelComponent } from "./pages/contract-cancel/ide-contract-cancel.component";
import { IdeContractCancelFormComponent } from "./pages/contract-cancel/form/form.component";
import { IdeCustomerStatusComponent } from "./pages/customer-status/ide-customer-status.component";
import { IdeCustomerStatusFormComponent } from "./pages/customer-status/form/form.component";
import { IdeCustomerChangeOrderComponent } from "./pages/customer-change-order/ide-customer-change-order.component";
import { IdeCustomerChangeOrderFormComponent } from "./pages/customer-change-order/form/form.component";
import { IdeSalesOrderComponent } from "./pages/sales-order/ide-sales-order.component";
import { IdeSalesOrderFormComponent } from "./pages/sales-order/form/form.component";
import { IdeCreditLineComponent } from "./pages/credit-line/ide-credit-line.component";
import { IdeCreditLineFormComponent } from "./pages/credit-line/form/form.component";
import { IdeComplaintHandleComponent } from "./pages/complaint-handle/ide-complaint-handle.component";
import { IdeComplaintHandleFormComponent } from "./pages/complaint-handle/form/form.component";
import { IdeComplaintRectifyComponent } from "./pages/complaint-rectify/ide-complaint-rectify.component";
import { IdeComplaintRectifyFormComponent } from "./pages/complaint-rectify/form/form.component";
import { IdeRefundClaimComponent } from "./pages/refund-claim/ide-refund-claim.component";
import { IdeRefundClaimFormComponent } from "./pages/refund-claim/form/form.component";
import { IdeCurContractFormComponent } from "./pages/cur-contract/form/form.component";
import { IdeCurContractComponent } from "./pages/cur-contract/ide-cur-contract.component";
import { IdeAnnualCreditLineComponent } from "./pages/annual-credit-line/ide-annual-credit-line.component";
import { IdeAnnualCreditLineFormComponent } from "./pages/annual-credit-line/form/form.component";
import { IdeCustomBankComponent } from "./pages/custom-bank/ide-custom-bank.component";
import { IdeCustomBankFormComponent } from "./pages/custom-bank/form/form.component";
import { IdeContractSplitFormComponent } from "./pages/contract-split/form/form.component";
import { IdeContractSplitComponent } from "./pages/contract-split/ide-contract-split.component";
import { IdeContractModifyFormComponent } from "./pages/contract-modify/form/form.component";
import { IdeContractModifyComponent } from "./pages/contract-modify/ide-contract-modify.component";

const COMPONENTS = [
  IdeListComponent,
  IdePortalComponent,
  IdeCustomerInfoComponent,
  IdeCustomerInfoChangeComponent,
  IdeCustomerStatusComponent,
  IdeContractComponent,
  IdeContractCancelComponent,
  IdeSalesOrderComponent,
  IdeCreditLineComponent,
  IdeCustomerChangeOrderComponent,
  IdeComplaintHandleComponent,
  IdeComplaintRectifyComponent,
  IdeRefundClaimComponent,
  IdeCustomerDetailInfoChangeComponent,
  IdeCurContractComponent,
  IdeAnnualCreditLineComponent,
  IdeCustomBankComponent,
  IdeContractSplitComponent,
  IdeContractModifyComponent,
];

const COMPONENTS_NOROUNT = [
  IdeFlowPageComponent,
  IdeFlowIframeComponent,
  IdeCustomerInfoFormComponent,
  IdeCustomerInfoChangeFormComponent,
  IdeCustomerStatusFormComponent,
  IdeContractFormComponent,
  IdeContractCancelFormComponent,
  IdeSalesOrderFormComponent,
  IdeCreditLineFormComponent,
  IdeCustomerChangeOrderFormComponent,
  IdeComplaintHandleFormComponent,
  IdeComplaintRectifyFormComponent,
  IdeRefundClaimFormComponent,
  IdeCustomerDetailInfoChangeFormComponent,
  IdeCurContractFormComponent,
  IdeAnnualCreditLineFormComponent,
  IdeCustomBankFormComponent,
  IdeContractSplitFormComponent,
  IdeContractModifyFormComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BaseModule,
    FormsModule,
    IdeRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  exports: [...COMPONENTS],
  entryComponents: COMPONENTS_NOROUNT,
})
export class IdeModule { }