/*
 * @Author: huth2
 * @contact: zhangweika@outlook.com
 * @Date: 2021-1-28 20:59:11
 * @LastEditors: huth2
 * @LastEditTime: 2021-1-28 20:59:11
 * @Note: ...
 */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { DemandOrderManagementReqlinetypedefaultsetEditComponent } from './edit/edit.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ReqLineTypeDefaultSetService } from '../../../modules/generated_module/services/reqlinetypedefaultset-service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { UiType } from 'app/modules/base_module/components/custom-form-query.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { QueryService } from './queryService';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-reqlinetypedefaultset',
  templateUrl: './reqlinetypedefaultset.component.html',
  providers: [QueryService]
})
export class DemandOrderManagementReqlinetypedefaultsetComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  expandForm: Boolean = true;
  public mySelection: any[] = [];
  regionoptions: any[] = [];
  plantoptions: any[] = [];
  lineoptions: any[] = [];
  mooptions: any[] = [];
  K: String;
  context = this;

  // 默认的事业部变量
  schedule: string = this.configservice.getActiveScheduleRegionCode();
  // 默认工厂
  plant: string = this.configservice.getPlantCode();


  public queryParams = {
    defines: [
      { field: 'scheduleRegion', title: '事业部', ui: { type: UiType.select, options: this.regionoptions, eventNo: 1 } },
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.plantoptions, eventNo: 2  } },
      { field: 'reqtype', title: '需求类型', ui: { type: UiType.select, options: this.lineoptions } },
      { field: 'motype', title: '工单类型', ui: { type: UiType.select, options: this.mooptions } }
    ],
    values: {
      scheduleRegion: this.schedule,
      plantCode: this.plant,
      reqtype: '',
      motype: ''
    }
  };

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
    { field: 'scheduleRegionCode', headerName: '事业部', menuTabs: ['filterMenuTab'] },
    { field: 'plantCode', headerName: '工厂', menuTabs: ['filterMenuTab'] },
    { field: 'reqType', headerName: '需求类型', menuTabs: ['filterMenuTab'] },
    { field: 'moType', headerName: '工单类型', menuTabs: ['filterMenuTab'] },
    { field: 'scheduleGroupCode', headerName: '非标计划组', menuTabs: ['filterMenuTab'] },
    { field: 'resourceCode', headerName: '非标资源', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab'] },
    { field: 'itemDesc', headerName: '物料描述', menuTabs: ['filterMenuTab'] },
    { field: 'mrpNetFlag', headerName: 'MRP净值标识', menuTabs: ['filterMenuTab'] }
  ];

  expColumns = [
    { field: 'scheduleRegionCode', title: '事业部', width: 200, locked: true },
    { field: 'plantCode', title: '工厂', width: 200, locked: true },
    { field: 'reqType', title: '需求类型', width: 200, locked: true },
    { field: 'moType', title: '工单类型', width: 200, locked: true },
    { field: 'scheduleGroupCode', title: '非标计划组', width: 200, locked: true },
    { field: 'resourceCode', title: '非标资源', width: 200, locked: true },
    { field: 'itemId', title: '物料ID', width: 200, locked: true },
    { field: 'itemDesc', title: '物料描述', width: 200, locked: true },
    { field: 'mrpNetFlag', title: 'MRP标识', width: 200, locked: true },
  ];

  constructor(
    public pro: BrandService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private commonquery: QueryService,
    private dataquery: ReqLineTypeDefaultSetService,
    private configservice: AppConfigService,
    private appTranslationService: AppTranslationService,
    private modalService: NzModalService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit() {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.plant = this.configservice.getPlantCode();
    this.LoadData();
  }

  LoadData() {
    this.dataquery.GetSchedule().subscribe(res => {
      res.data.forEach(element => {
        this.regionoptions.push({
          label: element.scheduleRegionCode,
          value: element.scheduleRegionCode
        });
      });
    });

    /* this.dataquery.GetSchedule(this.configservice.getUserName(), true).subscribe(res => {
       res.extra.extra.forEach(element => {
         this.regionoptions.push({
           label: element.scheduleRegionCode,
           value: element.scheduleRegionCode
         });
       });
     });
     */

    this.dataquery.GetLineType().subscribe(res => {
      res.data.forEach(element => {
        this.lineoptions.push({
          label: element.meaning,
          value: element.meaning
        });
      });
    });

    this.dataquery.GetMoType(this.configservice.getPlantCode()).subscribe(res => {
      res.data.forEach(element => {
        this.mooptions.push({
          label: element.moType,
          value: element.moType
        });
      });
    });

    this.dataquery.GetSchedule1(this.plant).subscribe(res => {
      this.schedule = res.data.scheduleRegionCode;
      this.dataquery.GetPlant(this.schedule).subscribe(res1 => {
        res1.data.forEach(element1 => {
          this.plantoptions.push({
            label: element1.plantCode,
            value: element1.plantCode
          });
        });
      });
      this.queryParams.values = {
        scheduleRegion: this.schedule,
        plantCode: this.plant,
        reqtype: null,
        motype: null
      };
      this.query();
    });
  }

  regionchange(value: any) {
    this.queryParams.values.plantCode = '';
    this.plantoptions.length = 0;
    this.dataquery.GetPlant(value).subscribe(res => {
      res.data.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  plantchange(value: any) {
    this.queryParams.values.motype = '';
    this.mooptions.length = 0;
    this.dataquery.GetMoType(value).subscribe(res => {
      res.data.forEach(element => {
        this.mooptions.push({
          label: element.moType,
          value: element.moType
        });
      });
    });
  }

  add(item?: any) {
    this.modal
      .static(
        DemandOrderManagementReqlinetypedefaultsetEditComponent,
        { i: { id: (item !== undefined ? item.id : null) } },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }

  httpAction = {
    url: this.dataquery.url,
    method: 'GET'
  };
  query() {
    super.query();
    this.commonquery.loadGridViewNew(this.httpAction, this.getParams(), this.context);
  }

  getParams(): any {
    const dto = {
      scheduleRegion: this.queryParams.values.scheduleRegion,
      plantCode: this.queryParams.values.plantCode,
      reqtype: this.isNull(this.queryParams.values.reqtype) ? '' : this.queryParams.values.reqtype,
      motype: this.isNull(this.queryParams.values.motype) ? '' : this.queryParams.values.motype
    };
    return dto;
  }
  clear() {
    this.dataquery.GetSchedule1(this.plant).subscribe(res => {
      this.schedule = res.data.scheduleRegionCode;
      this.dataquery.GetPlant(this.schedule).subscribe(res1 => {
        res1.data.forEach(element1 => {
          this.plantoptions.push({
            label: element1.plantCode,
            value: element1.plantCode
          });
        });
      });
      this.queryParams.values = {
        scheduleRegion: this.schedule,
        plantCode: this.plant,
        reqtype: null,
        motype: null
      };
    });
  }

  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;
  public export() {
    this.commonquery.exportAction(this.httpAction, this.getParams(), this.excelexport, this);
  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择要删除的数据!'));
      return;
    }
    this.modalService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.dataquery.RemoveBath(this.selectionKeys).subscribe(() => {
          this.msgSrv.success(this.appTranslationService.translate('删除成功'));
          this.query();
        });
      },
    });
  }

  remove(value: any) {
    this.dataquery.remove(value).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate('删除失败'));
      }
    });
  }

  selectKeys = 'id';
  // 行选中改变
  onSelectionChanged() {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
  onPageChanged({ pageIndex, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageIndex - 1);
    this.setLoading(false);
  }

}
