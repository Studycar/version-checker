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

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mrp-operator-library',
  templateUrl: './mrp-operator-library.component.html',
  providers: [PlanningParametersService]
})
export class MrpOperatorLibraryComponent extends CustomBaseContext implements OnInit {

  constructor(
    private pro: BrandService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private msgSrv: NzMessageService,
    private modal: NzModalRef,
    private commonQueryService: CommonQueryService,
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

  planName: string;
  plantCode: string;
  gridHeight = 350;
  whetherOptions: Array<{ label: string, value: any }> = [];
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
      headerName: '序号',
      width: 80,
      valueGetter: function (params) {
        return params.node.rowIndex + 1;
      },
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'subinventoryCode',
      headerName: '子库存',
      width: 100,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'description',
      headerName: '名称',
      width: 200,
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'origNettingType',
      headerName: '默认值',
      width: 130,
      valueFormatter: 'ctx.optionsFind(value,1).label',
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
    this.loadWhetherOptions();
    this.query();
  }

  query() {
    this.setLoading(true);
    let obj: any = { planName: '', plantCode: '' };
    obj.planName = this.planName;
    obj.plantCode = this.plantCode;
    console.log("this.plantCode="+this.plantCode);
    this.queryService.queryPlanPlantOperatorLibrary(obj).subscribe(res => {
      this.gridData = res.data;
      this.setLoading(false);
    });
  }

  optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    if (optionsIndex === 1) {
      options = this.whetherOptions;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  loadWhetherOptions() {
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO',this.whetherOptions)
    /*.subscribe(result => {
      this.whetherOptions.length = 0;
      result.Extra.forEach(d => {
        this.whetherOptions.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    })*/;
  }

  useDefaultValue() {
    const tempData = [...this.gridData];
    tempData.forEach(item => {
      item.enableFlag = item.origNettingType;
    });
    this.gridData = [...tempData];
  }

  /*close() {
    this.modal.destroy();
  }*/

  save() {
    this.queryService.savePlanPlantOperatorLibrary(this.gridData).subscribe(res => {
      if (res.code = 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功!'));
        this.modal.close();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }
}
