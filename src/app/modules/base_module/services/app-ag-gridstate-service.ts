import { Inject, Injectable } from '@angular/core';
import { AppGridStateService } from './app-gridstate-service';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';
import { ColumnApi } from 'ag-grid-community';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { Observable } from 'rxjs';

/**
 * create by jianl
 * 封装aggrid个性化处理的公共代码
 */

@Injectable()
export class AppAgGridStateService {
  isSaveOrigin = false;

  constructor(@Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
  }

  /**
   * 根据key值，恢复aggrid个性化
   * @param columnApi
   * @param appGridStateService
   * @param gridStateKey
   */
  public resetGridSettingsByCache(
    columnApi: ColumnApi,
    appGridStateService: AppGridStateService,
    gridStateKey: string,
  ) {
    this.generateNewGridStateObjFromCache(
      columnApi,
      appGridStateService,
      gridStateKey,
    ).subscribe(stateObj => {
      if (stateObj === null) {
        // 如果没有个性化数据，则自动计算列宽度
        this.countGridWidth(columnApi, appGridStateService, gridStateKey);
        return;
      }
      if (stateObj === 'ok') {
        return;
      }
      columnApi.setColumnState(stateObj);
    });
  }

  /**
   * 当aggrid第一次打开的时候，自动计算aggrid的列宽
   * 暂时沿用张为行的算法，后期根据效果再做调整
   */
  public countGridWidth(
    columnApi: ColumnApi,
    appGridStateService: AppGridStateService,
    gridStateKey: string,
  ) {
    this.generateNewGridStateObjFromCache(
      columnApi,
      appGridStateService,
      gridStateKey,
    ).subscribe(stateObj => {
      if (stateObj !== null) {
      } else {
        const allColumnIds = [];
        columnApi.getAllColumns().forEach(x => {
          allColumnIds.push(x.getColId());
        });
        if (allColumnIds.length <= 9) {
          (<any>columnApi).columnController.gridApi.sizeColumnsToFit();
        } else {
          columnApi.autoSizeColumns(allColumnIds);
        }
      }
    });
  }

  public generateNewGridStateObjFromCache(
    columnApi: ColumnApi,
    appGridStateService: AppGridStateService,
    gridStateKey: string,
  ): Observable<any> {
    return new Observable(subscriber => {
      if (columnApi === undefined || columnApi === null) {
        subscriber.next(null);
        subscriber.complete();
      }
      if (appGridStateService === undefined || appGridStateService === null) {
        subscriber.next(null);
        subscriber.complete();
      }
      if (
        gridStateKey === undefined ||
        gridStateKey === null ||
        gridStateKey === ''
      ) {
        subscriber.next(null);
        subscriber.complete();
      }

      let columnState = <ColumnState[]>appGridStateService.get(gridStateKey);

      const UserName = this.tokenService.get().name;
      appGridStateService.getByRemote(UserName, gridStateKey).subscribe(result => {
        if (result.code === 200 && result.data) {
          /** 取服务器端数据代替本地数据*/
          columnState = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
        }

        if (columnState === undefined || columnState === null) {
          subscriber.next(null);
          subscriber.complete();
        }

        // create by jianl 解决因为保存的个性化数据不对，就影响到显示的列不正常的问题
        const newColumnState = columnApi.getColumnState();
        newColumnState.forEach(it => {
          for (const state in columnState) {
            if (columnState[state].colId === it.colId) {
              // 更新属性
              for (const pro in it) {
                it[pro] = columnState[state][pro];
              }
            }
          }
        });

        // 保存在排序的时候，已经添加到列表中的列
        const hasPushColIdSet = new Set<string>();
        // 接下来对列进行排序
        const newColumnStateSort = [];
        for (const oldState in columnState) {
          for (const newState in newColumnState) {
            if (columnState[oldState].colId === newColumnState[newState].colId) {
              newColumnStateSort.push(newColumnState[newState]);
              hasPushColIdSet.add(newColumnState[newState].colId);
              break;
            }
          }
        }

        // 补全剩下的列
        for (const newState in newColumnState) {
          if (!hasPushColIdSet.has(newColumnState[newState].colId)) {
            newColumnStateSort.push(newColumnState[newState]);
          }
        }

        subscriber.next(newColumnStateSort);
        subscriber.complete();
      });
    });
  }

  public saveGridState(
    columnApi: ColumnApi,
    appGridStateService: AppGridStateService,
    gridStateKey: string,
    isRestState: boolean,
  ): Observable<any> {
    return new Observable(subscriber => {
      /** 重置无需再保存状态 */
      if (isRestState) {
        subscriber.next(null);
        subscriber.complete();
        return;
      }
      if (columnApi === undefined || columnApi === null) {
        subscriber.next(null);
        subscriber.complete();
      }
      if (appGridStateService === undefined || appGridStateService === null) {
        subscriber.next(null);
        subscriber.complete();
      }
      if (
        gridStateKey === undefined ||
        gridStateKey === null ||
        gridStateKey === ''
      ) {
        subscriber.next(null);
        subscriber.complete();
      }

      let columnState = <ColumnState[]>appGridStateService.get(gridStateKey);

      const UserName = this.tokenService.get().name;
      appGridStateService.getByRemote(UserName, gridStateKey).subscribe(result => {
        if (result.code === 200 && result.data) {
          /** 取服务器端数据代替本地数据*/
          columnState = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
        }

        /** 普通页处理 */
        const newColumnState = columnApi.getColumnState();
        // 保存在排序的时候，已经添加到列表中的列
        const hasPushColIdSet = new Set<string>();
        // 接下来对列进行排序
        const newColumnStateSort = [];
        for (const newState in newColumnState) {
          newColumnStateSort.push(newColumnState[newState]);
        }

        // 把存在缓存中，但是不存在最新的gridstate中的列，也加上
        for (const oldState in columnState) {
          let hasFind = false;
          for (const newState in newColumnState) {
            if (columnState[oldState].colId === newColumnState[newState].colId) {
              hasFind = true;
              break;
            }
          }
          // 如果在最新的集合中未找到，一样也要添加
          if (!hasFind) {
            newColumnStateSort.push(columnState[oldState]);
          }
        }
        appGridStateService.set(gridStateKey, newColumnStateSort);
        if (!this.isSaveOrigin) {
          appGridStateService.saveOrigin(gridStateKey, newColumnStateSort);
          this.isSaveOrigin = true;
        }

        appGridStateService.saveByRemote(UserName, gridStateKey, JSON.stringify(newColumnStateSort)).subscribe();

      });

    });
  }
}
