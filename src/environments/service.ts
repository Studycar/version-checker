export function checkInApp() {
  return window.navigator.userAgent.indexOf('MissonWebKit') > -1
}

export function getLoginUrl() {
  return localStorage.getItem('loginUrl') || 'login'
}

export function getLogoutUrl() {
  return localStorage.getItem('logoutUrl') || 'logout'
}
