/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-07-15 15:08:59
 * @LastEditors: Zwh
 * @LastEditTime: 2019-09-05 10:18:41
 * @Note: ...
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { State, process } from '@progress/kendo-data-query';
import { QueryService } from '../../query.service';
import { CustomBaseContext } from '../../../../../modules/base_module/components/custom-base-context.component';
import { UiType } from '../../../../../modules/base_module/components/custom-form-query.component';
import { AppTranslationService } from '../../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-maintain-copy-line-select',
  templateUrl: './line-select.component.html',
  providers: [QueryService],
})
export class PlantModelCalendarMaintainCopyLineSelectComponent extends CustomBaseContext implements OnInit {

  expandForm = false;
  // 来源日历参数
  public i: any;
  public selectBy = 'id';
  // 下拉选项
  public groupOptions: any[] = [];
  public plantOptions: any[] = [];
  public lineOptions: any[] = [];
  // 查询参数定义
  public queryParams = {
    defines: [
      { field: 'scheduleRegionCode', title: '事业部', readonly: true, ui: { type: UiType.text } },
      { field: 'scheduleGroupCode', title: '计划组', ui: { type: UiType.select, options: this.groupOptions, eventNo: 1 } },
      { field: 'resourceCode', title: '资源', ui: { type: UiType.select, options: this.lineOptions, eventNo: 2 } },
      { field: 'descriptions', title: '资源描述', ui: { type: UiType.text } }
    ],
    values: {
      scheduleRegionCode: '',
      plantCode: '',
      scheduleGroupCode: '',
      resourceCode: '',
      descriptions: '',
      pageIndex: 1,
      pageSize: this.gridState.take
    }
  };

  // gridOptions2 = Object.assign(this.gridOptions, {
  //   pagination: false,
  // });

