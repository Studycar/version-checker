import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { decimal } from "@shared";
import { AgGridAngular } from "ag-grid-angular";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzModalRef, NzMessageService, NzModalService } from "ng-zorro-antd";
import { TransferOrderQueryService } from "../../query.service";

@Component({
  selector: 'planschedule-hw-transfer-order-detail-edit',
  templateUrl: './edit.component.html',
  providers: [TransferOrderQueryService]
})
export class TransferOrderDetailEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};

  detailedStateOptions: any[] = []; // PS_INVOICE_DETAILED_STATE
  plantOptions: any[] = []; 
  allocationDate: string = '';
  outCode: string = '';
  plantCode: string = '';
  @ViewChild('f', { static: true }) f: NgForm;

  // 绑定现有库存表
  public gridViewOnhands: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsOnhands: any[] = [
    {
      field: 'batchCode',
      title: '批号',
      width: '100'
    },
    {
      field: 'itemId',
      title: '存货编码',
      width: '100'
    },
    {
      field: 'skuName',
      title: '存货名称',
      width: '100'
    },
    { field: 'onhandQuantity', width: 120, title: '现有量' },
    { field: 'spec', width: 120, title: '规格' },
    { field: 'unitName', width: 90, title: '单位' },
    { field: 'steelGrade', width: 90, title: '钢种' },
    { field: 'surface', width: 120, title: '表面' },
    { field: 'grade', width: 120, title: '等级' },
    { field: 'coating', width: 120, title: '表面保护' },
    { field: 'actHeight', width: 120, title: '实厚' },
    { field: 'actWidth', width: 120, title: '实宽' },
    { field: 'unitWeight', width: 120, title: '单重' },
    { field: 'grossWeight', width: 120, title: '毛重' },
    { field: 'rollLength', width: 120, title: '长度' },
    { field: 'quality', width: 240, title: '品质信息' },
    { field: 'batchNote', width: 240, title: '批号备注' },
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
  ];

  // 绑定合同
  public gridViewContracts: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsContracts: any[] = [
    {
      field: 'contractCode',
      title: '合同号',
      width: '100'
    },
    {
      field: 'contractState',
      title: '合同状态',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,1).label',
    },
    {
      field: 'basePrice',
      title: '基价',
      width: '100'
    },
    {
      field: 'deposit',
      title: '定金',
      width: '100'
    },
    {
      field: 'money',
      title: '金额',
      width: '100'
    },
    {
      field: 'plantCode',
      title: '供方',
      width: '200',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'affiliatedMonth',
      title: '合同月份',
      width: '100'
    },
    {
      field: 'cusCode',
      title: '客户编码',
      width: '100'
    },
    {
      field: 'cusAbbreviation',
      title: '客户简称',
      width: '100'
    },
    {
      field: 'steelType',
      title: '钢种',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,3).label',
    },
    {
      field: 'rebate',
      title: '返利',
      width: '100'
    },
    {
      field: 'basePrice',
      title: '基价',
      width: '100'
    },
    {
      field: 'remarks',
      title: '备注',
      width: '100'
    },
    {
      field: 'quantitySy',
      title: '合同待分货量',
      width: '100'
    },
    {
      field: 'material',
      title: '厚/薄料',
      width: '100',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
  ];
  contractOptions = {
    1: { 'PS_CONTRACT_STATE': [] },
    2: { 'PLANT_CODE': [] },
    3: { 'PS_CONTRACT_STEEL_TYPE': [] },
    4: { 'HOUBO': [] },
  };
  
  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: TransferOrderQueryService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit() {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.getDetailedOne(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      })
    } else {
      // this.i.pono = 'DBDMX' + this.queryService.formatDate(new Date()).replaceAll('-','') + this.queryService.generateSerial(4);
      this.i.state = '10';
      this.i.plantCode = this.plantCode;
      this.i.taxPrice = 10000;
      this.f.control.markAsDirty();
    }
    this.loadOptions();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_ALLOT_DETAILED_STATE': this.detailedStateOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  generateMoney() {
    const quantity = this.i.quantity ? this.i.quantity : 0;
    const taxPrice = this.i.taxPrice ? this.i.taxPrice : 0;
    this.i.money = decimal.mul(quantity, taxPrice);
  }

  moneyChange() {
    this.generateMoney();
    this.generateWeight();
  }

  generateWeight() {
    const quantity = this.i.quantity ? this.i.quantity : 0;
    const unitWeight = this.i.unitWeight ? this.i.unitWeight : 0;
    this.i.weight = decimal.mul(quantity, unitWeight);
  }

  close() {
    this.modal.destroy();
  }

  save(value) {
    const params = Object.assign({}, this.i, {
      attribute1: this.allocationDate,
      attribute2: this.outCode,
    });
    this.queryService.saveDetailed(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

   /**
   * 现有库存表弹出查询
   * @param {any} e
   */
    public searchOnhands(e: any) {
      const PageIndex = e.Skip / e.PageSize + 1;
      this.loadOnhands(
        e.SearchValue,
        PageIndex,
        e.PageSize,
      );
    }
  
    /**
     * 加载现有库存表
     * @param {string} batchNum  批号
     * @param {number} pageIndex  页码
     * @param {number} pageSize   每页条数
     */
    public loadOnhands(
      batchNum: string,
      pageIndex: number,
      pageSize: number,
    ) {
      this.queryService
        .getOnhands({
          plantCode: this.plantCode,
          batchCode: batchNum,
          pageIndex: pageIndex,
          pageSize: pageSize,
        })
        .subscribe(res => {
          this.gridViewOnhands.data = res.data.content;
          this.gridViewOnhands.total = res.data.totalElements;
        });
    }
  
    //  行点击事件， 给参数赋值
    onOnhandsSelect(e: any) {
      this.saveOnhands(e.Row);
    }

    saveOnhands(data) {
      this.i.batchNum = data.batchCode;
      this.i.stockCode = data.itemId;
      this.i.stockName = data.skuName;
      this.i.unit = data.unitName || '';
      this.i.unitCode = data.unitCode || '';
      this.i.steelStandart = data.spec || '';
      this.i.steelType = data.steelGrade || '';
      this.i.surface = data.surface || '';
      this.i.grade = data.grade || '';
      this.i.thickness = data.actHeight || '';
      this.i.cwar = data.whCode || '';
      this.i.weigth = data.actWidth || '';
      this.i.grossWeight = data.grossWeight || '';
      this.i.length = data.rollLength || '';
      this.i.qualityInformation = data.quality || '';
      this.i.coating = data.coating || '';
      this.i.batchNumRemarks = data.batchNote || '';
      this.i.unitWeight = data.unitWeight;
      this.i.quantity = data.onhandQuantity;
      this.generateMoney();
      this.generateWeight();
    }

    clearOnhands() {
      this.i.batchNum = '';
      this.i.stockCode = '';
      this.i.stockName = '';
      this.i.unit = '';
      this.i.unitCode = '';
      this.i.steelStandart = '';
      this.i.steelType = '';
      this.i.surface = '';
      this.i.grade = null;
      this.i.cwar = '';
      this.i.weigth = '';
      this.i.grossWeigth = '';
      this.i.length = '';
      this.i.quantityInformation = '';
      this.i.coating = '';
      this.i.batchNumRemarks = '';
      this.i.unitWeight = '';
      this.i.quantity = '';
      this.generateMoney();
      this.generateWeight();
    }
  
    onOnhandsTextChanged(event: any) {
      const batchNum = event.Text.trim();
      if(batchNum !== '') {
        this.queryService
        .getOnhands({
          plantCode: this.plantCode,
          batchCode: batchNum,
          pageIndex: 1,
          pageSize: 1,
        }).subscribe(res => {
          if(res.data.content.length > 0) {
            this.saveOnhands(res.data.content[0]);
          } else {
            this.clearOnhands();
            this.msgSrv.info(this.appTranslationService.translate('批号无效'))
          }
        });
      } else {
        this.clearOnhands();
      }
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
        this.gridViewWares.data = res.data.content;
        this.gridViewWares.total = res.data.totalElements;
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
    this.i.transportationEnterprise = data.warehouse;
  }

  clearWares() {
    this.i.transportationEnterprise = '';
  }

  /**
   * 合同弹出查询
   * @param {any} e
   */
   public searchContracts(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadContracts(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载合同
   * @param {string} contractCode  合同号
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadContracts(
    contractCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    this.queryService
      .getContracts({
        contractCode: contractCode,
        pageIndex: pageIndex,
        pageSize: pageSize
      })
      .subscribe(res => {
        this.gridViewContracts.data = res.data.content;
        this.gridViewContracts.total = res.data.totalElements;
      });
  }

  ContractTextChanged(event: any) {
    this.i.contractCode = event.Text.trim();
    if(this.i.contractCode !== '') {
      this.queryService
      .getContracts({
        contractCode: this.i.contractCode,
        pageIndex: 1,
        pageSize: 10
      })
      .subscribe(res => {
        if(res.data.content.length === 0) {
          this.msgSrv.info(this.appTranslationService.translate('合同号无效'));
          this.clearContract();
        } else {
          this.saveContract(res.data.content[0])
        }
      });
    } else {
      this.clearContract();
    }
  }

  onRowSelectContracts(e) {
    this.saveContract(e.Row);
  }

  saveContract(data) {
    this.i.contractCode = data.contractCode;
  }

  clearContract() {
    this.i.contractCode = '';
  }
}