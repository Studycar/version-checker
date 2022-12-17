import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { JobGroupService } from '../job-group.service';
import { JobAdminMessageApiData, JobGroupUpdateParam, SN } from '../../../aps-job-admin.type';

@Component({
  selector: 'edit-job-group',
  templateUrl: './edit-job-group.component.html',
  styleUrls: ['./edit-job-group.component.css'],
})
export class EditJobGroupComponent implements OnInit {
  @Input() edit = false;
  @Input() item: JobGroupUpdateParam | null = null;

  parameter: JobGroupUpdateParam | null = {
    appname: '',
    title: '',
    addressType: '0',
    addressList: '',
  };

  constructor(
    private modal: NzModalRef,
    private jobGroupService: JobGroupService,
  ) {
  }

  ngOnInit() {
    /** 编辑 */
    if (this.edit) {
      this.parameter = { ...this.item };
      this.parameter.addressType = this.parameter.addressType + '';
    } else {
      /** 新增 */
    }
  }

  /**
   * 编辑/新增
   */
  update(): void {
    if (this.edit) {
      this.jobGroupService.update({ ...this.parameter }).subscribe(res => {
        this.close(res);
      });
    } else {
      this.jobGroupService.save({ ...this.parameter }).subscribe(res => {
        this.close(res);
      });
    }

  }

  close(code: JobAdminMessageApiData | null = null): void {
    this.modal.destroy(code);
  }

}
