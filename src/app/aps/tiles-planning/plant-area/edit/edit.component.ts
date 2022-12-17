import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { deepCopy } from '@delon/util';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { PlantAreaService } from '../plant-area.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-area-edit',
  templateUrl: './edit.component.html',
  providers: [PlantAreaService]

})
export class TilesPlanningPlantAreaEditComponent implements OnInit {
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
  provinceList: any[] = [];
  cityList: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public appTranslationService: AppTranslationService,
    private editService: PlantAreaService,
    private appConfigService: AppConfigService,
    private appconfig: AppConfigService,
    private commonqueryService: CommonQueryService,
  ) { }

  ngOnInit(): void {
    this.clear();
    this.loadOptionData();
  }

  loadOptionData() {
    // 事业部
    this.editService.GetAllScheduleRegion().subscribe(result => {
      this.regionList.length = 0;
      result.data.forEach(d => {
        this.regionList.push({
          label: d.scheduleRegionCode,
          value: d.scheduleRegionCode,
        });
      });
    });
    // 销售公司
    this.loadSalesRegion();
    // 省份
    this.loadProvince();
    // 市
    this.loadCity(this.editDto.province);
    // 工厂
    this.loadPlant();
    // 客户
    // this.downSearch('');
    // 加载客户编辑项
    // if (this.originDto.ID) {
    //   this.loadCustomer(this.customerList, this.downSearchCode, this.pageSize, this.editDto.CUSTOMER_NUMBER);
    // }
  }
  // 销售公司
  loadSalesRegion() {
    this.commonqueryService.GetAllPlant(this.editDto.scheduleRegionCode).subscribe(result => {
      this.salesRegionList.length = 0;
      result.data.forEach(d => {
        this.salesRegionList.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }

  // 省份信息
  loadProvince() {
    this.editService.GetProvinces().subscribe(result => {
      this.provinceList.length = 0;
      result.data.forEach(d => {
        this.provinceList.push({ value: d.id, label: d.districtcode });
      });
    });
  }

  // 切换事业部
  regionChange() {
    this.editDto.salesRegion = null;
    this.editDto.CUSTOMER_NUMBER = null;
    this.editDto.plantCode = null;
    this.customerList.length = 0;
    this.loadSalesRegion();
    this.loadPlant();
    // this.downSearch('');
  }

  // 切换省份
  public provinceChange() {
    // 加载城市
    this.loadCity(this.editDto.province);
  }

  loadCity(strProvinceId: string) {
    this.editService.GetCities(strProvinceId).subscribe(result => {
      const cityList = [];
      result.data.forEach(d => {
        cityList.push({ value: d.id, label: d.districtcode });
      });
      this.cityList = cityList;
    });
  }

  // 生产基地
  loadPlant() {
    this.commonqueryService.GetAllPlant(this.editDto.scheduleRegionCode).subscribe(result => {
      this.plantList.length = 0;
      result.data.forEach(d => {
        this.plantList.push({ value: d.plantCode, label: d.plantCode });
      });
    });
  }

  // 客户
  // loadCustomer(options: any[], searchValue: string, PageSize: number, CUSTOMER_NUMBER: string = '') {
  //   const dto = {
  //     CUSTOMER_NUMBER: CUSTOMER_NUMBER,
  //     CUSTOMER_SHORT_NAME: searchValue,
  //     ENABLE_FLAG: 'A',
  //     QueryParams: { PageIndex: this.downPageIndex, PageSize: PageSize },
  //     IsExport: false
  //   };
  //   this.editService.GetCustomers(dto).subscribe(res => {
  //     res.Result.forEach(data => {
  //       options.push({ value: data.CUSTOMER_NUMBER, label: data.CUSTOMER_SHORT_NAME });
  //     });
  //   });
  // }
  // pageSize = 10;
  // downPageIndex = 1;
  // downSearchCode = '';
  // /* 客户scroll */
  // downScroll(event: any) {
  //   this.downPageIndex++;
  //   this.loadCustomer(this.customerList, this.downSearchCode, this.pageSize);
  // }
  // /* 客户search */
  // downSearch(event: any) {
  //   this.downSearchCode = event;
  //   this.downPageIndex = 1;
  //   this.customerList.length = 0;
  //   this.loadCustomer(this.customerList, this.downSearchCode, this.pageSize);
  // }

  clear() {
    this.editDto = {
      id: null,
      scheduleRegionCode: this.appconfig.getActiveScheduleRegionCode(),
      salesRegion: this.appconfig.getPlantCode(),
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
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
