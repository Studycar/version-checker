import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'custom-calendar',
  templateUrl: './custom-calendar.component.html',
  styles: [`
  .container{
    position: relative;
    width: 100%;
  }
  
  .container_action{
    /*width: 160px;*/
    width: 200px;
    display: inline-block;
    text-align: right;
    float: right;
  }

  .action_a{
    display: inline-block;
    height: 14px;
  }

  .action {
    height: 35px;
  }

  .action .span_year {
    display: inline-block;
    /*width: 80px;*/
    width: 90px;
  }

  .action .span_month {
    display: inline-block;
    /*width: 65px;*/
    width: 75px;
  }

  .action .year {
    display: inline-block;
    width: 15px;
    padding: 0px auto;
    font-weight: bolder;
  }

  .table {
    position: relative;
    margin: 5px auto;
    border-collapse: collapse;
    /* font-size: 12px; */
    width: 100%;
  }

  .table tr{
    width: 100%;
  }

  .table tr th {
    width: 14.2%;
    text-align: center;
    font-weight: bolder;
    border: 1px solid rgba(0,0,0,0.06); 
    padding: 0px;
    margin: 0px;
    height: 28px;
  }

  .table tr th div {
    width: 98%;
  }

  .table tr .workday {
    background-color: lightgoldenrodyellow;
  }

  .table tr td {
    width: 14.2%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border: 1px solid rgba(0,0,0,0.06); // #0094ff
    padding: 0px;
    margin: 0px;
  }

  .date_container {
    position: relative;
    width: 98%;
    margin: 0px auto;
  }

  .date_container:hover {
    background-color: #E6F4FB; // #1E90FF
    color:white;
  }

  .current_day{
    background-color: rgb(129, 225, 183);
    color:white;
  }

  .not_current_month {
    background-color: rgb(247, 247, 247);
  }

  .date_title {
    text-align: center;
    font-weight: bolder;
    height: 15px;
    margin: 2px auto;
    cursor: pointer;
    width: 100%;
  }

  .date_content {
    text-align: left;
    width: 100%;
    overflow: hidden;
  }

  .date_content ul {
    list-style: none;
    line-height: 1.5;
    margin: 0px auto;
    padding: 0px;
    width: 155px;
  /*   min-width: 150px;
    max-width: 175px; */
    overflow-y: auto;
    overflow-x: hidden;
  }

  .date_content ul li {
    padding: 0px 1px 0px 2px;
    margin: 0px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  ` ]
})
export class CustomCalendarComponent implements OnInit, OnChanges {
  public yearOptions: any[] = [{ value: 2018, label: 2018 }]; // 年份
  private yearCount = 10; // 设置年份个数yearCount+1
  public monthOptions: any[] = [
    { value: '01', label: '01' },
    { value: '02', label: '02' },
    { value: '03', label: '03' },
    { value: '04', label: '04' },
    { value: '05', label: '05' },
    { value: '06', label: '06' },
    { value: '07', label: '07' },
    { value: '08', label: '08' },
    { value: '09', label: '09' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
  ]; // 月份
  public weekOptions: any[] = [
    { index: '0', title: '周日', isWorkDay: false },
    { index: '1', title: '周一', isWorkDay: true },
    { index: '2', title: '周二', isWorkDay: true },
    { index: '3', title: '周三', isWorkDay: true },
    { index: '4', title: '周四', isWorkDay: true },
    { index: '5', title: '周五', isWorkDay: true },
    { index: '6', title: '周六', isWorkDay: false },
  ]; // 周别定义
  public calendarDates: CalendarDateObject[] = []; // 日历展示的日期对象数组
  private currentTime = new Date(); // 当前时间
  public year = this.currentTime.getFullYear(); // 当前年份yyyy
  public month = this.getMonthNum(this.currentTime); // 当前月份mm
  public day = this.getDayNum(this.currentTime); // 当前日dd
  public currentday = this.year + '-' + this.month + '-' + this.day; // 当前日yyyy-mm-dd
  private currentDate = new Date(this.currentday); // 当前日期
  private firtDate = this.getMonthFirstDate(this.currentDate); // 当月第一天
  private lastDate = this.getMonthLastDate(this.currentDate); // 当月最后一天
  private weekCount = this.getCaledarDates(this.currentDate); // 周数
  public weeks: number[] = []; // 周数组，第一周为0
  private liHeight: number = 19.5; // 每一个li元素的高度

  @Input() public queryParams: any; // 查询参数对象
  @Input() public minDateField = 'calendarDayMin'; // 最小日期字段名称
  @Input() public maxDateField = 'calendarDayMax'; // 最大日期字段名称
  @Input() public data: any[] = []; // 查询数据集合
  @Input() public dataKeyField = 'id'; // 数据项ID标识

  // @Input() public showSelect = false; // 年月切换
  @Input() public showSelect = true; // 年月切换

  @Input() set height(tableHeight: number) {
    this.tableHeight = tableHeight;
    this.tdContentHeight = this.getTdContentHeight();
  }
  get height(): number {
    return this.tableHeight;
  }
  public tableHeight = document.body.clientHeight - 290 - 30; // 由外层传入. 默认margin-top:290,margin-bottom:30;
  private thHeight = 30; // 表头高度： 28+2(边框)
  private tdTitleHeight = 19; // td头部高度：15+4(margin)
  private externHeiht = 20; // 额外高度：20
  public tdContentHeight = this.getTdContentHeight();

  @Output() public selectEvent = new EventEmitter<any>(); // 切换年月触发
  @Output() public clickEvent = new EventEmitter<any>(); // 点击日期单元格触发
  @Output() public checkEvent = new EventEmitter<any>(); // 点击checkbox触发
  public checked = false;
  constructor(
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit() {
    // 获取周数组
    this.getWeeks();
    // 设置参数
    this.setParams();
    // 初始化高度
    this.height = this.height - this.selectHeight + 14;
  }
  // 展开/收起 年月切换
  /*public expandSelect() {
    this.showSelect = !this.showSelect;
    this.resetHeight();
  }*/

  public selectHeight = 35; // 年月选择高度
  /* 重设height */
  /*private resetHeight() {
    if (this.showSelect) {
      this.height = this.height - this.selectHeight;
    } else {
      this.height = this.height + this.selectHeight;
    }
  }*/

  // 设置当前年月（外部调用）
  public setYearMonth(year: number, month: string) {
    this.year = year;
    this.month = month;
    this.ymChange(year + '-' + month);
  }
  // 计算td content高度
  private getTdContentHeight(lisHeight: number = 0): number {
    return ((this.tableHeight - this.thHeight - this.externHeiht) / this.weekCount) - this.tdTitleHeight + lisHeight;
  }
  // 年份/月份切换
  public ymChange(input: any) {
    if (input !== undefined && input !== null) {
      const date = new Date(this.year + '-' + this.month);
      this.weekCount = this.getCaledarDates(date);
      this.getWeeks();
      this.setParams();
      this.tdContentHeight = this.getTdContentHeight();
      this.selectEvent.emit({ year: this.year, month: this.month });
    }
  }
  // 选中月份
  selectMonth = new Date();
  // 月份下拉选择
  public ymCalendarSelect(event) {
    console.log(event);
    this.year = this.getYearNum(event);
    this.month = this.getMonthNum(event);
    this.ymChange(event);
  }
  // 日期单元格点击
  public cellClick(date: CalendarDateObject) {
    // 单元格日期字符串
    this.clickEvent.emit(date.ymd);
  }
  // 日期单元格checkbox勾选
  public cellCheck(event: any, item: any) {
    // ID
    this.checkEvent.emit({ checked: event.srcElement.checked, id: item[this.dataKeyField] });
  }
  // 设置参数，用于外层调用
  private setParams() {
    if (this.queryParams !== undefined && this.queryParams != null) {
      this.queryParams.values[this.minDateField] = this.calendarDates[0].ymd + " 00:00:00";
      this.queryParams.values[this.maxDateField] = this.calendarDates[this.calendarDates.length - 1].ymd + " 00:00:00";
    }
  }
  // 查找单元格数据项（组件移植时需重写）
  public cellDataFind(date: CalendarDateObject): any[] {
    const result = [];
    if (date !== undefined) {
      this.data.forEach(x => { if (x.showCalendarDay === date.ymd) { x.checked = x.enableFlag === 'Y' ? true : false; result.push(x); } });
    }
    this.tdContentHeight = this.getTdContentHeight(this.liHeight*result.length); // 动态改变ul高度
    return result;
  }
  // 获取单元格显示内容（组件移植时需重写）
  public getCellContent(item: any): string {
    if (item !== undefined && item !== null && item.showStartTime !== undefined) {
      return item.shiftIntervalName + ' [ ' + item.showStartTime.substr(0, 5) + '-' + item.showEndTime.substr(0, 5) + ' ]';
    } else {
      return '';
    }
  }
  // 计算日历展示的日期（传入参数为选择的月份或当前日期）
  public getCaledarDates(input: Date): number {
    this.firtDate = this.getMonthFirstDate(input);
    this.lastDate = this.getMonthLastDate(input);
    const firstWeekday = this.firtDate.getDay(); // 第一天周几（周日为0、周一为1 以此类推）
    const lastWeekday = this.lastDate.getDay(); // 最后一天周几
    this.calendarDates.length = 0; // 清空
    this.yearOptions.length = 0;
    // 年份生成
    for (let i = this.yearCount / 2; i > 0; i--) {
      this.yearOptions.push({ value: (this.firtDate.getFullYear() - i), label: (this.firtDate.getFullYear() - i) });
    }
    for (let i = 0; i <= this.yearCount / 2; i++) {
      this.yearOptions.push({ value: (this.firtDate.getFullYear() + i), label: (this.firtDate.getFullYear() + i) });
    }
    // 前一月日期
    for (let i = firstWeekday; i > 0; i--) {
      const t = new Date(this.firtDate.getTime() - i * 24 * 60 * 60 * 1000);
      const it = { date: t, day: this.getDayNum(t), month: this.getMonthNum(t), year: t.getFullYear(), isCurrentMonth: false, isCurrentDay: false, ymd: '' };
      it.ymd = it.year + '-' + it.month + '-' + it.day;
      this.calendarDates.push(it);
    }
    // 当前月日期
    for (let i = 0; i <= this.lastDate.getDate() - this.firtDate.getDate(); i++) {
      const t = new Date(this.firtDate.getTime() + i * 24 * 60 * 60 * 1000);
      const it = { date: t, day: this.getDayNum(t), month: this.getMonthNum(t), year: t.getFullYear(), isCurrentMonth: true, isCurrentDay: false, ymd: '' };
      it.ymd = it.year + '-' + it.month + '-' + it.day;
      it.isCurrentDay = it.ymd === this.currentday ? true : false;
      this.calendarDates.push(it);
    }
    // 下一月日期
    for (let i = 1; i <= 6 - lastWeekday; i++) {
      const t = new Date(this.lastDate.getTime() + i * 24 * 60 * 60 * 1000);
      const it = { date: t, day: this.getDayNum(t), month: this.getMonthNum(t), year: t.getFullYear(), isCurrentMonth: false, isCurrentDay: false, ymd: '' };
      it.ymd = it.year + '-' + it.month + '-' + it.day;
      this.calendarDates.push(it);
    }
    return this.calendarDates.length / 7;
  }
  // 获取周数组[0,1,2,3,4]
  public getWeeks() {
    this.weeks.length = 0;
    for (let i = 0; i < this.weekCount; i++) {
      this.weeks.push(i);
    }
  }
  // 获取日期日数字
  public getDayNum(input: Date): string {
    const dayNum = input.getDate();
    return dayNum.toString().length === 1 ? '0' + dayNum.toString() : dayNum.toString();
  }
  // 获取日期月份数字
  public getMonthNum(input: Date): string {
    const monthNum = input.getMonth() + 1;
    return monthNum.toString().length === 1 ? '0' + monthNum.toString() : monthNum.toString(); // 当前月份
  }
  // 获取日期年份数字
  public getYearNum(input: Date): number {
    const yearNum = input.getFullYear();
    return yearNum; // 当前年份
  }
  // 传入日期返回当月第一天
  public getMonthFirstDate(input: Date): Date {
    const date = new Date(input);
    return new Date(date.setDate(1));
  }

  // 传入日期返回当月最后一天
  public getMonthLastDate(input: Date): Date {
    const date = new Date(input);
    const firstDate = this.getMonthFirstDate(date); // 当月第一天
    return new Date(new Date(firstDate.setMonth(firstDate.getMonth() + 1)).setDate(0));
  }
}

export class CalendarDateObject {
  date: Date;
  day: string;
  month: string;
  year: number;
  ymd: string;
  isCurrentMonth: boolean; // 当月标识
  isCurrentDay: boolean; // 当天标识
}
