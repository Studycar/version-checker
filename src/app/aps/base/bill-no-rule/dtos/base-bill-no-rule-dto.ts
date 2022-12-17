/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-06-29 15:32:29
 * @LastEditors: Zwh
 * @LastEditTime: 2021-03-15 10:06:31
 * @Note: ...
 */
/**
 *
 * 工单规则
 * @export
 * @class BaseBillNoRuleDto
 */
export class BaseBillNoRuleDto {
  /**
   *
   * 主键
   * @type {string}
   * @memberof BaseBillNoRuleDto
   */
  public id: string;

  /**
   * 
   * 规则编码
   * @type {string}
   * @memberof BaseBillNoRuleDto
   */
  public code: string;

  /**
   *
   * 规则名称
   * @type {string}
   * @memberof BaseBillNoRuleDto
   */
  public name: string;

  /**
   * 
   * 前缀
   * @type {string}
   * @memberof BaseBillNoRuleDto
   */
  public prefix: string;

  /**
*
* 日期格式
* @type {string}
* @memberof BaseBillNoRuleDto
*/
  public dateFormat: string;

  /**
   *
   * 流水位数
   * @type {Number}
   * @memberof BaseBillNoRuleDto
   */
  public noDigits: Number;

  /**
   *
   * 编码格式
   * @type {string}
   * @memberof BaseBillNoRuleDto
   */
  public codeFormat: string;

  /**
   *
   * 示例
   * @type {string}
   * @memberof BaseBillNoRuleDto
   */
  public examples: string;

  /**
   *
   * 排序
   * @type {string}
   * @memberof BaseBillNoRuleDto
   */
  public sort: string;

  /**
   *
   * 可用
   * @type {boolean}
   * @memberof BaseBillNoRuleDto
   */
  public active: Boolean;
}
