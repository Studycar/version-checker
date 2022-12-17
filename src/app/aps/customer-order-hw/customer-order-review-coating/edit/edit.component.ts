import { Component, OnInit } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService } from "ng-zorro-antd";
import { CustomerOrderReviewCoatingQueryService } from "../query.service";

@Component({
  selector: 'customer-order-review-coating-edit',
  templateUrl: './edit.component.html',
  providers: [CustomerOrderReviewCoatingQueryService]
})
export class CustomerOrderReviewCoatingEditComponent implements OnInit {
  
  /**false：新增信息，true：编辑信息 */
  isModify: boolean = false;
  i: any; 
  iClone: any;
  paperOptions: any[] = [];
  plantOptions: any[] = [];
  labelDescOptions: any[] = [];
  getLabelList = (value, pageIndex, pageSize) => this.queryService.getLabel(value, pageIndex, pageSize);

  // 绑定存货
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
  ];

  // 绑定标签描述
  public gridViewlabels: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsLabels: any[] = [
    {
      field: 'attrValueName',
      title: '标签描述',
      width: '120'
    },
  ];

  constructor(
    private modal: NzModalRef,
    private queryService: CustomerOrderReviewCoatingQueryService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.get(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        }
      })
    }
    this.loadOptions();
  }

  loadOptions() {
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        })
      })
    });
    this.queryService.GetLookupByType('PS_SURFACE_PROTECT').subscribe(res => {
      if(res.Extra && res.Extra.length > 0) {
        res.Extra.forEach(d => {
          // if(['无', '垫纸'].includes(d.lookupCode)) {
          // }
          this.paperOptions.push({
            label: d.lookupCode,
            value: d.meaning
          });
        });
      }
    });
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  labelDescChange(e) {
    this.i.labelDesc = e.value;
  }

  save(value) {
    this.queryService.save(this.i).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
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
    this.queryService
      .getProductions({
        plantCode: this.appconfig.getActivePlantCode(),
        stockCodeOrName: stockCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewStocks.data = res.data.content;
        this.gridViewStocks.total = res.data.totalElements;
      });
  }

  onStockTextChanged(e: any, type?: 'Up' | 'Down') {
    const stockCode = e.Text.trim();
    if(stockCode !== '') {
      this.queryService.getProductions({
        plantCode: this.appconfig.getActivePlantCode(),
        stockCodeOrName: stockCode,
        pageIndex: 1,
        pageSize: 1
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveStocks(res.data.content[0], type);
        } else {
          this.clearStocks(type);
          this.msgSrv.info(this.appTranslationService.translate('存货编码无效'));
        }
      });
    } else {
      this.clearStocks(type);
    }
  }

  onStocksSelect(e, type?: 'Up' | 'Down') {
    this.saveStocks(e.Row, type);
  }

  saveStocks(data, type?: 'Up' | 'Down') {
    if(!type) {
      // 保存存货编码、名称
      this.i.stockCode = data.stockCode;
      this.i.stockName = data.stockName;
    } else {
      // 保存面膜/底膜存货编码、描述
      this.i[`coating${type}Code`] = data.stockCode;
      this.i[`coating${type}Name`] = data.stockDesc;
    }
  }

  clearStocks(type?: 'Up' | 'Down') {
    if(!type) {
      // 清空存货编码、名称
      this.i.stockCode = '';
      this.i.stockName = '';
    } else {
      // 清空面膜/底膜存货编码、描述
      this.i[`coating${type}Code`] = '';
      this.i[`coating${type}Name`] = '';
    }
  }

  /**
   * 存货弹出查询
   * @param {any} e
   */
   public searchLabels(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadLabels(
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
  public loadLabels(
    labelDesc: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService
      .getLabel(
        labelDesc,
        pageIndex,
        pageSize,
      )
      .subscribe(res => {
        this.gridViewlabels.data = res.data.content;
        this.gridViewlabels.total = res.data.totalElements;
      });
  }

  onLabelTextChanged(e: any) {
    const labelDesc = e.Text.trim();
    if(labelDesc !== '') {
      this.queryService.getLabel(
        labelDesc,
        1,
        1,
      ).subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveLabels(res.data.content[0]);
        } else {
          this.clearLabels();
          this.msgSrv.info(this.appTranslationService.translate('标签描述无效'));
        }
      });
    } else {
      this.clearLabels();
    }
  }

  onLabelsSelect(e) {
    this.saveLabels(e.Row);
  }

  saveLabels(data) {
    this.i.labelDesc = data.attrValueName;
  }

  clearLabels() {
    this.i.labelDesc = '';
  }
}