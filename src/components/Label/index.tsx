type ILabelProps = {
  text: string;
  className?: string;
};

const Label = (props: ILabelProps) => {
  const { text, className } = props;

  return (
    <span
      className={`mr-1 inline-block rounded-full bg-emerald-200 px-2 py-1 text-xs font-semibold uppercase text-emerald-600 last:mr-0 ${className}`}
    >
      {text}
    </span>
  );
};

export default Label;
