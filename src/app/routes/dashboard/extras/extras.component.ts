import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-extras',
  template: `
  <iframe
   name="mainFrame"
   src="http://10.16.40.172:8010/code"
   frameborder="0"
   scrolling="no"
   width="100%"
   height=800
   id="mainFrame">
  </iframe>
  `,
})
export class ExtrasComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    // // 得到父页面的iframe框架的对象
    // const obj = parent.document.getElementById('mainFrame');
    // // 把当前页面内容的高度动态赋给iframe框架的高
    // obj.h = this.document.body.scrollHeight;
  }
}
