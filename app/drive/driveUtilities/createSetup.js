import { uploadFile } from "./uploadFile";
import { mimeTypes } from "./mimeTypes";
import { addParentRemoveRoot } from "./addParentRemoveRoot";

export async function createSetup(apiToken) {
    const mainFolderId = await uploadFile("inventory_manager_mobile_data", "", mimeTypes.folder, apiToken);
    const inventoriesFolderId = await uploadFile("inventories", "", mimeTypes.folder, apiToken);
    const backupsFolderId = await uploadFile("backups", "", mimeTypes.folder, apiToken);
    await addParentRemoveRoot(inventoriesFolderId, mainFolderId, apiToken)
    await addParentRemoveRoot(backupsFolderId, mainFolderId, apiToken)
  }