import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { SopResourceCapacityManageService } from '../../../../modules/generated_module/services/sopresourcecapacity-manage-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { PsItemRoutingsService } from '../../../../modules/generated_module/services/ps-item-routings-service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demand-order-management-demandclearupnotice-edit',
  templateUrl: './edit.component.html',
  providers: [PsItemRoutingsService]
})
export class SopResourceCapacityEditComponent implements OnInit {

  title: String = '编辑信息';
  enableflags: any[] = [];
  isLoading = false;
  // tslint:disable-next-line:no-inferrable-types
  IsDisable: boolean = false;
  isModify: boolean;
  queryParams: any[] = [];
  i: any;
  iClone: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: PsItemRoutingsService,
    private commonQueryService: CommonQueryService,
    public sopResourceCapacityManageService: SopResourceCapacityManageService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    if (!this.i.id) {
      this.title = '新增信息';
      this.i.plantCode = this.appConfigService.getPlantCode();
      this.IsDisable = false;
      this.loadData();
    } else {
      this.loadData();
      this.IsDisable = true;
    }
  }


  loadData() {
    /**
 * 初始化编辑信息
 */
    if (this.i.id != null) {
      this.isModify = true;
      this.sopResourceCapacityManageService.Get(this.i.id).subscribe(result => {
        this.i = result.data;
        this.iClone = Object.assign({}, this.i);
      }
      );
    }
    this.loadplant();
  }


  save() {
    this.sopResourceCapacityManageService.Edit(this.i).subscribe(res => {
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

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  // 绑定页面的下拉框Plant
  optionListPlant = [];
  public loadplant(): void {
    /** 初始化  工厂*/
    this.isLoading = true;
    this.commonQueryService.GetUserPlant().subscribe(result => {
      this.isLoading = false;
      this.optionListPlant = result.Extra;
      this.loadplantGroup();
    });
  }

  // 绑定页面的下拉框Plant组
  optionListPlantGroup = [];
  public loadplantGroup(): void {
    this.isLoading = true;
    this.commonQueryService.GetUserPlantGroup(this.i.plantCode).subscribe(result => {
      this.isLoading = false;
      this.optionListPlantGroup = result.Extra;
      this.loadproductLine();
    });
  }

  // 绑定页面的下拉框产线
  optionListProductLine = [];
  public loadproductLine(): void {
    this.isLoading = true;
    this.commonQueryService.GetUserPlantGroupLine(this.i.plantCode, this.i.scheduleGroupCode).subscribe(result => {
      this.isLoading = false;
      this.optionListProductLine = result.Extra;

    });
  }

  // 工厂 值更新事件 重新绑定组
  onChangePlant(value: string): void {
    /** 重新绑定  组*/

    this.i.scheduleGroupCode = '';
    this.i.resourceCode = '';

    // 计划组为空，从新清空绑定组和产线
    this.optionListPlantGroup = [];
    this.optionListProductLine = [];


    this.commonQueryService
      .GetUserPlantGroup(value)
      .subscribe(result => {
        if (result.Extra == null) {

          return;
        } else {
          // 先清除，在重新绑定

          this.optionListPlantGroup = [
            ...this.optionListPlantGroup,
            ...result.Extra,
          ];
          return;
        }
      });


  }

  // 组 值更新事件 重新绑定产线
  onChangeGroup(value: string): void {
    /** 重新绑定  组*/

    // 先清除，在重新绑定
    this.i.resourceCode = '';
    this.optionListProductLine = [];
    this.commonQueryService.GetUserPlantGroupLine(this.i.plantCode, value).subscribe(result => {
      if (result.Extra == null) {

        return;
      } else {
        // 先清除，在重新绑定

        this.optionListProductLine = [
          ...this.optionListProductLine,
          ...result.Extra,
        ];
        return;
      }
    });
  }

  // 资源 值更新事件
  onChangeLine(value: string): void {
    this.editService.GetResouceCode(this.i.plantCode, value).subscribe(resultMes => {
      this.i.resourceType = resultMes.data[0].resourceType;
    });
  }
  onCurrentMonthChange(date: Date): void {
    this.i.currentMonth = date;
  }
}
