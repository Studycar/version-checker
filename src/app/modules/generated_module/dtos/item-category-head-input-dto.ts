/** 采购品类保存 */
export class ItemCategoryHeadInputDto {
    public id: string;

    public plantCode: string;

    public categoryCode: string;

    public deliveryRegionCode: string;

    public fdSourceType: string;

    public collectType: string;

    public deliveryCalendarCode: string;

    public autoCalType: string;

    public reqLeadTime: string;

    public overduceReqTime: string;

    public overdueDelNotifyTime: string;

    public overdueDelTicketTime: string;

    public enableFlag: Boolean;

    public issueTimeFence: number;

    public fixTimeFence: number;
}
