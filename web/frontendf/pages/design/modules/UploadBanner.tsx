import { Card, DropZone, Layout, Text, Thumbnail } from '@shopify/polaris'
// import template3 from './../../../assets/images/template3.png'
import { useCallback, useState } from 'react';
import { NoteMajor } from '@shopify/polaris-icons';

const UploadBanner = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
      setFiles((files) => [...files, ...acceptedFiles]),
    [],
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !files.length && (
    <DropZone.FileUpload actionHint="Banner file should be smaller than 8MB. Accepts .gif, .jpg, and .png" />
  );
  
  const uploadedFiles = files.length > 0 && (
    // <BlockStack>
    //   {files.map((file, index) => (
    //     <BlockStack key={index}>
    //       <Thumbnail
    //         size="small"
    //         alt={file.name}
    //         source={
    //           validImageTypes.includes(file.type)
    //             ? window.URL.createObjectURL(file)
    //             : NoteMajor
    //         }
    //       />
    //       <div>
    //         {file.name}{' '}
    //         <Text variant="bodySm" as="p">
    //           {file.size} bytes
    //         </Text>
    //       </div>
    //     </BlockStack>
    //   ))}
    // </BlockStack>
  );

  return(
    <>
      <Layout>
        <Layout.Section variant="oneThird">
          <div>
            <Text id="storeDetails" variant="headingMd" as="h2">
              Upload Banner
            </Text>
            <Text tone="subdued" as="p">
              Select a photo in your computer to change the store banner.
            </Text>
          </div>
        </Layout.Section>
        <Layout.Section>
          <Card>
            {/* <img src={template3} alt="" /> */}
            <DropZone onDrop={handleDropZoneDrop} variableHeight>
              {uploadedFiles}
              {fileUpload}
            </DropZone>
          </Card>
        </Layout.Section>
      </Layout>
    </>
  )
}

export default UploadBanner
