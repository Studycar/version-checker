import { Injectable } from '@angular/core';


/**
 * create by jianl 
 * 计算服务，因为float类型计算会出现精度错误的误差，所以新建了一个服务类
 */
@Injectable()
export class NumberCalculateService {
    constructor() { }

    public add(value1, value2) {
        let r1 = 0, r2 = 0, m = 0;
        try {
            r1 = value1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = value2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return (value1 * m + value2 * m) / m;
    }
}
