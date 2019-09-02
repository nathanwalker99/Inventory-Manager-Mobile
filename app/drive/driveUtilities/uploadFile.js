import { createMultipartBody } from "./createMultipartBody";
import { configureMultipartPostOptions } from "./configureMultipartPostOptions";
import { uploadUrl } from "./driveUploadUrl";
import { parseAndHandleErrors } from "../../utilities/parseAndHandleErrors";

// uploads a file with its contents and its meta data (name, description, type, location)
// returns the id of the file just created or null if there was an error
export async function uploadFile(name, content, mimeType, apiToken) {
    const body = createMultipartBody(content, name, mimeType)
    const options = configureMultipartPostOptions(body.length, apiToken)
    return fetch(`${uploadUrl}/files?uploadType=multipart`, {
      ...options,
      body,
    })
      .then(parseAndHandleErrors)
      .then((body) => {
        if (body && body.id) {
          return body.id
        }
        return null
      })
  }