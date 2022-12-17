import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { CustomOperateCellRenderComponent } from '../../../../modules/base_module/components/custom-operatecell-render.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { BrandService } from '../../../../layout/pro/pro.service';
// import { UpdateOprDetailComponent } from './update/update-opr-detail.component';
import { OrderPrecedenceRuleService } from '../order-precedence-rule.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'order-precedence-rule-detail',
  templateUrl: './order-precedence-rule-detail.component.html',
  styleUrls: ['./order-precedence-rule-detail.component.css'],
})
export class OrderPrecedenceRuleDetailComponent extends CustomBaseContext implements OnInit {
  @ViewChild('customTemplate', { static: true }) customTemplate: TemplateRef<any>;
  @ViewChild('customTemplate1', { static: true }) customTemplate1: TemplateRef<any>;
  @ViewChild('customTemplate2', { static: true }) customTemplate2: TemplateRef<any>;
  @ViewChild('customTemplate3', { static: true }) customTemplate3: TemplateRef<any>;
  @ViewChild('customTemplate4', { static: true }) customTemplate4: TemplateRef<any>;
  @ViewChild('customTemplate5', { static: true }) customTemplate5: TemplateRef<any>;
  @ViewChild('customTemplate6', { static: true }) customTemplate6: TemplateRef<any>;
  @ViewChild('customTemplate7', { static: true }) customTemplate7: TemplateRef<any>;
  @Input() public item?;

  yesNo: { label: string, value: any }[] = [];

  priorityList: any[] = [];

  title = '方案号详细页面';

  selectBy = 'id';

  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private oprService: OrderPrecedenceRuleService,
    private commonQueryService: CommonQueryService,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
  }

  ngOnInit() {
    this.columns = [
      {
        colId: 0, field: 'operation', headerName: '操作', width: 80, pinned: this.pinnedAlign, lockPinned: true,
        headerComponentParams: {
          template: this.headerTemplate,
        },
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate,
        },
      },
      {
        field: 'divisionName', headerName: '*优先级维度', width: 120,
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate1,
        },
      },
      {
        field: 'ratio', headerName: '*维度权重', width: 120,
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate2,
        },
      },
      {
        field: 'beginValue', headerName: '开始值', width: 120,
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate3,
        },
      },
      {
        field: 'endValue', headerName: '截止值', width: 120,
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate4,
        },
      },
      {
        field: 'assignValue', headerName: '指定值', width: 120,
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate5,
        },
      },
      {
        field: 'grade', headerName: '*分数', width: 120,
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate6,
        },
      },
      {
        field: 'enableFlag', headerName: '*是否启用', width: 100,
        cellRendererFramework: CustomOperateCellRenderComponent,
        cellRendererParams: {
          customTemplate: this.customTemplate7,
        },
      },
    ];

    this.commonQueryService.GetLookupByTypeRef('PP_ORDER_PRIORITY_DIVISION', this.priorityList);
    this.commonQueryService.GetLookupByTypeRef('FND_YES_NO', this.yesNo);

    this.query();
  }

  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.priorityList;
        break;
      case 2:
        options = this.yesNo;
        break;
    }
    let option = options.find(x => x.value === value);
    if (this.isNull(option)) {
      option = { value: value, label: value };
    }
    return option;
  }

  query(): void {
    this.oprService.queryDetail({ id: this.item.id }, this);

  }
  /* 网格内批量维护 */
  // 添加行到网格
  addToGrid() {
    this.gridData = [{ versionId: this.item.id, enableFlag: 'Y' }, ...this.gridData];
  }
  // 从网格移除
  removeFromGrid(dataItem: any) {
    this.gridData = this.gridData.filter(t => t[this.selectBy] !== dataItem[this.selectBy]);
  }
  // 保存到DB
  save() {
    this.oprService.SaveLines(this.gridData).subscribe(res => {
      if (res.code==200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功.'));
        this.query();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  /* 单条记录维护 */
  // add(): void {
  //   this.modal.static(UpdateOprDetailComponent, { editType: 'add', item: {}, VERSION_NAME: this.item.VERSION_NAME, VERSION_ID: this.item.ID }).subscribe(() => this.query());
  // }

  // edit(item): void {
  //   this.modal.static(UpdateOprDetailComponent, { editType: 'update', item, VERSION_NAME: this.item.VERSION_NAME, VERSION_ID: this.item.ID }).subscribe(() => this.query());
  // }

  // delete(item): void {
  //   this.oprService.deleteDetail([item.ID]).subscribe(res => {
  //     if (res.Success === true) {
  //       this.msgSrv.success(this.appTranslationService.translate('删除成功'));
  //       this.query();
  //     } else {
  //       this.msgSrv.error(res.Message);
  //     }
  //   });
  // }

}
