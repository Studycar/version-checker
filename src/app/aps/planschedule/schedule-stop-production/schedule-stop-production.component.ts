import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType, QueryParamDefineObject } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { ScheduleStopProductionEditComponent } from './edit/edit.component';
import { ScheduleStopProductionImportComponent } from './import/import.component';
import { ScheduleStopProductionService } from './schedule-stop-production.service';
import { ScheduleStopProductionDetailComponent } from './detail/detail.component';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'schedule-stop-production',
  templateUrl: './schedule-stop-production.component.html',
  providers: [ScheduleStopProductionService],
})
export class ScheduleStopProductioComponent extends CustomBaseContext implements OnInit {

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  /*  -------------------------树形选择--------------------------------- */
  public treeDataTable: any[] = []; // 产线树形多选结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'CODE', title: '名称', width: '200px' },
    { field: 'DESCRIPTION', title: '描述', width: '200px' }
  ]; // 产线树形显示列
  public selection: any[] = []; // 选中项
  /*    ---------------------------------------------------------- */
  plantCodeList: any[] = [];
  yesOrNoList: any[] = [];

  httpAction = { url: this.editService.QueryUrl, method: 'GET' };

  public queryParams = {
    defines: [
      { field: 'PLANT_CODE', title: this.appTranslationService.translate('工厂'), required: true, ui: { type: UiType.select, options: this.plantCodeList, eventNo: 1 } },
      { field: 'ResourceCodesStr', title: this.appTranslationService.translate('资源'), ui: { type: UiType.treeSelect, options: [], columns: this.treeNodeColumns, selection: [], keyField: 'ID', valueField: 'CODE', valueLevel: 1 } },
      { field: 'ENABLE_FLAG', title: this.appTranslationService.translate('是否有效'), ui: { type: UiType.select, options: this.yesOrNoList } }
    ],
    values: {
      PLANT_CODE: this.appconfig.getPlantCode(),
      ResourceCodesStr: '',
      ENABLE_FLAG: null
    }
  };

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 120, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: { template: this.headerTemplate }
    },
    { field: 'plantCode', headerName: '工厂', title: '工厂', width: 120, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '资源编码', title: '资源编码', width: 120, locked: true, menuTabs: ['filterMenuTab'] },
    { field: 'resourcename', headerName: '资源名称', title: '资源名称', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'maxDuration', headerName: '最长持续时间(H)', title: '最长持续时间(H)', width: 170, menuTabs: ['filterMenuTab'] },
    { field: 'dealTime', headerName: '停产处理时间(H)', title: '停产处理时间(H)', width: 170, menuTabs: ['filterMenuTab'] },
    { field: 'dealMethod', headerName: '停产处理方式', title: '停产处理方式', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'dealCost', headerName: '停产处理成本', title: '停产处理成本', width: 150, menuTabs: ['filterMenuTab'] },
    {
      field: 'enableFlag', headerName: '是否有效', title: '是否有效', width: 120,
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },
  ];

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private editService: ScheduleStopProductionService,
    private appconfig: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
    this.headerNameTranslate(this.treeNodeColumns);
  }

  public ngOnInit(): void {
    console.log('schedule-stop-production.....ngOnInit');
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadOptionData();
    this.query();
  }

  loadOptionData() {
    // 当前用户对应工厂
    this.editService.GetUserPlantNew().subscribe(result => {
      result.data.forEach(d => {
        this.plantCodeList.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });

    this.loadLine();
    this.editService.GetLookupByType('FND_YES_NO').subscribe(result => {
      this.yesOrNoList.length = 0;
      result.Extra.forEach(d => {
        this.yesOrNoList.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  /**选择工厂 */
  plantChange(value: any) {
    this.loadLine();
  }
  // 加载资源
  loadLine() {
    // 获取计划组（产线树形结构数据）
    this.editService.GetUserPlantGroup(this.queryParams.values.PLANT_CODE || '', '') //this.editService.GetUserPlantGroupOrderByCode(this.queryParams.values.PLANT_CODE || '', '', false)
      .subscribe(result => {
        if (result.Extra !== undefined && result.Extra !== null) {
          const data = [];

          console.log(result.Extra);

          result.Extra.forEach(x => {
            data.push({ ID: x.id, CODE: x.scheduleGroupCode, DESCRIPTION: x.descriptions });
          });
          // 获取产线
          this.editService.GetUserPlantGroupLine(this.queryParams.values.PLANT_CODE || '', '', '') //this.editService.GetUserPlantGroupLineOrderByCode(this.queryParams.values.PLANT_CODE || '', '', false)
            .subscribe(result2 => {
              if (result2.Extra !== undefined && result2.Extra !== null) {
                // 根据计划组编码匹配产线子节点数据
                data.forEach(x => {
                  const items = result2.Extra.filter(d => d.scheduleGroupCode === x.CODE);
                  if (items !== undefined && items !== null)
                    x.children = [];
                  items.forEach(i => { x.children.push({ ID: i.id, CODE: i.resourceCode, DESCRIPTION: i.descriptions }); });
                });
                this.findDefine().ui.options = data; // 注意：数据加载完再赋值
              }
            });
        }
      });
  }
  // 返回指定field的参数定义项,找不到时返回undefined
  public findDefine(field: string = 'ResourceCodesStr'): QueryParamDefineObject {
    const result = this.queryParams.defines.find(x => x.field === field);
    return result;
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.yesOrNoList;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    const dto = this.getQueryParams(false);
    this.editService.loadGridViewNew(this.httpAction, dto, this.context);
  }

  private getQueryParams(IsExport: boolean) {
    const dto = {
      plantcode: this.queryParams.values.PLANT_CODE,
      resourcecodes: '',
      enableFlag: this.queryParams.values.ENABLE_FLAG,
      isExport: IsExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };

    const ui = this.findDefine().ui;
    ui.selection.forEach(x => {
      if (x.level === ui.valueLevel) {
        dto.resourcecodes = dto.resourcecodes + ',' + x.CODE;
      }
    });
    return dto;
  }
  // 适用属性组(物料类别)
  public detail(item: any) {
    this.modal.static(ScheduleStopProductionDetailComponent, { mainRecord: item !== undefined ? item : null }, 'lg').subscribe((value) => {
      if (value) {
        this.queryCommon();
      }
    });
  }

  // 新增、编辑
  public add(item: any) {
    this.modal.static(ScheduleStopProductionEditComponent, { originDto: item !== undefined ? item : null }, 'xl').subscribe((value) => {
      if (value) {
        this.queryCommon();
      }
    });
  }

  // 删除
  public remove(item: any) {
    this.editService.Delete([item.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.queryCommon();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  // 批量删除
  removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.Delete(this.selectionKeys).subscribe(() => {
          this.msgSrv.success('删除成功');
          this.queryCommon();
        });
      },
    });
  }

  // 重置
  public clear() {
    this.queryParams.values = {
      PLANT_CODE: this.appconfig.getPlantCode(),
      ResourceCodesStr: '',
      ENABLE_FLAG: null,
    };
    this.loadLine();
    this.findDefine().ui.selection = this.selection;
  }

  selectBy = 'id';
  // 行选中改变
  onSelectionChanged(event: any) {
    this.getGridSelectionKeys(this.selectBy);
  }

  // 导入
  public import() {
    this.modal.static(ScheduleStopProductionImportComponent, {}, 'md').subscribe(() => {
      this.queryCommon();
    });
  }

  /*导出快码*/
  expColumnsOptions: any[] = [{ field: 'enableFlag', options: this.yesOrNoList }];
  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = this.getQueryParams(true);
    this.editService.export(this.httpAction, dto, this.excelexport, this.context);
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
}
