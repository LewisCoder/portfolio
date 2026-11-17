# 个人作品集 · Avery Lin

暗色画廊风个人作品集：近黑 `#0A0A09` 底色、暖白 `#F3F1EB` 文字、克莱因蓝 `#3D5BFF` 作高光，Bento 栅格 + 玻璃质感 + 细腻颗粒噪点。页面为中文排版，Latin 字符用 Inter，中文回落苹方 / 微软雅黑，强调字用宋体渐变。纯静态 HTML5 + Tailwind CSS，字体全部自托管，无框架、无外部图片，断网也能直接打开。

## 目录结构

```
portfolio/
├── index.html                 # 全部页面结构（Header / Hero / Work / Contact / Footer / 项目详情弹窗）
├── src/input.css              # Tailwind 源码入口（三条 @tailwind 指令）
├── tailwind.config.js         # 内容扫描路径、色板、字体
├── assets/
│   ├── css/tailwind.css       # Tailwind CLI 编译产物（已提交，开箱即用）
│   ├── css/site.css           # 自定义层：主题、字体、布局细节、悬停/滚动动画、弹窗、无障碍
│   ├── fonts/                 # 自托管 woff2：Inter / Instrument Serif / JetBrains Mono（OFL）
│   └── js/main.js             # 滚动动效、指针微光、移动端菜单、复制邮箱、项目详情弹窗与深链
├── package.json               # build / watch / serve 脚本
└── README.md
```

## 本地预览

两种方式，任选其一：

1. **直接打开**：双击 `index.html`。`assets/css/tailwind.css` 已编译好，无需安装任何依赖。
2. **本地服务器**（推荐，深链 `#work/xxx` 和剪贴板 API 行为更接近线上）：

```bash
cd portfolio
npm install        # 首次
npm run serve      # 启动 Python 静态服务器，访问 http://localhost:4173
```

修改了 HTML 中新的 Tailwind class 后，需要重新编译：

```bash
npm run build      # 单次编译（--minify）
npm run watch      # 开发时监听自动编译
```

> 项目使用 **Tailwind CLI 3.4.x** 编译，不用 Play CDN，因此页面可离线运行、样式不会闪烁。正文字体 Inter、强调字体 Instrument Serif、标签字体 JetBrains Mono 均已自托管在 `assets/fonts/`（OFL 许可），不依赖 Google Fonts 等外部 CDN。`node_modules/` 已加入 `.gitignore`。

## 页面结构

| 区块 | 内容 |
|------|------|
| Header | 固定顶栏、滚动后毛玻璃底、导航下划线扫过动效、移动端汉堡菜单 |
| Hero | 12 列 Bento：自我介绍大卡、深色抽象头像卡、克莱因蓝「可接单」状态卡、经验年限 / 项目数 / 上海实时时钟三个小卡 |
| Work | 6 张项目卡片，不等宽栅格（7/5、5/6、6/6 等），滚动渐显，悬停上浮 + 图形缩放 |
| Project Detail | 原生 `<dialog>` 弹窗：大图头、角色/周期/服务、挑战/方案/成果、标签与 CTA；支持浏览器返回键关闭 |
| Marquee | 无限滚动能力条，悬停暂停 |
| Contact | 深色联系卡、一键复制邮箱 + Toast 提示、社交链接列表、响应速度与所在地磁贴 |
| Footer | 年份自动更新、返回顶部 |

## 个性化修改点

### 1. 身份与联系方式（`index.html`）

- 姓名 / 标语 / 简介：Hero 区块（约 60–130 行）
- 邮箱：搜索 `hello@averylin.design`，需要同时改两处——`#copy-email` 的 `data-email` 和旁边的 `mailto:` 链接
- 社交链接：`#contact` 中的 `social-link`，替换 `href` 与 handle 文本
- 页面标题 / 描述 / favicon：`<head>` 中的 `<title>`、`<meta name="description">`、SVG data URI

### 2. 项目卡片（`index.html` + `assets/js/main.js`）

卡片元信息写在按钮的 `data-*` 上，文案写在 JS 的 `PROJECTS` 对象里，两处用同一个 slug 关联：

```html
<button class="project-card" data-project="northwind" data-art="art-rings"
        data-title="Northwind — 设计系统" data-client="Northwind"
        data-year="2025" data-tags="设计系统 · 产品设计 · 设计运营"> … </button>
```

```js
// assets/js/main.js —— 按 slug 对应
PROJECTS = {
  northwind: {
    artLabel: '01 — 设计系统',
    role: '…', timeframe: '…', services: ['…', '…'],
    summary: '…', challenge: '…', approach: '…', results: ['…', '…', '…'],
    link: '#', linkLabel: '阅读完整案例'
  },
  // …
};
```

- 新增项目：复制一个卡片 `<button>` 与一段 `PROJECTS` 条目，slug 保持一致；栅格跨度用 `md:col-span-*` / `md:row-span-*` 控制。
- 卡片置底 CTA 的 `link: '#'` 目前是占位，替换成真实详情页地址后，`main.js` 中拦截 `#` 的逻辑不会再生效，链接可正常跳转。
- 弹窗深链：打开后地址栏变为 `#work/<slug>`，刷新可直接定位到该项目，关闭时自动清理。

### 3. 视觉与配色

- Tailwind token：`tailwind.config.js` 的 `colors`（`ink` 为浅色文字、`paper` 为页面底色、`haze` 为卡片表面、`klein` / `klein-bright` 为高光蓝）与 `fontFamily`（`sans` / `serif` / `mono`，均带 CJK 回落：苹方 / 鸿蒙 Sans / MiSans / 思源黑体 / 微软雅黑；衬线为宋体族）。
- CSS 变量：`assets/css/site.css` 顶部 `:root` 中的 `--paper`、`--mist`、`--klein`、`--klein-bright`、`--line`、`--ease-out`、字体栈。页面背景由 layer 叠加的柔光渐变 + SVG 噪点构成（`body` 与 `body::after`）。
- 强调文字使用 `.serif-accent`（宋体 / Instrument Serif + 蓝色渐变），例如首屏 “张扬”、Work 标题 “骄傲”、联系区 “一起把它做出来”。中文保持正体，避免浏览器伪斜体；中文标题使用更宽松的行高（约 1.12–1.15）与接近 0 的字距，不使用英文式的负字距。
- 卡片抽象图形（rings / grid / type / orbs / stripes / frames）纯 CSS 实现，见 `site.css` 的 “Artwork 01–06” 段落，可替换成自己的图片（替换 `.art-canvas` 内部结构即可）。卡片与面板带指针跟随微光（`--mx` / `--my`，见 `main.js`）。

## 交互与无障碍说明

- 滚动渐显基于 `IntersectionObserver`，首屏外元素进入视口后淡入上移。
- 尊重系统「减少动态效果」设置：开启 `prefers-reduced-motion` 时会关闭渐显、跑马灯、卡片上浮等动画。
- 弹窗使用原生 `<dialog>` + `showModal()`，自带焦点捕获与遮罩；Esc / 点击遮罩关闭，打开时焦点落在关闭按钮；滚动锁定恢复无副作用。
- 键盘导航可用，`:focus-visible` 为克莱因蓝描边；页面含 Skip link、`aria-expanded` / `aria-haspopup` / `aria-live` 语义。
- 未引用任何外部字体或 CDN，适合国内网络环境与离线演示。