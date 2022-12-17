import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ElementRef,
  Renderer2, ViewChild, AfterViewInit, OnInit,
} from '@angular/core';
import { CustomBaseContext } from './custom-base-context.component';

/*
author:liujian11
date:2019-01-13
function:功能按钮
*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'custom-pager',
  templateUrl: '../views/custom-pager-test.html',
  styles: [`
    .pagerContainer {
      padding: 2px 0px;
      height: 35px;
      line-height: 35px;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      flex: 2 1;
      /* z-index:9999; */
    }

    .fixed {
      position: fixed;
      height: 30px;
      line-height: 30px;
      bottom: 0px;
    }

    .pageButton {
      cursor: pointer;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      height: 24px;
      line-height: 24px;
      width: 30px;
    }

    .pageIndex {
      cursor: pointer;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      height: 24px;
      line-height: 24px;
      padding: 0px 10px;
      color: rgb(24, 144, 255);
    }

    .pageIndex:hover {
      cursor: pointer;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      height: 24px;
      line-height: 24px;
      padding: 0px 10px;
      color: rgb(24, 144, 255);
      background-color: rgb(245, 247, 247);
    }

    .currentIndex {
      cursor: pointer;
      display: inline-block;
      text-align: center;
      vertical-align: middle;
      height: 24px;
      line-height: 24px;
      padding: 0px 10px;
      color: white;
      background-color: rgb(24, 144, 255);
    }

    .page-info {
    }

    .info {
      text-align: right;
    }

    .page-info ::ng-deep .ant-select-selection-selected-value {
      padding-right: 0;
    }

    .info span, .page-info span {
      display: inline-block;
      padding: 0px 2px;
    }

    .page-info .page-size-input-span {
      padding-left:8px;
      padding-right:5px; 
      vertical-align: top;
      display: inline-flex;
    }
    
    .page-info .page-size-input-span nz-input-number {
      width: 80px !important;
    }
  `],
})
export class CustomPagerComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('pagerWidth', { static: true }) pagerWidth: ElementRef;

  @Input() public context: CustomBaseContext;
  /* 外部调用组件对象的上下文*/
  // grid view
  @Input() public view;
  // pager height
  @Input() public height = 40;
  // pager width
  @Input() public width = '1000px';
  // 页码切换
  @Output() public pageChangeEvent = new EventEmitter();
  // 总记录数
  @Input() public total = 0;
  // 页面尺寸
  @Input() public size: 'small' | 'default' = 'default';
  // 当前页码
  @Input() public pageNo = 1;
  // 当前页码变更
  @Output() public pageNoChange = new EventEmitter();
  // 页面大小
  @Input() public pageSize = 20;
  // 页面大小切换
  @Output() public pageSizeChange = new EventEmitter();
  @Input() demandQuantity: number | boolean = false; // 需求数量
  @Input() moCompletedQuantity: number | boolean = false; // 完工数量
  @Input() meterNumQuantity: number | boolean = false; // 米数
  @Input() checkMoRows: number | boolean = false; // 已勾选工单行数
  pageSizeInputStyle = {
    height: '32px',
    lineHeight: '32px',
  }


  // 总页数
  public pageCount = 0;
  // 页码选项
  public pageIndexs = [];
  // add by jianl 表示页码的开始值，主要用于generatePageIndexs()方法的参数
  public pageStartIndex = 1;
  // 页码选项显示的项数
  public pageIndexShowCount = 10;
  // 页面大小选项
  @Input() public pageSizes = [10, 20, 30, 50, 100];
  // 当前页开始记录Index
  public startRowIndex = 0;
  // 当前页结束记录Index
  public endRowIndex = 0;
  // 是否固定页面底部
  @Input() public fixed = true;
  // pager background-color
  @Input() public backgroundStyle = { 'background-color': 'rgb(255,255,255)' };
  public pageSize_custom = 10;
  constructor(
    public element: ElementRef,
    public render: Renderer2,
  ) {
  }

  ngAfterViewInit() {
    if(this.size === 'small') {
      this.pageSizeInputStyle.height = '24px';
      this.pageSizeInputStyle.lineHeight = '24px';
    }
    Promise.resolve(null).then(() => this.width = this.pagerWidth.nativeElement.clientWidth > 0 ? `${this.pagerWidth.nativeElement.clientWidth}px` : '100%');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.view !== undefined) {
      // jianl修改，解决不能切换分页的问题
      // this.generatePageIndexs(1);
      // 如果外面重新设置了pageno，则也需要重设页码开始值
      if (this.pageNo === 1) {
        this.pageStartIndex = 1;
      }
      // console.log('CustomPagerComponent.ngOnChanges:');
      this.generatePageIndexs(this.pageStartIndex);
      this.generateRowIndexRange();
    }
  }

  ngOnInit() {
    this.pageSize_custom = this.pageSize;
    // this.setSearch();
  }

  // 设置页码大小可搜索
  // private setSearch() {
  //   const select = document.querySelector('.ant-pagination-options-size-changer');
  //   select['nzShowSearch'] = true;
  // }

  // 设置grid加载状态
  private setLoading() {
    if (this.context !== undefined) {
      this.context.setLoading(true);
    }
  }

  // 生成页码选项
  private generatePageIndexs(startIndex: number = 1) {
    if (this.view === undefined || this.view === null) {
      return;
    }
    this.pageStartIndex = startIndex;
    this.total = this.view.total > 0 ? this.view.total : ((this.context !== undefined && this.context.gridData !== undefined) ? this.context.gridData.length : 0);
    this.pageCount = Math.ceil(this.total / this.pageSize);
    this.pageIndexs = [];
    if (startIndex > 1) {
      this.pageIndexs.push('...');
    }
    for (let pageIndex = startIndex; pageIndex <= this.pageCount && pageIndex < startIndex + this.pageIndexShowCount; pageIndex++) {
      this.pageIndexs.push(pageIndex);
    }
    if (this.pageIndexs[this.pageIndexs.length - 1] < this.pageCount) {
      this.pageIndexs.push('...');
    }
  }

  // 计算当前页面行记录范围
  private generateRowIndexRange() {
    // console.log('generateRowIndexRange:');
    this.startRowIndex = (this.pageNo - 1) * this.pageSize + 1;
    this.endRowIndex = this.pageNo * this.pageSize > this.total ? this.total : this.pageNo * this.pageSize;
  }

  // 页码切换
  public onPageChange(pageNo) {
    // console.log('onPageChange:');
    this.setLoading();
    this.pageNo = pageNo;
    this.generateRowIndexRange();
    // if (!isNaN(pageNo)) {
    //   this.pageNo = pageNo;
    //   this.generateRowIndexRange();
    // } else { // 重新生成页码选项
    //   // 上一页码选项
    //   if (index === 0) {
    //     this.generatePageIndexs(this.pageIndexs[1] - this.pageIndexShowCount);
    //     this.pageNo = this.pageIndexs[this.pageIndexs.length - 2];
    //   } else { // 下一页码选项
    //     this.generatePageIndexs(this.pageIndexs[this.pageIndexs.length - 2] + 1);
    //     this.pageNo = this.pageIndexs[1];
    //   }
    //   this.generateRowIndexRange();
    // }
    this.pageNoChange.emit(this.pageNo);
    this.pageChangeEvent.emit({ pageNo: this.pageNo, pageSize: this.pageSize });
  }

  // 页面大小切换
  public onPageSizeChange(pageSize) {
    this.setLoading();
    this.pageSize = pageSize;
    this.pageSize_custom = pageSize;
    this.pageSizeChange.emit(this.pageSize);
    this.pageNo = 1;
    this.pageNoChange.emit(this.pageNo);
    this.generatePageIndexs(1);
    this.generateRowIndexRange();
    this.pageChangeEvent.emit({ pageNo: this.pageNo, pageSize: this.pageSize });
  }
  // 页面大小输入切换
  public onPageSizeChange_custom(pageSize) {
    if (this.pageSizes.findIndex(p => p === pageSize) === -1) {
      this.pageSizes.push(pageSize);
    }
    this.onPageSizeChange(pageSize);
  }
  // 首页
  public onFirstPage(event) {
    this.pageNo = 1;
    if (this.pageIndexs.findIndex(x => x === this.pageNo) === -1) {
      this.generatePageIndexs(1);
    }
    this.generateRowIndexRange();
    this.pageNoChange.emit(this.pageNo);
    this.pageChangeEvent.emit({ pageNo: this.pageNo, pageSize: this.pageSize });
  }

  // 上页
  public onPreviousPage(event) {
    if (this.pageNo <= 1) {
      this.pageNo = 1;
    } else {
      this.pageNo--;
    }
    if (this.pageIndexs.findIndex(x => x === this.pageNo) === -1) {
      this.generatePageIndexs(this.pageIndexs[1] - this.pageIndexShowCount);
    }
    this.generateRowIndexRange();
    this.pageNoChange.emit(this.pageNo);
    this.pageChangeEvent.emit({ pageNo: this.pageNo, pageSize: this.pageSize });
  }

  // 下页
  public onNextPage(event) {
    if (this.pageNo < this.pageCount) {
      this.pageNo++;
    } else {
      this.pageNo = this.pageCount;
    }
    if (this.pageIndexs.findIndex(x => x === this.pageNo) === -1) {
      this.generatePageIndexs(this.pageIndexs[this.pageIndexs.length - 2] + 1);
    }
    this.generateRowIndexRange();
    this.pageNoChange.emit(this.pageNo);
    this.pageChangeEvent.emit({ pageNo: this.pageNo, pageSize: this.pageSize });
  }

  // 末页
  public onLastPage(event) {
    this.pageNo = this.pageCount;
    if (this.pageIndexs.findIndex(x => x === this.pageNo) === -1) {
      this.generatePageIndexs(Math.floor((this.pageNo - 1) / this.pageIndexShowCount) * this.pageIndexShowCount + 1);
    }
    this.generateRowIndexRange();
    this.pageNoChange.emit(this.pageNo);
    this.pageChangeEvent.emit({ pageNo: this.pageNo, pageSize: this.pageSize });
  }

}
