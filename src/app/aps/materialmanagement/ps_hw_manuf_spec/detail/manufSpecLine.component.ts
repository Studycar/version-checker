import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';

@Component({
  selector: 'ps-manuf-spec-line',
  templateUrl: './manufSpecLine.component.html',
  providers: [QueryService]
})
export class PsHwManufSpecLineComponent extends CustomBaseContext implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
  ) {
    super({
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    })
  }

  loading = false;
  i: any;

  // 初始化
  ngOnInit(): void {
    this.query();
  }

  columns = [
    { field:'manufLineId', width: 120, headerName: '产线标识',},
    { field:'manufLineName', width: 120, headerName: '产线名称',},
    { field:'manufLineCode', width: 120, headerName: '产线编码',},
    { field:'manufSpecId', width: 120, headerName: '制造规范标识',},
    { field:'tenantId', width: 120, headerName: '租户标识',},
    { field:'note', width: 120, headerName: '备注',},
    { field:'listOrder', width: 120, headerName: '排序',},
    { field:'isRolling', width: 120, headerName: '是否轧制产线',},
    { field:'resourceId', width: 120, headerName: '资源标识',},
    { field:'factoryCode', width: 120, headerName: '工厂',},
    { field:'createdBy', width: 120, headerName: '创建人',},
    { field:'creationDate', width: 120, headerName: '创建时间',},
    { field:'lastUpdatedBy', width: 120, headerName: '修改人',},
    { field:'lastUpdateDate', width: 120, headerName: '修改时间',},
  ]

  httpAction = { url: this.queryService.queryManufSpecUrl, method: 'GET' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
    );
  }

  private getQueryParamsValue(): any {
    return {
      manufSpecId: this.i.manufSpecId,
      plantCode: this.i.plantCode,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
  }

  // 保存
  save(value: any) {
    this.modal.close(true);
  }

  // 关闭
  close() {
    this.modal.destroy();
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