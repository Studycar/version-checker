import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { UserManagerManageService } from '../../../../modules/generated_module/services/user-manager-manage-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-usermanagerresp-edit',
  templateUrl: './edit.component.html',
})
export class BaseUsermanagerrespEditComponent implements OnInit {
  title: String = '编辑';
  /**是否修改 */
  isModify: boolean = false;
  record: any = {};
  i: any;
  iClone: any;
  dto: any;
  respOptions: any[] = [];
  // @ViewChild('sf', {static: false}) sf: SFComponent;
  // schema: SFSchema = {
  //   properties: {
  //     RESP_ID: {
  //       type: 'string',
  //       title: '职责名称',
  //       readOnly: true,
  //       ui: { widget: 'select', change: (value) => this.change(value), }
  //     },
  //     APPLICATION_NAME: {
  //       type: 'string',
  //       title: '应用模块',
  //       readOnly: true
  //     },
  //     START_DATE: {
  //       'type': 'string',
  //       title: '生效日期',
  //       ui: { widget: 'date'}
  //     },
  //     END_DATE: {
  //       type: 'string',
  //       title: '失效日期',
  //       ui: { widget: 'date', showToday: false, disabledDate: (current: Date) => this.dateEndDisabled(current), }
  //     },
  //   },
  //   required: ['RESP_ID', 'START_DATE'],
  // };
  // ui: SFUISchema = {
  //   '*': {
  //     spanLabelFixed: 100,
  //     grid: { span: 12 },
  //   },
  // };

  // dateStart: Date = null;
  // dateEnd: Date = null;
  // dateStartDisabled(current: Date): boolean {
  //   const fv: any = this.sf.value;
  //   if (fv.END_DATE && fv.END_DATE !== '') {
  //     this.dateEnd = new Date(fv.END_DATE);
  //   }
  //   if (!this.dateEnd) { return false; } else {
  //     return current.getTime() > this.dateEnd.getTime();
  //   }
  // }

  // dateEndDisabled(current: Date): boolean {
  //   const fv: any = this.sf.value;
  //   if (fv.START_DATE && fv.START_DATE !== '') {
  //     this.dateStart = new Date(fv.START_DATE);
  //   }
  //   if (!this.dateStart) { return false; } else {
  //     return current.getTime() < this.dateStart.getTime();
  //   }
  // }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private userManagerManageService: UserManagerManageService,
    private appTranslationService: AppTranslationService,
    private commonQuerySrv: CommonQueryService,
  ) { }

  ngOnInit(): void {
    if (this.i.userRespId == null) {
      this.title = '新增';
      // this.schema.properties.RESP_ID.readOnly = false;
      this.isModify = false;
      var t = new Date();//你已知的时间
      var t_s = t.getTime();//转化为时间戳毫秒数 
      t.setTime(t_s - 1000 * 60 * 60 * 24);//设置新时间比旧时间多一天
      this.i.startDate = t;
    }
    else {
      this.isModify = true;
    }
    this.loadData();
    this.iClone = Object.assign({}, this.i);
  }

  loadData() {
    /** 初始化编辑数据 */
    this.userManagerManageService.GetAllResp('').subscribe(resultMes => {
      resultMes.data.forEach(element => {
        this.respOptions.push(
          {
            label: element.respsName,
            value: element.id,
            tag: { respId: element.id, applicationName: element.applicationName, respsName: element.respsName }
          }
        );
      });
      // this.schema.properties.RESP_ID.enum = this.respOptions;
      // this.sf.refreshSchema();
    });
  }

  change(value: any) {
    this.respOptions.forEach(element => {
      if (element.value === value) {
        this.i.respId = value; this.i.applicationName = element.tag.applicationName;
        // this.sf.refreshSchema();
        return;
      }
    });
  }

  save(value: any) {
    this.i.userRespId = this.i.userRespId || '';
    if (this.i.userRespId !== '') {
      value.userRespId = this.i.userRespId;
    } else {
      value.userRespId = null;
    }
    this.dto = { 
      userRespId: value.userRespId, 
      userId: this.i.userId, 
      respId: value.respId, 
      startDate: this.commonQuerySrv.formatDateTime(value.startDate), 
      endDate: this.commonQuerySrv.formatDateTime(value.endDate) };

    this.userManagerManageService.EditUserResp(this.dto).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }
  /**重置 */
  clear() {
    if (this.i.id !== null) {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }
}
