import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { EditService } from '../edit.service';
import { PopupSelectComponent } from '../../../../modules/base_module/components/popup-select.component';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'comvindicate-edit',
  templateUrl: './edit.component.html',
  providers: [EditService]

})
export class ComvindicateEditComponent implements OnInit {
  moData: any = {};
  saveData: any = {};
  dataId = '';
  IsUpdate = false;

  listPlant: any[] = [];
  listSupplyType: any[] = [];
  listSubinventories: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: EditService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) {

  }

  ngOnInit(): void {
    // 先加载编辑数据，再查询事业部工厂
    this.loadData();
    this.loadSupplyType();
    this.loadSubinventories();
  }

  loadSupplyType(): void {
    this.listSupplyType.length = 0;
    this.queryService.GetLookupByType('PS_MO_COMP_SUPPLY_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.listSupplyType.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });
  }

  loadSubinventories() {
    // 加载供应子库
    this.listSubinventories.length = 0;
    this.queryService.QuerySubinventories(this.moData.PLANT_CODE).subscribe(res => {
      res.Extra.forEach(item => {
        this.listSubinventories.push({
          label: item.SUBINVENTORY_CODE + '(' + item.SUBINVENTORY_DESCRIPTION + ')',
          value: item.SUBINVENTORY_CODE
        });
      });
    });
  }

  loadData() {
    console.log(this.dataId);
    this.IsUpdate = this.dataId !== undefined && this.dataId !== '';
    /** 初始化编辑数据 */
    this.queryService.QueryMoRequirementEditData(this.moData.PLANT_CODE, this.moData.MAKE_ORDER_NUM, this.dataId).subscribe(result => {
      if (!result.Success) {
        this.msgSrv.error(result.Message);
        this.modal.close(false);
        return;
      }
      if (this.IsUpdate && (result.Extra === undefined || result.Extra.length === 0)) {
        this.msgSrv.error('当前数据不存在，请重新选择');
        this.modal.close(false);
        return;
      }
      const d = result.Extra[0];
      this.saveData = {
        Id: d.Id, // 行 ID 号
        CREATED_BY: d.CREATED_BY, // 创建人
        CREATION_DATE: d.CREATION_DATE, // 创建日期
        LAST_UPDATED_BY: d.LAST_UPDATED_BY, // 最近更新人
        LAST_UPDATE_DATE: d.LAST_UPDATE_DATE, // 最近更新日期
        PLANT_CODE: d.PLANT_CODE, // 工厂组织
        MAKE_ORDER_NUM: d.MAKE_ORDER_NUM, // MO号
        COMPONENT_ITEM_ID: d.COMPONENT_ITEM_ID, // 组件编码ID
        PROCESS_CODE: d.PROCESS_CODE, // 工序号
        USAGE: d.USAGE, // 单位使用量
        REQUIREMENT_QTY: d.REQUIREMENT_QTY, // 组件需求数量
        DEMAND_TIME: d.DEMAND_TIME, // 组件需求时间
        SUPPLY_TYPE: d.SUPPLY_TYPE, // 供应类型:拉式、推式(PUSH/PULL)
        SUPPLY_SUBINVENTORY: d.SUPPLY_SUBINVENTORY, // 供应子库
        SCRAP_QTY: d.SCRAP_QTY, // 报废数
        ISSUED_QTY: d.ISSUED_QTY, // 发料数
        // ATTRIBUTE1: d.ATTRIBUTE1, //
        // ATTRIBUTE2: d.ATTRIBUTE2, //
        // ATTRIBUTE3: d.ATTRIBUTE3, //
        // ATTRIBUTE4: d.ATTRIBUTE4, //
        // ATTRIBUTE5: d.ATTRIBUTE5, //
        COMPONENT_ITEM_CODE: d.COMPONENT_ITEM_CODE,
        COMPONENT_ITEM_DESC: d.COMPONENT_ITEM_DESC
      };
    });
  }

  save() {
    if (!this.IsUpdate) {
      this.saveData.Id = '';
      this.saveData.PLANT_CODE = this.moData.PLANT_CODE;
      this.saveData.MAKE_ORDER_NUM = this.moData.MAKE_ORDER_NUM;
    }
    this.queryService.SaveMoRequirement(this.saveData, this.IsUpdate).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  isLoading = false;
  @ViewChild('selMater1', { static: true }) selMater1: PopupSelectComponent;

  onCategoryChange(value) {
    this.selMater1.Value = '';
    this.selMater1.Text = '';
    this.saveData.CATEGORY_VALUES = '';
    this.gridViewItems.data = [];
    this.gridViewItems.total = 0;
  }

  // 绑定物料
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsItems: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料编码',
      width: '100'
    },
    {
      field: 'ITEM_DESC',
      title: '描述',
      width: '100'
    }
  ];

  public loadPopData(inputStr: string, PageIndex: number, PageSize: number) {
    this.QueryPopData(inputStr, '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.Result;
      this.gridViewItems.total = res.TotalCount;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadPopData(e.SearchValue, PageIndex, e.PageSize);
  }

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.saveData.COMPONENT_ITEM_ID = e.Value;
    this.saveData.COMPONENT_ITEM_CODE = e.Text;
    // 给物料描述赋值
    const itemData = this.gridViewItems.data.find(item => item.ITEM_CODE === this.saveData.COMPONENT_ITEM_CODE);
    this.saveData.COMPONENT_ITEM_DESC = itemData ? itemData.ITEM_DESC : '';

    this.QueryItemSupplyTypeAndSubinventories();
  }

  onTextChanged(e: any) {
    // 给物料描述赋值
    this.QueryPopData('', e.Text, 1, 100).subscribe(res => {
      if (res.Result.length === 0) {
        this.msgSrv.error(e.Text + '不存在，请重新输入');
        e.Text = '';
        e.Value = '';
        this.saveData.COMPONENT_ITEM_ID = '';
        this.saveData.COMPONENT_ITEM_CODE = '';
        this.saveData.COMPONENT_ITEM_DESC = '';
      } else {
        e.Text = res.Result[0].ITEM_CODE;
        e.Value = res.Result[0].ITEM_ID;
        this.saveData.COMPONENT_ITEM_ID = res.Result[0].ITEM_ID;
        this.saveData.COMPONENT_ITEM_CODE = res.Result[0].ITEM_CODE;
        this.saveData.COMPONENT_ITEM_DESC = res.Result[0].ITEM_DESC;

        this.QueryItemSupplyTypeAndSubinventories();
      }
    });
  }

  clear() {
    this.loadData();
  }

  QueryPopData(inputLikeStr: string, inputExactStr: string, pageIndex: number, pageSize: number): Observable<GridSearchResponseDto> {
    const queryParam = {
      PLANT_CODE: this.moData.PLANT_CODE,
      INPUT_LIKE: inputLikeStr,
      INPUT_EXACT: inputExactStr,
      pageIndex: pageIndex,
      pageSize: pageSize
    };
    return this.queryService.QueryItemData(queryParam);
  }

  QueryItemSupplyTypeAndSubinventories() {
    this.queryService.QueryItemSupplyTypeAndSubinventories(this.moData.PLANT_CODE, this.saveData.COMPONENT_ITEM_CODE).subscribe(res => {
      this.saveData.SUPPLY_TYPE = ''; // 供应类型:拉式、推式(PUSH/PULL)
      this.saveData.SUPPLY_SUBINVENTORY = ''; // 供应子库
      if (res.Success) {
        this.saveData.SUPPLY_TYPE = res.Extra.SUPPLY_TYPE; // 供应类型:拉式、推式(PUSH/PULL)
        this.saveData.SUPPLY_SUBINVENTORY = res.Extra.SUPPLY_SUBINVENTORY; // 供应子库
      }
    });
  }
}
