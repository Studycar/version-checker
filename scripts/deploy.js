var cmd = require('node-cmd');

function runCmd(cmdStr) {
  if (!cmdStr) {
    console.log()
    Promise.reject(new Error('command not exists!'))
  }
  
  return new Promise((resolve, reject) => {
    console.log(`command [${cmdStr}] is running……`)
    const syncCmd = cmd.runSync(cmdStr)
    const { err, data, stderr } = syncCmd
    if (err || stderr) {
      return reject(err || stderr)
    }
    console.log(data)
    console.log(`command [${cmdStr}] execute successfully!`)
    resolve(data)
  })
}

const run = async () => {
  try {
    // await runCmd('cd src/ & dir');
    await runCmd('yarn build:staging');
  
    const timestamp = Date.now()
    const imageName = 'aps-cloud-ui:' + timestamp
    const tagName = '8.134.14.130:8101/hw/' + imageName
  
    await runCmd(`docker build -t ${tagName} .`);
    // await runCmd(`docker tag ${imageName}`);
    // await runCmd(`docker tag ${imageName} ${tagName}`);
    await runCmd(`docker push ${tagName}`);

    // 删除本地镜像
    // await runCmd(`docker rmi ${imageName}`);
    await runCmd(`docker rmi ${tagName}`);

  } catch (err) {
    console.error(err)
  }
}

// docker build -t aps-cloud-ui:202205191444 .
// docker tag aps-cloud-ui:202205191444 8.134.14.130:8101/hw/aps-cloud-ui:202205191444
// docker push 8.134.14.130:8101/hw/aps-cloud-ui:202205191444
run()
