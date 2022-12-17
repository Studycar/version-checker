import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PopupSelectComponent } from 'app/modules/base_module/components/popup-select.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { MoMultiMouldManageService } from 'app/modules/generated_module/services/momultimould-manage-service';
import { PsItemRoutingsService } from 'app/modules/generated_module/services/ps-item-routings-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demandclearupnotice-edit',
  templateUrl: './edit.component.html',
  providers: [PsItemRoutingsService]
})
export class MoMultiMouldEditComponent implements OnInit {

  title: String = '配套计算';
  isLoading = false;
  // tslint:disable-next-line:no-inferrable-types
  isModify: boolean;
  queryParams: any[] = [];
  i: any;
  iClone: any;
  categorySet: any[] = [];
  scheduleGroupCodeOptions: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: PsItemRoutingsService,
    private appTranslationService: AppTranslationService,
    private commonQueryService: CommonQueryService,
    public moMultiMouldManageService: MoMultiMouldManageService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.i.plantCode = this.appConfigService.getPlantCode();
    this.loadplant();
    this.loadCategorySet(); 
  }

  // 绑定页面的下拉框Plant
  optionListPlant = [];
  public loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      this.optionListPlant = result.Extra;
      this.loadGroup(this.i.plantCode);
    });
  }

  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    this.loadCategorySet();
    this.loadGroup(value);
  }




  save() {
    this.moMultiMouldManageService.MoMatchCalc(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success('计算成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

     // 加载计划组
     private loadGroup(plantCode: string) {
      this.scheduleGroupCodeOptions.length = 0;
      this.commonQueryService
        .GetUserPlantGroupOrderByCode(plantCode || '')
        .subscribe(result => {
          result.data.forEach(d => {
            this.scheduleGroupCodeOptions.push({
              label: d.scheduleGroupCode,
              value: d.scheduleGroupCode,
            });
          });
        });
    }
  

  loadCategorySet() {
    this.commonQueryService.GetLookupByTypeNew('FND_CATEGORY_SET').subscribe(res => {
      let codes = ['COLOR_CATEGORY','CARFRAME_CATEGORY'];
      res.data.forEach(element => {
        if(codes.includes(element.lookupCode)){
          this.categorySet.push({
            label: element.additionCode,
            value: element.additionCode
          });
        }
        
      });
    });
    console.log("this.categorySet",this.categorySet );
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
