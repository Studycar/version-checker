import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { BaseFlexValueSetsInputDto } from 'app/modules/generated_module/dtos/base-flex-value-sets-input-dto';
import { BaseFlexValidationTablesInputDto } from 'app/modules/generated_module/dtos/base-flex-validation-tables-input-dto';
import { ResponseDto } from '../dtos/response-dto';

@Injectable()
/** 值集定义服务 */
export class BaseFlexValueSetsManageService {
    constructor(private appApiService: AppApiService) { }

    // seachUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaseflexvaluesets/baseflexvaluesets/SearchGet';

    seachDetailUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverbaseflexvaluesets/baseflexvaluesets/SearchDetailGet';

    /** 搜索快码 */
    Search(request: GridSearchRequestDto): Observable<GridSearchResponseDto> {
        return this.appApiService.call<GridSearchResponseDto>(
            '/afs/serverbaseflexvaluesets/baseflexvaluesets/Search',
            {
                request
            });
    }

    /** 获取值集 */
    Get(flex_value_set_id: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseflexvaluesets/getById?flexValueSetId=' + flex_value_set_id,
            {
            }, { method: 'GET' });
    }

    /** 编辑值集 */
    Edit(dto: BaseFlexValueSetsInputDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseflexvaluesets/edit',
            
                dto
            );
    }

    /** 删除快码 */
    Remove(dto: BaseFlexValueSetsInputDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseflexvaluesets/remove',
            
                dto
            );
    }
    /** 批量删除快码 */
    RemoveBath(dtos: BaseFlexValueSetsInputDto[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaseflexvaluesets/baseflexvaluesets/RemoveBath',
            {
                dtos
            });
    }

    /** 获取所有应用程序 */
    GetValidationType(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaseflexvaluesets/baseflexvaluesets/GetValidationType',
            {
            });
    }

    /** 获取所有应用程序 */
    GetFormatType(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaseflexvaluesets/baseflexvaluesets/GetFormatType',
            {
            });
    }

    /** 获取所有已定义的值集 */
    GetFlexValueSets(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseflexvaluesets/getFlexValueSets',
            {
            }, { method: 'GET' });
    }


    /** 得到值集查询定义 */
    GetBase_Flex_Validation_Tables(flexValueSetId: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseflexvaluesets/getBaseFlexValidationTables?flexValueSetId=' + flexValueSetId,
            {
            }, { method: 'GET' });
    }

    /** 得到所有表名 */
    GetUser_tables(): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseflexvaluesets/getUsertables',
            {
            }, { method: 'GET' }
            );
    }

    GetUser_tab_columns(tableName: string): Observable<ResponseDto> {
        // jianl修改，这里必须改成post模式，因为tableName可能是一串sql语句，不是一个表名
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseflexvaluesets/getUserTabColumns?tableName=' + tableName,
            {
            }, { method: 'GET' });
    }

    /** 编辑值集验证 */
    EditBase_Flex_Validation_Tables(dto: BaseFlexValidationTablesInputDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseflexvaluesets/editBaseFlexValidationTables',
            
                dto
            );
    }

    /** 编辑值集验证 */
    EditBase_Flex_Validation_TablesNoTest(dto: BaseFlexValidationTablesInputDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseflexvaluesets/editBaseFlexValidationTables',
            
                dto
            );
    }

    Check_Sql(dto: BaseFlexValidationTablesInputDto): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/baseflexvaluesets/checkSql',
            
                dto
            );
    }

    /** 根据getter的url，获取参数模板 */
    loadGetterParamsSimple(getterUrl: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaserequestsubmitquery/GetterAppService/GetGetterParamsSimple',
            {
                getterUrl: getterUrl
            }, { method: 'POST' });
    }

    /** 获取所有getter的url */
    loadAllGetters(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverbaserequestsubmitquery/GetterAppService/GetAllGetters',
            {
            }, { method: 'POST' });
    }
}
