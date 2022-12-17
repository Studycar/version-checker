import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { BasePriceQueryService } from "../query.service";
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { DisabledTimeFn } from "ng-zorro-antd/date-picker/standard-types";
import { GridDataResult } from "@progress/kendo-angular-grid";

@Component({
  selector: 'base-price-edit',
  templateUrl: './edit.component.html',
  providers: [BasePriceQueryService]
})
export class BasePriceEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  cusGradeOptions: any[] = [];
  steelTypeOptions: any[] = [];
  steelSortOptions: any[] = [];
  surfaceOptions: any[] = [];
  plantOptions: any[] = [];
  prodTypeOptions: any[] = [];
  @ViewChild('f', { static: true }) f: NgForm;
  today = new Date();
  range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) < 0;
  };

  disabledDateTime: DisabledTimeFn = () => {
    const publishDate = new Date(this.i.publishDate);
    const nzDisabledHours = [];
    const nzDisabledMinutes = [];
    const nzDisabledSeconds = [];
    if(differenceInCalendarDays(publishDate, this.today) === 0) {
      nzDisabledHours.push(...this.range(0, this.today.getHours()));
      if(publishDate.getHours() === this.today.getHours()) {
        nzDisabledMinutes.push(...this.range(0, this.today.getMinutes()));
        if(publishDate.getMinutes() === this.today.getMinutes()) {
          nzDisabledSeconds.push(...this.range(0, this.today.getSeconds()));
        }
      }
    }
    return {
      nzDisabledHours: () => nzDisabledHours,
      nzDisabledMinutes: () => nzDisabledMinutes,
      nzDisabledSeconds: () => nzDisabledSeconds
    };
  };

  publishDateChange(e) {
    const publishDate = new Date(this.i.publishDate);
    if(publishDate.getTime() < this.today.getTime()) {
      this.i.publishDate = new Date(this.today);
    }
  }

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

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: BasePriceQueryService,
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
      this.i.publishDate = new Date();
      this.i.plantCode = this.appconfig.getActivePlantCode();
    }
    this.loadOptions();
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_STEEL_SORT': this.steelSortOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_PRODUCT_FORM': this.prodTypeOptions,
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
        this.gridViewStocks.total = res.data.totalElements + 1
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

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  save(value) {
    const params = Object.assign({}, this.i, {
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