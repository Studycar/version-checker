import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { PopupSelectComponent } from 'app//modules/base_module/components/popup-select.component';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { PsBurdeningStandardService } from '../queryService';
import { AppConfigService } from 'app//modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { T } from '@angular/cdk/keycodes';
import { decimal } from '@shared';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ps-burdening-standar-edit',
  templateUrl: './edit.component.html',
  providers: [PsBurdeningStandardService]

})
export class PsBurdeningStandardEditComponent implements OnInit {
  record: any = {};
  i: any;
  Istrue: boolean;
  disabled1 = false;
  isBancai = false;
  currentLanguage: any;
  surfaceOptions: any[] = [];

  steelTypeOption: any[] = [];
  yesOrNoOptions: any[] = [];
  attributeOptions: any[] = [
    { label: '卷材', value: 'juanCai' },
    { label: '板材', value: 'banCai' }
  ];
  formatterPrecision = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: PsBurdeningStandardService,
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
    this.loadSteelType();
    this.loadContractSurface();
    this.loadYesOrNo();


    console.log(this.i.id);
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
            processName: d.processName,
            processCode: d.processCode,
            standards: d.standards,
            surface: d.surface,
            enableFlag: d.enableFlag,
            burdeningType: d.burdeningType,
            width: d.width,
            length: d.length,
          };

          this.loadplantGroup();



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

  save() {
    this.i.stockCode = this.selStock1.Value;
    this.i.standards = this.formatterPrecision(this.i.standards);
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


  // 绑定工序
  public gridViewProcess: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsProcess: any[] = [
    {
      field: 'processCode',
      title: '工序编码',
      width: '100'
    },
    {
      field: 'processName',
      title: '工序名称',
      width: '100'
    }
  ];




  public loadProcess(plantCode: string, processCode: string, PageIndex: number, PageSize: number) {
    this.gridViewProcess.data.length = 0;
    // 加载产品编码
    this.queryService.getProcessPageList(plantCode || '', processCode || '', PageIndex, PageSize).subscribe(res => {
      res.data.content.forEach(ele => {
        this.gridViewProcess.data.push({
          'processCode': ele.operationCode,
          'processName': ele.operationName,
        });
      });

      this.gridViewProcess.total = res.data.totalElements;
    });
  }
  // 产品编码弹出查询
  public searchPsProcess(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadProcess(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }



  /**
     * 加载快码 产品表面
     */
  public loadContractSurface(): void {
    this.queryService.GetLookupByType('PS_CONTRACT_SURFACE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.surfaceOptions.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }


  /**
   * 加载快码 钢种
   */
  public loadSteelType(): void {
    this.queryService.GetLookupByType('PS_CONTRACT_STEEL_TYPE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.steelTypeOption.push({
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
  @ViewChild('selProcess1', { static: true }) selProcess1: PopupSelectComponent;



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

  //  行点击事件， 给参数赋值
  onRowSelectProcess(e: any) {
    this.i.processCode = e.Value;
    this.i.processName = e.Text;
  }


  onTextChangedProcess({ sender, event, Text }) {
    const value = this.i.processCode || '';
    if (value === '') {
      // 加载产品信息
      this.queryService.getProcessPageList(this.i.plantCode || '', value, 1, sender.PageSize).subscribe(res => {
        this.gridViewProcess.data = res.data.content;
        this.gridViewProcess.total = res.data.totalElements;
        const processInfo = res.data.content.find(x => x.processCode === Text);
        if (processInfo) {
          this.i.processCode = processInfo.processCode;
          this.i.processName = processInfo.processName;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('工序信息无效'));
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
        processCode: null,
        processName: null,
        surface: null,
        enableFlag: 'Y',
      };


    }
  }

}
