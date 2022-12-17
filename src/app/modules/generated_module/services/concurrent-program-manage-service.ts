import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ConcurrentProgramInputDto } from '../dtos/concurrent-program-input-dto';
import { ConcurrentProgramCopyDto } from '../dtos/concurrent-program-copy-dto';
import { ConcurrentProgramSerialDto } from '../dtos/concurrent-program-serial-dto';
import { ConcurrentProgramParameterDto } from '../dtos/concurrent-program-parameter-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';


@Injectable()
/** 快码管理服务 */
export class ConcurrentProgramManageService {
    constructor(
      private appApiService: AppApiService,
      private http: _HttpClient) { }

    /*Insert(dto: ConcurrentProgramInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/inserconcurrprog',
            {
                dto
            });
    }*/

    /*Update(dto: ConcurrentProgramInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/updateconcurrprog',
            {
                dto
            });
    }*/

    save(dto: {[key: string]: any}): Observable<ResponseDto> {
      return this.http.post<ResponseDto>(
        '/api/admin/baseConcurrentPrograms/save',
        dto
      );
    }

    Copy(dto: {[key: string]: any}): Observable<ResponseDto> {
        return this.http.post(
          '/api/admin/baseConcurrentPrograms/copy',
          dto
        );
    }

    /*Delete(dto: ConcurrentProgramInputDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/delete',
            {
                dto
            });
    }*/

    saveSerial(dto: {[key: string]: any}): Observable<ResponseDto> {
      return this.http.post<ResponseDto>(
        '/api/admin/baseConcurrentPrograms/saveSerial',
        dto
      );
    }

    /*UpdateSerial(dto: ConcurrentProgramSerialDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/updateconcprogserial',
            {
                dto
            });
    }

    InsertSerial(dto: ConcurrentProgramSerialDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/insertConcporgserial',
            {
                dto
            });
    }*/

    DeleteSerial(dto: {[key: string]: any}): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
          '/api/admin/baseConcurrentPrograms/deleteSerial',
          dto
        );
    }

    GetApplication(): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/admin/baseexecutables/queryApplicationModule'
        );
    }

    // 获取参数列表
    GetFlexValueSets(): Observable<ResponseDto> {
        return this.http.get(
          '/api/admin/baseConcurrentPrograms/getValueSets'
        );
    }

    // 获取参数
    GetParameter(concurrentProgramId: string, pageIndex: number, pageSize: number): Observable<ResponseDto> {
        return this.http.get(
          '/api/admin/baseConcurrentPrograms/queryParameter',
          { concurrentProgramId, pageIndex, pageSize }
        );
    }

    // 获取参数列表
    Getprogramserialquery(runningConcurrentProgramId: string, pageIndex: number, pageSize: number): Observable<ResponseDto> {
        return this.http.get(
          '/api/admin/baseConcurrentPrograms/querySerial',
          { runningConcurrentProgramId, pageIndex, pageSize }
        );
    }

    DeleteParameter(ids: string[]): Observable<ResponseDto> {
        return this.http.post(
          '/api/admin/baseConcurrentPrograms/deleteParameter',
          ids
        );
    }

    saveParameter(dto: {[key: string]: any}): Observable<ResponseDto> {
      return this.http.post(
        '/api/admin/baseConcurrentPrograms/saveParameter',
        dto
      );
    }

    /*InsertParameter(dto: ConcurrentProgramParameterDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/insertconcprogparameter',
            {
                dto
            });
    }

    UpdateParameter(dto: ConcurrentProgramParameterDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/updateconcprogparameter',
            {
                dto
            });
    }*/

    UpdateConflictParameter(id: string, conflictParameter: string): Observable<ResponseDto> {
       return this.http.get(
         '/api/admin/baseConcurrentPrograms/updateConflictParameter',
         { id, conflictParameter }
       );
    }

    GetExecutableData(): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/admin/baseConcurrentPrograms/getExecutions'
        );
    }

    GetConcProgLov(): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/admin/baseConcurrentPrograms/getPrograms'
        );
    }


    // 并发程序
    GetConcProg(): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
          '/api/admin/baseConcurrentPrograms/getIncompatibleProgram'
        );
    }

    /*GetRequestType(): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/getrequesttype',
            {
            }, { method: 'GET' });
    }

    GetLookupByType(type: String): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/getlookupbytype?type=' + type,
            {

            },
            { method: 'GET' }
        );
    }

    // 获取默认值类型
    GetDefaultType(): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/getdefaulttype',
            {

            },
            { method: 'GET' }
        );
    }

    // 获取范围
    GetRegion(): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/getregion',
            {

            },
            { method: 'GET' }
        );
    }

    GetOutPutFileType(): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/getlookupbytype?type=BASE_CONC_OUTPUT_FILE_TYPE',
            {
            }, { method: 'GET' });
    }

    QueryOne(concurrent_program_id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/queryone?concurrent_program_id=' + concurrent_program_id,
            {
            }, { method: 'GET' });
    }*/


    QueryMainFormByPage(requestParams: {[key: string]: any}): Observable<ResponseDto> {
        return this.http.get(
          '/api/admin/baseConcurrentPrograms/query',
          { ...requestParams }
        );
    }

    // 获取参数列表
    /*GetParameterList(parameter_id: String): Observable<any> {
        return this.appApiService.call<any>(
            '/afs/serverbaseconcurrentprogram/concurrentprogramservice/getparameterlist?parameter_id=' + parameter_id,
            {

            },
            { method: 'GET' }
        );
    }*/
}
