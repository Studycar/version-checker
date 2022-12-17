import { Component, OnInit, ViewChild } from "@angular/core";
import { QueryService } from "../../query.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalRef, NzModalService } from "ng-zorro-antd";
import { process } from '@progress/kendo-data-query';
import { CustomTreeViewComponent } from "app/modules/base_module/components/custom-tree-view.component";
import { NumberInputRendererComponent } from "./number-input-renderer.component";
import { zip } from "rxjs";
import { ResponseDto } from "app/modules/generated_module/dtos/response-dto";

interface Step {
  status: 'wait' | 'process' | 'finish' | 'error',
  title: string
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-model-calendar-resourcetime-new',
  templateUrl: './resource-time-new.component.html',
  providers: [QueryService],
  styleUrls: ['./resource-time-new.css'],
})
export class PlantModelCalendarResourceTimeNewComponent extends CustomBaseContext implements OnInit {
  steps: Step[] = [
    {
      status: 'process',
      title: '选择资源'
    },
    {
      status: 'wait',
      title: '选择有效期和班次'
    }
  ];
  treeLevel = 0;
  dtDateTypeSelectDefault: any[] = [
    { 'isWork': '一', 'IS_WORK_V': 'Monday', level: this.treeLevel },
    { 'isWork': '二', 'IS_WORK_V': 'Tuesday', level: this.treeLevel },
    { 'isWork': '三', 'IS_WORK_V': 'Wednesday', level: this.treeLevel },
    { 'isWork': '四', 'IS_WORK_V': 'Thursday', level: this.treeLevel },
    { 'isWork': '五', 'IS_WORK_V': 'Friday', level: this.treeLevel }
  ];
  dtDateTypeSelect = [...this.dtDateTypeSelectDefault];
  dataFieldDefault = 'Monday,Tuesday,Wednesday,Thursday,Friday';
  dataField = { 'isWork': this.dataFieldDefault };
  // 工作时间树形选择列
  columnDateType: any[] = [
    { field: 'IS_WORK_V', title: '英文', width: '200px' },
    { field: 'isWork', title: '中文', width: '200px' }
  ];

  dtDate: any[] = [
    { 'isWork': '一', 'IS_WORK_V': 'Monday' },
    { 'isWork': '二', 'IS_WORK_V': 'Tuesday' },
    { 'isWork': '三', 'IS_WORK_V': 'Wednesday' },
    { 'isWork': '四', 'IS_WORK_V': 'Thursday' },
    { 'isWork': '五', 'IS_WORK_V': 'Friday' },
    { 'isWork': '六', 'IS_WORK_V': 'Saturday' },
    { 'isWork': '日', 'IS_WORK_V': 'Sunday' }
  ];

  public selectBy = 'id';

  regionOptions: any[] = [];
  plantOptions: any[] = [];
  groupOptions: any[] = [];
  lineOptions: any[] = [];
  selectionLines: any[] = [];
  shiftOptions: any[] = [];
  enableOptions: any[] = [];
  shiftIntervalOptions: any[] = [];
  calendarOptions: any[] = [];
  public queryParams = {
    values: {
      scheduleRegionCode: null,
      plantCode: null,
      scheduleGroupCode: null,
      resourceCode: null,
      calendarCode: null,
      shiftCode: null,
      showStartTime: new Date(),
      showEndTime: '',
      IS_SATURDAY_WORK: false,
      IS_SUNDAY_WORK: false,
      isWork: '',
      pageIndex: 1,
      pageSize: this.gridState.take,
      expand: [],
    }
  };
  // 默认组织
  public userOrganization = {
    plantCode: ''
  };
  
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

