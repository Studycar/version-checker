export class PcBuyerAuthDto {

    public Id: string;
    /**  工厂编号 */
    public PLANT_CODE: string;
    /**  授权人员工号 来源：PC_BUYERS */
    public EMPLOYEE_NUMBER: string;
    /**  授权人姓名 来源：PC_BUYERS */
    public EMPLOYEE_NAME: string;
    /**  被授权人员工号 来源：PC_BUYERS */
    public AUTHORIZEE_NUMBER: string;
    /**  被授权人姓名 来源：PC_BUYERS */
    public AUTHORIZEE_NAME: string;
    /**  是否有效状态 */
    public ENABLE_FLAG: string;

}
