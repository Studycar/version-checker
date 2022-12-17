import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ReuseTabService } from '@delon/abc';
import { TitleService, _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService } from 'ng-zorro-antd';
import { IdeFlowQueryService } from './query.service';
import { environment } from '@env/environment';

@Component({
  selector: 'flow-iframe',
  template: `
    <div class="flow-iframe-wrapper" id="iframeParent">
      <!-- <iframe
        class="flow-iframe"
        [ngStyle]="{
          'display': this.flowUrl ? 'block': 'none',
          'height': this.inApp ? '100vh' : 'calc(100vh - 56px)'
        }"
        [src]="flowUrl"
        name="flow"
      ></iframe> -->
    </div>
  `,
  styles: [
    `
      .flow-iframe {
        width: calc(100% + 24px);
        border: none;
        margin-left: -12px;
      }
    `
  ],
  providers: [IdeFlowQueryService]
})
export class IdeFlowIframeComponent implements OnInit, OnDestroy {
  @Input() f;
  @Input() formCode = '';
  @Input() customTitle = '';
  @Output() addFormData = new EventEmitter<any>();
  @Output() actionComplete = new EventEmitter<any>();
  @Output() prevPage = new EventEmitter<any>();

  // isShow: boolean = true;
  // firstStart: boolean = false;
  beforeCheck: boolean = false;
  submitCheck: boolean = false;
  templateCode: string = '';
  formData;
  formDataId: string = '';
  instanceId: string = '';
  flowTitle: string = '';
  flowName: string = '';
  flowUrl;
  originFlowUrl: string = '';
  actionData;
  inApp = environment.inApp

  constructor(
    private msgSrv: NzMessageService,
    private queryService: IdeFlowQueryService,
    private appTranslationService: AppTranslationService,
    public http: _HttpClient,
    private sanitizer: DomSanitizer,
    private reuseTabService: ReuseTabService,
    private routerInfo: ActivatedRoute,
    private render: Renderer2,
  ) {

  }

  ngOnInit(): void {
    // this.isShow = true;
    if (!this.inApp) {
      this.setIFrame();
    }
    this.beforeCheck = false;
    this.submitCheck = false;
    this.initPage();
    window.addEventListener('message', this.messageHandler)
  }

  setIFrame() {
    var target = document.getElementById("iframeParent");
    var newFrame = document.createElement("iframe");
    // newFrame.setAttribute("src", this.flowUrl);
    newFrame.name="flow";
    newFrame.id="iframeFlow";
    if (this.flowUrl) {
      newFrame.style.setProperty('display', 'block');
    } else { newFrame.style.setProperty('display', 'none'); }
    if (this.inApp) {
      newFrame.style.setProperty('height', '100vh');
    } else { newFrame.style.setProperty('height', 'calc(100vh - 56px)'); }
    newFrame.setAttribute('src', this.flowUrl);
    newFrame.style.setProperty('width', 'calc(100% + 24px)');
    newFrame.style.setProperty('border', 'none');
    newFrame.style.setProperty('margin-left', '-12px');

    if (target !== null) {
      target.appendChild(newFrame);
    }
  }

  onFlowChange() {
    const iframeELe = document.getElementById('iframeFlow');
    if (iframeELe) {
      iframeELe.setAttribute('src', this.flowUrl);
      if (this.flowUrl) {
        iframeELe.style.setProperty('display', 'block');
      } else { iframeELe.style.setProperty('display', 'none'); }
    } else {
      this.setIFrame();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.messageHandler)
  }

  // getIframeStyle() {
  //   return {
  //     'display': this.flowUrl ? 'block': 'none',
  //     'height': this.inApp ? '(100vh - 55px)' : 'calc(100vh - 130px)'
  //   }
  // }

