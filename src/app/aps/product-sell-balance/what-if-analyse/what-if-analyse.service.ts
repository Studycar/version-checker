import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class WhatIfAnalyseService {

  constructor() {
  }

  search(): Observable<any> {
    return of({ data: [] });
  }
}
