import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CustomAgCellRenderComponent } from 'app/modules/base_module/components/custom-agcell-render.component';
import { DemandclearupnoticeService } from 'app/modules/generated_module/services/demandclearupnotice-service';
import { formatDate } from '@angular/common';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demandclearupnoticesplit-ag',
  templateUrl: './demandclearupnoticesplitAg.component.html',
  providers: [DemandclearupnoticeService, CommonQueryService]// modify by garfield 20190119
})
export class DemandOrderManagementDemandclearupnoticesplitAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;

  i: any;
  totalQty = 0;
  disabled = false;
  index = 1;
  BATCH_REQ_QTY = 0;
  splitType = '1';
  public columns = [
    {
      colId: 3, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: this.customTemplate,         // Complementing the Cell Renderer parameters
      }
    },
    {
      field: 'REQ_DATE', headerName: '需求日期',
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: this.customTemplate1,   }
    },
    {
      field: 'REQ_QTY', headerName: '需求数量',
      editable: true
      // cellRendererFramework: CustomAgCellRenderComponent,       // Component Cell Renderer
      // cellRendererParams: {
      //   customTemplate: `<nz-input-number [(ngModel)]="dataItem.REQ_QTY" (ngModelChange)="onQtyChanged($event)" [nzStep]="0.01" name="REQ_QTY"></nz-input-number>`
      // }
    }
  ];
  constructor(private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private modalS: NzModalRef,
    public editService: DemandclearupnoticeService,
    private appTranslationService: AppTranslationService,
    private commonQueryService: CommonQueryService
  ) {
    super({ pro: null, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.gridData = [];
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.columns[1].cellRendererParams.customTemplate = this.customTemplate1;

    this.isSizeColumnsToFit = true;
    this.BATCH_REQ_QTY = this.i.REQ_QTY;
    // this.totalQty = this.i.REQ_QTY;
    // 默认子订单的需求日期等于父订单
    // this.i.REQ_DATE = this.commonQueryService.formatDate(this.i.REQ_DATE);
    // const dataItem = this.clone(this.i);
    // dataItem.ID = this.index.toString();
    // this.gridData = [dataItem];
    this.defaultColDef.sortable = false;
    this.defaultColDef.filter = false;
  }
  // 清除行
  clear() {
    this.gridData = [];
    this.caculateQty();
  }
  // 新增行
  public add() {
    const useQty = this.i.REQ_QTY - this.totalQty;
    if (this.isNull(this.BATCH_REQ_QTY)) {
      this.msgSrv.warning(this.appTranslationService.translate('拆分行数量不能为空！'));
      return;
    }
    if (useQty > 0 && useQty > this.BATCH_REQ_QTY) {
      // 等量拆分
      if (this.splitType === '1') {
        const qty = useQty % this.BATCH_REQ_QTY;
        const count = Math.floor(useQty / this.BATCH_REQ_QTY);
        for (let n = 0; n < count; n++) {
          this.index++;
          const dataItem = this.clone(this.i);
          dataItem.ID = this.index.toString();
          dataItem.REQ_QTY = this.BATCH_REQ_QTY;
          this.gridData.push(dataItem);
        }
        if (qty > 0) {
          this.index++;
          const dataItem = this.clone(this.i);
          dataItem.ID = this.index.toString();
          dataItem.REQ_QTY = qty;
          this.gridData.push(dataItem);
        }
      } else {  // 尾数拆分
        this.index++;
        const dataItem = this.clone(this.i);
        dataItem.ID = this.index.toString();
        dataItem.REQ_QTY = this.BATCH_REQ_QTY;
        this.gridData.push(dataItem);
        this.index++;
        const dataItem2 = this.clone(this.i);
        dataItem2.ID = this.index.toString();
        dataItem2.REQ_QTY = useQty - this.BATCH_REQ_QTY;
        this.gridData.push(dataItem2);
      }
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('未拆分数量必须大于0和批次数量!'));
    }
    this.caculateQty();
    this.gridData = this.clone(this.gridData);
  }
  // 删除行
  public remove(dataItem: any) {
    const rowIndex = this.gridData.findIndex(x => x.ID === dataItem.ID);
    this.gridData.splice(rowIndex, 1);
    this.caculateQty();
    this.gridData = this.clone(this.gridData);
  }

  private caculateQty() {
    this.totalQty = 0;
    this.gridData.forEach(x => { this.totalQty += Number(x.REQ_QTY); });
  }
  // 保存
  public saveChanges(): void {
    // tslint:disable-next-line:no-unused-expression
    if (this.gridData.length <= 1) {
      this.msgSrv.success(this.appTranslationService.translate('拆分行数需要大于一行'));
      return;
    }
    // tslint:disable-next-line:no-non-null-assertion
    if (Number(this.i.REQ_QTY) === this.totalQty) {
      this.gridData.forEach(x => { x.REQ_DATE = new Date(x.REQ_DATE); x.REQ_QTY = x.REQ_QTY.toString(); });
      const params = this.gridData.map(item => {
        return {
          reqNumber: item.REQ_NUMBER,
          reqLineNum: item.REQ_LINE_NUM,
          reqQty: item.REQ_QTY,
          reqDate: formatDate(item.REQ_DATE, 'yyyy-MM-dd HH:mm:ss', 'zh-Hans')
        };
      });
      this.editService.saveSplitOrder(params).subscribe(m => {
        if (m.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('拆分成功'));
          this.modalS.close(true);
        } else {
          this.msgSrv.error(this.appTranslationService.translate(m.msg || '拆分失败!'));
        }
      });
    } else {
      this.msgSrv.warning(this.appTranslationService.translate('拆分的需求数量汇总和父订单需求数量需要一致!'));
    }
  }
  // 单元格内容改变
  onCellValueChanged(event) {
    if (this.isNullDefault(event.oldValue, '').toString() !== this.isNullDefault(event.newValue, '').toString() && event.colDef.headerName === '需求数量') {
      this.caculateQty();
      this.gridData = this.clone(this.gridData);
    }
  }
  // 可编辑列，作用于可编辑列样式和cell值变更
  // editColumnHeaders = ['需求日期', '需求数量'];
  editColumnHeaders = [];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#noticeSplitGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52C');
        }
      });
    }
  }
  close() {
    this.modalS.destroy();
  }

}
