import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { DataExceptionService } from '../dataexception.service';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CommonQueryService } from 'app/modules/generated_module/services/common-query.service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-dataexception-calculate',
  templateUrl: './calculate.component.html',
  providers: [DataExceptionService],
})
export class BaseDataexceptionCalculateComponent implements OnInit {

  public calculateModes: any[] = [
    { value: 'S', label: '计算选中行' },
    { value: 'A', label: '全部计算' }
  ];                                         // 计算模式
  public selectedMode: string;               // 已选择模式 SELECTED / ALL
  public plantCode: string;                  // 工厂
  public record: any = {};                   // 行数据(主网格传递过来)
  plantcodes: any[] = [];

  /**构造函数 */
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private dataExceptionService: DataExceptionService,
    private appTranslationService: AppTranslationService,
    private commonqueryService: CommonQueryService,
    private appconfig: AppConfigService,
  ) { }

  /**页面初始化 */
  ngOnInit(): void {

    this.selectedMode = 'S';
    this.initData();
  }

  initData() {
    this.plantCode = this.appconfig.getPlantCode();
    /** 初始化 组织  下拉框*/
    this.commonqueryService.GetUserPlant('', this.appconfig.getUserId()).subscribe(result => {
      result.Extra.forEach(d => {
        this.plantcodes.push({
          label: d.plantCode,
          value: d.plantCode,
        });
      });
    });
  }

  /**保存 */
  save(saveDto: any) {
    this.record.ids = this.record.ids || [];
    if (this.record.ids.length > 0) {
      saveDto.ids = this.record.ids;
    } else {
      saveDto.ids = [];
    }
    saveDto.mode = this.selectedMode;
    saveDto.plantCode = this.plantCode;

    if (saveDto.mode === 'S' && saveDto.ids.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择至少一条记录！'));
      return;
    }

    this.dataExceptionService.calculate(saveDto).subscribe(result => {
      if (result.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('请求提交成功'));
        this.modal.close(true);
      } else {
        this.msgSrv.error(this.appTranslationService.translate(result.msg));
      }
    });
  }

  /**关闭 */
  close() {
    this.modal.destroy();
  }
}
