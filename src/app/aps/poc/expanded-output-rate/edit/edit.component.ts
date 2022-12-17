import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { ExpandedOutputRateService } from '../expanded-output-rate.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'expanded-output-rate-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [ExpandedOutputRateService]
})
export class ExpandedOutputRateEditComponent implements OnInit {

  constructor(
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private modal: NzModalRef,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private appTranslateService: AppTranslationService,
    private queryService: ExpandedOutputRateService,
  ) { }

  title = '新增信息';
  isModify = false;
  i: any;
  iClone: any;
  plantOptions: any[] = [];
  itemGridView = {
    data: [],
    total: 0
  };
  itemColumns: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料编码',
      width: '100',
    },
    {
      field: 'DESCRIPTIONS_CN',
      title: '物料描述',
      width: '100'
    },
  ];

  ngOnInit() {
    if (this.i.Id) {
      this.title = '编辑信息';
      this.isModify = true;
      this.i = Object.assign({}, this.i);
      this.iClone = Object.assign({}, this.i);
    } else {
      this.i.PLANT_CODE = this.appConfigService.getPlantCode();
    }
    this.getPlantOptions();
  }

  getPlantOptions() {
    this.commonQueryService.GetUserPlant().subscribe(res => {
      res.Extra.forEach(item => {
        this.plantOptions.push({
          label: item.PLANT_CODE,
          value: item.PLANT_CODE,
        });
      });
    });
  }

  onPlantChange(val: string) {
    this.i.ITEM_ID = '';
    this.i.ITEM_CODE = '';
  }

  onTextChanged(e: any) {
    if (!e.Text) {
      this.i.ITEM_CODE = '';
      this.i.ITEM_ID = '';
      return;
    }
    if (!this.i.PLANT_CODE) {
      this.msgSrv.warning(
        this.appTranslateService.translate('请先选择工厂！'),
      );
      this.i.ITEM_ID = '';
      this.i.ITEM_CODE = '';
      return;
    }
    this.commonQueryService.GetUserPlantItemPageList(this.i.PLANT_CODE, e.Text, '').subscribe(res => {
      const dataItem = res.Result.find(item => item.ITEM_CODE === e.Text);
      if (!dataItem) {
        this.msgSrv.error(this.appTranslateService.translate('物料无效'));
        this.i.ITEM_ID = '';
        this.i.ITEM_CODE = '';
      } else {
        this.i.ITEM_ID = dataItem.ITEM_ID;
        this.i.ITEM_CODE = dataItem.ITEM_CODE;
      }
    });
  }

  searchItems(event: any) {
    if (!this.i.PLANT_CODE) {
      this.msgSrv.warning(
        this.appTranslateService.translate('请先选择工厂！'),
      );
      return;
    }
    const PageIndex = event.Skip / event.PageSize + 1;
    this.loadItems(
      this.i.PLANT_CODE,
      event.SearchValue,
      PageIndex,
      event.PageSize,
    );
  }

  loadItems(
    plantCode: string,
    itemCode: string,
    PageIndex: number,
    PageSize: number,
  ) {
    this.commonQueryService.GetUserPlantItemPageList(
      plantCode || '',
      itemCode || '',
      '',
      PageIndex,
      PageSize,
    )
      .subscribe(res => {
        this.itemGridView.data = res.Result;
        this.itemGridView.total = res.TotalCount;
      });
  }

  save() {
    this.queryService.save(this.i).subscribe(res => {
      if (res.Success) {
        this.msgSrv.success(this.appTranslateService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslateService.translate(res.Message || '保存失败'));
      }
    });
  }

  close() {
    this.modal.close();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

}
