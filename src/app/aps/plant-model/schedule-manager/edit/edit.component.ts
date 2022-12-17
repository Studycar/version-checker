import { Component, OnInit, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { NzModalRef, NzMessageService, UploadFile } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { ScheduleManagerService } from '../../../../modules/generated_module/services/schedule-manager-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { NgForm } from '@angular/forms';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-scheduleManager-edit',
  templateUrl: './edit.component.html',
  // styleUrls: ['../../../../../assets/css/common.css']
})
export class PlantModelScheduleManagerEditComponent implements OnInit {
  isModify = false;
  i: any;
  iClone: any;
  columns: any[];
  enableOption: any[];
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  fileList = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    public scheduleManagerService: ScheduleManagerService
  ) { }

  ngOnInit(): void {
    this.enableOption = this.columns.find(d => d.field === 'enableFlag').ui.options;
    if (this.i.id !== null) {
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
      this.initfileList(this.iClone.attribute1);
    } else {
      this.clear();
    }
  }

  save(value: any) {
    if (this.i.id !== null) {
      value.id = this.i.id;
    } else {
      value.id = null;
    }
    this.scheduleManagerService.Save(value).subscribe(res => {
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
    this.i.id = this.i.id || '';
    if (this.i.id !== '') {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
      this.initfileList(this.iClone.attribute1);
    } else {
      this.i = {
        scheduleRegionCode: '',
        descriptions: '',
        planStartTime: null,
        periodicTime: 1,
        calendarCode: '',
        enableFlag: 'Y',
        attribute1: ''
      };
      this.initfileList(this.i.attribute1);
    }
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  handleChange({ file, fileList }): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.i.attribute1 = file.name;
      this.msgSrv.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msgSrv.error(`${file.name} file upload failed.`);
    } else if (status === 'removed') {
      this.i.attribute1 = '';
    }
  }

  beforeUpload = (file: File) => {
    const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
    const isVideo = file.type === 'video/mp4';
    if (!isImg && !isVideo) {
      this.msgSrv.error('You can only upload jpeg png mp4 file!');
    }

    return isImg || isVideo;
  }

  initfileList(fileName: string) {
    if (fileName !== null && fileName !== '') {
      this.fileList = [
        {
          uid: -1,
          name: fileName,
          status: 'done',
          url: '../../../../assets/videos/' + fileName
        }
      ];
    } else {
      this.fileList = [];
    }
  }
}
