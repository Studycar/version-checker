import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd';
import { EditJobInfoService } from './edit-job-info.service';
import { ApsJobAdminService } from '../../../services/aps-job-admin.service';

@Component({
  selector: 'edit-job-info',
  templateUrl: './edit-job-info.component.html',
  styleUrls: ['./edit-job-info.component.css'],
  providers: [EditJobInfoService],
})
export class EditJobInfoComponent implements OnInit {
  @Input() edit = false;
  @Input() item: any | null = null;

  /** 下拉选项数据 */
  organizationId: any[] = [];
  buyers: any[] = [];
  planNames: any[] = [];
  executorHandlers: any[] = [];
  executorRouteStrategies: any[] = [];

  /** 任务类型 */
  executorHandlerType = 0;

  parameter = {
    executorHandler: '',
    jobGroup: '',
    jobDesc: '',
    executorRouteStrategy: 'FIRST', /** 第一个 */
    jobCron: '',
    glueType: 'BEAN',
    executorBlockStrategy: 'SERIAL_EXECUTION', /** 单机串行 */
    childJobId: '',
    executorTimeout: 0,
    executorFailRetryCount: '',
    author: '',
    alarmEmail: '',
    startImmediately: true, /** 立即执行 */
    /**
     * 根据任务类型提供不同的参数选项
     * 0：MRP
     * 1: 齐套
     * 2：备料
     *
     MRP
     {
       "planName": "M23"/!*计划名称，页面选择*!/
     }

     pc齐套json
     {
       "plantCode": "M23"/!*工厂组织，页面选择*!/
     }

     pc备料json
     {
       "executeType": "PCShippingNoticeHfCreate",/!*执行名称，写死*!/
       "plantCode": "M23",/!*工厂组织，页面选择*!/
       "buyer": "11014613",/!*采购员，页面选择*!/
       "listCategory": "",/!*采购品类，写死*!/
       "listItem": "",/!*物料号，页面输入*!/
       "refreshDemand": "Y",/!*写死*!/
       "refreshSupply": "Y",/!*写死*!/
       "fdStatus": ""/!*写死*!/
     }
     */
    executorParam: {
      0: { planName: '' },
      1: { plantCode: '' },
      2: {
        executeType: 'PCShippingNoticeHfCreate',
        plantCode: '',
        buyer: '',
        listCategory: '',
        listItem: '',
        refreshDemand: 'Y',
        refreshSupply: 'Y',
        fdStatus: '',
      },
    },
  };

  constructor(
    private modal: NzModalRef,
    private editJobInfoService: EditJobInfoService,
    private apsJobAdminService: ApsJobAdminService,
  ) {
  }

  ngOnInit() {
    /**
     * 获取工厂/组织
     */
    this.apsJobAdminService.getUserPlant().subscribe(res => {
      if (res !== null) {
        this.organizationId.push(...res);
        console.log(res);
      }
    });

    /**
     * 获取采购员
     */
    this.apsJobAdminService.getBuyerPageList().subscribe(res => {
      if (res !== null) {
        this.buyers.push(...res);
      }
    });

    /**
     * 获取计划名称
     */
    this.apsJobAdminService.getPlanName().subscribe(res => {
      if (res !== null) {
        this.planNames.push(...res);
      }
    });

    /**
     * 获取任务
     */
    this.editJobInfoService.getJobHandler().subscribe(res => {
      this.executorHandlers.push(...res);
    });

    /**
     * 获取路由策略
     */
    this.editJobInfoService.getExecutorRouteStrategies().subscribe(res => {
      if (res !== null) {
        this.executorRouteStrategies.push(...res);
      }
    });


    /** 编辑 */
    if (this.edit) {
      // let { ...parameter } = this.item;
    } else {
      /** 新增 */
    }
  }

  /**
   * 保存
   * 立即执行为true，保存后需要立即执行一次任务,为false,保存后直接启动该任务
   */
  save(): void {
    this.editJobInfoService.saveJobInfo();
    this.close();
  }

  close(): void {
    this.modal.destroy();
  }

  /**
   * 任务变更需要重新赋值执行器jobGroup，任务描述jobDesc
   * 参数提交选项也要变更
   * @param item
   */
  executorHandlerOnChange(item): void {
    this.executorHandlerType = item;
    this.editJobInfoService.getJobInfo().subscribe(res => {

    });
    console.log(item);
  }
}
