import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { EditService } from '../edit.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { ApiRegisterViewImportComponent } from './import/import.component';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'api-register-view',
  templateUrl: './view.component.html',
  styles: [`
  .operatable-area {
    margin-bottom: 16px;
  }
`],
  providers: [EditService]
})
export class ApiRegisterViewComponent extends CustomBaseContext implements OnInit {
  // 接口ID
  apiId = '';
  apiCode = '';
  apiTable = '';
  // 表格height
  gridHeight: any = 350;
  typeOptions: any[] = [];
  fieldOptions: any[] = [];
  tempDataItem: any = {
    code: '',
    name: '',
    type: '1',
    remark: '',
    tableField: '',
    notNull: 'N',
    boolNotNull: false
  };
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;
  @ViewChild('customTemplate2', { static: true }) customTemplate2: TemplateRef<any>;
  @ViewChild('customTemplate3', { static: true }) customTemplate3: TemplateRef<any>;
  @ViewChild('customTemplate4', { static: true }) customTemplate4: TemplateRef<any>;

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 60, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'code', headerName: '*字段编码', editable: true, width: 200, menuTabs: ['filterMenuTab'] },
    { field: 'name', headerName: '*字段名称', editable: true, width: 200, menuTabs: ['filterMenuTab'] },
    {
      field: 'type', headerName: '*字段类型', width: 150, editable: true,
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      },
      // valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab']
    },
    {
      field: 'boolNotNull', headerName: '*是否必填', width: 100, editable: true,
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      },
      // valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab']
    },
    {
      field: 'tableField', headerName: '接口表字段', width: 200, editable: true,
      cellRendererFramework: CustomOperateCellRenderComponent,
      cellRendererParams: {
        customTemplate: null,
      },
      // valueFormatter: 'ctx.optionsFind(value,1).label',
      menuTabs: ['filterMenuTab']
    },
    // { field: 'remark', headerName: '描述', editable: true, tooltipField: 'remark', menuTabs: ['filterMenuTab'] },
    { field: 'creationDate', headerName: '创建时间', menuTabs: ['filterMenuTab'] },
    { field: 'createdBy', headerName: '创建人', menuTabs: ['filterMenuTab'] },
    { field: 'lastUpdateDate', headerName: '更新时间', menuTabs: ['filterMenuTab'] },
    { field: 'lastUpdatedBy', headerName: '更新人', menuTabs: ['filterMenuTab'] }
  ];
  constructor(
    private modal: NzModalRef,
    private modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public pro: BrandService,
    public editService: EditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private appGridStateService: AppGridStateService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate1;
    this.columns[3].cellRendererParams.customTemplate = this.customTemplate2;
    this.columns[4].cellRendererParams.customTemplate = this.customTemplate3;
    this.columns[5].cellRendererParams.customTemplate = this.customTemplate4;
    this.editService.GetLookupByTypeRef('API_ENTITY_TYPE', this.typeOptions);
    this.editService.getPiTableFields(this.apiTable).subscribe(result => {
      this.fieldOptions.length = 0;
      result.data.forEach(d => {
        this.fieldOptions.push({
          label: d,
          value: d,
        });
      });
    });

    this.query();
  }

  httpAction = { url: this.editService.queryEntityUrl, method: 'GET' };
  public query() {
    super.query();
    this.queryCommon();
  }
  private queryCommon() {
    this.editService.loadGridViewNew(this.httpAction, { apiCode: this.apiCode }, this.context);
  }
  public import() {
    this.modalHelper
      .static(ApiRegisterViewImportComponent, { apiCode: this.apiCode }, 'md')
      .subscribe(() => this.queryCommon());
  }
  expColumns = this.columns;
  expColumnsOptions: any[] = [{ field: 'type', options: this.typeOptions }];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    }, 100);
  }
  // 添加
  public add() {
    const addDataItem = this.clone(this.tempDataItem);
    this.gridData = [...this.gridData, addDataItem];
  }
  // 移除
  public remove(dataItem: any) {
    const deleteIndex = this.gridData.indexOf(dataItem);
    if (deleteIndex > -1) {
      this.gridData.splice(deleteIndex, 1);
    }
    this.gridData = this.clone(this.gridData);
  }
  public save() {
    this.gridData.forEach(x => { x.notNull = x.boolNotNull === true ? 'Y' : 'N'; x.apiId = this.apiId; x.apiCode = this.apiCode; });
    this.editService.saveEntitys(this.gridData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.typeOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  close() {
    this.modal.destroy();
  }

  public generate() {
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('已生成的DTO代码将被覆盖,确定要生成吗？'),
      nzOnOk: () => {
        this.editService.generateDto(this.apiCode).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('生成成功！'));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }
}
