import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { ScheduleStopProductionDetailEditComponent } from './edit/edit.component';
import { ScheduleStopProductionService } from '../schedule-stop-production.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'schedule-stop-production-detail',
  templateUrl: './detail.component.html',
  providers: [ScheduleStopProductionService]
})
export class ScheduleStopProductionDetailComponent extends CustomBaseContext implements OnInit {

  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  mainRecord: any;

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
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'attributeGroup', headerName: '属性组' },
    { field: 'resourcename', headerName: '属性组描述' }
  ];

  constructor(
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private editService: ScheduleStopProductionService,
    private confirmationService: NzModalService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.gridHeight = 303;
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;

    this.query();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    const dto = this.getQueryParams(false);
    const httpAction = { url: this.editService.QueryGroupDetailUrl, method: 'GET' };
    this.editService.loadGridViewNew(httpAction, dto, this.context);
    //this.editService.loadGridView({ url: this.editService.QueryGroupDetailUrl, method: 'POST' }, dto, this.context);
  }

  private getQueryParams(IsExport: boolean) {

    console.log(this.mainRecord);
    const dto = {
      plantcode: this.mainRecord.plantCode,
      resourcecodes: [this.mainRecord.resourceCode],
      isExport: IsExport,
      pageIndex: this._pageNo,
      pageSize: this._pageSize
    };
    return dto;
  }
  // 新增、编辑
  add(item?: any) {
    this.modal.static(ScheduleStopProductionDetailEditComponent, { originDto: item !== undefined ? item : null, mainRecord: this.mainRecord }, 'lg')
      .subscribe((value) => {
        if (value) {
          this.queryCommon();
        }
      });
  }

  // 删除
  public remove(item: any) {
    this.editService.DeleteGroup([item.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.queryCommon();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  // 批量删除
  removeBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.DeleteGroup(this.selectionKeys).subscribe(() => {
          this.msgSrv.success('删除成功');
          this.queryCommon();
        });
      },
    });
  }

  selectBy = 'id';
  // 行选中改变
  onSelectionChanged(event: any) {
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
