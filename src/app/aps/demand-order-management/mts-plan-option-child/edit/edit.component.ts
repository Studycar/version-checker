import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { MtsPlanOptionChildEditService } from '../edit.service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-mts-plan-option-child-edit',
  templateUrl: './edit.component.html',
  providers: [MtsPlanOptionChildEditService],
})
export class DemandOrderManagementMtsPlanOptionChildEditComponent implements OnInit {
  // 来源分类
  optionListSourceCategory: any[] = [];

  // 子库存
  optionListSubinve: any[] = [];
  record: any = {}; /*  */
  i: any = {};
  Istrue: boolean;
  isLoading = false;
  // 绑定页面的需求来源
  public optionListloadReqType = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: MtsPlanOptionChildEditService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadSource();
    this.loadSubinve();
    this.loadReqType();
    if (this.i.id != null) {
      this.Istrue = true;

      /** 初始化编辑数据 */
      this.editService.Get(this.i.id).subscribe(result => {
        this.i = result.data[0];
      });
    } else {
      this.Istrue = false;
    }
  }

  // 绑定需求来源
  public loadSource(): void {

    this.optionListSourceCategory = [];
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

  // 绑定需求类型
  public loadReqType(): void {
    this.commonQueryService.GetLookupByType('PP_PLN_ORDER_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.optionListloadReqType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  // 绑定子库
  public loadSubinve(): void {
    this.optionListSubinve = [];
    this.optionListSubinve.length=0;
    this.editService.GetSubByPlant(this.i.plantCode).subscribe(result => {
      result.data.forEach(d => {

        this.optionListSubinve.push({
          label: d.subinventoryCode,
          value: d.subinventoryCode,
          commit: d.subinventoryDescription
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


  onChangeSubinve(value: string): void {
    const cate = this.optionListSubinve.find(x => x.value === value);
    this.i.subinventoryDescription = cate.commit;
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
        subinventoryCode: null,
        subinventoryDescription: null,
        planFlag: null,
        orderSources: null

      };
    }
  }
}
