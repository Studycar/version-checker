import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ModelChangeTimeService } from '../../../../modules/generated_module/services/modelchangetime-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { QueryService } from '../query.service';
import { GridDataResult } from '@progress/kendo-angular-grid';

/**
 * 维护换模换型时间
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'modelchangetime-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]
})
export class ModelChangeTimeEditComponent implements OnInit {
  title: String = '编辑';
  languageOptions: any[] = [];
  isModify = false;
  unitAll: any[] = [];
  i: any;
  /**克隆编辑对象 */
  iClone: any;
  tag: any;
  option: any;
  CurPlant: any;
  Istrue = false;
  required: Boolean;
  readOnly: boolean;

  IsFristTime = false;
  public enableOptions: any[] = [];
  public MoTypeOptions: any[] = [];
  public SchedulRegionOptions: any[] = [];
  public PlantCodeOptions: any[] = [];
  public defaltOptions: any[] = [];
  public catOptions: any[] = [];
  public groupOptions: any[] = [];
  public lineOptions: any[] = [];
  public steelTypeOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public modelChangeTimeService: ModelChangeTimeService,
    public appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    public queryService: QueryService,
  ) { }

  public gridViewStock1: GridDataResult = {
    data: [],
    total: 0
  };
  public gridViewStock2: GridDataResult = {
    data: [],
    total: 0
  }
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

  public gridViewProcess1: GridDataResult = {
    data: [],
    total: 0
  };
  public gridViewProcess2: GridDataResult = {
    data: [],
    total: 0
  }
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

  ngOnInit(): void {
    if (this.i.id) {
      this.isModify = true;
      this.title = '编辑';
      this.iClone = Object.assign({}, this.i);
    } else {
      this.isModify = false;
      this.title = '新增';
      this.i.category = '1';
      this.i.plantCode = this.CurPlant;
      this.i.enableFlag = 'Y';
    }
    this.loadData();
  }

  loadData() {
    // 工厂、计划组、资源
    if (this.i.plantCode) {
      this.loadGroup();
      this.loadLine();
    }

    // 自制类型
    this.queryService.GetLookupByTypeRefAll({
      'PS_SWITCH_TIME_TYPE_HW': this.catOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
    })
  }

  // 工厂切换
  plantChange() {
    this.catChange();
    this.i.scheduleGroupCode = null;
    this.i.resourceCode = null;
    this.loadGroup();
  }

  // 切换计划组
  public groupChange(value: string) {
    this.i.resourceCode = null;
    this.loadLine();
  }

  // 加载计划组
  private loadGroup() {
    // this.groupOptions.length = 0;
    if (!this.i.plantCode) {
      return;
    }
    this.queryService.GetUserPlantGroup(this.i.plantCode)
      .subscribe(result => {
        this.groupOptions.length = 0;
        result.Extra.forEach(d => {
          this.groupOptions.push({ value: d.scheduleGroupCode, label: d.scheduleGroupCode });
        });
      });
  }
  // 加载资源产线
  private loadLine() {
    // this.lineOptions.length = 0;
    if (!this.i.scheduleGroupCode) {
      return;
    }
    this.queryService.GetUserPlantGroupLine(this.i.plantCode || '', this.i.scheduleGroupCode || '')
      .subscribe(result => {
        this.lineOptions.length = 0;
        result.Extra.forEach(d => {
          this.lineOptions.push({ value: d.resourceCode, label: d.resourceCode });
        });
      });
  }

  // 自制类型切换
  catChange() {
    this.i.objectFrom = '';
    this.i.objectTo = '';
  }

  public confirm(value?: any) {
    /*const re = /^[0-9]+?[0-9]*$/;
    if ((this.i.switchTime !== '' && !re.test(this.i.switchTime))) {
      this.msgSrv.warning(this.appTranslationService.translate('切换小时必须为整数'));
      return;
    }*/
    // console.log('in confirm ==>', this.i)
    const { objectFrom, objectTo } = this.i
    if (!objectFrom) {
      this.msgSrv.warning(this.appTranslationService.translate('请输入因子(前)'));
      return;
    }
    if (!objectTo) {
      this.msgSrv.warning(this.appTranslationService.translate('请输入因子(后)'));
      return;
    }
    if (objectFrom === objectTo) {
      this.msgSrv.warning(this.appTranslationService.translate('因子(前)和因子(后)不能相同'));
      return;
    }
    this.save(value);
  }

  save(value?: any) {
    const dto = {
      id: this.i.id,
      plantCode: this.i.plantCode,
      scheduleGroupCode: this.i.scheduleGroupCode,
      resourceCode: this.i.resourceCode,
      category: this.i.category,
      objectFrom: this.i.objectFrom,
      objectTo: this.i.objectTo,
      switchTime: this.i.switchTime,
      enableFlag: this.i.enableFlag,
      remark: this.i.remark
    };
    this.modelChangeTimeService.Save(dto).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg || '保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  onChangeStandardType(): void {
    //  【工单标准类型】=非标准，【默认的工单类型】只有 否（即标准类型才能默认工厂的工单类型为是）
    if (this.i.STANDARD_TYPE === 'N') {
      this.i.DEFAULT_FLAG = '';
      const temp = this.defaltOptions.find(x => x.value === 'N');
      this.defaltOptions = [];
      this.i.DEFAULT_FLAG = 'N';
      this.defaltOptions.push({
        label: temp.label,
        value: temp.value,
      });
    } else {
      this.i.DEFAULT_FLAG = '';
      this.defaltOptions = this.enableOptions;
    }

  }

  public onRowSelect(e, type) {
    this.i['object' + type] = e.Value
  }

  // 产品编码弹出查询
  public searchPsProcess(e: any, type: number = 1) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadProcess(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize, type);
  }
  public loadProcess(plantCode: string, processCode: string, PageIndex: number, PageSize: number, type: number = 1) {
    this['gridViewProcess' + type].data.length = 0;
    // 加载产品编码
    this.queryService.getProcessPageList(plantCode || '', processCode || '', PageIndex, PageSize).subscribe(res => {
      res.data.content.forEach(ele => {
        this['gridViewProcess' + type].data.push({
          'processCode': ele.operationCode,
          'processName': ele.operationName,
        });
      });
      this['gridViewProcess' + type].total = res.data.totalElements;
    });
  }
  onTextChangedProcess({ sender, event, Text }, suffix, type: number = 1) {
    const value = this.i.processCode || '';
    if (value === '') {
      // 加载产品信息
      this.queryService.getProcessPageList(this.i.plantCode || '', value, 1, sender.PageSize).subscribe(res => {
        this['gridViewProcess' + type].data = res.data.content;
        this['gridViewProcess' + type].total = res.data.totalElements;
        const processInfo = res.data.content.find(x => x.processCode === Text);
        if (processInfo) {
          this.i['object' + suffix] = processInfo.processCode;
          // this.i.processCode = processInfo.processCode;
          // this.i.processName = processInfo.processName;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('工序信息无效'));
        }
      });
    }
  }

  // 产品编码弹出查询
  public searchPsProduction(e: any, type: number = 1) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadStock(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize, type);
  }
  public loadStock(plantCode: string, stockCode: string, PageIndex: number, PageSize: number, type: number = 1) {
    this['gridViewStock' + type].data.length = 0;
    // 加载产品编码
    this.queryService.getPsProductionPageList(plantCode || '', stockCode || '', PageIndex, PageSize).subscribe(res => {
      this['gridViewStock' + type].data = res.data.content;
      this['gridViewStock' + type].total = res.data.totalElements;
    });
  }
  onTextChangedStock({ sender, event, Text }, suffix, type: number = 1) {
    const value = this.i.stockCode || '';
    if (value === '') {
      // 加载产品信息
      this.queryService.getPsProductionPageList(this.i.plantCode || '', value, 1, sender.PageSize).subscribe(res => {
        this['gridViewStock' + type].data = res.data.content;
        this['gridViewStock' + type].total = res.data.totalElements;
        const stockInfo = res.data.content.find(x => x.stockCode === Text);
        if (stockInfo) {
          this.i['object' + suffix] = stockInfo.stockCode;
          // this.i.stockCode = stockInfo.stockCode;
          // this.i.stockName = stockInfo.stockName;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('产品信息无效'));
        }
      });
    }
  }


  // search1(e: any) {
  //   console.log('search1 ==>')
  //   const PageIndex = e.Skip / e.PageSize + 1;
  //   if (this.i.category === '1') {
  //     // 加载物料
  //     this.loadItems(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize);
  //   } else {
  //     // 加载库存分类
  //     this.loadCat(e.SearchValue, PageIndex, e.PageSize);
  //   }
  // }

  // change1({ sender, event, Text }) {
  //   console.log('change1 ==>')
  //   const value = this.i.objectFrom || '';
  //   if (value === '') {
  //     if (this.i.category === '1') {
  //       // 加载物料或库存分类
  //       this.queryService.getUserPlantItemPageList(this.i.plantCode || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
  //         this.gridView1.data = res.data.content;
  //         this.gridView1.total = res.data.totalElements;
  //         if (res.data.totalElements === 1) {
  //           this.i.OBJECT_FROM_Val = res.data.content.find(x => x.itemCode === Text).itemId;
  //         } else {
  //           this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
  //         }
  //       });
  //     }
  //   }
  // }

  // search2(e: any) {
  //   const PageIndex = e.Skip / e.PageSize + 1;
  //   if (this.i.category === '1') {
  //     // 加载物料
  //     this.loadItems(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize, 2);
  //   } else {
  //     // 加载库存分类
  //     this.loadCat(e.SearchValue, PageIndex, e.PageSize, 2);
  //   }
  // }

  // change2({ sender, event, Text }) {
  //   const value = this.i.objectTo || '';
  //   if (value === '') {
  //     if (this.i.category === '1') {
  //       // 加载物料或库存分类
  //       this.queryService.getUserPlantItemPageList(this.i.plantCode || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
  //         this.gridView2.data = res.data.content;
  //         this.gridView2.total = res.data.totalElements;
  //         if (res.data.totalElements === 1) {
  //           this.i.OBJECT_TO_Val = res.data.content.find(x => x.itemCode === Text).itemId;
  //         } else {
  //           this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
  //         }
  //       });
  //     }
  //   }
  // }

  // 加载物料或库存分类
  // public loadItems(plantCode: string, itemId: string, PageIndex: number, PageSize: number, type: number = 1) {
  //   // 加载物料或库存分类
  //   if (type === 1) {
  //     this.queryService.getUserPlantItemPageList(plantCode || this.CurPlant || '', itemId, '', PageIndex, PageSize).subscribe(res => {
  //       this.gridView1.data = res.data.content;
  //       this.gridView1.total = res.data.totalElements;
  //     });
  //   } else {
  //     this.queryService.getUserPlantItemPageList(plantCode || this.CurPlant || '', itemId, '', PageIndex, PageSize).subscribe(res => {
  //       this.gridView2.data = res.data.content;
  //       this.gridView2.total = res.data.totalElements;
  //     });
  //   }
  // }

  // public loadCat(value: string, PageIndex: number, PageSize: number, type: number = 1) {
  //   // 加载物料类别
  //   if (type === 1) {
  //     this.modelChangeTimeService.getCatPageList(value, PageIndex, PageSize).subscribe(res => {
  //       this.gridView1.data = res.data.content;
  //       this.gridView1.total = res.data.totalElements;
  //     });
  //   } else {
  //     this.modelChangeTimeService.getCatPageList(value, PageIndex, PageSize).subscribe(res => {
  //       this.gridView2.data = res.data.content;
  //       this.gridView2.total = res.data.totalElements;
  //     });
  //   }

  // }

  public IsOnly(name: string) {
    return this.MoTypeOptions.find(x => x.value === name);
  }

  close() {
    this.modal.destroy();
  }

  /**重置 */
  clear() {
    if (this.i.id !== null) {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
}
