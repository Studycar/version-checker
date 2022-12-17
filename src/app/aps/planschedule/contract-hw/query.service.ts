import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { IdeSubmitService } from "app/modules/base_module/services/ide-submit.service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { NzMessageService } from "ng-zorro-antd";
import { Observable } from "rxjs";
import { decimal } from "@shared";

@Injectable()
export class PlanscheduleHWContractService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private ideSubmitService: IdeSubmitService,
  ) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/contract'
  public queryUrl = this.baseUrl + '/query';
  public getUrl = this.baseUrl + '/get';
  public getFormUrl = this.baseUrl + '/getContractInfo'
  public getSplitFormUrl = this.baseUrl + '/getSplitContractInfo'
  public getModifyFormUrl = this.baseUrl + '/getModifyContractInfo'
  private editUrl = this.baseUrl + '/save';
  public editSubmitUrl = this.baseUrl + '/editSubmit';
  public saveSubmitUrl = this.baseUrl + '/saveSubmit';
  private deleteUrl = this.baseUrl + '/delete';
  private deleteContractUrl = this.baseUrl + '/deleteContract';
  public queryChangeDetailUrl = '/api/ps/contractModifyRecord/query';
  private splitSaveUrl = this.baseUrl + '/splitSave';
  public splitSubmitUrl = this.baseUrl + '/splitSubmit';
  private modifySaveUrl = this.baseUrl + '/agreementSave';
  public modifySubmitUrl = this.baseUrl + '/agreementSubmit'; 
  public cancelSubmitUrl = this.baseUrl + '/relieveSubmit'; 
  public contractCloseUrl = this.baseUrl + '/contractClose';
  public contractReopenUrl = this.baseUrl + '/contractReopen';
  public contractOpenManualUrl = this.baseUrl + '/contractReopenManual';
  public calculateDepositUrl = this.baseUrl + '/calculateDeposit';

  private refreshUrl = this.baseUrl + '/page/task';
  private refreshSendUrl = this.baseUrl + '/refreshQuantityShippedSubmitRequest';

  getOne(id: string): Observable<ResponseDto> {
    return this.http.post(this.getUrl, {
      id: id
    });
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.editUrl, data);
  }

  refresh(plantCode, productCategory): Observable<ResponseDto> {
    return this.http.post(this.refreshUrl, {
      plantCode: plantCode,
      productCategory: productCategory,
    });
  }
  refreshSend(data): Observable<ResponseDto> {
    return this.http.post(this.refreshSendUrl, data);
  }

  submit(id: string, type: string): Observable<ResponseDto> {
    const url = type === 'edit' ? this.editSubmitUrl : this.saveSubmitUrl;
    return this.http.post(url, {
      id: id
    });
  }

  delete(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, ids)
  }

  /**
   * 删除子合同、变更协议
   * @param ids 子合同、变更协议id
   * @param contractId 原合同id
   * @returns
   */
  deleteContract(ids: string[], contractId: string): Observable<ResponseDto> {
    return this.http.post(this.deleteContractUrl + `?contractId=${contractId}`, ids);
  }

  /**
   * 启用定金计算
   * @param id
   * @param calculateDepositFlag
   */
  calculationDeposit(id: string, calculateDepositFlag: string): Observable<any> {
    return this.http.post(this.calculateDepositUrl, {
      id: id,
      calculateDepositFlag: calculateDepositFlag
    });
  }

  contractClose(id: string, state: string): Observable<any> {
    return this.http.post(this.contractCloseUrl, {
      id: id,
      contractState: state
    })
  }

  contractReopen(id: string, state: string): Observable<any> {
    return this.http.post(this.contractReopenUrl, {
      id: id,
      contractState: state
    })
  }

  contractOpenManual(id: string): Observable<any> {
    return this.http.post(this.contractOpenManualUrl, {
      id: id
    })
  }

  splitSave(data): Observable<ResponseDto> {
    return this.http.post(this.splitSaveUrl, data);
  }

  splitSubmit(data): Observable<ResponseDto> {
    return this.http.post(this.splitSubmitUrl, data);
  }

  modifySave(data): Observable<ResponseDto> {
    return this.http.post(this.modifySaveUrl, data);
  }

  modifySubmit(data): Observable<ResponseDto> {
    return this.http.post(this.modifySubmitUrl, data);
  }

  download(id, url: string = '/api/ps/contract/download'): Observable<ResponseDto> {
    return this.http.post(
      url,
      {
        id: id
      },
    );
  }

  pageDownload = (type: string, dataItem: any, downloadUrl: string = '/api/ps/contract/download') => {
    let msg = '';
    let serviceFunc = null;
    let timer;
    let timerIndex: number = 0;
    let catchMsg: string = ''; // 捕获下载、预览前端程序失败时的错误信息
    switch (type) {
      case 'down': // 合同下载
        dataItem.isDownloading = true;
        msg = '下载';
        serviceFunc = this.pageDownloadFile.bind(this);
        catchMsg = `${msg}失败`;
        break;
      case 'pre': // 合同预览
        dataItem.isPreviewing = true;
        msg = '打开';
        serviceFunc = this.pagePreviewFile.bind(this);
        catchMsg = '请先设置浏览器可弹出窗口';
        break;
      default:
        break;
    }
    let downMsgid = this.msgSrv.loading(`正在${msg}`, { nzDuration: 0 }).messageId;
    new Promise((resolve, reject) => {
      this.download(dataItem.id, downloadUrl).subscribe(res => {
        if(res.code === 200) {
          timer = setInterval(() => {
            timerIndex++;
            this.recept(res.data).subscribe(res1 => {
              if(res1.code === 200) {
                try {
                  serviceFunc(res1.data, dataItem.contractCode);
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
        this.clearTimer(timer, downMsgid, dataItem, type);
        this.msgSrv.success(this.appTranslationService.translate(resolve));
      },
      (reject: string) => {
        this.clearTimer(timer, downMsgid, dataItem, type);
        this.msgSrv.error(this.appTranslationService.translate(reject));
      }
    );
  }

  clearTimer(timer, downMsgid, dataItem, type) {
    this.msgSrv.remove(downMsgid);
    if(type === 'down') {
      dataItem.isDownloading = false;
    } else {
      dataItem.isPreviewing = false;
    }
    window.clearInterval(timer);
  }

  /** 判断价格差异后跳转到对应的 IDE 流程 */
  goToIdeContractFlow(id, options) {
    const { submitParams, modalRef, isCancel, isSplit, splitAffId, isModify, modifyAffId } = options
    this.http.post(this.getFormUrl, { id }).subscribe(res => {
      if(res.code === 200 && res.data) {
        const { affiliatedContract, affiliatedState, sameDayBasePrice, basePrice, rebateMarkup, quantityDj } = res.data;
        // console.log('in ==>', res.data)
        if (affiliatedContract && affiliatedState && ['30', '70', '100'].indexOf(affiliatedState) === -1) {
          return this.msgSrv.error(this.appTranslationService.translate('原合同不是已审核或驳回状态，无法再次提交'))
        }

        if (!isCancel) {
          if (!basePrice) {
            return this.msgSrv.error(this.appTranslationService.translate('基价不能为0或空'))
          }
          if (!sameDayBasePrice) {
            return this.msgSrv.error(this.appTranslationService.translate('当日开盘价不能为0或空'))
          }
          if (typeof rebateMarkup !== 'number') {
            return this.msgSrv.error(this.appTranslationService.translate('当前合同无对应返利，请先维护返利加价'))
          }
        } else if (!!quantityDj) {
          // 合同已分货量大于0，不能解除
          return this.msgSrv.error(this.appTranslationService.translate('当前合同已分货量大于0，不能解除'));
        }

        const hasDiff = decimal.add(sameDayBasePrice, rebateMarkup) !== basePrice
        let ideFlowPath = hasDiff ? 'ideContractDiff' : 'ideContract'
        if (isCancel) {
          ideFlowPath = hasDiff ? 'ideContractCancelDiff' : 'ideContractCancel'
        }
        let getFormUrl = this.getFormUrl;
        let getFormId = id;
        if (isSplit) {
          ideFlowPath = hasDiff ? 'ideContractSplitDiff' : 'ideContractSplit';
          getFormUrl = this.getSplitFormUrl;
          getFormId = splitAffId;
        }
        if (isModify) {
          ideFlowPath = hasDiff ? 'ideContractModifyDiff' : 'ideContractModify';
          getFormUrl = this.getModifyFormUrl;
          getFormId = modifyAffId;
        }

        const params: any = {
          getFormParams: {
            url: getFormUrl,
            method: 'POST',
            params: { id: getFormId }
          },
        }
        if (submitParams) {
          params.submitParams = submitParams
        }

        if (modalRef && modalRef.close) {
          modalRef.close(true)
        }

        this.ideSubmitService.navigate(ideFlowPath, params)
      } else {
        return this.msgSrv.error(this.appTranslationService.translate('请求合同最新信息失败'))
      }
    })
  }

}
