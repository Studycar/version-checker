/*
 * @Author: clj
 * @contact:
 * @Date: 2018-08-01 17:49:17
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-20 11:36:22
 * @Note: ...
 */
import { NgModule } from '@angular/core';
import { BaseModule } from '../base_module/base.module';
import { LookupCodeManageService } from './services/lookup-code-manage-service';
import { SessionService } from './services/session-service';
import { ExecutablesManageService } from './services/executables-manage-service';
import { BaseFlexValueSetsManageService } from './services/base-flex-value-sets-manage-service';
import { MenuManagerManageService } from './services/menu-manager-manage-service';
import { MenuGroupPluginService } from './services/menu-group-plugin-service';
import { FunctionmanagerService } from './services/functionmanager-service';
import { MessageManageService } from './services/message-manage-service';
import { ShortcutkeyService } from './services/shortcutkey-service';
import { AudittablesService } from './services/audittables-service';
import { RespmanagerService } from './services/respmanager-service';
import { BaseApplicationManageService } from './services/base-application-manage-service';
import { ShiftthemappingManageService } from './services/Shift-the-mapping-manage-service';
import { UserManagerManageService } from './services/user-manager-manage-service';
import { ConcurrentProgramManageService } from './services/concurrent-program-manage-service';
import { PsPrivilegeService } from './services/ps-privilege-service';
import { SyncRefreshHistoryService } from './services/sync-refresh-history-service';
import { SyncConfigManageService } from './services/sync-config-manage-service';
import { ConcurrentManagerService } from './services/concurrent-manager-service';
import { ServerNodesManageService } from './services/servernodes-manager-service';
import { RequestGroupsService } from './services/request-groups-service';
import { ConcurrentDefineService } from './services/concurrent-define-service';
import { PsusermanagerService } from './services/psusermanager-service';
import { PredictionOffSetshowService } from './services/prediction-off-setshow-service';
import { ScheduleManagerService } from './services/schedule-manager-service';
import { MaterialmaintenanceService } from './services/materialmaintenance-service';
import { PlantMaintainService } from './services/plantmaintain-service';
import { ProLineGroupMaintainService } from './services/prolinegroupmaintain-service';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { CustomExcelExportComponent } from '../base_module/components/custom-excel-export.component';
import { RequestSubmitQueryService } from './services/request-submit-query-service';
import { CustomFormQueryComponent } from '../base_module/components/custom-form-query.component';
import { CommonQueryService } from './services/common-query.service';
import { CategorySetManagerService } from './services/category-set-manager-service';
import { GridContextMenuComponent } from '../base_module/components/grid-context-menu.component';
import { BaseUserMessageService } from './services/base-user-message-service.component';
import { MaterialmanagementCategorymanageService } from './services/materialmanagement-categorymanage-service';
import { BaseTranslstorService } from './services/basetranslator-service';
import { OrganizationTranAdvanceService } from './services/organization-tran-advance-service';
import { ProductLineManagerService } from './services/production-line-manager';
import { ERPJobTypeService } from './services/erpjobtype-service';
import { CustomSelectLookupComponent } from '../base_module/components/custom-select-lookup.component';
import { DemandOrderSplitMergeService } from './services/demand-order-split-merge';
import { ComVindicateService } from './services/comvindicate-service';
import { BaseParameterService } from './services/base-parameter-service';
import { DemandclearupnoticeService } from './services/demandclearupnotice-service';
import { MOBatchReleaseService } from './services/mobatchrelease-service';
import { MoManagerService } from '../../modules/generated_module/services/mo-manager-service';
import { ColorManageService } from '../../modules/generated_module/services/color-manage-service';
import { BasePsBomService } from '../../modules/generated_module/services/base-psbom-service';
import { PsAssemblyRelationService } from '../../modules/generated_module/services/ps-assembly-relation-service';
import { ReqLineTypeDefaultSetService } from '../generated_module/services/reqlinetypedefaultset-service';
import { PurchaseRegionService } from '../generated_module/services/purchase-region-service';
import { SupplierService } from '../generated_module/services/supplier-service';
import { ItemCategoryService } from '../generated_module/services/item-category-service';
import { DlyCalendarService } from '../generated_module/services/dly-calendar-service';
import { RequestSetsService } from './services/request-sets-service';
import { DemandPutService } from '../generated_module/services/demand-put-service';
import { PcBuyerService } from '../generated_module/services/pc-buyer-service';
import { PcBuyerAuthService } from '../generated_module/services/pc-buyerauth-service';
import { UserItemCategoryService } from '../generated_module/services/user-itemcategory-service';
import { OperationManageService } from '../generated_module/services/operation-manage-service';
import { OperationLeadTimeService } from '../generated_module/services/operation-leadtime-service';
import { MoProcessMaintenanceService } from '../generated_module/services/moprocess-maintenance-service';
import { QueryKitStatusService } from '../generated_module/services/query-kit-status-service';
import { QueryPurchaseKitStatusService } from '../generated_module/services/query-purchasekitstatus-service';
import { PoComVindicateService } from '../generated_module/services/pocomvindicate-service';
import { ItemonhandQueryService } from '../generated_module/services/itemonhand-query-service';
import { MoExceptionService } from '../generated_module/services/mo-exception-service';
import { ModelChangeTimeService } from '../generated_module/services/modelchangetime-service';
import { SopDimmainresrevVewService } from '../generated_module/services/sopdimmainresreview-service';
import { SopMaterialPurchaseMaintenanceService } from './services/sopmaterialpurchasemaintenance-service';
import { SopMaterialResourceCorrelationService } from './services/sopmaterialresourcecorrelation-service';
import { SopSupplierCapacityMaintenanceService } from './services/sopsuppliercapacitymaintenance-service';
import { CustomPagerComponent } from '../base_module/components/custom-pager.component';
import { SopDemandAnalysisdm } from '../generated_module/services/sopdemandanalysisdm-service';
import { SopMaterialDimensionRelationService } from '../generated_module/services/sopmaterialdimensionrelation-service';
import { SopProdWorkdayService } from '../generated_module/services/sopprodworkday-service';
import { SopDemandImportImportService } from '../generated_module/services/sopdemandimportservice';
import { SopReductionRuleManageService } from '../generated_module/services/SopReductionRuleManage-service.';
import { SopForeastSetService } from '../generated_module/services/sopforeastset-service';
import { SopForeastManageService } from '../generated_module/services/sopforecastmanage-service';
import { MessageProfileService } from './services/message-profile-service';
import { ForeastParameterService } from './services/forecast-parameter-service';
import { UserDataPermissionsService } from './services/user-data-permissions-service';
import { UserRolePermissionsService } from './services/user-role-permissions-service';
import { CustomerDivisionService } from './services/customer-division-service';
import { ForecastTreeService } from './services/forecast-tree.service';
import { MaterialMoldRelationService } from './services/material-mold-relation-service';
import { PsMouldManageService } from './services/psmould.service';
import { PsMouldItemManageService } from './services/psmould-item.service';
import { MoreThanOneService } from './services/more-than-one.service';
import { DpForecastCollaborationService } from './services/dp-forecast-collaboration.service';
import { SalesForecastService } from './services/sales-forecast.service';
import { ExportImportService } from './services/export-import.service';
import { VendorCategoriesPercentService } from './services/vendor-categories-percent-service';
import { SopLongTermItemManageService } from './services/soplongtermitem-manage-service';
import { ProductSellBalanceSopSupplyCapCustomizedImportComponent } from 'app/aps/product-sell-balance/sop-supply-cap-customized/import/import.component';
import { SopSupplyRestrainCapService } from './services/SopSupplyRestrainCapService';
import { PsSupplyStcokService } from './services/PsSupplyStcokService';
import { SelfmadeOutsourcingPercentManageService } from './services/selfmadeoutsourcingpercent-manage-service';
import { MoMultiMouldManageService } from './services/momultimould-manage-service';
import {AttachInfoService} from '../../aps/sale/attachInfo/attachInfo.service';
import { PlanscheduleHWCommonService } from './services/hw.service';


