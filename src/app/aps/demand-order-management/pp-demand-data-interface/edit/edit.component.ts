import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { PsItemRoutingsService } from '../../../../modules/generated_module/services/ps-item-routings-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { PpDemandDataInterfaceEditService } from '../edit.service';
import { DemandclearupnoticeService } from 'app/modules/generated_module/services/demandclearupnotice-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-pp-demand-data-interface-edit',
  templateUrl: './edit.component.html',
  providers: [PsItemRoutingsService, PpDemandDataInterfaceEditService]
})
export class DemandOrderManagementPpDemandDataInterfaceEditComponent implements OnInit {

  title = '编辑信息';
  sources: any[] = [];
  makebuycodes: any[] = [];
  applicationYesNo: any[] = [];
  organizationids: any[] = [];
  schedulegroupcodes: any[] = [];
  productlines: any[] = [];
  scheduleregions: any[] = [];
  gradeList: any[] = [];
  isLoading = false;
  // tslint:disable-next-line:no-inferrable-types
  Istrue: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  IsDisable: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  IsControl: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  CancelControl: boolean = true;
  // tslint:disable-next-line:no-inferrable-types
  IsNonstd: boolean = false;

  i: any;
  iClone: any;
  applicationReqType: any[] = [];
  public panelActive1 = true;
  public panelActive2 = false;
  public panelActive3 = false;
  public panelTitle1 = '主要信息';
  public panelTitle2 = '销售信息';
  public panelTitle3 = '非标信息';

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: PsItemRoutingsService,
    private appTranslationService: AppTranslationService,
    private commonQueryService: CommonQueryService,
    public demandclearupnoticeService: DemandclearupnoticeService,
    public interfaceService: PpDemandDataInterfaceEditService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.Istrue = false;
    if (!this.i.id) {
      this.title = '新增信息';
      this.i.plantCode = this.appConfigService.getPlantCode();
      this.IsDisable = false;
      this.IsControl = false;
      this.loadData();
    } else {
      this.loadData();
      this.IsDisable = true;
      this.i = Object.assign({}, this.i);
      this.iClone = Object.assign({}, this.i);

      if (this.i.cancelComments !== undefined && this.i.cancelComments !== null) {
        // 取消说明不为空才可以编辑取消说明字段
        this.CancelControl = false;
      }

      if (this.i.standardFlag === 'Y') {
        // 标准类型不可以编辑非标
        this.IsNonstd = true;
      } else {
        this.onChangeStandardType();
        this.onChangeScheduleGroup();
      }

    }

  }

  onChangeScheduleGroup(): void {
    this.productlines = [];
    this.i.resourceCode = '';
    this.demandclearupnoticeService.GetNonStdTypeProductLine(this.i.plantCode, this.i.scheduleGroupCode, this.i.itemCode, this.i.reqType).subscribe(result => {
      result.data.forEach(d => {
        this.productlines.push({
          label: d,
          value: d,
        });
      });
    });
  }

  onChangeStandardType(): void {
    if (this.i.standardFalg === 'N') {
      this.Istrue = true;
      this.i.scheduleGroupCode = null;
      this.demandclearupnoticeService.GetNonStdTypeScheduleGroup(this.i.plantCode, this.i.itemCode, this.i.reqType).subscribe(result => {
        this.schedulegroupcodes.length = 0;
        result.data.forEach(d => {
          this.schedulegroupcodes.push({
            label: d,
            value: d,
          });
        });

      });

    } else {
      this.Istrue = false;
      this.schedulegroupcodes = [];
      this.productlines = [];
      this.i.scheduleGroupCode = null;
      this.i.resourceCode = null;
      this.i.uph = '';
      this.i.mrpNetQty = null;
    }

  }
  onChangeReqType(): void {
    const StandardFlag = this.applicationReqType.find(x => x.value === this.i.reqType).other;
    if (StandardFlag !== 'N') {
      this.i.standardFlag = 'Y';
    } else {
      this.i.standardFlag = 'N';
      this.panelActive3 = true;
    }
    this.onChangeStandardType();
  }

  loadData() {
    this.loadplant();
    this.loadReqType();
    this.loadYesNO();
    this.loadCustomGrade();
    /** 初始化订单来源 新增页面的只能ATTRIBUTE2 === 'MANUAL' */
    this.sources.length = 0;
    if (!this.i.id) {
      this.commonQueryService.GetLookupByTypeNew('PP_DM_SOURCE_SYSTEM').subscribe(result => {
        result.data.forEach(d => {
          if (d.attribute2 === 'MANUAL') {
            this.sources.push({
              label: d.meaning,
              value: d.lookupCode,
            });
          }
        });
      });
    } else {
      this.commonQueryService.GetLookupByTypeNew('PP_DM_SOURCE_SYSTEM').subscribe(result => {
        result.data.forEach(d => {
          this.sources.push({
            label: d.meaning,
            value: d.lookupCode,
          });

        });
      });
    }
    /*if (this.i.Id != null) {
      /!** 初始化编辑数据 *!/
      this.interfaceService.GetDataById(this.i.Id).subscribe(result => {
        result.Extra.REQ_QTY_MODIFY = this.i.REQ_QTY_MODIFY;
        result.Extra.REQ_DATE_MODIFY = this.i.REQ_DATE_MODIFY;

        this.i = result.Extra;
        this.i.Id = result.Extra.Id;
        this.i.MRP_NET_FLAG = result.Extra.MRP_NET_FLAG;
        this.iClone = Object.assign({}, this.i);
      }
      );
    }*/
  }
  public loadCustomGrade() {
    this.commonQueryService.GetLookupByTypeNew('PP_PLN_CUSTOMER_DEGREE').subscribe(result => {
      this.gradeList.length = 0;
      result.data.forEach(d => {
        this.gradeList.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }
  public loadYesNO(): void {
    this.commonQueryService.GetLookupByTypeNew('FND_YES_NO').subscribe(result => {
      result.data.forEach(d => {
        this.applicationYesNo.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  public loadReqType(): void {
    this.commonQueryService.GetLookupByTypeNew('PP_PLN_ORDER_TYPE').subscribe(result => {
      result.data.forEach(d => {
        this.applicationReqType.push({
          label: d.meaning,
          value: d.lookupCode,
          other: d.attribute3
        });
      });
    });
  }

  // 绑定页面的下拉框Plant
  optionListPlant = [];
  public loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.commonQueryService.GetUserPlantNew().subscribe(result => {
      this.isLoading = false;
      this.optionListPlant = result.data;
    });
  }

  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    this.onChangeStandardType();
  }

  save() {

    if (this.i.itemCode === undefined || this.i.itemCode === '') {
      this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
      return;
    }

    // 编辑时是否有修改需求时间或者需求日期
    if (this.i.reqQtyModify !== undefined && this.i.reqDateModify !== undefined) {
      if (this.i.reqQty === this.i.reqQtyModify || this.commonQueryService.formatDate((this.i.reqDate).toString()).toString() === this.commonQueryService.formatDate((this.i.reqDateModify).toString()).toString()) {
        this.i.qtyordateupdate = 'N';
      } else {
        this.i.qtyordateupdate = 'Y';
      }
    }
    // 手工新增的订单，这两个字段都应该为是
    if (this.i.source === 'MANUAL') {
      this.i.manualEntryFlag = 'Y';
      this.i.productScheduleFlag = 'Y';
    }
    this.interfaceService.Edit(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
