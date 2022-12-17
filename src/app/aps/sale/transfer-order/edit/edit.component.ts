import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { AgGridAngular } from "ag-grid-angular";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { CustomOperateCellRenderComponent } from "app/modules/base_module/components/custom-operatecell-render.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalRef, NzModalService } from "ng-zorro-antd";
import { TransferOrderQueryService } from "../query.service";

@Component({
  selector: 'planschedule-hw-transfer-order-edit',
  templateUrl: './edit.component.html',
  providers: [TransferOrderQueryService]
})
export class TransferOrderEditComponent implements OnInit {
  isModify: Boolean = false;
  i: any = {};
  iClone: any = {};

  allotStateOptions: any = [];  
  plantOptions: any = [];  
  @ViewChild('f', { static: true }) f: NgForm;

  // 绑定部门表
  public gridViewDeparts: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsDeparts: any[] = [
    {
      field: 'plantCode',
      title: '工厂',
      width: '100'
    },
    {
      field: 'depCode',
      title: '部门编码',
      width: '100'
    },
    {
      field: 'depName',
      title: '部门名称',
      width: '100'
    },
    {
      field: 'depFullName',
      title: '部门全称',
      width: '100'
    },
    {
      field: 'depGrade',
      title: '部门等级',
      width: '100'
    },
    {
      field: 'depEnd',
      title: '是否最末级',
      width: '100'
    },
  ];

  // 绑定收发类别表
  public gridViewLbs: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsLbs: any[] = [
    {
      field: 'rdCode',
      title: '类别编码',
      width: '100'
    },
    {
      field: 'rdName',
      title: '类别名称',
      width: '100'
    },
    {
      field: 'rdGrade',
      title: '类别等级',
      width: '100'
    },
  ];

  // 绑定仓库表
  public gridViewWares: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsWares: any[] = [
    {
      field: 'plantCode',
      title: '工厂',
      width: '100'
    },
    {
      field: 'subinventoryCode',
      title: '仓库编码',
      width: '100'
    },
    {
      field: 'subinventoryDescription',
      title: '仓库名称',
      width: '100'
    }
  ];

  constructor(
    public pro: BrandService,
    public modal: NzModalRef,
    public modalHelper: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: TransferOrderQueryService,
    public http: _HttpClient,
  ) {
  }

  ngOnInit() {
    if(this.i.id) {
      this.isModify = true;
      this.queryService.getOne(this.i.id).subscribe(res => {
        if(res.code === 200) {
          this.i = res.data;
          this.iClone = Object.assign({}, this.i);
        }
      });
      this.i.changetime = new Date();
    } else {
      // this.i.code = 'DBD' + this.queryService.formatDate(new Date()).replaceAll('-','') + this.queryService.generateSerial(4);
      this.i.allocationDate = new Date();
      this.i.state = '10';
      this.i.description = this.appconfig.getUserDescription();
      this.i.userName = this.appconfig.getUserName();
      this.i.userId = this.appconfig.getUserId();
      this.f.control.markAsDirty();
      this.initLb();
      // this.initDepartment();
    }
    this.loadOptions();
  }

  initLb() {
    this.onLbsTextChanged({Text: '1101'}, 'rklb');
    this.onLbsTextChanged({Text: '1201'}, 'cklb');
  }

  initDepartment() {
    this.onDepartsTextChanged({Text: '010401'}, 'out');
    this.onDepartsTextChanged({Text: '010401'}, 'in');
  }

  async loadOptions() {
    this.queryService.GetLookupByTypeRefAll({
      'PS_ALLOT_STATE': this.allotStateOptions,
    });
    this.plantOptions.push(...await this.queryService.getUserPlants());
  }

  clear() {
    this.i = Object.assign({}, this.iClone);
  }

  close() {
    this.modal.destroy();
  }

