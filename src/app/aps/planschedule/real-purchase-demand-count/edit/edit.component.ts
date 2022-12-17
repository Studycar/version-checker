import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]
})
export class RealPurchaseDemandCountEditComponent implements OnInit {
  plantOptions: any[] = [];
  versionOptions: any[] = [];
  steelTypeOptions: any[] = [];
  surfaceOptions: any[] = [];
  unitOptions: any[] = [];
  gradeOptions: any[] = [];
  type: string = 'count'; // coating：胶膜实时需求汇总，count：原材料实施采购需求汇总
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    public http: _HttpClient,
  ) {

  }

  // 绑定产品
  public gridViewStocks: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsStocks: any[] = [
    {
      field: 'stockCode',
      title: '产品编码',
      width: '100'
    },
    {
      field: 'stockName',
      title: '产品名称',
      width: '100'
    },
    {
      field: 'stockDesc',
      title: '产品描述',
      width: '100'
    },
    {
      field: 'unitOfMeasure',
      title: '单位',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,1).label'
    },
    {
      field: 'standrads',
      title: '规格',
      width: '100'
    },
    {
      field: 'catName',
      title: '胶膜分类',
      width: '100'
    },
    {
      field: 'unitWeight',
      title: '单位重量',
      width: '100'
    },
  ];
  stockOptions = {
    1: { 'PS_ITEM_UNIT': [] }
  }
  isModify = false;
  i: any;
  iClone: any;
  // 测试用的下拉列表，可删除
  selectOptions: { label: any, value: any, [key: string]: any }[] = [];

  // 初始化
  ngOnInit(): void {
    if (this.i.id !== null) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i.demandType = 'manual';
      this.i.plantCode = this.appConfigService.getActivePlantCode();
    }
    this.loadOptions();
  }

  // 加载搜索项
  async loadOptions() {
    if(this.type === 'count') {
      this.queryService.GetLookupByTypeRefAll({
        'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
        'PS_CONTRACT_SURFACE': this.surfaceOptions,
        'PS_ITEM_UNIT': this.unitOptions,
        'PS_GRADE': this.gradeOptions,
      });
    }
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  // 保存
  save(value: any) {
    const params = Object.assign({}, this.i, {
      coatingFlag: this.type === 'count' ? 'N' : 'Y'
    });
    this.queryService.save(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }
  
  /**
   * 产品弹出查询
   * @param {any} e
   */
  public searchStocks(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadStocks(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载产品
   * @param {string} stockCode  产品编码
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadStocks(
    stockCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.queryService
      .getProductions({
        plantCode: this.i.plantCode,
        stockCodeOrName: stockCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewStocks.data = res.data.content;
        this.gridViewStocks.total = res.data.totalElements + 1;
      });
  }

  onStockTextChanged(e: any) {
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.i.stockCode = e.Text.trim();
    if(this.i.stockCode !== '') {
      this.queryService.getProductions({
        plantCode: this.i.plantCode,
        stockCodeOrName: this.i.stockCode,
        pageIndex: 1,
        pageSize: 1
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveStocks(res.data.content[0]);
        } else {
          this.clearStocks();
          this.msgSrv.info(this.appTranslationService.translate('产品编码或名称无效'));
        }
      });
    } else {
      this.clearStocks();
    }
  }

  onStocksSelect(e) {
    this.saveStocks(e.Row);
  }

  saveStocks(data) {
    this.i.stockCode = data.stockCode;
    this.i.stockName = data.stockName;
    if(this.type === 'count') {
      this.i.unitOfMeasure = data.unitOfMeasure;
    } else {
      this.i.stockDesc = data.stockDesc;
      this.i.standrads = data.standrads;
      this.i.catName = data.catName;
      this.i.unitWeight = data.unitWeight;
    }
  }

  clearStocks() {
    this.i.stockCode = '';
    this.i.stockName = '';
    if(this.type === 'count') {
      this.i.unitOfMeasure = null;
    } else {
      this.i.stockDesc = '';
      this.i.standrads = '';
      this.i.catName = '';
      this.i.unitWeight = '';
    }
  }

  // 关闭
  close() {
    this.modal.destroy();
  }

  // 重置
  clear() {
    this.i = Object.assign({}, this.iClone);
  }

}