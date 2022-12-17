import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { PsMouldItemManageService } from 'app/modules/generated_module/services/psmould-item.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PopupSelectComponent } from 'app/modules/base_module/components/popup-select.component';
import { PsMouldManageService } from 'app/modules/generated_module/services/psmould.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-psmould-manager-edit',
  templateUrl: './edit.component.html',
})

export class SopPsMouldItemEditComponent implements OnInit {
  i: any;
  iClone: any;
  isLoading = false;
  readOnly: Boolean = false;
  title: String = '新增';
  yesOrNo: any[] = [];
  plantOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService,
    private appTranslationService: AppTranslationService,
    private dataservice: PsMouldItemManageService,
    private psMouldManageService: PsMouldManageService,
  ) { }


  ngOnInit(): void {
    this.isLoading = true;
    this.LoadData();

    if (this.i.id !== null) {
      this.readOnly = true;
      this.title = '编辑';
      this.dataservice.Get(this.i.id).subscribe(result => {
        this.i = result.data;
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.i.plantCode = this.appconfig.getPlantCode();
      this.i.enableFlag = 'Y';
    }
    this.isLoading = false;
  }

  LoadData() {

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element1 => {
        this.yesOrNo.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
      });
    });

    this.commonquery.GetUserPlant().subscribe(result => {
      this.plantOptions = result.Extra;
    });

  }

  // 物料的选择框
  optionListItem1 = [];
  gridViewItem: GridDataResult = {
    data: [],
    total: 0
  };
  itemColumns: any[] = [
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
  @ViewChild('selItem', { static: true }) selItem: PopupSelectComponent;

  // 物料的选择框
  optionListMould = [];

  gridViewMould: GridDataResult = {
    data: [],
    total: 0
  };
  mouldColumns: any[] = [
    {
      field: 'mouldCode',
      title: '模具',
      width: '80'
    },
    {
      field: 'descriptions',
      title: '描述',
      width: '100'
    }
  ];
  @ViewChild('selMould', { static: true }) selMould: PopupSelectComponent;
  /**
 * 根据工厂编码加载物料
 */
  selectItem(e: any): void {
    if (!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.dataservice.loadMaterials(e, this.i.plantCode)
      .subscribe(it => this.gridViewItem = it);
  }
  //物料搜索
  onSearchItem(e: any) {
    const param = { Skip: e.Skip, PageSize: this.selItem.pageSize, SearchValue: e.SearchValue };
    this.selectItem(param);
  }
  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.i.itemId = e.Value;
    this.i.itemCode = e.Value;
  }

  changeItem({ sender, event, Text }) {
    const value = this.i.itemId || '';
    if (value === '') {
      // 加载物料
      this.commonquery.getUserPlantItemPageList(this.i.plantCode || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
        this.gridViewItem.data = res.data.content;
        this.gridViewItem.total = res.data.totalElements;
        const selectMaterialItem = res.data.content.find(x => x.itemCode === Text);
        if (selectMaterialItem) {
          this.i.itemId = selectMaterialItem.itemId;
          this.i.descriptionsCn = selectMaterialItem.descriptionsCn;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
        }
      });
    }
  }

  /**
 * 根据工厂编码加载模具
 */
   selectMould(e: any): void {
    if (!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.psMouldManageService.getPageList(this.i.plantCode || '', this.i.PageIndex, this.i.PageSize).subscribe(res => {
      this.gridViewMould.data = res.data.content;
      this.gridViewMould.total = res.data.totalElements;
    });
  }
  //模具搜索
  onSearchMould(e: any) {
    const param = { Skip: e.Skip, PageSize: this.selMould.pageSize, SearchValue: e.SearchValue };
    this.selectMould(param);
  }
  //  行点击事件， 给参数赋值
  onRowSelectMould(e: any) {
    this.i.resourceCode = e.Value;
  }

  changeMould({ sender, event, Text }) {debugger;
    const value = this.i.resourceCode || '';
    if (value === '') {
      // 加载模具
      this.psMouldManageService.getPageList(this.i.plantCode || '', 1, sender.PageSize).subscribe(res => {
        this.gridViewItem.data = res.data.content;
        this.gridViewItem.total = res.data.totalElements;
        const selectMaterialItem = res.data.content.find(x => x.mouldCode === Text);
        debugger;
        if (selectMaterialItem) {
          this.i.resourceCode = selectMaterialItem.mouldCode;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('模具无效'));
        }
      });
    }
  }

  save() {
    this.dataservice.Edit(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  plantChange(event) {
    this.i.itemId = '';
    this.i.itemCode = '';
    this.i.resourceCode = '';
  }

  close() {
    this.modal.destroy();
  }
  /**重置 */
  clear() {
    if (this.i.Id !== null) {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
      this.plantChange(this.i.plantCode);
    } else {
      this.i = {};
    }
  }
}
