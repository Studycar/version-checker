import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { deepCopy } from '@delon/util';

import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { ProductSellBalanceForecastService } from '../../product-sell-balance-forecast.service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { SopDemandAnalysisdm } from 'app/modules/generated_module/services/sopdemandanalysisdm-service';
import { MessageManageService } from 'app/modules/generated_module/services/message-manage-service';
import { DemandCustomizationBasic } from '../demand-customization-basic';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class DemandCustomizationImportComponent extends DemandCustomizationBasic implements OnInit {
  q: any = {}; // 查询参数
  impColumns = {
    columns: ['内外销', '产品大类', '产品小类', '月份', '产品编码', '是否新品', '新品名称', '产地'],
    paramMappings: [
      { field: 'SALES_TYPE', title: '内外销', columnIndex: 1, constraint: { notNull: true, } },
      { field: 'SALES_CATGORY_BIG', title: '营销大类', columnIndex: 2, constraint: { notNull: true } },
      { field: 'SALES_CATGORY_SUB', title: '营销小类', columnIndex: 3, constraint: { notNull: true } },
      { field: 'DEMAND_DATE', title: '月份', columnIndex: 4, constraint: { notNull: true, } },
      { field: 'ITEM_CODE', title: '产品编码', columnIndex: 5, constraint: { notNull: true, } },
      { field: 'IS_NEW', title: '是否新品', columnIndex: 8, constraint: { notNull: true, } },
      { field: 'PROMISE_DATE', title: '新品名称', columnIndex: 9, constraint: { notNull: false, } },
      { field: 'CUSTOMER_NUMBER', title: '产地', columnIndex: 10, constraint: { notNull: true, } },
    ],
  };

  constructor(public pro: BrandService,
    public modal: ModalHelper,
    public modal2: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public messageManageService: MessageManageService,
    public editService: ProductSellBalanceForecastService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    public appGridStateService: AppGridStateService,
    public innerService: ProductSellBalanceForecastService,
    public sopDemandAnalysisdmService: SopDemandAnalysisdm,
    public appConfigService: AppConfigService) {
    super(pro,
      modal,
      msgSrv,
      messageManageService,
      appTranslationService,
      confirmationService,
      innerService,
      sopDemandAnalysisdmService,
      appGridStateService,
      appConfigService);
  }

  ngOnInit(): void {
  }

  public excelDataProcess(tempData: any[]) {
    console.log('excelDataProcess:');
    console.log(tempData);
    this.editService.saveSopuncstrForecastRecord(tempData).subscribe(res => {
      if (res.Success) {
        this.msgSrv.success(this.appTranslationService.translate('导入数据成功！'));
      } else {
        this.msgSrv.error(this.appTranslationService.translate('导入数据失败！' + res.Message));
      }
    });
  }

  public fileDataParse(inParams: { fileImpObj: any, tempDataList: any[], returnObj: any }) {
    console.log('fileDataParse:');
    console.log(inParams);

    const workbook = inParams.fileImpObj; // {sheet:[][]}
    let sheetName = 'Sheet1';
    for (const sheet in workbook) {
      sheetName = sheet;
      break;
    }
    const dataMapper = {
      SALES_TYPE: 2, // 内外销
      PLANT_CODE: 1, // 产地（工厂）
      SALES_CATGORY_BIG: 4, // 营销大类
      SALES_CATGORY_SUB: 5, // 营销小类
      ITEM_CODE: 6,         // 物料编码
      NEW_PRODUCT_CODE: 9,  // 新品编码
      DEMAND_DATE: 3,       // 需求月份
      PRODUCTION_N: 16,     // M月预计入库
      UPDATE_ONHAND: 17,    // M月底库存
      DEMAND_PERIOD: 37,     // 周期
      // 这个特殊，这个是动态生成的，所以只能固定第一列的序号，后面就直接叠加列间隔数，目前的列间隔数为6
      MNMonthValues: {
        SPAN: 6, // 列间隔数
        FORECAST_UPDATE: 20,  // M+N月销量调整
        PRODUCTION_N1: 21,    // M+N月规划生产量
      }
    };
    // 行号
    let rowIndex = 0;
    workbook[sheetName].forEach(item => {
      console.log('start parse data:');
      if (item.length === 0) return; // 过滤空行
      if (rowIndex === 0) {
        rowIndex++;
        return; // 第一行是标题行，直接跳过
      }
      const mnMonthValues = [];
      for (let i = 0; i < item.length; i++) {
        // 先求出跳跃的序号
        const dataIndexSpan = dataMapper.MNMonthValues.SPAN * i;
        // 判断是否超出了列范围
        if (dataIndexSpan + dataMapper.MNMonthValues.FORECAST_UPDATE >= item.length) {
          break;
        }
        mnMonthValues.push({
          FORECAST_UPDATE: item[dataIndexSpan + dataMapper.MNMonthValues.FORECAST_UPDATE],
          PRODUCTION_N1: item[dataIndexSpan + dataMapper.MNMonthValues.PRODUCTION_N1],
        });
      }
      const dataObj = {
        SALES_TYPE: '',
        PLANT_CODE: '',
        SALES_CATGORY_BIG: '',
        SALES_CATGORY_SUB: '',
        ITEM_CODE: '',
        NEW_PRODUCT_CODE: '',
        DEMAND_DATE: '',
        PRODUCTION_N: '',
        UPDATE_ONHAND: '',
        DEMAND_PERIOD: '',
        MNMonthValues: mnMonthValues,
      };
      for (const pro in dataObj) {
        dataObj[pro] = item[dataMapper[pro]];
      }
      dataObj.MNMonthValues = mnMonthValues;
      inParams.tempDataList.push(dataObj);
    });
    console.log('tempDataList');
    console.log(inParams.tempDataList);
  }

  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    console.log('export:');
    const action = { url: this.innerService.baseUrl + '/getsopdemandforupdate', method: 'POST' };
    this.innerService.exportAction(action, this.getQueryParams(), this.excelexport, this, (rsp) => {
      console.log(rsp);
      // 处理数据
      this.respDataHandle(rsp.Result);
      this.expColumns = this.getExportColumns();
      this.excelexport.expColumns = this.getExportColumns();
      console.log('this.expColumns');
      console.log(this.expColumns);
      const rspDto = new ActionResponseDto();
      rspDto.Extra = rsp.Result;
      return rspDto;
    });
  }

  /**
   * 构造查询参数
   */
  public getQueryParams(): any {
    return this.q;
  }

  /**
   * 关闭窗口
   */
  close() {
    this.modal2.destroy();
  }
}
