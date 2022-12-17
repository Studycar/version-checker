import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { BaseFlexValueSetsManageService } from '../../../../modules/generated_module/services/base-flex-value-sets-manage-service';
import { isArray } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';

function getlist(value: any) {
  let cidColumnName;
  let cmeaningColumnName;
  let cvalueColumnName;
  let capplicationTableName;
  if (isArray(value.applicationTableName) && value.applicationTableName != null)
    capplicationTableName = value.applicationTableName[0];
  else
    capplicationTableName = value.applicationTableName;
  if (isArray(value.idColumnName) && value.idColumnName != null)
    cidColumnName = value.idColumnName[0];
  else
    cidColumnName = value.idColumnName;
  if (isArray(value.meaningColumnName) && value.meaningColumnName != null)
    cmeaningColumnName = value.meaningColumnName[0];
  else
    cmeaningColumnName = value.meaningColumnName;
  if (isArray(value.valueColumnName) && value.valueColumnName != null)
    cvalueColumnName = value.valueColumnName[0];
  else
    cvalueColumnName = value.valueColumnName;

  return {
    flexValueSetId: value.flexValueSetId, applicationTableName: capplicationTableName,
    valueColumnName: cvalueColumnName, valueColumnType: value.valueColumnType,
    valueColumnSize: value.valueColumnSize, idColumnName: cidColumnName,
    idColumnSize: value.idColumnSize, idColumnType: value.idColumnType,
    meaningColumnName: cmeaningColumnName, meaningColumnSize: value.meaningColumnSize,
    meaningColumnType: value.meaningColumnType, additionalWhereClause: value.additionalWhereClause,
  };
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-flex-value-sets-detail',
  templateUrl: './detail.component.html',
})

