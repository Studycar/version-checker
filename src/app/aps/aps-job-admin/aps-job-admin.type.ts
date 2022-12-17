export declare type SN = string | number;

export interface PageParam {
  start: SN;
  length: SN;
}

export interface JobInfoStartParam {
  id: SN;
}

export interface JobLogListParam extends PageParam {
  jobGroup: SN;
  jobId: SN;
  logStatus: SN;
  filterTime: string;
}

export interface JobGroupRemoveParam {
  id: SN;
}

export interface JobGroupListParam extends PageParam {
  appname: string;
  title: string;
}

export interface JobGroupUpdateParam {
  appname: string;
  title: string;
  addressType: SN;
  addressList: string;
  id?: SN;
}

export interface JobInfoNextExecuteTimeParam {
  cron: string;
}

export interface JobInfoListParam extends PageParam {
  jobGroup: SN;
  triggerStatus: SN;
  jobDesc: SN;
  executorHandler: SN;
  author: SN;
}

export interface JobAdminApiData {
  data: any[];
  recordsTotal: SN;
  recordsFiltered: SN;
}

export interface JobAdminMessageApiData {
  code: SN;
  content: any;
  msg: string | null;
}
