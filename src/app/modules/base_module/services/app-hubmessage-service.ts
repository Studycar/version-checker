import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AppConfigService } from './app-config-service';
import { environment } from '@env/environment';
import * as signalR from '@microsoft/signalr';

/**
 * signalr消息服务
 */
@Injectable({
  providedIn: 'root',
})
export class AppHubMessageService {
  private connection: signalR.HubConnection;
  private message$ = new Subject<any>();

  constructor(appConfigService: AppConfigService) {
    let hubRoute = '/msghub?u=' + appConfigService.getUserName();
    if (!environment.production) {
      hubRoute = 'http://localhost:8002' + hubRoute;
    }
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubRoute)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    // 接收到消息中心推送
    this.connection.on('receiveMessageCount', message => {
      this.message$.next(message);
    });
    // 接收进度推送
    this.connection.on('requestProgress', message => {
      this.message$.next(message);
    });

    // this.connection
    //   .start()
    //   .then(() => {
    //     console.log('signalr Successful connection');
    //     this.connection.on('Receive', data => {
    //       console.log('Receive:' + data);
    //     });
    //   })
    //   .catch(err => console.error('signalr-err:' + err.toString()));
    // this.connection.onclose(async () => {
    //   console.log('signalr close connection');
    // });
  }

  /**
   * 接收到消息中心推送
   *
   * @returns {Observable<any>}
   * @memberof AppHubMessageService
   */
  public receiveMessageCount(): Observable<any> {
    return this.message$;
  }

  /**
   * 接收进度推送
   *
   * @returns {Observable<any>}
   * @memberof AppHubMessageService
   */
  public requestProgress(): Observable<any> {
    return this.message$;
  }
}
