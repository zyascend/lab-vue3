/**
 * 数据铺平
 * @param ：[{_id: '1'}]
 * @returns {'1': {_id: '1'}}
 */
export const arrToObj = <T extends { _id?: string }> (arr: Array<T>) => {
  return arr.reduce((pre, cur) => {
    if (cur._id) {
      pre[cur._id] = cur
    }
    return pre
  }, {} as { [key: string]: T })
}

export const ObjToArr = <T>(obj: { [key: string]: T }) => {
  return Object.keys(obj).map(key => obj[key])
}
