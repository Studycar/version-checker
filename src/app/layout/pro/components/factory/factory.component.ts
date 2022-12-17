import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService, _HttpClient } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { StartupService } from '@core/startup/startup.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { PlantMaintainService } from 'app/modules/generated_module/services/plantmaintain-service';
import { BaseUserMessageService } from 'app/modules/generated_module/services/base-user-message-service.component';
import { LayoutProWidgetUserComponent } from '../user/user.component';

@Component({
  selector: 'layout-pro-factory',
  template: `
    <div class="alain-pro__header-item" nz-dropdown [nzDropdownMenu]="menu">
      <i nz-icon nzType="share-alt" nzTheme="outline"></i>
    </div>
    <nz-dropdown-menu nzPlacement="bottomRight" #menu="nzDropdownMenu">
      <ul nz-menu nzSelectable style="max-height:400px;overflow:auto;">
        <li
          nz-menu-item
          *ngFor="let factory of factories"
          (click)="change(factory.PLANT_CODE)"
          [class.ant-dropdown-menu-item-selected]="factory.PLANT_CODE === appConfigService.getPlantCode()"
        >
          {{ factory.DESCRIPTIONS }}
        </li>
      </ul>
    </nz-dropdown-menu>
  `,
})
export class LayoutProFactoryComponent implements OnInit {
  factories: any[] = [];

  constructor(
    public settings: SettingsService,
    private router: Router,
    private startupSrv: StartupService,
    private appConfigService: AppConfigService,
    private plantMaintainService: PlantMaintainService,
    private baseUserMessageService: BaseUserMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {}

  ngOnInit(): void {
    this.startupSrv.getDataUserFactory().then(res => {
      if (res && res.data.length > 0) {
        res.data.forEach(d => {
          this.factories.push({
            DESCRIPTIONS:
              d.plantCode + (d.descriptions ? '_' + d.descriptions : ''),
            PLANT_CODE: d.plantCode,
          });
        });
      }
    });
  }

  change(plantcode: string) {
    const plantIndex = this.factories.findIndex(d => d.PLANT_CODE === plantcode);
    const plant = {
      plantCode: this.factories[plantIndex].PLANT_CODE,
      descriptions: this.factories[plantIndex].DESCRIPTIONS.split('_')[1],
    }
    this.appConfigService.setActivePlantCode(plant);
    // create by jianl 修改用户的默认工厂
    this.baseUserMessageService
      .saveUser({
        id: this.appConfigService.getUserId(),
        defaultPlantCode: plantcode,
      })
      .subscribe();
    /**jianl更新，先获取了默认区域再刷新页面 */
    this.plantMaintainService
      .Query({ plantCode: plantcode })
      .subscribe(res => {
        if (res && res.code === 200) {
          this.appConfigService.setActiveScheduleRegionCode(
            res.data.scheduleRegionCode,
          );
        }
        // 刷新菜单
        this.startupSrv.refreshTopic(1, null);
      });
  }
}
