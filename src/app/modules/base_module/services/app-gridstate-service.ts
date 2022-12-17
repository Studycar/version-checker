import { Inject, Injectable } from '@angular/core';
import { AppConfigService } from './app-config-service';
import { TranslationIndex } from '../../generated_module/translations/index';
import { GridComponent, ColumnComponent } from '@progress/kendo-angular-grid';
import { map } from 'rxjs-compat/operator/map';
import { NzMessageService } from 'ng-zorro-antd';
import { State, DataResult } from '@progress/kendo-data-query';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs/index';
import { ColumnApi } from 'ag-grid-community';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

/**
 * 个性化设置
 */
@Injectable()
export class AppGridStateService {
  constructor(private msgSrv: NzMessageService,
              private http: _HttpClient,
              @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }

  /**
   * 保存
   * @param grid
   */
  public set<T>(token: string, gridConfig: any): void {
    localStorage.setItem(token, JSON.stringify(gridConfig));
    // this.msgSrv.success('个性化保存成功');
  }

  /**
   * 保存第一次进页面时grid的列初始设定
   * @param {string} token
   * @param gridConfig
   */
  saveOrigin(token: string, gridConfig: any): void {
    localStorage.setItem(token + 'Origin', JSON.stringify(gridConfig));
  }

  /**
   * 保存grid程序初始的列初始设定
   * @param {string} token
   * @param gridConfig
   */
  saveDefined(token: string, gridConfig: any): void {
    localStorage.setItem(`${token}Defined`, JSON.stringify(gridConfig));
  }

  /**
   * 加载
   * @param grid
   */
  public get<T>(token: string): T {
    const settings = localStorage.getItem(token);
    return settings ? JSON.parse(settings) : settings;
  }

  /**
   * 重置
   * @param grid
   */
  reset(columnApi: ColumnApi, token: string) {
    const userName = this.tokenService.get().name;
    const colDefined = JSON.parse(localStorage.getItem(`${token}Defined`));
    localStorage.removeItem(token);
    this.saveByRemote(userName, token, '').subscribe();
    columnApi.setColumnState(colDefined);
    this.msgSrv.success('个性化重置成功');
  }

  /**
   * 从服务器取
   */
  getByRemote(UserName, GridKey): Observable<any> {
    const url = '/api/admin/user/queryusergridindividuation';
    return this.http.get(url, { 
      userName: UserName,
      gridKey: GridKey });
  }

  /**
   * 保存到服务器
   */
  saveByRemote(UserName, GridKey, GridIndividuation) {
    const url = '/api/admin/user/saveusergridindividuation';
    return this.http.post(url, { 
      userName: UserName, 
      gridKey: GridKey,
      gridIndividuation: GridIndividuation });
  }
}

export interface ColumnSettings {
  field: string;
  title?: string;
  width?: number;
  orderIndex?: number;
}

export interface GridSettings {
  columnsConfig: ColumnSettings[];
}

