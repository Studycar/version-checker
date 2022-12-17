import { Component, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { MenuService } from '@delon/theme';
import { deepCopy } from '@delon/util';
import { Router } from '@angular/router';
import { BrandService } from '../../pro.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';

// bypassSecurityTrustHtml 转为安全的html 不然没有颜色样式 推荐在绑定时使用管道 {{ title | html }}
@Component({
  selector: 'layout-pro-search',
  templateUrl: 'search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class LayoutProWidgetSearchComponent {
  private _list: any[] = [];
  private currentList: any[] = [];
  searchMenuValue: string;

  get menus() {
    return this.menuService.menus;
  }

  set list(list: any[]) {
    this._list = list;
    this.currentList = deepCopy(list);
  }

  get list() {
    return this.currentList;
  }

  get autoCompleteWidth() {
    return this.pro.collapsed ? 160 : '';
  }

  constructor(
    private el: ElementRef,
    private menuService: MenuService,
    public sanitizer: DomSanitizer,
    public pro: BrandService,
    public transSvr: AppTranslationService,
    private route: Router,
    private menuSrv: MenuService,
  ) {
    this.menuSrv.change.subscribe(res => this.list = JSON.parse(localStorage.getItem('menus')));
  }

  onChange(value: any): void {
    this.currentList = this.search(value);
  }

  goToPage(): void {
    if(this.currentList.length > 0) {
      const childrenList = this.currentList[0].children;
      if(childrenList.length > 0) {
        const page = childrenList.find(c => c.value === this.searchMenuValue);
        if(page) {
          this.route.navigate([page.link]);
        }
      }
    }
  }

  search(q: string, childrenMax = 5): any[] {
    const res: any[] = [];
    for (const g of this._list) {
      const children: any[] = g.children
        .filter(w => w.text.toLowerCase().includes(q.toLowerCase()))
        .map(item => {
          let title = this.transSvr.translate(item.text);
          // let title = item.text;
          if (q) {
            let startIndex = 0;
            const indexs: number[] = [];
            // 将匹配到的字符索引记录下来
            while (
              (startIndex = title
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
                '<strong style="color:#C00">' +
                title.substring(indexs[i], indexs[i] + q.length) +
                '</strong>' +
                title.substring(indexs[i] + q.length, title.length);
            }
          }

          return {
            text: this.sanitizer.bypassSecurityTrustHtml(title),
            link: item.link,
            value: item.text,
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
}
