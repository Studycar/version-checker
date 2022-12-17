import { Inject, Injectable, OnInit } from '@angular/core';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

@Injectable()
export class TabAgStateService {

  user: string | null = null;

  constructor(
    private msgSrv: NzMessageService,
    private http: _HttpClient,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
    this.user = this.tokenService.get().name;
  }

  mapState(source: any[], target: any[]) {
    return source.map(s => {
      const newState = {
        ...<object>target.find(t => (
          s.colId === t.field ||
          s.colId === t.colId)),
        ...s,
      };

      /**
       * 当同时存在field和colId时，状态是以colId为主，
       * 但状态的colId和field可能会不相同，因此导致状态混乱
       * 必须把colId去掉
       * */
      if (newState.field) {
        delete newState.colId;
      }

      return newState;
    });
  }

  /**
   * save to the localStorage
   * @param {string} key
   * @param {[]} state
   */
  save(key: string, state: []) {
    localStorage.setItem(key, JSON.stringify(state));
  }

  /**
   * save to the Service
   * @return {Observable<any>}
   */
  saveByRemote(GridKey, GridIndividuation) {
    // const url = '/afs/serverusermanager/UserService/saveusergridindividuation';
    const url = '/api/admin/user/saveusergridindividuation';
    return this.http.post(url, { userName: this.user, gridKey: GridKey, gridIndividuation: GridIndividuation });
  }

  getByRemote(GridKey) {
    const url = '/api/admin/user/queryusergridindividuation';
    return this.http.get(url, { userName: this.user, gridKey: GridKey });
  }

  reset(columnApi, stateKey, stateKeyDefined) {
    const colDefined = JSON.parse(localStorage.getItem(stateKeyDefined));
    localStorage.removeItem(stateKey);
    columnApi.setColumnState(colDefined);
    this.msgSrv.success('个性化重置成功');
  }

}
