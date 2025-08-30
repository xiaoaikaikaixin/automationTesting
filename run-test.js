const { execSync } = require('child_process');

try {
  console.log('开始运行 Playwright 测试...');
  
  // 使用 Node.js 的 child_process 来执行 Playwright 命令
  // 这样可以避开 PowerShell 的 TypeAccelerators 问题
  const output = execSync('npx playwright test .e2e/testCase/contractInstruction/CI-01-CreateContractInstruction.spec.ts --headed', {
    stdio: 'inherit',
    shell: 'cmd.exe' // 强制使用 CMD 而不是 PowerShell
  });
  
  console.log('测试完成！');
} catch (error) {
  console.error('运行测试时出错:', error.message);
}