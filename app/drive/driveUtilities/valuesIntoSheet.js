import { sheetsUrl } from "./sheetsUrl";
import { parseAndHandleErrors } from "../../utilities/parseAndHandleErrors";

//Values is a 2D array
export async function valuesIntoSheet(spreadsheetId, values, apiToken) {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${apiToken}`)
    const options = {
      method: "POST",
      headers,
    }
    const body = JSON.stringify({
      "valueInputOption": "RAW",
      "data": [{
        "range": "A1",
        "majorDimension": "ROWS",
        "values": values
      }]
    })
    return fetch(`${sheetsUrl}/${spreadsheetId}/values:batchUpdate`, {
      ...options,
      body
    }).then(parseAndHandleErrors)
  }