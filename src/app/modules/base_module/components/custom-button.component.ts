/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @LastEditors: Zwh
 * @Note: ...
 *                   <i nz-icon [ngStyle]="iconStyle" type="{{imgSrc}}"></i>
 * @Date: 2019-03-11 08:43:59
 * @LastEditTime: 2019-08-02 16:05:36
 */
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, TemplateRef } from '@angular/core';

const ICON_NAME_SPACE = '/assets/icons/';
const ICON_FORMAT = '.svg';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'custom-button',
  template: `
    <nz-spin [nzSpinning]="loading" style="display: inline-block">
      <button
        class="buttonType"
        nz-popover
        *ngIf="isPopover; else elseBlock"
        [nzPopoverContent]="popoverContent"
        nzPopoverPlacement="bottomRight"
        nzPopoverTrigger="click"
        [(nzVisible)]="visible"
      >
        <span class="span_container">
          <span class="icon-warp" nz-tooltip nzTitle="{{text}}">
            <img [ngStyle]="iconStyle" src="{{imgSrc}}" alt="1" [class.icon-disabled]="disabled">
          </span>
          <span *ngIf="!isTooltip" class="button-text">{{text}}</span>
        </span>
      </button>
      <ng-template #elseBlock>
        <button class="buttonType" *ngIf="showExpand" (click)="click()" [disabled]="disabled">
          <span class="span_container" [class.disabled]="disabled">
            <span class="icon-warp" nz-tooltip nzTitle="{{text}}">
              <img [ngStyle]="iconStyle" src="{{imgSrc}}" alt="1" [class.icon-disabled]="disabled">
            </span>
            <span *ngIf="!isTooltip" class="button-text">{{text}}</span>
          </span>
        </button>
      </ng-template>
    </nz-spin>
  `,
  styles: [`
    /* .loading {
      position: absolute;
      left: 22px;
      top: 20px;
    } */

    .span_container {
      padding: 0 10px;
      /* padding: 0px 15px 0px 15px; */
      display: inline-block;
      text-align: center;
      cursor: pointer
    }

    .disabled {
        cursor: not-allowed !important;
        background-color: transparent;
    }

    .buttonType {
      border: none;
      outline: none;
      background-color: rgb(255, 255, 255);
      /* background-color: rgb(248, 248, 248); */
      transition-duration: 0.4s;
      border-radius: 4px;
      margin-right: 5px;
    }

    .icon-warp {
      display: block;
      overflow: hidden;
    }

    .buttonType:hover {
      /* background-color: rgb(200, 200, 200); */
      background-color: rgba(0, 0, 0, 0.04);
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
    .button-text {
      padding-bottom: 5px;
      display: block;
    }
  `],
})
export class CustomButtonComponent implements OnInit, OnChanges {
  @Input() public loading = false;
  @Input() text = '按钮文本';
  @Input() src = '基础icon-修改';
  @Input() compleSrc = '';
  @Input() compleSrcDisabled = '';
  imgSrc = '基础icon-修改'; // 图片路径
  @Input() srcDisabled = '基础icon-修改';
  @Input() disabled = false;
  @Input() showExpand = true;
  @Input() isTooltip = false; // 是否展示文字，默认展示
  @Input() iconStyle: {} = {
    width: '32px',
    height: '32px',
    'font-size': '32px',
    // width: '35px',
    // height: '40px',
    // 'font-size': '35px',
  };
  @Input() textStyle: {} = { 'font-size': '8px' };

  /** 是否启用弹窗展示内容 */
  @Input() isPopover = false;

  /** 内容模板 */
  @Input() popoverContent: TemplateRef<any>;

  @Input() visible: boolean;

  @Output() clickEvent = new EventEmitter();

  constructor() {
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.disabled) {
      this.imgSrc = !this.compleSrcDisabled ? (ICON_NAME_SPACE + this.srcDisabled + ICON_FORMAT) : this.compleSrcDisabled;
    } else {
      this.imgSrc = !this.compleSrc ? (ICON_NAME_SPACE + this.src + ICON_FORMAT) : this.compleSrc;
    }
  }

  // 点击事件
  public click() {
    if (!this.disabled && !this.loading) {
      this.clickEvent.emit();
    }
  }
}
