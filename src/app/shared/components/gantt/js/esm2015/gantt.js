/**
 * 1.按下shift键,筛选出覆盖的工单
 */

import Konva from 'konva';
import Moment from 'moment';
import ResizeObserver from 'resize-observer-polyfill';
import Mutation, { odf } from '../observer/Mutation';
import Observer from '../observer/Observer';
import Subject from '../observer/Subject';
// 渐变值
const gradientVal = .2;

let toString = Object.prototype.toString;
// 辅助函数:公共方法和方法定义
let util = {
  //扩展，首参传ture则为深扩展,参数基本与jq.extend一致
  extend() {
    let args = [].slice.call(arguments);

    if (typeof args[0] === 'boolean' && args[0]) {
      args = args.splice(1);
      let source = args[0];
      // 存储链式中的父元素，避免循环引用;
      let parentArr = [source];
      let isEqual = function(target) {
        let l = parentArr.length;
        while (l--) {
          if (parentArr[l] === target) return true;
        }
        return false;
      };

      for (let i = 1, ii = args.length; i < ii; i++) {
        recursion(source, args[i]);
      }

      return source;

      function recursion(sr, ex) {
        let type = undefined;
        if (ex === undefined) return;
        // 存储每一个元素
        parentArr.push(ex);
        if (util.isArray(ex)) {
          for (let i = 0, ii = ex.length; i < ii; i++) {
            if (ex.hasOwnProperty(i)) {
              if (type = isRefType(ex[i])) {
                if (sr[i] === undefined) {
                  if (type === 'object') {
                    sr[i] = {};
                  } else {
                    sr[i] = [];
                  }
                }
                if (isEqual(ex[i])) {
                  sr[i] = Object.assign([], ex[i]);
                  continue;
                }
                recursion(sr[i], ex[i]);
              } else {
                sr[i] = ex[i];
              }
            }
          }
        } else {
          for (let key in ex) {
            if (ex.hasOwnProperty(key)) {
              if (type = isRefType(ex[key])) {
                if (sr[key] === undefined) {
                  if (type === 'object') {
                    sr[key] = {};
                  } else {
                    sr[key] = [];
                  }
                }
                if (isEqual(ex[key])) {
                  sr[key] = Object.assign({}, ex[key]);
                  continue;
                }
                recursion(sr[key], ex[key]);
              } else {
                sr[key] = ex[key];
              }
            }
          }
        }
      }

      function isRefType(obj) {
        if (util.isObject(obj)) return 'object';
        if (util.isArray(obj)) return 'array';
        return false;
      }

    } else {
      return Object.assign.apply(null, args);
    }
  },
  createDom(params) {
    let dom = document.createElement('div');
    dom.style.cssText = [
      `width:${params && params.width || 1}px`,
      `height:${params && params.height || 1}px`,
      'background-color:transparent',
      'visibility:hidden',
      'position:absolute',
      'left：0',
      'top:0',
    ].join(';') + ';';
    return dom;
  },
  createTooltip(overOrder = false) {
    let dom = document.createElement('div');
    let span = document.createElement('span');
    let content = document.createElement('div');
    dom.setAttribute('class', 'tooltip');
    if (overOrder) {
      dom.style.cssText = [
        'overflow-y:auto',
        'max-height:200px',
      ].join(';') + ';';
    }

    span.setAttribute('class', 'arrow');
    content.setAttribute('class', 'content');
    dom.appendChild(span);
    dom.appendChild(content);
    return dom;
  },
  createLoadDom(params) {
    let dom = document.createElement('div');
    let shadowDom = document.createElement('div');
    let loading = document.createElement('div');
    let text = document.createElement('span');
    dom.style.cssText = [
      `width:${params.width}px`,
      `height: 100%`,
      'text-align:center',
      'position:absolute',
      'top:0',
      'left:0',
      'z-index:9999',
      'display:none',
    ].join(';') + ';';
    shadowDom.style.cssText = [
      'width:100%',
      'height:100%',
      'background-color:rgba(0,0,0,.7)',
    ].join(';') + ';';
    loading.style.cssText = [
      'width:50px',
      'height:50px',
      'background-color:#fff',
      'position:absolute',
      'top:50%',
      'left:50%',
      'border-radius:10px',
      'animation: spin 1s linear infinite',
    ].join(';') + ';';
    text.style.cssText = [
      'width:50px',
      'height:50px',
      'text-align:center',
      'color:#138FB2',
      'font-family:Roboto, helvetica, arial, sans-serif',
      'font-weight:400',
      'position:absolute',
      'top:50%',
      'left:50%',
      'font-size:12px',
      'line-height:50px',
    ].join(';') + ';';
    text.innerText = 'Loading';
    dom.appendChild(shadowDom);
    dom.appendChild(loading);
    dom.appendChild(text);
    return dom;
  },
  /**
   * 获取X轴时间
   * @param startDate 开始时间
   * @param length 持续时间(h,w,m, h会将时间转为小时，w,m都是转换为天)
   * @param type 类型 day, hour
   */
  calculateDate(startDate, endDate, type, length) {
    var lengthPattern = false;
    if (!endDate) {
      length = length || '2w';
      lengthPattern = true;
      var typeStr = length.slice(-1);
      var len = length.slice(0, -1);
    }
    if (!startDate) {
      console.log('开始日期必传');
    }

    var h, d, m, y, bfDate, bfEDate;
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
    function getDateArr(d, m, y, bfDate, len, type, bfEDate) {
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
        for (var i = 0; i < 24; i++) {
          hourArr.push(`${i > 9 ? i : '0' + i}:00-${(i + 1) > 9 ? (i + 1) : '0' + (i + 1)}:00`);
        }
      }

      if (!len) {
        var i = 0;
        dd = new Date(startDate);
        while (dd.getTime() < bfEDate.getTime()) {
          dateArr.push(dd.toLocaleDateString().slice(5));
          weekArr.push(weekStr[dd.getDay()]);
          fullDate.push(Moment(dd).format('YYYY-MM-DD'));
          i++;
          dd = new Date(startDate.getTime() + dayMs * i);
        }
        if (type === 'hour') {
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
          for (var l = 0; l < len; l++, w++, d++) {
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
          for (var l = 0; l < len; l++, w++, d++) {
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

    //获取小时格式
    function getHourArr() {

    }

  },
  /**
   *  防抖操作
   * @param fn  回调
   * @param wait 防抖时间
   * @param immediately 是否立即执行
   * @return {Function}  返回封装过的函数
   */
  debounce(fn, wait, immediately) {
    var timeID;
    return function() {
      var me = this;
      var args = [].slice.call(arguments, 0);
      if (immediately) {
        fn.apply(me, args);
        return;
      }
      var later = function() {
        fn.apply(me, args);
      };
      if (typeof wait === 'number') {
        clearTimeout(timeID);
        timeID = setTimeout(later, wait);
      } else {
        cancelAnimationFrame(timeID);
        timeID = requestAnimationFrame(later);
      }
    };
  },
  isArray(arr) {
    return toString.call(arr) === '[object Array]';
  },
  isObject(obj) {
    return toString.call(obj) === '[object Object]';
  },
  isFunction(fn) {
    return toString.call(fn) === '[object Function]';
  },
  /**
   * 存参数和临时变量
   */
  getStore: (function() {
    var store = null;
    return function() {
      if (store) return store;

      function Store() {

      }

      var storeMethod = {
        set(name, value, referModel = false) {
          if (!referModel && this[name] && util.isObject(value)) {
            this[name] = util.extend(true, {}, this[name], value);
          } else if (!referModel && this[name]) {
            if (util.isObject(value)) {
              let keys = Object.keys(value);
              for (let key = 0, len = keys.length; key < len; key++) {
                this[name][key] = value[key];
              }
            } else {
              this[name] = value;
            }
          } else {
            this[name] = value;
          }
        },
        get(name) {
          if (this[name]) return this[name];
          return false;
        },
        clear(name) {
          delete this[name];
          return this;
        },
        clearAll() {
          for (var name in this) {
            this.clear(name);
          }
        },
        reset() {
          for (var name in this) {
            let initName = ['wh', 'stage', 'scrollDiv', 'tooltip', 'timeFormat', 'selectedCells', 'selectedYaxis', 'overWorkorderTooltip', 'fakeDom', 'mdk'];
            if (!~initName.indexOf(name)) {
              this.clear(name);
            }
          }
        },
        init(name, value) {
          this.clear(name);
          this.set(name, value);
        },
      };

      util.extend(Store.prototype, storeMethod);

      store = new Store();
      return store;
    };

  })(),
  getX: {
    start: 0, // 开始时间
    min: 1440, // 天/分钟
    baseXFromMin: 0, // 时间格式下的每分钟width
    xaxisX: 0, // X轴起点
    /**
     * 设置开始时间
     * @param s
     */
    setStart: function(s) {
      this.start = new Date(s).getTime();
    },
    /**
     * 设置规定时间格式下每分钟的宽度
     * @param w
     */
    setBaseXFromMin: function(w) {
      this.baseXFromMin = w / this.min;
    },
    /**
     *
     * @param type
     */
    setMin(type) {
      if (type === 'h') {
        this.min = 60;
      } else if (type === 'd') {
        this.min = 1440;
      }
    },
    /**
     * 宽度返回秒数
     * @param x
     * @return {number}
     */
    transformX2Millisecond: function(x) {
      return x / this.baseXFromMin * 60 * 1000;
    },
    /**
     * 根据x轴位置返回与开始时间相差的毫秒数
     * @param x
     * @return {number}
     */
    timeFromXaxis: function(x) {
      return (x - this.xaxisX) / this.baseXFromMin * 60 * 1000;
    },
    /**
     * 给与毫秒数返回对应的时间毫秒数
     * @param time
     * @return {*}
     */
    getNewDate(time) {
      return time + this.start;
    },
    /**
     * 开始时间与某个时间差的宽度
     * @param time
     * @return {number}
     */
    fromTime: function(time) {
      return +this.getWidth(this.start, time);
    },
    /**
     * 2个时间差之间的宽度
     * @param startDate
     * @param endData
     * @return {number}
     */
    getWidth: function(startDate, endData) {
      return +(((new Date(endData).getTime() - new Date(startDate).getTime()) / 60 / 1000) * this.baseXFromMin).toFixed(2);
    },
    getFullDate: function(x) {
      const cells = store.get('xaxis').dealt.dealtCellData;
      for (let i = 0, ii = cells.length; i < ii; i++) {
        const cell = cells[i];
        if (x > cell.x && x < (Number(cell.x) + Number(cell.width))) {
          return cell.fullDate;
        }
      }
      return null;
    },
  },
  //Y轴生产线映射
  yMap: {
    pool: {},
    setPool: function(name, val) {
      this.pool[name] = val;
    },
    getY: function(name) {
      if (this.pool[name] && this.pool[name].start !== undefined) {
        return this.pool[name].start;
      }
      return false;
    },
    getName: function(y) {
      for (let key in this.pool) {
        let pl = this.pool[key];
        if (y > pl.start && y < pl.start + pl.height) return key;
      }
      return null;
    },
    clear: function() {
      this.pool = {};
    },
  },
  /**
   * 时间间隔宽度计算
   * @param layerWidth 层级宽
   * @param interval 分割数
   * @returns {{width: number | *, surplus: number|*}}  wdith:间隔宽,surplus:盈余空间
   */
  calculateWidth(layerWidth, interval) {
    let width, surplus;

    width = Math.floor(layerWidth / interval);
    surplus = layerWidth - interval * width; //剩余的宽度，因为间隔宽度向下取整，所以计算的总宽度肯定会小于图层宽
    return {
      width,
      surplus,
    };
  },
  /**
   * 继承方法
   * @param parentClass 父类
   * @param [object] childMethods 子类方法,constructor方法可初始化构造函数
   * @returns {childClass}
   */
  fakeExtend(parentClass, childMethods) {
    // 继承属性，初始化构造函数
    let childClass = function(...args) {
      parentClass.apply(this, args);
      if (childMethods.constructor) childMethods.constructor.apply(this, args);
    };

    // 继承方法
    let F = function() {
    };
    F.prototype = parentClass.prototype;
    childClass.prototype = new F();
    for (let methodName in childMethods) {
      let method = childMethods[methodName];
      if (childMethods.hasOwnProperty(methodName)) {
        if (typeof method === 'function') {
          method.$name = methodName;
          method.$owner = childClass;
        }
        childClass.prototype[methodName] = method;
      }
    }
    childClass.prototype.$super = function(...args) {
      let method = this.$super.caller;
      if (!method.$owner) {
        method = method.caller;
      }
      let parentClass = method.$owner.$superclass, methodName = method.$name;
      parentClass.prototype[methodName].apply(this, args);
    };
    // 继承链
    childClass.$superclass = parentClass;

    return childClass;
  },
  // 随机获取颜色
  getColor() {
    let c = [];
    let i = 0;
    let rgb = ['r', 'g', 'b'];
    let resetColor = 'null';
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    // filter light color;
    if (r > 200) i++;
    if (g > 200) i++;
    if (b > 200) i++;
    if (i === 3) {
      resetColor = rgb[Math.floor(Math.random() * 4)];
    }
    switch (resetColor) {
      case 'r':
        r = 0;
        break;
      case 'g':
        g = 0;
        break;
      case 'b':
        b = 0;
        break;
    }

    c.push(r);
    c.push(g);
    c.push(b);
    return 'rgba(' + c.join() + ', .6)';
  },
  hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  },
  addClass(ele, cls) {
    if (!this.hasClass(ele, cls)) ele.className += ' ' + cls;
  },
  removeClass(ele, cls) {
    if (this.hasClass(ele, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      ele.className = ele.className.replace(reg, ' ');
    }
  },
  hex2decimal(hex, alpha) {
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
  },
  // 处理.net和java版本field不同的问题
  // 建立一个内置的规则来映射真正的filed
  fields: {
    // 通过index来决定使用哪个field
    innerField: {
      makeOrderNum: { index: null, value: ['makeOrderNum', 'MAKE_ORDER_NUM'] },
      itemCode: { index: null, value: ['itemCode', 'ITEM_CODE'] },
      descriptionsCn: { index: null, value: ['descriptionsCn', 'DESCRIPTIONS_CN'] },
      demandDate: { index: null, value: ['demandDate', 'DEMAND_DATE'] },
      moQty: { index: null, value: ['moQty', 'MO_QTY'] },
      moCompletedQty: { index: null, value: ['moCompletedQty', 'MO_COMPLETED_QTY'] },
      opdescription: { index: null, value: ['opdescription', 'OPDESCRIPTION'] },
      pdProductManager: { index: null, value: ['pdProductManager', 'PD_PRODUCT_MANAGER'] },
      fromToDate: { index: null, value: ['fromToDate', 'FROM_TO_DATE'] },
    },
    // 映射field
    map(fields) {
      const innerFieldKeys = Object.keys(this.innerField);
      for (let key = 0; key < fields.length; key++) {
        for (let innerKey = 0; innerKey < innerFieldKeys.length; innerKey++) {
          const index = this.innerField[innerFieldKeys[innerKey]].value.indexOf(fields[key]);
          if (~index) {
            this.innerField[innerFieldKeys[innerKey]].index = index;
            break;
          }
        }
      }
    },
    getField(fields) {
      const index = this.innerField[fields].index;
      if(index !== null){
        return this.innerField[fields].value[index];
      }else{
        console.warn('no field match!');
        return  null;
      }
    },
  },
};

let store = util.getStore(); //全局存储，专门存储参数和临时变量
let eventBind, drawLiner;
let mutation = new Mutation();
window.store = store;
window.util = util;

// GraphicGantt Class
export class GraphicGantt {
  constructor() {
    this.stage = null;
    this.background = null;
    this.initX = 0;
    this.initY = 0;
    const self = this;
    const observer = new Observer();
    observer.setUpdate(function() {
      console.log(self.getSeletctedCells());
    });
    const subject = new Subject();

    // set observer and subject
    Object.defineProperties(this, {
      '$ob': { value: observer, enumerable: false, writable: true, configurable: true },
      '$sub': { value: subject, enumerable: false, writable: true, configurable: true },
    });
    // construct Mutation

  }

  /**
   * 初始化函数
   * @param params
   * @param scrollId
   * @param outId  外层元素
   * @param options {lazyLoad:[true/false],fixedHeightParent?:[htmlelement]} //额外配置参数 懒加载和需要根据自适应高度的父级外层元素
   * @return {null|Konva.Stage}
   */
  init(params, scrollId, outId, options) {
    this.stage = new Konva.Stage({
      ...params,
    });
    this.scrollDiv = document.querySelector(scrollId);
    this.outbox = document.querySelector(outId);
    this.initX = params.x;
    this.initY = params.y;
    this.loadDom = util.createLoadDom({ width: params.width, height: params.height });
    this.fakeDom = util.createDom();
    this.tooltip = new Tooltip(this.outbox);
    this.overWorkorderTooltip = new Tooltip(this.outbox, true);
    this.mdk = new ManagerDragWK(); // 管理拖动的工单
    this.outbox.appendChild(this.loadDom);
    this.autoHeight(this.outbox, options.fitedHeightParent);
    store.clearAll();
    store.set('wh', { width: params.width, height: params.height });
    store.set('stage', { stage: this.stage, options });
    store.set('scrollDiv', { scrollDiv: this.scrollDiv });
    store.set('tooltip', { tooltip: this.tooltip });
    store.set('overWorkorderTooltip', { overWorkorderTooltip: this.overWorkorderTooltip });
    store.set('timeFormat', { status: false });
    store.set('selectedCells', []);
    store.set('selectedYaxis', []);
    store.set('fakeDom', this.fakeDom);
    store.set('mdk', this.mdk);
    this.scrollDiv.appendChild(this.fakeDom);
    //tooltip style
    document.styleSheets[0].addRule('.tooltip ul li:hover', 'color:red');
    return this.stage;
  }

  setOption(option) {
    // 默认配置
    let options = util.extend(true, {}, GraphicGantt.defaultOption, option);
    let series = option.series;
    util.getX.xaxisX = options.xAxis.x || 0;
    util.fields.map(options.fields);
    this.tooltip.setMapFileds(options.tooltipMapFields);
    this.$sub.removeAllObserver();
    this.workOrderContentController = new WorkOrderContentController({
      fields: option.fields || [],
      fieldsBoolean: option.fieldsBoolean || [],
    });
    let fixedHeight = this.workOrderContentController.getContentHeight();
    //是否需要闪烁
    this.mdk.enabled = option.twinkly || false;
    store.reset();
    store.set('fixedHeight', fixedHeight);
    store.set('options', options);
    store.set('series', series);
    store.set('fields', option.fields);
    store.set('fieldsBoolean', option.fieldsBoolean);

    /**
     * 修改参数中的series源数据
     * 使其成为一个观察者和主题
     * */
    if (option.series) {
      const seriesObserver = new Observer(series);

      /** 事件订阅 */
      seriesObserver.setUpdate(function(params) {
        if (params.type === 'time') {
          /** 时间,产线拖动变化 */
          let cell = params.cell;
          let currentTime = params.currentTime;
          let offsetTime = params.offsetTime;
          let dimension = cell.dimension;
          let originCell = this[dimension.od].tasks[dimension.td];
          originCell.from = Moment(currentTime).format('YYYY-MM-DD HH:mm:ss');
          originCell.to = Moment(originCell.to).add(offsetTime, 'ms').format('YYYY-MM-DD HH:mm:ss');
          originCell.productLine = cell.productLine;
          originCell.originProductLine = cell.originProductLine;
          originCell.taskTooltipsContent[util.fields.getField('fromToDate')] = `${originCell.from}-${originCell.to}`;
        } else if (params.type === 'modifyIndex') {
          /** 修改标识 */
          let cell = params.cell;
          let dimension = cell.dimension;
          let originCell = this[dimension.od].tasks[dimension.td];
          let modifyIndex = params.modifyIndex;
          option.modifyIndex = modifyIndex;
          originCell.modifyIndex = modifyIndex;
        } else if (params.type === 'dragable') {
          /** 是否可拖动 */
          let cell = params.cell;
          let dimension = cell.dimension;
          let originCell = this[dimension.od].tasks[dimension.td];
          let movable = params.dragable;
          originCell.movable = movable;
        } else if (params.type === 'twinkly') {
          /** 是否拖动过 */
          let cell = params.cell;
          let dimension = cell.dimension;
          let originCell = this[dimension.od].tasks[dimension.td];
          originCell.twinkle = true;
        }
      });
      odf(series, '$ob', { value: seriesObserver, enumerable: false, writable: true, configurable: true });
      mutation.mutate(series);

      /** 舞台和series互相注册为观察者 */
      series.$sub.registerObserver(this);
      this.$sub.registerObserver(series);
    }
  }

  render() {
    this.draw();
    this.bindEvent();
    window.stage2 = this.stage;
  }

  draw(dx, dy) {
    store.clear('xaxis');
    store.clear('yaxis');

    let options = store.get('options');
    let series = store.get('series');
    let axisLayer = this.axisLayer = new AxisLayer({ id: 'axisLayer', dx, dy });
    let background = this.background = new Background({ id: 'background', options });
    let workorder = this.workorder = new WorkOrder(series, this); // 工单
    let heightFixed = this.heightFixed = new HeightFixed(this);
    let stage = this.stage;
    let stageClick = options.stageClick || function() {
    };

    eventBind = new Binder();
    drawLiner = new DrawLiner('dependencies');

    /**
     * 舞台绑定双击事件
     * */
    eventBind.bind(this.stage, {
      /**
       * 日历:0,
       * 工单:1,
       * */
      dblclick: (evt) => {
        if (evt.target === evt.currentTarget) {
          let x = evt.currentTarget.pointerPos.x;
          let y = evt.currentTarget.pointerPos.y;
          const clickInf = {
            productLine: util.yMap.getName(y - options.xAxis.height + store.get('yaxis').dealt.dealtCellData[0].y),
            date: util.getX.getFullDate(x - options.yAxis.cell.width + store.xaxis.dealt.dealtCellData[0].x),
          };
          stageClick({ type: 0, params: clickInf });
        } else if (evt.target.identify === 'workorder') {
          const id = evt.target.getParent('Group').id();
          stageClick({ type: 1, params: id });
        }
      },
    });

    // subscript
    workorder.data.$sub.registerObserver(heightFixed);
    // 开始绘画
    axisLayer.draw();
    background.draw();
    workorder.draw();
    // 添加入舞台
    stage.add(background.layer);
    if (workorder.layers.length > 0) {
      stage.add(...workorder.layers);
      workorder.cacheWorkOrderFilterCenter(); // 过滤条件筛选
    }
    stage.add(drawLiner.layer);
    stage.add(drawLiner.tipsLayer);
    stage.add(axisLayer.layer);

    /** refresh xaxis*/
    axisLayer.xaxis.group.draw();

    this.resetStageWH();
  }

  setTimeFormat(timeFormat) {
    this.reset();
    store.set('options', { timeFormat: timeFormat });
    store.set('timeFormat', { status: true });
    this.draw();
  }

  reset() {
    let stage = this.stage;
    store.clear('selectedYaxis').clear('selectedCells');
    stage.clearCache();
    stage.destroyChildren();
    stage.x(this.initX);
    stage.y(this.initY);
    XaxisCell.timeDial.clear();
    // let container = stage.container();
    // container.style.transform = 'translate(0px, 0px)';
  }

  bindEvent() {
    let self = this;
    let stage = this.stage;
    let scrollDiv = this.scrollDiv;
    let screenWidth = store.get('wh').width;
    let screenHeight = store.get('wh').height;
    let tid;
    let fn = function(evt) {
      let dx = this.scrollLeft;
      let dy = this.scrollTop;
      let xaxisDealt = store.get('xaxis').dealt;
      let yaxisDealt = store.get('yaxis').dealt;
      let xaxis = stage.find('#xaxis');
      let yaxis = stage.find('#yaxis');
      let diagonal = stage.find('#diagonal');
      let axisLayer = stage.find('#axisLayer');
      let overWorkorderTooltip = store.get('overWorkorderTooltip').overWorkorderTooltip;
      yaxis.x(dx);
      xaxis.y(dy);
      diagonal.x(dx);
      diagonal.y(dy);
      axisLayer.draw();
      overWorkorderTooltip.hide();
      delayFn(dx, dy, xaxisDealt, yaxisDealt);
    };
    let delayFn = util.debounce(function(dx, dy, xaxisDealt, yaxisDealt) {
      if (
        ((dx + screenWidth > store.get('xaxis').options.x + xaxisDealt.preLoadRang.endX && xaxisDealt.preLoadRang.endX < xaxisDealt.totalWidth) || (dx < xaxisDealt.preLoadRang.startX && xaxisDealt.preLoadRang.startX !== 0)) ||
        ((dy + screenHeight > yaxisDealt.preLoadRang.endY && yaxisDealt.preLoadRang.endY < yaxisDealt.totalHeight) || (dy < yaxisDealt.preLoadRang.startY && yaxisDealt.preLoadRang.startY !== 0))
      ) {
        self.loadDom.style.display = 'block';
        self.scrollDiv.style.overflow = 'hidden';
        if (tid) {
          clearTimeout(tid);
        }
        tid = setTimeout(function() {
          self.reset();
          self.draw(dx, dy);
          self.loadDom.style.display = 'none';
          self.scrollDiv.style.overflow = 'auto';
        }, 100);
      }
    }, 100);
    scrollDiv.addEventListener('scroll', fn);
  }

  //重新设置舞台宽高
  resetStageWH() {
    let xaxis = store.get('xaxis');
    let yaxis = store.get('yaxis');
    let totalWidth = xaxis.dealt.totalWidth;
    let xaxisX = xaxis.options.x;
    let yaxisY = yaxis.options.y;
    let totalHeight = yaxis.dealt.totalHeight;
    let fakeDom = this.fakeDom;
    let stage = this.stage;

    if (fakeDom) {
      fakeDom.style.width = `${totalWidth + xaxisX + 2}px`;
      fakeDom.style.height = `${totalHeight + yaxisY + 2}px`;
    }

    stage.width(xaxis.dealt.realWidth + xaxisX + 2);
    stage.height(yaxis.dealt.realHeight + yaxisY + 2); // yLazy RealHeight
  }

  /**
   * 获取最后拖动的工单
   */
  getLatest() {
    return this.mdk.getLatest();
  }

  /**
   * 设置工单颜色
   * @param status
   * 传same，则为字段匹配模式，会根据option的field来查找相同的工单然后根据option的color绘色
   *  status = `same`;
   option = {field:'ITEM_CODE',color:'sameItemCodeColor'};
   * @param option
   * 可传颜色对
   * {
        rect: { fill: 'pink' },
        text: { fill: 'yellow' },
      }
   或者 配置中的颜色字段
   moStatusColor
   * @param filterFn
   */
  resetWorkOrderStatus(status, option, filterFn) {
    let workOrder = this.workorder;
    workOrder.filterWorkOrderStatus(status, option, filterFn);
  }

  filterWorkOrderById(id) {
    let workOrder = this.workorder;
    workOrder.filterWorkOrderById(id);
  }

  /**
   * 模糊过滤工单根据taskTooltipsContent的某个域
   * @param value
   * @param field
   */
  filterWorkOrderByField(value, field) {
    let workOrder = this.workorder;
    workOrder.filterWorkOrderByField(value, field);
  }

  filterWorkOrderByFlag(flag) {
    let workOrder = this.workorder;
    workOrder.filterWorkOrderByFlag(flag);
  }

  // Y轴产线过滤
  filterProductionLine(productionLine) {
    let op;
    if (!store.get('cacheYaxis')) {
      op = store.get('options').yAxis;
      store.set('cacheYaxis', { yAxis: op });
    } else {
      op = store.get('cacheYaxis').yAxis;
    }
    let tmpOp = util.extend(true, {}, op);
    let data = tmpOp.data;
    data.forEach(pl => {
      let tmpChildren = [];
      pl.children.forEach(y => {
        if (util.isObject(y)) {
          y = y.name;
        }
        for (let f = 0, ff = productionLine.length; f < ff; f++) {
          let fs = productionLine[f];
          if (~y.indexOf(fs)) {
            tmpChildren.push(y);
            return;
          }
        }
      });
      pl.children = tmpChildren;
    });
    tmpOp.data = data;
    store.options.yAxis = tmpOp;

    this.reset();
    this.draw();
  }

  // 返回所有选择工单
  getSeletctedCells() {
    return store.get('selectedCells');
  }

  /**
   * 设置工单内容显示域
   * @param fields 需要显示的域为一个boolean数组
   */
  setWorkOrderContent(fields) {
    let workorder = this.workorder;
    let workOrderController = workorder.workOrderController;
    let isEqual = workOrderController.setDisplayFields(fields);//当前设置与原设置是否相同
    if (isEqual) return;
    let height = workOrderController.height;
    workorder.data.height = height;
  }

  /**
   * 根据时间调整scrollLeft
   * @param time 符合Date格式的时间 eg:2019/3/3 18:30:00
   */
  setScrollLeftByTime(time) {
    let scrollDom = this.scrollDiv;
    let distance = util.getX.fromTime(time);
    scrollDom.scrollLeft = distance;
  }

  setWorkOrderDragable(name, dragable) {
    this.workorder.setWorkOrderDragable(name, dragable);
  }

  // 返回Y轴所选
  getSelectedY() {
    return store.get('selectedYaxis');
  }

  /**
   * 全屏检测
   * @param outBox 需要适配高度的元素
   * @param parent 检测的父元素，默认为body
   */
  autoHeight(outBox, parent = document.body) {
    const ro = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { height } = entry.contentRect;
        const outBoxTop = outBox.getBoundingClientRect().top;
        const fullHeight = height - outBoxTop;
        outBox.style.height = fullHeight + 'px';
      }
    });
    ro.observe(parent);

  }
}

GraphicGantt.defaultOption = {
  workOrderMultiple: false, // 工单是否支持多选
  yaxixMultiple: false, // Y轴是否支持多选
  xAxis: {
    x: 0, // 起始位置
    y: 0, // 起始位置
  },
  yAxis: {
    x: 0,
    y: 0,
  },
};

// BACKGROUND Class
class Background {
  constructor(option) {
    let op = option.options;
    this.layer = new Konva.Layer({ id: option.id });
    this.backgroundGrid = new BackgroundGrid({
      id: 'backgroundGrid',
      x: op.xAxis.x,
      y: op.yAxis.y,
      hitGraphEnabled: false,
    }); // 网格层（x,y线交叉）
    this.calendar = new Calendars({ id: 'calendar', data: op.ganttCalendars }); // 工作区域
  }

  draw() {
    this.backgroundGrid.draw();
    this.calendar.draw();
    this.layer.add(this.calendar.group);
    this.layer.add(this.backgroundGrid.group);
  }
}

//Diagonal
class Diagonal {
  constructor(id) {
    let isLazyLoad = store.get('stage').options.lazyLoad; //判断是否懒加载模式
    this.group = new Konva.Group({ id });
    if (isLazyLoad) {
      let scrollDiv = store.get('scrollDiv').scrollDiv;
      let sx = scrollDiv.scrollLeft;
      this.group.x(sx);
    }
  }

  draw() {
    let group = this.group;
    let xaxis = store.get('xaxis');
    let yaxis = store.get('yaxis');
    let diagonal = store.get('options').diagonal;
    let width = xaxis.options.x;
    let height = yaxis.options.y;
    if (!width || !height) return;
    let options = util.extend(true, {}, Diagonal.defaultOption, diagonal.style);
    let taskTotal = 0;
    store.get('series').forEach(productLine => {
      taskTotal += productLine.tasks.length;
    });
    let rect = new Konva.Rect({
      width,
      height,
      ...options.rect,
    });
    /* let line = new Konva.Line({
       points: [0, 0, width, height],
       ...options.line,
     });*/
    let text = new Konva.Text({
      width,
      height,
      text: options.text || `工序工单共:`,
      ...Diagonal.defaultOption.text,
      y: -6,
    });
    let textTaskTotal = new Konva.Text({
      width,
      text: taskTotal,
      ...Diagonal.defaultOption.text,
      fill: 'red',
      y: 22,
    });

    group.add(rect);
    group.add(text);
    group.add(textTaskTotal);
  }
}

Diagonal.defaultOption = {
  rect: {
    fill: '#ecfdff',
    stroke: 'transparent',
  },
  line: {
    stroke: '#666',
    strokeWidth: .5,
  },
  text: {
    wrap: 'none',
    lineHeight: 1.2,
    verticalAlign: 'middle',
    fontFamily: '微软雅黑',
    fontWeight: '100',
    fill: '#b8bbbe',
    padding: 4,
    align: 'center',
    listening: false,
  },
};

// AXIS Class
class Axis {
  constructor() {
  }
}

class Xaxis extends Axis {
  constructor(id) {
    super();
    let op = store.get('options').xAxis;
    let dealtData;
    this.group = new Konva.Group({
      id,
      x: op.x,
      y: op.y,
    });
    store.set('xaxis', { options: op });
    this.dealtData = dealtData = this.dealWithData(op);
    store.set('xaxis', { dealt: dealtData });
  }

  draw() {
    let dealtCellData = this.dealtData.dealtCellData;
    dealtCellData.forEach(cellInf => {
      let xcell = new XaxisCell(cellInf);
      this.group.add(xcell.group);
    });
  }

  dealWithData(originData) {
    let dealtCellData = [];
    let cellX = 0;
    let realWidth = 0;
    let cellStyle = originData.cell;
    let cellStyleTmp = {};
    for (let key in cellStyle) {
      if (cellStyle.hasOwnProperty(key)) {
        if (cellStyle[key] !== null) {
          cellStyleTmp[key] = cellStyle[key];
        }
      }
    }
    cellStyle = cellStyleTmp;
    let timeFormatType = store.get('options').timeFormat.slice(-1) === 'd' ? 'day' : 'hour';
    let dates = this.getDate(timeFormatType); // 时间数据
    let timeFormatInf = this.getTimeFormatInf(); // 时间格式
    let oldCellWidth = store.get('cellWidth');
    let cellWidth = this.calculateCellWidth(timeFormatInf, dates.date.length);
    let timeFormat = store.get('timeFormat').status;
    let totalWidth, customAllWidth;
    let stageOffsetX = 0;
    store.set('cellWidth', cellWidth);
    store.set('timeFormat', { timeFormatType });

    let options = util.extend(true, { width: cellWidth }, XaxisCell.defaultOption, cellStyle);
    // 懒加载相关
    let isLazyLoad = store.get('stage').options.lazyLoad; //判断是否懒加载模式
    let preLoadRang = 0;
    let widths = this.calculateTotalWidth(originData, cellWidth, cellStyle, dates);
    totalWidth = widths.totalWidth * (timeFormatType === 'hour' ? 24 : 1);
    customAllWidth = widths.customAllWidth;

    // 时间格式改变
    if (timeFormat) {
      let rate = 1;
      let scrollDiv = store.get('scrollDiv').scrollDiv;
      let scrollLeft = scrollDiv.scrollLeft;
      let preFormatType = store.get('preFormatType');
      if (preFormatType === 'day') {
        if (timeFormatType === 'hour') {
          rate = 24;
          store.set('preFormatType', 'hour');
        }
      } else if (preFormatType === 'hour') {
        if (timeFormatType === 'day') {
          rate = 1 / 24;
          store.set('preFormatType', 'day');
        }
      } else {
        store.set('preFormatType', timeFormatType);
      }
      let ratio = cellWidth * rate / oldCellWidth;
      let sx = Math.ceil(scrollLeft * ratio);
      if (scrollDiv.scrollWidth < totalWidth) {
        scrollDiv.children[1].style.width = totalWidth + originData.x + 2 + 'px';
      }
      scrollDiv.scrollLeft = sx;
      store.set('timeFormat', { status: false });
    }

    // 懒加载处理
    if (isLazyLoad) {
      preLoadRang = this.processLazyLoad(cellWidth, timeFormatInf, totalWidth);
    }

    collectCell(false, timeFormatType);

    // 懒加载处理舞台和网格定位,需等数据处理完
    if (isLazyLoad && dealtCellData.length > 0) {
      let stage = store.get('stage').stage;
      let firstCell = dealtCellData[0];
      let originX = stage.x();
      let container = stage.container();
      const rep = /\d+.*px/g;
      stage.x(originX - firstCell.x);
      stageOffsetX = firstCell.x;
      let transformStr = container.style.transform;
      let transformVal = transformStr.match(rep) || ['', '0px'];
      transformVal[0] = `${stageOffsetX}px`;
      container.style.transform = `translate(${transformVal.join(',')})`;
    }

    return {
      dealtCellData,
      cellWidth,
      realWidth,
      totalWidth,
      totalCells: dealtCellData.length,
      customAllWidth,
      timeFormatInf,
      preLoadRang,
      stageOffsetX,
    };

    function collectCell(reset = false, type) {
      if (reset) {
        dealtCellData = [];
      }
      if (originData.customData) {
        warpData(originData.customData, dealtCellData, originData);
      }
      warpData(dates, dealtCellData, originData, type);
    }

    function warpData(dates, storeArr, originData, type) {
      let date = dates.date;
      for (let i = 0, ii = date.length; i < ii; i++) {
        let xcelldata = date[i];

        if (util.isObject(xcelldata)) {
          let options = util.extend(true, { width: cellWidth }, XaxisCell.defaultOption, cellStyle, xcelldata.style);
          warpCell(xcelldata.name, storeArr, options, originData);
        } else {
          let name;
          if (type === 'hour') {
            dates.hour.forEach(h => {
              name = `${xcelldata}(${dates.week[i]})\n${h}`;
              warpCell(name, storeArr, options, originData, dates.fullDate[i]);
            });

          } else {
            name = `${xcelldata}\n(${dates.week[i]})`;
            warpCell(name, storeArr, options, originData, dates.fullDate[i]);
          }

        }
      }

      function warpCell(name, storeArr, options, originData, fullDate) {
        let width = options.width, height = options.height, rect = options.rect, text = options.text;
        // 开启懒加载
        if (isLazyLoad) {
          if (cellX < preLoadRang.startX || cellX + width > preLoadRang.endX) {
            cellX += width;
            return;
          }
        }

        let d = {
          id: name,
          name: 'Xcell',
          x: cellX,
          y: originData.y,
          width,
          height,
          text: name,
          style: { rect, text },
          fullDate: fullDate,
        };
        cellX += width;
        realWidth += width;
        storeArr.push(d);
      }

    }
  }

  processLazyLoad(cellWidth, timeFormatInf, totalWidth) {
    let scrollDiv = store.get('scrollDiv').scrollDiv;
    let sx = scrollDiv.scrollLeft;
    let tDay = store.options.timeFormat.slice(0, -1);
    let preloadEle = 10;
    //预加载的元素，即当前屏前后预+元素的个数，决定了拖动x轴触发下一次加载的距离,说明：元素个数越小，性能越好，但下一次拖动加载所需的距离越短，eg:
    // preloadEle=1,则 currentElement*1 + currentElement + currentElement*1
    // preloadEle=2,则 currentElement*2 + currentElement + currentElement*2
    if (tDay < 2) {
      preloadEle = 1;
    } else if (tDay < 4) {
      preloadEle = 2;
    } else if (tDay > 3 && tDay < 7) {
      preloadEle = 6;
    }
    const currentWO = Math.floor(sx / cellWidth);
    sx = currentWO * cellWidth;
    let perLoadEleWidth = preloadEle * cellWidth;
    let screenEleWidth = timeFormatInf.timeNum * cellWidth;
    let ex = sx + perLoadEleWidth + screenEleWidth;
    let miniPreloadWidth = screenEleWidth + perLoadEleWidth; // 最小加载宽度（结尾只需要预加载前面数量）
    if (sx > 0) {
      sx -= perLoadEleWidth;
      if (sx < 0) {
        sx = 0;
      } else if (totalWidth - sx < miniPreloadWidth) {
        sx = totalWidth - miniPreloadWidth;
      }
    }
    if (ex > totalWidth) {
      ex = totalWidth;
    }


    let preLoadRang = { startX: sx, endX: ex, miniPreloadWidth };
    return preLoadRang;
  }

  // 拿日期
  getDate(timeFormat) {
    let options = store.get('options');
    let timeRang = options.timeRange.split('-');
    let startDate = new Date(timeRang[0]);
    let endDate = new Date(timeRang[1]);
    let dates = util.calculateDate(startDate, endDate, timeFormat);
    // 设置开始时间
    util.getX.setStart(startDate);
    return dates;
  }

  /**
   * 根据（舞台宽度-Y轴宽度）/ 时间格式(若实际时间小于时间格式的长度，采用实际时间)
   * 计算出x轴的单元宽
   * @param timeInf
   * @return {number}
   */
  calculateCellWidth(timeInf, curLen) {
    let stageWidth = store.get('wh').width;
    let yaxisWidth = store.get('options').yAxis.cell.width;
    // let xCellWidth = Math.floor((stageWidth - yaxisWidth) / timeInf.timeNum);
    let xCellWidth = Math.floor((stageWidth - yaxisWidth) / (+timeInf.timeNum > curLen ? curLen : timeInf.timeNum));
    // 设置基础X/分钟
    util.getX.setMin(timeInf.timeType);
    util.getX.setBaseXFromMin(xCellWidth);
    return +xCellWidth;
  }

  calculateTotalWidth(originData, cellWidth, cellStyle, dates) {
    let totalWidth = 0;
    let customAllWidth = 0;
    let options = util.extend(true, { width: cellWidth }, XaxisCell.defaultOption, cellStyle);
    if (originData.customData) {
      calculateWidth(originData.customData, originData);
      customAllWidth = totalWidth;
    }
    calculateWidth(dates.date);

    return { customAllWidth, totalWidth };

    function calculateWidth(data) {
      for (let i = 0, ii = data.length; i < ii; i++) {
        let xcelldata = data[i];
        if (util.isObject(xcelldata)) {
          options = util.extend(true, { width: cellWidth }, XaxisCell.defaultOption, cellStyle, xcelldata.style);
        }
        let width = options.width;
        totalWidth += width;
      }
    }
  }

  getTimeFormatInf() {
    let timeFormat = store.get('options').timeFormat;
    let timeNum = timeFormat.slice(0, -1);
    let timeType = timeFormat.slice(-1);
    return { timeNum, timeType, timeFormat };
  }
}

class Yaxis extends Axis {
  constructor(id) {
    super();
    let op = store.get('options').yAxis;
    let xop = store.get('options').xAxis;
    let xx = xop.x;
    let yw = op.width;
    let isLazyLoad = store.get('stage').options.lazyLoad; //判断是否懒加载模式
    //判断x轴和y轴是否重叠，重叠则y轴的y起始位x轴的高度
    if (yw > xx) {
      op.y = xop.height;
    }
    let dealtData;
    this.group = new Konva.Group({
      id,
      x: op.x,
      y: op.y,
    });
    this.isDrawing = false;
    this.priorities = [];
    this.preLoadStep = 9999; //Y轴预加载像素
    // 懒加载模式
    this.datas = op.data;// Y轴数据
    if (isLazyLoad) {
      let scrollDiv = store.get('scrollDiv').scrollDiv;
      let sx = scrollDiv.scrollLeft;
      this.group.x(sx);
    }

    store.set('yaxis', { options: op });

    this.dealtData = dealtData = this.dealWithData(op);
    store.set('yaxis', { dealt: dealtData });
  }

  //filter 要呈现的产线名称
  draw() {
    let dealtCellData = this.dealtData.dealtCellData;

    dealtCellData.forEach(cellInf => {
      let ycell = new YaxisCell(cellInf);
      this.group.add(ycell.group);
    });
  }

  clear() {
    this.group.destroyChildren();
  }

  dealWithData(yAxisOption) {
    let stageOffsetY = 0;
    let fixedHeight = store.get('fixedHeight');
    let cellStyle = yAxisOption.cell;
    let commonOptions = util.extend(true, {}, YaxisCell.defaultOption, cellStyle);
    let totalHeight = this.calculateTotalHeight(fixedHeight || commonOptions.height);
    let isLazyLoad = store.get('stage').options.lazyLoad; //判断是否懒加载模式
    let preLoadRang = this.processLazyLoad(totalHeight);
    let cellData = this.processYaxisData(yAxisOption, totalHeight, preLoadRang, fixedHeight);
    let dealtCellData = cellData.dealtCellData;
    let backgroundGridYaxis = cellData.backgroundGridYaxis;

    let realHeight = this.calculateRealHeight(backgroundGridYaxis, fixedHeight || commonOptions.height);
    // 懒加载处理舞台和网格定位,需等数据处理完
    if (isLazyLoad) {
      let stage = store.get('stage').stage;
      let firstCell = backgroundGridYaxis[0];
      let originY = stage.y();
      let container = stage.container();
      let rep = /\d+\w{2}/g;
      stage.y(originY - firstCell.y);
      stageOffsetY = firstCell.y;
      let transformStr = container.style.transform;
      let transformVal = transformStr.match(rep) || ['0px'];
      transformVal[1] = `${stageOffsetY}px`;
      container.style.transform = `translate(${transformVal.join(',')})`;
    }

    return {
      dealtCellData,
      totalCells: backgroundGridYaxis.length,
      totalHeight,
      realHeight,
      preLoadRang,
      backgroundGridYaxis,
    };
  }

  processLazyLoad(totalHeight) {
    let scrollDiv = store.get('scrollDiv').scrollDiv;
    let st = scrollDiv.scrollTop;
    let screenHeight = store.get('wh').height;
    let preLoadStep = this.preLoadStep;
    let et = st + screenHeight + preLoadStep > totalHeight ? totalHeight : st + screenHeight + preLoadStep;
    st = st - preLoadStep < 0 ? 0 : st - preLoadStep;
    return { startY: st, endY: et };
  }

  // 总高度
  calculateTotalHeight(height, data = this.datas) {
    let totalCells = 0;
    data.forEach(yCell => {
      if (yCell.children && yCell.children.length > 0) {
        let occupyCell = 1;
        if (yCell.drawName) {
          totalCells++;
        }
        if (util.isObject(yCell) && yCell.occupyCell) {
          occupyCell = yCell.occupyCell;
        }
        const childrenLen = yCell.children.reduce((len, cell) => {
          if (cell.occupyCell) {
            return len += cell.occupyCell;
          } else {
            return len += occupyCell;
          }
        }, 0);
        totalCells += childrenLen;
      } else {
        totalCells++;
      }
    });
    return totalCells * height;
  }

  // 真实高度（懒加载装载的元素）
  calculateRealHeight(yaxis, height) {
    return yaxis.length * height;
  }

  processYaxisData(yAxisOption, totalHeight, preLoadRang, resetHeight = 0) {
    let cellY = 0;
    let cellX = yAxisOption.x;
    let dealtCellData = [];
    let backgroundGridYaxis = []; //背景表格Y轴坐标集合，因为生产线可能存在泳道，导致绘画所需的y轴的线与生产线的y轴坐标和数量不同, y轴线数量 = 生产线.height / 3
    let isLazyLoad = store.get('stage').options.lazyLoad; //判断是否懒加载模式
    let cellStyle = yAxisOption.cell;
    let warpCell = function(name, options, cellX, isChildren = false) {
      let width = options.width;
      let height = resetHeight || options.height;
      let cellHeight = height;
      let rect = options.rect;
      let text = options.text;
      let occupyCell = options.occupyCell;
      let obj = null;

      if (util.isObject(name)) {
        obj = name;
        name = name.name;
      }

      if (isChildren && (occupyCell || obj.occupyCell)) {
        if (obj.occupyCell) {
          occupyCell = obj.occupyCell;
        }

        cellHeight = height * occupyCell;
      }

      // 开启懒加载
      if (isLazyLoad) {
        if (cellY + cellHeight < preLoadRang.startY || cellY > preLoadRang.endY) {

          //下一个yCell的起始Y坐标
          cellY += cellHeight;
          return;
        }
        // if (cellY < preLoadRang.startY || cellY + height > preLoadRang.endY) {
        //   cellY += height;
        //   return;
        // }
      }


      // 处理backgroundGrid的yaxis坐标
      if (isChildren && occupyCell) {
        let i = 0;
        while (i < occupyCell) {
          if (isLazyLoad) {
            if ((cellY + height * i) < preLoadRang.startY || (cellY + height * i) > preLoadRang.endY) {
              i++;
              continue;
            }
          }
          backgroundGridYaxis.push({ name: name, occupyCellN: i, y: cellY + height * i++ });
        }
      } else {
        backgroundGridYaxis.push({ name: name, y: cellY });
      }

      let d = {
        id: name,
        name: 'Ycell',
        x: cellX,
        y: cellY,
        width,
        height: cellHeight,
        text: name,
        occupyCell: occupyCell,
        style: { rect, text },
      };

      if (obj && obj.drawTips && obj.tips) {
        d.tips = obj.tips.replace('-', '_');
      }
      util.yMap.setPool(name, { start: cellY, cellHeight }); //ymap映射
      // util.yMap.setPool(name, cellY); //ymap映射
      cellY += cellHeight;
      dealtCellData.push(d);
    };
    let warpData = function(data, cellX) {
      data.forEach(yCell => {
        if (util.isObject(yCell)) {
          let options = util.extend(true, { occupyCell: yCell.occupyCell || null }, YaxisCell.defaultOption, cellStyle, yCell.style);
          if (yCell.drawName) {
            warpCell(yCell, options, cellX);
          }
          if (yCell.children && yCell.children.length > 0) {
            yCell.children.forEach(childCell => {
              warpCell(childCell, options, cellX, true);
            });
          }
        } else {
          warpCell(yCell, options, cellX);
        }
      });
    };

    util.yMap.clear();
    if (yAxisOption.customData) {
      warpData(yAxisOption.customData, cellX);
    }
    warpData(yAxisOption.data, cellX);

    return { dealtCellData, backgroundGridYaxis };
  }

  // 更新y轴高度
  heightUpdate(height) {
    let yGroup = this.group.find('Group');
    let cellHeight = 0;

    let op = store.get('options').yAxis;
    // if (originData.customData) {
    //   warpData(originData.customData, dealtCellData, originData);
    // }

    yGroup.forEach((group, index) => {
      let rect = undefined, text = undefined;
      group.getChildren(node => {
        if (node.getClassName() === 'Rect') rect = node;
        if (node.getClassName() === 'Text') text = node;
      });
      if (rect) {
        let name = group.getId();
        rect.height(height);
        text.height(height);
        util.yMap.setPool(name, { start: cellHeight, height });
        // util.yMap.setPool(name, cellHeight); //ymap映射
        cellHeight += height;
        group.y(height * index);
      }
    });
    this.group.draw();
    return cellHeight;
  }

  textUpdate(selector, moResCodePriorities) {
    if (this.isDrawing) { //检测是否已经被拖动改变过
      return;
    } else {
      this.setIsDrawing(true);
      this.priorities = [];
    }
    let beUpdateCell = this.group.find(selector);
    if (beUpdateCell && beUpdateCell.length > 0) {
      beUpdateCell.forEach(cell => {
        let text = cell.find('Text')[0];
        let id = cell.getId();
        let m = moResCodePriorities.filter(m => m.key === id);
        let clone = text.clone({
          name: 'priority',
          y: text.y(),
          text: m[0].value,
          align: 'left',
          fill: 'red',
        });
        cell.add(clone);
        this.priorities.push(clone);
        cell.draw();
      });
    }
  }

  // 清楚拖动Y轴优先级
  clearPriority() {
    let priorities = this.priorities;
    priorities.forEach(priority => {
      priority.destroy();
    });
    this.group.parent.draw();
  }

  setIsDrawing(value) {
    this.isDrawing = value;
  }
}


/**
 * 时间刻度
 * 根据宽度缓存和获取时间刻度
 * */
class TimeDial {
  constructor() {
    this.cacheTimeDial = new Map();
  }

  /**
   * 获取时间间隔
   * width [number] 容器总宽
   * y [number] 反向绘画时，Y起点
   *  */
  get(width, y) {
    const cacheTimeDial = this.cacheTimeDial;
    if (cacheTimeDial.has(width)) {
      return cacheTimeDial.get(width).clone();
      /** 需要克隆，konva中的Node是一个对象，只能处于一个位置，当把它add到其他节点中，之前add的位置会消失*/
    }
    const timeDial = this.createTimeDial(width, y);
    cacheTimeDial.set(width, timeDial);
    return timeDial;
  }

  createTimeDial(width, y = 0) {
    const timeFormatType = store.get('timeFormat').timeFormatType;
    const timeInterval = timeFormatType === 'day' ? 24 : 6;
    const average = (width / timeInterval).toFixed(2);
    const group = new Konva.Group();
    for (let i = 1; i < timeInterval; i++) {
      let line, y2, color;
      if (i % 4 === 0 && timeFormatType !== 'hour') {
        y2 = 4;
        let text = new Konva.Text({
          text: i,
          fill: 'black',
          x: i * average - 6.5,
          y: y - y2 - 9,
          fontSize: 10,
          align: 'center',
          width: 14,
        });
        group.add(text);
        color = 'black';
      } else {
        y2 = 2;
        color = 'red';
      }
      line = new Konva.Line({
        points: [i * average, y, i * average, y - y2],
        stroke: color,
        strokeWidth: 1,
      });
      group.add(line);
    }
    return group;
  }

  clear() {
    this.cacheTimeDial.clear();
  }
}

// CELL Class
class Cell {
  constructor(id, name, x, y) {
    this.group = new Konva.Group({ id, name, x, y });
  }

  draw() {
  }
}

class AxisCell extends Cell {
  constructor(id, name, x, y) {
    super(id, name, x, y);
  }
}

AxisCell.defaultOption = {
  rect: {
    fill: '#fff',
    stroke: 'transparent',
    strokeWidth: 0,
  },
  text: {
    fill: '#000',
    align: 'left',
    verticalAlign: 'middle',
    fontSize: 12,
    warp: 'none',
    lineHeight: 1.2,
    fontFamily: '微软雅黑',
    fontWeight: '400',
  },
};

class XaxisCell extends AxisCell {
  constructor(inf) {
    super(inf.id, inf.name, inf.x, inf.y);
    this.ruler = store.get('options').ruler;
    this.draw(inf);
  }

  draw(inf) {
    const group = this.group;
    const rect = new Konva.Rect({
      width: inf.width,
      height: inf.height,
      ...inf.style.rect,
    });
    const text = new Konva.Text({
      width: inf.width,
      height: inf.height,
      text: inf.text,
      offsetY: store.get('timeFormat').timeFormatType === 'day' ? 4 : 0,
      listening: false,
      ...inf.style.text,
    });

    group.add(rect);
    group.add(text);

    /** 添加刻度 */
    if (this.ruler) {
      const timeDial = XaxisCell.timeDial.get(inf.width, inf.height);
      group.add(timeDial);
    }

  }
}

XaxisCell.timeDial = new TimeDial();

class YaxisCell extends AxisCell {
  constructor(inf) {
    super(inf.id, inf.name, inf.x, inf.y);
    YaxisCell.selectedStatus = [];
    this.draw(inf);
  }

  draw(inf) {
    let options = store.get('options');
    let group = this.group;
    let rect = new Konva.Rect({
      width: inf.width,
      height: inf.height,
      ...inf.style.rect,
    });
    let textStr = inf.text + (inf.tips ? `\n${inf.tips}` : '');
    let text = new Konva.Text({
      width: inf.width,
      height: inf.height,
      text: textStr,
      listening: false,
      ...inf.style.text,
    });

    group.add(rect);
    group.add(text);
    let tween = new SelectedStatus(group.find('Rect')[0], 'rowSelectedColor', group);
    let clickStatus = { click: false };
    let disableSelectStatus = () => {
      tween.end();
      clickStatus.click = false;
    };
    eventBind.bind(group, {
      mouseenter: (evt, flag) => {
        let scrollDiv = store.get('scrollDiv').scrollDiv;
        scrollDiv.style.cursor = 'pointer';
        if (flag.click === false) tween.start();
      },
      mouseleave: (evt, flag) => {
        let scrollDiv = store.get('scrollDiv').scrollDiv;
        scrollDiv.style.cursor = 'default';
        if (flag.click === false) tween.end();
      },
      'click': (evt, flag) => {
        flag.click = !flag.click;
        if (flag.click) {
          if (options.yaxixMultiple) {

          } else {
            let disableSelectStatusFn = YaxisCell.selectedStatus[0];
            if (util.isFunction(disableSelectStatusFn)) disableSelectStatusFn();
            YaxisCell.selectedStatus = [disableSelectStatus];
            store.set('selectedYaxis', [inf.text]);
          }
        } else {
          if (options.yaxixMultiple) {

          } else {
            YaxisCell.selectedStatus = [];
            store.set('selectedYaxis', []);
          }
        }
      },
    }, clickStatus);
  }
}

YaxisCell.selectedStatus = [];

class AxisLayer {
  constructor(option) {
    this.layer = new Konva.Layer({ id: option.id });
    this.xaxis = new Xaxis('xaxis'); //x轴
    this.yaxis = new Yaxis('yaxis'); //y轴
    this.diagonal = new Diagonal('diagonal'); // x,y轴交叉

    if (option.dx) {
      this.yaxis.group.x(option.dx);
      this.diagonal.group.x(option.dx);
    }
    if (option.dy) {
      this.xaxis.group.y(option.dy);
      this.diagonal.group.y(option.dy);
    }
  }

  draw() {
    this.xaxis.draw();
    this.yaxis.draw();
    this.diagonal.draw();
    this.layer.add(this.xaxis.group);
    this.layer.add(this.yaxis.group);
    this.layer.add(this.diagonal.group);
  }
}

// GRID Class
class Grid {
  constructor(config) {
    this.group = new Konva.Group(config);
  }

  draw() {
  }

}

class BackgroundGrid extends Grid {
  constructor(config) {
    super(config);
    store.init('backgroundGrid', { backgroundGrid: this.group });
  }

  draw() {
    let xaxis = store.get('xaxis');
    let yaxis = store.get('yaxis');
    let isLazyLoad = store.get('stage').options.lazyLoad;
    let xcells = isLazyLoad ? xaxis.dealt.dealtCellData.length : xaxis.dealt.totalCells;
    let ycells = yaxis.dealt.totalCells;
    let layer = this.group;
    let preLoadRangX = store.get('xaxis').dealt.preLoadRang;
    let preLoadRangY = store.get('yaxis').dealt.preLoadRang;
    let startX = preLoadRangX.startX;
    let startY = preLoadRangY.startY;
    let endX = preLoadRangX.endX;
    let endY = preLoadRangY.endY;
    let dealtCellDataX = xaxis.dealt.dealtCellData;
    let dealtCellDataY = yaxis.dealt.backgroundGridYaxis;

    for (let x = 1; x < xcells; x++) {
      let line = new Konva.Line({
        name: 'xLine',
        points: [dealtCellDataX[x].x, startY, dealtCellDataX[x].x, endY],
        stroke: '#c9c9c9',
        strokeWidth: 1,
      });
      layer.add(line);
    }

    for (let y = 1; y < dealtCellDataY.length; y++) {
      let line = new Konva.Line({
        name: 'yLine',
        points: [startX, dealtCellDataY[y].y, endX, dealtCellDataY[y].y],
        stroke: '#c9c9c9',
        strokeWidth: 1,
      });
      layer.add(line);
    }

    /**
     * 添加最后一条底线
     */
    layer.add(new Konva.Line({
      name: 'yLine',
      points: [startX, dealtCellDataY[dealtCellDataY.length - 1].y + yaxis.options.cell.height, endX, dealtCellDataY[dealtCellDataY.length - 1].y + yaxis.options.cell.height],
      stroke: '#c9c9c9',
      strokeWidth: 1,
    }));
  }

  heightUpdate(height, totalHeight) {
    let yLine = this.group.find('.yLine');
    let xLine = this.group.find('.xLine');
    let yaxis = store.get('yaxis');
    let originalHeight = yaxis.options.cell.height;
    let offHeight = height - originalHeight;
    yLine.forEach((yl, index) => {
      yl.y(offHeight * (index + 1));
    });
    xLine.forEach(xl => {
      let points = xl.points();
      points[points.length - 1] = totalHeight;
      xl.points(points);
    });
    this.group.draw();
  }
}

// 工单类
class WorkOrder {
  constructor(data, gantt) {
    let fields = store.get('fields');
    let fieldsBoolean = store.get('fieldsBoolean');
    this.mdk = store.get('mdk');
    this.offsetY = -5; //工单距离上下边线的距离
    this.workOrderModifyIndex = new WorkOrderModifyIndex();
    this.gantt = gantt;
    this.layers = [];
    this.selectedStatus = [];
    this.dealtData = this.dealWithData(data);
    this.workOrderFilter = new WorkOrderFilter(this.layers, gantt);
    store.set('workOrder', { dealtData: this.dealtData }, true);
    // 全部字段和可见字段
    this.workOrderController = gantt.workOrderContentController;
    // 工单的可观察数
    this.data = {
      height: this.workOrderController.getContentHeight(),
    };
    mutation.mutate(this.data);
  }

  draw() {
    let dealtData = this.dealtData;
    let layer = null;
    let self = this;
    let offsetY = this.offsetY;
    let options = store.get('options');
    let xAxis = store.get('xaxis').options;
    let yAxis = store.get('yaxis').options;
    let stageOffsetX = store.get('xaxis').dealt.stageOffsetX;

    /**
     * Y轴的偏移位置（即Y轴懒加载后，Y的起始坐标）
     */
    let translateY = store.get('yaxis').dealt.backgroundGridYaxis[0].y;

    // 拖动层(拖动的工单会移入该层，停止拖动再移回所在层)
    let dragLayer = this.dragLayer = new Konva.Layer({
      name: 'dragLayer',
      x: xAxis.x,
      y: yAxis.y,
    });

    /** 重新加载工单时，需要停止之前工单闪烁并清空之前的层级 */
    if (this.mdk.enabled) {
      this.mdk.stopTwinkle();
      this.mdk.emptyLayer();
    }

    dealtData.forEach((w, i) => {
      if (i % 500 === 0) {
        if (layer) {
          this.layers.push(layer);
        }
        layer = new Konva.Layer({
          name: 'workorder',
          x: xAxis.x,
          y: yAxis.y,
        });
      }
      let wk = drawWO(w, layer, options);
      /** 工单重新加载时，将之前处于拖动状态工单重新让其闪烁 */
      if (this.mdk.enabled && w.originData.twinkle) {
        this.mdk.add(wk);
        this.mdk.addLayer(wk.parent);
      }
    });

    // 开始闪烁
    if (this.mdk.enabled) {
      this.mdk.startTwinkle();
    }

    if (layer !== null) {
      this.layers.push(layer);
    }

    this.layers.push(dragLayer);

    function drawWO(inf, layer, originOptions) {
      let id = inf.id, name = inf.name, x = +inf.x, y = +inf.y, height = inf.height, width = inf.width,
        originData = inf.originData, occupyCellN = inf.occupyCellN;

      let options = util.extend(true, {}, WorkOrder.defaultOption.style, originData.style, { progress: inf.progress }, { exception: inf.exception });
      let rectHeight = height + offsetY * 2;
      let warnningFlag = options.exception.warnningFlag;
      let tooltip = store.get('tooltip').tooltip;
      let overWorkorderTooltip = store.get('overWorkorderTooltip').overWorkorderTooltip;
      let tween = null;
      self.workOrderController.setWorkOrderData(originData);
      height = self.data.height;
      let group = new Konva.Group({
        id,
        name,
        x: x,
        y: y,
        height,
        width,
        draggable: originData.movable,
        offsetY,
        stroke: '#000',
        transformsEnabled: 'position',
        // 工单拖动
        dragBoundFunc: function(pos) {
          // pos返回的是当前工单的实时位置
          let adjustPosX = pos.x + stageOffsetX;
          let currentTime = util.getX.getNewDate(util.getX.timeFromXaxis(adjustPosX));
          let offsetTime = util.getX.transformX2Millisecond(pos.x - this.getAbsolutePosition().x);
          let posy = this.getAbsolutePosition().y;
          let Ydirection = 'none';
          if (pos.y > this.getAbsolutePosition().y) {
            Ydirection = 'down';
          } else if (pos.y < this.getAbsolutePosition().y) {
            Ydirection = 'up';
          }
          inf.x = adjustPosX - xAxis.x;

          // Y轴拖动
          if (originData.moResCodePriorities) {
            let mm = originData.moResCodePriorities;
            let mmName = mm.map(mrc => `#${mrc.key}`);

            // y轴呈现可拖动产线及优先级
            self.gantt.axisLayer.yaxis.textUpdate(mmName.join(','), originData.moResCodePriorities);

            for (let m = 0, ml = mm.length; m < ml; m++) {
              let name = mm[m].key;
              let keyHeight = util.yMap.getY(name);


              //  工单的Y坐标（workOrderY）不需要修复，因为舞台已经进行了Y轴平移
              //  但Y轴元素的Y坐标(keyHeight)需要修复，因涉及到pos.y和this.getAbsolutePosition().y，
              //  在判断Y轴存在后执行修复操作

              let workOrderY = keyHeight;

              // 当前Y轴不存在
              if (!keyHeight) continue;

              /**
               *  修复Y轴
               *  pos.y和this.getAbsolutePosition().y已被减去translateY，keyHeight也需要扣除相关值
               */
              keyHeight -= translateY;

              if (Ydirection === 'up') {
                if (
                  pos.y + Math.floor(self.data.height / 2) > keyHeight + yAxis.y &&
                  pos.y + Math.floor(self.data.height / 2) < keyHeight + yAxis.y + self.data.height
                ) {
                  posy = keyHeight + yAxis.y;
                  inf.y = workOrderY;

                  if (name === inf.originProductLine) {
                    if (inf.occupyCellN) {
                      posy += inf.occupyCellN * yAxis.cell.height;
                      inf.y += inf.occupyCellN * yAxis.cell.height;
                    }
                  }
                  inf.productLine = mm[m].key;
                  break;
                }
              } else if (Ydirection === 'down') {
                if (
                  pos.y + Math.floor(self.data.height / 2) > keyHeight + yAxis.y &&
                  pos.y + Math.floor(self.data.height / 2) < keyHeight + yAxis.y + self.data.height
                ) {
                  posy = keyHeight + yAxis.y;
                  inf.y = workOrderY;

                  inf.productLine = mm[m].key;
                  if (name === inf.originProductLine) {
                    if (inf.occupyCellN) {
                      posy += inf.occupyCellN * yAxis.cell.height;
                      inf.y += inf.occupyCellN * yAxis.cell.height;
                    }
                  }
                  break;
                }
              }
            }
          }
          // 表格元素发布事件，该事件必须放于文本和提示框更新之前，后面依赖变更最新的内容
          self.gantt.$sub.notifyObserver({ type: 'time', cell: inf, currentTime, offsetTime });

          // drag callback
          if (originOptions.onCellDrag) {
            originOptions.onCellDrag(inf, currentTime, offsetTime);
          }
          drawLiner.draw(inf);
          // if (drawLiner.isDraw) {
          //   drawLiner.hide();
          // }

          // Text文本变更
          self.workOrderController.setWorkOrderData(originData);
          this.find('Text')[0].text(self.workOrderController.getContent());

          // tooltip update position/content
          tooltip.positionUpdate({
            x: inf.x + xAxis.x - store.get('scrollDiv').scrollDiv.scrollLeft,
            y: util.yMap.getY(inf.productLine) + (inf.originProductLine === inf.productLine ? occupyCellN * yAxis.cell.height : 0) + self.data.height - offsetY + yAxis.y - store.get('scrollDiv').scrollDiv.scrollTop,
          }, this);
          tooltip.contentUpdate(originData.taskTooltipsContent);
          overWorkorderTooltip.hide();

          return {
            x: pos.x,
            y: posy,
          };
        },
      });
      group.originY = group.y(); //暂存Y值，当改变工单内容时备用
      group.originData = originData;
      group.gradient = options.rect.gradient;
      group.inf = inf;
      group.identify = 'workorder';
      // 每个工单都有一个样式控制对象
      WorkOrderFilter.cacheStatus.defaultStyle = {
        rect: { fill: options.rect.fill },
        text: { fill: options.text.fill },
      };
      let rectConfig = {
        id: 'bg',
        width,
        height: rectHeight,
        perfectDrawEnabled: false,
      };
      if (group.gradient) {
        rectConfig = {
          ...rectConfig,
          fillLinearGradientStartPoint: {
            x: 0,
            y: 0,
          },
          fillLinearGradientEndPoint: {
            x: width,
            y: rectHeight,
          },
          fillLinearGradientColorStops: [0, util.hex2decimal(options.rect.fill), 1, util.hex2decimal(options.rect.fill, gradientVal)],
        };
      } else {
        rectConfig = { ...rectConfig, ...options.rect };
      }
      let rect = new Konva.Rect(rectConfig);
      let text = new Konva.Text({
        id: 'text',
        width: width + options.text.offsetX,
        text: self.workOrderController.getContent(),
        listening: false,
        ...options.text,
        height: rectHeight,
      });

      rect.identify = 'workorder';
      text.identify = 'workorder';

      let progress = new Konva.Rect({
        id: 'progress',
        width: width * options.progress.percent / 100,
        y: rectHeight - options.progress.height,
        listening: false,
        ...options.progress,
        fill: options.progress.color || options.progress.fill,
      });
      progress.identify = 'workorder';

      group.add(rect);
      group.add(progress);
      //例外
      if (warnningFlag) {
        let exception = new Konva.Rect({
          id: 'warnning',
          width: options.exception.width,
          height: rect.height(),
          fill: options.exception.color || options.exception.fill,
        });
        exception.identify = 'workorder';

        group.add(exception);
        rect.x(options.exception.width);
        rect.width(rect.width() - options.exception.width);
        progress.x(options.exception.width);
        progress.width(rect.width() * options.progress.percent / 100);
      }

      /** 固定添加星号*/
      if (!originData.movable) {
        const pinnedStart = new Konva.Star({
          id: '*',
          listening: false,
          numPoints: 5,
          innerRadius: 5,
          outerRadius: 8,
          fill: 'red',
          strokeWidth: 0,
        });
        group.add(pinnedStart);
      }
      // text.text(self.workOrderController.getContent());
      group.add(text);
      layer.add(group);
      // group.cache();

      // 事件绑定
      tween = new SelectedStatus(group.find('#bg')[0], 'cellSelectedColor', layer);
      let clickStatus = { click: false };
      let disableSelectStatus = () => {
        overWorkorderTooltip.hide();
        tween.end();
        clickStatus.click = false;
      };
      eventBind.bind(group, {
        /**
         * 处理提示框呈现
         * @param evt
         * @param flag
         */
        mouseenter: (evt, flag) => {
          if (flag.click === false) tween.start();
          let scrollDiv = store.get('scrollDiv').scrollDiv;
          let pos = {
            x: inf.x - scrollDiv.scrollLeft + xAxis.x,
            y: util.yMap.getY(inf.productLine) + (inf.originProductLine === inf.productLine ? occupyCellN * yAxis.cell.height : 0) + self.data.height - offsetY + yAxis.y - store.get('scrollDiv').scrollDiv.scrollTop,
          };

          // 提示框提示
          tooltip.show();
          tooltip.positionUpdate(pos, group);
          tooltip.contentUpdate(originData.taskTooltipsContent);
          scrollDiv.style.cursor = 'pointer';
        },
        /**
         * 处理提示框消失
         * @param evt
         * @param flag
         */
        mouseleave: (evt, flag) => {
          if (flag.click === false) {
            if (tween) tween.end();
          }
          let scrollDiv = store.get('scrollDiv').scrollDiv;
          scrollDiv.style.cursor = 'default';
          tooltip.hide();
          self.gantt.axisLayer.yaxis.clearPriority();
          self.gantt.axisLayer.yaxis.setIsDrawing(false);
        },
        /**
         * 处理工单选中取消，覆盖工单呈现
         * @param evt
         * @param flag
         */
        click: (evt, flag) => {
          flag.click = !flag.click;
          if (flag.click === true) {
            if (originOptions.workOrderMultiple) { // 多选
              if (!store.get('selectedCells')) {
                store.set('selectedCells', []);
              }
              store.get('selectedCells').push(inf);
            } else { // 单选
              let disableSelectStatusFn = self.selectedStatus[0];
              if (util.isFunction(disableSelectStatusFn)) disableSelectStatusFn();
              self.selectedStatus = [disableSelectStatus];
              store.set('selectedCells', [inf]);
            }
            // 显示工单依赖
            drawLiner.draw(inf);
            // 按下shift键,筛选出覆盖的工单
            if(evt.evt.shiftKey){
              let overWorkorder = self.filterOverWorkorder(inf);
              if (overWorkorder.length > 0) {
                let scrollDiv = store.get('scrollDiv').scrollDiv;
                let pos = {
                  x: inf.x - scrollDiv.scrollLeft + xAxis.x,
                  y: util.yMap.getY(inf.productLine) + (inf.originProductLine === inf.productLine ? occupyCellN * yAxis.cell.height : 0) + self.data.height - offsetY + yAxis.y - store.get('scrollDiv').scrollDiv.scrollTop,
                };
                overWorkorderTooltip.customContent(dom => {
                  let ul = document.createElement('ul');
                  ul.style.cssText = ['margin:0', 'padding:0', 'list-style:none'].join(';') + ';';
                  overWorkorder.forEach(workorder => {
                    let li = document.createElement('li');
                    let MAKE_ORDER_NUM = workorder.originData.taskTooltipsContent[util.fields.getField('makeOrderNum')];
                    li.style.cssText = ['cursor:pointer'].join(';') + ';';
                    li.innerHTML = `<span>工单号:</span> ${MAKE_ORDER_NUM}`;
                    li.setAttribute('data-MAKE_ORDER_NUM', MAKE_ORDER_NUM);
                    ul.appendChild(li);
                  });
                  ul.addEventListener('click', ev => {
                    if (ev.target.nodeName === 'LI') {
                      let MAKE_ORDER_NUM = ev.target.getAttribute('data-MAKE_ORDER_NUM');
                      self.setWorkorderZindex(MAKE_ORDER_NUM);
                      overWorkorderTooltip.hide();
                    }
                  });
                  dom.appendChild(ul);
                });
                // 筛选工单提示
                overWorkorderTooltip.show();
                overWorkorderTooltip.positionUpdate(pos, group);
              }
            }
          } else {
            drawLiner.clear();
            overWorkorderTooltip.hide();
            if (originOptions.workOrderMultiple) { // 多选
              const selectedCells = store.get('selectedCells');
              const index = selectedCells.findIndex(cell => cell.id === inf.id);
              selectedCells.splice(index, 1);
            } else {  // 单选
              self.selectedStatus = [];
              store.set('selectedCells', []);
            }
          }
        },
        /**
         * 处理工单拖动,工单拖动计数,工单拖动闪烁
         */
        dragend: () => {
          if (group.originLayer) {
            group.moveTo(group.originLayer);
            group.originLayer.draw();
            group.originLayer = null;
            dragLayer.draw();
            group.stopDrag();
          }
          /** 处理工单闪烁 */
          if (self.mdk.enabled) {
            self.mdk.add(group);
            self.mdk.addLayer(layer);
            self.mdk.startTwinkle();
          }

          let modifyIndex = self.workOrderModifyIndex.increase();
          self.gantt.$sub.notifyObserver({ type: 'modifyIndex', cell: inf, modifyIndex });


          /** 记录闪烁工单 */
          if (self.mdk.enabled) {
            self.gantt.$sub.notifyObserver({ type: 'twinkly', cell: inf, modifyIndex });
          }
        },
        /**
         * 工单拖动优化，将工单移动到专门的拖动层
         * @param evt
         */
        mousedown: (evt) => {
          let group = evt.currentTarget;
          // 避免重复移动
          if (group.draggable() === false || group.originLayer) return;
          let layer = group.getLayer();
          group.originLayer = layer;
          group.moveTo(dragLayer);
          layer.draw();
          dragLayer.draw();
          group.startDrag();
        },
        /**
         * 工单拖动优化，将工单移回到之前所属层
         * @param evt
         */
        mouseup: (evt) => {
          if (group.originLayer) {
            group.moveTo(group.originLayer);
            group.originLayer.draw();
            group.originLayer = null;
            dragLayer.draw();
          }
        },
      }, clickStatus);
      return group;
    }
  }

  /**
   * 状态（name）过滤工单
   * @param status
   * @param option
   */
  filterWorkOrderStatus(status, option, filterFn) {
    let workOrderFilter = this.workOrderFilter;
    workOrderFilter.processWorkOrderStatus(status, option, false, filterFn);
  };

  /**
   * id过滤工单
   * @param id
   */
  filterWorkOrderById(id) {
    let workOrderFilter = this.workOrderFilter;
    workOrderFilter.processWorkOrderId(id);
  }

  /**
   * field过滤工单
   * @param value 过滤的值
   * @param field 对应taskTooltipsContent的域
   */
  filterWorkOrderByField(value, field) {
    let workOrderFilter = this.workOrderFilter;
    workOrderFilter.processWorkOrderByFieldFuzzy(value, field);
  }

  /**
   * id过滤工单
   * @param id
   */
  filterWorkOrderByFlag(flag) {
    let workOrderFilter = this.workOrderFilter;
    workOrderFilter.processWorkOrderByFlag(flag);
  }

  /**
   * 筛选出覆盖的工单
   */
  filterOverWorkorder(inf) {
    let start = inf.x;
    let end = inf.x + inf.width;
    let y = inf.y;
    let dealtData = this.dealtData;
    let overWorkorder = dealtData.filter(workorder => {
      let o_start = workorder.x;
      let o_end = workorder.x + workorder.width;
      let o_y = workorder.y;
      if (o_y === y && ((o_end > start && o_end < end) || (o_start > start && o_start < end) || (o_start < start && o_end > end))) {
        let group = this.workOrderFilter.dataMatchStatus(`.${workorder.originData.taskTooltipsContent[util.fields.getField('makeOrderNum')]}`);
        if (group[0] && group[0].visible()) return true;
      }
    });

    return overWorkorder;
  }

  setWorkorderZindex(MAKE_ORDER_NUM) {
    let workOrderFilter = this.workOrderFilter;
    let selectWorkorder = workOrderFilter.dataMatchStatus(MAKE_ORDER_NUM, util.fields.getField('makeOrderNum'), { fieldFuzzy: true });
    console.log('selectWorkorder',selectWorkorder);
    console.log('MAKE_ORDER_NUM',MAKE_ORDER_NUM);
    console.log('workOrderFilter',workOrderFilter);
    selectWorkorder.forEach(wo => {
      wo.zIndex(999);
      wo.fire('mouseenter');
      wo.fire('click');
      wo.parent.draw();
    });
  }

  /**
   * 根据工单name设置是否可以拖动
   * @param {string| string[]} name
   * @param {boolean} dragable
   */
  setWorkOrderDragable(name, dragable) {
    let nameStr;
    let self = this;
    if (typeof name === 'string') {
      nameStr = `.${name}`;
    } else if (util.isArray(name)) {
      nameStr = name.map(n => `.${n}`).join(',');
    }
    if (nameStr === '') return;

    const wds = this.workOrderFilter.dataMatchStatus(nameStr);
    wds.forEach(w => {
      w.draggable(dragable);
      if (dragable) {
        w.find('Star').destroy();
      } else {
        const pinnedStart = new Konva.Star({
          id: '*',
          listening: false,
          numPoints: 5,
          innerRadius: 5,
          outerRadius: 8,
          fill: 'red',
          strokeWidth: 0,
        });
        w.add(pinnedStart);
      }
      w.parent.draw();

      self.gantt.$sub.notifyObserver({ type: 'dragable', cell: w.inf, dragable });
    });
  }

  /**
   * 缓存工单入口
   */
  cacheWorkOrderFilterCenter() {
    let workOrderFilter = this.workOrderFilter;
    workOrderFilter.workOrderCacheCenter(); // 状态记录
  }

  dealWithData(originData) {
    let getx = util.getX;
    let yaxis = store.get('yaxis').options;
    let dealtWOData = [];
    let preLoadRang = store.get('xaxis').dealt.preLoadRang;
    let startX = preLoadRang.startX;
    let endX = preLoadRang.endX;
    let isLazyLoad = store.get('stage').options.lazyLoad; //判断是否懒加载模式
    let fixedHeight = store.get('fixedHeight');
    originData.forEach((order, od) => {
      let tasks = order.tasks;
      let belong = order.belong;
      tasks.forEach((task, td) => {
        let y = util.yMap.getY(task.productLine);
        // y为false 则当前无这条产线（筛选）
        if (y === false) return;

        if (task.occupyCellN) {
          if (task.originProductLine) {
            if (task.originProductLine === task.productLine) {
              y += yaxis.cell.height * task.occupyCellN;
            }
          } else {
            y += yaxis.cell.height * task.occupyCellN;
          }
        }

        let from = getx.fromTime(task.from);
        let width = getx.getWidth(task.from, task.to);
        let to = from + width;
        if (isLazyLoad) {
          if (to < startX || from > endX) return;
        }
        let handbill = {
          id: task.id,
          name: `${task.flag} ${belong}`,
          productLine: task.productLine,
          originProductLine: task.originProductLine || task.productLine,
          y: y,
          x: from,
          width,
          occupyCellN: task.occupyCellN || 0,
          height: fixedHeight || yaxis.cell.height,
          originData: task,
          dimension: { od, td }, //在原始数组所处的维度
          exception: task.exception, //例外
          progress: task.progress, //完成百分比
        };
        dealtWOData.push(handbill);
      });
    });
    console.log('当前屏存在工单数:', dealtWOData.length);
    return dealtWOData;
  }
}

WorkOrder.defaultOption = {
  style: {
    rect: {
      fill: '#b8c2cc',
      height: 40,
      shadowColor: 'transparent',
      gradient: true, // 是否渐变,默认开启，即为fill到fill透明的渐变
    },
    text: {
      wrap: 'none',
      // padding: 4,
      lineHeight: 1.2,
      verticalAlign: 'middle',
      fontFamily: '微软雅黑',
      fontWeight: '100',
      fill: '#f8fbff',
      offsetX: -18,
      height: 40,
    },
    exception: {
      width: 6,
      fill: '#e76f6f',
    },
    progress: {
      height: 2,
      fill: '#4079d0',
    },
  },
};

// 过滤WorkOrder数据/缓存上一次过滤条件,引用源数据，主要用于控制工单的样式（rect,text颜色）
class WorkOrderFilter {
  constructor(layers, gantt) {
    this.setLayers(layers);
    this.gantt = gantt;
    this.filterData = [];
    // 是否需要缓存
    this.needCache = false;
  }

  setLayers(layers) {
    this.layers = layers || null;
  }

  getData() {
    return this.filterData;
  }

  clear() {
    this.filterData = [];
    this.layers = null;
  }

  /**
   * 过滤工单
   * @param {string || same} status 查询字符串，为same则是匹配模式（寻找具有相同字节的工单）
   * @param option
   * @param {{}} type 查询类型
   * @return {Array}
   */
  dataMatchStatus(status, option, type = { fieldFuzzy: false }) {
    let statusWorkOrder = [];
    let layers = this.layers;
    status = status || 'Group';
    if (layers[0] === null) {
      return statusWorkOrder;
    }
    if (status === 'same') {
      statusWorkOrder = this.statusBySameFiled(option);
    } else if (type.fieldFuzzy) {
      statusWorkOrder = this.statusByFiledFuzzy(status, option);
    } else {
      statusWorkOrder = this.statusByDefault(status);
    }
    return statusWorkOrder;
  }

  /**
   * 根据选中的工单的某个域来全匹配工单
   */
  statusBySameFiled(option) {
    let statusWorkOrder = [];
    let layers = this.layers;
    let selectWorkorders = this.gantt.getSeletctedCells();
    let selectWorkorder = null, filterFiled = null;
    // 单选匹配
    if (selectWorkorders.length === 1) {
      selectWorkorder = selectWorkorders[0];
    }
    if (!selectWorkorder) return statusWorkOrder;
    filterFiled = selectWorkorder.originData.taskTooltipsContent[option.field];
    layers.forEach(layer => {
      let fixed = layer.getChildren(node => node.originData.taskTooltipsContent[option.field] === filterFiled);
      statusWorkOrder = [...statusWorkOrder, ...fixed];
    });
    return statusWorkOrder;
  }

  /**
   * 默认根据status来匹配工单，即原始的find方法
   * @param {string} status
   */
  statusByDefault(status) {
    let statusWorkOrder = [];
    let layers = this.layers;
    layers.forEach(layer => {
      let fixed = layer.find(status);
      statusWorkOrder = [...statusWorkOrder, ...fixed];
    });
    return statusWorkOrder;
  }

  /**
   * 根据给的某个域模糊匹配工单
   * @param status 匹配条件
   * @param option 匹配的域
   */
  statusByFiledFuzzy(status, option) {
    let statusWorkOrder = [];
    let layers = this.layers;
    layers.forEach(layer => {
      let fixed = layer.find(node => {
        return node.originData && node.originData.taskTooltipsContent && node.originData.taskTooltipsContent[option] && ~node.originData.taskTooltipsContent[option].indexOf(status);
      });
      statusWorkOrder = [...statusWorkOrder, ...fixed];
    });
    return statusWorkOrder;
  }

  /**
   * 工单过滤缓存统一入口,
   * 因为懒加载的时候需要依赖目前的过滤条件加载工单
   * 所以需要记录过滤条件并过滤
   */
  workOrderCacheCenter() {
    // 状态缓存
    if (WorkOrderFilter.cacheStatus.status) {
      this.cacheProcessWorkOrderStatus();
    }

    // id缓存
    if (WorkOrderFilter.cacheId.status) {
      this.cacheProcessWorkOrderId();
    }

    // flag缓存
    if (WorkOrderFilter.cacheFlag.status) {
      this.cacheProcessWorkOrderFlag();
    }

    // field缓存
    if (WorkOrderFilter.cacheField.status) {
      this.cacheProcessWorkOrderField();
    }

  }

  /**
   * 记录当前工单的过滤状态
   */
  cacheProcessWorkOrderStatus() {
    let cacheStatus = WorkOrderFilter.cacheStatus;
    let isNeedStatusFilter = cacheStatus.status;
    let status, option;
    if (isNeedStatusFilter) {
      status = cacheStatus.status;
      option = cacheStatus.option;
    } else if (!cacheStatus.isDefault) {
      let style = cacheStatus.defaultStyle;
      option = style;
      cacheStatus.isDefault = true;
    } else {
      return;
    }

    this.processWorkOrderStatus(status, option, true);
  }

  /**
   * 记录当前工单的过滤id
   */
  cacheProcessWorkOrderId() {
    let cacheId = WorkOrderFilter.cacheId;
    let isNeedIdFilter = cacheId.status;
    let Id;
    if (isNeedIdFilter) {
      Id = cacheId.Id;
    }
    this.processWorkOrderId(Id);
  }

  cacheProcessWorkOrderFlag() {
    let cacheFlag = WorkOrderFilter.cacheFlag;
    let isNeedFlagFilter = cacheFlag.status;
    let flag;
    if (isNeedFlagFilter) {
      flag = cacheFlag.flag;
    }
    this.processWorkOrderByFlag(flag);
  }

  cacheProcessWorkOrderField() {
    let cacheField = WorkOrderFilter.cacheField;
    let isNeedFieldFilter = cacheField.status;
    let field, value;
    if (isNeedFieldFilter) {
      value = cacheField.value;
      field = cacheField.field;
    }
    this.processWorkOrderByFieldFuzzy(value, field);
  }

  /**
   * 根据工单状态过滤工单（原理是根据工单的name来过滤）
   * @param status 状态，元素id或者类名
   *
   * 0.恢复模式
   * 不传则默认恢复格式，取上一次的设置
   *
   * 1.过滤模式
   * 根据配置的flag来过滤工单，并从配置中的moStatusColor域来取色 或 自定义配色
   * status = `.moStatus`;
   * option = 'moStatusColor'; | option =  {
        rect: { fill: 'pink' },
        text: { fill: 'yellow' },
      },
   *
   * 2.选中比较模式
   * same，根据选中的工单的taskTooltipsContent某个域比较,返回相等的工单,eg:
   * 根据选中工单的taskTooltipsContent的ITEM_CODE域做为条件，过滤工单中ITEM_CODE相等的工单，并从配置中的sameItemCodeColor域来取色
   * status = `same`;
   * option = { field: 'ITEM_CODE', color: 'sameItemCodeColor' };
   *
   *
   * @param option 配置，元素的样式改变 ，格式为多种 如果是字符串 则为映射到配置的某个颜色域
   *
   * @param isCache 是否缓存调用，缓存点用无需再缓存
   * @param filterFn 过滤函数，返回true则为符合条件工单
   * style = {
      rect: { fill: 'red' },背景
      text: {}, 文字
    }
   */
  processWorkOrderStatus(status, option, isCache = false, filterFn) {
    let cacheStatus = WorkOrderFilter.cacheStatus;
    let data = this.dataMatchStatus(status, option);

    if (status === '' || status === undefined) {
      cacheStatus.status = false;
      option = cacheStatus.defaultStyle;
    } else if (!isCache) {
      cacheStatus.status = status;
      cacheStatus.option = option;
      cacheStatus.isDefault = false;
    }
    if (data.length !== 0) {
      this.processDraw(data, option, filterFn);
    }
    this.filterData = data;
  }

  processDraw(data, option, filterFn) {
    let options = store.get('options');
    data.forEach(group => {
      if (filterFn && util.isFunction(filterFn)) {
        let isFilter = filterFn(group);
        if (!isFilter) return;
      }

      let isChanged = false;
      let bg = null, text = null;
      let bgConfig = null, textConfig = null;
      group.getChildren(node => {
        if (node.getId() === 'bg') {
          bg = node;
        }
        if (node.getId() === 'text') {
          text = node;
        }
      });

      // 如果传的是状态对应字段，则提取改字段颜色值
      // 字段颜色值可以是一个字符颜色，这样会默认为背景颜色，或者一个对象结构为{rect:{fill:'bgColor'},text:{fill:'textColr}}分别为背景颜色和文字颜色
      if (typeof option === 'string') {
        let colorVal = group.originData[option] || options[option];
        if (colorVal) {
          if (typeof colorVal === 'string') {
            if (group.gradient) {
              bgConfig = {
                fillLinearGradientStartPoint: {
                  x: 0,
                  y: 0,
                },
                fillLinearGradientEndPoint: {
                  x: bg.width(),
                  y: bg.height(),
                },
                fillLinearGradientColorStops: [0, util.hex2decimal(colorVal), 1, util.hex2decimal(colorVal, gradientVal)],
              };
            } else {
              bgConfig = { fill: colorVal };
            }
          } else if (util.isObject(colorVal)) {
            if (colorVal.rect) bgConfig = colorVal.rect;
            if (colorVal.text) textConfig = colorVal.text;
          }
        }
      } else if (option && typeof option.color === 'string') {
        let color = group.originData[option.color] || options[option.color];
        if (group.gradient) {
          bgConfig = {
            fillLinearGradientStartPoint: {
              x: 0,
              y: 0,
            },
            fillLinearGradientEndPoint: {
              x: bg.width(),
              y: bg.height(),
            },
            fillLinearGradientColorStops: [0, util.hex2decimal(color), 1, util.hex2decimal(color, gradientVal)],
          };
        } else {
          bgConfig = { fill: color };
        }
      } else {
        if (option && option.rect && util.isObject(option.rect)) {
          if (option.rect.gradient) {
            bgConfig = {
              ...option.rect,
              fillLinearGradientStartPoint: {
                x: 0,
                y: 0,
              },
              fillLinearGradientEndPoint: {
                x: bg.width(),
                y: bg.height(),
              },
              fillLinearGradientColorStops: [0, util.hex2decimal(option.rect.fill), 1, util.hex2decimal(option.rect.fill, gradientVal)],
            };
            delete bgConfig.fill;
          } else {
            bgConfig = option.rect;
          }
        }

        if (option && option.text && util.isObject(option.text)) {
          textConfig = option.text;
        }
      }

      if (bgConfig) {
        bg && bg.setAttrs(bgConfig);
        isChanged = true;
      }
      if (textConfig) {
        text && text.setAttrs(textConfig);
        isChanged = true;
      }

      /* if (isChanged) {
         group.draw();
       }*/

    });
    this.layersDraw();
  }

  /**
   * 根据工单的Id过滤工单 （原理是根据工单的ID来过滤）
   * @param Id [string]
   */
  processWorkOrderId(Id, isCache = false) {
    let allData = this.dataMatchStatus();
    if (Id === '' || Id === undefined) {
      WorkOrderFilter.cacheId.status = false;
      WorkOrderFilter.cacheId.Id = [];
      allData.forEach(group => {
        group.visible(true);
      });
      this.layersDraw();
    } else {
      WorkOrderFilter.cacheId.status = true;
      WorkOrderFilter.cacheId.Id = Id;
      Id = Id.split(',');
      let data = this.dataMatchStatus(`#${Id[0]}`);
      // 隐藏全部
      allData.forEach(group => {
        group.visible(false);
      });
      // 显示过滤的
      data.forEach(group => {
        group.visible(true);
      });
      this.layersDraw();
    }
  }

  processWorkOrderByFieldFuzzy(value, field) {
    let allData = this.dataMatchStatus();
    if (value === '' || value === undefined) {
      WorkOrderFilter.cacheField.status = false;
      WorkOrderFilter.cacheField.value = '';
      WorkOrderFilter.cacheField.field = '';
      allData.forEach(group => {
        group.visible(true);
      });
      this.layersDraw();
    } else {
      WorkOrderFilter.cacheField.status = true;
      WorkOrderFilter.cacheField.value = value;
      WorkOrderFilter.cacheField.field = field;
      let data = this.dataMatchStatus(value, field, { fieldFuzzy: true });
      // 隐藏全部
      allData.forEach(group => {
        group.visible(false);
      });
      // 显示过滤的
      data.forEach(group => {
        group.visible(true);
      });
      this.layersDraw();
    }
  }

  processWorkOrderByFlag(flag) {
    let allData = this.dataMatchStatus();
    if (flag === '' || flag === undefined) {
      WorkOrderFilter.cacheFlag.status = false;
      WorkOrderFilter.cacheFlag.flag = '';
      allData.forEach(group => {
        group.visible(true);
      });
      this.layersDraw();
    } else {
      WorkOrderFilter.cacheFlag.status = true;
      WorkOrderFilter.cacheFlag.flag = flag;
      flag = flag.split(',').map(f => `.${f}`).join();
      let data = this.dataMatchStatus(flag);
      // 隐藏全部
      allData.forEach(group => {
        group.visible(false);
      });
      // 显示过滤的
      data.forEach(group => {
        group.visible(true);
      });
      this.layersDraw();
    }
  }

  /**
   * 重绘工单层
   */
  layersDraw() {
    let layers = this.layers;
    layers.forEach(layer => {
      layer.draw();
    });
  }
}

// 状态缓存
WorkOrderFilter.cacheStatus = { status: false, option: false, isDefault: true, defaultStyle: {} };
// id缓存
WorkOrderFilter.cacheId = { status: false, Id: [] };
// flag缓存
WorkOrderFilter.cacheFlag = { status: false, flag: '' };
// value缓存
WorkOrderFilter.cacheField = { status: false, value: '', field: '' };

/**
 * 工单的文本控制对象，主要作用文本的呈现和计算文本的高度
 *
 * 流程
 * 1.
 * 变量初始化
 * 判断是否有控制呈现字段缓存，有读取，无存缓存
 *
 *
 *
 */
class WorkOrderContentController {
  constructor(config) {
    this.height = 0;
    this.baseHeight = 10;
    this.baseLineHeight = 15;
    this.fields = config.fields;
    if (WorkOrderContentController.cacheFiledsBoolean.status) {
      this.fieldsBoolean = WorkOrderContentController.cacheFiledsBoolean.fieldsBoolean;
    } else {
      this.fieldsBoolean = config.fieldsBoolean;
      WorkOrderContentController.cacheFiledsBoolean.fieldsBoolean = config.fieldsBoolean;
    }
    this.workOrderData = config.workOrderData;
    this.displayFields = [];
    this.textContent = '';
    this.processDisplayFields();
  }

  /**
   * 设置需要呈现的字段
   * @param fieldsBoolean
   * @return {boolean} 返回true则当前设置与原设置相同，无需触发改变
   */
  setDisplayFields(fieldsBoolean) {
    let isEqual = true;
    if (fieldsBoolean) {
      fieldsBoolean = fieldsBoolean.slice();
      let cacheFiledsBoolean = WorkOrderContentController.cacheFiledsBoolean.fieldsBoolean;
      for (let i = 0, len = fieldsBoolean.length; i < len; i++) {
        if (fieldsBoolean[i] !== cacheFiledsBoolean[i]) {
          isEqual = false;
          break;
        }
      }
      if (isEqual) return isEqual;
      WorkOrderContentController.cacheFiledsBoolean.status = true;
      this.fieldsBoolean = fieldsBoolean;
      WorkOrderContentController.cacheFiledsBoolean.fieldsBoolean = fieldsBoolean;
    } else {
      this.fieldsBoolean = WorkOrderContentController.cacheFiledsBoolean.fieldsBoolean;
    }
    this.processDisplayFields();
    this.setWorkOrderData();
    return isEqual;
  }

  /**
   * 生成呈现字段和文本高度
   * @return {string}
   */
  processDisplayFields() {
    let fieldsBoolean = this.fieldsBoolean;
    let fields = this.fields;
    let displayFields = [];
    fieldsBoolean.forEach((field, index) => {
      if (field) {
        displayFields.push(fields[index]);
      }
    });
    this.displayFields = displayFields;

    this.height = this.baseHeight + (displayFields.length ? displayFields.length : 2) * this.baseLineHeight;
  }

  /**
   * 获取文本呈现
   * @return {*}
   */
  getContent() {
    return this.textContent;
  }

  getContentHeight() {
    return this.height;
  }

  setWorkOrderData(workOrderData) {
    if (workOrderData) {
      this.workOrderData = workOrderData;
    }
    let textContent = '';
    let displayFields = this.displayFields;
    let taskContent = this.workOrderData.taskTooltipsContent;
    displayFields.forEach(field => {
      textContent += `${taskContent[field]}\n`;
    });
    this.textContent = textContent;
  }

  clearCache() {
    WorkOrderContentController.cacheFiledsBoolean.status = false;
    WorkOrderContentController.cacheFiledsBoolean.fieldsBoolean = [];
  }

}

WorkOrderContentController.cacheFiledsBoolean = { status: false, fieldsBoolean: [] };

// 计数器
class WorkOrderModifyIndex {
  constructor() {
    this.flag = null;
  }

  // 当前后值不同 才执行自增
  caseIncrease(flag, step) {
    if (this.flag !== flag) {
      this.flag = flag;
      this.increase(step);
    }
  }

  caseReduce(flag, step) {
    if (this.flag !== flag) {
      this.flag = flag;
      this.increase(step);
    }
  }

  increase(step = 1) {
    WorkOrderModifyIndex.index += step;
    return WorkOrderModifyIndex.index;
  }

  reduce(step = 1) {
    WorkOrderModifyIndex.index -= step;
    return WorkOrderModifyIndex.index;
  }

  reset() {
    WorkOrderModifyIndex.index = 0;
  }
}

WorkOrderModifyIndex.index = 0;

// 当工单高度变化时，匹配所有Y轴，网格等高度
class HeightFixed {
  constructor(gantt) {
    let stage = store.get('stage').stage;
    let fakeDom = store.get('fakeDom');
    let observer = new Observer(this);
    observer.setUpdate(function(height) {
      store.set('fixedHeight', height);
      gantt.reset();
      gantt.draw();
    });
    odf(this, '$ob', { value: observer, enumerable: false, writable: true, configurable: true });
  }
}

// Y轴日历
class Calendars {
  constructor(options) {
    let data = options.data;
    let yaxis = store.get('yaxis').options;
    let xaxis = store.get('xaxis').options;
    this.group = new Konva.Group({
      id: options.id,
      x: yaxis.cell.width,
      y: xaxis.height,
      hitGraphEnabled: false,
    });
    try {
      this.dealtData = this.processData(data);
    } catch (e) {

    }
  }

  processData(data) {
    let getx = util.getX;
    let yaxis = store.get('yaxis').options;
    let dealtData = [];
    let preLoadRang = store.get('xaxis').dealt.preLoadRang;
    let startX = preLoadRang.startX;
    let endX = preLoadRang.endX;
    let isLazyLoad = store.get('stage').options.lazyLoad; //判断是否懒加载模式
    let fixedHeight = store.get('fixedHeight');
    data.forEach(c => {
      let calendar = {};
      calendar.y = util.yMap.getY(c.productLine);
      if (!calendar.y) return;
      let from = getx.fromTime(c.start);
      let width = getx.getWidth(c.start, c.end);
      let to = from + width;
      if (isLazyLoad) {
        if (to < startX || from > endX) return;
      }
      calendar.height = fixedHeight || yaxis.cell.height;
      calendar.x = util.getX.fromTime(c.start);
      calendar.width = util.getX.getWidth(c.start, c.end);
      calendar.fill = c.color;
      dealtData.push(calendar);
    });
    return dealtData;
  }

  draw(data) {
    data = this.dealtData;
    if (!data || data.length === 0) return;
    let layer = this.group;
    data.forEach(cd => {
      let rect = new Konva.Rect({
        ...cd,
      });
      layer.add(rect);
    });
  }

  heightUpdate(height) {
    let rects = this.group.find('Rect');
    rects.forEach(rect => {
      let y = rect.y();
      let originHeight = rect.height();
      let row = Math.floor(y / originHeight);
      rect.y(height * row);
      rect.height(height);
    });
    this.group.draw();
  }
}

// Tooltip
class Tooltip {
  constructor(outDiv, overOrder) {
    this.dom = util.createTooltip(overOrder);
    this.showStatus = false;
    this.tipMapFileds = null;
    this.outDiv = outDiv;
    outDiv.appendChild(this.dom);
  }

  setMapFileds(mapFileds) {
    this.tipMapFileds = mapFileds;
  }

  show() {
    if (this.showStatus === false) {
      this.dom.style.display = 'block';
      this.showStatus = true;
    }
  }

  hide() {
    if (this.showStatus === true) {
      this.dom.style.display = 'none';
      this.showStatus = false;
    }
  }

  positionUpdate(pos, group) {
    let posbd = this.boundaryDetection(pos, group);
    if (pos.x) {
      this.dom.style.left = `${posbd.posX}px`;
    }
    if (pos.y) {
      this.dom.style.top = `${posbd.posY}px`;
    }
  }

  boundaryDetection(pos, group) {
    let posX = pos.x, posY = pos.y;
    let outDiv = this.outDiv;
    let boundaryBottom = outDiv.clientHeight;
    let boundaryRight = outDiv.clientWidth;
    let dom = this.dom;
    let domWidth = dom.offsetWidth;
    let domHeight = dom.offsetHeight;
    let groupHeight = group.height();

    if (posY + domHeight > boundaryBottom) {
      posY = posY - domHeight - groupHeight - 10;
      util.addClass(dom, 'up');
    } else {
      util.removeClass(dom, 'up');
    }

    if (posX + domWidth > boundaryRight) {
      posX = boundaryRight - domWidth;
      util.addClass(dom, 'right');
    } else if (posX < 0) {
      posX = 0;
    } else {
      util.removeClass(dom, 'right');
    }
    return { posX, posY };
  }

  contentUpdate(val) {
    let titleStr = this.tipMapFileds;
    let options = store.get('options');

    // 如果有用户自定义的提示框函数
    if (options.tooltip && util.isFunction(options.tooltip)) {
      options.tooltip(val, this.dom);
    } else {
      let htmlString = '';
      for (let name in titleStr) {
        htmlString += `<span>${titleStr[name]}：</span>${val[name]}</br>`;
      }
      this.dom.lastChild.innerHTML = htmlString;
    }
  }

  /**
   * 自定义内部内容
   * @param fn
   */
  customContent(fn) {
    this.dom.lastChild.innerHTML = '';
    if (util.isFunction(fn)) {
      fn(this.dom.lastChild);
    }
  }
}

// 工单鼠标移上切换
class SelectedStatus {
  constructor(node, field, layer) {
    let options = store.get('options');
    let selectColor = options[field] || 'red';
    let changeAttrs = { fill: selectColor };
    this.node = node;
    this.layer = layer;
    this.parentZindex = node.parent.zIndex();
    this.attrs = Object.assign({}, node.getAttrs());
    if (node.parent.gradient) {
      changeAttrs = {
        fillLinearGradientStartPoint: {
          x: 0,
          y: 0,
        },
        fillLinearGradientEndPoint: {
          x: node.parent.width(),
          y: node.parent.height(),
        },
        fillLinearGradientColorStops: [0, util.hex2decimal(selectColor), 1, util.hex2decimal(selectColor, gradientVal)],
      };
    }
    this.changeAttrs = changeAttrs;
  }

  start() {
    let node = this.node;
    let layer = this.layer;
    let attrs = Object.assign({}, node.getAttrs());
    this.attrs = attrs;
    let maxZIndex = layer.children.length - 1;
    node.setAttrs(this.changeAttrs);
    node.parent.zIndex(maxZIndex);
    layer.draw();
  }

  end() {
    let node = this.node;
    let layer = this.layer;
    let parent_zIndex = this.parentZindex;
    for (let key in node.attrs) {
      delete node.attrs[key];
    }
    node.setAttrs(this.attrs);
    node.parent.zIndex(parent_zIndex);
    layer.draw();
  }
}

// 事件绑定
class Binder {
  constructor() {
    this.events = {};
  }

  bind(eventSource, events, flag) {
    if (util.isObject(events)) {
      let keys = Object.keys(events);
      keys.forEach(key => {
        let fn = evt => events[key](evt, flag);
        eventSource.off(key).on(key, fn);
      });
    }
  }

  off(eventSource, events) {
    let keys = Object.keys(events);
    keys.forEach(key => {
      eventSource.off(key);
    });
  }
}

/**
 * 工单闪烁管理类
 * 主要管理工单的group,工单所在图层并控制其闪烁
 */
class ManagerDragWK {
  constructor(twinkle) {
    this.enabled = twinkle || false;
    this.list = {};
    this.layers = [];
    this.timeId = null;
    this.latestId = null;
  }

  addLayer(layer) {
    let isExist = false;
    this.layers.forEach(l => {
      if (l === layer) isExist = true;
    });
    !isExist && this.layers.push(layer);
  }

  deleteLayer(layer) {
    let idx = null;
    this.layers.forEach((l, i) => {
      if (l === layer) idx = i;
    });
    this.layers.splice(idx, 1);
  }

  emptyLayer() {
    this.layers = [];
  }

  add(wk) {
    if (!wk.id()) {
      console.log('need id');
      return;
    }
    this.list[wk.id()] = wk;
    this.latestId = wk.id();
  }

  delete(wk) {
    delete this.list[wk.id()];
  }

  /**
   * 获取最后操作的工单
   * @return {*}
   */
  getLatest() {
    return this.list[this.latestId] && this.list[this.latestId].originData;
  }

  setAllWkOpacity(val = 1) {
    for (let key in this.list) {
      this.list[key].opacity(val);
    }
  }

  twinkle(timeDiff = 80) {
    let increment = 1;
    return setInterval(() => {
      const keys = Object.keys(this.list);
      let op = this.list[keys[0]].opacity() * 10;
      if (op <= 0 || op >= 10) {
        increment = -increment;
      }
      for (let key in this.list) {
        const wk = this.list[key];
        let op = wk.opacity() * 10;
        op += increment;
        wk.opacity(op / 10);
      }
      this.layers.forEach(l => l.draw());
    }, timeDiff);
  }

  startTwinkle(timeDiff, val) {
    if (this.timeId) {
      clearInterval(this.timeId);
    }
    const keys = Object.keys(this.list);
    if (keys.length === 0) {
      return;
    }
    this.setAllWkOpacity(val);
    this.timeId = this.twinkle(timeDiff);
  }

  stopTwinkle() {
    if (this.timeId) {
      clearInterval(this.timeId);
    }
  }
}

class DrawLiner {
  // static cellWidth = store.get('cellWidth');
  // pathWorkOrderMapper = []; // 存放路径包含的工单，路径序列对应pathPaintsInf的路径序列

  constructor(id) {
    this.pathWorkOrderMapper = [];
    let x = store.get('xaxis').options.x;
    let y = store.get('yaxis').options.y;
    this.isDraw = false; //是否已经绘画了依赖路径
    this.layer = new Konva.Layer({
      id,
      x,
      y,
      hitGraphEnabled: false,
    });
    this.tipsLayer = new Konva.Layer({
      id: `${id}tips`,
      x,
      y,
    });
    this.drawColor = store.get('options').dependenceLineColor;
  }

  draw(workerOrder) {
    this.clear();
    let pathDep = []; // 存储已被遍历的节点
    pathDep.push(workerOrder.id);

    let pathDependencies = this.sourceDependencies(workerOrder, pathDep);
    this.pathWorkOrderMapper = [];
    this.pathWorkOrderMapper.push(pathDependencies);
    this.isDraw = true;
  }

  // 清理工单依赖
  clear() {
    this.hide();
    this.isDraw = false;
  }

  hide() {
    this.layer.clear();
    this.tipsLayer.clear();
    this.layer.destroyChildren();
    this.tipsLayer.destroyChildren();
  }

  drawLine(points, tips = null, randomColor = false) {
    let layer = this.layer;
    let tipsLayer = this.tipsLayer;
    let arrowPoints = points.splice(-2);
    let color = randomColor ? util.getColor() : this.drawColor;
    let timeGroup = null;
    /** 路径 */
    let line = new Konva.Line({
      stroke: color,
      points,
      strokeWidth: 3,
    });
    /** 箭头 */
    let arrow = new Konva.Arrow({
      points: arrowPoints,
      fill: color,
      pointerLength: 8,
      pointerWidth: 8,
    });

    layer.add(line);
    layer.add(arrow);
    line.draw();
    arrow.draw();

    /** 时间提示 */
    if (tips) {
      const timeTipsPoints = points.slice(4, 8);
      const timeHeight = 20;
      const yMaxHeight = store.get('yaxis').dealt.totalHeight - 40;
      let timeTipsX = Math.floor((timeTipsPoints[0] + timeTipsPoints[2]) / 2);
      const getY = timeTipsPoints[1] - Math.floor(timeHeight / 2);
      let timeTipsY = getY > yMaxHeight ? timeTipsPoints[1] - timeHeight : getY;
      let timeWidth;
      let isMinus = Number(tips.slice(0, -2)) < 0;
      let xAxis = store.get('xaxis').options;

      const timeText = new Konva.Text({
        text: tips,
        height: timeHeight,
        verticalAlign: 'middle',
        align: 'center',
        fill: isMinus ? 'red' : '#ffffff',
        listening: false,
      });
      timeWidth = timeText.width() + 8;
      timeText.width(timeWidth);

      timeGroup = new Konva.Group({
        x: timeTipsX - Math.floor(timeWidth / 2),
        y: timeTipsY,
        draggable: true,
        dragBoundFunc: function(pos) {
          let start = timeTipsPoints[0] + xAxis.x;
          let end = timeTipsPoints[2] + xAxis.x;
          if (start > end) {
            let tmp = start;
            start = end;
            end = tmp;
          }

          if (pos.x + timeWidth > end || pos.x < start) {
            pos.x = this.absolutePosition().x;
          }

          return {
            x: pos.x,
            y: this.absolutePosition().y,
          };
        },
      });

      const timeTips = new Konva.Rect({
        fill: isMinus ? '#edea19' : color,
        width: timeWidth,
        height: timeHeight,
      });

      timeGroup.add(timeTips);
      timeGroup.add(timeText);
      tipsLayer.add(timeGroup);
      timeGroup.draw();
    }

  }


  /**
   * 寻找工单依赖
   *
   * @param 传入工单，分子父2级自动递归寻找整条依赖
   */
  sourceDependencies(workerOrder, pathDep) {
    this.sourceDependenciesTo(workerOrder, pathDep);
    this.sourceDependenciesFrom(workerOrder, pathDep);
    return pathDep;
  }

  /**
   * 父级依赖
   */
  sourceDependenciesFrom(workerOrder, pathDep) {
    let dealtData = store.get('workOrder').dealtData;
    let toWorkOrderData = dealtData.find(d => d.id === workerOrder.id);
    let fromWorkOrderData = [];

    for (let i = 0, len = dealtData.length; i < len; i++) {
      let workorder = dealtData[i];
      let dependencies = workorder.originData.dependencies;
      let tips = null;
      let parent = dependencies.find(d => {
        if (d.to === toWorkOrderData.id) {
          tips = d.tips;
          return true;
        }
        return false;
      });
      if (parent) fromWorkOrderData.push({ w: workorder, tips });
    }

    if (fromWorkOrderData === undefined || fromWorkOrderData.length === 0) return;
    for (let i = 0, len = fromWorkOrderData.length; i < len; i++) {
      if (~pathDep.indexOf(fromWorkOrderData[i].w.id)) continue;
      pathDep.push(fromWorkOrderData[i].w.id);
      let path = this.sourcePoint(fromWorkOrderData[i].w, toWorkOrderData);
      let tips = fromWorkOrderData[i].tips;
      this.drawLine(path, tips);
      // this.sourceDependenciesFrom(fromWorkOrderData[i].w, pathDep); // 只遍历父级
      this.sourceDependencies(fromWorkOrderData[i].w, pathDep);
    }

  }

  /**
   * 子级依赖
   */
  sourceDependenciesTo(workerOrder, pathDep) {
    let dealtData = store.get('workOrder').dealtData;
    let fromWorkOrderData = dealtData.find(d => d.id === workerOrder.id);
    if (workerOrder.originData.dependencies) {
      let dependencies = workerOrder.originData.dependencies;
      if (dependencies.length < 1) return;
      let l = dependencies.length;
      for (let i = 0; i < l; i++) {
        let tips = null;
        let toWorkOrderData = dealtData.find(d => {
          if (d.id === dependencies[i].to) {
            tips = dependencies[i].tips;
            return true;
          }
        });
        if (toWorkOrderData === undefined || ~pathDep.indexOf(toWorkOrderData.id)) continue;
        pathDep.push(toWorkOrderData.id); // 记录工单id
        // 寻点，返回路径详细信息
        let path = this.sourcePoint(fromWorkOrderData, toWorkOrderData);
        this.drawLine(path, tips);
        // this.sourceDependenciesTo(toWorkOrderData, pathDep);// 只遍历子级
        this.sourceDependencies(toWorkOrderData, pathDep);
      }
    }
    return pathDep;
  }

  /**
   * 寻路径位置
   *
   * @param formWorkOrder
   * @param toWorkOrder
   * @return [x,y,x1,y1] 工单依赖的路径信息
   */
  sourcePoint(fromWorkOrder, toWorkOrder) {
    let f = { x: fromWorkOrder.x, y: fromWorkOrder.y, w: fromWorkOrder.width, h: fromWorkOrder.height };
    let t = { x: toWorkOrder.x, y: toWorkOrder.y, w: toWorkOrder.width, h: toWorkOrder.height };
    let direction = 'none'; // to的工单相对from工单的位置
    let paths = [];

    /** 暂时无需区分左右点 */
    /*    if (f.x < t.x) {
          direction = 'right';
        } else {
          direction = 'left';
        }*/


    // 前两点
    paths = paths.concat(firstTwoPoint(f, t));

    //中间点
    paths = paths.concat(middleTwoPoint(f, t));

    // 后3点
    paths = paths.concat(lastTwoPoint(f, t));

    /** 暂时无需区分左右点 */
    /* if (direction === 'right') {
       // 前两点
       paths = paths.concat(firstTwoPoint(f, t));

       //中间点
       paths = paths.concat(middleTwoPoint(f, t));
       // 后3点
       paths = paths.concat(lastTwoPoint(f, t));
     } else if (direction === 'left') {
       // 前两点
       paths = paths.concat(firstTwoPoint(f, t));
       // 中间点
       paths = paths.concat(middleTwoPoint(f, t));
       // 后3点
       paths = paths.concat(lastTwoPoint(f, t));
     }
 */
    // 通用点
    // 前2点
    function firstTwoPoint(f, t, cw = 8) {
      let path = [];
      path.push(f.x + f.w, f.y + Math.floor(f.h / 2));
      path.push(f.x + f.w + cw, f.y + Math.floor(f.h / 2));
      return path;
    }

    // 中间点
    function middleTwoPoint(f, t, cw = 8) {
      let path = [];
      paths.push(f.x + f.w + cw, t.y + t.h);
      paths.push(t.x - cw * 2, t.y + t.h);
      return path;
    }

    // 后3点
    function lastTwoPoint(f, t, cw = 8) {
      let path = [];
      path.push(t.x - cw * 2, t.y + Math.floor(t.h / 2));
      /** 后2点为箭头 */
      path.push(t.x - cw, t.y + Math.floor(t.h / 2));
      path.push(t.x, t.y + Math.floor(t.h / 2));
      return path;
    }

    return paths;
  }
}

DrawLiner.cellWidth = store.get('cellWidth');
