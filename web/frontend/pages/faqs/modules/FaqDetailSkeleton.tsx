import {
  BlockStack,
  Card,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
} from '@shopify/polaris';
import '@/assets/css/skeleton.css'

export default function GiftCardDetailSkeleton() {
  return (
    <Layout>
      <Layout.Section>
        <BlockStack gap="400">
          <Card>
            <div className="gap-4 p-2 mt-3">
              <div className='mb-3'>
                <SkeletonDisplayText size="small" />
              </div>
              <div className='Polaris-SkeletonBodyText__SkeletonBodyTextContainer'>
                <div className='Polaris-SkeletonBodyText h-8'>
                </div>
              </div>
            </div>   
          </Card>
          <Card>
            <div className="gap-4 p-2 mt-3">
              <div className='mb-3'>
                <SkeletonDisplayText size="small" />
              </div>
              <div className='Polaris-SkeletonBodyText__SkeletonBodyTextContainer'>
                <div className='Polaris-SkeletonBodyText h-8'>
                </div>
              </div>
            </div>   
          </Card>
          <Card>
            <div className='mb-3'>
              <SkeletonDisplayText size="small" />
            </div>
            <div className='mt-6 mb-6'>
              <SkeletonBodyText lines={1} />
            </div>
            <div className='mt-6 mb-6'>
              <SkeletonBodyText lines={1} />
            </div>
            <div className='mt-6 mb-6'>
              <SkeletonBodyText lines={1} />
            </div>
          </Card>
        </BlockStack>
      </Layout.Section>
      <Layout.Section variant="oneThird">
        <BlockStack gap="400">
          <Card>
            <div className='mb-3'>
              <SkeletonDisplayText size="small" />
            </div>
            <div className='mt-6 mb-6'>
              <SkeletonBodyText lines={1} />
            </div>
            <div className='mt-6 mb-6'>
              <SkeletonBodyText lines={1} />
            </div>
          </Card>
          <Card>
            <div className='mb-3'>
              <SkeletonDisplayText size="small" />
            </div>
            <div className='mt-6 mb-6'>
              <SkeletonBodyText lines={1} />
            </div>
            <div className='mt-6 mb-6'>
              <SkeletonBodyText lines={1} />
            </div>
            <div className='Polaris-SkeletonBodyText__SkeletonBodyTextContainer'>
              <div className='Polaris-SkeletonBodyText h-32'>
              </div>
            </div>
          </Card>
          <Card>
            <div className="gap-4 p-2 mt-3">
              <div className='mb-3'>
                <SkeletonDisplayText size="small" />
              </div>
              <div className='Polaris-SkeletonBodyText__SkeletonBodyTextContainer'>
                <div className='Polaris-SkeletonBodyText h-8'>
                </div>
              </div>
            </div>   
          </Card>
        </BlockStack>
      </Layout.Section>
    </Layout>
  );
}
