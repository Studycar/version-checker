import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';

import { QueryService } from './query.service';
// import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { State, process } from '@progress/kendo-data-query';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'lastquery',
  templateUrl: './lastquery.component.html',
  providers: [QueryService]
})
export class LastQueryComponent extends CustomBaseContext implements OnInit {
  public gridView: any = [];
  objectKeys = Object.keys;
  public clear() {
    this.gridView.data = [
      {
        'SQL': '',
        'Parameters': {},
        'CreateDate': ''
      },
    ];
    this.commonQueryService.Remove().subscribe(result => {
      if (result.Success === true) {
        this.gridView.data = [
          {
            'SQL': '',
            'Parameters': {},
            'CreateDate': ''
          },
        ];
      }
    },
      errMsg => { },
      () => { }
    );
  }

  constructor(private http: _HttpClient, private modal: ModalHelper,
    public commonQueryService: QueryService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null  }); }

  ngOnInit() {
    this.gridView.data = [
      {
        'SQL': '',
        'Parameters': {},
        'CreateDate': ''
      },
    ];
    this.query();
  }

  Param: Array<string>;
  count = 0;
  public query() {
    this.Param = [];
    this.count = 0;
    this.commonQueryService.Search().subscribe(result => {
      if (result.Result != null && result.Result.length !== undefined && result.Result.length > 0) {
        this.gridView = {
          data: result.Result,
          total: result.TotalCount
        };
      }
      this.gridView.data.reverse();
      this.gridView.data.forEach(element => {
        this.Param = [];
        for (const key in element['Parameters']) {
          this.Param.push(key);
        }
        // this.Param.reverse();
        this.Param.sort((a, b) => {
          return b.length - a.length;
        });
        for (const i in this.Param) {
          try {
            if (element['Parameters'][this.Param[i]] === null || element['Parameters'][this.Param[i]] === 'null')
              element['SQL'] = element['SQL'].replace(new RegExp(this.Param[i], 'gm'), 'null');
            else {
              element['Parameters'][this.Param[i]] = element['Parameters'][this.Param[i]].toString().replace(new RegExp('\'', 'gm'), ''); // 统一默认没有''
              element['SQL'] = element['SQL'].replace(new RegExp(this.Param[i], 'gm'), '\'' + element['Parameters'][this.Param[i]] + '\'');
            }
          } catch (error) {
            console.log(error);
          }
        }
      });

    });
  }

  public compareAB(a: string, b: number) {
    if (a.length <= b)
      return -1;
    else
      return 1;
  }

  public getMaxLen(Param: any): number {
    let maxlen = 0;
    Param.forEach(res => {
      if (res.length >= maxlen)
        maxlen = res.length;
    });
    return maxlen;
  }

  public dataStateChange(state: State) {
    this.gridState = state;
    this.query();
  }
}
