import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { EditService } from '.././edit.service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'colormanager-edit',
  templateUrl: './edit.component.html',
  providers: [EditService],
})
export class ColorManagerEditComponent implements OnInit {
  title: String = '新增';
  languageOptions: any[] = [];
  applicationOptions: any[] = [];
  id: any;
  unitAll: any[] = [];
  CODEOptions: any[] = [];
  i: any;
  tag: any;
  LANGUAGEText: string;
  Istrue: Boolean;
  required: Boolean;
  TRUEORfALSE = true;
  CurLng: any;
  itemStyle = { width: '180px' };
  ColorHeadOption: any[] = [];
  ColorOptionName: any[] = [];
  ColorOptionMEANING: any[] = [];

  @ViewChild('sf', {static: true}) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      colorName: {
        type: 'string', title: '颜色编码',
      },
      meaning: {
        type: 'string', title: '颜色名称',
      },
      colorValue: {
        type: 'string', title: '颜色选择',
      },
    },
    required: ['colorName', 'colorValue'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 120,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public editService: EditService,
    private confirmationService: NzModalService,
    private appTranslationService: AppTranslationService,
  ) { }

  ngOnInit(): void {
    if (this.i.id == null) {
      this.title = '新增';
    } else {
      this.title = '编辑';
    }



    this.loadData();
  }

  loadData() {
    this.i.colorValue = 'rgb(0,0,0)';

    this.editService.GetColorHead().subscribe(result => {console.info(result)
      result.data.forEach(d => {
        this.ColorHeadOption.push({
          label: d.dimensionality,
          value: d.id,
        });
      });
      this.i.headerId = '1';
    });

    this.editService.GetColor('', '', '', '').subscribe(result => {
      result.data.forEach(x => {
        if (x !== null && x !== undefined) {
          this.ColorOptionName.push({
            label: x.colorName,
            value: x.colorName,
          });
          this.ColorOptionMEANING.push({
            label: x.meaning,
            value: x.meaning,
          });
        }
      });
    });
  }
  public IsOnly(name: string, flag: number) {
    if (flag === 1)
      return this.ColorOptionName.find(x => x.value === name.trim());
    if (flag === 2)
      return this.ColorOptionMEANING.find(x => x.value === name.trim());
  }

  public confirm() {
    if ((this.i.colorName === undefined || this.i.colorName === '')
      || (this.i.meaning === undefined || this.i.meaning === '')) {
      this.confirmationService.warning({
        nzContent: this.appTranslationService.translate('输入有误'),
        nzOnOk: () => {
          return;
        },
      });
    } else {
      this.save();
    }
  }

  save() {
    const dto = {
      colorName: this.i.colorName.trim(),
      language: this.CurLng,
      colorValue: this.i.colorValue.indexOf('rgb') === -1 ? this.i.colorValue : this.rgb2hex(this.i.colorValue),
      sourceLang: this.CurLng,
      description: this.i.meaning.trim(),
      meaning: this.i.meaning.trim(),
      headerId: this.i.headerId,
    };
    // dto.colorValue = parseInt(dto.colorValue.slice(1), 16);
    // 去掉开头的#, 转成10进制保存在数据库

    this.editService.InsertColor(dto).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(res.msg  || '保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
        this.modal.close(true);
      }
    });
  }

  close() {
    this.modal.destroy();
  }

  /*clear() {
    this.i = {};
    this.i.headerId = '1';
  }*/

  public HexToRGB(rgb) {
    const regexp = /[0-9]{0,3}/g;
    const re = rgb.match(regexp); // 利用正则表达式去掉多余的部分，将rgb中的数字提取
    let hexColor = '#';
    const hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    for (let i = 0; i < re.length; i++) {
      // tslint:disable-next-line:prefer-const
      let r = null, c = re[i], l = c;
      const hexAr = [];
      while (c > 16) {
        r = c % 16;
        c = (c / 16) >> 0;
        hexAr.push(hex[r]);
      } hexAr.push(hex[c]);
      if (l < 16 && l !== '') {
        hexAr.push(0);
      }
      hexColor += hexAr.reverse().join('');
    }
    // alert(hexColor)
    // return hexColor;
    return hexColor;
  }

  public zero_fill_hex(num: number, digits: number) {
    let s = num.toString(16);
    while (s.length < digits)
      s = '0' + s;
    return s;
  }

  public rgb2hex(rgb: string) {
    if (rgb.charAt(0) === '#')
      return rgb;
    const ds = rgb.split(/\D+/);
    const decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
    return '#' + this.zero_fill_hex(decimal, 6);
  }
}
