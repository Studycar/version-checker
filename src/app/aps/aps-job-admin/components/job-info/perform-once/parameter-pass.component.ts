import { Component, Input, OnInit } from '@angular/core';
import { CommonQueryService } from '../../../../../modules/generated_module/services/common-query.service';
import { SupplierService } from '../../../../../modules/generated_module/services/supplier-service';
import { NzModalRef } from 'ng-zorro-antd';
import { ParameterPassService } from './parameter-pass.service';

/**
 * 该页面功能为根据请求类型给用户呈现不同的选项，从而提交不同的参数到后台执行
 * 目前有3种类型，MRP，齐套，备料
 */
@Component({
  selector: 'perform-once',
  templateUrl: './parameter-pass.component.html',
  styleUrls: ['./parameter-pass.component.css'],
  providers: [ParameterPassService],
})
export class ParameterPassComponent implements OnInit {
  /** 请求类型 */
  @Input() type: number;
  /** 请求项 */
  @Input() item: any;

  /**
   * 下拉选项数据
   */
  organizationId: any[] = [];
  buyers: any[] = [];
  planNames: any[] = [];

  /**
   * 选中参数
   * 组织/工厂
   * 采购人
   * 物料
   * 计划名称
   */
  selectedOrganization = '';
  selectedBuyer = '';
  selectedItemCode = '';
  selectedPlanName = '';

  /**
   * 根据类型提供选项元数据
   * readonly标识该字段不提供变更并隐藏
   * 0：MRP
   * 1: 齐套
   * 2：备料
   *
   MRP
   {
     "planName": "M23"/!*计划名称，页面选择*!/
   }

   pc齐套json
   {
     "plantCode": "M23"/!*工厂组织，页面选择*!/
   }

   pc备料json
   {
     "executeType": "PCShippingNoticeHfCreate",/!*执行名称，写死*!/
     "plantCode": "M23",/!*工厂组织，页面选择*!/
     "buyer": "11014613",/!*采购员，页面选择*!/
     "listCategory": "",/!*采购品类，写死*!/
     "listItem": "",/!*物料号，页面输入*!/
     "refreshDemand": "Y",/!*写死*!/
     "refreshSupply": "Y",/!*写死*!/
     "fdStatus": ""/!*写死*!/
   }
   */
  initParameter = {
    0: [{
      label: '计划名称',
      field: 'planName',
      value: 'M23',
      type: 'select',
      ngModel: 'selectedPlanName',
      options: this.planNames,
    }],
    1: [{
      label: '工厂组织',
      field: 'plantCode',
      value: 'M23',
      type: 'select',
      options: this.organizationId,
      ngModel: 'selectedOrganization',
    }],
    2: [
      { label: '执行类型', field: 'PCShippingNoticeHfCreate', value: 'PCShippingNoticeHfCreate', readonly: true },
      {
        label: '工厂组织',
        field: 'plantCode',
        value: 'M23',
        type: 'select',
        options: this.organizationId,
        ngModel: 'selectedOrganization',
      },
      { label: '采购员', field: 'buyer', value: '', type: 'select', options: this.buyers, ngModel: 'selectedBuyer' },
      { label: '采购品类', field: 'listCategory', value: '', readonly: true },
      { label: '物料号', field: 'listItem', value: '', type: 'text', ngModel: 'selectedItemCode' },
      { label: '刷新需求', field: 'refreshDemand', value: 'Y', readonly: true },
      { label: '刷新供应', field: 'refreshSupply', value: 'Y', readonly: true },
      { label: '状态', field: 'fdStatus', value: '', readonly: true },
    ],
  };

  /**
   * 根据请求类型过滤后的选项数据
   */
  selectParameter: any[];


  constructor(
    private modal: NzModalRef,
    private commonQueryService: CommonQueryService,
    private supplierService: SupplierService,
    private parameterPassService: ParameterPassService,
  ) {
  }

  ngOnInit() {
    this.selectParameter = this.initParameter[this.type];

    /**
     * 获取工厂/组织
     */
    this.parameterPassService.getUserPlant().subscribe(res => {
      if (res !== null) {
        this.organizationId.push(...res);
      }
    });

    /**
     * 获取采购员
     */
    this.parameterPassService.getBuyerPageList().subscribe(res => {
      if (res !== null) {
        this.buyers.push(...res);
      }
    });

    /**
     * 获取计划名称
     */
    this.parameterPassService.getPlanName().subscribe(res => {
      if (res !== null) {
        this.planNames.push(...res);
      }
    });
  }

  confirm(): void {
    this.parameterPassService.confirm(this.type, this);
    this.close();
  }

  close(): void {
    this.modal.destroy();
  }

}
