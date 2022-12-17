import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { MixedResourceIssuedResourceIssuedEditService } from './edit.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { MixedResourceIssuedResourceIssuedPlatformEditComponent } from './edit/edit.component';
import { MixedResourceIssuedSearchRequestComponent } from './search-request/search-request.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { MixedResourceIssuedResourceIssuedPlatformEditColorComponent } from './edit-color/edit-color.component';
import { MixedResourceIssuedColorManageComponent } from '../color-manage/color-manage.component';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';


export interface TreeNodeInterface {
  Id: string;
  PLANT_CODE: string;
  ITEM_ID: string;
  ITEM_CODE: string;
  DESCRIPTIONS: string;
  ITEM_STATUS_CODE: string; // 物料状态
  PROJECT_NUMBER: string;  // 项目号
  MAKE_ORDER_NUM: string;  // 工单编号
  MAKE_ORDER_STATUS: string;  // 工单状态
  MO_QTY: string; // 数量
  UNIT_OF_MEASURE: string; // 单位
  FPC_TIME: string;  // 建议开工时间
  LPC_TIME: string;  // 建议结束时间

  CREATION_DATE: string;  // 创建日期
  ISSUED_DATE: string;  // 下达日期
  COMMENTS: string;  // 备注
  REQ_COMMENTS: string;  // 需求备注
  LEVEL_NUM: string;
  REDUNDANT_JOB_FLAG: string; // 是否冗余工单
  UNCOMPLETED_BOM: string;  // 是否残缺BOM
  RESOURCE_EXC_FLAG: string; // 未正确获得资源
  ALTERNATE_BOM_DESIGNATOR: string; // 替代BOM

  SCHEDULE_GROUP_CODE: string; // 组
  RESOURCE_CODE: string;
  INV_CATEGORY_CODE: string;  // 库存分类
  PLAN_CATEGORY_CODE: string;   // 计划分类
  ERROR_MESSAGE: string;   // 出错信息

  level: number;
  expand: boolean;  // 控制是否有展开收缩
  checked: false;
  disabled: boolean;
  edit: boolean;  //  控制编辑备注的样式
  children?: TreeNodeInterface[];
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mixed-resource-issued-resource-issued-platform',
  templateUrl: './resource-issued-platform.component.html',
  styleUrls: ['./resource-issued-platform.component.css'],
  providers: [MixedResourceIssuedResourceIssuedEditService],
})
export class MixedResourceIssuedResourceIssuedPlatformComponent extends CustomBaseContext implements OnInit {

  public kendoHeight = document.body.clientHeight - 290;

  params: any = {};
  i: any = {};

  p: any = {};
 // PageSizeOptions = [10, 20, 30, 40, 50];

  isExpand = false;  // 是否展开
  ImgSrc = '全部展开@1x';  // 全部展开样式

  data: any[] = [];  // 列表数据

  pageIndex = 1;
  pageSize = 20;
  nzTotal = 0;

  loading = false;
  allChecked = false;
  displayData = [];
  displayDataAll = [];
  indeterminate = false;
  nzFrontPagination = false;
  nzShowPagination = true;


  markOrderList = '';
  assMarkOrderList = '';


  small = 'small';

  applicationRateType: any[] = [];
  applicationItemType: any[] = [];


  public xySize = {
    'x': '3640px',
    'y': this.kendoHeight + 'px'
  };

  styleColor = { 'background-color': 'rgb(245, 245, 245)' };

