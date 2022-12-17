/*
 * 导入导出的公共服务
 * create by jianl
 */
import { Injectable, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { CustomFileExportMsgComponent } from 'app/modules/base_module/components/custom-file-export-msg.component';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { Observable } from 'rxjs';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { url } from 'inspector';
import { ImportsModalComponent } from 'app/modules/base_module/components/imports-modal/imports-modal.component';

/*
 */
@Injectable()
export class ExportImportService {
  constructor(
    public _http: _HttpClient,
    public msgSrv: NzMessageService,
    private modal: ModalHelper,
  ) {}

  /**操作code的缓存 */
  _exportOpCodeCache = new Map();

  /**操作code的缓存 */
  _importOpCodeCache = new Map();

  /**为了兼容老方法而写的方法；导出并自动弹出下载框*/
  exportCompatibilityWithAutoDownload(
    dataGetter: {
      url: string;
      method: string;
      rspDataType?: 'ActionResponseDto' | 'GridSearchResponseDto';
    },
    queryValues: any,
    expColumns: any[],
    exportDataProviderKey: string = '',
    context: CustomBaseContext = null,
    outputFileName: string = null,
  ) {
    /**临时解决这个loading的问题，建议全局增加loading效果 */
    if (context) {
      context.setLoading(true);
    }

    this.exportCompatibility(
      dataGetter,
      queryValues,
      expColumns,
      exportDataProviderKey,
    ).subscribe(res => {
      console.log(res);
      if (context) {
        context.setLoading(false);
      }
      if (res.Success && res.Extra) {
        this.modal
          .static(
            CustomFileExportMsgComponent,
            {
              filePath: res.Extra,
              outputFileName: outputFileName,
              autoGetFileNameByPath: false,
            },
            'md',
          )
          .subscribe(res => {
            if (res) {
            }
          });
      }
    });
  }

  /**
   * 为了兼容老方法而写的方法；导出并自动弹出下载框
   * @param dataGetter 数据获取的url连接（迎合以前做的方案）
   * @param queryValues 查询参数
   * @param expColumns 导出列
   * @param exportDataProviderKey 导出数据提供程序的key（这个是实现导出接口的那个key，如果不走实现接口的方案，参数为空）
   * @param context 当前组件上下文对象
   * @param outputFileName 总花费时间（大概预估一下传入，方便模拟进度条，处理速度大概是1s一万条数据）
   */
  exportCompatibilityWithProgress(
    dataGetter: {
      url: string;
      method: string;
      rspDataType?: 'ActionResponseDto' | 'GridSearchResponseDto';
    },
    queryValues: any,
    expColumns: any[],
    exportDataProviderKey: string = '',
    context: CustomBaseContext = null,
    outputFileName: string = null,
  ) {
    /**临时解决这个loading的问题，建议全局增加loading效果 */
    if (context) {
      context.setLoading(true);
    }
    const key = JSON.stringify({
      url: dataGetter.url,
      method: dataGetter.method,
      queryValues: queryValues,
      exportDataProviderKey: exportDataProviderKey,
    });
    const opCode = this._exportOpCodeCache.get(key);
    if (opCode) {
      /**弹出进度条框 */
      this.modal
        .static(
          CustomFileExportMsgComponent,
          {
            showProgress: true,
            progressOpCode: opCode,
            outputFileName: outputFileName,
            autoGetFileNameByPath: false,
          },
          'md',
        )
        .subscribe(res => {
          if (context) {
            context.setLoading(false);
          }
          if (res) {
            this._exportOpCodeCache.delete(key);
          }
        });
    } else {
      // 开始执行下载
      this.exportCompatibility(
        dataGetter,
        queryValues,
        expColumns,
        exportDataProviderKey,
        true,
      ).subscribe(res => {
        this._exportOpCodeCache.set(key, res.Extra);
        if (context) {
          context.setLoading(false);
        }
        if (res.Success && res.Extra) {
          /**弹出进度条框 */
          this.modal
            .static(
              CustomFileExportMsgComponent,
              {
                showProgress: true,
                progressOpCode: res.Extra,
                outputFileName: outputFileName,
                autoGetFileNameByPath: false,
              },
              'md',
            )
            .subscribe(res => {
              if (res) {
                this._exportOpCodeCache.delete(key);
              }
            });
        }
      });
    }
  }

  /**导出 */
  exportCompatibility(
    dataGetter: {
      url: string;
      method: string;
      rspDataType?: 'ActionResponseDto' | 'GridSearchResponseDto';
    },
    queryValues: any,
    expColumns: any[],
    exportDataProviderKey: string = '',
    withProgress = false,
  ): Observable<ActionResponseDto> {
    const exportUrl = withProgress
      ? '/api/admin/baseexportimport/exportcompatibilitywithprogress'
      : '/api/admin/baseexportimport/exportcompatibility';
    console.log('queryValues');
    console.log(queryValues);
    const queryValueStr = queryValues ? JSON.stringify(queryValues) : '';
    return this._http.post(exportUrl, {
      DataGetter: dataGetter,
      QueryValues: queryValueStr,
      ExportColumns: expColumns,
      ExportDataProviderKey: exportDataProviderKey,
    });
  }

  import(
    importConfigCode: string,
    callBack: (impResult: Boolean) => void = null,
  ) {
    const key = importConfigCode;
    const opCode = this._exportOpCodeCache.get(key);
    this.modal
      .static(
        ImportsModalComponent,
        {
          i: {},
          importConfigCode: importConfigCode,
          opCode: opCode,
        },
        'md',
      )
      .subscribe(res => {
        if (res) {
          this._exportOpCodeCache.delete(key);
        }
        if (callBack != null) {
          callBack(res);
        }
      });
  }

  /**导出并且自动弹出下载的窗口 */
  exportWithAutoDownload() {}
}
