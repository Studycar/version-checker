import { ValueTag } from '../model/ValueTag';

export class ParamControlBase {
    text: string;
    value: string;
    key: string;
    label: string;
    required: boolean;
    controlType: string;
    controlStyle: any;
    gridView: any;
    columns: any[];
    order: number;
    valueField: string;
    textField: string;
    disabled: boolean;
    tag: ValueTag;

    constructor(p: {
        value?: string,
        text?: string,
        key?: string,
        label?: string,
        required?: boolean,
        order?: number,
        controlStyle?: any,
        gridView?: any,
        columns?: any[],
        valueField?: string,
        textField?: string,
        disabled?: boolean,
        tag?: ValueTag,
        controlType?: string
    } = {}) {
        this.text = p.text;
        this.value = p.value;
        this.key = p.key || '';
        this.label = p.label || '';
        this.required = !!p.required;
        this.order = p.order === undefined ? 1 : p.order;
        this.controlStyle = p.controlStyle || { 'width': '250' };
        this.gridView = p.gridView || {};
        this.columns = p.columns || [];
        this.valueField = p.valueField;
        this.textField = p.textField;
        this.disabled = p.disabled;
        this.tag = p.tag;
        this.controlType = p.controlType;
    }
}
/*
export class TextBox extends ParamControlBase<string> {
    controlType = 'textbox';
    constructor(options: {} = {}) {
        super(options);
    }
}

export class Date extends ParamControlBase<string> {
    controlType = 'date';
    constructor(options: {} = {}) {
        super(options);
    }
}

export class DateTime extends ParamControlBase<string> {
    controlType = 'datetime';
    constructor(options: {} = {}) {
        super(options);
    }
}

export class InputNumber extends ParamControlBase<string> {
    controlType = 'inputnumber';
    constructor(options: {} = {}) {
        super(options);
    }
}

export class DropDown extends ParamControlBase<string> {
    controlType = 'dropdown';
    constructor(options: {} = {}) {
        super(options);
    }
}*/
