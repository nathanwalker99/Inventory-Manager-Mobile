import { editDistance } from "./editDistance";

export function similarity(s1, s2) {
    if (typeof s1 !== "string") {
      s1 = "";
    }
    if (typeof s2 !== "string") {
      s2 = "";
    }
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }