import { Component, ViewChild } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { ModalHelper } from '@delon/theme';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { StartupService } from '@core/startup/startup.service';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { GridDataResult, RowArgs } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators/map';
import { MenuService } from '@delon/theme';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  searchToggleStatus: boolean;
  resvisible = false;
  factoryvisible = false;

  public resview: Observable<GridDataResult>;
  public resgridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };
  public resSelection: any[] = [];

  public factoryview: Observable<GridDataResult>;
  public factorygridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };
  public factorySelection: any[] = [];

  constructor(
    public settings: SettingsService,
    private modal: ModalHelper,
    private startupSrv: StartupService,   
    private appConfigService: AppConfigService,  
    private msgSrv: NzMessageService,    
    private menuService: MenuService,
  ) {}

  toggleCollapsedSidebar() {
    this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }
}
