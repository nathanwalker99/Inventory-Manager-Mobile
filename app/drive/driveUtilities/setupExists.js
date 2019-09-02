import { getFileId } from "./getFileId";
import { fileExists } from "./fileExists";

export async function setupExists(apiToken) {
    const folderId = await getFileId(apiToken, "inventory_manager_mobile_data")
    if (folderId == null) return false
    const inventoriesExists = await fileExists(apiToken, "inventories", folderId)
    const backupsExists = await fileExists(apiToken, "backups", folderId)
    if (inventoriesExists && backupsExists) return true
    return false
  }