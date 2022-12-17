import { OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AppInjector } from "app/modules/base_module/services/app-injector.service";
import { NzMessageService } from "ng-zorro-antd";
import { IdeSubmitService } from "app/modules/base_module/services/ide-submit.service";
import { NavigateDataTransferService } from "app/modules/base_module/services/navigate-data-transfer.service";
import { IdeFlowIframeComponent } from "../flow-iframe/flow-iframe.component";
import { IdeFlowPageComponent } from "../flow-page/flow-page.component";
import { ReuseTabService } from "@delon/abc";
import { SettingsService, TitleService, _HttpClient } from "@delon/theme";
import { routeTable } from "../route-map";

export abstract class CommonFlowPageContext implements OnInit, OnDestroy {
  protected ideSubmitService: IdeSubmitService;
  protected ndtSrv: NavigateDataTransferService;
  protected msgSrv: NzMessageService;
  protected reuseTabService: ReuseTabService;
  protected titleSrv: TitleService;
  protected settings: SettingsService;
  public http: _HttpClient;

  protected constructor() {
    const injector = AppInjector.getInjector();
    this.ideSubmitService = injector.get(IdeSubmitService);
    this.ndtSrv = injector.get(NavigateDataTransferService);
    this.msgSrv = injector.get(NzMessageService);
    this.reuseTabService = injector.get(ReuseTabService);
    this.titleSrv = injector.get(TitleService);
    this.settings = injector.get(SettingsService);
    this.http = injector.get(_HttpClient);
  }

  // loading = false;
  formData: any = {};

  @ViewChild('flow', { static: true }) flow: IdeFlowIframeComponent;
  @ViewChild('form', { static: true }) form;
  @ViewChild('page', { static: true }) page: IdeFlowPageComponent;

  actionData: any = {};
  instanceId: string = '';
  formDataId: string = '';
  getFormParams: string = '';
  getFormMethod: string = '';
  formCode: string = 'CUS_INFO_FORM';
  getFormUrl: string = '/api/ps/customerHw/get'; // 首次打开审批时需要获取数据的链接
  submitUrl: string = ''; // 提交接口相关信息从路由获取
  submitMethod: string = 'POST';
  submitParams: any;

  ngOnInit(): void {
    this.initData()
  }

  ngOnDestroy(): void {
    this.ndtSrv.removeData()
  }

  initData() {
    // 获取后暂不删除 localStorage，以便获取其他数据（比如流程表单获取下拉的 options 数据）
    const { instanceId, formCode, formData, submitParams } = this.ndtSrv.getData({ keep: true })
    // console.log('in formData ==>', formData)
    this.instanceId = instanceId;
    this.flow.instanceId = instanceId;

    this.formCode = formCode;
    this.flow.formCode = formCode;

    this.updateTitle();
    this.setFormData(formData);

    if(submitParams) {
      this.submitUrl = submitParams.url;
      this.submitMethod = submitParams.method;
      this.submitParams = submitParams.params;
    }
  }

  updateTitle() {
    const parts = location.pathname.split('/')
    const pathName = parts[parts.length - 1]
    const found = routeTable.find(i => i.path ===  pathName)
    const flowName = found && found.flowName ? found.flowName : '审批流程'
    this.reuseTabService.title = flowName;
    this.titleSrv.setTitle(flowName)
    this.flow.flowName = flowName
    this.genFlowTitle(flowName)
  }

  genFlowTitle(flowName) {
    const currentUserName = this.settings.user.name || ''
    const today = new Date()
    const padZero = (num) => {
      return num < 10 ? '0' + num : String(num)
    }
    const date = today.getFullYear() + padZero(today.getMonth() + 1) + padZero(today.getDate())
    const names = [date, flowName]
    this.http.get('api/admin/baseusers/userPage', {
      userName: currentUserName,
      pageIndex: 1,
      pageSize: 1
    }).subscribe((res = {}) => {
      const data = res.data
      if (data && data.content[0] && data.content[0].description) {
        names.unshift(data.content[0].description)
      } else {
        names.unshift(currentUserName)
      }
    }, (err) => {
      console.error(err)
      names.unshift(currentUserName)
    }, () => {
      this.flow.flowTitle = names.join('_')
    })
  }

  formDataChange() {
    console.log('formdata change...');
    this.setFormData(this.form.formData);
    // if(this.formDataId || this.instanceId) {
    //   this.flow.defineFormData(); // 更新流程引擎链接
    // }
    if (!this.formDataId) return;
    // 新增状态下提交或者是暂存时触发
    if (
      !this.instanceId &&
      this.actionData.info &&
      (this.actionData.info.callbackName || this.actionData.info.callback)
    ) {
      this.flow.postFlowFrame()
      console.log(
        '监听formData, this.actionData.info',
        this.actionData.info,
      )
      if (
        this.actionData.info.callbackName === 'flowHold' ||
        this.actionData.info.callback === 'flowHold'
      ) {
        // 首次暂存时绑定表单和流程关系
        this.flow.bindInstance()
      }
    }
  }

  setFormData(formData: any = {}) {
    this.form.formData = formData;
    this.formData = formData;
    this.flow.formData = formData;
    if(formData.formDataId) {
      this.flow.formDataId = formData.formDataId;
      this.formDataId = formData.formDataId;
    }
  }

  addFormData(callback?: () => void) {
    this.ideSubmitService.saveFormData({
      ...this.formData,
      formCode: this.formCode
    }).subscribe(res => {
      if(res.code === 200) {
        // 填写返回参数信息
        this.setFormData(res.data);
        if (this.submitUrl) {
          this.ideSubmitService.submit(this.submitUrl, this.submitMethod, this.submitParams).subscribe(submitRes => {
            if(submitRes.code === 200) {
              this.flow.postFlowFrame();
              callback && callback()
            } else {
              this.msgSrv.error(submitRes.msg || '提交失败')
            }
          });
        } else {
          this.flow.postFlowFrame();
          callback && callback()
        }
      }
    })
  }

  actionComplete(callback?: any) {
    // 再次更新表单数据
    if (callback === 'flowStart') {
      // 更新表单数据
      const payload = {
        // id: this.formOption.id,
        // configurationValue: JSON.stringify(this.i),
      }
      // this.loading = true;
    } else {
      // 其他操作
      // setTimeout(() => {
      //   this.reuseTabService.close(window.location.pathname);
      //   // window.open('', '_self', '')
      //   // window.close()
      // }, 2000)
    }
  }

  prevPage() {
    if (this.page.currentPage === 1) {
      this.flow.closePage()
    } else {
      this.page.prev()
    }
  }
}
