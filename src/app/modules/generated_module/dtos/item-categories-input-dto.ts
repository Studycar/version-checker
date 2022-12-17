/** 物料类别保存 */
export class ItemCategoriesInputDto {
    /** ID */
    public id: string;
	/** 工厂 */
    public plantCode: string;
    /** 物料 */
    public itemId: string;
    /** 类别集 */
    public categorySetCode: string;
    /** 类别 */
    public categoryCode: string;
}

