import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

@Component({
  selector: 'img-viewer',
  templateUrl: './img-viewer.component.html',
  styles: [
    `
      ::ng-deep .ant-modal-body {
        padding: 0px !important;
      }
      .modal-header {
        margin: 0px !important;
      }
    `
  ]
})
export class ImageViewerComponent implements OnInit {
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private appConfigService: AppConfigService,
  ) {

  }

  fileUrl: string = '';
  fileName: string = '';
  imageWidth;

  // 初始化
  ngOnInit(): void {
    this.imageWidth = window.screen.width - 20;
  }



}