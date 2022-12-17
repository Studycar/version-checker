import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SopOnhandStrategyService } from 'app/modules/generated_module/services/soponhandstrategy-service';
import { PopupSelectComponent } from '../../../../modules/base_module/components/popup-select.component';
import { deepCopy } from '@delon/util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-soponhandstrategy-edit',
  templateUrl: './edit.component.html',
  providers: [SopOnhandStrategyService]
})
export class ProductSellBalanceSoponhandstrategyEditComponent implements OnInit {
  record: any = {};

  /**编辑前 */
  i: any;
  /**编辑项 */
  originDto: any;
  regionOptions: any[] = [];
  plantOptions: any[] = [];
  title: String = '新增';
  onhandLevelOptions: any[] = [];
  onhandTypeOptions: any[] = [];
  categoryOptions: any[] = [];
  plantCode: String;
  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private dataservice: SopOnhandStrategyService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    this.clear();
    this.LoadData();
  }


  LoadData() {

    console.log('tangch2:' + this.i.plantCode);
    //初始化编辑信息     
    this.originDto = deepCopy(this.i);

    this.plantOptions.length = 0;
    this.commonquery.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          tag: {
            scheduleRegionCode: d.scheduleRegionCode
          }
        });
      });
    });

    this.onhandLevelOptions.length = 0;
    this.commonquery.GetLookupByType('SOP_ONHAND_LEVEL').subscribe(res => {
      res.Extra.forEach(item => {
        this.onhandLevelOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });

    this.onhandTypeOptions.length = 0;
    this.commonquery.GetLookupByType('SOP_ONHAND_TYPE').subscribe(res => {
      res.Extra.forEach(item => {
        this.onhandTypeOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });

    /* this.commonquery.GetCategorySet('').subscribe(res => {
       res.data.forEach(item => {
         this.categoryOptions.push({
           label: item.categorySetDesc,
           value: item.categorySetCode,
         });
       });
     });  */
     this.categoryOptions.length = 0;
     this.commonquery.GetCategoryPageList1('定位', '').subscribe(res => {
       res.data.content.forEach(item => {
         this.categoryOptions.push({
           label: item.descriptions,
           value: item.categoryCode,
         });
       });
     });
  }

  /** 清除 */
  clear() {
    this.i = {
      id: null,
      businessUnitCode: this.appconfig.getActiveScheduleRegionCode(),
      plantCode: this.appconfig.getPlantCode(),
      onhandLevel: null,
      levelValue: null,
      onhandType: null,
      onhandValue: null
    };

    if (this.originDto && this.originDto.id) {
      this.i = deepCopy(this.originDto);
    }
  }
  // 工厂切换
  plantChange(event: string) {
    this.regionOptions.length = 0;
    this.plantOptions.forEach(element => {
      if (element.value === event) {
        this.i.businessUnitCode = element.tag.scheduleRegionCode;
      }
    });
    if (this.i.onhandLevel === 'ITEM') {
      this.i.levelValue = null;
    }
  }

  save() {
    if (this.i.levelValue === undefined || this.i.levelValue === null || this.i.levelValue === '') {
      this.msgSrv.info('维度值不能为空');
      return;
    }
    if (this.i.Id === null) {
      this.dataservice.EditData(this.i).subscribe(res => {
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

  @ViewChild('selMaterItem', { static: true }) selMaterItem: PopupSelectComponent;

  // 绑定物料
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];

  public loadItems(plantCode: string, itemCode: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonquery.getUserPlantItemPageList(plantCode || '', itemCode || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.i.levelValue = e.Value;
  }


  onTextChanged(e: any) {
    this.i.levelValue = null;
    // 给物料描述赋值
    this.commonquery.GetUserPlantItemPageList(this.i.plantCode || '', e.Text || '', '', 1, 1).subscribe(resultMes => {
      this.i.levelValue = resultMes.Extra[0].itemCode;
    });
  }

  onhandLevelChange(event: string) {
    this.i.levelValue = null;
  }
}
