
// 将 async/await 转换成 ES5 代码后需要这个运行时库来支持
import 'regenerator-runtime/runtime'

const routes = {
  // 需要使用 syntax-dynamic-import 来解析此语法 import() 语法
  // 同时 package.json 也需添加 babel presets stage-2支持
  '/foo': () => import('./views/foo'),
  '/bar': () => import('./views/bar')
}

// Router 类，用来控制页面根据当前 URL 切换
class Router {
  start() {
    // 点击浏览器后退 / 前进按钮时会触发 window.onpopstate 事件，我们在这时切换到相应页面
    // https://developer.mozilla.org/en-US/docs/Web/Events/popstate
    window.addEventListener('popstate', () => {
      this.load(location.pathname)
    })

    // 打开页面时加载当前页面
    this.load(location.pathname)
  }

  // 前往 path， 变更地址栏 URL，并加载相应页面
  go(path) {
    // 变更地址栏 URL
    history.pushState({}, '', path)
    // 加载页面
    this.load(path)
  }

  // 动态加载 path 路径的页面
  async load(path) {
    // 首页
    if (path === '/') path = '/foo'

    // 动态加载页面
    const View = (await routes[path]()).default

    // 创建页面实例
    const view = new View()

    // 把页面加载到 document.body 中
    view.mount(document.body)
  }
}

export default new Router()
