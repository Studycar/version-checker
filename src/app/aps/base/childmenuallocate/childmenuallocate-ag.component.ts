import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { MenuManagerManageService } from '../../../modules/generated_module/services/menu-manager-manage-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { ChildMenuQueryService } from './query.service';
import { BrandService } from 'app/layout/pro/pro.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-childmenuallocate-ag',
  templateUrl: './childmenuallocate-ag.component.html',
  providers: [ChildMenuQueryService]
})
export class BaseChildmenuallocateAgComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @Input()
  public p: any;
  menuTypeOptions: any[] = [];
  menuGroupOptions: any[] = [];

  public columns = [
    { field: 'menuName', headerName: '子菜单', menuTabs: ['filterMenuTab'] },
    { field: 'functionName', headerName: '功能', menuTabs: ['filterMenuTab'] },
    {
      field: 'menuType', headerName: '菜单类型',
      valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab']
    },
    {
      field: 'menuGroupId', headerName: '菜单组',
      valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab']
    }
  ];
  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private menuManagerManageService: MenuManagerManageService,
    public queryService: ChildMenuQueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
    this.gridHeight = 265;
  }

  ngOnInit() {
    this.menuManagerManageService.GetMenuGroups(this.p.language).subscribe(result => {
      result.Extra.forEach(d => {
        this.menuGroupOptions.push({
          label: d.MENU_GROUP_NAME,
          value: d.MENU_GROUP_ID,
        });
      });
    });
    this.queryService.GetLookupByTypeRef('FND_MENU_TYPE', this.menuTypeOptions);
    this.query();
  }

  httpAction = { url: this.queryService.queryChildUrl, method: 'GET', data: false };
  public query() {
    this.queryService.loadGridViewNew(this.httpAction, { parentMenuId: this.p.menuId, language: this.p.language }, this.context);
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.menuTypeOptions;
        break;
      case 2:
        options = this.menuGroupOptions;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  expData: any[] = [];
  expColumns = this.columns;
  expColumnsOptions: any[] = [
    { field: 'menuType', options: this.menuTypeOptions },
    { field: 'menuGroupId', options: this.menuGroupOptions }
  ];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    super.export();
    // this.queryService.export(this.httpAction, { parentMenuId: this.p.menuId, language: this.p.language }, this.excelexport);
    setTimeout(() => {
      this.excelexport.export(this.gridData);
    });
  }

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
