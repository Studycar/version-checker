/*
 * @Description: In User Settings Edit
 * @Author: zwh
 * @Date: 2018-12-25 13:59:13
 * @LastEditTime: 2019-07-19 08:41:00
 * @LastEditors: Zwh
 */
import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { DemandPutService } from '../../../../modules/generated_module/services/demand-put-service';
import { BehaviorSubject } from 'rxjs';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { GridDataResult } from '@progress/kendo-angular-grid';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-demandput-edit',
  templateUrl: './edit.component.html'
})
export class PreparationPlatformDemandputEditComponent implements OnInit {
  record: any = {};
  i: any;
  iClone: any;
  plantoptions: any[] = [];
  itemoptions = [];
  readOnly: Boolean = false;
  title: String = '新增';
  regionoptions: any[] = [];
  today = new Date();
  isLoading = false;
  randomUserUrl = '';
  url1 = '';
  pageIndex: number;
  pageSize: Number = 10;

  plantCode: String;
  k: String;

  searchChange$ = new BehaviorSubject('');
  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    public msgSrv: NzMessageService,
    private dataservice: DemandPutService,
    private commonquery: CommonQueryService,
    private appconfig: AppConfigService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    this.pageIndex = 1;
    this.k = '';
    if (this.i.id !== null) {
      this.readOnly = true;
      this.title = '编辑';
      this.dataservice.GetById(this.i.id).subscribe(res => {
        this.itemoptions.push(res.data.itemCode);
        this.plantchange(res.data.plantCode);
        this.dataservice.GetRegion(res.data.itemCode).subscribe(res => {
          res.data.forEach(element => {
            this.regionoptions.push({
              label: element.deliveryRegionCode,
              value: element.deliveryRegionCode
            });
          });
        });
        this.i = res.data;
        this.iClone = Object.assign({}, this.i);
      });
    } else {
      this.i.plantCode = this.appconfig.getPlantCode();
      this.plantchange(this.i.plantCode);
    }
    this.LoadData();
  }

  LoadData() {
    this.commonquery.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantoptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
    this.getRegionData(this.i.plantCode);
  }

  save() {
    if (this.i.id === null) {
      this.dataservice.SaveForNew(this.i).subscribe(res => {
        if (res.code = 200) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    } else {
      this.dataservice.EditData(this.i).subscribe(res => {
        if (res.code = 200) {
          this.msgSrv.success('修改成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.msg);
        }
      });
    }
  }

  close() {
    this.modal.destroy();
  }

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
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

  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.i.plantCode, e.SearchValue, PageIndex, e.PageSize);
  }
  change1(event: any) {
    const value = this.i.itemId || '';
    if (value === '') {
      // 加载物料commonquery.getUserPlantItemPageList  dataservice.GetUserPlantItemPageList
      this.commonquery.getUserPlantItemPageList(this.i.plantCode || '', event.Text || '', '', 1, event.sender.pageSize).subscribe(res => {
        this.gridView1.data = res.data.content;
        this.gridView1.total = res.data.totalElements;
        if (res.data.totalElements === 1) {
          this.i.itemId = res.data.content.find(x => x.itemCode === event.Text).itemId;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
        }
      });
      //console.log('event:');
      //console.log(event);
      this.itemChange(event.Text);
    }
  }
  // 加载物料
  public loadItems(plantCode: string, itemCode: string, PageIndex: number, PageSize: number) {
    // 加载物料
    this.commonquery.getUserPlantItemPageList(plantCode || '', itemCode || '', '', PageIndex, PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }

  // 工厂切换
  plantchange(value: any) {
    this.i.itemId = null;
    this.i.itemCode = this.i.itemCode !== null ? null : '';
    this.gridView1.data = [];
    this.gridView1.total = 0;
    this.i.deliveryRegionCode = null;
    // 获取送货区域数据
    this.getRegionData(value);
    // this.itemChange(value);
  }

  itemChange(value: any) {
    const itemCode = value.Text || value;
    //this.i.itemDesc=itemCode;
    //console.log('value==='+value);
    this.dataservice.GetDesc(itemCode).subscribe(res => {
      console.log('res');
      console.log(res);
      if (res.data.length > 0) {
        this.i.itemDesc = res.data[0].descriptionsCn;
      }
    });
    this.regionoptions.length = 0;
    this.dataservice.GetRegion(itemCode).subscribe(res => {
      res.data.forEach(element => {
        this.regionoptions.push({
          label: element.deliveryRegionCode,
          value: element.deliveryRegionCode
        });
      });
    });



  }

  getRegionData(plantCode: any) {
    this.dataservice.GetRegion1(plantCode).subscribe(res => {
      res.data.forEach(element => {
        this.regionoptions.push({
          label: element.deliveryRegionCode,
          value: element.deliveryRegionCode
        });
      });
    });
  }

  range(start: number, end: number): number[] {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return (current < this.today);
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
