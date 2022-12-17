import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult, RowArgs } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
// import { PocSubstituteStrategyDetailEditService } from '../../edit.service';
// import { SubstituteStrategyDetail } from '../../model';
import { map } from 'rxjs/operators/map';
import { NzMessageService } from 'ng-zorro-antd';
import { QueryService } from '../../query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { SubstituteStrategyDetailService } from '../substitute-strategy-detail.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
// import { AgDatePickerComponent } from './ag-date-picker.component';
// import { AgFormCellComponent } from './ag-form-cell.component';
import { Column, GridReadyEvent, RowNode } from 'ag-grid-community';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AddSubstituteStrategyInfoComponent } from './add-substitute-strategy-info.component';
// import { AddSubstituteStrategyComponent } from './add-substitute-strategy/add-substitute-strategy.component';
// import { AddDetailSubstituteStrategyComponent } from './add-substitute-strategy/add-detail-substitute-strategy.component';
/**
 * 快速编码明细
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'substitute-strategy-info',
  templateUrl: './substitute-strategy-info.component.html',
  styles: [`
    .operatable-area {
      margin-bottom: 16px;
    }
  `],
  // providers: [
  //   PocSubstituteStrategyDetailEditService,
  // ],
})
export class SubstituteStrategyInfoComponent extends CustomBaseContext implements OnInit {
  // @Input() private code: string;
  // @Input() private lookupTypeId: string;
  // @Input() private lng: string;
  // @Input() private LngOptions: any[];

//   @ViewChild('customTemplate5', { static: true }) customTemplate5: TemplateRef<
//   any
// >;
  @Input() private plantCode: string;
  @Input() private substituteCode: string;
  @Input() private strategyGroup: string;
  @Input() private substituteStrategy: string;
  @Input() private useStrategy: string;//消耗策略
  @Input() private buyStrategy: string;//消耗策略
  @Input() private usePriority: string; //消耗优先级
  @Input() private buyPercent: string; //采购策略
  @Input() private useAge:string;//单位用量

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  view2: Observable<GridDataResult>;
  gridState: State = {
    sort: [],
    skip: 0,
    take: 15,
  };
  applications: any[] = [];
  changes: any = {};
  updateRowData: RowNode[] = [];
  // 表格height
  gridHeight: any = 300;
  // 列定义
  columnsDef = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      type: 'nonEditableColumn',
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: this.customTemplate,
      },
    },
    { field: 'SUBSTITUTE_GROUP', headerName: '替代组', width: 100 },
    { field: 'ITEM_CODE', headerName: 'BOM装配件', width: 100 },
    { field: 'CUSTOMER_NAME', headerName: '客户', width: 150 },
    { field: 'PROJECT_NUMBER', headerName: '项目号', width: 150 },
    { field: 'EFFECTIVITY_DATE', headerName: '生效日期', width: 120 },
    { field: 'DISABLE_DATE', headerName: '失效日期', width: 120 },
  ];

  // 扩展默认列定义
  defaultColDef = {
    ...this.defaultColDef,
    // editable: true,
  };
  agFormGroup: FormGroup;

  // 扩展默认gridOptions
  gridOptions = {
    ...this.gridOptions,
    defaultColDef: this.defaultColDef,
    stopEditingWhenGridLosesFocus: false,
  };

  /** 检验规则 */
  validatedRule: { [key: string]: { rule: any, tips: any } } = {};

  constructor(
    public pro: BrandService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private formBuilder: FormBuilder,
    private modal: ModalHelper,
    private SubstituteStrategyDetailService: SubstituteStrategyDetailService,
    private fb: FormBuilder,
    // public editService: PocSubstituteStrategyDetailEditService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    this.headerNameTranslate(this.columnsDef);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.columnsDef[0].cellRendererParams.customTemplate = this.customTemplate;
    // this.columnsDef[4].cellRendererParams.customTemplate = this.customTemplate5;

    this.agFormGroup = this.fb.group({});
    (<any>window).fb = this.agFormGroup;

    // this.editService.code = this.code;
    // this.editService.lng = this.lng;
    // this.editService.lookupTypeId = this.lookupTypeId;
    // this.editService.plantCode = this.plantCode;
    // this.editService.substituteCode = this.substituteCode;
    // this.view2 = this.editService.pipe(
    //   map(data => process(data, this.gridState)),
    // );
    // this.editService.read();
    this.SubstituteStrategyDetailService.init({
      // code: this.code,
      // lng: this.lng,
      // lookupTypeId: this.lookupTypeId,
      // LngOptions: this.LngOptions,
      plantCode: this.plantCode,
      substituteCode: this.substituteCode,
      strategyGroup: this.strategyGroup,
    });
    this.queryCode();
  }


  /**
   * 查询快码
   */
  queryCode() {
    this.SubstituteStrategyDetailService.getStrategyInfo(this.plantCode, this.substituteCode,this.strategyGroup).subscribe(res => {
      this.gridData = res.Result.slice();
      this.view = {
        data: [],
        total: res.TotalCount,
      };
    });
  }

  /** recode by jian.huang**/
  /**
   * 新增快码
   */
  addCode(item?: any) {
    // this.modal.static(AddSubstituteStrategyComponent, { editType: !item ? 'add' : 'edit', item }, 'lg').subscribe(() => {
    //   this.queryCode();
    // });
    this.modal.static(AddSubstituteStrategyInfoComponent, {
      i: {
        ID: null,//(item !== undefined ? (item.ID ? item.ID : (item.Id ? item.Id : null)) : null),
        PLANT_CODE: this.plantCode,//(item !== undefined ? item.PLANT_CODE : null),
        SUBSTITUTE_CODE: this.substituteCode,//(item !== undefined ? item.SUBSTITUTE_CODE : null),
        SUBSTITUTE_GROUP: this.strategyGroup,//(item !== undefined ? item.SUBSTITUTE_GROUP : null),
        CUSTOMER_NAME: (item !== undefined ? item.CUSTOMER_NAME : null),
        ITEM_CODE: (item !== undefined ? item.ITEM_CODE : null),
        PROJECT_NUMBER: (item !== undefined ? item.PROJECT_NUMBER : null),
        EFFECTIVITY_DATE: (item !== undefined ? item.EFFECTIVITY_DATE : null),
        DISABLE_DATE: (item !== undefined ? item.DISABLE_DATE : null),
        SUBSTITUTE_STRATEGY:this.substituteStrategy,
      },
      isUsePriority: this.useStrategy==='优先级',
      isPercentBalance: this.buyStrategy==='比例均衡',
      usePriority: this.usePriority,
      buyPercent: this.buyPercent,
      useAge: this.useAge,
      // plantOptions : this.plants,
      // mixUseOptions : this.mixUseOptions,
      // substituteStrategyOptions: this.substituteStrategyOptions,
      // useStrategyOptions: this.useStrategyOptions,
      // buyStrategyOptions: this.buyStrategyOptions,
    })
      .subscribe((value) => {
        if (value) {
          this.queryCode();
        }
      });
  }

  /**
   * 删除快码
   * @param item
   */
  deleteCode(item) {
    this.SubstituteStrategyDetailService.deleteStrategyInfo(item.ID).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.gridApi.updateRowData({ remove: [item] });
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  public addDetail(item?: any) {
     
  }


  /**
   * 页码切换
   * @param {any} pageNo
   * @param {any} pageSize
   */
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

  /**
   * grid准备事件
   */
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

}
