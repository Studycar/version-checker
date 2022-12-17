
export class ResourceManagerInputDto {
    /**ID */
    public Id: string;
    /**资源编码 */
    public RESOURCE_CODE: string;
    /**资源描述 */
    public DESCRIPTIONS: string;
    /**资源类型 */
    public RESOURCE_TYPE: string;
    /**事业部 */
    public SCHEDULE_REGION_CODE: string;
    /**工厂 */
    public PLANT_CODE: string;
    /**计划组 */
    public SCHEDULE_GROUP_CODE: string;
    /**资源组 */
    public RESOURCE_GROUP_CODE: string;
    /**排序码 */
    public ORDER_BY_CODE: string;
    /**跟队标志 */
    public FOLLOW_FLAG: string;
    /**拒绝联动 */
    public REFUSE_LINKAGE_FLAG: string;
    /**启用链式联动 */
    public CHAIN_LINKAGE_FLAG: string;
    /**前处理提前期（小时） */
    public PREPROCESSING_LEAD_TIME: string;
    /**后处理提前期（小时） */
    public POSTPROCESSING_LEAD_TIME: string;
    /**关键资源标志 */
    public KEY_RESOURCE_FLAG: string;
    /**启用MES标识 */
    public ENABLE_MES_FLAG: string;
    /** 启用实际排产标识*/
    public ENABLE_ACTUAL_PROD_FLAG: string;
    /**供应商编码 */
    public VENDOR_NUMBER: string;
    /**供应商地点编码 */
    public VENDOR_SITE_CODE: string;
    /**工单类型 */
    public MO_TYPE: string;
    /**生产线刷新标识 */
    public MO_REFRESH_FLAG: string;
    /**计划单引入MO */
    public IMPORT_PLAN_ORDER_FLAG: string;
    /**是否有效 */
    public ENABLE_FLAG: string;
}
