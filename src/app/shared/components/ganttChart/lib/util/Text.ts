import { Util } from '@shared/components/ganttChart/lib/util/Util';

export class TextController {
  private util: Util;
  private fieldsBoolean: boolean[];
  private fields: string[];
  private displayFields: string[];

  constructor(util: Util) {
    this.util = util;
  }

  public init(fields: string[], fieldBoolean: boolean[]) {
    this.fields = fields;
    this.fieldsBoolean = fieldBoolean;
    this.displayFields = this.fields.filter((f, i) => this.fieldsBoolean[i]);
  }

  public getDisplayText(toolTipContent: { [key: string]: string | number }): string {
    const len = this.displayFields.length;
    let text = '';
    this.displayFields.forEach((f, i) => text += `${toolTipContent[f]}${i < len - 1 ? '\n' : ''}`);
    return text;
  }


}
