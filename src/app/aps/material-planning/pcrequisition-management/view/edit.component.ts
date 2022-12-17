import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';
import { _HttpClient,ModalHelper } from '@delon/theme';
//import { ModalHelper } from '@delon/theme';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { QueryService } from '../query.service';
import { CommonQueryService } from '../../../../modules/generated_module/services/common-query.service';
import { AppGridStateService } from 'app/modules/base_module/services/app-gridstate-service';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext, ServiceOptions } from 'app/modules/base_module/components/custom-base-context.component';
import { BrandService } from 'app/layout/pro/pro.service';
import { PcBuyerAuthService } from 'app/modules/generated_module/services/pc-buyerauth-service';
import { PcRequisitionManagementLineEditComponent } from './line_edit.component';
import { fakeAsync } from '@angular/core/testing';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pcrequisition-management-edit',
  templateUrl: './edit.component.html',
  providers: [QueryService],
})
export class PcRequisitionManagementEditComponent extends CustomBaseContext implements OnInit, AfterViewInit {
  @ViewChild("f", { static: false }) f;
  record: any = {};
  public i: any;  //传入参数
  public viewType:string; //视图类型  view new edit
  Isview :boolean = false;
  Isnew :boolean = false;
  Isedit :boolean = false;
  useroptions: any[] = [];
  employoptions: any[] = [];
  userreltypeoptions: any[] = [];
  title: String = '新增';
  Istrue: boolean;
  op_step:number = 0;

  listPlant: any[] = [];
  listDataType: any[] = [{ label: '需求', value: '1' }, { label: '供应', value: '2' }];
  //物料类型
  listItemType: any[] = [];
  //保税类型
  listBondedType: any[] = [];
  listSubinventory:any[] = [];
  //接收地点
  listLocation:any[] = [];
  listOrderType: any[] = [];
    //单位
  listUnitOfMeasure: any[] = [];
  // PR头状态
  listPRStatus: any[] = [];
  listPRLStatus: any[] = [];
  listSourcePlant: any[] = [];
  listScheduleGroup: any[] = [];
  listAuthUsersGroup: any[] = [];
  // 来源字典表
  listPRSourceStatus : any[] = [];
  listYesOrNo: any[] = [{label:'是',value:'Y'},{label:'否',value:'N'}];
  userName: string = ""; //localStorage.getItem('user_name')
  userId:string="";
   //默认当前用户采购员
   defaultbuyer:any;
   //默认当前用户计划员
   defaultplanner:any;
  gridView1: GridDataResult = {
    data: [],
    total: 0
  };
  columns1: any[] = [
    {
      field: 'employeeNumber',
      title: '人员编码',
      width: '50'
    },
    {
      field: 'fullName',
      title: '姓名',
      width: '50'
    }
  ];

