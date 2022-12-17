import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'change-code',
  templateUrl: './change-copy.component.html',
  // styleUrls: ['../../../../../assets/css/common.css'],
  providers: [QueryService],
})
export class MaintainChangeCopyComponent implements OnInit {
  // 编辑参数
  public i = {
    PLANT_CODE: '',
    ITEM_CODE: '',
    ITEM_ID: '',
    ToId: '',
    ToCode: ''
  };

  plantCodes: any[] = [];
  NEW_PLANT_CODE = null;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public queryService: QueryService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService
  ) { }

  // 初始化
  ngOnInit(): void {
    /** 初始化 组织  下拉框*/
    this.queryService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodes.push({ value: d.PLANT_CODE, label: d.PLANT_CODE });
      });

      this.clear();
    });
  }

  gridView: GridDataResult = {
    data: [],
    total: 0
  };
  columns: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料编码',
      width: '100'
    },
    {
      field: 'DESCRIPTIONS_CN',
      title: '物料描述',
      width: '100'
    }
  ];

  search(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(this.NEW_PLANT_CODE, e.SearchValue, PageIndex, e.PageSize);
  }

  change({ sender, event, Text }) {
    const value = this.i.ITEM_CODE || '';
    if (value === '') {
      if (this.i.ITEM_CODE === '1') {
        // 加载物料或库存分类
        this.queryService.GetUserPlantItemPageList(this.NEW_PLANT_CODE || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
          this.gridView.data = res.Result;
          this.gridView.total = res.TotalCount;
          if (res.TotalCount === 1) {
            this.i.ITEM_CODE = res.Result.find(x => x.ITEM_CODE === Text).ITEM_ID;
          } else {
            this.msgSrv.warning(this.appTranslationService.translate('物料无效'));
          }
        });
      }
    }
  }

  // 加载物料或库存分类
  public loadItems(PLANT_CODE: string, ITEM_ID: string, PageIndex: number, PageSize: number, type: number = 1) {
    // 加载物料或库存分类
    this.queryService.GetUserPlantItemPageList(PLANT_CODE || this.i.PLANT_CODE || '', ITEM_ID, '', PageIndex, PageSize).subscribe(res => {
      this.gridView.data = res.Result;
      this.gridView.total = res.TotalCount;
    });
  }

  changeCode(value?: any) {
    if (this.i.ToCode === null || this.i.ToCode === '') {
      this.msgSrv.warning(this.appTranslationService.translate('切换物料不能为空'));
      return;
    }
    const res_Code = {
      PLANT_CODE: this.NEW_PLANT_CODE,
      ITEM_CODE: this.i.ITEM_CODE,
      ToId: this.i.ToId,
      ToCode: this.i.ToCode
    };
    this.queryService.isExistItemCode(res_Code.PLANT_CODE, res_Code.ToCode).subscribe(res => {
      if (res.Success === true) {
        res_Code.ToId = res.Message;
        this.modal.close(res_Code);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
        this.modal.close();
      }
    });
  }


  // 重置
  public clear() {
    // this.i = {
    //   PLANT_CODE: '',
    //   ITEM_CODE: '',
    //   ITEM_ID: '',
    //   ToId: '',
    //   ToCode: ''
    // };

    this.i.ToId = '';
    this.i.ToCode = '';
    this.NEW_PLANT_CODE = this.appConfigService.getPlantCode();
    if (!this.NEW_PLANT_CODE && this.plantCodes.length > 0) {
      this.NEW_PLANT_CODE = this.plantCodes[0].value;
    }
  }
  // 关闭
  close() {
    this.modal.destroy();
  }
}
