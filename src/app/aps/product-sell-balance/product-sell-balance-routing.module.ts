import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSellBalanceSopdimmainresreviewComponent } from './sopdimmainresreview/sopdimmainresreview.component';
import { ProductSellBalanceSopmaterialresourcecorrelationComponent } from './sopmaterialresourcecorrelation/sopmaterialresourcecorrelation.component';
import { ProductSellBalanceSopsuppliercapacitymaintenanceComponent } from './sopsuppliercapacitymaintenance/sopsuppliercapacitymaintenance.component';
import { ProductSellBalanceSopmaterialpurchasemaintenanceComponent } from './sopmaterialpurchasemaintenance/sopmaterialpurchasemaintenance.component';
import { ProductSellBalanceSopdemandanalysisdmComponent } from './sopdemandanalysisdm/sopdemandanalysisdm.component';
import { ProductSellBalanceSopmaterialdimensionrelationComponent } from './sopmaterialdimensionrelation/sopmaterialdimensionrelation.component';
import { ProductSellBalanceSopprodworkdayComponent } from './sopprodworkday/sopprodworkday.component';
import { ProductSellBalanceSopprodworkdayEditComponent } from './sopprodworkday/edit/edit.component';
import { ProductSellBalanceSopdemandimportComponent } from './sopdemandimport/sopdemandimport.component';
import { DemandCustomizationComponent } from './demand-customization/demand-customization.component';
import { SopDemandAnalysisComponent } from './sop-demand-analysis/sop-demand-analysis.component';
import { ProductSellBalanceSopdemandOccupyAgComponent } from './sop-demand-occupy/sop-demand-occupy-ag.component';
import { ProductSellBalanceSopdemandOccupyChildAgComponent } from './sop-demand-occupy-child/sop-demand-occupy-child-ag.component';
import { ProductSellBalanceSopdemandOccupyFinalAgComponent } from './sop-demand-occupy-final/sop-demand-occupy-final-ag.component';
import { ProductSellBalanceSopdemandOccupyChildfinalAgComponent } from './sop-demand-occupy-child-final/sop-demand-occupy-child-final-ag.component';
import { ProductSellBalanceSopdemandOccupyDemandAgComponent } from './sop-demand-occupy-demand/sop-demand-occupy-demand-ag.component';
import { ProductSellBalanceSopdemandOccupyChildDemandAgComponent } from './sop-demand-occupy-child-demand/sop-demand-occupy-child-demand-ag.component';
import { ProductSellBalanceSopdemandOccupyDieAgComponent } from './sop-demand-occupy-die/sop-demand-occupy-die-ag.component';
import { ProductSellBalanceSopdemandOccupyChildDieAgComponent } from './sop-demand-occupy-child-die/sop-demand-occupy-child-die-ag.component';
import { SopCapabilityReviewComponent } from './sop-capability-review/sop-capability-review.component';
import { SopReductionRuleManageComponent } from './sop-reductionRuleManage/sop-reductionRuleManage.component';
import { ProductSellBalanceSopforeastsetComponent } from './sopforeastset/sopforeastset.component';
import { ProductSellBalanceSopforecastmanageComponent } from './sopforecastmanage/sopforecastmanage.component';
import { ProductSellBalanceSopPlanningCapacityComponent } from './sop-planning-capacity/sop-planning-capacity.component';
import { ProductSellBalanceSopregionplantComponent } from './sopregionplant/sopregionplant.component';
import { ProductSellBalanceSoponhandstrategyComponent } from './soponhandstrategy/soponhandstrategy.component';
import { ProductSellBalanceSopcrossdistrictplanComponent } from './sopcrossdistrictplan/sopcrossdistrictplan.component';
import { ProductSellBalanceSopplantcapacityreviewComponent } from './sopplantcapacityreview/sopplantcapacityreview.component';
import { ProductSellBalanceSopPlantCapacityReviewChildAgComponent } from './sopplantcapacityreviewchild/sopplantcapacityreviewchild.component';
import { WhatIfAnalyseComponent } from './what-if-analyse/what-if-analyse.component';
import { SupplyCustomizationComponent } from './supply-customization/supply-customization.component';
import { ProductSellBalanceSopSupplyCapCustomizedComponent } from './sop-supply-cap-customized/sop-supply-cap-customized.component';
import { SopLongTermItemManageComponent } from './soplongtermitem/soplongtermitem.component';
import { SopResourceCapacityManageComponent } from './sop-resource-capacity/sop-resource-capacity.component';
import { SopPsMouldManagerComponent } from './sop-psmould/psmould.component';
import { SopSupplyRestrainCapComponent } from './sopsupplyrestraincap/sopsupplyrestraincap.component';
import { SopPsMouldItemManagerComponent } from './sop-psmoulditem/psmould-item.component';
import { ProductSellBalanceSopForecastComponent } from './sop-forecast/sop-forecast.component';
import { SopMouldCapacityComponent } from './sop-mould-capacity/sop-mould-capacity.component';
import { SopAreaPlanningSumComponent } from './sop-area-planning-sum/sop-area-planning-sum.component';
import { ProductSellBalanceSopProductPriceComponent } from './sopproductprice/sopproductprice.component';
import { SupplyCustomizationNewComponent } from './supply-customization/supply-customization-new.component';
import { ProductSellBalanceSopForecastVersionComponent } from './sopforecastversion/sopforecastversion.component';

