/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-07-15 15:08:58
 * @LastEditors: Zwh
 * @LastEditTime: 2021-01-28 15:05:58
 * @Note: ...
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { RequestSubmitQueryService } from '../../../../modules/generated_module/services/request-submit-query-service';

import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { PopupSelectComponent } from '../../../../modules/base_module/components/popup-select.component';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { MixedResourceIssuedResourceIssuedEditService } from '../edit.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { STComponent, STColumn } from '../../../../../../node_modules/@delon/abc';
import { SFSchema } from '../../../../../../node_modules/@delon/form';
import { style } from '../../../../../../node_modules/@angular/animations';
import { CustomTreeViewComponent } from '../../../../modules/base_module/components/custom-tree-view.component';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'search-request',
  templateUrl: './search-request.component.html',
  styleUrls: ['./search-request.component.css'],
  providers: [MixedResourceIssuedResourceIssuedEditService],
})
export class MixedResourceIssuedSearchRequestComponent implements OnInit {
  i: any;
  params: any = {};

  listOfStatus: any = [];

  urlGroup: any = [];
  urLine: any = [];

  size = 'small';

  radStyle = {
    display: 'block',
    height: '25px',
    lineHeight: '25px'
  };
  selStyle = {
    border: '1px solid #00000',
    display: 'block',
    lineHeight: '10px',
    width: '250px',
    margin: '0',
    padding: '0'
  };

  styleColor = { 'background-color': 'rgb(245, 245, 245)' };


  // 日期范围
  dateRange1 = [this.commonQueryService.addDays(new Date(), -7), this.commonQueryService.addDays(new Date(), 21)];

  onDateRangeChange1(event: any) {
    // console.log(event);
  }

  // 日期范围
  dateRange2 = [];
  onDateRangeChange2(event: any) {
    // console.log(event);
  }

  constructor(private msgSrv: NzMessageService,
    private modal: NzModalRef,
    private openDiag: ModalHelper,
    public editService: MixedResourceIssuedResourceIssuedEditService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) { }

