import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { BasePsBomService } from '../../../../modules/generated_module/services/base-psbom-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { QueryService1 } from './queryService1';
import { ExportImportService } from 'app/modules/generated_module/services/export-import.service';
// rgb(193, 203, 207) color set
export interface TreeNodeInterface {
  key: string; // 1-11-112-111-113
  componentItemCode: string; // 组件（物料）编码
  componentDesc: string; // 组件(物料)描述
  componentType: string; // 物料类型
  processCode: string; // 工序
  usage: string; // 组件数量
  unitOfMeasure: string; // 单位
  alternateBomDesignator: string; // 替代组
  componentYieldFactor: string; // 损耗率2
  proity: string; // 优先级
  policy: string; // 替代策略ex
  subChange: string; // 替代百分比
  supplySubinventory: string; // 供应库存   [dbo].[PS_ONHAND_QUANTITIES]
  supplyType: string; // gon供应类型
  keyItemFlag: string; // 关键资源标志
  effectivityDate: string; // 生效日期
  disableDate: string; // 失效日期
  incompleteFlag: string; // 是否残缺
  lastUpdateDate: string; // 残缺更新时间
  LEVEL: string; // 层级
  expand: boolean; // 是否已扩展
  s: Boolean; // 是否可展开
  psBomNodes?: TreeNodeInterface[];
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-psbom-view',
  templateUrl: './view.component.html',
  providers: [QueryService1],
  styleUrls: ['./view.component.css'],
})
export class BasePsbomViewComponent extends CustomBaseContext
  implements OnInit {
  record: any = {};
  i: any;
  public th1: any[] = []; // 表格头部
  public Load: Boolean = true;
  public strPlantCode: String;
  public strASSEMBLY_ITEM: String;
  public strDesc_CN: String;
  public strALTERNATE: String;
  public EFFECTIVITY_DATE: String;
  public DISABLE_DATE: String;
  public timerange: string;
  public expandStatus: string = 'iexpand';

  // Mo例外调用传参
  j: any;

  data: any[] = [];
  public expandForm = false;
  public k: Boolean;
  public s1: String;
  public s2: String;
  public m: object;
  exp: Boolean = false;
  timeoptions: any[] = [];

  // 缓存->扩展树
  expandDataCache = {};

  readOnly: Boolean = true;
  IsLoading = true;

  queryParams1 = {
    alternateBomDesignator: '',
    plantCode: '',
    assemblyItemId: '',
    timerange: ''
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public psbomservice: BasePsBomService,
    public queryService1: QueryService1,
    private exportImportService: ExportImportService,
  ) {
    super({ appTranslationSrv: null, msgSrv: msgSrv, appConfigSrv: null });
  }

  // 展开状态发生变化
  collapse(
    array: TreeNodeInterface[],
    data: TreeNodeInterface,
    $event: boolean,
  ): void {
    if ($event === false) {
      if (data.psBomNodes.length > 0) {
        data.psBomNodes.forEach(d => {
          const target = array.find(a => a.key === d.key);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
      }
    }
  }

  // 树型结构转换成链表型
  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack = [];
    const array = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false, s: false });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.psBomNodes !== null && node.psBomNodes.length > 0) {
        node.s = true;
        for (let i = node.psBomNodes.length - 1; i >= 0; i--) {
          stack.push({
            ...node.psBomNodes[i],
            level: node.level + 1,
            expand: false,
            parent: node,
            s: false,
          });
        }
      }
    }

    return array;
  }

  /** flag 遍历过一次为节点赋值为  TRUE    */
  visitNode(
    node: TreeNodeInterface,
    hashMap: object,
    array: TreeNodeInterface[],
  ): void {
    hashMap[node.key] = true;
    array.push(node);
  }

  ngOnInit(): void {
    this.IsLoading = true;
    this.timeoptions.push(
      {
        value: '1',
        label: '过去',
      },
      {
        value: '2',
        label: '现在',
      },
      {
        value: '3',
        label: '将来',
      },
    );
    if (this.j !== undefined) {
      this.psbomservice.getItemId(this.j.ITEM_CODE).subscribe(res => {
        this.queryParams1 = {
          alternateBomDesignator: this.j.ALTERNATE_BOM_DESIGNATOR,
          plantCode: this.j.PLANT_CODE,
          assemblyItemId: res.data.itemId,
          timerange: '',
        };
        this.queryCommon();
        this.strPlantCode = this.queryParams1.plantCode;
        this.psbomservice
          .GetItemCode(this.queryParams1.assemblyItemId)
          .subscribe(res1 => {
            this.strASSEMBLY_ITEM = res1.data.itemCode;
            this.strDesc_CN = res1.data.descriptionsCn;
          });

        this.psbomservice
          .GetAlter(this.queryParams1.assemblyItemId)
          .subscribe(res2 => {
            this.strALTERNATE = res2.data.alternateBomDesignator;
          });

        this.psbomservice
          .GetDate(this.queryParams1.assemblyItemId)
          .subscribe(res3 => {
            this.EFFECTIVITY_DATE = res3.data.effectivityDate;
            this.DISABLE_DATE = res3.data.disableDate;
          });
      });
    } else {
      this.queryParams1 = {
        alternateBomDesignator: this.i.alternateBomDesignator,
        plantCode: this.i.plantCode,
        assemblyItemId: this.i.assemblyItemId,
        timerange: this.timerange,
      };

      this.queryCommon();
      this.strPlantCode = this.queryParams1.plantCode;
      this.psbomservice
        .GetItemCode(this.queryParams1.assemblyItemId)
        .subscribe(res => {
          this.strASSEMBLY_ITEM = res.data.itemCode;
          this.strDesc_CN = res.data.descriptionsCn;
        });

      this.psbomservice
        .GetAlter(this.queryParams1.assemblyItemId)
        .subscribe(res => {
          this.strALTERNATE = res.data.alternateBomDesignator;
        });

      this.psbomservice
        .GetDate(this.queryParams1.assemblyItemId)
        .subscribe(res => {
          this.EFFECTIVITY_DATE = res.data.effectivityDate;
          this.DISABLE_DATE = res.data.disableDate; 
        });
    }

    this.exp = false;

    this.readOnly = true;

    this.th1 = [
      '物料编码',
      '组件描述',
      '物料类型',
      '工序',
      '组件数量',
      '单位',
      '替代组',
      '损耗率',
      '替代组/优先级',
      '替代策略',
      '替代百分比',
      '供应库存',
      '供应类型',
      '关键组件标志',
      '生效日期',
      '失效日期',
      '是否残缺',
      '残缺更新时间',
    ];

    this.data = [];

    this.Load = false;

    this.s1 = '';
    this.s2 = '';
  }

  close() {
    this.modal.destroy();
  }

  query() {
    super.query();
    this.queryCommon();
  }

  queryCommon() {
    console.log(this.queryParams1)
    this.psbomservice
      .GetTree(
        this.queryParams1.alternateBomDesignator,
        this.queryParams1.plantCode,
        this.queryParams1.assemblyItemId,
        this.queryParams1.timerange,
      )
      .subscribe(res => {
        this.data = res.data;
        this.data.forEach(item => {
          this.expandDataCache[item.key] = this.convertTreeToList(item);
        });
        this.IsLoading = false;
      });
  }

  expand() {
    this.s1 = 'primary';
    this.s2 = 'danger';

    for (const key in this.expandDataCache) {
      for (const key1 of this.expandDataCache[key]) {
        key1.expand = true;
      }
    }
  }

  timeChange(value: any) {
    this.queryParams1.timerange = value;
  }

  iexpand() {
    this.s1 = 'danger';
    this.s2 = 'primary';
    for (const key in this.expandDataCache) {
      for (const key1 of this.expandDataCache[key]) {
        key1.expand = false;
      }
    }
  }

  expColumns = [
    { field: 'key', title: 'LEVEL', width: 100, locked: true },
    {
      field: 'componentItemCode',
      title: '物料编码',
      width: 200,
      locked: false,
    },
    { field: 'componentDesc', title: '组件描述', width: 200, locked: false },
    { field: 'componentType', title: '物料类型', width: 200, locked: false },
    { field: 'planCategory', title: '计划分类', width: 200, locked: false },
    { field: 'processCode', title: '工序', width: 200, locked: false },
    { field: 'usage', title: '组件数量', width: 200, locked: false },
    { field: 'unitOfMeasure', title: '单位', width: 200, locked: false },
    {
      field: 'alternateBomDesignator',
      title: '替代组',
      width: 200,
      locked: false,
    },
    {
      field: 'componentYieldFactor',
      title: '损耗率',
      width: 200,
      locked: false,
    },
    { field: 'proity', title: '替代组/优先级', width: 200, locked: false },
    { field: 'policy', title: '替代策略', width: 200, locked: false },
    { field: 'subChange', title: '替代百分比', width: 200, locked: false },
    {
      field: 'supplySubinventory',
      title: '供应库存',
      width: 200,
      locked: false,
    },
    { field: 'supplyType', title: '供应类型', width: 200, locked: false },
    {
      field: 'keyResourceFlag',
      title: '关键组件标志',
      width: 200,
      locked: false,
    },
    { field: 'effectivityDate', title: '生效日期', width: 200, locked: false },
    { field: 'disableDate', title: '失效日期', width: 200, locked: false },
    { field: 'incompleteFlag', title: '是否残缺', width: 200, locked: false },
    {
      field: 'lastUpdateDate',
      title: '残缺更新时间',
      width: 200,
      locked: false,
    },
  ];

  private httpAction = {
    url: '/api/ps/psBom/exportBom',
    method: 'POST',
  };
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    this.queryService1.exportAction(
      this.httpAction,
      this.queryParams1,
      this.excelexport,
      this,
    );
    // jianl，改用新的导出方式
    // this.exportImportService.exportCompatibilityWithProgress(
    //   this.httpAction,
    //   this.queryParams1,
    //   this.expColumns,
    //   '',
    //   this,
    // );
  }

  setClassName = (record, index) => {};
}
