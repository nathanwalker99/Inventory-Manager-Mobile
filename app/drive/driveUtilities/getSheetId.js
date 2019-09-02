import { sheetsUrl } from "./sheetsUrl";
import { parseAndHandleErrors } from "../../utilities/parseAndHandleErrors";

export async function getSheetId(spreadsheetId, apiToken) {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${apiToken}`)
    const options = {
      method: "GET",
      headers,
    }
    return fetch(`${sheetsUrl}/${spreadsheetId}`, options).then(parseAndHandleErrors)
    .then((body) => {
      if (body && body.sheets && body.sheets.length > 0) {
        return body.sheets[0].properties.sheetId
      }
      return null
    })
  }