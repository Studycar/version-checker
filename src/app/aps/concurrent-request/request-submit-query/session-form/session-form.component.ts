import { Component, OnInit, Renderer2, NgZone, TemplateRef } from '@angular/core';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { RequestSubmitQueryService } from '../../../../modules/generated_module/services/request-submit-query-service';
import { NzDropdownContextComponent, NzDropdownService, NzMenuItemDirective } from 'ng-zorro-antd';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'session-form',
  templateUrl: './session-form.component.html',
  styleUrls: ['./session-form.component.css']
})
export class ConcurrentRequestSessionFormComponent implements OnInit {
  i: any;

  AUDSID: string;
  SID: string;
  SERIAL: string;
  INST_ID: string;
  EVENT: string;
  SQL_CHILD_NUMBER: string;
  SQL_EXEC_START: string;
  SQL_EXEC_ID: string;
  PLAN_HASH_VALUE: string;
  SQL_ID: string;
  SQL_FULLTEXT: string;
  ELAPSED_TIME: string;
  EXECUTIONS: string;
  ELAPSED_TIME_ONCE: string;

  Monitor_Reprot: string;
  DOC_TYPE = 'html';

  private dropdown: NzDropdownContextComponent;

  keydownListener: () => void;

  constructor(private msgSrv: NzMessageService,
    private modal: NzModalRef,
    private requestSubmitQueryService: RequestSubmitQueryService,
    private zone: NgZone,
    private renderer: Renderer2,
    private nzDropdownService: NzDropdownService, ) { }

  ngOnInit() {
    this.requestSubmitQueryService.GetSession(this.i.SID, this.i.INST_ID).subscribe(result => {
      if (result.Extra != null && result.Extra.length !== 'undefined' && result.Extra.length > 0) {
        result.Extra.forEach(d => {
          this.AUDSID = d.AUDSID;
          this.SID = d.SID;
          this.SERIAL = d.SERIAL;
          this.INST_ID = d.INST_ID;
          this.EVENT = d.EVENT;
          this.SQL_CHILD_NUMBER = d.SQL_CHILD_NUMBER;
          this.SQL_EXEC_START = d.SQL_EXEC_START;
          this.SQL_EXEC_ID = d.SQL_EXEC_ID;
          this.PLAN_HASH_VALUE = d.S;
          this.SQL_ID = d.SQL_ID;
          this.SQL_FULLTEXT = d.SQL_FULLTEXT;
          this.ELAPSED_TIME = d.ELAPSED_TIME;
          this.EXECUTIONS = d.EXECUTIONS;
          this.ELAPSED_TIME_ONCE = d.ELAPSED_TIME_ONCE;
        });
      }
    });

    this.setKeydownListener();
  }

  Monitor() {
    this.output_report();
  }

  // 键盘事件
  onKeydown(event: KeyboardEvent) {
    // event.code = KeyM event.Keycode = 77 event.key = m  
    if (event.altKey && event.code === 'KeyM') {
      this.output_report();
    }
  }

  // 鼠标事件
  onMousedown(event: MouseEvent) {
    /*if (event.button === 2) {
        this.msgSrv.success(event.button + '');
      }*/
  }

  // 取消掉默认行为(也就是阻止浏览器显示自带的菜单)
  /*onContextmenu(): boolean {
    return false;
  }*/

  onContextmenu($event: MouseEvent, template: TemplateRef<void>): void {
    this.dropdown = this.nzDropdownService.create($event, template);
  }

  close(e: NzMenuItemDirective): void {
    this.dropdown.close();
  }

  SelectItem(item: string) {
    this.msgSrv.success(item);
  }

  output_report() {
    this.requestSubmitQueryService.GetSqlMonitor(this.i.SID, this.i.INST_ID, this.DOC_TYPE).subscribe(result => {
      if (result.Extra != null && result.Extra.length !== 'undefined' && result.Extra.length > 0) {
        result.Extra.forEach(d => {
          this.Monitor_Reprot = d.MONITORREPORT;
        });
        this.msgSrv.success('this.Monitor_Reprot');
      }
    });
  }

  // 设置事件
  setKeydownListener() {
    if (this.keydownListener == null) {
      this.zone.runOutsideAngular(() => {
        this.keydownListener = this.renderer.listen(
          'document', 'keydown', (e) => this.onKeydown(e));
      });
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    this.removeKeydownListener();
  }

  private removeKeydownListener() {
    if (!this.keydownListener) {
      this.keydownListener();
      this.keydownListener = null;
    }
  }
}
