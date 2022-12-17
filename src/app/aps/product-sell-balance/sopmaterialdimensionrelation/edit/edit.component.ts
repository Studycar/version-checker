import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { SopMaterialDimensionRelationService } from 'app/modules/generated_module/services/sopmaterialdimensionrelation-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PsItemRoutingsService } from 'app/modules/generated_module/services/ps-item-routings-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopmaterialdimensionrelation-edit',
  templateUrl: './edit.component.html',
  providers: [PsItemRoutingsService]
})
export class ProductSellBalanceSopmaterialdimensionrelationEditComponent implements OnInit {
  record: any = {};
  i: any;
  regionoptions: any[] = [];
  itemoptions = [];
  readOnly: Boolean = false;
  title: String = '新增';
  typeoptions: any[] = [];
  yesOrNo: any[] = [];
  plantCode: String;
  groupoptions: any[] = [];
  nameOptions: any[] = [];
  valueOptions: any[] = [];
  nameReadOnly: Boolean = false;
  valueReadOnly: Boolean = false;

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private dataservice: SopMaterialDimensionRelationService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService,
    private appTranslationService: AppTranslationService,
    private itemRoutingSrv: PsItemRoutingsService,
  ) { }

  ngOnInit(): void {
    this.nameReadOnly = true;
    this.valueReadOnly = true;
    console.log('this.i------------------', this.i);
    if (this.i.id !== null) {
      this.readOnly = true;
      this.title = '编辑';
      this.dataservice.GetById(this.i.id).subscribe(res => {
        if (!res.data || !res.data.content || res.data.content.length > 1) return;
        const record = res.data.content[0];
        this.i = record;
        this.nameOptions.push({
          label: record.divisionName,
          value: record.divisionName
        });
        this.valueOptions.push({
          label: record.divisionValue,
          value: record.divisionValue
        });
        this.nameReadOnly = true;
        this.valueReadOnly = true;
      });
    } else {
      this.i.ratio = 1;
      this.i.enableFlag = 'Y';
    }

    this.LoadData();
  }


  LoadData() {
    this.dataservice.GetRegion('', this.appconfig.getUserId()).subscribe(res => {
      if (!res.data) return;
      res.data.forEach(element1 => {
        this.regionoptions.push({
          label: element1,
          value: element1
        });
      });
      if (!this.i.id) {
        this.i.businessUnitCode = res.data.length > 0 ? res.data[0] : null;
        this.plantChange(this.i.businessUnitCode);
      }
    });

    // this.commonquery.GetLookupByTypeLang('SOP_RESOURCE_TYPE', this.appconfig.getLanguage()).subscribe(res => {
    //   res.Extra.forEach(element => {
    //     this.typeoptions.push({
    //       label: element.MEANING,
    //       value: element.LOOKUP_CODE
    //     });
    //   });
    // });

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element1 => {
        this.yesOrNo.push({
          label: element1.meaning,
          value: element1.lookupCode
        });
      });
    });
  }

  save() {
    if (this.i.id === null) {
      this.dataservice.SaveForNew(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.dataservice.EditData(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success('修改成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  plantChange(value: any) {
    this.i.itemCode = '';
    this.i.itemId = '';
    this.gridView1.data = [];
    this.gridView1.total = 0;
    this.nameReadOnly = false;
    this.i.divisionName = null;
    this.nameChange('');
    while (this.nameOptions.length > 0) {
      this.nameOptions.pop();
    }
    this.dataservice.GetDemand(value).subscribe(res => {
      if (!res.data) return;
      res.data.forEach(element => {
        this.nameOptions.push({
          label: element,
          value: element
        });
      });
    });
  }

  nameChange(value: any) {
    this.valueReadOnly = false;
    this.i.divisionValue = null;
    while (this.valueOptions.length > 0) {
      this.valueOptions.pop();
    }
    this.dataservice.getValue(this.i.businessUnitCode, value).subscribe(res => {
      if (!res.data) return;
      res.data.forEach(element => {
        this.valueOptions.push({
          label: element,
          value: element
        });
      });
    });
  }

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
      width: '100',
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100',
    },
  ];
  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.i.businessUnitCode, e.SearchValue, PageIndex, e.PageSize);
  }
  change1({ sender, event, Text }) {
    const value = this.i.itemId || '';
    if (value === '') {
      // 加载物料
      // this.commonquery.GetUserPlantItemPageList('', Text || '', '', 1, sender.PageSize).subscribe(res => {
      //   this.gridView1.data = res.Result;
      //   this.gridView1.total = res.TotalCount;
      //   if (res.TotalCount === 1) {
      //     this.i.ITEM_ID = res.Result.find(x => x.ITEM_CODE === Text).ITEM_ID;
      //   } else {
      //     this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
      //   }
      // });
      // 加载物料
      this.itemRoutingSrv.GetUserPlantItemPageList('', Text || '', '', 1, sender.PageSize).subscribe(res => {
        if (res.data && res.data.totalElements > 0) {
          this.i.itemId = res.data.content.find(x => x.itemCode === Text).itemId;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
        }
      });
    }
  }
  // 加载物料
  public loadItems(regionCode: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // // 加载物料
    // this.dataservice.GetUserPlantItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize).subscribe(res => {
    //   this.gridView1.data = res.Result;
    //   this.gridView1.total = res.TotalCount;
    // });

    // 加载物料
    this.itemRoutingSrv.GetUserPlantItemPageList('', ITEM_CODE || '', '', PageIndex, PageSize, '', regionCode || '').subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }

}
