import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { BrandService } from "app/layout/pro/pro.service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalRef, NzModalService, NzSelectComponent } from "ng-zorro-antd";
import { BranchCustomerOrderQueryService } from "../query.service";

@Component({
  selector: 'branch-customer-order-sort',
  templateUrl: './order-sort.component.html',
  styles: [
    `
      .editable-tag {
        background: rgb(255, 255, 255);
        border-style: dashed;
      }
    `
  ],
  providers: [BranchCustomerOrderQueryService]
})
export class BranchCustomerOrderSortComponent implements OnInit {

  sortColumns: any = [];
  tags: any = [];

  inputVisible: Boolean = false;
  newTag = {
    field: '',
    headerName: ''
  };

  allSortColumns: any = [];

  radioValue: number = 0;

  style = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
    'word-break': 'break-all',
    'word-wrap': 'break-word',
  };

  @ViewChild('select', { static: false }) select: NzSelectComponent;
  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: BranchCustomerOrderQueryService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.allSortColumns = JSON.parse(localStorage.getItem('branch-customer-order-sort')) || [];
    if(this.allSortColumns.length === 0) {
      this.initSortColumns();
    }
  }

  showInput() {
    this.inputVisible = true;
    // 组件是 *ngIf 异步更新的，不能使用自动对焦，需要手动对焦
    setTimeout(() => {
      this.select.focus();
    }, 10);
  }

  handleInputConfirm() {
    if(this.newTag.field) {
      const tag = this.sortColumns.find(col => col.field === this.newTag.field);
      if(tag) {
        this.newTag.headerName = tag.headerName;
        this.tags = [...this.tags, this.newTag];
      }
    }
    this.newTag = {
      field: '',
      headerName: ''
    };
    this.inputVisible = false;
  }

  isHide(op) {
    return this.tags.findIndex(tag => tag.field === op.field) !== -1
  }

  initSortColumns() {
    this.allSortColumns = [
      [
        {
          field: 'steelType',
          headerName: '钢种'
        },
        {
          field: 'surface',
          headerName: '表面'
        },
        {
          field: 'standards',
          headerName: '规格'
        },
        {
          field: 'coating',
          headerName: '胶膜（垫纸）'
        },
        {
          field: 'quantity',
          headerName: '数量'
        },
        {
          field: 'urgent',
          headerName: '急要'
        },
        {
          field: 'plan',
          headerName: '计划'
        },
        {
          field: 'cusAbbreviation',
          headerName: '客户简称'
        },
      ],
      [
        {
          field: 'steelType',
          headerName: '钢种'
        },
        {
          field: 'standards',
          headerName: '规格'
        },
        {
          field: 'quantity',
          headerName: '数量'
        },
        {
          field: 'cusAbbreviation',
          headerName: '客户简称'
        },
        {
          field: 'plan',
          headerName: '计划'
        },
        {
          field: 'urgent',
          headerName: '急要'
        },
        {
          field: 'surface',
          headerName: '表面'
        },
      ],
    ];
    localStorage.setItem('branch-customer-order-sort', JSON.stringify(this.allSortColumns));
  }

  saveSortColumns() {
    this.allSortColumns = [...this.allSortColumns, this.tags];
    localStorage.setItem('branch-customer-order-sort', JSON.stringify(this.allSortColumns));
    this.tags = [];
  }

  parseColumn(column) {
    return column.map((col, index) => (index+1) + '. ' + col.headerName).join(' > ');
  }

  remove(index) {
    this.allSortColumns.splice(index, 1);
    localStorage.setItem('branch-customer-order-sort', JSON.stringify(this.allSortColumns));
    if(index === this.radioValue) {
      this.radioValue = 0;
    }
  }

  save() {
    this.modal.close(this.radioValue);
  }

  close() {
    this.modal.destroy();
  }
}