import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { QueryService } from '../query.service';
import { NgForm } from '@angular/forms';
import { NavigateDataTransferService } from 'app/modules/base_module/services/navigate-data-transfer.service';

@Component({
  selector: 'ide-complaint-handle-form',
  templateUrl: './form.component.html',
  styleUrls: ['../../../style/form.css'],
  providers: [QueryService]
})
export class IdeComplaintHandleFormComponent implements OnInit {
  constructor(
    public ndtSrv: NavigateDataTransferService,
    private queryService: QueryService,
  ) {
  }

  @Input() formData: any = {};
  @Output() formDataChange = new EventEmitter<any>();

  // 测试用的下拉列表，可删除
  @ViewChild('f', { static: true }) f: NgForm;
  selectOptions: { label: any, value: any, [key: string]: any }[] = [];
  fileList = [];
  steelTypeOptions: any[] = []; 
  surfaceOptions: any[] = [];
  thTypeOptions: any[] = [];
  gjszdOptions: any[] = [];
  cailiaoTypeOptions: any[] = [];
  stateOptions: any[] = [];
  jszgStateOptions: any[] = [];
  cwpfStateOptions: any[] = [];

  // 初始化
  ngOnInit(): void {
    this.f.valueChanges.subscribe(res => this.formDataChange.emit());
    this.loadOptions()
    this.padComplaintItemData()
    this.resolveAnnexes();
  }

  loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_CONTRACT_SURFACE': this.surfaceOptions,
      'PS_CONTRACT_STEEL_TYPE': this.steelTypeOptions,
      'PS_GJSZD': this.gjszdOptions,
      'TH_TYPE': this.thTypeOptions,
      'CAILIAO_TYPE': this.cailiaoTypeOptions,
      'PS_KSCLZT_DETAILED': this.stateOptions,
      'JSZG_STATE': this.jszgStateOptions,
      'CWPF_STATE': this.cwpfStateOptions,
    });
  }

  // 补充客诉单数据
  padComplaintItemData() {
    const { complaintItem } = this.ndtSrv.getData()
    if (complaintItem) {
      this.formData.cusCode = complaintItem.cusCode
      this.formData.dlslxr = complaintItem.dlslxr
      this.formData.lxdh = complaintItem.lxdh
      this.formData.ksdt = complaintItem.ksdt
      this.formData.plantCode = complaintItem.plantCode
    }
  }

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

  // onClickAnnex(annex) {
  //   if (annex.id) {
  //     this.ossFileService.download(annex.id, annex.name);
  //   }
  // }

}