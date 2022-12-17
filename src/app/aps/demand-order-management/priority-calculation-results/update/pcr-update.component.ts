import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { PriorityCalculationResultsService } from '../priority-calculation-results.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';

const TYPE_CODE = { text: 0, input: 1, date: 2, number: 3, select: 4, checkout: 5 };

@Component({
  selector: 'pcr-update',
  templateUrl: './pcr-update.component.html',
  styleUrls: ['./pcr-update.component.css'],
})
export class PcrUpdateComponent implements OnInit {
  @Input() public editType: 'add' | 'update';
  @Input() public item?;

  title = '编辑订单优先级';

  fields = [
    { field: 'batchNumber', label: '批次号', type: TYPE_CODE['input'], disabled: true },
    { field: 'versionName', label: '优先级规则', type: TYPE_CODE['input'], disabled: true },
    { field: 'reqNumber', label: '订单号', type: TYPE_CODE['input'], disabled: true },
    { field: 'lineNumber', label: '行号', type: TYPE_CODE['input'], disabled: true },
    { field: 'itemCode', label: '产品编码', type: TYPE_CODE['input'], disabled: true },
    { field: 'itemName', label: '产品名称', type: TYPE_CODE['input'], disabled: true },
    { field: 'demandDate', label: '需求日期', type: TYPE_CODE['input'], disabled: true },
    { field: 'grade', label: '得分', type: TYPE_CODE['input'], disabled: true },
    { field: 'priority', label: '优先级', type: TYPE_CODE['input'] },
  ];

  formFields: { [key: string]: any };
  formFieldsClone: { [key: string]: any };


  constructor(
    public http: _HttpClient,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private pcrService: PriorityCalculationResultsService,
    private appTranslationService: AppTranslationService,
  ) {
  }

  ngOnInit() {
    this.formFields = this.item;
    this.formFieldsClone = Object.assign({}, this.formFields);
  }

  save(): void {
    this.pcrService.edit(this.formFields).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
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