export class BaseFlexValueSetsDetailComponent implements OnInit {
  applicationTableNames: any[] = [];
  columnnames: any[] = [];
  valuecolumntypes: any[] = [];
  valuecolumnsizes: any[] = [];
  record: any = {};
  flexvaluesetid: any;
  i: any = {};
  columnTypes = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public translateservice: AppTranslationService,
    private baseFlexValueSetsManageService: BaseFlexValueSetsManageService,
  ) {
  }

  ngOnInit(): void {
    /** 初始化應用程序 */
    this.columnTypes = [
      // { label: '', value: '' },
      { label: 'DATE', value: 'D' },
      { label: 'NVARCHAR', value: 'C' },
      { label: 'NUMBER', value: 'N' },
    ];

    this.baseFlexValueSetsManageService.GetUser_tables().subscribe(result2 => {
      this.applicationTableNames = [];
      result2.data.forEach(d => {
        this.applicationTableNames.push({
          label: d.name,
          value: d.name,
        });
      });
    });

    if (this.i.flexValueSetId !== null) {
      /** 初始化编辑数据 */
      this.baseFlexValueSetsManageService.GetBase_Flex_Validation_Tables(this.i.flexValueSetId).subscribe(result => {
        if (result.data.flexValueSetId !== null) {
          this.baseFlexValueSetsManageService.GetUser_tab_columns(result.data.applicationTableName).subscribe(result1 => {
            result1.data.forEach(d => {
              this.columnnames.push({
                label: d.columnName,
                value: d.columnName,
                tag: { dataType: d.dataType, dataLength: d.dataLength },
              });
            });
          });

          this.i = result.data;
          this.i.applicationTableName = this.i.applicationTableName ? [this.i.applicationTableName] : [];
          this.i.valueColumnName = this.i.valueColumnName ? [this.i.valueColumnName] : [];
          this.i.meaningColumnName = this.i.meaningColumnName ? [this.i.meaningColumnName] : [];
          this.i.idColumnName = this.i.idColumnName ? [this.i.idColumnName] : [];
        }
      });
    }
  }

  applicationtablenamechange() {
    if (this.i.applicationTableName.length > 0) {
      this.baseFlexValueSetsManageService.GetUser_tab_columns(this.i.applicationTableName[0]).subscribe(result => {
        if (result.data !== null) {
          // 先清除，再重新绑定
          this.columnnames = [];
          result.data.forEach(d => {
            this.columnnames.push({
              label: d.columnName,
              value: d.columnName,
              tag: { dataType: d.dataType, dataLength: d.dataLength },
            });
          });
        }
      });
    }
  }

  valuecolumnnamechange() {
    if (this.i.valueColumnName.length > 0) {
      this.columnnames.forEach(element => {
        if (element.value === this.i.valueColumnName[0]) {
          this.i.valueColumnType = element.tag.dataType;
          this.i.valueColumnSize = element.tag.dataLength;
          return;
        }
      });
    }
  }

  meaningcolumnnamechange() {
    if (this.i.meaningColumnName.length > 0) {
      this.columnnames.forEach(element => {
        if (element.value === this.i.meaningColumnName[0]) {
          this.i.meaningColumnType = element.tag.dataType;
          this.i.meaningColumnSize = element.tag.dataLength;
          return;
        }
      });
    }
  }

  idcolumnnamechange() {
    if (this.i.idColumnName.length > 0) {
      this.columnnames.forEach(element => {
        if (element.value === this.i.idColumnName[0]) {
          this.i.idColumnType = element.tag.dataType;
          this.i.idColumnSize = element.tag.dataLength;
          return;
        }
      });
    }
  }

  save() {
    // 转换值
    let cidColumnName;
    let cmeaningColumnName;
    let cvalueColumnName;
    if (isArray(this.i.idColumnName) && this.i.idColumnName != null)
      cidColumnName = this.i.idColumnName[0];
    else
      cidColumnName = this.i.idColumnName;
    if (isArray(this.i.meaningColumnName) && this.i.meaningColumnName != null)
      cmeaningColumnName = this.i.meaningColumnName[0];
    else
      cmeaningColumnName = this.i.meaningColumnName;
    if (isArray(this.i.valueColumnName) && this.i.valueColumnName != null)
      cvalueColumnName = this.i.valueColumnName[0];
    else
      cvalueColumnName = this.i.valueColumnName;

    this.columnnames.forEach(element => {
      if (element.value === cvalueColumnName) {
        this.i.valueColumnType = element.tag.dataType;
        this.i.valueColumnSize = element.tag.dataLength;
      }

      if (element.value === cmeaningColumnName) {
        this.i.meaningColumnType = element.tag.dataType;
        this.i.meaningColumnSize = element.tag.dataLength;
      }

      if (element.value === cidColumnName) {
        this.i.idColumnType = element.tag.dataType;
        this.i.idColumnSize = element.tag.dataLength;
      }
    });
    console.log('this.i');
    console.log(this.i);
    this.baseFlexValueSetsManageService.EditBase_Flex_Validation_Tables(getlist(this.i)).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.translateservice.translate('保存成功'));
        this.modal.destroy();
      } else {
        this.msgSrv.error(this.translateservice.translate(res.msg));
      }
    });
  }

  check() {
    this.baseFlexValueSetsManageService.Check_Sql(getlist(this.i)).subscribe(res => {
      if (res.code === 200)
        this.msgSrv.success(this.translateservice.translate(res.msg));
      else
        this.msgSrv.error(this.translateservice.translate(res.msg));
    });
  }

  close() {
    this.modal.close(true);
    this.modal.destroy();
  }

  numberChange(event, value: string, type: string) {
    const reg = /^\d*$/;
    // const formatPoint = /[\.\-]/g;
    if (!reg.test(value.slice(-1))) {
      event.target.value = value.slice(0, -1);
      if (type === 'value') {
        this.i.valueColumnSize = value.slice(0, -1);
      } else if (type === 'meaning') {
        this.i.meaningColumnSize = value.slice(0, -1);
      } else {
        this.i.idColumnSize = value.slice(0, -1);
      }
    }
    /*if (formatPoint.test(value)) {
      event.target.value = value.replace(formatPoint, '');
    }*/
  }
}
