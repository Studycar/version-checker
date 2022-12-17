/** 用户刷新 */
export class PredictionOffSetshowInputDto {
  /** 预测ID */
  public ROW_ID: string;
  /** 预测ID */
  public FORECAST_ID: number;
  /** 库存组织 */
  public ORGANIZATION_CODE: string;
  /** 产品品类 */
  public PRODUCT_CATEGORY: string;
  /** 产品大类 */
  public PRODUCT_CATAGARY: string;
  /** 机身 */
  public PLATE_FORM: string;
  /** 物料编码/销售码 */
  public ITEM_CODE: string;
  /** 物料描述/销售码描述 */
  public ITEM_DESC: string;
  /** 套机码 */
  public HEADER_ITEM_CODE: string;
  /** 套机码描述 */
  public HEADER_ITEM_DESC: string;
  /** 生产码 */
  public NX_ITEM: string;
  /** 生产码描述 */
  public NX_ITEM_DESC: string;
  /** 内外销 */
  public DOMESTIC_EXPORT: string;
  /** 大区 */
  public BIG_AREA: string;
  /** 区域 */
  public AREA: string;

  /** 客户编码 */
  public CUSTOMER_CODE: string;
  /** 客户名称 */
  public CUSTOMER_DESC: string;
  /** 订单类型 */
  public ORDER_TYPE: string;
  /** 原始预测日期 */
  public FORCAST_DATE: string;
  /** 净预测日期 */
  public NET_FORECAST_DATE: string;
  /** 销售码原始数量 */
  public BEGIN_QUANTITY: string;
  /** 修改前数量 */
  public OLD_QUANTITY: string;
  /** 剩余净预测数量 */
  public NEW_QUANTITY: string;
  /** 是否转码 */
  public CONVERSION_FLAG: string;
  /** 预测集 */
  public PREDICTION_SET_NAME: string;
  /** 预测名 */
  public PREDICT_NAME: string;
  /**  */
  public ORIGINAL_ORDER_FLAG: string;

  public LAST_UPDATED_BY: string;
  /**  */
  public LAST_UPDATE_DATE: string;
  /**  */
  public CREATION_DATE: string;
  /**  */
  public CREATED_BY: string;
}
