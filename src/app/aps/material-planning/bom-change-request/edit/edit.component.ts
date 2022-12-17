import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { BomChangeRequestService } from '../bom-change-request.service';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'bom-change-request-edit',
  templateUrl: './edit.component.html',
  providers: [BomChangeRequestService]
})
export class BomChangeRequestEditComponent implements OnInit {

  constructor(
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private modal: NzModalRef,
    private commonQueryService: CommonQueryService,
    private appTranslateService: AppTranslationService,
    private queryService: BomChangeRequestService,
  ) { }

  params: any;
  paramsClone: any;
  title = '新增信息';
  editDisabled = false;
  whetherOptions: any[] = [];
  ecrTypeOptions: any[] = [];
  plantOptions: any[] = [];
  itemOptions: GridDataResult = {
    data: [],
    total: 0
  };
  columnsItems: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
      width: '100'
    },
    {
      field: 'descriptionsCn',
      title: '物料描述',
      width: '100'
    }
  ];

  ngOnInit() {
    if (this.params.id !== undefined) {
      this.title = '编辑信息';
      this.editDisabled = true;
      // this.queryService.getBomChangeRequestById(this.params.id).subscribe(res => {
      //   this.params = res.data;
      //   this.paramsClone = Object.assign({}, this.params);
      // });
    }
    this.LoadData();
    this.loadWhetherOptions();
    this.loadEcrTypeOptions();
  }

  LoadData() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      res.Extra.forEach(element => {
        this.plantOptions.push({
          label: element.plantCode,
          value: element.plantCode
        });
      });
    });
  }

  loadWhetherOptions() {
    this.commonQueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      this.whetherOptions.length = 0;
      result.Extra.forEach(d => {
        this.whetherOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  }

  loadEcrTypeOptions() {
    this.commonQueryService.GetLookupByType('MRP_ECR_TYPE').subscribe(res => {
      this.ecrTypeOptions.length = 0;
      res.Extra.forEach(item => {
        this.ecrTypeOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }

  searchItems(e: any) {
    const pageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.params.plantCode, e.SearchValue, pageIndex, e.PageSize);
  }

  public loadItems(plantCode: string, itemCode: string, pageIndex: number, pageSize: number) {
    // 加载物料
    this.commonQueryService.getUserPlantItemPageList(plantCode || '', itemCode || '', '', pageIndex, pageSize).subscribe(res => {
      this.itemOptions.data = res.data.content;
      this.itemOptions.total = res.data.totalElements;
    });
  }

  assemblyItemChange({ sender, event, Text }) {
    const value = this.params.assemblyItemId || '';
    if (value === '') {
      // 加载物料
      this.commonQueryService.getUserPlantItemPageList(this.params.plantCode || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
        this.itemOptions.data = res.data.content;
        this.itemOptions.total = res.data.totalElements;
          if(res.data.totalElements === 1) {
            this.params.assemblyItemId = res.data.content.find(x => x.itemCode === Text).itemId;
        } else {
          this.msgSrv.warning(this.appTranslateService.translate('物料无效'));
        }
      });
    }
  }

  componentItemChange({ sender, event, Text }) {
    const value = this.params.componentItemId || '';
    if (value === '') {
      // 加载物料
      this.commonQueryService.getUserPlantItemPageList(this.params.plantCode || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
        this.itemOptions.data = res.data.content;
        this.itemOptions.total = res.data.totalElements;
          if(res.data.totalElements === 1) {
          this.params.componentItemId = res.data.content.find(x => x.itemCode === Text).itemId;
        } else {
          this.msgSrv.warning(this.appTranslateService.translate('物料无效'));
        }
      });
    }
  }

  save() {
    this.queryService.update(this.params).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslateService.translate('保存成功！'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslateService.translate(res.msg));
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.params = this.paramsClone;
    this.paramsClone = Object.assign({}, this.params);
  }
}
