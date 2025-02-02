import { Component } from '@angular/core';

@Component({
  selector: 'header-icon',
  template: `
    <div class="item" nz-dropdown [nzDropdownMenu]="menu">
      <i class="anticon anticon-appstore-o"></i>
    </div>
    <nz-dropdown-menu nzTrigger="click" nzPlacement="bottomRight" (nzVisibleChange)="change()" #menu="nzDropdownMenu">
      <div nz-menu class="wd-xl animated jello">
        <nz-spin [nzSpinning]="loading" [nzTip]="'正在读取数据...'">
          <div nz-row [nzType]="'flex'" [nzJustify]="'center'" [nzAlign]="'middle'" class="app-icons">
            <div nz-col [nzSpan]="6">
              <i class="anticon anticon-calendar bg-error text-white"></i>
              <small>Calendar</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i class="anticon anticon-file bg-teal text-white"></i>
              <small>Files</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i class="anticon anticon-cloud bg-success text-white"></i>
              <small>Cloud</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i class="anticon anticon-star-o bg-magenta text-white"></i>
              <small>Star</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i class="anticon anticon-team bg-purple text-white"></i>
              <small>Team</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i class="anticon anticon-scan bg-warning text-white"></i>
              <small>QR</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i class="anticon anticon-pay-circle-o bg-cyan text-white"></i>
              <small>Pay</small>
            </div>
            <div nz-col [nzSpan]="6">
              <i class="anticon anticon-printer bg-grey text-white"></i>
              <small>Print</small>
            </div>
          </div>
        </nz-spin>
      </div>
    </nz-dropdown-menu>
  `,
})
export class HeaderIconComponent {
  loading = true;

  change() {
    setTimeout(() => (this.loading = false), 500);
  }
}
