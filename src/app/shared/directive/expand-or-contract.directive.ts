import { AfterViewInit, Directive, OnDestroy } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';

@Directive({
  selector: '[expandOrContract]',
  exportAs: 'expandOrContract',
})
export class ExpandOrContractDirective implements AfterViewInit, OnDestroy {
  subscription;
  node;

  constructor(private agGrid: AgGridAngular) {
  }

  ngAfterViewInit(): void {
    this.subscription = this.agGrid.rowClicked.subscribe(data => {
      this.node = data.node;
    });
  }

  toggleExpand(): void {
    const expanded = this.node.expanded;
    this.node.allLeafChildren.forEach(node => node.setExpanded(!expanded));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
