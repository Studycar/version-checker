var fs = require('fs');
var path = require('path');

function VersionManager(configPath) {
  this.versionSrcPath = path.resolve(configPath);
  this.versionDestPath = this.versionSrcPath;
  this.generateVersionFile();
  this.versionChecker = new VersionChecker({ configPath: this.versionSrcPath, versionPath: this.versionDestPath }); // 将configPath和versionPath传递给VersionChecker
  this.versionChecker.init(); // 初始化VersionChecker
}

VersionManager.prototype.checkPaths = function () {
  if (!fs.existsSync(this.versionSrcPath) || !fs.lstatSync(this.versionSrcPath).isDirectory()) {
    throw new Error(this.versionSrcPath + ' is not a valid directory.');
  }
};

VersionManager.prototype.generateVersionFile = function () {
  try {
    var dirInfo = fs.readdirSync(this.versionSrcPath);
    var versionList = dirInfo.filter(function (item) {
      return /^\d+\.\d+\.\d+\.txt$/.test(item);
    });

    versionList.sort(function (a, b) {
      return a > b ? -1 : 1;
    });

    if (versionList.length > 0) {
      var latestVersion = versionList[0].replace(/\.txt$/, '');
      var versionFilePath = path.join(this.versionDestPath, 'version.json');

      if (fs.existsSync(versionFilePath)) {
        var existingContent = fs.readFileSync(versionFilePath, 'utf-8');
        var existingVersionInfo = JSON.parse(existingContent);
        existingVersionInfo.version = latestVersion;
        fs.writeFileSync(versionFilePath, JSON.stringify(existingVersionInfo, null, 2));
        console.log('Version has been updated to ' + latestVersion + ' in version.json');
      } else {
        var versionInfo = { version: latestVersion };
        fs.writeFileSync(versionFilePath, JSON.stringify(versionInfo, null, 2));
        console.log('Version ' + latestVersion + ' has been written to version.json');
      }
    } else {
      var newTxtFilePath = path.join(this.versionSrcPath, '1.0.0.txt');
      var content = '// 写入更新版本内容，建议格式\n1. xxxxxxxxx\n2. xxxxxxxxx\n3. xxxxxxxxx\n';
      fs.writeFileSync(newTxtFilePath, content);
      console.log('No version files found. A new file ' + newTxtFilePath + ' has been created with default content.');
      this.generateVersionFile();
    }
  } catch (error) {
    console.error('Error processing version files:', error);
  }
};

function VersionChecker(options) {
  options = options || {};
  this.version = options.version || "1.0.0";
  this.versionDir = options.versionDir || "";
  this.checkInterval = options.checkInterval || 60000;
  this.versionBox = null;
  this.lastVersion = this.version;
  this.timer = null;
  this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  this.configPath = options.configPath; // 获取configPath
  this.versionPath = options.versionPath; // 获取versionPath
}

VersionChecker.prototype.init = function() {
  var _this = this;

  this.loadConfigFromJson().then(function() {
    _this.insertStyles();
    _this.createDOMElements();
    _this.fetchVersionInfo();
    _this.timer = setInterval(function() {
      _this.fetchVersionInfo();
    }, _this.checkInterval);
  });
};

VersionChecker.prototype.loadConfigFromJson = function() {
  var _this = this;

  return new Promise(function(resolve, reject) {
    fetch(this.versionPath + '/version.json?t=' + new Date().getTime())
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Failed to load version.json from ' + _this.versionPath);
          reject();
        }
      })
      .then(function(config) {
        _this.version = config.version || _this.version;
        _this.versionDir = config.versionDir || _this.versionDir;
        _this.checkInterval = config.checkInterval || _this.checkInterval;
        resolve();
      })
      .catch(function(error) {
        console.error('Error loading version.json:', error);
        reject();
      });
  });
};

VersionChecker.prototype.insertStyles = function() {
  var style = document.createElement('style');
  style.innerHTML = `
    .version-box {
      display: none;
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      background-color: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      justify-content: center;
      align-items: center;
    }
    .version-content {
      width: 400px;
      padding: 20px;
      position: relative;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    .content-txt {
      color: #333333;
      line-height: 1.5;
      margin-bottom: 20px;
      text-align: center;
      font-size: 16px;
      display: flex;
      flex-direction: column;
    }
    .content-title {
      display: flex;
      margin-bottom: 10px;
    }
    .content-detail {
      text-align: left;
      margin-left: 10px;
      margin-bottom: 30px;
    }
    .version-action {
      display: flex;
      justify-content: space-between;
    }
    .version-button {
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 10px 20px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .version-button:hover {
      background-color: #0056b3;
    }
    .version-button:focus {
      outline: none;
    }
    @media screen and (max-width: 600px) {
      .version-content {
        width: 90%;
        padding: 15px;
      }
      .content-txt {
        font-size: 14px;
      }
      .version-button {
        padding: 8px 15px;
      }
    }
  `;
  document.head.appendChild(style);
};

VersionChecker.prototype.createDOMElements = function() {
  var _this = this;

  this.versionBox = document.createElement('div');
  this.versionBox.className = 'version-box';
  this.versionBox.innerHTML = `
    <div class="version-content">
      <div class="content-txt">
        <div style="background: white;color: black;border:none;" class="content-title">
          <div>发现新版本</div>
        </div>
        <div class="content-detail" id="version-details"></div>
      </div>
      <div class="version-action">
        <button class="version-button" id="later-button">稍后更新</button>
        <button class="version-button" id="refresh-button">立即更新</button>
      </div>
    </div>
  `;
  document.body.appendChild(this.versionBox);
  this.versionBox.style.display = 'none';

  var eventType = this.isTouchDevice ? 'touchstart' : 'click';

  document.getElementById('refresh-button').addEventListener(eventType, function() {
    _this.refresh();
  });

  document.getElementById('later-button').addEventListener(eventType, function() {
    _this.hideVersionBox();
  });

  this.versionBox.addEventListener(eventType, function(event) {
    if (event.target === _this.versionBox) {
      _this.hideVersionBox();
    }
  });
};

VersionChecker.prototype.fetchVersionInfo = function() {
  var _this = this;

  fetch(this.versionPath + '/version.json?t=' + new Date().getTime())
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      _this.lastVersion = json.version;
      if (_this.lastVersion > _this.version) {
        _this.showVersionInfo();
      }
    })
    .catch(function(e) {
      console.error("Error fetching version info:", e);
    });
};

VersionChecker.prototype.showVersionInfo = function() {
  var _this = this;

  fetch(this.versionDir + '/' + this.lastVersion + '.txt?t=' + new Date().getTime())
    .then(function(response) {
      return response.text();
    })
    .then(function(txt) {
      document.getElementById('version-details').innerHTML = txt.replace(/[\n\r]/g, '<br/>');
      _this.versionBox.style.display = 'flex';
    })
    .catch(function(e) {
      location.reload();
    });
};

VersionChecker.prototype.refresh = function() {
  location.reload();
};

VersionChecker.prototype.hideVersionBox = function() {
  this.versionBox.style.display = 'none';
};

VersionChecker.prototype.stop = function() {
  clearInterval(this.timer);
};

window.VersionManager = VersionManager;

