import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { ReplaceItemQuotaService } from '../replace-item-quota.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'replace-item-quota-import',
  templateUrl: './import.component.html',
  providers: [ReplaceItemQuotaService],
})
export class ReplaceItemQuotaImportComponent implements OnInit {
  impColumns = {
    columns: ['工厂','项目号','替代组','绑定组合','物料编码','物料描述','消耗优先级','配额','配额生效时间','配额失效时间'],
    paramMappings: [
      {
        field: 'plantCode',
        title: '工厂',
        width: 100,
        columnIndex: 1,
        constraint: { notNull: false },
      },
      {
        field: 'projectNumber',
        title: '项目号',
        width: 100,
        columnIndex: 1,
        constraint: { notNull: false },
      },
      {
        field: 'replacementGroup',
        title: '替代组',
        width: 100,
        columnIndex: 1,
        constraint: { notNull: false },
      },
      {
        field: 'combinationGroup',
        title: '绑定组合',
        width: 100,
        columnIndex: 1,
        constraint: { notNull: false },
      },
      {
        field: 'itemId',
        title: '物料ID',
        width: 100,
        columnIndex: 1,
        constraint: { notNull: false },
      },
      {
        field: 'itemCode',
        title: '物料编码',
        width: 100,
        columnIndex: 1,
        constraint: { notNull: false },
      },
      {
        field: 'itemDecs',
        title: '物料描述',
        width: 100,
        columnIndex: 1,
        constraint: { notNull: false },
      },
      {
        field: 'consumePriority',
        title: '消耗优先级',
        width: 100,
        columnIndex: 1,
        constraint: { notNull: false },
      },
      {
        field: 'allocationPercent',
        title: '配额',
        width: 100,
        columnIndex: 1,
        constraint: { notNull: false },
      },
      {
        field: 'effectivityDate',
        title: '配额生效时间',
        width: 100,
        columnIndex: 1,
        constraint: { notNull: false },
      },
      {
        field: 'disableDate',
        title: '配额失效时间',
        width: 100,
        columnIndex: 1,
        constraint: { notNull: false },
      },
    ],
  };
  expData: any[] = [];
  expColumns = [
    {
      field: 'plantCode',
      title: '工厂',
      width: 100,
      locked: false,
    },
    {
      field: 'projectNumber',
      title: '项目号',
      width: 100,
      locked: false,
    },
    {
      field: 'replacementGroup',
      title: '替代组',
      width: 100,
      locked: false,
    },
    {
      field: 'combinationGroup',
      title: '绑定组合',
      width: 100,
      locked: false,
    },
    {
      field: 'itemId',
      title: '物料编码',
      width: 100,
      locked: false,
    },
    {
      field: 'itemDecs',
      title: '物料描述',
      width: 100,
      locked: false,
    },
    {
      field: 'consumePriority',
      title: '消耗优先级',
      width: 100,
      locked: false,
    },
    {
      field: 'allocationPercent',
      title: '配额',
      width: 100,
      locked: false,
    },
    {
      field: 'effectivityDate',
      title: '配额生效时间',
      width: 100,
      locked: false,
    },
    {
      field: 'disableDate',
      title: '配额失效时间',
      width: 100,
      locked: false,
    },
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    this.ReplaceItemQuotaService.imports(tempData).subscribe(res => {
      if (res.code === 200) {
        console.log('输出信息：' + res.msg);
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        /*if (res.data != null && res.data.length > 0) {
            this.excelexport.export(res.data);
          }*/
        this.modal.close();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public ReplaceItemQuotaService: ReplaceItemQuotaService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
  ) {}

  ngOnInit(): void {}

  close() {
    this.modal.destroy();
  }
}
