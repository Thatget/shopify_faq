import {
  Divider,
  SkeletonBodyText,
  SkeletonThumbnail,
} from '@shopify/polaris';
import { Fragment } from 'react';

export default function FaqsTableSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7].map((index) => (
        <Fragment key={index}>
          <div className={`px-3 ${index === 1? 'py-[10px]' : 'py-[14px]' }`}>
            <div className="flex gap-4 items-center">
              <div className="[&>.Polaris-SkeletonThumbnail]:!w-[16px] 
                  [&>.Polaris-SkeletonThumbnail]:!h-[16px] 
                  [&>.Polaris-SkeletonThumbnail]:!rounded-[0.25rem]">
                <SkeletonThumbnail />
              </div>
              <div className='w-[240%]'>
                <SkeletonBodyText lines={1} />
              </div>
              <SkeletonBodyText lines={1} />
              <SkeletonBodyText lines={1} />
              <SkeletonBodyText lines={1} />
              <SkeletonBodyText lines={1} />
            </div>
          </div>
          {index < 11 && <Divider />}
        </Fragment>
      ))}
    </>
  );
}
