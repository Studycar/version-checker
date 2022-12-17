import { Injectable } from '@angular/core';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';
import { GridSearchResponseDto } from '../../../modules/generated_module/dtos/grid-search-response-dto';
import { ActionResponseDto } from '../../../modules/generated_module/dtos/action-response-dto';


@Injectable()
export class EditService extends CommonQueryService {
  /* -------------------调整网格编辑------------------ */
  private updatedItems: any[] = [];

  private getIndex(item: any, data: any[], keyField = 'Id'): number {
    for (let idx = 0; idx < data.length; idx++) {
      if (data[idx][keyField] === item[keyField]) {
        return idx;
      }
    }
    return -1;
  }

  public update(item: any): void {
    const index = this.getIndex(item, this.updatedItems);
    if (index !== -1) {
      this.updatedItems.splice(index, 1, item);
    } else {
      this.updatedItems.push(item);
    }
  }
  public getUpdateItems(): any[] {
    return this.updatedItems;
  }

  public hasChanges(): boolean {
    return Boolean(this.updatedItems.length);
  }

  public reset() {
    this.updatedItems = [];
  }

  /* ---------------------------------------------- */

  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService
  ) {
    super(http, appApiService);
  }
}


