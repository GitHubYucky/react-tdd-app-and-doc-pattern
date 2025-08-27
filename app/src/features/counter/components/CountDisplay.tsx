type Props = {
  count: number;
};

export const CountDisplay = ({ count }: Props) => {
  return (
    <div className="text-2xl font-bold text-[#2c3e50] bg-[#ecf0f1] px-3 py-2 rounded-md text-center w-fit">
      {count}
    </div>
  );
};
