import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { EditService } from '../edit.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'processSchedule-opdigitalization-workbench-splitmo',
  templateUrl: './splitMo.component.html',
  providers: [EditService]
})
export class ProcessScheduleOpdigitalizationWorkbenchSplitMoComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;
  @ViewChild('customTemplate2', { static: true }) customTemplate2: TemplateRef<any>;
  // 工艺路线-资源
  resourceList: any[];

  // 传参-工序工单
  public dataItem: any = {
    ID: '',
    PLANT_CODE: '',
    SCHEDULE_GROUP_CODE: '',
    RESOURCE_CODE: '',
    RESOURCE_DESCRIPTION: '',
    PROCESS_CODE: '',
    ITEM_CODE: '',
    DESCRIPTIONS_CN: '',
    MO_QTY: '',
    OLD_MO_QTY: '',
    CAN_DELETE: false,
    ITEM_ID: '',
    FPC_TIME: null
  };
  public dataItemId = '';
  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 70, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null
      }
    },
    { field: 'PLANT_CODE', headerName: '工厂', width: 70 },
    { field: 'ITEM_CODE', headerName: '物料号', width: 100 },
    { field: 'DESCRIPTIONS_CN', headerName: '物料描述', tooltipField: 'DESCRIPTIONS_CN', width: 120 },
    { field: 'PROCESS_CODE', headerName: '工序编码', width: 100 },
    {
      field: 'MO_QTY', headerName: '数量', width: 120,
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null
      }
    },
    {
      field: 'FPC_TIME', headerName: '开始时间', width: 230,
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null
      }
    },
    {
      field: 'RESOURCE_CODE', headerName: '资源', width: 120,
      editable: (params) => {
        return params.data.CAN_DELETE;
      }, cellEditor: 'agSelectCellEditor',
      cellEditorParams: (params) => {
        if (params.colDef.field === 'RESOURCE_CODE') {
          const values = [];
          this.resourceList.forEach(res => values.push(res.RESOURCE_CODE));
          return { values: values };
        }
      }
    },
    { field: 'RESOURCE_DESCRIPTION', headerName: '资源描述', tooltipField: 'RESOURCE_DESCRIPTION', width: 100 }
  ];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: EditService
  ) {
    super({ pro: null, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
  }

  ngOnInit(): void {
    this.defaultColDef.sortable = false;
    this.defaultColDef.filter = false;;
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.columns[5].cellRendererParams.customTemplate = this.customTemplate1;
    this.columns[6].cellRendererParams.customTemplate = this.customTemplate2;
    if (!this.isNull(this.dataItem)) {
      this.dataInit();
    } else {
      this.editService.Search('', '', [], '', '', false, [this.dataItemId]).subscribe(result => {
        if (result.Result === null || result.Result.length !== 1) {
          this.msgSrv.error(this.appTranslationService.translate('没找到拆分工序工单！'));
        } else {
          this.dataItem = result.Result[0];
          this.dataInit();
        }
      });
    }
  }
  private dataInit() {
    this.dataItem.CAN_DELETE = false;
    this.dataItem.OLD_MO_QTY = this.dataItem.MO_QTY;

    this.editService.GetItemRoutings(this.dataItem.PLANT_CODE, this.dataItem.ITEM_ID, this.dataItem.PROCESS_CODE).subscribe(res => {
      this.resourceList = [];
      if (res.Success) {
        res.Extra.forEach(element => {
          this.resourceList.push({ RESOURCE_CODE: element.RESOURCE_CODE, RESOURCE_DESCRIPTION: element.RESOURCE_DESCRIPTION });
        });
        const resource = this.resourceList.find(t => t.RESOURCE_CODE === this.dataItem.RESOURCE_CODE);
        this.dataItem.RESOURCE_DESCRIPTION = resource.RESOURCE_DESCRIPTION;
      }
      this.gridData = [this.dataItem];
    });
  }
  close() {
    this.modal.destroy();
  }

  confirm() {
    if (this.gridData.length < 1) {
      this.msgSrv.error(this.appTranslationService.translate('没有可用的拆分数据'));
      return;
    }
    this.setLoading(true);
    const dtos = [];
    this.gridData.forEach(element => {
      dtos.push({
        ID: element.ID, PLANT_CODE: element.PLANT_CODE, RESOURCE_CODE: element.RESOURCE_CODE,
        PROCESS_CODE: element.PROCESS_CODE, MO_QTY: element.MO_QTY, CAN_DELETE: element.CAN_DELETE,
        FPC_TIME: element.FPC_TIME
      });
    });

    this.editService.SaveSplitMoQty(dtos).subscribe(res => {
      this.setLoading(false);
      if (res.Success) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.close();
      } else {
        this.msgSrv.error(this.appTranslationService.translate('保存失败：' + res.Message));
      }
      // this.close();
    });
  }

  add() {
    const addDataItem = this.clone(this.dataItem);
    addDataItem.ID = new Date().getTime();
    addDataItem.CAN_DELETE = true;
    addDataItem.MO_QTY = 0;
    this.gridData = [...this.gridData, addDataItem];
  }

  remove(dataItem: any) {
    if (dataItem.CAN_DELETE === false) {
      this.msgSrv.error(this.appTranslationService.translate('当前行不允许删除'));
      return;
    }
    const deleteIndex = this.gridData.indexOf(dataItem);
    if (deleteIndex > -1) {
      this.gridData.splice(deleteIndex, 1);
    }
    this.gridData = this.clone(this.gridData);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  // 单元格内容改变
  onCellValueChanged(event) {
    if (this.isNullDefault(event.oldValue, '').toString() !== this.isNullDefault(event.newValue, '').toString()
      && event.colDef.field === 'RESOURCE_CODE') {
      const resource = this.resourceList.find(res => res.RESOURCE_CODE === event.newValue);
      event.data.RESOURCE_DESCRIPTION = resource.RESOURCE_DESCRIPTION;
      this.gridData = this.clone(this.gridData);
    }
  }

  MoQtyChange(event) {
    if (!event.CAN_DELETE) {
      return;
    }
    let oldMoQty = 0;
    let sumMoQty = 0;
    this.gridData.forEach(data => {
      if (data.CAN_DELETE === false) {
        oldMoQty = data.OLD_MO_QTY;
      } else {
        sumMoQty += data.MO_QTY;
      }
    });

    let moQtyFlag = oldMoQty - sumMoQty;
    if (moQtyFlag < 0) {
      event.MO_QTY = 0;
      sumMoQty = 0;
      this.gridData.forEach(data => {
        if (data.CAN_DELETE !== false) {
          sumMoQty += data.MO_QTY;
        }
      });
      moQtyFlag = oldMoQty - sumMoQty;
    }

    this.gridData.forEach(data => {
      if (data.CAN_DELETE === false) {
        data.MO_QTY = moQtyFlag;
      }
    });

    this.gridData = this.clone(this.gridData);
  }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['资源', '数量', '开始时间'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#opOsDigitalGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #FFA500');
        }
      });
    }
  }
}
