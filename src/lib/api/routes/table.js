import { fetchPageById, fetchTableData, fetchNotionUsers } from "../notion"
import { getNotionValue, parsePageId } from "../utils"

export const getTableData = async (
  collection,
  collectionViewId,
  notionToken,
  raw
) => {
  const table = await fetchTableData(
    collection.value.id,
    collectionViewId,
    notionToken
  )

  const collectionRows = collection.value.schema
  const collectionColKeys = Object.keys(collectionRows)

  const tableArr = table.result.reducerResults.collection_group_results.blockIds.map(
    id => table.recordMap.block[id]
  )

  const tableData = tableArr.filter(
    b =>
      b.value && b.value.properties && b.value.parent_id === collection.value.id
  )

  const rows = []

  for (const td of tableData) {
    let row = { id: td.value.id }

    for (const key of collectionColKeys) {
      const val = td.value.properties[key]
      if (val) {
        const schema = collectionRows[key]
        row[schema.name] = raw ? val : getNotionValue(val, schema.type, td)
        if (schema.type === "person" && row[schema.name]) {
          const users = await fetchNotionUsers(row[schema.name])
          row[schema.name] = users
        }
      }
    }
    rows.push(row)
  }

  return { rows, schema: collectionRows }
}

export async function tableRoute(pageId) {
  pageId = parsePageId(pageId);
  const page = await fetchPageById(pageId, undefined)

  if (!page.recordMap.collection) return null;

  const collection = Object.keys(page.recordMap.collection).map(
    k => page.recordMap.collection[k]
  )[0]

  const collectionView = Object.keys(page.recordMap.collection_view).map(
    k => page.recordMap.collection_view[k]
  )[0]

  const { rows } = await getTableData(
    collection,
    collectionView.value.id,
    undefined
  )

  return rows;
}