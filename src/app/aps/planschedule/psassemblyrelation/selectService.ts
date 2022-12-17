/*
 * @Author: Zwh
 * @contact: zhangweika@outlook.com
 * @Date: 2020-09-17 09:00:44
 * @LastEditors: Zwh
 * @LastEditTime: 2020-09-22 15:33:55
 * @Note: ...
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { _HttpClient } from '@delon/theme';
import { SSL_OP_ALL } from 'constants';
import { Size } from '@progress/kendo-drawing/dist/npm/geometry';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';

@Injectable()

export class SelectService {

    constructor(
        public http: _HttpClient
    ) { }

    randomUserUrl: any;

    getRandomNameList(url: String): Observable<string[]> {
        return this.http.get(`${url}`).pipe(map((res: any) => res.data)).pipe(map((list: any) => {
            return list.content;
        }));
    }
}
