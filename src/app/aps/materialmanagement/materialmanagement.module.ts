import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BaseModule } from '../../modules/base_module/base.module';
import { MaterialmanagementRoutingModule } from './materialmanagement-routing.module';
import { MaterialmanagementMaterialmaintenanceComponent } from './materialmaintenance/materialmaintenance.component';
import { MaterialmanagementMaterialmaintenanceEditComponent } from './materialmaintenance/edit/edit.component';
import { MaterialmanagementCategorySetManagerComponent } from './category-set-manager/category-set-manager.component';
import { MaterialmanagementCategorySetManagerEditComponent } from './category-set-manager/edit/edit.component';
import { MaterialmanagementProdlineItemsComponent } from './prodline-items/prodline-items.component';
import { MaterialmanagementProdlineItemsEditComponent } from './prodline-items/edit/edit.component';
import { MaterialmanagementCategorymanageComponent } from './categorymanage/categorymanage.component';
import { MaterialmanagementCategorymanageEditComponent } from './categorymanage/edit/edit.component';
import { MaterialmanagementItemCategoryAssignComponent } from './item-category-assign/item-category-assign.component';
import { MaterialmanagementItemCategoryAssignEditComponent } from './item-category-assign/edit/edit.component';
import { MaterialmanagementItemCategoryAssignImportComponent } from './item-category-assign/import/import.component';
import { MaterialmanagementProdlineItemsImportComponent } from './prodline-items/import/import.component';
import { MaterialmanagementItemonhandqueryComponent } from './itemonhandquery/itemonhandquery.component';
import { MaterialmanagementItemonhandqueryEditComponent } from './itemonhandquery/edit/edit.component';
import { MaterialProcessComponent } from './material-process/material-process.component';
import { MaintainProcessCopyComponent } from './material-process/copy-process/copy.component';
import { MaintainChangeCopyComponent } from './material-process/change-code/change-copy.component';
import { AgGridModule } from 'ag-grid-angular';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { MaterialmanagementItemCategoryAssignAgComponent } from './item-category-assign/item-category-assign-ag.component';
import { MaterialmanagementCategorySetManagerAgComponent } from './category-set-manager/category-set-manager-ag.component';
import { MaterialmanagementProdlineItemsAgComponent } from './prodline-items/prodline-items-ag.component';
import { CategoryManagerImportComponent } from './categorymanage/import/import.component';
import { MaterialmanagementListItemonhandchildComponent } from './itemonhandchild/itemonhandchild.component';
import { ItemOperationLeadTimeImportComponent } from './materialmaintenance/import/item-op-lead-time-import.component';
import { ItemOperationProcessImportComponent } from './materialmaintenance/import/item-op-process-import.component';
import { MaterialmanagementMaterialProcessGridComponent } from './material-process-grid/material-process-grid.component';
import { ItemUseAreaComponent } from './item-use-area/item-use-area.component';
import { MaterialmanagementItemcycletimeComponent } from './itemcycletime/itemcycletime.component';
import { MaterialmanagementItemcycletimeEditComponent } from './itemcycletime/edit/edit.component';
import { MaterialmanagementItemcycletimeViewComponent } from './itemcycletime/view/view.component';
// import { MaterialmanagementItemstoretimeComponent } from './itemstoretime/itemstoretime.component';
// import { MaterialmanagementItemstoretimeEditComponent } from './itemstoretime/edit/edit.component';
// import { MaterialmanagementItemstoretimeViewComponent } from './itemstoretime/view/view.component';
// import { MaterialmanagementOverdosuggestComponent } from './overdosuggest/overdosuggest.component';
// import { MaterialmanagementOverdosuggestEditComponent } from './overdosuggest/edit/edit.component';
// import { MaterialmanagementOverdosuggestViewComponent } from './overdosuggest/view/view.component';
import { MaterialmanagementSapProcessGridComponent } from './materialmaintenance/material-sap-process-grid/material-sap-process-grid.component';
// import { MaterialmanagementWarehouseatpComponent } from './warehouseatp/warehouseatp.component';
// import { MaterialmanagementWarehouseatpEditComponent } from './warehouseatp/edit/edit.component';
// import { MaterialmanagementWarehouseatpViewComponent } from './warehouseatp/view/view.component';
import { RoutingPlanningComponent } from './routing-planning/routing-planning.component';
import { ItemJointHDComponent } from './item-joint-hd/item-joint-hd.component';
import { ItemJointHDEditComponent } from './item-joint-hd/edit/edit.component';
import { ItemJointHDImportComponent } from './item-joint-hd/import/import.component';
import { MaterialmanagementMoSupplyRelationComponent } from './mo-supply-relation/mo-supply-relation.component';
import { MaterialmanagementMoSupplyRelationEditComponent } from './mo-supply-relation/edit/edit.component';
import { MaterialmanagementMoSupplyRelationImportComponent } from './mo-supply-relation/import/import.component';
import { MaterialmanagementMoLossComponent } from './mo-loss/mo-loss.component';
import { MaterialmanagementMoLossEditComponent } from './mo-loss/edit/edit.component';
import { MaterialmanagementMoLossImportComponent } from './mo-loss/import/import.component';
import { ProdlineItemsOptimizationComponent } from './prodline-items-optimization/prodline-items-optimization.component';
import { DataRefreshComponent } from './prodline-items-optimization/data-refresh/data-refresh.component';
import { NumberInputEditorComponent } from './prodline-items-optimization/number-input.component';
import { PsProductionComponent } from './ps_production/list.component';
import { PsItemRateListComponent } from './ps_item_rate/list.component';
import { PsItemRateImportComponent } from './ps_item_rate/import/import.component';
import { PsItemRateEditComponent } from './ps_item_rate/edit/edit.component';
import { PsBurdeningStandardListComponent } from './ps_burdening_standard/list.component';
import { PsBurdeningStandardEditComponent } from './ps_burdening_standard/edit/edit.component';
import { PsBurdeningStandardImportComponent } from './ps_burdening_standard/import/import.component';
import { PsBurdeningStandardImportPlatesComponent } from './ps_burdening_standard/import/importPlates.component';
import { PsBurdeningStandardExListComponent } from './ps_burdening_standard/detail/list.component';
import { PsBurdeningStandardExEditComponent } from './ps_burdening_standard/detail/edit/edit.component';
import { PsProdManufSpecComponent } from './ps-prod-manuf-spec/ps-prod-manuf-spec.component';
import { PsProdRouteItemComponent } from './ps-prod-route-item/ps-prod-route-item.component';
import { PsHwSpecIndexComponent } from './ps_hw_spec_index/list.component';
import { PsHwManufLineSpecDefComponent } from './ps_hw_spec_index/detail/manufLineSpecDef.component';
import { PsHwProdSpecDefComponent } from './ps_hw_spec_index/detail/prodSpecDef.component';
import { PshwprodspecComponent } from './ps_hw_prod_spec/list.component';
import { PsHwSpecIndexApplyComponent } from './ps_hw_prod_spec/detail/specIndexApply.component';
import { PsHwProdRouteComponent } from './ps_hw_prod_spec/detail/prodRoute.component';
import { PsHwProdRouteItemComponent } from './ps_hw_prod_spec/detail/prodRouteItem.component';
import { PsHwManufSpecComponent } from './ps_hw_manuf_spec/list.component';
import { PsHwManufSpecLineComponent } from './ps_hw_manuf_spec/detail/manufSpecLine.component';
import { PsHwProdManufSpecLineComponent } from './ps_hw_prod_manuf_spec/list.component';
import { PsProdPurchaseListComponent } from './ps_prod_purchase/list.component';
import { PsProdPurchaseEditComponent } from './ps_prod_purchase/edit/edit.component';
import { PsProdPurchaseImportComponent } from './ps_prod_purchase/import/import.component';
import { PsProdPurchaseExListComponent } from './ps_prod_purchase/detail/list.component';
import { PsProdPurchaseExEditComponent } from './ps_prod_purchase/detail/edit/edit.component';


