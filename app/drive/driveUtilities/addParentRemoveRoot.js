import { url } from "./driveUrl";

export async function addParentRemoveRoot(fileId, parentId, apiToken) {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${apiToken}`)
    const options = {
      method: "PATCH",
      headers,
    }
    return fetch(`${url}/files/${fileId}?addParents=${parentId}&removeParents=root`, {
      ...options,
    })
  }