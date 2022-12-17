import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
// import { BaseTranslstorService } from '../../../../modules/generated_module/services/basetranslator-service';
import { ERPJobTypeInputDto } from '../../../../modules/generated_module/dtos/erpjobtype-input-dto.';
import { ERPJobTypeService } from '../../../../modules/generated_module/services/erpjobtype-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'erpjobtype-edit',
  templateUrl: './edit.component.html',
})
export class ERPJobTypeEditComponent implements OnInit {
  title: String = '编辑';
  languageOptions: any[] = [];
  applicationOptions: any[] = [];
  isModify = false;
  unitAll: any[] = [];
  CODEOptions: any[] = [];
  i: any;
  iClone: any;
  tag: any;
  option: any;
  CurPlant: any;
  Istrue = false;
  required: Boolean;
  readOnly: boolean;

  public enableOptions: any[] = [];
  public MoTypeOptions: any[] = [];
  public SchedulRegionOptions: any[] = [];
  public PlantCodeOptions: any[] = [];
  public defaltOptions: any[] = [];
  autoadjustmentflags: any[] = [];



  @ViewChild('sf', {static: true}) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      scheduleRegionCode: {
        type: 'string', title: '事业部编码', ui:
        {
          widget: 'select',
          // change: (value: any) => this.getCODEText(value),
          emum: [],
          width: 500
        },
      },
      plantCode: {
        type: 'string', title: '工厂', ui:
        {
          widget: 'select',
          emum: [],
          width: 500
        },
      },
      moType: {
        type: 'string', title: '工单类型', ui: { width: 500 },
      },
      standardFlag: {
        type: 'string', title: '工单标准类型', ui:
        {
          widget: 'select',
          emum: [],
          width: 500
        },
      },
      descriptions: {
        type: 'string', title: '工单类型描述', ui: { width: 500 },
      },
      enabledFlag: {
        type: 'string', title: '是否有效', ui:
        {
          widget: 'select',
          emum: [],
          width: 500
        },
      },
    },
    required: ['scheduleRegionCode', 'plantCode', 'moType', 'standardFlag', 'enabledFlag'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 120,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public eRPJobTypeService: ERPJobTypeService,
    public appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
  ) { }

  ngOnInit(): void {
    this.iClone = Object.assign({}, this.i);
    this.loadData();
  }
  loadData() {
    if (this.i.id == null) {
      this.title = '新增';
      this.readOnly = false;
      this.i.enabledFlag = 'Y';
    } else {
      this.schema.properties.scheduleRegionCode.readOnly = true;
      this.schema.properties.plantCode.readOnly = true;
      this.schema.properties.moType.readOnly = true;
      this.isModify = true;
      this.readOnly = true;
      // this.TRUEORfALSE = true;
      this.title = '编辑';
    }
    this.schema.properties.enabledFlag.enum = this.enableOptions;
    this.schema.properties.plantCode.enum = this.PlantCodeOptions;
    this.schema.properties.scheduleRegionCode.enum = this.SchedulRegionOptions;
    // this.schema.properties.TYPECODE.enum = this.MoTypeOptions;
    this.schema.properties.standardFlag.enum = this.autoadjustmentflags;
    this.PlantCodeOptions.length = 0;
    /** 初始化 主组织  下拉框*/
    this.eRPJobTypeService.GetMasterOrganizationids().subscribe(result => {
      result.data.forEach(d => {
        if (d.plantCode === this.CurPlant && this.i.operationFlag === 'Y') {
          this.i.plantCode = this.CurPlant;
          this.i.scheduleRegionCode = d.scheduleRegionCode;
        }
        this.PlantCodeOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          tag: {
            scheduleRegionCode: d.scheduleRegionCode
          }
        });
      });
    });

    if (this.i.operationFlag === 'Y') {
      const obj = {
        moType: '',
        descriptions: '',
        scheduleRegionCode: this.i.scheduleRegionCode,
        plantCode: this.i.plantCode,
        enabledFlag: '',
        standardFlag: ''
      };
      this.MoTypeOptions.length = 0;
      this.eRPJobTypeService.GetMo_Type(obj).subscribe(result => {
        result.data.forEach(d => {
          this.MoTypeOptions.push({
            label: d.moType,
            value: d.moType,
          });
        });
      });
    }

    if (this.i.standardFlag === 'N') {
      this.i.defaultFlag = '';
      const temp = this.defaltOptions.find(x => x.value === 'N');
      this.defaltOptions = [];
      this.i.defaultFlag = 'N';
      this.defaltOptions.push({
        label: temp.label,
        value: temp.value,
      });
    }
    // this.onChangeStandardType();
  }

  public confirm(value?: any) {
    if (this.i.operationFlag === 'Y' && this.IsOnly(this.i.moType) !== null && this.IsOnly(this.i.moType) !== undefined) {
      this.confirmationService.warning({
        nzContent: this.appTranslationService.translate('工单类型已存在'),
        nzOnOk: () => {
          return;
        },
      });
    } else {
      this.save(value);
    }
  }

  // 工厂切换
  plantChange(event: string) {
    this.PlantCodeOptions.forEach(element => {
      if (element.value === event) {
        this.i.scheduleRegionCode = element.tag.scheduleRegionCode;
      }
    });
    const obj = {
      moType: '',
      descriptions: '',
      scheduleRegionCode: this.i.scheduleRegionCode,
      plantCode: this.i.plantCode,
      enabledFlag: '',
      standardFlag: ''
    };
    this.MoTypeOptions.length = 0;
    this.eRPJobTypeService.GetMo_Type(obj).subscribe(result => {
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
    const obj = {
      moType: '',
      descriptions: '',
      scheduleRegionCode: this.i.scheduleRegionCode,
      plantCode: this.i.plantCode,
      enabledFlag: '',
      standardFlag: ''
    };
    this.MoTypeOptions.length = 0;
    this.eRPJobTypeService.GetMo_Type(obj).subscribe(result => {
      result.data.forEach(d => {
        this.MoTypeOptions.push({
          label: d.moType,
          value: d.moType,
        });
      });
    });
  }

  save(value?: any) {
    const dto = {
      id: this.i.id,
      moType: this.i.moType,
      descriptions: this.i.descriptions,
      scheduleRegionCode: this.i.scheduleRegionCode,
      standardFlag: this.i.standardFlag,
      plantCode: this.i.plantCode,
      enabledFlag: this.i.enabledFlag,
      defaultFlag: this.i.defaultFlag
    };
    if (this.i.operationFlag === 'Y') {
      this.eRPJobTypeService.Save(dto).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg || '保存成功'));
          this.modal.close(true);
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
          this.modal.close(true);
        }
      });
    } else {
      this.eRPJobTypeService.Update(dto).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg || '更新成功'));
          this.modal.close(true);
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
          this.modal.close(true);
        }
      });
    }
  }

  onChangeStandardType(): void {
    //  【工单标准类型】=非标准，【默认的工单类型】只有 否（即标准类型才能默认工厂的工单类型为是）
    if (this.i.standardFlag === 'N') {
      this.i.defaultFlag = '';
      const temp = this.defaltOptions.find(x => x.value === 'N');
      this.defaltOptions = [];
      this.i.defaultFlag = 'N';
      this.defaltOptions.push({
        label: temp.label,
        value: temp.value,
      });
    } else {

      this.defaltOptions = this.enableOptions;
      this.i.defaultFlag = 'N';
    }

  }

  public IsOnly(name: string) {
    return this.MoTypeOptions.find(x => x.value === name);
  }

  close() {
    this.modal.destroy();
  }
  /**重置 */
  clear() {
    this.i.id = this.i.id || '';
    if (this.i.id !== '') {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
}
