export const CUS_ORDER_COLUMNS = [
  {
    field: 'cusOrderCode',
    width: 120,
    headerName: '订单编码'
  },
  {
    field: 'cusOrderState',
    width: 120,
    headerName: '订单状态',
    valueFormatter: 'ctx.optionsFind(value,1).label',
  },
  {
    field: 'cusOrderType',
    width: 120,
    headerName: '订单类型',
    valueFormatter: 'ctx.optionsFind(value,8).label',
  },
  {
    field: 'itemCode',
    width: 120,
    headerName: '物料编码',
  },
  {
    field: 'productCategory',
    width: 120,
    headerName: '产品大类',
    valueFormatter: 'ctx.optionsFind(value,7).label',
  },
  {
    field: 'orderDate',
    width: 120,
    headerName: '下单日期'
  },
  {
    field: 'orderMonth',
    width: 120,
    headerName: '订单月份'
  },
  {
    field: 'cusAbbreviation',
    width: 120,
    headerName: '客户简称'
  },
  {
    field: 'cusCode',
    width: 120,
    headerName: '客户编码'
  },
  {
    field: 'plan',
    width: 120,
    headerName: '计划',
    valueFormatter: 'ctx.optionsFind(value,2).label',
  },
  {
    field: 'steelType',
    width: 120,
    headerName: '钢种',
    valueFormatter: 'ctx.optionsFind(value,3).label',
  },
  {
    field: 'prodType',
    width: 120,
    headerName: '形式',
    valueFormatter: 'ctx.optionsFind(value,15).label',
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
    field: 'coatingUpCode',
    width: 120,
    headerName: '面膜编码'
  },
  {
    field: 'coatingUpName',
    width: 120,
    headerName: '面膜描述'
  },
  {
    field: 'coatingDownCode',
    width: 120,
    headerName: '底膜编码'
  },
  {
    field: 'coatingDownName',
    width: 120,
    headerName: '底膜描述'
  },
  {
    field: 'paper',
    width: 120,
    headerName: '垫纸',
    valueFormatter: 'ctx.optionsFind(value,4).label',
  },
  {
    field: 'salesOrderType',
    width: 120,
    headerName: '销售类型',
    valueFormatter: 'ctx.optionsFind(value,16).label',
  },
  {
    field: 'standards',
    width: 120,
    headerName: '规格'
  },
  {
    field: 'width',
    width: 120,
    headerName: '宽度'
  },
  {
    field: 'prodLength',
    width: 120,
    headerName: '长度'
  },
  {
    field: 'quantity',
    width: 120,
    headerName: '数量'
  },
  {
    field: 'boxQuantity',
    width: 120,
    headerName: '箱数'
  },
  {
    field: 'packingQuantuty',
    width: 120,
    headerName: '装箱张数'
  },
  {
    field: 'cusDeliveryDate',
    width: 120,
    headerName: '客户交期'
  },
  {
    field: 'processingReq',
    width: 120,
    headerName: '加工要求'
  },
  {
    field: 'tolerance',
    width: 120,
    headerName: '公差',
    valueFormatter: 'ctx.optionsFind(value,17).label',
  },
  {
    field: 'pickUp',
    width: 120,
    headerName: '是否自提',
    valueFormatter: 'ctx.optionsFind(value,4).label',
  },
  {
    field: 'cusOrder',
    width: 120,
    headerName: '是否客订',
    valueFormatter: 'ctx.optionsFind(value,4).label',
  },
  {
    field: 'processingType',
    width: 120,
    headerName: '加工类型',
    valueFormatter: 'ctx.optionsFind(value,9).label',
  },
  {
    field: 'surface',
    width: 120,
    headerName: '表面',
    valueFormatter: 'ctx.optionsFind(value,5).label',
  },
  {
    field: 'hardness',
    width: 120,
    headerName: '硬度'
  },
  {
    field: 'plannedDeliveryDate',
    width: 120,
    headerName: '计划交期',
  },
  {
    field: 'meterNum',
    width: 120,
    headerName: '米数'
  },
  {
    field: 'plantCode',
    width: 120,
    headerName: '产地',
  },
  {
    field: 'urgent',
    width: 120,
    headerName: '急要',
    valueFormatter: 'ctx.optionsFind(value,4).label',
  },
  {
    field: 'isChange',
    width: 120,
    headerName: '变更',
    valueFormatter: 'ctx.optionsFind(value,4).label',
  },
  {
    field: 'coilState',
    width: 120,
    headerName: '钢卷状态',
  },
  {
    field: 'coilBatchNum',
    width: 120,
    headerName: '来料批号'
  },
  {
    field: 'deliveryQuantity',
    width: 120,
    headerName: '交货重量',
  },
  {
    field: 'deliveryDate',
    width: 120,
    headerName: '交货日期',
  },
  {
    field: 'salesStrategy',
    width: 120,
    headerName: '销售策略',
  },
  {
    field: 'standardsType',
    width: 120,
    headerName: '规格尺寸',
  },
  {
    field: 'elongation',
    width: 120,
    headerName: '延伸率',
  },
  {
    field: 'gloss',
    width: 120,
    headerName: '光泽度',
  },
  {
    field: 'ironLoss',
    width: 120,
    headerName: '铁损',
  },
  {
    field: 'magnetoreception',
    width: 120,
    headerName: '磁感',
  },
  {
    field: 'subsectionState',
    width: 120,
    headerName: '分卷状态',
    valueFormatter: 'ctx.optionsFind(value,10).label',
  },
  {
    field: 'coilInnerDia',
    width: 120,
    headerName: '钢卷内径',
  },
  {
    field: 'transportType',
    width: 120,
    headerName: '运输方式',
    valueFormatter: 'ctx.optionsFind(value,11).label',
  },
  {
    field: 'fullVolume',
    width: 120,
    headerName: '是否整卷',
    valueFormatter: 'ctx.optionsFind(value,4).label',
  },
  {
    field: 'entrustedProcessing',
    width: 120,
    headerName: '是否受托',
    valueFormatter: 'ctx.optionsFind(value,4).label',
  },
  {
    field: 'trmming',
    width: 120,
    headerName: '是否切边',
    valueFormatter: 'ctx.optionsFind(value,4).label',
  },
  {
    field: 'unit',
    width: 120,
    headerName: '数量单位',
    valueFormatter: 'ctx.optionsFind(value,12).label',
  },
  {
    field: 'unitOfMeasure',
    width: 120,
    headerName: '重量单位',
    valueFormatter: 'ctx.optionsFind(value,12).label',
  },
  {
    field: 'weight',
    width: 120,
    headerName: '重量',
  },
  {
    field: 'packType',
    width: 120,
    headerName: '包装方式',
    valueFormatter: 'ctx.optionsFind(value,13).label',
  },
  {
    field: 'sampleNum',
    width: 120,
    headerName: '样本编号',
  },
  {
    field: 'settlestyle',
    width: 120,
    headerName: '结算方式',
    valueFormatter: 'ctx.optionsFind(value,14).label',
  },
  {
    field: 'slittingQuantity',
    width: 120,
    headerName: '分条数量',
  },
  {
    field: 'reason',
    width: 120,
    headerName: '驳回原因',
  },
  {
    field: 'creationDate',
    width: 120,
    headerName: '创建日期'
  },
  {
    field: 'createdBy',
    width: 120,
    headerName: '创建人'
  },
  {
    field: 'lastUpdateDate',
    width: 120,
    headerName: '最近更新日期'
  },
  {
    field: 'lastUpdatedBy',
    width: 120,
    headerName: '最近更新人'
  },
];
