import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-concurrent-program-upload',
  templateUrl: './concurrent-program-upload.component.html',
  styles: [
    `
  :host ::ng-deep nz-upload { display: block; }
  :host ::ng-deep .ant-upload.ant-upload-drag { height: 180px; }
  `
  ]
})
export class ConcurrentRequestConcurrentProgramUploadComponent implements OnInit {
  handleChange({ file, fileList }): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
  }

  beforeUpload = (file: File) => {
    const isDll = file.type === 'application/x-msdownload';
    if (!isDll) {
      this.msg.error('You can only upload Dll file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.msg.error('Image must smaller than 2MB!');
    }
    return isDll && isLt2M;
  }

  defaultFileList = [
    {
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
    {
      uid: -2,
      name: 'yyy.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    }
  ];

  fileList1 = [...this.defaultFileList];
  fileList2 = [...this.defaultFileList];

  constructor(private http: _HttpClient, private msg: NzMessageService, public element: ElementRef) { }

  ngOnInit() { }

  add() {
    // tslint:disable-next-line:no-unused-expression
    // window.frames['myIframe'].document.getElementById('');
  }

}
