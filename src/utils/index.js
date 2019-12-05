import md5 from "js-md5";

/**
 * @desc 格式化时间
 * @param {date} time 时间对象或时间戳
 * @param {String} cFormat default '{y}-{m}-{d} {h}:{i}:{s}'
 * @return {String} 2018-11-29 17:22:10 / 2018-11-29
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

/**
 * 表格时间格式化
 */
export function formatDate(cellValue) {
  if (cellValue == null || cellValue == "") return "";
  var date = new Date(cellValue)
  var year = date.getFullYear()
  var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * @desc: 深拷贝
 * @param {Object/Array} source 期待对象或数组
 * @return {Object/Array}  返回新的对象或数组
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = source[keys].constructor === Array ? [] : {}
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}


/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}


/**
 * @desc 动态表单初始化数据
 * @param {Object} obj 待处理对象
 * @returns {Object}
 */
export function initFormData(obj) {
  return obj.map(item => {
    if (item.type === "1") {
      return Object.assign(item, {
        initVal: [...item.values],
        valList: item.values.map(val => val.value),
        values: []
      });
    } else if (item.type === "2") {
      return Object.assign(item, {
        initVal: [...item.values],
        valList: item.values.map(val => val.value),
        values: ""
      });
    } else {
      return item;
    }
  });
}

/**
 * @desc 动态表单提交数据
 * @param {Object} obj 待处理对象
 * @returns {Object}
 */
export function deInitFormData(obj) {
  return obj.map(item => {
    if (item.type === "2") {
      Object.assign(item, {
        values: item.initVal.map(v =>
          Object.assign(v, { checked: v.value === item.values })
        )
      });
      delete item.valList;
      delete item.initVal;
      return item;
    } else if (item.type === "1") {
      Object.assign(item, {
        values: item.initVal.map(v =>
          Object.assign(v, { checked: item.values.includes(v.value) })
        )
      });
      delete item.valList;
      delete item.initVal;
      return item;
    } else if (item.type === "4") {
      Object.assign(item, {
        values: parseTime(item.values, "{y}-{m}-{d}")
      });
      return item;
    } else {
      return item;
    }
  });
}

/**
 * @desc 动态表单提交数据
 * @param {Array} arr 待处理对象
 * @returns {arr}
 */
export function InitTableData(arr) {
  return arr.map(item => {
    Object.assign(item, {
      values: item.values.filter(j => j.checked === true).map((v, i) =>
        Object.assign(v, { itemId: i })
      )
    });
    return item;
  });
}

/**
 * @desc 处理数据结构
 * @param {Object} sourceList 待处理对象
 * @returns {Object}
 */
export function toCombination(sourceList) {
  var rangeList = [];
  var isFirstItem = true;
  sourceList.forEach(function (n) {
    var items = n.values || [];
    var cloneRangeList = deepClone(rangeList);
    rangeList = [];
    items.forEach(function (item) {
      var itemId = item.itemId;
      if (isFirstItem) {
        rangeList.push({
          rangeArr: [itemId],
          input: [
            { name: "价格", code: "10000005", type: "3", values: "", unit: "元" },
            { name: "库存", code: "10000006", type: "3", values: "", unit: "件" }]
        });
      } else {
        for (let m = 0; m < cloneRangeList.length; m++) {
          var rangeArr = cloneRangeList[m].rangeArr || [];
          rangeList.push({
            rangeArr: [...rangeArr, itemId],
            input: [
              { name: "价格", code: "10000005", type: "3", values: "", unit: "元" },
              { name: "库存", code: "10000006", type: "3", values: "", unit: "件" }]
          });
        }
      }
    })
    isFirstItem = false;
  })
  return rangeList;
}

/**
 * @desc 获取当前单元格rowspan数量
 * @param {Object} rangeList 
 * @param {Number} i 列索引
 * @returns {Number}
 */
function _getSpanNum(rangeList, i) {
  const rowLen = rangeList.length;
  let spanIdx = 1;
  for (let j = 0; j <= i; j++) {
    spanIdx = (rangeList[rowLen - 1].rangeArr[j] + 1) * spanIdx;
  }
  return rowLen / spanIdx;
}

/**
 * @desc 根据itemId排序
 * @param {Array} arr 待处理对象
 * @returns {Array}
 */
export function sortTableArr(arr) {
  let newArr;
  for (let i = arr[0].rangeArr.length; i >= 0; i--) {
    newArr = arr.sort(function (x, y) {
      return x.rangeArr[i] - y.rangeArr[i];
    });
  }
  return newArr;
}

/**
 * @desc 添加rowspan数组
 * @param {Object} rangeList 待处理对象
 */
export function setRowSpan(rangeList) {
  return rangeList.map((item, index) => {
    const colLen = rangeList[0].rangeArr.length;
    item.rowSpanArr = [];
    for (let k = 0; k < colLen; k++) {
      const spanNum = _getSpanNum(rangeList, k);
      if (index % spanNum === 0) {
        item.rowSpanArr[k] = spanNum
      } else {
        item.rowSpanArr[k] = 0
      }
    }
    return item
  })
}


/**
 * @desc 动态表格提交数据处理（拼装哈希提交数据）
 * @param {Array} original 动态表单原始数据
 * @param {Array} present 表格绑定数据
 * @param {Array} timeIdData 携带timeId数据
 * 
 */
export function setTableSubData(original, present, timeIdData) {
  const checkBoxArr = original.filter(item => item.type === "1");
  const radioArr = present.filter(item => item.type === "2");
  const inputArrVal = present
    .filter(item => item.type === "3")
    .reduce((pre, item) => {
      Object.assign(pre, { [item.code]: item.values });
      return pre;
    }, {});
  const dateArrVal = present
    .filter(item => item.type === "4")
    .reduce((pre, item) => {
      Object.assign(pre, {
        [item.code]: parseTime(item.values, "{y}-{m}-{d}")
      });
      return pre;
    }, {});
  const subData = timeIdData.reduce((preArr, item) => {
    const cloneData = deepClone(original);
    let dataArr = [];
    let j = 0;
    let k = 0;
    for (let i = 0; i < cloneData.length; i++) {
      if (j > checkBoxArr.length) {
        j = 0;
      }
      if (k > radioArr.length) {
        k = 0;
      }
      if (cloneData[i].type === "1") {
        const values = cloneData[i].values[item.rangeArr[j]];
        Object.assign(cloneData[i], { values });
        dataArr.push(cloneData[i]);
        j++;
      } else if (cloneData[i].type === "2") {
        const values = cloneData[i].values.find(item => {
          return item.value === radioArr[k].values;
        });
        Object.assign(cloneData[i], { values });
        dataArr.push(cloneData[i]);
        k++;
      } else {
        dataArr.push(cloneData[i]);
      }
    }
    preArr.push({
      saleHashData: md5(JSON.stringify({ salepro: [...dataArr] })),
      ...inputArrVal,
      ...dateArrVal,
      prices: item.input[0].values,
      stockNums: item.input[1].values
    });
    return preArr;
  }, []);
  return subData
}




