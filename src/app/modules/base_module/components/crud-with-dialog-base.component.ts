import { FormGroup } from '@angular/forms';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { AppTranslationService } from '../../base_module/services/app-translation-service';
import { ActionResponseDto } from '../../generated_module/dtos/action-response-dto';
import { AppPrivilegeService } from '../../auth_module/services/app-privilege-service';
import { AppSessionService } from '../../auth_module/services/app-session-service';
import { CrudBaseComponent } from './crud-base.component';
import { Observable } from 'rxjs';

/** 使用弹出框的增删查改页的组件基类 */
export abstract class CrudWithDialogBaseComponent extends CrudBaseComponent {
    /** 编辑弹出框是否可见 */
    editDialogVisible = false;
    /** 确认是否删除使用的消息模板 */
    removeConfirmTemplate = '確定要刪除嗎?';
    /** 编辑表单 */
    editForm = new FormGroup({});
    /** 编辑表单是否正在提交 */
    editFormSubmitting = false;
    /** 编辑表单使用的消息列表 */
    editMsgs = [];
    /** 选中的数据 */
    selectItems = [];

    /** 提交编辑到服务器 */
    abstract submitEdit(obj: any): Observable<ActionResponseDto>;
    /** 提交删除到服务器 */
    abstract submitRemove(obj: any): Observable<ActionResponseDto>;
    /** 批量提交删除到服务器 */
    abstract submitRemoveBath(obj: any): Observable<ActionResponseDto>;

    constructor(
        protected confirmationService: NzModalService,
        appSessionService: AppSessionService,
        appPrivilegeService: AppPrivilegeService,
        appTranslationService: AppTranslationService,
        message: NzMessageService) {
        super(appSessionService, appPrivilegeService, appTranslationService, message);
    }

    /** 在编辑表单显示消息 */
    displayEditMessage(severity: string, detail: string) {
        this.editMsgs = [{ severity: severity, detail: this.appTranslationService.translate(detail) }];
    }

    /** 重置按鈕状态 */
    reset() {
        this.allowEdit = false;
        this.allowRemove = false;
    }
    /** 添加数据 */
    add() {
        this.editMsgs = [];
        this.editForm.reset();
        this.editDialogVisible = true;
    }

    /** 编辑数据 */
    edit(obj: any) {
        this.editMsgs = [];
        this.editForm.reset();
        if (this.selectItems.length === 1) {
            this.editForm.patchValue(this.selectItems[0]);
        } else {
            this.editForm.patchValue(obj);
        }
        this.editDialogVisible = true;
    }

    /* 关闭编辑框 */
    editDialogClose() {
        this.editMsgs = [];
        this.editForm.reset();
        this.editDialogVisible = false;
    }

    /* 提交编辑表单 */
    editDialogSubmit() {
        this.editFormSubmitting = true;
        console.log('submit form', JSON.parse(JSON.stringify(this.editForm.value)));
        this.submitEdit(this.editForm.value).subscribe(
            s => {
                this.displayMessage('info', s.Message);
                this.searchWithLastParameters();
                this.editFormSubmitting = false;
                this.editDialogClose();
            },
            e => {
                this.displayEditMessage('error', e);
                this.editFormSubmitting = false;
            });
    }

    /** 删除数据 */
    remove(obj: any) {
        this.submitRemove(obj).subscribe(
            s => {
                this.displayMessage('info', s.Message);
                this.searchWithLastParameters();
            },
            e => this.displayMessage('error', e));
    }

    /** 批量删除数据 */
    removeBath(obj: any) {
        // 弹出确认框
        const name = '';
        const confirmMessage = this.appTranslationService.translate(this.removeConfirmTemplate)
            .replace('{0}', name);
        this.confirmationService.confirm({
            nzContent: confirmMessage,
            nzOnOk: () => {
                this.submitRemoveBath(this.selectItems).subscribe(
                    s => {
                        this.displayMessage('info', s.Message);
                        this.searchWithLastParameters();
                    },
                    e => this.displayMessage('error', e));
            }
        });
    }
}
