/**
 *
 * 工单规则记录
 * @export
 * @class BaseBillNoRuleRecordOutputDto
 */
export class BaseBillNoRuleRecordOutputDto {

    /**
     *
     * 规则编码
     * @type {string}
     * @memberof BaseBillNoRuleRecordOutputDto
     */
    public code: string;

    /**
     *
     * 规则名称
     * @type {string}
     * @memberof BaseBillNoRuleRecordOutputDto
     */
    public name: string;

    /**
     *
     * 日期格式
     * @type {string}
     * @memberof BaseBillNoRuleRecordOutputDto
     */
    public dateFormat: string;

    /**
     *
     * 最大号
     * @type {Number}
     * @memberof BaseBillNoRuleRecordOutputDto
     */
    public maxnum: Number;
}
