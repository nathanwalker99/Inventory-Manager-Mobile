import { queryParams } from "./queryParams";
import { configureGetOptions } from "./configureGetOptions";
import { url } from "./driveUrl";
import { parseAndHandleErrors } from "../../utilities/parseAndHandleErrors";

// returns the files meta data only. the id can then be used to download the file
export async function getFileId(apiToken, name, parent = null) {
    const qParams = queryParams(name, parent)
    const options = configureGetOptions(apiToken)
    return fetch(`${url}/files?q=${qParams}`, options)
      .then(parseAndHandleErrors)
      .then((body) => {
        if (body && body.files && body.files.length > 0) return body.files[0].id
        return null
      })
  }