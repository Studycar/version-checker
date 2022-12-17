import { Component } from "@angular/core";

@Component({
  selector: 'flow-page',
  templateUrl: './flow-page.component.html',
  styleUrls: ['./flow-page.component.css'],
})
export class IdeFlowPageComponent {
  currentPage = 1
  totalPage = 2

  next() {
    this.currentPage += 1
  }

  prev() {
    this.currentPage -= 1
  }
}
