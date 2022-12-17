import { X } from '@shared/components/ganttChart/lib/util/X';
import { Dom } from '@shared/components/ganttChart/lib/util/Dom';
import { Y } from '@shared/components/ganttChart/lib/util/Y';
import { Time } from '@shared/components/ganttChart/lib/util/Time';
import { TextController } from '@shared/components/ganttChart/lib/util/Text';

export class Util {

  public x: X = new X(this);
  public y: Y = new Y(this);
  public dom: Dom = new Dom(this);
  public time: Time = new Time(this);
  public text: TextController = new TextController(this);
  public lazyLoad = true;

  public hex2decimal(hex, alpha = .2) {
    hex = hex.replace('#', '').toLocaleUpperCase();
    let decArr = [];
    let color = 'rgb(0,0,0)';
    for (let s = 0, len = hex.length; s < len; s += 2) {
      let val = hex.substr(s, 2);
      decArr.push(h2d(val));
    }
    if (!isNaN(alpha)) {
      color = `rgba(${decArr.join(',')},${alpha})`;
    } else {
      color = `rgb(${decArr.join(',')})`;
    }
    return color;

    function h2d(val) {
      val = val.split('');
      let num = 0;
      for (let i = 0, len = val.length; i < len; i++) {
        let dval = isNaN(val[i]) ? (val[i].charCodeAt() - 55) : val[i];
        num += dval * Math.pow(16, len - 1 - i);
      }
      return num;
    }
  }

}