  /*  -------------------------产线树形选择--------------------------------- */
  public treeDataTable: any[] = []; // 产线树形多选结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'code', title: '名称', width: '50%' },
    { field: 'descriptions', title: '描述', width: '50%' }
  ]; // 产线树形显示列
  public selection: any[] = []; // 勾选项
  public keyField = 'id'; // 树节点key
  public valueField = 'code'; // 返回值来源的字段
  public valueLevel = 1; // 返回值来源的层级
  /*    ---------------------------------------------------------- */
  isLoading = false;

  // 绑定页面的下拉框Plant
  optionListPlant = [];


  ngOnInit() {
    this.commonQueryService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.listOfStatus.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    // 绑定登录人所属工厂， 同时绑定物料， 绑定计划组数据列表
    this.loadplant();
  }

  /*    ---------------------------------------------------------- */

  loadplant(): void {
     /** 初始化  工厂*/
     this.isLoading = true;
     this.commonQueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      this.optionListPlant = result.Extra;
      this.i.Params.plantCode = this.appConfigService.getPlantCode();
      // console.log(this.appConfigService.getPlantCode());

      // 绑定物料
      this.loadItem();

      // 绑定计划组
      // this.onChangePlant(this.i.Params.PLANT_CODE);

      // 计划组
      if (this.i.Params.treeDataTable.length > 0) {
        this.treeDataTable = this.i.Params.treeDataTable;
      } else {
        // 加载计划组和 资源
        this.loadLine();
      }
    });

  }
  // 绑定物料
  optionListItem1 = [];
  public loadItem(): void {
    this.commonQueryService.GetUserPlantItem(this.i.Params.plantCode).subscribe(resultMes => {
      this.optionListItem1 = resultMes.data;
    });
  }

  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    /** 重新绑定  组*/
    this.loadItem();

    // 绑定组
    // this.commonQueryService.GetUserPlantGroup(this.i.Params.PLANT_CODE).subscribe(result1 => {
    //  this.urlGroup = result1.Extra;
    // });

   // 加载计划组和 资源
   this.loadLine();

  }

  // 加载计划组
  private loadGroup() {

    // 绑定产线组
    this.commonQueryService.GetUserPlantGroup(this.i.Params.plantCode).subscribe(result1 => {

      this.urlGroup.length = 0;
      result1.Extra.forEach(d => {
        this.urlGroup.push({ value: d.scheduleGroupCode, label: d.scheduleGroupCode, id: d.id, descriptions: d.descriptions });
      });
    });

  }
  // 加载资源(资源)
  private loadLine() {

    // 获取计划组（产线树形结构数据）
    this.commonQueryService.GetUserPlantGroup(this.i.Params.plantCode)
      .subscribe(result => {
        if (result.Extra !== undefined && result.Extra !== null) {
          const data = [];
          result.Extra.forEach(x => {
            data.push({ id: x.id, code: x.scheduleGroupCode, descriptions: x.descriptions });
          });
          this.setLineData(data);
        }
      });

  }
  // 产线树形结构加载产线数据
  private setLineData(groupData: any[]) {
    const data = groupData;
    // 获取产线
    this.commonQueryService.GetUserPlantGroupLine(this.i.Params.plantCode, '')
      .subscribe(result => {
        if (result.Extra !== undefined && result.Extra !== null) {
          // 根据计划组编码匹配产线子节点数据
          data.forEach(x => {
            const items = result.Extra.filter(d => d.scheduleGroupCode === x.code);
            if (items !== undefined && items !== null)
              x.children = [];
            items.forEach(i => { x.children.push({ id: i.id, code: i.resourceCode, descriptions: i.descriptions }); });
          });
          this.treeDataTable = data; // 注意：数据加载完再赋值

        }
      });
  }

  @ViewChild('treeView', {static: true}) treeView: CustomTreeViewComponent;
  // 确认
  Confrim() {
    this.treeView.select();
    // 给物料查询条件赋值
    if (this.selMater1 !== undefined) {
      this.i.Params.itemCode = this.selMater1.Text;
    } else {
      this.i.Params.itemId = '';
      this.i.Params.itemCode = '';
    }

    // 数据推送日期
    if (this.dateRange1.length > 0) {
      this.i.Params.startBegin = this.dateRange1[0];
      this.i.Params.startEnd = this.dateRange1[1];
    } else {
      this.i.Params.startBegin = '';
      this.i.Params.startEnd = '';
    }
    // 需求日期
    if (this.dateRange2.length > 0) {

      this.i.Params.endBegin = this.dateRange2[0];
      this.i.Params.endEnd = this.dateRange2[1];
    } else {
      this.i.Params.endBegin = '';
      this.i.Params.endEnd = '';
    }

    this.i.IsRefresh = true;
    this.modal.close(true);
  }

  SetNumSelectNumberDays(isChange: boolean) {
    if (this.i.Params.radioValue === 'T') {
      if ((this.i.Params.requestDate === '' || this.i.Params.requestDate === null) &&
        (this.i.Params.actualCompDate === '' || this.i.Params.actualCompDate === null)) {
        this.i.daysDisable = false;
        if (isChange) {
          this.i.Params.days = '7';
        }
      } else {
        this.i.daysDisable = true;
        this.i.Params.days = '0';
      }
    } else {
      this.i.daysDisable = false;
    }
  }

  close() {
    this.modal.destroy();
  }

  // 物料的选择框

  gridView1: GridDataResult;

  Columns: any[] = [
    {
      field: 'itemCode',
      title: '物料',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];
  @ViewChild('selMater1', {static: true}) selMater1: PopupSelectComponent;

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

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.i.Params.itemId = e.Value;
    this.i.Params.itemCode = e.Text;
    const option = this.optionListItem1.find(s => s.itemId === e.Value);
    this.i.Params.descriptions = option.descriptionsCn;
  }

  onTextChanged(e: any) {

    this.i.Params.descriptions = '';
    const option = this.optionListItem1.find(s => s.itemId === e.Value);
    this.i.Params.descriptions = option.descriptionsCn;
    // 给物料描述赋值
    this.editService.SearchItemInfoByCode(e.Text).subscribe(resultMes => {
      this.i.Params.descriptions = resultMes.Extra[0].descriptions;
    });
  }

  // 定义查询条件的时间
  startBegin: Date = null;
  startEnd: Date = null;
  endBegin: Date = null;
  endEnd: Date = null;
  // tslint:disable-next-line:no-inferrable-types
  endOpen1: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  endOpen2: boolean = false;

  // 根据开始时间，定义不可选择的时间
  disabledStartDate1 = (startBegin: Date): boolean => {
    if (!startBegin || !this.startEnd) {
      return false;
    }
    return startBegin.getTime() > this.startEnd.getTime();
  }

  disabledEndDate1 = (startEnd: Date): boolean => {
    if (!startEnd || !this.startBegin) {
      return false;
    }
    return startEnd.getTime() <= this.startBegin.getTime();
  }

  disabledStartDate2 = (endBegin: Date): boolean => {
    if (!endBegin || !this.endEnd) {
      return false;
    }
    return endBegin.getTime() > this.endEnd.getTime();
  }

  disabledEndDate2 = (endEnd: Date): boolean => {
    if (!endEnd || !this.endBegin) {
      return false;
    }
    return endEnd.getTime() <= this.endBegin.getTime();
  }

  // 选择时间后，返回选择时间的回调
  onStartChange1(date: Date): void {
    this.startBegin = date;
  }

  onEndChange1(date: Date): void {
    this.startEnd = date;
  }
  onStartChange2(date: Date): void {
    this.endBegin = date;
  }

  onEndChange2(date: Date): void {
    this.endEnd = date;
  }

  //  绑定计划组

  selectItemsGroup: any[] = [];


  @ViewChild('st1', {static: true}) st1: STComponent;
  columns1: STColumn[] = [
    {
      title: '', index: 'scheduleGroupCode', type: 'checkbox',
      style: 'styleColor'
    },
    {
      title: '计划组',
      i18n: '计划组',
      index: 'scheduleGroupCode',
      width: '150px'


    },
    {
      title: '描述',
      render: 'custom1',
      width: '200px',

    }
  ];


  /** 选择事件   组*/
  checkboxChangeGroup(list: any[]) {
    this.selectItemsGroup = list;
    // consoleconsole.log('checkboxChange', list);

    // 绑定产线

    if (this.selectItemsGroup.length > 0) {
      this.selectItemsGroup.forEach(element => {
        this.i.Params.scheduleGroupCode += element.scheduleGroupCode + ',';
      });

      // 查询产线
      this.commonQueryService.GetUserPlantGroupLineAll(this.i.Params.plantCode, this.i.Params.scheduleGroupCode).subscribe(result1 => {
        this.urLine = result1.Extra;
        if (this.urLine.length > 0) {
          this.urLine.forEach(element => {
            this.i.Params.resourceCode += element.resourceCode + ',';
          });
        } else {

          this.urLine = [];
          this.i.Params.resourceCode = '';
        }
      });
    } else {
      this.selectItemsGroup = [];
      this.urLine = [];
      this.i.Params.resourceCode = '';
      this.i.Params.scheduleGroupCode = '';
    }


  }

  // this.params = { function: '', fastKey: '', userid: '' };




  //  绑定生产先

  selectItemsLine: any[] = [];

  @ViewChild('st', {static: true}) st: STComponent;
  columns2: STColumn[] = [
    { title: '', index: 'resourceCode', type: 'checkbox' },
    {
      title: '资源',
      i18n: '资源',
      index: 'resourceCode',
      width: '150px'
    },
    {
      title: '描述',
      render: 'custom',

      width: '200px',
      color: 'rgb(245, 245, 245)',
      style: this.styleColor
    }
  ];

  /** 选择事件   组*/
  checkboxChangeLine(list: any[]) {
    this.selectItemsLine = list;
    // console.log('checkboxChange', list);
  }

  public clear() {

    this.params = {
      projectNumber: '',
      makeOrderNum: '',
      descriptions: '',
      startBegin: '',
      startEnd: '',
      endBegin: '',
      endEnd: '',
      itemCode: '',
      makeOrderStatus: '',
      makeOrderStatusA: false,
      redundantJobFlag: false,
      makeOrderStatusG: false,

      selection: [],
      expand: [],
      treeDataTable: []
    };

    this.selectItemsGroup = [];
    this.urLine = [];

    this.dateRange1 = [];
    this.dateRange2 = [];

    this.i.Params = this.params;

    // 清空物料选项
    this.selMater1.Value = '';
    this.selMater1.Text = '';
    this.optionListItem1 = [];

    // 初始化工厂
    this.loadplant();

  }


}
