import { Component, OnInit, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { Observable } from 'rxjs';
import { NzModalRef, NzMessageService, NzModalService } from 'ng-zorro-antd';
import { EditorFlowComponent } from 'app/modules/base_module/components/editor-flow.component';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { QueryService } from './query.service';
// import G6Editor from '@antv/g6-editor';
import { AppConfigService } from '../../../modules/base_module/services/app-config-service';
import { ActivatedRoute } from '@angular/router';
import { MaintainProcessCopyComponent } from './copy-process/copy.component';
import { MaintainChangeCopyComponent } from './change-code/change-copy.component';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  providers: [QueryService],
  selector: 'app-dashboard',
  styleUrls: ['./material-process.component.css'],
  templateUrl: './material-process.component.html',
})
export class MaterialProcessComponent extends EditorFlowComponent implements AfterViewInit {
  isLoading: boolean;

  public ITEM_CODE = null;
  public ITEM_ID = null;
  public PLANT_CODE = null;
  public TECH_VERSION = null;

  public CurLng: string;
  public DisEnable = 'disabled';
  public optionVersion: any[] = [];
  public processoptions: any[] = [];
  public initDataJson: any[] = [];
  public initDataJsonString: any;
  public listProcess: any[] = [];
  public RelationTypeOptions: any[] = [];
  public getRelationRemark = '';
  public getEnable = '';
  public Reason = null;
  public IsCanShow = null;
  public IsFristChange = true;
  public PreLen1 = 0;
  public PreLen2 = 0;
  public edgesOption = {
    Time: '',
    Relation: '',
    Enable: ''
  };
  IsNew = false;
  // public inputingOther: string;
  public EnableOption = [
    {
      label: '是',
      value: 'Y'
    },
    {
      label: '否',
      value: 'N'
    }
  ];
  public _lastString = '';
  constructor(
    private confirmationService: NzModalService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    public queryService: QueryService,
    private appConfigService: AppConfigService,
    public route: ActivatedRoute,
    private modal: ModalHelper,
  ) {
    super();
    this.PLANT_CODE = this.appConfigService.getPlantCode();
    if (this.PLANT_CODE) {
      this.getItemProcess();
    }
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams && queryParams.ITEM_CODE) {
        this.ITEM_CODE = queryParams.ITEM_CODE;
        this.PLANT_CODE = queryParams.PLANT_CODE;
        this.ITEM_ID = queryParams.ITEM_ID;
      }
      if (this.ITEM_ID !== null && this.ITEM_ID !== '') {
        this.queryService.getInitFlowEdit(this.PLANT_CODE, this.ITEM_ID, this.TECH_VERSION).subscribe(res => {
          // 加载数据、重新绘图
          this.initDataJsonString = res.Extra;
          this.LoadEditFlow(this.initDataJsonString);
        });
      }
    });
  }

  ngAfterViewInit() {
    this.getRelationRemark = '';
    this.CurLng = this.appConfigService.getLanguage();
    super.ngAfterViewInit();
    this.getItemProcess();

    this.queryService.GetLookupByType('TECH_VERSION').subscribe(result => {
      result.Extra.forEach(d => {
        this.optionVersion.push({
          label: d.LOOKUP_CODE,
          value: d.LOOKUP_CODE,
        });
      });
    });

    this.queryService.GetLookupByTypeLang('PS_OP_RELATION_TYPE', this.CurLng).subscribe(result => {
      result.Extra.forEach(d => {
        this.RelationTypeOptions.push({
          label: d.MEANING,
          value: d.LOOKUP_CODE,
        });
        this.getRelationRemark = this.getRelationRemark + d.MEANING + '(' + d.LOOKUP_CODE + ')' + '<br/>';
      });
    });

    this.getEnable = '是(Y) <br/> 否(N)';
    this.afterItemSelected.subscribe(t => {
    });
  }

  getItemProcess() {
    this.processoptions.length = 0;
    this.listProcess.length = 0;
    this.queryService.getItemProcess(this.PLANT_CODE).subscribe(res => {
      res.Extra.forEach(d => {
        this.processoptions.push({
          label: d.PROCESS_CODE + '-' + d.DESCRIPTION,
          value: d.PROCESS_CODE,
          tag: d.DESCRIPTION
        });
        this.listProcess.push(d.PROCESS_CODE);
      });
    });
  }

  public LoadEditFlow(JosnInfo: any) {
    const obj = {
      edges: [],
      nodes: []
    };
    if (JosnInfo === null) {
      this.editor.getCurrentPage().read(JSON.stringify(obj));
    } else {
      this.DisEnable = '';
      this.editor.getCurrentPage().read(JSON.parse(JosnInfo));
    }
  }

  public confirm(value?: any) {
    if (!this.check()) {
      this.confirmationService.warning({
        nzContent: this.appTranslationService.translate(this.Reason || '请检查数据是否正确'),
        nzOnOk: () => {
          return;
        },
      });
    } else {
      this.saveToDB();
    }
  }

  public check(): boolean {
    let flag = true;
    const currentPageInfo = this.editor.getCurrentPage();
    const jsoninfo = currentPageInfo.save();
    const edges = jsoninfo.edges ? jsoninfo.edges : null;
    const nodes = jsoninfo.nodes ? jsoninfo.nodes : null;
    if (edges == null || nodes == null)
      return false;

    if (edges != null && nodes != null) {
      nodes.forEach(element => {
        if (element.label !== '结束' && this.listProcess.indexOf(element.label) < 0) {
          this.Reason = element.label + '不是正确的物料工序编号';
          flag = false;
        }
        if (element.label === '' || element.label === null) {
          this.Reason = '工序编号不能为空';
          flag = false;
        }
      });
    }
    return flag;
  }

  public saveToDB(): void {
    const jsoninfo = this.editor.getCurrentPage().save();
    const edges = jsoninfo.edges;
    const nodes = jsoninfo.nodes;
    const groups = jsoninfo.groups ? jsoninfo.groups : null;
    // const SaveList = this.getJsonData(edges, nodes);
    const dto = {
      ITEM_CODE: this.ITEM_CODE,
      ITEM_ID: this.ITEM_ID,
      PLANT_CODE: this.PLANT_CODE,
      TECH_VERSION: this.TECH_VERSION,
      edges: edges,
      nodes: nodes,
      groups: groups,
      JsonInfo: jsoninfo
    };
    this.queryService.SaveEditFlow(dto).subscribe(res => {
      if (res.Success) {
        this.msgSrv.success(res.Message || '保存成功');
      } else {
        this.msgSrv.error(res.Message || '保存失败');
      }
    });
  }

  public copyprocess(item?: any) {
    this.modal.static(MaintainProcessCopyComponent, {
      i: {
        PLANT_CODE: this.PLANT_CODE,
        ITEM_ID: this.ITEM_ID,
        ITEM_CODE: this.ITEM_CODE,
        CATEGORY: '1',
        OBJECT: ''
      }
    }, 'lg').subscribe(res => {
      this.TECH_VERSION = null;

      // do something
    });
  }


  // 工艺版本修改
  onChangeVersion(value: string): void {
    this.queryService.getInitFlowEdit(this.PLANT_CODE, this.ITEM_ID, value).subscribe(res => {
      // 加载数据、重新绘图
      this.initDataJsonString = res.Extra;
      this.LoadEditFlow(this.initDataJsonString);
    });
  }


  public ChangeCode(item?: any) {

    this.TECH_VERSION = null;

    this.modal.static(MaintainChangeCopyComponent, {
      i: {
        PLANT_CODE: this.PLANT_CODE,
        ITEM_ID: this.ITEM_ID ? this.ITEM_ID : null,
        ITEM_CODE: this.ITEM_CODE ? this.ITEM_CODE : null,
        ToId: '',
        ToCode: ''
      }
    }, 'lg').subscribe(res => {
      if (res) {
        if (res !== true && res !== 'true') {
          this.queryService.getInitFlowEdit(res.PLANT_CODE, res.ToId, this.TECH_VERSION).subscribe(resJson => {
            this.initDataJsonString = resJson.Extra;
            this.ITEM_CODE = res.ToCode;
            this.ITEM_ID = res.ToId;
            this.PLANT_CODE = res.PLANT_CODE;
            this.LoadEditFlow(this.initDataJsonString);
            this.getItemProcess();
          });
        }
      }
    });
  }

  public ReWrite(): void {
    const obj = {
      edges: [],
      nodes: []
    };
    this.editor.getCurrentPage().read(JSON.stringify(obj));
  }

  public getDesByProCode(): any {
    return this.processoptions.find(x => x.value === this.inputingLabel);
  }

  public getTimeAndType(): any {
    /*if (this._lastString !== this.inputingLabel) {
      this.inputingOther = '';
      this._lastString = this.inputingLabel;
    }*/
    const re = /^[0-9]+\.?[0-9]*$/;
    let res = '';
    if (this.inputingOther || this.inputingLabel) {
      const splitString = this.inputingLabel;
      const usageString = this.inputingOther || '';
      if (splitString !== '' && splitString !== null && splitString !== undefined) {
        const split = splitString.split('-');
        if (re.test(split[0])) {
          this.IsCanShow = 'true';
          if (split.length > 2) {
            const RelationType = this.RelationTypeOptions.find(n => n.value.toUpperCase() === split[1].toUpperCase());
            const EnableType = this.EnableOption.find(n => n.value.toUpperCase() === split[2].toUpperCase());
            res = '工序提前期:' + split[0] + ' 小时 <br/>工序相关性:' + ((RelationType !== null && RelationType !== undefined) ? RelationType.label : '<font color="#FF0000">错误</font>')
              + '<br/> 是否有效:' + ((EnableType !== null && EnableType !== undefined) ? EnableType.label : '<font color="#FF0000">错误</font>');
          } else if (split.length > 1) {
            const RelationType = this.RelationTypeOptions.find(n => n.value.toUpperCase() === split[1].toUpperCase());
            res = '工序提前期:' + split[0] + ' 小时 <br/>工序相关性:' + ((RelationType !== null && RelationType !== undefined) ? RelationType.label : '<font color="#FF0000">错误</font>');
          } else {
            res = '工序提前期:' + split[0] + ' 小时';
          }
        } else {
          this.IsCanShow = null;
          res = '提前期:' + '<font color="#FF0000">错误</font>';
        }
      }
      if (usageString !== '' && usageString !== null && usageString !== undefined) {
        if (!re.test(usageString)) {
          res = res + '<br/>单位用量:' + '<font color="#FF0000">错误</font>';
        } else {
          res = res + '<br/>单位用量:' + usageString;
        }
      }
    }
    /*if (this.inputingLabel !== '' && this.inputingLabel !== null && this.inputingLabel !== undefined) {
      const splitString = this.inputingLabel.substring(0, this.inputingLabel.includes('/') ? this.inputingLabel.indexOf('/') : this.inputingLabel.length);
      const usageString = this.inputingLabel.includes('/') ? this.inputingLabel.substring(this.inputingLabel.indexOf('/') + 1, this.inputingLabel.length) : '';
      if (splitString !== '' && splitString !== null && splitString !== undefined) {
        const split = splitString.split('-');
        if (re.test(split[0])) {
          this.IsCanShow = 'true';
          if (split.length > 2) {
            const RelationType = this.RelationTypeOptions.find(n => n.value.toUpperCase() === split[1].toUpperCase());
            const EnableType = this.EnableOption.find(n => n.value.toUpperCase() === split[2].toUpperCase());
            res = '工序提前期:' + split[0] + ' 小时 <br/>工序相关性:' + ((RelationType !== null && RelationType !== undefined) ? RelationType.label : '<font color="#FF0000">错误</font>')
              + '<br/> 是否有效:' + ((EnableType !== null && EnableType !== undefined) ? EnableType.label : '<font color="#FF0000">错误</font>');
          } else if (split.length > 1) {
            const RelationType = this.RelationTypeOptions.find(n => n.value.toUpperCase() === split[1].toUpperCase());
            res = '工序提前期:' + split[0] + ' 小时 <br/>工序相关性:' + ((RelationType !== null && RelationType !== undefined) ? RelationType.label : '<font color="#FF0000">错误</font>');
          } else {
            res = '工序提前期:' + split[0] + ' 小时';
          }
        } else {
          this.IsCanShow = null;
          res = '提前期:' + '<font color="#FF0000">错误</font>';
        }
      }
      if (usageString !== '' && usageString !== null && usageString !== undefined) {
        if (!re.test(usageString)) {
          res = res + '<br/>单位用量:' + '<font color="#FF0000">错误</font>';
        } else {
          res = res + '<br/>单位用量:' + usageString;
        }
      }
    }*/
    return res;
  }

  public confirmRelation() {
    const re = /^[0-9]+?[0-9]*$/;
    const Time = this.edgesOption.Time;
    const Relation = this.edgesOption.Relation;
    const Enable = this.edgesOption.Enable;
    if (Time === null || Time === '' || Time === undefined) {
      this.msgSrv.warning('提前期不能为空');
      return;
    }
    if (Relation === null || Relation === '' || Relation === undefined) {
      this.msgSrv.warning('工序相关性不能为空');
      return;
    }
    if (Enable === null || Enable === '' || Enable === undefined) {
      this.msgSrv.warning('是否有效不能为空');
      return;
    }
    if (!re.test(Time)) {
      this.msgSrv.warning('提前期无效');
      return;
    }
    this.changeLabel(Time + '/' + Relation + '/' + Enable);
  }

  public otherLableChange(event) {
    /*if (this.inputingOther !== '' && this.inputingOther !== undefined) {
      if (this.inputingLabel === '' || this.inputingLabel === null || this.inputingLabel === undefined) {
        this.inputingLabel = '/' + this.inputingOther;
      } else {
        if (this.inputingLabel.includes('/')) {
          this.inputingLabel = this.inputingLabel.substring(0, this.inputingLabel.indexOf('/')) + '/' + this.inputingOther;
        } else {
          this.inputingLabel = this.inputingLabel + '/' + this.inputingOther;
        }
      }
    } else {
      if (this.inputingLabel !== undefined && this.inputingLabel.includes('/')) {
        this.inputingLabel = this.inputingLabel.substring(0, this.inputingLabel.indexOf('/'));
      }
    }*/
    // this.EdgeLableChange({});
    this.changeLabel((this.inputingLabel ? this.inputingLabel : '') + (this.inputingOther ? '/' + this.inputingOther : ''));
    this._lastString = (this.inputingLabel ? this.inputingLabel : '') + (this.inputingOther ? '/' + this.inputingOther : '');
  }
  public EdgeLableChange(event: any) {
    const re = /^[0-9]+\.?[0-9]*$/;
    if (this.inputingLabel !== '' && this.inputingLabel !== null && this.inputingLabel !== undefined) {
      const split = this.inputingLabel.split('-');
      if (re.test(split[0])) {
        if (split.length > 1 && split[1] === '' && split[1].length >= this.PreLen1) {
          this.inputingLabel = this.inputingLabel + 'ES';
          // this.changeLabel(this.inputingLabel);
        }
        if (split.length > 2 && split[2] === '' && split[2].length >= this.PreLen2) {
          this.inputingLabel = this.inputingLabel + 'Y';
          // this.changeLabel(this.inputingLabel);
        }
        this.PreLen1 = split.length > 1 ? split[1].length : 0;
        this.PreLen2 = split.length > 2 ? split[2].length : 0;
      } else {

      }
    } else {
      // this.changeLabel(this.inputingLabel);
    }
    // this.changeLabel(this.inputingLabel);
    // this._lastString = this.inputingLabel;
    this.changeLabel((this.inputingLabel ? this.inputingLabel : '') + (this.inputingOther ? '/' + this.inputingOther : ''));
    this._lastString = (this.inputingLabel ? this.inputingLabel : '') + (this.inputingOther ? '/' + this.inputingOther : '');
  }

  public getJsonData(edges: any, nodes: any): any {
    // do something...
  }
}
