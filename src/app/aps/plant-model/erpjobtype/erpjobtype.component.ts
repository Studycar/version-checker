import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { QueryService } from './query.service';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
// import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { map } from 'rxjs/operators';
import { State, process } from '@progress/kendo-data-query';
import { ERPJobTypeEditComponent } from './edit/edit.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { ERPJobTypeService } from '../../../modules/generated_module/services/erpjobtype-service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'erpjobtype',
  templateUrl: './erpjobtype.component.html',
  providers: [QueryService]
})
export class ERPJobTypeComponent extends CustomBaseContext implements OnInit {
  public selectBy = 'id';
  // public context = this;
  public CurLng: string;
  public CurSCH: string;
  public getCurSchReg: any[] = [];
  public MoTypeOptions: any[] = [];
  public SchedulRegionOptions: any[] = [];
  public PlantCodeOptions: any[] = [];
  autoadjustmentflags: any[] = [];
  itemStyle = { width: '180px' };
  expandForm = false;
  kendoHeight = document.body.clientHeight - 302;
  public enableOptions: any[] = [];
  public CurPlant: any; // 当前工厂
  public CurSch: any; // 当前事业部
  public queryParams = {
    defines: [
      { field: 'moType', title: '工单类型', ui: { type: UiType.select, options: this.MoTypeOptions } },
      { field: 'descriptions', title: '工单类型描述', ui: { type: UiType.string } },
      { field: 'plantCode', title: '工厂', ui: { type: UiType.select, options: this.PlantCodeOptions, eventNo: 1 } },
      { field: 'enabledFlag', title: '是否有效', ui: { type: UiType.select, options: this.enableOptions } },
      { field: 'standardFlag', title: '工单标准类型', ui: { type: UiType.select, options: this.autoadjustmentflags } },
    ],
    values: {
      moType: '',
      descriptions: '',
      plantCode: '',
      enabledFlag: '',
      standardFlag: ''
    }
  };
  public columns = [
    { field: 'scheduleRegionCode', title: '事业部编码', width: 130, locked: false, ui: { type: 'select', index: 1 } },
    { field: 'plantCode', title: '工厂', width: 100, locked: false },
    { field: 'moType', title: '生产订单类型', width: 200, locked: false },
    { field: 'standardFlag', title: '工单标准类型', width: 100, locked: false },
    { field: 'descriptions', title: '生产订单类型描述', width: 230, locked: false },
    { field: 'enabledFlag', title: '是否有效', width: 100, locked: false },
    { field: 'defaultFlag', title: '默认工单类型', width: 100, locked: false },
  ];

  expColumnsOptions: any[] = [
    { field: 'standardFlag', options: this.autoadjustmentflags },
    { field: 'enabledFlag', options: this.enableOptions },
    { field: 'defaultFlag', options: this.enableOptions },
  ];

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.autoadjustmentflags;
        break;
      case 2:
        options = this.enableOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  public clear() {
    this.queryParams.values = {
      moType: '',
      descriptions: '',
      plantCode: '',
      enabledFlag: '',
      standardFlag: ''
    };
    this.erpjobtypeservice.GetMo_Type(this.queryParams.values).subscribe(result => {
      result.data.forEach(d => {
        this.MoTypeOptions.push({
          label: d.moType,
          value: d.moType,
        });
      });
    });
  }

