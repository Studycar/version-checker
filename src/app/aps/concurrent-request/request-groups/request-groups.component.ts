import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { RequestGroupsService } from '../../../modules/generated_module/services/request-groups-service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ConcurrentRequestRequestGroupsEditComponent } from './edit/edit.component';
import { ConcurrentRequestRequestGroupsDetailComponent } from './request-groups-detail.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { process } from '@progress/kendo-data-query';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-request-groups',
  templateUrl: './request-groups.component.html',
})
export class ConcurrentRequestRequestGroupsComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  queryParams = {
    defines: [],
    values: {}
  };

  public columns22 = [
    {
      colId: 0, field: '', headerName: '操作', width: 100, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    { field: 'requestGroupName', headerName: '名称', tooltipField: 'requestGroupName', menuTabs: ['filterMenuTab'] },
    { field: 'requestGroupCode', headerName: '代码', tooltipField: 'requestGroupCode', menuTabs: ['filterMenuTab'] },
    { field: 'applicationName', headerName: '应用', tooltipField: 'applicationName', menuTabs: ['filterMenuTab'] },
    { field: 'description', headerName: '说明', tooltipField: 'description', menuTabs: ['filterMenuTab'] },
  ];

  public gridData: any[] = [];

  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private requestGroupsService: RequestGroupsService,
    appTranslationService: AppTranslationService) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns22);
  }

  ngOnInit() {
    this.columns22[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
  }

  query() {
    this.setLoading(true);
    this.gridData.length = 0;
    this.requestGroupsService.queryBaseRequestGroups().subscribe(result => {
      if (result.data != null && result.data.length !== undefined && result.data.length > 0) {
        this.gridData = result.data;
        this.view = {
          data: process(this.gridData, {
            sort: this.gridState.sort,
            skip: 0,
            take: this.gridData.length,
            filter: this.gridState.filter,
          }).data,
          total: this.gridData.length,
        };
      }
      this.setLoading(false);
    },
      () => { },
      () => { }
    );
  }

  add() {
    const Param = {
      opertype: '新增',
      IsRefresh: false,
      obj: { id: null }
    };
    this.modal.static(ConcurrentRequestRequestGroupsEditComponent, { Param: Param }).subscribe(() => {
      if (Param.IsRefresh) {
        this.query();
      }
    });
  }

  edit(obj: any) {
    const Param = {
      IsRefresh: false,
      obj: obj
    };
    this.modal.static(ConcurrentRequestRequestGroupsEditComponent, { Param: Param }).subscribe(() => {
      if (Param.IsRefresh) {
        this.query();
      }
    });
  }

  detail(obj: any) {
    this.modal.static(ConcurrentRequestRequestGroupsDetailComponent, { i: obj }, 800, 450).subscribe();
  }

  remove(obj: any) {
    this.requestGroupsService.deleteBaseRequestGroups(obj.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
