import { sheetsUrl } from "./sheetsUrl";
import { parseAndHandleErrors } from "../../utilities/parseAndHandleErrors";

// Creates a google sheet with given title (string)
export async function createSheet(title, apiToken) {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${apiToken}`)
    const options = {
      method: "POST",
      headers,
    }
    const body = JSON.stringify({
      "properties": {
        "title": title,
      }
    })
    return fetch(sheetsUrl, {
      ...options,
      body
    }).then(parseAndHandleErrors)
    .then((body) => {
      if (body && body.spreadsheetId) {
        return body.spreadsheetId
      }
      return null
    })
  }