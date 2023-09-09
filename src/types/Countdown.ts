type ICounter = {
  days: string | undefined;
  hours: string | undefined;
  minutes: string | undefined;
  seconds: string | undefined;
};

type ICountdown = {
  targetDate: number;
};

type IDateTimeProps = {
  value: string | undefined;
  type: string;
  isDanger: boolean;
};

export type { ICountdown, ICounter, IDateTimeProps };
