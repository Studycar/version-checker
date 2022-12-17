import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { CommonQueryService } from '../../generated_module/services/common-query.service';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../services/app-translation-service';
import { FileDownloadUploadService } from '../services/file-download-upload-service';

/*
author:lijian
date:2018-08-20
function:文件导出的公共窗口
使用方法：
<custom-select-lookup [valueObject]="valueObject" [valueField]="valueField"  [value]="value"  [width]="200" [lookupType]="'SYS_ENABLE_FLAG'" (getSelectOption)="getSelectOption($event)"></custom-select-lookup>
*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'custom-file-export-msg',
  templateUrl: '../views/custom-file-export-msg.html',
  providers: [CommonQueryService],
})
export class CustomFileExportMsgComponent implements OnInit, AfterViewInit {
  /**文件的下载路径 */
  public filePath: string;
  /**服务器返回的文件路径 */
  public fileDownloadUrl: string;
  /**文件的下载路径 */
  public showDownloadUrl = false;
  /**显示下载路径 */
  public showProgress = false;
  /**是否显示滚动条 */
  public progressPercent = 0;
  /**进度值 */
  public progressOpCode = '';
  /**操作的CODE值 */
  public outputFileName = '';
  /**输出的文件名 */
  public autoGetFileNameByPath = false;
  /**是否自动根据path分析出下载文件的名字 */
  public isDone = false;
  /**表示该操作是否已经完成 */
  public msgTips = '';
  /**显示的提示语 */
  public msgTipsTemplate =
    '文件生成中，{timesLengthStr}请稍后...';
  /**显示的提示语 */
    // public timesLengthTemplate = '预计需要花费{timesLength}秒，';
  public timesLengthTemplate = '预计剩余{timesLength}秒，';
  public timeoutID: any = null;
  /**timeout的id，关闭窗口需要释放 */
  public progressStatus =
    'normal';
  /**是否异常 'success' | 'exception' | 'active' | 'normal'*/
  spokesmanImgSrc: string;

  /** 代言人图片路径**/
  constructor(
    private modal: NzModalRef,
    public _http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    public fileDownloadUploadService: FileDownloadUploadService,
  ) {
  }

  ngOnInit() {
    this.spokesmanImgSrc = `../../../../assets/imgs/animation_spokesman.gif?${Math.random()}`;

    if (this.filePath) {
      this.fileDownloadUrl = this.fileDownloadUploadService.getFileDownloadUrl({
        FilePath: this.filePath,
        OutputFileName: this.outputFileName,
        AutoGetFileNameByPath: this.autoGetFileNameByPath,
      });
      this.showDownloadUrl = true;
    }
    // 后来改成了，进度条都是直接显示，所以当参数传入不显示进度条的时候，就把进度条设置为100
    // 如果显示进度条的话，那就不要直接显示100，而是通过请求去获取最新的进度
    if (!this.showProgress) {
      this.progressStatus = 'success';
      this.progressPercent = 100;
    }
    this.countProgress();
  }

  ngAfterViewInit() {
    if (this.fileDownloadUrl) {
      // window.location.href = this.fileDownloadUrl;
      this.fileDownloadUploadService.download({
        FilePath: this.filePath,
        OutputFileName: this.outputFileName,
        AutoGetFileNameByPath: this.autoGetFileNameByPath,
      });
    }
  }

  close() {
    console.log('CustomFileExportMsgComponent.close()' + this.timeoutID);
    clearTimeout(this.timeoutID);
    this.modal.destroy(this.isDone);
  }

  /**显示进度条 */
  countProgress() {
    if (!this.showProgress) return;
    this.doCountProgress();
  }

  /**获取进度 */
  doCountProgress() {
    const url =
      'afs/serverbaseprogress/progressservices/getprogress?opcode=' +
      this.progressOpCode;
    this._http.get(url).subscribe(res => {
      if (res && res.Success) {
        if (res.Extra) {
          // 显示tips内容
          if (res.Extra.RemainSeconds) {
            const timesLengthStr = this.timesLengthTemplate.replace(
              '{timesLength}',
              res.Extra.RemainSeconds,
            );
            this.msgTips = this.appTranslationService.translate(
              this.msgTipsTemplate.replace('{timesLengthStr}', timesLengthStr),
            );
          } else {
            this.msgTips = this.appTranslationService.translate(
              this.msgTipsTemplate.replace('{timesLengthStr}', ''),
            );
          }
        }
        // 处理进度条数据
        if (res.Extra.Progress >= 100 || res.Extra.Done) {
          this.progressPercent = 100;
          this.isDone = true;
          if (res.Extra.Result && res.Extra.Data) {
            this.progressStatus = 'success';
            this.progressPercent = res.Extra.Progress;
            const downloadParam = {
              FilePath: res.Extra.Data,
              OutputFileName: this.outputFileName,
              AutoGetFileNameByPath: this.autoGetFileNameByPath,
            };
            this.fileDownloadUrl = this.fileDownloadUploadService.getFileDownloadUrl(
              downloadParam,
            );
            this.showDownloadUrl = true;
            console.log(downloadParam, 'downloadParam');
            this.fileDownloadUploadService.download(downloadParam);
            // window.location.href = 'afs/serverbasefiledownloadupload/filedownloaduploadservice/downloadfile?filepath=' + res.Extra.Data;
          } else {
            this.progressStatus = 'exception';
            this.msgTips = this.appTranslationService.translate(
              '发生异常，请重试或者联系管理员！',
            );
          }
        } else {
          let interval = 900;
          this.progressPercent = res.Extra.Progress;
          if (this.timeoutID) {
            clearTimeout(this.timeoutID);
          }
          this.timeoutID = setTimeout(() => {
            this.doCountProgress();
          }, interval);
        }
      } else {
        this.isDone = true;
        this.progressStatus = 'exception';
        this.progressPercent = 100;
        this.msgTips = this.appTranslationService.translate(
          '发生异常，请重试或者联系管理员！',
        );
      }
    });
  }
}
