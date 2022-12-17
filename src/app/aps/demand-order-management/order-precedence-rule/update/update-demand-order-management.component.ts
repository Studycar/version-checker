import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { OrderPrecedenceRuleService } from '../order-precedence-rule.service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

const TYPE_CODE = { input: 1, date: 2, number: 3, select: 4, checkout: 5 };

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'update-demand-order-management',
  templateUrl: './update-demand-order-management.component.html',
  styleUrls: ['./update-demand-order-management.component.css'],
})
export class UpdateDemandOrderManagementComponent implements OnInit {
  @Input() editType: 'add' | 'update';
  @Input() item?;
  @Input() scheduleRegionCode?;

  yesNo: { label: string, value: string }[] = [];
  bcuList: { label: string, value: string }[] = [];

  title = '订单优先级规则';

  fields = [
    { field: 'scheduleRegionCode', label: '事业部', type: TYPE_CODE['select'], required: true, options: this.bcuList },
    { field: 'versionName', label: '方案号', type: TYPE_CODE['input'], required: true, readonly: false },
    { field: 'versionDesc', label: '方案描述', type: TYPE_CODE['input'], readonly: false },
    { field: 'enableFlag', label: '启用', type: TYPE_CODE['select'], required: true, options: this.yesNo },
  ];

  formFields: { [key: string]: any } = {
    scheduleRegionCode: '',
    versionName: '',
    versionDesc: '',
    enableFlag: 'Y',
  };
  formFieldsClone: { [key: string]: any };


  constructor(
    public http: _HttpClient,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private oprService: OrderPrecedenceRuleService,
    private commonQueryService: CommonQueryService,
    private appTranslationService: AppTranslationService,
  ) {
  }

  ngOnInit() {
    this.fields.find(t => t.field === 'versionName').readonly = this.editType === 'update';
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.yesNo);

    this.oprService.getAllScheduleRegion().subscribe(result => {
      this.bcuList.length = 0;
      result.data.forEach(d => {
        this.bcuList.push({
          label: d.scheduleRegionCode,
          value: d.scheduleRegionCode,
        });
      });

      // 根据新增/编辑状态,初始化表单数据
      if (this.editType === 'add') {
        // this.formFields.SCHEDULE_REGION_CODE = this.bcuList[0].value;
        this.formFields.scheduleRegionCode = this.scheduleRegionCode;
        this.formFields.enableFlag = 'Y';
        this.title = this.title + '新增';
      } else {
        this.formFields = this.item;
        this.formFieldsClone = Object.assign({}, this.formFields);
        this.title = this.title + '编辑';
      }
    });
  }

  save(): void {
    // this.formFields.ENABLE_FLAG = this.formFields.ENABLE_FLAG === true ? 'Y' : 'N';
    // this.oprService.add(this.formFields).subscribe(() => this.modal.close());
    this.oprService.add(this.formFields).subscribe(
    res => {
      if (res.code==200) {
        this.modal.close();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close(): void {
    this.modal.destroy();
  }

  clear() {
    this.formFields = Object.assign({}, this.formFieldsClone);
  }

}
