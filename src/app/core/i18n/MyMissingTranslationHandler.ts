import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { BaseTranslatorInputDto } from 'app/modules/generated_module/dtos/base-translator-input-dto';
import { HttpClient } from '@angular/common/http';

export class MyMissingTranslationHandler implements MissingTranslationHandler {
    localStorageKey = 'MyMissingTranslationHandlerKey';
    handle(params: MissingTranslationHandlerParams) {
        const tranKey = params.key;
        const dto = new BaseTranslatorInputDto();
        dto.devLanguageRd = tranKey;
        dto.languageCode = 'zh-CN';
        // this.httpClient.post('/afs/servertranslator/translator/InsertOneLngDev', dto);
        let lsTransText = localStorage.getItem(this.localStorageKey);
        if (lsTransText) {
            const tranKeyTmp = tranKey + '$$';
            if (lsTransText.includes(tranKeyTmp)) {
                return tranKey;
            }
            lsTransText += tranKeyTmp;
        } else {
            lsTransText = tranKey + '$$';
        }
        // console.log(lsTransText);
        localStorage.removeItem(this.localStorageKey);
        localStorage.setItem(this.localStorageKey, lsTransText);
        return tranKey;
    }
}
