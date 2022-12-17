import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { QueryService } from '../query.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'copy-process',
  templateUrl: './copy.component.html',
  // styleUrls: ['../../../../../assets/css/common.css'],
  providers: [QueryService],
})
export class MaintainProcessCopyComponent implements OnInit {
  // 编辑参数
  public i = {
    PLANT_CODE: '',
    ITEM_CODE: '',
    ITEM_ID: '',
    CATEGORY: '1',
    OBJECT: ''
  };
  public CatOptions = [
    {
      label: '物料',
      value: '1'
    },
    {
      label: '库存分类',
      value: '2'
    }
  ];

  plantCodes: any[] = [];
  NEW_PLANT_CODE = null;

  // 构造函数
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

  // 复制
  public copy(value: any) {
    if (!this.i.PLANT_CODE || !this.i.ITEM_CODE) {
      this.msgSrv.warning(this.appTranslationService.translate('请输入先选择物料'));
      return;
    }
    if (this.i.OBJECT === '' || this.i.OBJECT === null) {
      this.msgSrv.warning(this.appTranslationService.translate('请输入物料/库存分类'));
      return;
    } else {
      this.save(value);
    }
    /*
    this.queryService.CopyByDate(this.i).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success(this.appTranslationService.translate('复制成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.warning(this.appTranslationService.translate(res.Message));
      }
    });
    */
  }

  catChange(event: any) {
    if (this.i === null || this.i.CATEGORY === '1') {
      this.columns1 = [
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
    } else {
      this.columns1 = [
        {
          field: 'ITEM_CODE',
          title: '库存分类',
          width: '100'
        },
        {
          field: 'DESCRIPTIONS_CN',
          title: '库存分类描述',
          width: '100'
        }
      ];
    }
    this.i.OBJECT = null;
    this.gridView1 = {
      data: [],
      total: 0
    };
  }

  save(value?: any) {
    const dto = {
      PLANT_CODE: this.i.PLANT_CODE,
      ITEM_CODE: this.i.ITEM_CODE,
      ITEM_ID: this.i.ITEM_ID,
      NEW_PLANT_CODE: this.NEW_PLANT_CODE,
      CATEGORY: this.i.CATEGORY,
      OBJECT: this.i.OBJECT
    };

    this.queryService.CopyProcessNew(dto).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success(this.appTranslationService.translate(res.Message || '复制成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
        this.modal.close();
      }
    });
  }

  gridView1: GridDataResult = {
    data: [],
    total: 0
  };

  columns1: any[] = [
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

  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    if (this.i.CATEGORY === '1') {
      // 加载物料
      this.loadItems(this.NEW_PLANT_CODE, e.SearchValue, PageIndex, e.PageSize);
    } else {
      // 加载库存分类
      this.queryService.getCatPageList(e.SearchValue, PageIndex, e.PageSize).subscribe(res => {
        this.gridView1.data = res.Result;
        this.gridView1.total = res.TotalCount;
      });
    }
  }

  change1({ sender, event, Text }) {
    const value = this.i.OBJECT || '';
    if (value === '') {
      if (this.i.CATEGORY === '1') {
        // 加载物料或库存分类
        this.queryService.GetUserPlantItemPageList(this.NEW_PLANT_CODE || '', Text || '', '', 1, sender.PageSize).subscribe(res => {
          this.gridView1.data = res.Result;
          this.gridView1.total = res.TotalCount;
          if (res.TotalCount === 1) {
            this.i.OBJECT = res.Result.find(x => x.ITEM_CODE === Text).ITEM_ID;
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
    if (type === 1) {
      this.queryService.GetUserPlantItemPageList(PLANT_CODE, ITEM_ID, '', PageIndex, PageSize).subscribe(res => {
        this.gridView1.data = res.Result;
        this.gridView1.total = res.TotalCount;
      });
    } else {
      this.queryService.GetUserPlantItemPageList(PLANT_CODE, ITEM_ID, '', PageIndex, PageSize).subscribe(res => {
        this.gridView1.data = res.Result;
        this.gridView1.total = res.TotalCount;
      });
    }
  }

  // 重置
  public clear() {
    this.NEW_PLANT_CODE = this.appConfigService.getPlantCode();
    if (!this.NEW_PLANT_CODE && this.plantCodes.length > 0) {
      this.NEW_PLANT_CODE = this.plantCodes[0].value;
    }
    this.i.CATEGORY = '1';
    this.i.OBJECT = '';
  }
  // 关闭
  close() {
    this.modal.destroy();
  }
}
