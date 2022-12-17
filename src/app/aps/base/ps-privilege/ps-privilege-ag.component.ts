import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';

import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { BasePsPrivilegeEditService } from './edit.service';
import { BasePsPrivilegeEditComponent } from './edit/edit.component';
import { BaseMenuGroupPluginChildComponent } from '../menu-group-plugin-child/menu-group-plugin-child.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import {BaseUserPrivilegeImportComponent} from './import/import.component';
/**
 * 用户权限
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-ps-privilege-ag',
  templateUrl: './ps-privilege-ag.component.html',
  providers: [BasePsPrivilegeEditService],
})

export class BasePsPrivilegeAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  public selectBy = 'id';
  public optionListUSER: any[] = [];
  public optionListPlant: any[] = [];
  public optionListPlantGroup: Set<any> = new Set();
  public optionListProductLine: Set<any> = new Set();
  public applicationYesNo: any[] = [];
  public applicationsMSG: any[] = [];
  isLoading = false;

  getUserList = (value, pageIndex, pageSize) => this.commonQueryService.getUsersPage(value, pageIndex, pageSize);
  public queryParams = {
    defines: [
      // { field: 'userId', title: '用户名', ui: { type: UiType.select, options: this.optionListUSER } },
      { field: 'userId', title: '用户名', ui: 
        { 
          type: UiType.selectServer,
          selectLabelField: 'description',
          selectValueField: 'userName',
          isSelectedShowValue: true,
          ngModelChange: this.userChange,
          searchFunction: this.getUserList
        } 
      },
      { field: 'plantId', title: '工厂', ui: { type: UiType.select, options: this.optionListPlant, ngModelChange: this.onChangePlant } },
      { field: 'plantGroupId', title: '计划组', ui: { type: UiType.select, options: this.optionListPlantGroup, ngModelChange: this.onChangeGroup } },
      { field: 'productLineId', title: '资源', ui: { type: UiType.select, options: this.optionListProductLine } },
      { field: 'modify', title: '工单修改', ui: { type: UiType.select, options: this.applicationYesNo } },
      { field: 'publish', title: '工单发放', ui: { type: UiType.select, options: this.applicationYesNo } }
    ],
    values: {
      userId: null,
      plantId: null,
      plantGroupId: null,
      productLineId: null,
      modify: null,
      publish: null
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'userName', headerName: '用户名', tooltipField: 'userName', menuTabs: ['filterMenuTab'] },
    {
      field: 'description', headerName: '用户描述', tooltipField: 'description', menuTabs: ['filterMenuTab']
    },
    {
      field: 'plantCode', headerName: '工厂', tooltipField: 'plantCode', menuTabs: ['filterMenuTab']
    },
    {
      field: 'scheduleGroupCode', headerName: '计划组', tooltipField: 'scheduleGroupCode', menuTabs: ['filterMenuTab']
    },
    {
      field: 'resourceCode', headerName: '资源', tooltipField: 'resourceCode', menuTabs: ['filterMenuTab']
    },
    {
      field: 'modifyPrivilageFlag', headerName: '工单修改', valueFormatter: 'ctx.optionsFindYesOrNo(value,1)', tooltipField: 'modifyPrivilageFlag', menuTabs: ['filterMenuTab']
    },
    {
      field: 'publishPrivilageFlag', headerName: '工单发放', valueFormatter: 'ctx.optionsFindYesOrNo(value,1)', tooltipField: 'publishPrivilageFlag', menuTabs: ['filterMenuTab']
    },
    {
      field: 'sendMailFlag', headerName: '是否发送邮件', valueFormatter: 'ctx.optionsFindYesOrNo(value,1)', tooltipField: 'sendMailFlag', menuTabs: ['filterMenuTab']
    },
    {
      field: 'receiveMsgType', headerName: '接收消息类型',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    }
  ];
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.applicationsMSG;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  public optionsFindYesOrNo(value: string, optionsIndex: number): any {
    return {Y: '是', N: '否'}[value];
  }

  userChange(e) {
    this.queryParams.values.userId = e.value;
  }

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: BasePsPrivilegeEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.loadMSG();
    // this.loadUser();
    this.loadplant();
    this.loadplantGroup();
    this.loadproductLine();
    this.loadYesNo();
    this.clear();
    this.queryCommon();
  }

  allColumnIds: any[] = [];
  setGridWidth(key: string) {
    const columnState = <ColumnState[]>this.appGridStateService.get(key);
    if (columnState !== null) {
    } else {
      this.allColumnIds.length = 0;
      this.gridColumnApi.getAllColumns().forEach(x => {
        this.allColumnIds.push(x.getColId());
      });
      if (this.allColumnIds.length < 9) {
        this.gridApi.sizeColumnsToFit();
      } else {
        this.gridColumnApi.autoSizeColumns(this.allColumnIds);
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.setGridWidth('pcbuyer');
  }

  public loadMSG(): void {
    this.commonQueryService.GetLookupByType('PS_RECEIVE_MSG_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationsMSG.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  loadUser(): void {
    this.isLoading = true;
    this.editService.GetAppliactioUser().subscribe(result => {
      this.isLoading = false;
      // this.optionListUSER = result.Extra;
      result.data.forEach(d => {
        this.optionListUSER.push({
          label: d.userName,
          value: d.userName,
        });
      });
    });
  }

  loadplant(): void {

    this.isLoading = true;
    this.editService.GetAppliactioPlant().subscribe(result => {
      result.data.forEach(d => {
        this.optionListPlant.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });
  }

  loadplantGroup(): void {
    this.isLoading = true;
    this.editService.GetAppliactioGroup().subscribe(result => {
      result.data.forEach(d => {
        this.optionListPlantGroup.add({
          label: d.scheduleGroupCode,
          value: d.scheduleGroupCode,
        });
      });
    });
  }

  loadproductLine(): void {
    this.isLoading = true;
    this.editService.GetAppliactioLine().subscribe(result => {
      result.data.forEach(d => {
        this.optionListProductLine.add({
          label: d.resourceCode,
          value: d.resourceCode,
        });
      });
    });
  }

  // 绑定语言
  public loadYesNo(): void {

    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationYesNo.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    /** 重新绑定  组*/
    this.editService
      .GetAppliactioGroupByPlantID(value)
      .subscribe(result => {
        if (result.data == null) {
          this.optionListPlantGroup.clear();
          return;
        } else {
          console.log(value);
          // 先清除，在重新绑定
          this.optionListPlantGroup.clear();
          result.data.forEach(d => {
            this.optionListPlantGroup.add({
              label: d.scheduleGroupCode,
              value: d.scheduleGroupCode
            });
          });
          // this.optionListPlantGroup = [
          //   ...this.optionListPlantGroup,
          //   ...result.Extra,
          // ];
          return;
        }
      });
  }

  // 组 值更新事件 重新绑定产线
  onChangeGroup(value: string): void {
    /** 重新绑定  组*/
    this.editService
      .GetAppliactioGroupIDLine(value)
      .subscribe(result => {
        if (result.data == null) {
          this.optionListProductLine.clear();
          return;
        } else {
          // 先清除，在重新绑定
          this.optionListProductLine.clear();
          result.data.forEach(d => {
            this.optionListProductLine.add({
              label: d.resourceCode,
              value: d.resourceCode,
            });
          });
          // this.optionListProductLine = [
          //   ...this.optionListProductLine,
          //   ...result.Extra,
          // ];
          return;
        }
      });
  }

  httpAction = { url: this.editService.seachUrl, method: 'GET' };
  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridViewNew(this.httpAction, this.queryParams.values, this.context);
  }

  public add(item: any) {
    this.modal
      .static(
        BasePsPrivilegeEditComponent,
        { i: { id: (item !== undefined ? item.id : null) } },
        'lg',
      )
      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  public remove(item: any) {
    this.editService.Remove(item).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  removeBath() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    // 弹出确认框
    console.log(this.selectionKeys);
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.RemoveBath(this.selectionKeys).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'receiveMsgType', options: this.applicationsMSG }];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    this.commonQueryService.export({ url: this.editService.seachUrl, method: 'GET' }, this.queryParams.values, this.excelexport, this.context);
    // this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport);
  }

  public clear() {
    this.queryParams.values = {
      userId: null,
      plantId: null,
      plantGroupId: null,
      productLineId: null,
      modify: null,
      publish: null,
    };
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

  /**
   * 导入用户权限
   */
  public imports() {
    this.modal.static(BaseUserPrivilegeImportComponent, {}, 'md').subscribe(value => {
      this.query();
    });
  }
}
