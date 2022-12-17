import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Item } from '@progress/kendo-angular-grid/dist/es2015/data/data.iterators';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { BrandService } from 'app/layout/pro/pro.service';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'shop-scheduling',
    templateUrl: './shop-scheduling.coponents.html',
    providers: [QueryService]
})

export class ShopScheduling extends CustomBaseContext implements OnInit {
    @Input() public item;
    
    loadingStyle = { 'display': 'block' };
    loadingHideStyle = { 'display': 'none' };
    hisDataModif: any[] = []; // 需要展示的修改历史数据
    hisDataRelease : any[] = []; // 需要展示调产发布的历史数据
    hisDataBom : any[] = []; // 需要展示bom的历史数据

    hasLoadData = false;
    i: any;

    constructor(
        public pro: BrandService,
        private appTranslationService: AppTranslationService,
        private appConfigService: AppConfigService,
        private msgSrv: NzMessageService,
        public http: _HttpClient,
        private apiService: QueryService
    ) {
        super({ pro: pro, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService });
    }

    ngOnInit(): void {
        this.query();
    }
    public query() {
        console.log(this.item);
        this.apiService.readhistory({
            reqNumber: this.item.reqNumber,
            reqLineNum: this.item.reqLineNum
        })
            .subscribe(res => {
                console.log(res);
                this.hisDataModif = res.MO1 || [];
                this.hisDataRelease = res.MO2 || [];
                this.hisDataBom = res.MO3 || [];
                this.hasLoadData = true;
            });
        this.queryCommon();
    }

    public columns = [
        { field: 'makeOrderNum', headerName: '工单号', menuTabs: ['filterMenuTab'] },
        { field: 'scheduleGroupCode', headerName: '计划组', menuTabs: ['filterMenuTab'] },
        { field: 'resourceCode', headerName: '资源', menuTabs: ['filterMenuTab']},
        { field: 'itemCode', headerName: '物料', menuTabs: ['filterMenuTab']},
        { field: 'descriptionsCn', headerName: '物料描述', menuTabs: ['filterMenuTab']},
        { field: 'demandDate', headerName: '需求时间', menuTabs: ['filterMenuTab']},
        { field: 'fpsTime', headerName: '开始时间', menuTabs: ['filterMenuTab']},
        { field: 'fpcTime', headerName: '结束时间', menuTabs: ['filterMenuTab'] },
        { field: 'completeNum', headerName: '已完成数量', menuTabs: ['filterMenuTab']},
        { field: 'makeOrderStatus', headerName: '工单状态',menuTabs: ['filterMenuTab'] },
        { field: 'backlogFlag',headerName: '尾数标识', menuTabs: ['filterMenuTab'] },
        { field: 'publishTime', headerName: '发布时间', menuTabs: ['filterMenuTab'] }
      ];
      public GetqueryParams() {
          return {
            strPlantCode: this.item.plantCode,
            strProjectNumber: this.item.projectNumber,
            // strProjectNumber: 'mo-19103104.1',
          }
      }
      private queryCommon() {
        this.apiService.GetReceiveRptData(this.GetqueryParams()).subscribe(result => {
            this.gridData = result.data || [];
        });
      }
}