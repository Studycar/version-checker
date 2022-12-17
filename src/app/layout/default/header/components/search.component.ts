import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, flatMap } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { NzSelectComponent } from 'ng-zorro-antd';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'layout-simple-header-search',
  template: `
  <i class="anticon anticon-search"></i>
  <div class="input ant-select-auto-complete ant-select">
    <nz-select #nst style="width: 300px;" [ngModel]="q"
      nzShowSearch [nzServerSearch]="true" (nzOnSearch)="changeQ($event)" (ngModelChange)="to($event)" [nzPlaceHolder]="'在菜单中搜索' | translate">
      <nz-option-group *ngFor="let group of list" [nzLabel]="group.text">
        <nz-option *ngFor="let option of group.children" [nzValue]="option.link" nzCustomContent><span [innerHtml]="sanitizer.bypassSecurityTrustHtml(option.text)"></span></nz-option>
      </nz-option-group>
    </nz-select>
  </div>
  `,
  host: {
    '[class.ad-header-search]': 'true',
    '[class.item]': 'true',
  },
  preserveWhitespaces: false,
})
export class HeaderSearchComponent implements OnInit, OnDestroy {
  show = false;
  q: string;
  list: any[] = [];
  listTmp: any[] = [];
  @ViewChild('nst', {static: true})
  private nst: NzSelectComponent;

  constructor(
    private http: _HttpClient,
    private router: Router,
    public sanitizer: DomSanitizer,
  ) {}

  @HostListener('click')
  _click() {
    this.list = JSON.parse(localStorage.getItem('menus'));
    this.listTmp = this.list;
  }

  changeQ(value: any) {
    this.list = this.search(value);
  }

  to(item: any) {
    if (item) {
      this.router.navigateByUrl(item);
      // this.nst.clearNgModel();
    }
  }

  search(q: string, childrenMax = 5): any[] {
    const res: any[] = [];
    for (const g of this.listTmp) {
      const type = g.text.toLowerCase();
      const children: any[] = g.children
        .filter(w => w.text.toLowerCase().includes(q.toLowerCase()))
        .map(item => {
          let title = item.text;
          if (q) {
            let startIndex = 0;
            const indexs: number[] = [];
            // 将匹配到的字符索引记录下来
            while (
              (startIndex = item.text
                .toUpperCase()
                .indexOf(q.toUpperCase(), startIndex)) !== -1
            ) {
              if (!indexs.find(i => i === startIndex)) {
                indexs.push(startIndex);
              }
              startIndex += q.length;
            }
            // 倒序插入<b></b>
            for (let i = indexs.length - 1; i >= 0; i--) {
              title =
                title.substring(0, indexs[i]) +
                '<b style="color:#1890ff">' +
                title.substring(indexs[i], indexs[i] + q.length) +
                '</b>' +
                title.substring(indexs[i] + q.length, title.length);
            }
          }
          return {
            text: title,
            link: item.link,
          };
        });
      if (children != null && children.length) {
        res.push({
          text: g.text,
          children: children.slice(0, childrenMax),
        });
      }
    }
    return res;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  // <i class="anticon anticon-search"></i>
  // <div class="input ant-select-auto-complete ant-select">
  //   <nz-select style="width: 300px;" [ngModel]="q"
  //     nzShowSearch [nzServerSearch]="true" (nzOnSearch)="changeQ($event)" (ngModelChange)="to($event)" [nzPlaceHolder]="'在菜单中搜索' | translate">
  //     <nz-option-group *ngFor="let group of list" [nzLabel]="group.text">
  //       <nz-option *ngFor="let option of group.children" [nzValue]="option.link" [nzLabel]="option.text"></nz-option>
  //     </nz-option-group>
  //   </nz-select>
  // </div>

  // <i class="anticon anticon-search"></i>
  // <div class="input ant-select-auto-complete ant-select" [class.show]="show">
  //   <input #ipt placeholder="站内搜索" nz-input [nzAutocomplete]="searchAuto"
  //     (ngModelChange)="to($event)"
  //     (input)="changeQ($event.target?.value)"
  //     (blur)="show=false">
  // </div>
  // <nz-autocomplete #searchAuto (ngModelChange)="to($event)" >
  //   <nz-auto-optgroup *ngFor="let group of list" [nzLabel]="groupTitle">
  //   <ng-template #groupTitle>
  //     <span>{{group.text}}
  //       <a class="more-link" href="https://www.google.com/search?q=ng+zorro" target="_blank">更多</a>
  //     </span>
  //   </ng-template>
  //   <nz-auto-option *ngFor="let option of group.children" [nzLabel]="option.text" [nzValue]="option.link">
  //     {{option.text}}
  //   </nz-auto-option>
  // </nz-auto-optgroup>
  // </nz-autocomplete>
}
