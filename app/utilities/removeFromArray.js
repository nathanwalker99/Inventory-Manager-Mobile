export function removeFromArray(array, removeValue) {
    for (let i = 0; i < array.length; i++) {
      if (JSON.stringify(array[i]) == JSON.stringify(removeValue)) {
        array.splice(i, 1);
        break
      }
    }
    return array
  }