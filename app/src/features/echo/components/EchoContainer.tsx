import { EchoInput } from "./EchoInput";
import { EchoDisplay } from "./EchoDisplay";
import { useEcho } from "../hooks/useEcho";

export const EchoContainer = () => {
  const { echo, returnEcho, loading, error } = useEcho();

  return (
    <div>
        <EchoInput onEcho={returnEcho} disabled={loading} />
        <EchoDisplay echo={echo} loading={loading} error={error} />
    </div>
  );
};
