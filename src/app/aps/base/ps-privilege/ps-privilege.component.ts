// 用户权限

import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { BasePsPrivilegeEditComponent } from './edit/edit.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BasePsPrivilegeEditService } from './edit.service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-ps-privilege',
  templateUrl: './ps-privilege.component.html',
  providers: [BasePsPrivilegeEditService],
})
export class BasePsPrivilegeComponent implements OnInit {


  // kendo ui 使用的新方法
  public kendoHeight = document.body.clientHeight - 220;
  public form_marginTop = 5;
  expandForm = false;

  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 50,
  };
  applicationOptions: any[] = [];
  applications: any[] = [];
  public changes: any = {};
  public mySelection: any[] = [];
  // 过滤替换 列表中快码的值
  applicationsMSG: any[] = [];

  constructor(
    public http: _HttpClient,
    private formBuilder: FormBuilder,
    public editService: BasePsPrivilegeEditService,
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private commonQueryService: CommonQueryService
  ) { }


  queryParams: any = {};


  public clear() {
    this.queryParams = {
      userId: '',
      plantId: '',
      plantGroupId: '',
      productLineId: '',
      modify: '',
      publish: '',
    };
  }

  public query() {
    this.editService.read(this.queryParams);
  }

  expColumns = [

    { title: '用户', field: 'userName', width: '200px', locked: true },
    { title: '用户描述', field: 'description', width: '200px', locked: true },
    { title: '组织', field: 'plantCode', width: '200px', locked: false },
    { title: '计划组', field: 'scheduleGroupCode', width: '200px', locked: false },
    { title: '资源', field: 'resourceCode', width: '200px', locked: false },
    { title: '修改', field: 'modifyPrivilageFlag', width: '80px', locked: false },
    { title: '发放', field: 'publishPrivilageFlag', width: '80px', locked: false },
    { title: '是否发送邮件', field: 'sendEmailFlag', width: '200px', locked: false },
    { title: '接收消息类型', field: 'receiveMsgType', width: '200px', locked: false }

  ];


  expColumnsOptions: any[] = [{ field: 'receiveMsgType', options: this.applicationsMSG }];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    // this.gridData.length = 0;
    this.editService.export(
      this.queryParams,
      this.excelexport
    );
  }


  searchExpand() {
    this.expandForm = !this.expandForm;
    this.resetGridHeight();
  }

  /* #customForm height */
  private formHeight = 0;
  /* 重设grid height */
  private resetGridHeight() {
    // if (this.context.gridHeightArg.topMargin) {
    /* 方法一：查询区一行行高粗算按39，不会闪烁 */
    // const rows = Math.ceil((this.queryParams.defines.length + 1) / this.columnCount);
    this.formHeight = 3 * 39;
    if (this.expandForm) {
      this.kendoHeight = this.kendoHeight - (3 * 39) - 5;
    } else {
      this.kendoHeight = this.kendoHeight + (3 * 39) + 5;
    }
  }


  public application(id: string): any {
    return this.applications.find(x => x.applicationId === id);
  }

  public add(item: any) {
    this.modal
      .static(
        BasePsPrivilegeEditComponent,
        { i: { Id: (item !== undefined ? item.Id : null) } },
        'lg',
    )

      .subscribe((value) => {
        if (value) {
          this.query();
        }
      });
  }

  public remove(item: any) {
    this.editService.Remove(item).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('删除成功');
        this.query();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  removeBath() {
    if (this.mySelection.length < 1) {

      this.msgSrv.success('请选择要删除的数据。');
      return;
    }
    // 弹出确认框
    console.log(this.mySelection);

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认删除该记录?'),
      nzOnOk: () => {
        this.editService.RemoveBath(this.mySelection).subscribe(res => {
          this.msgSrv.success('删除成功');
          this.query();
        });
      },
    });
  }

  // 列头排序
  public onStateChange(state: State) {
    this.gridState = state;
    console.log(state);
    this.editService.read();
  }


  public loadMSG(): void {
    this.commonQueryService.GetLookupByType('PS_RECEIVE_MSG_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationsMSG.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  // 过滤替换 列表中快码的值
  public optionsFind(value: string): any {
    return this.applicationsMSG.find(x => x.value === value) || { label: value };
  }

  ngOnInit() {
    // console.log(this.mySelection);
    this.loadMSG();
    this.loadUser();
    this.loadplant();
    this.loadplantGroup();
    this.loadproductLine();

    this.view = this.editService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.query();
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
      result.data.forEach(d => {
        this.optionListUSER.push({
          userName: d.userName
        });
      });
    });
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
    this.editService.GetAppliactioGroup().subscribe(result => {
      this.isLoading = false;
      this.optionListPlantGroup = result.data;
    });
  }

  loadproductLine(): void {

    this.isLoading = true;
    this.editService.GetAppliactioLine().subscribe(result => {
      this.isLoading = false;
      this.optionListProductLine = result.data;
    });
  }

  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    /** 重新绑定  组*/

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



}
