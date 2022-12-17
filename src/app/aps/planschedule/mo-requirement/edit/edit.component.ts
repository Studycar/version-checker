import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { PSMoRequirementQueryService } from '../query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mo-requirement-manual-edit',
  templateUrl: './edit.component.html',
  providers: [PSMoRequirementQueryService]
})
export class PSMoRequirementEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};
  steelTypeOptions: any[] = [];
  surfaceOptions: any[] = [];
  gradeOptions: any[] = [];
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
      width: '150'
    }
  ];

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: PSMoRequirementQueryService,
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
    }
    this.loadOptions();
  }

  loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_GRADE': this.gradeOptions,
    });
    this.queryService.GetAppliactioPlant().subscribe(res => {
      res.data.forEach(d => {
        this.plantOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        })
      })
    });
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
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

  onStockTextChanged(e: any) {
    this.i.stockCode = e.Text.trim();
    if(this.i.stockCode !== '') {
      this.queryService.getProductions({
        plantCode: this.appconfig.getActivePlantCode(),
        stockCodeOrName: this.i.stockCode,
        pageIndex: 1,
        pageSize: 1
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.saveStocks(res.data.content[0])
        } else {
          this.clearStock();
          this.msgSrv.info(this.appTranslationService.translate('存货编码或名称无效'));
        }
      });
    } else {
      this.clearStock();
    }
  }

  onStocksSelect(e) {
    this.saveStocks(e.Row);
  }

  saveStocks(data) {
    this.i.stockCode = data.stockCode;
    this.i.stockName = data.stockName;
    this.i.stockDesc = data.stockDesc;
  }

  clearStock() {
    this.i.stockCode = '';
    this.i.stockName = '';
    this.i.stockDesc = '';
  }

  save(value) {
    const params = Object.assign({}, this.i, {
      demandTime: this.queryService.formatDate(this.i.demandTime),
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