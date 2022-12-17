import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ItemCategoryDto } from '../dtos/item-category-dto';
import { _HttpClient } from '@delon/theme';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { ItemCategoryViewDto } from '../dtos/item-category-view-dto';
import { ItemCategoryHeadInputDto } from 'app/modules/generated_module/dtos/item-category-head-input-dto';
import { ResponseDto } from 'app/modules/generated_module/dtos/response-dto';
@Injectable()

export class ItemCategoryService {
    constructor(
        private appApiService: AppApiService,
        private http: _HttpClient,

    ) { }

    // url = '/afs/serverpcitemcategory/ItemCategory/GetData';
    // viewUrl = '/afs/serverpcitemcategory/ItemCategory/GetViewData';
    // view2Url = '/afs/serverpcitemcategory/ItemCategory/getView2Data';
    baseUrl = '/api/pc/pcitemcategoryhead/'; // 基路径
    url = this.baseUrl + 'getList';
    viewUrl = this.baseUrl + 'getViewList';
    view2Url = this.baseUrl + 'getView2List';
    GetPlant(userid: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcitemcategory/ItemCategory/GetPlant?userid=' + userid,
            {

            }, { method: 'GET' }
        );
    }


    /** 根据主键获取 */
    GetById(id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'getItem',
            {
                id: id
            });
    }

    public GetViewById(id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'getViewItem',
            {
                id: id
            });
    }

    public GetView2ById(id: string): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            this.baseUrl + 'getView2Item',
            {
                id: id
            });
    }

    GetSourceType(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcitemcategory/ItemCategory/GetSourceType',
            {

            }, { method: 'GET' }
        );
    }

    GetCalendar(plantCode: any): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcitemcategory/ItemCategory/GetCalendar?plantCode=' + plantCode,
            {

            }, { method: 'GET' }
        );
    }

    EditData(dto: ItemCategoryHeadInputDto): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.baseUrl + 'save', dto);
    }

    public EditView(dto: ItemCategoryViewDto): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.baseUrl + 'saveView', dto);
    }

    public EditView2(dto: ItemCategoryViewDto): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.baseUrl + 'saveView2', dto);
    }


    GetCategory(): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcitemcategory/ItemCategory/GetCategory',
            {

            }, { method: 'GET' }
        );
    }


    GetName(code: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcitemcategory/ItemCategory/GetName?code=' + code,
            {

            }, { method: 'GET' }
        );
    }


    SaveForNew(dto: ItemCategoryDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcitemcategory/ItemCategory/SaveForNew',
            {
                dto
            }
        );
    }

    /** 删除采购品类 */
    public remove(ids: string[]): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.baseUrl + 'delete', ids);
    }

    RemoveBath(dtos: ItemCategoryDto[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcitemcategory/ItemCategory/RemoveBath',
            {
                dtos
            }
        );
    }

    RemoveBathView(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcitemcategory/ItemCategory/RemoveBathView',
            {
                dtos
            }
        );
    }

    RemoveBathView2(dtos: string[]): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcitemcategory/ItemCategory/RemoveBathView2',
            {
                dtos
            }
        );
    }
    /**送货区域 */
    GetRegion(plantcode: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/pc/pcitemcategoryhead/getRegion?plantCode=' + plantcode,
            {

            }, { method: 'GET' }
        );
    }

    // public ViewDelete(dto: ItemCategoryDto): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/serverpcitemcategory/ItemCategory/DeleteView',
    //         {
    //             dto
    //         }
    //     );
    // }
    public ViewDelete(ids: string[]): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.baseUrl + 'deleteView', ids);
    }

    // View2Delete(dto: ItemCategoryDto): Observable<ActionResponseDto> {
    //     return this.appApiService.call<ActionResponseDto>(
    //         '/afs/serverpcitemcategory/ItemCategory/DeleteView2',
    //         {
    //             dto
    //         }
    //     );
    // }
    public View2Delete(ids: string[]): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.baseUrl + 'deleteView2', ids);
    }

    public SaveForView(dto: ItemCategoryViewDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcitemcategory/ItemCategory/SaveForView',
            {
                dto
            }
        );
    }

    public SaveForView2(dto: ItemCategoryViewDto): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcitemcategory/ItemCategory/SaveForView2',
            {
                dto
            }
        );
    }

    GetDesc(groupCode: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpcitemcategory/ItemCategory/GetDesc?groupCode=' + groupCode,
            {

            }, { method: 'GET' }
        );
    }

    public GetUserPlantCategoryPageList(plantCode: string, categoryCode: string, pageIndex: number = 1, pageSize: number = 10, categoryCodeMatch: string = ''): Observable<ResponseDto> {
        // return this.http.get<ResponseDto>(
        //     '/api/pc/pcUserItemCategory/queryCategories',
        //     {
        //         plantCode,
        //         categoryCode,
        //         pageIndex,
        //         pageSize
        //     });

        return this.http.get<ResponseDto>(
            '/api/pc/pcUserItemCategory/queryCategories',
            // '/api/ps/pscategories/QueryPage',
            {
                plantCode,
                categoryCode,
                pageIndex,
                pageSize
                // categorySetCode: '采购分类',
                // categoryCode: categoryCode,
                // //itemCodeOrDesCn: categoryCode,
                // categoryCodeMatch: categoryCodeMatch,
                // pageIndex: pageIndex,
                // pageSize: pageSize
            });
    }

    // 新增/编辑时的物料类别查询
    public GetUserPlantCategoryPageListAdd(plantCode: string, categoryCode: string, pageIndex: number = 1, pageSize: number = 10, categoryCodeMatch: string = ''): Observable<ResponseDto> {
        return this.http.get<ResponseDto>(
            '/api/pc/pcUserItemCategory/queryCategoriesAdd',
            {
                plantCode,
                categoryCode,
                pageIndex,
                pageSize
            });
    }

    /** 获取 主组织 */
    GetMasterOrganizationids(plantCode: string): Observable<ResponseDto> {
        return this.appApiService.call<ResponseDto>(
            '/api/admin/psplant/QueryInfo',
            { plantCode }, { method: 'POST' }
        );
    }

    /** 区域品类计划组关系导入 */
    importItemCategorySource(listImport: any): Observable<ResponseDto> {
        return this.http.post<ResponseDto>(
            this.baseUrl + 'importItemCategorySource',
            listImport
        );
    }
}
