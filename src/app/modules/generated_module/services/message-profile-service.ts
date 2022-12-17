import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { MessageProfileDto } from '../dtos/message-profile-dto';

@Injectable()
export class MessageProfileService {
    constructor(
        private appApiService: AppApiService,
        public http: _HttpClient
    ) { }

    url = '/afs/serverbasemessagecenter/serverbasemessageprofile/GetData';
    exportUrl = '/afs/serverpsmoexception/psmoexception/Export';
    msgRuleUrl = '/afs/serverbasemessagecenter/serverbasemessageprofile/GetMsgRuleData';

    GetById(Id: string) {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbasemessagecenter/serverbasemessageprofile/GetById?Id=' + Id,
            {

            }, { method: 'GET' }
        );
    }

    GetPlant(userid: string) {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcdlycalendar/DlyCalendar/GetPlant?userid=' + userid,
            {

            }, { method: 'GET' }
        );
    }

    EditData(dto: MessageProfileDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbasemessagecenter/serverbasemessageprofile/EditData',
            {
                dto
            }
        );
    }


    SaveForNew(dto: MessageProfileDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbasemessagecenter/serverbasemessageprofile/SaveForNew',
            {
                dto
            }
        );
    }

    Delete(id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbasemessagecenter/serverbasemessageprofile/remove',
            {
                id
            }
        );
    }

    RemoveBath(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbasemessagecenter/serverbasemessageprofile/RemoveBath',
            {
                dtos
            }
        );
    }

    GetMessageType() {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbasemessagecenter/serverbasemessageprofile/GetMessageType',
            {

            }, { method: 'GET' }
        );
    }

    GetMSGLEVEL() {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbasemessagecenter/serverbasemessageprofile/GetMSGLEVEL',
            {

            }, { method: 'GET' }
        );
    }

    GetMSGROLE() {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbasemessagecenter/serverbasemessageprofile/GetMSGROLE',
            {

            }, { method: 'GET' }
        );
    }

    GetLogicOprator() {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbasemessagecenter/serverbasemessageprofile/GetLogicOprator',
            {

            }, { method: 'GET' }
        );
    }

    GetSqlOprator() {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbasemessagecenter/serverbasemessageprofile/GetSqlOprator',
            {

            }, { method: 'GET' }
        );
    }

    GetOprator() {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbasemessagecenter/serverbasemessageprofile/GetOprator',
            {

            }, { method: 'GET' }
        );
    }

    SaveMsgRules(dto: any) {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbasemessagecenter/serverbasemessageprofile/SaveMsgRules',
            {
                dto
            }, { method: 'POST' }
        );
    }

    DeleteMsgRules(dto: any) {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbasemessagecenter/serverbasemessageprofile/DeleteMsgRules',
            {
                dto
            }, { method: 'POST' }
        );
    }
}
