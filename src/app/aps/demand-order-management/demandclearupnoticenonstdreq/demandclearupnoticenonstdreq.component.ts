import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { Observable, BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GridDataResult, RowArgs } from '@progress/kendo-angular-grid';
import { map } from 'rxjs/operators/map';
import { DemandclearupnoticeService } from '../../../modules/generated_module/services/demandclearupnotice-service';
import { DemandorderclearnoticeEditService } from 'app/aps/demand-order-management/demandclearupnoticesplit/edit.service';
import { PopupSelectComponent } from 'app/modules/base_module/components/popup-select.component';
import { PsItemRoutingsService } from '../../../modules/generated_module/services/ps-item-routings-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demandclearupnoticenonstdreq',
  templateUrl: './demandclearupnoticenonstdreq.component.html',
  providers: [DemandorderclearnoticeEditService, PsItemRoutingsService]
})
export class DemandOrderManagementDemandclearupnoticenonstdreqComponent implements OnInit {
  expandForm = false;
  selectItems: any[] = [];
  private data: any[] = [];
  private originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  private deletedItems: any[] = [];
  public createdItemsR: any[] = [];
  public applicationYesNo: any[] = [];
  public SupplySubinventorys: any[] = [];
  public wipsupplytypes: any[] = [];
  // tslint:disable-next-line:no-inferrable-types
  IsDisable: boolean = false;
  params: any = {};
  splitline: any = 1;
  materialEnable: any = 'N';
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 15,
  };
  i: any;

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.wipsupplytypes;
        break;
      case 2:
        options = this.applicationYesNo;
        break;
      case 3:
        options = this.SupplySubinventorys;
        break;

    }
    return options.find(x => x.value === value) || { label: value };
  }

  public SupplySubinventorysfu(strcode: string): any {
    return this.SupplySubinventorys.find(x => x.value === strcode);
  }
  constructor(private http: _HttpClient,
    private modal: ModalHelper,
    private modalS: NzModalRef,
    private msgSrv: NzMessageService,
    private formBuilder: FormBuilder,
    public editService: DemandorderclearnoticeEditService,
    private appTranslationService: AppTranslationService,
    public popService: PsItemRoutingsService,
    private commonQueryService: CommonQueryService,
    private confirmationService: NzModalService,
    public demandclearupnoticeService: DemandclearupnoticeService,
  ) {

  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.queryParams = {
      reqNumber: this.i.reqNumber,
      reqLineNum: this.i.reqLineNum
    };
    this.commonQueryService.GetLookupByType('PS_MO_COMP_SUPPLY_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.wipsupplytypes.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    // this.loadItem();
    this.loadYesNO();
    this.loadSupplySubinventorys();
    this.view = this.editService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.query();
  }

  public query() {
    this.editService.read2(this.queryParams);
  }

  // 物料的选择框
  optionListItem1 = [];
  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  Columns: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '80'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '80'
    }
  ];
  @ViewChild('selMater1', {static: true}) selMater1: PopupSelectComponent;
  /**
* 根据工厂编码加载物料
*/
  selectMaterial(e: any): void {
    if (!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.demandclearupnoticeService.loadMaterials(e, this.i.plantCode)
      .subscribe(it => this.gridView1 = it);
  }

  onSearchMaterial(e: any) {
    const param = { Skip: e.Skip, PageSize: this.selMater1.pageSize, SearchValue: e.SearchValue };
    this.selectMaterial(param);
  }
  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.i.itemId = e.Value;
    this.i.itemCode = e.Text;
    // 给物料描述赋值
    this.popService.SearchItemInfoByID(e.Value).subscribe(resultMes => {
      this.materialEnable = 'N';
      this.i.descriptions = resultMes.data.descriptions;
      this.i.unitOfMeasure = resultMes.data.unitOfMeasure;
      this.i.supplyType = resultMes.data.supplyType;
      const tempSupplyType = this.wipsupplytypes.find(x => x.value === resultMes.data.supplyType);
      if (tempSupplyType !== undefined) {
        this.i.supplyTypeName = tempSupplyType.label;
      }

    });
  }

  change1({ sender, event, Text }) {
    const value = this.i.itemId || '';
    if (value === '') {
      // 加载物料
      this.commonQueryService.getUserPlantItemPageList(this.i.plantCode || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
        this.gridView1.data = res.data.content;
        this.gridView1.total = res.data.totalElements;
        const selectMaterialItem = res.data.content.find(x => x.itemCode === Text);
        if (selectMaterialItem) {
          this.materialEnable = 'N';
          this.i.itemId = selectMaterialItem.itemId;
          this.i.descriptions = selectMaterialItem.descriptionsCn;
          this.i.unitOfMeasure = selectMaterialItem.unitOfMeasure;
          this.i.supplyType = selectMaterialItem.wipSupplyType;
          const tempSupplyType = this.wipsupplytypes.find(x => x.value === selectMaterialItem.wipSupplyType);
          if (tempSupplyType !== undefined) {
            this.i.supplyTypeName = tempSupplyType.label;
          }

        } else {
          this.materialEnable = 'Y';
          this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
        }
      });
    }
  }

  public queryParams: any = {};
  public onStateChange(state: State) {
    this.gridState = state;
    this.editService.read2();
  }


  public loadYesNO(): void {
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationYesNo.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  public loadSupplySubinventorys(): void {
    this.demandclearupnoticeService.GetSupplySubinventorys(this.i.plantCode).subscribe(result => {
      result.data.forEach(d => {
        this.SupplySubinventorys.push({
          label: d.subinventoryDescription,
          value: d.subinventoryCode,
        });
      });
    });
  }
  close() {
    this.modalS.destroy();
  }

  save() {
    if (this.i.status === 'CANCELLED') {
      this.msgSrv.success(this.appTranslationService.translate('已经取消的订单不能编辑非标信息'));
      return;
    }
    if (this.materialEnable === 'Y' || this.i.itemId === '') {
      this.msgSrv.success(this.appTranslationService.translate('无效的物料，请重新录入物料'));
      return;
    }
    this.demandclearupnoticeService.EditNonStdReq(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.query();
        this.clear();
      } else {
        this.msgSrv.warning(this.appTranslationService.translate(res.msg));
      }
    });
  }

  public clear() {
    // tslint:disable-next-line:no-unused-expression
    this.i.id = null;
    this.i.componentLineNum = '';
    this.i.itemId = '';
    this.i.itemCode = '';
    this.i.quantity = '';
    this.i.mrpNetFlag = null;
    this.i.supplySubinventroy = null;
    this.i.descriptions = '';
    this.i.unitOfMeasure = '';
    this.i.supplyType = null;
    this.IsDisable = false;
    this.materialEnable = 'N';
  }

  public remove(item: any) {
    if (this.i.status === 'CANCELLED') {
      this.msgSrv.success(this.appTranslationService.translate('已经取消的订单不能删除非标信息'));
      return;
    }
    this.demandclearupnoticeService.Remove(item.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  public modifydata(item: any) {
    this.IsDisable = true;
    this.i.id = item.id;
    // tslint:disable-next-line:radix
    this.i.quantity = parseInt(item.quantity);
    // tslint:disable-next-line:radix
    this.i.componentLineNum = parseInt(item.componentLineNum);
    this.i.itemId = item.itemId;
    this.i.itemCode = item.itemCode;
    this.i.mrpNetFlag = item.mrpNetFlag;
    this.i.descriptions = item.descriptionsCn;
    this.i.unitOfMeasure = item.unitOfMeasure;
    const supplyType = this.wipsupplytypes.find(x => x.value === item.supplyType);
    if (supplyType !== undefined) {
      this.i.supplyTypeName = supplyType.label;
    }
    this.i.supplySubinventory = item.supplySubinventory;
  }

}
