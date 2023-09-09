import DateTimeDisplay from "@/components/DateTimeDisplay";
import { useCountdown } from "@/hooks/useCountdown";
import { ICountdown, ICounter } from "@/types/Countdown";

const ExpiredNotice = () => {
  return (
    <div className="expired-notice">
      <span>Expired!!!</span>
      <p>Please select a future date and time.</p>
    </div>
  );
};

const ShowCounter = (props: ICounter) => {
  const { days, hours, minutes, seconds } = props;

  return (
    <div className="flex">
      <DateTimeDisplay value={days} type="Days" isDanger={Number(days) <= 20} />
      <DateTimeDisplay value={hours} type="Hours" isDanger={false} />
      <DateTimeDisplay value={minutes} type="Mins" isDanger={false} />
      <DateTimeDisplay value={seconds} type="Seconds" isDanger={false} />
    </div>
  );
};

const Countdown = (props: ICountdown) => {
  const { targetDate } = props;
  const [days, hours, minutes, seconds] = useCountdown({
    targetDate,
  });

  // @ts-ignore
  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  }
  return (
    <ShowCounter
      days={days?.toString()}
      hours={hours?.toString()}
      minutes={minutes?.toString()}
      seconds={seconds?.toString()}
    />
  );
};

export default Countdown;
