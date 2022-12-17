import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { ModalHelper, _HttpClient } from "@delon/theme";
import { ActivatedRoute, Router } from "@angular/router";
import { BrandService } from "app/layout/pro/pro.service";
import { CustomBaseContext } from "app/modules/base_module/components/custom-base-context.component";
import { UiType } from "app/modules/base_module/components/custom-form-query.component";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppTranslationService } from "app/modules/base_module/services/app-translation-service";
import { NzMessageService, NzModalService } from "ng-zorro-antd";
import { DeliveryOrderDetailPageQueryService } from "./query.service";

@Component({
  selector: 'delivery-order-detail-page',
  templateUrl: './delivery-order-detail-page.component.html',
  providers: [DeliveryOrderDetailPageQueryService]
})
export class DeliveryOrderDetailPageComponent extends CustomBaseContext implements OnInit {

  constructor(
    public pro: BrandService,
    public modal: ModalHelper,
    public msgSrv: NzMessageService,
    public appTranslationService: AppTranslationService,
    public confirmationService: NzModalService,
    private appconfig: AppConfigService,
    public queryService: DeliveryOrderDetailPageQueryService,
    public http: _HttpClient,
    private activatedRoute: ActivatedRoute,
  ) {
    super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appconfig });
    this.headerNameTranslate(this.columns);
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.plantCode = params.get('plantCode')
      this.queryParams.values = {
        deliveryOrderCode: params.get('deliveryOrderCode') || ''
      }
      this.query()
    })
  }

  columns = [
    {
      field: 'deliveryOrderCode',
      width: 120,
      headerName: '配送单号'
    },
    // {
    //   field: 'state',
    //   width: 120,
    //   headerName: '配送单状态',
    //   valueFormatter: 'ctx.optionsFind(value,1).label'
    // },
    // {
    //   field: 'deliveryOrderDate',
    //   width: 120,
    //   headerName: '配送日期'
    // },
    // {
    //   field: 'carNumber',
    //   width: 120,
    //   headerName: '车号'
    // },
    // {
    //   field: 'logistics',
    //   width: 120,
    //   headerName: '物流公司'
    // },
    // {
    //   field: 'place',
    //   width: 120,
    //   headerName: '目的地'
    // },
    // {
    //   field: 'remarks',
    //   width: 120,
    //   headerName: '备注'
    // },
    // {
    //   field: 'receiptTime',
    //   width: 120,
    //   headerName: '收货时间'
    // },
    // {
    //   field: 'detailAddress',
    //   width: 120,
    //   headerName: '详细地址'
    // },
    // {
    //   field: 'realDeliveryTime',
    //   width: 120,
    //   headerName: '实际发货时间'
    // },
    // {
    //   field: 'realCarNumber',
    //   width: 120,
    //   headerName: '实际送货车号'
    // },
    // {
    //   field: 'mesRemark',
    //   width: 120,
    //   headerName: 'MES备注'
    // },

    // {
    //   field: 'audit',
    //   width: 120,
    //   headerName: '审核人'
    // },
    // {
    //   field: 'approveDate',
    //   width: 120,
    //   headerName: '审核日期'
    // },

    {
      field: 'detailedNum',
      width: 120,
      headerName: '配送单行号'
    },
    {
      field: 'deliveryOrderDetailState',
      width: 120,
      headerName: '配送单行状态'
    },
    {
      field: 'stockCode',
      width: 120,
      headerName: '存货编码'
    },
    {
      field: 'stockName',
      width: 120,
      headerName: '存货名称'
    },
    {
      field: 'warehouse',
      width: 120,
      headerName: '实体仓库编码'
    },
    {
      field: 'location',
      width: 120,
      headerName: '库位编码'
    },
    {
      field: 'whName',
      width: 120,
      headerName: '仓库'
    },
    {
      field: 'batchCode',
      width: 120,
      headerName: '批号'
    },
    {
      field: 'baleNo',
      width: 120,
      headerName: '捆包号'
    },
    {
      field: 'spec',
      width: 120,
      headerName: '规格尺寸'
    },
    {
      field: 'steelGrade',
      width: 120,
      headerName: '钢种'
    },
    {
      field: 'surface',
      width: 120,
      headerName: '表面'
    },
    {
      field: 'grade',
      width: 120,
      headerName: '等级'
    },
    {
      field: 'unitOfMeasure',
      width: 120,
      headerName: '单位'
    },
    {
      field: 'quantity',
      width: 120,
      headerName: '数量'
    },
    {
      field: 'weightKg',
      width: 120,
      headerName: '净重'
    },
    {
      field: 'grossWeight',
      width: 120,
      headerName: '毛重'
    },
    {
      field: 'theoreticalWeight',
      width: 120,
      headerName: '理重'
    },
    {
      field: 'coating',
      width: 120,
      headerName: '表面保护'
    },
    {
      field: 'sleeveType',
      width: 120,
      headerName: '套筒类型'
    },
    {
      field: 'sleeveWeight',
      width: 120,
      headerName: '套筒重量'
    },
    {
      field: 'boxType',
      width: 120,
      headerName: '箱体类型'
    },
    {
      field: 'packType',
      width: 120,
      headerName: '包装方式'
    },
    {
      field: 'saleRemark',
      width: 120,
      headerName: '供销备注'
    },
    {
      field: 'deliveryOrderState',
      width: 120,
      headerName: '配送单状态'
    },
    {
      field: 'source',
      width: 120,
      headerName: '来源'
    },

    {
      field: 'docCode',
      width: 120,
      headerName: '来源单号'
    },
    {
      field: 'area',
      width: 120,
      headerName: '送货区域'
    },
    {
      field: 'ranges',
      width: 120,
      headerName: '送货范围'
    },
    {
      field: 'withinProvince',
      width: 120,
      headerName: '是否省内'
    },
    {
      field: 'cusName',
      width: 120,
      headerName: '客户名称'
    },
    {
      field: 'owner',
      width: 120,
      headerName: '货权'
    },
    {
      field: 'taxPrice',
      width: 120,
      headerName: '含税价'
    },
    {
      field: 'amountIncludingTax',
      width: 120,
      headerName: '含税金额'
    },
    {
      field: 'deliveryMethod',
      width: 120,
      headerName: '提货方式'
    },

    {
      field: 'createdBy',
      width: 120,
      headerName: '制单人'
    },
    {
      field: 'creationDate',
      width: 120,
      headerName: '制单时间'
    },
    {
      field: 'driverName',
      width: 120,
      headerName: '司机姓名'
    },
    {
      field: 'driverTel',
      width: 120,
      headerName: '司机联系电话'
    },
    {
      field: 'specialRemarks',
      width: 120,
      headerName: '特殊备注',
    },
    // {
    //   field: 'state',
    //   width: 120,
    //   headerName: '配送单状态',
    //   valueFormatter: 'ctx.optionsFind(value,1).label'
    // },
  ];

  plantCode: string = '';
  public orderDetail = {
    deliveryOrderCode: '',
    deliveryOrderDate: '',
    carNumber: '',
    logistics: '',
    receiptTime: '',
    place: '',
    remarks:'',
    detailAddress: '',
  }
  queryParams = {
    defines: [
      { field: 'deliveryOrderCode', title: '配送单号', ui: { type: UiType.text } }
    ],
    values: {
      deliveryOrderCode: '',
    }
  };

  clear() {
    this.queryParams.values = {
      deliveryOrderCode: '',
    }
  }
  ngOnInit() {
    this.query();
  }
  query() {
    super.query();
    this.queryCommon();
  }

  httpAction = { url: this.queryService.queryUrl, method: 'GET' };
  queryCommon() {
    this.queryService.loadGridViewNew(
      this.httpAction,
      this.getQueryParamsValue(),
      this.context,
      this.getDetail.bind(this)
    )
  }
  getDetail(res) {
    if (res.extra) {
      let {
        deliveryOrderCode,
        deliveryOrderDate,
        carNumber,
        logistics,
        receiptTime,
        place,
        remarks,
        detailAddress
      } = res.extra
      this.orderDetail.deliveryOrderCode = deliveryOrderCode
      this.orderDetail.deliveryOrderDate = deliveryOrderDate
      this.orderDetail.carNumber = carNumber
      this.orderDetail.logistics = logistics
      this.orderDetail.receiptTime = receiptTime
      this.orderDetail.place = place
      this.orderDetail.remarks = remarks
      this.orderDetail.detailAddress = detailAddress
    } else {
      this.orderDetail.deliveryOrderCode = ''
      this.orderDetail.deliveryOrderDate = ''
      this.orderDetail.carNumber = ''
      this.orderDetail.logistics = ''
      this.orderDetail.receiptTime = ''
      this.orderDetail.place = ''
      this.orderDetail.remarks = ''
      this.orderDetail.detailAddress = ''
    }
    return res
  }
  onFilterChanged(event) {
    const data: any[] = [];
    this.gridApi.forEachNodeAfterFilter(item => {
      data.push(item.data);
    });
    this.setTotalBottomRow(data);
  }
  // 获取数据后统计
  loadGridDataCallback(result) {
    setTimeout(() => {
      const isFilter = this.gridApi.isColumnFilterPresent();
      let data = [];
      if (isFilter) {
        this.gridApi.forEachNodeAfterFilter(item => {
          data.push(item.data);
        });
      } else {
        if (result.data) {
          if (Array.isArray(result.data)) {
            data = result.data;
          } else if (result.data.content && Array.isArray(result.data.content)) {
            data = result.data.content;
          }
        } 
      }
      this.setTotalBottomRow(data);
    });
  }
  // 统计方法
  setTotalBottomRow(data: any[]) {
    // 显示"总计"的列
    const totalField = 'deliveryOrderCode';
    // 需要统计的列数组
    const fields = ['quantity', 'weightKg', 'grossWeight', 'theoreticalWeight'];
    super.setTotalBottomRow(data, totalField, fields);
  }
  getQueryParamsValue() {
    let { deliveryOrderCode } = this.queryParams.values
    return {
      deliveryOrderCode,
      pendingState: 10,
      plantCode: this.plantCode || this.appconfig.getActivePlantCode(),
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
    }
  }

  onPageChanged({ pageNo, pageSize }) {
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.queryCommon();
  }
}