  // 定义多选框是否能够选择， false 可选
  checkdisabled = false;
  // 循环获取多选框状态
  currentPageDataChange($event: Array<TreeNodeInterface>): void {
    this.displayData = $event;

    this.displayDataAll = Array<TreeNodeInterface>();


    // 重新组装 displayDataAll 用来进行全选等操作
    if (this.displayData.length > 0) {
      this.checkdisabled = false;
      // 判断下层订单是否有资源残缺的订单， 有的话整个总装件订单跟单件订单不能选择
      this.displayData.forEach(d => {
        this.checkdisabled = false;

        if (d.RESOURCE_EXC_FLAG === 'Y') {
          this.checkdisabled = true;
        }
        // 订单为残缺BOM，不能选择
        if (d.UNCOMPLETED_BOM === 'Y') {
          this.checkdisabled = true;
        }
        // 循环判断下层中是否有异常，有的话整个总装件订单跟单件订单不能选择
        this.setCheckDisplayDate(d);


        // 订单为异常时，不能选择
        if (this.checkdisabled === true) {
          d.disabled = true;
        }

        // 订单不为待下发，不能选择
        if (d.MAKE_ORDER_STATUS !== 'A' &&  d.MAKE_ORDER_STATUS !== 'G') {
          d.disabled = true;
        }

        d.expand = false;
        this.displayDataAll.push(d);
        this.setDisplayDate(d);

      });

    }

    this.refreshStatus();


  }
  // 递归获取子订单，循环判断下层中是否有异常，有的话整个总装件订单跟单件订单不能选择
  setCheckDisplayDate(data: TreeNodeInterface): void {
    if (data.children) {
      data.children.forEach(d => {

        if (d.RESOURCE_EXC_FLAG === 'Y') {
          this.checkdisabled = true;
        }
        // 订单为残缺BOM，不能选择
        if (d.UNCOMPLETED_BOM === 'Y') {
          this.checkdisabled = true;
        }
        this.setCheckDisplayDate(d);
      });
    }
  }

  // 递归获取子订单，放到displayDataAll 中
  setDisplayDate(data: TreeNodeInterface): void {
    if (data.children) {
      data.children.forEach(d => {

        // 订单为异常时，不能选择
        if (this.checkdisabled === true) {
          d.disabled = true;
        }

        if (d.MAKE_ORDER_STATUS !== 'A' &&  d.MAKE_ORDER_STATUS !== 'G') {
          d.disabled = true;
        }
        d.expand = false;
        this.displayDataAll.push(d);
        this.setDisplayDate(d);
      });
    }
  }

  // 选择框事件
  nzCheckedChange(item: TreeNodeInterface, value: boolean): void {

    // 更改 displayDataAll 中的对象的值
    this.displayDataAll.filter(b => b.Id === item.Id).forEach(a => {

        a.checked = value;

      // 递归设置 判断如果选择的是父订单，设定子订单也选中
      this.setchecked(a, value);
    });

    this.refreshStatus();

  }


  // 递归设定子订单，设置checked
  setchecked(data: TreeNodeInterface, value: boolean): void {

    // 判断如果选择的是父订单，设定子订单也选中
    this.displayDataAll.filter(b => b.PARENT_MO_NUM === data.MAKE_ORDER_NUM).forEach(a => {

      a.checked = value;

      this.setchecked(a, value);
    });
  }

  // 判断全选框的状态
  refreshStatus(): void {

    let allChecked = false;
    let intCheck = 0;
    if (this.displayDataAll.length > 0) {

      // 全选， filter过滤数据， erery 全部满足条件返回true
      intCheck = this.displayDataAll.filter(value => !value.disabled).length;
      if (intCheck > 0) {
        allChecked = this.displayDataAll.filter(value => !value.disabled).every(value => value.checked === true);
      }
    } // 全不选
    const allUnChecked = this.displayDataAll.filter(value => !value.disabled).every(value => !value.checked);

    this.allChecked = allChecked;

    this.indeterminate = (!allChecked) && (!allUnChecked);


    // 加载数据
    this.data.forEach(item => {
      this.expandDataCache[item.MAKE_ORDER_NUM] = this.convertTreeToList(item, this.isExpand);
    });

  }

  // 全选样式
  checkAll(value: boolean): void {
    this.displayDataAll.forEach(item => {

      if (item.disabled !== true) {
        item.checked = value;
      }
    });

    this.refreshStatus();

  }


