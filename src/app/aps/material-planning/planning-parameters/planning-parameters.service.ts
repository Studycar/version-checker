import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';

@Injectable()
export class PlanningParametersService {

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  //queryUrl = '/afs/ServerMrpPlanParameter/MrpPlanParameterService/QueryPlan';
  //planningPlantQueryUrl = '/afs/ServerMrpPlanParameter/MrpPlanParameterService/QueryPlanPlant';
  queryUrl = '/api/mrp/mrpplans/mrpplanlist';
  planningPlantQueryUrl = '/api/mrp/mrpplans/mrpplanplantlist';

  update(saveData: object): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/SavePlan',
      '/api/mrp/mrpplans/mrpplansave',
      { ...saveData }
    );
  }

  getPlanParameterById(id: string): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/QueryPlanById',
      '/api/mrp/mrpplans/'+id
    );
  }

  //remove(listIds: string[]): Observable<ResponseDto> {
    remove(saveData: object): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/DeletePlan',
      '/api/mrp/mrpplans/mrpplandelete',saveData
    );
  }

  loadGlobalParametersData(Data: any): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      ///afs/ServerMrpPlanParameter/MrpPlanParameterService/QueryPlanParameter',
      '/api/mrp/mrpplans/mrpplanparalist',Data
    );
  }

  saveGlobalParameters(data): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/SavePlanParameter',
      '/api/mrp/mrpplans/mrpplanparasave',data
    );
  }

  savePlanPlant(saveData: object): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/SavePlanPlant',
      '/api/mrp/mrpplans/mrpplanplantsave',
      { ...saveData }
    );
  }

  removePlanPlant(data): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/DeletePlanPlant',
      '/api/mrp/mrpplans/mrpplanplantdelete',
      { ...data }
    );
  }

  getPlanPlantById(parameterId: string): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      '/afs/ServerMrpPlanParameter/MrpPlanParameterService/QueryPlanPlantById',
      { parameterId }
    );
  }

  queryPlanPlantDemand(data): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/QueryPlanPlantDemand',
      '/api/mrp/mrpplans/mrpplanplantdemandlist',data
    );
  }

  savePlanPlantDemand(data): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/SavePlanPlantDemand',
      '/api/mrp/mrpplans/mrpplanplantdemandsave',data
    );
  }

  queryPlanPlantSupply(data): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/QueryPlanPlantSupply',
      '/api/mrp/mrpplans/mrpplanplantsupplylist',data
    );
  }

  savePlanPlantSupply(data): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/SavePlanPlantSupply',
      '/api/mrp/mrpplans/mrpplanplantsupplysave',data
    );
  }

  queryPlanPlantParameter(data:object): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/QueryPlanPlantParameter',
      '/api/mrp/mrpplans/mrpplanplantparameterlist',data
      //{ planName, plantCode }
    );
  }

  savePlanPlantParameter(data): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/SavePlanPlantParameter',
      '/api/mrp/mrpplans/mrpplanplantparametersave',data
    );
  }

  queryPlanPlantOperatorLibrary(data): Observable<ResponseDto> {
    return this.http.get<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/QueryPlanPlantSubinventories',
      '/api/mrp/mrpplans/mrpplanplantsubinvlist',data
    );
  }

  savePlanPlantOperatorLibrary(data): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(
      //'/afs/ServerMrpPlanParameter/MrpPlanParameterService/SavePlanPlantSubinventories',
      '/api/mrp/mrpplans/mrpplanplantsubinvsave',data
    );
  }
}
