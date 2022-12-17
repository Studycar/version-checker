import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { MixedResourceIssuedResourceIssuedEditService } from '../edit.service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mixed-resource-issued-resource-issued-platform-edit-color',
  templateUrl: './edit-color.component.html',
  providers: [MixedResourceIssuedResourceIssuedEditService],
})
export class MixedResourceIssuedResourceIssuedPlatformEditColorComponent implements OnInit {
  applications: any[] = [];

  record: any = {};

  Istrue: boolean;

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public commonQueryService: CommonQueryService,
    public editService: MixedResourceIssuedResourceIssuedEditService
  ) { }

  i = 1;
  editCache = {};

  dataSet = [];

  startEdit(key: string): void {
    this.editCache[key].edit = true;
  }

  cancelEdit(key: string): void {
    this.editCache[key].edit = false;
  }

  saveEdit(key: string): void {
    const index = this.dataSet.findIndex(item => item.key === key);
    this.dataSet[index] = this.editCache[key].data;
    this.editCache[key].edit = false;
  }

  updateEditCache(): void {
    this.dataSet.forEach(item => {
      if (!this.editCache[item.key]) {
        this.editCache[item.key] = {
          edit: false,
          data: item
        };
      }
    });
  }

  ngOnInit(): void {
    // for (let i = 0; i < 100; i++) {
    //   this.dataSet.push({
    //    key    : i.toString(),
    //    name   : 'Edrward ${i}',
    //    age    : 32,
    //   address: '#FFF0F5',
    //  });
    // }
    // this.updateEditCache();
     this.loadItemType();

   

  }


  public loadItemType(): void {
    this.commonQueryService.GetLookupByType('PS_MAKE_ORDER_STATUS').subscribe(result => {
      this.dataSet =   result.Extra;
      
    });
  }


}
