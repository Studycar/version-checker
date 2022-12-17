import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import G6Editor from '@antv/g6-editor';

export abstract class EditorFlowComponent implements AfterViewInit {
  editor: G6Editor;
  splitSize = {};
  width = 0;
  height = 0;
  inputingLabel = '';
  inputingOther = '';
  isShowGrid = true;
  curZoom = 100; // 当前缩放比率
  minZoom = 50; // 最小缩放比率
  maxZoom = 200; // 最大缩放比率

  marks: any = {
    50  : '50%',
    100 : '100%',
    200 : '200%'
  };
  /** 选中元素 */
  afterItemSelected = new EventEmitter<any>();
  ngAfterViewInit(): void {
    const height = window.innerHeight - 100;
    console.log(height);
    const editor = new G6Editor();
    this.editor = editor;
    const minimap = new G6Editor.Minimap({
      container: 'minimap',
      width: 200,
      height: 130,
    });
    const toolbar = new G6Editor.Toolbar({
      container: 'toolbar',
    });
    const contextmenu = new G6Editor.Contextmenu({
      container: 'contextmenu',
    });
    const itempannel = new G6Editor.Itempannel({
      container: 'itempannel',
    });
    const detailpannel = new G6Editor.Detailpannel({
      container: 'detailpannel',
    });
    const page = new G6Editor.Flow({
      graph: {
        container: 'page',
        height,
      },
      align: {
        grid: true,
      },
    });
    editor.add(minimap);
    editor.add(toolbar);
    editor.add(contextmenu);
    editor.add(itempannel);
    editor.add(detailpannel);
    editor.add(page);
    page.showGrid();

    const pages = editor.getComponentsByType('page');
    pages.forEach(p => {
      p.on('afteritemselected', ev => {
        const model = ev.item.getModel();
        this.afterItemSelected.emit(model);
        this.initData(model);
      });
      p.on('afterzoom', ev => {
        this.curZoom = ev.updateMatrix[0] * 100;
      });
    });
  }

  initData(model) {
    const splitSize = model.size ? model.size.split('*') : '';
    if (splitSize) {
      this.width = splitSize[0];
      this.height = splitSize[1];
    }
    // this.inputingLabel = model.label;
    if (!model.type) {
      this.inputingLabel = model.label ? model.label.split('/')[0] : '';
      this.inputingOther = model.label ? model.label.split('/')[1] : '';
    } else {
      this.inputingLabel = model.label;
    }
  }

  changeZoom(zoom) {
    const editor = this.editor;
    const page = editor.getCurrentPage();
    console.log(zoom);
    page.zoom(zoom / 100);
  }
  toggleGrid(value) {
    const editor = this.editor;
    const page = editor.getCurrentPage();
    if (value) {
      page.showGrid();
    } else {
      page.hideGrid();
    }
  }
  updateGraph(key, value) {
    const editor = this.editor;
    editor.executeCommand(() => {
      const page = editor.getCurrentPage();
      const selectedItems = page.getSelected();
      selectedItems.forEach(item => {
        const updateModel = {};
        updateModel[key] = value;
        page.update(item, updateModel);
      });
    });
  }
  changeWidth(value) {
    const newSize = value + '*' + this.height;
    this.updateGraph('size', newSize);
  }
  changeHeight(value) {
    const newSize = this.width + '*' + value;
    this.updateGraph('size', newSize);
  }
  changeLabel(value) {
    console.log(value);
    this.updateGraph('label', value);
  }
}
