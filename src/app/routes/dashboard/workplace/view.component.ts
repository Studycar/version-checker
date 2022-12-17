import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzDrawerRef } from 'ng-zorro-antd';
import { STColumn } from '@delon/abc';

@Component({
  selector: 'auditlog-view',
  templateUrl: './view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogViewComponent implements OnInit {
  i: any = {};
  loading = false;
  totalDuration = 0;

  constructor(
    private http: _HttpClient,
    private msg: NzMessageService,
    private drawer: NzDrawerRef,
  ) {}

  ngOnInit() {
    (<any[]>this.i.SqlLogInfos).forEach(t => {
      this.totalDuration += t.ExecutionDuration;
    });
    this.changesSql(this.i.SqlLogInfos);
  }
  Param: Array<string>;
  changesSql(data: any) {
    data.forEach(element => {
      this.Param = [];
      for (const key in element['Parameters']) {
        this.Param.push(key);
      }
      this.Param.sort((a, b) => {
        return b.length - a.length;
      });
      for (const i in this.Param) {
        try {
          if (
            element['Parameters'][this.Param[i]] === null ||
            element['Parameters'][this.Param[i]] === 'null'
          )
            element['Sql'] = element['Sql'].replace(
              new RegExp(this.Param[i], 'gm'),
              'null',
            );
          else {
            element['Parameters'][this.Param[i]] = element['Parameters'][
              this.Param[i]
            ]
              .toString()
              .replace(new RegExp('\'', 'gm'), ''); // 统一默认没有''
            element['Sql'] = element['Sql'].replace(
              new RegExp(this.Param[i], 'gm'),
              '\'' + element['Parameters'][this.Param[i]] + '\'',
            );
          }
          // 倒序替换
          // (key, '\'' + element['Parameters'][key] + '\'');
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  columns: STColumn[] = [
    {
      title: 'Sql类型',
      index: 'Type',
      type: 'tag',
      tag: {
        Select: { text: '查询', color: 'green' },
        Insert: { text: '插入', color: 'blue' },
        Update: { text: '更新', color: 'orange' },
        Delete: { text: '删除', color: 'red' },
      },
    },
    { title: '执行耗时(ms)', index: 'ExecutionDuration' },
    {
      title: '执行时间',
      index: 'ExecutionTime',
      type: 'date',
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
    },
  ];

  close() {
    this.drawer.close();
  }
}
