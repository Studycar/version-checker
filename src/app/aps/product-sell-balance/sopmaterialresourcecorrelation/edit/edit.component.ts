import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { SopMaterialResourceCorrelationService } from 'app/modules/generated_module/services/sopmaterialresourcecorrelation-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopmaterialresourcecorrelation-edit',
  templateUrl: './edit.component.html',
})
export class ProductSellBalanceSopmaterialresourcecorrelationEditComponent implements OnInit {
  record: any = {};
  i: any;
  plantOptions: any[] = [];
  readOnly: Boolean = false;
  title: String = '新增';
  typeOptions: any[] = [];
  yesOrNo: any[] = [];
  groupOptions: any[] = [];
  divisionOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private dataservice: SopMaterialResourceCorrelationService,
    private appconfig: AppConfigService,
    private commonquery: CommonQueryService,
    private appTranslationService: AppTranslationService) { }

  ngOnInit(): void {
    if (this.i !== null) {
      this.readOnly = true;
      this.title = '编辑';
      this.plantChange(this.i.plantCode);
      this.typeChange(this.i.divisionType);
    } else {
      this.i = {
        id: '',
        plantCode: this.appconfig.getPlantCode(),
        scheduleGroupCode: '',
        divisionType: '',
        divisionName: '',
        itemId: '',
        itemCode: '',
        enableFlag: ''
      };

      this.plantChange(this.i.plantCode);
    }
    this.LoadData();
  }

  LoadData() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element1 => {
        this.plantOptions.push({
          label: element1.plantCode,
          value: element1.plantCode
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('FND_YES_NO', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.yesOrNo.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });

    this.commonquery.GetLookupByTypeLang('SOP_RESOURCE_TYPE', this.appconfig.getLanguage()).subscribe(res => {
      res.Extra.forEach(element => {
        this.typeOptions.push({
          label: element.meaning,
          value: element.lookupCode
        });
      });
    });
  }

  save() {
    this.dataservice.save(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  plantChange(value: any) {
    if (!this.readOnly) {
      this.i.scheduleGroupCode = null;
    }
    this.groupOptions.length = 0;
    this.commonquery.GetUserPlantGroup(value).subscribe(res => {
      res.Extra.forEach(element => {
        this.groupOptions.push({
          label: element.scheduleGroupCode,
          value: element.scheduleGroupCode
        });
      });
    });
  }

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
    {
      field: 'itemCode',
      title: '物料',
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
    // 加载物料
    this.commonquery.getUserPlantItemPageList(this.i.plantCode || '', e.SearchValue || '', '', PageIndex, e.PageSize)
      .subscribe(res => {
        this.gridView1.data = res.data.content;
        this.gridView1.total = res.data.totalElements;
      });
  }

  change1({ sender, event, Text }) {
    const value = this.i.itemId || '';
    if (value === '') {
      // 加载物料
      this.commonquery.getUserPlantItemPageList(this.i.plantCode || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
        this.gridView1.data = res.data.content;
        this.gridView1.total = res.data.totalElements;
        if (res.data.totalElements === 1) {
          this.i.itemId = res.data.content.find(x => x.itemCode === Text).itemId;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
        }
      });
    }
  }

  typeChange(value: any) {
    this.i.divisionName = null;
    this.divisionOptions.length = 0;
    this.dataservice.GetDivision(this.i.scheduleGroupCode, value).subscribe(res => {
      res.data.forEach(element => {
        this.divisionOptions.push({
          label: element.divisionName,
          value: element.divisionName
        });
      });
    });
  }

  groupChange(value: any) {
    this.i.divisionName = null;
    this.divisionOptions.length = 0;
    this.dataservice.GetDivision(value, this.i.divisionType).subscribe(res => {
      res.data.forEach(element => {
        this.divisionOptions.push({
          label: element.divisionName,
          value: element.divisionName
        });
      });
    });
  }

}
