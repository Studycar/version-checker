import { Component, ContentChild, EventEmitter, Input, Output, OnDestroy, Renderer2, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { GridComponent } from '@progress/kendo-angular-grid';
import { AppGridStateService } from '../services/app-gridstate-service';
import { I18NService } from '@core/i18n/i18n.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'grid-context-menu',
    template: `
        <kendo-popup *ngIf="show" [offset]="offset">
            <ul class="menu">
              <li *ngFor="let item of menuItemsM" (click)="menuItemSelected(item)">
                <ng-template *ngIf="menuItemTemplate" [ngTemplateOutlet]="menuItemTemplate"
                    [ngTemplateOutletContext]="{ item: item, dataItem: dataItem }">
                </ng-template>
                <ng-container *ngIf="!menuItemTemplate">
                    {{ item }}
                </ng-container>
              </li>
            </ul>
        </kendo-popup>
    `,
    styles: [`
     .menu {
        list-style:none;
        margin: 0;
        padding: 0;
        cursor: pointer;
      }

      .menu li {
        border-bottom: 1px solid rgba(0,0,0,.08);
        padding: 8px 12px;
        transition: background .2s, color .2s;
      }

      .menu li:last-child {
        border-bottom: 0;
      }

      .menu li:hover {
        background: #e8e8e8;
      }

      .menu li:active {
        background: #ff6358;
        color: #fff;
      }
    `]
})
export class GridContextMenuComponent implements OnDestroy {

    @ContentChild(TemplateRef, {static: true})
    public menuItemTemplate: TemplateRef<any>;

    @Input()
    public menuItems: any[] = [];

    @Output()
    public select: EventEmitter<any> = new EventEmitter<any>();

    @Input() public set for(grid: GridComponent) {
        this.unsubscribe();
        this.cellClickSubscription = grid.cellClick.subscribe(this.onCellClick);
        this.grid = grid;
    }

    public show: boolean;
    public dataItem: any;
    public offset: any;
    public menuItemsM: any[] = [];

    private cellClickSubscription: Subscription;
    private documentClickSubscription: any;
    private save = this.i18NService.fanyi('保存');
    private reset = this.i18NService.fanyi('重置');
    private grid: GridComponent;

    constructor(private renderer: Renderer2,
      private i18NService: I18NService,
      private appGridStateService: AppGridStateService) {
        this.onCellClick = this.onCellClick.bind(this);
        this.documentClickSubscription = this.renderer.listen('document', 'click', () => {
            this.show = false;
        });

    }

    public ngOnDestroy(): void {
        this.unsubscribe();
        this.documentClickSubscription();
    }

    public menuItemSelected(item: any): void {
      if (item === this.save) {
        // this.appGridStateService.save(this.grid);
      } else if (item === this.reset) {
        // this.appGridStateService.reset(this.grid);
      }
        this.select.emit({ item: item, dataItem: this.dataItem });
    }

    private onCellClick({ dataItem, type, originalEvent }): void {
      if (type === 'contextmenu') {
        originalEvent.preventDefault();
        this.menuItemsM = [this.save, this.reset , ...this.menuItems];
        this.dataItem = dataItem;
        this.show = true;
        this.offset = { left: originalEvent.pageX, top: originalEvent.pageY };
      }
    }

    private unsubscribe(): void {
        if (this.cellClickSubscription) {
            this.cellClickSubscription.unsubscribe();
            this.cellClickSubscription = null;
        }
    }

}
