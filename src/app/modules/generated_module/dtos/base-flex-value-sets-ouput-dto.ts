/** 快码 */
export class BaseFlexValueSetsOutputDto {
    /** 值集ID*/
    public flex_value_set_id: number;
    /** 值集名称*/
    public flex_value_set_name: string;
    /** 说明描述*/
    public description: string;
    /** 格式类型*/
    public format_type: string;
    /** 最大尺寸*/
    public maximum_size: string;
    /** 精确度*/
    public number_precision: string;
    /** 仅限于数字*/
    public number_only_flag: string;
    /** 仅限于大写字母*/
    public uppercase_only_flag: string;
    /** 右对齐和填0编号*/
    public numeric_mode_enabled_flag: string;
    /** 最小值*/
    public minimum_value: string;
    /** 最大值*/
    public maximum_value: string;
    /** 验证类型*/
    public validation_type: string;
}