  frameworkComponents = Object.assign(
    {},
    this.gridOptions.frameworkComponents,
    {
      numberInputRenderer: NumberInputRendererComponent,
  });
  public columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'calendarCode', headerName: '日历编码', menuTabs: ['filterMenuTab'] },
    { field: 'shiftCode', headerName: '车间班次编码', tooltipField: 'PARAMETER_NAME', menuTabs: ['filterMenuTab'] },
    { field: 'shiftIntervalCode', headerName: '班次', valueFormatter: 'ctx.optionsFind(value,1).label', menuTabs: ['filterMenuTab'] },
    { field: 'showStartTime', headerName: '开始时间', menuTabs: ['filterMenuTab'] },
    { field: 'showEndTime', headerName: '结束时间', menuTabs: ['filterMenuTab'] },
    { field: 'restTime', headerName: '休息时间(小时)', menuTabs: ['filterMenuTab'] },
    { field: 'efficency', headerName: '开动率(%)', menuTabs: ['filterMenuTab'], 
      editable: true, cellEditor: 'numberInputRenderer'},
    // { field: 'lendCapacity', headerName: '借用能力(小时)', menuTabs: ['filterMenuTab'] },
    { field: 'enableFlag', headerName: '是否有效', valueFormatter: 'ctx.optionsFind(value,2).label', menuTabs: ['filterMenuTab'] }
  ];

  // grid列选项查找
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.shiftIntervalOptions;
        break;
      case 2:
        options = this.enableOptions;
        break;
    }
    return options.find(x => x.value === value) || { label: value };
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadRegions();
    this.queryParams.values.plantCode = this.userOrganization.plantCode;
    

    this.loadOptions();
    
    // 工厂
    this.loadUserPlant('');
    this.loadGroup();
    // this.loadCalendarCode();
  }

  async loadOptions() {
    this.commonQueryService.GetLookupByTypeRefZip({
      'FND_YES_NO': this.enableOptions,// 是否有效SYS_ENABLE_FLAG
      'PS_SHIFT_CODE': this.shiftIntervalOptions,// 时段模板SHIFT_CODE
    });
  }

  loadRegions() {
    // 事业部
    this.regionOptions.length = 0;
    this.commonQueryService.GetScheduleRegions().subscribe(result => {
      result.data.forEach(d => {
        this.regionOptions.push({ value: d.scheduleRegionCode, label: d.scheduleRegionCode });
      });
    });
  }

  // 加载工厂
  private loadUserPlant(scheduleRegionCode: string) {
    this.plantOptions.length = 0;
    this.commonQueryService.GetUserPlant(scheduleRegionCode).subscribe(result => {
      result.Extra.forEach(d => {
        this.plantOptions.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode,
          id: d.id,
          code: d.plantCode,
          descriptions: d.descriptions
        });
        if(d.plantCode == this.queryParams.values.plantCode) {
          this.queryParams.values.scheduleRegionCode = d.scheduleRegionCode
          this.loadCalendarCode();
        }
      });
      this.loadLine()
    });
  }

  // 加载计划组
  private loadGroup() {
    this.groupOptions.length = 0;
    if ((this.queryParams.values.plantCode || '') === '') return;
    this.commonQueryService.GetUserPlantGroup(this.queryParams.values.plantCode || '', this.queryParams.values.scheduleRegionCode || '')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.groupOptions.push({
            value: d.scheduleGroupCode,
            label: d.scheduleGroupCode,
            plantCode: d.plantCode,
            id: d.id,
            code: d.scheduleGroupCode,
            descriptions: d.descriptions
          });
        });
        this.setLineData(this.groupOptions, this.queryParams.values.plantCode);
      });
  }

  // 加载资源产线
  private loadLine() {
    this.lineOptions.length = 0;
    if ((this.queryParams.values.plantCode || '') === '') return;
    this.commonQueryService.GetUserPlantGroupLine(this.queryParams.values.plantCode || '', this.queryParams.values.scheduleGroupCode || '')
      .subscribe(result => {
        this.lineOptions = result.Extra;
        const data = [];
        result.Extra.forEach(d => {
          const item = {
            id: d.id,
            code: d.resourceCode,
            descriptions: d.descriptions,
          };
          data.push(item);
        })
        this.treeDataTable = data;
      });
  }

  // 切换计划组
  public groupChange(value: string) {
    this.queryParams.values.resourceCode = null;
    if ((value || '') !== '') {
      const groupInfo = this.groupOptions.find(x => x.value === value);
      this.queryParams.values.plantCode = groupInfo.plantCode || '';
    }
    this.loadLine();
  }

  // 切换资源
  public lineChange(value: string) {
    this.queryParams.values.resourceCode = null;
    if ((value || '') !== '') {
      const lineInfo = this.lineOptions.find(x => x.resourceCode === value);
      this.queryParams.values.resourceCode = lineInfo.resourceCode || '';
      if (lineInfo) {
        this.treeDataTable = [{
          id: lineInfo.id,
          code: lineInfo.resourceCode,
          descriptions: lineInfo.descriptions,
        }]
      }
    }

  }

  // 切换区域
  public regionChange(value: string) {
    this.queryParams.values.plantCode = null;
    
  }

  // 切换工厂
  public plantChange(value: string) {
    this.queryParams.values.scheduleGroupCode = null;
    this.queryParams.values.resourceCode = null;
    if ((value || '') !== '') {
      const plantInfo = this.plantOptions.find(x => x.value === value);
      // const plantInfo = this.plantOptions.filter(x => x.value == value);
      // console.log()
      this.queryParams.values.plantCode = plantInfo.value || '';
    }
    // 计划组
    this.loadGroup();
  }

  // 产线树形结构加载产线数据
  private setLineData(groupData: any[], plantCode, scheduleGroupCode = '') {
    const data = groupData;
    // 获取产线
    this.commonQueryService.GetUserPlantGroupLine(plantCode, scheduleGroupCode).subscribe(result => {
      console.log(result)
      if (result.Extra !== undefined && result.Extra !== null) {
        // 根据计划组编码匹配产线子节点数据
        data.forEach(x => {
          const items = result.Extra.filter(d => d.scheduleGroupCode === x.code);
          if (items.length) {
            x.children = [];
            items.forEach(i => { x.children.push({ id: i.id, code: i.resourceCode, descriptions: i.descriptions }); });
          }
        });
        if (data.length === 0) { this.treeDataTable = null; }
        else {
          this.treeDataTable = data;
        } // 注意：数据加载完再赋值
        console.log(this.treeDataTable);
      }
    });
  }

   // 切换工作日历编码
   public calendarChange(value: string) {
    this.queryParams.values.shiftCode = null;
    if ((value || '') !== '') {
      this.queryParams.values.calendarCode = value || '';
    }
    this.loadShift();
  }
  // 加载班次
  private loadShift() {
    this.shiftOptions.length = 0;
    if ((this.queryParams.values.calendarCode || '') === '') return;
    // 班次编码
    this.commonQueryService.GetShiftList({
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode || '',
      calendarCode: this.queryParams.values.calendarCode || ''
    }).subscribe(result => {
      if (result.data !== undefined && result.data.length > 0) {
        result.data.forEach(d => {
          if (d.enableFlag === 'Y') {
            this.shiftOptions.push({
              value: d.shiftCode,
              label: d.descriptions
            });
            // 班次只有一条数据默认选中
            if(result.data.length == 1) {
              this.queryParams.values.shiftCode = result.data[0].shiftCode
            }
          }
        });
      }
    });
  }
  // 切换班次
  public shiftChange(value: string) {
    // this.query();
  }

  // 加载工作日历编码
  private loadCalendarCode(isLoad: boolean = true) {
    this.calendarOptions.length = 0;
    this.commonQueryService
      .GetCalendarList({
        scheduleRegionCode:
          this.queryParams.values.scheduleRegionCode || '',
      })
      .subscribe(result => {
        result.data.forEach(d => {
          this.calendarOptions.push({
            label: d.calendarCode,
            value: d.calendarCode,
            scheduleRegionCode: d.scheduleRegionCode,
          });
        });
        // 日历编码只有条数据默认选中
        if(result.data.length == 1) {
          this.queryParams.values.calendarCode = result.data[0].calendarCode;
          this.loadShift()
        }
      });
  }

  selectKeys = 'id';

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    // this.gridApi.paginationGoToPage(pageNo - 1);
    // this.setLoading(false);
    this.queryCommon();
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public commonQueryService: QueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) {
    super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: null });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 140;
  }

  @ViewChild('treeView', { static: false }) treeView: CustomTreeViewComponent;
  // 查询
  public query() {
    super.query();
    this.queryCommon();
  }
  // 查询请求
  private queryCommon() {
    if (this.isInValid()) {
      return;
    }
    this.selectionKeys.length = 0;
    this.queryParams.values.pageIndex = this._pageNo;
    this.queryParams.values.pageSize = this._pageSize;
    const dto = {
      calendarCode: this.queryParams.values.calendarCode,
      shiftCode: this.queryParams.values.shiftCode,
      pageIndex: this.queryParams.values.pageIndex,
      pageSize: this.queryParams.values.pageSize
    };
    this.setLoading(true);
    this.commonQueryService.QueryTime(dto).subscribe(result => {
      if (result !== null && result.data !== null)
        this.view = {
          data: process(result.data.content, {
            sort: this.gridState.sort,
            skip: 0,
            take: this.gridState.take,
            filter: this.gridState.filter
          }).data,
          total: result.data.totalElements === undefined ? 0 : result.data.totalElements,
        };
      this.setLoading(false);
    });
  }
  // 验证是否有效
  private isInValid(): boolean {
    return this.isEmpty(this.queryParams.values.calendarCode, '日历编码')
      || this.isEmpty(this.queryParams.values.shiftCode, '车间班次编码');
      // || this.isEmpty(this.queryParams.values.showStartTime, '开始日期')
      // || this.isEmpty(this.queryParams.values.showEndTime, '结束日期');
  }
  // 为空判断
  private isEmpty(value: any, message: string): boolean {
    let result = false;
    if (value === undefined || value === null || value === '') {
      result = true;
      this.msgSrv.warning(this.appTranslationService.translate(message + '不能为空！'));
    }
    return result;
  }

  index = 0;

  onIndexChange(event: number): void {
    console.log(event)
    this.index = event;
  }

  pre() {
    this.steps[this.index].status = 'wait';
    this.index--;
    this.steps[this.index].status = 'process';
  }

  next() {
    this.setSelectionLines();
    if (this.selectionLines.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择资源'));
      return;
    }
    this.steps[this.index].status = 'finish';
    this.index++;
    this.steps[this.index].status = 'process';
    setTimeout(() => {
      this.onVirtualColumnsChanged(null);
    }, 500);
  }

  setSelectionLines() {
    this.treeView.select();
    console.log(this.selection);
    // 两级菜单：计划组-》资源
    if (
      this.queryParams.values.scheduleGroupCode === null || this.queryParams.values.scheduleGroupCode === undefined) {
      const map = new Map<string,any>();
      this.selection.forEach(s => {
        if(s.hasOwnProperty('parent')) {
          const group = s.parent;
          if(map.has(group.id)) {
            const item = map.get(group.id);
            item.children.push(s);
          }else {
            map.set(group.id, {
              id: group.id,
              code: group.code,
              descriptions: group.descriptions,
              children: [s]
            })
          }
        }
      })
      this.selectionLines = Array.from(map.values());
    } else {
      // 一级菜单：资源
      const group = this.groupOptions.find(g => g.code === this.queryParams.values.scheduleGroupCode);
      if(group) {
        this.selectionLines = [{
          id: group.id,
          code: group.code,
          descriptions: group.descriptions,
          children: this.selection
        }]
      }
    }
    console.log(this.selectionLines);
  }

  // 获取班次参数（初始化/删除）
  private getParamValues(scheduleGroups) {
    this.dtDateTypeSelect.forEach(x => {
      this.queryParams.values.isWork = this.queryParams.values.isWork + x.IS_WORK_V + ',';
    });
    const calendarList = [];
    this.gridApi.forEachLeafNode(node => {
      if(this.selectionKeys.findIndex(d => d === node.data.id) !== -1) {
        calendarList.push(node.data);
      }
    });
    return {
      scheduleRegionCode: this.queryParams.values.scheduleRegionCode,
      plantCode: this.queryParams.values.plantCode,
      scheduleGroupCode: scheduleGroups.code,
      resourceCode: scheduleGroups.children[0].code,
      calendarCode: this.queryParams.values.calendarCode,
      shiftCode: this.queryParams.values.shiftCode,
      showStartTime: this.commonQueryService.formatDateTime(this.queryParams.values.showStartTime),
      showEndTime: this.commonQueryService.formatDateTime(this.queryParams.values.showEndTime),
      IS_SATURDAY_WORK: this.queryParams.values.IS_SATURDAY_WORK,
      IS_SUNDAY_WORK: this.queryParams.values.IS_SUNDAY_WORK,
      isWork: this.queryParams.values.isWork,
      timeIds: this.selectionKeys,
      resourceCodes: scheduleGroups.children.map(l => l.code),
      calendarList: calendarList,
    };
  }

  save() {
    if(this.isEmpty(this.queryParams.values.showStartTime, '开始日期')
    || this.isEmpty(this.queryParams.values.showEndTime, '结束日期')) {
      return;
    }
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择记录!'));
      return;
    }
    this.setLoading(true);
    let httpZip = [];
    this.selectionLines.forEach(group => {
      httpZip.push(this.commonQueryService
        .InitResTime(this.getParamValues(group)));
    });
    zip(...httpZip).subscribe((res: ResponseDto[]) => {
      let code = 200;
      let errMsg = '';
      res.forEach(r => {
        if(r.code !== 200) {
          code = r.code;
          errMsg += r.msg;
        }
      })
      if(code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true)
      }else {
        this.msgSrv.error(this.appTranslationService.translate(errMsg));
      }
      this.setLoading(false);
    })
  }

  formInvalid = []; // 表单无效，控制查询按钮是否可用
  getFormInvalid(): boolean {
    let invalid = false;
    this.formInvalid.forEach(x => {
      invalid = invalid || x;
    });
    return invalid;
  }

  clear() {
    this.queryParams.values.plantCode = null;
    this.queryParams.values.resourceCode = null;
    this.queryParams.values.scheduleRegionCode = null;
    this.queryParams.values.scheduleGroupCode = null;
    this.treeDataTable = null;
  }

  // 重置
  public clearTwo() {
    super.clear();
    this.queryParams.values.calendarCode = null;
    this.queryParams.values.shiftCode = null;
  }

  public clearThree() {
    super.clear();
    this.queryParams.values.showStartTime = new Date();
    this.queryParams.values.showEndTime = null;
    setTimeout(() => {
      this.dataField = { 'isWork': this.dataFieldDefault };
      this.dtDateTypeSelect = [...this.dtDateTypeSelectDefault];
    });
  }

  // // 可编辑单元格保存
  // onCellValueChanged(params) {
  //   if(this.isEmpty(this.queryParams.values.showStartTime, '开始日期')
  //   || this.isEmpty(this.queryParams.values.showEndTime, '结束日期')) {
  //     params.data.efficency = params.oldValue;
  //     params.node.setData(params.data);
  //     return;
  //   }
  //   if(params.oldValue.toString() !== params.newValue.toString()) {
  //     let msg = '保存成功';
  //     this.selectionLines.forEach(group => {
  //       const queryParams: any = this.getParamValues(group);
  //       queryParams.efficency = params.newValue;
  //       queryParams.timeIds = [params.data.id];
  //       this.commonQueryService
  //       .InitResTime(queryParams)
  //       .subscribe(res => {
  //         if (res.code !== 200) {
  //           msg = res.msg;
  //         } 
  //         this.setLoading(false);
  //       });
  //     });
  //     if(msg === '保存成功') {
  //       this.msgSrv.success(this.appTranslationService.translate(msg));
  //     }else {
  //       this.msgSrv.error(this.appTranslationService.translate(msg));
  //     }
      
  //   }
  // }

  // 可编辑列，作用于可编辑列样式和cell值变更
  editColumnHeaders = ['开动率(%)'];
  // 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#resourceTimeNew');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
        if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
          dom.setAttribute('style', 'color: #F6A52C');
        }
      });
    }
  }
}