import { Component, Input, Output, OnInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './app-calendar.component.html',
  styleUrls: ['./app-calendar.component.less']
})
export class AppCalendarComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() data: Array<{date: string, [key: string]: any}> = [];
  @Output() clickEvent = new EventEmitter<any>();
  @Output() selectEvent = new EventEmitter<{year: number, month: number}>();

  selectMonth = new Date();
  weekLists = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  dateLists: any[] = [];

  ngOnInit() {
    this.initDateLists();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.currentValue.length > 0) {
      this.initDateLists();
    }
  }

  initDateLists() {
    this.dateLists.length = 0;
    const year = this.selectMonth.getFullYear();
    const month = this.selectMonth.getMonth();
    const firstDayWeek = new Date(year, month).getDay();
    const monthDays = new Date(year, month + 1, 0).getDate();
    const lastDayWeek = new Date(year, month + 1, 0).getDay();
    for (let i = 0; i < firstDayWeek; i++) {
      this.dateLists.push({
        text: '',
        day: ''
      });
    }
    for (let i = 1; i <= monthDays; i++) {
      const text = `${year}-${month + 1}-${i}`;
      const findItem = this.data.find(item => new Date(item.date).toDateString() === new Date(text).toDateString());
      if (findItem) {
        this.dateLists.push({
          text: `${year}-${month + 1}-${i}`,
          day: i,
          checked: findItem.enableFlag === 'Y'
        });
      } else {
        this.dateLists.push({
          text: `${year}-${month + 1}-${i}`,
          day: i,
          checked: false
        });
      }
    }
    for (let i = 0; i < 6 - lastDayWeek; i++) {
      this.dateLists.push({
        text: '',
        day: ''
      });
    }
  }

  onSelectMonthChange(date: Date) {
    this.initDateLists();
    this.selectEvent.emit({year: date.getFullYear(), month: date.getMonth() + 1});
  }

  cellClick(item: any) {
    if (item.text === '') return;
    item.checked = !item.checked;
    this.clickEvent.emit(item);
  }
}
