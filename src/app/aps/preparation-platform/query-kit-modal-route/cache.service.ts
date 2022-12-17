import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  constructor() { }

  plantCode: any;
  itemCode: any;
  moStatusOptions: any[];
  makeBuyCodes: any[];
  type: string;
  componentItemId: string;
  componentItemCode: string;
}
