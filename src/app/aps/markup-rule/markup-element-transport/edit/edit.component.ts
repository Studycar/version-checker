import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MarkupElementTransportQueryService } from '../query.service';

@Component({
  selector: 'markup-element-transport-edit',
  templateUrl: './edit.component.html',
  providers: [MarkupElementTransportQueryService]
})
export class MarkupElementTransportEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  markupStateOptions: any[] = [];
  steelTypeOptions: any[] = [];
  steelSortOptions: any[] = [];
  surfaceOptions: any[] = [];
  transportTypeOptions: any[] = [];
  plantOptions: any[] = [];
  @ViewChild('f', { static: true }) f: NgForm;
  // 绑定存货
  public gridViewStocks: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsStocks: any[] = [
    {
      field: 'stockCode',
      title: '存货编码',
      width: '100'
    },
    {
      field: 'stockName',
      title: '存货名称',
      width: '100'
    },
    {
      field: 'stockDesc',
      title: '存货描述',
      width: '100'
    },
  ];
    
  // 绑定仓库表
  public gridViewWares: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsWares: any[] = [
    {
      field: 'warehouse',
      width: 120,
      title: '配送仓库',
    },
    {
      field: 'place',
      width: 120,
      title: '配送地点',
    },
    {
      field: 'area',
      width: 120,
      title: '送货区域',
    },
    {
      field: 'ranges',
      width: 120,
      title: '送货范围',
    },
  ];

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: MarkupElementTransportQueryService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit() {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.getOne(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        }
      });
    } else {
      this.i.plantCode = this.appconfig.getActivePlantCode();
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_STEEL_SORT': this.steelSortOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_TRANSPORT_TYPE': this.transportTypeOptions,
      'PS_MARKUP_ELEMENT_STATE': this.markupStateOptions,
    });
    this.steelTypeOptions.unshift({
      label: '*',
      value: '*'
    })
    this.steelSortOptions.unshift({
      label: '*',
      value: '*'
    })
    this.surfaceOptions.unshift({
      label: '*',
      value: '*'
    })
    this.transportTypeOptions.unshift({
      label: '*',
      value: '*'
    })
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  /**
   * 存货弹出查询
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
   * 加载存货
   * @param {string} stockCode  存货编码
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
        let data  = res.data.content || []
        data.unshift({
          stockCode: '*',
          stockName: '*',
          stockDesc: '*'
        })
        this.gridViewStocks.data = data;
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
          this.msgSrv.info(this.appTranslationService.translate('存货编码或名称无效'));
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
  }

  clearStocks() {
    this.i.stockCode = '';
    this.i.stockName = '';
  }

  /**
   * 仓库弹出查询
   * @param {any} e
   */
  public searchWares(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadWares(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载仓库
   * @param {string} warehouse  仓库
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadWares(
    warehouse: string,
    pageIndex: number,
    pageSize: number,
  ) {
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂'));
      return;
    }
    this.queryService
      .getDistributions({
        plantCode: this.i.plantCode,
        warehouse: warehouse,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        let data  = res.data.content || []
        data.unshift({
          warehouse: '*',
          place: '*',
          area: '*',
          ranges: '*'
        })
        this.gridViewWares.data = data;
        this.gridViewWares.total = res.data.totalElements + 1;
      });
  }

  //  行点击事件， 给参数赋值
  onWaresSelect(e: any) {
    this.saveWares(e.Row);
  }

  onWaresTextChanged(event: any) {
    if(!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂'));
      return;
    }
    const warehouse = event.Text.trim();
    if(warehouse !== '') {
      this.queryService
      .getDistributions({
        plantCode: this.i.plantCode,
        warehouse: warehouse,
        pageIndex: 1,
        pageSize: 1,
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveWares(res.data.content[0]);
        } else {
          this.clearWares();
          this.msgSrv.warning(this.appTranslationService.translate('配送仓库无效'))
        }
      });
    } else {
      this.clearWares();
    }
  }

  saveWares(data) {
    this.i.distributionWarehouse = data.warehouse;
  }

  clearWares() {
    this.i.distributionWarehouse = '';
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  save(value) {
    const params = Object.assign({}, this.i, {
      startDate: this.queryService.formatDate(this.i.startDate),
      endDate: this.queryService.formatDate(this.i.endDate),
    });
    this.queryService.save(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

}