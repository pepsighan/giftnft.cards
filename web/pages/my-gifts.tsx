import { useAccount } from 'store/account';
import { useCallback } from 'react';
import ConnectView from 'components/ConnectView';
import MyGiftsView from 'components/MyGiftsView';
import Footer from 'components/Footer';

export default function MyGifts() {
  const accountId = useAccount(useCallback((state) => state.accountId, []));

  return (
    <>
      {accountId ? <MyGiftsView /> : <ConnectView />}
      <Footer />
    </>
  );
}
