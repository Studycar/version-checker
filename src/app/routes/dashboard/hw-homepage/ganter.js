function getColor() {
  var c = [];
  var r = Math.floor(Math.random() * 256);
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);
  c.push(r);
  c.push(g);
  c.push(b);
  return 'rgb(' + c.join() + ')';
}

export function mockData(line, column) {
  var d = { data: [], yData: [] };
  for (var i = 0; i < line; i++) {
    var lineArr = [];
    var str = 'PDAJSDQ' + (i + 1);
    for (var j = 0; j < column; j++) {
      var o = {
        planGroup: '总装01-M2' + Math.floor(Math.random() * 10),
        resource: str,
        date: '2018-12-' + Math.floor(Math.random() * 10),
        resourceType: 'xx1',
        resourceAvailableTime: Math.floor(Math.random() * 20),
        resourceWorkingTime: Math.floor(Math.random() * 50),
        val: Math.floor(Math.random() * 150),
        color: getColor(),
      };
      if (j % 10 === 0) o = '';
      lineArr.push(o);
    }
    d.yData.push(str);
    d.data.push(lineArr);
  }
  return d;
}

function ganter(options) {
  var toString = Object.prototype.toString;
  // 辅助函数:公共方法和方法定义
  var util = {
    //扩展，首参传ture则为深扩展,参数基本与jq.extend一致
    extend: function() {
      var args = [].slice.call(arguments);
      if (typeof args[0] === 'boolean' && args[0]) {
        args = args.splice(1);
        var source = args[0];

        for (var i = 1, ii = args.length; i < ii; i++) {
          recursion(source, args[i]);
        }

        return source;

        function recursion(sr, ex) {
          var type = undefined;
          if (ex.constructor === Array) {
            for (var i = 0, ii = ex.length; i < ii; i++) {
              if (ex.hasOwnProperty(i)) {
                if (type = isRefType(ex[i])) {
                  if (sr[i] === undefined) {
                    if (type === 'object') {
                      sr[i] = {};
                    } else {
                      sr[i] = [];
                    }
                  }
                  recursion(sr[i], ex[i]);
                } else {
                  sr[i] = ex[i];
                }
              }
            }
          } else {
            for (var key in ex) {
              if (ex.hasOwnProperty(key)) {
                if (type = isRefType(ex[key])) {
                  if (sr[key] === undefined) {
                    if (type === 'object') {
                      sr[key] = {};
                    } else {
                      sr[key] = [];
                    }
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
          if (obj.constructor === Object) return 'object';
          if (obj.constructor === Array) return 'array';
          return false;
        }

      } else {
        return Object.assign.apply(null, args);
      }
    },
    /**
     * 获取X轴时间
     * @param startDate 开始时间
     * @param length 持续时间(h,w,m, h会将时间转为小时，w,m都是转换为天)
     * @param type 类型 day, hour
     */
    calculateDate: function(startDate, length, type) {
      length = length || '2w';
      if (!startDate) {
        console.log('开始日期必传');
      }
      var typeStr = length.slice(-1);
      var len = length.slice(0, -1);
      var d, m, y, h, bfDate;
      if (typeStr === 'h') {
        type = 'hour';
      } else {
        type = 'day';
      }
      if (type === 'day') {
        startDate = new Date(startDate);
        bfDate = new Date(startDate);

        d = startDate.getDate();
        m = startDate.getMonth();
        y = startDate.getFullYear();
        return getDateArr(d, m, y, bfDate, len, typeStr);
      } else {

      }

      // 获取天格式
      function getDateArr(d, m, y, bfDate, len, type) {
        var endDay, endDate, dd;
        var str = '-';
        var dateArr = [];
        var weekStr = ['日', '一', '二', '三', '四', '五', '六'];
        var weekArr = [];
        var w = bfDate.getDay();

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
            for (; d <= endDay; d++ , w++) {
              if (w > 6) w = 0;
              dd = m + str + (d > 9 ? d : '0' + d);
              dateArr.push(dd);
              weekArr.push(weekStr[w]);
            }
            if (d >= endDay) {
              d = 1;
            }
          }
          // 按周获取
        } else if (type === 'w') {
          len *= 7;
          endDay = (new Date(y, m + 1, 0)).getDate();
          for (var l = 0; l < len; l++ , w++ , d++) {
            if (w > 6) w = 0;
            dd = (m + 1) + str + d;
            dateArr.push(dd);
            weekArr.push(weekStr[w]);
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
          for (var l = 0; l < len; l++ , w++ , d++) {
            if (w > 6) w = 0;
            dd = (m + 1) + str + d;
            dateArr.push(dd);
            weekArr.push(weekStr[w]);
            if (d >= endDay) {
              m += 1;
              if (m > 11) m = 0;
              d = 0;
              endDay = (new Date(y, m + 1, 0)).getDate();
            }
          }
        }

        return {
          date: dateArr,
          week: weekArr,
        };
      }

      //获取小时格式
      function getHourArr() {

      }

    },
    addEventListener: function(el, event, handler) {
      el.addEventListener(event, handler);
    },
    removeEventListener: function(el, event, handler) {
      el.removeEventListener(event, handler);
    },
    // 鼠标移动事件
    mouseMoveHandler: function(et, im, tooltip, ins) {
      if (ins.$$drag.status) {
        tooltip.tooltip.style.display = 'none';
        ins.rootDom.style.cursor = 'move';
        return;
      }

      var rootDom = ins.rootDom.getBoundingClientRect();
      var rt = rootDom.top;
      var rl = rootDom.left;
      var tx = im.translate.pos.x;
      var ty = im.translate.pos.y;
      var ex = et.x;
      var ey = et.y;
      var x = ex - tx - rl, y = ey - ty - rt;
      var cellPos = im.cellPos, cells = im.cells;
      var item;
      for (var i = 0, ii = cellPos.length; i < ii; i++) {
        item = cellPos[i];
        if (item.x1 <= x && x <= item.x2) {
          if (item.y1 <= y && y <= item.y2) {
            var inf = {
              pos: { x: ex - rl, y: ey - rt },
              cell: cells[i],
            };
            ins.rootDom.style.cursor = 'pointer';
            im.cellChange(cells[i]);
            tooltip.update(inf);
            return;
          }
        }
      }
      tooltip.tooltip.style.display = 'none';
      ins.rootDom.style.cursor = 'default';
      // 清除选中效果
      if (im.currentCell) {
        im.currentCell = null;
        im.cellChange();
      }
    },
    // 鼠标移开事件
    mouseOutHandler: function(et, im, tooltip, ins, drag) {
      tooltip.tooltip.style.display = 'none';
      im.currentCell = null;
      drag.status = false;
      im.cellChange();
    },
    debounce: function(fn, wait, immediately) {
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
    // 创建元素操作
    addStyle: function(dom, width, height) {
      dom.style.cssText = [
        'position:relative',
        'width:' + width + 'px',
        'height:' + height + 'px',
      ].join(';') + ';';
      return dom;
    },
    createRoot: function(width, height) {
      var domRoot = document.createElement('div');
      domRoot.style.cssText = [
        'position:relative',
        'overflow:hidden',
        'width:' + width + 'px',
        'height:' + height + 'px',
        'padding:0',
        'margin:0',
        'border-width:0',
        'cursor: default',
      ].join(';') + ';';
      return domRoot;
    },
    createCanvas: function(width, height) {
      var canvas = document.createElement('canvas');
      canvas.style.cssText = [
        'position:relative',
        'overflow:hidden',
        'width:' + width + 'px',
        'height:' + height + 'px',
        'padding:0',
        'margin:0',
        'border-width:0',
      ].join(';') + ';';
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      return canvas;
    },

    isArray: function(arr) {
      return toString.call(arr) === '[object Array]';
    },
    isObject: function(obj) {
      return toString.call(obj) === '[object Object]';
    },
    isFunction: function(fn) {
      return toString.call(fn) === '[object Function]';
    },
  };

  //部件：执行各种操作的入口
  function innerMethod(ins, core, tooltip, drag) {
    return {
      // 常规配置
      $prepareOption: function(options) {
        var date = this.$getDate(options.startDate, options.time, true);
        var xAxis = options.xAxis;
        var yAxis = options.yAxis;
        var w = this.w = ins.w;
        var h = this.h = ins.h;
        var xWidth, xNums, xGap, yHeight, yNums, yGap, xCellsWidth, yCellsHeight;
        this.$XY.setXY({ x: date.date.length, y: options.yAxis.data.length });
        this.el = ins.canvas;
        this.cells = [];
        this.cellPos = [];
        this.currentCell = null;
        this.isDraw = false; // 绘画状态
        // 偏移信息
        this.translate = {
          needTransform: false,
          pos: { x: 0, y: 0 },
        };
        if (options.fullScreen) {
          xWidth = w - xAxis.xStart;
          xNums = this.$XY.getXY().x;
          xGap = Math.floor(xWidth / xNums);
          yHeight = h - xAxis.yStart - 12;
          yNums = this.$XY.getXY().y;
          yGap = Math.floor(yHeight / yNums);
          xAxis.xGap = xGap;
          yAxis.yGap = yGap;
        } else if (util.isObject(options.fullScreen) && options.fullScreen.x === true) {
          xWidth = w - xAxis.xStart;
          xNums = this.$XY.getXY().x;
          xGap = Math.floor(xWidth / xNums);
          xAxis.xGap = xGap;
        } else if (util.isObject(options.fullScreen) && options.fullScreen.y === true) {
          yHeight = h - xAxis.yStart - 12;
          yNums = this.$XY.getXY().y;
          yGap = Math.floor(yHeight / yNums);
          yAxis.yGap = yGap;
        }
        // 边界信息
        xCellsWidth = this.xCellsWidth = this.$XY.getXY().x * xAxis.xGap + xAxis.xStart;
        yCellsHeight = this.yCellsHeight = this.$XY.getXY().y * yAxis.yGap + xAxis.xSpace;
        var xEnd = xCellsWidth > w ? xCellsWidth - w : xCellsWidth;
        var yEnd = yCellsHeight > h ? yCellsHeight - h : yCellsHeight;
        this.boundaryPos = {
          x: {
            start: 0,
            end: xEnd,
          },
          y: {
            start: 0,
            end: yEnd,
          },
        };
      },
      // 自动生成日期
      $getDate: (function() {
        var date;
        return function(startDate, time, force) {
          if (date === undefined || force) {
            date = util.calculateDate(startDate, time);
          }
          return date;
        };
      })(),
      $XY: (function() {
        var xy = { x: 0, y: 0 }; // 生成表格数，根据日期生成X，根据任务数据生成Y
        return {
          setXY: function(obj) {
            util.extend(xy, obj);
          },
          getXY: function() {
            return xy;
          },
        };
      })(),
      // 事件操作
      bindEvent: function() {
        var me = this;
        var moveFn = (function() {
          return util.debounce(function(et) {
            util.mouseMoveHandler(et, me, tooltip, ins);
          });
        }());
        var outFn = (function(et) {
          return function() {
            util.mouseOutHandler(et, me, tooltip, ins, drag);
          };
        }());
        util.addEventListener(this.el, 'mousemove', moveFn);
        util.addEventListener(this.el, 'mouseout', outFn);
      },
      removeEvent: function() {
        // util.removeEventListener(this.el, 'mousemove', moveFn);
        // util.removeEventListener(this.el, 'mouseout', outFn);
      },
      cellChange: function(cell) {
        var curPos;
        var needTransform = this.translate.needTransform;
        var direction = this.translate.direction;
        if (!cell) {
          if (needTransform) {
            if (direction === 'right' || direction === 'left') {
              this.$drawMoveXAfter();
            } else if (direction === 'up' || direction === 'down') {
              this.$drawMoveYAfter();
            }
          } else {
            this.$clear({ cell: true });
            this.$reRender(ins.options);
          }
        } else {
          // 记录当前cell
          curPos = cell.xy.x + ',' + cell.xy.y;
          if (this.currentCell === null || this.currentCell.p !== curPos) {
            this.currentCell = {
              p: curPos,
              cell: cell,
            };
            if (needTransform) {
              if (direction === 'right' || direction === 'left') {
                this.$drawMoveXAfter();
              } else if (direction === 'up' || direction === 'down') {
                this.$drawMoveYAfter();
              }
            } else {
              this.$clear({ cell: true });
              this.$reRender(ins.options);
            }
          }
        }
      },
      offCanvas: function() {
        var offcanvas = util.createCanvas();

      },
      // 渲染操作
      $doRender: function(options) {
        this.cells = [];
        this.cellPos = [];
        this.$drawX(options);
        this.$drawY(options);
        this.$drawCell(options);
        if (ins.off === true) {
          this.$drawOn();
        }
        this.bindEvent();

        if (!options.fullScreen) { // 满屏显示没有拖动功能
          drag.bindEvent(this);
        }
        this.$drawLegend(options, ins.dom);
      },
      $reRender: function() {
        this.cells = [];
        this.cellPos = [];
        this.$drawCell(options);
        if (ins.off === true) {
          this.$drawOn();
        }
      },
      $drawOn: function() {
        var option = {
          img: ins.offCanvas,
          x: 0,
          y: 0,
        };
        core.$drawImage(ins.onCtx, option);
      },
      // 各种绘制操作
      // 绘制xy轴线
      $drawXY: function(options) {
        ins.ctx.save();
        ins.ctx.strokeStyle = options.xAxis.lineStyle.color;
        ins.ctx.lineWidth = 1;
        var xAxis = options.xAxis;
        var yAxis = options.yAxis;

        core.$drawLine([{
          sx: xAxis.xStart,
          sy: xAxis.xSpace,
          ex: this.$XY.getXY().x * xAxis.xGap + xAxis.xStart,
          ey: xAxis.xStart,
        }, {
          sx: xAxis.xStart,
          sy: xAxis.xSpace,
          ex: yAxis.yEnd,
          ey: (this.$XY.getXY().y) * yAxis.yGap + xAxis.xSpace,
        }]);
        ins.ctx.restore();
      },
      //
      // 绘制Y轴
      $drawY: function(opt) {
        ins.ctx.save();
        for (var i = 0, ii = opt.yAxis.data.length; i < ii; i++) {
          core.$drawText({
            text: opt.yAxis.data[i],
            x: opt.yAxis.xStart,
            y: opt.yAxis.yStart + i * opt.yAxis.yGap,
            opt: opt.yAxis,
            type: 'y',
          });
        }
        ins.ctx.restore();
      },
      // 绘制X轴
      $drawX: function(opt) {
        ins.ctx.save();
        var date = this.$getDate();
        for (var i = 0, ii = date.date.length; i < ii; i++) {
          core.$drawText({
            text: date.date[i],
            x: opt.xAxis.xStart + i * opt.xAxis.xGap,
            y: opt.xAxis.yStart,
            opt: opt.xAxis,
            type: 'x',
          });
          core.$drawText({
            text: '周' + date.week[i],
            x: opt.xAxis.xStart + i * opt.xAxis.xGap,
            y: opt.xAxis.yStart + opt.xAxis.weekDeviation,
            opt: opt.xAxis,
            type: 'x',
          });
        }
        ins.ctx.restore();
      },
      $drawCell: function() {
        ins.ctx.save();
        var options = ins.options;
        var xAxis = options.xAxis;
        var yAxis = options.yAxis;
        var series = options.series;
        var xy = this.$XY.getXY();
        var val, pos, range;
        var cellStyle = options.cellStyle;
        var fillStyle;
        var strokeStyle = cellStyle.strokeStyle;
        var currentCell = this.currentCell;
        for (var y = 0, yy = xy.y; y < yy; y++) {
          for (var x = 0, xx = xy.x; x < xx; x++) {
            val = series[y][x];
            fillStyle = '#fff';
            pos = {
              x: xAxis.xStart + xAxis.xGap * x,
              y: xAxis.xSpace + yAxis.yGap * y,
              w: xAxis.xGap,
              h: yAxis.yGap,
              cellStyle: options.cellStyle,
            };
            core.$strokeRect(pos, { strokeStyle: strokeStyle });
            if (y % 2 === 1) {
              fillStyle = (cellStyle && cellStyle.fillStyle) || '#F7F9FA';
            }
            //判断是否选中的cell
            if (currentCell && currentCell.p === x + ',' + y) {
              fillStyle = '#D7EDFC';
            }
            core.$fillRect(pos, { fillStyle: fillStyle });
            range = {
              x1: pos.x,
              x2: pos.x + pos.w,
              y1: pos.y,
              y2: pos.y + pos.h,
            };
            var cell = new Cell(
              {
                ctx: ins.ctx,
                xy: { x: x, y: y },
                position: pos,
                val: val,
                ch: cellStyle.ch,
              });
            this.cells.push(cell);
            this.cellPos.push(range);
            cell.draw();
          }
        }
        ins.ctx.restore();
      },
      $drawMoveXAfter: function() { // X轴移动后的重新渲染
        var x = this.translate.pos.x;
        var y = this.translate.pos.y;
        // cell
        ins.ctx.save();
        this.$clear();
        ins.ctx.translate(x, y);
        this.$reRender(ins.options);
        ins.ctx.restore();
        // xAxis
        ins.ctx.save();
        this.$clear({ xAxis: true });
        ins.ctx.translate(x, 0);
        this.$drawX(ins.options);
        ins.ctx.restore();
        // yAxis
        ins.ctx.save();
        this.$clear({ yAxis: true });
        ins.ctx.translate(0, y);
        this.$drawY(ins.options);
        ins.ctx.restore();
        // cross
        this.$clear({ cross: true });
      },
      $drawMoveYAfter: function() { // Y轴移动后的重新渲染
        var x = this.translate.pos.x;
        var y = this.translate.pos.y;
        // cell
        ins.ctx.save();
        this.$clear();
        ins.ctx.translate(x, y);
        this.$reRender(ins.options);
        ins.ctx.restore();
        // xAxis
        ins.ctx.save();
        this.$clear({ yAxis: true });
        ins.ctx.translate(0, y);
        this.$drawY(ins.options);
        ins.ctx.restore();
        // yAxis
        ins.ctx.save();
        this.$clear({ xAxis: true });
        ins.ctx.translate(x, 0);
        this.$drawX(ins.options);
        ins.ctx.restore();
        // cross
        this.$clear({ cross: true });
      },
      /**
       * param {cell:true} 只清除cell部分,不传则清除整个canvas区域
       **/
      $clear: function(option) {
        core.$clear(option);
      },
      // 绘制legend
      $drawLegend: function(option, dom) {
        option.legend && option.legend(dom);
      },
    };
  }

  var Ganter = function() {
    // canvas实例
    this.canvas = null;
    // 渲染上下文
    this.ctx = null;
    //dom元素ID
    this.id = null;
    // canvas画布宽
    this.w = 0;
    // canvas画布高
    this.h = 0;
  };
  var methods = {
    // 创建画布dom
    init: function(domId, off) {
      var dom = this.dom = document.getElementById(domId);
      if (dom === null) return;
      var w = dom.style.width;
      var h = dom.style.height;
      this.off = off || false;
      if (~w.indexOf('%')) {
        w = this.w = dom.clientWidth;
      } else {
        w = this.w = dom.style.width.replace('px', '');
      }
      if (~h.indexOf('%')) {
        h = this.h = dom.clientHeight;
      } else {
        h = this.h = dom.style.height.replace('px', '');
      }
      var rootDom = this.rootDom = util.createRoot(w, h);
      var canvas = this.canvas = util.createCanvas(w, h);
      var offcanvas = this.offCanvas = util.createCanvas(w, h);
      this.id = domId;
      if (off === true) {//性能优化模式
        this.ctx = offcanvas.getContext('2d');
        this.onCtx = canvas.getContext('2d');
      } else {
        this.ctx = canvas.getContext('2d');
        this.onCtx = offcanvas.getContext('2d');
      }
      this.XY = null; // xy操作对象，存储XY轴的个数
      util.addStyle(dom, w, h);
      rootDom.appendChild(canvas);
      dom.appendChild(rootDom);

    },
    //配置参数并进行绘制
    setOption: function(option) {
      var defaultOpt = {
        xAxis: {
          xStart: 100, //y轴所占X空间必须与ySpace相同
          yStart: 0,
          xEnd: this.w,
          xSpace: 43,
          xGap: 70, //X单体所占的距离
          weekDeviation: 14, // 周距离日期的偏离位置
        },
        yAxis: {
          xStart: 0,
          yStart: 43, //x轴所占Y空间必须与xSpace相同
          yEnd: this.h,
          ySpace: 100,
          yGap: 30, //Y单体所占的距离
        },
      };
      this.options = options = util.extend(true, {}, defaultOpt, option);

      var core = new Core(this);
      var tooltip = new TooltipContent(this);
      var drag = this.$$drag = new Drag(0, 0, this.rootDom, this);
      var im = this.im = innerMethod(this, core, tooltip, drag);

      // 处理参数
      im.$prepareOption(options);
      // 开始绘画
      im.$doRender(options);
    },
    clear: function(option) {
      var im = this.im;
      im.$clear(option);
    },
  };

  //核心方法:原生的绘制操作
  function Core(self) {
    this.ctx = self.ctx;
    this.canvas = self.canvas;
    this.onCtx = self.onCtx;
    this.self = self;
  }

  var coreMethod = {
    $$draw: function(fn) {
      var ctx = this.ctx;
      var self = this.self;
      return function() {
        var args = [].slice.call(arguments);
        ctx.save();
        fn.apply(self, args);
        ctx.restore();
      };
    },
    $drawImage: function(ctx, option) {
      this.$$draw(this.$$drawImage)(ctx, option);
    },
    $drawText: function(option) {
      this.$$draw(this.$$drawText)(option);
    },
    $drawLine: function(data) {
      this.$$draw(this.$$drawLine)(data);
    },
    $fillRect: function(option, style) {
      option.type = 'fill';
      this.$$draw(this.$$drawRect)(option, style);
    },
    $strokeRect: function(option, style) {
      option.type = 'stroke';
      this.$$draw(this.$$drawRect)(option, style);
    },
    $clear: function(option) {
      this.$$draw(this.$$clear)(option);
    },
    /**
     *
     * @param option [object]
     * text: 文本
     * x：x
     * y: y
     */
    $$drawText: function(option) {
      var ctx = this.ctx, gap;
      var defaultOptions = {
        font: '12px 微软雅黑',
        textAlign: 'center',
        textBaseline: 'top',
      };
      var options = util.extend({}, defaultOptions, option.opt.textStyle);
      if (options) {
        if (options.color) ctx.fillStyle = options.color;
        if (options.font) ctx.font = options.font;
        if (options.textAlign) ctx.textAlign = options.textAlign;
        if (options.textBaseline) ctx.textBaseline = options.textBaseline;
        if (ctx.textAlign === 'center') {
          if (option.type === 'y') {
            option.x = option.x + Math.floor(option.opt.ySpace / 2);
          } else if (option.type === 'x') {
            option.x = option.x + Math.floor(option.opt.xGap / 2);
          }
        }
        if (options.verticalAlign === 'middle') {
          if (option.type === 'y') {
            option.y = option.y + Math.floor(option.opt.yGap / 2);
            ctx.textBaseline = 'middle';
          } else if (option.type === 'x') {
            option.y = option.y + Math.floor(option.opt.xSpace / 2) - Math.floor(option.opt.weekDeviation / 2);
            ctx.textBaseline = 'middle';
          }
        }
      }
      ctx.fillText(option.text, option.x, option.y);

    },
    /**
     *
     * @param data [{sx:x1,sy:y1,ex:x2,ey:y2},{sx:x1,sy:y1,ex:x2,ey:y2}] | {sx:x1,sy:y1,ex:x2,ey:y2}
     *
     */
    $$drawLine: function(data) {
      var ctx = this.ctx;
      if (util.isArray(data)) {
        for (var i = 0, ii = data.length; i < ii; i++) {
          line(data[i]);
        }
      } else {
        line(data);
      }

      function line(path) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(path.sx, path.sy);
        ctx.lineTo(path.ex, path.ey);
        ctx.stroke();
        ctx.restore();
      }
    },
    $$drawRect: function(option, style) {
      var ctx = this.ctx;
      var style = style || { fillStyle: '#fff', strokeStyle: '#919CA3' };
      var fillStyle = style.fillStyle;
      var strokeStyle = style.strokeStyle;

      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = strokeStyle;

      if (option.type === 'fill') {
        ctx.fillRect(option.x, option.y, option.w, option.h);
      } else if (option.type === 'stroke') {
        ctx.strokeRect(option.x, option.y, option.w, option.h);
      }
    },
    // 测量文本元素宽
    $$measureText: function(text, option) {
      var ctx = this.ctx;
      var defaultOptions = {
        font: '14px Comic Sans',
      };
      var options = util.extend({}, defaultOptions, option);
      if (options.textStyle) {
        if (options.textStyle.color) ctx.fillStyle = options.textStyle.color;
        if (options.textStyle.font) ctx.font = options.textStyle.font;
      }
      return ctx.measureText(text);
    },
    $$drawImage: function(ctx, option) {
      var img = option.img;
      var x = option.x;
      var y = option.y;
      ctx.drawImage(img, x, y);
    },
    $$clear: function(area) {
      var ctx = this.ctx;
      var startX = 0, startY = 0;
      var w = this.w;
      var h = this.h;
      var options = this.options;
      if (area) {
        if (area.cell === true) {
          startX = options.xAxis.xStart - 1;
          startY = options.xAxis.xSpace - 1;
        } else if (area.yAxis === true) {
          w = options.yAxis.ySpace - 1;
        } else if (area.xAxis === true) {
          h = options.xAxis.xSpace - 1;
        } else if (area.cross === true) {
          w = options.xAxis.xStart - 1;
          h = options.xAxis.xSpace - 1;
        }
      }

      ctx.clearRect(startX, startY, w, h);
      if (this.off) {
        this.onCtx.clearRect(0, 0, w, h);
      }
    },
  };

  //----------------------表格对象--------------------
  function Cell(option) {
    this.ctx = option.ctx;
    this.xy = { x: option.xy.x, y: option.xy.y }; //canvas的位置信息
    this.position = { x: option.position.x, y: option.position.y, w: option.position.w, h: option.position.h, ch:option.ch }; //表格的位置,宽,高
    this.val = option.val;
  }

  var cellMethod = {
    draw: function() {
      var position = this.position;
      var val = util.isObject(this.val) ? this.val.val : this.val;
      var color = this.val && this.val.color || '#fff  ';

      if (isNaN(val)) {
        return;
      }
      var w = Math.floor(position.w * val / 100);
      w = w > position.w ? position.w : w;
      var h = position.ch ? position.ch : Math.floor(position.h / 2);

      this.ctx.fillStyle = color;
      this.ctx.fillRect(position.x, position.y + Math.floor((position.h - h) / 2), w, h);
    },
  };

  //----------------------Tooltip--------------------
  function TooltipContent(self) {
    var w = this.w = 180;
    var h = this.h = self.options.tooltip && self.options.tooltip.height ? self.options.tooltip.height : 220;
    this.xAmend = Math.floor(self.options.xAxis.xGap / 10);
    this.yAmend = Math.floor(self.options.yAxis.yGap / 10);
    this.rootDom = self.rootDom;
    var tooltip = this.tooltip = document.createElement('div');
    var gCssText = 'position:absolute;display:block;border-style:solid;white-space:nowrap;z-index:9999999;';
    var defaultCss = [
      'width:' + w + 'px',
      'height:' + h + 'px',
      'box-sizing: border-box',
      'background-color:rgba(0,0,0,.6)',
      'color:#fff',
      'left:0',
      'top:0',
      'display:none',
      'border-radius:10px',
      'font-size:13px',
      'padding:16px',
      'border:none',
    ].join(';') + ';';
    var content = document.createElement('div');
    content.setAttribute('class', 'tooltipContent');
    tooltip.style.cssText = gCssText + defaultCss;
    if (self.options.tooltip && self.options.tooltip.formatter) this.formatter = self.options.tooltip.formatter;
    else this.formatter = false;

    tooltip.appendChild(content);
    self.dom.appendChild(tooltip);
  }

  var tooltipMethod = {
    contentUpdate: function(cell) {
      var val = this.formatter ? this.formatter(cell.val, this.tooltip) : cell.val;
      this.tooltip.firstChild.innerHTML = val;
      return val;
    },
    positionUpdate: function(pos) {
      var newPos = this.boundaryDetection(pos.x, pos.y);
      this.tooltip.style.display = 'block';
      this.tooltip.style.left = newPos.x + 'px';
      this.tooltip.style.top = newPos.y + 'px';
    },
    update: function(inf) {
      var val = this.contentUpdate(inf.cell);
      if (val !== false) {
        this.positionUpdate(inf.pos);
      } else {
        this.tooltip.style.display = 'none';
      }
    },
    boundaryDetection: function(x, y) {
      var pos = { x: x, y: y };
      var rootDom = this.rootDom.getBoundingClientRect();
      var dw = rootDom.right - rootDom.left;
      var dh = rootDom.bottom - rootDom.top;
      var tw = this.w;
      var th = this.h;
      var xAmend = this.xAmend;
      var yAmend = this.yAmend;
      if (x + tw > dw) {
        pos.x = x - tw - xAmend;
      }
      if (y + th > dh) {
        pos.y = y - th - yAmend;
      }
      return pos;
    },
  };

  //--------------------------DRAG
  function Drag(x, y, dom, ins) {
    this.x1 = x || 0;
    this.y1 = y || 0;
    this.x2 = 0;
    this.y2 = 0;
    this.dom = dom || null;
    this.status = false; // 鼠标状态，当MouseDown时触发
    this.direction = 'none'; // 画布移动的方向
    this.ctx = ins.ctx;
    this.ins = ins;
  }

  var dragMethod = {
    bindEvent: function(im) {
      var dom = this.dom;
      var self = this;
      var mouseUpFn = (function() {
        return function(et) {
          self.mouseUp(et, im);
        };
      }());
      var mouseMoveFn = (function() {
        return function(et) {
          self.mouseMove(et, im);
        };
      }());

      util.addEventListener(dom, 'mousedown', function(et) {
        self.mouseDown(et);
      });
      util.addEventListener(dom, 'mousemove', mouseMoveFn);
      util.addEventListener(dom, 'mouseup', mouseUpFn);
    },
    mouseDown: function(et) {
      this.status = true;
      this.x1 = et.x;
      this.y1 = et.y;
    },
    mouseMove: function(et, im) {
      if (this.status) {
        var x1 = this.x1;
        var y1 = this.y1;
        var x2 = this.x2 = et.x;
        var y2 = this.y2 = et.y;
        var x = Math.abs(x1 - x2);
        var y = Math.abs(y1 - y2);
        this.x1 = x2;
        this.y1 = y2;
        if (x1 > x2) {
          this.direction = 'right';
          this.toDrag({ x: -x, y: 0 }, im, this.direction);
        } else if (x1 < x2) {
          this.direction = 'left';
          this.toDrag({ x: x, y: 0 }, im, this.direction);
        }
        if (y1 < y2) {
          this.direction = 'up';
          this.toDrag({ x: 0, y: y }, im, this.direction);
        } else if (y1 > y2) {
          this.direction = 'down';
          this.toDrag({ x: 0, y: -y }, im, this.direction);
        }
        this.direction = 'none';
      }
    },
    mouseUp: function(et, im) {
      /*                if (this.status) {
                          var x1 = this.x1;
                          var y1 = this.y1;
                          var x2 = this.x2 = et.x;
                          var y2 = this.y2 = et.y;
                          var x = Math.abs(x1 - x2);
                          var y = Math.abs(y1 - y2);
                          if (x > y) {
                              if (x1 > x2) {
                                  this.direction = 'right';
                                  this.toDrag({x: -x, y: 0}, im, this.direction);
                              } else if (x1 < x2) {
                                  this.direction = 'left';
                                  this.toDrag({x: x, y: 0}, im, this.direction);
                              }
                          } else {
                              if (y1 < y2) {
                                  this.direction = 'up';
                                  this.toDrag({x: 0, y: y}, im, this.direction);
                              } else if (y1 > y2) {
                                  this.direction = 'down';
                                  this.toDrag({x: 0, y: -y}, im, this.direction);
                              }
                          }
                          this.status = false;
                          this.direction = 'none';
                      }*/
      this.status = false;
    },
    toDrag: function(distance, im, direction) {
      var x = distance.x;
      var y = distance.y;
      if (im.translate.needTransform) {
        im.translate.direction = direction;
        im.translate.pos.x = im.translate.pos.x + x;
        im.translate.pos.y = im.translate.pos.y + y;
      } else {
        im.translate.needTransform = true;
        im.translate.direction = direction;
        im.translate.pos.x = x;
        im.translate.pos.y = y;
      }
      // 边界校验
      this.boundaryDetection(im);
      if (direction === 'right' || direction === 'left') {

        im.$drawMoveXAfter();
      } else if (direction === 'up' || direction === 'down') {
        im.$drawMoveYAfter();
      }
    },
    boundaryDetection: function(im) {
      var x = im.translate.pos.x;
      var y = im.translate.pos.y;
      var boundaryPos = im.boundaryPos;
      var x1 = boundaryPos.x.start;
      var x2 = boundaryPos.x.end;
      var y1 = boundaryPos.y.start;
      var y2 = boundaryPos.y.end;
      var xCellsWidth = im.xCellsWidth;
      var yCellsHeight = im.yCellsHeight;
      var w = im.w;
      var h = im.h;
      if (x > x1) {
        im.translate.pos.x = x1;
      } else if (-x > x2) {
        im.translate.pos.x = -x2 - 1;
      } else if (xCellsWidth < w) {
        im.translate.pos.x = 0;
      }

      if (y > y1) {
        im.translate.pos.y = y1;
      } else if (-y > y2) {
        im.translate.pos.y = -y2 - 1;
      } else if (yCellsHeight < h) {
        im.translate.pos.y = 0;
      }
    },
  };

  util.extend(Ganter.prototype, methods);
  util.extend(Core.prototype, coreMethod);
  util.extend(Cell.prototype, cellMethod);
  util.extend(TooltipContent.prototype, tooltipMethod);
  util.extend(Drag.prototype, dragMethod);

  return new Ganter();
}


export function draw(opt) {
  var g = ganter(opt);
  g.init('tutorial');
  // g.init('tutorial',true);
  g.setOption(opt);
}
