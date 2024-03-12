import {
  Card,
  Checkbox,
  Layout,
  TextField,
  Text,
  Select,
  PageActions,
  Icon,
} from "@shopify/polaris";
import {AlertMinor} from '@shopify/polaris-icons'
import { Editor } from "@tinymce/tinymce-react";
import { Faq } from "../../../@type/faq";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../hook";
import { FormMapping, notEmpty, useField, useForm } from "@shopify/react-form";
import { useCreateFaqApi, useUpdateFaqApi } from "../../../hook/api/faqs";
import { useNavigate } from "react-router-dom";
import { Category } from "../../../@type/category";

export default function CreateOrEditFaq(props?: Faq) {
  const isEditFaqPage = window.location.pathname.includes("edit-faq");
  const [faqIsVisible, setFaqIsVisible] = useState<boolean>(true);
  const [featureFaq, setFeatureFaq] = useState<boolean>(false);
  const { state, shopLocalesOption, defaultLocale } = useAppContext();
  const [ categoryDefault, setCategoryDefault ] = useState<Category[]>([])
  const [ listCategoryOption, setListCategoryOption ] = useState<{ label: string; value: string }[]>([])
  useEffect(() => {
    if(state.all_categories && state.all_categories.length > 0) {
      setCategoryDefault(state.all_categories.filter(
        (item) => item.identify === props?.category_identify
      ))
      let listCategories: { label: string; value: string }[] = [];
      state.all_categories.forEach((item) => {
        listCategories.push({
          label: item.title || "",
          value: item.identify || "",
        });
      });
      setListCategoryOption(listCategories)
    }
  }, [props?.category_identify, state.all_categories])
  const [categorySelected, setCategorySelected] = useState<string>("");
  const [localeSelected, setLocaleSelected] = useState<string>("default");
  const { mutate: mutateUpdateFaq, isLoading: isUpdating } = useUpdateFaqApi();
  const { mutate: mutateCreateFaq, isLoading: isCreating } = useCreateFaqApi();
  const navigate = useNavigate();

  useEffect(() => {
    if(state.all_categories[0] && state.all_categories[0].identify)
    setCategorySelected(state.all_categories[0].identify)
  }, [state.all_categories])
  
  useEffect(() => {
    if (props?.is_visible !== undefined && props.feature_faq !== undefined) {
      setFaqIsVisible(props?.is_visible);
      setFeatureFaq(props.feature_faq);
    }
  }, [props]);

  useEffect(() => {
    if (
      categoryDefault &&
      categoryDefault.length > 0 &&
      categoryDefault[0].identify &&
      categoryDefault[0].locale
    ) {
      setCategorySelected(categoryDefault[0].identify);
      setLocaleSelected(categoryDefault[0].locale);
    }
  }, [categoryDefault]);

  const { fields, submit, dirty } = useForm({
    fields: {
      question: useField({
        value: props?.title || "",
        validates: [notEmpty("Question should not be empty")],
      }),
      answer: useField({
        value: props?.content || "",
        validates: [notEmpty("Name should not be empty")],
      }),
      is_visible: useField({
        value: faqIsVisible,
        validates: [],
      }),
      feature_faq: useField({
        value: featureFaq,
        validates: [],
      }),
      locale: useField({
        value: localeSelected,
        validates: [],
      }),
      category: useField({
        value: categorySelected,
        validates: [],
      }),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: async (fieldValues: FormMapping<any, any>) => {
      const dataUpdate: Faq = {
        title: fieldValues.question,
        content: fieldValues.answer,
        is_visible: fieldValues.is_visible,
        feature_faq: fieldValues.feature_faq,
        locale:
          fieldValues.locale === defaultLocale ? "default" : fieldValues.locale,
        category_identify: fieldValues.category,
      };
      if (isEditFaqPage) {
        dataUpdate.position = props?.position;
        dataUpdate.id = props?.id;
      }
      if (isEditFaqPage) {
        mutateUpdateFaq(dataUpdate, {
          onSuccess: () => {
            navigate("/faqs");
          },
        });
      } else {
        mutateCreateFaq(dataUpdate, {
          onSuccess: () => {
            navigate("/faqs");
          },
        });
      }
      return { status: "fail", errors: [{ message: "Bad form data" }] };
    },
    makeCleanAfterSubmit: true,
  });

  return (
    <>
      <Layout>
        <Layout.Section>
          <Card>
            <TextField
              label="Question"
              requiredIndicator
              {...fields.question}
              // onChange={handleChange}
              autoComplete="off"
            />
            <div className="mt-3">
              <p className="mb-1">
                Answer <span className="text-amber-800">*</span>
              </p>
              <Editor
                value={fields.answer.value}
                apiKey="iw2savyfxm3l9qi0l30klxs2ne4dugzr451uxhs7ook0gc3p"
                init={{
                  height: 400,
                  menubar: true,
                  plugins: ["table"],
                  toolbar:
                    "undo redo | formatselect | " +
                    "bold italic backcolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat",
                  content_style:
                    "body { font-family: var(--p-font-family-sans); font-size:14px }",
                }}
                onEditorChange={fields.answer.onChange}
              />
              {fields.answer.error && (
                <div id="value0Error" className="Polaris-InlineError">
                  <div className="Polaris-InlineError__Icon">
                    <span className="Polaris-Icon">
                      <span className="Polaris-Text--root Polaris-Text--visuallyHidden"></span>
                      <Icon source={AlertMinor} tone="textCritical" />
                    </span>
                  </div>
                  {fields.answer.error}
                </div>
              )}
            </div>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            f
            {/* <BlockStack gap="400">
              <div>
                <Checkbox
                  label="Show FAQs on page"
                  checked={fields.is_visible.value}
                  onChange={fields.is_visible.onChange}
                />
                <div className="ms-7 opacity-70 pointer-events-none">
                  <Text variant="bodyMd" as="p">
                    This will enable this FAQ so that your customers can see it
                    on FAQ page.
                  </Text>
                </div>
              </div>
              <div>
                <Checkbox
                  label="Featured"
                  checked={fields.feature_faq.value}
                  onChange={fields.feature_faq.onChange}
                />
                <div className="ms-7 opacity-70 pointer-events-none">
                  <Text variant="bodyMd" as="p">
                    This will show this FAQ so that your customers can see it on
                    Widget.
                  </Text>
                </div>
              </div>
              <div>
                <Select
                  label="Choose Category"
                  options={listCategoryOption}
                  {...fields.category}
                />
              </div>
              {isEditFaqPage && (
                <div>
                  <Select
                    label="Add Translation"
                    options={shopLocalesOption}
                    {...fields.locale}
                  />
                </div>
              )}
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
  );
}
