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
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'materialmanagement-mo-supply-relation-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService]

})
export class MaterialmanagementMoSupplyRelationEditComponent implements OnInit {
  saveData: any = {};
  dataId = '';
  IsUpdate = false;

  listScheduleRegion: any[] = [];
  listPlant: any[] = [];
  listDataType = [{ label: '物料', value: '0' }, { label: '库存分类', value: '1' }];
  listSupplyType: any[] = [];
  listSubinventories: any[] = [];

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
    this.loadSupplyType();
    this.loadScheduleRegion();
    this.loadPlant();
  }

  loadSupplyType(): void {
    this.listSupplyType.length = 0;
    this.queryService.GetLookupByType('PS_MO_COMP_SUPPLY_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.listSupplyType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  loadScheduleRegion() {
    this.queryService.GetScheduleRegions().subscribe(res => {
      res.data.forEach(item => {
        this.listScheduleRegion.push({
          label: item.descriptions,
          value: item.scheduleRegionCode
        });
      });
    });
  }

  loadPlant() {
    this.listPlant.length = 0;
    this.queryService.GetUserPlant(this.saveData.scheduleRegionCode).subscribe(res => {
      res.Extra.forEach(item => {
        this.listPlant.push({
          label: item.plantCode,
          value: item.plantCode,
          scheduleRegionCode: item.scheduleRegionCode,
        });
        this.loadDefaultPlantAndScheduleRegion();
      });
    });
  }

  loadDefaultPlantAndScheduleRegion() {
    if (!this.IsUpdate) {
      // 加载默认事业部和工厂
      this.saveData.plantCode = this.appConfigService.getPlantCode();
      const userConfig = this.listPlant.find(item => item.value === this.saveData.plantCode);
      this.saveData.scheduleRegionCode = userConfig ? userConfig.scheduleRegionCode : null;
      this.onPlantChange(this.saveData.plantCode);
    }
  }

  onScheduleRegionChange(value) {
    //this.loadPlant();
    this.listPlant.length = 0;
    this.queryService.GetUserPlant(this.saveData.scheduleRegionCode).subscribe(res => {
      res.Extra.forEach(item => {
        this.listPlant.push({
          label: item.plantCode,
          value: item.plantCode,
          plantCode: item.plantCode,
        });
        const userConfig = this.listPlant.find(item => item.value === this.saveData.plantCode);
        this.saveData.plantCode = userConfig ? userConfig.plantCode : null;
      });
    });
  }

  onPlantChange(value) {
    console.log('111');
    this.loadSubinventories(value);
    this.selMater1.Value = '';
    this.selMater1.Text = '';
    this.saveData.categoryValues = '';
  }

  loadSubinventories(plantCode: string) {
    // 加载供应子库
    this.listSubinventories.length = 0;
    this.queryService.QuerySubinventories(plantCode).subscribe(res => {
      res.data.forEach(item => {
        this.listSubinventories.push({
          label: item.subinventoryCode + '(' + item.subinventoryDescription + ')',
          value: item.subinventoryCode
        });
      });
    });
  }

  loadData() {
    console.log(this.dataId);
    if (this.dataId !== undefined && this.dataId !== '') {
      this.IsUpdate = true;
      /** 初始化编辑数据 */
      this.queryService.QueryDataById(this.dataId).subscribe(resultMes => {
        if (resultMes.data !== undefined && resultMes.data.length > 0) {
          const d = resultMes.data[0];
          this.saveData = {
            id: d.id, // 执行ID,主键
            plantCode: d.plantCode, // 工厂编码
            scheduleRegionCode: d.scheduleRegionCode, // 事业部
            category: d.category, // 值类别：0-物料，1-库存分类
            categoryValues: d.categoryValues, // 类别值
            supplyType: d.supplyType, // 供应类型
            supplySubinventory: d.supplySubinventory, // 供应子库
            attribute1: d.attribute1, //
            attribute2: d.attribute2, //
            attribute3: d.attribute3, //
            attribute4: d.attribute4, //
            attribute5: d.attribute5, //
            lastUpdateDate: d.lastUpdateDate, //
            lastUpdatedBy: d.lastUpdatedBy, //
            creationDate: d.creationDate, //
            createdBy: d.createdBy, //
          };

          this.onScheduleRegionChange(this.saveData.scheduleRegionCode);
          // this.onPlantChange(this.saveData.PLANT_CODE);
          this.loadSubinventories(this.saveData.plantCode);
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
    this.queryService.SaveMoSupplyRelationship(this.saveData, this.IsUpdate).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
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
    this.saveData.categoryValues = '';
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
      field: 'categoryValues',
      title: '物料编码/类别编码',
      width: '100'
    },
    {
      field: 'categoryValuesDesc',
      title: '描述',
      width: '100'
    }
  ];

  public loadPopData(inputStr: string, PageIndex: number, PageSize: number) {
    this.QueryPopData(inputStr, '', PageIndex, PageSize).subscribe(res => {
      this.gridViewItems.data = res.data.content;
      this.gridViewItems.total = res.data.totalElements;
    });
  }
  // 物料弹出查询
  public searchItems(e: any) {
    if (this.saveData.category === undefined || this.saveData.category === '') {
      this.msgSrv.info('请先选择值类别');
      return;
    }
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadPopData(e.SearchValue, PageIndex, e.PageSize);
  }

  //  行点击事件， 给参数赋值
  onRowSelect(e: any) {
    this.saveData.categoryValues = e.Value;
  }

  onTextChanged(e: any) {
    if (this.saveData.category === undefined || this.saveData.category === '') {
      this.msgSrv.info('请先选择值类别');
      return;
    }
    this.saveData.categoryValues = '';
    // 给物料描述赋值
    this.QueryPopData('', e.Text, 1, 100).subscribe(res => {
      if (res.data.totalElements === 0) {
        this.msgSrv.error(e.Text + '不存在，请重新输入');
        this.selMater1.Value = '';
        this.selMater1.Text = '';
        this.saveData.categoryValues = '';
      } else {
        this.saveData.categoryValues = res.data.content[0].categoryValues;
        e.Text = res.data.content[0].categoryValues;
        e.Value = res.data.content[0].categoryValues;
      }
    });
  }

  clear() {
    this.loadData();
  }

  QueryPopData(inputLikeStr: string, inputExactStr: string, pageIndex: number, pageSize: number): Observable<ResponseDto> {
    const queryParam = {
      plantCode: this.saveData.plantCode,
      inputLike: inputLikeStr,
      inputExact: inputExactStr,
      pageIndex: pageIndex,
      pageSize: pageSize
    };
    if (this.saveData.category === '0') {
      // 查询物料
      return this.queryService.QueryItemData(queryParam);
    } else {
      // 查询库存分类
      return this.queryService.QueryCategory(queryParam);
    }
  }
}
