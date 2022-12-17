import { Component, OnInit, ViewChild, Renderer2, NgZone } from '@angular/core';
import { GridDataResult, RowArgs, SelectableSettings, RowClassArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { PopupSelectComponent } from '../../../../modules/base_module/components/popup-select.component';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { ParamControlBase } from './param-control';
import { RequestSubmitQueryService } from '../../../../modules/generated_module/services/request-submit-query-service';
import { ValueTag } from '../model/ValueTag';
import { CommonService } from '../model/CommonService';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'parameter-form',
  templateUrl: './parameter-form.component.html',
  styleUrls: ['./parameter-form.component.css'],
  providers: [CommonService]
})
export class ConcurrentRequestParameterFormComponent implements OnInit {
  i: any;
  nDicFlexNameVal: { [key: string]: string; } = {};
  params: ParamControlBase[] = [];
  controlWidth = '300px';
  divHeight = '50px';
  divWidth = '600px';
  minHeight = 60;
  maxHeight = 300;
  rowHegiht = 45;
  columns = [{
    field: 'VALUE_COLUMN_NAME',
    title: '值',
    width: '150',
    hidden: false
  },
  {
    field: 'MEANING_COLUMN_NAME',
    title: '含义',
    width: '150',
    hidden: false
  }];

  divStyle = {
    'width': '600px',
    'height': '50px',
    'overflow': 'auto'
  };

  constructor(private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private commonService: CommonService,
    private requestSubmitQueryService: RequestSubmitQueryService, ) { }

  ngOnInit() {
    this.InitParam();
  }

  Confrim() {
    for (let index = 0; index < this.params.length; index++) {
      let values = this.params[index].value;
      if (!values && this.params[index].required) {
        this.msgSrv.info('【' + this.params[index].label + '】为必填项');
        return;
      }

      if (this.params[index].controlType === 'date') {
        values = this.commonService.formatDate(values);
      } else if (this.params[index].controlType === 'datetime') {
        values = this.commonService.formatDateTime(values);
      } else if (this.params[index].controlType === 'month') {
        values = this.commonService.formatDateMonth(values);
      }
      this.i.dicParamValue[this.params[index].key].value = values || '';
    }
    this.i.IsRefresh = true;
    this.modal.destroy();
  }

  close() {
    this.modal.destroy();
  }


  InitParam() {
    this.requestSubmitQueryService.getConcProgParamByProgId(this.i).subscribe(result => {
      if (result.data != null && result.data !== undefined) {
        // 重新赋值参数
        for (const dicKey in result.data.paramValue) {
          this.i.dicParamValue[dicKey] = {
            value: result.data.paramValue[dicKey].value,
            defaultValue: result.data.paramValue[dicKey].defaultValue,
            sharedParameterName: result.data.paramValue[dicKey].sharedParameterName,
            requiredFlag: result.data.paramValue[dicKey].requiredFlag,
            sharedValue: result.data.paramValue[dicKey].sharedValue,
            label: result.data.paramValue[dicKey].label
          };
        }
        if (result.data.listParam != null && result.data.listParam !== undefined && result.data.listParam.length > 0) {
          result.data.listParam.forEach(element => {
            const paramControl = new ParamControlBase({
              value: element.value,
              text: element.text,
              key: element.key,
              label: element.label,
              required: element.required,
              controlStyle: { 'width': this.controlWidth },
              gridView: [],
              columns: this.columns,
              order: element.order,
              valueField: element.valueField,
              textField: element.textField,
              disabled: this.i.IsRead || element.disabled,
              tag: element.tag,
              controlType: element.controlType
            });
            this.params.push(paramControl);
            if (element.controlType === 'dropdown') {
              this.nDicFlexNameVal[element.tag.flexName] = element.value;
            }
          });
          this.params = this.params.sort((a, b) => a.order - b.order);
          this.InitDivHeight();
        }
      }
    });
  }

  InitDivHeight() {
    const height = this.rowHegiht * this.params.length;
    if (height > this.maxHeight) {
      this.divHeight = this.maxHeight.toString() + 'px';
    } else if (height < this.minHeight) {
      this.divHeight = this.minHeight.toString() + 'px';
    } else {
      this.divHeight = height.toString() + 'px';
    }

    this.divStyle.height = this.divHeight;
    this.divStyle.width = this.divWidth;
  }

  onSearch(e: any) {
    const param = this.params.find(x => x.key === e.sender.ID);
    if (param !== undefined) {
      const flexValueSetId = param.tag.flexValueSetId;
      this.requestSubmitQueryService.getArgumentFlex(flexValueSetId, this.nDicFlexNameVal, e.SearchValue, e.Skip / e.PageSize + 1, e.PageSize).subscribe(result => {
        let gridData = [];
        let totalCount = 0;
        if (result.data != null && result.data.content !== null && result.data.content.length > 0) {
          gridData = result.data.content;
          totalCount = result.data.totalElements;
        }
        // 非必填项，增加空白行
        if (!param.required) {
          gridData.splice(0, 0, { ID_COLUMN_NAME: '', VALUE_COLUMN_NAME: '', MEANING_COLUMN_NAME: '' });
        }
        param.gridView = {
          data: gridData,
          total: totalCount
        };
      });
    }
  }

  onTextChanged(e: any) {
    // this.msgSrv.success(e.Text);
    this.onValueChanged({ Value: e.sender.SelectValue, Text: e.sender.SelectText, ID: e.sender.ID });
  }

  onRowSelect(e) {
    this.onValueChanged({ Value: e.Value, Text: e.Text, ID: e.sender.ID });
  }

  onValueChanged(e) {
    const param = this.params.find(x => x.key === e.ID);
    if (param !== undefined) {
      param.value = e.Value;
      param.text = e.Text;
      this.nDicFlexNameVal[param.tag.flexName] = e.Value;
      for (let i = 0; i < this.params.length; i++) {
        if (this.params[i].controlType === 'dropdown' && this.params[i].key !== param.key) {
          // 目标参数关联了该值集
          for (const key in this.params[i].tag.dicParentFlexName)
            if (key === param.tag.flexName) {
              this.params[i].value = '';
              this.params[i].text = '';
              this.params[i].gridView = {
                data: [],
                total: 0
              };

              // 值集对应的值为空 将依赖该值集的参数设为不可用
              if (e.Value === '' || e.Value == null || e.Value === undefined) {
                this.params[i].disabled = true;
              } else {
                this.params[i].disabled = false;
              }
              // 递归处理，判断是否有其他参数关联了该值集
              this.onValueChanged({ Value: '', Text: '', ID: this.params[i].key });
              break;
            }
        }
      }
    }
  }
}
