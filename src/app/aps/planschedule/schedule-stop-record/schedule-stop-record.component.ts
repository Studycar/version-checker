import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType, QueryParamDefineObject } from '../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { ScheduleStopRecordService } from './schedule-stop-record.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'schedule-stop-record',
  templateUrl: './schedule-stop-record.component.html',
  providers: [ScheduleStopRecordService],
})
export class ScheduleStopRecordComponent extends CustomBaseContext implements OnInit {
  plantCodeList: any[] = [];
  /*  -------------------------树形选择--------------------------------- */
  public treeDataTable: any[] = []; // 产线树形多选结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'CODE', title: this.appTranslationService.translate('名称'), width: '200px' },
    { field: 'DESCRIPTION', title: this.appTranslationService.translate('描述'), width: '200px' }
  ]; // 产线树形显示列
  public selection: any[] = []; // 选中项
  /*    ---------------------------------------------------------- */

  public queryParams = {
    defines: [
      { field: 'PLANT_CODE', title: this.appTranslationService.translate('工厂'), required: true, ui: { type: UiType.select, options: this.plantCodeList, eventNo: 1 } },
      { field: 'ResourceCodesStr', title: this.appTranslationService.translate('资源'), ui: { type: UiType.treeSelect, options: [], columns: this.treeNodeColumns, selection: [], keyField: 'ID', valueField: 'CODE', valueLevel: 1 } },
      { field: 'dateTimeRange', title: this.appTranslationService.translate('停产处理时间范围'), required: true, ui: { type: UiType.dateTimeRange } }
    ],
    values: {
      PLANT_CODE: this.appconfig.getPlantCode(),
      ResourceCodesStr: '',
      dateTimeRange: []
    }
  };

  public columns = [
    { field: 'plantCode', headerName: '工厂', title: '工厂', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '资源编码', title: '资源编码', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'resourcename', headerName: '资源名称', title: '资源名称', width: 120, menuTabs: ['filterMenuTab'] },
    { field: 'fpcTime', headerName: '停产处理开始时间', title: '停产处理开始时间', width: 170, menuTabs: ['filterMenuTab'] },
    { field: 'lpcTime', headerName: '停产处理结束时间', title: '停产处理结束时间', width: 170, menuTabs: ['filterMenuTab'] },
    { field: 'cleaningMethod', headerName: '停产处理方式', title: '停产处理方式', width: 150, menuTabs: ['filterMenuTab'] },
    { field: 'cleaningCost', headerName: '停产处理成本', title: '停产处理成本', width: 150, menuTabs: ['filterMenuTab'] },
  ];

  httpAction = { url: this.queryService.QueryUrl, method: 'GET' };

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private queryService: ScheduleStopRecordService,
    private appconfig: AppConfigService,
    private commonQueryService: CommonQueryService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
  }

  public ngOnInit(): void {
    this.loadOptionData();
    this.query();
  }

  loadOptionData() {
    /** 初始化  工厂*/
    this.commonQueryService.GetUserPlantNew().subscribe(result => {
      result.data.forEach(d => {
        this.plantCodeList.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
      // this.msgSrv.info(this.plantCodeList[0].value);
    });

    this.loadLine();
  }
  plantCodeChanged(event: any) {
    this.loadLine();
    this.findDefine().ui.selection = [];
  }
  // 加载资源
  loadLine() {
    // 获取计划组（产线树形结构数据）
    this.queryService.GetUserPlantGroup(this.queryParams.values.PLANT_CODE || '', '') // GetUserPlantGroupOrderByCode(this.queryParams.values.PLANT_CODE || '', '', false)
      .subscribe(result => {
        if (result.Extra !== undefined && result.Extra !== null) {
          const data = [];
          result.Extra.forEach(x => {
            data.push({ ID: x.id, CODE: x.scheduleGroupCode, DESCRIPTION: x.descriptions });
          });
          // 获取产线
          this.queryService.GetUserPlantGroupLine(this.queryParams.values.PLANT_CODE || '', '', '')  // GetUserPlantGroupLineOrderByCode(this.queryParams.values.PLANT_CODE || '', '', false)
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

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    const dto = this.getQueryParams(false);
    // this.queryService.loadGridView({ url: this.queryService.QueryUrl, method: 'POST' }, dto, this.context);

    this.commonQueryService.loadGridViewNew(this.httpAction, dto, this.context);
  }


  // 重置
  public clear() {
    // 默认开始时间为当前时间，结束时间为当前时间+15天
    const tf = new Date();
    const tt = this.queryService.addDays(tf, 15);
    this.queryParams.values = {
      PLANT_CODE: this.appconfig.getPlantCode(),
      ResourceCodesStr: '',
      dateTimeRange: [tf, tt],
    };
    this.loadLine();
    this.findDefine().ui.selection = this.selection;
  }

  private getQueryParams(IsExport: boolean) {
    const dto = {
      plantcode: this.queryParams.values.PLANT_CODE,
      resourcecodes: this.queryParams.values.ResourceCodesStr,
      starttime: this.commonQueryService.formatDateTime(this.queryParams.values.dateTimeRange[0]),
      endtime: this.commonQueryService.formatDateTime(this.queryParams.values.dateTimeRange[1]),
      isExport: IsExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };

    // const ui = this.findDefine().ui;
    // ui.selection.forEach(x => { if (x.level === ui.valueLevel) { dto.resourcecodes = dto.resourcecodes+ ',' + x.CODE; } });
    return dto;
  }
  selectBy = 'Id';
  // 行选中改变
  onSelectionChanged(event: any) {
    this.getGridSelectionKeys(this.selectBy);
  }

  expColumnsOptions: any[] = [];
  // 导出
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    const dto = this.getQueryParams(true);
    this.queryService.export(this.httpAction, dto, this.excelexport, this.context);
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
