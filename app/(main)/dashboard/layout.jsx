import { Suspense } from 'react';
import DashboardPage from './page';
import { RingLoader } from 'react-spinners';

function DashboardLayout({ children }) {
  return (
    <div className="h-full flex flex-col gap-5 lg:gap-10">
      <h2 className="main-heading">Dashboard</h2>
      <Suspense
        fallback={
          <div className="h-full flex justify-center items-center">
            <RingLoader color="#059669" />
          </div>
        }
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
}

export default DashboardLayout;
