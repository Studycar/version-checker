import { OnInit, ViewChild } from '@angular/core';
import { AppTranslationService } from '../../base_module/services/app-translation-service';
import { GridSearchRequestDto } from '../../generated_module/dtos/grid-search-request-dto';
import { GridSearchResponseDto } from '../../generated_module/dtos/grid-search-response-dto';
import { GridSearchColumnFilter } from '../../generated_module/dtos/grid-search-column-filter';
import { GridSearchColumnFilterMatchMode } from '../../generated_module/dtos/grid-search-column-filter-match-mode';
import { AuthRequirement } from '../../auth_module/auth/auth-requirement';
import { AppPrivilegeService } from '../../auth_module/services/app-privilege-service';
import { AppSessionService } from '../../auth_module/services/app-session-service';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import { STComponent } from '@delon/abc';

/** 增删查改页的组件基类 */
export abstract class CrudBaseComponent implements OnInit {
    /** 是否载入中 */
    loading = false;
    /** 是否重复搜索，如果是需要在上一次结束后重新开始 */
    loadingDuplicated = false;
    /** 延迟搜索的句柄 */
    delaySearchHandler: any;
    /** 延迟搜索的时间 */
    delaySearchInterval = 500;
    /** 搜索条件的Json，防止多余搜索使用 */
    searchConditionJson = null;
    /** 当前页数据 */
    value: any[] = [];
    /** 当前页数 */
    page = 1;
    /** 单页最多显示的数量 */
    pageSize = 10;
    /** 总记录数量 */
    totalRecords = 0;
    /** 单页数量的选项 */
    rowsPerPageOptions = [10, 25, 50, 100, 500];
    /** 找不到数据时的文本 */
    emptyMessage: string;
    /** 是否允许添加数据 */
    allowAdd = false;
    /** 是否允许编辑数据 */
    allowEdit = false;
    /** 是否允许删除数据 */
    allowRemove = false;
    /* 查询实体 */
    searchEntity: any = {};
    /* 查询參數 */
    params: any = { };
    /** 初始化表格 */
    @ViewChild('st', {static: true}) st: STComponent;

    /** 提交搜索请求到服务器 */
    abstract submitSearch(request: GridSearchRequestDto): Observable<GridSearchResponseDto>;
    /** 获取添加所需的权限 */
    abstract getAddRequirement(): AuthRequirement;
    /** 获取编辑所需的权限 */
    abstract getEditRequirement(): AuthRequirement;
    /** 获取删除所需的权限 */
    abstract getRemoveRequirement(): AuthRequirement;
    /** 添加数据
        应该绑定添加按钮的点击事件
        例如 (click)="add()" */
    abstract add(): void;
    /** 编辑数据
        应该绑定编辑按钮的点击事件
        例如 (click)="edit(row)" */
    abstract edit(obj: any): void;
    /** 删除数据
        应该绑定删除按钮的点击事件
        例如 (click)="remove(row)" */
    abstract remove(obj: any): void;
    /** 批量删除数据
        应该绑定删除按钮的点击事件 */
    abstract removeBath(obj: any): void;

    constructor(
        protected appSessionService: AppSessionService,
        protected appPrivilegeService: AppPrivilegeService,
        protected appTranslationService: AppTranslationService,
        protected message: NzMessageService) {
        this.emptyMessage = this.appTranslationService.translate('No records found');
    }

    /** 初始化时的处理 */
    ngOnInit() {
        this.recheckPrivileges();
    }

    /** 重新检查权限 */
    recheckPrivileges() {
        // this.appSessionService.getSessionInfo().subscribe(sessionInfo => {
        //     this.allowAdd = this.appPrivilegeService.isAuthorized(
        //         sessionInfo.User, this.getAddRequirement()).success;
        //     this.allowEdit = this.appPrivilegeService.isAuthorized(
        //         sessionInfo.User, this.getEditRequirement()).success;
        //     this.allowRemove = this.appPrivilegeService.isAuthorized(
        //         sessionInfo.User, this.getRemoveRequirement()).success;
        //     this.isMasterTenant = sessionInfo.User.OwnerTenantIsMasterTenant;
        // });
    }

    /** 显示消息 */
    displayMessage(severity: string, detail: string) {
        this.message.create(severity, this.appTranslationService.translate(detail));
    }

    /** 搜索数据
        应该绑定表格的查询或分页事件
        例如(onLazyLoad)="search($event)" */
    search(e, noDelay = false) {
        // 检查是否多余搜索
        // 如果搜索条件和上次的一致则跳过搜索
        const json = JSON.stringify(e);
        // if (json === this.searchConditionJson) {
        //     return;
        // }
        e = JSON.parse(json);
        // 延迟搜索
        if (!noDelay) {
            if (this.delaySearchHandler) {
                clearTimeout(this.delaySearchHandler);
            }
            this.delaySearchHandler = setTimeout(() => this.search(e, true), 100);
            return;
        }
        // 检测是否重复搜索
        // 注意这个bug https://github.com/angular/angular/issues/6005
        if (this.loading) {
            this.loadingDuplicated = true;
            return;
        }
        // 设置载入中
        this.loading = true;
        this.searchConditionJson = json;
        console.log('search datatable', e);
        // 构建搜索请求
        const request = new GridSearchRequestDto();
        request.Keyword = e;
        request.Page = this.page;
        request.PageSize = this.pageSize;
        request.OrderBy = '';
        request.Ascending = e.sortOrder > 0;
        request.ColumnFilters = [];
        const filters = e.filters || {};
        for (const key in filters) {
            if (!filters.hasOwnProperty(key)) {
                continue;
            }
            const value = filters[key];
            const columnFilter = new GridSearchColumnFilter();
            columnFilter.Column = key;
            columnFilter.MatchMode = GridSearchColumnFilterMatchMode.Default;
            if (value.matchMode === 'startsWith') {
                columnFilter.MatchMode = GridSearchColumnFilterMatchMode.StartsWith;
            } else if (value.matchMode === 'endsWidth') {
                columnFilter.MatchMode = GridSearchColumnFilterMatchMode.EndsWith;
            } else if (value.matchMode === 'equals') {
                columnFilter.MatchMode = GridSearchColumnFilterMatchMode.Equals;
            } else if (value.matchMode === 'in') {
                columnFilter.MatchMode = GridSearchColumnFilterMatchMode.In;
            }
            columnFilter.Value = value.value;
            request.ColumnFilters.push(columnFilter);
        }
        // 调用搜索函数
        const setSearchResult = (value: any[], totalRecords: number, p: number) => {
            this.totalRecords = totalRecords;
            this.value = value;
            console.log('search page', this.page);
            // setTimeout(() => this.page = 2, 2000);
            // 设置已载入
            this.loading = false;
            // 如果在搜索途中条件有改变需要再搜索一次
            if (this.loadingDuplicated) {
                this.loadingDuplicated = false;
                setTimeout(() => this.search(e), 1);
            }
        };
        this.submitSearch(request).subscribe(
            r => setSearchResult(r.Result, r.TotalCount, r.Page),
            ee => {
                this.displayMessage('error', ee);
                setSearchResult([], 0, 1);
            });
    }

    /** 以上次的参数搜索数据 */
    searchWithLastParameters() {
        this.st.load(1, this.params);
        if (!this.searchConditionJson) {
            return;
        }
        const condition = JSON.parse(this.searchConditionJson);
        this.searchConditionJson = '';
        // this.search(condition);
    }
}
