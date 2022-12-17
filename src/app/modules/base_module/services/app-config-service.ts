import { Injectable, Injector } from '@angular/core';
import { I18NService } from '@core/i18n/i18n.service';
import { format } from 'date-fns';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

/** 保存全局配置的服务 */
@Injectable()
export class AppConfigService {
  /** Api的基础地址 */
  private apiUrlBase: string;
  /** 当前使用的语言，例如"en-US" */
  private language: string;
  /** 默认使用的语言 */
  private defaultLanguage: string;
  /** 客户端传给服务端使用的语言头 */
  private languageHeader: string;
  /** 当前使用的语言在本地储存的key */
  private languageKey: string;
  /** 当前使用的时区，例如"America/Los_Angeles" */
  private timezone: string;
  /** 默认使用的时区 */
  private defaultTimezone: string;
  /** 客户端传给服务端使用的语言头 */
  private timezoneHeader: string;
  /** 当前使用的时区在本地储存的key */
  private timezoneKey: string;
  /** 登录地址 */
  private loginUrl: string[];
  /** 当前会话Id */
  private sessionId: string;
  /** 客户端传给服务端使用的会话Id头 */
  private sessionIdHeader: string;
  /** 服务端传给客户端使用的会话Id头 */
  private sessionIdSetHeader: string;
  /** 会话Id储存在本地储存的key */
  private sessionIdKey: string;
  /** 用户id */
  private userId: string;
  /** 用户名 */
  private userName: string;
  /** 真实用户名 */
  private userDescription: string;
  /** 用户id头 */
  private userIdHeader: string;
  /** 用户Id储存在本地储存的key */
  private userIdKey: string;
  /** 用户名在本地存储的key值 */
  private userNameKey = 'user_name';
  /** 真实用户名在本地存储的key值 */
  private userDescriptionKey = 'user_escription';
  /** 当前激活的组织Code */
  private activePlant: { plantCode: string, descriptions: string};
  /** 用户默认的组织Code */
  private defaultPlantCode: string;
  /**create by jianl 当前激活的组织所属的事业部 */
  private activeScheduleRegionCode: string;
  /**create by jianl 默认区域 */
  private defaultScheduleRegionCode: string;
  /** 当前激活的组织Code储存在本地储存的key */
  private activePlantCodeKey: string;
  /** 用户默认组织Code储存在本地储存的key */
  private defaultPlantCodeKey: string;
  /** 当前激活的事业部Code储存在本地储存的key */
  private activeScheduleRegionCodeKey: string;
  /** create by jianl 默认区域Code储存在本地储存的key */
  private defaultScheduleRegionCodeKey: string;
  /** 组织Code头 */
  private plantCodeHeader: string;
  /** 职责代码 */
  private respCode: string;
  /** 职责代码头 */
  private respCodeHeader: string;
  /** 职责Code储存在本地储存的key */
  private respCodeKey: string;
  /** 当前激活的职责Code储存在本地储存的key */
  private activeRespCodeKey: string;
  /** hostName头 */
  private hostNameHeader: string;
  /** timeStamp头 */
  private timeStampHeader: string;
  /** 用户权限内组织,以逗号隔开 */
  private plantCodes: string;
  /** 用户权限内组织Code储存在本地储存的key */
  private plantCodesKey: string;

  public activePlantObs = new Subject<{plantCode: string, descriptions: string}>();

  constructor(private i18NService: I18NService, private injector: Injector) {
    const appConfig = window['appConfig'] || {};
    this.apiUrlBase =
      appConfig.apiUrlBase || location.protocol + '//' + location.host;
    this.language = appConfig.language || null;
    this.defaultLanguage = appConfig.defaultLnaguage || 'zh-CN';
    this.languageHeader = appConfig.languageHeader || 'Culture';
    this.languageKey = appConfig.languageKey || 'Culture';
    this.timezone = appConfig.timezone || null;
    this.defaultTimezone = appConfig.defaultTimezone || 'Asia/Shanghai';
    this.timezoneHeader = appConfig.timezoneHeader || 'TimeStamp';
    this.timezoneKey = appConfig.timezoneKey || 'Aps-Timezone';
    this.sessionIdHeader = appConfig.sessionIdHeader || 'session_id';
    this.sessionIdSetHeader = appConfig.sessionIdSetHeader || 'session_id';
    this.userIdHeader = this.userIdKey = appConfig.userIdHeader || 'user_id';
    this.plantCodeHeader = this.activePlantCodeKey =
      appConfig.plantCodeHeader || 'active_plant_code';
    this.activeScheduleRegionCodeKey =
      appConfig.activeScheduleRegionCodeKey || 'active_schedule_region_code';
    this.defaultPlantCodeKey =
      appConfig.defaultPlantCodeKey || 'default_plant_code';
    this.defaultScheduleRegionCodeKey =
      appConfig.defaultScheduleRegionCodeKey || 'default_schedule_region_code';
    this.respCodeHeader = this.respCodeKey =
      appConfig.respCodeHeader || 'resp_code';
    this.activeRespCodeKey = 'active_resp_code';
    this.hostNameHeader = appConfig.hostNameHeader || 'HostName';
    this.timeStampHeader = appConfig.timeStampHeader || 'TimeStamp';
    this.plantCodesKey = 'plant_codes';
  }

