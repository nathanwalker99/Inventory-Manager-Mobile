// Looks for files with the specified file name with an optional parent (string)
export function queryParams(name, parent = null) {
    if (parent == null){
      return encodeURIComponent(`name = '${name}'`)
    }
    return encodeURIComponent(`name = '${name}' and '${parent}' in parents`)
  }