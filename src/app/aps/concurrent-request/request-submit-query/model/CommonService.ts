export class CommonService {
    public formatDateTime(time: any): any {
        if (time !== '' && time !== null && time !== undefined) {
            const Dates = new Date(time);
            const year: number = Dates.getFullYear();
            const month: any = (Dates.getMonth() + 1) < 10 ? '0' + (Dates.getMonth() + 1) : (Dates.getMonth() + 1);
            const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
            const hours: any = Dates.getHours() < 10 ? '0' + Dates.getHours() : Dates.getHours();
            const minutes: any = Dates.getMinutes() < 10 ? '0' + Dates.getMinutes() : Dates.getMinutes();
            const seconds: any = Dates.getSeconds() < 10 ? '0' + Dates.getSeconds() : Dates.getSeconds();
            return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        } else {
            return '';
        }
    }

    public formatDate(date: any): any {
        if (date !== '' && date !== null && date !== undefined) {
            const Dates = new Date(date);
            const year: number = Dates.getFullYear();
            const month: any = (Dates.getMonth() + 1) < 10 ? '0' + (Dates.getMonth() + 1) : (Dates.getMonth() + 1);
            const day: any = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
            return year + '-' + month + '-' + day;
        } else {
            return '';
        }
    }

    public formatDateMonth(date: any): any {
        if (date !== '' && date !== null && date !== undefined) {
            const Dates = new Date(date);
            const year: number = Dates.getFullYear();
            const month: any = (Dates.getMonth() + 1) < 10 ? '0' + (Dates.getMonth() + 1) : (Dates.getMonth() + 1);
            return year + '-' + month;
        } else {
            return '';
        }
    }

    public CompareDate(date1: string, date2: string): number {
        date1 = date1.toString().replace(/-/g, '/');
        date2 = date2.toString().replace(/-/g, '/');

        const oDate1 = new Date(date1);
        const oDate2 = new Date(date2);
        if (oDate1.getTime() > oDate2.getTime()) {
            return 1;
        } else if (oDate1.getTime() < oDate2.getTime()) {
            return -1;
        } else {
            return 0;
        }
    }
}