  /** 获取当前业务员产品大类 */
  getActiveProductCategory() {
    return null;
  }

  /** 获取Api的基础地址 */
  getApiUrlBase(): string {
    return this.apiUrlBase;
  }

  /** 获取当前使用的语言 */
  getLanguage(): string {
    return this.i18NService.currentLang;
  }

  /** 设置当前使用的语言 */
  setLanguage(language: string) {
    this.i18NService.use(language);
  }

  // 获取客户端传给服务端使用的语言头
  getLanguageHeader(): string {
    return this.languageHeader;
  }

  // 获取客户端传给服务端使用的语言头
  getHostNameHeader(): string {
    return this.hostNameHeader;
  }

  // 获取当前使用的时区
  getTimezone(): string {
    this.timezone =
      localStorage.getItem(this.timezoneKey) || this.defaultTimezone;
    return this.timezone;
  }

  /** 设置当前使用的时区 */
  setTimezone(timezone: string) {
    this.timezone = timezone;
    localStorage.setItem(this.timezoneKey, timezone);
  }

  // 获取客户端传给服务端使用的语言头
  getTimezoneHeader(): string {
    return this.timezoneHeader;
  }

  // 获取登录地址
  getLoginUrl(): string[] {
    return this.loginUrl;
  }

  // 获取当前会话Id
  getSessionId(): string {
    this.sessionId = localStorage.getItem(this.sessionIdKey);
    // console.log("get session:", this.sessionId);
    return this.sessionId;
  }

  // 设置当前会话Id
  setSessionId(sessionId: string): void {
    // console.log("set session:", sessionId);
    this.sessionId = sessionId;
    localStorage.setItem(this.sessionIdKey, sessionId);
  }

  // 获取客户端传给服务端使用的会话Id头
  getSessionIdHeader(): string {
    return this.sessionIdHeader;
  }

  // 获取服务端传给客户端使用的会话Id头
  getSessionIdSetHeader(): string {
    return this.sessionIdSetHeader;
  }

  // 获取当前用户Id
  getUserId(): string {
    return (this.userId = localStorage.getItem(this.userIdKey));
  }

  // 设置当前用户Id
  setUserId(userId: string): void {
    this.userId = userId;
    localStorage.setItem(this.userIdKey, userId);
  }

  // 获取当前用户名
  getUserName(): string {
    return (this.userName = localStorage.getItem(this.userNameKey));
  }

  // 设置当前用户名
  setUserName(userName: string): void {
    this.userName = userName;
    localStorage.setItem(this.userNameKey, userName);
  }

  // 获取当前真实用户名
  getUserDescription(): string {
    return (this.userDescription = localStorage.getItem(this.userDescriptionKey));
  }

  // 设置当前用户名
  setUserDescription(userDescription: string): void {
    this.userDescription = userDescription;
    localStorage.setItem(this.userDescriptionKey, userDescription);
  }

  // 获取客户端传给服务端使用的会话Id头
  getUserIdHeader(): string {
    return this.userIdHeader;
  }

  /**modify by jianl
   * 兼容旧方法名
   */
  getPlantCode(): string {
    return this.getActivePlantCode();
  }

  /**modify by jianl，jianl更新了命名，区分了active和default两种工厂code
   * active的意思是：当前用户切换的工厂
   * default的意思是：当前用户配置的默认工厂
   * 两者是有区别的
   * 此方法返回的是当前用户切换的工厂
   */
  getActivePlantCode(): string {
    this.activePlant = JSON.parse(localStorage.getItem(this.activePlantCodeKey));
    if (
      this.activePlant === undefined
    ) {
      this.activePlant = { plantCode: null, descriptions: null };
    }
    return this.activePlant.plantCode;
  }

  /**modify by jianl，jianl更新了命名，区分了active和default两种工厂code
   * active的意思是：当前用户切换的工厂
   * default的意思是：当前用户配置的默认工厂
   * 两者是有区别的
   * 此方法返回的是当前用户切换的工厂
   */
  setActivePlantCode(activePlant: { plantCode: string, descriptions: string }): void {
    this.activePlant = activePlant;
    this.activePlantObs.next(activePlant);
    localStorage.setItem(this.activePlantCodeKey, JSON.stringify(this.activePlant));
  }

