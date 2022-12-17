/**能源单价快码 PS_ENERGY_PRICE */
export class EnerygyPriceInputDto {
    public id: string;
    /**工厂编码 */
    public plantCode: string;
    /**能源类型 */
    public energyType: string;
    /**价格类型 */
    public planType: string;
    /**能源单位 */
    public unitSymbol: string;
    /**单价 */
    public priceResult: number;
    /**峰平谷类型 */
    public rateNumber: string;
    /**时间从 */
    public startTime: string;
    /**时间至 */
    public endTime: string;
}