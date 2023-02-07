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

export function getName(prefix) {
  var now = new Date()
  var year = now.getFullYear() // 得到年份
  var month = now.getMonth() // 得到月份
  var date = now.getDate() // 得到日期
  month = month + 1
  month = month.toString().padStart(2, '0')
  date = date.toString().padStart(2, '0')
  var name = prefix + `${year}${month}${date}`
  return name
}

export function isNumeric(str) {
  if (typeof str === "number") return true
  if (typeof str != "string") return false
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export function round3(row, column) {
  let v = row[column['property']]
  if (typeof v === "number") return v.toFixed(3)
  return v
}

export function clacRowTotal(number, price) {
  if (isNumeric(number) && isNumeric(price)) {
    return (Number(number) * Number(price)).toFixed(3)
  }
}

export function calcTotal(materials) {
  var total = 0.0
  for (let i = 0; i < materials.length; i++) {
    if (isNumeric(materials[i].number) && isNumeric(materials[i].price)) {
      total = total + Number(materials[i].number) * Number(materials[i].price)
      continue
    }
  }
  return total.toFixed(3)
}

export function calcTotal2(materials) {
  var total = 0.0
  for (let i = 0; i < materials.length; i++) {
    if (isNumeric(materials[i].inout_quantity) && isNumeric(materials[i].price)) {
      total = total + Number(materials[i].inout_quantity) * Number(materials[i].price)
      continue
    }
  }
  return total.toFixed(3)
}

export function querySearch(list, key, queryString, cb) {
  var results = queryString ? list.filter(createStringFilter(key, queryString)) : list;
  // 调用 callback 返回建议列表的数据
  cb(results);
}

export function createStringFilter(key, queryString) {
  return (list) => {
    return (list[key].toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
  };
}