import { sheetsUrl } from "./sheetsUrl";

export async function clearSpreadsheet(apiToken, spreadsheetId) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${apiToken}`)
    const options = {
      method: "POST",
      headers,
    }
    return fetch(`${sheetsUrl}/${spreadsheetId}/values/Sheet1:clear`, {
      ...options,
    })
  }