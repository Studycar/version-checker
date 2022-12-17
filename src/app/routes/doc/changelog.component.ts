import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'change-log',
  styles: [`
  .main-container {
    padding: 12px 170px 144px 64px;
    background: #fff;
    min-height: 500px;
    overflow: hidden;
    border-left: 1px solid #ebedf0;
    position: relative;
    margin-left: -1px;
}
  .markdown {
    color: #314659;
    font-size: 14px;
    line-height: 2;
    display: block;
}`],
  template: `
  <div class='main-container'>
    <div markdown class='markdown' [src]="'./assets/doc/changelog.zh-CN.md'"></div>
  </div>`,
})
export class ChangeLogComponent {
  constructor(modalSrv: NzModalService) {
    modalSrv.closeAll();
  }
}
