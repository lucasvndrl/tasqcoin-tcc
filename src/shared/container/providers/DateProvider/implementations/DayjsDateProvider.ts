import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from '../IDateProvider';

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  secondDiff(start_date: Date, end_date: Date): number {
    const end_date_utc = this.convertToUTC(end_date);
    const start_date_utc = this.convertToUTC(start_date);
    return dayjs(end_date_utc).diff(start_date_utc, 'second');
  }

  hourDiff(start_date: Date, end_date: Date): number {
    const end_date_utc = this.convertToUTC(end_date);
    const start_date_utc = this.convertToUTC(start_date);
    return dayjs(end_date_utc).diff(start_date_utc, 'hours');
  }

  daysDiff(start_date: Date, end_date: Date): number {
    const end_date_utc = this.convertToUTC(end_date);
    const start_date_utc = this.convertToUTC(start_date);
    return dayjs(end_date_utc).diff(start_date_utc, 'days');
  }

  addSeconds(seconds: number): Date {
    return dayjs().add(seconds, 'seconds').toDate();
  }

  addMinutes(minutes: number): Date {
    return dayjs().add(minutes, 'minutes').toDate();
  }

  addDays(days: number): Date {
    return dayjs().add(days, 'days').toDate();
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  dateNow(): Date {
    return dayjs().toDate();
  }

  startOfMonth(): Date {
    return dayjs().startOf('month').toDate();
  }

  endOfMonth(): Date {
    return dayjs().endOf('month').toDate();
  }
}

export { DayjsDateProvider };
