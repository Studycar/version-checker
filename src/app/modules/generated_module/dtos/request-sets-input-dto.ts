export class RequestSetsInputDto {

    public REQUEST_SET_ID: string;

    // 应用模块ID
    public APPLICATION_ID: string;

    public REQUEST_SET_NAME: string;

    public USER_REQUEST_SET_NAME: string;

    public ENABLED_FLAG: string;

    // 说明
    public DESCRIPTION: string;

    public CONCURRENT_PROGRAM_ID: string;
}

export class RequestSetsStageInputDto {
    public REQUEST_SET_ID: string;
    public REQUEST_SET_STAGE_ID: string;
    public DISPLAY_SEQUENCE: number;
    public STAGE_NAME: string;
    public DESCRIPTION: string;
}

export class RequestSetsStageProgramInputDto {
    public REQUEST_SET_ID: string;
    public REQUEST_SET_STAGE_ID: string;
    public REQUEST_SET_PROGRAM_ID: string;
    public SEQUENCE: number;
    public CONCURRENT_PROGRAM_ID: string;
}

export class RequestSetsStageProgramArgInputDto {
    public ID: string;
    public REQUEST_SET_ID: string;
    public REQUEST_SET_STAGE_ID: string;
    public REQUEST_SET_PROGRAM_ID: string;
    public CONCURRENT_PARAMETER_ID: string;
    public DEFAULT_TYPE: number;
    public DEFAULT_VALUE: string;
    public UPDATE_FLAG: string;
    public SHARED_PARAMETER_NAME: string;
}
