import { Component, Input, OnInit, Optional, Output, SkipSelf } from "@angular/core";
import { NgForm } from "@angular/forms";
import { environment } from "@env/environment";
import { NzMessageService, UploadFile, UploadXHRArgs } from "ng-zorro-antd";
import { AppTranslationService } from "../../services/app-translation-service";
import { OssFileService } from "../../services/oss-file.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'common-upload',
  templateUrl: './common-upload.component.html',
})
export class CommonUploadComponent implements OnInit {
  @Input() multiple: boolean = false; // 是否多选，默认单附件
  @Input() limit: number = 0; // 附件数量控制，打开多选时有效，0 表示不限
  @Input() fileTypes: {[key: string]: string } = {}; // 限制文件类型
  @Input() Disabled: boolean = false;
  @Input() showUpload: boolean = true; // 是否显示上传按钮
  fileTypesKey: string[] = [];
  fileTypesName: string = '';
  fileList = []; // 未上传的附件
  @Input() annexs = []; // 已上传的附件
  deleteAnnexIds = []; // 已上传附件中需要删除的附件id列表
  @Input() descriptions: string = '';

  constructor(
    private ossFileService: OssFileService,
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    @SkipSelf() @Optional() private f: NgForm,
  ) {}

  ngOnInit(): void {
    this.fileTypesKey = Object.keys(this.fileTypes);
    this.fileTypesName = [...new Set(Object.values(this.fileTypes))].join('、');
    if(this.multiple && this.limit && this.descriptions === '') {
      this.descriptions = `（最多上传 ${this.limit} 个文件）`;
    }
  }

  beforeUpload = (file: UploadFile): boolean => {
    if(this.multiple && this.limit && this.annexs.length >= this.limit) {
      this.msgSrv.warning(this.appTranslationService.translate(`只能上传最多${this.limit}个文件`));
      return false;
    }
    if(this.fileTypesKey.length > 0 && this.fileTypesKey.findIndex(t => t === file.type) === -1) {
      this.msgSrv.warning(this.appTranslationService.translate(`只能上传${this.fileTypesName}文件`));
      return false;
    }
    if(!this.multiple) {
      // 单附件上传需要控制先清空附件列表
      this.fileList.length = 0;
      this.annexs.length = 0;
    }
    this.fileList = this.fileList.concat(file);
    this.annexs = this.annexs.concat(file);
    this.f.control.markAsDirty();
  };

  customReq = async (item: UploadXHRArgs) => {
    const uploadUrlRes = await this.ossFileService.GetUploadUrl(item.file.name).toPromise();
    if(uploadUrlRes.code === 200) {
      const uploadUrl = uploadUrlRes.data;
      return this.ossFileService.doFileUpload(item.file as any, uploadUrl).subscribe(res => {
        const file = this.fileList.find(f => f.uid === item.file.uid);
        if(file) {
          file.url = uploadUrl.split('?')[0];
        }
      });
    } else {
      item.onError(uploadUrlRes.msg, item.file);
    }
    return ;
  };

  onClickAnnex(annex) {
    if(annex.hasOwnProperty('id')) {
      this.downloadOldAnnex(annex);
    } else {
      this.downloadNewAnnex(annex);
    }
  }

  onDeleteAnnex(index: number) {
    this.f.control.markAsDirty();
    const fileListIndex = index - this.annexs.length + 1;
    if(fileListIndex >= 0) {
      this.fileList.splice(fileListIndex, 1);
    } else {
      this.deleteAnnexIds.push(this.annexs[index].id);
    }
    this.annexs.splice(index, 1);
  }
  fileType = {
    'pdf': 'application/pdf',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'txt': 'text/plain',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
  }
  downloadOldAnnex(annex) {
    if (environment.inApp) {
      try {
        this.ossFileService.previewInApp(annex.id);
      } catch(e) {
        console.log(e);
      }
    } else {
      this.ossFileService.download(annex.id, annex.name);
    }
  }

  downloadNewAnnex(annex: File) {
    const url = window.URL.createObjectURL(annex);
    const a = document.createElement('a');
    a.href = url;
    const fileName = annex.name;
    a.download = fileName;
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  getUploadFileList() {
    const fileList = [];
    this.fileList.forEach((file: File | any) => {
      fileList.push({
        fileName: file.name,
        fileUrl: file.url,
        fileSize: file.size
      })
    });
    return fileList;
  }

  async deleteFile() {
    if(this.deleteAnnexIds.length > 0) {
      const deleteRes = await this.ossFileService.deleteFile(this.deleteAnnexIds).toPromise();
      if(deleteRes.code !== 200) {
        this.msgSrv.error(this.appTranslationService.translate(deleteRes.msg));
        return false;
      }
    }
    return true;
  }
}