  save(value) {
    const params = Object.assign({}, this.i, {
      allocationDate: this.queryService.formatDate(this.i.allocationDate),
    })
    this.queryService.save(params).subscribe(res => {
      if(res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('保存成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
      }
    })
  }

  /**
   * 部门弹出查询
   * @param {any} e
   */
   public searchDeparts(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadDeparts(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载部门
   * @param {string} depCode  部门编码
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadDeparts(
    depCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    if (!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.queryService
      .getDeparts({
        plantCode: this.i.plantCode,
        depCode: depCode,
        depEnd: 1,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewDeparts.data = res.data.content;
        this.gridViewDeparts.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onDepartsSelect(e: any, type: 'out' | 'in') {
    this.i[type + 'Code'] = e.Row.depCode;
    this.i[type + 'Department'] = e.Row.depName;
  }

  onDepartsTextChanged(event: any, type: 'out' | 'in') {
    if (!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    const depCode = event.Text.trim();
    if(depCode !== '') {
      this.queryService
      .getDeparts({
        plantCode: this.i.plantCode,
        depCode: depCode,
        depEnd: 1,
        pageIndex: 1,
        pageSize: 1,
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.i[type + 'Code'] = res.data.content[0].depCode;
          this.i[type + 'Department'] = res.data.content[0].depName;
        } else {
          this.i[type + 'Code'] = '';
          this.i[type + 'Department'] = '';
          this.msgSrv.info(this.appTranslationService.translate('部门编码无效'))
        }
      });
    } else {
      this.i[type + 'Code'] = '';
      this.i[type + 'Department'] = '';
    }
  }

  /**
   * 收发类别弹出查询
   * @param {any} e
   */
   public searchLbs(e: any, type: 'cklb' | 'rklb') {
    const rdFlag = type === 'cklb' ? 0 : 1;
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadLbs(
      e.SearchValue,
      rdFlag,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载类别
   * @param {string} rdCode  类别编码
   * @param {number} rdFlag  类别种类
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadLbs(
    rdCode: string,
    rdFlag: number,
    pageIndex: number,
    pageSize: number,
  ) {
    const rdGrade = rdFlag === 0 ? 2 : '';
    this.queryService
      .getLbs({
        rdCode: rdCode,
        rdFlag: rdFlag,
        rdGrade: rdGrade,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewLbs.data = res.data.content;
        this.gridViewLbs.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onLbsSelect(e: any, type: 'cklb' | 'rklb') {
    this.i[type + 'Code'] = e.Row.rdCode;
    this.i[type] = e.Row.rdName;
  }

  onLbsTextChanged(event: any, type: 'cklb' | 'rklb') {
    const rdCode = event.Text.trim();
    const rdFlag = type === 'cklb' ? 0 : 1;
    const rdGrade = rdFlag === 0 ? 2 : '';
    if(rdCode !== '') {
      this.queryService
      .getLbs({
        rdCode: rdCode,
        rdFlag: rdFlag,
        rdGrade: rdGrade,
        pageIndex: 1,
        pageSize: 1,
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          this.i[type + 'Code'] = res.data.content[0].rdCode;
          this.i[type] = res.data.content[0].rdName;
        } else {
          this.i[type + 'Code'] = '';
          this.i[type] = '';
          this.msgSrv.info(this.appTranslationService.translate('类别编码无效'))
        }
      });
    } else {
      this.i[type + 'Code'] = '';
      this.i[type] = '';
    }
  }

  /**
   * 仓库弹出查询
   * @param {any} e
   */
   public searchWares(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.loadWares(
      e.SearchValue,
      PageIndex,
      e.PageSize,
    );
  }

  /**
   * 加载仓库
   * @param {string} subinventoryCode  仓库编码
   * @param {number} pageIndex  页码
   * @param {number} pageSize   每页条数
   */
  public loadWares(
    subinventoryCode: string,
    pageIndex: number,
    pageSize: number,
  ) {
    if (!this.i.plantCode) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
      return;
    }
    this.queryService
      .getWares({
        plantCode: this.i.plantCode,
        subinventoryCode: subinventoryCode,
        pageIndex: pageIndex,
        pageSize: pageSize,
      })
      .subscribe(res => {
        this.gridViewWares.data = res.data.content;
        this.gridViewWares.total = res.data.totalElements;
      });
  }

  //  行点击事件， 给参数赋值
  onWaresSelect(e: any, type: 'out' | 'in') {
    const nType = type === 'out' ? 'in' : 'out';
    // 判断转入转出仓库是否相同
    if(this.i[nType + 'WarehouseCode'] && this.i[nType + 'WarehouseCode'] === e.Value) {
      this.msgSrv.warning(this.appTranslationService.translate('转入、转出仓库不能重复！'));
      this.i[type + 'WarehouseCode'] = '';
      this.i[type + 'Warehouse'] = '';
    } else {
      this.i[type + 'WarehouseCode'] = e.Row.subinventoryCode;
      this.i[type + 'Warehouse'] = e.Row.subinventoryDescription;
    }
  }

  onWaresTextChanged(event: any, type: 'out' | 'in') {
    const subinventoryCode = event.Text.trim();
    const nType = type === 'out' ? 'in' : 'out';
    if(subinventoryCode !== '') {
      if (!this.i.plantCode) {
        this.msgSrv.warning(this.appTranslationService.translate('请先选择工厂！'));
        return;
      }
      this.queryService
      .getWares({
        plantCode: this.i.plantCode,
        subinventoryCode: subinventoryCode,
        pageIndex: 1,
        pageSize: 1,
      }).subscribe(res => {
        if(res.data.content.length > 0) {
          // 判断转入转出仓库是否相同
          if(this.i[nType + 'WarehouseCode'] && this.i[nType + 'WarehouseCode'] === res.data.content[0].subinventoryCode) {
            this.msgSrv.warning(this.appTranslationService.translate('转入、转出仓库不能重复！'));
            this.i[type + 'WarehouseCode'] = '';
            this.i[type + 'Warehouse'] = '';
          } else {
            this.i[type + 'WarehouseCode'] = res.data.content[0].subinventoryCode;
            this.i[type + 'Warehouse'] = res.data.content[0].subinventoryDescription;
          }
        } else {
          this.i[type + 'WarehouseCode'] = '';
          this.i[type + 'Warehouse'] = '';
          this.msgSrv.info(this.appTranslationService.translate('仓库编码无效'))
        }
      });
    } else {
      this.i[type + 'WarehouseCode'] = '';
      this.i[type + 'Warehouse'] = '';
    }
  }


}