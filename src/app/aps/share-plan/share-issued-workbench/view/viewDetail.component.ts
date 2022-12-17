import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import {
  GridDataResult,
  PageChangeEvent,
  RowArgs,
  SelectableSettings,
} from '../../../../../../node_modules/@progress/kendo-angular-grid';
import { QueryService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'viewDetail',
  templateUrl: './viewDetail.component.html',
  styleUrls: ['./viewDetail.component.css'],
  providers: [QueryService],
})
export class ViewDetailComponent extends CustomBaseContext implements OnInit {
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
  ) {
    super({
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: null,
    });
  }

  public ngOnInit(): void {
    // this.msgSrv.success(this.iParam.field + this.iParam.title);
    this.selectableSettings = {
      checkboxOnly: false,
      mode: 'single',
    };
    if (this.iParam.rowType === 'demand') {
      this.title = '需求明细';
      this.extendColumns = [
        { field: 'plantCode', headerName: '工厂', width: 70, locked: false },
        {
          field: 'itemCode',
          headerName: '装配件',
          width: 150,
          locked: false,
        },
        {
          field: 'demandType',
          headerName: '需求类型',
          width: 120,
          locked: false,
        },
        { field: 'sourcePlantCode', headerName: '来源工厂', width: 120, locked: false },
        {
          field: 'sourceCode',
          headerName: '需求单号',
          width: 120,
          locked: false,
        },
        { field: 'reqItemCode', headerName: '需求物料', width: 150, locked: false },
        {
          field: 'demandQty',
          headerName: '需求数量',
          width: 120,
          locked: false,
        },
        {
          field: 'planDemandDate',
          headerName: '需求日期',
          width: 120,
          locked: false,
        },
      ];
      this.myGridRowKey = { tb: 'PP_SHARE_DEMAND' };
    } else if (this.iParam.rowType === 'mo') {
      this.title = '工单明细';
      this.extendColumns = [
        { field: 'plantCode', headerName: '工厂', width: 70, locked: false },
        {
          field: 'sourceCode',
          headerName: '工单号',
          width: 120,
          locked: false,
        },
        { field: 'moDemandDate', headerName: '工单需求日期', width: 120, locked: false },
        {
          field: 'itemCode',
          headerName: '物料编码',
          width: 150,
          locked: false,
        },
        {
          field: 'demandQty',
          headerName: '供应数量',
          width: 120,
          locked: false,
        },
        {
          field: 'demandDate',
          headerName: '供应日期',
          width: 120,
          locked: false,
        },
      ];
      this.myGridRowKey = { tb: 'PP_SHARE_SUPPLY' };
    } else if (this.iParam.rowType === 'itemRoutings') {
      this.title = '工艺路线';
      this.extendColumns = [
        { field: 'processCode', headerName: '工序', width: 70, locked: false },
        {
          field: 'scheduleGroupCode',
          headerName: '部门',
          width: 120,
          locked: false,
        },
        {
          field: 'resourceCode',
          headerName: '资源',
          width: 120,
          locked: false,
        },
        {
          field: 'techVersion',
          headerName: '工艺版本',
          width: 120,
          locked: false,
        },
        {
          field: 'rateType',
          headerName: '速率类型',
          width: 120,
          locked: false,
        },
        { field: 'rate', headerName: '速率', width: 120, locked: false },
        { field: 'itemCode', headerName: '组件', width: 120, locked: false },
      ];
      this.myGridRowKey = { tb: 'PS_ITEM_ROUTINGS' };
    } else if (this.iParam.rowType === 'bomCompent') {
      // 已调用BOM查询，此处无效
      this.title = 'BOM组件';
      this.extendColumns = [
        { field: 'itemCode', headerName: '组件', width: 120, locked: false },
        {
          field: 'descriptionsCn',
          headerName: '组件描述',
          width: 150,
          locked: false,
        },
        {
          field: 'componentQuantity',
          headerName: '用量',
          width: 70,
          locked: false,
        },
        { field: 'unit', headerName: '单位', width: 100, locked: false },
        {
          field: 'planCategoryName',
          headerName: '计划分类',
          width: 120,
          locked: false,
        },
      ];
    }

    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    const pageNo = this.lastPageNo;
    const pageSize = this.lastPageSize;
    this.iParam.PageIndex = pageNo;
    this.iParam.pageSize = pageSize;
    this.commonQueryService.SearchDetail(this.iParam).subscribe(result => {
      this.gridData.length = 0;
      this.totalCount = result.data.totalElements;
      if (result !== null && result.data.content !== null) {
        result.data.content.forEach(d => {
          if (this.iParam.rowType === 'itemRoutings') {
            if (d.rateType === '1') d.rateType = 'TAKT节拍(单位秒)';
            else if (d.rateType === '2') d.rateType = 'QTY/HR(小时产量)';
            else d.rateType = '批次';
          } else if (this.iParam.rowType === 'demand') {
            if (d.demandType === 'ORDER') d.demandType = '订单';
            else if (d.demandType === 'PLAN') d.demandType = '总装计划单';
            else if (
              d.demandType === 'ASS_PLAN' ||
              d.demandType === 'PLAN_EX'
            )
              d.demandType = '自制件计划单';
            // MO
            else d.demandType = '工单';
          }
          this.gridData.push(d);
        });
      }
      this.gridData = result.data.content;
      this.view = {
        data: this.gridData,
        total: this.totalCount,
      };
      this.setLoading(false);
    });
  }

  // 返回选中行对象
  public mySelectionKey(context: RowArgs): string {
    return context.dataItem.ITEM_ID;
  }

  // 选中行事件
  public onSelectedKeysChange(e) {
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
      this.query();
    } else {
      this.setLoading(false);
    }
  }
}
