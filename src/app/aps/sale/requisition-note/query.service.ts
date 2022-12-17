import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { NzMessageService } from "ng-zorro-antd";
import { Observable } from "rxjs";

@Injectable()
export class RequisitionNoteQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/requisition/note';
  private baseDetailedUrl = '/api/ps/requisition/note/detailed';
  public queryChangeDetailUrl = this.baseUrl + '/history/query';
  public queryDetailChangeDetailUrl = this.baseDetailedUrl + '/history/query';
  public queryUrl = this.baseUrl + '/query';
  public taskUrl = this.baseUrl + '/page/task';
  public queryDetailUrl = this.baseDetailedUrl + '/query';
  private getOneUrl = this.baseUrl + '/get';
  private getDetailedOneUrl = this.baseDetailedUrl + '/get';
  private saveUrl = this.baseUrl + '/save';
  private detailSaveUrl = this.baseDetailedUrl + '/save';
  private deleteUrl = this.baseUrl + '/delete';
  private deleteDetailedUrl = this.baseDetailedUrl + '/delete';
  private printDetailedUrl = this.baseDetailedUrl + '/printPdf';
  private batchUpdateDistUrl = this.baseDetailedUrl + '/batchUpdate';

  delete(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, ids)
  }

  deleteDetailed(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteDetailedUrl, ids)
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data)
  }

  detailSave(data): Observable<ResponseDto> {
    return this.http.post(this.detailSaveUrl, data)
  }

  getOne(id: string): Observable<ResponseDto> {
    return this.http.post(this.getOneUrl, {
      id: id
    })
  }

  task(plantCode,productCategory): Observable<ResponseDto> {
    return this.http.post(this.taskUrl, {
      plantCode: plantCode,
      productCategory: productCategory,
    });
  }

  getDetailedOne(id: string): Observable<ResponseDto> {
    return this.http.post(this.getDetailedOneUrl, {
      id: id
    })
  }

  printDetailed(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.printDetailedUrl, ids);
  }

  batchUpdateDist(distributionWarehouse, ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.batchUpdateDistUrl + '?distributionWarehouse=' + distributionWarehouse, ids);
  }

  pageDownload = (dataItem: any) => {
    let msg = '打印';
    let timer;
    let timerIndex: number = 0;
    let catchMsg: string = `${msg}失败`; // 捕获下载、预览前端程序失败时的错误信息
    dataItem.isDownloading = true;
    let serviceFunc = this.pageDownloadFile.bind(this);
    let downMsgid = this.msgSrv.loading(`正在${msg}`, { nzDuration: 0 }).messageId;
    new Promise((resolve, reject) => {
      this.printDetailed(dataItem.ids).subscribe(res => {
        if(res.code === 200) {
          timer = setInterval(() => {
            timerIndex++;
            this.recept(res.data).subscribe(res1 => {
              if(res1.code === 200) {
                try {
                  const fileName = 'ZH' + this.formatDateTime2(new Date(), 'yyyy-MM-dd HH:mm').replaceAll(/[-:\s]/g, '');
                  serviceFunc(res1.data, fileName);
                  resolve(`${msg}成功`);
                } catch(e) {
                  console.log(e);
                  reject(catchMsg);
                }
              } else if(timerIndex === 5) {
                reject(res1.msg);
              }
            });
          }, 3000);
        } else {
          reject(res.msg);
        }
      })
    }).then(
      (resolve: string) => {
        this.clearTimer(timer, downMsgid, dataItem);
        this.msgSrv.success(this.appTranslationService.translate(resolve));
      },
      (reject: string) => {
        this.clearTimer(timer, downMsgid, dataItem);
        this.msgSrv.error(this.appTranslationService.translate(reject));
      }
    );
  }

  clearTimer(timer, downMsgid, dataItem) {
    this.msgSrv.remove(downMsgid);
    dataItem.isDownloading = false;
    window.clearInterval(timer);
  }
}