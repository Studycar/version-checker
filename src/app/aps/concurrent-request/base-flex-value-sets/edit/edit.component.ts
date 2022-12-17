import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { BaseFlexValueSetsManageService } from '../../../../modules/generated_module/services/base-flex-value-sets-manage-service';
import { BaseFlexValueSetsDetailComponent } from '../detail/detail.component';
import { BaseFlexValueSetsDetail2Component } from '../detail2/detail2.component';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-flex-value-sets-edit',
  templateUrl: './edit.component.html',
})
export class BaseFlexValueSetsEditComponent implements OnInit {
  validationtypes: any[] = [];
  formattypes: any[] = [];
  record: any = {};
  i: any;
  iClone: any;
  isDate: any;
  isDateTime: any;
  isOthers: any;
  roMaximumSize: Boolean;
  roNumberPrecision: Boolean;
  roNumberOnlyFlag: Boolean;
  roUppercaseOnlyFlag: Boolean;
  roNumericModeEnabledFlag: Boolean;
  isModify: boolean;

  constructor(
    private modal: NzModalRef,
    private modal1: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public translateservice: AppTranslationService,
    private baseFlexValueSetsManageService: BaseFlexValueSetsManageService,
    private commonQueryService: CommonQueryService,
  ) { }

  ngOnInit(): void {
    // this.msgSrv.success(this.record.ID);
    /** 初始化應用程序 */
    this.loadData();

    if (
      this.i.flexValueSetId !== null &&
      this.i.flexValueSetId !== undefined
    ) {
      /** 初始化编辑数据 */
      this.isModify = true;
      this.baseFlexValueSetsManageService
        .Get(this.i.flexValueSetId)
        .subscribe(result => {
          this.i = result.data;
          this.setComponent(this.i.formatType, 0);
          this.iClone = Object.assign({}, this.i);
          console.log('this.i.uppercaseOnlyFlag');
          console.log(this.i.uppercaseOnlyFlag);
        });
    } else {
      this.isModify = false;
    }
  }

  loadData() {

    this.commonQueryService.GetLookupByTypeRef('FND_VALUE_SETS_VALIDATION_TYPE', this.validationtypes);
    this.commonQueryService.GetLookupByTypeRef('FND_VALUE_SETS_FORMAT_TYPE', this.formattypes);

    // this.baseFlexValueSetsManageService
    //   .GetValidationType()
    //   .subscribe(result => {
    //     this.validationtypes = result.Extra.map(d => {
    //       return {
    //         label: d.VALIDATION_NAME,
    //         value: d.validationType,
    //       };
    //     });
    //   });

    //   this.baseFlexValueSetsManageService.GetFormatType().subscribe(result => {
    //     this.formattypes = [];
    //     result.Extra.forEach(d => {
    //       this.formattypes.push({
    //         label: d.FORMAT_NAME,
    //         value: d.formatType,
    //       });
    //     });
    //   });
  }

  setComponent(value: any, itype: any) {
    /*C-字符, N-数字 X-标准日期 Y-标准日期时间*/
    if (value === 'C' || value === 'N') {
      if (value === 'C') {
        this.roMaximumSize = false;
        this.roNumberPrecision = true;
        this.roNumberOnlyFlag = false;
        this.roUppercaseOnlyFlag = false;
        this.roNumericModeEnabledFlag = false;
      }

      if (value === 'N') {
        this.roMaximumSize = false;
        this.roNumberPrecision = false;
        this.roNumberOnlyFlag = true;
        this.roUppercaseOnlyFlag = true;
        this.i.uppercaseOnlyFlag = false;
        this.roNumericModeEnabledFlag = true;
        this.i.uppercaseOnlyFlag = false;
        if (itype === 1) {
          this.i.numberOnlyFlag = true;
          this.i.uppercaseOnlyFlag = false;
          this.i.numericModeEnabledFlag = false;
        }
      }

      if (itype === 1) {
        this.i.minimumValue = '';
        this.i.maximumValue = '';
      }
    } else {
      this.roMaximumSize = true;
      this.roNumberPrecision = true;
      this.roNumberOnlyFlag = true;
      this.roUppercaseOnlyFlag = true;
      this.roNumericModeEnabledFlag = true;
      if (itype === 1) {
        this.i.numberOnlyFlag = false;
        this.i.uppercaseOnlyFlag = false;
        this.i.numericModeEnabledFlag = false;
        this.i.minimumValue = '';
        this.i.maximumValue = '';
      }

      if (value === 'X') {
        this.i.maximumSize = '11';
      } else if (value === 'Y') {
        this.i.maximumSize = '20';
      }
    }

    if (value === 'C' || value === 'N') {
      this.isDate = false;
      this.isDateTime = false;
      this.isOthers = true;
    } else if (value === 'X') {
      this.isDate = true;
      this.isDateTime = false;
      this.isOthers = false;
    } else {
      this.isDate = false;
      this.isDateTime = true;
      this.isOthers = false;
    }

    // lijian增加代码，如果属性为空字符串，则改为false，否则checkbox的选中状态不对（后台搞的问题，不敢随便改后台代码）
    if (this.i.uppercaseOnlyFlag === '') {
      this.i.uppercaseOnlyFlag = null;
    }

    if (this.i.numericModeEnabledFlag === '') {
      this.i.numericModeEnabledFlag = null;
    }

    if (this.i.numberOnlyFlag === '') {
      this.i.numberOnlyFlag = null;
    }
  }

