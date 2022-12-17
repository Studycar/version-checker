import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { deepCopy } from '@delon/util';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { PlantAreaService } from '../plant-area.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-area-edit',
  templateUrl: './edit.component.html',
  providers: [PlantAreaService]

})
export class DemandOrderManagementPlantAreaEditComponent implements OnInit {
  // 编辑信息
  originDto: any;
  editDto: any;
  isModify = false;
  // 选项
  regionList: any[] = [];
  salesRegionList: any[] = [];
  salesAreaList: any[] = [];
  customerList: any[] = [];
  plantList: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public appTranslationService: AppTranslationService,
    private editService: PlantAreaService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.clear();
    this.loadOptionData();
  }

  loadOptionData() {
    // 事业部
    this.editService.GetAllScheduleRegion().subscribe(result => {
      this.regionList.length = 0;
      if (!result.data) return;
      result.data.forEach(d => {
        this.regionList.push({
          label: d.scheduleRegionCode,
          value: d.scheduleRegionCode,
        });
      });
    });
    // 销售公司
    this.loadSalesRegion();
    // 区域
    this.loadSalesArea();
    // 工厂
    this.loadPlant();
    // 客户
    this.downSearch('');
    // 加载客户编辑项
    if (this.originDto.ID) {
      this.loadCustomer(this.customerList, this.downSearchCode, this.pageSize, this.editDto.customerNumber);
    }
  }
  // 销售公司
  loadSalesRegion() {
    this.editService.GetDivisions({
      scheduleRegionCode: this.editDto.scheduleRegionCode,
      custDivisionType: 'REGION',
      export: true,
    }).subscribe(result => {
      this.salesRegionList.length = 0;
      if (!result.data) return;
      result.data.forEach(d => {
        this.salesRegionList.push({
          label: d.custDivisionName,
          value: d.custDivisionValue,
        });
      });
    });
  }
  // 区域
  loadSalesArea() {
    this.editService.GetDivisions({
      scheduleRegionCode: this.editDto.scheduleRegionCode,
      custDivisionType: 'DC',
      enableFlag: 'Y',
      pareatDivisionId: this.editDto.salesRegion,
      export: true,
    }).subscribe(result => {
      this.salesAreaList.length = 0;
      if (!result.data) return;
      result.data.forEach(d => {
        this.salesAreaList.push({
          label: d.custDivisionName,
          value: d.custDivisionValue,
        });
      });
    });
  }
  // 切换事业部
  regionChange() {
    this.editDto.salesRegion = null;
    this.editDto.salesArea = null;
    this.editDto.customerNumber = null;
    this.editDto.plantCode = null;
    this.customerList.length = 0;
    this.loadSalesRegion();
    this.loadSalesArea();
    this.loadPlant();
    this.downSearch('');
  }
  // 切换销售公司
  salesRegionChange() {
    this.editDto.salesArea = null;
    this.editDto.customerNumber = null;
    this.customerList.length = 0;
    this.loadSalesArea();
    this.downSearch('');
  }
  // 切换业务区域
  salesAreaChange() {
    this.editDto.customerNumber = null;
    this.customerList.length = 0;
    this.downSearch('');
  }
  // 工厂
  loadPlant() {
    // 加载工厂
    this.editService.GetUserPlant(this.editDto.scheduleRegionCode).subscribe(result => {
      this.plantList.length = 0;
      result.Extra.forEach(d => {
        this.plantList.push({
          label: d.plantCode,
          value: d.plantCode,
          scheduleRegionCode: d.scheduleRegionCode,
        });
      });
    });
  }
  // 客户
  loadCustomer(options: any[], searchValue: string, PageSize: number, CUSTOMER_NUMBER: string = '') {
    const dto = {
      customerNumber: CUSTOMER_NUMBER,
      customerShortName: searchValue,
      enableFlag: 'A',
      areaCode: this.editDto.areaCode,
      // QueryParams: { PageIndex: this.downPageIndex, PageSize: PageSize },
      pageIndex: this.downPageIndex,
      pageSize: PageSize,
      isExport: false
    };
    this.editService.GetCustomers(dto).subscribe(res => {
      if (!res.data && !res.data.content) return;
      res.data.content.forEach(data => {
        options.push({ value: data.customerNumber, label: data.customerShortName });
      });
    });
  }
  pageSize = 10;
  downPageIndex = 1;
  downSearchCode = '';
  /* 客户scroll */
  downScroll(event: any) {
    this.downPageIndex++;
    this.loadCustomer(this.customerList, this.downSearchCode, this.pageSize);
  }
  /* 客户search */
  downSearch(event: any) {
    this.downSearchCode = event;
    this.downPageIndex = 1;
    this.customerList.length = 0;
    this.loadCustomer(this.customerList, this.downSearchCode, this.pageSize);
  }

  clear() {
    this.editDto = {
      id: null,
      scheduleRegionCode: this.originDto.scheduleRegionCode
    };
    if (this.originDto.id) {
      this.isModify = true;
      this.editDto = deepCopy(this.originDto);
    }
  }

  save() {
    this.editService.Save(this.editDto).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg || '保存失败'));
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