  /**modify by jianl，jianl更新了命名，区分了active和default两种工厂code
   * active的意思是：当前用户切换的工厂
   * default的意思是：当前用户配置的默认工厂
   * 两者是有区别的
   * 此方法返回的是当前用户切换的工厂
   */
  getDefaultPlantCode(): string {
    this.defaultPlantCode = localStorage.getItem(this.defaultPlantCodeKey);
    if (
      this.defaultPlantCode === 'null' ||
      this.defaultPlantCode === 'undefined' ||
      this.defaultPlantCode === undefined
    ) {
      this.defaultPlantCode = null;
    }
    return this.defaultPlantCode;
  }

  /**modify by jianl，jianl更新了命名，区分了active和default两种工厂code
   * active的意思是：当前用户切换的工厂
   * default的意思是：当前用户配置的默认工厂
   * 两者是有区别的
   * 此方法返回的是当前用户切换的工厂
   */
  setDefaultPlantCode(defaultPlantCode: string): void {
    this.defaultPlantCode = defaultPlantCode;
    localStorage.setItem(this.defaultPlantCodeKey, defaultPlantCode);
  }

  /**create by jianl获取当前用户默认工厂的事业部 */
  getDefaultScheduleRegionCode(): string {
    this.defaultScheduleRegionCode = localStorage.getItem(
      this.defaultScheduleRegionCodeKey,
    );
    if (
      this.defaultScheduleRegionCode === 'null' ||
      this.defaultScheduleRegionCode === 'undefined' ||
      this.defaultScheduleRegionCode === undefined
    ) {
      this.defaultScheduleRegionCode = null;
    }
    return this.defaultScheduleRegionCode;
  }

  /**create by jianl设置当前用户默认工厂的事业部 */
  setDefaultScheduleRegionCode(defaultScheduleRegionCode: string): void {
    this.defaultScheduleRegionCode = defaultScheduleRegionCode;
    localStorage.setItem(
      this.defaultScheduleRegionCodeKey,
      defaultScheduleRegionCode,
    );
  }

  /**create by jianl获取当前工厂的事业部 */
  getActiveScheduleRegionCode(): string {
    this.activeScheduleRegionCode = localStorage.getItem(
      this.activeScheduleRegionCodeKey,
    );
    if (
      this.activeScheduleRegionCode === 'null' ||
      this.activeScheduleRegionCode === 'undefined' ||
      this.activeScheduleRegionCode === undefined
    ) {
      this.activeScheduleRegionCode = null;
    }
    return this.activeScheduleRegionCode;
  }

  /**create by jianl设置当前工厂的事业部 */
  setActiveScheduleRegionCode(activeScheduleRegionCode: string): void {
    this.activeScheduleRegionCode = activeScheduleRegionCode;
    localStorage.setItem(
      this.activeScheduleRegionCodeKey,
      activeScheduleRegionCode,
    );
  }

  // 获取客户端传给服务端使用的PlantCode头
  getPlantCodeHeader(): string {
    return this.plantCodeHeader;
  }

  // 获取当前RespCode
  getRespCode(): string {
    // jianl修改，优先获取当前激活选中的职责，如果没有，再从最初的那个缓存获取
    // this.respCode = localStorage.getItem(this.respCodeKey);
    this.respCode =  localStorage.getItem(this.activeRespCodeKey) ||  localStorage.getItem(this.respCodeKey);
    return this.respCode;
  }

  // 设置当前RespCode
  setRespCode(respCode: string): void {
    this.respCode = respCode;
    localStorage.setItem(this.respCodeKey, respCode);
  }

  // 设置当前激活的RespCode
  setActiveRespCode(respCode: string): void {
    localStorage.setItem(this.activeRespCodeKey, respCode);
  }

  // 获取客户端传给服务端使用的RespCode头
  getRespCodeHeader(): string {
    return this.respCodeHeader;
  }

  // 获取客户端传给服务端使用的timeStamp头
  getTimeStampHeader(): string {
    return this.timeStampHeader;
  }

  /**
   * 获取用户权限内组织,以逗号隔开
   */
  getPlantCodes(): string {
    this.plantCodes = localStorage.getItem(this.plantCodesKey);
    return this.plantCodes;
  }

  // 设置当前PlantCodes
  setPlantCodes(plantCodes: string): void {
    this.plantCodes = plantCodes;
    localStorage.setItem(this.plantCodesKey, plantCodes);
  }

  /**jianl新增，获取数据对象 */
  getConfigDataObj() {
    const userId = this.getUserId();
    const plantCode = this.getActivePlantCode();
    const respCode = this.getRespCode();
    const lng = this.getLanguage();
    const sessionId = this.getSessionId();
    const timeStamp = format(new Date(), 'YYYYMMDD');
    const hostName = location.hostname;
    const otherParamsObj = {
      UserId: userId /**user_id */,
      PlantCode: plantCode /**plant_code */,
      RespCode: respCode /**resp_code */,
      Culture: lng,
      SessionId: sessionId /**session_id */,
      Router: this.injector.get(Router).url,
      HostName: hostName,
      TimeStamp: timeStamp,
    };
    return otherParamsObj;
  }
}
