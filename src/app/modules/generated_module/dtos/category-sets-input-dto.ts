/** 类别集保存 */
export class CategorySetsInputDto {
    /** 类别集名称 */
    public categorySetCode: string;
    /** 类别集描述 */
    public descriptions: string;
    /** 段数 */
    public segmentsQty: string;
    /** 是否冲减维度 */
    public consumeSet: string;
    /** 是否有效 */
    public enableFlag: string
}
