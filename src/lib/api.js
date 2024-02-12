import fetch from "cross-fetch";
import { tableRoute } from './api/routes/table';
import { pageRoute } from './api/routes/page'

const getPageTable = async (
  pageId,
  apiUrl = "https://notion-api.dastins193.workers.dev/v1"
) => await tableRoute(pageId);

const getPageBlocks = async (
  pageId,
  apiUrl = "https://notion-api.dastins193.workers.dev/v1"
) => await pageRoute(pageId);

export { getPageTable, getPageBlocks };
