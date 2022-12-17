import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { zip } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, DrawerHelper } from '@delon/theme';
import { STChange, STColumn, STComponent } from '@delon/abc';
import { AuditLogViewComponent } from './view.component';

@Component({
  selector: 'app-dashboard-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardWorkplaceComponent implements OnInit {
  @ViewChild('st1', {static: true})
  private st: STComponent;
  notice: any[] = [];
  info: any = {};
  loading = true;
  public params: any = {};
  url = `/afs/serverbaseworkbench/workbench/getAuditLog`;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private cd: ChangeDetectorRef,
    private drawer: DrawerHelper,
  ) {}

  ngOnInit() {
    this.get(0);
  }

  get(t: number) {
    this.loading = true;
    zip(
      this.http.get('/afs/serverbaseworkbench/workbench/getwebsiteInfo'),
      this.http.get('/afs/serverbaseworkbench/workbench/getAuditLogTop?top=6'),
    ).subscribe(([info, notice]: [any, any]) => {
      this.info = info;
      this.notice = notice;
      this.loading = false;
      this.cd.detectChanges();
    });
    if (t === 1) {
      this.st.reload();
    }
  }

  columns: STColumn[] = [
    { title: '函数名称', index: 'MethodName', render: 'name' },
    { title: '描述', index: 'Description' },
    {
      title: '执行耗时(ms)',
      index: 'ExecutionDuration',
      render: 'status',
      sort: true,
    },
    {
      title: '请求时间',
      index: 'ExecutionTime',
      type: 'date',
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      sort: true,
    },
    {
      title: '状态',
      index: 'IsExceptions',
      type: 'tag',
      tag: {
        false: { text: '成功', color: 'green' },
        true: { text: '失败', color: 'red' },
      },
      sort: true,
    },
  ];

  _click(e: STChange) {
    if (e.type === 'click') {
      // Should prevent tr click trigger when clicking expand
      // So click expand to repeat the trigger
      // https://github.com/NG-ZORRO/ng-zorro-antd/issues/2419
      e.click.item.expand = !e.click.item.expand;
    }
  }

  view(i: any) {
    this.drawer
      .create(
        `查看日志明细 #${i.MethodName}`,
        AuditLogViewComponent,
        { i },
        { size: 600 },
      )
      .subscribe();
  }
}
