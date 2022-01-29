import { useAccount } from "store/account";
import { useCallback } from "react";
import ConnectView from "components/ConnectView";
import MintView from "components/MintView";

export default function Home() {
  const accountId = useAccount(useCallback((state) => state.accountId, []));
  return accountId ? <MintView /> : <ConnectView />;
}
