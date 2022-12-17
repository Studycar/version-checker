export const COLUMN_INIT_DEFINED = {
  materialmanagement: {
    name: '物料管理',
    features: [
      {
        feature: 'materialmaintenance',
        name: '物料',
        tab: [
          {
            name: '主要', def: [
              {
                colId: 0,
                field: '',
                headerName: '操作',
                lockPinned: true,
                pinned: 'right',
                width: 100,
              },
              {
                field: 'ITEM_CODE',
                headerName: '物料',
                locked: true,
              },
              {
                field: 'UNIT_OF_MEASURE',
                headerName: '计量单位',
                width: 90,
              },
              {
                field: 'ITEM_TYPE',
                headerName: '物料类型',
                width: 90,
              },
              {
                field: 'GROSS_UNIT_WEIGHT',
                headerName: '单位毛重',
                width: 120,
              },
              {
                field: 'NET_UNIT_WEIGHT',
                headerName: '单位净重',
                width: 120,
              },
              {
                field: 'WEIGHT_UOM',
                headerName: '重量单位',
                width: 120,
              },
              {
                field: 'UNIT_LENGTH',
                headerName: '长',
                width: 120,
              },
              {

                field: 'UNIT_WIDTH',
                headerName: '宽',
                width: 120,
              },
              {
                field: 'UNIT_HEIGTH',
                headerName: '高',
                width: 120,
              },
              {
                field: 'DIMENSION_UOM',
                headerName: '维度单位',
                width: 120,
              },
              {
                field: 'UNIT_VOLUME',
                headerName: '体积',
                width: 120,
              },
              {
                field: 'VOLUME_UOM',
                headerName: '体积单位',
                width: 120,
              },
            ], stateKey: 'newmaterialmaintance1',
          },
          { name: '物理属性', def: [], stateKey: 'newmaterialmaintance2' },
          { name: '提前期', def: [], stateKey: 'newmaterialmaintance3' },
          { name: '采购与接收', def: [], stateKey: 'newmaterialmaintance4' },
          { name: '计划', def: [], stateKey: 'newmaterialmaintance5' },
          { name: '库存与车间管理', def: [], stateKey: 'newmaterialmaintance6' },
          { name: '其他 ', def: [], stateKey: 'newmaterialmaintance7' },
        ],
        // def:[] //如果不是tab类型的，则直接在此定义，tab属性不用写,里面只写和列状态相关的，涉及到格式化或者变量的不用填写
        // stateKey: {string} //如果不是tab类型的，则直接在此定义，agGrid的自定义状态名
      },
    ],

  },
};