  // grid列定义
  public columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '资源', menuTabs: ['filterMenuTab'] },
    { field: 'descriptions', headerName: '资源描述', tooltipField: 'descriptions', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', headerName: '组织', menuTabs: ['filterMenuTab'] },
  ];
  // 构造函数
  constructor(
    private modalRef: NzModalRef,
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 265;
    // this.gridOptions.suppressRowClickSelection = false;
  }
  // 初始化
  ngOnInit(): void {
    // this.setGridHeight({ topMargin: 335  /*网格上边框距离浏览器工具栏下边框的距离（像素）*/, bottomMargin: 80 });
    // 设置默认查询参数
    this.setDefaultQueryParams();
    // 工厂
    this.loadUserPlant();
    // 计划组
    this.loadGroup();
    // 资源
    this.loadLine();
    this.queryCommon();
  }
  // 加载工厂
  private loadUserPlant() {
    this.plantOptions.length = 0;
    this.queryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode,
        });
      });
    });
  }
  // 计划组
  private loadGroup() {
    this.groupOptions.length = 0;
    if ((this.queryParams.values.scheduleRegionCode || '') === '') return;
    this.queryService.GetUserPlantGroup(this.queryParams.values.plantCode || '', this.queryParams.values.scheduleRegionCode || '')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.groupOptions.push({ value: d.scheduleGroupCode, label: d.scheduleGroupCode, plantCode: d.plantCode });
        });
      });
  }
  // 切换工厂
  public plantChange(value: string) {
    if ((value || '') !== '') {
      const plantInfo = this.plantOptions.find(x => x.value === value);
      this.queryParams.values.plantCode = plantInfo.value || '';
    }
    // 计划组
    this.loadGroup();
    // 资源
    this.loadLine();
  }
  // 切换计划组
  public groupChange(value: string) {
    this.queryParams.values.resourceCode = null;
    this.queryParams.values.descriptions = '';
    if (value !== undefined && value !== '') {
      const groupInfo = this.groupOptions.find(x => x.value === value);
      this.queryParams.values.plantCode = groupInfo && groupInfo.plantCode || '';
    }
    this.loadLine();
  }
  // 切换资源
  public resourceChange(value: string) {
    const descriptions = (value !== undefined && value !== null) ? this.lineOptions.find(x => x.value === value).descriptions : '';
    this.queryParams.values.descriptions = descriptions;
  }
  // 资源
  private loadLine() {
    this.lineOptions.length = 0;
    if ((this.queryParams.values.scheduleGroupCode || '') === '') return;
    this.queryService.GetUserPlantGroupLine(this.queryParams.values.plantCode || '', this.queryParams.values.scheduleGroupCode || '')
      .subscribe(result => {
        console.log(result);
        result.Extra.forEach(d => {
          this.lineOptions.push({ value: d.resourceCode, label: d.resourceCode, descriptions: d.descriptions });
        });
      });
  }
  // 查询
  public query() {
    super.query();
    this.queryCommon();
  }
  httpAction = { url: this.queryService.seachUrl1, method: 'GET' };
  // 获取查询参数值
  private getQueryParamsValue(): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      groupCode: this.queryParams.values.scheduleGroupCode,
      resourceCode: this.queryParams.values.resourceCode,
    };
  }

  // 查询请求
  private queryCommon() {
    this.queryParams.values.pageIndex = this._pageNo;
    this.queryParams.values.pageSize = this._pageSize;
    this.setLoading(true);
    this.queryService.loadGridViewNew(this.httpAction, this.getQueryParamsValue(), this.context);

    // this.queryService.GetUserPlantGroupLine(this.queryParams.values.plantCode,this.queryParams.values.scheduleGroupCode,this.queryParams.values.resourceCode).subscribe(result => {
    //   if (result !== null && result.Extra !== null)
    //     this.view = {
    //       data: process(result.Extra, {
    //         sort: this.gridState.sort,
    //         skip: 0,
    //         take: this.gridState.take,
    //         filter: this.gridState.filter
    //       }).data,
    //       total: result.Extra.length
    //     };
    //   this.setLoading(false);
    // });
    // this.queryService.GetUserPlantGroupLine(this.queryParams.values.plantCode,this.queryParams.values.scheduleGroupCode,this.queryParams.values.resourceCode).subscribe(result => {
    //   if (result !== null && result.Extra !== null)
    //     this.view = {
    //       data: process(result.Extra, {
    //         sort: this.gridState.sort,
    //         skip: 0,
    //         take: this.gridState.take,
    //         filter: this.gridState.filter
    //       }).data,
    //       total: result.Extra.length
    //     };
    //   this.setLoading(false);
    // });



    // this.queryService.GetUserPlantGroupLinePage(this.queryParams.values).subscribe(result => {
    //   if (result !== null && result.Result !== null)
    //     this.view = {
    //       data: process(result.Result, {
    //         sort: this.gridState.sort,
    //         skip: 0,
    //         take: this.gridState.take,
    //         filter: this.gridState.filter
    //       }).data,
    //       total: result.TotalCount
    //     };
    //   this.setLoading(false);
    // });
  }

  // 复制
  public copy() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要复制的记录！'));
      return;
    }
    this.setLoading(true);
    // datetime to string
    this.i.showStartTime = this.queryService.formatDate(this.i.showStartTime) + " 00:00:00";
    this.i.showEndTime = this.queryService.formatDate(this.i.showEndTime) + " 00:00:00";
    this.i.lineIds = this.selectionKeys;
    this.queryService.CopyByLine(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('复制成功'));
        this.modalRef.close(true);
      } else {
        this.msgSrv.warning(this.appTranslationService.translate(res.msg));
      }
      this.setLoading(false);
    });
  }
  // 设置默认查询参数
  private setDefaultQueryParams() {
    this.queryParams.values.scheduleRegionCode = this.i.scheduleRegionCode || '';
    this.queryParams.values.plantCode = this.i.plantCode || '';
    // this.queryParams.values.scheduleGroupCode = this.i.scheduleGroupCode || '';
    // this.queryParams.values.resourceCode = this.i.resourceCode || '';
    // 备份初始化查询参数
    this.cloneQueryParams();
  }
  // 重置
  public clear() {
    console.log('this.queryValuesClone');
    // if (!this.isNull(this.queryValuesClone) && !this.isNull(this.queryParams)) {
    //   this.queryParams.values = this.clone(this.queryValuesClone);
    // }
    // this.queryParams.values.scheduleRegionCode = '323232';
    super.clear();
    // 资源
    this.loadLine();
    //工厂
    this.loadUserPlant();
  }
  // 关闭
  close() {
    this.modalRef.destroy();
  }

  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
