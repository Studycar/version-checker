import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { map } from 'rxjs/operators';
import { State, process } from '@progress/kendo-data-query';
import { DataExceptionService } from '../dataexception.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from 'app/modules/base_module/components/custom-excel-export.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-dataexception-view',
  templateUrl: './view.component.html',
  providers: [DataExceptionService],
})
export class BaseDataexceptionViewComponent extends CustomBaseContext
  implements OnInit {
  public context = this; // 上下文
  public record: any = {}; // 行数据(主网格传递过来)

  /**主网格栏位和导出excel文件中的栏位定义*/
  public columns: any[] = [
    {
      field: 'loading',
      headerName: 'loading',
    },
  ];

  /**构造函数 */
  constructor(
    private modal: NzModalRef,
    private http: _HttpClient,
    private msgSrv: NzMessageService,
    public dataExceptionService: DataExceptionService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private appConfigService: AppConfigService,
    private appConfig: AppConfigService,
  ) {
    super({
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: appConfigService,
    });
    this.gridHeight = 262;
    this.gridData = [];
  }

  /**页面初始化 */
  ngOnInit(): void {
    try {
      this.dataExceptionService
        .querySingle(this.record.id)
        .subscribe(result => {
          if (result.code==200) {
            this.record.applicationCode = result.data.applicationDesc;
            this.record.exceptionType = result.data.exceptionType;
          }
        });
      this.query();
    } catch (error) {
      this.msgSrv.error('页面初始化异常！' + error);
    }
  }

  /**主网格数据状态变更事件 */
  public dataStateChange(state: State) {
    this.gridState = state;
    this.dataExceptionService.updateDetailGridData([]);
    // this.dataExceptionService.read(this.dataExceptionService.readDetailAction);
  }

  /**查询 */
  public query() {
    const that = this;
    const columns1: any[] = [];
    super.query(); // grid初始化
    this.setLoading(true);
    const httpAction = {
      url: this.dataExceptionService.queryDetailUrl,
      method: 'POST',
    };
    const queryParams = {
      id: this.record.id,
      plantCode: this.appConfig.getPlantCode(),
    };
    this.dataExceptionService.loadGridViewNew(
      httpAction,
      queryParams,
      this.context,
      result => {
        if (
          result !== null &&
          result.extra !== null &&
          result.extra.length > 0
        ) {
          result.extra.forEach(x => {
            // 设置动态列
            columns1.push({ field: x, headerName: x });
          });
          that.columns = columns1;
          return result;
        }
      },
    );
    // this.dataExceptionService.queryDetail(this.record.ID).subscribe(result => {

    //   if (result !== null &&
    //     result.Extra !== null &&
    //     result.Extra.length > 0) {

    //     result.Extra.forEach(x => { // 设置动态列
    //       columns1.push({ field: x, headerName: x });
    //     });

    //     this.gridData = result.Result;

    //     // if (result !== null &&
    //     //   result.Result !== null &&
    //     //   result.Result.length > 0) { // 更新网格数据
    //     //   this.dataExceptionService.updateDetailGridData(result.Result);
    //     // }
    //   }
    //   this.setLoading(false);
    //   that.columns = columns1;
    // });
  }

  /**导出网格数据控制 */
  expData: any[] = [];
  expColumns = this.columns;
  hiddenColumns: any[] = [];
  expColumnsOptions: any[] = [
    // { field: 'APPLICATION_CODE', options: this.applicationCodeOptions }
  ];
  @ViewChild('excelexport', { static: true })
  excelexport: CustomExcelExportComponent;
  public export() {
    this.dataExceptionService.exportAction(
      this.dataExceptionService.readDetailAction,
      { id: this.record.id,
        plantCode: this.appConfig.getPlantCode() },
      this.excelexport,
      this.context,
      this.dataPreFilter
    );
  }
  dataPreFilter = (res) => {
    this.expColumns = res.extra.map(d => {
      return {
        field: d,
        headerName: d
      }
    })
    return res.data;
  }

  /**关闭 */
  close() {
    this.modal.destroy();
  }

  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    console.log('BaseDataexceptionViewComponent.onPageChanged');
    this.gridApi.paginationSetPageSize(pageSize);
    this.gridApi.paginationGoToPage(pageNo - 1);
    this.setLoading(false);
  }
}
