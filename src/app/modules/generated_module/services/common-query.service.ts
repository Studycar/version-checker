/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2019-07-15 15:09:04
 * @LastEditors: zhangwh17
 * @LastEditTime: 2021-09-29 10:54:35
 * @Note: ...
 */
import { Injectable, Provider } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { _HttpClient } from '@delon/theme';
import { process } from '@progress/kendo-data-query';
import { CacheService } from '@delon/cache';
import { of, zip, Observer, Subject, merge } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import {
  CustomBaseContext,
  LookupItem,
} from '../../base_module/components/custom-base-context.component';
import { CustomExcelExportComponent } from '../../base_module/components/custom-excel-export.component';
import { AppApiService } from '../../base_module/services/app-api-service';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { ResponseDto } from '../dtos/response-dto';
import { switchMap } from 'rxjs/operators';

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

/*
athor:liujian11
date:2018-07-30
function:grid前端分页,查询数据服务基类
*/
@Injectable()
export class CommonQueryService extends BehaviorSubject<any[]> {
  private data: any[] = [];
  public data1: any[] = [];
  public Length = function () {
    return this.data.length;
  };

  constructor(public http: _HttpClient, public appApiService: AppApiService) {
    super([]);
  }

  /**
   * 转换ResponseDto
   * @param res
   */
  ConverToResponseDto(res: ResponseDto): ActionResponseDto {
    // 重新映射ResponseDto
    const actionResponseDto = new ActionResponseDto();
    actionResponseDto.Extra = res.data;
    actionResponseDto.Message = res.msg;
    if (res.code === 200) {
      actionResponseDto.Success = true;
    } else {
      actionResponseDto.Success = false;
    }
    // console.log(actionResponseDto);
    return actionResponseDto;
  }

  seachGetLookupByTypeUrl =
    this.appApiService.appConfigService.getApiUrlBase() +
    '/afs/serverbaselookupcode/lookupcode/getlookupbytype';

  // java方法 start

  /**
   * 查询用户
   * @param userName 
   * @param pageIndex 
   * @param pageSize 
   * @param needUserOrgId true，则过滤掉userOrgId没有值的
   * @returns 
   */
  getUsersPage(userName, pageIndex, pageSize, needUserOrgId=false): Observable<any> {
    return this.http.get('api/admin/baseusers/userPage', {
      userName: userName,
      pageIndex: pageIndex,
      pageSize: pageSize,
      needUserOrgId: needUserOrgId,
    });
  }

