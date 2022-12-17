import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { SchedulePriorityService } from '../schedule-priority.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'schedule-priority-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [SchedulePriorityService]
})
export class SchedulePriorityEditComponent implements OnInit {

  constructor(
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private modal: NzModalRef,
    private appConfigService: AppConfigService,
    private commonQueryService: CommonQueryService,
    private appTranslateService: AppTranslationService,
    private queryService: SchedulePriorityService,
  ) { }

  title = '新增信息';
  isModify = false;
  i: any;
  iClone: any;
  plantOptions: any[] = [];
  constraintOptions: any[] = [];
  itemGridView = {
    data: [],
    total: 0
  };
  itemColumns: any[] = [
    {
      field: 'itemCode',
      title: '物料编码',
      width: '100',
    },
    {
      field: 'descriptionsCn',
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
      this.i.plantCode = this.appConfigService.getPlantCode();
      this.i.priorty = 500;
    }
    this.loadOptions();
  }

  loadOptions() {
    this.commonQueryService.GetUserPlantNew().subscribe(res => {
      res.data.forEach(item => {
        this.plantOptions.push({
          label: item.plantCode,
          value: item.plantCode,
        });
      });
    });

    this.commonQueryService.GetLookupByType('PS_SCHEDULE_CONSTRAIN').subscribe(res => {
      res.Extra.forEach(item => {
        this.constraintOptions.push({
          label: item.meaning,
          value: item.lookupCode,
        });
      });
    });
  }

  onPlantChange(val: string) {
    this.i.itemId = '';
    this.i.itemCode = '';
  }

  onTextChanged(e: any) {
    if (!e.Text) {
      this.i.itemCode = '';
      this.i.itemId = '';
      return;
    }
    if (!this.i.plantCode) {
      this.msgSrv.warning(
        this.appTranslateService.translate('请先选择工厂！'),
      );
      this.i.itemId = '';
      this.i.itemCode = '';
      return;
    }
    this.commonQueryService.getUserPlantItemPageList(this.i.plantCode, e.Text, '').subscribe(res => {
      const dataItem = res.data.content.find(item => item.itemCode === e.Text);
      if (!dataItem) {
        this.msgSrv.error(this.appTranslateService.translate('物料无效'));
        this.i.itemId = '';
        this.i.itemCode = '';
      } else {
        this.i.itemId = dataItem.itemId;
        this.i.itemCode = dataItem.itemCode;
      }
    });
  }

  /** 物料查询 */
  searchItems(event: any) {
    if (!this.i.plantCode) {
      this.msgSrv.warning(
        this.appTranslateService.translate('请先选择工厂！'),
      );
      return;
    }
    const PageIndex = event.Skip / event.PageSize + 1;
    this.loadItems(
      this.i.plantCode,
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
    this.commonQueryService.getUserPlantItemPageList(
      plantCode || '',
      itemCode || '',
      '',
      PageIndex,
      PageSize,
    )
      .subscribe(res => {
        this.itemGridView.data = res.data.content;
        this.itemGridView.total = res.data.totalElements;
      });
  }

  save() {
    this.queryService.save(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslateService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslateService.translate(res.msg || '保存失败'));
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
