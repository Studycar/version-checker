export class ItemResourceEnergyInputDto {
    public id: string;
    /**工厂 */
    public plantCode: string;
    /**计划组 */
    public scheduleGroupCode: string;
    /**资源 */
    public resourceCode: string;
    /**物料ID */
    public itemId: string;
    /**能源类型 */
    public energyType: string;
    /**单元能耗值 */
    public douValue: number;
    /**能源单位 */
    public unitSymbol: string;
}