import { Component, ElementRef, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { MidDWCategoriesService } from '../../query.service';
import { Renderer2 } from '@angular/core';


@Component({
  selector: 'algorithm-engine-categories-datasets-edit',
  templateUrl: './edit.component.html',
  providers: [MidDWCategoriesService]
})
export class AlgorithmEngineCategoriesDatasetsEditComponent implements OnInit {
  public optionListType: any[] = [];
  isDisabled = false;
  isModify = false;
  i: any;
  iClone: any;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: MidDWCategoriesService,
    private appConfigService: AppConfigService,
    private el:ElementRef,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }
  // 初始化数据
  loadData() {
    if (this.i.id != null && this.i.id != '') {
      this.isModify = true;
      if (this.i.datasetStatus == 'ACTIVATED') {
        this.isDisabled = true;
      }else {
        this.isDisabled = false;
      }
      this.iClone = Object.assign({}, this.i);
    }

    this.editService
      .GetLookupByType('AI_MID_DW_DATASET_TYPE')
      .subscribe(result => {
        result.Extra.forEach(d => {
          this.optionListType.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
  }
  combie() {
    var combineStr = 'select \n';
    if ((this.i.sqlColumnClauses != null && this.i.sqlColumnClauses != '')
      && (this.i.sqlTableClauses != null && this.i.sqlTableClauses != '')) {
      var sqlColumn = new String(this.i.sqlColumnClauses);
      if (sqlColumn.indexOf('*') >= 0) {
        this.i.sqlColumnClauses = '';
        this.i.totalSqlStatements = '';
        this.msgSrv.error(this.appTranslationService.translate('SQL脚本列名称不能包含*字符'));
        return;
      }
      this.i.totalSqlStatements = (combineStr += sqlColumn + ' \n from \n') + this.i.sqlTableClauses;
    }
    if ((this.i.sqlWhereClauses != null && this.i.sqlWhereClauses != '')) {
      this.i.totalSqlStatements += ('\n where \n' + this.i.sqlWhereClauses);
    }
  }

  submit() {
    if (this.i.id == null || this.i.id == '') {
      this.msgSrv.error(this.appTranslationService.translate('SQL调试并保存成功后再提交'));
    } else {
      this.editService.submit(this.i.id).subscribe(res => {
        if (res.code === 200) {
          this.msgSrv.success(this.appTranslationService.translate(res.msg));
          this.modal.close(true);
        } else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
        }
      });
    }
  }

  // 保存
  save(value: any) {
    this.renderer.setAttribute(this.el.nativeElement.querySelector('#sqlDebug'), 'disabled', "true");  
    this.editService.saveDatasets(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        this.modal.close(true);
      } else {
        var msg = new String(res.msg);
        if (msg.indexOf('#') >= 0) {
          this.msgSrv.error(this.appTranslationService.translate(msg.split('#')[0]));
          this.i.debugLogs = msg.split('#')[1];
        }
        else {
          this.msgSrv.error(this.appTranslationService.translate(res.msg));
          this.i.debugLogs = '';
        }
      }
    });
  }
  // 关闭
  close() {
    this.modal.destroy();
  }
  // 重置
  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
