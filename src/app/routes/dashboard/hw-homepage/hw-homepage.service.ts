import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppApiService } from 'app/modules/base_module/services/app-api-service';
import { ActionResponseDto } from 'app/modules/generated_module/dtos/action-response-dto';
import { GridSearchResponseDto } from 'app/modules/generated_module/dtos/grid-search-response-dto';
import { _HttpClient } from '@delon/theme';
import { formatDate } from '@angular/common';

@Injectable()
export class HwHomepageService {

  constructor(
    private appApiService: AppApiService,
    private http: _HttpClient
  ) { }

  orderDeliveryCycleAnalysisMockData = [
    {
      produce: 15,
      wait: 11,
      shipping: 13,
      target: 45
    },
    {
      produce: 12,
      wait: 17,
      shipping: 11,
      target: 45
    },
    {
      produce: 16,
      wait: 16,
      shipping: 10,
      target: 45
    },
    {
      produce: 9,
      wait: 20,
      shipping: 8,
      target: 45
    },
    {
      produce: 10,
      wait: 15,
      shipping: 30,
      target: 45
    },
    {
      produce: 8,
      wait: 19,
      shipping: 27,
      target: 45
    },
    {
      produce: 12,
      wait: 11,
      shipping: 19,
      target: 45
    },
    {
      produce: 4,
      wait: 10,
      shipping: 25,
      target: 45
    },
    {
      produce: 6,
      wait: 13,
      shipping: 29,
      target: 45
    },
    {
      produce: 14,
      wait: 14,
      shipping: 27,
      target: 45
    },
    {
      produce: 8,
      wait: 19,
      shipping: 23,
      target: 45
    },
    {
      produce: 6,
      wait: 15,
      shipping: 15,
      target: 45
    },
  ];
  orderCompletionRateMockData = [
    {
      completeQty: 2700,
      total: 2800,
      rate: 96
    },
    {
      completeQty: 1900,
      total: 2000,
      rate: 95
    },
    {
      completeQty: 1600,
      total: 2500,
      rate: 64
    },
    {
      completeQty: 1700,
      total: 1700,
      rate: 100
    },
    {
      completeQty: 2500,
      total: 3100,
      rate: 81
    },
    {
      completeQty: 1700,
      total: 2900,
      rate: 59
    },
    {
      completeQty: 1800,
      total: 3000,
      rate: 60
    },
    {
      completeQty: 3000,
      total: 3100,
      rate: 97
    },
    {
      completeQty: 2700,
      total: 2900,
      rate: 93
    },
    {
      completeQty: 2600,
      total: 3400,
      rate: 76
    },
    {
      completeQty: 1900,
      total: 2500,
      rate: 76
    },
    {
      completeQty: 3100,
      total: 3200,
      rate: 97
    },
  ];
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth();
  currentDate = new Date().getDate();
  resourceLoadRateMockData = {
    color: ['#52BB26', '#3D62E5', '#F73D47'],
    yAxisData: ['PZZ1KX0001', 'PZZ1KX0002', 'PZZ1KX0006', 'PZZ1KX0007', 'PZZ1KX0008', 'PZZ1KX0009', 'PZZ1KX0010', 'PZZ1KX0011', 'PZZ1KX0012', 'PZZ1KX0013', 'PZZ1KX0014', 'PZZ1KX0015', 'PZZ1KX0016', 'PZZ1KX0017', 'PZZ1KX0018'],
    data: [
      [
        {
          color: '#52BB26',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '14',
          val: '70'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '14',
          val: '70'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '14',
          val: '70'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '14',
          val: '70'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0001',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        }
      ],
      [
        {
          color: '#3D62E5',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '14',
          val: '70'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '14',
          val: '70'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '14',
          val: '70'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '14',
          val: '70'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '14',
          val: '70'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '14',
          val: '70'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0002',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
      [
        {
          color: '#F73D47',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#F73D47',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#F73D47',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#F73D47',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '14',
          val: '70'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0006',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
      [
        {
          color: '#3D62E5',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0007',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
      [
        {
          color: '#52BB26',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0008',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
      [
        {
          color: '#3D62E5',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0009',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
      [
        {
          color: '#F73D47',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#F73D47',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0010',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
      [
        {
          color: '#F73D47',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#F73D47',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0011',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
      [
        {
          color: '#F73D47',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#F73D47',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#F73D47',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#F73D47',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0012',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
      [
        {
          color: '#3D62E5',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0013',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
      [
        {
          color: '#3D62E5',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0014',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
      [
        {
          color: '#3D62E5',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#F73D47',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0015',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
      [
        {
          color: '#3D62E5',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0016',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
      [
        {
          color: '#3D62E5',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#F73D47',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '20',
          val: '100'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0017',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
      [
        {
          color: '#3D62E5',
          date: formatDate(new Date(), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 1), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 2), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#3D62E5',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 3), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '18',
          val: '90'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 4), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 5), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 6), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '0',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 7), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 8), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 9), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 10), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 11), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#52BB26',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 12), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '16',
          val: '80'
        },
        {
          color: '#ffffff',
          date: formatDate(new Date(this.currentYear, this.currentMonth, this.currentDate + 13), 'yyyy-MM-dd', 'zh-Hans'),
          plantGroup: '总装01-M23',
          resource: 'PZZ1KX0018',
          resourceAvailableTime: '20',
          resourceType: '',
          resourceWorkingTime: '0',
          val: '0'
        },
      ],
    ]
  };
  jobCompletionRateMockData = [
    {
      completeQty: 180,
      total: 200,
      rate: 90
    },
    {
      completeQty: 170,
      total: 180,
      rate: 94
    },
    {
      completeQty: 220,
      total: 220,
      rate: 100
    },
    {
      completeQty: 180,
      total: 190,
      rate: 95
    },
    {
      completeQty: 160,
      total: 190,
      rate: 84
    },
    {
      completeQty: 130,
      total: 170,
      rate: 76
    },
    {
      completeQty: 170,
      total: 210,
      rate: 81
    },
  ];
  orderKitRateMockData = [
    {
      standard: 180,
      expand: 200,
      total: 210,
      standardRate: 86,
      expandRate: 95
    },
    {
      standard: 170,
      expand: 190,
      total: 190,
      standardRate: 89,
      expandRate: 100
    },
    {
      standard: 220,
      expand: 190,
      total: 230,
      standardRate: 96,
      expandRate: 83
    },
    {
      standard: 180,
      expand: 200,
      total: 200,
      standardRate: 90,
      expandRate: 100
    },
    {
      standard: 160,
      expand: 180,
      total: 200,
      standardRate: 80,
      expandRate: 90
    },
    {
      standard: 130,
      expand: 150,
      total: 180,
      standardRate: 72,
      expandRate: 83
    },
    {
      standard: 170,
      expand: 190,
      total: 220,
      standardRate: 77,
      expandRate: 86
    },
  ];
  incomingKitRateMockData =  [
    {
      kit: 5,
      nonKit: 1,
      rate: 83
    },
    {
      kit: 3,
      nonKit: 0,
      rate: 100
    },
    {
      kit: 5,
      nonKit: 7,
      rate: 42
    },
    {
      kit: 7,
      nonKit: 0,
      rate: 100
    },
    {
      kit: 3,
      nonKit: 1,
      rate: 75
    },
    {
      kit: 2,
      nonKit: 3,
      rate: 40
    },
    {
      kit: 1,
      nonKit: 1,
      rate: 50
    },
    {
      kit: 0,
      nonKit: 2,
      rate: 0
    },
    {
      kit: 8,
      nonKit: 4,
      rate: 67
    },
    {
      kit: 4,
      nonKit: 1,
      rate: 80
    },
    {
      kit: 7,
      nonKit: 5,
      rate: 58
    },
    {
      kit: 6,
      nonKit: 7,
      rate: 46
    },
    {
      kit: 1,
      nonKit: 3,
      rate: 15
    },
    {
      kit: 1,
      nonKit: 1,
      rate: 50
    },
    {
      kit: 6,
      nonKit: 2,
      rate: 75
    },
    {
      kit: 8,
      nonKit: 0,
      rate: 100
    },
    {
      kit: 10,
      nonKit: 2,
      rate: 83
    },
    {
      kit: 4,
      nonKit: 3,
      rate: 57
    },
    {
      kit: 6,
      nonKit: 5,
      rate: 55
    },
    {
      kit: 3,
      nonKit: 6,
      rate: 33
    },
    {
      kit: 2,
      nonKit: 3,
      rate: 40
    },
    {
      kit: 1,
      nonKit: 2,
      rate: 33
    },
    {
      kit: 6,
      nonKit: 1,
      rate: 86
    },
    {
      kit: 5,
      nonKit: 0,
      rate: 100
    },
  ];

  loadDataCollectionData(date: Date): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverdatacollection/DataCollectionService/GetUserData',
      { Date: date }
    );
  }

  getOrderDeliveryCycleAnalysisData(monthRange: Date[], plantCode: string): Observable<any> {
    const startYear = monthRange[0].getFullYear();
    const startMonth = monthRange[0].getMonth();
    const mockData = [...this.orderDeliveryCycleAnalysisMockData.slice(startMonth), ...this.orderDeliveryCycleAnalysisMockData.slice(0, startMonth)];
    const xAxisData: string[] = [];
    for (let i = 0; i < 12; i++) {
      const year = new Date(startYear, startMonth + i).getFullYear();
      const month = new Date(startYear, startMonth + i).getMonth() + 1 < 10 ? `0${new Date(startYear, startMonth + i).getMonth() + 1}` : new Date(startYear, startMonth + i).getMonth() + 1;
      xAxisData.push(`${year}${month}`);
    }
    const produceData: number[] = [];
    const waitData: number[] = [];
    const shippingData: number[] = [];
    const targetData: number[] = [];
    mockData.forEach(item => {
      produceData.push(item.produce);
      waitData.push(item.wait);
      shippingData.push(item.shipping);
      targetData.push(item.target);
    });
    return of({ xAxisData, produceData, waitData, shippingData, targetData });
  }

  getOrderCompletionRateOnTimeData(monthRange: Date[], plantCode: string): Observable<any> {
    const startYear = monthRange[0].getFullYear();
    const startMonth = monthRange[0].getMonth();
    let mockData = [];
    if (startMonth + 6 <= 12) {
      mockData = [...this.orderCompletionRateMockData.slice(startMonth, startMonth + 6)];
    } else {
      mockData = [...this.orderCompletionRateMockData.slice(startMonth), ...this.orderCompletionRateMockData.slice(0, startMonth - 6)];
    }
    const xAxisData: string[] = [];
    for (let i = 0; i < 6; i++) {
      const year = new Date(startYear, startMonth + i).getFullYear();
      const month = new Date(startYear, startMonth + i).getMonth() + 1 < 10 ? `0${new Date(startYear, startMonth + i).getMonth() + 1}` : new Date(startYear, startMonth + i).getMonth() + 1;
      xAxisData.push(`${year}${month}`);
    }
    const complete: number[] = [];
    const total: number[] = [];
    const rate: number[] = [];
    mockData.forEach(item => {
      complete.push(item.completeQty);
      total.push(item.total);
      rate.push(item.rate);
    });
    return of({ xAxisData, complete, total, rate });
  }

  getJobCompletionRateData(dateRange: Date[], scheduleGroupCode: string): Observable<any> {
    const startYear = dateRange[0].getFullYear();
    const startMonth = dateRange[0].getMonth();
    const startDate = dateRange[0].getDate();
    const day = dateRange[0].getDay();
    const mockData = [...this.jobCompletionRateMockData.slice(day), ...this.jobCompletionRateMockData.slice(0, day)];
    const xAxisData: string[] = [];
    for (let i = 0; i < 7; i++) {
      const year = new Date(startYear, startMonth, startDate + i).getFullYear();
      const month = new Date(startYear, startMonth, startDate + i).getMonth() + 1 < 10 ? `0${new Date(startYear, startMonth, startDate + i).getMonth() + 1}` : new Date(startYear, startMonth, startDate + i).getMonth() + 1;
      const date = new Date(startYear, startMonth, startDate + i).getDate() < 10 ? `0${new Date(startYear, startMonth, startDate + i).getDate()}` : new Date(startYear, startMonth, startDate + i).getDate();
      xAxisData.push(`${year}${month}${date}`);
    }
    const complete: number[] = [];
    const total: number[] = [];
    const rate: number[] = [];
    mockData.forEach(item => {
      complete.push(item.completeQty);
      total.push(item.total);
      rate.push(item.rate);
    });
    return of({ xAxisData, complete, total, rate });
  }

  getOrderKitRateData(dateRange: Date[], scheduleGroupCode: string): Observable<any> {
    const startYear = dateRange[0].getFullYear();
    const startMonth = dateRange[0].getMonth();
    const startDate = dateRange[0].getDate();
    const day = dateRange[0].getDay();
    const mockData = [...this.orderKitRateMockData.slice(day), ...this.orderKitRateMockData.slice(0, day)];
    const xAxisData: string[] = [];
    for (let i = 0; i < 7; i++) {
      const year = new Date(startYear, startMonth, startDate + i).getFullYear();
      const month = new Date(startYear, startMonth, startDate + i).getMonth() + 1 < 10 ? `0${new Date(startYear, startMonth, startDate + i).getMonth() + 1}` : new Date(startYear, startMonth, startDate + i).getMonth() + 1;
      const date = new Date(startYear, startMonth, startDate + i).getDate() < 10 ? `0${new Date(startYear, startMonth, startDate + i).getDate()}` : new Date(startYear, startMonth, startDate + i).getDate();
      xAxisData.push(`${year}${month}${date}`);
    }
    const standard: number[] = [];
    const expand: number[] = [];
    const total: number[] = [];
    const standardRate: number[] = [];
    const expandRate: number[] = [];
    mockData.forEach(item => {
      standard.push(item.standard);
      expand.push(item.expand);
      total.push(item.total);
      standardRate.push(item.standardRate);
      expandRate.push(item.expandRate);
    });
    return of({ xAxisData, standard, expand, total, standardRate, expandRate });
  }

  getIncomingKitRateData(): Observable<any> {
    const hour = new Date().getHours();
    const xAxisData: string[] = [];
    for (let i = 0; i < 4; i++) {
      const x = hour + i < 10 ? `0${hour + i}` : hour + i;
      xAxisData.push(`${x}:00`);
    }
    let mockData = [];
    if (hour + 4 <= 24) {
      mockData = this.incomingKitRateMockData.slice(hour, hour + 4);
    } else {
      mockData = [...this.incomingKitRateMockData.slice(hour), ...this.incomingKitRateMockData.slice(0, (4 - (24 - hour)))];
    }
    const kit: number[] = [];
    const nonKit: number[] = [];
    const rate: number[] = [];
    mockData.forEach(item => {
      kit.push(item.kit);
      nonKit.push(item.nonKit);
      rate.push(item.rate);
    });
    return of({ xAxisData, kit, nonKit, rate });
  }

  getResourceLoadRateData(index: number, scheduleGroupCode: string): Observable<any> {
    if (index === 0) {
      const data = [];
      this.resourceLoadRateMockData.data.forEach(item => {
        data.push(item.slice(0, 7));
      });
      return of({yAxis: this.resourceLoadRateMockData.yAxisData, data: data});
    }
    return of({yAxis: this.resourceLoadRateMockData.yAxisData, data: this.resourceLoadRateMockData.data});
  }

  getDashboardData(plantCode: string): Observable<any> {
    const timeDiff = new Date().getTime() - new Date(this.currentYear.toString()).getTime();
    const leftPlan = 3540000;
    const leftOrders = Math.ceil(timeDiff / (24 * 3600 * 1000)) * 9698 + 230;
    const leftActual = Math.ceil(timeDiff / (24 * 3600 * 1000)) * 9698;
    const rightPlan = 295000;
    const rightOrders = new Date().getDate() * 9833;
    const rightActual = new Date().getDate() * 9833 + 230;
    const dailyPlanOutput = 9900;
    const dailyActualOutput = new Date().getHours() >= 8 ? (new Date().getHours() - 7) * 412 : 412 * (15 + new Date().getHours());
    return of({ leftPlan, leftOrders, leftActual, rightPlan, rightOrders, rightActual, dailyPlanOutput, dailyActualOutput });
  }

  saveNotice(obj: {ID: string, SCHEDULE_REGION_CODE: string, PLANT_CODE: string, CONTENTS: string}): Observable<ActionResponseDto> {
    return this.http.post<ActionResponseDto>(
      '/afs/serverreport/kpi/saveNotice',
      { ...obj }
    );
  }

  queryNotice(SCHEDULE_REGION_CODE: string, PLANT_CODE: string): Observable<GridSearchResponseDto> {
    return this.http.post<GridSearchResponseDto>(
      '/afs/serverreport/kpi/getNoticeData',
      { SCHEDULE_REGION_CODE, PLANT_CODE }
    );
  }
}
