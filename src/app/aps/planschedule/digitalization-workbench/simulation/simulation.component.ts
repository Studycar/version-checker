import { Component, ViewChild, ElementRef, Renderer2, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { ActivatedRoute } from '@angular/router';
import { EditService } from '../edit.service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../../../modules/base_module/services/app-translation-service';
import { CustomBaseContext } from '../../../../modules/base_module/components/custom-base-context.component';
import { PlanscheduleMoexceptionAgComponent } from '../../moexception/moexception-ag.component';
import { PlanscheduleDigitalizationWorkbenchSearchComponent } from '../search/search.component';
import { PlanscheduleDigitalizationWorkbenchPlanReleaseComponent } from '../planrelease/planrelease.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'planschedule-digitalization-workbench-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.less'],
  providers: [EditService],
})
export class PlanscheduleDigitalizationWorkbenchSimulationComponent
  extends CustomBaseContext
  implements OnInit {
  fullyVideoShow = false; // 全屏视频层呈现

  @ViewChild('fullyVideo', { static: false })
  fullyVideo: ElementRef;

  public simulationVideoInfo = {
    IsVideo: true,
    version: '',
    simulationVideoPath: '',
  };

  public psVideo: any[]

  /*    ---------------------------------------------------------- */
  // 查询参数
  public i: any = {
    regionCode: '',
    plantCode: '',
    groupCode: null,
    lineIdsStr: '',
    startTime: null,
    endTime: null,
    selection: [],
    expand: [],
    treeDataTable: [],
    dateRange: [new Date(), this.editService.addDays(new Date(), 7)],
  };

  constructor(
    private modal: ModalHelper,
    public msgSrv: NzMessageService,
    public http: _HttpClient,
    private appTranslationService: AppTranslationService,
    private editService: EditService,
    private routeInfo: ActivatedRoute,
    private render: Renderer2,
  ) {
    super({
      appTranslationSrv: appTranslationService,
      msgSrv: msgSrv,
      appConfigSrv: null,
    });
  }

  ngOnInit(): void {
    this.routeInfo.queryParams.subscribe(queryParams => {
      if (queryParams.i) {
        this.i = JSON.parse(queryParams.i);
      }
    });
    this.simulationVideo();
  }

  simulationVideo() {
    this.editService.simulationVideo().subscribe(result => {
      if (result === null || result.code !== 200) {
        this.msgSrv.error(this.appTranslationService.translate(result.msg || "操作失败"), this.msgOption);
      } else {
        let data = result.data;
        this.psVideo = data.map(d => { return { version: d.version, path: d.videoPath } })
        this.simulationVideoInfo.simulationVideoPath = this.psVideo[0].path;
        this.simulationVideoInfo.version = this.psVideo[0].version;
      }
    });
  }

  changeVideo(e): void {
    this.simulationVideoInfo.version = this.psVideo.find(p => p.path === e).version;
  }

  // 排产发布
  public planRelease(): void {
    this.modal
      .static(PlanscheduleDigitalizationWorkbenchSearchComponent, { i: this.i }, 'lg')
      .subscribe((value) => {
        if (value) {
          this.refreshOperate();
          const lineCodes = [];
          let groupCode = '';
          this.i.selection.forEach(x => { if (x.level === 1) { lineCodes.push(x.code); groupCode = x.parent.code; } });
          this.modal
            .static(PlanscheduleDigitalizationWorkbenchPlanReleaseComponent,
              {
                i: {},
                regionCode: this.i.regionCode,
                plantCode: this.i.plantCode,
                lineCodes: lineCodes,
                startTime: this.i.startTime,
                endTime: this.i.endTime,
                schedule_group_code: groupCode,
                mainForm: this.context
              }, 'lg').subscribe(v => {
                if (v) {
                  this.query();
                }
              });
        }
      });

  }

  // 刷新服务请求
  private refreshOperate() {
    const lineCodes = [];
    // 开始加载
    this.setLoading(true);
    // 获取选中资源编码
    this.i.selection.forEach(x => { if (x.level === 1) { lineCodes.push(x.code); } });
    const plantCode = this.i.plantCode;
    this.editService.Refresh(plantCode, lineCodes, this.editService.formatDate(this.i.startTime), this.editService.formatDate(this.i.endTime)).subscribe(result => {
      if (result === null || result.code !== 200) {
        this.msgSrv.error(this.appTranslationService.translate(result.msg || "操作失败"), this.msgOption);
      }
      // 加载完毕
      this.setLoading(false);
    });
  }

  // 例外数据
  public moException(): void {
    this.modal.static(PlanscheduleMoexceptionAgComponent, { version: this.simulationVideoInfo.version }, 'xl').subscribe(() => { });
  }

  // 全屏
  public fullScreen(): void {
    this.fullyVideoShow = true;
    const el = this.fullyVideo.nativeElement;
    const requestFullScreen =
      el.requestFullScreen ||
      el.webkitRequestFullScreen ||
      el.mozRequestFullScreen ||
      el.msRequestFullScreen;
    el.play();
    if (requestFullScreen) requestFullScreen.call(el);
    this.render.setStyle(document.documentElement, 'overflow', 'hidden');
  }
  // 关闭全屏视频
  closeFullyVideo() {
    this.fullyVideoShow = false;
    this.fullyVideo.nativeElement.pause();
    this.render.setStyle(document.documentElement, 'overflow', 'auto');
  }
  // 播放暂停视频
  playOrPause() {
    const el = this.fullyVideo.nativeElement;
    if(el.isPlay){
      el.pause();
      el.isPlay = false;
    }else{
      el.play();
      el.isPlay = true;
    }
   
  }
}