const routes: Routes = [
  { path: 'sopdimmainresreview', component: ProductSellBalanceSopdimmainresreviewComponent },
  { path: 'sopmaterialresourcecorrelation', component: ProductSellBalanceSopmaterialresourcecorrelationComponent },
  { path: 'sopsuppliercapacitymaintenance', component: ProductSellBalanceSopsuppliercapacitymaintenanceComponent },
  { path: 'sopmaterialpurchasemaintenance', component: ProductSellBalanceSopmaterialpurchasemaintenanceComponent },
  { path: 'sopdemandanalysis', component: SopDemandAnalysisComponent },
  { path: 'sopdemandanalysisdm', component: ProductSellBalanceSopdemandanalysisdmComponent },
  { path: 'demandcustomization', component: DemandCustomizationComponent },
  { path: 'supplycustomization', component: SupplyCustomizationComponent },
  { path: 'supplycustomizationnew', component: SupplyCustomizationNewComponent },
  { path: 'sopcapabilityreview', component: SopCapabilityReviewComponent },
  { path: 'sopmaterialdimensionrelation', component: ProductSellBalanceSopmaterialdimensionrelationComponent },
  { path: 'sopprodworkday', component: ProductSellBalanceSopprodworkdayComponent },
  { path: 'edit', component: ProductSellBalanceSopprodworkdayEditComponent },
  { path: 'sopdemandimport', component: ProductSellBalanceSopdemandimportComponent },
  { path: 'sopdemandoccupy', component: ProductSellBalanceSopdemandOccupyAgComponent },
  { path: 'sopdemandoccupychild', component: ProductSellBalanceSopdemandOccupyChildAgComponent },
  { path: 'sopdemandoccupyfinal', component: ProductSellBalanceSopdemandOccupyFinalAgComponent },
  { path: 'sopdemandoccupyfinalchild', component: ProductSellBalanceSopdemandOccupyChildfinalAgComponent },
  { path: 'sopdemandoccupyDemand', component: ProductSellBalanceSopdemandOccupyDemandAgComponent },
  { path: 'sopdemandoccupyDemandchild', component: ProductSellBalanceSopdemandOccupyChildDemandAgComponent },
  { path: 'sopdemandoccupyDie', component: ProductSellBalanceSopdemandOccupyDieAgComponent },
  { path: 'sopdemandoccupyDiechild', component: ProductSellBalanceSopdemandOccupyChildDieAgComponent },
  { path: 'sop-reductionRuleManage', component: SopReductionRuleManageComponent },
  { path: 'sopforeastset', component: ProductSellBalanceSopforeastsetComponent },
  { path: 'sopforecastmanage', component: ProductSellBalanceSopforecastmanageComponent },
  { path: 'sopplanningcapacity', component: ProductSellBalanceSopPlanningCapacityComponent },
  { path: 'sopregionplant', component: ProductSellBalanceSopregionplantComponent },
  { path: 'soponhandstrategy', component: ProductSellBalanceSoponhandstrategyComponent },
  { path: 'sopcrossdistrictplan', component: ProductSellBalanceSopcrossdistrictplanComponent },
  { path: 'sopplantcapacityreview', component: ProductSellBalanceSopplantcapacityreviewComponent },
  { path: 'sopplantcapacityreviewchild', component: ProductSellBalanceSopPlantCapacityReviewChildAgComponent },
  { path: 'what-if-analyse', component: WhatIfAnalyseComponent },
  { path: 'sopSupplyCapCustomized', component: ProductSellBalanceSopSupplyCapCustomizedComponent },
  { path: 'soplongtermitem', component: SopLongTermItemManageComponent },
  { path: 'sopresourcecapacity', component: SopResourceCapacityManageComponent },
  { path: 'soppsmould', component: SopPsMouldManagerComponent },
  { path: 'soppsmoulditem', component: SopPsMouldItemManagerComponent },
  { path: 'sopsupplyrestraincap', component: SopSupplyRestrainCapComponent },
  { path: 'sopsupplyrestraincap', component: SopSupplyRestrainCapComponent },
  { path: 'sopForecast', component: ProductSellBalanceSopForecastComponent },
  { path: 'sopMouldCapacity', component: SopMouldCapacityComponent },
  { path: 'sopareaplanningsum', component: SopAreaPlanningSumComponent },
  { path: 'sopproductprice', component: ProductSellBalanceSopProductPriceComponent },
  { path: 'sopforecastversion', component: ProductSellBalanceSopForecastVersionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductSellBalanceRoutingModule { }
