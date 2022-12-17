import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { AppTranslationService } from 'app/modules/base_module/services/app-translation-service';
import { CustomTreeViewComponent } from 'app/modules/base_module/components/custom-tree-view.component';
import { guid } from '@progress/kendo-angular-grid/dist/es2015/utils';
import { AppConfigService } from '../../../../modules/base_module/services/app-config-service';
import { OPGraphicalWorkbenchService } from '../services/op-graphical-workbench.service';
import { GetGraphicalWorkbenchQueryConditionsOutputDto } from '@shared/model/graphicalworkbench/get-graphical-workbench-query-conditions-output-dto';
import { GetScheduleGroupResourcesInputDto } from '@shared/model/graphicalworkbench/get-schedule-group-resources-input-dto';
import { GetScheduleGroupResourcesOutputDto } from '@shared/model/graphicalworkbench/get-schedule-group-resources-output-dto';
import { GetGraphicalWorkbenchDataInputDto } from '@shared/model/graphicalworkbench/get-graphical-workbench-data-input-dto';
import { GetGraphicalWorkbenchDataOutputDto } from '@shared/model/graphicalworkbench/get-graphical-workbench-data-output-dto';
import { GetScheduleGroupCodesInputDto } from '@shared/model/graphicalworkbench/get-schedule-group-codes-input-dto';
import { GetScheduleGroupCodesOutputDto } from '@shared/model/graphicalworkbench/get-schedule-group-codes-output-dto';

@Component({
  selector: 'op-graphical-workbench-search',
  templateUrl: './op-graphical-workbench-search.component.html',
  styleUrls: ['./op-graphical-workbench-search.component.css'],
  providers: [OPGraphicalWorkbenchService]
})
export class OPGraphicalWorkbenchSearchComponent implements OnInit {

  constructor(private graphicalWorkbenchService: OPGraphicalWorkbenchService,
    private msgSrv: NzMessageService,
    private appTranslationService: AppTranslationService,
    private modal: NzModalRef,
    private appConfigService: AppConfigService) { }

  public graphicalWorkbenchQueryConditionsOutputDto: GetGraphicalWorkbenchQueryConditionsOutputDto;
  public scheduleGroupResourcesInputDto: GetScheduleGroupResourcesInputDto;
  public scheduleGroupResourcesOutputDto: GetScheduleGroupResourcesOutputDto;
  public graphicalWorkbenchDataInputDto: GetGraphicalWorkbenchDataInputDto;
  public graphicalWorkbenchDataOutputDto: GetGraphicalWorkbenchDataOutputDto;

  public scheduleRegionCodes: any[];
  public plantCodes: any[];
  public groupCodes: any[];
  public dateRange: any[];

  searchResult: any;
  searchLoading: boolean;
  canvasFlag = false;

  @ViewChild('treeView', {static: true}) treeView: CustomTreeViewComponent;
  public treeDataTable: any[] = []; // 产线树形多选结构数据{field1,field2...,children?:any}
  public treeNodeColumns = [
    { field: 'CODE', title: '名称', width: '50%' },
    { field: 'DESCRIPTION', title: '描述', width: '50%' }
  ]; // 产线树形显示列
  public SelectResourceCodes = [];

  ngOnInit() {
    this.searchLoading = false;
    this.scheduleGroupResourcesInputDto = new GetScheduleGroupResourcesInputDto();
    this.GetGraphicalWorkbenchQueryConditions();
  }

