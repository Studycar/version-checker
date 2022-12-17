/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2018-12-25 13:59:14
 * @LastEditors: Zwh
 * @LastEditTime: 2019-07-19 10:13:39
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { SopSupplyRestrainCapService } from 'app/modules/generated_module/services/SopSupplyRestrainCapService';
import { SopSupplyRestrainCapViewEditComponent } from '../view-edit/view-edit.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sop-supply-restrain-cap-view',
  templateUrl: './view.component.html',
})
export class SopSupplyRestrainCapViewComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  i: any;

  constructor(
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private commonquery: CommonQueryService,
    private dataService: SopSupplyRestrainCapService,
    private modalService: NzModalService,
    private apptranslate: AppTranslationService,
    private appconfig: AppConfigService
  ) {
    super({ appTranslationSrv: apptranslate, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.gridHeight = 303;
  }

  public columns = [
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
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'plantCode', headerName: '工厂' },
    { field: 'itemCode', headerName: '物料编码' },
    { field: 'descriptions', headerName: '物料描述' }
  ];

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }

  // 页码切换
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }

  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.query();
  }

  httpAction = {
    url: '/api/sop/sopsupplyrestraincap/queryView',
    method: 'GET',
    data: null
  };

  query() {
    super.query();
    this.commonQuery();
  }

  commonQuery() {
    this.commonquery.loadGridViewNew(this.httpAction, this.getQueryParams(), this);
  }

  getQueryParams(): {[key: string]: any} {
    return {
      restrainCapId: this.i.id,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  remove(item: any) {
    this.dataService.deleteView(item.id).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.apptranslate.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.apptranslate.translate(res.msg));
      }
    });
  }

  add(item?: any) {
    this.modal
      .static(
        SopSupplyRestrainCapViewEditComponent,
        { i: { id: (item !== undefined ? this.i.id : null), plantCode: this.i.plantCode, vendorNumber: this.i.vendorNumber } },
        'lg'
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        });
  }
}
