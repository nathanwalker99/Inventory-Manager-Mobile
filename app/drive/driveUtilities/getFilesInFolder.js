import { url } from "./driveUrl";
import { parseAndHandleErrors } from "../../utilities/parseAndHandleErrors";

export async function getFilesInFolder(apiToken, folderId) {
    const qParams = encodeURIComponent(`'${folderId}' in parents`)
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${apiToken}`)
    const options = {
      method: "GET",
      headers,
    }
    return fetch(`${url}/files?q=${qParams}`, options)
    .then(parseAndHandleErrors)
    .then((body) => {
      if (body && body.files) return body.files
      return null
    })
  }