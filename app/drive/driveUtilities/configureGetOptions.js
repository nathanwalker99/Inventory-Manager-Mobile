export function configureGetOptions(apiToken) {
    const headers = new Headers()
    headers.append('Authorization', `Bearer ${apiToken}`)
    return {
      method: 'GET',
      headers,
    }
  }