import { Suspense } from 'react';
import ChatInterface from '@/components/chat';
import { Spinner } from '@/components/ui/spinner';

export const dynamic = 'force-dynamic';

const HomePage = () => {
  return (
    <div>
      <Suspense
        fallback={
          <div className='flex items-center justify-center '>
            <Spinner className='size-18 stroke-2' />
          </div>
        }
      >
        <ChatInterface isProjectPage={false} />
      </Suspense>
    </div>
  );
};

export default HomePage;
