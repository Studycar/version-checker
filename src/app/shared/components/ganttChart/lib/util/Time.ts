import * as Moment from 'moment';
import { Util } from '@shared/components/ganttChart/lib/util/Util';

export class Time {
  private util: Util;

  private startTime: number;
  private timeFormat: string;
  private startDate: Date;
  private endDate: Date;
  private timeInf: TimeInf;
  private dates: Dates;

  constructor(util: Util) {
    this.util = util;
  }

  public init(timeRang: string, timeFormat: string) {
    this.processDate(timeRang);
    this.processTimeFormat(timeFormat);
    this.dates = this.calculateDates(this.startDate, this.endDate, this.timeInf.timeType);
  }

  public processDate(timeRang: string): void {
    const tr: string[] = timeRang.split('-');
    this.startDate = new Date(tr[0]);
    this.endDate = new Date(tr[1]);
    this.startTime = new Date(this.startDate).getTime();
  }

  public processTimeFormat(tf: string): void {
    this.timeFormat = tf;
    const timeNum: number = Number(tf.slice(0, -1));
    const timeType: string = tf.slice(-1);
    const timeSize: number = timeType === 'd' ? 1 : 24;
    this.timeInf = { timeNum, timeType, timeSize, timeFormat: tf };
  }


  public getStartTime() {
    return this.startTime;
  }

  public getTimeFromStart() {

  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public getEndDate(): Date {
    return this.endDate;
  }

  public getDates(): Dates {
    return this.dates;
  }

  public getTimeInf(): TimeInf {
    return this.timeInf;
  }

  /**
   * 获取X轴时间数组
   * @param startDate 开始时间
   * @param length 持续时间(h,w,m, h会将时间转为小时，w,m都是转换为天)
   * @param type 类型 d, h
   */
  public calculateDates(startDate: Date, endDate: Date, type: string, length?: string): Dates {
    let lengthPattern = false;
    if (!endDate) {
      length = length || '2w';
      lengthPattern = true;
      var typeStr = length.slice(-1);
      var len = length.slice(0, -1);
    }
    if (!startDate) {
      console.log('开始日期必传');
    }

    let d, m, y, bfDate, bfEDate;
    endDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);

    startDate = new Date(startDate);
    bfDate = new Date(startDate);

    d = startDate.getDate();
    m = startDate.getMonth();
    y = startDate.getFullYear();

    if (!lengthPattern) {
      endDate = new Date(endDate);
      bfEDate = new Date(endDate);
      return getDateArr(d, m, y, bfDate, lengthPattern, type, bfEDate);
    }

    return getDateArr(d, m, y, bfDate, len, typeStr);

    // 获取天格式
    function getDateArr(d, m, y, bfDate, len, type, bfEDate?): Dates {
      let endDay, endDate, dd;
      let str = '-';
      let dateArr = [];
      let hourArr = [];
      let weekStr = ['日', '一', '二', '三', '四', '五', '六'];
      let fullDate = [];
      let weekStrEn = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
      let dayMs = 24 * 60 * 60 * 1000;
      let weekArr = [];
      let w = bfDate.getDay();

      function getHour() {
        for (let i = 0; i < 24; i++) {
          hourArr.push(`${i > 9 ? i : '0' + i}:00-${(i + 1) > 9 ? (i + 1) : '0' + (i + 1)}:00`);
        }
      }

      if (!len) {
        let i = 0;
        dd = new Date(startDate);
        while (dd.getTime() < bfEDate.getTime()) {
          dateArr.push(dd.toLocaleDateString().slice(5));
          weekArr.push(weekStr[dd.getDay()]);
          fullDate.push(Moment(dd).format('YYYY-MM-DD'));
          i++;
          dd = new Date(startDate.getTime() + dayMs * i);
        }
        if (type === 'h') {
          getHour();
        }
      } else {
        // 按月获取
        if (type === 'm') {
          for (var j = 0; j < len; j++) {
            if (m > 11) {
              y += 1;
              bfDate.setFullYear(y);
              m = 0;
              bfDate.setMonth(m);

            }
            bfDate.setDate(0);
            endDay = (new Date(y, m + 1, 0)).getDate();
            m += 1;
            for (; d <= endDay; d++, w++) {
              if (w > 6) w = 0;
              dd = m + str + (d > 9 ? d : '0' + d);
              dateArr.push(dd);
              weekArr.push(weekStr[w]);
              fullDate.push(Moment(dd).format('YYYY-MM-DD'));
            }
            if (d >= endDay) {
              d = 1;
            }
          }
          // 按周获取
        } else if (type === 'w') {
          len *= 7;
          endDay = (new Date(y, m + 1, 0)).getDate();
          for (let l = 0; l < len; l++, w++, d++) {
            if (w > 6) w = 0;
            dd = (m + 1) + str + d;
            dateArr.push(dd);
            weekArr.push(weekStr[w]);
            fullDate.push(Moment(dd).format('YYYY-MM-DD'));
            if (d >= endDay) {
              m += 1;
              if (m > 11) m = 0;
              d = 0;
              endDay = (new Date(y, m + 1, 0)).getDate();
            }
          }

        } else if (type === 't') {
          endDate = new Date(y, m + (len - 0), d);
          endDay = (new Date(y, m + 1, 0)).getDate();
          len = (endDate.setHours(0, 0, 0, 0) - new Date(bfDate).setHours(0, 0, 0, 0)) / (24 * 60 * 60 * 1000);
          for (let l = 0; l < len; l++, w++, d++) {
            if (w > 6) w = 0;
            dd = (m + 1) + str + d;
            dateArr.push(dd);
            weekArr.push(weekStr[w]);
            fullDate.push(Moment(dd).format('YYYY-MM-DD'));
            if (d >= endDay) {
              m += 1;
              if (m > 11) m = 0;
              d = 0;
              endDay = (new Date(y, m + 1, 0)).getDate();
            }
          }
        }
      }

      return {
        date: dateArr,
        week: weekArr,
        hour: hourArr,
        fullDate,
      };
    }
  }
}

export interface TimeInf {
  timeNum: number;
  timeType: string;
  timeSize: number;
  timeFormat: string;
}

export interface Dates {
  date: any[];
  week: any[];
  hour: any[];
  fullDate: any[];
}