@NgModule({
    imports: [
        BaseModule,
        ExcelExportModule],
    providers: [
        SessionService,
        LookupCodeManageService,
        ExecutablesManageService,
        MessageManageService,
        ShortcutkeyService,
        AudittablesService,
        FunctionmanagerService,
        RespmanagerService,
        PsusermanagerService,
        BaseApplicationManageService,
        BaseFlexValueSetsManageService,
        MenuManagerManageService,
        MenuGroupPluginService,
        ShiftthemappingManageService,
        UserManagerManageService,
        ConcurrentProgramManageService,
        PsPrivilegeService,
        SyncRefreshHistoryService,
        SyncConfigManageService,
        ConcurrentManagerService,
        ServerNodesManageService,
        RequestGroupsService,
        ConcurrentDefineService,
        ScheduleManagerService,
        PlantMaintainService,
        ProLineGroupMaintainService,
        RequestSubmitQueryService,
        MaterialmaintenanceService,
        CommonQueryService,
        CategorySetManagerService,
        MaterialmanagementCategorymanageService,
        BaseTranslstorService,
        OrganizationTranAdvanceService,
        ERPJobTypeService,
        ProductLineManagerService,
        DemandOrderSplitMergeService,
        ComVindicateService,
        BaseParameterService,
        DemandOrderSplitMergeService,
        DemandclearupnoticeService,
        MoManagerService,
        MOBatchReleaseService,
        ColorManageService,
        BasePsBomService,
        PsAssemblyRelationService,
        ReqLineTypeDefaultSetService,
        PurchaseRegionService,
        SupplierService,
        ItemCategoryService,
        DlyCalendarService,
        DemandPutService,
        PcBuyerService,
        PcBuyerAuthService,
        UserItemCategoryService,
        DlyCalendarService,
        RequestSetsService,
        OperationManageService,
        OperationLeadTimeService,
        MoProcessMaintenanceService,
        QueryKitStatusService,
        QueryPurchaseKitStatusService,
        PoComVindicateService,
        ItemonhandQueryService,
        ModelChangeTimeService,
        MoExceptionService,
        SopDimmainresrevVewService,
        SopMaterialPurchaseMaintenanceService,
        SopMaterialResourceCorrelationService,
        SopSupplierCapacityMaintenanceService,
        SopDemandAnalysisdm,
        SopMaterialDimensionRelationService,
        SopProdWorkdayService,
        SopDemandImportImportService,
        SopReductionRuleManageService,
        SopForeastSetService,
        SopForeastManageService,
        BaseUserMessageService,
        MessageProfileService,
        ForeastParameterService,
        ForecastTreeService,
        UserDataPermissionsService,
        UserRolePermissionsService,
        CustomerDivisionService,
        MaterialMoldRelationService,
        PsMouldManageService,
        PsMouldItemManageService,
        MoreThanOneService,
        DpForecastCollaborationService,
        SalesForecastService,
        ExportImportService,
        VendorCategoriesPercentService,
        SopLongTermItemManageService,
        SopSupplyRestrainCapService,
        PsSupplyStcokService,
        SelfmadeOutsourcingPercentManageService,
        MoMultiMouldManageService,
        AttachInfoService,
        PlanscheduleHWCommonService
    ],
    exports: [
        CustomExcelExportComponent,
        CustomFormQueryComponent,
        GridContextMenuComponent,
        CustomSelectLookupComponent,
        CustomPagerComponent
    ]
})
export class GeneratedModule { }

