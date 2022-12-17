import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { ItemCycleTimeEditService } from '../edit.service';
import { PopupSelectComponent } from '../../../../modules/base_module/components/popup-select.component';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';

@Component({
  selector: 'materialmanagement-itemcycletime-edit',
  templateUrl: './edit.component.html',
  providers: [ItemCycleTimeEditService]
})
export class MaterialmanagementItemcycletimeEditComponent implements OnInit {
  record: any = {};
  i: any;
  Istrue: boolean;
  optionListPlant = [];
  optionListCyclytime = [];
  disabled1;
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: ItemCycleTimeEditService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.loadCyclytime();
  }

  loadData() {
    this.loadplant();
    if (this.i.id !== null && this.i.id !== undefined) {
      this.Istrue = true;
      /** 初始化编辑数据 */
      this.editService.Get(this.i.id).subscribe(resultMes => {
        if (resultMes.data !== undefined) {
          const d = resultMes.data;
          this.i = {
            id: d.id,
            plantCode: d.plantCode,
            itemId: d.itemId,
            itemCode: d.itemCode,
            attribute1: d.attribute1,
            cycleTimeType: d.cycleTimeType,
            cycleTime: d.cycleTime,
            enableDate: d.enableDate,
            disableDate: d.disableDate
          };
        }
      });

    } else {
      this.Istrue = false;
      this.i.plantCode = this.appConfigService.getPlantCode();
      this.i.enableDate = new Date();
    }

  }

  save() {
    //console.log('kkkkkkk'+this.selMater1.Value);
    this.i.itemId = this.selMater1.Value;
    if (this.i.itemId === '') {
      this.msgSrv.error('请选择物料！');
      return;
    }

    this.editService.Edit(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  isLoading = false;

  public loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      this.optionListPlant = result.Extra;
    });
  }

  // 绑定页面的下拉框周期类型组
  public loadCyclytime(): void {
    this.commonQueryService.GetLookupByType('PS_ITEM_CYCLE_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.optionListCyclytime.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  // 绑定物料
  optionListItem1 = [];
  public loadItem(): void {
    this.editService.SearchItemInfo(this.i.plantCode).subscribe(resultMes => {
      this.optionListItem1 = resultMes.Extra;
    });
  }

  // 绑定物料
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];

  public loadItems(plantCode: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(plantCode || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }


  @ViewChild('selMater1', { static: true }) selMater1: PopupSelectComponent;

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.i.itemId = e.Value;
    this.i.itemCode = e.Text;
    // 给物料描述赋值
    //this.editService.SearchItemInfoByID(
      this.commonQueryService.getUserPlantItemPageList('','', '',1,1,e.Value).subscribe(resultMes => {
      this.i.attribute1 = resultMes.data.content[0].descriptionsCn;
    });
  }


  onTextChanged(e: any) {
    this.i.attribute1 = '';
    // 给物料描述赋值
    //this.editService.SearchItemInfoByCode(e.Text)
    this.commonQueryService.getUserPlantItemPageList('',e.Text,'',1,1).subscribe(resultMes => {
      this.i.attribute1 = resultMes.data.content[0].descriptionsCn;
      this.i.itemId = resultMes.data.content[0].itemId;
    });
  }

  clear() {
    if (this.i.id != null) {
      this.loadData();
    } else {
      this.i = {
        id: null,
        plantCode: null,
        itemId: null,
        minQuantity: null,
        maxQuantity: null,
        startTime: new Date()
      };
    }
  }
}
