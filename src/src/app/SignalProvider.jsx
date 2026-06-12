import { useEffect } from "react";
import { signalSocket } from "../services/websocket";
import { useSignalStore } from "../state/signalStore";

export default function SignalProvider({ children }) {

  const setSignal = useSignalStore(state => state.setSignal);

  useEffect(() => {

    signalSocket.connect();

    signalSocket.subscribe((signal) => {
      setSignal(signal);
    });

  }, []);

  return children;
}
