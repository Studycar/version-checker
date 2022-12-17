import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
/* 
author:liujian11
date:2018-09-19 
function:产线选择生成树,查询区下拉选择
*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'custom-tree-select',
  templateUrl: '../views/custom-tree-select.html'
})
export class CustomTreeSelectComponent implements OnInit, OnChanges {
  public show = false;
  public allChecked = false;
  private count = 0; // 数据项总数

  @Input() // 特别注意：若首次传入的不是全部数据,后续传入需重新创建数组对象传入
  public dataTree: any[] = []; // 树型数组,any类型如{field1,field2...,children?:any}
  @Input()
  public columns = [
    { field: 'CODE', title: '名称', width: '200px' },
    { field: 'DESCRIPTION', title: '描述', width: '200px' }
  ]; // 显示列
  @Input()
  public width = 400; // 数据显示区宽度设置
  public scroll = { x: 'auto', y: '300px' }; // 数据显示区出滚动条
  @Input() public ngStyle = { width: '265px' }; // 本文框样式（此属性无效）

  @Input()
  public showCheckBox = true; // 是否显示复选框
  @Input()
  public keyField = 'ID'; // dataTree元素的属性key
  @Input()
  public selectionRef: any[] = []; // 选中的节点(用于外层访问)
  public expandDataCache = {}; // 数组dataTree转换的字典对象，dataTree元素的属性key作为字典的key，一个key对应一棵树
  @Input()
  public required = false; // 是否为必选
  // 是否有效
  @Input() public invalid = false;
  @Output() public invalidChange = new EventEmitter();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.dataTree !== undefined && changes.dataTree.previousValue !== undefined) {
    // 数据重新加载前，清除内容和选中项
    // if (this.valueObject !== undefined && this.valueObjectField !== undefined) {
    //   this.valueObject[this.valueObjectField] = '';
    // }
    // this.selectionRef.length = 0;
    this.allChecked = false;

    this.loadExpandDataCache();
    // }
  }

  ngOnInit() {
    this.loadExpandDataCache();
    setTimeout(() => {
      // 是否无效
      if (this.required && (this.selectionRef.length === 0)) {
        this.invalidChange.emit(true);
      }
    }, 100);
  }
  // 增加过滤条件20190924
  public searchText: String;

  isMatchSearch(item: any): boolean {
    if (this.searchText === undefined || this.searchText === null || this.searchText === '') {
      return true;
    } else {
      let result = false;
      this.columns.forEach(el => {
        if (!result)
          result = this.isShow(item, el.field);
      });
      return result;
    }
  }
  isShow(item: any, field: string) {
    if (item[field] !== null && item[field].indexOf(this.searchText) > -1) {
      return true;
    } else {
      if (item.children !== undefined && item.children !== null && item.children.length > 0) {
        let result = false;
        item.children.forEach(el => {
          if (!result)
            result = this.isShow(el, field);
        });
        return result;
      } else {
        return false;
      }
    }
  }

  // 树形节点数组改变重新转换数据字典
  private loadExpandDataCache() {
    // 树形节点数组转换成节点数据字典对象
    this.expandDataCache = {};
    this.dataTree.forEach(item => {
      const array = this.convertTreeToList(item);
      this.expandDataCache[item[this.keyField]] = array;
      this.count += array.length;
      if (this.selectionRef.length > 0) {
        this.expandDataCache[item[this.keyField]].forEach(x => {
          const fi = this.selectionRef.find(s => s[this.keyField] === x[this.keyField]);
          if (fi !== undefined && fi != null) {
            x.checked = true;
          }
        });
      }
    });
    this.allChecked = this.count === this.selectionRef.length && this.count > 0;
    this.setValueObject();
  }
  // 树节点展开/收起：array树节点数组，data当前节点，expand展开(true)或收起(false)
  collapse(array: any[], data: any, expand: boolean): void {
    // 只展开当前节点
    data.expand = expand;
    // 收起所有子节点
    if (expand === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a[this.keyField] === d[this.keyField]);
          // target.expand = false;
          this.collapse(array, target, expand);
        });
      } else {
        return;
      }
    }
  }
  // 树形结构转换为数组
  convertTreeToList(root: any): any[] {
    const stack = [];
    const array = [];
    const hashMap = {};
    let expand = root.expand || false;
    let checked = root.checked || false;
    stack.push({ ...root, level: 0, expand: expand, checked: checked });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          // expand = node.children[i].expand || node.expand;
          expand = node.children[i].expand;
          checked = node.children[i].checked || node.checked;
          stack.push({ ...node.children[i], level: node.level + 1, expand: expand, checked: checked, parent: node });
        }
      }
    }
    return array; // 存储所有父子节点元素
  }
  // 排除keyField重复项
  visitNode(node: any, hashMap: object, array: any[]): void {
    if (!hashMap[node[this.keyField]]) {
      hashMap[node[this.keyField]] = true;
      array.push(node);
    }
  }

  // checkbox勾选：array树节点数组，data当前节点，checked选中(true)或未选中(false)
  public checkChange(array: any[], data: any, checked: boolean, $event?: any) {
    let checkedFlag = checked;
    if ($event !== undefined) { // 点击触发
      checkedFlag = $event.srcElement.checked;
    }
    if (this.isMatchSearch(data)) // 增加过滤条件20190924
      data.checked = checkedFlag;
    if (data.children) {
      data.children.forEach(d => {
        const target = array.find(a => a[this.keyField] === d[this.keyField]);
        // target.checked = checkedFlag;
        this.checkChange(array, target, checkedFlag);
      });
    } else {
      return;
    }
  }
  // 全选
  public allCheckChange($event: any) {
    const checked = $event.srcElement.checked;
    this.allChecked = checked;
    for (const fieldName in this.expandDataCache) {
      this.expandDataCache[fieldName].forEach(element => {
        if (this.isMatchSearch(element)) // 增加过滤条件20190924
          element.checked = checked;
      });
    }
  }
  // 确认选择
  public select() {
    this.selectionRef.length = 0;
    for (const fieldName in this.expandDataCache) {
      this.expandDataCache[fieldName].forEach(element => {
        if (element.checked) {
          this.selectionRef.push(element);
        }
      });
    }
    // 动态查询组件返回值
    this.setValueObject();
    // 关闭树形选择
    this.show = !this.show;
    // 是否无效
    if (this.required && (this.selectionRef.length === 0)) {
      this.invalidChange.emit(true);
    } else {
      this.invalidChange.emit(false);
    }
  }
  // 关闭/打开
  toggle() {
    this.show = !this.show;
  }

  /* 以下用于选中项值返回 */
  @Input()
  public valueField: string; // dataTree元素的属性名（用于取值）
  @Input()
  public valueLevel = 1; // 取值的层级
  public splitChar = ','; // 值之间的分隔符
  @Input()
  public valueObject: any; /* 取值的对象引用,用于值返回*/
  @Input()
  public valueObjectField: string; /* 取值的对象的属性名 */
  // 返回值
  private setValueObject() {
    console.log('setValueObject');
    const field = this.valueField !== undefined ? this.valueField : this.keyField;
    if (this.valueObject !== undefined && this.valueObjectField !== undefined) {
      let value = '';
      console.log(this.selectionRef);
      this.selectionRef.filter(x => x.level === this.valueLevel).forEach(x => { value = value + this.splitChar + x[field]; });
      this.valueObject[this.valueObjectField] = value.substr(1, value.length - 1);
      console.log(this.valueObject[this.valueObjectField]);
    }
  }
}
