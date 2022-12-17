import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { PsItemRoutingsService } from '../../../../modules/generated_module/services/ps-item-routings-service';
import { PopupSelectComponent } from '../../../../modules/base_module/components/popup-select.component';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-prodline-items-edit',
  templateUrl: './edit.component.html',
  providers: [PsItemRoutingsService]

})
export class MaterialmanagementProdlineItemsEditComponent implements OnInit {
  record: any = {};
  i: any;
  Istrue: boolean;
  disabled1 = false;
  currentLanguage: any;
  applicationRateType: any[] = [];
  applicationYesNo: any[] = [];
  optionListProcessCode: any[] = [];
  applicationitemtypes: any[] = [];
  applicationTechVerison: any[] = [];

  batchQtyDisabled = true;    // 批次数量disabled，当速率类型为批次时可填
  listBomDesignator: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: PsItemRoutingsService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) { }


  ngOnInit(): void {
    this.currentLanguage = this.appConfigService.getLanguage();
    this.loadData();
  }

  loadData() {
    this.loadplant();
    // this.loadplantGroup();
    // this.loadproductLine();
    this.loadItemType();
    this.loadRateType();
    this.loadYesNO();
    this.loadTechVersion();
    this.loadBomDesignator();

    console.log(this.i.id);
    if (this.i.id !== undefined) {
      this.Istrue = true;
      this.disabled1 = true;
      /** 初始化编辑数据 */
      this.editService.Get(this.i.id).subscribe(resultMes => {
       
        if (resultMes.data !== undefined ) {
          const d = resultMes.data;
          console.log('当前id' + d.id);
          this.i = {
            id: d.id,
            plantCode: d.plantCode,
            itemId: d.itemId,
            itemCode: d.itemCode,
            scheduleGroupCode: d.scheduleGroupCode,
            descriptions: d.descriptions,
            resourceType: d.resourceType,
            resourceCode: d.resourceCode,
            rateType: d.rateType,
            rate: d.rate,
            batchQty: d.batchQty,
            priority: d.priority,
            processCode: d.processCode,
            scheduleFlag: d.scheduleFlag,
            selectResourceFlag: d.selectResourceFlag,
            techVersion: d.techVersion,
            alternateBomDesignator: d.alternateBomDesignator,
          };

          this.batchQtyDisabled = this.i.rateType !== '3';

          this.loadplantGroup();
          this.loadproductLine();

          this.commonQueryService.GetUserPlantGroupLine(this.i.plantCode, this.i.scheduleGroupCode, this.i.resourceCode).subscribe(result => {

            if (result.Extra.length > 0) {
              this.i.scheduleGroupCode = result.Extra[0].scheduleGroupCode;
              this.i.resourceCode = result.Extra[0].resourceCode;
              this.i.resourceType = result.Extra[0].resourceType;
            } else {
              this.i.scheduleGroupCode = '';
              this.i.resourceCode = '';
              this.i.resourceType = '';
            }
          });

          this.loadBomDesignator();
          this.i.alternateBomDesignator = d.alternateBomDesignator;
        }
      });

      // this.editService.GetByResouceByCode(this.i.resourceCode).subscribe(result => {
      //  this.i.resourceType = result.Extra[0].resourceType;
      // });

    } else {
      this.Istrue = false;
      this.disabled1 = false;
      // this.i.processCode = 10;
      this.i.scheduleFlag = 'Y';
      this.i.selectResourceFlag = 'Y';

      this.i.plantCode = this.appConfigService.getPlantCode();

      this.onChangePlant(this.i.plantCode);
    }
    // 加载工序
    this.loadProcessCode();
  }

  save() {
    this.i.itemId = this.selMater1.Value;
    console.log(this.i);

    if (this.i.itemId === '') {
      this.msgSrv.error('请选择物料！');
      return;
    }

    if (this.i.resourceType === '' || this.i.resourceType === undefined || this.i.resourceType === 'null') {
      this.msgSrv.error('资源类型为空，请在工厂建模->资源中维护该资源的类型');
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

  // 绑定页面的下拉框Plant组
  optionListPlantGroup = [];
  public loadplantGroup(): void {
    this.isLoading = true;
    this.commonQueryService.GetUserPlantGroup(this.i.plantCode).subscribe(result => {
      this.isLoading = false;
      this.optionListPlantGroup = result.Extra;
    });
  }

  // 绑定页面的下拉框产线
  optionListProductLine = [];
  public loadproductLine(): void {
    this.isLoading = true;
    this.commonQueryService.GetUserPlantGroupLine(this.i.plantCode, this.i.scheduleGroupCode).subscribe(result => {
      this.isLoading = false;
      this.optionListProductLine = result.Extra;

    });
  }

    // public loadproductLine(): void {
  //   this.isLoading = true;
  //   this.commonQueryService.GetUserPlantGroupLine(this.i.plantCode, this.i.scheduleGroupCode).subscribe(result => {
  //     this.isLoading = false;
  //     this.optionListProductLine = result.Extra;

  //   });
  // }
  // 绑定物料
  optionListItem1 = [];
  public loadItem(): void {
    this.editService.SearchItemInfo(this.i.plantCode).subscribe(resultMes => {
      this.optionListItem1 = resultMes.data;
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
    this.editService.GetUserPlantItemPageList(plantCode || '', itemCode || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data =  res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }


  onRateTypeChange(value) {
    this.batchQtyDisabled = value !== '3';
    if (value !== '3') {
      this.i.batchQty = null;
    }
  }

  public loadRateType(): void {
    this.applicationRateType.length = 0;
    this.commonQueryService.GetLookupByTypeLang('PS_RATE_TYPE', this.currentLanguage).subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationRateType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }


  public loadTechVersion(): void {
    this.applicationTechVerison.length = 0;
    this.commonQueryService.GetLookupByTypeLang('TECH_VERSION',  this.currentLanguage).subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationTechVerison.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }


  public loadYesNO(): void {
    this.applicationYesNo.length = 0;
    this.commonQueryService.GetLookupByTypeLang('FND_YES_NO',  this.currentLanguage).subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationYesNo.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  public loadItemType(): void {
    this.applicationitemtypes.length = 0;
    this.commonQueryService.GetLookupByTypeLang('PS_RESOURCE_TYPE',  this.currentLanguage).subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationitemtypes.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }


  public loadProcessCode(): void {
    this.editService.SearchProcessCode(this.i.plantCode).subscribe(resultMes => {
      this.optionListProcessCode = resultMes.data;
    });
  }


  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    /** 重新绑定  组*/

    this.i.scheduleGroupCode = '';
    this.i.resourceCode = '';

    // 计划组为空，从新清空绑定组和产线
    this.optionListPlantGroup = [];
    this.optionListProductLine = [];


    this.commonQueryService
      .GetUserPlantGroup(value)
      .subscribe(result => {
        if (result.Extra == null) {

          return;
        } else {
          // 先清除，在重新绑定

          this.optionListPlantGroup = [
            ...this.optionListPlantGroup,
            ...result.Extra,
          ];
          return;
        }
      });

    // this.loadItem();
    this.loadProcessCode();
  }

  // 组 值更新事件 重新绑定产线
  onChangeGroup(value: string): void {
    /** 重新绑定  组*/

    // 先清除，在重新绑定
    this.i.resourceCode = '';
    this.optionListProductLine = [];
    this.commonQueryService.GetUserPlantGroupLine(this.i.plantCode, value).subscribe(result => {
      if (result.Extra == null) {

        return;
      } else {
        // 先清除，在重新绑定

        this.optionListProductLine = [
          ...this.optionListProductLine,
          ...result.Extra,
        ];
        return;
      }
    });
  }

  // 资源 值更新事件
  onChangeLine(value: string): void {
    this.editService.GetResouceCode(this.i.plantCode, value).subscribe(resultMes => {
      this.i.resourceType = resultMes.data[0].resourceType;
    });
  }


  @ViewChild('selMater1', { static: true }) selMater1: PopupSelectComponent;

  // onSearch1(e: any) {
  //   let filterRtl = [];
  //   if (e.SearchValue !== '' && e.SearchValue !== null && e.SearchValue !== undefined) {
  //     filterRtl = this.optionListItem1.filter(x => x.itemCode === e.SearchValue);
  //   } else {
  //     filterRtl = this.optionListItem1;
  //   }

  //   this.gridView1 = {
  //     data: filterRtl.slice(Number(e.Skip), Number(e.Skip) + Number(e.PageSize)),
  //     total: filterRtl.length
  //   };
  // }

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.i.itemId = e.Value;
    this.i.itemCode = e.Text;
    // 给物料描述赋值
    this.editService.SearchItemInfoByID(e.Value).subscribe(resultMes => {
      this.i.descriptions = resultMes.data.descriptions;
    });

    this.loadBomDesignator();
  }


  onTextChanged(e: any) {

    this.i.descriptions = '';
    // 给物料描述赋值
    this.editService.SearchItemInfoByCode(e.Text).subscribe(resultMes => {
      this.i.descriptions = resultMes.data.descriptions;
      this.i.itemId = resultMes.data.itemId;

      this.loadBomDesignator();
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

        itemCode: null,
        scheduleGroupCode: null,
        descriptions: null,
        resourceType: null,
        resourceCode: null,
        rateType: null,
        rate: null,
        priority: null,
        OPERATION_NUM: 10,
        scheduleFlag: null,
        selectResourceFlag: null
      };


    }
  }

  loadBomDesignator() {
    // 查询bom替代项
    this.listBomDesignator.length = 0;
    this.i.alternateBomDesignator = null;
    this.editService.QueryBomDesignator(this.i.plantCode, this.i.itemId).subscribe(resultMes => {
      resultMes.data.forEach(p => {
        this.listBomDesignator.push({ label: p.alternateBomDesignator, value: p.alternateBomDesignator });
      });
    });
  }
}
