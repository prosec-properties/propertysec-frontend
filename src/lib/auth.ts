import { DateTime } from "luxon";


export type ICookies = "token" | "role";

export const setCookies = (
    name: ICookies,
    value: string,
    options: {
      days?: number;
      isoDate?: string;
    },
  ) => {
    const { days, isoDate } = options;
    let expiringTime = "";
  
    if (isoDate) {
      const isoDateTime = DateTime.fromISO(isoDate);
      const diff = isoDateTime.diffNow("days").toObject();
      const date = new Date();
      date.setTime(date.getTime() + diff.days! * 24 * 60 * 60 * 1000);
      expiringTime = date.toUTCString();
    }
  
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expiringTime = date.toUTCString();
    }
    const expires = `expires=${expiringTime}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };