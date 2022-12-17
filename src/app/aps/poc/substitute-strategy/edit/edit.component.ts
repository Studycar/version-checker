import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
// import { LookupCodeManageService } from '../../../../modules/generated_module/services/lookup-code-manage-service';
//import { SubstituteStrategyManageService } from '../../../../modules/generated_module/services/substitute-strategy-manage-service';
import { deepCopy } from '@delon/util';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'substitute-strategy-edit',
  templateUrl: './edit.component.html',
})
export class SubstituteStrategyEditComponent implements OnInit {
  title: String = '编辑信息';
  // languageOptions: any[] = [];
  // applicationOptions: any[] = [];
  plantOptions :any[] = [];
  mixUseOptions : any[] = [];
  substituteStrategyOptions: any[] = [];//替代策略值集
  useStrategyOptions: any[] = [];//消耗策略值集
  buyStrategyOptions: any[] = [];//采购策略值集
  record: any = {};
  i: any;
  iClone: any;
  // CurLng: any;
  isModify = false;
  @ViewChild('sf', {static: true}) sf: SFComponent;
  // schema: SFSchema = {
  //   properties: {
  //     TYPECODE: {
  //       type: 'string',
  //       title: '编码类型'
  //     },
  //     MEANING: {
  //       type: 'string',
  //       title: '编码名称'
  //     },
  //     APPLICATIONCODE: {
  //       type: 'string', title: '应用模块', ui: 'select',
  //       enum: []
  //     },
  //     DESCRIPTION: {
  //       type: 'string',
  //       title: '描述',
  //     },
  //     LNG: {
  //       type: 'string',
  //       title: '语言',
  //       ui: 'select',
  //       enum: []
  //     }
  //   },
  //   required: ['TYPECODE', 'APPLICATIONCODE', 'LNG'],
  // };
  // ui: SFUISchema = {
  //   '*': {
  //     spanLabelFixed: 120,
  //     grid: { span: 24 },
  //   },
  // };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    //private SubstituteStrategyManageService: SubstituteStrategyManageService
  ) { }

  ngOnInit(): void {
    if (this.i.ID == null) {
      this.title = '新增信息';
      this.i.MIX_USED = 'N';
      // this.i.LNG = this.CurLng; // 给当前默认的登录语言
    } else {
      // this.schema.properties.TYPECODE.readOnly = true;
      // this.schema.properties.MEANING.readOnly = true;
      // this.schema.properties.APPLICATIONCODE.readOnly = true;
      // this.schema.properties.LNG.readOnly = true;
      this.isModify = true;
      this.iClone = Object.assign({}, this.i);
    }
    this.loadData();
  }

  loadData() {
    // this.schema.properties.APPLICATIONCODE.enum = this.applicationOptions;
    // this.schema.properties.LNG.enum = this.languageOptions;
    /* 初始化应用程序 */
    /*
    this.applicationOptions.length = 0;
    this.lookupCodeManageService.GetAppliaction().subscribe(result => {
      result.Extra.forEach(d => {
        this.applicationOptions.push({
          label: d.APPLICATION_NAME,
          value: d.APPLICATION_ID
        });
      });
      this.schema.properties.APPLICATION_CODE.enum = this.applicationOptions;
      this.sf.refreshSchema();
    });
    */

    /*初始化编辑数据*/
    /*
    if (this.i.ID != null) {
      this.lookupCodeManageService.Get(this.i.ID).subscribe(resultMes => {
        if (resultMes.Extra !== undefined && resultMes.Extra.length > 0) {
          const d = resultMes.Extra[0];
          // this.i = d;
          this.i = {
            ID: d.ID,
            TYPECODE: d.TYPECODE,
            MEANING: d.MEANING,
            APPLICAIONID: Number(d.APPLICATIONID),
            DESCRIPTION: d.DESCRIPTION,
            LNG: d.LNG
          };
        }
      });
    }
    */
  }
  save(value: any) {
    if (this.i.ID != null) {
      value.ID = this.i.ID;
    } else {
      value.ID = null;
    }
    // if (this.i.ID === null) {
    //   this.SubstituteStrategyManageService.Save(this.i).subscribe(res => {
    //     if (res.Success === true) {
    //       this.msgSrv.success(res.Message || '保存成功');
    //       this.modal.close(true);
    //     } else {
    //       this.msgSrv.error(res.Message);
    //     }
    //   });
    // } else {
    //   this.SubstituteStrategyManageService.Update(this.i).subscribe(res => {
    //     if (res.Success === true) {
    //       this.msgSrv.success(res.Message || '更新成功');
    //       this.modal.close(true);

    //     } else {
    //       this.msgSrv.error(res.Message);
    //     }
    //   });
    // }
  }

  close() {
    this.modal.destroy();
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
