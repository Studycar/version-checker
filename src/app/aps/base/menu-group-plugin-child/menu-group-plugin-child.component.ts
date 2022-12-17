import { Component, OnInit, ViewChild } from '@angular/core';
import { filter } from 'rxjs/operators';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseMenuGroupPluginChildEditComponent } from './edit/edit.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../modules/base_module/services/app-translation-service';
import { CommonQueryService } from '../../../modules/generated_module/services/common-query.service';
import { BaseMenuGroupPluginChildEditService } from './edit.service';

export interface TreeNodeInterface {
  menuId: string;
  menuName: string;
  functionName: string;
  menuType: string;
  orderSeq: string;
  applicationName: string;

  applicationId: string;
  parentMenuId: string;
  menuGroupId: string;
  id: string;
  language: string;

  level: number;
  expand: boolean;
  children?: TreeNodeInterface[];
}
/**
 * 菜单组-分配菜单
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'base-menu-group-plugin-child',
  templateUrl: './menu-group-plugin-child.component.html',
  styleUrls: ['./menu-group-plugin-child.component.css'],
  providers: [BaseMenuGroupPluginChildEditService],
})
export class BaseMenuGroupPluginChildComponent implements OnInit {


  params: any = {};

  applicationRateType: any[] = [];
  i: any = {};
  p: any = {};
  PageSizeOptions = [10, 20, 30, 40, 50];
  isExpand = false;

  anticon = 'anticon anticon-plus-square-o';  // 全部展开样式
  small = 'small';
  styleColor = { 'background-color': 'rgb(245, 245, 245)' };


  public spanStyle = {
    'cursor': 'Pointer'

  };

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public editService: BaseMenuGroupPluginChildEditService,
    private appTranslationService: AppTranslationService,
    private confirmationService: NzModalService,
    private commonQueryService: CommonQueryService,
  ) {
   }


  data: any[] = [];

  tmpMap: any = [];
  tmpMapAll: {};

  // 查询菜单数据
  getDate() {


    this.editService.SearchGetMenuInfo(this.params).subscribe(resultMes => {

      this.data = resultMes.data;

      this.data.forEach(item => {
       // console.log(item.key);
        this.expandDataCache[item.menuId] = this.convertTreeToList(item, false);
      });

    });
  }

    // 菜单类型
    public loadRateType(): void {
      this.commonQueryService.GetLookupByType('FND_MENU_TYPE').subscribe(result => {
        result.Extra.forEach(d => {
          this.applicationRateType.push({
            label: d.meaning,
            value: d.lookupCode,
          });
        });
      });
    }

  // 过滤替换 列表中快码的值
  public optionsFind(value: string): any {
    return this.applicationRateType.find(x => x.value === value) || { label: value };
  }


  ngOnInit() {


    this.params = {
      id: this.p.id,
      code: this.p.code,
      name: this.p.name,
      appName: this.p.appName,
      language: this.p.language,
    };
    this.loadRateType();
    this.getDate();

  }

  // 重新画菜单
  expandDataCache = {};

  collapse(
    array: TreeNodeInterface[],
    data: TreeNodeInterface,
    $event: boolean,
  ): void {
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.menuId === d.menuId);
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: object, showType: boolean): TreeNodeInterface[] {
    const stack = [];
    const array = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: showType });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            ...node.children[i],
            level: node.level + 1,
            expand: showType,
            parent: node,
          });
        }
      }
    }

    return array;
  }

  visitNode(
    node: TreeNodeInterface,
    hashMap: object,
    array: TreeNodeInterface[],
  ): void {
    if (!hashMap[node.menuId]) {
      hashMap[node.menuId] = true;
      array.push(node);
    }
  }



  // 全部展开
  showMinus() {

    if (!this.isExpand) {
      this.isExpand = true;
      this.anticon = 'anticon anticon-minus-square-o';  // 全部展开样式

      this.data.forEach(item => {
        this.expandDataCache[item.menuId] = this.convertTreeToList(item, this.isExpand);
      });
    } else {
      this.isExpand = false;

      this.anticon = 'anticon anticon-plus-square-o';  // 全部收缩
      this.data.forEach(item => {
        this.expandDataCache[item.menuId] = this.convertTreeToList(item, this.isExpand);
      });
    }

}

  // 全部收缩
  showPlus() {
    this.data.forEach(item => {
      this.expandDataCache[item.menuId] = this.convertTreeToList(item, false);
    });
}

  // 新增 顶层菜单
  public add() {
    this.modal
      .static(BaseMenuGroupPluginChildEditComponent, {

        i: {

          menuGroupId: this.p.id,  // 菜单组ID
          parentMenuId: this.p.id, // 菜单组ID
          menuId:   null,
          functionName: null,
          applicationId: null,
          menuType:  null,
          orderSeq:  null,
          id: null,                 // 权限ID
          mType: 'MENUTOP',
          menuGroupType : 'MENUTOP'
        },
      })
      .subscribe((value) => {
        if (value) {
          this.getDate();
        }
      });
  }

  // 编辑菜单
  public edit(item: any) {
    this.modal
      .static(BaseMenuGroupPluginChildEditComponent, {

        i: {

          menuGroupId: item.menuGroupId ,
          parentMenuId: item.parentMenuId ,
          menuId:   item.menuId ,
          functionName: item.functionName ,
          applicationId:  item.applicationId ,
          menuType:  item.menuType ,
          orderSeq:  item.orderSeq ,
          id: item.id,  // 权限ID
          mType: 'EDITMENU',
          menuGroupType:'EDITMENU'
        },
      })
      .subscribe(() => {
        console.log('');
        this.getDate();
      });
  }



  public remove(obj: any) {
    this.editService.Remove(obj).subscribe(res => {
      if (res.code === 200) {
        this.msgSrv.success(this.appTranslationService.translate('删除成功'));

        this.getDate();

      } else {
        this.msgSrv.warning(this.appTranslationService.translate(res.msg));
      }
    });
  }

  // 新增同级
  public  AddMENU(item: any) {
    this.modal
      .static(BaseMenuGroupPluginChildEditComponent, {
        i: {

          menuGroupId: item.menuGroupId ,
          parentMenuId: item.parentMenuId ,
          menuId:   null ,
          functionName: null ,
          applicationId:  null ,
          menuType:  null,
          orderSeq:  null,
          id: item.id,
          mType: 'ADDMENU',
          menuGroupType:'ADDMENU'
        },
      })
      .subscribe(() => {
        console.log('');
        this.getDate();
      });
  }

  public AddMENUCHILD(item: any) {
    if (item.level > 0) {
      this.msgSrv.warning(this.appTranslationService.translate('子菜单不能添加子菜单'));
    }
    this.modal
      .static(BaseMenuGroupPluginChildEditComponent, {
        i: {
          menuGroupId: item.menuGroupId ,
          parentMenuId: item.menuId ,
          menuId:   null ,
          functionName: null ,
          applicationId:  null ,
          menuType:  null,
          orderSeq:  null,
          id: item.id,
          mType: 'ADDMENUCHILD',
          menuGroupType:'ADDMENUCHILD'
        },
      })
      .subscribe(() => {
        console.log('');
        this.getDate();
      });
  }


  datasEx: any[] = [];
  @ViewChild('stEx', {static: true}) stEx: STComponent;
  columnsEx: STColumn[] = [
    { title: '菜单名', index: 'menuName', width: '200px'},
    { title: '应用模块', index: 'applicationName' , width: '200px'},
    { title: '功能', index: 'functionName' , width: '200px'},
    { title: '菜单类型', index: 'menuType' , width: '200px'},

  ];
  export() {
    this.editService.SearchGetMenuInfo(this.p).subscribe(resultMes => {
      this.datasEx.length = 0;
      resultMes.data.forEach(em => {
        this.datasEx.push({
          menuName: this.null2Empty(em.menuName),
          applicationName: this.null2Empty(em.applicationName),
          functionName: this.null2Empty(em.functionName),
          menuType: this.null2Empty(em.menuType),
        });
      });
      this.stEx.export(this.datasEx, {
        filename: 'export.xlsx',
        sheetname: 'Data',
      });
    });
  }
  null2Empty(input: any): string {
    return input === undefined || input === null ? '' : input;
  }


}
