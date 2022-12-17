import { Injectable } from '@angular/core';
import { I18NService } from '@core/i18n/i18n.service';

// 提供文本翻译的服务
@Injectable({
  providedIn: 'root',
})
export class AppTranslationService {
  protected translation: any;

  constructor(protected i18NService: I18NService) {}

  // 翻译指定文本，翻译不存在时返回原文本
  translate(text: string, ...args) {
    if (!text) {
      return text;
    }
    text = this.i18NService.fanyi(text) || text;
    if (args.length === 0) return <any>text;
    const param = args[0];
    if (typeof param === 'object') {
      for (const key in param)
        text = text.replace(new RegExp('\\{' + key + '\\}', 'g'), param[key]);
    } else {
      for (let i = 0; i < args.length; i++)
        text = text.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i]);
    }
    return <any>text;
  }
}
