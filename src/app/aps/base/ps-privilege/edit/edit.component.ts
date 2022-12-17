// 用户权限-编辑
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { BasePsPrivilegeEditService } from '../edit.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-ps-privilege-edit',
  templateUrl: './edit.component.html',
  providers: [BasePsPrivilegeEditService],
})
export class BasePsPrivilegeEditComponent implements OnInit {

  applicationsYORNO: any[] = [];
  applicationsMSG: any[] = [];

  Istrue: boolean;
  record: any = {};
  i: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public editService: BasePsPrivilegeEditService,
    public http: _HttpClient,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }


  isLoading = false;
  optionListUSER = [];

  // 绑定页面的下拉框工厂
  optionListPlant = [];

  // 绑定页面的下拉框Plant组
  optionListPlantGroup = [];

  // 绑定页面的下拉框产线
  optionListProductLine = [];


  loadUser(): void {
    this.isLoading = true;
    this.editService.GetAppliactioUser().subscribe(result => {
      this.isLoading = false;
      this.optionListUSER = result.data;
    });
  }

  getUserList = (value, pageIndex, pageSize) => this.commonQueryService.getUsersPage(value, pageIndex, pageSize);
  userChange(e) {
    this.i.userName = e.value;
    this.i.description = e.label;
  }

  loadplant(): void {

    this.isLoading = true;
    this.editService.GetAppliactioPlant().subscribe(result => {
      this.isLoading = false;
      this.optionListPlant = result.data;
    });

  }

  loadplantGroup(): void {

    this.isLoading = true;
    this.editService.GetAppliactioGroupByPlantID(this.i.plantCode).subscribe(result => {
      this.isLoading = false;
      this.optionListPlantGroup = result.data;
    });
  }

  loadproductLine(): void {

    this.isLoading = true;
    this.editService.GetAppliactioGroupIDLine(this.i.scheduleGroupCode).subscribe(result => {
      this.isLoading = false;
      this.optionListProductLine = result.data;
    });
  }

  // 用户 值更新事件
  onChangeUSER(value: string): void {
    this.optionListUSER.forEach(element => {
      if (element.userName === value) {
        this.i.userName = value;
        this.i.description = element.description;
      }
    });
  }



  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    /** 重新绑定  组*/
    this.i.scheduleGroupCode = null;

    this.editService
      .GetAppliactioGroupByPlantID(value)
      .subscribe(result => {
        if (result.data == null) {
          this.optionListPlantGroup = [];
          return;
        } else {
          // 先清除，在重新绑定
          this.optionListPlantGroup = [];
          this.optionListPlantGroup = [
            ...this.optionListPlantGroup,
            ...result.data,
          ];
          return;
        }
      });
  }

  // 组 值更新事件 重新绑定产线
  onChangeGroup(value: string): void {
    /** 重新绑定  组*/
    this.i.resourceCode = null;

    this.editService
      .GetAppliactioGroupIDLine(value)
      .subscribe(result => {
        if (result.data == null) {
          this.optionListProductLine = [];
          return;
        } else {
          // 先清除，在重新绑定
          this.optionListProductLine = [];
          this.optionListProductLine = [
            ...this.optionListProductLine,
            ...result.data,
          ];
          return;
        }
      });
      
  }

  loadData() {

    // this.loadUser();
    this.loadplant();
    this.i.modifyPrivilageFlag = 'Y';
    this.i.publishPrivilageFlag = 'Y';
    /** 初始化编辑数据 */
    if (this.i.id != null) {
      this.Istrue = true;
      this.editService.Get(this.i.id).subscribe(resultMes => {
        if (resultMes.data !== undefined) {
          const d = resultMes.data;
          // this.i = d;
          this.i = {
            id: d.id,
            userName: d.userName,
            description: d.description,
            plantCode: d.plantCode,
            scheduleGroupCode: d.scheduleGroupCode,
            resourceCode: d.resourceCode,
            modifyPrivilageFlag: d.modifyPrivilageFlag,
            publishPrivilageFlag: d.publishPrivilageFlag,
            sendEmailFlag: d.sendEmailFlag,
            receiveMsgType: d.receiveMsgType,

          };
        }

        //
        this.loadplantGroup();
        this.loadproductLine();
      });
    } else {
      this.Istrue = false;
      this.i.plantCode = this.appConfigService.getPlantCode();
      this.i.receiveMsgType = 'AL';
      this.loadplantGroup();
    }


    /** 初始化應用程序  下拉框*/
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationsYORNO.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });


    });

    /** 初始化應用程序  下拉框*/
    this.commonQueryService.GetLookupByType('PS_RECEIVE_MSG_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationsMSG.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });

    });



  }

  save() {
    this.editService.save(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    if (this.i.Id != null) {
      this.loadData();
    } else {
      this.i = {};
    }
  }
}
