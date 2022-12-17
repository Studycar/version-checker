import { Injectable } from "@angular/core";
import { _HttpClient } from "@delon/theme";
import { decimal } from "@shared";
import { AppApiService } from "app/modules/base_module/services/app-api-service";
import { AppConfigService } from "app/modules/base_module/services/app-config-service";
import { AppInjector } from "app/modules/base_module/services/app-injector.service";
import { Observable, of, pipe, range, throwError, timer, zip } from "rxjs";
import { retryWhen, mergeMap, map } from "rxjs/operators";
import { ResponseDto } from "../dtos/response-dto";
import { CommonQueryService } from "./common-query.service";

/**
 * 宏旺公用服务
 */
@Injectable()
export class PlanscheduleHWCommonService extends CommonQueryService {
  private appConfigService: AppConfigService;

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService) {
    super(http, appApiService);
    this.appConfigService = AppInjector.getInjector().get(AppConfigService);
  }

  debounceTimer: { [key: string]: any } = {}; // 保存防抖方法和定时器，使用路由route、方法名称method和参数argu作为防抖唯一值
  /**
   * 防抖，一秒内不可重复发起
   * @param fn 防抖函数
   * @param key 防抖唯一值
   * @param delay 防抖间隔，默认1000
   * @returns 
   */
  debounceFn(fn, key, delay=1000) {
    return () => {
      this.debounceTimer[key] && clearTimeout(this.debounceTimer[key]); // 每当函数发起，把前一个 setTimeout clear 掉
      this.debounceTimer[key] = setTimeout(() => { // 然后又创建一个新的 setTimeout, 这样就能保证一秒内只发起一次 fn 函数
        fn();
        delete this.debounceTimer[key]; // 删掉该函数对应防抖
      }, delay);
    };
  }

  /**
   * 将规格或厚度格式化为两位小数
   * @param value 
   * @returns 
   */
  formatterPrecision = (value: number | string) => value ? decimal.roundFixed(Number(value), 2) : value;

  /**
   * 获取当前用户权限对应产品大类
   * @returns 
   */
  async getUserProCates(userName: string = this.appConfigService.getUserName()) {
    const proCates = [];
    const proCatesRes = await this.http.get<ResponseDto>(
      '/api/ps/psuserproductcategory/query', {
        employeeNumber: userName
      }).toPromise();
    if(proCatesRes.code === 200 && proCatesRes.data) {
      proCatesRes.data.content.forEach(d => {
        proCates.push({
          label: d.categoryName,
          value: d.categoryCode,
        });
      });
    }
    return proCates;
  }

  /**
   * 获取当前用户权限对应工厂
   * @returns 
   */
  async getUserPlants() {
    const plants = [];
    const plantsRes = await this.GetUserPlant().toPromise();
    if(plantsRes.Success && plantsRes.Extra) {
      plantsRes.Extra.forEach(d => {
        plants.push({
          label: `${d.plantCode}(${d.descriptions})`,
          value: d.plantCode,
        });
      });
    }
    return plants;
  }

  /**
   * 生成唯一编码
   * @param header 抬头，识别单号类型
   * @param serialNum 流水号位数，默认为5
   * @returns 编码
   */
  generateCode(header: string, serialNum: number=5) {
    return header + this.formatDateTime(new Date()).replace(/[-:\s]/g, '') + this.generateSerial(serialNum);
  }
  
  generateCode2(header: string, serialNum: number=5) {
    return header + this.formatDate(new Date()).replace(/[-:\s]/g, '') + this.generateSerial(serialNum);
  }

  /**生成32位流水号 */
  generateSerial(num=5) {
    let serialNum = '';
    for(let i = 0; i < num; i++) {
      serialNum  = serialNum + Math.floor(Math.random() * 10).toString();
    }
    return serialNum;
  }

  /**获取产地*/
  public GetAppliactioPlant(): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      '/api/admin/psprivilege/getAppliactioPlant',
      {
    });
  }

  private findAttachListUrl = '/api/ps/oss/attachInfo/findList';
  /**
   * 获取附件列表
   * @param contractTemplate 合同模板编码 
   * @param busType 附件类型
   * @param attribute2  
   * @param categoryCode 产品大类编码  
   * @returns 
   */
  findAttachList(contractTemplate='', busType='PS_CONTRACT', attribute2='Y', categoryCode = ''): Observable<ResponseDto> {
    return this.http.post(this.findAttachListUrl, {
      busType: busType,
      attribute2: attribute2,
      attribute5: contractTemplate,
      categoryCode: categoryCode
    })
  }

  public downloadUrl = '/api/ps/oss/attachInfo/downloadFile';
  /**
   * 返回格式：文件流形式
   * @param id 附件Id
   * @returns 
   */
  download(id: string): Observable<any> {
    return this.http.get(
      this.downloadUrl,
      { id: id },
      {
        responseType: 'blob',
        observe: 'response',
        withCredentials: true,
      },
    );
  }

  private getLabelUrl = '/api/ps/pshwmeslookuptype/getList';  
  getLabel(attrValueName: string, pageIndex: number = 1, pageSize: number = 10): Observable<ResponseDto> {
    return this.http.post(this.getLabelUrl, {
      attrName: '标签名称',
      attrValueName,
      isExport: false,
      pageIndex,
      pageSize,
    });
  }

  /**
   * 获取客户基础信息
   */
  getCustomsFull(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      taxNum: '',
      cusName: '',
      affiliatedCus: '',
      cusAbbreviation: '',
      cusState: '',
      cusCode:'',
      plantCode: '',
      isExport: false,
      isCusCodeNotNull: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams)
    return this.http.post('/api/ps/customerFull/list', params);
  }

  /**
   * 获取客户信息
   */
  getCustoms(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      taxNum: '',
      cusName: '',
      affiliatedCus: '',
      cusAbbreviation: '',
      cusState: '30', // 已审核状态
      cusCode:'',
      plantCode: '',
      isExport: false,
      isCusCodeNotNull: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams)
    return this.http.post('/api/ps/customerHw/list4Select', params);
  }

  /**
   * 获取合同信息
   */
   getContracts(queryParams): Observable<ResponseDto> {
     const params = Object.assign({
      contractCode: '',
      contractState: '',
      contractType: '',
      contractFlag: 'Y', // 过滤合同：是否废料
      cusCode: '',
      plantCode: '',
      steelType: '',
      signingDate: '',
      affiliatedMonth: '',
      affiliatedContract: '',
      attribute1: '', // 支持产地、钢种模糊搜索
      attribute2: '', // 过滤合同状态
      pageIndex: 1,
      pageSize: 100,
      isExport: false
     }, queryParams);
    return this.http.get('/api/ps/contract/query', params);
  }

  /**
   * 获取废料合同信息
   */
   getWasteContracts(queryParams): Observable<ResponseDto> {
     const params = Object.assign({
      contractCode: '',
      contractState: '',
      contractType: '',
      contractFlag: 'N', // 过滤合同：是否废料
      cusCode: '',
      plantCode: '',
      steelType: '',
      signingDate: '',
      affiliatedMonth: '',
      affiliatedContract: '',
      attribute1: '', // 支持产地、钢种模糊搜索
      attribute2: '', // 过滤合同状态
      pageIndex: 1,
      pageSize: 100,
      isExport: false
     }, queryParams);
    return this.http.get('/api/ps/contract/query/waste', params);
  }

  /**
   * 获取存货信息
   */
   getProductions(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      plantCode: '',
      stockCode: '',
      stockName: '',
      stockCodeOrName: '',
      export: false,
      pageIndex: 1,
      pageSize: 100,
    }, queryParams);
    return this.http.get('/api/ps/psproduction/getList', params)
  }

  /**
   * 获取存货信息:stockCodeOrName产品名称、产品描述、产品编码模糊搜索
   */
   getProductionsCusOrder(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      plantCode: '',
      stockCode: '',
      stockName: '',
      stockCodeOrName: '',
      export: false,
      pageIndex: 1,
      pageSize: 100,
    }, queryParams);
    return this.http.get('/api/ps/psproduction/getList/customerOrder', params)
  }

  /**
   * 获取存货信息
   */
   getProductionsWorkBench(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      plantCode: '',
      stockCode: '',
      stockName: '',
      stockCodeOrName: '',
      catId: null, // Y 表示面膜、底膜
      export: false,
      pageIndex: 1,
      pageSize: 100,
    }, queryParams);
    return this.http.get('/api/ps/psproduction/getList/workBench', params)
  }

  /**
   * 获取销售订单信息
   */
   getSalesOrder(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      plantCode: '',
      salesOrderCode: '',
      salesOrderDate: '',
      salesOrderType: '',
      saleFlag: 'Y', // 过滤销售订单：是否废料
      cusCode: '',
      cusAbbreviation: '',
      salesman: '',
      cusType: '',
      cklb: '',
      contractCode: '',
      isExport: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.get('/api/ps/salesOrder/query', params)
  }
  
  /**
   * 获取客诉申请单明细信息
   */
   getKSDetailed(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      cusCode: '',
      batchNum: '',
      orno: '',
      ksdt: '',
      plantCode: '',
      dlslxr: '',
      state: '',
      isExport: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.get('/api/ps/complaint/detail/query', params)
  }
  
  /**
   * 发货单明细：获取销售订单明细信息（过滤销售订单状态：salesOrderState）
   */
   getSalesOrderDetailedByState(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      plantCode: '',
      salesOrderCode: '',
      salesOrderDate: '',
      salesOrderState: '',
      salesOrderType: '',
      saleFlag: 'Y', // 过滤销售订单明细：是否废料
      cusCode: '',
      cusAbbreviation: '',
      filterBatchCode: '',
      salesman: '',
      cusType: '',
      cklb: '',
      contractCode: '',
      haveContract: '', // 过滤：是否有合同
      whCode: '',
      batchNum: '',
      isExport: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.get('/api/ps/salesOrderDetailed/queryByState', params)
  }
  
  /**
   * 废料发货单明细：获取废料销售订单明细信息（过滤销售订单状态：salesOrderState）
   */
   getSalesOrderDetailedByStateWaste(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      plantCode: '',
      salesOrderCode: '',
      salesOrderDate: '',
      salesOrderState: '',
      salesOrderType: '',
      saleFlag: 'Y', // 过滤销售订单明细：是否废料
      cusCode: '',
      cusAbbreviation: '',
      filterBatchCode: '',
      salesman: '',
      cusType: '',
      cklb: '',
      contractCode: '',
      whCode: '',
      batchNum: '',
      isExport: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.get('/api/ps/salesOrderDetailed/queryByState/waste', params)
  }
  
  /**
   * 获取销售订单明细信息
   */
   getSalesOrderDetailed(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      plantCode: '',
      salesOrderCode: '',
      detailedNum: '',
      salesOrderDate: '',
      salesOrderType: '',
      cusCode: '',
      cusAbbreviation: '',
      salesman: '',
      cusType: '',
      cklb: '',
      contractCode: '',
      batchNum: '',
      isExport: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.get('/api/ps/salesOrderDetailed/query', params)
  }

  /**
   * 转货单获取发货单信息
   */
   getInvoiceBillOrderByRequi(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      invoiceBillCode: '',
      invoiceBillDate: '',
      invoiceBillState: '', // 筛选发货单状态
      screenInvoiceBillState: '', // 筛选发货单状态-多选：'20,70'
      invoiceFlag: 'Y', // 过滤发货单：是否废料
      isExport: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.get('/api/ps/invoice/bill/filterInvoice', params)
  }

  /**
   * 获取发货单信息
   */
   getInvoiceBillOrder(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      invoiceBillCode: '',
      invoiceBillDate: '',
      invoiceBillState: '', // 筛选发货单状态
      screenInvoiceBillState: '', // 筛选发货单状态-多选：'20,70'
      invoiceFlag: 'Y', // 过滤发货单：是否废料
      isExport: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.get('/api/ps/invoice/bill/query', params)
  }

  /**
   * 获取发货单明细信息
   */
   getInvoiceBillOrderDetail(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      plantCode: '',
      // invoiceBillCode: '',
      // invoiceBillDate: '',
      state: '',
      shippingAddress: '', // 精确
      shippingAddressVague: '', // 模糊
      distributionWarehouseCode: '', // 配送公仓编码
      stateList: ['50', '70'], // 过滤状态列表
      filterBatchCode: '', // 过滤已存在批号
      filterHighPriceState: '', // 过滤高价先出状态
      isExport: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.get('/api/ps/invoice/bill/detailed/query', params)
  }

  /**
   * 获取调拨单信息
   */
   getTransferOrder(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      code: '',
      date: '',
      isExport: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.get('/api/ps/transfer/order/query', params)
  }

  /**
   * 获取调拨单明细信息
   */
   getTransferOrderDetail(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      plantCode: '',
      code: '',
      pono: '',
      batchNum: '',
      transportationEnterprise: '', // 精确
      transportationEnterpriseVague: '', // 模糊
      stockCode: '',
      isExport: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.get('/api/ps/transfer/order/detailed/query', params)
  }
  
  /**
   * 获取客户订单信息
   */
   getCustomerOrder(queryParams): Observable<ResponseDto> {
    const params = Object.assign({}, {
      cusAbbreviation: '',
      productCategory: '',
      cusDeliveryDate: '',
      cusOrderCode: '',
      cusOrderState: '',
      orderDate: '',
      states: [], // 只显示对应状态
      plan: '',
      steelType: '',
      prodType: '',
      isExport: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.post('/api/ps/psCusOrder/list', params)
  }

  /**
   * 获取分行客户订单信息
   */
   getBranchCustomerOrder(queryParams): Observable<ResponseDto> {
    let excludeStates = [];
    if(queryParams.isCanChange) {
      excludeStates = ['50', '60', '70']; // 过滤不可变更、不可分货的状态
    }
    if(queryParams.isCanDist) {
      excludeStates = ['70']; // 过滤不可分货的状态
    }
    delete queryParams.isCanChange;
    const params = Object.assign({}, {
      cusAbbreviation: '',
      cusCode: '',
      compareQuantity: '', // 是否筛选交货重量小于数量的数据
      includeStates: [], // 包含的状态
      excludeStates: excludeStates, // 不包含的状态
      productCategory: '',
      cusDeliveryDate: '',
      cusOrderCode: '',
      cusOrderState: '',
      bindFlag: '', // 绑定标识，空表示所有，Y 查询已绑定，N 查询未绑定
      orderDate: '',
      plan: '',
      steelType: '',
      prodType: '',
      fuzzy: '', // 客户订单号、客户简称、存货名称模糊搜索
      branchCusOrderCode: '',
      noDistributed: '', // true 表示筛选分行客户订单状态 >= 30
      isExport: false,
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.post('/api/ps/psbranchcusorder/list', params)
  }

  /**
   * 获取业务员
   * @param queryParams 
   * @returns 
   */
  getSalemans(queryParams): Observable<ResponseDto> {
    const params = Object.assign({
      depCode: "",
      depName: "",
      export: false,
      offset: 0,
      pageIndex: 1,
      pageSize: 10,
      personCode: "",
      personName: "",
      plantCode: ""
    }, queryParams)
    return this.http.post('/api/ps/psuserhwu8/query', params);
  }

  /**
   * 获取用户
   * @param queryParams 
   * @returns 
   */
  getUsers(queryParams): Observable<ResponseDto> {
    const params = Object.assign({
      description: "",
      userName: "",
      page: 1,
      pageSize: 10,
    }, queryParams)
    return this.http.get('/api/admin/baseusers/userPage', params);
  }

  /**
   * 获取部门信息
   */
  getDeparts(queryParams): Observable<ResponseDto> {
    const params = Object.assign({
      depCode: '',
      depEnd: '', // 筛选 是否最末级 指标
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.get('/api/ps/psdepartment/query', params);
  }

  /**
   * 获取收发类别信息
   */
   getLbs(queryParams): Observable<ResponseDto> {
    const params = Object.assign({
      rdCode: '',
      rdFlag: 0, // 1表示入库类别，0表示出库类别
      rdGrade: '',
      pageIndex: 1,
      pageSize: 100
    }, queryParams);
    return this.http.get('/api/ps/pssendreceive/query', params);
  }

  /**
   * 获取仓库信息
   */
  getWares(queryParams): Observable<ResponseDto> {
      const params = Object.assign({
        subinventoryCode: '', // 仓库编码、名称模糊搜素
        pageIndex: 1,
        pageSize: 100
      }, queryParams);
      return this.http.get('/api/ps/psSubinventories/query', params);
  }

  /**
   * 获取分货明细信息
   */
  getSaleDistDetaileds(queryParams): Observable<ResponseDto> {
      const params = Object.assign({
        pageIndex: 1,
        pageSize: 100
      }, queryParams);
      return this.http.get('/api/ps/sales/dist/detailed/query', params);
  }

  getSalesman(queryParams): Observable<ResponseDto> {
    return this.http.get('/api/ps/psuserhwu8/queryHwUserU8', queryParams)
  }

  /**
   * 获取开配送单规则信息
   */
  getDistributions(queryParams): Observable<ResponseDto> {
      const params = Object.assign({
        plantCode: null,
        warehouse: '',
        pageIndex: 1,
        pageSize: 100
      }, queryParams);
      return this.http.get('/api/ps/distribution/order/rule/queryWarehouse', params);
  }

  /**
   * 获取资源产线
   */
  getResourceInfoByItem(queryParams): Observable<ResponseDto> {
      const params = Object.assign({
        plantCode: null,
        itemId: '',
      }, queryParams);
      return this.http.get('/api/ps/psitemroutings/getResourceInfoByItem', params);
  }

  /**
   * 获取现有库存表
   */
  getOnhands(queryParams): Observable<ResponseDto> {
    const params = Object.assign({
      plantCode: '',
      batchCode: '',
      itemCode: '',
      pageIndex: 1,
      pageSize: 100,
      isExport: false
    }, queryParams);
    params.batchCodeLike = params.batchCode;
    delete params.batchCode;
    return this.http.get('/api/ps/psOnhandQuantities/pageQuery', params);
  }

  /**
   * 废料销售订单获取现有库存表
   */
  getOnhandsWasteSale(queryParams): Observable<ResponseDto> {
    const params = Object.assign({
      plantCode: '',
      batchCode: '',
      itemCode: '',
      pageIndex: 1,
      pageSize: 100,
      isExport: false
    }, queryParams);
    params.batchCodeLike = params.batchCode;
    delete params.batchCode;
    return this.http.get('/api/ps/psOnhandQuantities/orderDetailQuery', params);
  }
    
  /**
   * 轮询
   * @param receptId 轮询id 
   * @returns 
   */
   recept(id): Observable<any> {
    return this.http.get(
      '/api/ps/contract/downloadPB',
      {
        receptId: id
      },
    ).pipe(this.backoff(4, 1000));
  }

  backoff(maxTries: number, delay: number) {
    return pipe(
      retryWhen((attempts: any) =>
        zip(range(1, maxTries + 1), this.handleRetry(attempts)).pipe(
          mergeMap(([i, err]) => {
            console.log(i, err);
            return (i > maxTries)? throwError(err) : of(i)
          }),
          map(i => i * i),
          mergeMap(v => timer(v * delay)),
        ),
      ),
    );
  }

  private handleRetry(errors: Observable<ResponseDto>): Observable<any> {
    return errors.mergeMap(error => {
      if (error.code === 999) {
        return Observable.of(error);
      } else {
        return Observable.throw(error);
      }
    });
  }

  pageDownloadFile(data, fileName) {
    const blob = this.pdfBase64ToBlob(data);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.pdf`;
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  pagePreviewFile(data, fileName) {
    const blob = this.pdfBase64ToBlob(data);
    const url = window.URL.createObjectURL(blob);
    const newWin = window.open(url);
    newWin.onload = function() {
      newWin.document.title = fileName;
    }
    window.URL.revokeObjectURL(url);
  }
}