  // 获取用户工厂
  public GetUserPlantNew(userId = ''): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/listUserPlant?userId=' + userId,
      {},
    );
  }

  /**获取用户所有组织对应的计划组*/
  public GetUserPlantGroupNew(plantCode: string, userName: string = ''): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/getUserPlantGroup?plantCode=' + plantCode + '&userName=' + userName, {},
    );
  }

  // 获取快码
  public GetLookupByTypeNew(type: string): Observable<ResponseDto> {
    return this.GetLookupByTypeLangNew(type, '');
  }

  public GetLookupByTypeLangNew(type: string, language: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/listLookupByType?typeCode=' + type + '&language=' + language,
      {},
    );
  }
  // java方法 end

  /**获取快码（这个方法勿用，貌似明显有bug，异步方法，不可能同步可以返回结果，add by jianl）*/
  public GetArrayLookupByType(type: string): any[] {
    const rtnArray: any[] = [];
    this.GetLookupByType(type).subscribe(result => {
      result.Extra.forEach(d => {
        rtnArray.push({
          label: d.meaning,
          value: d.lookupCode,
        });
      });
    });
    return rtnArray;
  }

  /**
   * 等待多异步请求结果：执行一次，多个对象
   * 用途：表格页用到的多快码查询，需要等待结果后渲染表格
   */
  public GetLookupByTypeRefZip(typeArrays: { [key: string]: any[] }, language = '') {
    return this.commonGetLookupByTypes(typeArrays, language)
    // const requests: Observable<ActionResponseDto>[] = [];
    // if(Object.keys(typeArrays).length > 0) {
    //   for(let key in typeArrays) {
    //     requests.push(this.GetLookupByTypeLang(key, language))
    //   }
    //   const results = await zip(...requests).toPromise();
    //   results.forEach(res => {
    //     if(res.Extra.length > 0) {
    //       const key = res.Extra[0].lookupTypeCode;
    //       typeArrays[key].length = 0;
    //       res.Extra.forEach(d => {
    //         typeArrays[key].push({
    //           label: d.meaning,
    //           value: d.lookupCode,
    //         });
    //       });
    //     }
    //   });
    // }
  }

  /**
   * 不等待多异步请求结果：执行多次，多个对象
   * 用途：表单页（即编辑页）查询快码，边渲染
   */
  public GetLookupByTypeRefAll(typeArrays: { [key: string]: any[] }, language = '') {
    this.commonGetLookupByTypes(typeArrays, language)
    // for(let key in typeArrays) {
    //   this.GetLookupByTypeLang(key, language).subscribe(res => {
    //     res.Extra.forEach(d => {
    //       typeArrays[key].push({
    //         label: d.meaning,
    //         value: d.lookupCode,
    //       });
    //     });
    //   })
    // }
  }

  private commonGetLookupByTypes(typeArrays: { [key: string]: any[] }, language = '') {
    return new Promise<void>((resolve, reject) => {
      const typeCodes = Object.keys(typeArrays).join(',')
      this.GetLookupByTypesLang(typeCodes, language).subscribe(res => {
        res.Extra.forEach(d => {
          if (typeArrays[d.lookupTypeCode]) {
            typeArrays[d.lookupTypeCode].push({
              label: d.meaning,
              value: d.lookupCode,
            })
          }
        });
        resolve()
      }, err => {
        reject(err)
      })
    })
  }

  /**获取快码*/
  public async GetLookupByTypeRef(type: string, arrayRef: any[], language = '') {
    const result = await this.GetLookupByTypeLang(type, language).toPromise();
    arrayRef.length = 0;
    result.Extra.forEach(d => {
      arrayRef.push({
        label: d.meaning,
        value: d.lookupCode,
      });
    });
    // this.GetLookupByTypeLang(type, language).subscribe(result => {
    //   arrayRef.length = 0;
    //   result.Extra.forEach(d => {
    //     arrayRef.push({
    //       label: d.meaning,
    //       value: d.lookupCode,
    //     });
    //   });
    // });
  }

  /**编辑页面 获取快码*/
  public GetLookupByType(type: string): Observable<ActionResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/listLookupByType?typeCode=' + type,
      {},
    ).pipe(
      // 重新映射ResponseDto
      map(res => {
        return this.ConverToResponseDto(res);
      })
    );
  }

  /**获取快码,前台传入语言条件*/
  public GetLookupByTypeLang(
    type: string,
    language: string,
  ): Observable<ActionResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/listLookupByType?typeCode=' + type + '&language=' + language,
      {},
    ).pipe(
      // 重新映射ResponseDto
      map(res => {
        return this.ConverToResponseDto(res);
      })
    );
  }

  public GetLookupByTypesLang(
    typeCodes: string,
    language: string,
  ): Observable<ActionResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/listLookupByTypes?typeCodes=' + typeCodes + '&language=' + language,
      {},
    ).pipe(
      // 重新映射ResponseDto
      map(res => {
        return this.ConverToResponseDto(res);
      })
    );
  }

  /**根据多个快码类型，获取快码*/
  public GetLookupByTypeMul(types: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/getLookupByTypeMul/' + types,
      {},
    );
  }

  /**获取用户所有职责*/
  public Getdatauserresp(user_id: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/getUserResp',
      {},
    );
  }

  /**根据职责ID查询职责名称*/
  public Getrespname(resp_id: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverbaseworkbench/workbench/getrespname?resp_id=' + resp_id,
      {},
    );
  }

  /**获取消息单条记录*/
  public GetMessageInfo(messageCode: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverbaseworkbench/workbench/getMessageInfo?messageCode=' +
      messageCode,
      {},
    );
  }

  /**获取所有用户*/
  public GetUserInfos(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/getUserInfos',
      {},
    );
  }
  // /**获取当前默认事业部*/
  // public getDefaultScheduleRegion(userId = ''): Observable<ActionResponseDto> {
  //   return this.http.get<ActionResponseDto>(
  //     '/afs/serverbaseworkbench/workbench/getDefaultScheduleRegion?userId=' + userId,
  //     {},
  //   );
  // }

  /**获取用户所有组织*/
  // public GetUserPlantNew(
  //   userId = ''
  // ): Observable<ResponseDto> {
  //   return this.http.get<ResponseDto>(
  //     '/api/admin/workbench/listUserPlant?userId=' +
  //     userId,
  //     {},
  //   );
  // }

  /** 获取所有事业部 */
  public GetAllScheduleRegionNew(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psscheduleregion/getScheduleRegion/Y',
    );
  }


  /**获取用户所有组织*/
  public GetUserPlant(
    scheduleRegionCode = '',
    userId = '',
  ): Observable<ActionResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/getUserPlant?scheduleRegionCode=' +
      scheduleRegionCode +
      '&userId=' +
      userId,
      {},
    ).pipe(
      // 重新映射ResponseDto
      map(res => {
        return this.ConverToResponseDto(res);
      })
    );
  }


  QueryStockCategory(dimensionName: string, dimensionValues: string, categoriesCode: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/pscategories/queryStockCategoryList',
      {
        dimensionName: dimensionName,
        dimensionValues: dimensionValues,
        categoriesCode: categoriesCode

      }, { method: 'POST' });
  }


  /**获取所有有效的组织*/
  public GetAllPlant(scheduleRegionCode = ''): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/getAllPlant?scheduleRegionCode=' +
      scheduleRegionCode,
      {},
    );
  }

  /**根据组织编码获取组织名称*/
  public GetUserplantNamebyCode(
    plantCode: string,
  ): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverbaseworkbench/workbench/getplantcodebyid?plantCode=' +
      plantCode,
      {},
    );
  }

  /**获取用户所有组织对应的计划组*/
  public GetUserPlantGroup(
    plantCode: string,
    scheduleRegionCode = '',
  ): Observable<ActionResponseDto> {
    /*return this.http.get<ActionResponseDto>(
      '/afs/serverbaseworkbench/workbench/getUserPlantGroup?plantCode=' +
      plantCode +
      '&scheduleRegionCode=' +
      scheduleRegionCode,
      {},
    );*/
    return this.http.get<ResponseDto>(
      '/api/admin/psschedulegroup/getScheduleGroups?plantCode=' + plantCode + '&scheduleRegionCode=' + scheduleRegionCode, {},
    ).pipe(
      // 重新映射ResponseDto
      map(res => {
        return this.ConverToResponseDto(res);
      })
    );
  }

  /**获取用户所有组织对应的计划组按排产码排序*/
  public GetUserPlantGroupOrderByCode(
    plantCode: string,
    scheduleRegionCode = '',
    processFlag = false,
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psschedulegroup/getUserPlantGroupOrderByCode?plantCode=' +
      plantCode +
      '&scheduleRegionCode=' +
      scheduleRegionCode +
      '&processFlag=' +
      processFlag,
      {},
    );
  }

  /**获取用户所有组织、计划组对应的生产线*/
  public GetUserPlantGroupLineOrderByCode_Injection(
    plantCode: string,
    scheduleRegionCode = '',
    processFlag = false,
  ): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverbaseworkbench/workbench/GetUserPlantGroupLineOrderByCode_Injection?plantCode=' +
      plantCode +
      '&scheduleRegionCode=' +
      scheduleRegionCode +
      '&processFlag=' +
      processFlag,
      {},
    );
  }
  /**获取用户所有组织对应的计划组*/
  public GetUserPlantGroupOrderByCode_Injection(
    plantCode: string,
    scheduleRegionCode = '',
    processFlag = false,
  ): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverbaseworkbench/workbench/GetUserPlantGroupOrderByCode_Injection?plantCode=' +
      plantCode +
      '&scheduleRegionCode=' +
      scheduleRegionCode +
      '&processFlag=' +
      processFlag,
      {},
    );
  }

  /**
   * create by jianl
   * 获取物料对应的计划组（默认按优先级排序）
   * @param materialCode 物料编码
   */
  public GetUserPlantGroupByMaterialCode(inParams: {
    ItemCode: string;
    PlantCode: string;
  }): Observable<ActionResponseDto> {
    const queryParams = {
      QueryParams: {
        Sort: [
          {
            Field: 'PRIORITY',
            Dir: 1,
          },
        ],
      },
    };
    return this.http.post<ActionResponseDto>(
      '/afs/serverpsprodlineitem/psprodlineitem/Query',
      { ...inParams, ...queryParams },
    );
  }

  /**获取用户所有组织、计划组对应的生产线*/
  public GetUserPlantGroupLine(
    plantCode: string,
    groupCode: string,
    resourceCode = '',
  ): Observable<ActionResponseDto> {
    // return this.http.get<ActionResponseDto>(
    //   '/afs/serverbaseworkbench/workbench/getUserPlantGroupLine', // ?plantCode=' + plantCode + '&groupCode=' + groupCode
    //   {
    //     plantCode: plantCode,
    //     groupCode: groupCode,
    //     resourceCode: resourceCode,
    //   },
    // );

    return this.http.get<ResponseDto>(
      '/api/admin/workbench/getUserPlantGroupLine?plantCode=' + plantCode + '&groupCode=' + groupCode + '&resourceCode=' + resourceCode, {},
    ).pipe(
      // 重新映射ResponseDto
      map(res => {
        return this.ConverToResponseDto(res);
      })
    );
  }

  /**获取用户所有组织、计划组对应的生产线按排产码排序*/
  public GetUserPlantGroupLineOrderByCode(
    plantCode: string,
    groupCode: string,
    processFlag: boolean = false,
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psResource/getUserPlantGroupLineOrderByCode', // ?plantCode=' + plantCode + '&groupCode=' + groupCode
      {
        plantCode: plantCode,
        groupCode: groupCode,
        processFlag: processFlag,
      },
    );
  }

  /**获取用户所有组织、多个计划组对应的生产线*/
  public GetUserPlantGroupLineAll(
    plantCode: string,
    groupCode: string,
  ): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverbaseworkbench/workbench/getUserPlantGroupLineALL', // ?plantCode=' + plantCode + '&groupCode=' + groupCode
      {
        plantCode: plantCode,
        groupCode: groupCode,
      },
    );
  }

  /**根据物料获取工艺路线*/
  public GetResourceByItem(
    itemCode: string,
    vistion = '',
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psitemroutings/getResourceByItem',
      {
        itemCode: itemCode,
        vistion: vistion,
      },
    );
  }


  /**根据物料获取工艺版本*/
  public GetThenVersionByItem(
    itemCode: string,
    resource = '',
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psitemroutings/getThenVersionByItem',
      {
        itemCode: itemCode,
        resource: resource,
      },
    );
  }

  /**获取颜色*/
  public GetColor(
    dimensionality: string,
    colorName: string = '',
    meaning: string = '',
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/basecolormanger/getcolor', // ?plantCode=' + plantCode + '&groupCode=' + groupCode
      {
        dimensionality: dimensionality,
        colorName: colorName,
        meaning: meaning,
      },
    );
  }

  getColor(dimensionality: string, colorName: string = '', meaning: string = '', language: string = ''): Observable<ResponseDto> {
    return this.http.get(
      '/api/admin/basecolormanger/getcolor',
      { dimensionality, colorName, meaning, language }
    );
  }

  /**获取物料*/
  public GetUserPlantItem(plantCode: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psItem/getUserPlantItem/' +
      plantCode,
      {},
    );
  }

  /**获取物料分页信息*/
  public GetUserPlantItemPageList(
    PLANT_CODE: string,
    ITEM_CODE: string,
    DESCRIPTIONS_CN: string,
    PageIndex: number = 1,
    PageSize: number = 10,
    ITEM_ID: string = '',
  ): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      '/afs/serverbaseworkbench/workbench/getUserPlantItemPageList',
      {
        PLANT_CODE: PLANT_CODE,
        ITEM_ID: ITEM_ID,
        ITEM_CODE: ITEM_CODE,
        DESCRIPTIONS_CN: DESCRIPTIONS_CN,
        PageIndex: PageIndex,
        PageSize: PageSize,
      },
    );
  }

  public getUserPlantItemPageList(
    plantCode: string,
    // itemCode: string,
    itemCodeOrDesCn: string,
    descriptionsCn: string,
    pageIndex: number = 1,
    pageSize: number = 10,
    itemId: string = '',
    makeBuyCode: number = null
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psItem/pageItem',
      {
        plantCode,
        itemId,
        // itemCode,
        itemCodeOrDesCn,
        descriptionsCn,
        makeBuyCode,
        pageIndex,
        pageSize,
      }
    );
  }

  /**
   * create by jianl
   * 获取物料分页信息
   */
  public GetUserPlantItemPageList2({
    PLANT_CODE = '',
    ITEM_CODE = '',
    DESCRIPTIONS_CN = '',
    ITEM_ID = '',
    MAKE_BUY_CODE = '',
    QueryParams = {
      PageIndex: 1,
      PageSize: 10,
    },
  } = {}): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      '/afs/serverbaseworkbench/workbench/getUserPlantItemPageList2',
      {
        PLANT_CODE: PLANT_CODE,
        ITEM_ID: ITEM_ID,
        ITEM_CODE: ITEM_CODE,
        DESCRIPTIONS_CN: DESCRIPTIONS_CN,
        QueryParams: QueryParams,
        MAKE_BUY_CODE: MAKE_BUY_CODE,
      },
    );
  }
  /**获取绑定应用模块*/
  public GetApplication(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/getApplication',
      {},
    );
  }
  /**获取绑定应用模块*/
  public GetApplicationNew(): Observable<ActionResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/application/list',
      {},
    ).pipe(
      // 重新映射ResponseDto
      map(res => {
        const actionResponseDto = new ActionResponseDto();
        actionResponseDto.Extra = res.data.content;
        actionResponseDto.Message = res.msg;
        if (res.code === 200) {
          actionResponseDto.Success = true;
        } else {
          actionResponseDto.Success = false;
        }
        return actionResponseDto;
      })
    );
  }

  /**根据类别集获取类别*/
  public GetCategory(categorySetCode: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverbaseworkbench/workbench/getCategory',
      {
        categorySetCode,
      },
    );
  }

  /**根据类别集获取类别 -java*/
  public GetCategoryList(plantCode: string, categorySetCode: string, categoryCode: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psitemcategories/getList',
      {
        plantCode: plantCode,
        categorySetCode: categorySetCode,
        categoryCode: categoryCode,
        pageIndex: 1,
        pageSize: 2000,
      },
    );
  }

  /** 获取类别集 */
  GetCategorySet(plantCode: string): Observable<ResponseDto> {
    return this.appApiService.call<ResponseDto>(
      '/api/ps/pscategories/GetCategorySets',
      {
      }, { method: 'GET' });
  }


  /**根据类别集获取类别分页信息*/
  public GetCategoryPageList1(
    categorySetCode: string,
    categoryCode: string,
    PageIndex: number = 1,
    PageSize: number = 10,
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/pscategories/QueryPage',
      {
        categorySetCode: categorySetCode,
        categoryCode: categoryCode,
        PageIndex: PageIndex,
        PageSize: PageSize,
      },
    );
  }

  /**根据类别集获取类别分页信息*/
  public GetCategoryPageList(
    categorySetCode: string,
    categoryCode: string,
    PageIndex: number = 1,
    PageSize: number = 10,
  ): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      '/afs/serverbaseworkbench/workbench/GetCategoryPageList',
      {
        categorySetCode: categorySetCode,
        categoryCode: categoryCode,
        PageIndex: PageIndex,
        PageSize: PageSize,
      },
    );
  }
  getAutoLockBatch(data): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/ppReqOrders/queryAutoLockBatch', data
    );
  }
  /** 获取用户事业部 */
  public GetScheduleRegions(enableFlag = 'Y'): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      /* '/afs/serverschedulemanager/ScheduleService/GetScheduleRegion', */
      '/api/admin/workbench/GetUserScheduleRegion',
      {
        enableFlag: enableFlag,
      },
    );
  }
  /** 获取所有事业部 */
  public GetAllScheduleRegion(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/GetAllScheduleRegion?enableFlag=Y',
    );
  }


  /** 根据系统参数获取参数的值
   * @parameter：系统参数代码
   * @LevelValue：参数级别 {
   *  1：系统级
   *  2：事业部级
   *  3：组织级
   *  4: 职责级
   *  5：用户级
   * }
   * @Link: 系统参数中LINK的值，比如根据工厂查询系统参数LINK可以为"M23"
   * 返回值：{ PARAMETER_VALUE }
   */
  public GetParameter(
    parameter: string,
    LevelValue: string,
    Link: string,
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/workbench/QuerySystemParamBylink',
      {
        paramCode: parameter,
        linkValue: Link,
        levelLevel: LevelValue,
      },
    );
  }

  /**根据组织编码获取  计划员编码*/
  public GetUserplanners(plantCode: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverbaseworkbench/workbench/getUserplanners?plantCode=' +
      plantCode,
      {},
    );
  }

  /**根据物料编码获取物料的磨具*/
  public GetItemMolds({
    ITEM_CODE = '',
    PLANT_CODE = '',
  }): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverppmaterialresourcerelation/ServerPPMaterialResourceRelation/querymaterialmold',
      {
        ITEM_CODE: ITEM_CODE,
        PLANT_CODE: PLANT_CODE,
      },
    );
  }

  /**获取用户产线分页信息*/
  public GetUserPlantGroupLinePage(
    dto: any,
  ): Observable<GridSearchResponseDto> {
    return this.http.get<GridSearchResponseDto>(
      '/afs/serverbaseworkbench/workbench/getUserPlantGroupLinePage',
      {
        RESOURCE_CODE: this.nvl(dto.RESOURCE_CODE),
        DESCRIPTIONS: this.nvl(dto.DESCRIPTIONS),
        SCHEDULE_GROUP_CODE: this.nvl(dto.SCHEDULE_GROUP_CODE),
        PLANT_CODE: this.nvl(dto.PLANT_CODE),
        SCHEDULE_REGION_CODE: this.nvl(dto.SCHEDULE_REGION_CODE),
        PAGE_INDEX: this.nvl(dto.PAGE_INDEX),
        PAGE_SIZE: this.nvl(dto.PAGE_SIZE),
      },
    );
  }

  // 未定义替换处理
  public nvl(dto: any, replaceDto: any = ''): any {
    if (dto === undefined || dto === null) {
      return replaceDto;
    } else {
      return dto;
    }
  }

  // 导出(请求返回的类型为GridSearchResponseDto)
  public export(
    action: HttpAction /*{url:'',method:'GET|POST'}*/,
    queryParams: any = {},
    excelexport: CustomExcelExportComponent,
    context?: CustomBaseContext,
  ) {
    this.setLoading(context, true);
    this.fetch(action, queryParams || action.params).subscribe(data => {
      this.data = data;
      super.next(data);
      // excelexport.export(data);
      setTimeout(() => {
        excelexport.export(data);
      });
      this.setLoading(context, false);
    });
  }

  // java版本大数据量导出，返回值为二进制文件， 默认post方式
  public exportEasyPoi(
    exportUrl: string /*{url:'',method:'GET|POST'}*/,
    queryParams: any = {},
    context?: CustomBaseContext,
    dataPreFilter?: Function,
  ) {
    this.setLoading(context, true);

    return this.http
      .post(exportUrl, queryParams, {}, {
        responseType: 'blob',
        observe: 'response',
        withCredentials: true,
      })
      .subscribe(res => {
        this.downloadFile(res);
        this.setLoading(context, false);
      });
  }

  downloadFile(data) {
    // 下载类型 xls
    const blob = new Blob([data.body]);
    const url = window.URL.createObjectURL(blob);
    // 打开新窗口方式进行下载
    // window.open(url); 

    // 以动态创建a标签进行下载
    const a = document.createElement('a');
    // const fileName = this.datePipe.transform(new Date(), 'yyyyMMdd');
    a.href = url;
    // 再处理一下文件名乱码的问题即可
    const fileName = decodeURI(data.headers.get('content-disposition').split(';')[1].replace('fileName=', ''));
    a.download = fileName;
    // a.download = new Date() + '.xls';
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url)
  }

  // 前台分页gird数据加载
  public read(
    action: HttpAction /*{url:'',method:'GET|POST'}*/,
    queryParams?: any,
    context?: CustomBaseContext,
  ) {
    const params = queryParams || action.params;
    // 不从服务器请求（前端切换页码）
    if (this.data !== undefined && this.data.length && params === undefined) {
      return super.next(this.data);
    }
    this.setLoading(context, true);
    // 从服务器请求
    this.fetch(action, params).subscribe(data => {
      this.data = data;
      super.next(data);
      this.setLoading(context, false);
    });
  }

  private fetch(
    action: HttpAction /*{url:'',method:'GET|POST'}*/,
    queryParams?: any,
  ): Observable<any[]> {
    if (action.method === HttpMethod.get) {
      let paramsStr = '';
      if (queryParams !== undefined) {
        if (typeof queryParams === 'string') {
          paramsStr = queryParams;
        } else {
          paramsStr = '?';
          for (const paramName in queryParams) {
            paramsStr += `${paramName}=${queryParams[paramName] !== null ? queryParams[paramName] : ''
              }&`;
          }
          paramsStr = paramsStr.substr(0, paramsStr.length - 1);
        }
      }
      return this.http
        .get(action.url + paramsStr)
        .pipe(map(res => <any[]>(<any>res).data.content));
    } else {
      return this.http
        .post(action.url, queryParams)
        .pipe(map(res => <any[]>(<any>res).data.content));
    }
  }

  // 导出(请求返回的类型为ActionResponseDto)
  public exportAction(
    action: HttpAction /*{url:'',method:'GET|POST'}*/,
    queryParams: any = {},
    excelexport: CustomExcelExportComponent,
    context?: CustomBaseContext,
    dataPreFilter?: Function,
  ) {
    this.setLoading(context, true);
    if (action.method === HttpMethod.get) {
      return this.http
        .get(action.url, queryParams || action.params)
        .subscribe(res => {
          let data = res.data;
          if (res.data.content) {
            data = res.data.content;
          }
          if (
            dataPreFilter !== undefined &&
            dataPreFilter !== null &&
            typeof dataPreFilter === 'function'
          ) {
            // res = dataPreFilter.call(this, res);
            data = dataPreFilter.call(this, res);
          }
          // excelexport.export((<any>res).Extra);
          setTimeout(() => {
            excelexport.export(data); // (<any>res).data);
          });
          this.setLoading(context, false);
        });
    } else {
      return this.http
        .post(action.url, queryParams || action.params)
        .subscribe(res => {
          let data = res.data;
          if (res.data.content) {
            data = res.data.content;
          }
          // start add by jianl
          if (
            dataPreFilter !== undefined &&
            dataPreFilter !== null &&
            typeof dataPreFilter === 'function'
          ) {
            // res = dataPreFilter.call(this, res);
            data = dataPreFilter.call(this, res);
          }
          // end add by jianl

          // jianl 2019-03-26修改，必须要改成这种延迟执行，否则模块无法后期更新导出列，导出列必须提前声明，不满足动态生成列的业务需求
          setTimeout(() => {
            excelexport.export(data); // (<any>res).data);
          });
          // excelexport.export((<any>res).Extra);
          this.setLoading(context, false);
        });
    }
  }

  // 后台分页(请求返回的类型为GridSearchResponseDto)，从url加载grid view数据
  public loadGridView(
    action: HttpAction /*{url:'',method:'GET|POST'}*/,
    queryParams: any,
    context: CustomBaseContext,
    dataPreFilter?: Function,
    afterCallBack?: Function,
  ) {
    if (action.method === HttpMethod.get) {
      this.loadGridViewFromResult(
        this.http.get<GridSearchResponseDto>(
          action.url,
          queryParams || action.params,
        ),
        context,
        dataPreFilter,
        afterCallBack,
      );
      console.log('loadGridView');
      console.log(context._pageSize);
    } else {
      this.loadGridViewFromResult(
        this.http.post<GridSearchResponseDto>(
          action.url,
          queryParams || action.params,
        ),
        context,
        dataPreFilter,
        afterCallBack,
      );
    }
  }
  /**
   * 后台分页(请求返回的类型为GridSearchResponseDto)，从url加载grid view数据
   * @param action
   * @param queryParams
   * @param context
   * @param dataPreFilter
   * @param afterCallBack
   */
  public loadGridViewNew(
    action: HttpAction /*{url:'',method:'GET|POST'}*/,
    queryParams: any,
    context: CustomBaseContext,
    dataPreFilter?: Function,
    afterCallBack?: Function,
  ) {
    if (action.method === HttpMethod.get) {
      this.loadGridViewFromResultNew(
        this.http.get<ResponseDto>(
          action.url,
          queryParams || action.params,
        ),
        context,
        dataPreFilter,
        afterCallBack,
      );
      // console.log('loadGridView');
      // console.log(context._pageSize);
    } else {
      this.loadGridViewFromResultNew(
        this.http.post<ResponseDto>(
          action.url,
          queryParams || action.params,
        ),
        context,
        dataPreFilter,
        afterCallBack,
      );
    }
  }

  /**
   * add by jianl
   * 处理gridview的数据（抽取处理逻辑到独立的方法，方便派生类调用）
   * @param result
   */
  public processGridViewData(
    context: CustomBaseContext,
    result: GridSearchResponseDto,
  ) {
    console.log('processGridViewData');
    if (
      result !== undefined &&
      result !== null &&
      result.Result !== undefined &&
      result.Result !== null
    ) {

      context.gridData = result.Result;
      context.extra = result.Extra;
      context.view = {
        data: process(result.Result, {
          sort: context.gridState.sort,
          skip: 0,
          take: context.gridState.take,
          filter: context.gridState.filter,
        }).data || result.data.content,
        total: result.TotalCount,
      };
    } else if (result && result.data) {
      // 兼容不同数据结构
      context.gridData = result.data.content;
      context.extra = result.data.content;
      context.view = {
        data: process(result.data.content, {
          sort: context.gridState.sort,
          skip: 0,
          take: context.gridState.take,
          filter: context.gridState.filter,
        }).data,
        total: result.data.TotalCount || result.data.totalElements,
      };
    }
    context.initGridWidth();
  }

  public processGridViewDataNew(
    context: CustomBaseContext,
    result: ResponseDto,
  ) {
    // console.log('processGridViewDataNew');
    if (
      result !== undefined &&
      result !== null &&
      result.data !== undefined &&
      result.data !== null
    ) {
      this.setContextData(context, result);
    }
    context.initGridWidth();
  }

  setContextData(context, result) {
    let data = result.data;
    if (result.data.content) {
      data = result.data.content;
    }
    context.gridData = data;
    context.extra = result.extra;
    context.view = {
      data: process(data, {
        sort: context.gridState.sort,
        skip: 0,
        take: context.gridState.take,
        filter: context.gridState.filter,
      }).data,
      total: result.data.totalElements === undefined ? 0 : result.data.totalElements,
    };
  }

  /**
   * 后台分页(请求返回的类型为GridSearchResponseDto)，从Observable加载grid view数据
   *
   * add by jianl
   * dataPreFilter: 从服务器获取到数据后，回调此方法进行预处理
   * afterCallBack: 处理完毕后，回调此方法
   * end add by jianl
   */
  public loadGridViewFromResult(
    resultObservable: Observable<GridSearchResponseDto>,
    context: CustomBaseContext,
    dataPreFilter?: Function,
    afterCallBack?: Function,
  ) {
    this.setLoading(context, true);
    context.stopwatch.start();
    resultObservable.subscribe(result => {
      // start add by jianl
      if (
        dataPreFilter !== undefined &&
        dataPreFilter !== null &&
        typeof dataPreFilter === 'function'
      ) {
        result = dataPreFilter.call(this, result);
      }
      // end add by jianl
      // console.log('loadGridViewFromResult');
      // console.log(result);
      const time = context.stopwatch.getTime();
      this.processGridViewData(context, result);

      // start add by jianl
      if (
        afterCallBack !== undefined &&
        afterCallBack != null &&
        typeof afterCallBack === 'function'
      ) {
        afterCallBack.call(context);
      }
      context.loadGridDataCallback(result);
      // end add by jianl
      this.setLoading(context, false);
    });
  }

  public loadGridViewFromResultNew(
    resultObservable: Observable<ResponseDto>,
    context: CustomBaseContext,
    dataPreFilter?: Function,
    afterCallBack?: Function,
  ) {
    this.setLoading(context, true);
    context.stopwatch.start();
    resultObservable.subscribe(result => {
      // start add by jianl
      if (
        dataPreFilter !== undefined &&
        dataPreFilter !== null &&
        typeof dataPreFilter === 'function'
      ) {
        result = dataPreFilter.call(this, result);
      }
      // end add by jianl
      // console.log('loadGridViewFromResult');
      // console.log(result);
      const time = context.stopwatch.getTime();
      this.processGridViewDataNew(context, result);

      // start add by jianl
      if (
        afterCallBack !== undefined &&
        afterCallBack != null &&
        typeof afterCallBack === 'function'
      ) {
        afterCallBack.call(context);
      }
      context.loadGridDataCallback(result);
      // end add by jianl
      this.setLoading(context, false);
    });
  }

  // 设置组件查询数据加载
  private setLoading(context: CustomBaseContext, isLoading: boolean) {
    if (context !== undefined) {
      context.setLoading(isLoading);
    }
  }

  /**
   * add by jianl
   * 根据参数模板，格式化日期格式
   * d：将日显示为不带前导零的数字，如1
   * dd：将日显示为带前导零的数字，如01
   * ddd：将日显示为缩写形式，如Sun
   * dddd：将日显示为全名，如Sunday
   * M：将月份显示为不带前导零的数字，如一月显示为1
   * MM：将月份显示为带前导零的数字，如01
   * MMM：将月份显示为缩写形式，如Jan
   * MMMM：将月份显示为完整月份名，如January
   * yy：以两位数字格式显示年份
   * yyyy：以四位数字格式显示年份
   * h：使用12小时制将小时显示为不带前导零的数字，注意||的用法
   * hh：使用12小时制将小时显示为带前导零的数字
   * H：使用24小时制将小时显示为不带前导零的数字
   * HH：使用24小时制将小时显示为带前导零的数字
   * m：将分钟显示为不带前导零的数字
   * mm：将分钟显示为带前导零的数字
   * s：将秒显示为不带前导零的数字
   * ss：将秒显示为带前导零的数字
   * l：将毫秒显示为不带前导零的数字
   * ll：将毫秒显示为带前导零的数字
   * tt：显示am/pm
   * TT：显示AM/PM
   * 返回：格式化后的日期
   * @param datetime
   * @param format
   */
  public formatDateTime2(datetime: any, format: string) {
    if (datetime === undefined || datetime === null || datetime === '') return '';
    let date = new Date();
    if (typeof datetime === 'string') {
      // 由于火狐浏览器不支持2022/12这种格式的转换，只能使用2022-12
      date = new Date(datetime.replace(/\//g, '-'));
    } else if (typeof (datetime === 'object') && datetime instanceof Date) {
      date = datetime;
    } else {
      console.log('format datetime[' + datetime + '] error!');
      return datetime;
    }
    /*
    函数：填充0字符
    参数：value-需要填充的字符串, length-总长度
    返回：填充后的字符串
    */
    const zeroize = function (value, length = 2): string {
      if (!length) {
        length = 2;
      }
      // tslint:disable-next-line:no-construct
      value = new String(value);
      let zeros = '';
      for (let i = 0; i < length - value.length; i++) {
        zeros += '0';
      }
      return zeros + value;
    };
    return format.replace(
      /"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g,
      s1 => {
        switch (s1) {
          case 'd':
            return date.getDate().toString();
          case 'dd':
            return zeroize(date.getDate());
          case 'ddd':
            return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][
              date.getDay()
            ];
          case 'dddd':
            return [
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ][date.getDay()];
          case 'M':
            return (date.getMonth() + 1).toString();
          case 'MM':
            return zeroize(date.getMonth() + 1);
          case 'MMM':
            return [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ][date.getMonth()];
          case 'MMMM':
            return [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ][date.getMonth()];
          // tslint:disable-next-line:no-construct
          case 'yy':
            return String(date.getFullYear()).substr(2);
          case 'yyyy':
            return date.getFullYear().toString();
          case 'h':
            return (date.getHours() % 12 || 12).toString();
          case 'hh':
            return zeroize(date.getHours() % 12 || 12);
          case 'H':
            return date.getHours().toString();
          case 'HH':
            return zeroize(date.getHours());
          case 'm':
            return date.getMinutes().toString();
          case 'mm':
            return zeroize(date.getMinutes());
          case 's':
            return date.getSeconds().toString();
          case 'ss':
            return zeroize(date.getSeconds());
          case 'l':
            return date.getMilliseconds().toString();
          case 'll':
            return zeroize(date.getMilliseconds());
          case 'tt':
            return date.getHours() < 12 ? 'am' : 'pm';
          case 'TT':
            return date.getHours() < 12 ? 'AM' : 'PM';
        }
        return s1;
      },
    );
  }

  /* 以下是JS处理公共方法 */
  public formatDateTime(time: any): any {
    if (time !== '' && time !== null && time !== undefined) {
      const Dates = new Date(time);
      const year: number = Dates.getFullYear();
      const month: any =
        Dates.getMonth() + 1 < 10
          ? '0' + (Dates.getMonth() + 1)
          : Dates.getMonth() + 1;
      const day: any =
        Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
      const hours: any =
        Dates.getHours() < 10 ? '0' + Dates.getHours() : Dates.getHours();
      const minutes: any =
        Dates.getMinutes() < 10 ? '0' + Dates.getMinutes() : Dates.getMinutes();
      const seconds: any =
        Dates.getSeconds() < 10 ? '0' + Dates.getSeconds() : Dates.getSeconds();
      return (
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds
      );
    } else {
      return '';
    }
  }

  public formatDate(date: any): any {
    if (date !== '' && date !== null && date !== undefined) {
      const Dates = new Date(date);
      const year: number = Dates.getFullYear();
      const month: any =
        Dates.getMonth() + 1 < 10
          ? '0' + (Dates.getMonth() + 1)
          : Dates.getMonth() + 1;
      const day: any =
        Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
      return year + '-' + month + '-' + day;
    } else {
      return '';
    }
  }

  public CompareDate(date1: string, date2: string): number {
    date1 = date1.toString().replace(/-/g, '/');
    date2 = date2.toString().replace(/-/g, '/');

    const oDate1 = new Date(date1);
    const oDate2 = new Date(date2);
    if (oDate1.getTime() > oDate2.getTime()) {
      return 1;
    } else if (oDate1.getTime() < oDate2.getTime()) {
      return -1;
    } else {
      return 0;
    }
  }

  /**获取日期日数字 */
  public getDayNum(input: any): string {
    const date = new Date(input);
    const dayNum = date.getDate();
    return dayNum.toString().length === 1
      ? '0' + dayNum.toString()
      : dayNum.toString();
  }

  /**获取日期月份数字 */
  public getMonthNum(input: any): string {
    const date = new Date(input);
    const monthNum = date.getMonth() + 1;
    return monthNum.toString().length === 1
      ? '0' + monthNum.toString()
      : monthNum.toString(); // 当前月份
  }

  /**获取年份数字 */
  public getYearNum(input: any): string {
    const date = new Date(input);
    const yearNum = date.getFullYear();
    return yearNum.toString();
  }

  /**获取小时数字 */
  public getHourNum(input: any): string {
    const date = new Date(input);
    const num = date.getHours();
    return num.toString().length === 1 ? '0' + num.toString() : num.toString();
  }

  /**获取分钟数字 */
  public getMinuteNum(input: any): string {
    const date = new Date(input);
    const num = date.getMinutes();
    return num.toString().length === 1 ? '0' + num.toString() : num.toString();
  }

  /**获取秒数字 */
  public getSecondNum(input: any): string {
    const date = new Date(input);
    const num = date.getSeconds();
    return num.toString().length === 1 ? '0' + num.toString() : num.toString();
  }

  public getTimeString(input: any): string {
    let timeString = '00:00:00';
    if (input !== undefined && input !== null && input !== '') {
      timeString =
        this.getHourNum(input) +
        ':' +
        this.getMinuteNum(input) +
        ':' +
        this.getSecondNum(input);
    }
    return timeString;
  }

  /**获取时间间隔天数 */
  public getDays(input1: Date, input2: Date): number {
    const date1 = new Date(input1);
    const date2 = new Date(input2);
    return (date1.getTime() - date2.getTime()) / (24 * 60 * 60 * 1000);
  }

  /**传入日期返回当月第一天 */
  public getMonthFirstDate(input: Date): Date {
    const date = new Date(input);
    return new Date(date.setDate(1));
  }

  /**传入日期返回当月最后一天 */
  public getMonthLastDate(input: Date): Date {
    const date = new Date(input);
    const firstDate = this.getMonthFirstDate(date); // 当月第一天
    return new Date(
      new Date(firstDate.setMonth(firstDate.getMonth() + 1)).setDate(0),
    );
  }

  /**增加天数 */
  public addDays(input: Date, days: number): Date {
    const date = new Date(input);
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  /**增加月数 */
  public addMonths(input: Date, months: number): Date {
    const date = new Date(input);
    return new Date(date.setMonth(date.getMonth() + months));
  }

  /**增加年数 */
  public addYears(input: Date, years: number): Date {
    const date = new Date(input);
    return new Date(date.setFullYear(date.getFullYear() + years));
  }

  /* start create by jianl */
  public lookupItemCache = new Map<string, Set<LookupItem>>(); // 值列表的缓存区
  /** create by jianl
   * 获取值列表值（支持缓存的功能）
   * 请注意：要使用此方法，一定要在组件注入器提供本服务，本服务不建议使用全局单例，因为自带了缓存数据
   * @param key 值列表的key值
   */
  public getLookupItems(key: string): Observable<Set<LookupItem>> {
    if (!key || key === undefined) return of();
    if (this.lookupItemCache.has(key)) return of(this.lookupItemCache.get(key));
    this.lookupItemCache.set(key, new Set<LookupItem>());
    /** 初始化 工单状态  下拉框*/
    return this.GetLookupByTypeMul(key).map(it => {
      Array.from(it.data).forEach(item => {
        const temp = <any>item;
        const obj = new LookupItem(temp.lookupCode, temp.meaning);
        this.lookupItemCache.get(key).add(obj);
      });
      return this.lookupItemCache.get(key);
    });
  }

  /**
   * create by jianl
   * 根据值列表项的CODE获取值列表项的text值（调用该方法之前，一定要先获取到数据）
   * @param key 值列表的key值，例如：PS_MAKE_ORDER_STATUS
   * @param code 值列表项的CODE值
   */
  public async getLookupTextSync(key: string, code: string): Promise<String> {
    const setItem = await this.getLookupItems(key).toPromise();
    if (!setItem || setItem === undefined) return code;
    for (const item of Array.from(setItem)) {
      if (item.Code === code) return item.Text;
    }
    return code;
  }

  /**
   * create by jianl
   * 特别注意：（此方法不能直接调用，应该调用getLookupItems或者getLookupItemsMutil的回调方法里面调用）
   * 根据值列表项的CODE获取值列表项的text值
   * @param key 值列表的key值，例如：PS_MAKE_ORDER_STATUS
   * @param code 值列表项的CODE值
   */
  public getLookupText(key: string, code: string): String {
    const setItem = this.lookupItemCache.get(key);
    if (!setItem || setItem === undefined) return code;
    for (const item of Array.from(setItem)) {
      if (item.Code === code) return item.Text;
    }
    return code;
  }

  /**
   * 一次性发起加载多个值列表的方法
   * @param keys
   */
  public getLookupItemsMutil(keys: string[]): Observable<Set<LookupItem>[]> {
    const obserables = [];
    keys.forEach(it => obserables.push(this.getLookupItems(it)));
    return zip<Set<LookupItem>[]>(...obserables);
  }

  /* end create by jianl */

  /**数据采集-菜单打开后虚拟请求服务*/
  public OpenMenuVirtual(menuName: string): Observable<ActionResponseDto> {
    return this.http.get<ActionResponseDto>(
      '/afs/serverbaseworkbench/workbench/OpenMenuVirtual?menuName=' + menuName,
      {},
    );
  }

  /**
   * pdf的base64编码转为Blob
   * @param data base64编码
   * @returns 
   */
  pdfBase64ToBlob(data) {
    var bstr = atob(data)
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: 'application/pdf' });
  }

  /**
   * 获取产品信息
   * @param plantCode 
   * @param stockCodeOrName 
   * @param pageIndex 
   * @param pageSize 
   * @returns 
   */
  public getPsProductionPageList(
    plantCode: string,
    stockCodeOrName: string,
    pageIndex: number = 1,
    pageSize: number = 10,
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/ps/psproduction/getList',
      {
        plantCode,
        stockCodeOrName,
        pageIndex,
        pageSize,
      }
    );
  }

  /**
   * 获取制造路径
   * @param plantCode 
   * @param skuCode 
   * @param pageIndex 
   * @param pageSize 
   * @returns 
   */
  public getPsRouteList(
    plantCode: string,
    skuCode: string,
    routeId: string,
    steelType: string,
    surface: string,
    standards: number,
    width: number,
    length: number,
    needSideCut: string,
    pageIndex?: number,
    pageSize?: number,
  ): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      // '/api/ps/ppReqOrders/queryProdRouteItem',
      '/api/pi/piReqOrders/queryProdRouteItem',
      {
        plantCode,
        skuCode,
        routeId,
        steelType,
        surface,
        standards,
        width,
        length,
        needSideCut,
        pageIndex,
        pageSize,
      }
    );
  }

  /**
 * 获取原料
 * @param plantCode 
 * @param skuCode 
 * @param pageIndex 
 * @param pageSize 
 * @returns 
 */
  public getPsMesRawInfoList(
    plantCode: string,
    skuCode: string,
    routeId: string,
    steelType: string,
    surface: string,
    standards: number,
    width: number,
    length: number,
    needSideCut: string,
    pageIndex?: number,
    pageSize?: number,
  ): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      // '/api/ps/ppReqOrders/queryProdRouteItem',
      '/api/pi/piReqOrders/queryProdMaterialList',
      {
        plantCode,
        skuCode,
        routeId,
        steelType,
        surface,
        standards,
        width,
        length,
        needSideCut,
        pageIndex,
        pageSize,
      }
    );
  }

  /**
   * 特定排序
   * @param arr 待排序数组
   * @param key 待排序关键值
   * @param sortType 排序类型：desc降序，asc升序，null表示选择排序方法
   * @param sortFunc 排序方法：可选
   * @returns 
   */
  getArrBySort(arr: any[], key: string, sortType: 'desc' | 'asc' | null, sortFunc?: Function) {
    if (arr && arr.length > 0) {
      const sortList = arr.filter(a => this.isNumber(a[key])).sort((a, b) => {
        if (sortFunc) {
          return sortFunc(a, b);
        }
        switch (sortType) {
          case 'desc':
            return Number(b[key]) - Number(a[key]);
          case 'asc':
            return Number(a[key]) - Number(b[key]);
        }
      });
      const unsortList = arr.filter(a => !this.isNumber(a[key]));
      arr.length = 0;
      arr.push(...sortList, ...unsortList);
    }
  }

  isNull(value) {
    return (value || '') === '';
  }

  isNumber(value) {
    return !this.isNull(value) && Number(value).toString() !== 'NaN';
  }
}







// http请求对象
export class HttpAction {
  public url: string;
  public params?: any; // 请求参数
  public method?: string; // GET|POST, 默认GET
  // public data?: boolean;  // true|false, 默认false取data.dt
}

// http请求方法
export const HttpMethod = {
  get: 'GET',
  post: 'POST',
};

