import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ProductSellBalanceRoutingModule } from './product-sell-balance-routing.module';
import { ProductSellBalanceSopdimmainresreviewComponent } from './sopdimmainresreview/sopdimmainresreview.component';
import { ProductSellBalanceSopdimmainresreviewEditComponent } from './sopdimmainresreview/edit/edit.component';
import { BaseModule } from 'app/modules/base_module/base.module';
import { ProductSellBalanceSopmaterialresourcecorrelationComponent } from './sopmaterialresourcecorrelation/sopmaterialresourcecorrelation.component';
import { ProductSellBalanceSopsuppliercapacitymaintenanceComponent } from './sopsuppliercapacitymaintenance/sopsuppliercapacitymaintenance.component';
import { ProductSellBalanceSopmaterialpurchasemaintenanceComponent } from './sopmaterialpurchasemaintenance/sopmaterialpurchasemaintenance.component';
import { ProductSellBalanceSopmaterialpurchasemaintenanceEditComponent } from './sopmaterialpurchasemaintenance/edit/edit.component';
import { ProductSellBalanceSopmaterialresourcecorrelationEditComponent } from './sopmaterialresourcecorrelation/edit/edit.component';
import { ProductSellBalanceSopsuppliercapacitymaintenanceEditComponent } from './sopsuppliercapacitymaintenance/edit/edit.component';
import { ProductSellBalanceSopdemandanalysisdmComponent } from './sopdemandanalysisdm/sopdemandanalysisdm.component';
import { ProductSellBalanceSopdemandanalysisdmEditComponent } from './sopdemandanalysisdm/edit/edit.component';
import { ProductSellBalanceSopmaterialdimensionrelationComponent } from './sopmaterialdimensionrelation/sopmaterialdimensionrelation.component';
import { ProductSellBalanceSopmaterialdimensionrelationEditComponent } from './sopmaterialdimensionrelation/edit/edit.component';
import { DemandAnalysisImportComponent } from './sopdemandanalysisdm/import/import.component';
import { MaterialDimensionImportComponent } from './sopmaterialdimensionrelation/import/import.component';
import { ProductSellBalanceSopprodworkdayComponent } from './sopprodworkday/sopprodworkday.component';
import { ProductSellBalanceSopprodworkdayEditComponent } from './sopprodworkday/edit/edit.component';
import { SupplierCapacityImportComponent } from './sopsuppliercapacitymaintenance/import/import.component';
import { ProductSellBalanceSopmaterialpurchasemaintenanceBatchModifyComponent } from './sopmaterialpurchasemaintenance/batch-modify/batch-modify.component';
import { MaterialResourceImportComponent } from './sopmaterialresourcecorrelation/import/import.component';
import { ProductSellBalanceSopdemandimportComponent } from './sopdemandimport/sopdemandimport.component';
import { DemandImportImportComponent } from './sopdemandimport/import/import.component';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { DemandCustomizationComponent } from './demand-customization/demand-customization.component';
import { SopDemandAnalysisComponent } from './sop-demand-analysis/sop-demand-analysis.component';
import { DemandCustomizationImportComponent } from './demand-customization/import/import.component';
import { ProductSellBalanceForecastService } from './product-sell-balance-forecast.service';
import { ProductSellBalanceSopdemandOccupyAgComponent } from './sop-demand-occupy/sop-demand-occupy-ag.component';
import { ProductSellBalanceSopdemandOccupyChildAgComponent } from './sop-demand-occupy-child/sop-demand-occupy-child-ag.component';
import { ProductSellBalanceSopdemandOccupydtlAgComponent } from './sop-demand-occupy-dtl/sop-demand-occupy-dtl-ag.component';
import { ProductSellBalanceSopdemandOccupyFinalAgComponent } from './sop-demand-occupy-final/sop-demand-occupy-final-ag.component';
import { ProductSellBalanceSopdemandOccupyChildfinalAgComponent } from './sop-demand-occupy-child-final/sop-demand-occupy-child-final-ag.component';
import { ProductSellBalanceSopdemandOccupyChildDieAgComponent } from './sop-demand-occupy-child-die/sop-demand-occupy-child-die-ag.component';
import { ProductSellBalanceSopdemandOccupyDieAgComponent } from './sop-demand-occupy-die/sop-demand-occupy-die-ag.component';
import { ProductSellBalanceSopdemandOccupyChildDemandAgComponent } from './sop-demand-occupy-child-demand/sop-demand-occupy-child-demand-ag.component';
import { ProductSellBalanceSopdemandOccupyDemandAgComponent } from './sop-demand-occupy-demand/sop-demand-occupy-demand-ag.component';
import { BaseModule as baseTwoMoudle } from '../../modules/base_module/base.module';
import { SopCapabilityReviewComponent } from './sop-capability-review/sop-capability-review.component';
import { ProductSellBalanceCapabilityService } from './product-sell-balance-capability.service';
import { SopCapabilityReviewDemandComponent } from './sop-capability-review/sop-capability-review-demand/sop-capability-review-demand.component';
import { SopReductionRuleManageComponent } from './sop-reductionRuleManage/sop-reductionRuleManage.component';
import { SopReductionRuleManageEditComponent } from './sop-reductionRuleManage/edit/edit.component';
import { ProductSellBalanceSopforeastsetComponent } from './sopforeastset/sopforeastset.component';
import { ProductSellBalanceSopforeastsetEditComponent } from './sopforeastset/edit/edit.component';
import { ProductSellBalanceSopforecastmanageComponent } from './sopforecastmanage/sopforecastmanage.component';
import { ProductSellBalanceSopforecastmanageDetailComponent } from './sopforecastmanage/detail/detail.component';
import { ProductSellBalanceSopforecastmanageEditComponent } from './sopforecastmanage/edit/edit.component';
import { ForecastManageImportComponent } from './sopforecastmanage/import/import.component';
import { ProductSellBalanceSopPlanningCapacityComponent } from './sop-planning-capacity/sop-planning-capacity.component';
import { ProductSellBalanceSopPlanningCapacityImportComponent } from './sop-planning-capacity/import/import.component';
import { ProductSellBalanceSopPlanningCapacityEditComponent } from './sop-planning-capacity/edit/edit.component';
import { ProductSellBalanceSopregionplantComponent } from './sopregionplant/sopregionplant.component';
import { ProductSellBalanceSopregionplantEditComponent } from './sopregionplant/edit/edit.component';
import { ProductSellBalanceSoponhandstrategyComponent } from './soponhandstrategy/soponhandstrategy.component';
import { ProductSellBalanceSoponhandstrategyEditComponent } from './soponhandstrategy/edit/edit.component';
import { ProductSellBalanceSopcrossdistrictplanComponent } from './sopcrossdistrictplan/sopcrossdistrictplan.component';
import { ProductSellBalanceSopplantcapacityreviewComponent } from './sopplantcapacityreview/sopplantcapacityreview.component';
import { ProductSellBalanceSopPlantCapacityReviewChildAgComponent } from './sopplantcapacityreviewchild/sopplantcapacityreviewchild.component';
import { WhatIfAnalyseComponent } from './what-if-analyse/what-if-analyse.component';
import { SupplyCustomizationComponent } from './supply-customization/supply-customization.component';
import { SupplyCustomizationImportComponent } from './supply-customization/import/import.component';
import { ProductSellBalanceSopSupplyCapCustomizedComponent } from './sop-supply-cap-customized/sop-supply-cap-customized.component';
import { ProductSellBalanceSopSupplyCapCustomizedImportComponent } from './sop-supply-cap-customized/import/import.component';
import { ProductSellBalanceSopSupplyCapCustomizedEditComponent } from './sop-supply-cap-customized/edit/edit.component';
import { SopLongTermItemManageComponent } from './soplongtermitem/soplongtermitem.component';
import { SopLongTermItemManageEditComponent } from './soplongtermitem/edit/edit.component';
import { SopLongTermItemImportComponent } from './soplongtermitem/import/import.component';
import { SopResourceCapacityManageComponent } from './sop-resource-capacity/sop-resource-capacity.component';
import { SopResourceCapacityEditComponent } from './sop-resource-capacity/edit/edit.component';
import { SopResourceCapacityImportComponent } from './sop-resource-capacity/import/import.component';
import { SopPsMouldManagerComponent } from './sop-psmould/psmould.component';
import { SopPsMouldManagerEditComponent } from './sop-psmould/edit/edit.component';
import { SopPsMouldImportComponent } from './sop-psmould/import/import.component';
import { SopSupplyRestrainCapViewComponent } from './sopsupplyrestraincap/view/view.component';
import { SopSupplyRestrainCapComponent } from './sopsupplyrestraincap/sopsupplyrestraincap.component';
import { SopSupplyRestrainCapEditComponent } from './sopsupplyrestraincap/edit/edit.component';
import { SopSupplyRestrainCapViewEditComponent } from './sopsupplyrestraincap/view-edit/view-edit.component';
import { SopPsMouldItemManagerComponent } from './sop-psmoulditem/psmould-item.component';
import { SopPsMouldItemEditComponent } from './sop-psmoulditem/edit/edit.component';
import { SopPsMouldItemImportComponent } from './sop-psmoulditem/import/import.component';
import { ProductSellBalanceSopForecastComponent } from './sop-forecast/sop-forecast.component';
import { ProductSellBalanceSopForecastImportComponent } from './sop-forecast/import/import.component';
import { SopMouldCapacityComponent } from './sop-mould-capacity/sop-mould-capacity.component';
import { SopMouldCapacityEditComponent } from './sop-mould-capacity/edit/edit.component';
import { SopMouldCapacityImportComponent } from './sop-mould-capacity/import/import.component';
import { SopAreaPlanningSumComponent } from './sop-area-planning-sum/sop-area-planning-sum.component';
import { ProductSellBalanceSopProductPriceComponent } from './sopproductprice/sopproductprice.component';
import { ProductSellBalanceSopProductPriceEditComponent } from './sopproductprice/edit/edit.component';
import { SupplyCustomizationNewComponent } from './supply-customization/supply-customization-new.component';
import { ProductSellBalanceSopForecastVersionComponent } from './sopforecastversion/sopforecastversion.component';
import { ProductSellBalanceSopForecastVersionDetailComponent } from './sopforecastversion/detail/detail.component';
import { ProductSellBalanceSopForecastVersionSendComponent } from './sopforecastversion/send/sendl.component';

