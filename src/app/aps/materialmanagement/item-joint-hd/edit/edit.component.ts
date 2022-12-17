import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { ItemJointHDEditService } from '../edit.service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PsItemRoutingsService } from '../../../../modules/generated_module/services/ps-item-routings-service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'item-joint-hd-edit',
  templateUrl: './edit.component.html',
  providers: [ItemJointHDEditService, PsItemRoutingsService]

})
export class ItemJointHDEditComponent implements OnInit {
  // 编辑信息
  originDto: any;
  editDto: any;
  // 工厂
  plantCodeList: any[] = [];
  // 资源
  resourceCodeMasterList: any[] = [];
  resourceCodeJointList: any[] = [];

  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    public itemJointHDEditService: ItemJointHDEditService,
    public prodlineItemEditService: PsItemRoutingsService,
    private commonqueryService: CommonQueryService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.getPlantCodeList();
    this.clear();
  }

  /** 初始化 组织  下拉框*/
  getPlantCodeList() {
    this.itemJointHDEditService.GetUserPlant().subscribe(result => {
      result.Extra.forEach(d => {
        this.plantCodeList.push({ value: d.PLANT_CODE, label: d.PLANT_CODE });
      });
    });
  }

  clear() {
    this.editDto = {
      Id: null,
      PLANT_CODE_MASTER: this.appConfigService.getPlantCode(),
      RESOURCE_CODE_MASTER: null,
      ITEM_ID_MASTER: null,
      ITEM_CODE_MASTER: null,
      ITEM_MASTER_DESCRIPTIONS: null,
      PLANT_CODE_JOINT: null,
      RESOURCE_CODE_JOINT: null,
      ITEM_ID_JOINT: null,
      ITEM_CODE_JOINT: null,
      ITEM_JOINT_DESCRIPTIONS: null,
      QTY_TRANSFER: null,
      TIME_INTERVAL: null,
      SPLIT_QTY: null,
      ROUNDING_VALUE: null
    };
    if (this.originDto.Id) {
      this.editDto = {
        Id: this.originDto.Id,
        PLANT_CODE_MASTER: this.originDto.PLANT_CODE_MASTER,
        RESOURCE_CODE_MASTER: this.originDto.RESOURCE_CODE_MASTER,
        ITEM_ID_MASTER: this.originDto.ITEM_ID_MASTER,
        ITEM_CODE_MASTER: this.originDto.ITEM_ID_MASTER,
        ITEM_MASTER_DESCRIPTIONS: this.originDto.ITEM_MASTER_DESCRIPTIONS,
        PLANT_CODE_JOINT: this.originDto.PLANT_CODE_JOINT,
        RESOURCE_CODE_JOINT: this.originDto.RESOURCE_CODE_JOINT,
        ITEM_ID_JOINT: this.originDto.ITEM_ID_JOINT,
        ITEM_CODE_JOINT: this.originDto.ITEM_ID_JOINT,
        ITEM_JOINT_DESCRIPTIONS: this.originDto.ITEM_JOINT_DESCRIPTIONS,
        QTY_TRANSFER: this.originDto.QTY_TRANSFER,
        TIME_INTERVAL: this.originDto.TIME_INTERVAL,
        SPLIT_QTY: this.originDto.SPLIT_QTY,
        ROUNDING_VALUE: this.originDto.ROUNDING_VALUE
      };
      // 给物料描述赋值
      this.prodlineItemEditService.SearchItemInfoByCode(this.editDto.ITEM_ID_MASTER).subscribe(resultMes => {
        if (resultMes && resultMes.data.length > 0) {
          this.editDto.ITEM_MASTER_DESCRIPTIONS = resultMes.data[0].DESCRIPTIONS;
          this.editDto.ITEM_ID_MASTER = resultMes.data[0].ITEM_ID;
          this.editDto.ITEM_CODE_MASTER = resultMes.data[0].ITEM_CODE;
        }
      });

      // 给物料描述赋值
      this.prodlineItemEditService.SearchItemInfoByCode(this.editDto.ITEM_ID_JOINT).subscribe(resultMes => {
        if (resultMes && resultMes.data.length > 0) {
          this.editDto.ITEM_JOINT_DESCRIPTIONS = resultMes.data[0].DESCRIPTIONS;
          this.editDto.ITEM_ID_JOINT = resultMes.data[0].ITEM_ID;
          this.editDto.ITEM_CODE_JOINT = resultMes.data[0].ITEM_CODE;
        }
      });

      this.ngPlantCodeJointModelChange(this.editDto.PLANT_CODE_JOINT, true);
    }

    this.ngPlantCodeMasterModelChange(this.editDto.PLANT_CODE_MASTER, true);
  }

  ngPlantCodeMasterModelChange(event: any, flag: boolean = false) {
    this.resourceCodeMasterList.length = 0;
    if (!flag) {
      this.editDto.RESOURCE_CODE_MASTER = null;
    }
    this.itemJointHDEditService.GetResourceCodes({ PLANT_CODE_MASTER: event }).subscribe(result => {
      result.Extra.forEach(d => {
        this.resourceCodeMasterList.push({ value: d.RESOURCE_CODE, label: d.RESOURCE_CODE });
      });
    });
  }

  // 绑定物料
  public gridViewItems1: GridDataResult = {
    data: [],
    total: 0
  };
  public gridViewItems2: GridDataResult = {
    data: [],
    total: 0
  };
  public columnsItems: any[] = [
    {
      field: 'ITEM_CODE',
      title: '物料编码',
      width: '100'
    },
    {
      field: 'DESCRIPTIONS_CN',
      title: '物料描述',
      width: '100'
    }
  ];

  onTextChanged1(e: any) {
    this.editDto.ITEM_MASTER_DESCRIPTIONS = '';
    this.editDto.ITEM_ID_MASTER = '';
    this.editDto.ITEM_CODE_MASTER = '';
    // 给物料描述赋值
    this.prodlineItemEditService.SearchItemInfoByCode(e.Text).subscribe(resultMes => {
      if (resultMes && resultMes.data.length > 0) {
        this.editDto.ITEM_MASTER_DESCRIPTIONS = resultMes.data[0].DESCRIPTIONS;
        this.editDto.ITEM_ID_MASTER = resultMes.data[0].ITEM_ID;
        this.editDto.ITEM_CODE_MASTER = resultMes.data[0].ITEM_CODE;
      }
    });
  }

  //  行点击事件， 给参数赋值
  onRowSelect1(e: any) {
    this.editDto.ITEM_ID_MASTER = e.Value;
    this.editDto.ITEM_CODE_MASTER = e.Text;
    // 给物料描述赋值
    this.prodlineItemEditService.SearchItemInfoByID(e.Value).subscribe(resultMes => {
      this.editDto.ITEM_MASTER_DESCRIPTIONS = resultMes.data[0].DESCRIPTIONS;
    });
  }

  // 物料弹出查询
  public searchItems1(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.gridViewItems1 = {
      data: [],
      total: 0
    };
    // 加载物料
    this.commonqueryService.GetUserPlantItemPageList(this.editDto.PLANT_CODE_MASTER || '', e.SearchValue || '', '',
      PageIndex, e.PageSize).subscribe(res => {
        this.gridViewItems1.data = res.Result;
        this.gridViewItems1.total = res.TotalCount;
      });
  }

  ngPlantCodeJointModelChange(event: any, flag: boolean = false) {
    this.resourceCodeJointList.length = 0;
    if (!flag) {
      this.editDto.RESOURCE_CODE_JOINT = null;
    }
    this.itemJointHDEditService.GetResourceCodes({ PLANT_CODE_MASTER: event }).subscribe(result => {
      result.Extra.forEach(d => {
        this.resourceCodeJointList.push({ value: d.RESOURCE_CODE, label: d.RESOURCE_CODE });
      });
    });
  }

  onTextChanged2(e: any) {
    this.editDto.ITEM_JOINT_DESCRIPTIONS = '';
    this.editDto.ITEM_ID_JOINT = '';
    this.editDto.ITEM_CODE_JOINT = '';
    // 给物料描述赋值
    this.prodlineItemEditService.SearchItemInfoByCode(e.Text).subscribe(resultMes => {
      if (resultMes && resultMes.data.length > 0) {
        this.editDto.ITEM_JOINT_DESCRIPTIONS = resultMes.data[0].DESCRIPTIONS;
        this.editDto.ITEM_ID_JOINT = resultMes.data[0].ITEM_ID;
        this.editDto.ITEM_CODE_JOINT = resultMes.data[0].ITEM_CODE;
      }
    });
  }

  //  行点击事件， 给参数赋值
  onRowSelect2(e: any) {
    this.editDto.ITEM_ID_JOINT = e.Value;
    this.editDto.ITEM_CODE_JOINT = e.Text;
    // 给物料描述赋值
    this.prodlineItemEditService.SearchItemInfoByID(e.Value).subscribe(resultMes => {
      this.editDto.ITEM_JOINT_DESCRIPTIONS = resultMes.data[0].DESCRIPTIONS;
    });
  }

  // 物料弹出查询
  public searchItems2(e: any) {
    const PageIndex = e.Skip / e.PageSize + 1;
    this.gridViewItems2 = {
      data: [],
      total: 0
    };
    // 加载物料
    this.commonqueryService.GetUserPlantItemPageList(this.editDto.PLANT_CODE_JOINT || '', e.SearchValue || '', '',
      PageIndex, e.PageSize).subscribe(res => {
        this.gridViewItems2.data = res.Result;
        this.gridViewItems2.total = res.TotalCount;
      });
  }

  save() {
    this.itemJointHDEditService.Save(this.editDto).subscribe(res => {
      if (res.Success === true) {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      } else {
        this.msgSrv.error(res.Message);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
