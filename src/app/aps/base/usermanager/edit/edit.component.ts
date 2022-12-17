import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { UserManagerManageService } from '../../../../modules/generated_module/services/user-manager-manage-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { QueryService } from '../query.service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { LookupItem } from 'app/modules/base_module/components/custom-base-context.component';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-usermanager-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService, CommonQueryService], // 这里的CommonQueryService不要删除，必须为该组件的注入器提供
  // styleUrls: ['../../../../../assets/css/common.css']
})
export class BaseUsermanagerEditComponent implements OnInit {
  isModify = false;
  i: any;
  iClone: any;
  dto: any;
  plantOptions: any[] = [];
  salesTypeOptions: Set<LookupItem> = new Set<LookupItem>(); // 内外销 add by jianl
  wxUserUnbinding = false;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private userManagerManageService: UserManagerManageService,
    private appTranslationService: AppTranslationService,
    public queryService: QueryService,
    public commonQuerySrv: CommonQueryService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    console.log('id:' + this.i.id);
    this.queryService.GetUserPlant('', this.i.id).subscribe(result => {
      result.Extra.forEach(d => {
        this.plantOptions.push({
          label: d.plantCode,
          value: d.plantCode,
          tag: d
        });
      });
    });

    // 获取内外销快码值
    // 内外销
    this.commonQuerySrv.getLookupItems('SOP_SALES_TYPE').subscribe(rsp => {
      console.log('this.salesTypeOptions loading');
      rsp.forEach((item) => {
        this.salesTypeOptions.add(item);
      });
      console.log(this.salesTypeOptions);
    });

    // this.commonQueryService.GetLookupByType('SOP_SALES_TYPE').subscribe(result => {
    //   result.Extra.forEach(d => {
    //     this.salesTypeOptions.add({
    //       Text: d.meaning,
    //       Code: d.lookupCode,
    //     });
    //   });
    // });



    if (this.i.id != null) {

      this.isModify = true;
      /** 初始化编辑数据 */
      this.userManagerManageService.Get(this.i.id).subscribe(resultMes => {
        this.i = resultMes.data;
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      var t = new Date(); // 你已知的时间
      var t_s = t.getTime(); // 转化为时间戳毫秒数 
      t.setTime(t_s - 1000 * 60 * 60 * 24); // 设置新时间比旧时间多一天
      this.i.startDate = t;
    }
  }

  save(value: any) {
    if (this.isModify) {
      if (this.i.defaultPlantCode === '') {
        alert(this.appTranslationService.translate('请设置默认工厂'));
        return;
      }
    }
    this.i.id = this.i.id || '';
    if (this.i.id !== '') {
      value.id = this.i.id;
      value.userPassword = this.i.userPassword;
    } else {
      value.id = null;
      value.userPassword = window.btoa(this.i.userPassword);
    }
    this.dtoTransfer(value, true);
    this.userManagerManageService.Edit(this.dto).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.warning(this.appTranslationService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.i.id = this.i.id || '';
    if (this.i.id !== '') {
      this.i = this.iClone;
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i = {};
    }
  }

  /**
   * 解绑用户
   */
  unbindWXUser() {
    const url = 'api/admin/baseusers/userWXDelete';
    if (this.i === null || this.i.userName === null || this.i.userName === '') return;
    this.wxUserUnbinding = true;
    this.http
      .post<ResponseDto>(url, { userName: this.i.userName })
      .subscribe(it => {
        this.wxUserUnbinding = false;
        if (it.data != null && it.data > 0) {
          this.i.nickname = '';
        }
      });
  }

  /** dto转换 */
  dtoTransfer(inputDto: any, isSave: boolean) {
    this.dto = isSave ? {
      userName: inputDto.userName
      , description: inputDto.description
      , startBegin: inputDto.startBegin
      , startEnd: inputDto.startEnd
      , endBegin: inputDto.endBegin
      , endEnd: inputDto.endEnd
      , p: inputDto.p
      , userPassword: inputDto.userPassword
      , startDate: this.commonQuerySrv.formatDateTime(inputDto.startDate)
      , endDate: this.commonQuerySrv.formatDateTime(inputDto.endDate)
      , department: inputDto.department
      , emailAddress: inputDto.emailAddress
      , phoneNumber: inputDto.phoneNumber
      , id: inputDto.id
      , menuId: inputDto.menuId
      , respId: inputDto.respId
      , userRespId: inputDto.userRespId
      , defaultPlantCode: inputDto.defaultPlantCode
      , salesType: inputDto.salesType
    } : {
      userName: inputDto.userName
      , description: inputDto.description
      , startBegin: inputDto.startBegin
      , startEnd: inputDto.startEnd
      , endBegin: inputDto.endBegin
      , endEnd: inputDto.endEnd
      , p: inputDto.p
      , userPassword: inputDto.userPassword
      , startDate: this.commonQuerySrv.formatDateTime(inputDto.startDate)
      , endDate: this.commonQuerySrv.formatDateTime(inputDto.endDate)
      , department: inputDto.department
      , emailAddress: inputDto.emailAddress
      , phoneNumber: inputDto.phoneNumber
      , id: inputDto.id
      , menuId: inputDto.menuId
      , respId: inputDto.respId
      , userRespId: inputDto.userRespId
      , defaultPlantCode: inputDto.defaultPlantCode
      , salesType: inputDto.salesType
    };
  }
}
