import { Component, TemplateRef } from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { NoticeItem, NoticeIconList } from '@delon/abc';
import { BaseUserMessageService } from 'app/modules/generated_module/services/base-user-message-service.component';
import { Router } from '@angular/router';
import { AppHubMessageService } from 'app/modules/base_module/services/app-hubmessage-service';
import { AppConfigService } from 'app/modules/base_module/services/app-config-service';

/**
 * 菜单通知
 */
@Component({
  selector: 'layout-pro-notify',
  templateUrl: './notify.component.html',
  styles: [`.alain-pro__header-item ::ng-deep .ant-badge-count {top: -4px; right: -4px;} `]
})
export class LayoutProWidgetNotifyComponent {

  data: NoticeItem[] = [
    {
      title: '通知',
      list: [],
      emptyText: '你已查看所有通知',
      emptyImage:
        'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
      clearText: '清空通知',
    },
    {
      title: '消息',
      list: [],
      emptyText: '您已读完所有消息',
      emptyImage:
        'https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg',
      clearText: '清空消息',
    },
    {
      title: '待办',
      list: [],
      emptyText: '你已完成所有待办',
      emptyImage:
        'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
      clearText: '清空待办',
    },
    {
      title: '历史消息',
      list: [],
      emptyText: '暂无历史消息',
      emptyImage:
        'https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg',
      clearText: '删除历史消息',
    },
  ];
  popoverVisible = false;
  count = 0;
  loading = false;
  messageType = -1;    // 消息类型（所有：-1，消息：0，通知：1，待办：2，历史消息：3）
  day = -1;            // 多少天内的消息（小于等于零为所有）

  constructor(
    private msg: NzMessageService,
    private messageService: BaseUserMessageService,
    private modalService: NzModalService,
    private router: Router,
    private appHubMessageService: AppHubMessageService,
    private appConfigService: AppConfigService
  ) {
    // this.getMeCount(this.day);
    // console.log('注册接收到消息推送');

    // 接收进度推送
    this.appHubMessageService.receiveMessageCount().subscribe((data) => {
      // console.log('接收到消息推送:' + JSON.stringify(data));
      const list = [...data.data];
      list.forEach(element => {
        if (element.receiver === this.appConfigService.getUserId()) {
          this.msg.info(element.title, {
            nzDuration: 10000
          });
        }
      });
      this.getMeCount(this.day);
    });
  }

  style = {
    width: 300
  };

  getMeCount(day: number) {
    this.messageService.getMessageCount(day).subscribe(res => {
      if (res.Success) {
        this.count = res.Extra;
      }
    });
    // setTimeout(ctx.getMeCount, 30000, ctx, ctx.day);
  }

  updateNoticeData(notices: NoticeIconList[]): NoticeItem[] {
    const data = this.data.slice();
    data.forEach(i => (i.list = []));

    notices.forEach(item => {
      const newItem = { ...item };
      if (newItem.datetime)
        newItem.datetime = `${distanceInWordsToNow(item.datetime, {
          locale: (window as any).__locale__,
        })}前`;
      if (newItem.extra && newItem.status) {
        newItem.color = {
          todo: undefined,
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newItem.status];
      }
      data.find(w => w.title === newItem.type).list.push(newItem);
    });
    return data;
  }

  loadData(value) {
    if (!value) return;
    if (this.loading) return;
    this.loading = true;
    setTimeout(() => {
      this.messageService.getMessageDetail(this.messageType, this.day).subscribe(res => {
        const messageList: NoticeIconList[] = [];
        res.Extra.forEach(element => {
          const messagetext: NoticeIconList = {
            type: element.MESSGAE_TYPE === 1 ? '通知' : (element.MESSGAE_TYPE === 2 ? '待办' : (element.MESSGAE_TYPE === 3 ? '历史消息' : '消息')),
            title: element.TITLE,
            description: this.cutMessage(element.MESSGAE),
            status: element.STATE === 1 ? 'urgent' : (element.STATE === 2 ? 'processing' : 'doing'),
            id: element.Id,
            avatar: this.judegeRead(element.MESSGAE.indexOf('正常') > 0 || element.MESSGAE.indexOf('成功') > 0),
            datetime: element.RECEIVED_DATE,
            read: element.ISREAD === 'Y',
            requestId: element.MESSGAE.match(/\d+/g)[0],
            messageStatus: element.MESSGAE.indexOf('正常') > 0 || element.MESSGAE.indexOf('成功') > 0 ? 'success' : 'error',
            message: element.MESSGAE
          };
          messageList.push(messagetext);
        });
        this.updateNoticeData(messageList);
        this.loading = false;
      });
    }, 1000);
  }

  judegeRead(value: any): string {
    if (value) {
      // return 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png';
      return '../../../../../assets/icons/success.svg';
    } else {
      // return 'https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg';
      return '../../../../../assets/icons/failure.svg';
    }
  }

  cutMessage(value: string): string {
    const a = value.split('');
    if (a.length >= 29) {
      const c = a.splice(0, 25).join('') + '...';
      return c;
    } else {
      return a.join('');
    }
  }

  clear(type: string) {
    const clearList: NoticeIconList[] = this.data.find(item => item.title === type).list;
    const unReadMessageCount = clearList.filter(item => !item.read).length;
    const messageType = type === '消息' ? 0 : (type === '通知' ? 1 : (type === '待办' ? 2 : 3));
    this.messageService.clearAll(messageType).subscribe(res => {
      if (res.Success === true) {
        this.count = this.count - unReadMessageCount;
        this.msg.success(`清空了 ${type}`);
        this.loadData(true);
      } else {
        this.msg.error(res.Message);
      }
    });
  }

  tplModal: NzModalRef;
  messageStatus: string;
  messageTitle: string;
  requestId: string;
  requestResult: string;
  createTplModal(tplContent: TemplateRef<{}>, res: any): void {
    this.tplModal = this.modalService.create({
      nzContent: tplContent,
      nzFooter: null,
      nzMaskClosable: false,
      nzClosable: true,
      nzWidth: 500,
      nzBodyStyle: {
        'white-space': 'pre',
        'color': 'red',
        'font-family': '幼圆',
        'font-size': '18px'
      }
    });
    this.messageStatus = res.item.messageStatus;
    this.messageTitle = res.item.title;
    this.requestId = res.item.requestId;
    this.requestResult = res.item.message;
    if (!res.item.read) {
      this.tplModal.afterOpen.subscribe(() => {
        this.isRead(res.item.id);
      });
      res.item.read = true;
      this.count--;
    }
  }

  // 忽略
  destroyTplModal(id) {
    this.messageService.ignoreMessage(id).subscribe(res => {
      if (res.Success === true) {
        this.loadData(true);
        this.tplModal.destroy();
      }
    });
  }

  isRead(messageId) {
    this.messageService.readMessage(messageId).subscribe();
  }

  toRequestPage() {
    this.router.navigate(['/concurrent-request/request-submit-query']);
    this.tplModal.destroy();
    this.popoverVisible = false;
  }
}
