import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { EtyRequest, EtyRequestSet } from '../dtos/request-submit-query-dto';
import { AppConfigService } from '../../base_module/services/app-config-service';
import { ResponseDto } from '../dtos/response-dto';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class RequestSubmitQueryService {
    constructor(private appApiService: AppApiService,
        public appConfigService: AppConfigService,
        public http: _HttpClient) { }
    /*******************************************Java版本********************************************* */
    baseUrl = '/api/admin/baseConcurrentRequests/';
    // 获取请求
    getRequest(Params: any, pageIndex: number, pageSize: number): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(this.baseUrl + 'pageRequest',
            {
                radioValue: Params.radioValue,
                currentUserId: Params.currentUserId,
                userId: Params.userId,
                parentRequestId: Params.parentRequestId,
                requestId: Params.requestId,
                programId: Params.programId,
                requestDate: Params.requestDate,
                actualCompDate: Params.actualCompDate,
                statusCode: Params.statusCode,
                phaseCode: Params.phaseCode,
                days: Params.days,
                pageIndex: pageIndex,
                pageSize: pageSize,
                export: false
            });
    }
    // 获取用户信息
    getUser(): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'listusers',
            {
            });
    }
    // 获取并发程序
    getProgram(): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'listConcurrentPrograms',
            {
            });
    }
    // 根据职责获取程序信息
    getRespProgram(resp_id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'listConcurrentProgramsResp?respId=' + resp_id,
            {
            });
    }
    // 提交请求
    submitRequest(dto: EtyRequest): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.baseUrl + 'submitRequest',
            dto);
    }
    // 选择要提交的并发程序时加载默认参数信息
    getConcProgParam(concurrent_program_id: string, ): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'getConcProgparam?concurrentProgramId=' + concurrent_program_id,
            {
            });
    }
    // 弹出参数选择窗体时加载参数信息到界面
    getConcProgParamByProgId(param: any): Observable<ResponseDto> {
        const dicParaValue: any[] = [];
        for (const key in param.dicParamValue) {
            dicParaValue.push({
                key: key,
                paramEntity: param.dicParamValue[key]
            });
        }

        return this.http.post<ResponseDto>(
            this.baseUrl + 'getConcProgParamByProgId',
            {
                concurrentProgramId: param.concurrentProgramId,
                boolRead: param.IsRead,
                listParaEntity: dicParaValue
            });
    }
    // 参数界面下拉查询值集对应数据源
    getArgumentFlex(flex_value_set_id: string, nDicFlexNameVal: any, filter: string, pageIndex: number, pageSize: number): Observable<ResponseDto> {
        const dicFlexNameVal: any[] = [];
        for (const key in nDicFlexNameVal) {
            dicFlexNameVal.push({
                key: key,
                paramEntity: nDicFlexNameVal[key]
            });
        }
        return this.http.post<ResponseDto>(
            this.baseUrl + 'pageArgumentFlex',
            {
                flexValueSetId: flex_value_set_id,
                listParaEntity: dicFlexNameVal,
                filter: filter,
                pageIndex: pageIndex,
                pageSize: pageSize
            });
    }
    // 获取先前请求
    getPreviousRequest(resp_id: string, user_id: string, filter: string, pageIndex: number, pageSize: number): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'pagePreviousRequest?respId=' + resp_id + '&userId=' + user_id + '&filter=' + filter + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize,
            {
            });
    }
    // 根据请求ID获取请求信息
    getBaseConcurrentRequest(request_id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'getBaseConcurrentRequest?requestId=' + request_id,
            {
            });
    }
    // 获取诊断信息
    getDiagnosis(request_id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'getDiagnostics?requestId=' + request_id,
            {
            });
    }
    // 暂挂或者取消暂挂
    updateHoldFlag(request_id: string, hold_flag: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'updateHoldFlag',
            {
                requestId: request_id,
                holdFlag: hold_flag
            });
    }
    // 取消请求
    cancelRequest(request_id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'cancelRequest',
            {
                requestId: request_id
            });
    }
    // 查看管理器请求
    getManagerRequest(CONTROLLING_MANAGER: string, pageIndex: number, pageSize: number): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'getManagerRequest?ConcurrentManagerId=' + CONTROLLING_MANAGER + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize,
            {
            });
    }
    // 下载输出文件
    downloadOutPut(request_id: string, outputFileName: string, output_file_type: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'getOutput?requestId=' + request_id + '&outputFileName=' + outputFileName + '&outputFileType=' + output_file_type,
            {
            });
    }
    // 获取日志
    getLogText(request_id: string, logFileName: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'getLogText?requestId=' + request_id + '&logFileName=' + logFileName,
            {
            });
    }
    // 修改参数
    updateParameters(request_id: string, argument_text: string, dicParam: any): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.baseUrl + 'updateParameters',
            {
                requestId: request_id,
                argumentText: argument_text,
                dic: dicParam
            });
    }
    // 修改请求运行计划
    updateRequestPlan(REQUEST_ID: string, PRIORITY: string, REQUESTED_START_DATE: string, Params: any): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.baseUrl + 'updateRequestPlan',
            {
                requestId: REQUEST_ID,
                scheduleType: Params.scheduleType,
                priority: PRIORITY,
                requestedStartDate: REQUESTED_START_DATE,
                scheduleStartDate: Params.runningTime,
                scheduleEndDate: Params.resubmitEndDate,
                resubmitInterval: Params.resubmitInterval,
                resubmitIntervalUnitCode: Params.resubmitIntervalUnitCode,
                resubmitIntervalTypeCode: Params.resubmitIntervalTypeCode,
                incrementDates: Params.incrementDates ? 'Y' : 'N'
            });
    }
    // 根据职责获取请求集信息
    getRespRequestSet(resp_id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'listRequestSetsResp?respId=' + resp_id,
            {
            });
    }
    // 选择要提交的请求集时加载默认参数信息
    getRequestSetArgument(request_set_id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'listRequestSetArgument',
            {
                requestSetId: request_set_id
            });
    }
    // 获取先前请求集
    getPreviousRequestSet(resp_id: string, user_id: string, filter: string, pageIndex: number, pageSize: number): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'pagePreviousRequestSet?respId=' + resp_id + '&userId=' + user_id + '&filter=' + filter + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize,
            {
            });
    }
    // 复制请求集时根据请求集ID获取请求集参数
    getBaseRequestSetRunArgs(request_id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'listRequestSetRunArgs?requestId=' + request_id,
            {
            });
    }
    // 提交请求集
    submitRequestSet(dto: EtyRequestSet): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.baseUrl + 'submitRequestSet',
            dto);
    }
    /*******************************************C#版本********************************************* */
    URL_Prefix = '/afs/serverbaserequestsubmitquery/baserequestsubmitquery/';

    GetManagerRequest(CONTROLLING_MANAGER: string, pageIndex: number, pageSize: number): Observable<GridSearchResponseDto> {
        return this.appApiService.call<GridSearchResponseDto>(
            this.URL_Prefix + 'getmanagerrequest?ConcurrentManagerId=' + CONTROLLING_MANAGER + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize,
            {
            }, { method: 'GET' });
    }

    GetUser(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'getusers',
            {
            }, { method: 'GET' });
    }

    GetProgram(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'querybase_concurrent_programs_vl',
            {
            }, { method: 'GET' });
    }

    // 获取请求
    GetRequest(Params: any, pageIndex: number, pageSize: number): Observable<GridSearchResponseDto> {
        return this.appApiService.call<GridSearchResponseDto>(
            this.URL_Prefix + 'queryrequest',
            {
                RADIO_VALUE: Params.RADIO_VALUE,
                CURRENT_USER_ID: Params.CURRENT_USER_ID,
                USER_ID: Params.USER_ID,
                PARENT_REQUEST_ID: Params.PARENT_REQUEST_ID,
                REQUEST_ID: Params.REQUEST_ID,
                PROGRAM_ID: Params.PROGRAM_ID,
                REQUEST_DATE: Params.REQUEST_DATE,
                ACTUAL_COMP_DATE: Params.ACTUAL_COMP_DATE,
                STATUS_CODE: Params.STATUS_CODE,
                PHASE_CODE: Params.PHASE_CODE,
                DAYS: Params.DAYS,
                pageIndex: pageIndex,
                pageSize: pageSize
            }, { method: 'POST' });
    }

    // 暂挂或者取消暂挂
    UpdateHold_Flag(request_id: string, hold_flag: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'updatehold_flag',
            {
                request_id: request_id,
                hold_flag: hold_flag
            });
    }

    // 获取诊断信息
    GetDiagnosis(request_id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'getdiagnosisbyrequest_id?request_id=' + request_id,
            {
            }, { method: 'GET' });
    }

    // 获取session信息
    GetSession(sid: string, inst_id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'getsessioninfo?sid=' + sid + '&inst_id=' + inst_id,
            {
            }, { method: 'GET' });
    }

    // 获取监听报告
    GetSqlMonitor(sid: string, inst_id: string, type: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'getsqlmonitor?sid=' + sid + '&inst_id=' + inst_id + '&type=' + type,
            {
            }, { method: 'GET' });
    }

    // 取消请求
    Cancel_Request(request_id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'cancel_request',
            {
                request_id: request_id
            });
    }

    // 根据职责获取程序信息
    GetRespProgram(resp_id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'getbase_concurrent_programs_vl?resp_id=' + resp_id,
            {
            }, { method: 'GET' });
    }

    // 修改请求运行计划
    UpdateRequestPlan(REQUEST_ID: string, PRIORITY: string, REQUESTED_START_DATE: string, Params: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'update_request_plan',
            {
                requestId: REQUEST_ID,
                schedule_type: Params.P_Schedule_type,
                Priority: PRIORITY,
                Requested_start_date: REQUESTED_START_DATE,
                Schedule_start_date: Params.P_running_time,
                Schedule_end_date: Params.P_Resubmit_end_date,
                Resubmit_interval: Params.P_Resubmit_interval,
                Resubmit_interval_unit_code: Params.P_Resubmit_interval_unit_code,
                Resubmit_interval_type_code: Params.P_resubmit_interval_type_code,
                Increment_dates: Params.P_increment_dates ? 'Y' : 'N'
            });
    }

    // 修改参数
    UpdateParameters(request_id: string, argument_text: string, dicParam: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'updateparameters',
            {
                request_id: request_id,
                argument_text: argument_text,
                dic: dicParam
            });
    }

    // 获取先前请求
    GetPreviousRequest(resp_id: string, user_id: string, filter: string, pageIndex: number, pageSize: number): Observable<GridSearchResponseDto> {
        return this.appApiService.call<GridSearchResponseDto>(
            this.URL_Prefix + 'getpreviousrequest?resp_id=' + resp_id + '&user_id=' + user_id + '&filter=' + filter + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize,
            {
            }, { method: 'GET' });
    }

    // 获取先前请求集
    GetPreviousRequestSet(resp_id: string, user_id: string, filter: string, pageIndex: number, pageSize: number): Observable<GridSearchResponseDto> {
        return this.appApiService.call<GridSearchResponseDto>(
            this.URL_Prefix + 'getpreviousrequestset?resp_id=' + resp_id + '&user_id=' + user_id + '&filter=' + filter + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize,
            {
            }, { method: 'GET' });
    }


    // 根据职责获取请求集信息
    GetRespRequestSet(resp_id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'getbase_request_sets_vl?resp_id=' + resp_id,
            {
            }, { method: 'GET' });
    }

    // 根据请求ID获取请求信息
    GetBaseConcurrentRequest(request_id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'getbase_concurrent_requests?request_id=' + request_id,
            {
            }, { method: 'GET' });
    }

    // 获取参数信息
    /* GetBaseConcProgParameter(concurrent_program_id: string): Observable<ActionResponseDto> {
           return this.appApiService.call<ActionResponseDto>(
               this.URL_Prefix + 'getbase_conc_prog_parameter_v?concurrent_program_id=' + concurrent_program_id,
               {
               }, { method: 'GET' });
       }*/

    // 提交请求
    SubmitRequest(dto: EtyRequest): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'insertsubmit_request',
            {
                ety: dto
            });
    }

    // 提交请求集
    SubmitRequestSet(dto: EtyRequestSet): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'insertsubmit_request_set',
            {
                ety: dto
            });
    }

    // 选择要提交的并发程序时加载默认参数信息
    GetConcProgParam(concurrent_program_id: string, ): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'getconcprogparam?concurrent_program_id=' + concurrent_program_id,
            {
            }, { method: 'GET' });
    }

    // 弹出参数选择窗体时加载参数信息到界面
    GetConcProgParamByProgId(param: any): Observable<ActionResponseDto> {
        const dicParaValue: any[] = [];
        for (const key in param.DicParamValue) {
            dicParaValue.push({
                key: key,
                paramEntity: param.DicParamValue[key]
            });
        }

        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'getconcprogparambyprogid',
            {
                concurrent_program_id: param.Concurrent_Program_Id,
                IsRead: param.IsRead,
                listParaEntity: dicParaValue
            });
    }

    // 参数界面下拉查询值集对应数据源
    GetArgumentFlex(flex_value_set_id: string, nDicFlexNameVal: any, filter: string, pageIndex: number, pageSize: number): Observable<GridSearchResponseDto> {
        const dicFlexNameVal: any[] = [];
        for (const key in nDicFlexNameVal) {
            dicFlexNameVal.push({
                key: key,
                paramEntity: nDicFlexNameVal[key]
            });
        }
        return this.appApiService.call<GridSearchResponseDto>(
            this.URL_Prefix + 'getargumentflex',
            {
                flex_value_set_id: flex_value_set_id,
                listParaEntity: dicFlexNameVal,
                filter: filter,
                pageIndex: pageIndex,
                pageSize: pageSize
            });
    }

    // 复制请求集时根据请求集ID获取请求集参数
    GetBase_request_set_run_args(request_id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'getbase_request_set_run_args?request_id=' + request_id,
            {
            }, { method: 'GET' });
    }

    // 选择要提交的请求集时加载默认参数信息
    GetRequestSetArgument(request_set_id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'getrequestsetargument',
            {
                request_set_id: request_set_id
            });
    }

    // 获取日志
    GetLogText(request_id: string, logFileName: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'getlogtext?request_id=' + request_id + '&logFileName=' + logFileName,
            {
            }, { method: 'GET' });
    }

    // 下载输出文件
    DownloadOutPut(request_id: string, outputFileName: string, output_file_type: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            this.URL_Prefix + 'downloadoutput?request_id=' + request_id + '&outputFileName=' + outputFileName + '&outputFileType=' + output_file_type,
            {
            }, { method: 'GET' });
    }
}
