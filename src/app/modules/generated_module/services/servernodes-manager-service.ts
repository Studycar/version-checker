import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ServerNodesInputDto } from 'app/modules/generated_module/dtos/server-node-input-dto';
import { ResponseDto } from '../dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
/** 服务节点定义服务 */
export class ServerNodesManageService {
  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient,
  ) { }

  URL_Prefix = '/afs/serverbaseservernodesmanager/baseservernodesmanager/';

  Query(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/basenodes/querynodes'
    );
  }

  Edit(dto: {[key: string]: any}): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/api/admin/basenodes/editnodes',
      dto
    );
  }

  Remove(id: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/basenodes/removenodes',
      { id }
    );
  }
}
