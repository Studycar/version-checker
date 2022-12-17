import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
// import { LookupCodeManageService } from '../../../../modules/generated_module/services/lookup-code-manage-service';
import { SubstituteStrategyDetailService } from '../substitute-strategy-detail.service';
import { deepCopy } from '@delon/util';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { QueryService } from '../../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'add-substitute-strategy-info',
  templateUrl: './add-substitute-strategy-info.component.html',
  providers: [QueryService],
})
export class AddSubstituteStrategyInfoComponent implements OnInit {
  title: String = '编辑信息';
  // languageOptions: any[] = [];
  // applicationOptions: any[] = [];
  plantOptions :any[] = [];
  mixUseOptions : any[] = [];
  substituteStrategyOptions: any[] = [];//替代策略值集
  useStrategyOptions: any[] = [];//消耗策略值集
  buyStrategyOptions: any[] = [];//采购策略值集
  isUsePriority: false;//消耗策略是优先级
  isPercentBalance: false;//采购策略是比例均衡
  usePriority: string; //消耗优先级
  buyPercent: string;  //采购策略
  useAge: string;//单位用量
  //substituteStrategy: any;
  record: any = {};
  item_required = false;
  customer_required = false;
  project_required = false;
  i: any;
  iClone: any;
  // CurLng: any;
  isModify = false;
  @ViewChild('sf', {static: true}) sf: SFComponent;
  // schema: SFSchema = {
  //   properties: {
  //     ITEM_CODE: {
  //       type: 'string',
  //       title: 'BOM装配件'
  //     },
  //     MEANING: {
  //       type: 'string',
  //       title: '编码名称'
  //     },
  //     APPLICATIONCODE: {
  //       type: 'string', title: '应用模块', ui: 'select',
  //       enum: []
  //     },
  //     DESCRIPTION: {
  //       type: 'string',
  //       title: '描述',
  //     },
  //     LNG: {
  //       type: 'string',
  //       title: '语言',
  //       ui: 'select',
  //       enum: []
  //     }
  //   },
  //   required: ['TYPECODE', 'APPLICATIONCODE', 'LNG'],
  // };
  // ui: SFUISchema = {
  //   '*': {
  //     spanLabelFixed: 120,
  //     grid: { span: 24 },
  //   },
  // };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private SubstituteStrategyDetailService: SubstituteStrategyDetailService
  ) { }

  ngOnInit(): void {
    if (this.i.ID == null) {
      this.title = '新增策略值';
      // this.i.LNG = this.CurLng; // 给当前默认的登录语言
      
      if(this.i.SUBSTITUTE_STRATEGY==='按BOM'||this.i.SUBSTITUTE_STRATEGY==='按客户+BOM')
      {
          this.item_required = true;
      }
      else
      {
          this.item_required = false;
      }
      if(this.i.SUBSTITUTE_STRATEGY==='按客户'||this.i.SUBSTITUTE_STRATEGY==='按客户+BOM')
      {
          this.customer_required = true;
      }
      else
      {
          this.customer_required = false;
      }
      if(this.i.SUBSTITUTE_STRATEGY==='按项目')
      {
          this.project_required = true;
      }
      else
      {
          this.project_required = false;
      }
    } else {
      // this.schema.properties.ITEM_CODE.readOnly = true;
      // this.schema.properties.MEANING.readOnly = true;
      // this.schema.properties.APPLICATIONCODE.readOnly = true;
      // this.schema.properties.LNG.readOnly = true;
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    }
    this.loadData();
  }

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料',
      width: '100'
    },
    {
      field: 'DESCRIPTIONS_CN',
      title: '物料描述',
      width: '100'
    }
  ];
  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.i.PLANT_CODE, e.SearchValue, PageIndex, e.PageSize);
  }
  change1({ sender, event, Text }) {
    const value = this.i.ITEM_ID || '';
    if (value === '') {
      // 加载物料
      this.SubstituteStrategyDetailService.GetBomItemPageList(this.i.PLANT_CODE || '', Text || '', '', 1, sender.PageSize,this.i.SUBSTITUTE_CODE,this.i.SUBSTITUTE_GROUP,this.usePriority,this.buyPercent,this.useAge).subscribe(res => {
        this.gridView1.data = res.Result;
        this.gridView1.total = res.TotalCount;
        if (res.TotalCount === 1) {
          this.i.ITEM_ID = res.Result.find(x => x.ITEM_CODE === Text).ITEM_ID;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
        }
      });
    }
  }
  // 加载物料
  public loadItems(PLANT_CODE: string, ITEM_CODE: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.SubstituteStrategyDetailService.GetBomItemPageList(PLANT_CODE || '', ITEM_CODE || '', '', PageIndex, PageSize,this.i.SUBSTITUTE_CODE,this.i.SUBSTITUTE_GROUP,this.usePriority,this.buyPercent,this.useAge).subscribe(res => {
      this.gridView1.data = res.Result;
      this.gridView1.total = res.TotalCount;
    });
  }

  gridView2: GridDataResult = {
    data: [],
    total: 0
  };
  columns2: any[] = [
    {
      field: 'CUSTOMER_NAME',
      title: '客户名称',
      width: '100'
    },
    {
      field: 'CUSTOMER_DESC',
      title: '客户描述',
      width: '100'
    }
  ];
  search2(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems2(this.i.PLANT_CODE, e.SearchValue, PageIndex, e.PageSize);
  }
  change2({ sender, event, Text }) {
    const value = this.i.CUSTOMER_DESC || '';
    if (value === '') {
      // 加载客户
      this.SubstituteStrategyDetailService.GetUserPlantCustomerPageList(this.i.PLANT_CODE || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
        this.gridView2.data = res.Result;
        this.gridView2.total = res.TotalCount;
        if (res.TotalCount === 1) {
          this.i.CUSTOMER_DESC = res.Result.find(x => x.CUSTOMER_NAME === Text).CUSTOMER_DESC;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('客户无效'));
        }
      });
    }
  }
  // 加载客户
  public loadItems2(PLANT_CODE: string, CUSTOMER_NAME: string, PageIndex: number, PageSize: number) {
    // 加载客户
    this.SubstituteStrategyDetailService.GetUserPlantCustomerPageList(PLANT_CODE || '', CUSTOMER_NAME || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridView2.data = res.Result;
      this.gridView2.total = res.TotalCount;
    });
  }


  loadData() {
    // this.schema.properties.APPLICATIONCODE.enum = this.applicationOptions;
    // this.schema.properties.LNG.enum = this.languageOptions;
    /* 初始化应用程序 */
    /*
    this.applicationOptions.length = 0;
    this.lookupCodeManageService.GetAppliaction().subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationOptions.push({
          label: d.APPLICATION_NAME,
          value: d.APPLICATION_ID
        });
      });
      this.schema.properties.APPLICATION_CODE.enum = this.applicationOptions;
      this.sf.refreshSchema();
    });
    */

    /*初始化编辑数据*/
    /*
    if (this.i.ID != null) {
      this.lookupCodeManageService.Get(this.i.ID).subscribe(resultMes => {
        if (resultMes.Extra !== undefined && resultMes.Extra.length > 0) {
          const d = resultMes.Extra[0];
          // this.i = d;
          this.i = {
            ID: d.ID,
            TYPECODE: d.TYPECODE,
            MEANING: d.MEANING,
            APPLICAIONID: Number(d.APPLICATIONID),
            DESCRIPTION: d.DESCRIPTION,
            LNG: d.LNG
          };
        }
      });
    }
    */
  }
  save(value: any) {
    if (this.i.ID != null) {
      value.ID = this.i.ID;
    } else {
      value.ID = null;
    }
    if (this.i.ID === null) {
      this.SubstituteStrategyDetailService.saveStrategyInfo(this.i).subscribe(res => {
        if (res.Success === true) {
          this.msgSrv.success(res.Message || '保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.Message);
        }
      });
    } else {
      this.SubstituteStrategyDetailService.updateStrategyInfo(this.i).subscribe(res => {
        if (res.Success === true) {
          this.msgSrv.success(res.Message || '更新成功');
          this.modal.close(true);

        } else {
          this.msgSrv.error(res.Message);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
