import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent, RowArgs, SelectableSettings } from '../../../../../../node_modules/@progress/kendo-angular-grid';
import { QueryService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'view',
  templateUrl: './view.component.html',
  // styleUrls: ['./view.component.css'],
  providers: [QueryService],
})
export class ViewComponent extends CustomBaseContext implements OnInit {
  title: String = '需求-MO明细';
  iParam: any;
  public gridData: any[] = [];
  public totalCount = 0;
  gridHeight = document.body.clientHeight - 300;
  public selectableSettings: SelectableSettings;
  public mySelection: any[] = [];
  extendColumns: any[] = [];
  gridRowStyle = { 'border-bottom': '1px solid #d9d9d9' };
  myGridRowKey: any;
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null }); }

  public ngOnInit(): void {
    // this.msgSrv.success(this.iParam.field + this.iParam.title);
    this.selectableSettings = {
      checkboxOnly: false,
      mode: 'single'
    };

    if (this.iParam.rowType === 'demand') {
      this.title = '需求明细';
      this.extendColumns = [{ field: 'plantCode', title: '工厂', width: 70, locked: false },
      { field: 'demandType', title: '需求类型', width: 120, locked: false },
      { field: 'sourcePlantCode', title: '来源工厂', width: 120, locked: false },
      { field: 'sourceCode', title: '需求单号', width: 120, locked: false },
      { field: 'itemCode', title: '需求装配件', width: 150, locked: false },
      { field: 'demandQty', title: '需求数量', width: 120, locked: false },
      { field: 'demandDate', title: '需求日期', width: 120, locked: false }];
      this.myGridRowKey = {tb: 'PP_SHARE_DEMAND'};
    } else if (this.iParam.rowType === 'mo') {
      this.title = '工单明细';
      this.extendColumns = [{ field: 'plantCode', title: '工厂', width: 70, locked: false },
      { field: 'sourceCode', title: '工单号', width: 120, locked: false },
      { field: 'itemCode', title: '物料编码', width: 150, locked: false },
      { field: 'demandQty', title: '供应数量', width: 120, locked: false },
      { field: 'demandDate', title: '供应日期', width: 120, locked: false }];
      this.myGridRowKey = {tb: 'PP_SHARE_SUPPLY'};
    } else if (this.iParam.rowType === 'itemRoutings') {
      this.title = '工艺路线';
      this.extendColumns = [{ field: 'processCode', title: '工序', width: 70, locked: false },
      { field: 'scheduleGroupCode', title: '部门', width: 120, locked: false },
      { field: 'resourceCode', title: '资源', width: 120, locked: false },
      { field: 'rateType', title: '速率类型', width: 120, locked: false },
      { field: 'rate', title: '速率', width: 120, locked: false },
      { field: 'itemCode', title: '组件', width: 120, locked: false }];
      this.myGridRowKey = {tb: 'PS_ITEM_ROUTINGS'};
    } else if (this.iParam.rowType === 'bomCompent') {
      // 已调用BOM查询，此处无效
      this.title = 'BOM组件';
      this.extendColumns = [{ field: 'itemCode', title: '组件', width: 120, locked: false },
      { field: 'descriptionsCn', title: '组件描述', width: 150, locked: false },
      { field: 'componentQuantity', title: '用量', width: 70, locked: false },
      { field: 'unit', title: '单位', width: 100, locked: false },
      { field: 'planCategoryName', title: '计划分类', width: 120, locked: false }];
    }

    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    const pageNo = this.gridState.skip / this.gridState.take + 1;
    const pageSize = this.gridState.take;
    this.iParam.PageIndex = pageNo;
    this.iParam.pageSize = pageSize;
    this.commonQueryService.SearchDetail(this.iParam).subscribe(result => {
      this.gridData.length = 0;
      this.totalCount = result.data.totalElements;
      if (result !== null && result.data.content !== null) result.data.content.forEach(d => {
        if (this.iParam.rowType === 'itemRoutings') {
          if (d.rateType === '1')
            d.rateType = 'TAKT节拍(单位秒)';
          else if (d.rateType === '2')
            d.rateType = 'QTY/HR(小时产量)';
          else
            d.rateType = '批次';
        }
        this.gridData.push(d);
      });
      // this.gridData = result.Result;
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridState.take,
          filter: this.gridState.filter
        }).data,
        total: this.totalCount
      };
    });
  }

  // 返回选中行对象
  public mySelectionKey(context: RowArgs): string {
    return context.dataItem.itemId;
  }

  // 选中行事件
  public onSelectedKeysChange(e) {
    // this.SetButtonEnable();
  }

  public dataStateChange(state: State) {
    this.gridState = state;
    this.queryCommon();
  }
}
