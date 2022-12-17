import { Component } from '@angular/core';
import { I18NService } from '@core/i18n/i18n.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less'],
})
export class LayoutPassportComponent {
  constructor(private translate: TranslateService) {
    this.translate.onLangChange.subscribe(() => {
      this.links[0].title = this.translate.instant('帮助');
      this.links[1].title = this.translate.instant('隐私');
      this.links[2].title = this.translate.instant('条款');
    });
  }
  links = [
    {
      title: this.translate.instant('帮助'),
      href: '',
    },
    {
      title: this.translate.instant('隐私'),
      href: '',
    },
    {
      title: this.translate.instant('条款'),
      href: '',
    },
  ];
}
