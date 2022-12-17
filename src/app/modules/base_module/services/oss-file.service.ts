import { Injectable } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { NzMessageService } from "ng-zorro-antd";
import { Observable } from "rxjs";
import { ImageViewerComponent } from "../components/img-viewer/img-viewer.component";
import { AppTranslationService } from "./app-translation-service";
declare let previewFileByCordova: Function;
@Injectable()
export class OssFileService {
  constructor(
    public http: _HttpClient,
    public commonQueryService: PlanscheduleHWCommonService,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public modal: ModalHelper,
  ) {}

  private uploadUrl = '/api/ps/oss/attachInfo/front/upload'; // 保存文件链接到后端
  public upload2Url = '/api/ps/oss/attachInfo/front/upload2'; // 批量保存文件链接到后端 - 客户信息
  public batchUploadSaveUrl = '/api/ps/oss/attachInfo/front/batchUpload'; // 批量保存文件链接到后端 - 客诉申请明细
  private getUploadUrl = '/api/ps/oss/attachInfo/getUploadUrl';
  private getDownloadUrl = '/api/ps/oss/attachInfo/getDownloadUrl';
  private deleteFileUrl = '/api/ps/attachInfo/delete'; // 删除数据库中文件

  download(id, fileName) {
    this.GetDownloadUrl(id).subscribe(res => {
      if(res.code === 200) {
        this.doFileDownload(res.data).subscribe(res1 => {
          this.downloadFile(res1, fileName);
        })
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  async previewInApp(id) {
    const res = await this.getFileInfo(id).toPromise();
    if(res.code === 200) {
      this.previewFileInApp(window.location.origin + '/api/ps/oss/attachInfo/downloadFile?id=' + id, res.data.fileName, res.data.fileType, id);
    } else {
      this.msgSrv.error(this.appTranslationService.translate(res.msg));
    }
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
  previewFileInApp(fileUrl, fileName, fileType, id) {
    const type = fileType.slice(1);
    fileUrl = window.location.origin + '/api/ps/oss/attachInfo/downloadFile?id=' + id;
    try {
      if (type && ["pdf","ppt","pptx","xls","xlsx","txt","doc","docx"].includes(type)) {
        if ((window as any).cordova) {
          (window as any).cordova.exec(function(success) { 
            console.log('previewFileByCordova');
          }, function (error) { 
            alert("Error: " + error); 
          }, "MCDocumentViewer", "previewWithFiles", [{"url":fileUrl,"type":type,"title":fileName}]);
        }
      } else if (type && ["png","jpg","jpeg"].includes(type)) {
        this.modal.static(
          ImageViewerComponent,
          {
            fileUrl: fileUrl,
            fileName: fileName,
          }
        ).subscribe(() => {});
      } else {
        this.msgSrv.error(this.appTranslationService.translate('该格式不支持预览！'));
      }
    } catch (e) {
      console.log('previewFileInApp Error: ', e);
    }
  }

  getFileUrl(id): Observable<ResponseDto> {
    return this.http.get('/api/ps/oss/attachInfo/downloadFile?id='+id);
  }

  getFileInfo(id): Observable<ResponseDto> {
    return this.http.get('/api/ps/oss/attachInfo/getDownloadInfo?id='+id);
  }

  preview(id, fileType) {
    this.GetDownloadUrl(id).subscribe(res => {
      if(res.code === 200) {
        this.doFileDownload(res.data).subscribe(res1 => {
          this.previewFile(res1, fileType);
        })
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  async upload(file: File, busType, contractTemplate, remarks) {
    const GetUploadUrlRes = await this.GetUploadUrl(file.name).toPromise();
    if(GetUploadUrlRes.code === 200) {
      try {
        const uploadUrl = GetUploadUrlRes.data;
        const doFileUploadRes = await this.doFileUpload(file, uploadUrl).toPromise();
        const fileParams = {
          fileName: file.name,
          fileUrl: uploadUrl.split('?')[0],
          fileSize: file.size
        };
        const uploadSaveRes = await this.uploadSave(fileParams, busType, contractTemplate, remarks).toPromise();
        if(uploadSaveRes.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate("附件上传成功"));
          return true;
        } else {
          this.msgSrv.error(this.appTranslationService.translate(uploadSaveRes.msg));
        }
      }catch(e) {
        this.msgSrv.error(this.appTranslationService.translate("附件上传到服务器失败"))
      }
    } else {
      this.msgSrv.error(this.appTranslationService.translate(GetUploadUrlRes.msg));
    }
    return false;
  }

  /**
   * 附件上传到 oss
   * @param file 需要上传的文件
   * @param url 上传到阿里云的地址，通过GetUploadUrl获取
   * @returns 
   */
  doFileUpload(file: File, url: string): Observable<any> {
    const blob = new Blob([file]);
    return this.http.put(url, blob, {}, {
      headers: { "Content-Type": 'application/octet-stream' }
    });
  }

  /**
   * 将上传到 oss 的文件相关信息保存到后端
   * @param fileParams 附件相关参数：文件名、文件链接、文件大小 
   * @param busType 文件类型
   * @param contractTemplate 合同模板类型
   * @param remarks 备注
   * @param id 附件id参数：更新附件时需要
   * @returns 
   */
  uploadSave({fileName, fileUrl, fileSize}, busType, contractTemplate, remarks, id: string=''): Observable<any> {
    return this.http.post(`${this.uploadUrl}?busType=${busType}&contractTemplate=${contractTemplate}&remarks=${remarks}&id=${id}`, {
      fileName,
      fileUrl: decodeURI(fileUrl),
      fileSize,
    })
  }

  /**
   * 客户信息批量上传附件
   * @param param0 
   * @param busType 
   * @param remarks 
   * @returns 
   */
  upload2Save(fileList: {fileName,fileUrl,fileSize}[], busType='PS_CUSTOMER_HW'): Observable<ResponseDto> {
    fileList.forEach(file => {
      file.fileUrl = decodeURI(file.fileUrl)
    })
    return this.http.post(`${this.upload2Url}?busType=${busType}`, fileList);
  }

  /**
   * 客诉明细批量上传附件
   * @param param0 
   * @param id 客诉明细id，关联附件 
   * @param busType 
   * @returns 
   */
   batchUploadSave(fileList: {fileName,fileUrl,fileSize}[], id: string, busType='PS_COMPLAINT_DETAIL'): Observable<ResponseDto> {
    fileList.forEach(file => {
      file.fileUrl = decodeURI(file.fileUrl)
    })
    return this.http.post(`${this.batchUploadSaveUrl}?busType=${busType}&id=${id}`, fileList);
  }

  /**
   * 通过文件名获取生成的上传链接
   * @param fileName 文件名
   * @returns 
   */
  GetUploadUrl(fileName): Observable<any>{
    return this.http.get(this.getUploadUrl,{
      fileName: encodeURI(fileName)
    });
  }

  /**
   * 通过附件id获取附件下载链接
   * @param id 附件id
   * @returns 
   */
  GetDownloadUrl(id): Observable<any> {
    return this.http.get(this.getDownloadUrl,{
      id: id
    });
  }

  /**
   * 下载附件
   * @param filePath 文件oss地址
   * @returns 
   */
  doFileDownload(filePath): Observable<any> {
    return this.http.get(filePath, {}, {
      headers: { "Content-Type": 'application/octet-stream' },
      responseType: 'blob',
    });
  }

  downloadFile(data, fileName) {
    const blob = new Blob([data]);
    console.log(blob);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  previewFile(data, fileType) {
    const blob = new Blob([data], { type: fileType });
    console.log(blob);
    const url = URL.createObjectURL(blob);
    window.open(url);
    console.log(url);
    URL.revokeObjectURL(url);
  }

  /**
   * 通过后端删除附件
   * @param ids 附件id数组
   * @returns 
   */
  deleteFile(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteFileUrl, ids);
  }
}