import { Component, OnInit, ViewChild } from '@angular/core';
import {NzModalRef, NzMessageService, UploadFile} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

import {CommonQueryService} from '../../../../modules/generated_module/services/common-query.service';
import {AttachInfoService} from '../../attachInfo/attachInfo.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { OssFileService } from 'app/modules/base_module/services/oss-file.service';
import { CommonUploadComponent } from 'app/modules/base_module/components/common-upload/common-upload.component';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'attachInfo-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
  providers: [AttachInfoService]
})
export class AttachInfoEditComponent implements OnInit {
  busTypeOptions: any[] = [];
  contractTemplates: any[] = [];
  fileTypes = {
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/msword': '.doc',
  }
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  fileList = []; // 存放图片文件
  previewImage: string | undefined = '';
  previewVisible = false;
  annexs = [];
  isImageFile: Boolean = false; // 是否图片文件
  isSpinning: Boolean = true;
  @ViewChild('f', { static: true }) f: NgForm;
  @ViewChild('commonUpload', { static: true }) commonUpload: CommonUploadComponent;

  readOnly: boolean;
  i: any;
  iClone: any;
  // 控制
  plantCode: string;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public commonQueryService: CommonQueryService,
    private appTranslationService: AppTranslationService,
    private contractService: AttachInfoService,
    private appConfigService: AppConfigService,
    private sanitizer: DomSanitizer,
    private ossFileService: OssFileService,
  ) { }

  ngOnInit(): void {
    this.initLoadData();
    this.loadData();
  }


  loadData() {
      if (this.i.id != null) {
          this.readOnly = true;
          /** 初始化编辑数据 */
          this.contractService.get(this.i.id).subscribe(resultMes => {
              this.i = resultMes.data;
              this.i.contractTemplate = this.i.attribute5;
              this.annexs.push({
                id: this.i.id,
                name: this.i.fileName,
                url: this.i.fileUrl,
                size: this.i.fileSize,
              });
              this.iClone = Object.assign({}, this.i);
          });
      } else {
          this.readOnly = false;
          this.isSpinning = false;
          this.i.busType = 'PS_CONTRACT';
          this.f.control.markAsDirty();
      }
  }

  initLoadData () {
    /** 产线类别 */
    this.commonQueryService.GetLookupByTypeLang('PS_BUSINESS_TYPE', this.appConfigService.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.busTypeOptions.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });
    /** 模板类型 */
    this.commonQueryService.GetLookupByTypeLang('PS_CONTRACT_TEMPLATE', this.appConfigService.getLanguage())
      .subscribe(res => {
        res.Extra.forEach(element => {
          this.contractTemplates.push({
            label: element.meaning,
            value: element.lookupCode,
          });
        });
      });
  }

  /**
   * 保存
   * @param value
   */
  save(value: any) {
    const fileList = this.commonUpload.getUploadFileList();
    if(fileList.length > 0) {
      const file = fileList[0];
      this.ossFileService.uploadSave(file, this.i.busType, this.i.contractTemplate, this.i.remarks || '', this.i.id || '').subscribe((res) => {
        if(res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate('附件上传成功'));
          this.modal.close(true);
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    } 
  }

  verifyAttach(f) {
    return f.invalid || !f.dirty || this.commonUpload.fileList.length === 0;
  }

  /**
   * 关闭
   */
  close() {
    this.modal.destroy();
  }

  /**
   * 清空
   */
  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
