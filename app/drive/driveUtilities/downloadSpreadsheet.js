import { sheetsUrl } from "./sheetsUrl";
import { parseAndHandleErrors } from "../../utilities/parseAndHandleErrors";

export async function downloadSpreadsheet(apiToken, spreadsheetId) {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${apiToken}`)
    const options = {
      method: "GET",
      headers,
    }
    return fetch(`${sheetsUrl}/${spreadsheetId}/values/Sheet1`, {
      ...options,
    }).then(parseAndHandleErrors)
    .then((body) => {
      if (body) {
        return body
      }
      return null
    })
  }