  messageHandler = (e) => {
    // console.log('in messageHandler ==>', e)
    if(this.f.invalid) {
      this.msgSrv.warning(this.appTranslationService.translate('请检查表单信息是否完整'));
      return;
    }

    if (!e.data || !e.data.action) {
      return
    }

    // 提交前的钩子
    if (e.data.action === 'beforeProcessEnterAction') {
      // TODO 防止短时间内重复触发，应该有更好的方案
      if(this.beforeCheck) { return; }
      this.beforeCheck = true;
      setTimeout(() => {
        this.beforeCheck = false;
      }, 500);

      this.actionData = e.data;
      this.addFormData.emit();
    }

    // 按钮事件
    if (e.data.action === 'button') {
      const actionInfo = e.data.info

      if (!actionInfo) {
        this.msgSrv.warning('缺失流程按钮信息')
        return
      }

      if (actionInfo.res && actionInfo.res.code !== 0) {
        this.msgSrv.warning(this.appTranslationService.translate(e.data.info.res.message));
        return;
      }

      // TODO 防止短时间内重复触发，应该有更好的方案
      if(this.submitCheck) { return; }
      this.submitCheck = true;
      setTimeout(() => {
        this.submitCheck = false;
      }, 500);
      
      this.actionData = e.data;
      const buttonName = actionInfo.callback
      let saveFormCb

      // console.log('button事件', this.actionData);
      // 首次和二次提交事件
      if (buttonName === 'flowStart') {
        // 首次提交，绑定表单和流程关系
        if (!this.instanceId) {
          this.bindInstance(() => {
            this.closePage()
            if (!window.opener) {
              this.initFlow(this.templateCode);
            }
          });
        }
        // 二次提交（即撤回/驳回后重新提交）
        else {
          saveFormCb = () => {
            this.actionComplete.emit(buttonName)
            this.closePage()
          }
          this.addFormData.emit(saveFormCb);
        }
      }
      // 审批事件
      else if (buttonName === 'flowApprove') {
        this.closePage()
      }
      // 暂存事件
      else if (buttonName === 'flowHold') {
        if (this.formDataId) {
          saveFormCb = () => {
            this.actionComplete.emit();
            // 暂存后留在当前页面
            // this.isShow = false;
          }
        }
        this.addFormData.emit(saveFormCb);
      }
      // 上一步/关闭事件（）
      else if (['prev', 'close'].includes(buttonName)) {
        this.prevPage.emit();
      } 
      // 其他按钮事件
      else {
        if (actionInfo && actionInfo.res && actionInfo.res.message) {
          this.msgSrv.success(actionInfo.res.message);
        }
        // 传阅、撤回、取消沟通、待办无须关闭页面
        if (['flowCirculate', 'reback', 'cancelCommunicate', 'urge'].indexOf(buttonName) === -1) {
          this.closePage()
        }
        this.actionComplete.emit(buttonName)
      }
    }
  }

  /** 关闭页面：检测流程页是否由其他标签页窗口打开，若是则返回到该标签页窗口，否则关闭当前标签 */
  closePage() {
    if (this.inApp) {
      window.location.href = 'http://mc_exit//';
      return
    }
    if (window.opener) {
      window.close()
      return
    }
    this.reuseTabService.close(window.location.pathname);
  }

  initPage() {
    const { modelId } = this.routerInfo.snapshot.queryParams;
    // 从宏旺跳转过来的页面携带的 modelId 就是 templateCode
    if(modelId) {
      // this.findTargetLookup()
      //   .then((option) => this.updateTitle(option))
      //   .catch(() => {})
      this.templateCode = modelId;
      this.initFlow(this.templateCode);
    } else {
      this.findTargetLookup().then((option) => {
        // this.updateTitle(option)
        const modelCode = option.attribute2;
        if (modelCode) {
          this.queryService.getTemplateCodeByModelCode(modelCode).subscribe(res => {
            if (res.data) {
              this.templateCode = res.data
              this.initFlow(this.templateCode)
            }
          })
        } else { // 兜底，正常情况下不会走到这个分支
          this.templateCode = option.attribute1;
          this.initFlow(this.templateCode)
        }
      }).catch(() => {})
    }
  }

  /** 找到目标快码 */
  findTargetLookup() {
    const promise = new Promise<any>((resolve, reject) => {
      this.queryService.GetLookupByType('PI_CONFIG_IDE_FORM_LIST').subscribe(res => {
        const option = res.Extra.find(d => d.lookupCode === this.formCode);
        if (option) {
          resolve(option)
        } else {
          reject(new Error('没有此流程模板'))
        }
      }, (err) => {
        reject(err)
      })
    })
    promise.catch(err => {
      this.msgSrv.warning(err.message);
    })
    return promise
  }

