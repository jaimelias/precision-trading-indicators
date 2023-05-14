export const arrayMath = (arr1, arr2, operation, BigNumber) => {
  const isArr1Array = Array.isArray(arr1);
  const isArr2Array = Array.isArray(arr2);

  if (isArr1Array && isArr2Array && arr1.length !== arr2.length) {
    throw new Error("Array lengths must be the same");
  }

  if (!isArr1Array && isArr2Array) {
    arr1 = Array(arr2.length).fill(arr1);
  }

  if (isArr1Array && !isArr2Array) {
    arr2 = Array(arr1.length).fill(arr2);
  }

  if (!isArr1Array && !isArr2Array) {
    arr1 = [arr1];
    arr2 = [arr2];
  }

  const result = [];

  for (let i = 0; i < arr1.length; i++) {
    let value;

    switch (operation) {
      case "add":
        value = BigNumber(arr1[i]).plus(arr2[i]);
        break;
      case "mul":
        value = BigNumber(arr1[i]).times(arr2[i]);
        break;
      case "sub":
        value = BigNumber(arr1[i]).minus(arr2[i]);
        break;
      case "div":
        value = BigNumber(arr1[i]).dividedBy(arr2[i]);
        break;
      default:
        throw new Error("Invalid operation");
    }

    result.push(value);
  }

  return result;
}
