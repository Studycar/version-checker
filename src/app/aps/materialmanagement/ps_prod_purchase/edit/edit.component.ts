import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { PopupSelectComponent } from 'app//modules/base_module/components/popup-select.component';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { PsProdPurchaseService } from '../queryService';
import { AppConfigService } from 'app//modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { decimal } from '@shared';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-prod-purchase-edit',
  templateUrl: './edit.component.html',
  providers: [PsProdPurchaseService]

})
export class PsProdPurchaseEditComponent implements OnInit {
  record: any = {};
  i: any;
  Istrue: boolean;
  disabled1 = false;
  isBancai = false;
  currentLanguage: any;
  surfaceOptions: any[] = [];

  steelTypeOption: any[] = [];
  yesOrNoOptions: any[] = [];
  yesOrNoOptions2: any[] = [];
  attributeOptions: any[] = [];
  formatterPrecision = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: PsProdPurchaseService,
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
    this.loadOptions();
    if (this.i.id !== undefined) {
      this.Istrue = true;
      this.disabled1 = true;
      /** 初始化编辑数据 */
      this.queryService.get(this.i.id).subscribe(resultMes => {

        if (resultMes.data !== undefined) {
          const d = resultMes.data;
          console.log('当前id' + d.id);
          this.i = {
            id: d.id,
            plantCode: d.plantCode,
            steelType: d.steelType,
            stockCode: d.stockCode,
            stockName: d.stockName,
            standardsLow: d.standardsLow,
            standardsHigh: d.standardsHigh,
            surface: d.surface,
            enableFlag: d.enableFlag,
            prodType: d.prodType,
            width: d.width,
            length: d.length,
          };

          this.loadplantGroup();



        }
      });



    } else {
      this.Istrue = false;
      this.disabled1 = false;
      this.i.scheduleFlag = 'Y';
      this.i.selectResourceFlag = 'Y';

      this.i.plantCode = this.appConfigService.getPlantCode();

      this.onChangePlant(this.i.plantCode);
    }
  }


  public loadOptions(): void {
    this.queryService.GetLookupByTypeRefAll({
      'FND_YES_NO': this.yesOrNoOptions,
      'PS_YES_NOT': this.yesOrNoOptions2,
      'PS_PROD_TYPE': this.attributeOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOption,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
    });
  }


  save() {
    if (Number(this.i.standardsLow) > Number(this.i.standardsHigh)) {
      this.msgSrv.warning('产品规格最大 不能小于 产品规格最小');
      return;
    }
    this.i.stockCode = this.selStock1.Value;
    this.i.standardsLow = this.formatterPrecision(this.i.standardsLow);
    this.i.standardsHigh = this.formatterPrecision(this.i.standardsHigh);
    console.log(this.i);

    if (this.i.stockCode === '') {
      this.msgSrv.error('请选择产品！');
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
      result.Extra.forEach(d => {
        this.optionListPlant.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        });

      });
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




  public loadStock(plantCode: string, stockCode: string, PageIndex: number, PageSize: number) {
    this.gridViewStocks.data.length = 0;
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
    this.i.resourceCode = '';
    // 计划组为空，从新清空绑定组和产线
    this.optionListPlantGroup = [];
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


  /**
   * 判断是板材 还是 卷材
   * @param value 
   */
  onChangeAttribute(value: string): void {
    if (value === 'juanCai') {
      this.isBancai = false;
    } else if (value === 'banCai') {
      this.isBancai = true;
    }

  }


  // 资源 值更新事件
  onChangeLine(value: string): void {
    this.queryService.GetResouceCode(this.i.plantCode, value).subscribe(resultMes => {
      this.i.resourceType = resultMes.data[0].resourceType;
    });
  }


  @ViewChild('selStock1', { static: true }) selStock1: PopupSelectComponent;



  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.i.stockCode = e.Value;
    this.i.stockName = e.Text;
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




  clear() {
    if (this.i.id != null) {
      this.loadData();
    } else {
      this.i = {
        id: null,
        plantCode: null,
        stockCode: null,
        stockName: null,
        surface: null,
        enableFlag: 'Y',
      };


    }
  }

}