  initFlow(templateCode: string) {
    if(templateCode) {
      this.queryService.getFlowUrl(templateCode, '', this.instanceId).subscribe(async res => {
        let flowUrl = res.data.flowUrl;
        if(!this.formDataId && !this.instanceId) {
          // 启用提交前的钩子（beforeProcessEnterAction）
          // isBeforeAction = true 相当于 beforeActionList=start,approve
          // 应流程平台要求，暂存也需要利用 beforeAction 保存表单信息
          // 因此用 beforeActionList=start,approve,hold 代替 isBeforeAction=true';
          flowUrl += '&beforeActionList=start,approve,hold'
        } else {
          flowUrl = await this.getInstanceIdAndInitFlowUrl(flowUrl);
        }
        // 增加平台判断
        if (environment.inApp) {
          flowUrl += '&iframeType=app'
        } else {
          flowUrl += '&iframeType=v2'
        }
        // 要求流程引擎显示“上一步”按钮
        flowUrl += '&showButton=prev'
        // top_title：v2 页面标题
        // title：app 顶部标题
        // 设置 random，使每个流链接不同
        const random = Math.floor(Math.random() * 100);
        flowUrl += `&top_title=${this.flowName}&title=${this.flowName}&random=${random}`
        this.originFlowUrl = flowUrl;
        // this.flowUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${flowUrl}`);
        this.flowUrl = flowUrl;
        this.onFlowChange();
      }, error => {
        this.msgSrv.error(this.appTranslationService.translate(error));
      });
    }
  }

  async getInstanceIdAndInitFlowUrl(flowUrl) {
    let url = flowUrl
    if(!this.formDataId && !this.instanceId) { 
      return url; 
    }
    url += `&procInstId=${this.instanceId}&formDataId=${this.formDataId}`;
    let { taskId, taskKey, id } = this.routerInfo.snapshot.queryParams;
    let data = null;
    if (id) url += `&todoId=${id}`
    else {
      if (!data) data = await this.getInstance();
      if (data) url += `&todoId=${data.id}`;
    }
    if (taskId) url += `&taskId=${taskId}`
    else {
      if (!data) data = await this.getInstance();
      if (data) url += `&taskId=${data.taskId}`;
    }
    if (taskKey) url += `&taskKey=${taskKey}`
    else {
      if (!data) data = await this.getInstance();
      if (data) url += `&taskKey=${data.taskKey}`;
    }
    return url;
  }

  async getInstance() {
    const res = await this.queryService.getInstance(this.instanceId).toPromise();
    if(res.code === 200 && res.data.data.records.length > 0) {
      return res.data.data.records[0];
    } else { return null; }
  }

  defineFormData() {
    this.flowUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.originFlowUrl}&formData=${JSON.stringify(this.formData)}`)
  }

  postFlowFrame() {
    console.log('in postFlowFrame ==>')
    // 通过表单信息刷新流程引擎
    // 由于流程平台要求，只需要在触发 beforeAction 后再回调 iframe
    if (this.actionData && this.actionData.info && this.actionData.info.callbackName) {
      window.frames['flow'].postMessage(
        {
          type: 'frameAction',
          info: {
            bnsQuery: {
              formDataId: this.formDataId, // 生成的表单提交给iframe页面
              procTitle: this.flowTitle // 设置在宏信(门户/APP显示的标题)
            },
            callbackName: this.actionData.info.callbackName, // 上面接收到的callbackName  再返回来
          },
        },
        '*',
      )
    }
  }

  bindInstance(callback?: () => void) {
    console.log('bindInstance...')
    if (!this.formDataId || this.instanceId) {
      return
    }
    console.log('bindInstance this.actionData:', this.actionData)
    let _instanceId
    try {
      _instanceId = this.actionData.info.res.data
    } catch (e) {}
    if (!_instanceId) return
     // 绑定instanceId和formDataId关系
    this.instanceId = _instanceId;
    this.queryService.setRelation(this.formDataId, this.instanceId).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('提交成功');
        this.actionComplete.emit();
        // 如果是从外部系统通过 window.open 跳过来的，需要关闭当前标签页并回到外部系统
        if (callback) {
          callback()
        }
      } else {
        console.log('error res:', res);
      }
    })
  } 

}