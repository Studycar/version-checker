import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { EditService } from '.././edit.service';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { MOBatchReleaseService } from '../../../../modules/generated_module/services/mobatchrelease-service';
import {
  GridDataResult,
  RowArgs,
  SelectableSettings,
  RowClassArgs,
  PageChangeEvent,
} from '@progress/kendo-angular-grid';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { PlantMaintainService } from '../../../../modules/generated_module/services/plantmaintain-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import {
  CommonQueryService,
  HttpAction,
} from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mobatchreleaseedit',
  templateUrl: './edit.component.html',
  providers: [EditService],
})
export class MobBatchReleaseEditComponent extends CustomBaseContext
  implements OnInit {
  expandForm = false;
  public gridView: GridDataResult;
  public gridData: any[] = [];
  public pageSize = 10;
  public skip = 0;
  UserPlantOptions: any[] = []; // 组织
  lookuptype: any[] = [];
  optionListItem2: any[] = [];
  production_line_group: any;
  makeordertype: any[] = [];
  makeorderstatus: any[] = [];
  linegroupoptions: any[] = []; // 计划组绑定源
  PlantGroupLineoptions: any[] = []; // 生产线绑定源
  MOSTATUS: any[] = []; // MO状态绑定源
  standardfalgoptions: any[] = []; // 工单标准类型
  enableOptions: any[] = [];
  orderid: string;
  PLANT_CODE: string;
  SelectedAll = false; // 是否自动选中所有，如果在外面选中了工单记录点击展开，则自动选中所有记录

  itemtypes: any[] = [];
  makebuycodes: any[] = [];
  itemstatus: any[] = [];
  wipsupplytypes: any[] = [];
  yesnos: any[] = [];
  organizationids: any[] = [{ label: '  ', value: '' }];
  itemcodes: any[] = [{ label: '  ', value: '' }];
  Istrue = false;
  httpAction = { url: this.editService.queryform, method: 'GET', data: false };
  selectIndex = 1;
  public mySelection: any[] = [];
  queryParams: any = {};
  queryParamstemp: any;
  queryObj: any = {};
  selectKeys = 'makeOrderNum';
  gridOptions2: any = Object.assign(this.gridOptions, {
    isRowSelectable: function (node) {
      return node.data.modifyPrivilageFlag;
    },
  });

  constructor(
    public pro: BrandService,
    private formBuilder: FormBuilder,
    public editService: EditService,
    private plantmaintainService: PlantMaintainService,
    private moBatchReleaseService: MOBatchReleaseService,
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private modalService: NzModalService,
    public QueryService: CommonQueryService,
    private appConfigService: AppConfigService,
    private appTranslationService: AppTranslationService,
  ) {
    super({
      pro: pro,
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.headerNameTranslate(this.columns);
    this.gridHeight = 240;
  }
  tabs = [
    {
      index: 1,
      active: true,
      name: '主要',
    },
    {
      index: 2,
      active: false,
      name: '需求',
    },
    {
      index: 3,
      active: false,
      name: '时间',
    },
    {
      index: 4,
      active: false,
      name: '其他',
    },
  ];
  hideObjs = [
    {
      tabIndex: 1,
      columns: [
        {
          field: 'creationDate'
        },
        {
          field: 'demandDate'
        },
        {
          field: 'alternateBomDesignator'
        },
        {
          field: 'earliestStartTime'
        },
        {
          field: 'fixScheduleTime'
        },
        {
          field: 'fpsTime'
        },
        {
          field: 'lpsTime'
        },
        {
          field: 'inspectionTime'
        },
        {
          field: 'fulfillTime'
        },
        {
          field: 'offsetLeadTime'
        },
        {
          field: 'switchTime'
        },
        {
          field: 'scheduleFlag'
        },
        {
          field: 'backlogFlag'
        },
        {
          field: 'backlogReason'
        },
        {
          field: 'bondedFlag'
        },
        {
          field: 'moudleCode'
        },
        {
          field: 'moWarnningFlag'
        },
        {
          field: 'releasedDate'
        },
        {
          field: 'releasedBy'
        },
        {
          field: 'completedDate'
        },
        {
          field: 'closedDate'
        },
        {
          field: 'closedBy'
        },
        {
          field: 'reqNumber'
        },
        {
          field: 'reqLineNum'
        },
        {
          field: 'reqType'
        },
        {
          field: 'customerName'
        },
        {
          field: 'derivedFlag'
        },
        {
          field: 'oriMoNumber'
        },
        {
          field: 'oriMoQty'
        }
      ]
    },
    {
      tabIndex: 2,
      columns: [
        {
          field: 'creationDate'
        },
        {
          field: 'scheduleGroupCode'
        },
        {
          field: 'resourceCode'
        },
        {
          field: 'makeOrderType'
        },
        {
          field: 'makeOrderStatus'
        },
        {
          field: 'projectNumber'
        },
        {
          field: 'moQty'
        },
        {
          field: 'completeNum'
        },
        {
          field: 'residueNum'
        },
        {
          field: 'deliveryNum'
        },
        {
          field: 'descriptionsCn'
        },
        {
          field: 'unitOfMeasure'
        },
        {
          field: 'alternateBomDesignator'
        },
        {
          field: 'earliestStartTime'
        },
        {
          field: 'fixScheduleTime'
        },
        {
          field: 'fpsTime'
        },
        {
          field: 'fpcTime'
        },
        {
          field: 'lpsTime'
        },
        {
          field: 'lpcTime'
        },
        {
          field: 'fulfillTime'
        },
        {
          field: 'offsetLeadTime'
        },
        {
          field: 'switchTime'
        },
        {
          field: 'scheduleFlag'
        },
        {
          field: 'backlogFlag'
        },
        {
          field: 'backlogReason'
        },
        {
          field: 'standardFlag'
        },
        {
          field: 'completionSubinventory'
        },
        {
          field: 'moudleCode'
        },
        {
          field: 'moWarnningFlag'
        },
        {
          field: 'remark'
        },
        {
          field: 'releasedDate'
        },
        {
          field: 'releasedBy'
        },
        {
          field: 'completedDate'
        },
        {
          field: 'closedDate'
        },
        {
          field: 'closedBy'
        },
        {
          field: 'topMoNum'
        },
        {
          field: 'topMoStartDate'
        },
        {
          field: 'topMoStatus'
        },
        {
          field: 'parentMoNum'
        },
        {
          field: 'parentMoStartDate'
        },
        {
          field: 'parentMoStatus'
        },
        {
          field: 'derivedFlag'
        },
        {
          field: 'oriMoNumber'
        },
        {
          field: 'oriMoQty'
        },
        {
          field: 'inspectionTime'
        }

      ]
    },
    {
      tabIndex: 3,
      columns: [
        {
          field: 'scheduleGroupCode'
        },
        {
          field: 'resourceCode'
        },
        {
          field: 'makeOrderType'
        },
        {
          field: 'makeOrderStatus'
        },
        {
          field: 'projectNumber'
        },
        {
          field: 'moQty'
        },
        {
          field: 'completeNum'
        },
        {
          field: 'residueNum'
        },
        {
          field: 'deliveryNum'
        },
        {
          field: 'descriptionsCn'
        },
        {
          field: 'unitOfMeasure'
        },
        {
          field: 'demandDate'
        },
        {
          field: 'alternateBomDesignator'
        },
        {
          field: 'earliestStartTime'
        },
        {
          field: 'scheduleFlag'
        },
        {
          field: 'backlogFlag'
        },
        {
          field: 'backlogReason'
        },
        {
          field: 'standardFlag'
        },
        {
          field: 'bondedFlag'
        },
        {
          field: 'completionSubinventory'
        },
        {
          field: 'moudleCode'
        },
        {
          field: 'moWarnningFlag'
        },
        {
          field: 'remark'
        },
        {
          field: 'reqNumber'
        },
        {
          field: 'reqLineNum'
        },
        {
          field: 'reqType'
        },
        {
          field: 'customerName'
        },
        {
          field: 'topMoNum'
        },
        {
          field: 'topMoStartDate'
        },
        {
          field: 'topMoStatus'
        },
        {
          field: 'parentMoNum'
        },
        {
          field: 'parentMoStartDate'
        },
        {
          field: 'parentMoStatus'
        },
        {
          field: 'derivedFlag'
        },
        {
          field: 'oriMoNumber'
        },
        {
          field: 'oriMoQty'
        },
        {
          field: 'exceptionMessage'
        },
        {
          field: 'comments'
        }
      ]
    },
    {
      tabIndex: 4,
      columns: [
        {
          field: 'scheduleGroupCode'
        },
        {
          field: 'resourceCode'
        },
        {
          field: 'makeOrderType'
        },
        {
          field: 'makeOrderStatus'
        },
        {
          field: 'projectNumber'
        },
        {
          field: 'moQty'
        },
        {
          field: 'demandDate'
        },
        {
          field: 'residueNum'
        },
        {
          field: 'earliestStartTime'
        },
        {
          field: 'fixScheduleTime'
        },
        {
          field: 'fpsTime'
        },
        {
          field: 'fpcTime'
        },
        {
          field: 'lpsTime'
        },
        {
          field: 'lpcTime'
        },
        {
          field: 'inspectionTime'
        },
        {
          field: 'fulfillTime'
        },
        {
          field: 'offsetLeadTime'
        },
        {
          field: 'switchTime'
        },
        {
          field: 'standardFlag'
        },
        {
          field: 'bondedFlag'
        },
        {
          field: 'completionSubinventory'
        },
        {
          field: 'remark'
        },
        {
          field: 'releasedDate'
        },
        {
          field: 'releasedBy'
        },
        {
          field: 'completedDate'
        },
        {
          field: 'closedDate'
        },
        {
          field: 'closedBy'
        },
        {
          field: 'reqNumber'
        },
        {
          field: 'reqLineNum'
        },
        {
          field: 'reqType'
        },
        {
          field: 'customerName'
        },
        {
          field: 'topMoNum'
        },
        {
          field: 'parentMoNum'
        },
        {
          field: 'creationDate'
        },
        {
          field: 'completeNum'
        },
        {
          field: 'deliveryNum'
        },
        {
          field: 'descriptionsCn'
        },
        {
          field: 'unitOfMeasure'
        },
        {
          field: 'exceptionMessage'
        },
        {
          field: 'topMoStartDate'
        },
        {
          field: 'topMoStatus'
        },
        {
          field: 'parentMoStartDate'
        },
        {
          field: 'parentMoStatus'
        },
        {
          field: 'oriMoNumber'
        },
        {
          field: 'levelNum'
        }
      ]
    }
  ];
  public hiddenColumns: any[] = [];
  public optionsFind(value: any, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1:
        options = this.makeordertype;
        break;
      case 2:
        options = this.makeorderstatus;
        break;
      case 3:
        options = this.standardfalgoptions;
        break;
      case 4:
        options = this.enableOptions;
        break;
      case 5:
        options = this.wipsupplytypes;
        break;
      case 6:
        if (value === 0 || value === '0') {
          return {
            label: '<i class="anticon anticon-plus"></i>',
            value: '<i class="anticon anticon-plus"></i>',
          };
        } else
          return {
            label: '',
          };
    }
    return options.find(x => x.value === value) || { label: value };
  }

  public columns = [
    {
      colId: 1,
      cellClass: '',
      field: '',
      headerName: '',
      width: 40,
      pinned: 'left',
      lockPinned: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate,
      },
    },
    {
      field: 'makeOrderNum',
      headerName: '工单号',
    },
    {
      field: 'itemCode',
      headerName: '物料编码',
    },
    {
      field: 'descriptionsCn',
      headerName: '物料描述',
      tooltipField: 'descriptionsCn',
    },
    { field: 'creationDate', headerName: '创建时间' },
    { field: 'scheduleGroupCode', headerName: '计划组' },
    {
      field: 'resourceCode',
      headerName: '资源',
    },
    {
      field: 'makeOrderType',
      headerName: '工单类型',
      tooltipField: 'makeOrderType',
    },
    {
      field: 'makeOrderStatus',
      headerName: '工单状态',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'projectNumber',
      headerName: '项目号',
      tooltipField: 'projectNumber',
    },
    {
      field: 'moQty',
      headerName: '工单数量',
    },
    {
      field: 'completeNum',
      headerName: '完工数量',
    },
    {
      field: 'residueNum',
      headerName: '剩余数量',
      tooltipField: 'residueNum',
    },
    {
      field: 'deliveryNum',
      headerName: '发料数量',
    },
    {
      field: 'unitOfMeasure',
      headerName: '单位',
    },
    {
      field: 'demandDate',
      headerName: '需求日期',
    },
    {
      field: 'alternateBomDesignator',
      headerName: '替代BOM',
    },
    {
      field: 'earliestStartTime',
      headerName: '最早开始时间',
    },
    {
      field: 'fixScheduleTime',
      headerName: '固定时间',
    },
    {
      field: 'fpsTime',
      headerName: '首件开始时间',
    },
    {
      field: 'fpcTime',
      headerName: '首件完成时间',
    },
    {
      field: 'lpsTime',
      headerName: '末件开始时间',
    },
    {
      field: 'lpcTime',
      headerName: '末件完成时间',
    },
    {
      field: 'inspectionTime',
      headerName: '验货时间',
    },
    {
      field: 'fulfillTime',
      headerName: '最终完成时间',
    },
    {
      field: 'offsetLeadTime',
      headerName: '提前量',
    },
    {
      field: 'switchTime',
      headerName: '切换时间',
    },
    {
      field: 'scheduleFlag',
      headerName: '参与排产标识',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'backlogFlag',
      headerName: '尾数标识',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'backlogReason',
      headerName: '尾数原因',
    },
    {
      field: 'standardFlag',
      headerName: '标准类型',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'bondedFlag',
      headerName: '是否保税',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'completionSubinventory',
      headerName: '完工子库',
    },
    {
      field: 'moudleCode',
      headerName: '模具编码',
    },
    {
      field: 'moWarnningFlag',
      headerName: 'MO警告标识',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'exceptionMessage',
      headerName: '例外信息',
    },
    {
      field: 'comments',
      headerName: '备注',
    },
    {
      field: 'releasedDate',
      headerName: '发放日期',
    },
    {
      field: 'releasedBy',
      headerName: '发放人',
    },
    {
      field: 'completedDate',
      headerName: '完成日期',
    },
    {
      field: 'closedDate',
      headerName: '关闭日期',
    },
    {
      field: 'closedBy',
      headerName: '关闭者',
    },
    {
      field: 'reqNumber',
      headerName: '需求订单号',
    },
    {
      field: 'reqLineNum',
      headerName: '需求订单行号',
    },
    {
      field: 'reqType',
      headerName: '需求订单类型',
    },
    {
      field: 'customerName',
      headerName: '客户名称',
    },
    {
      field: 'topMoNum',
      headerName: '顶层工单',
    },
    {
      field: 'topMoStartDate',
      headerName: '顶层工单开始时间',
    },
    {
      field: 'topMoStatus',
      headerName: '顶层工单状态',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'parentMoNum',
      headerName: '父工单',
    },
    {
      field: 'parentMoStartDate',
      headerName: '父工单开始时间',
    },
    {
      field: 'parentMoStatus',
      headerName: '父工单状态',
      valueFormatter: 'ctx.optionsFind(value,2).label',
    },
    {
      field: 'derivedFlag',
      headerName: '拆分标识',
      valueFormatter: 'ctx.optionsFind(value,4).label',
    },
    {
      field: 'oriMoNumber',
      headerName: '原工单号',
    },
    {
      field: 'oriMoQty',
      headerName: '原始MO数量',
    },
    {
      field: 'levelNum',
      headerName: '跟单层级',
    },
  ];

  tabSelect(arg: any): void {
    this.selectIndex = arg.index;
    this.hiddenColumns.length = 0;
    this.hideObjs.forEach(e => {
      if (e.tabIndex === this.selectIndex) {
        e.columns.forEach(i => {
          this.hiddenColumns.push(i.field);
        });
        this.gridColumnApi.resetColumnState();
        this.gridColumnApi.setColumnsVisible(this.hiddenColumns, false);
        return;
      }
    });
    this.initGridWidth();
  }

  public release() {
    if (this.selectionKeys.length === 0) {
      this.msgSrv.warning(
        this.appTranslationService.translate('请选择任意行!'),
      );
      return;
    }
    this.editService
      .BacthRelease(this.selectionKeys, 1, this.orderid, this.PLANT_CODE)
      .subscribe(result => {
        if (result.Success) {
          this.msgSrv.success(
            this.appTranslationService.translate(result.Message || '发放成功'),
          );
          this.modal.close(true);
          // this.queryFromByMo();
        } else {
          this.msgSrv.error(
            this.appTranslationService.translate(result.Message || '发放失败'),
          );
          this.modal.close(true);
        }
      });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit(): void {
    this.QueryService.GetLookupByType('PS_MAKE_ORDER_TYPE').subscribe(
      result => {
        result.Extra.forEach(d => {
          this.makeordertype.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      },
    );

    /** 初始化 MO状态  下拉框*/
    this.QueryService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(
      result => {
        result.Extra.forEach(d => {
          this.MOSTATUS.push({
            label: d.meaning,
            value: d.lookupCode,
          });
          this.makeorderstatus.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      },
    );

    /** 初始化 工单标准类型 */
    this.QueryService.GetLookupByType('STANDARD_FALG').subscribe(result => {
      result.Extra.forEach(d => {
        this.standardfalgoptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    /** 初始化 用户权限下的快码  下拉框*/
    this.QueryService.GetLookupByType('FND_YES_NO').subscribe(result => {
      result.Extra.forEach(d => {
        this.enableOptions.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });

    this.clear();
    // this.queryFromByMo();
    this.query();
  }

  public queryFromByMo() {
    let gridData = [];
    const pageIndex = this._pageNo;
    const pageSize = this._pageSize;
    this.editService
      .QueryFrom(this.PLANT_CODE, this.orderid, pageIndex, pageSize)
      .subscribe(res => {
        gridData = res.Result;
        // 接着修改排序让总装排第一个
        // gridData.sort(d => d.MAKE_ORDER_NUM);
        gridData.sort(d => this.compareAB(d.makeOrderNum, this.orderid));
        this.gridView = {
          data: gridData,
          total: res.TotalCount,
        };
        res.Result.forEach(d => {
          this.mySelection.push(d.makeOrderNum);
        });
      });
  }
  // 判断是否相等
  public compareAB(a: string, b: string) {
    if (a === b) return -1;
    else return 1;
  }

  query() {
    super.query();
    const objParmQuery = {
      strUserId: this.appConfigService.getUserId(),
      plantCode: this.PLANT_CODE,
      makeOrderNum: this.orderid,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    };
    this.editService.loadGridViewNew(
      this.httpAction,
      objParmQuery,
      this.context,
      null,
      () => {
        // 根据父工单的选中状态自动选中所有记录
        console.log(this.SelectedAll, 'this.SelectedAll-----------');
        // jianl注释：经测试，必须要做一个settimeout，否则没有效果，可能与动态绑定数据非同步操作有关
        if (this.SelectedAll) {
          setTimeout(() => {
            this.gridApi.selectAll();
          }, 100);
        }
      },
    );
  }

  public groupChange(value: any) {
    this.loadLine();
  }

  public loadLine() {
    this.PlantGroupLineoptions = [];
    this.editService
      .GetUserPlantGroupLine(
        this.queryParams.PlantCode,
        this.queryParams.ProdLineGroupCode,
      )
      .subscribe(result => {
        if (result.Extra !== undefined && result.Extra !== null) {
          result.Extra.forEach(x => {
            this.PlantGroupLineoptions.push({
              label: x.resourceCode + '-' + x.descriptions,
              value: x.resourceCode,
            });
          });
        }
      });
  }

  expColumns = [
    { field: 'makeOrderNum', title: '工单号', width: 200, locked: false },
    { field: 'itemCode', title: '物料编码', width: 200, locked: false },
    { field: 'descriptionsCn', title: '物料描述', width: 200, locked: false },
    {
      field: 'scheduleGroupCode',
      title: '计划组',
      width: 200,
      locked: false,
    },
    { field: 'creationDate', title: '创建时间', locked: false },
    { field: 'resourceCode', title: '资源', width: 200, locked: false },
    { field: 'makeOrderType', title: '工单类型', width: 200, locked: false },
    {
      field: 'makeOrderStatus',
      title: '工单状态',
      width: 200,
      locked: false,
    },
    { field: 'projectNumber', title: '项目号', width: 200, locked: false },
    { field: 'moQty', title: '工单数量', width: 200, locked: false },
    { field: 'completeNum', title: '完工数量', width: 200, locked: false },
    { field: 'residueNum', title: '剩余数量', width: 200, locked: false },
    { field: 'deliveryNum', title: '发料数量', width: 200, locked: false },
    { field: 'unitOfMeasure', title: '单位', width: 200, locked: false },
    { field: 'demandDate', title: '需求日期', width: 200, locked: false },
    {
      field: 'alternateBomDesignator',
      title: '替代bom',
      width: 200,
      locked: false,
    },
    {
      field: 'earliestStartTime',
      title: '最早开始时间',
      width: 200,
      locked: false,
    },
    {
      field: 'fixScheduleTime',
      title: '固定排产时间',
      width: 200,
      locked: false,
    },
    { field: 'fpsTime', title: '首件开始时间', width: 200, locked: false },
    { field: 'fpcTime', title: '首件完成时间', width: 200, locked: false },
    { field: 'lpsTime', title: '末件开始时间', width: 200, locked: false },
    { field: 'lpcTime', title: '末件结束时间', width: 200, locked: false },
    { field: 'inspectionTime', title: '验货时间', width: 200, locked: false },
    { field: 'fulfillTime', title: '最终完成时间', width: 200, locked: false },
    { field: 'offsetLeadTime', title: '偏移量', width: 200, locked: false },
    { field: 'switchTime', title: '切换时间', width: 200, locked: false },
    {
      field: 'scheduleFlag',
      title: '参与排产标识',
      width: 200,
      locked: false,
    },
    { field: 'backlogFlag', title: '尾数标识', width: 200, locked: false },
    { field: 'backlogReason', title: '尾数原因', width: 200, locked: false },
    { field: 'standardFlag', title: '标准类型', width: 200, locked: false },
    { field: 'bondedFlag', title: '是否保税', width: 200, locked: false },
    {
      field: 'completionSubinventory',
      title: '完工子库',
      width: 200,
      locked: false,
    },
    { field: 'moudleCode', title: '模具编码', width: 200, locked: false },
    {
      field: 'moWarnningFlag',
      title: 'MO警告标志',
      width: 200,
      locked: false,
    },
    { field: 'comments', title: '备注', width: 200, locked: false },
    { field: 'releasedDate', title: '发放日期', width: 200, locked: false },
    { field: 'releasedBy', title: '发放人', width: 200, locked: false },
    { field: 'completedDate', title: '完成日期', width: 200, locked: false },
    { field: 'closedDate', title: '关闭日期', width: 200, locked: false },
    { field: 'closedBy', title: '关闭人', width: 200, locked: false },
    { field: 'orderNumber', title: '需求订单号', width: 200, locked: false },
    {
      field: 'orderLineNumber',
      title: '需求订单行号',
      width: 200,
      locked: false,
    },
    { field: 'orderType', title: '需求订单类型', width: 200, locked: false },
    { field: 'customerName', title: '客户名称', width: 200, locked: false },
    { field: 'topMoNum', title: '顶层工单', width: 200, locked: false },
    {
      field: 'topMoStartDate',
      title: '顶层工单开始时间',
      width: 200,
      locked: false,
    },
    {
      field: 'topMoStatus',
      title: '顶层工单状态',
      width: 200,
      locked: false,
    },
    { field: 'parentMoNum', title: '父工单', width: 200, locked: false },
    {
      field: 'parentMoStartDate',
      title: '父工单开始时间',
      width: 200,
      locked: false,
    },
    {
      field: 'parentMoStatus',
      title: '父工单状态',
      width: 200,
      locked: false,
    },
    { field: 'derivedFlag', title: '拆分标识', width: 200, locked: false },
    { field: 'oriMoNumber', title: '原工单号', width: 200, locked: false },
    { field: 'oriMoQty', title: '原始MO数量', width: 200, locked: false },
    { field: 'levelNum', title: '跟单层级', width: 200, locked: false },
  ];

  expColumnsOptions: any[] = [
    { field: 'makeOrderStatus', options: this.makeorderstatus },
    { field: 'scheduleFlag', options: this.enableOptions },
    { field: 'backlogFlag', options: this.enableOptions },
    { field: 'standardFlag', options: this.enableOptions },
    { field: 'bondedFlag', options: this.enableOptions },
    { field: 'moWarnningFlag', options: this.enableOptions },
    { field: 'topMoStatus', options: this.makeorderstatus },
    { field: 'parentMoStatus', options: this.makeorderstatus },
  ];

  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    const objParmQuery = {
      strUserID: this.appConfigService.getUserId(),
      plantCode: this.PLANT_CODE,
      moNum: this.orderid,
    };
    this.editService.exportAction(
      { url: this.editService.excUrlForm, method: 'POST' },
      objParmQuery,
      this.excelexport,
    );
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectKeys);
  }
  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
  // grid初始化加载
  public onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.tabSelect({ index: 1 });
  }
}
