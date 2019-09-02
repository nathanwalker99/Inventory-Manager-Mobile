import { getFileId } from "./getFileId";
import { getFilesInFolder } from "./getFilesInFolder";
import { downloadSpreadsheet } from "./downloadSpreadsheet";

export async function downloadAllInventories(apiToken) {
    let inventories = [ ];
    const inventoriesFolderId = await getFileId(apiToken, "inventories");
    const inventoriesIdAndNames = await getFilesInFolder(apiToken, inventoriesFolderId);
    inventoriesIdAndNames.forEach((item) => {
      inventories.push({ id: item.id, name: item.name });
    })
    for (let i = 0; i < inventories.length; i++) {
      const spreadsheetInfo = await downloadSpreadsheet(apiToken, inventories[i].id);
      if (spreadsheetInfo.values) {
        inventories[i].data = spreadsheetInfo.values;
      } else {
        inventories[i].data = [[ ]];
      }
    }
    return inventories
  }