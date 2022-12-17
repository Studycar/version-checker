import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { RequestGroupsService } from '../../../../modules/generated_module/services/request-groups-service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'concurrent-request-request-groups-view',
  templateUrl: './view.component.html',
})
export class ConcurrentRequestRequestGroupsViewComponent implements OnInit, AfterViewInit {
  unitName: any[] = [];
  unitType: any[] = [];
  unitAll: any[] = [];
  i: any;
  Param: any;
  @ViewChild('sf', { static: false, read: SFComponent }) sf: SFComponent;
  schema: SFSchema = {
    properties: {
      requestUnitType: {
        type: 'string', title: '类型', ui: {
          widget: 'select',
          change: (value: any) => this.unitTypeChange(value),
          enum: []
        }
      },
      requestUnitId: {
        type: 'string', title: '名称', ui: {
          widget: 'select'
        },
        enum: []
      }
    },
    required: ['requestUnitType', 'requestUnitId'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    }
  };

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private requestGroupsService: RequestGroupsService,
    private commonQueryService: CommonQueryService
  ) { }

  ngOnInit(): void {
    this.i = this.Param.obj;

    this.requestGroupsService.queryLookUpDataDetail().subscribe(result => {
      result.data.forEach(d => {
        this.unitAll.push({
          label: d.applicationName,
          value: d.requestUnitId,
          type: d.requestUnitType
        });
      });
    });
  }
  ngAfterViewInit() {
    this.commonQueryService.GetLookupByType('FND_CONC_REQUEST_GROUP_TYPE').subscribe(result => {
      result.Extra.forEach(d => {
        this.unitType.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });

      this.schema.properties.requestUnitType.enum = this.unitType;
      this.sf.refreshSchema();
    });
  }

  save(value: any) {
    value.requestGroupId = this.i.requestGroupId;
    this.requestGroupsService.insertBaseRequestGroupUnits(value).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(res.msg);
        this.Param.IsRefresh = true;
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.msg);
      }
    });
  }

  unitTypeChange(value: any) {
    this.unitName.splice(0, this.unitName.length);
    console.log(this.unitName, 'this.unitName');
    this.unitAll.forEach(d => {
      if (d.type === value) {
        this.unitName.push({
          label: d.label,
          value: d.value,
        });
      }
    });
    console.log(this.unitName, 'this.unitName');
    console.log(value, 'value');
    this.schema.properties.requestUnitType.default = value;
    this.schema.properties.requestUnitId.enum = this.unitName;
    this.sf.refreshSchema();
  }

  close() {
    this.modal.destroy();
  }
}
