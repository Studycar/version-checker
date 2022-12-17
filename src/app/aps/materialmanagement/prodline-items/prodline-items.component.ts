import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { MaterialmanagementProdlineItemsEditComponent } from './edit/edit.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PsItemRoutingsService } from '../../../modules/generated_module/services/ps-item-routings-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';

import { PopupSelectComponent } from '../../../modules/base_module/components/popup-select.component';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { MaterialmanagementProdlineItemsImportComponent } from './import/import.component';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-prodline-items',
  templateUrl: './prodline-items.component.html',
  providers: [PsItemRoutingsService],
})

export class MaterialmanagementProdlineItemsComponent implements OnInit {

  // kendo ui 使用的新方法
  public kendoHeight = document.body.clientHeight - 220;
  public form_marginTop = 5;
  expandForm = false;

  public view: GridDataResult;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 50,
  };

  public gridData: any[] = [];
  public totalCount = 0;

  applicationRateType: any[] = [];
  applicationOptions: any[] = [];
  applications: any[] = [];
  public changes: any = {};
  public mySelection: any[] = [];


  constructor(
    public http: _HttpClient,
    private formBuilder: FormBuilder,
    public editService: PsItemRoutingsService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) { }
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
    this.formHeight = 2 * 39;
    if (this.expandForm) {
      this.kendoHeight = this.kendoHeight - (2 * 39) - 5;
    } else {
      this.kendoHeight = this.kendoHeight + (2 * 39) + 5;
    }
  }

  queryParams: any = {};
  public clear() {
    this.queryParams = {

      plantGroupId: '',
      productLineId: '',
      itemCode: '',
      itemDesc: '',
      itemCodeS: '',
      itemCodeE: ''
    };

    // 清空物料选项
    // this.selMater1.Value = '';
    // this.selMater1.Text = '';
    // this.optionListItem1 = [];

     this.selMater2.Value = '';
     this.selMater2.Text = '';
     this.optionListItem2 = [];

     this.selMater3.Value = '';
     this.selMater3.Text = '';
     this.optionListItem3 = [];

    // 绑定工厂，并且给工厂条件赋默认的当前登录人的工厂，并且查询数据
    this.loadplant();

  }

  public query() {


    // 给物料查询条件赋值
    if (this.selMater2 !== undefined) {
      this.queryParams.itemCodeS = this.selMater2.Text;
    } else {
      this.queryParams.itemCodeS = '';
    }
    if (this.selMater3 !== undefined) {
      this.queryParams.itemCodeE = this.selMater3.Text;
    } else {
      this.queryParams.itemCodeE = '';
    }
    // this.editService.read(this.queryParams);

    const pageNo = this.gridState.skip / this.gridState.take + 1;
    const pageSize = this.gridState.take;
    this.editService.Search(this.queryParams, pageNo, pageSize).subscribe(result => {
      this.gridData.length = 0;
      this.totalCount = result.TotalCount;
      if (result !== null && result.Result !== null) result.Result.forEach(d => { this.gridData.push(d); });
      this.view = {
        data: process(this.gridData, {
          sort: this.gridState.sort,
          skip: 0,
          take: this.gridState.take,
          filter: this.gridState.filter
        }).data,
        total: this.totalCount
      };
    });
  }

  // 过滤替换 列表中快码的值
  public optionsFind(value: string): any {
    return this.applicationRateType.find(x => x.value === value) || { label: value };
  }

  expColumns = [

    { title: '工厂', field: 'plantCode', width: '200px', locked: false },
    { title: '物料', field: 'itemCode', width: '200px', locked: false },
    { title: '计划组', field: 'scheduleGroupCode', width: '200px', locked: false },
    { title: '资源', field: 'resourceCode', width: '200px', locked: false },
    { title: '资源类型', field: 'resourceType', width: '200px', locked: false },
    { title: '物料描述', field: 'descriptions', width: '200px', locked: false },
    { title: '速率类型', field: 'rateType', width: '200px', locked: false },
    { title: '速率', field: 'rate', width: '80px', locked: false },
    { title: '优先级', field: 'priority', width: '80px', locked: false },
    { title: '工序号', field: 'processCode', width: '200px', locked: false },
    { title: '参与排产标识', field: 'scheduleFlag', width: '200px', locked: false },
    { title: '参与选线标识', field: 'selectResourceFlag', width: '200px', locked: false },
  ];

  expColumnsOptions: any[] = [{ field: 'rateType', options: this.applicationRateType }];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    // this.gridData.length = 0;
    this.editService.export(
      this.queryParams,
      this.excelexport
    );
    
  }

  public add(item: any) {
    this.modal
      .static(
        MaterialmanagementProdlineItemsEditComponent,
        { i: { id: (item !== undefined ? item.id : null),
          plantCode: (item !== undefined ? item.plantCode : null)  } },
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
    this.query();

  }

  ngOnInit() {

    // console.log(this.mySelection);
    // 绑定工厂，并且给工厂条件赋默认的当前登录人的工厂，并且查询数据
    this.loadplant();

    this.loadRateType();

    // this.view = this.editService.pipe(
    // map(data => process(data, this.gridState)),
    // );
    // this.query();
  }




  public loadRateType(): void {
    this.commonQueryService.GetLookupByType('PS_RATE_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationRateType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  isLoading = false;

  // 绑定页面的下拉框Plant
  optionListPlant = [];
  // 绑定页面的下拉框Plant组
  optionListPlantGroup = [];
    // 绑定页面的下拉框产线
    optionListProductLine = [];

  loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      this.optionListPlant = result.Extra;
      this.queryParams.plantId = this.appConfigService.getPlantCode();
      // console.log(this.appConfigService.getPlantCode());

      // 根据工厂 加载组和产线
      this.loadplantGroup();
      this.loadproductLine();

      // 绑定物料
      this.loadItem();

      this.query();


    });

  }



  loadplantGroup(): void {
    this.isLoading = true;
    this.commonQueryService.GetUserPlantGroup(this.queryParams.plantId).subscribe(result => {
      this.isLoading = false;
      this.optionListPlantGroup = result.Extra;
    });
  }



  loadproductLine(): void {
    this.isLoading = true;
    this.commonQueryService.GetUserPlantGroupLine(this.queryParams.plantId, this.queryParams.plantGroupId).subscribe(result => {
      this.isLoading = false;
      this.optionListProductLine = result.Extra;

    });
  }

  // 绑定物料
  optionListItem1 = [];
  optionListItem2 = [];
  optionListItem3 = [];

  loadItem(): void {
    this.editService.SearchItemInfo(this.queryParams.plantID).subscribe(resultMes => {

      this.optionListItem1 = resultMes.data;
      this.optionListItem2 = resultMes.data;
      this.optionListItem3 = resultMes.data;
    });
  }


  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    /** 重新绑定  组*/

    this.commonQueryService
      .GetUserPlantGroup(value)
      .subscribe(result => {
        if (result.Extra == null) {
          this.optionListPlantGroup = [];
          return;
        } else {
          // 先清除，在重新绑定
          this.optionListPlantGroup = [];
          this.optionListPlantGroup = [
            ...this.optionListPlantGroup,
            ...result.Extra,
          ];
          return;
        }
      });

    this.loadItem();
  }

  // 组 值更新事件 重新绑定产线
  onChangeGroup(value: string): void {
    console.log(value);
    /** 重新绑定  组*/
    this.commonQueryService.GetUserPlantGroupLine(this.queryParams.plantID, value).subscribe(result => {
      if (result.Extra == null) {
        this.optionListProductLine = [];
        return;
      } else {
        // 先清除，在重新绑定
        this.optionListProductLine = [];
        this.optionListProductLine = [
          ...this.optionListProductLine,
          ...result.Extra,
        ];
        return;
      }
    });
  }

    // 导入
    public import() {
      this.modal
        .static(MaterialmanagementProdlineItemsImportComponent , {}, 'md')
        .subscribe(() => this.query());
    }


  gridView1: GridDataResult;
  gridView2: GridDataResult;
  gridView3: GridDataResult;
  Columns: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'descriptions',
      title: '物料描述',
      width: '100'
    }

  ];
  @ViewChild('selMater1', {static: true}) selMater1: PopupSelectComponent;
  @ViewChild('selMater2', {static: true}) selMater2: PopupSelectComponent;
  @ViewChild('selMater3', {static: true}) selMater3: PopupSelectComponent;

  onSearch1(e: any) {

    let filterRtl = [];
    if (e.SearchValue !== '' && e.SearchValue !== null && e.SearchValue !== undefined) {
      filterRtl = this.optionListItem1.filter(x => x.itemCode === e.SearchValue);
    } else {
      filterRtl = this.optionListItem1;
    }

    this.gridView1 = {
      data: filterRtl.slice(Number(e.Skip), Number(e.Skip) + Number(e.PageSize)),
      total: filterRtl.length
    };
  }

  onSearch2(e: any) {

    let filterRtl = [];
    if (e.SearchValue !== '' && e.SearchValue !== null && e.SearchValue !== undefined) {
      filterRtl = this.optionListItem2.filter(x => x.itemCode === e.SearchValue);
    } else {
      filterRtl = this.optionListItem2;
    }

    this.gridView2 = {
      data: filterRtl.slice(Number(e.Skip), Number(e.Skip) + Number(e.PageSize)),
      total: filterRtl.length
    };
  }

  onSearch3(e: any) {
    let filterRtl = [];
    if (e.SearchValue !== '' && e.SearchValue !== null && e.SearchValue !== undefined) {
      filterRtl = this.optionListItem3.filter(x => x.itemCode === e.SearchValue);
    } else {
      filterRtl = this.optionListItem3;
    }

    this.gridView3 = {
      data: filterRtl.slice(Number(e.Skip), Number(e.Skip) + Number(e.PageSize)),
      total: filterRtl.length
    };
  }

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.queryParams.itemCode = e.Text;
  }

  onRowSelectStart(e: any) {
    this.queryParams.itemCodeS = e.Text;
  }

  onRowSelectEnd(e: any) {
    this.queryParams.itemCodeE = e.Text;
  }

  Get() {
    this.msgSrv.success(this.selMater1.Text + ' ' + this.selMater1.Value);
  }

}
