// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { getLoginUrl, getLogoutUrl, checkInApp } from "@env/service";

export const environment = {
  name: 'hmr',
  SERVER_URL: ``,
  production: false,
  useHash: false,
  hmr: true,
  login_url: getLoginUrl(),
  logout_url: getLogoutUrl(),
  inApp: checkInApp(),
  pro: {
    theme: 'dark',
    fixSiderbar: true,
  },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
