export class MA {
  constructor(BigNumber, data, size) {
    this.BigNumber = BigNumber
    this.size = size
    this.arr = []
    this.sum = BigNumber(0)
    this.result = []

    data.forEach((d) => {
      this.add(d)
    })
  }

  add(dataPoint) {
    this.arr.push(dataPoint)
    this.sum = this.sum.plus(dataPoint)

    if (this.arr.length > this.size) {
      this.sum = this.sum.minus(this.arr.shift())
    }

    if (this.arr.length >= this.size) {
      this.result.push(this.sum.dividedBy(this.size))
    } else {
      this.result.push(this.sum.dividedBy(this.arr.length))
    }
  }

  update(dataPoint) {
    if (this.arr.length > 0) {
      this.sum = this.sum.minus(this.arr[this.arr.length - 1])
      this.arr[this.arr.length - 1] = dataPoint
      this.sum = this.sum.plus(dataPoint)

      if (this.arr.length >= this.size) {
        this.result[this.result.length - 1] = this.sum.dividedBy(this.size)
      } else {
        this.result[this.result.length - 1] = this.sum.dividedBy(this.arr.length)
      }
    }
  }

  get() {
    return this.result
  }
}
