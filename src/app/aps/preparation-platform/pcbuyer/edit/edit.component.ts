import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { PcBuyerService } from '../../../../modules/generated_module/services/pc-buyer-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'preparation-platform-pcbuyer-edit',
  templateUrl: './edit.component.html',
})
export class PreparationPlatformPcbuyerEditComponent implements OnInit, AfterViewInit {
  i: any;
  useroptions: any[] = [];
  // employoptions: any[] = [];
  // title: String = '新增';
  Istrue: boolean;
  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
    {
      field: 'employeeNumber',
      title: '人员编码',
      width: '50'
    },
    {
      field: 'fullName',
      title: '姓名',
      width: '50'
    }
  ];

  dirty = false;

  constructor(
    private modal: NzModalRef,
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private queryservice: PcBuyerService,
    private appTranslationService: AppTranslationService
  ) { }

  ngOnInit(): void {
    if (this.i.id !== null) {
      this.Istrue = true;
      this.queryservice.GetById(this.i.id).subscribe(res => {
        this.i = res.data;
      });
    } else {
      this.i.userName = JSON.parse(localStorage.getItem('user')).name;
    }

    this.LoadData();
  }

  ngAfterViewInit() {

  }

  LoadData() {
    this.queryservice.GetUser().subscribe(res => {
      res.data.content.forEach(element => {
        this.useroptions.push({
          label: element.userName,
          value: element.userName
        });
      });
    });


    /*this.queryservice.GetEmploye().subscribe(res => {
      res.Extra.forEach(element => {
        this.employoptions.push({
          label: element.EMPLOYEE_NUMBER,
          value: element.EMPLOYEE_NUMBER,
          tag: element.FULL_NAME
        }
        );
      });
    });*/
  }

  save() {
    this.queryservice.saveData(this.i).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    });
    /*if (this.i.id !== null) {
      this.queryservice.EditData(this.i).subscribe(res => {
        if (res.Success) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.Message);
        }
      });
    } else {
      this.queryservice.SaveForNew(this.i).subscribe(res => {
        if (res.Success) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        } else {
          this.msgSrv.error(res.Message);
        }
      });
    }*/
  }

  close() {
    this.modal.destroy();
  }

  /*empolyChange(value: any) {
    this.i.FULL_NAME = null;
    this.i.FULL_NAME = this.employoptions.find(x => x.label === value).tag;
  }*/

  search1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadItems(e.SearchValue, PageIndex, e.PageSize);
  }
  change1({ sender, event, Text }) {
    const value = this.i.employeeNumber || '';
    if (value !== '') {
      this.queryservice.GetBuyer(Text || '', 1, sender.PageSize).subscribe(res => {
        this.gridView1.data = res.data.content;
        this.gridView1.total = res.data.totalElements;
        if (res.data.totalElements === 1) {
          this.i.fullName = res.data.find(x => x.employeeNumber === Text).fullName;
        } else {
          this.msgSrv.warning(this.appTranslationService.translate('采购员无效'));
        }
      });
    }
  }
  public loadItems(EMPLOYEE_NUMBER: string, PageIndex: number, PageSize: number) {
    // 加载采购员
    this.queryservice.GetBuyer(EMPLOYEE_NUMBER || '', PageIndex, PageSize).subscribe(res => {
      this.gridView1.data = res.data.content;
      this.gridView1.total = res.data.totalElements;
    });
  }

  buyerChange(value: any) {
    this.i.fullName = null;
    this.dirty = true;
    this.i.fullName = this.gridView1.data.find(x => x.employeeNumber === value.Text).fullName;
  }


  clear() {
    if (this.i.id != null) {
      this.queryservice.GetById(this.i.Id).subscribe(res => {
        this.i = res.data;
      });
    }

  }
}

