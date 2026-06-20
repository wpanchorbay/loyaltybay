export const SITE_ORIGIN =
  process.env.SITE_ORIGIN ||
  process.env.PUBLIC_SITE_ORIGIN ||
  "https://docs.wpanchorbay.com/loyaltybay";

export const BASE_PATH = "/loyaltybay";

export const REPO_URL =
  process.env.DOCS_REPO_URL ??
  "https://github.com/wpanchorbay/loyaltybay";

export const LOGO_SVG_PATH = "./src/assets/iocn_loyaltybay.svg";

/** Absolute site-relative path to the icon used as the page favicon and navbar logo. */
export const ICON_HREF = `${BASE_PATH}/assets/iocn_loyaltybay.svg`;

/** Absolute site-relative path to the OpenGraph share image. */
export const OG_IMAGE_HREF = `${BASE_PATH}/assets/WPAnchorBay-Documentation-OG.png`;

export const WPANCHORBAY_URL = "https://wpanchorbay.com";
export const WPANCHORBAY_PROJECT_LANDING_URL = "https://wpanchorbay.com/plugins/loyaltybay";

export function buildAbsoluteUrl(pathname = "/") {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(`${BASE_PATH}${normalizedPath}`, SITE_ORIGIN).toString();
}