  private GetGraphicalWorkbenchQueryConditions() {
    this.graphicalWorkbenchService.GetGraphicalWorkbenchQueryConditions().subscribe(res => {
      if (res.Success === true) {
        this.graphicalWorkbenchQueryConditionsOutputDto = res.Extra;
        if (this.graphicalWorkbenchQueryConditionsOutputDto.ScheduleRegionPlants.length > 0) {
          // ScheduleRegionCode
          this.scheduleRegionCodes = [];
          this.graphicalWorkbenchQueryConditionsOutputDto.ScheduleRegionPlants.forEach(kvp => {
            this.scheduleRegionCodes.push({ value: kvp.Key, label: kvp.Key });
          });
          // PlantCodes 默认工厂
          this.plantCodes = [];
          if (this.searchResult !== undefined) {
            this.scheduleGroupResourcesInputDto.ScheduleRegionCode = this.searchResult.ScheduleRegionCode;
            this.scheduleGroupResourcesInputDto.PlantCode = this.searchResult.PlantCode;
          } else {
            this.scheduleGroupResourcesInputDto.PlantCode = this.appConfigService.getPlantCode();
            if (this.scheduleGroupResourcesInputDto.PlantCode) {
              this.graphicalWorkbenchQueryConditionsOutputDto.ScheduleRegionPlants.forEach(kvp => {
                kvp.Value.forEach(pc => {
                  if (pc === this.scheduleGroupResourcesInputDto.PlantCode) {
                    this.scheduleGroupResourcesInputDto.ScheduleRegionCode = kvp.Key;
                    return;
                  }
                });
                if (this.scheduleGroupResourcesInputDto.ScheduleRegionCode) {
                  return;
                }
              });
            } else {
              this.scheduleGroupResourcesInputDto.ScheduleRegionCode = this.scheduleRegionCodes[0].value;
            }
          }
          this.graphicalWorkbenchQueryConditionsOutputDto.ScheduleRegionPlants.forEach(kvp => {
            if (this.scheduleGroupResourcesInputDto.ScheduleRegionCode === kvp.Key) {
              kvp.Value.forEach(pc => {
                this.plantCodes.push({ value: pc, label: pc });
              });
            }
          });
          if (this.plantCodes.length > 0 && !this.scheduleGroupResourcesInputDto.PlantCode) {
            this.scheduleGroupResourcesInputDto.PlantCode = this.plantCodes[0].value;
          }

          this.GetScheduleGroupCodes();
        }
        // dateRange
        this.dateRange = [];
        if (this.searchResult !== undefined) {
          this.dateRange.push(this.searchResult.dateRange.StartDate);
          this.dateRange.push(this.searchResult.dateRange.EndDate);
        } else {
          this.dateRange.push(this.graphicalWorkbenchQueryConditionsOutputDto.StartDate);
          this.dateRange.push(this.graphicalWorkbenchQueryConditionsOutputDto.EndDate);
        }
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
      }
    });
  }

  private GetScheduleGroupCodes() {
    if (this.scheduleGroupResourcesInputDto.ScheduleRegionCode === undefined
      || this.scheduleGroupResourcesInputDto.PlantCode === undefined) {
      return;
    }
    const inputDto: GetScheduleGroupCodesInputDto = new GetScheduleGroupCodesInputDto();
    inputDto.ScheduleRegionCode = this.scheduleGroupResourcesInputDto.ScheduleRegionCode;
    inputDto.PlantCode = this.scheduleGroupResourcesInputDto.PlantCode;

    this.graphicalWorkbenchService.GetScheduleGroupCodes(inputDto).subscribe(res => {
      if (res.Success === true) {
        const outPutDto: GetScheduleGroupCodesOutputDto = res.Extra;
        if (outPutDto.GroupCodes.length > 0) {
          this.groupCodes = [];
          outPutDto.GroupCodes.forEach(groupCode => {
            this.groupCodes.push({ value: groupCode, label: groupCode });
          });

          if (this.searchResult !== undefined && this.searchResult.ScheduleGroupCode !== undefined) {
            this.scheduleGroupResourcesInputDto.ScheduleGroupCode = this.searchResult.ScheduleGroupCode;
          } else {
            this.scheduleGroupResourcesInputDto.ScheduleGroupCode = null;
          }
          this.groupChange(this.scheduleGroupResourcesInputDto.ScheduleGroupCode);
        }
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
      }
    });
  }

  // 切换事业部
  public regionChange(value: any) {
    if (this.scheduleGroupResourcesInputDto.ScheduleRegionCode === undefined) {
      return;
    }
    this.plantCodes = [];
    // 加载工厂
    this.graphicalWorkbenchQueryConditionsOutputDto.ScheduleRegionPlants.forEach(kvp => {
      if (kvp.Key === this.scheduleGroupResourcesInputDto.ScheduleRegionCode) {
        kvp.Value.forEach(pc => {
          this.plantCodes.push({ value: pc, label: pc });
        });
        this.scheduleGroupResourcesInputDto.PlantCode = this.plantCodes[0].value;
        this.plantChange(this.scheduleGroupResourcesInputDto.PlantCode);
      }
    });
  }

  public plantChange(value: any) {
    if (this.scheduleGroupResourcesInputDto.PlantCode === undefined) {
      return;
    }
    this.GetScheduleGroupCodes();
  }

