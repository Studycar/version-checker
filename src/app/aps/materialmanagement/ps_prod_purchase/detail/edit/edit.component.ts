import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { PopupSelectComponent } from 'app//modules/base_module/components/popup-select.component';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { PsProdPurchaseService } from '../../queryService';
import { AppConfigService } from 'app//modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { decimal } from '@shared';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-prod=purchaseEx-edit',
  templateUrl: './edit.component.html',
  providers: [PsProdPurchaseService]

})
export class PsProdPurchaseExEditComponent implements OnInit {
  record: any = {};
  i: any;
  Istrue: boolean;
  disabled1 = false;
  isBancai = false;
  standardsSameFlag = '0';
  currentLanguage: any;
  rawSurfaceOptions: any[] = [];
  gradeLevelOptions: any[] = [];
  yesOrNoOptions: any[] = [];
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
    this.loadRawFace();
    this.loadGradeLevel();
    this.loadYesOrNo();
    this.isBancai = 'BC' === this.i.prodType ? true : false;
    console.log('--------编辑页入参-----------', this.i);
    this.standardsSameFlag = this.i.standardsSameFlag;
    if (this.i.id !== undefined) {
      this.Istrue = true;
      this.disabled1 = true;

      /** 初始化编辑数据 */
      this.queryService.getEx(this.i.id).subscribe(resultMes => {

        if (resultMes.data !== undefined) {
          const d = resultMes.data;
          console.log('当前id' + d.id);
          this.i = {
            id: d.id,
            rawStockCode: d.rawStockCode,
            burdeningId: d.burdeningId,
            rawStockName: d.rawStockName,
            rawStandards: d.rawStandards,
            rawSurface: d.rawSurface,
            surfaceGrade: d.surfaceGrade,
            productionPlace: d.productionPlace,
            enableFlag: d.enableFlag,
            prodType: d.prodType,
            width: d.width,
            length: d.length,
          };


        }
      });



    } else {
      this.Istrue = false;
      this.disabled1 = false;
    }
  }

  save() {
    this.i.rawStockCode = this.selStock2.Value;
    // console.log(this.i);

    if (this.i.stockCode === '') {
      this.msgSrv.error('请选择产品！');
      return;
    }

    if (this.i.rawStockCode === '') {
      this.msgSrv.error('请选择原料产品！');
      return;
    }


    this.queryService.editEx(this.i).subscribe(res => {
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





  /**
  * 加载快码 原料表面
  */
  public loadRawFace(): void {
    this.queryService.GetLookupByType('PS_CONTRACT_SURFACE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.rawSurfaceOptions.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }
    /**
  * 加载快码 原料表面
  */
  public loadProdType(): void {
      this.queryService.GetLookupByType('PS_PROD_TYPE')
        .subscribe(result => {
          result.Extra.forEach(d => {
            this.attributeOptions.push({
              label: d.meaning,
              value: d.lookupCode,
            });
          });
        });
    }
  /**
  * 加载快码 表面等级
  */
  public loadGradeLevel(): void {
    this.queryService.GetLookupByType('PS_GRADE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.gradeLevelOptions.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }
  /**
   * 加载快码 启用禁用
   */
  public loadYesOrNo(): void {
    this.queryService.GetLookupByType('FND_YES_NO')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.yesOrNoOptions.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }


  // 资源 值更新事件
  onChangeLine(value: string): void {
    this.queryService.GetResouceCode(this.i.plantCode, value).subscribe(resultMes => {
      this.i.resourceType = resultMes.data[0].resourceType;
    });
  }


  @ViewChild('selStock2', { static: true }) selStock2: PopupSelectComponent;






  public loadStock2(plantCode: string, stockCode: string, PageIndex: number, PageSize: number) {
    // 加载产品编码
    this.gridViewStocks2.data.length = 0;
    this.queryService.getPsProductionPageList(plantCode || '', stockCode || '', PageIndex, PageSize).subscribe(res => {
      this.gridViewStocks2.data = res.data.content.map(d => ({
        rawStockCode: d.stockCode,
        rawStockName: d.stockName,
      }));
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
    if (value !== '') {
      // 加载产品信息
      this.queryService.getPsProductionPageList(this.i.plantCode || '', value, 1, sender.PageSize).subscribe(res => {
        const stockInfo = res.data.content.length > 0 ? res.data.content[0] : null;
        if (stockInfo) {
          this.i.rawStockCode = stockInfo.stockCode;
          this.i.rawStockName = stockInfo.stockName;
        } else {
          this.i.rawStockCode = '';
          this.i.rawStockName = '';
          this.msgSrv.warning(this.appTranslationService.translate('产品信息无效'));
        }
      });
    } else {
      this.i.rawStockCode = '';
      this.i.rawStockName = '';
    }
  }

  clear() {
    if (this.i.id != null) {
      this.loadData();
    } else {
      this.i = {
        id: null,
        rawSurface: null,
        rawStandards: null,
        rawStockCode: null,
        standards: null,
        rawPriority: null,
        standardsSort: null,
        surfaceGrade: null,
        productionPlace: null,
        enableFlag: null,
      };


    }
  }

}
