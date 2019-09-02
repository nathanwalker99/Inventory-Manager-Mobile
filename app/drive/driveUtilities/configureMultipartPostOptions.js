export function configureMultipartPostOptions(bodyLength, apiToken) {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${apiToken}`)
    headers.append('Content-Type', `multipart/related; boundary=${boundaryString}`)
    headers.append('Content-Length', bodyLength)
    return {
      method: 'POST',
      headers,
    }
  }