import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { QueryService } from '../query.service';
import { PopupSelectComponent } from '../../../../modules/base_module/components/popup-select.component';
import { GridDataResult, RowArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-mo-loss-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]

})
export class MaterialmanagementMoLossEditComponent implements OnInit {
  saveData: any = {};
  dataId = '';
  IsUpdate = false;

  listScheduleRegion: any[] = [];
  listPlant: any[] = [];
  listDataType = [{ label: '物料', value: '0' }, { label: '库存分类', value: '1' }];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private commonQueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) {

  }

  ngOnInit(): void {
    // 先加载编辑数据，再查询事业部工厂
    this.loadData();
    this.loadScheduleRegion();
    this.loadPlant();
  }

  loadScheduleRegion() {
    this.queryService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(item => {
        this.listScheduleRegion.push({
          label: item.DESCRIPTIONS,
          value: item.SCHEDULE_REGION_CODE
        });
      });
    });
  }

  loadPlant() {
    this.listPlant.length = 0;
    this.queryService.GetUserPlant(this.saveData.SCHEDULE_REGION_CODE).subscribe(res => {
      res.Extra.forEach(item => {
        this.listPlant.push({
          label: item.PLANT_CODE,
          value: item.PLANT_CODE,
          SCHEDULE_REGION_CODE: item.SCHEDULE_REGION_CODE,
        });
        this.loadDefaultPlantAndScheduleRegion();
      });
    });
  }

  loadDefaultPlantAndScheduleRegion() {
    if (!this.IsUpdate) {
      // 加载默认事业部和工厂
      this.saveData.PLANT_CODE = this.appConfigService.getPlantCode();
      const userConfig = this.listPlant.find(item => item.value === this.saveData.PLANT_CODE);
      this.saveData.SCHEDULE_REGION_CODE = userConfig ? userConfig.SCHEDULE_REGION_CODE : null;
      this.onPlantChange(this.saveData.PLANT_CODE);
    }
  }

  onScheduleRegionChange(value) {
    this.loadPlant();
  }

  onPlantChange(value) {
    // this.saveData.CATEGORY_VALUES = '';
    this.selMater1.Value = '';
    this.selMater1.Text = '';
    this.saveData.CATEGORY_VALUES = '';
  }

  loadData() {
    console.log(this.dataId);
    if (this.dataId !== undefined && this.dataId !== '') {
      this.IsUpdate = true;
      /** 初始化编辑数据 */
      this.queryService.QueryDataById(this.dataId).subscribe(resultMes => {
        if (resultMes.Extra !== undefined && resultMes.Extra.length > 0) {
          const d = resultMes.Extra[0];
          this.saveData = {
            Id: d.Id, // 执行ID,主键
            PLANT_CODE: d.PLANT_CODE, // 工厂编码
            SCHEDULE_REGION_CODE: d.SCHEDULE_REGION_CODE, // 事业部
            CATEGORY: d.CATEGORY, // 值类别：0-物料，1-库存分类
            CATEGORY_VALUES: d.CATEGORY_VALUES, // 类别值
            CONSTANT_LOSS: d.CONSTANT_LOSS, // 固定损耗
            VARIABLE_LOSS: d.VARIABLE_LOSS, // 变动损耗(%)
            ATTRIBUTE1: d.ATTRIBUTE1, //
            ATTRIBUTE2: d.ATTRIBUTE2, //
            ATTRIBUTE3: d.ATTRIBUTE3, //
            ATTRIBUTE4: d.ATTRIBUTE4, //
            ATTRIBUTE5: d.ATTRIBUTE5, //
            LAST_UPDATE_DATE: d.LAST_UPDATE_DATE, //
            LAST_UPDATED_BY: d.LAST_UPDATED_BY, //
            CREATION_DATE: d.CREATION_DATE, //
            CREATED_BY: d.CREATED_BY, //
          };

          this.onScheduleRegionChange(this.saveData.SCHEDULE_REGION_CODE);
          // this.onPlantChange(this.saveData.PLANT_CODE);
        } else {
          this.msgSrv.error('当前数据不存在，请重新选择');
          this.modal.close(false);
        }
      });
    } else {
      this.IsUpdate = false;
    }
  }

  save() {
    this.queryService.SaveMoLoss(this.saveData, this.IsUpdate).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  isLoading = false;
  @ViewChild('selMater1', { static: true }) selMater1: PopupSelectComponent;

  onCategoryChange(value) {
    this.selMater1.Value = '';
    this.selMater1.Text = '';
    this.saveData.CATEGORY_VALUES = '';
    this.gridViewItems.data = [];
    this.gridViewItems.total = 0;
  }

  // 绑定物料
  public gridViewItems: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsItems: any[] = [
    {
      field: 'CATEGORY_VALUES',
      title: '物料编码/类别编码',
      width: '100'
    },
    {
      field: 'CATEGORY_VALUES_DESC',
      title: '描述',
      width: '100'
    }
  ];

  public loadPopData(inputStr: string, PageIndex: number, PageSize: number) {
    this.QueryPopData(inputStr, '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.Result;
      this.gridViewItems.total = res.TotalCount;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    if (this.saveData.CATEGORY === undefined || this.saveData.CATEGORY === '') {
      this.msgSrv.info('请先选择值类别');
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadPopData(e.SearchValue, PageIndex, e.PageSize);
  }

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.saveData.CATEGORY_VALUES = e.Value;
  }

  onTextChanged(e: any) {
    if (this.saveData.CATEGORY === undefined || this.saveData.CATEGORY === '') {
      this.msgSrv.info('请先选择值类别');
      return;
    }
    this.saveData.CATEGORY_VALUES = '';
    // 给物料描述赋值
    this.QueryPopData('', e.Text, 1, 100).subscribe(res => {
      if (res.Result.length === 0) {
        this.msgSrv.error(e.Text + '不存在，请重新输入');
        this.selMater1.Value = '';
        this.selMater1.Text = '';
        this.saveData.CATEGORY_VALUES = '';
      } else {
        this.saveData.CATEGORY_VALUES = res.Result[0].CATEGORY_VALUES;
        e.Text = res.Result[0].CATEGORY_VALUES;
        e.Value = res.Result[0].CATEGORY_VALUES;
      }
    });
  }

  clear() {
    this.loadData();
  }

  QueryPopData(inputLikeStr: string, inputExactStr: string, pageIndex: number, pageSize: number): Observable<GridSearchResponseDto> {
    const queryParam = {
      PLANT_CODE: this.saveData.PLANT_CODE,
      INPUT_LIKE: inputLikeStr,
      INPUT_EXACT: inputExactStr,
      pageIndex: pageIndex,
      pageSize: pageSize
    };
    if (this.saveData.CATEGORY === '0') {
      // 查询物料
      return this.queryService.QueryItemData(queryParam);
    } else {
      // 查询库存分类
      return this.queryService.QueryCategory(queryParam);
    }
  }
}
