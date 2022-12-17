import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
import { NzMessageService } from "ng-zorro-antd";
import { NavigateDataTransferService } from 'app/modules/base_module/services/navigate-data-transfer.service';
import { routeTable } from '../route-map'

@Component({
    selector: 'ide-portal',
    templateUrl: './ide-portal.component.html',
})
export class IdePortalComponent extends CustomBaseContext implements OnInit {
    constructor(
      private appTranslationService: AppTranslationService,
      public http: _HttpClient,
      private routerInfo: ActivatedRoute,
      public msgSrv: NzMessageService,
      public router: Router,
      public ndtSrv: NavigateDataTransferService
    ) {
      super({ 
        appTranslationSrv: appTranslationService, 
      });
    }

    // 初始化
    ngOnInit() {
      this.initData();
    }

    initData() {
      const { getFormParams, formData, ...rest } = this.ndtSrv.getData()
      const queryParams = this.routerInfo.snapshot.queryParams

      const instanceId = queryParams.instanceId
      let pathName = queryParams.pathName
      console.log(queryParams, pathName);

      let $res: Observable<ResponseDto | { code: number, msg: string, data: any }>
      if (instanceId) { // 第一种：从待办进入，通过 instanceId 获取表单数据
        $res = this.http.get('/api/pi/pi-ide/get-form-data-by-procinstid', { procInstId: instanceId })
      } else if (getFormParams) { // 第二种：从业务接口通过数据 id 获取表单数据
        const { url, params } = getFormParams
        const method = getFormParams.method.toLowerCase()
        $res = this.http[method](url, params)
      } else if (formData) { // 第三种：直接使用源页面通过 localStorage 传过来的表单数据
        // console.log('in =>', formData)
        $res = from(Promise.resolve({ code: 200, msg: '', data: formData }))
      }

      $res.subscribe(res => {
        try {
          if(res.code === 200 && res.data) {
            let formCode = ''
            // 通过 pathName 反查 formCode
            if (pathName) {
              const found = routeTable.find(item => item.path === pathName)
              if (found) {
                formCode = found.formCode
              } else {
                throw new Error(this.appTranslationService.translate('无法找到路由信息'))
              }
            }
            // 通过 formCode 反查 pathName
            if (res.data.formCode) {
              const instanceFormCode = res.data.formCode
              let found;
              if(res.data.formCodeType) {
                const instanceFormCodeType = res.data.formCodeType
                found = routeTable.find(item => {
                  return item.formCode === instanceFormCode && item.formCodeType === instanceFormCodeType
                })
              } else {
                found = routeTable.find(item => {
                  return item.formCode === instanceFormCode
                })
              }
              if (found) {
                pathName = found.path
                formCode = instanceFormCode
              } else {
                throw new Error(this.appTranslationService.translate('无法找到路由信息'))
              }
            }
            this.ndtSrv.setData({
              ...rest,
              formCode,
              instanceId,
              formData: res.data,
            })
            this.goTo(pathName)
          } else {
            throw new Error(this.appTranslationService.translate(res.msg || '请求出错'))
          }
        } catch (err) {
          this.msgSrv.error(err.message);
          this.goBack()
        }
      }, error => {
        this.msgSrv.error(error);
        this.goBack()
      })
    }

    goTo(pathName) {
      const queryParams = { ...this.routerInfo.snapshot.queryParams }
      if (queryParams.pathName) {
        delete queryParams.pathName
      }
      this.router.navigate([`./ide/${pathName}`], {
        queryParams
      })
    }

    goBack () {
      setTimeout(() => {
        history.back()
      }, 2000)
    }
}