const COMPONENTS = [
  ProductSellBalanceSopdimmainresreviewComponent,
  ProductSellBalanceSopmaterialresourcecorrelationComponent,
  ProductSellBalanceSopsuppliercapacitymaintenanceComponent,
  ProductSellBalanceSopmaterialpurchasemaintenanceComponent,
  ProductSellBalanceSopdemandanalysisdmComponent,
  ProductSellBalanceSopmaterialdimensionrelationComponent,
  ProductSellBalanceSopprodworkdayComponent,
  ProductSellBalanceSopprodworkdayEditComponent,
  ProductSellBalanceSopdemandimportComponent,
  DemandCustomizationComponent,
  SupplyCustomizationComponent,
  SopDemandAnalysisComponent,
  ProductSellBalanceSopdemandOccupyAgComponent,
  ProductSellBalanceSopdemandOccupyChildAgComponent,
  ProductSellBalanceSopdemandOccupydtlAgComponent,
  ProductSellBalanceSopdemandOccupyFinalAgComponent,
  ProductSellBalanceSopdemandOccupyChildfinalAgComponent,
  ProductSellBalanceSopdemandOccupyChildDieAgComponent,
  ProductSellBalanceSopdemandOccupyDieAgComponent,
  ProductSellBalanceSopdemandOccupyChildDemandAgComponent,
  ProductSellBalanceSopdemandOccupyDemandAgComponent,
  SopReductionRuleManageComponent,
  ProductSellBalanceSopforeastsetComponent,
  ProductSellBalanceSopforecastmanageComponent,
  SopCapabilityReviewDemandComponent,
  ProductSellBalanceSopPlanningCapacityComponent,
  ProductSellBalanceSopregionplantComponent,
  ProductSellBalanceSoponhandstrategyComponent,
  ProductSellBalanceSopcrossdistrictplanComponent,
  ProductSellBalanceSopplantcapacityreviewComponent,
  WhatIfAnalyseComponent,
  ProductSellBalanceSopSupplyCapCustomizedComponent,
  SopLongTermItemManageComponent,
  SopResourceCapacityManageComponent,
  SopPsMouldManagerComponent,
  SopPsMouldItemManagerComponent,
  SopSupplyRestrainCapComponent,
  ProductSellBalanceSopForecastComponent,
  SopMouldCapacityComponent,
  SopAreaPlanningSumComponent,
  ProductSellBalanceSopProductPriceComponent,
  SupplyCustomizationNewComponent,
  ProductSellBalanceSopForecastVersionComponent
];
const COMPONENTS_NOROUNT = [
  ProductSellBalanceSopdimmainresreviewEditComponent,
  ProductSellBalanceSopmaterialpurchasemaintenanceEditComponent,
  ProductSellBalanceSopmaterialresourcecorrelationEditComponent,
  ProductSellBalanceSopsuppliercapacitymaintenanceEditComponent,
  ProductSellBalanceSopdemandanalysisdmEditComponent,
  ProductSellBalanceSopmaterialdimensionrelationEditComponent,
  DemandAnalysisImportComponent,
  SupplyCustomizationImportComponent,
  MaterialDimensionImportComponent,
  SupplierCapacityImportComponent,
  ProductSellBalanceSopmaterialpurchasemaintenanceBatchModifyComponent,
  MaterialResourceImportComponent,
  DemandCustomizationImportComponent,
  DemandImportImportComponent,
  SopCapabilityReviewDemandComponent,
  ProductSellBalanceSopdemandOccupydtlAgComponent,
  SopReductionRuleManageEditComponent,
  ProductSellBalanceSopforeastsetEditComponent,
  ProductSellBalanceSopforecastmanageDetailComponent,
  ProductSellBalanceSopforecastmanageEditComponent,
  ForecastManageImportComponent,
  SopCapabilityReviewComponent,
  ProductSellBalanceSopPlanningCapacityEditComponent,
  ProductSellBalanceSopPlanningCapacityImportComponent,
  ProductSellBalanceSopregionplantEditComponent,
  ProductSellBalanceSoponhandstrategyEditComponent,
  ProductSellBalanceSopPlantCapacityReviewChildAgComponent,
  ProductSellBalanceSopSupplyCapCustomizedImportComponent,
  ProductSellBalanceSopSupplyCapCustomizedEditComponent,
  SopLongTermItemManageEditComponent,
  SopLongTermItemImportComponent,
  SopResourceCapacityEditComponent,
  SopResourceCapacityImportComponent,
  SopPsMouldManagerEditComponent,
  SopPsMouldImportComponent,
  SopSupplyRestrainCapEditComponent,
  SopSupplyRestrainCapViewComponent,
  SopSupplyRestrainCapViewEditComponent,
  SopPsMouldItemEditComponent,
  SopPsMouldItemImportComponent,
  ProductSellBalanceSopForecastImportComponent,
  SopMouldCapacityEditComponent,
  SopMouldCapacityImportComponent,
  ProductSellBalanceSopProductPriceEditComponent,
  ProductSellBalanceSopForecastVersionDetailComponent,
  ProductSellBalanceSopForecastVersionSendComponent,
];

/**
 * 服务提供者
 */
const SERVICE_PROVIDERS = [
  ProductSellBalanceForecastService,
  ProductSellBalanceCapabilityService,
];

@NgModule({
  imports: [
    BaseModule,
    baseTwoMoudle,
    SharedModule,
    ProductSellBalanceRoutingModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent]),
  ],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  providers: [...SERVICE_PROVIDERS],
  entryComponents: COMPONENTS_NOROUNT,
})
export class ProductSellBalanceModule { }
