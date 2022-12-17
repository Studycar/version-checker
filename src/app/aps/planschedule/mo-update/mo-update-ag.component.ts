import { Component, OnInit, ViewChild } from '@angular/core';
import {
  CustomBaseContext,
  HeightArg,
} from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BasePsBomService } from 'app/modules/generated_module/services/base-psbom-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
import { MoManagerService } from 'app/modules/generated_module/services/mo-manager-service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { MoUpdateService } from './mo-update-services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-psbom-view-ag',
  templateUrl: './mo-update-ag.component.html',
  providers: [MoUpdateService, MoManagerService],
})
export class MoUpdateAgComponent extends CustomBaseContext implements OnInit {
  earliestStartTime: any = null;
  moNumbers: any[] = []; // 工单号
  isSavingData = false; // 标识正在保存数据
  typeoptions: any[] = []; // 工单状态

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public psbomservice: BasePsBomService,
    public moUpdateSrv: MoUpdateService,
    private momanager: MoManagerService,
    private commonQuery: CommonQueryService,
    public appService: AppConfigService
  ) {
    super({ appTranslationSrv: null, msgSrv: msgSrv, appConfigSrv: null });
  }

  public columns = [
    {
      field: 'MAKE_ORDER_NUM',
      headerName: '工单号',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'SCHEDULE_GROUP_CODE',
      headerName: '计划组',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'RESOURCE_CODE',
      headerName: '资源',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'EARLIEST_START_TIME',
      headerName: '最早开始时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'FIX_SCHEDULE_TIME',
      headerName: '固定时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'FPS_TIME',
      headerName: '首件开始时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'FPC_TIME',
      headerName: '首件完成时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'LPS_TIME',
      headerName: '末件开始时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'LPC_TIME',
      headerName: '末件完成时间',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'MAKE_ORDER_STATUS',
      headerName: '工单状态',
      menuTabs: ['filterMenuTab'],
      valueFormatter: 'ctx.getLookupText("MO_STATUS", value)',
    },
    {
      field: 'ITEM_CODE',
      headerName: '物料编码',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'ITEM_DESC',
      headerName: '物料描述',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'MO_QTY',
      headerName: '工单数量',
      menuTabs: ['filterMenuTab'],
    },
  ];

  ngOnInit(): void {
    const height: HeightArg = {
      height: 0,
      topMargin: 300,
      bottomMargin: 0,
    };
    this.setGridHeight(height);

    this.commonQuery
    .GetLookupByTypeLang('PS_MAKE_ORDER_TYPE', this.appService.getLanguage())
    .subscribe(res => {
      res.Extra.forEach(element => {
        this.typeoptions.push({
          label: element.meaning,
          value: element.lookupCode,
        });
      });
    });   
  }

  close() {
    this.modal.destroy();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  /** 获取查询参数 */
  GetQueryParams() {
    return { MoNumList: this.moNumbers };
  }

  /** 获取更新参数 */
  GetUpdateParams() {
    return {
      EarliestStartTime: this.earliestStartTime,
      MoNumList: this.moNumbers,
    };
  }

  queryCommon() {
    this.moUpdateSrv.loadGridView(
      this.moUpdateSrv.loadDataHttpAction,
      this.GetQueryParams(),
      this.context,
      res => {
        // 这里res.Success===false必须要这样判断，测试发现，成功的时候，返回的数据结构没有这个字段的
        if (res.Success === false) {
          this.msgSrv.error(res.Message || '获取数据出错');
        }
        return res;
      },
    );
  }

  /**执行保存 */
  doSave() {
    const paramObj = this.GetUpdateParams();
    this.isSavingData = true;
    this.moUpdateSrv.doUpdate(paramObj).subscribe(res => {
      this.isSavingData = false;
      if (res.Success) {
        this.msgSrv.success('修改成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  /** 获取快码的Text值 */
  public getLookupText(key: string, code: string): String {
    if (key === 'MO_STATUS') {
      const item = this.typeoptions.find(it => it.value === code);
      if (!this.isNull(item)) {
        return item.label;
      }
    }
    return code;
  }
}
