import {
  IndexTable,
  Card,
  useIndexResourceState,
  Text,
  Badge,
  Icon,
  Checkbox,
  Tooltip,
} from "@shopify/polaris";

import { DeleteMajor } from "@shopify/polaris-icons";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { Category, CategoryApi } from "../../../@type/category";
import { useAppContext } from "../../../hook";
import { useNavigate } from "react-router-dom";
import { setAllCategories, setCategories } from "../../store/actions";
import {
  useDeleteCategoryApi,
  useGetAllCategoriesApi,
  useUpdateCategoryApi,
} from "../../../hook/api/category";
import CategoriesTableSkeleton from "./CategoriesTableSkeleton";

export function CategoriesList() {
  const { dispatch } = useAppContext();
  const [categories, setCategoriesData] = useState<CategoryApi>([]);
  const navigate = useNavigate();
  const resourceName = {
    singular: "category",
    plural: "categories",
  };
  const { data: allCategories, isLoading, refetch } = useGetAllCategoriesApi();
  const { mutate: mutateDeleteCategory } = useDeleteCategoryApi();
  const { mutate: mutateUpdateCategory } = useUpdateCategoryApi();
  const [indexIconHover, setIndexIconHover] = useState<number>();

  useEffect(() => {
    if (allCategories && allCategories.length > 0) {
      dispatch(setAllCategories(allCategories));
      dispatch(
        setCategories(
          allCategories.filter((item: Category) => item.locale === "default")
        )
      );
      setCategoriesData(
        allCategories.filter((item: Category) => item.locale === "default")
      );
    }
  }, [allCategories, dispatch]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(categories);

  const visibleChange = useCallback(
    (category: Category) => {
      const dataUpdate = {
        ...category,
      };
      dataUpdate.is_visible = !category.is_visible;
      mutateUpdateCategory(dataUpdate, {
        onSuccess: () => {
          refetch();
        },
      });
    },
    [mutateUpdateCategory, refetch]
  );

  const featureChange = useCallback(
    (category: Category) => {
      const dataUpdate = {
        ...category,
      };
      dataUpdate.feature_category = !category.feature_category;
      mutateUpdateCategory(dataUpdate, {
        onSuccess: () => {
          refetch();
        },
      });
    },
    [mutateUpdateCategory, refetch]
  );

  const deleteCategory = useCallback(
    (category: Category) => {
      mutateDeleteCategory(category, {
        onSuccess: () => {
          refetch();
        },
      });
    },
    [mutateDeleteCategory, refetch]
  );

  const rowMarkup = categories.map((category, index) => (
    <IndexTable.Row
      id={category.id?.toString() || ""}
      key={category.id}
      selected={selectedResources.includes(category.id?.toString() || "")}
      position={index}
    >
      <IndexTable.Cell>
        <div
          onClick={(event: SyntheticEvent) => {
            event.stopPropagation();
            navigate(`/edit-category/${category.id}`);
          }}
          className="underline text-blue-600"
        >
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {category.title}
          </Text>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div className="flex justify-center">{category.description}</div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div
          className="flex justify-center"
          onClick={(event: SyntheticEvent) => {
            event.stopPropagation();
          }}
        >
          <Checkbox
            label=""
            checked={category.is_visible}
            onChange={() => visibleChange(category)}
          />
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div
          onClick={(event: SyntheticEvent) => {
            event.stopPropagation();
          }}
          className="flex justify-center"
        >
          <Checkbox
            label=""
            checked={category.feature_category}
            onChange={() => featureChange(category)}
          />
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <div className="flex justify-center">
          <Badge progress="complete" tone="success">
            en
          </Badge>
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        {category.identify !== "Uncategorized1" && (
          <div className="flex justify-center">
            <Tooltip content="Delete">
              <div
                className={`cursor-pointer p-2 rounded-[6px] border ${
                  indexIconHover === index ? "border-red-400" : ""
                }`}
                onMouseOver={() => setIndexIconHover(index)}
                onMouseOut={() => setIndexIconHover(-1)}
                onClick={(event: SyntheticEvent) => {
                  event.stopPropagation();
                  deleteCategory(category);
                }}
              >
                <Icon
                  source={DeleteMajor}
                  tone={indexIconHover === index ? "critical" : "base"}
                />
              </div>
            </Tooltip>
          </div>
        )}
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <>
      <Card padding={"0"}>
        {isLoading ? (
          <CategoriesTableSkeleton></CategoriesTableSkeleton>
        ) : (
          <IndexTable
            resourceName={resourceName}
            itemCount={categories.length}
            selectedItemsCount={
              allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
              { title: "Category" },
              { title: "Description", alignment: "center" },
              { title: "Visibility", alignment: "center" },
              { title: "Widget", alignment: "center" },
              { title: "Store languages", alignment: "center" },
              { title: "Actions", alignment: "center" },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        )}
      </Card>
      <div className="text-center mt-3">
        View FAQs Page:{" "}
        <a
          href="https://eyeconiclashes-8682.myshopify.com/apps/faqs"
          target="_blank"
          rel="noreferrer"
        >
          https://eyeconiclashes-8682.myshopify.com/apps/faqs
        </a>
      </div>
    </>
  );
}
