import md5 from "js-md5";

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
  for (let i = str.length - 1; i >= 0; i--) {
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
      const haveChecked = item.values.filter(v => v.checked && v.checked === true);
      return Object.assign(item, {
        initVal: [...item.values],
        valList: item.values.map(val => val.value),
        values: haveChecked ? haveChecked.map(m => { return m.value }) : []
      });
    } else if (item.type === "2") {
      const haveChecked = item.values.filter(v => v.checked && v.checked === true)[0];
      return Object.assign(item, {
        initVal: [...item.values],
        valList: item.values.map(val => val.value),
        values: haveChecked ? haveChecked.value : ""
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
  const cloneData = deepClone(obj);
  return cloneData.map(item => {
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
        values: item.values
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
        Object.assign(v, { itemId: i, itemKey: v.code })
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
  let rangeList = [];
  let isFirstItem = true;
  const input = [
    { key: "prices", name: "现价", values: "", unit: "元", validate: false, validateType: "num" },
    { key: "originalprice", name: "原价", values: "", unit: "元", validate: false, validateType: "num" },
    { key: "stockNums", name: "库存", values: "", unit: "", validate: false, validateType: "integer" },
    { key: "salequantity", name: "起售数量", values: "1", unit: "", validate: false, validateType: "integer" },
    { key: "title", name: "标题", values: "", unit: "", validate: false, validateType: "text" },
    { key: "feature", name: "特色描述", values: "", validate: false, validateType: "text" }]
  sourceList.forEach(function (n) {
    let items = n.values || [];
    let cloneRangeList = deepClone(rangeList);
    rangeList = [];
    items.forEach(function (item) {
      let itemId = item.itemId;
      let itemKey = item.itemKey;
      let cloneInput = deepClone(input)
      if (isFirstItem) {
        rangeList.push({
          rangeArr: [itemId],
          keyArr: [itemKey],
          input: cloneInput
        });
      } else {
        for (let m = 0; m < cloneRangeList.length; m++) {
          let rangeArr = cloneRangeList[m].rangeArr || [];
          let keyArr = cloneRangeList[m].keyArr || [];
          let cloneInputSec = deepClone(input)
          rangeList.push({
            rangeArr: [...rangeArr, itemId],
            keyArr: [...keyArr, itemKey],
            input: cloneInputSec
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
    .filter(item => item.type === "3" || item.type === "4")
    .reduce((pre, item) => {
      Object.assign(pre, { [item.code]: item.values });
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
        const values = cloneData[i].values.find((val => {
          return val.code === item.keyArr[j]
        }))
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
        Object.assign(cloneData[i], { values: "" });
        dataArr.push(cloneData[i]);
      }
    }
    const inputItemVal = item.input.reduce((pre, item) => {
      Object.assign(pre, { [item.key]: item.values })
      return pre;
    }, {})
    preArr.push({
      saleHashData: md5(JSON.stringify({ salepro: [...dataArr] })),
      ...inputArrVal,
      ...inputItemVal
    });
    return preArr;
  }, []);
  return subData
}

/**
 * @desc 动态表格数据匹配（哈希匹配）回填input值
 * @param {Array} serverData 服务端返回数据
 * @param {Array} timeIdArr 动态表格绑定数据
 * 
 */
export function initTableInputData(serverData, timeIdArr, originalData) {
  const checkBoxArr = deepClone(originalData).filter(item => item.type === "1");
  return timeIdArr.map((item) => {
    const cloneData = deepClone(originalData);
    let dataArr = [];
    let j = 0;
    for (let i = 0; i < cloneData.length; i++) {
      if (j > checkBoxArr.length) {
        j = 0;
      }
      if (cloneData[i].type === "1") {
        const values = cloneData[i].values.find((val => {
          return val.code === item.keyArr[j]
        }))
        delete values.checked
        Object.assign(cloneData[i], { values });
        dataArr.push(cloneData[i]);
        j++;
      } else if (cloneData[i].type === "2") {
        const values = cloneData[i].values.find(item => {
          return item.checked === true;
        });
        delete values.checked
        Object.assign(cloneData[i], { values });
        dataArr.push(cloneData[i]);
      } else {
        Object.assign(cloneData[i], { values: "" });
        dataArr.push(cloneData[i]);
      }
    }
    const hash = md5(JSON.stringify({ salepro: [...dataArr] }));
    const data = serverData.find(val => {
      return val.saleprohash === hash
    });
    return Object.assign(item, {
      input: [
        { key: "prices", name: "现价", values: data.unitprice, unit: "元", validate: false, validateType: "num" },
        { key: "originalprice", name: "原价", values: data.unitoriginalprice, unit: "元", validate: false, validateType: "num" },
        { key: "stockNums", name: "库存", values: data.stocknums, unit: "", validate: false, validateType: "integer" },
        { key: "salequantity", name: "起售数量", values: data.salequantity, unit: "", validate: false, validateType: "integer" },
        { key: "title", name: "标题", values: data.title, unit: "", validate: false, validateType: "text" },
        { key: "feature", name: "特色描述", values: data.feature, validate: false, validateType: "text" }
      ],
      cmdtcode: data.cmdtcode,
      uid: data.uid
    })
  })
}

/**
 * @desc 返回动态表单修改提交数据
 * @param {Array} timeIdArr 动态表格绑定数据
 * 
 */
export function subTableInputData(timeIdArr) {
  return timeIdArr.map(item => {
    return {
      cmdtcode: item.cmdtcode,
      uid: item.uid,
      prices: item.input[0].values,
      originalprice: item.input[1].values,
      stockNums: item.input[2].values,
      salequantity: item.input[3].values,
      title: item.input[4].values,
      feature: item.input[5].values
    }
  })
}

/**
 * @desc 根据后台发票类型返回数据 （0：不提供发票，1：普通发票，2：增值税发票，3：普通发票和增值税发票）
 * 
 */
export function initInvoice(invoice) {
  const form = {
    invoice: '0',
    ticketType: ['1']
  }
  if (invoice === '0') {
    Object.assign(form, { invoice: '0' })
  } else if (invoice === '1') {
    Object.assign(form, { invoice: '1' })
  } else if (invoice === '2') {
    Object.assign(form, {
      invoice: '1',
      ticketType: ['2']
    })
  } else if (invoice === '3') {
    Object.assign(form, {
      invoice: '1',
      ticketType: ['1', '2']
    })
  }
  return form
}

/**
 * @desc 根据invoice类型返回提交数据 （0：不提供发票，1：普通发票，2：增值税发票，3：普通发票和增值税发票）
 * 
 */
export function initInvoiceSub(invoice, ticketType) {
  let invoiceInit;
  if (invoice === '0') {
    invoiceInit = '0';
  } else if (invoice === '1') {
    if (ticketType.length === 2) {
      invoiceInit = '3';
    } else {
      invoiceInit = ticketType[0];
    }
  }
  return invoiceInit
}

/**
 * @desc 返回四舍五入后某小数位数值
 * @param {Number} num 处理值
 * @param {Number} n 保留小数位数
 * 
 */
export function _fomatFloat(num, n) {
  var f = parseFloat(num);
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(num * Math.pow(10, n)) / Math.pow(10, n); // n 幂   
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + n) {
    s += '0';
  }
  return Number(s);
}
/**
 * @desc 解决精度问题返回四舍五入两位小数（相除）
 * @param {Number} arg1 符号左侧参数
 * @param {Number} arg2 符号右侧参数
 * @param {Number} num 保留小数位数
 * 
 */
export function accDiv(arg1, arg2, num = 2) {
  let t1 = 0, t2 = 0, r1, r2;
  try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
  try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return _fomatFloat((r1 / r2) * Math.pow(10, t2 - t1), num)

}

/**
 * @desc 解决精度问题返回四舍五入两位小数（相乘）
 * @param {Number} arg1 符号左侧参数
 * @param {Number} arg2 符号右侧参数
 * @param {Number} num 保留小数位数
 * 
 */
export function accMull(arg1, arg2, num = 2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return _fomatFloat(Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m), num)
}

/**
 * @desc 解决精度问题返回四舍五入两位小数（相加）
 * @param {Number} arg1 符号左侧参数
 * @param {Number} arg2 符号右侧参数
 * @param {Number} num 保留小数位数
 * 
 */
export function accAdd(arg1, arg2, num = 2) {
  var r1, r2, m;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return _fomatFloat((arg1 * m + arg2 * m) / m, num)
}

/**
 * @desc 解决精度问题返回四舍五入两位小数（相减）
 * @param {Number} arg1 符号左侧参数
 * @param {Number} arg2 符号右侧参数
 * @param {Number} num 保留小数位数
 * 
 */
export function subtr(arg1, arg2, num = 2) {
  var r1, r2, m, n;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  n = (r1 >= r2) ? r1 : r2;
  return _fomatFloat(((arg1 * m - arg2 * m) / m).toFixed(n), num);
}