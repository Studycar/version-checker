import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { EditService } from '../edit.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomTreeViewComponent } from '../../../../modules/base_module/components/custom-tree-view.component';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'processSchedule-opdigitalization-workbench-search',
  templateUrl: './search.component.html',
  providers: [EditService],
})
export class ProcessScheduleOpdigitalizationWorkbenchSearchComponent
  extends CustomBaseContext
  implements OnInit {
  public regionOptions: any[] = []; // 事业部数组
  public plantOptions: any[] = []; // 工厂数组
  public groupOptions: any[] = []; // 计划组数组

  /*  -------------------------产线树形选择--------------------------------- */
  public treeDataTable: any[] = []; // 产线树形多选结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'CODE', title: '名称', width: '50%' },
    { field: 'DESCRIPTION', title: '描述', width: '50%' },
  ]; // 产线树形显示列
  public selection: any[] = []; // 勾选项
  public keyField = 'ID'; // 树节点key
  public valueField = 'CODE'; // 返回值来源的字段
  public valueLevel = 1; // 返回值来源的层级
  public loading = false; // 是否正在加载数据
  /*    ---------------------------------------------------------- */
  // 查询参数
  public i: any = {
    regionCode: '',
    plantCode: '',
    groupCode: '',
    lineIdsStr: '',
    startTime: null /**jianl 注释：本来在外面可以把start和end这两个声明成一个数组的，这样会更方便，但是很难改了 */,
    endTime: null,
    selection: [],
    expand: [],
    treeDataTable: [],
    dateRange: [new Date(), this.editService.addDays(new Date(), 7)],
  };
  public iClone: any;
  // 切换事业部
  public regionChange(value: any) {
    this.i.plantCode = null;
    // 加载工厂
    this.loadPlant();
  }
  // 切换工厂
  public plantChange(value: any) {
    this.i.groupCode = null;
    // 加载计划组
    this.loadGroup();
    // 加载资源
    this.loadLine();
  }
  // 切换计划组
  public groupChange(value: any) {
    console.log('groupChange:');
    // 加载资源（资源）
    this.loadLine();
  }
  // 事业部
  private loadRegion() {
    this.editService.GetScheduleRegions().subscribe(result => {
      result.extra.forEach(d => {
        this.regionOptions.push({
          value: d.SCHEDULE_REGION_CODE,
          label: d.SCHEDULE_REGION_CODE,
        });
      });
    });
  }
  // 加载工厂
  private loadPlant(isLoad: boolean = false) {
    this.editService.GetUserPlant(this.i.regionCode || '').subscribe(result => {
      this.plantOptions.length = 0;
      const options = [];
      let flag = false;
      result.Extra.forEach(d => {
        options.push({
          value: d.PLANT_CODE,
          label: d.PLANT_CODE,
          SCHEDULE_REGION_CODE: d.SCHEDULE_REGION_CODE,
        });
        // 默认事业部赋值
        if (!this.i.regionCode && d.PLANT_CODE === this.i.plantCode) {
          this.i.regionCode = d.SCHEDULE_REGION_CODE;
          flag = true;
        }
      });
      // 按事业部过滤工厂下拉选项
      if (flag) {
        this.plantOptions = options.filter(
          x => x.SCHEDULE_REGION_CODE === this.i.regionCode,
        );
      } else {
        this.plantOptions = options;
      }
      // 页面加载，加载计划组和资源
      if (isLoad) {
        this.loadGroupLine();
        this.iClone = this.clone(this.i);
      }
    });
  }
  // 加载计划组
  private loadGroup() {
    this.editService
      .GetUserPlantGroupOrderByCode(
        this.i.plantCode || '',
        this.i.regionCode || '',
        true,
      )
      .subscribe(result => {
        this.groupOptions.length = 0;
        result.extra.forEach(d => {
          this.groupOptions.push({
            value: d.SCHEDULE_GROUP_CODE,
            label: d.SCHEDULE_GROUP_CODE,
            ID: d.ID,
            DESCRIPTIONS: d.DESCRIPTIONS,
          });
        });
      });
  }
  // 加载资源(资源)
  private loadLine() {
    // 未选择计划组
    if ((this.i.groupCode || '') === '') {
      // 获取计划组（产线树形结构数据）
      this.editService
        .GetUserPlantGroupOrderByCode(
          this.i.plantCode || '',
          this.i.regionCode || '',
          true,
        )
        .subscribe(result => {
          if (result.extra !== undefined && result.extra !== null) {
            const data = [];
            result.extra.forEach(x => {
              data.push({
                ID: x.ID,
                CODE: x.SCHEDULE_GROUP_CODE,
                DESCRIPTION: x.DESCRIPTIONS,
              });
            });
            this.setLineData(data);
          }
        });
    } else {
      // 先选择计划组
      const data = [];
      const group = this.groupOptions.find(x => x.value === this.i.groupCode);
      data.push({
        ID: group.ID,
        CODE: group.value,
        DESCRIPTION: group.DESCRIPTIONS,
      });
      this.setLineData(data);
    }
  }

  private loadGroupLine() {
    // 加载计划组
    this.loadGroup();
    if (this.i.treeDataTable.length > 0) {
      if ((this.i.groupCode || '') !== '') {
        const group = this.i.treeDataTable.find(
          x => x.CODE === this.i.groupCode,
        );
        this.treeDataTable = [group];
      } else {
        this.treeDataTable = this.i.treeDataTable;
      }
    } else {
      // 加载资源
      this.loadLine();
    }
  }
  // 产线树形结构加载产线数据
  private setLineData(groupData: any[]) {
    this.loading = true;
    const data = groupData;
    // 获取产线
    this.editService
      .GetUserPlantGroupLineOrderByCode(
        this.i.plantCode || '',
        this.i.groupCode || '',
        true,
      )
      .subscribe(result => {
        if (result.extra !== undefined && result.extra !== null) {
          // 根据计划组编码匹配产线子节点数据
          data.forEach(x => {
            const items = result.extra.filter(
              d => d.SCHEDULE_GROUP_CODE === x.CODE,
            );
            if (items !== undefined && items !== null) x.children = [];
            items.forEach(i => {
              x.children.push({
                ID: i.ID,
                CODE: i.RESOURCE_CODE,
                DESCRIPTION: i.DESCRIPTIONS,
              });
            });
          });
          console.log('this.treeDataTable');
          console.log(data);
          this.treeDataTable = data; // 注意：数据加载完再赋值
          // 全工厂的资源数据返回供刷新和其他功能使用
          if ((this.i.groupCode || '') === '') {
            this.i.treeDataTable = data;
          }
        }
        this.loading = false;
      });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: EditService,
  ) {
    super({
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: null,
    });
  }

  ngOnInit(): void {
    // 由于在弹出框外面传入的计划组是空串，空串无法清空下拉控件的值，导致重置按钮无效，外面传进来的又不敢改动，所以在这里做一个冗余代码去控制
    this.i.groupCode = this.i.groupCode || null;
    // 事业部
    this.loadRegion();
    // 工厂
    this.loadPlant(true);
    // 初始化日期范围
    if (this.i.startTime && this.i.endTime) {
      // this.dateRange = [this.i.startTime, this.i.endTime];
      this.i.dateRange = [this.i.startTime, this.i.endTime];
    } else {
      // 初始化
      this.i.dateRange = [new Date(), this.editService.addDays(new Date(), 7)];
    }
  }

  public query() {}

  public clear() {
    this.i = this.clone(this.iClone);
    // 事业部
    this.loadRegion();
    // 工厂
    this.loadPlant(true);
  }

  close() {
    this.modal.destroy();
  }

  // 日期范围
  // dateRange = [new Date(), this.editService.addDays(new Date(), 7)];
  onDateRangeChange(event: any) {
    // console.log(event);
  }
  @ViewChild('treeView', { static: true }) treeView: CustomTreeViewComponent;
  confirm() {
    this.stopwatch.start();
    this.treeView.select();
    if (this.i.selection.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择资源!'));
    } else {
      if (this.i.dateRange.length === 0) {
        this.msgSrv.warning(
          this.appTranslationService.translate('请选择日期范围!'),
        );
      } else {
        this.i.startTime = this.i.dateRange[0];
        this.i.endTime = this.i.dateRange[1];
        this.modal.close(true);
      }
    }
  }
}
