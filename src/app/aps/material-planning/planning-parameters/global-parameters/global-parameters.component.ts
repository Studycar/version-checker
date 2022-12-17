import { Component, OnInit } from '@angular/core';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { BrandService } from 'app/layout/pro/pro.service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { NumberInputRendererComponent } from '../number-input-renderer.component';
import { SelectInputRendererComponent } from '../select-input-renderer.component';
import { CheckboxInputRendererComponent } from '../checkbox-input-renderer.component';
import { PlanningParametersService } from '../planning-parameters.service';
import { ActionResponseDto } from '../../../../modules/generated_module/dtos/action-response-dto';
import { forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ResponseDto } from '../../../../modules/generated_module/dtos/response-dto';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'global-parameters',
  templateUrl: './global-parameters.component.html',
  providers: [PlanningParametersService]
})
export class GlobalParametersComponent extends CustomBaseContext implements OnInit {

  constructor(
    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private commonQueryService: CommonQueryService,
    private modal: NzModalRef,
    private queryService: PlanningParametersService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
  }

  gridHeight = 350;
  title: string;
  type: string; // 用以区分从哪进入，global： 从计划参数进入； operation： 从计划工厂进入；
  planName: string;
  plantCode: string; // 当从计划工厂进入时才用得到
  lookupCodeObj: { [key: string]: Array<{ label: string, value: any }> } = {};
  frameworkComponents = Object.assign(
    {},
    this.gridOptions.frameworkComponents,
    {
      numberInputRenderer: NumberInputRendererComponent,
      selectInputRenderer: SelectInputRendererComponent,
      checkboxInputRenderer: CheckboxInputRendererComponent
    });
  columns = [
    {
      field: 'orderNum',
      headerName: '序号',
      width: 80,
      menuTabs: ['filterMenuTab'],
      sortable: true,
      sortingOrder: ['desc', 'asc'],
      sort: 'asc',
    },
    {
      field: 'parameterDesc',
      headerName: '参数名称',
      width: 200,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'defaultValue',
      headerName: '默认值',
      width: 130,
      valueFormatter: params => {
        if (params.data.lookupTypeCode) {
          return params.data.options.find(item => item.value === params.value) ? params.data.options.find(item => item.value === params.value).label : params.value;
        } else {
          return params.value;
        }
      },
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'parameterValue',
      headerName: '参数值',
      width: 200,
      cellRendererSelector: params => {
        if (params.data.dataType === 'NUMBER') {
          return {
            component: 'numberInputRenderer'
          };
        } else if (params.data.lookupTypeCode) {
          return {
            component: 'selectInputRenderer',
            params: { options: params.data.options }
          };
        } else {
          return null;
        }
      },
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'enableFlag',
      headerName: '启用',
      width: 120,
      cellRenderer: 'checkboxInputRenderer',
      menuTabs: ['filterMenuTab'],
    }
  ];

  ngOnInit() {

    this.query().then(r => { });
  }

  // 查询方法async----await方式实现(相比于rxjs的实现方式性能应该更优)
  async query() {
    this.setLoading(true);
    let res: ResponseDto;
    let obj: any = {
      planName: '',
      plantCode: ''
    };
    console.log('---------=====' + this.planName);
    obj.planName = this.planName;
    if (this.type === 'global') {
      res = await this.queryService.loadGlobalParametersData(obj).toPromise();
    } else {
      obj.plantCode = this.plantCode;
      res = await this.queryService.queryPlanPlantParameter(obj).toPromise();
    }
    const lookupCodeSet = new Set<string>();
    res.data.content.forEach(item => {
      if (item.lookupTypeCode) {
        lookupCodeSet.add(item.lookupTypeCode);
      }
    });
    for (const item of lookupCodeSet) {
      const lookupCodeRes = await this.commonQueryService.GetLookupByType(item).toPromise();
      const options: Array<{ label: string, value: any }> = [];
      lookupCodeRes.Extra.forEach(d => {
        options.push({
          label: d.meaning,
          value: d.lookupCode
        });
      });
      this.lookupCodeObj[item] = [...options];
    }
    res.data.content.forEach(item => {
      item.orderNum = Number(item.orderNum);
      if (item.lookupTypeCode) {
        item.options = this.lookupCodeObj[item.lookupTypeCode];
      }
    });
    this.gridData = res.data.content;
    this.setLoading(false);
  }

  // 查询方法rxjs操作符实现
  anotherQuery() {
    this.setLoading(true);
    let res$: Observable<ResponseDto>;
    let res: ResponseDto;
    let obj: any;
    obj.planName = this.planName;
    obj.plantCode = this.plantCode;
    res$ = this.type === 'global' ? this.queryService.loadGlobalParametersData({ planName: obj.planName }) : this.queryService.queryPlanPlantParameter({ planName: obj.planName, plantCode: obj.plantCode });
    res$.pipe(
      switchMap(result => {
        res = result;
        const lookupCodeSet = new Set<string>();
        res.data.forEach(item => {
          if (item.lookupTypeCode) {
            lookupCodeSet.add(item.lookupTypeCode);
          }
        });
        const arr: Array<Observable<ActionResponseDto>> = [];
        for (const item of lookupCodeSet) {
          arr.push(this.commonQueryService.GetLookupByType(item));
        }
        return forkJoin(arr);
      })
    ).subscribe(result => {
      result.forEach(item => {
        const options: Array<{ label: string, value: any }> = [];
        item.Extra.forEach(_item => {
          options.push({
            label: _item.meaning,
            value: _item.lookupCode
          });
          this.lookupCodeObj[_item.lookupTypeCode] = [...options];
        });
      });
      res.data.forEach(item => {
        item.orderNum = Number(item.orderNum);
        if (item.lookupTypeCode) {
          item.options = this.lookupCodeObj[item.lookupTypeCode];
        }
      });
      this.gridData = res.data;
      this.setLoading(false);
    });
  }

  useDefaultValue() {
    const tempData = [...this.gridData];
    tempData.forEach(item => {
      item.defaultValue = item.defaultValue;
    });
    this.gridData = [...tempData];
  }

  save() {
    if (this.type === 'global') {
      //obj.planName=this.planName;
      //obj.plantCode=this.plantCode;
      //obj=this.gridData
      this.queryService.saveGlobalParameters(this.gridData).subscribe(res => {
        if (res.code = 200) {
          this.msgSrv.success(this.appTranslationService.translate('保存成功!'));
          this.modal.close();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    } else {
      // let obj:any;
      // obj.planName=this.planName;
      // obj.plantCode=this.plantCode;
      this.queryService.savePlanPlantParameter(this.gridData).subscribe(res => {
        if (res.code = 200) {
          this.msgSrv.success(this.appTranslationService.translate('保存成功!'));
          this.modal.close();
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    }
  }
}
