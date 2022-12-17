import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialmanagementMaterialmaintenanceComponent } from './materialmaintenance/materialmaintenance.component';
import { MaterialmanagementCategorySetManagerComponent } from './category-set-manager/category-set-manager.component';
import { MaterialmanagementCategorymanageComponent } from './categorymanage/categorymanage.component';
import { MaterialmanagementProdlineItemsComponent } from './prodline-items/prodline-items.component';
import { MaterialmanagementItemCategoryAssignComponent } from './item-category-assign/item-category-assign.component';
import { MaterialmanagementItemonhandqueryComponent } from './itemonhandquery/itemonhandquery.component';
import { MaterialProcessComponent } from './material-process/material-process.component';
import { MaterialmanagementItemCategoryAssignAgComponent } from './item-category-assign/item-category-assign-ag.component';
import { MaterialmanagementCategorySetManagerAgComponent } from './category-set-manager/category-set-manager-ag.component';
import { MaterialmanagementProdlineItemsAgComponent } from './prodline-items/prodline-items-ag.component';
import { MaterialmanagementListItemonhandchildComponent } from './itemonhandchild/itemonhandchild.component';
import { ItemUseAreaComponent } from './item-use-area/item-use-area.component';
import { MaterialmanagementItemcycletimeComponent } from './itemcycletime/itemcycletime.component';
// import { MaterialmanagementItemstoretimeComponent } from './itemstoretime/itemstoretime.component';
// import { MaterialmanagementOverdosuggestComponent } from './overdosuggest/overdosuggest.component';
// import { MaterialmanagementWarehouseatpComponent } from './warehouseatp/warehouseatp.component';
import { RoutingPlanningComponent } from './routing-planning/routing-planning.component';
import { ItemJointHDComponent } from './item-joint-hd/item-joint-hd.component';
import {MaterialmanagementMoSupplyRelationComponent} from './mo-supply-relation/mo-supply-relation.component';
import {MaterialmanagementMoLossComponent} from './mo-loss/mo-loss.component';
import { ProdlineItemsOptimizationComponent } from './prodline-items-optimization/prodline-items-optimization.component';
import { PsProductionComponent } from './ps_production/list.component';
import { PsItemRateListComponent } from './ps_item_rate/list.component';
import { PsBurdeningStandardListComponent } from './ps_burdening_standard/list.component';
import { PsProdRouteItemComponent} from './ps-prod-route-item/ps-prod-route-item.component';
import { PsProdManufSpecComponent} from './ps-prod-manuf-spec/ps-prod-manuf-spec.component';
import { PsHwSpecIndexComponent} from './ps_hw_spec_index/list.component';
import { PshwprodspecComponent } from './ps_hw_prod_spec/list.component';
import { PsHwManufSpecComponent } from './ps_hw_manuf_spec/list.component';
import { PsHwProdManufSpecLineComponent } from './ps_hw_prod_manuf_spec/list.component';
import { PsProdPurchaseListComponent } from './ps_prod_purchase/list.component';

const routes: Routes = [
  { path: 'materialmaintenance/:showAttribute', component: MaterialmanagementMaterialmaintenanceComponent },
  { path: 'materialmaintenance', component: MaterialmanagementMaterialmaintenanceComponent },
  { path: 'category-set-manager', component: MaterialmanagementCategorySetManagerAgComponent },
  { path: 'categorymanage', component: MaterialmanagementCategorymanageComponent },
  { path: 'prodline-items', component: MaterialmanagementProdlineItemsAgComponent },
  { path: 'itemcategoryassign', component: MaterialmanagementItemCategoryAssignAgComponent },
  { path: 'itemonhandquery', component: MaterialmanagementItemonhandqueryComponent },
  { path: 'material-process', component: MaterialProcessComponent },
  { path: 'itemonhandchild', component: MaterialmanagementListItemonhandchildComponent },
  { path: 'item-use-area', component: ItemUseAreaComponent },
  { path: 'itemcycletime', component: MaterialmanagementItemcycletimeComponent },
  // { path: 'itemstoretime', component: MaterialmanagementItemstoretimeComponent },
  // { path: 'overdosuggest', component: MaterialmanagementOverdosuggestComponent },
  // { path: 'warehouseatp', component: MaterialmanagementWarehouseatpComponent },
  { path: 'routingplanning', component: RoutingPlanningComponent },
  { path: 'itemjointhd', component: ItemJointHDComponent },
  { path: 'MoSupplyRelation', component: MaterialmanagementMoSupplyRelationComponent },
  { path: 'MoLoss', component: MaterialmanagementMoLossComponent },
  { path: 'prodline-items-optimization', component: ProdlineItemsOptimizationComponent },
  { path: 'psProduction', component: PsProductionComponent },
  { path: 'psItemRate', component: PsItemRateListComponent },
  { path: 'psBurdeningStandard', component: PsBurdeningStandardListComponent },
  { path: 'ps-prod-route-item', component: PsProdRouteItemComponent },
  { path: 'ps-prod-manuf-spec', component: PsProdManufSpecComponent },
  { path: 'psHwSpecIndex', component: PsHwSpecIndexComponent },
  { path: 'psHwProdSpec', component: PshwprodspecComponent },
  { path: 'psHwManufSpec', component: PsHwManufSpecComponent },
  { path: 'psHwProdManufSpec', component: PsHwProdManufSpecLineComponent },
  { path: 'psProdPurchase', component: PsProdPurchaseListComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialmanagementRoutingModule { }
