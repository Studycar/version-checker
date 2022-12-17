import watermark from 'watermark-dom'
(function() {
  /*判断是否为美信浏览器，嵌入cordova*/
  if(window.navigator.userAgent.indexOf('MissonWebKit') > -1 || window.navigator.userAgent.indexOf('mideaConnect') > -1) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; 
    var flatform = '';
    if (isAndroid) {
      flatform = 'android';
    } else {
      if (u.indexOf('MissonWKCordova') > -1) {
        flatform = 'wk-ios';
      } else {
        flatform = 'ios';
      }
    }
    var cordovaPath = './assets/' + flatform + '/cordova.js';
    var script = window.document.createElement('script');
    script.src = cordovaPath + '?version=' + new Date() * 1;
    script.type = 'text/javascript';
    script.async = true;
    console.log('script',script);
    window.document.head.appendChild(script); 
    /*启动cordova*/
    document.addEventListener('deviceready', function () {
      setIFrame();
      initWaterMark();
    }, false);
  }
})()

// 在 cordova deviceready 事件中再引入 iframe，防止报错
function setIFrame() {
  var target = document.getElementById("iframeParent");
  var newFrame = document.createElement("iframe");
  // newFrame.setAttribute("src", this.flowUrl);
  newFrame.name="flow";
  newFrame.id="iframeFlow";
  newFrame.style.setProperty('display', 'none');
  newFrame.style.setProperty('height', 'calc(100vh - 56px)');
  newFrame.style.setProperty('width', 'calc(100% + 24px)');
  newFrame.style.setProperty('border', 'none');
  newFrame.style.setProperty('margin-left', '-12px');

  if (target !== null) {
    target.appendChild(newFrame);
  }
}

function initWaterMark() {
  console.log('watermark init');
  // let userInfo = this.appconfig.getUserName();
  if (window.cordova) {
    window.cordova.exec(function (success) {
      const userInfo = success.cn + `(${success.uid})`;
      console.log(success)
      let watermarkTxt = userInfo;
      const watermarkConfig = {
        watermark_id: 'contactWaterMark',
        // 水印内容
        watermark_txt: watermarkTxt,
        // 水印x轴间距
        watermark_x_space: 20,
        // 水印y轴间距
        watermark_y_space: 40,
        // 水印字体
        watermark_fontsize: '14px',
        watermark_color: '#333333',
        watermark_alpha: 0.14,
        // 水印宽度
        watermark_width: 180,
        // 水印长度
        watermark_height: 80,
        // 水印列数
        // watermark_cols: 3,
        monitor: false
      }
      watermark.load(watermarkConfig);
    }, function (error) {
      alert("Error: " + error);
    }, "MideaUser", "getUser", []);
  }
}