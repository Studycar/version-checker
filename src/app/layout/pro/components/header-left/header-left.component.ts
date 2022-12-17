import { Component } from '@angular/core';

@Component({
  selector: 'header-left',
  templateUrl: './header-left.component.html',
  styleUrls: ['./header-left.component.less'],
  host: {
    '[class.customer_header_left]': 'true',
  },
})
export class HeaderLeftComponent {

}
