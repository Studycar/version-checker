import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { MessageManageService } from '../../../modules/generated_module/services/message-manage-service';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import {
  State,
  process,
} from '../../../../../node_modules/@progress/kendo-data-query';
import { map } from '../../../../../node_modules/rxjs/operators';
import { MakeDataService } from './make-data.service';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'make-data',
  templateUrl: './make-data.component.html',
  providers: [MakeDataService],
  styleUrls: ['./make-data.component.css'],
})
export class MakeDataComponent extends CustomBaseContext implements OnInit {
  public plants: any = [];
  public selected_plant: string = '';
  public allChecked = false;
  public indeterminate = false;
  public loading = false;

  public checkOptionsOne = [
    { label: '物料', value: 'deleteItem', checked: false },
    { label: 'BOM', value: 'deleteBom', checked: false },
    { label: '工艺路线', value: 'deleteItemRouting', checked: false },
    { label: '采购员', value: 'deleteBuyer', checked: false },
    // { label: '合格供应商', value: 'deleteVendors', checked: false },
    { label: '物料类别分配', value: 'deleteItemCategories', checked: false },
    { label: '现有量', value: 'deleteOnhandQuantities', checked: false },
    { label: '完工数量', value: 'deleteMoCompleteTran', checked: false },
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private messageManageService: MessageManageService,
    public makeDataService: MakeDataService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private commonqueryservice: CommonQueryService,
    private exportImportService: ExportImportService,
  ) {
    super({
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // 获取工厂
    this.commonqueryservice.GetUserPlant().subscribe(result => {
      result.Extra.forEach(element => {
        this.plants.push({
          label: element.plantCode,
          value: element.plantCode,
        });
      });
    });
  }

  /**全选所有 */
  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne = this.checkOptionsOne.map(item => {
        return {
          ...item,
          checked: true,
        };
      });
    } else {
      this.checkOptionsOne = this.checkOptionsOne.map(item => {
        return {
          ...item,
          checked: false,
        };
      });
    }
  }

  /**单选一项 */
  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  /**删除数据 */
  deleteData() {
    if (
      this.selected_plant === 'M23' ||
      this.selected_plant === 'M88' ||
      this.selected_plant === '珠海一部'
    ) {
      this.msgSrv.error(
        this.appTranslationService.translate('M23，M88工厂不支持删除哦！'),
      );
      return;
    }
    // {
    //   DELETE_ITEM: true,
    //   DELETE_BOM: false,
    //   DELETE_ITEM_ROUTING: false,
    //   DELETE_BUYER: false,
    //   DELETE_VENDORS: false,
    //   DELETE_ITEM_CATEGORIES: false,
    //   DELETE_ONHAND_QUANTITIES: false,
    // }
    const deleteDto = { plantCode: this.selected_plant };
    this.checkOptionsOne.forEach(item => {
      deleteDto[item.value] = item.checked;
    });
    console.log(deleteDto, 'deleteDto');
    this.loading = true;
    this.makeDataService.deleteData(deleteDto).subscribe(res => {
      this.loading = false;
      if (res.code==200) {
        const msg = res.msg || '保存成功';
        this.msgSrv.success(this.appTranslationService.translate(msg));
      } else {
        const msg = res.msg || '操作失败！';
        this.msgSrv.error(this.appTranslationService.translate(msg));
      }
    });
  }

  /**导入物料类别分配 */
  importItemCategoryAssign() {
    this.exportImportService.import('ITEM_CATEGORY_ASSIGN', result => {
      console.log("this.exportImportService.import('ITEM_CATEGORY_ASSIGN')");
      if (result) {
        this.query();
      }
    });
  }

  /**导入物料 */
  importItem() {
    this.exportImportService.import('ITEM_IMPORT', result => {
      console.log("this.exportImportService.import('ITEM_IMPORT')");
      if (result) {
        this.query();
      }
    });
  }

  /**导入bom头 */
  importBOMStructure() {
    this.exportImportService.import('BOM_STRUCTURE_IMPORT', result => {
      console.log("this.exportImportService.import('BOM_STRUCTURE_IMPORT')");
      if (result) {
        this.query();
      }
    });
  }

  /**导入bom行 */
  importBOMComponents() {
    this.exportImportService.import('BOM_COMPONENTS', result => {
      console.log("this.exportImportService.import('BOM_STRUCTURE_IMPORT')");
      if (result) {
        this.query();
      }
    });
  }

  /**导入采购员 */
  importBuyers() {
    this.exportImportService.import('IMPORT_BUYERS', result => {
      console.log("this.exportImportService.import('IMPORT_BUYERS')");
      if (result) {
        this.query();
      }
    });
  }

  /**导入工艺路线 */
  importItemRoutings() {
    this.exportImportService.import('ITEM_ROUTING_IMPORT', result => {
      console.log("this.exportImportService.import('ITEM_ROUTING_IMPORT')");
      if (result) {
        this.query();
      }
    });
  }

  /**导入现有量 */
  importOnHandQuantities() {
    this.exportImportService.import('IMPORT_ONHAND_QUANTITIES', result => {
      console.log(
        "this.exportImportService.import('IMPORT_ONHAND_QUANTITIES')",
      );
      if (result) {
        this.query();
      }
    });
  }

   /**导入完工数量 */
   importMoCompleteTran() {
    this.exportImportService.import('IMPORT_MO_COMPLETE_TRAN', result => {
      console.log(
        "this.exportImportService.import('IMPORT_MO_COMPLETE_TRAN')",
      );
      if (result) {
        this.query();
      }
    });
  }
}
