import { Component, Input, OnInit } from "@angular/core";
import { QueryService } from "../query.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService } from "ng-zorro-antd";

@Component({
  selector: 'middle-block',
  template: `
    <div class="middle-wrapper">
      <div class="gauge-charts">
        <gauge-charts class="charts-item"
          name="left"
          [title]="warnConditionName[0]"
          [chartsData]="chartLeftData"
          [warningFlag]="gaugeWarningFlag">
        </gauge-charts>
        <gauge-charts class="charts-item"
          name="right"
          [title]="warnConditionName[1]"
          [chartsData]="chartRightData">
        </gauge-charts>
      </div>  
      <div class="bar-charts">
        <bar-charts
          name="bottom"
          [chartsData]="chartBottomData"
          [warningFlag]="barWarningFlag"
        ></bar-charts>
      </div>
    </div>
  `,
  styles: [`
    .middle-wrapper {
      height: 100%;
      padding: 5px;
    }
    .middle-wrapper .charts-item {
      width: 50%;
      height: 100%;
    }
    .gauge-charts {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70%;
    }
    .bar-charts {
      height: 100px;
    }
  `],
  providers: [QueryService],
})
export class MiddleBlockComponent implements OnInit {
  @Input() item: any;

  warnConditionName = ['', ''];
  chartLeftData: any;
  chartRightData: any;
  chartBottomData: any;
  gaugeWarningFlag = false;
  barWarningFlag = false;

  constructor(
    private appTranslationService: AppTranslationService,
    private msgSrv: NzMessageService,
    private appConfigService: AppConfigService,
    private queryService: QueryService,
  ) {
  }
  ngOnInit() {
    this.init();
  }

  init() {
    const nameArr = this.item.warnConditionDesc.split(/[<|>]/);
    this.warnConditionName = [...nameArr];
    this.chartLeftData = {
      value: this.item.orderProgress,
      unit: this.item.warnProject !== 'ORD_CHK_SUM_G' ? '%' : ''
    };
    this.chartRightData = {
      value: this.item.transferProgress,
      unit: this.item.warnProject !== 'ORD_CHK_SUM_G' ? '%' : ''
    };
    this.gaugeWarningFlag = Number(this.item.totalWarnDays) > 0;
    this.barWarningFlag = Number(this.item.totalWarnDays) > Number(this.item.warnUpgradeDays);
    this.chartBottomData = {
      value: this.item.totalWarnDays
    };
  }
}