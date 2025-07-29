<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Console替换功能测试</h1>

    <div class="space-y-4">
      <button @click="testConsoleLog" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">测试 console.log</button>

      <button @click="testConsoleInfo" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">测试 console.info</button>

      <button @click="testConsoleWarn" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">测试 console.warn</button>

      <button @click="testConsoleError" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">测试 console.error</button>

      <button @click="testAllConsole" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">测试所有console方法</button>
    </div>

    <div class="mt-6 p-4 bg-gray-100 rounded">
      <h2 class="text-lg font-semibold mb-2">说明：</h2>
      <ul class="list-disc list-inside space-y-1 text-sm">
        <li>点击按钮后，请查看浏览器控制台和IDE终端</li>
        <li>在开发环境中，console输出会同时显示在浏览器控制台和IDE终端</li>
        <li>在生产环境中，console输出只会通过logger记录到IDE终端</li>
        <li>可以通过 window.$originalConsole 访问原始console方法</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
definePage({
  meta: {
    title: 'Console替换功能测试',
  },
})
function testConsoleLog() {
  console.log('这是一个 console.log 测试消息', { timestamp: new Date(), data: 'test' })
}

function testConsoleInfo() {
  console.info('这是一个 console.info 测试消息', { level: 'info', status: 'success' })
}

function testConsoleWarn() {
  console.warn('这是一个 console.warn 测试消息', { level: 'warning', message: 'something might be wrong' })
}

function testConsoleError() {
  console.error('这是一个 console.error 测试消息', { level: 'error', error: new Error('test error') })
}

function testAllConsole() {
  console.log('=== 开始测试所有console方法 ===')
  console.log('Log: 普通日志消息')
  console.info('Info: 信息消息')
  console.warn('Warn: 警告消息')
  console.error('Error: 错误消息')
  console.debug('Debug: 调试消息')
  console.trace('Trace: 跟踪消息')
  console.log('=== 测试完成 ===')

  // 测试原始console（如果可用）
  if (window.$originalConsole) {
    console.log('原始console可用，测试原始console.log:')
    window.$originalConsole?.log('这是原始console.log输出')
  }
}
</script>
