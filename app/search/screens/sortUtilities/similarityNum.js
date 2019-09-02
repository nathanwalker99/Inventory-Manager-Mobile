export function similarityNum(x, y) {
    if (x == 0 || y == 0) {
      x = x+1;
      y = y+1;
    }
    const difference = x - y;
    let percentDifference;
    if (Math.abs(x) < Math.abs(y)) {
      percentDifference = difference/y;
    } else {
      percentDifference = difference/x;
    }
    return (1 - Math.abs(percentDifference));
  }