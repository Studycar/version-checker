import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { StartupService } from "@core/startup/startup.service";
import { ReuseTabService } from "@delon/abc";
import { DA_SERVICE_TOKEN, ITokenService } from "@delon/auth";
import { SettingsService } from "@delon/theme";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { NzMessageService } from "ng-zorro-antd";

@Component({
    selector: 'layout-pro-guide',
    templateUrl: './guide.component.html',
    styles: [
        `
            img {
                width: 100%;
                height: 90%;
            }
        `
    ]
})
export class LayoutProGuideComponent implements OnInit {

    constructor(
        public settings: SettingsService,
        private router: Router,
        private startupSrv: StartupService,
        private appConfigService: AppConfigService,
        public msgSrv: NzMessageService,
        private reuseTabService: ReuseTabService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    ) {}
  
    ngOnInit(): void {
    }

  }  