  public groupChange(value: any) {
    if (this.scheduleGroupResourcesInputDto.ScheduleGroupCode === undefined || this.scheduleGroupResourcesInputDto.ScheduleGroupCode === null) {
      this.scheduleGroupResourcesInputDto.ScheduleGroupCode = null;
    }

    this.graphicalWorkbenchService.GetScheduleGroupResources(this.scheduleGroupResourcesInputDto).subscribe(res => {
      if (res.Success === true) {
        this.scheduleGroupResourcesOutputDto = res.Extra;
        this.treeDataTable = [];
        if (this.scheduleGroupResourcesOutputDto.ScheduleGroupResources.length > 0) {
          this.scheduleGroupResourcesOutputDto.ScheduleGroupResources.forEach(sgr => {
            const groupData = { ID: guid(), CODE: sgr.Code, DESCRIPTION: sgr.Descriptions, children: [] };
            if (sgr.Resources.length > 0) {
              sgr.Resources.forEach(ress => {
                groupData.children.push({ ID: guid(), CODE: ress.Code, DESCRIPTION: ress.Descriptions });
              });
            }
            this.treeDataTable.push(groupData);
          });

          if (this.searchResult !== undefined && this.searchResult.treeDataTable !== undefined) {
            this.treeDataTable = this.searchResult.treeDataTable;
            this.SelectResourceCodes = this.searchResult.SelectResourceCodes;
            this.searchResult = undefined;
          }
        }
      } else {
        this.msgSrv.error(this.appTranslationService.translate(res.Message));
      }
    });
  }

  public GetGraphicalWorkbenchData() {
    this.treeView.select();

    if (this.SelectResourceCodes.length === 0) {
      this.msgSrv.warning(this.appTranslationService.translate('请选择资源!'));
    } else {
      if (this.dateRange.length === 0) {
        this.msgSrv.warning(this.appTranslationService.translate('请选择日期范围!'));
      } else {
        this.searchLoading = true;

        this.graphicalWorkbenchDataInputDto = new GetGraphicalWorkbenchDataInputDto();
        this.graphicalWorkbenchDataInputDto.StartDate = this.dateRange[0];
        this.graphicalWorkbenchDataInputDto.EndDate = this.dateRange[1];
        this.graphicalWorkbenchDataInputDto.ScheduleGroupResources = [];
        this.graphicalWorkbenchDataInputDto.PlantCode = this.scheduleGroupResourcesInputDto.PlantCode;
        // 保存查询参数
        this.searchResult = {
          ScheduleRegionCode: this.scheduleGroupResourcesInputDto.ScheduleRegionCode,
          PlantCode: this.scheduleGroupResourcesInputDto.PlantCode,
          ScheduleGroupCode: this.scheduleGroupResourcesInputDto.ScheduleGroupCode,
          dateRange: { StartDate: this.dateRange[0], EndDate: this.dateRange[1] },
          treeDataTable: this.treeDataTable,
          SelectResourceCodes: this.SelectResourceCodes,
          ScheduleGroupResources: [],
          graphicalWorkbenchDataOutputDto: {}
        };

        // 先遍历GroupCode 剔除0层数据
        this.SelectResourceCodes = this.SelectResourceCodes.filter(selectRes => selectRes.level !== 0);
        this.SelectResourceCodes.forEach(selectRes => {
          let kvp = this.graphicalWorkbenchDataInputDto.ScheduleGroupResources.find(gp => gp.Key === selectRes.parent.CODE);
          if (kvp == null) {
            kvp = { Key: selectRes.parent.CODE, Value: [] };
            this.graphicalWorkbenchDataInputDto.ScheduleGroupResources.push(kvp);
          }
          kvp.Value.push(selectRes.CODE);
        });

        if (this.canvasFlag) {
          this.graphicalWorkbenchService.GetGraphicalWorkbenchDataCanvas(this.graphicalWorkbenchDataInputDto).subscribe(res => {
            this.searchLoading = false;
            this.searchResult.graphicalWorkbenchDataOutputDto = res.Extra;
            this.searchResult.ScheduleGroupResources = this.graphicalWorkbenchDataInputDto.ScheduleGroupResources;
            this.modal.destroy(this.searchResult);
          });
        } else {
          this.graphicalWorkbenchService.GetGraphicalWorkbenchData(this.graphicalWorkbenchDataInputDto).subscribe(res => {
            this.searchLoading = false;
            this.searchResult.graphicalWorkbenchDataOutputDto = res.Extra;
            this.searchResult.ScheduleGroupResources = this.graphicalWorkbenchDataInputDto.ScheduleGroupResources;
            this.modal.destroy(this.searchResult);
          });
        }
      }
    }
  }

  public clear() {
    this.GetGraphicalWorkbenchQueryConditions();
  }

  public close() {
    this.searchLoading = false;
    this.modal.destroy();
  }
}
