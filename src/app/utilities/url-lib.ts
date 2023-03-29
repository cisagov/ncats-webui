export class UrlLib {
  static pathJoin(parts: Array<string>, path_separator?: string): string {
    let separator = path_separator || "/";
    let replace = new RegExp(separator + "{1,}", "g");
    return parts.filter(String).join(separator).replace(replace, separator);
  }

  static removeTrailingSlash(url: string): string {
    return url.replace(/\/+$/, "");
  }
}
