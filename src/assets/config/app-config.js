window.appConfig = {
  loginUrl: 'login',
  logoutUrl: 'login'
};

fetch('/api/auth/social/login', { mode: "no-cors" }).then(function (response) {
  return response.json();
}).then(function (json) {
  //非单点登录
  if(!json.data.idmLogin){
    localStorage.removeItem('loginUrl');
    localStorage.removeItem('logoutUrl');
    return;
  }
  //单点登录地址
  localStorage.setItem('loginUrl', json.data.loginUrl);
  localStorage.setItem('logoutUrl', json.data.logoutUrl);
}).catch(function (err) {
  localStorage.removeItem('loginUrl');
  localStorage.removeItem('logoutUrl');
})


