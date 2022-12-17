import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { EditService } from './edit.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { State, process, aggregateBy } from '@progress/kendo-data-query';
import { UiType } from '../../../modules/base_module/components/custom-form-query.component';
import { map } from 'rxjs/operators/map';
import { GridDataResult, RowArgs, SelectableSettings, RowClassArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomBaseContext } from '../../../modules/base_module/components/custom-base-context.component';
import { ColorManageService } from '../../../modules/generated_module/services/color-manage-service';
import { CustomExcelExportComponent } from '../../../modules/base_module/components/custom-excel-export.component';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { ColorManagerEditComponent } from './edit/edit.component';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { environment } from '@env/environment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'colormanager',
  templateUrl: './colormanager.component.html',
  styles: [
    `
      :host ::ng-deep .se__control {
        overflow: inherit;
      }
    `
  ],
  providers: [EditService],
})
export class ColorManagerComponent extends CustomBaseContext implements OnInit {
  expandForm = false;
  public gridView: GridDataResult;
  public gridData: any[] = [];
  public pageSize = 10;
  public skip = 0;
  ColorHeadOption: any[] = [];
  ColorOption: any[] = [];
  colorvalue = '#000000';
  DisEnable = 'disabled';
  CurLng: any;
  UpdateList: any[] = [];
  h = '2600px';
  public queryParams = {
    defines: [
      { field: 'colorName', title: '颜色编码', ui: { type: UiType.string } },
      { field: 'meaning', title: '颜色名称', ui: { type: UiType.string } }
    ],
    values: {
      colorName: '',
      meaning: ''
    }
  };
  public context = this;
  selectIndex = 0;
  // strselectIndex = '1';
  strselectheaderid = '1';
  selectedIndexheader = 0;
  public cells: any = {
    border: '1px solid black',
    'font-family': 'Arial',
    textAlign: 'center',
  };
  // public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 20,
  };
  httpAction = { url: this.editService.queryUrl, method: 'GET', data: false };
  public changes: any = {};
  public mySelection: any[] = [];
  // queryParams: any = {};
  Options: any = {};
  constructor(
    private formBuilder: FormBuilder,
    public editService: EditService,
    private colorManageService: ColorManageService,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    public QueryService: CommonQueryService,
    public appConfigService: AppConfigService,
    public appTranslationService: AppTranslationService
  ) { super({ appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService }); }

  public tabs: any[] = [];
  testname = ['system', 'series', 'planning_type', 'processing_lead_time', 'suit_status'];
  tagname = [];
  tagheaderid = [];

  hiddenColumns = [];
  public optionsFind(value: string, optionsIndex: number): any {
    const options = [];
    switch (optionsIndex) {
    }
    return options.find(x => x.value === value) || { label: value };
  }
  colorItems = [
    {}
  ];

  public colorPickerChange(name: string, enevt: any) {
    let flag = false;
    this.DisEnable = '';
    const value = enevt.indexOf('rgb') === -1 ? enevt : this.rgb2hex(enevt);
    const temp = {
        colorName: name,
        colorValue: value
    };

    this.UpdateList.forEach(res => {
      if (res.colorName === name) {
        res.colorValue = value;
        flag = true;
      }
    });
    if (!flag) {
      this.UpdateList.push(temp);
    }
  }

  changeColor(name: string, tag: string) {
    this.Options.colorName = name;
    this.ColorOption.forEach(d => {
      if (d.colorName === name) {
        console.log(d.tag);
        this.Options.colorValue = d.tag;
      }
    });
    this.DisEnable = '';
    const temp = {
      colorName: this.Options.colorName,
      colorValue: this.Options.colorValue
    };
    this.UpdateList.push(temp);
  }

  public add(item?: any) {
    this.modal
      .static(
        ColorManagerEditComponent,
        {
          i: {},
          CurLng: this.CurLng,
        },
        'lg'
      )
      .subscribe((res) => {
        if (res) {
          this.query();
        }
      });
  }


  tabSelect(arg: any): void {
    this.selectIndex = arg.index;
    // this.strselectIndex = arg.index.toString();
    this.strselectheaderid = arg.headerid;
    // this.selectedIndexheader = arg.index;
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    // this.Options.colorValue = '#000000';
    this.CurLng = this.appConfigService.getLanguage();

    this.viewAsync = this.editService.pipe(
      map(data => process(data, this.gridState)),
    );
    this.clear();
    this.query();
  }
  query() {
    const colorName = this.queryParams.values.colorName ? this.queryParams.values.colorName : '';
    const meaning = this.queryParams.values.meaning ? this.queryParams.values.meaning : '';
    this.DisEnable = 'disabled';
    this.ColorOption.length = 0;
    this.ColorHeadOption.length = 0;
    this.tabs.length = 0;
    if ((colorName !== '' && colorName !== null) || (meaning !== '' && meaning !== null)) {
      this.queryByParam(colorName, meaning);
    } else {
      this.queryNoParam();
    }
  }

  queryByParam(colorName: string, meaning: string) {
    this.editService.GetColor('', this.CurLng, colorName, meaning).subscribe(result => {
      result.data.forEach(x => {
        // 动态加载banner栏位
        const temp = {
          active: true,
          index: 1,
          name: x.dimensionality,
          headerid: x.headerId
        };
        this.tabs.push(temp);
        if (x !== null && x !== undefined)
          this.ColorOption.push(x);
      });

    });
  }
  queryNoParam() {
    this.editService.GetColorHead().subscribe(result => {
      let k = 1;
      this.ColorOption.length = 0;
      this.ColorHeadOption.length = 0;
      this.tabs.length = 0;
      result.data.forEach(d => {
        this.ColorHeadOption.push({
          label: d.dimensionality,
          value: d.id,
        });
        // 动态加载banner栏位
        const temp = {
          active: k === 1 ? true : false,
          index: k++,
          name: d.dimensionality,
          headerid: d.id
        };
        this.tabs.push(temp);
      });
      // 初始化页签
      this.tabSelect({index: this.selectedIndexheader, headerid: this.tabs[this.selectedIndexheader].headerid});
      this.ColorHeadOption.forEach(i => {
        this.editService.GetColor(
          i.value,
          this.CurLng,
          this.queryParams.values.colorName ? this.queryParams.values.colorName : '',
          this.queryParams.values.meaning ? this.queryParams.values.meaning : ''
        ).subscribe(result2 => {
          result2.data.forEach(x => {
            if (x !== null && x !== undefined) {                
                this.ColorOption.push(x);
            }              
          });
        });
      });
    });
  }

  Update() {
    const dto = {
      colorName: this.Options.colorName,
      colorValue: this.Options.colorValue,
    };
    // dto.colorValue = parseInt(dto.colorValue.slice(1), 16);
    // 去掉开头的#, 转成10进制保存在数据库
    this.editService.UpdateColor(this.UpdateList).subscribe(res => {console.info(res)
      if (res.code === 200) {
        this.msgSrv.success(res.msg || '更新成功');
        this.DisEnable = 'disabled';
        this.UpdateList = [];
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  public pageChange({ skip, take }): void {
    this.skip = skip;
    this.pageSize = take;
    this.editService.read(this.httpAction);
  }

  public RGBToHex(rgb) {
    const x = parseInt(rgb, 10);
    let k = x.toString(16);
    const len = k.length;
    const diff_len = 6 - len;
    // #000000 不满6位的用0填充6位
    for (let i = 0; i < diff_len; i++) {
      k = '0' + k;
    }
    return '#' + k;
  }

  public ChanceYesNo() {
    return this.DisEnable;
  }

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

  public clear() {
    this.queryParams.values = {
      colorName: '',
      meaning: ''
    };
  }
}



