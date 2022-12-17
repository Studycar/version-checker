import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { zip } from 'rxjs/observable/zip';
import { map } from 'rxjs/operators/map';
import { MaterialmaintenanceService } from '../../../modules/generated_module/services/materialmaintenance-service';
import { NzMessageService } from 'ng-zorro-antd';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { ComVindicateService } from '../../../modules/generated_module/services/comvindicate-service';
import { CommonQueryService, HttpAction } from '../../../modules/generated_module/services/common-query.service';
import { AppApiService } from '../../../modules/base_module/services/app-api-service';
import { _HttpClient } from '@delon/theme';
import { ResponseDto } from '../../../modules/generated_module/dtos/response-dto';

// import { TokenService } from '@delon/auth';
const UPDATE_ACTION = 'update';
const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));
@Injectable()
export class EditService extends CommonQueryService {
  // private data: any[] = [];
  private originalData: any[] = [];
  private updatedItems: any[] = [];
  queryUrl = '/api/admin/basecolormanger/getcolor';


  constructor(
    public http: _HttpClient,
    public appApiService: AppApiService,
    private materialmaintenanceService: MaterialmaintenanceService,
    public msgSrv: NzMessageService,
    public comVindicateService: ComVindicateService,
    // private tokenService: TokenService,
  ) {
    super(http, appApiService);
  }


  GetColorHead(): Observable<any> {
    return this.http
      .get('/api/admin/basecolormanger/getcolorheaderid', {
      });
  }

  GetColor(headerId?: string, language?: string, colorName?: string, meaning?: string): Observable<any> {
    return this.http
      .get('/api/admin/basecolormanger/getcolor?' + 'headerId=' + headerId + '&language=' + language
        + '&colorName=' + colorName + '&meaning=' + meaning,
        {
        });
  }

  getMEANING(headerId?: string, language?: string, colorName?: string, meaning?: string): Observable<any> {
    return this.http
      .get('/api/admin/basecolormanger/getcolor?' + 'headerId=' + headerId + '&language=' + language
        + '&colorName=' + colorName + '&meaning=' + meaning,
        {
        });
  }


  InsertColor(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/admin/basecolormanger/insertcolor', dto);
  }

  UpdateColor(dto: any): Observable<ResponseDto> {
    return this.http
      .post('/api/admin/basecolormanger/updatecolor', dto);
  }


  // 10进制转RGB
  public RGBToHex(rgb) {
    const k = rgb.toString(16);
    return '#' + k;
  }

  rgb(R, G, B) {
    return this.toHex(R) + this.toHex(G) + this.toHex(B);
  }
  // 色值16制转换函数
  toHex(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) return '00';
    n = Math.max(0, Math.min(n, 255));
    return '0123456789ABCDEF'.charAt((n - n % 16) / 16) + '0123456789ABCDEF'.charAt(n % 16);
  }


  public HexToRGB(rgb) {
    const regexp = '/[0-9]{0,3}/g';
    const re = rgb.match(regexp); // 利用正则表达式去掉多余的部分，将rgb中的数字提取
    let hexColor = '#';
    const hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    for (let i = 0; i < re.length; i++) {
      // tslint:disable-next-line:prefer-const
      let r = null, c = re[i], l = c;
      const hexAr = [];
      while (c > 16) {
        r = c % 16;
        c = (c / 16) >> 0;
        hexAr.push(hex[r]);
      } hexAr.push(hex[c]);
      if (l < 16 && l !== '') {
        hexAr.push(0);
      }
      hexColor += hexAr.reverse().join('');
    }
    // alert(hexColor)  
    // return hexColor;  
    return hexColor;
  }
}