  dirty = true;
  isRowSelectable(rowNode){
    return !rowNode.gridOptionsWrapper.gridOptions.context.Isview;
  }
  gridHeight = 300;
  columns = [
    {
      colId: 0, cellClass: '', field: 'check', headerName: '', width: 40, pinned: 'left', lockPinned: true,
      checkboxSelection: true,
      headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true,
      headerComponentParams: {
        template: this.headerTemplate
      },suppressSizeToFit: true,
    },
    { field: 'lineNum', width: '30',headerName: '行号', menuTabs: ['filterMenuTab'] },
    { field: 'itemCode', headerName: '物料编码', menuTabs: ['filterMenuTab'] ,
    cellClassRules: {
     'boldStyle': function (params) { return params.context.dataRowChange(params.data); },
   }},
   { field: 'itemDescriptions', headerName: '物料名称', menuTabs: ['filterMenuTab'],
   cellClassRules: {
    'boldStyle': function (params) { return params.context.dataRowChange(params.data); },
  }, },
  { field: 'buyerName', headerName: '采购员', menuTabs: ['filterMenuTab'] },
  { field: 'plannerName', headerName: '计划员', menuTabs: ['filterMenuTab'] },
  { field: 'unitOfMeasure',width: '80', headerName: '计量单位', menuTabs: ['filterMenuTab'],valueFormatter: 'ctx.optionsFind(value,7)' },
  { field: 'quantity',width: '80', headerName: '采购申请量', menuTabs: ['filterMenuTab'] },
  { field: 'orderQuantity', width: '80', headerName: '已下单量', menuTabs: ['filterMenuTab'] },
  { field: 'needByDate', headerName: '需求时间', menuTabs: ['filterMenuTab']},
  { field: 'deliverToLocationId', headerName: '收货地点', menuTabs: ['filterMenuTab'] },
  { field: 'destinationSubinventory', headerName: '子库', menuTabs: ['filterMenuTab'] },
  { field: 'justification', headerName: '申请理由', menuTabs: ['filterMenuTab'] },
  { field: 'noteToVendor',width: '80', headerName: '通知供应商', menuTabs: ['filterMenuTab'] },
  { field: 'noteToAgent',width: '80', headerName: '通知采购员', menuTabs: ['filterMenuTab'] },
  { field: 'vendorNumber', headerName: '供应商编码', menuTabs: ['filterMenuTab'] },
  { field: 'vendorSiteCode', headerName: '供应商地点', menuTabs: ['filterMenuTab'] },
  { field: 'projectNumber', headerName: '项目号', menuTabs: ['filterMenuTab'] },
  { field: 'customerDesignated', headerName: '客指', menuTabs: ['filterMenuTab'] ,valueFormatter: 'ctx.optionsFind(value,6)'},
  { field: 'closedCode', headerName: '行状态', menuTabs: ['filterMenuTab'],valueFormatter: 'ctx.optionsFind(value,5)' },
  ];

query() {
    super.query();
    this.commonQuery();
  }
commonQuery() {
    // console.log(this.queryParams.values.IS_QUERY_DEMAND);
    // console.log(this.queryParams.values.IS_QUERY_SUPPLY);
     this.queryService.loadGridView(this.queryService.planWorkbenchQuery, this.getQueryParams(), this.context);
  }
formatDate(date?: Date): string {
    if (!date) return '';
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
getQueryParams(isExport?: boolean) {
    return {
      plantCode: this.i.plantCode,
      poType: this.i.poType,
      documentNum: this.i.documentNum,
      itemCode: '',
      itemDescriptions: '',
      buyer: '',
      projectNumber: '',
      vendorNumber: '',
      planner:'',
      demandSupplyDateS: null,
      demandSupplyDateT: null,
      status:'',
      creationDateS: null,
      creationDateT: null,
      pageIndex: this._pageNo,
      pageSize: this._pageSize,
      isExport: isExport
    };
  }
  dataRowChange(dataItem:any){
    return false;
  }
  constructor(
    private modal: NzModalRef,
    private modalhelper: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appConfig: AppConfigService,
    private queryService: QueryService,
    private commonquery: CommonQueryService,
    private appTranslate: AppTranslationService,
    private appGridStateService: AppGridStateService,
    private modalService: NzModalService,
    public pro: BrandService,
    private pcBuyerAuthService: PcBuyerAuthService,
  ){
    super(<ServiceOptions>{ appTranslationSrv: appTranslate, msgSrv: msgSrv, appConfigSrv: appConfig, pro: pro });
    this.headerNameTranslate(this.columns);
  }

  ngOnInit(): void {
    //设置当前页面状态
    switch(this.viewType)
    {
     case 'view':
      this.Isview=true;
      break;
      case 'edit':
      this.Isedit=true;
      break;
      case 'new':
      this.Isnew=true;
       break;
    }

    if (this.i.id !== null) {
     this.reflashGrid();
    }
    else
    {
      this.i.status = 'NEW';
      this.i.sourceCode ='MANUAL';
      this.i.documentNum = "";
      this.query();
    }
    this.LoadData();
  }

  ngAfterViewInit() {
    console.log(this.f);
  }

  abc(){
    console.log(this.f);
  }
  //刷新当前页面
  reflashGrid(){
    this.queryService.GetById(this.i.id).subscribe(res => {
     if(res && res.data)
     {
         this.i = res.data;
         if (this.i.status !== "NEW" )
         {
           this.Istrue = false;
         }
         else
         {
           this.Istrue = true;
         }
     }
     else
     {
      this.i.id = null;
      this.i.status = "NEW";
      this.i.sourceCode = 'MANUAL';
      this.i.documentNum = null;
      this.i.poType = null;
      this.i.comments = null;
      this.i.bondedType = null;
      this.i.plantCode = '';
      this.Isedit = false;
      this.Istrue = false;
     }
      this.query();
     });
  }

  LoadData() {

    this.queryService.GetLookupByType('PS_ITEM_UNIT').subscribe(result => {
      result.Extra.forEach(d => {
        this.listUnitOfMeasure.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
  //采购头状态
  this.queryService.GetLookupByType('PC_PR_STATUS').subscribe(result => {
    result.Extra.forEach(d => {
      this.listPRStatus.push({
        label: d.meaning,
        value: d.lookupCode,
      });
    });
  });
  this.queryService.GetLookupByType('PC_PR_SOURCE_TYPE').subscribe(result => {
    result.Extra.forEach(d => {
      this.listPRSourceStatus.push({
        label: d.meaning,
        value: d.lookupCode,
      });
    });
  });
    //采购行状态
    this.queryService.GetLookupByType('PC_PRL_STATUS').subscribe(result => {
      result.Extra.forEach(d => {
        this.listPRLStatus.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
      if(this.i.id !== null){
        this.query();
      }
    });
  // 订单类型

  this.queryService.GetLookupByType('PC_PO_TYPE').subscribe(result => {
    result.Extra.forEach(d => {
      this.listOrderType.push({
        label: d.meaning,
        value: d.lookupCode,
      });
    });
  });
  // 供应类型
  this.queryService.GetLookupByType('PS_ITEM_TYPE').subscribe(result => {
    result.Extra.forEach(d => {
      this.listItemType.push({
        label: d.meaning + '-' + d.lookupCode ,
        value: d.lookupCode,
      });
    });
  });
  // 保税类型
  this.queryService.GetLookupByType('PC_BONDED_TYPE').subscribe(result => {
    result.Extra.forEach(d => {
      this.listBondedType.push({
        label: d.meaning,
        value: d.lookupCode,
      });
    });
  });
  // 加载工厂
  this.userId = this.appConfig.getUserId();
  this.userName = this.appConfig.getUserName();
  this.queryService.GetUserPlant().subscribe(result => {
    // this.plantOptions.length = 0;
    result.Extra.forEach(d => {
      this.listPlant.push({ value: d.plantCode, label: d.plantCode });
    });
  });
  // this.query();
  this.pcBuyerAuthService.GetAuthUserByUserName(this.userName,"0").subscribe(result=>{
    this.listAuthUsersGroup = result.data;
     //默认当前用户采购员
     this.defaultbuyer  = this.getDefaultUser("1");
     //默认当前用户计划员
     this.defaultplanner = this.getDefaultUser("2");
     //this.queryParams.values.BUYER={text:this.defaultbuyer.AUTHORIZEE_NUMBER,value: this.defaultbuyer.AUTHORIZEE_NUMBER}
     //this.queryParams.values.PLANNER={text:this.defaultplanner.AUTHORIZEE_NUMBER,value: this.defaultplanner.AUTHORIZEE_NUMBER}
  });
}
// 显示列变更（列头样式）
  onVirtualColumnsChanged(event) {
    const gridDom = document.querySelectorAll('#MrpPlanWorkbenchGrid');
    if (!this.isNull(gridDom) && gridDom.length > 0) {
      const doms = gridDom[0].querySelectorAll('span.ag-header-cell-text');
      doms.forEach(dom => {
       // if (this.editColumnHeaders.findIndex(name => name === dom.innerHTML) > -1) {
       //   dom.setAttribute('style', 'color: #FFA500');
      //  }
      });
    }
  }

  public loadGridDataCallback(result) {
    this.onVirtualColumnsChanged(result);
  }
  getDefaultUser( user_rel_type: string ){
    const buyer = this.listAuthUsersGroup.find(p=>p.authorizeeType==='1' && p.userRelType === user_rel_type )
   if( buyer && buyer.authorizeeNumber){
     return buyer;
   }
   else return {};
  }
  public optionsFind(value: string, optionsIndex: number): any {
    let options = [];
    switch (optionsIndex) {
      case 1: // 物料类型
        options = this.listItemType;
        break;
      case 2: // 订单类型
        options = this.listOrderType;
        break;
      case 3: // 保税类型
        options = this.listBondedType;
        break;
      case 4: // 采购头状态
        options = this.listPRStatus;
        break;
      case 5: // 采购行状态
        options = this.listPRLStatus;
        break;
        case 6: //  是否客指
        options = this.listYesOrNo;
        break;
        case 7: //  单位
        options = this.listUnitOfMeasure;
        break;
    }
    const obj = options.find(x => x.value === value) || { label: value };
    return obj ? obj.label : null;
  }
  save() {
    this.op_step++;
    if (this.gridData == null || this.gridData.length === 0) {
      const msg = this.appTranslate.translate('请添加依赖行数据!');
      this.msgSrv.info(msg);
      return;
    }

 this.queryService.SaveHeaderInfo(this.i)
      .subscribe(res => {
        if (res.code == 200) {
          this.msgSrv.success(this.appTranslate.translate('保存成功'));
           this.reflashGrid();
        } else {
          this.msgSrv.error(this.appTranslate.translate(res.msg));
        }
      });
  }

  close() {
    this.modal.destroy({DataChange: this.op_step > 0});
  }



  removerows() {
      if (this.gridData == null || this.gridData.length === 0) {
        return;
      }
      const dtRemove = this.gridApi.getSelectedRows();
      if (dtRemove.length === 0) {
        const msg = this.appTranslate.translate('请勾选数据！');
        this.msgSrv.info(msg);
        return;
      }
      this.op_step++;
      this.queryService.RemoveBath(dtRemove)
        .subscribe(res => {
          if (res.code == 200) {
            this.msgSrv.success(this.appTranslate.translate('删除成功'));
            this.reflashGrid();
          } else {
            this.msgSrv.error(this.appTranslate.translate(res.msg));
          }

        });
  }
  editrows(){
    if (this.gridData == null || this.gridData.length === 0) {
      return;
    }
    const dtEdit = this.gridApi.getSelectedRows();
    if (dtEdit.length === 0) {
      const msg = this.appTranslate.translate('请勾选数据！');
      this.msgSrv.info(msg);
      return;
    }
    else if (dtEdit.length > 1) {
      const msg = this.appTranslate.translate('勾选了多行数据！');
      this.msgSrv.info(msg);
      return;
    }
    this.op_step++;
    this.modalhelper.static(PcRequisitionManagementLineEditComponent, { i: dtEdit[0] ,viewType:"edit" }, 'lg').subscribe(res => {
      this.reflashGrid();
     });

  /*
    this.queryService.PublishPcRequisitionOrder(dtRemove)
      .subscribe(res => {
        if (res.Success) {
          this.msgSrv.success(this.appTranslate.translate('发布成功'));
        } else {
          this.msgSrv.error(this.appTranslate.translate(res.Message));
        }
        this.query();
      });
   */
}
addrow() {

  let iedit:any={};
  iedit.documentNum =this.i.documentNum;
  iedit.plantCode =this.i.plantCode;
  iedit.poType =this.i.poType;
  iedit.status =this.i.status;
  iedit.sourceCode =this.i.sourceCode;
  iedit.bondedType =this.i.bondedType;
  iedit.comments =this.i.comments;
  iedit.id = null;
  this.op_step++;
  this.modalhelper.static(PcRequisitionManagementLineEditComponent, { i:iedit,viewType: "new"  }, 'lg').subscribe(res => {
 if(res && res.success){
    this.Isedit = true;
    this.i.id= res.data;
    this.reflashGrid();
   // this.queryService.GetById(res.data.ID).subscribe(res => {
    //  this.i = res.Extra;
    //  this.query();
  // });
  }
  });
}
//提交审批
approval(){
  if (this.gridData == null || this.gridData.length === 0) {
    this.msgSrv.error(this.appTranslate.translate("没有可供审批的信息"));
    return;
  }
  this.op_step++;
  this.queryService.Approval(this.i)
        .subscribe(res => {
          if (res.code == 200) {
            this.msgSrv.success(this.appTranslate.translate('审批成功'));
            this.reflashGrid();
            this.Isview = true;
          } else {
            this.msgSrv.error(this.appTranslate.translate(res.msg));
          }
        });
}

  lastPageNo = this._pageNo;
  lastPageSize = this._pageSize;
  // 页码切换
  onPageChanged({ pageNo, pageSize }) {
    if (this.lastPageNo !== pageNo || this.lastPageSize !== pageSize) {
      if (this.lastPageSize !== pageSize) {
        this.gridApi.paginationSetPageSize(pageSize);
      }
      this.lastPageNo = pageNo;
      this.lastPageSize = pageSize;
      this.commonQuery();
    } else {
      this.setLoading(false);
    }
  }
}

