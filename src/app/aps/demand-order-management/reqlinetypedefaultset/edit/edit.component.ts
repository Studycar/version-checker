import { Component, OnInit } from '@angular/core';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ReqLineTypeDefaultSetService } from '../../../../modules/generated_module/services/reqlinetypedefaultset-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-reqlinetypedefaultset-edit',
  templateUrl: './edit.component.html',
})
export class DemandOrderManagementReqlinetypedefaultsetEditComponent extends CustomBaseContext implements OnInit {

  i: any;
  iClone: any;
  isModify = false;
  title: String = this.appTranslationService.translate('新增');
  reqoptions: any[] = [];
  motypeoptions: any[] = [];
  groupoptions: any[] = [];
  resourceoptions: any[] = [];
  regionoptions: any[] = [];
  plantoptions: any[] = [];
  gridView2: GridDataResult;
  resourceDisabled: Boolean = true;
  optionListItem1: any[] = [];
  yesOrNo: any[] = [];

  Columns: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'itemDesc',
      title: '物料描述',
      width: '100'
    }
  ];

  constructor(
    public pro: BrandService,
    private appConfigService: AppConfigService,
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private queryservice: ReqLineTypeDefaultSetService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private appTranslationService: AppTranslationService

  ) {
    super({
      pro: pro,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
      appTranslationSrv: appTranslationService,
    });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {

    if (this.i.id != null) {
      this.title = this.appTranslationService.translate('编辑');
      this.isModify = true;
      this.queryservice.GetById(this.i.id).subscribe(res => {
        // this.PlantChange(res.extra.plantCode);
        this.i = res.data;
        this.resourceDisabled = !this.i.resourceCode;
        this.iClone = Object.assign({}, this.i);
        this.LoadData();
      });
    } else {
      this.i.scheduleRegionCode = this.appconfig.getActiveScheduleRegionCode();
      // this.regionChange(this.appconfig.getActiveScheduleRegionCode());
      this.i.plantCode = this.appconfig.getPlantCode();
      // this.PlantChange(this.appconfig.getPlantCode());
      this.LoadData();
    }
  }

  LoadData() {
    this.queryservice.GetSchedule().subscribe(res => {
      res.data.forEach(element1 => {
        this.regionoptions.push({
          label: element1.scheduleRegionCode,
          value: element1.scheduleRegionCode
        });
      });
    });

    this.queryservice.GetPlant(this.i.scheduleRegionCode).subscribe(res => {
      res.data.forEach(element1 => {
        this.plantoptions.push({
          label: element1.plantCode,
          value: element1.plantCode
        });
      });
    });

    // this.queryservice.GetLineType().subscribe(res => {
      this.commonquery.GetLookupByTypeLang('PP_PLN_ORDER_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element1 => {
        this.reqoptions.push({
          label: element1.meaning,
          value: element1.meaning
        });
      });
    });

    this.queryservice.GetGroup(this.i.plantCode).subscribe(res => {
      res.data.forEach(element1 => {
        this.groupoptions.push({
          label: element1.scheduleGroupCode,
          value: element1.scheduleGroupCode
        });
      });
    });

    this.queryservice.GetMoType(this.i.plantCode).subscribe(res => {
      res.data.forEach(element1 => {
        this.motypeoptions.push({
          label: element1.moType,
          value: element1.moType
        });
      });
    });

    this.queryservice.GetResource(this.i.scheduleGroupCode).subscribe(res1 => {
      res1.data.forEach(element1 => {
        this.resourceoptions.push({
          label: element1.resourceCode,
          value: element1.resourceCode
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element2 => {
        this.yesOrNo.push({
          label: element2.meaning,
          value: element2.meaning
        });
      });
    });
  }

  save() {
    if (this.i.id !== null) {
      this.queryservice.EditData(this.i).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg));
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.queryservice.SaveForNew(this.i).subscribe(res => {
        if (res.code === 200 ) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg));
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }


  regionChange(value: any) {
    this.i.plantCode = null;
    while (this.plantoptions.length !== 0) {
      this.plantoptions.pop();
    }
    this.queryservice.GetPlant(value).subscribe(ress => {
      ress.data.forEach(element1 => {
        this.plantoptions.push({
          label: element1.plantCode,
          value: element1.plantCode
        });
      });
    });
  }

  GroupChange(value: any) {
    this.i.resourceCode = null;
    this.resourceDisabled = false;
    this.resourceoptions.length = 0;
    this.queryservice.GetResource(value).subscribe(res => {
      res.data.forEach(element1 => {
        this.resourceoptions.push({
          label: element1.resourceCode,
          value: element1.resourceCode
        });
      });
    });
  }

  PlantChange(value: any) {
    this.i.scheduleGroupCode = null;
    this.groupoptions.length = 0;
    this.queryservice.GetGroup(value).subscribe(res => {
      res.data.forEach(element1 => {
        this.groupoptions.push({
          label: element1.scheduleGroupCode,
          value: element1.scheduleGroupCode
        });
      });
    });

    this.i.moType = null;
    this.motypeoptions.length = 0;

    this.queryservice.GetMoType(value).subscribe(res => {
      res.data.forEach(element1 => {
        this.motypeoptions.push({
          label: element1.moType,
          value: element1.moType
        });
      });
    });

    this.gridView1.data = [];
    this.loadItems(value, '', 1, 10);
  }

  onSearch1(e: any) {
    let filterRtl = [];
    if (e.SearchValue !== '' && e.SearchValue !== null && e.SearchValue !== undefined) {
      filterRtl = this.optionListItem1.filter(x => x.itemCode === e.SearchValue);
    } else {
      filterRtl = this.optionListItem1;
    }

    this.gridView2 = {
      data: filterRtl.slice(Number(e.Skip), Number(e.Skip) + Number(e.PageSize)),
      total: filterRtl.length
    };
  }

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
    {
      field: 'itemCode',
      title: this.appTranslationService.translate('物料'),
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];
  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }
  // 加载物料
  public loadItems(plantCode: string, itemCode: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.queryservice.GetUserPlantItemPageList(plantCode || '', itemCode || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridView1.data =  res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
