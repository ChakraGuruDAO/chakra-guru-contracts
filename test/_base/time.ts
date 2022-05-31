import { BigNumber, BigNumberish } from "ethers";

export function Duration(initialSeconds: number = 0) {
  return {
    seconds: function (seconds: number) {
      return Duration(initialSeconds + seconds);
    },
    minutes: function (minutes: number) {
      return this.seconds(minutes * 60);
    },
    hours: function (hours: number) {
      return this.minutes(hours * 60);
    },
    days: function (days: number) {
      return this.hours(days * 24);
    },
    toNumber: function () {
      return initialSeconds;
    },
    toDate: function () {
      return Duration.convertTimestampToDate(initialSeconds);
    },
    toString: function () {
      return this.toDate().toUTCString();
    },
    toBN: function () {
      return BigNumber.from(this.toNumber());
    },
    valueOf: function () {
      return this.toNumber();
    },
  };
}

Duration.convertTimestampToDate = (nm: BigNumberish) => {
  return new Date(BigNumber.from(nm).mul(1000).toNumber());
};

Duration.convertDateToTimestamp = (date: Date) => {
  return Math.floor(date.getTime() / 1000);
};

export function Time(time?: Date | number) {
  time = !time ? new Date() : time;

  return Duration(typeof time === "number" ? time : Duration.convertDateToTimestamp(time));
}
