import { boundaryString } from "./boundaryString";

export function createMultipartBody(body, name, mimeType) {
    // https://developers.google.com/drive/v3/web/multipart-upload defines the structure
    const metaData = {
      name: name,
      mimeType:  mimeType,
    }
  
    // request body
    const multipartBody = `\r\n--${boundaryString}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`
    + `${JSON.stringify(metaData)}\r\n`
    + `--${boundaryString}\r\nContent-Type:  ${mimeType}\r\n\r\n`
    + `${JSON.stringify(body)}\r\n`
    + `--${boundaryString}--`
  
    return multipartBody
  }