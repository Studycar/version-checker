import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppApiService } from '../../base_module/services/app-api-service';
import { GridSearchResponseDto } from '../dtos/grid-search-response-dto';
import { GridSearchRequestDto } from '../dtos/grid-search-request-dto';
import { ActionResponseDto } from '../dtos/action-response-dto';
import { ShiftthemappingDto } from 'app/modules/generated_module/dtos/Shift-the-mapping-dto';

@Injectable()
/** 快码管理服务 */
export class ShiftthemappingManageService {
  constructor(private appApiService: AppApiService) { }

    queryByPageUrl = this.appApiService.appConfigService.getApiUrlBase() + '/afs/serverpsbaseinfocode/psbaseinfocode/querybypage';
    
    Insert(dto: ShiftthemappingDto): Observable<ActionResponseDto> {
      return this.appApiService.call<ActionResponseDto>(
          '/afs/serverpsbaseinfocode/psbaseinfocode/insert',
          {
              dto
          });
  }

  Update(dto: ShiftthemappingDto): Observable<ActionResponseDto> {
    return this.appApiService.call<ActionResponseDto>(
        '/afs/serverpsbaseinfocode/psbaseinfocode/update',
        {
            dto
        });
      }

    Delete(dto: ShiftthemappingDto): Observable<ActionResponseDto> {
      return this.appApiService.call<ActionResponseDto>(
          '/afs/serverpsbaseinfocode/psbaseinfocode/delete',
          {
              dto
          });
        }



    QueryOne(lookup_code_id: string): Observable<ActionResponseDto> {
        return this.appApiService.call<ActionResponseDto>(
            '/afs/serverpsbaseinfocode/psbaseinfocode/queryone?lookup_code_id=' + lookup_code_id,
            {
            }, { method: 'GET' });
      }
  }
