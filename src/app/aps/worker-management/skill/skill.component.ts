import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { SkillService } from './query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { WorkerManagementSkillEditComponent } from './edit/edit.component';

@Component({
  selector: 'worker-management-skill',
  templateUrl: './skill.component.html',
  providers: [SkillService]
})
export class WorkerManagementSkillComponent extends CustomBaseContext
  implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  public selectBy = 'Id';
  public optionListSkill: any[] = [];
  public optionListPlant: any[] = [];
  public yesNoList: any[] = [];
  public queryParams = {
    defines: [
      {
        field: 'plantCode',
        title: '工厂',
        ui: {
          type: UiType.select,
          options: this.optionListPlant,
          ngModelChange: this.changePlant
        },
      },
      {
        field: 'skillFrom',
        title: '技能自',
        ui: {
          type: UiType.select,
          options: this.optionListSkill
        },
      },
      {
        field: 'skillTo',
        title: '技能至',
        ui: {
          type: UiType.select,
          options: this.optionListSkill
        },
      },
      {
        field: 'enableFlag',
        title: '是否有效',
        ui: {
          type: UiType.select,
          options: this.yesNoList
        },
      },
    ],
    values: {
      plantCode: this.appConfigService.getPlantCode(),
      skillFrom: '',
      skillTo: '',
      enableFlag: 'Y'
    },
  };

  public columns = [
    {
      colId: 0,
      field: '',
      headerName: '操作',
      width: 80,
      pinned: this.pinnedAlign,
      lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
      cellRendererFramework: CustomOperateCellRenderComponent, // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null, // Complementing the Cell Renderer parameters
      },
    },
    {
      field: 'plantCode',
      width: 100,
      headerName: '工厂编码',menuTabs: ['filterMenuTab']
    },
    {
      field: 'descriptions',
      width: 200,
      headerName: '工厂名称',menuTabs: ['filterMenuTab']
    },
    {
      field: 'skillName',
      width: 250,
      headerName: '技能名称',menuTabs: ['filterMenuTab']
    },
    {
      field: 'skillCode',
      width: 150,
      headerName: '技能编码',menuTabs: ['filterMenuTab']
    },
    {
      field: 'enableFlag',
      width: 100,
      valueFormatter: 'ctx.optionsFind(value,3).label',
      headerName: '是否有效',menuTabs: ['filterMenuTab']    
    },
  ];
  constructor(public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: SkillService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private exportImportService: ExportImportService
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.loadInitData();
    this.query();
  }
  // 初始数据加载
  private loadInitData() {
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.yesNoList);
    // 工厂
    this.commonQueryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.optionListPlant.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });
    this.changePlant();
  }
  // 获取查询参数
  private getQueryParamsValue(): any {
    return {
      plantCode: this.queryParams.values.plantCode,
      skillFrom: this.queryParams.values.skillFrom,
      skillTo: this.queryParams.values.skillTo,
      enableFlag: this.queryParams.values.enableFlag,
      QueryParams: { PageIndex: this._pageNo, PageSize: this._pageSize }
    };
  }
  httpAction = { url: this.editService.queryUrl, method: 'GET' };

  // 切换工厂
  changePlant() {
    this.queryParams.values.skillFrom = null;
    this.queryParams.values.skillTo = null;
    this.optionListSkill.length = 0;
    this.editService.GetSkillList({ plantCode: this.queryParams.values.plantCode }).subscribe(result => {
      result.data.content.forEach(d => {
        this.optionListSkill.push({
          label: d.skillCode +' '+ d.skillName,
          value: d.skillCode,
        });
      });
    });
  }

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.commonQueryService.loadGridView(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
    );
  }
    /**
   * 数据映射字段匹配
   * @param {string} value 字段的值
   * @param {number} optionsIndex 对应字典
   * */
  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 3:
        options = this.yesNoList;
        break;
    }
    return options.find(x => x.value === value.toString());
  }



  // 新增 or 编辑
  public add(item?: any) {
    this.modal
      .static(
        WorkerManagementSkillEditComponent,
        {
          i: item !== undefined ? item : { Id: null }
        },
        'lg',
      )
      .subscribe(value => {
        if (value) {
          this.query();
        }
      });
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions = [];

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public export() {
    super.export();
    this.editService.exportAction({ url: this.editService.exportUrl, method: 'POST' }, this.getQueryParamsValue(), this.excelexport, this.context);
  }
  public clear() {
    this.queryParams.values = {
      plantCode: this.appConfigService.getPlantCode(),
      skillFrom: null,
      skillTo: null,
      enableFlag: 'Y'
    };
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.queryCommon();
    } else {
      this.setLoading(false);
    }
  }
}
