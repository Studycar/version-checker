import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { RequestGroupsService } from '../../../modules/generated_module/services/request-groups-service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ConcurrentRequestRequestGroupsViewComponent } from './view/view.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { QueryService } from 'app/aps/base/baseparameter/queryService';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-request-groups-detail',
  templateUrl: './request-groups-detail.component.html',
  providers: [QueryService]
})
export class ConcurrentRequestRequestGroupsDetailComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  i: any = {};

  public columns22 = [
    {
      colId: 0, field: '', headerName: '操作', width: 50, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: { template: this.headerTemplate },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null        // Complementing the Cell Renderer parameters  
      }
    },
    { field: 'requestUnitTypeName', headerName: '类型', tooltipField: 'requestUnitTypeName', menuTabs: ['filterMenuTab'] },
    { field: 'displayName', headerName: '名称', tooltipField: 'displayName', menuTabs: ['filterMenuTab'] },
    { field: 'applicationName', headerName: '应用', tooltipField: 'applicationName', menuTabs: ['filterMenuTab'] }
  ];

  public gridView: GridDataResult = { data: [], total: 0 };

  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public queryService: QueryService,
    private requestGroupsService: RequestGroupsService,
    appTranslationService: AppTranslationService) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns22);
  }


  ngOnInit() {
    this.columns22[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
  }

  public query() {
    super.query();
    const httpAction = { url: this.requestGroupsService.URL_Prefix + 'qureyBaseRequestGroupUnits', method: 'GET' };
    this.queryService.loadGridViewNew(httpAction, {
      requestGroupId: this.i.id, pageIndex: this.lastPageNo,
      pageSize: this.lastPageSize
    }, this.context);
  }

  add() {
    const Param = {
      opertype: '新增',
      IsRefresh: false,
      obj: { requestGroupId: this.i.id }
    };
    this.modal.static(ConcurrentRequestRequestGroupsViewComponent, { Param: Param }).subscribe(() => {
      this.query();
    });
  }

  remove(obj: any) {
    this.requestGroupsService.deleteBaseRequestGroupUnits(obj.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  /**页码切换 */
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.query();
    } else {
      this.setLoading(false);
    }
  }
}
