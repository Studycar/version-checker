import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { RequestSubmitQueryService } from '../../../../modules/generated_module/services/request-submit-query-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'diagnosis-form',
  templateUrl: './diagnosis-form.component.html',
  styleUrls: ['./diagnosis-form.component.css']
})
export class ConcurrentRequestDiagnosisFormComponent implements OnInit {
  i: any;
  Result: string;
  constructor(private msgSrv: NzMessageService,
    private modal: NzModalRef,
    private requestSubmitQueryService: RequestSubmitQueryService, ) { }

  ngOnInit() {
    this.requestSubmitQueryService.getDiagnosis(this.i.requestId).subscribe(result => {
      this.Result = result.data;
    });
  }
}
