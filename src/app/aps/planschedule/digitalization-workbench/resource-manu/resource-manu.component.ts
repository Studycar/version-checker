import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { PlanscheduleHWChangeDetailComponent } from "app/modules/base_module/components/change-detail/change-detail.component";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomExcelExportComponent } from "app/modules/base_module/components/custom-excel-export.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { NzMessageService, NzModalRef, NzModalService } from "ng-zorro-antd";
import { QueryService } from "./query.service";


@Component({
  selector: 'workbench-resource-manu',
  templateUrl: './resource-manu.component.html',
  providers: [QueryService]
})
export class ResourceManuComponent extends CustomBaseContext implements OnInit {

  dataItem: any = null; // 数字化排产单条数据
  selected: any = null;
  isChange: boolean = false;
  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    private commonQueryService: PlanscheduleHWCommonService,
    private queryService: QueryService,
    public modalHelper: ModalHelper,
    public http: _HttpClient,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    {
      field: 'scheduleGroupCode',
      width: 120,
      headerName: '计划组',
    },
    {
      field: 'resourceCode',
      width: 120,
      headerName: '资源',
    },
    {
      field: 'resourceDesc',
      width: 120,
      headerName: '资源描述',
    },
    {
      field: 'manufLineCode',
      width: 120,
      headerName: '产线编码',
    },
    {
      field: 'manufLineName',
      width: 120,
      headerName: '产线描述',
    },
    {
      field: 'priority',
      width: 80,
      headerName: '优先级',
    },

  ];

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  ngOnInit() {
    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: '/api/ps/psitemroutings/getResourceInfoByItem', method: 'GET' };
  queryCommon() {
    this.queryService.GetById(this.dataItem.id).subscribe(res => {
      this.dataItem = res.data;
      if (!['S', 'R'].includes(this.dataItem.makeOrderStatus)) {
        this.msgSrv.error(this.appTranslationService.translate('当前工单不是已发放、未发放状态：退出页面！'), { nzDuration: 1500 });
        this.modal.close(true);
        return;
      }
      this.commonQueryService.loadGridViewNew(
        this.httpAction,
        this.getQueryParamsValue(),
        this.context,
      )
    })
  }

  loadGridDataCallback(res) {
    setTimeout(() => {
      this.context.gridApi.forEachLeafNode(node => {
        if (node.data.scheduleGroupCode === this.dataItem.scheduleGroupCode
          && node.data.resourceCode === this.dataItem.resourceCode
          && node.data.manufLineCode === this.dataItem.manufLineCode) {
          node.setSelected(true);
        }
      });
    }, 0);
  }

  getQueryParamsValue(isExport = false) {
    return {
      plantCode: this.dataItem.plantCode,
      itemId: this.dataItem.itemId,
    }
  }

  onSelectionChanged(e) {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      this.selected = {
        scheduleGroupCode: selectedRows[0].scheduleGroupCode,
        resourceCode: selectedRows[0].resourceCode,
        resourceDesc: selectedRows[0].resourceDesc,
        manufLineCode: selectedRows[0].manufLineCode,
        manufLineName: selectedRows[0].manufLineName,
      };
      if (this.selected.scheduleGroupCode !== this.dataItem.scheduleGroupCode
        || this.selected.resourceCode !== this.dataItem.resourceCode
        || this.selected.manufLineCode !== this.dataItem.manufLineCode) {
        this.isChange = true;
        return;
      }
    }
    this.isChange = false;
  }

  save() {
    const params = Object.assign({}, {
      id: this.dataItem.id,
      plantCode: this.dataItem.plantCode,
    }, this.selected);
    this.queryService.save(params).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }

}
