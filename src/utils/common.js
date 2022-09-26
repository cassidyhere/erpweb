export var checkTotal = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('合同金额不能为空或为0'))
  }
  setTimeout(() => {
    if (isNaN(Number(value))) {
    callback(new Error('请输入数字值'))
    } else {
    if (value <= 0) {
        callback(new Error('合同金额不能小于等于0'))
    } else {
        callback()
    }
    }
  }, 1000)
}

export function getNowTime() {
  var now = new Date()
  var year = now.getFullYear() // 得到年份
  var month = now.getMonth() // 得到月份
  var date = now.getDate() // 得到日期
  month = month + 1
  month = month.toString().padStart(2, '0')
  date = date.toString().padStart(2, '0')
  var defaultDate = `${year}-${month}-${date}`
  return defaultDate
}

export function isNumeric(str) {
  if (typeof str === "number") return true
  if (typeof str != "string") return false
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
