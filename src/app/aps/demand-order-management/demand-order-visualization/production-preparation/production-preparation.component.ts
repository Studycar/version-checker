import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
import { EChartOption } from 'echarts';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BrandService } from 'app/layout/pro/pro.service';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'production-preparation',
    templateUrl: './production-preparation.component.html',
    providers: [QueryService]
})

export class ProductionPreparation extends CustomBaseContext implements OnInit {
    @Input() public item;
    @Input() public chartData;
    @Input() public propsData;

    maxDate: any;
    gridData1: any;
    pieData: any[] = [];
    
    standardKitStatus: String = '';
    standardKitCount: String = '';

    constructor(
        private appTrans: AppTranslationService,
        public pro: BrandService,
        private apiService: QueryService
    ) {
        super({ pro: pro, appTranslationSrv: appTrans });
    }
    chartOption: EChartOption;

    ngOnInit(): void {
        this.query();
        this.getPieData();
        this.queryMoKitStatus();
    }
    public queryMoKitStatus() {
      this.apiService.queryMoKitStatus({
        pageIndex: 1,
        pageSize: 100,
        plantCode: this.item.plantCode,
        makeOrderNum: this.item.moNumber,
      }).subscribe(res => {
        if(res.data.content.length) {
          this.standardKitStatus = res.data.content[0].standardKitStatus
          this.standardKitCount = res.data.content[0].standardKitCount
        }
      })
    }

    public getPieData() {
      if(this.chartData.length) this.chartOption = this.pieChart(this.chartData);
    }
    public query() {
        this.apiService.getDetail({
            // moNumber: 'MO-S0416020016',
            moNumber: this.item.moNumber ? this.item.moNumber : '-999',
            export: true
        }).subscribe(res => {
            this.gridData = res.data.content;
            if(this.gridData.length > 1) {
                let [...arr] = this.gridData;
                arr.sort(this.sortDate('needByDate', false));
                this.maxDate = arr[0].needByDate
            } else if(this.gridData.length == 1) {
                this.maxDate = this.gridData[0].needByDate
            }
        });

        this.gridData1 = this.propsData.content || []
        console.log(this.gridData1)
    }

    public sortDate(property, bol) { 
        //property是你需要排序传入的key,bol为true时是升序，false为降序
        return function(a, b) {
            var value1 = a[property];
            var value2 = b[property];
            if (bol) {
                // 升序
                return Date.parse(value1) - Date.parse(value2);
            } else {
                // 降序
                return Date.parse(value2) - Date.parse(value1)
            }

        }
    }

    public columns = [
        { field: 'notifyNumber', headerName: '送货通知' },
        { field: 'itemCode', headerName: '物料编码' },
        { field: 'vendorShortName', headerName: '供应商' },
        { field: 'quantity', headerName: '送货通知数量' },
        { field: 'onWayQuantity', headerName: '在途量' },
        { field: 'needByDate', headerName: '到货日期' },
        { field: 'statusDesc', headerName: '状态' },
    ];

    public columns1 = [
        { field: 'componentItemCode', headerName: '组件物料编码' },
        { field: 'componentDescriptions', headerName: '物料描述' },
        { field: 'demandQuantity', headerName: '需求数量' },
        { field: 'issuedQuantity', headerName: '已发料量' },
        { field: 'existingQty', headerName: '现有量' },
        { field: 'wayQty', headerName: '在途量' },
        { field: 'standardKitShitqty', headerName: '标准齐套缺料个数' }
    ];
    setPieData(item) {
        let self = this;
        this.pieData.push({ value: item.rate , name: `${self.appTrans.translate(item.statusDesc)} ${parseFloat(item.rate)*100}% ${item.countNum}` });
    }

    pieChart(data) {
        let self = this;
        let pieColor = [];
        data.forEach(item => {
            switch(item.status) {
                case 'UNCONFIRM':
                    // 未确认
                    pieColor.push('#999999');
                    self.setPieData(item);
                    break;
                case 'CANCEL':
                    // 取消
                    pieColor.push('#FF0000');
                    self.setPieData(item);
                    break;
                case 'CLOSED':
                    // 关闭
                    pieColor.push('#f4cd49');
                    self.setPieData(item);
                    break;
                case 'COMPLETED':
                    // 完成
                    pieColor.push('#5ebe67');
                    self.setPieData(item);
                    break;
                case 'CONFIRM':
                    // 已确认
                    pieColor.push('#55bfc0');
                    self.setPieData(item);
                    break;
                case 'MATCHED':
                    // 已匹配
                    pieColor.push('#00FF00');
                    self.setPieData(item);
                    break;
                case 'NEW':
                    // 已创建
                    pieColor.push('#FF8C00');
                    self.setPieData(item);
                    break;
                default:
                    // 拒绝
                    pieColor.push('#f47920');
                    self.setPieData(item);
                    break;
            }
        })
        console.log(pieColor)
        let chartOptionData = {
            title: {
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            color: pieColor,
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: function (params, ticket) {
                            console.log(params);
                            return `<span style="width:10px;height:10px;background: ${params.color}; border-radius: 50%; display: inline-block; margin-right: 5px;"></span>${params.name.split(" ")[0]} ${params.name.split(" ")[1]}`;
                        }
                    },
                    data: this.pieData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        return chartOptionData;
    }
}