  formattypechange(value?: any) {
    console.log('formattypechange(value?: any)');
    this.setComponent(this.i.formatType, 1);
  }

  save() {
    if (this.i.numberOnlyFlag) {
      if (this.i.minimumValue === null) {
        this.msgSrv.error(
          this.translateservice.translate('最小值 仅限于数字(0-9)'),
        );
        return;
      }

      if ( this.i.maximumValue === null) {
        this.msgSrv.error(
          this.translateservice.translate('最大值 仅限于数字(0-9)'),
        );
        return;
      }

      if (this.i.minimumValue > this.i.maximumValue) {
        this.msgSrv.error(
          this.translateservice.translate('最大值不能小于最小值'),
        );
        return;
      }
    }

    if (this.i.uppercaseOnlyFlag) {


      console.log('this.i.minimumValue' + this.i.minimumValue);
      if (this.i.minimumValue !== null) {
        if (!this.allCaps(this.i.minimumValue)) {
          this.msgSrv.error(
            this.translateservice.translate('最小值仅限于大写字母'),
          );
          return;
        }
      }

      if (this.i.maximumValue !== null) {
        if (!this.allCaps(this.i.maximumValue)) {
          this.msgSrv.error(
            this.translateservice.translate('最大值仅限于大写字母'),
          );
          return;
        }
      }
    }


    if (this.i.numericModeEnabledFlag && this.i.numberOnlyFlag && !this.i.uppercaseOnlyFlag) {

      if (this.i.maximumValue !== null) {
        this.i.minimumValue = this.PrefixInteger(
          this.i.minimumValue,
          this.i.maximumSize,
        );
      }
      if (this.i.maximumValue !== null) {
        this.i.maximumValue = this.PrefixInteger(
          this.i.maximumValue,
          this.i.maximumSize,
        );
      }
    }



    this.baseFlexValueSetsManageService.Edit(this.i).subscribe(res => {
      if (res.code == 200) {
        this.msgSrv.success(this.translateservice.translate('保存成功'));
        this.modal.destroy(true);
      } else {
        this.msgSrv.error(this.translateservice.translate(res.msg || '保存失败'));
      }

      /*if (this.i.flexValueSetId < 1) {
        this.i.flexValueSetId = res.Extra[0].result.substring(3, 10);
      }*/
      // this.ngOnInit();
    });
  }

  allCaps(text) {
    for (let j = 0; j < text.length; j++) {
      const c = text.charAt(j);
      if ((c < 'A' || c > 'Z') && c !== '0') return false;
    }
    return true;
  }

  PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
  }

  OpenDetail() {
    if (
      // this.i.flexValueSetId < 1 ||
      this.i.flexValueSetId === null ||
      this.i.flexValueSetId === undefined
    ) {
      this.msgSrv.error(
        this.translateservice.translate('请先保存当前界面数据'),
      );
      return;
    }

    if (this.i.validationType === 'W') {
      this.openValueSetForWebApiType();
    } else {
      this.openValueSetForTableType();
    }
  }

  /**
   * 打开验证类型为：表，的编辑界面
   */
  openValueSetForTableType() {
    this.modal1
      .static(
        BaseFlexValueSetsDetailComponent,
        {
          i: {
            flexValueSetId: this.i.flexValueSetId,
            applicationTableName: null,
            valueColumnName: null,
            valueColumnType: null,
            valueColumnSize: null,
            idColumnName: null,
            idColumnSize: null,
            idColumnType: null,
            meaningColumnName: null,
            meaningColumnSize: null,
            meaningColumnType: null,
            additionalWhereClause: 'Where 1=1',
          },
        },
        'lg',
      )
      .subscribe(() => {
        console.log('');
      });
  }

  /**
   * 打开验证类型为：表，的编辑界面
   */
  openValueSetForWebApiType() {
    this.modal1
      .static(
        BaseFlexValueSetsDetail2Component,
        {
          i: {
            flexValueSetId: this.i.flexValueSetId,
            applicationTableName: null,
            valueColumnName: null,
            valueColumnType: null,
            valueColumnSize: null,
            idColumnName: null,
            idColumnSize: null,
            idColumnType: null,
            meaningColumnName: null,
            meaningColumnSize: null,
            meaningColumnType: null,
            additionalWhereClause: '',
          },
        },
        'lg',
      )
      .subscribe(() => {
        console.log('');
      });
  }

  close() {
    // this.modal.close(true);
    this.modal.destroy();
  }

  numberChange(event, value: string, type: string) {
    const reg = /^\d*$/;
    // const formatPoint = /[\.\-]/g;
    if (!reg.test(value.slice(-1))) {
      event.target.value = value.slice(0, -1);
      if (type === 'min') {
        this.i.minimumValue = value.slice(0, -1);
      } else {
        this.i.maximumValue = value.slice(0, -1);
      }
    }
    /*if (formatPoint.test(value)) {
      event.target.value = value.replace(formatPoint, '');
    }*/
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }
}
