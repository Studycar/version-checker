/** 物料维护 */
export class MaterialmaintenanceInputDto {
    /** 物料 */
  public ITEMCODE: string;

    /** 旧物料 */
  public OLDITEMCODE: string;

    /**物料分类  */
  public CONCATENATEDSEGMENTS: string;

    /**上级物料  */
  public SUPERIORITEM: string;

  /** 是否启用工序排程 */
  public PROCESSSCHEDULINGFLAG: string;

  /** 是否级联跟单 */
  public CASCADEFOLLOWEDFLAG: string;

  /** 是否跟随  */
  public FOLLOWEDFLAG: string;

  /** 是否有效 */
  public ENABLEFLAG: string;

  /** 计划分类 */
  public PLANNINGTYPE: string;

  /** 联动层次 */
  public LINKAGELEVEL: string;

  /**制造采购  */
  public PLANNINGMAKEBUYCODE: string;

  /**生产线选择规则  */
  public PRODLINERULE: string;

  /**组织  */
  public PLANTCODE: string;

  /**拒绝联动  */
  public REFUSELINKAGEFLAG: string;

  /**物料创建时间   */
  public ITEMCREATEDATE: string;

  /**事业部  */
  public SCHEDULEREGIONID: string;

  /**主计量单位   */
  public PRIMARYUOM: string;

  /**排程分类  */
  public SCHEDULINGCATEGORY: string;

  /**物料描述  */
  public DESCRIPTIONS: string;

  /**用户物料类型  */
  public USERITEMTYPE: string;

  /**计划员  */
  public PLANNERCODE: string;

  public ISCRUXITEM: string;
  public EXCEEDLEADTIME: string;
  public SAFETYLEADTIME: string;
  public POSTPROCESSINGLEADTIME: string;
  public PROCESSINGLEADTIMENEW: string;
  public PREPROCESSINGLEADTIME: string;
  public ATTRIBUTE3: string;
  public ATTRIBUTE30: string;
  public ATTRIBUTE29: string;
  public ATTRIBUTE28: string;
  public ATTRIBUTE27: string;
  public ATTRIBUTE26: string;
  public ATTRIBUTE22: string;
  public ATTRIBUTE20: string;
  public ATTRIBUTE19: string;
  public ATTRIBUTE18: string;
  public ATTRIBUTE16: string;
  public ATTRIBUTE15: string;
  public ATTRIBUTE14: string;
  public ATTRIBUTE13: string;
  public ATTRIBUTE10: string;
  public ATTRIBUTE9: string;
  public ATTRIBUTE8: string;
  public ATTRIBUTE7: string;
  public ATTRIBUTE5: string;
  public ATTRIBUTE2: string;
  public ATTRIBUTE1: string;
  public ATTRIBUTE4: string;
  public PLANTID: string;
  public KEYCOMPONENTFLAG: string;
  public ITEMIDENTIFYCODE: string;
  public ASSEMBLYSHRINKAGE: string;
  public COMPONENTSHRINKAGE: string;
  public ECONOMICLOTSIZE: string;
  public TRANSFERLOTSIZE: string;
  public SCHEDULETIMEFENCE: string;
  public RELEASETIMEFENCE: string;
  public DEMANDTIMEFENCE: string;
  public FIXTIMEFENCE: string;
  public OPTIMIZATIONGROUP: string;
  public PARTNERITEMID: string;
  public ORDERTIMEFENCE: string;
  public ISSUECTRLQTY: string;
  public ISSUECTRLTYPE: string;
  public UNITWEIGHT: string;
  public COMPLETECTRLQTY: string;
  public COMPLETECTRLTYPE: string;
  public CONTROLFLAG: string;
  public ECONOMICSPLITPARAMETER: string;
  public MOPRINTTYPE: string;
  public DEMANDMERGETIMEFENCE: string;
  public SAFETYSTOCKMETHOD: string;
  public SAFETYSTOCKVALUE: string;
  public SUPERIORITEMID: string;
  public ITEMRULE: string;
  public COLORCODE: string;
  public SIMILARATTRIBUTES: string;
  public ATTRIBUTE6: string;
}
