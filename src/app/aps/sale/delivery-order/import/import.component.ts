import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomExcelExportComponent } from '../../../../modules/base_module/components/custom-excel-export.component';
import { DeliveryOrderQueryService } from "../query.service";

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'delivery-order-import',
  templateUrl: './import.component.html',
  providers: [DeliveryOrderQueryService],
})
export class DeliveryOrderImportComponent implements OnInit {

  impColumns = {
    columns: ['来源', '来源单号', '来源单行号', '配车标识', '配送单号', '配送单状态', '配送日期', '车号', '物流公司', '目的地', '备注', '特殊备注', '收货时间', '详细地址', '实际发货时间', '实际送货车号', 'MES备注', '审核人', '审核日期', '配送单行号', '配送单行状态', '存货编码', '存货名称', '实体仓库编码', '库位编码', '仓库', '批号', '捆包号', '规格尺寸', '钢种', '表面', '等级', '单位', '数量', '净重', '毛重', '理重', '表面保护', '套筒类型', '套筒重量', '箱体类型', '包装方式', '供销备注', '送货区域', '送货范围', '是否省内', '客户编码', '客户名称', '货权', '含税价', '含税金额', '提货方式', '制单人', '制单时间', '司机姓名', '司机联系电话'],

    paramMappings: [
      {
        field: 'source',
        title: '来源',
        columnIndex: 1, constraint: { notNull: false }
      },

      {
        field: 'docCode',
        title: '来源单号',
        columnIndex: 2, constraint: { notNull: true }
      },
      {
        field: 'docDetailCode',
        title: '来源单行号',
        columnIndex: 3, constraint: { notNull: true }
      },
      {
        field: 'carMark',
        title: '配车标识',
        columnIndex: 4, constraint: { notNull: true }
      },
      {
        field: 'deliveryOrderCode',
        title: '配送单号',
        columnIndex: 4, constraint: { notNull: false }
      },
      {
        field: 'deliveryOrderState',
        title: '配送单状态',
        columnIndex: 5, constraint: { notNull: false }
      },


      {
        field: 'deliveryOrderDate',
        title: '配送日期',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'carNumber',
        title: '车号',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'logistics',
        title: '物流公司',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'place',
        title: '目的地',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'remarks',
        title: '备注',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'specialRemarks',
        title: '特殊备注',
        columnIndex: 3, constraint: { notNull: false, maxLength: 10 }
      },
      {
        field: 'receiptTime',
        title: '收货时间',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'detailAddress',
        title: '详细地址',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'realDeliveryTime',
        title: '实际发货时间',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'realCarNumber',
        title: '实际送货车号',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'mesRemark',
        title: 'MES备注',
        columnIndex: 3, constraint: { notNull: false }
      },

      {
        field: 'audit',
        title: '审核人',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'auditTime',
        title: '审核日期',
        columnIndex: 3, constraint: { notNull: false }
      },

      {
        field: 'deliveryOrderDetailCode',
        title: '配送单行号',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'deliveryOrderDetailState',
        title: '配送单行状态',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'stockCode',
        title: '存货编码',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'stockName',
        title: '存货名称',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'warehouse',
        title: '实体仓库编码',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'location',
        title: '库位编码',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'whName',
        title: '仓库',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'batchCode',
        title: '批号',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'baleNo',
        title: '捆包号',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'standardsTypes',
        title: '规格尺寸',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'steelType',
        title: '钢种',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'surface',
        title: '表面',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'grade',
        title: '等级',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'unitOfMeasure',
        title: '单位',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'quantity',
        title: '数量',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'weightKg',
        title: '净重',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'grossWeight',
        title: '毛重',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'theoreticalWeight',
        title: '理重',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'coating',
        title: '表面保护',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'sleeveType',
        title: '套筒类型',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'sleeveWeight',
        title: '套筒重量',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'boxType',
        title: '箱体类型',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'packType',
        title: '包装方式',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'saleRemark',
        title: '供销备注',
        columnIndex: 3, constraint: { notNull: false }
      },

      {
        field: 'area',
        title: '送货区域',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'ranges',
        title: '送货范围',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'withinProvince',
        title: '是否省内',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'cusCode',
        title: '客户编码',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'cusName',
        title: '客户名称',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'owner',
        title: '货权',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'taxPrice',
        title: '含税价',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'amountIncludingTax',
        title: '含税金额',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'deliveryMethod',
        title: '提货方式',
        columnIndex: 3, constraint: { notNull: false }
      },

      {
        field: 'createdBy',
        title: '制单人',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'creationDate',
        title: '制单时间',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'driverName',
        title: '司机姓名',
        columnIndex: 3, constraint: { notNull: false }
      },
      {
        field: 'driverTel',
        title: '司机联系电话',
        columnIndex: 3, constraint: { notNull: false }
      },
    ],
  };
  expData: any[] = [];
  expColumns = [
    {
      field: 'source',
      title: '来源',
      width: 200, locked: false
    },

    {
      field: 'docCode',
      title: '来源单号',
      width: 200, locked: false
    },
    {
      field: 'docDetailCode',
      title: '来源单行号',
      width: 200, locked: false
    },
    {
      field: 'carMark',
      title: '配车标识',
      width: 200, locked: false
    },
    {
      field: 'deliveryOrderCode',
      title: '配送单号',
      width: 200, locked: false
    },
    {
      field: 'deliveryOrderState',
      title: '配送单状态',
      width: 200, locked: false
    },
   
    {
      field: 'deliveryOrderDate',
      title: '配送日期',
      width: 200, locked: false
    },
    {
      field: 'carNumber',
      title: '车号',
      width: 200, locked: false
    },
    {
      field: 'logistics',
      title: '物流公司',
      width: 200, locked: false
    },
    {
      field: 'place',
      title: '目的地',
      width: 200, locked: false
    },
    {
      field: 'remarks',
      title: '备注',
      width: 200, locked: false
    },
    {
      field: 'specialRemarks',
      title: '特殊备注',
      width: 200, locked: false
    },
    {
      field: 'receiptTime',
      title: '收货时间',
      width: 200, locked: false
    },
    {
      field: 'detailAddress',
      title: '详细地址',
      width: 200, locked: false
    },
    {
      field: 'realDeliveryTime',
      title: '实际发货时间',
      width: 200, locked: false
    },
    {
      field: 'realCarNumber',
      title: '实际送货车号',
      width: 200, locked: false
    },
    {
      field: 'mesRemark',
      title: 'MES备注',
      width: 200, locked: false
    },

    {
      field: 'audit',
      title: '审核人',
      width: 200, locked: false
    },
    {
      field: 'approveDate',
      title: '审核日期',
      width: 200, locked: false
    },

    {
      field: 'deliveryOrderDetailCode',
      title: '配送单行号',
      width: 200, locked: false
    },
    {
      field: 'deliveryOrderDetailState',
      title: '配送单行状态',
      width: 200, locked: false
    },
    {
      field: 'stockCode',
      title: '存货编码',
      width: 200, locked: false
    },
    {
      field: 'stockName',
      title: '存货名称',
      width: 200, locked: false
    },
    {
      field: 'warehouse',
      title: '实体仓库编码',
      width: 200, locked: false
    },
    {
      field: 'location',
      title: '库位编码',
      width: 200, locked: false
    },
    {
      field: 'whName',
      title: '仓库',
      width: 200, locked: false
    },
    {
      field: 'batchCode',
      title: '批号',
      width: 200, locked: false
    },
    {
      field: 'baleNo',
      title: '捆包号',
      width: 200, locked: false
    },
    {
      field: 'standardsTypes',
      title: '规格尺寸',
      width: 200, locked: false
    },
    {
      field: 'steelType',
      title: '钢种',
      width: 200, locked: false
    },
    {
      field: 'surface',
      title: '表面',
      width: 200, locked: false
    },
    {
      field: 'grade',
      title: '等级',
      width: 200, locked: false
    },
    {
      field: 'unitOfMeasure',
      title: '单位',
      width: 200, locked: false
    },
    {
      field: 'quantity',
      title: '数量',
      width: 200, locked: false
    },
    {
      field: 'weightKg',
      title: '净重',
      width: 200, locked: false
    },
    {
      field: 'grossWeight',
      title: '毛重',
      width: 200, locked: false
    },
    {
      field: 'theoreticalWeight',
      title: '理重',
      width: 200, locked: false
    },
    {
      field: 'coating',
      title: '表面保护',
      width: 200, locked: false
    },
    {
      field: 'sleeveType',
      title: '套筒类型',
      width: 200, locked: false
    },
    {
      field: 'sleeveWeight',
      title: '套筒重量',
      width: 200, locked: false
    },
    {
      field: 'boxType',
      title: '箱体类型',
      width: 200, locked: false
    },
    {
      field: 'packType',
      title: '包装方式',
      width: 200, locked: false
    },
    {
      field: 'saleRemark',
      title: '供销备注',
      width: 200, locked: false
    },

    {
      field: 'area',
      title: '送货区域',
      width: 200, locked: false
    },
    {
      field: 'ranges',
      title: '送货范围',
      width: 200, locked: false
    },
    {
      field: 'withinProvince',
      title: '是否省内',
      width: 200, locked: false
    },
    {
      field: 'cusCode',
      width: 120,
      headerName: '客户编码'
    },
    {
      field: 'cusName',
      title: '客户名称',
      width: 200, locked: false
    },
    {
      field: 'owner',
      title: '货权',
      width: 200, locked: false
    },
    {
      field: 'taxPrice',
      title: '含税价',
      width: 200, locked: false
    },
    {
      field: 'amountIncludingTax',
      title: '含税金额',
      width: 200, locked: false
    },
    {
      field: 'deliveryMethod',
      title: '提货方式',
      width: 200, locked: false
    },

    {
      field: 'createdBy',
      title: '制单人',
      width: 200, locked: false
    },
    {
      field: 'creationDate',
      title: '制单时间',
      width: 200, locked: false
    },
    {
      field: 'driverName',
      title: '司机姓名',
      width: 200, locked: false
    },
    {
      field: 'driverTel',
      title: '司机联系电话',
      width: 200, locked: false
    },
    { field: 'errorMessage', title: '错误', width: 150, locked: false },
  ];

  expColumnsOptions: any[] = [];
  @ViewChild('excelexport', { static: true }) excelexport: CustomExcelExportComponent;

  public excelDataProcess(tempData: any[]) {
    this.respmanagerService.Import(tempData).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate(res.msg));
        // 导入完以后，关闭当前窗口
        this.modal.close();
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.msg));
        this.excelexport.export(res.data);
      }
    });
  }

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public respmanagerService: DeliveryOrderQueryService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.modal.destroy();
  }
}