const COMPONENTS = [
  MaterialmanagementMaterialmaintenanceComponent,
  MaterialmanagementCategorySetManagerComponent,
  MaterialmanagementCategorySetManagerAgComponent,
  MaterialmanagementProdlineItemsComponent,
  MaterialmanagementProdlineItemsAgComponent,
  MaterialmanagementCategorymanageComponent,
  MaterialmanagementItemCategoryAssignComponent,
  MaterialmanagementItemCategoryAssignAgComponent,
  MaterialmanagementItemonhandqueryComponent,
  MaterialProcessComponent,
  MaterialmanagementListItemonhandchildComponent,
  ItemUseAreaComponent,
  MaterialmanagementItemcycletimeComponent,
  // MaterialmanagementItemstoretimeComponent,
  // MaterialmanagementOverdosuggestComponent,
  MaterialmanagementSapProcessGridComponent,
  // MaterialmanagementWarehouseatpComponent,
  RoutingPlanningComponent,
  ItemJointHDComponent,
  MaterialmanagementMoSupplyRelationComponent,
  MaterialmanagementMoLossComponent,
  ProdlineItemsOptimizationComponent,
  PsProductionComponent,
  PsItemRateListComponent,
  PsBurdeningStandardListComponent,
  PsProdManufSpecComponent,
  PsProdRouteItemComponent,
  PsHwSpecIndexComponent,
  PshwprodspecComponent,
  PsHwManufSpecComponent,
  PsHwProdManufSpecLineComponent,
  PsProdPurchaseListComponent
];
const COMPONENTS_NOROUNT = [
  MaterialmanagementMaterialmaintenanceEditComponent,
  MaterialmanagementCategorySetManagerEditComponent,
  MaterialmanagementProdlineItemsEditComponent,
  MaterialmanagementProdlineItemsImportComponent,
  MaterialmanagementCategorymanageEditComponent,
  MaterialmanagementItemCategoryAssignEditComponent,
  MaterialmanagementItemCategoryAssignImportComponent,
  MaterialmanagementItemonhandqueryEditComponent,
  MaintainProcessCopyComponent,
  MaintainChangeCopyComponent,
  CategoryManagerImportComponent,
  ItemOperationLeadTimeImportComponent,
  ItemOperationProcessImportComponent,
  MaterialmanagementMaterialProcessGridComponent,
  MaterialmanagementItemcycletimeEditComponent,
  MaterialmanagementItemcycletimeViewComponent,
  // MaterialmanagementItemstoretimeEditComponent,
  // MaterialmanagementItemstoretimeViewComponent,
  // MaterialmanagementOverdosuggestEditComponent,
  // MaterialmanagementOverdosuggestViewComponent,
  // MaterialmanagementWarehouseatpEditComponent,
  // MaterialmanagementWarehouseatpViewComponent,
  ItemJointHDEditComponent,
  ItemJointHDImportComponent,
  MaterialmanagementMoSupplyRelationEditComponent,
  MaterialmanagementMoSupplyRelationImportComponent,
  MaterialmanagementMoLossEditComponent,
  MaterialmanagementMoLossImportComponent,
  DataRefreshComponent,
  ProdlineItemsOptimizationComponent,
  NumberInputEditorComponent,
  PsItemRateImportComponent,
  PsItemRateEditComponent,
  PsBurdeningStandardEditComponent,
  PsBurdeningStandardImportComponent,
  PsBurdeningStandardImportPlatesComponent,
  PsBurdeningStandardExListComponent,
  PsBurdeningStandardExEditComponent,
  PsHwManufLineSpecDefComponent,
  PsHwProdSpecDefComponent,
  PsHwSpecIndexApplyComponent,
  PsHwProdRouteComponent,
  PsHwProdRouteItemComponent,
  PsHwManufSpecLineComponent,
  PsProdPurchaseEditComponent,
  PsProdPurchaseImportComponent,
  PsProdPurchaseExListComponent,
  PsProdPurchaseExEditComponent,
];
@NgModule({
  imports: [
    SharedModule,
    MaterialmanagementRoutingModule,
    BaseModule,
    AgGridModule.withComponents([CustomOperateCellRenderComponent])
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
  ],
  entryComponents: COMPONENTS_NOROUNT,
  exports: [NumberInputEditorComponent],
})
export class MaterialmanagementModule { }
