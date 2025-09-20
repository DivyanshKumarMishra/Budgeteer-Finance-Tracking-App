import React from 'react';
import { RingLoader } from 'react-spinners';

function AccountDetailsLoading() {
  return (
    <div className="h-full flex flex-col gap-4 justify-center items-center">
      <RingLoader color="#059669" />
      <p className="text-xl lg:text-2xl text-muted-foreground">
        Loading account details...
      </p>
    </div>
  );
}

export default AccountDetailsLoading;
