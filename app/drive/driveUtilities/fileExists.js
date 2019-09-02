import { queryParams } from "./queryParams";
import { configureGetOptions } from "./configureGetOptions";
import { url } from "./driveUrl";
import { parseAndHandleErrors } from "../../utilities/parseAndHandleErrors";

export async function fileExists(apiToken, name, parent = null) {
    const qParams = queryParams(name, parent);
    const options = configureGetOptions(apiToken)
    return fetch(`${url}/files?q=${qParams}`, options)
    .then(parseAndHandleErrors)
    .then((body) => {
      if (body && body.files && body.files.length > 0) return true
      return false
    })
  }