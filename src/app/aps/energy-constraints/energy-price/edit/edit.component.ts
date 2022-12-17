import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { EnerygyPriceInputDto } from 'app/modules/generated_module/dtos/energy-price-input-dto';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { EnergyPriceService } from '../query.service';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  providers: [EnergyPriceService]
})
export class EnergyConstraintsEnergyPriceEditComponent implements OnInit {
  /**false：新增信息，true：编辑信息 */
  isModify: boolean = false;
  i: EnerygyPriceInputDto;
  iClone: EnerygyPriceInputDto;
  startTime: Date | null;
  endTime: Date | null;
  isPeakValley: boolean = false;

  /**能源类型 */
  energyTypeOptions = [];
  /**价格类型 */
  planTypeOptions = [];
  planPeakValue: string = '2';
  /**峰平谷类型 */
  rateNumberOptions = [
    {
      label: '峰',
      value: '1'
    },
    {
      label: '平',
      value: '2'
    },
    {
      label: '谷',
      value: '3'
    },
    {
      label: '尖',
      value: '4'
    }
  ];
  /**用户有权限的工厂 */
  plantCodeList = [];

  constructor(
    private modal: NzModalRef,
    private queryService: EnergyPriceService,
    private appconfig: AppConfigService,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  changePeakValleyStatus() {
    // 是否峰平谷类型
    this.isPeakValley = (this.i.planType == this.planPeakValue);
    if(this.isPeakValley && (this.startTime || '') == '') {
      this.startTime = new Date();
      this.endTime = new Date();
    }
  }

  changeUnitSymbol() {
    let option = this.energyTypeOptions
      .find(option => option.value === this.i.energyType);
    // 判断 option 是否为空
    if((option || '') === '') { this.i.unitSymbol = null; }
    else { this.i.unitSymbol = option.attribute1; }
  }

  private loadData() {
    /**初始化 工厂信息 */
    this.queryService.GetUserPlantNew(this.appconfig.getUserId()).subscribe(result => {
      result.data.forEach(d => {
        this.plantCodeList.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });

    this.loadOptions();

    if(this.i.id != null) {
      this.isModify = true;
      /** 初始化编辑数据 */
      this.queryService.GetEnergyPriceItem(this.i.id).subscribe(resultMes => {
        this.i = resultMes.data;
        this.isPeakValley = (this.i.planType == this.planPeakValue);
        if(this.energyTypeOptions.length) { this.changeUnitSymbol(); }
        if(this.isPeakValley) {
          let time = this.i.startTime.split(":").map(t => parseInt(t));
          this.startTime = new Date(0,0,0,time[0],time[1],time[2]);
          time = this.i.endTime.split(":").map(t => parseInt(t));
          this.endTime = new Date(0,0,0,time[0],time[1],time[2]);
        } else {
          this.startTime = null;
          this.endTime = null;
          this.i.rateNumber = null;
        }
        this.iClone = Object.assign({}, this.i);
      });
    }

  }

  loadOptions() {
    this.queryService.GetEnergyTypeByTypeRef('PS_ENERGY_TYPE', this.energyTypeOptions);
    this.queryService.GetLookupByTypeLang('PS_ENERGY_PRICE_TYPE', '').subscribe((result) => {
      this.planTypeOptions.length = 0;
      result.Extra.forEach(d => {
        this.planTypeOptions.push({
          label: d.meaning,
          value: d.lookupCode
        });
      });
      this.planPeakValue = this.planTypeOptions.find(option => option.label == "峰平谷").value;
    });
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  disabledTimeToHour = (): number[] => {
    if (!this.startTime) {
      return [];
    }
    let disabledHours: number[] = [];
    let fromHour: number = this.startTime.getHours();
    for(let i = 0; i < fromHour; i++) {
      disabledHours.push(i);
    }
    return disabledHours;
  }

  disabledTimeToMinute = (hour: number): number[] => {
    if (!this.startTime) {
      return [];
    }
    let disabledMinutes: number[] = [];
    let fromHour: number = this.startTime.getHours();
    let fromMinute: number = this.startTime.getMinutes();
    if(hour === fromHour) {
      for(let i = 0; i < fromMinute; i++) {
        disabledMinutes.push(i);
      }
    }
    return disabledMinutes;
  }

  disabledTimeToSecond = (hour: number, minute: number): number[] => {
    if (!this.startTime) {
      return [];
    }
    let disabledSeconds: number[] = [];
    let fromHour: number = this.startTime.getHours();
    let fromMinute: number = this.startTime.getMinutes();
    let fromSecond: number = this.startTime.getSeconds();
    if(hour === fromHour && minute === fromMinute) {
      for(let i = 0; i < fromSecond; i++) {
        disabledSeconds.push(i);
      }
    }
    return disabledSeconds;
  }

  save(value: any) {
    this.i.id = this.i.id || '';
    if (this.i.id !== '') {
      value.energyPriceId = this.i.id;
      value.unitSymbol = this.i.unitSymbol;
    } else {
      value.energyPriceId = null;
    }
    let item;
    if(this.isPeakValley) {
      item = {
        id: this.i.id,
        plantCode: this.i.plantCode,
        energyType: this.i.energyType,
        planType: this.i.planType,
        unitSymbol: this.i.unitSymbol,
        price: this.i.priceResult,
        rateNumber: this.i.rateNumber,
        startTime: this.startTime.toTimeString().split(" ")[0],
        endTime: this.endTime.toTimeString().split(" ")[0]
      };
    }else {
      item = {
        id: this.i.id,
        plantCode: this.i.plantCode,
        energyType: this.i.energyType,
        planType: this.i.planType,
        unitSymbol: this.i.unitSymbol,
        price: this.i.priceResult,
        rateNumber: '',
        startTime: '',
        endTime: ''
      }
    }
    this.queryService.SaveEnergyPriceItem(item).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
  }

  changeEndTime() {
    let fromHour: number = this.startTime.getHours();
    let endHour: number = this.endTime.getHours();
    let fromMinute: number = this.startTime.getMinutes();
    let fromSecond: number = this.startTime.getSeconds();
    let endMinute: number = this.endTime.getMinutes();
    let endSecond: number = this.endTime.getSeconds();
    if(fromHour > endHour ||
      (fromHour == endHour && fromMinute > endMinute) ||
      (fromHour == endHour && fromMinute == endMinute && fromSecond > endSecond)) {
        this.endTime = this.startTime;
      }
    
    console.log(`startTime: ${this.startTime.toTimeString().split(" ")[0]}`);
  }
}
