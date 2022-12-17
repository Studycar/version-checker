import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { LookCodeDetailService } from '../look-code-detail.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../../modules/base_module/services/app-translation-service';
import { formatDate } from '@angular/common';

const TYPE_CODE = { input: 1, date: 2, number: 3 };

@Component({
  selector: 'update-look-code',
  templateUrl: './add-look-code.component.html',
})
export class AddLookCodeComponent implements OnInit {
  @Input() public editType: string;
  @Input() public item?;

  title = '新增快速编码';

  fields = [
    { field: 'lookupCode', label: '编码类型', type: TYPE_CODE['input'], required: true },
    { field: 'meaning', label: '编码名称', type: TYPE_CODE['input'], required: true },
    { field: 'startDate', label: '生效日期', type: TYPE_CODE['date'], required: true },
    { field: 'endDate', label: '失效日期', type: TYPE_CODE['date'] },
    { field: 'description', label: '描述', type: TYPE_CODE['input'] },
    { field: 'orderSeq', label: '序号', type: TYPE_CODE['number'] },
    { field: 'additionCode', label: 'ADDITION_CODE', type: TYPE_CODE['input'] },
  ];

  formFields: { [key: string]: any };
  formFieldsClone: { [key: string]: any };

  constructor(
    public http: _HttpClient,
    private lookCodeDetailService: LookCodeDetailService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private modal: NzModalRef,
  ) {
  }

  ngOnInit(): void {
    // label初始化额外属性
    for (let i = 1; i < 11; i++) {
      this.fields.push({ field: `attribute${i}`, label: `ATTRIBUTE${i}`, type: TYPE_CODE['input'] });
    }
    // 根据新增/编辑状态,初始化表单数据
    if (this.editType === 'edit') {
      this.formFields = this.item;
      this.formFieldsClone = Object.assign({}, this.formFields);
      this.title = '编辑快速编码';
    } else {
      this.formFields = this.lookCodeDetailService.createNewItem();
    }
  }

  save() {
    let message = '新增成功';
    const handleRes = (res) => {
      if (res.code === 200) { // if (res.Success === true) {
        this.msgSrv.success(this.appTranslationService.translate(message));
      } else {
        this.msgSrv.error(res.msg);
      }
      this.modal.destroy();
    };

    if (this.editType === 'add') {
      this.lookCodeDetailService.saveCode([this.formFields]).subscribe(handleRes);
    } else if (this.editType === 'edit') {
      message = '修改成功';
      this.lookCodeDetailService.updateCode([this.formFields]).subscribe(handleRes);
    }
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.formFields = Object.assign({}, this.formFieldsClone);
  }
}
