import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  template: `
  <iframe
   name="mainFrame"
   src="http://10.16.40.172:8001/assets/editor/base.html"
   frameborder="0"
   scrolling="no"
   width="100%"
   height=800
   id="mainFrame">
  </iframe>
  `,
})
export class EditorComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    // // 得到父页面的iframe框架的对象
    // const obj = parent.document.getElementById('mainFrame');
    // // 把当前页面内容的高度动态赋给iframe框架的高
    // obj.h = this.document.body.scrollHeight;
  }
}
