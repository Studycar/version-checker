import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { PlantCalendarService } from '../plant-calendar.service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'plant-calendar-detail',
  templateUrl: './detail.component.html',
  providers: [PlantCalendarService]
})
export class PlantCalendarDetailComponent implements OnInit {

  constructor(
    private msgSrv: NzMessageService,
    private appTranslateService: AppTranslationService,
    private commonQueryService: CommonQueryService,
    private queryService: PlantCalendarService,
  ) { }

  plantCode: string;
  plantDesc: string;
  startDate: string;
  endDate: string;

  calendarData: any[] = [];
  currentYearMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;

  ngOnInit() {
    this.query(this.currentYearMonth);
  }

  query(yearMonth: string) {
    this.queryService.queryPlantCalendarDetail(this.plantCode, yearMonth).subscribe(res => {
      res.data.forEach(item => {
        item.date = item.calendarDate.split(' ')[0];
      });
      this.calendarData = res.data;
    });
  }

  onSelectYearMonthChange(data: { year: any, month: any }) {
    const queryStr = `${data.year}-${data.month}`;
    this.query(queryStr);
  }

  onCellCalendarValueChange(data: any) {
    const date = this.calendarData.find(item => new Date(item.date).toDateString() === new Date(data.text).toDateString());
    const cellCalendarDate = date ? date.calendarDate : data.text;
    const enableFlag = data.checked ? 'Y' : 'N';
    this.queryService.savePlantCalendarDetail(this.plantCode, this.commonQueryService.formatDate(cellCalendarDate), enableFlag).subscribe(res => {
      if (res.code ===200) {
        this.msgSrv.success(this.appTranslateService.translate('变更成功！'));
      } else {
        data.checked = !data.checked;
        this.msgSrv.error(this.appTranslateService.translate(res.msg));
      }
    });
  }
}
