/**
 * 「文件不存在」和「读不出来」是两回事：前者是合法的空白态，后者是内容坏了，
 * 必须让构建失败。数据层每个 catch 都要区分这两件事，所以判断只写在这里一遍。
 */
export function isNotFound(err: unknown): boolean {
  return (err as NodeJS.ErrnoException).code === 'ENOENT'
}
