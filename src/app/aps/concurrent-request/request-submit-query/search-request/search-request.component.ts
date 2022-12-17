import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { RequestSubmitQueryService } from '../../../../modules/generated_module/services/request-submit-query-service';
import { ConcurrentRequestSubmitNewRequestFormComponent } from '../submit-new-request-form/submit-new-request-form.component';
import { ConcurrentRequestSingleRequestFormComponent } from '../single-request-form/single-request-form.component';
import { ConcurrentRequestRequestSetsFormComponent } from '../request-sets-form/request-sets-form.component';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { CommonService } from '../model/CommonService';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'search-request',
  templateUrl: './search-request.component.html',
  styleUrls: ['./search-request.component.css'],
  providers: [CommonService]
})
export class ConcurrentRequestSearchRequestComponent implements OnInit {
  i: any;
  listOfUser: any = [];
  listOfStatus: any = [];
  listOfPhase: any = [];
  listOfProgram: any = [];

  radStyle = {
    display: 'block',
    height: '25px',
    lineHeight: '25px'
  };
  selStyle = {
    border: '1px solid #00000',
    display: 'block',
    lineHeight: '10px',
    width: '150px',
    margin: '0',
    padding: '0'
  };
  constructor(private msgSrv: NzMessageService,
    private modal: NzModalRef,
    private openDiag: ModalHelper,
    private requestSubmitQueryService: RequestSubmitQueryService,
    private commonQueryService: CommonQueryService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.commonQueryService.GetLookupByTypeRef('FND_CONC_STATUS_CODE', this.listOfStatus);
    this.commonQueryService.GetLookupByTypeRef('FND_CONC_PHASE_CODE', this.listOfPhase);

    this.requestSubmitQueryService.getUser().subscribe(result => {
      result.data.forEach(d => {
        this.listOfUser.push({
          label: d.userName,
          value: d.userId,
        });
      });
    });

    this.requestSubmitQueryService.getProgram().subscribe(result => {
      result.data.forEach(d => {
        this.listOfProgram.push({
          label: d.userConcurrentProgramName,
          value: d.id,
        });
      });
    });
  }

  SubmitRequest() {
    const ArgmentObj = {
      IsSingleRequest: true,
      IsSubmitRequest: false
    };
    this.openDiag
      .static(ConcurrentRequestSubmitNewRequestFormComponent, { i: ArgmentObj }, 450, 450)
      .subscribe(() => {
        if (ArgmentObj.IsSubmitRequest) {
          const IsRefreshObj = {
            IsRefresh: false
          };
          if (ArgmentObj.IsSingleRequest) {
            this.openDiag
              .static(ConcurrentRequestSingleRequestFormComponent, { i: IsRefreshObj }, 650, 250)
              .subscribe();

          } else {
            this.openDiag
              .static(ConcurrentRequestRequestSetsFormComponent, { i: IsRefreshObj }, 800, 400)
              .subscribe();
          }
        }
      });
  }

  Confrim() {
    this.i.Params.requestDate = this.commonService.formatDate(this.i.Params.requestDate);
    this.i.Params.actualCompDate = this.commonService.formatDate(this.i.Params.actualCompDate);
    this.i.IsRefresh = true;
    this.modal.close(true);
  }

  RequestDate(values: any) {
    this.SetNumSelectNumberDays(true);
  }

  ActualDate(values: any) {
    this.SetNumSelectNumberDays(true);
  }

  radChange(values: any) {
    if (values === 'T') {
      this.i.othersDisable = false;
    } else {
      this.i.othersDisable = true;
    }
    this.SetNumSelectNumberDays(false);
  }

  SetNumSelectNumberDays(isChange: boolean) {
    if (this.i.Params.radioValue === 'T') {
      if ((this.i.Params.requestDate === '' || this.i.Params.requestDate === null) &&
        (this.i.Params.actualCompDate === '' || this.i.Params.actualCompDate === null)) {
        this.i.daysDisable = false;
        if (isChange) {
          this.i.Params.days = '7';
        }
      } else {
        this.i.daysDisable = true;
        this.i.Params.days = '0';
      }
    } else {
      this.i.daysDisable = false;
    }
  }

  close() {
    this.modal.destroy();
  }
}
