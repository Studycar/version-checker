import { checkInApp, getLoginUrl, getLogoutUrl } from "@env/service";

export const environment = {
  name: 'prod',
  SERVER_URL: ``,
  production: true,
  useHash: false,
  hmr: false,
  login_url: getLoginUrl(),
  logout_url: getLogoutUrl(),
  inApp: checkInApp(),
  pro: {
    theme: 'dark',
    fixSiderbar: true,
  },
};
