import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";
import { PlanscheduleHWCommonService } from "app/modules/generated_module/services/hw.service";
import { Observable } from "rxjs";

@Injectable()
export class CustomerComplaintQueryService extends PlanscheduleHWCommonService {
  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
  }

  private baseUrl = '/api/ps/complaint';
  public queryUrl = this.baseUrl + '/query';
  private getOneUrl = this.baseUrl + '/get';
  private saveUrl = this.baseUrl + '/save';
  private deleteUrl = this.baseUrl + '/delete';
  private submitUrl = this.baseUrl + '/submitAudit';
  public queryHistoryUrl = this.baseUrl + '/history/query';
  private baseDetailedUrl = '/api/ps/complaint/detail';
  public queryDetailedUrl = this.baseDetailedUrl + '/query';
  public getDetailedOneUrl = this.baseDetailedUrl + '/get';
  public queryDetailedHistoryUrl = this.baseDetailedUrl + '/history/query';
  private agreeUrl = this.baseDetailedUrl + '/agree';
  private rejectUrl = this.baseDetailedUrl + '/reject';
  private saveDetailedUrl = this.baseDetailedUrl + '/save';
  private importUrl = this.baseDetailedUrl + '/importData';
  private deleteDetailedUrl = this.baseDetailedUrl + '/delete';
  private uploadFileUrl = '/api/ps/oss/attachInfo/batchUpload';
  private batchDownloadUrl = this.baseDetailedUrl + '/download';
  private rectifyUrl = this.baseDetailedUrl + '/pushMom001';

  getOne(id: string): Observable<ResponseDto> {
    return this.http.post(this.getOneUrl, {
      id: id
    });
  }

  save(data): Observable<ResponseDto> {
    return this.http.post(this.saveUrl, data);
  }

  delete(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteUrl, ids);
  }

  submit(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.submitUrl, ids);
  }
    
  Import(data): Observable<ResponseDto> {
    return this.http.post(this.importUrl, data);
  }

  getDetailedOne(id: string): Observable<ResponseDto> {
    return this.http.post(this.getDetailedOneUrl, {
      id: id
    });
  }

  agreeDetailedOne(id: string): Observable<ResponseDto> {
    return this.http.post(this.agreeUrl + `?id=${id}`);
  }

  rejectDetailedOne(id: string): Observable<ResponseDto> {
    return this.http.post(this.rejectUrl + `?id=${id}`);
  }

  saveDetailed(data): Observable<ResponseDto> {
    return this.http.post(this.saveDetailedUrl, data);
  }

  deleteDetailed(ids: string[]): Observable<ResponseDto> {
    return this.http.post(this.deleteDetailedUrl, ids);
  }

  uploadFile(formData) :Observable<ResponseDto> {
    return this.http.post(this.uploadFileUrl, formData);
  }

  deleteAnnex(ids): Observable<ResponseDto> {
    return this.http.post('/api/ps/attachInfo/delete', ids);
  }

  rectify(dto): Observable<ResponseDto> {
    return this.http.post(this.rectifyUrl, dto);
  }


  downloadBatch(id: string): Observable<any> {
    return this.http.post(
      this.batchDownloadUrl,
      null,
      { id: id },
      {
        responseType: 'blob',
        headers: { 'Content-Type': 'application/json; application/octet-stream' },
        observe: 'response',
        withCredentials: true,
      },
    );
  }
}