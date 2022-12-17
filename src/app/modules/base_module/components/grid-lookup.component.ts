import { Component, OnInit, Input, SimpleChange, Output, EventEmitter, ViewChild, Renderer2, NgZone, ElementRef, HostListener, ViewEncapsulation } from '@angular/core';
import { GridDataResult, RowArgs, SelectableSettings, RowClassArgs, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopupModule } from '@progress/kendo-angular-popup';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'grid-lookup',
    templateUrl: '../views/grid-lookup.component.html'
})
export class GridLookUpComponent implements OnInit {
    cancelBubble = false;
    show = false;
    sort: SortDescriptor[] = [];
    SelectValue: string;
    SelectText: string;
    Id: string;
    lastColumnName: string;
    gridData: any[] = [];
    gridView: any[] = [];

    anchorAlign: any = { horizontal: 'left', vertical: 'bottom' };
    popupAlign: any = { horizontal: 'left', vertical: 'top' };


    @Input() readOnly = false;
    @Input() Disabled = false;
    @Input() nzStyle = { 'width': '150px' };
    @Input() TextField: string;
    @Input() ValueField: string;
    @Input() columns: any[] = [];

    // 定义控件宽度
    kendoStyle = { 'width': '600px' };
    kendoHeight = 250;
    kendoMaxHeight = 320;
    kendoMaxWidth = 600;
    otherHeight = 72;

    public mySelection: string[] = [];

    constructor(private zone: NgZone,
        private renderer: Renderer2, ) { }

    ngOnInit() {
        this.lastColumnName = this.columns[this.columns.length - 1].field;

        // 计算网格宽度
        let width = 0;
        for (let i = 0; i < this.columns.length; i++) {
            width += !this.columns[i].hidden ? Number(this.columns[i].width || 100) : 0;
        }

        width = width > this.kendoMaxWidth ? this.kendoMaxWidth : width;
        this.kendoStyle.width = width + 'px';
    }

    @ViewChild('anchor', {static: true}) public anchor: ElementRef;
    @ViewChild('popup', { static: true, read: ElementRef }) public popup: ElementRef;

    @HostListener('keydown', ['$event'])
    protected keydown(event: any): void {
        // 按esc健 退出
        if (event.keyCode === 27) {
            this.toggle(false);
        }
    }

    // 给document注册click事件
    @HostListener('document:click', ['$event'])
    protected documentClick(event: any): void {
        // 如果是点击的放大镜显示下拉选择窗体时不执行下面代码
        if (!this.cancelBubble && !this.contains(event.target)) {
            this.toggle(false);
        }
        this.cancelBubble = false;
    }

    protected toggle(show?: boolean): void {
        this.show = show !== undefined ? show : !this.show;
    }

    protected contains(target: any): boolean {
        return this.popup ? this.popup.nativeElement.contains(target) : false;
    }

    @Input()
    public set Value(value: string) {
        this.SelectValue = value || '';
    }

    public get Value(): string {
        return this.SelectValue === undefined ? '' : this.SelectValue;
    }

    @Input()
    public set Text(text: string) {
        this.SelectText = text || '';
    }

    public get Text(): string {
        return this.SelectText === undefined ? '' : this.SelectText;
    }

    @Input()
    public set ID(id: string) {
        this.Id = id || '';
    }

    public get ID(): string {
        return this.Id || '';
    }

    @Input()
    public set DataSource(gridData: any[]) {
        this.gridView = gridData || [];
        this.gridData = gridData || [];
    }

    public get DataSource(): any[] {
        return this.gridView || [];
    }

    protected calcGridViewHeight(e: any) {
        const clientY = e.clientY;
        const offsetY = e.offsetY;

        // 计算触发元素上边缘到顶部距离
        const topY = clientY - offsetY;
        // 计算触发元素下边缘到底部距离
        const bottomY = document.body.clientHeight - clientY - (24 - offsetY);

        // 触发元素下边缘到底部的距离是满足控件最大高度 this.kendoMaxHeight + this.otherHeight
        // 或者下边缘到底部距离大于上边缘到顶部距离则控件向下展示 否则向上展示
        if (bottomY >= this.kendoMaxHeight + this.otherHeight || bottomY > topY) {
            this.anchorAlign.vertical = 'bottom';
            this.popupAlign.vertical = 'top';
            this.kendoHeight = bottomY - this.otherHeight;
        } else {
            this.anchorAlign.vertical = 'top';
            this.popupAlign.vertical = 'bottom';
            this.kendoHeight = topY - this.otherHeight;
        }

        // 计算网格高度大于预计高度,则取预计高度，否则取实际高度
        this.kendoHeight = this.kendoHeight > this.kendoMaxHeight ? this.kendoMaxHeight : this.kendoHeight;
    }

    public SelectPopup(e: any) {
        if (!this.anchor.nativeElement.contains(e.target)) {

            if (!this.Disabled) {
                this.toggle();
                if (this.show) {
                    // 计算网格高度
                    this.calcGridViewHeight(e);
                }
            }
            // 解决同一个界面上有多个控件，点击其中一个控件放大镜弹出选择窗体时 其他控件的弹出窗体不会隐藏的问题
            this.cancelBubble = true;
        }
    }

    // 键盘事件
    public onKeydown(e: any) {
        if (!this.SelectText) {
            this.SelectValue = '';
            this.gridData = this.gridView;
        } else {
            this.gridData = [];
            for (let i = 0; i < this.gridView.length; i++) {
                let isContain = false;
                for (let j = 0; j < this.columns.length; j++) {
                    if (!this.columns[j].hidden && this.gridView[i][this.columns[j].field].index(this.SelectText) > - 1) {
                        isContain = true;
                        break;
                    }
                }
                if (isContain) {
                    this.gridData.push(this.gridView[i]);
                }
            }

            this.toggle();
            if (this.show) {
                // 计算网格高度
                this.calcGridViewHeight(e);
            }
        }
    }

    // 选中行事件
    public onSelectedKeysChange(e) {
        this.SelectValue = e.toString();
        const SelectRow = this.gridData.find(x => x[this.ValueField].toString() === e.toString());
        if (SelectRow !== undefined && SelectRow !== null) {
            this.SelectText = SelectRow[this.TextField || this.ValueField];
        }
        this.show = !this.show;
    }

    // 排序事件
    public sortChange(sort: SortDescriptor[]): void {
        this.sort = sort;
        this.gridData = orderBy(this.gridData, sort);
    }
}
