import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { MaterialmaintenanceService } from '../../../../modules/generated_module/services/materialmaintenance-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-materialmaintenance-edit',
  templateUrl: './edit.component.html',
})
export class MaterialmanagementMaterialmaintenanceEditComponent implements OnInit {
  record: any = {};
  i: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public materialmaintenanceService: MaterialmaintenanceService,
    private appTranslationService: AppTranslationService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    if (this.i.ITEM_CODE != null) {
      /** 初始化编辑数据 */
      this.materialmaintenanceService.Get(this.i.ITEM_CODE).subscribe(resultMes => {
        if (resultMes.Extra !== undefined && resultMes.Extra.length > 0) {
          const d = resultMes.Extra[0];
          this.i = {
            ITEMCODE: d.ITEM_CODE,
            PRODLINERULE: d.PROD_LINE_RULE,
            FOLLOWEDFLAG: d.FOLLOWED_FLAG,
            CASCADEFOLLOWEDFLAG: d.CASCADE_FOLLOWED_FLAG,
            PROCESSSCHEDULINGFLAG: d.PROCESS_SCHEDULING_FLAG,
            LINKAGELEVEL: d.LINKAGE_LEVEL,
            REFUSELINKAGEFLAG: d.REFUSE_LINKAGE_FLAG,
            PROCESSINGLEADTIMENEW: d.PROCESSING_LEAD_TIME_NEW,
            SAFETYLEADTIME: d.SAFETY_LEAD_TIME,
            EXCEEDLEADTIME: d.EXCEED_LEAD_TIME,
            PLANTID: d.PLANT_ID,
            DESCRIPTIONS: d.DESCRIPTIONS,
            PRIMARYUOM: d.PRIMARY_UOM,
            OLDITEMCODE: d.OLD_ITEM_CODE,
            KEYCOMPONENTFLAG: d.KEY_COMPONENT_FLAG,
            ITEMIDENTIFYCODE: d.ITEM_IDENTIFY_CODE,
            ENABLEFLAG: d.ENABLE_FLAG,
            ASSEMBLYSHRINKAGE: d.ASSEMBLY_SHRINKAGE,
            COMPONENTSHRINKAGE: d.COMPONENT_SHRINKAGE,
            ECONOMICLOTSIZE: d.ECONOMIC_LOT_SIZE,
            TRANSFERLOTSIZE: d.TRANSFER_LOT_SIZE,
            SCHEDULETIMEFENCE: d.SCHEDULE_TIME_FENCE,
            RELEASETIMEFENCE: d.RELEASE_TIME_FENCE,
            DEMANDTIMEFENCE: d.DEMAND_TIME_FENCE,
            FIXTIMEFENCE: d.FIX_TIME_FENCE,
            OPTIMIZATIONGROUP: d.OPTIMIZATION_GROUP,
            PARTNERITEMID: d.PARTNER_ITEM_ID,
            USERITEMTYPE: d.USER_ITEM_TYPE,
            CONTROLFLAG: d.CONTROL_FLAG,
            COMPLETECTRLTYPE: d.COMPLETE_CTRL_TYPE,
            COMPLETECTRLQTY: d.COMPLETE_CTRL_QTY,
            UNITWEIGHT: d.UNIT_WEIGHT,
            ISSUECTRLTYPE: d.ISSUE_CTRL_TYPE,
            ISSUECTRLQTY: d.ISSUE_CTRL_QTY,
            ORDERTIMEFENCE: d.ORDER_TIME_FENCE,
            PREPROCESSINGLEADTIME: d.PREPROCESSING_LEAD_TIME,
            POSTPROCESSINGLEADTIME: d.POSTPROCESSING_LEAD_TIME,
            ECONOMICSPLITPARAMETER: d.ECONOMIC_SPLIT_PARAMETER,
            MOPRINTTYPE: d.MO_PRINT_TYPE,
            DEMANDMERGETIMEFENCE: d.DEMAND_MERGE_TIME_FENCE,
            SAFETYSTOCKMETHOD: d.SAFETY_STOCK_METHOD,
            SAFETYSTOCKVALUE: d.SAFETY_STOCK_VALUE,
            SIMILARATTRIBUTES: d.SIMILAR_ATTRIBUTES,
            COLORCODE: d.COLOR_CODE,
            ITEMRULE: d.ITEM_RULE,
            SUPERIORITEMID: d.SUPERIOR_ITEM_ID,
            ATTRIBUTE1: d.ATTRIBUTE1,
            ATTRIBUTE3: d.ATTRIBUTE3,
            ATTRIBUTE4: d.ATTRIBUTE4,
            ATTRIBUTE5: d.ATTRIBUTE5,
            ATTRIBUTE6: d.ATTRIBUTE6,
            ATTRIBUTE7: d.ATTRIBUTE7,
            ATTRIBUTE8: d.ATTRIBUTE8,
            ATTRIBUTE9: d.ATTRIBUTE9,
            ATTRIBUTE10: d.ATTRIBUTE10,
            ATTRIBUTE13: d.ATTRIBUTE13,
            ATTRIBUTE14: d.ATTRIBUTE14,
            ATTRIBUTE15: d.ATTRIBUTE15,
            ATTRIBUTE16: d.ATTRIBUTE16,
            ATTRIBUTE18: d.ATTRIBUTE18,
            ATTRIBUTE19: d.ATTRIBUTE19,
            ATTRIBUTE20: d.ATTRIBUTE20,
            ATTRIBUTE22: d.ATTRIBUTE22,
            ATTRIBUTE26: d.ATTRIBUTE26,
            ATTRIBUTE27: d.ATTRIBUTE27,
            ATTRIBUTE28: d.ATTRIBUTE28,
            ATTRIBUTE29: d.ATTRIBUTE29,
            ATTRIBUTE30: d.ATTRIBUTE30
          };
        }
      });
    }
  }


  save() {
    this.materialmaintenanceService.Edit(this.i).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }


  close() {
    this.modal.destroy();
  }
}