  constructor(
    public pro: BrandService,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: MixedResourceIssuedResourceIssuedEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    // columns headerName翻译
    this.headerNameTranslate(this.columns);
  }


  // 过滤替换 列表中快码的值
  public optionsFind(value: string): any {
    return this.applicationRateType.find(x => x.value === value) || { label: value };
  }

  // 过滤替换 列表中快码的值
  public optionsItemFind(value: string): any {
    return this.applicationItemType.find(x => x.value === value) || { label: value };
  }

  // 订单状态
  public loadRateType(): void {
    this.commonQueryService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationRateType.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });
  }

  // 物料状态
  public loadItemType(): void {
    this.commonQueryService.GetLookupByType('PP_MTL_ITEM_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationItemType.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
      });
    });
  }


  // 查找请求
  FindRequest() {
    this.i.IsRefresh = false;

    // this.Query();5
    this.modal
      .static(MixedResourceIssuedSearchRequestComponent, { i: this.i }, 1000, 850)
      .subscribe((value) => { if (this.i.IsRefresh) { this.OnQuery(); } });
  }

  // 查询菜单数据
  OnQuery() {
    this.i.Params.pageIndex = this.pageIndex = 1;

    const lineCodes = [];
    // 获取选中资源编码
    this.i.Params.selection.forEach(x => { if (x.level === 1) { lineCodes.push(x.CODE); } });

    // 转换选中的编码
    this.i.Params.selection = lineCodes;


    this.Query();
  }
  // 查询菜单数据
  Query() {
    this.i.Params.pageSize = this.pageSize;
    this.loading = true;



    this.editService.SearchGetMenuInfo(this.i.Params).subscribe(resultMes => {

      this.nzTotal = resultMes.TotalCount;
      this.loading = false;
      this.data = resultMes.Result;


      // 选择框使用方法
      this.currentPageDataChange(this.data);
    });

    this.isExpand = false;

  }

  // 选择页码事件
  public onStateChange(reset: boolean = false) {
    if (reset) {
      this.i.Params.pageIndex = 1;
    } else {
      this.i.Params.pageIndex = this.pageIndex;
    }
    this.Query();
  }



  // 全部展开
  showMinus() {

    if (!this.isExpand) {
      this.isExpand = true;

      // 更改 displayDataAll 中的对象的值
      this.displayDataAll.forEach(a => {

        a.expand = true;
      });


      this.ImgSrc = '全部收缩'; // 全部展开样式

      this.data.forEach(item => {
        this.expandDataCache[item.MAKE_ORDER_NUM] = this.convertTreeToList(item, this.isExpand);
      });
    } else {
      this.isExpand = false;

      this.ImgSrc = '全部展开@1x';  // 全部收缩

      // 更改 displayDataAll 中的对象的值
      this.displayDataAll.forEach(a => {

        a.expand = false;
      });

      this.data.forEach(item => {
        this.expandDataCache[item.MAKE_ORDER_NUM] = this.convertTreeToList(item, this.isExpand);
      });
    }
  }


  ngOnInit() {
    this.params.PLANT_CODE = '';
    this.params.startBegin = '';
    this.params.startEnd = '';
    this.params.endBegin = '';
    this.params.endEnd = '';
    this.params.MAKE_ORDER_STATUS = '';
    this.params.PROJECT_NUMBER = '';
    this.params.MAKE_ORDER_NUM = '';
    this.params.ITEM_ID = '';
    this.params.MAKE_ORDER_STATUS_A = false;
    this.params.REDUNDANT_JOB_FLAG = false;
    this.params.MAKE_ORDER_STATUS_G = false;
    this.params.RESOURCE_CODE = '';
    this.params.SCHEDULE_GROUP_CODE = '';

    this.params.selection = [];
    this.params.expand = [];
    this.params.treeDataTable = [];

    this.params.pageIndex = 1;
    this.params.pageSize = 10;

    this.i.Params = this.params;
    this.i.daysDisable = false;
    this.i.othersDisable = true;
    this.ImgSrc = '全部展开@1x';

    //  this.Query();
    this.loadRateType();
    this.loadItemType();

    this.FindRequest();
  }

  // 下发
  send() {

    if (this.i.Params.PLANT_CODE === 'underfind' || this.i.Params.PLANT_CODE === '') {
      this.msgSrv.error('请先查询工单');
      return;
    }

    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('是否确认下达工单?'),
      nzOnOk: () => {

        this.markOrderList = '';
        this.assMarkOrderList = '';

        this.displayDataAll.forEach(item => {

          if (item.checked === true) {

            if (item.LEVEL_NUM === '0') {

              this.markOrderList += item.MAKE_ORDER_NUM + ',';
            } else {
              this.assMarkOrderList += item.MAKE_ORDER_NUM + ',';
            }
          }

        });

        if (this.markOrderList.length === 0 && this.assMarkOrderList.length === 0) {

          this.msgSrv.error('请选择要下发的工单');
        } else {

          this.editService.SendMarkOrder(this.i.Params.PLANT_CODE, this.markOrderList, this.assMarkOrderList, []).subscribe(res => {
            if (res.code === 200) {
              this.OnQuery();
              this.msgSrv.success('工单下达请求已提交，请等候处理');

            } else {
              this.msgSrv.error(res.msg);
            }
          });
        }

      },
    });
  }

  // 单个刷新
  public loadMark(item: any) {
    this.editService.loadMark(item).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('刷新工单号为 ' + item.MAKE_ORDER_NUM + ' 的请求已提交，请等候处理');
        this.OnQuery();
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  // 全部刷新
  public reload() {

    if (this.i.Params.PLANT_CODE === 'underfind' || this.i.Params.PLANT_CODE === '') {
      this.msgSrv.error('请先查询工单');
      return;
    }

    this.markOrderList = '';
    this.displayDataAll.forEach(item => {

      if (item.checked === true) {
        if (item.LEVEL_NUM === '0') {
          this.markOrderList += item.MAKE_ORDER_NUM + ',';
        }
      }
    });

    if (this.markOrderList.length === 0) {

      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate('没有选择工单，继续提交将刷新需求日期为1个月内的工单，是否继续刷新?'),
        nzOnOk: () => {
          this.editService.reload(this.i.Params.PLANT_CODE).subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success('刷新请求已提交，请等候处理');
              this.OnQuery();
            } else {
              this.msgSrv.error(res.msg);
            }
          });
        },
      });
    } else {
      this.confirmationService.confirm({
        nzContent: this.appTranslationService.translate('系统将刷新已选择的工单，是否继续刷新?'),
        nzOnOk: () => {

          this.editService.reload(this.i.Params.PLANT_CODE, this.markOrderList).subscribe(res => {
            if (res.code === 200) {
              this.msgSrv.success('刷新请求已提交，请等候处理');
              this.OnQuery();
            } else {
              this.msgSrv.error(res.msg);
            }
          });
        },
      });

    }
  }


  // 重新画菜单
  expandDataCache = {};

  // 查找当前节点下的子菜单，组成子菜单  点击展开 收起
  collapse(
    array: TreeNodeInterface[],
    data: TreeNodeInterface,
    $event: boolean,
  ): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.MAKE_ORDER_NUM === d.MAKE_ORDER_NUM);

          // 判断
          this.displayDataAll.filter(b => b.MAKE_ORDER_NUM === d.MAKE_ORDER_NUM).forEach(g => {

            g.expand = false;

          });

          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
    if ($event === true) {


          // 判断
          this.displayDataAll.filter(b => b.MAKE_ORDER_NUM === data.MAKE_ORDER_NUM).forEach(g => {
            g.expand = true;
          });

      } else {
        return;
      }


  }

  // 把查询到的数据放到前台定义的对象中
  convertTreeToList(root: any, showType: boolean): TreeNodeInterface[] {
    const stack = [];
    const array = [];
    const hashMap = {};
    let expand = root.expand || false;
    let checked = root.checked || false;
    stack.push({ ...root, level: 0, expand: expand, checked: checked });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {

          expand = node.children[i].expand;
          checked = node.children[i].checked ;
          stack.push({
            ...node.children[i],
            level: node.level + 1,
            expand: expand,
            checked: checked,
            edit: false,
            disable: false,
            parent: node,

          });
        }
      }
    }

    return array;
  }

  visitNode(
    node: TreeNodeInterface,
    hashMap: object,
    array: TreeNodeInterface[],
  ): void {
    if (!hashMap[node.MAKE_ORDER_NUM]) {
      hashMap[node.MAKE_ORDER_NUM] = true;
      array.push(node);
    }
  }



  // 色标管理
  public setColor() {
    const mied = 'mied';
    this.modal
      .static(
        MixedResourceIssuedColorManageComponent,
        { i: { type: 'PP_EXCEPTION_COLOR_TYPE' } },
        800, 600)
      .subscribe(() => {

      });
  }

  //  编辑备注
  startEdit(item: TreeNodeInterface): void {
    item.edit = true;
  }

  finishEdit(item: TreeNodeInterface): void {
    item.edit = false;


    this.editService.updateMake(item).subscribe(resultMes => {

    });

  }

  // 到出

  expColumns = [

    { title: '工单号', field: 'MAKE_ORDER_NUM', width: '200px', locked: true },

    { title: '组织', field: 'PLANT_CODE', width: '200px', locked: false },
    { title: '项目号', field: 'PROJECT_NUMBER', width: '200px', locked: false },
    { title: '物料编码', field: 'ITEM_CODE', width: '200px', locked: false },
    { title: '物料描述', field: 'DESCRIPTIONS', width: '80px', locked: false },
    { title: '物料状态', field: 'ITEM_STATUS_CODE', width: '80px', locked: false },
    { title: '工单状态', field: 'MAKE_ORDER_STATUS', width: '200px', locked: false },
    { title: '层级', field: 'LEVEL_NUM', width: '200px', locked: false },


    { title: '数量', field: 'MO_QTY', width: '200px', locked: false },
    { title: '单位', field: 'UNIT_OF_MEASURE', width: '200px', locked: false },
    { title: '建议开工时间', field: 'FPC_TIME', width: '200px', locked: false },
    { title: '建议完工时间', field: 'LPC_TIME', width: '200px', locked: false },
    { title: '创建时间', field: 'CREATION_DATE', width: '200px', locked: false },
    { title: '下达时间', field: 'ISSUED_DATE', width: '200px', locked: false },
    { title: '备注', field: 'COMMENTS', width: '200px', locked: false },
    { title: '需求备注', field: 'REQ_COMMENTS', width: '200px', locked: false },


    { title: '是否冗余工单', field: 'REDUNDANT_JOB_FLAG', width: '200px', locked: false },
    { title: '是否残缺BOM', field: 'UNCOMPLETED_BOM', width: '200px', locked: false },
    { title: '未正确获得资源', field: 'RESOURCE_EXC_FLAG', width: '200px', locked: false },

    { title: '计划组', field: 'SCHEDULE_GROUP_CODE', width: '200px', locked: false },
    { title: '资源', field: 'RESOURCE_CODE', width: '200px', locked: false },
    { title: '库存分类', field: 'INV_CATEGORY_CODE', width: '200px', locked: false },
    { title: '计划分类', field: 'PLAN_CATEGORY_CODE', width: '200px', locked: false },
    { title: '出错信息', field: 'ERROR_MESSAGE', width: '200px', locked: false }
  ];


  expColumnsOptions: any[] = [
    { field: 'MAKE_ORDER_STATUS', options: this.applicationRateType },
    { field: 'ITEM_STATUS_CODE', options: this.applicationItemType }];
  @ViewChild('excelexport', {static: true}) excelexport: CustomExcelExportComponent;
  public export() {
    // this.gridData.length = 0;
    this.editService.export(
      this.i.Params,
      this.excelexport
    );
  }


}
