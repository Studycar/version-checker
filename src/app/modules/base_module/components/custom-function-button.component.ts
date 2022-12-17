import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
/*
author:liujian11
date:2018-09-26
function:功能按钮
*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'custom-function-button',
  template: `<span  nz-tooltip nzTitle="{{text}}"  placement="bottom" (click)="click()">
               <span class="span_container">
                 <img [ngStyle]="iconStyle" src="{{imgSrc}}" alt="1">
               </span>
            </span>`,
  styles: [`
            .span_container {
              padding: 0px 5px 0px 5px;
              display: inline-block;
              text-align: center;
              cursor: pointer
            }

            .span_container:hover {
              padding: 0px 5px 0px 5px;
              display: inline-block;
              background-color: rgb(230, 235, 238);
            }

            .div_text {
              vertical-align: middle;
              text-align: center;
              margin: 0px auto;
              font-size: 12px;
            }

            .div_text_disabled {
              vertical-align: middle;
              text-align: center;
              margin: 0px auto;
              font-size: 12px;
              color: rgb(255, 255, 255);
            }
          `]
})
export class CustomFunctionButtonComponent implements OnInit, OnChanges {
  /*  <br> <font [ngStyle]="textStyle">{{text}}</font> */
  @Input() public text = '按钮文本';
  @Input() public src = '../../../../assets/imgs/planSchedule/1.svg';
  @Input() public srcDisabled = '../../../../assets/imgs/planSchedule/1.svg';
  public imgSrc;
  @Input() public disabled = false;
  @Input() public iconStyle = {
    width: '35px',
    height: '35px',
  };
  @Input() public textStyle = {
    'font-size': '8px'
  };
  @Output() public clickEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.disabled) {
      this.imgSrc = this.srcDisabled;
    } else {
      this.imgSrc = this.src;
    }
  }
  // 点击事件
  public click() {
    if (!this.disabled) {
      this.clickEvent.emit();
    }
  }
}
