/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-05-15 17:52:30
 * @LastEditors: Zwh
 * @LastEditTime: 2019-05-22 09:12:10
 * @Note:
 * 用户消息推送服务
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { Action } from 'rxjs/internal/scheduler/Action';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
export class BaseUserMessageService {
  constructor(private appApiService: AppApiService, public http: _HttpClient) {}
  searchurl = '/afs/serverpsbom/psbom/GetData';
  exportUrl = '';

  /**
   * 获取一定时间内的未读消息数
   * @param day 多少天内
   * @returns {Observable<ActionResponseDto>}
   */
  getMessageCount(day): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemessagecenter/serverbasemessage/getMessageCount?day=' +
        day,
      {},
      { method: 'GET' },
    );
  }

  /**
   * 获取消息详情
   * @param message_type 消息类型（所有：-1，消息：0，通知：1，待办：2， 历史消息：3）
   * @param day 多少天内(小于等于0时为所有)
   * @returns {Observable<ActionResponseDto>}
   */
  getMessageDetail(
    message_type: number,
    day: number,
  ): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemessagecenter/serverbasemessage/getMessageDetail?messgae_type=' +
        message_type +
        '&day=' +
        day,
      {},
      { method: 'GET' },
    );
  }

  ignoreMessage(id: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemessagecenter/serverbasemessage/ingoreMessage?id=' + id,
      {},
      { method: 'GET' },
    );
  }

  clearAll(message_type: number): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemessagecenter/serverbasemessage/clearAll?messgae_type=' +
        message_type,
      {},
      { method: 'GET' },
    );
  }

  readMessage(id: string): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
      '/afs/serverbasemessagecenter/serverbasemessage/ReadMessage?id=' + id,
      {},
      { method: 'GET' },
    );
  }

  /**create by jianl，把这个方法写在这里，是因为这个服务命名就是用户管理的 */
  saveUser(userData: any): Observable<ResponseDto> {
    return this.http.post(
      '/api/admin/baseusers/updateDefaultPlantCode',
      userData,
    );
  }
}
