import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PopupSelectComponent } from '../../../../modules/base_module/components/popup-select.component';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { SopLongTermItemManageService } from '../../../../modules/generated_module/services/soplongtermitem-manage-service';
import { PsItemRoutingsService } from '../../../../modules/generated_module/services/ps-item-routings-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demandclearupnotice-edit',
  templateUrl: './edit.component.html',
  providers: [PsItemRoutingsService]
})
export class SopLongTermItemManageEditComponent implements OnInit {

  title: String = '编辑信息';
  enableflags: any[] = [];
  isLoading = false;
  // tslint:disable-next-line:no-inferrable-types
  IsDisable: boolean = false;
  isModify: boolean;
  queryParams: any[] = [];
  i: any;
  iClone: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: PsItemRoutingsService,
    private appTranslationService: AppTranslationService,
    private commonQueryService: CommonQueryService,
    public sopLongTermItemManageService: SopLongTermItemManageService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    if (!this.i.id) {
      this.title = '新增信息';
      this.i.plantCode = this.appConfigService.getPlantCode();
      this.IsDisable = false;
      this.loadData();
    } else {
      this.loadData();
      this.IsDisable = true;
    }
  }


  loadData() {
    /**
 * 初始化编辑信息
 */
    if (this.i.id != null) {
      this.isModify = true;
      this.sopLongTermItemManageService.Get(this.i.id).subscribe(result => {
        this.i = result.data;
        this.iClone = Object.assign({}, this.i);
      }
      );
    }
    this.loadplant();
    this.loadItem();
    /** 初始化 是否有效  下拉框*/
    this.commonQueryService
      .GetLookupByTypeLang('FND_YES_NO', this.appConfigService.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.enableflags.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });

  }



  public loadItem(): void {
    this.editService.SearchItemInfo(this.i.plantCode).subscribe(resultMes => {
      this.optionListItem1 = resultMes.data;
    });
  }



  // 绑定页面的下拉框Plant
  optionListPlant = [];
  public loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      this.optionListPlant = result.Extra;
    });
  }

  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    this.loadItem();
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
  @ViewChild('selMater1', { static: true }) selMater1: PopupSelectComponent;


  /**
* 根据工厂编码加载物料
*/
  selectMaterial(e: any): void {
    if (!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.sopLongTermItemManageService.loadMaterials(e, this.i.plantCode)
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
    this.i.unitOfMeasure = e.Row.unitOfMeasure;
    this.i.itemDescribe = e.Row.descriptionsCn;
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
          this.i.itemId = selectMaterialItem.itemId;
          this.i.descriptionsCn = selectMaterialItem.descriptionsCn;
          this.i.unitOfMeasure = selectMaterialItem.unitOfMeasure;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
        }
      });
    }
  }

  save() {

    if (this.i.itemCode !== '' && (this.i.itemId === undefined || this.i.itemId === '')) {
      this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
      return;
    }

    this.sopLongTermItemManageService.Edit(this.i).subscribe(res => {
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

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
