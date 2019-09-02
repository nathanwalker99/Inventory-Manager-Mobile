export function parseAndHandleErrors(response) {
    if (response.ok) {
      return response.json()
    }
    return response.json()
      .then((error) => {
        throw new Error(JSON.stringify(error))
      })
  }