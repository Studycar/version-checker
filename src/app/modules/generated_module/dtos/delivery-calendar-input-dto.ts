/** 班次保存 */
export class DeliveryCalendarInputDto {
    /** ID */
    public id: string;
	/** 工厂 */
    public plantCode: string;
    /** 多班次送货模型 */
    public deliveryCalendarCode: string;
    /** 班次 */
    public shiftCode: string;
    /** 开始时间 */
    public shiftStartTime: string;
    /** 结束时间 */
    public shiftEndTime: string;
}

