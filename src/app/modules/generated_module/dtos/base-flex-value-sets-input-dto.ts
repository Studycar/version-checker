/** 值集定义 */
export class BaseFlexValueSetsInputDto {
    /** 值集ID*/
    public flexValueSetId: string;
    /** 值集名称*/
    public flexValueSetName: string;
    /** 说明描述*/
    public description: string;
    /** 格式类型*/
    public formatType: string;
    /** 最大尺寸*/
    public maximumSize: string;
    /** 精确度*/
    public numberPrecision: string;
    /** 仅限于数字*/
    public numberOnlyFlag: string;
    /** 仅限于大写字母*/
    public uppercaseOnlyFlag: string;
    /** 右对齐和填0编号*/
    public numericModeEnabledFlag: string;
    /** 最小值*/
    public minimumValue: string;
    /** 最大值*/
    public maximumValue: string;
    /** 验证类型*/
    public validationType: string;
}
