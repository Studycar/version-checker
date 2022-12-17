import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { AppTranslationService } from '../services/app-translation-service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';

@Injectable({
  providedIn: 'root',
})
export class FileDownloadUploadService {
  fileDownloadBasicUrl =
    'api/admin/basefiledownloadupload/downloadfile?filePath={0}&outputFileName={1}&autoGetFileNameByPath={2}';
  constructor(
    public http: _HttpClient,
    private msgSrv: NzMessageService,
    private appTransSrv: AppTranslationService,
    private httpSrv: _HttpClient,
  ) {}

  /**
   * 根据文件的path，获取下载的url
   */
  getFileDownloadUrl({
    FilePath = '',
    OutputFileName = '',
    AutoGetFileNameByPath = true,
  }) {
    let path = this.fileDownloadBasicUrl;
    const values = [FilePath, OutputFileName, AutoGetFileNameByPath];
    for (let i = 0; i < values.length; i++) {
      path = path.replace(
        new RegExp('\\{' + i + '\\}', 'g'),
        values[i] ? values[i].toString() : '',
      );
    }
    return path;
  }

  /**
   * 根据文件url下载文件
   */
  download({
    FilePath = '',
    OutputFileName = '',
    AutoGetFileNameByPath = true,
  }) {
    if (FilePath) {
      // window.location.href = this.getFileDownloadUrl({
      //   FilePath,
      //   OutputFileName,
      //   AutoGetFileNameByPath,
      // });
      window.location.href = FilePath;
    } else {
      this.msgSrv.error(
        this.appTransSrv.translate('文件下载失败，文件路径不能为空！'),
      );
    }
  }
}
