import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { MtsPlanOptionEditService } from '../edit.service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-mts-plan-option-edit',
  templateUrl: './edit.component.html',
  providers: [MtsPlanOptionEditService],
})
export class DemandOrderManagementMtsPlanOptionEditComponent implements OnInit {

  optionListPlant: any[] = [];
  // 来源分类
  optionListSourceCategory: any[] = [];
  // 转换订单来源
  optionListConvertLine: any[] = [];
  // 需求类型
  optionListReqLine: any[] = [];
  // 数据收集参数
  optionListCollectionLine: any[] = [];
  required1 = true;
  required2 = true;
  disabled1 = false;
  disabled2 = false;

  record: any = {};
  i: any = {};
  Istrue: boolean;
  isLoading = false;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: MtsPlanOptionEditService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadplant();
    this.loadReqType();
    this.loadtConvertLine();
    this.loadCollectionLine();


    if (this.i.id != null) {
      this.Istrue = true;

      /** 初始化编辑数据 */
      this.editService.Get(this.i.id).subscribe(result => {
        this.i = result.data[0];
        this.loadSource();
        // 修改必填项
        if (this.i.sourceType === '需求') {
          this.required1 = true;
          this.required2 = false;
          this.disabled1 = false;
          this.disabled2 = true;
        } else {
          this.required1 = false;
          this.required2 = true;
          this.disabled1 = true;
          this.disabled2 = false;
        }
      });
    } else {
      this.Istrue = false;
    }
  }

  loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      this.optionListPlant = result.Extra;
      this.i.plantCode = this.appConfigService.getPlantCode();
    });
  }


  // 类型 值更新事件 重新绑来源分类
  onChangeSourceType(value: string): void {
    /** 重新绑定 来源分类*/
    this.loadSource();

    // 修改必填项
    if (value === '需求') {
      this.required1 = true;
      this.required2 = false;
      this.disabled1 = false;
      this.disabled2 = true;



    } else {
      this.required1 = false;
      this.required2 = true;
      this.disabled1 = true;
      this.disabled2 = false;

      this.i.prospectPeriod = null;
      this.i.reqType = null;
      this.i.convertOrderSources = null;
    }
  }

  onChangeSourceCategory(value: string): void {

    const cate = this.optionListSourceCategory.find(x => x.value === value);
    this.i.commentary = cate.label;
  }

  // 绑定需求来源
  public loadSource(): void {

    this.optionListSourceCategory = [];
    if (this.i.sourceType === '需求') {
      this.commonQueryService.GetLookupByType('PP_DM_SOURCE_SYSTEM').subscribe(result => {
        result.Extra.forEach(d => {
          if (d.attribute3 === 'Y') {
            this.optionListSourceCategory.push({
              label: d.meaning,
              value: d.lookupCode,
            });
          }
        });
      });
    }
    if (this.i.sourceType === '供应') {
      this.commonQueryService.GetLookupByType('PP_MTS_SUPPLY_SOURCE_CATEGORY').subscribe(result => {
        result.Extra.forEach(d => {
          this.optionListSourceCategory.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
    }
  }

  // 绑定需求类型
  public loadReqType(): void {
    this.optionListReqLine = [];
    this.commonQueryService.GetLookupByType('PP_PLN_ORDER_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.optionListReqLine.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  // 绑定转换类型来源
  public loadtConvertLine(): void {

    this.optionListConvertLine = [];
    this.commonQueryService.GetLookupByType('PP_DM_SOURCE_SYSTEM').subscribe(result => {
      result.Extra.forEach(d => {
        if (d.attribute3 === 'Y') {
          this.optionListConvertLine.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        }
      });
    });
  }

  // 绑定数据收集参数
  public loadCollectionLine(): void {

    this.optionListCollectionLine = [];
    this.commonQueryService.GetLookupByType('PP_MTS_DATA_COLLECTION_PARAMETER').subscribe(result => {
      result.Extra.forEach(d => {

        this.optionListCollectionLine.push({
          label: d.meaning,
          value: d.lookupCode,
        });

      });
    });
  }

  save() {
    this.editService.Edit(this.i).subscribe(res => {
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

  clear() {
    if (this.i.id != null) {
      this.loadData();
    } else {
      this.i = {
        id: null,
        plantCode: null,
        sourceType: null,
        sourceCategory: null,
        commentary: null,
        prospectPeriod: null,
        convertOrderSources: null,
        priority: null,

        reqType: null,
        dataCollectionParameters: null
      };
    }
  }


}
