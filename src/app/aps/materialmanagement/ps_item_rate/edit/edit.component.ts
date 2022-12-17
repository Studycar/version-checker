import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { PopupSelectComponent } from 'app//modules/base_module/components/popup-select.component';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { PsItemRateService } from '../queryService';
import { AppConfigService } from 'app//modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { decimal } from '@shared';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-item-rate-edit',
  templateUrl: './edit.component.html',
  providers: [PsItemRateService]

})
export class PsItemRateEditComponent implements OnInit {
  record: any = {};
  i: any;
  Istrue: boolean;
  disabled1 = false;
  currentLanguage: any;
  applicationRateType: any[] = [];
  applicationYesNo: any[] = [];
  optionListProcessCode: any[] = [];
  applicationitemtypes: any[] = [];
  steelTypeOption: any[] = [];
  surfaceOptions: any[] = [];
  formatterPrecision = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: PsItemRateService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService,
    private appTranslationService: AppTranslationService,
  ) { }


  ngOnInit(): void {
    this.currentLanguage = this.appConfigService.getLanguage();
    this.loadData();
  }

  loadData() {
    this.loadplant();
    // this.loadplantGroup();
    // this.loadproductLine();
    this.loadOptions()

    // console.log(this.i.id);
    if (this.i.id !== undefined) {
      this.Istrue = true;
      this.disabled1 = true;
      /** 初始化编辑数据 */
      this.queryService.get(this.i.id).subscribe(resultMes => {

        if (resultMes.data) {
          const d = resultMes.data;
          // console.log('当前id' + d.id);
          this.i = {
            id: d.id,
            plantCode: d.plantCode,
            scheduleGroupCode: d.scheduleGroupCode,
            resourceCode: d.resourceCode,
            resourceType: d.resourceType,
            processCode: d.processCode,
            stockCode: d.stockCode,
            stockName: d.stockName,
            steelType: d.steelType,
            surface: d.surface,
            standards: d.standards,
            width: d.width,
            length: d.length,
            rawStockCode: d.rawStockCode,
            rawStockName: d.rawStockName,
            rawSurface: d.rawSurface,
            rawStandards: d.rawStandards,
            rawWidth: d.rawWidth,
            rawLength: d.rawLength,
            rateType: d.rateType,
            rate: d.rate,
            priority: d.priority,
          };

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

        }
      });



    } else {
      this.Istrue = false;
      this.disabled1 = false;
      // this.i.processCode = 10;
      this.i.scheduleFlag = 'Y';
      this.i.selectResourceFlag = 'Y';

      this.i.plantCode = this.appConfigService.getPlantCode();

      this.onChangePlant(this.i.plantCode);
    }
  }

  public loadOptions(): void {
    this.queryService.GetLookupByTypeRefAll({
      'FND_YES_NO': this.applicationYesNo,
      'PS_RATE_TYPE': this.applicationRateType,
      'PS_RESOURCE_TYPE': this.applicationitemtypes,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOption,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
    })
  }

  save() {
    this.i.stockCode = this.selStock1.Value;
    // this.i.rawStockCode = this.selStock2.Value;
    this.i.standards = this.formatterPrecision(this.i.standards);
    // this.i.rawStandards = this.formatterPrecision(this.i.rawStandards);
    console.log(this.i);

    if (this.i.stockCode === '') {
      this.msgSrv.error('请选择产品！');
      return;
    }

    // if (this.i.rawStockCode === '') {
    //   this.msgSrv.error('请选择原料产品！');
    //   return;
    // }


    if (this.i.resourceType === '' || this.i.resourceType === undefined || this.i.resourceType === 'null') {
      this.msgSrv.error('资源类型为空，请在工厂建模->资源中维护该资源的类型');
      return;
    }

    this.queryService.edit(this.i).subscribe(res => {
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


  // 绑定物料
  public gridViewStocks: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsStock: any[] = [
    {
      field: 'stockCode',
      title: '产品编码',
      width: '100'
    },
    {
      field: 'stockName',
      title: '产品名称',
      width: '100'
    }
  ];
  // 绑定物料
  public gridViewStocks2: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsStock2: any[] = [
    {
      field: 'rawStockCode',
      title: '产品编码',
      width: '100'
    },
    {
      field: 'rawStockName',
      title: '产品名称',
      width: '100'
    }
  ];

  public loadStock(plantCode: string, stockCode: string, PageIndex: number, PageSize: number) {
    // 加载产品编码
    this.queryService.getPsProductionPageList(plantCode || '', stockCode || '', PageIndex, PageSize).subscribe(res => {
      this.gridViewStocks.data = res.data.content;
      this.gridViewStocks.total = res.data.totalElements;
    });
  }
  // 产品编码弹出查询
  public searchPsProduction(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadStock(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize);
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
    this.queryService.GetResouceCode(this.i.plantCode, value).subscribe(resultMes => {
      this.i.resourceType = resultMes.data[0].resourceType;
    });
  }


  @ViewChild('selStock1', { static: true }) selStock1: PopupSelectComponent;
  // @ViewChild('selStock2', { static: true }) selStock2: PopupSelectComponent;



  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.i.stockCode = e.Value;
    this.i.stockName = e.Text;
    // console.log('----this.i------', this.i);
  }


  onTextChanged({ sender, event, Text }) {
    const value = this.i.stockCode || '';
    if (value === '') {
      // 加载产品信息
      this.queryService.getPsProductionPageList(this.i.plantCode || '', value, 1, sender.PageSize).subscribe(res => {
        this.gridViewStocks.data = res.data.content;
        this.gridViewStocks.total = res.data.totalElements;
        const stockInfo = res.data.content.find(x => x.stockCode === Text);
        if (stockInfo) {
          this.i.stockCode = stockInfo.stockCode;
          this.i.stockName = stockInfo.stockName;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('产品信息无效'));
        }
      });
    }
  }




  public loadStock2(plantCode: string, stockCode: string, PageIndex: number, PageSize: number) {
    // 加载产品编码
    this.queryService.getPsProductionPageList(plantCode || '', stockCode || '', PageIndex, PageSize).subscribe(res => {

      res.data.content.forEach(ele => {
        this.gridViewStocks2.data.push({
          'rawStockCode': ele.stockCode,
          'rawStockName': ele.stockName,
        });
      });

      this.gridViewStocks2.total = res.data.totalElements;
    });
  }
  // 产品编码弹出查询
  public searchPsProduction2(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadStock2(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }
  //  行点击事件， 给参数赋值
  onRowSelect2(e: any) {
    this.i.rawStockCode = e.Value;
    this.i.rawStockName = e.Text;
  }


  onTextChanged2({ sender, event, Text }) {
    const value = this.i.rawStockCode || '';
    if (value === '') {
      // 加载产品信息
      this.queryService.getPsProductionPageList(this.i.plantCode || '', value, 1, sender.PageSize).subscribe(res => {
        this.gridViewStocks2.data = res.data.content;
        this.gridViewStocks2.total = res.data.totalElements;
        const stockInfo = res.data.content.find(x => x.stockCode === Text);
        if (stockInfo) {
          this.i.rawStockCode = stockInfo.stockCode;
          this.i.rawStockName = stockInfo.stockName;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('产品信息无效'));
        }
      });
    }
  }

  clear() {
    this.loadData();
  }

}
