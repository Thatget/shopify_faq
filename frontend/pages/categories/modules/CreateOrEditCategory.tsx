import { Card, Checkbox, Layout, TextField, Text, Select, PageActions } from "@shopify/polaris";
import { useAppContext } from "../../../hook";
import { FormMapping, notEmpty, useField, useForm } from "@shopify/react-form";
import { Category } from "../../../@type/category";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCategoryApi, useUpdateCategoryApi } from "../../../hook/api/category";

export default function CreateOrEditCategory(props?: Category) {
  const isEditCategoryPage = window.location.pathname.includes('edit-category')
  const { shopLocalesOption, defaultLocale } = useAppContext()
  const [ categoryIsVisible, setCategoryIsVisible ] = useState<boolean>(true)
  const [ featureCategory, setFeatureCategory ] = useState<boolean>(false)
  const { mutate: mutateUpdateCategory, isLoading: isUpdating } = useUpdateCategoryApi();
  const { mutate: mutateCreateCategory, isLoading: isCreating } = useCreateCategoryApi();
  const navigate = useNavigate()

  useEffect(() => {
    if(props?.is_visible !== undefined && props.feature_category !== undefined){
      setCategoryIsVisible(props?.is_visible)
      setFeatureCategory(props.feature_category)
    }
  }, [props])

  const { fields, submit, dirty } = useForm({
    fields: {
      title: useField({
        value: props?.title || '',
        validates: [notEmpty('Category name should not be empty')]
      }),
      description: useField({
        value: props?.description || '',
        validates: [notEmpty('Description should not be empty')],
      }),
      is_visible: useField({
        value: categoryIsVisible,
        validates: [],
      }),
      feature_category: useField({
        value: featureCategory,
        validates: [],
      }),
      locale: useField({
        value: 'default',
        validates: []
      }),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: async (fieldValues: FormMapping<any, any>) => {
      const dataUpdate:Category = { 
        title: fieldValues.title,
        description: fieldValues.description,
        is_visible: fieldValues.is_visible,
        feature_category: fieldValues.feature_category,
        locale: fieldValues.locale === defaultLocale? 'default' : fieldValues.locale,
      }

      if(isEditCategoryPage){
        dataUpdate.position = props?.position
        dataUpdate.id = props?.id
        mutateUpdateCategory(dataUpdate, {
          onSuccess: () => {
            navigate('/categories')
          }
        })
      }
      else{
        mutateCreateCategory(dataUpdate, {
          onSuccess: () => {
            navigate('/categories')
          }
        })
      }
      return { status: 'fail', errors: [{ message: 'Bad form data' }] };
    },
    makeCleanAfterSubmit: true,
  });

  return (
    <>
      <Layout>
        <Layout.Section>
          <Card>
            {/* <BlockStack gap={'400'}>
              <TextField
                label="Category"
                requiredIndicator
                {...fields.title}
                autoComplete="off"
              />
              <TextField
                label="Description"
                {...fields.description}
                autoComplete="off"
              />
            </BlockStack> */}
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
          {/* <BlockStack gap="400">
              <div>
                <Checkbox
                  label="Enable category"
                  checked={fields.is_visible.value}
                  onChange={fields.is_visible.onChange}
                />
                <div className="ms-7 opacity-70 pointer-events-none">
                  <Text variant="bodyMd" as="p">
                    This will enable this Category so that your customers can see it on FAQ page.
                  </Text>
                </div>
              </div>
              <div>
                <Checkbox
                  label="Featured"
                  checked={fields.feature_category.value}
                  onChange={fields.feature_category.onChange}
                />
                <div className="ms-7 opacity-70 pointer-events-none">
                  <Text variant="bodyMd" as="p">
                    This will show this Category so that your customers can see it on Widget.
                  </Text>
                </div>
              </div>
              { isEditCategoryPage &&
                <div>
                  <Select
                    label="Add Translation"
                    options={shopLocalesOption}
                    {...fields.locale}
                  />
                </div>
              }
            </BlockStack> */}
          </Card>
        </Layout.Section>
      </Layout>
      <PageActions
        primaryAction={{
          content: "Save",
          disabled: !dirty,
          loading: isUpdating || isCreating,
          onAction: submit,
        }}
      />

    </>
  )
}
