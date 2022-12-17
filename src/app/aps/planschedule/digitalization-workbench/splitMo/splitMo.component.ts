import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { EditService } from '../edit.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-digitalization-workbench-splitmo',
  templateUrl: './splitMo.component.html',
  providers: [EditService]
})
export class PlanscheduleDigitalizationWorkbenchSplitMoComponent extends CustomBaseContext implements OnInit {
  // 当前行数据项
  public dataItem: any;
  // MO数量显示
  // public i: any;
  public columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      checkboxSelection: true,
    },
    { field: 'makeOrderNum', headerName: '拆分生产订单号', menuTabs: ['filterMenuTab'] },
    { field: 'num', headerName: '拆分行号', menuTabs: ['filterMenuTab'] },
    { field: 'moQty', headerName: '数量', editable: true, cellEditor: 'agTextCellEditor', menuTabs: ['filterMenuTab'] },
    // { field: 'DEMAND_DATE', headerName: '需求日期', menuTabs: ['filterMenuTab'] }
  ];
  constructor(
    public pro: BrandService,
    private appConfigService: AppConfigService,
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public confirmationService: NzModalService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: EditService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {
    this.gridData = [];
    // this.i = { MO_QTY: this.dataItem.MO_QTY, USABLE_QTY: this.dataItem.MO_QTY, SPLIT_QTY: 0 };
    this.calcAfterQty();
  }

  close() {
    this.modal.destroy();
  }

  // NUM = 1;
  // 新增
  add() {
    const num = this.gridData.length;
    this.gridData.push(
      {
        makeOrderNum: this.dataItem.makeOrderNum,
        num: num + 1,
        moQty: 0,
        demandDate: this.dataItem.demandDate
      });
    // this.updateQty();
    this.gridApi.setRowData(this.gridData);
    this.gridApi.refreshCells();
  }

  // 删除
  remove() {
    // this.NUM--;
    // this.gridData.splice(0, 1);
    // this.gridData = [...this.gridData];
    // this.updateQty();
    const listSelect = this.gridApi.getSelectedRows();
    if (listSelect.length === 0) {
      const msg = this.appTranslationService.translate('请勾选数据！');
      this.msgSrv.info(msg);
      return;
    }

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除?'),
      nzOnOk: () => {
        listSelect.forEach(row => {
          const delIndex = this.gridData.findIndex(p => p.num === row.num);
          if (delIndex > -1) {
            this.gridData.splice(delIndex, 1);
          }
        });
        // 重置行号号
        let num = 0;
        this.gridData.forEach(row => {
          num += 1;
          row.num = num;
        });
        this.gridApi.setRowData(this.gridData);
        this.gridApi.refreshCells();
        this.calcAfterQty();
      },
    });
  }

  calcAfterQty() {
    let moQty = 0;
    const listZero = [];
    this.gridData.forEach(row => {
      moQty += this.strToNumber(row.moQty);
    });

    this.dataItem.afterQty = this.dataItem.moQty - moQty;
  }

  // 保存（计划单拆分）
  save() {
    if (this.gridData.length <= 0) {
      this.msgSrv.warning(this.appTranslationService.translate('拆分明细记录数应大于0，请添加拆分明细！'));
      return;
    }
    // if (this.i.USABLE_QTY !== 0) {
    //   this.msgSrv.warning(this.appTranslationService.translate('已拆分与总量不一致，请修改拆分明细的数量！'));
    //   return;
    // }
    this.calcAfterQty();
    if (this.dataItem.afterQty <= 0) {
      this.msgSrv.warning(this.appTranslationService.translate('拆分行总数必须小于工单数量，请修改拆分明细的数量！'));
      return;
    }
    const zeroIndex = this.gridData.findIndex(row => row.moQty <= 0);
    if (zeroIndex > -1) {
      this.msgSrv.warning(this.appTranslationService.translate('存在数量小于或等于0的数据，请修改拆分明细的数量！'));
      return;
    }
    this.editService.splitMo(this.dataItem, this.gridData).subscribe(result => {
      if (result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('拆分成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(result.msg));
      }
    });
  }
  // private updateQty() {
  //   let splitQty = 0;
  //   this.gridData.forEach(x => { splitQty = splitQty + Number(x.MO_QTY); });
  //   // 更新拆分量
  //   this.i = { MO_QTY: this.dataItem.MO_QTY, USABLE_QTY: this.dataItem.MO_QTY - splitQty, SPLIT_QTY: splitQty };
  // }
  // 单元格内容改变
  onCellValueChanged(event) {
    // if (this.isNullDefault(event.oldValue, '').toString() !== this.isNullDefault(event.newValue, '').toString() && event.colDef.field === 'MO_QTY') {
    //   this.updateQty();
    // }
    const oldValue = event.oldValue === undefined || event.oldValue === null || event.oldValue === '' ? '0' : event.oldValue.toString();
    const newValue = event.newValue === undefined || event.newValue === null || event.newValue === '' ? '0' : event.newValue.toString();
    if (oldValue !== newValue) {
      if (newValue.length > 0 && (this.strToNumber(newValue).toString() === 'NaN' || this.strToNumber(newValue) < 0)) {
        this.msgSrv.info(this.appTranslationService.translate('请输入不小于0的数字'));
        event.data.moQty = event.oldValue;
        this.gridApi.refreshCells();
      } else {
        this.calcAfterQty();
      }
    }
  }

  strToNumber(str: any) {
    if (str == null || str.length === 0) return 0;
    return Number(str);
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['数量'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#digitalGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52Cs');
        }
      });
    }
  }
}
