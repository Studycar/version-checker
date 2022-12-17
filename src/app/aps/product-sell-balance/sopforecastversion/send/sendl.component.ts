import { Component, Injector, OnInit } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';
import { CustomBaseContext } from 'app/modules/base_module/components/custom-base-context.component';
import { VersionQueryService } from '../queryService';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'product-sell-balance-sopforecastversion-send',
  templateUrl: './send.component.html',
  providers: [VersionQueryService],
})
export class ProductSellBalanceSopForecastVersionSendComponent extends CustomBaseContext implements OnInit {
  i: any;
  gridHeight = 200;
  columns = [
    {
      colId: 1, cellClass: '', field: '', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      }
    },
    { field: 'businessUnitCode', headerName: '事业部' },
    { field: 'plantCode', headerName: '工厂' },
    { field: 'number', headerName: '周期', editable: true, cellEditor: 'agTextCellEditor' },
  ];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    private confirmationService: NzModalService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private queryService: VersionQueryService,
    private appConfigService: AppConfigService,
    private injector: Injector) {
    super({ pro: null, appTranslationSrv: appTranslationService, msgSrv: msgSrv, appConfigSrv: appConfigService, injector });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.queryService.GetVersionPlant(this.i.versionCode, this.i.businessUnitCode).subscribe(res => {
      console.log(res);
      const data = [];
      res.data.forEach(el => {
        data.push({ plantCode: el, number: '' });
      });
      this.gridData = data;
    });
  }

  // 下达
  save() {
    if (this.selectionKeys.length < 1) {
      this.msgSrv.warning(this.appTranslationService.translate('请先选择要下达的记录！'));
      return;
    }
    let invalid = false;
    this.gridApi.getSelectedRows().forEach(el => {
      if (this.isNull(el.number)) {
        invalid = true;
        return;
      }
    });

    if (invalid) {
      this.msgSrv.warning(this.appTranslationService.translate('选中记录的【周期】不能为空！'));
      return;
    }

    // 弹出确认框
    this.confirmationService.confirm({
      nzContent: this.appTranslationService.translate('确定要提交下达吗？'),
      nzOnOk: () => {
        const dtos = [];
        this.gridApi.getSelectedRows().forEach(el => {
          dtos.push({
            plantCode: el.plantCode,
            number: Number(el.number),
            businessUnitCode: this.i.businessUnitCode,
            versionCode: this.i.versionCode,
            demandPeriod: this.i.demandPeriod,
          });
        });

        let numberError = false;
        dtos.forEach(el => {
          if (el.number <= 0) {
            numberError = true;
            return;
          }
        });
        if (numberError) {
          this.msgSrv.error(this.appTranslationService.translate('周期数必须大于0'));
        }


        this.queryService.Send(dtos).subscribe(res => {
          if (res.code === 200) {
            this.msgSrv.success(this.appTranslationService.translate('下达成功'));
          } else {
            this.msgSrv.error(this.appTranslationService.translate(res.msg));
          }
        });
      },
    });
  }

  // 行选中改变
  onSelectionChanged(event) {
    this.getGridSelectionKeys(this.selectBy);
  }

  close() {
    this.modal.destroy();
  }
}
