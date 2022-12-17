import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { QueryService } from './viewService';
import { DlyCalendarService } from '../../../../modules/generated_module/services/dly-calendar-service';
import { PreparationPlatformDlycalendarViewEditComponent } from '../view-edit/view-edit.component';
import { CustomOperateCellRenderComponent } from 'app/modules/base_module/components/custom-operatecell-render.component';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-dlycalendar-view',
  templateUrl: './view.component.html',
  providers: [QueryService]
})
export class PreparationPlatformDlycalendarViewComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;

  record: any = {};
  i: any;
  mySelection: any[] = [];
  calendaroptions: any[] = [];
  selectKeys = 'id';
  queryParams = {
    plantCode: '',
    deliveryCalendarCode: ''
  };

  constructor(
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public viewService: QueryService,
    public dataService: DlyCalendarService,
    private modalService: NzModalService,
    private appTranslationService: AppTranslationService,
    private appconfig: AppConfigService
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 303;
  }

  public columns = [
    {
      colId: 0, field: '', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
      headerComponentParams: {
        template: this.headerTemplate
      },
      cellRendererFramework: CustomOperateCellRenderComponent,       // Component Cell Renderer
      cellRendererParams: {
        customTemplate: null,         // Complementing the Cell Renderer parameters
      }
    },
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'plantCode', headerName: '工厂', width: 100 },
    { field: 'deliveryCalendarCode', headerName: '多班次送货模型', width: 150 },
    { field: 'shiftCode', headerName: '班次编码', width: 100 },
    { field: 'shiftStartTime', headerName: '开始时间', width: 100 },
    { field: 'shiftEndTime', headerName: '结束时间', width: 100 }
  ];

  ngOnInit(): void {
    this.columns[0].cellRendererParams.customTemplate = this.customTemplate;
    this.calendaroptions = this.i.calendaroptions;
    this.queryParams = {
      plantCode: this.i.plantCode,
      deliveryCalendarCode: this.i.deliveryCalendarCode
    };
    this.query();
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.calendaroptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  httpAction = {
    url: this.dataService.url1,
    method: 'GET',
    data: false
  };

  query() {
    super.query();
    this.viewService.loadGridViewNew(this.httpAction, this.queryParams, this.context);
  }

  add(item?: any) {
    console.log('DELIVERY_CALENDAR_CODE：' + this.i.deliveryCalendarCode);
    this.modal
      .static(
        PreparationPlatformDlycalendarViewEditComponent,
        {
          i: { id: (item !== undefined ? item.id : null), plantCode: this.i.plantCode, deliveryCalendarCode: (item !== undefined ? item.deliveryCalendarCode : this.calendaroptions.find(x => x.value === this.i.deliveryCalendarCode)).label, enableFlag: this.i.enableFlag }
        },
        'lg',
      ).subscribe(
        (value) => {
          if (value) {
            this.query();
          }
        }
      );
  }

  remove(value: any) {
    this.dataService.ViewDelete([value.id]).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });

  }

  RemoveBatch() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning('请选择要删除的数据。');
      return;
    }
    this.modalService.confirm({
      nzContent: this.appTranslationService.translate('确定要删除吗？'),
      nzOnOk: () => {
        this.dataService.ViewDelete(this.selectionKeys).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('删除成功'));
            this.query();
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }

}
