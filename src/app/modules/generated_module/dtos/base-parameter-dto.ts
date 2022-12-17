

export class BaseParameterDto {
    public Id: string;
    public PARAMETER_CODE: string;
    public PARAMETER_NAME: string;
    public APPLICATION_CODE: string;
    public DESCRIPTION: string;
    public SYS_ENABLED_FLAG: string;
    public REG_ENABLED_FLAG: string;
    public RESP_ENABLED_FLAG: string;
    public USER_ENABLED_FLAG: string;
    public PLANT_ENABLED_FLAG: string;
    public START_DATE: Date;
    public END_DATE: Date;
    public LANGUAGE: string;
}