  constructor(private http: _HttpClient, private modal: ModalHelper,
    private erpjobtypeservice: ERPJobTypeService,
    public commonQueryService: QueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService }); }

  ngOnInit() {
    this.CurLng = this.appConfigService.getLanguage();
    this.CurPlant = this.appConfigService.getPlantCode();

    // 获取生产订单类型
    this.erpjobtypeservice.GetMo_Type(this.queryParams.values).subscribe(result => {
      result.data.forEach(d => {
        this.MoTypeOptions.push({
          label: d.moType,
          value: d.moType,
        });
      });
    });

    // 获取生产标准类型
    this.commonQueryService.GetLookupByType('PS_DISCRETE_JOB_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.autoadjustmentflags.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    /** 初始化 用户权限下的组织  下拉框*/
    /*
    this.commonQueryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.PlantCodeOptions.push({
          label: d.PLANT_CODE,
          value: d.PLANT_CODE,
        });
      });
    });
    */

    /** 初始化 事业部  下拉框*/
    /*
    this.SchedulRegionOptions.length = 0;
    this.erpjobtypeservice.GetScheduleRegion().subscribe(result => {
      result.Extra.forEach(d => {
        this.SchedulRegionOptions.push({
          label: d.DESCRIPTIONS,
          value: d.SCHEDULE_REGION_CODE,
        });

        if (this.queryParams.values.SCHEDULEREGIONCODE === ''  && this.queryParams.values.PLANTCODE !== '' && d.PLANT_CODE === this.queryParams.values.PLANTCODE) {
          this.queryParams.values.SCHEDULEREGIONCODE = d.SCHEDULE_REGION_CODE;
          this.CurSCH = d.SCHEDULE_REGION_CODE;
        }
      });
    });
    */

    this.PlantCodeOptions.length = 0;
    /** 初始化 主组织  下拉框*/
    this.erpjobtypeservice.GetMasterOrganizationids().subscribe(result => {
      result.data.forEach(d => {
        this.PlantCodeOptions.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });

    /** 初始化 用户权限下的快码  下拉框*/
    this.commonQueryService.GetLookupByTypeLang('FND_YES_NO', this.CurLng ? this.CurLng : 'zh-CN').subscribe(result => {
      result.Extra.forEach(d => {
        this.enableOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    /*
    // 获取是否有效 通用/afs/servermessage/MessageService/GetLookUpType
    this.erpjobtypeservice.GetEnableFlags().subscribe(result => {
      result.Extra.forEach(d => {
        this.enableOptions.push({
          label: d.LOOKUPNAME,
          value: d.LOOKUPCODE,
        });
      });
    });
    */
    // this.clear();
    this.viewAsync = this.commonQueryService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.queryCommon();
  }

  httpAction = { url: this.commonQueryService.queryUrl, method: 'GET', data: false };
  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {
    super.query();
    this.commonQueryService.read(this.httpAction, this.queryParams.values, this.context);
  }

  public dataStateChange(state: State) {
    this.gridState = state;
    this.commonQueryService.read(this.httpAction);
  }
  // 工厂切换
  plantChange(event: string) {
    this.MoTypeOptions.length = 0;
    this.erpjobtypeservice.GetMo_Type(this.queryParams.values).subscribe(result => {
      result.data.forEach(d => {
        this.MoTypeOptions.push({
          label: d.moType,
          value: d.moType,
        });
      });
    });
  }

  // 事业部切换
  GroupChange(event: string) {
    this.MoTypeOptions.length = 0;
    this.erpjobtypeservice.GetMo_Type(this.queryParams.values).subscribe(result => {
      result.data.forEach(d => {
        this.MoTypeOptions.push({
          label: d.moType,
          value: d.moType,
        });
      });
    });
  }

  public add(item?: any) {
    this.modal
      .static(ERPJobTypeEditComponent,
        {
          i: {
            id: (item !== undefined ? item.id : null),
            scheduleRegionCode: (item !== undefined ? item.scheduleRegionCode : null),
            plantCode: (item !== undefined ? item.plantCode : null),
            moType: (item !== undefined ? item.moType : null),
            standardFlag: (item !== undefined ? item.standardFlag : null),
            descriptions: (item !== undefined ? item.descriptions : null),
            enabledFlag: (item !== undefined ? item.enabledFlag : null),
            defaultFlag: (item !== undefined ? item.defaultFlag : null),
            OperationFlag: (item !== undefined ? 'N' : 'Y'),
          },
          enableOptions: this.enableOptions,
          CurPlant: this.CurPlant,
          // MoTypeOptions: this.MoTypeOptions,
          // SchedulRegionOptions: this.SchedulRegionOptions,
          // PlantCodeOptions: this.PlantCodeOptions,
          autoadjustmentflags: this.autoadjustmentflags,
          defaltOptions: this.enableOptions,
        }
      )
      .subscribe(res => {
        if (res) {
          this.query();
          this.MoTypeOptions.length = 0;
          this.erpjobtypeservice.GetMo_Type(this.queryParams.values).subscribe(result => {
            result.data.forEach(d => {
              this.MoTypeOptions.push({
                label: d.moType,
                value: d.moType,
              });
            });
          });
        }
      });

  }

  public remove(item: any) {
    this.commonQueryService.Remove(item.id).subscribe(res => {
      this.msgSrv.success('删除成功');
      this.queryCommon();
    });
  }

  public removeBatch() {
    if (this.selectionKeys.length < 1) return;
    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.commonQueryService
          .BatchRemove(this.selectionKeys)
          .subscribe(res => {
            this.msgSrv.success('删除成功');
            this.queryCommon();
          });
      },
    });
  }

  expData: any[] = [];
  expColumns = this.columns;
  // expColumnsOptions: any[] = [];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    this.commonQueryService.export(this.httpAction, this.queryParams.values, this.excelexport);
  }
}
