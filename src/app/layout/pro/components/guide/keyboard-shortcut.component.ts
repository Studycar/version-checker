import { Component, OnInit } from "@angular/core";
import { CommonQueryService } from "app/modules/generated_module/services/common-query.service";

@Component({
    selector: 'keyboard-shortcut-lazy',
    template: `
        <nz-table
            #smallTable
            [nzData]="dataSet"
            [nzLoading]="loading"
            [nzScroll]="{ y: '144px' }"
            [nzFrontPagination]="false"
            [nzShowPagination]="false"
            nzSize="small" nzBordered>
            <thead>
                <tr>
                    <th nzColumnKey="lookupCode" [nzWidth]="'100px'">快捷键</th>
                    <th nzColumnKey="meaning">功能</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let d of smallTable.nzData">
                    <td>{{ d.lookupCode }}</td>
                    <td>{{ d.meaning }}</td>
                </tr>
            </tbody>
        </nz-table>
    `,
    styles: [
        `
            
            /* ::ng-deep .ant-table-small > .ant-table-content > .ant-table-body {
                margin: 0;
            }

            .ant-table-small > .ant-table-content .ant-table-header {
                background-color: #f5f7f7;
            }

            ::ng-deep .ant-table-thead {
                background-color: #f5f7f7;
                height: 30px;
            }

            ::ng-deep .ant-table-thead > tr > th {
                font-size: 13px;
                font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                font-variant: tabular-nums;
                color: rgba(0, 0, 0, 0.5);
                font-weight: 600;
            } */
        
        `
    ]
})
export class KeyboardShortcutLazyComponent implements OnInit {

    dataSet: any[] = [];
    loading: boolean = true;
    total: number = 0;
    pageIndex: number = 1;
    pageSize: number = 4;

    ngOnInit(): void {
      this.loadData();
    }

    constructor(
        private commonQuery: CommonQueryService,
    ) {

    }

    pageIndexChange(e) {
        this.pageIndex = e;
    }

    loadData() {
        this.loading = true;
        this.commonQuery.GetLookupByTypeLang('FND_SHORTCUT_KEY', 'zh-CN').subscribe(res => {
            this.loading = false;
            this.dataSet = res.Extra;
            // res.Extra.forEach(d => {
            //     this.dataSet.push({
            //         lookupCode: d.lookupCode,
            //         meaning: d.meaning,
            //     });
            // })
            this.total = this.dataSet.length;
            console.log(this.dataSet);
        })
    }
}