import { Component, OnInit } from '@angular/core';
import { extend } from 'webdriver-js-extender';
import { ActivatedRoute, Router } from '@angular/router';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzModalRef, UploadFile, NzMessageService } from 'ng-zorro-antd';
import { HttpRequest, HttpResponse, HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { AppTranslationService } from '../../services/app-translation-service';
import { BaseImportsService } from '../../services/base-imports.service';
import { UtilService } from '../../services/util.service';
import { FileDownloadUploadService } from '../../services/file-download-upload-service';

@Component({
  selector: 'app-imports-modal',
  templateUrl: './imports-modal.component.html',
  styles: [],
})
export class ImportsModalComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public _http: _HttpClient,
    public http: HttpClient,
    public msgSrv: NzMessageService,
    public appTransSrv: AppTranslationService,
    public modalHelper: ModalHelper,
    public modalRef: NzModalRef,
    public importsSrv: BaseImportsService,
    public utilSrv: UtilService,
    public fileDownloadUploadService: FileDownloadUploadService,
  ) {}
  public i: any;
  /**配置的code值 */
  public importConfigCode: any = '';
  public downloading = false; /**是否在下载中 */
  public doingUpload = false; /**是否正在操作上传 */
  public uploading = false; /**是否在上传中 */
  public fileList: UploadFile[] = [];
  public progressPercent = 0; /**进度值 */
  public progressOpCode = ''; /**操作的CODE值 */
  public outputFileName = ''; /**输出的文件名 */
  public autoGetFileNameByPath = false; /**是否自动根据path分析出下载文件的名字 */
  public msgTips = ''; /**显示的提示语 */
  public msgTipsTemplate =
    '数据导入中，{timesLengthStr}请稍后...'; /**显示的提示语 */
  // public timesLengthTemplate = '预计需要花费{timesLength}秒，';
  public timesLengthTemplate = '预计剩余{timesLength}秒，';
  public timeoutID: any = null; /**timeout的id，关闭窗口需要释放 */
  public progressStatus =
    'normal'; /**是否异常 'success' | 'exception' | 'active' | 'normal'*/
  public isDone = false; /**表示该操作是否已经完成 */
  public startShowProgress = false; /**是否开始显示进度条 */

  ngOnInit() {
    this.loadImportConfig();
  }

  beforeUpload = (file: UploadFile): boolean => {
    // this.fileList = this.fileList.concat(file);
    this.fileList = [file];
    this.startShowProgress = false;
    return false;
  }

  /**下载模板文件 */
  downloadTemplateFile() {
    console.log(this.i);
    this.fileDownloadUploadService.download({
      FilePath: this.i.templateFilePath,
    });
  }

  /**开始上传 */
  handleUpload(): void {
    const formData = new FormData();
    // tslint:disable-next-line:no-any
    this.fileList.forEach((file: any, index: number) => {
      // formData.append(index.toString(), file);
      formData.append("file", file);
    });
    // 上传失败重新上传时，重新初始化状态属性值
    this.doingUpload = true;
    this.progressPercent = 0;
    this.isDone = false;
    this.progressStatus = 'normal';
    // You can use any AJAX library you like
    console.log(this.i.actionUrl, 'this.i.actionUrl');
    console.log(this.i, 'this.i');
    const url = this.i.actionUrl + '?importCode=' + this.i.code;
    const req = new HttpRequest('POST', url, formData, {
      // reportProgress: true
    });
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        result => {
          console.log('upload result');
          console.log(result);
          const respObj = { ...(result as any).body };
          this.doingUpload = false;
          if (respObj.code === 200) {
            this.progressOpCode = respObj.data;
            this.countProgress();
            this.startShowProgress = true;
            this.uploading = true;
          } else {
            this.msgSrv.error('导入失败！' + respObj.msg);
          }
        },
        () => {
          this.doingUpload = false;
          this.msgSrv.error('导入失败！');
        },
      );
  }

  /**加载导入配置 */
  loadImportConfig() {
    console.log('this.importConfigCode：' + this.importConfigCode);
    this.downloading = true;
    if (!this.utilSrv.isStrEmpty(this.importConfigCode)) {
      this.importsSrv.get({ codes: [this.importConfigCode] }).subscribe(res => {
        if (!this.utilSrv.isArrayEmpty(res.data)) {
          this.i = res.data[0];
        }
        this.downloading = false;
      });
    }
  }

  close() {
    this.modalRef.destroy(this.isDone);
  }

  /**显示进度条 */
  countProgress() {
    this.doCountProgress();
  }

  /**获取进度 */
  doCountProgress() {
    const url =
      'api/admin/baseprogress/getprogress?opcode=' +
      this.progressOpCode;
    this._http.get(url).subscribe(res => {
      if (res && res.code==200) {
        if (res.data) {
          // 显示tips内容
          if (res.data.remainSeconds) {
            const timesLengthStr = this.timesLengthTemplate.replace(
              '{timesLength}',
              res.data.remainSeconds,
            );
            this.msgTips = this.appTransSrv.translate(
              this.msgTipsTemplate.replace('{timesLengthStr}', timesLengthStr),
            );
          } else {
            this.msgTips = this.appTransSrv.translate(
              this.msgTipsTemplate.replace('{timesLengthStr}', ''),
            );
          }
        }
        // 处理进度条数据
        if (res.data.progress >= 100 || res.data.done) {
          this.progressPercent = 100;
          this.isDone = true;
          this.uploading = false;
          if (res.data.result && res.data.data) {
            if (res.data.data.result) {
              this.progressStatus = 'success';
              this.progressPercent = res.data.progress;
              this.fileList = [];
              this.msgTips = this.appTransSrv.translate('导入完成！');
            } else {
              this.progressStatus = 'exception';
              if (res.data.data.message) {
                this.msgSrv.error(res.data.data.message);
                this.msgTips = this.appTransSrv.translate(
                  res.data.data.message,
                );
              }else{
                this.msgTips = this.appTransSrv.translate(
                  '发生异常，请重试或者联系管理员！',
                );
              }
              if (res.data.data.errorDataFileUrl) {
                this.fileDownloadUploadService.download({
                  FilePath: res.data.data.errorDataFileUrl,
                  AutoGetFileNameByPath: this.autoGetFileNameByPath,
                  OutputFileName:
                    this.outputFileName || this.i.ERROR_OUTPUT_FILE_NAME,
                });
              }
            
            }
          } else {
            this.progressStatus = 'exception';
            this.msgTips = this.appTransSrv.translate(
              '发生异常，请重试或者联系管理员！',
            );
          }
        } else {
          let interval = 900;
          this.progressPercent = res.data.progress;
          if (this.timeoutID) {
            clearTimeout(this.timeoutID);
          }
          this.timeoutID = setTimeout(() => {
            this.doCountProgress();
          }, interval);
        }
      } else {
        this.isDone = true;
        this.uploading = false;
        this.progressStatus = 'exception';
        this.progressPercent = 100;
        this.msgTips = this.appTransSrv.translate(
          '发生异常，请重试或者联系管理员！',
        );
      }
    });
  }
}
