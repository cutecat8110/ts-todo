export function replaceParams(url: string, params: Record<string, any>): string {
  return url.replace(/{(.*?)}/g, (_, key) => params[key])
}
