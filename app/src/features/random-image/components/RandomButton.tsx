import { Button } from "@/components/button/button";

interface Props {
  onClick: () => void;
}

export const RandomButton = ({ onClick }: Props) => {
  return (
    <Button onClick={onClick}>Random</Button>
  );
};
