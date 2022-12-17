/** mts计划 */
export class MtsPlanOptionInputDto {
    /** Id */
    public Id: number;
    /** 工厂 */
    public PLANT_CODE: string;

    public SOURCE_TYPE: string;

    public SOURCE_CATEGORY: string;

    public COMMENT: string;

    public PROSPECT_PERIOD: string;

    public CONVERT_ORDER_SOURCES: string;

    public FIX_TIME_FENCE: string;

    public PRIORITY: string;

    public REQ_TYPE: string;

    public DATA_COLLECTION_PARAMETERS: string;
}
