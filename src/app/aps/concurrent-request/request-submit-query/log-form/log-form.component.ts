import { Component, OnInit, Renderer2, NgZone, TemplateRef } from '@angular/core';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { RequestSubmitQueryService } from '../../../../modules/generated_module/services/request-submit-query-service';
import { NzDropdownContextComponent, NzDropdownService, NzMenuItemDirective } from 'ng-zorro-antd';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'log-form',
  templateUrl: './log-form.component.html',
  styleUrls: ['./log-form.component.css']
})
export class ConcurrentRequestLogFormComponent implements OnInit {
  LogText: string;
  requestId: string;
  logFileName: string;
  constructor(
    private requestSubmitQueryService: RequestSubmitQueryService,
    private msgSrv: NzMessageService,
    ) { }

  ngOnInit() {
  }

  refreshLog() {
    this.requestSubmitQueryService.getLogText(this.requestId, this.logFileName).subscribe(result => {
      if (result.data && result.data.fileExists) {
        this.LogText = result.data.logText;
      } else {
        this.msgSrv.info('日志文件存放时间超出限定天数，已清除.');
      }
    });
  }

  SaveLog() {
    const a = document.createElement('a');
    const blob = new Blob([this.LogText], { 'type': 'text/plain' });
    a.href = URL.createObjectURL(blob);
    a.download = this.requestId + '.txt';
    a.click();
  }
}
