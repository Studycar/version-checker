import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { UiType } from '../../../../modules/base_module/components/custom-form-query.component';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { BrandService } from 'app/layout/pro/pro.service';
import { EditService } from '../edit.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-digitalization-workbench-digitalization',
  templateUrl: './digitalization.component.html',
  providers: [EditService],
})
export class PlanscheduleDigitalizationWorkbenchDigitalizationComponent extends CustomBaseContext implements OnInit {
  public selectBy = 'scheduleGroupCode';

  // 绑定页面的下拉框Plant
  public optionListPlant: any[] = [];

  Istrue: boolean;

  isLoading = false;
  i: any = {};
  expand = false;
  // 日期范围
  dateRange = [];

  onDateRangeChange(event: any) {
    // console.log(event);
  }

  public columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    {
      field: 'scheduleGroupCode',
      headerName: '计划组名称',
      width: 300,
      tooltipField: 'scheduleGroupCode',
      menuTabs: ['filterMenuTab'],
    },
    {
      field: 'descriptions',
      headerName: '计划组描述',
      width: 300,
      tooltipField: 'descriptions',
      menuTabs: ['filterMenuTab'],
    },
  ];


  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private confirmationService: NzModalService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    public editService: EditService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);

  }

  ngOnInit() {
    this.loadplant();

    this.queryCommon();
  }

  private getQueryParamsValue(): any {
    return {
      plantCode: this.i.plantCode,
    };
  }

  httpAction = { url: this.editService.queryUrlGroup, method: 'POST' };

  public query() {
    super.query();
    this.queryCommon();
  }

  private queryCommon() {

    this.commonQueryService.loadGridView(this.httpAction, this.getQueryParamsValue(), this.context);
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }


  loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      this.optionListPlant = result.Extra;
      this.i.plantCode = this.appConfigService.getPlantCode();
    });
  }

  public dtos = {
    groupCode: [],
    plantCode: '',
    endBegin: null,
    endEnd: null,

  };

  // 确定
  confirm() {

    console.log(this.selectionKeys);
    if (this.selectionKeys.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择计划组!'));
      return;
    }
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认提交智能排产请求?'),
      nzOnOk: () => {
        // 日期
        if (this.dateRange.length > 0) {

          this.i.endBegin = this.dateRange[0];
          this.i.endEnd = this.dateRange[1];
        } else {
          this.i.endBegin = '';
          this.i.endEnd = '';
        }
        this.i.groupCode = this.selectionKeys;


        this.dtos.groupCode = this.i.groupCode;
        this.dtos.plantCode = this.i.plantCode;
        this.dtos.endBegin = this.i.endBegin;
        this.dtos.endEnd = this.i.endEnd;
        console.log(this.dtos);
        this.editService.SendGADigit(this.i.groupCode, this.i.plantCode, this.i.endBegin, this.i.endEnd).subscribe(res => {
          if (res.code === 200) {

            this.msgSrv.success('智能排产请求已提交，请等候处理');
            this.modal.close(true);
          } else {
            this.msgSrv.error(res.msg);
          }
        });

      },
    });
  }


  close() {
    this.modal.destroy();
  }

  // 工厂 值更新事件 重新绑计划员
  onChangePlant(value: string): void {
    // 绑定计划组
    this.queryCommon();
  }
}
