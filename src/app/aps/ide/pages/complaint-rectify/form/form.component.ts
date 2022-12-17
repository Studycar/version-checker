import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { QueryService } from '../query.service';
import { NgForm } from '@angular/forms';
import { NavigateDataTransferService } from 'app/modules/base_module/services/navigate-data-transfer.service';

@Component({
  selector: 'ide-complaint-rectify-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeComplaintRectifyFormComponent implements OnInit {
  constructor(
    public ndtSrv: NavigateDataTransferService,
    private queryService: QueryService,
  ) {
  }

  @Input() formData: any = {};
  @Output() formDataChange = new EventEmitter<any>();

  // 测试用的下拉列表，可删除
  @ViewChild('f', { static: true }) f: NgForm;
  fileList = [];

  // 初始化
  ngOnInit(): void {
    this.f.valueChanges.subscribe(res => this.formDataChange.emit());
    // this.loadOptions()
    this.resolveAnnexes();
  }

  // loadOptions() {
  // }

  // 处理附件列表
  resolveAnnexes() {
    try {
      if (this.formData.annex) {
        const fileMap = JSON.parse(this.formData.annex)
        for (const key in fileMap) {
          const value = fileMap[key]
          if (typeof value === 'object') {
            this.fileList.push({ id: value.id, name: value.fileName })
          } else {
            this.fileList.push({ id: key, name: value })
          }
        }
      }
    } catch (e) {}
  }

}