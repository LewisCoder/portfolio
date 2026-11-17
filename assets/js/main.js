(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Year ---------------- */

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- Local clock ---------------- */

  var clockEl = document.getElementById('clock');
  var timeFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  function renderClock() {
    if (clockEl) clockEl.textContent = timeFormatter.format(new Date());
  }

  renderClock();
  window.setInterval(renderClock, 1000);

  /* ---------------- Header + scroll progress ---------------- */

  var header = document.getElementById('site-header');
  var progress = document.getElementById('scroll-progress');
  var scrollQueued = false;

  function onScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (header) header.classList.toggle('is-scrolled', scrollTop > 8);
      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0) + '%';
      }
      scrollQueued = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Mobile menu ---------------- */

  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    mobileMenu.hidden = !open;
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
  }

  if (mobileMenu) {
    Array.prototype.forEach.call(mobileMenu.querySelectorAll('a'), function (link) {
      link.addEventListener('click', function () {
        setMenu(false);
      });
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setMenu(false);
  });

  var desktopQuery = window.matchMedia('(min-width: 768px)');
  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', function (event) {
      if (event.matches) setMenu(false);
    });
  }

  /* ---------------- Reveal on scroll ---------------- */

  var revealEls = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealEls, function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(revealEls, function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------------- Pointer-following sheen ---------------- */

  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var sheenCards = document.querySelectorAll('.bento, .project-card, .contact-panel, .availability-panel, .portrait-panel');

    Array.prototype.forEach.call(sheenCards, function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (event.clientX - rect.left).toFixed(1) + 'px');
        card.style.setProperty('--my', (event.clientY - rect.top).toFixed(1) + 'px');
      });
    });
  }

  /* ---------------- Active nav link ---------------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link[href^="#"]'));
  var observedSections = ['work', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && navLinks.length && observedSections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navLinks.filter(function (item) {
          return item.getAttribute('href') === '#' + entry.target.id;
        })[0];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (item) { item.classList.remove('is-active'); });
          link.classList.add('is-active');
        } else {
          link.classList.remove('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    observedSections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  /* ---------------- Copy email ---------------- */

  var copyBtn = document.getElementById('copy-email');
  var toast = document.getElementById('toast');
  var toastTimer = 0;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2400);
  }

  function copyText(text) {
    return new Promise(function (resolve) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () {
          resolve(true);
        }).catch(function () {
          resolve(legacyCopy(text));
        });
        return;
      }
      resolve(legacyCopy(text));
    });
  }

  function legacyCopy(text) {
    var helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    var copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (error) {
      copied = false;
    }
    helper.remove();
    return copied;
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.dataset.email || '';
      copyText(email).then(function (copied) {
        showToast(copied ? '邮箱已复制，期待交流。' : '邮箱：' + email);
      });
    });
  }

  /* ============================================================
     Project detail dialog
  ============================================================ */

  var PROJECTS = {
    northwind: {
      artLabel: '01 — 设计系统',
      role: '首席产品设计师',
      timeframe: '2024 — 2025',
      services: ['设计系统', '组件库', '设计运营'],
      summary: '为 Northwind 分析平台建立统一的设计语言——用一套克制、可组合的系统，取代十一个各自为政的界面。',
      challenge: '十一个团队对表格、筛选、按钮各有各的理解。上线一个页面就要重新学习整个产品，设计债随每个迭代不断累积。',
      approach: '我梳理了所有界面，提炼出反复出现的原子组件，并以严格的 8pt 节奏搭建 token 优先的系统。组件以可运行示例而非静态规范来文档化，工程师可以直接从组件库交付。',
      results: [
        '64 个组件、120+ 个 token 在 6 个产品团队落地',
        '前两个季度发布速度提升 38%',
        '视觉验收工单同比下降 71%'
      ],
      link: '#',
      linkLabel: '阅读完整案例'
    },
    halcyon: {
      artLabel: '02 — 移动银行',
      role: '产品设计师',
      timeframe: '2025',
      services: ['产品设计', '原型', '交付'],
      summary: '一款把金钱放到安静背景中、而非时时拉响警报的移动银行体验。',
      challenge: '多数银行 App 用红点和红色警报争夺注意力。Halcyon 想要恰恰相反：一眼看清，每笔转账都安心。',
      approach: '我们围绕一个问题重建核心流程——“此刻我真正需要知道什么？”克制的字号层级、单一强调色，动效只用于确认，绝不打扰。',
      results: [
        '可用性测试中任务完成率提升 27%',
        '转账相关客服工单下降 19%',
        'App Store 评分从 4.1 升至 4.7'
      ],
      link: '#',
      linkLabel: '查看原型'
    },
    atlas: {
      artLabel: '03 — 工作室官网',
      role: '设计师 & 前端开发者',
      timeframe: '2024',
      services: ['艺术指导', '网页设计', '前端开发'],
      summary: '为一家建筑工作室打造的编辑式作品集网站——厚重的字体、宽裕的留白、几乎没有多余的界面装饰。',
      challenge: '工作室的作品足够宏大，网站需要退居其后。旧站是一套与摄影作品互相打架的 CMS 主题。',
      approach: '细线分割的字体网格、超大字标题、滚动联动的图像揭示。用语义化 HTML 和少量 JavaScript 构建——没有框架，也没有页面搭建器。',
      results: [
        'Lighthouse 四项指标均为 99',
        '平均访问时长提升 2.4 倍',
        '第三季度有两个新委托来自网站'
      ],
      link: '#',
      linkLabel: '访问线上站点'
    },
    meridian: {
      artLabel: '04 — 护理平台',
      role: '资深产品设计师',
      timeframe: '2023 — 2024',
      services: ['用户研究', '产品设计', '服务设计'],
      summary: '一个连接患者、护士与临床医生的护理平台，不给他们的一天再增加一块仪表盘。',
      challenge: '在一次预约开始之前，护理团队就要在四套系统之间来回切换。每多一个界面，都是从患者身上拿走的时间。',
      approach: '十二周的情境研究，随后用一张服务蓝图把三个工具收拢成一条时间线。界面依赖平实语言，每个状态只有一个主操作。',
      results: [
        '接诊时间从 14 分钟降至 6 分钟',
        '护士满意度提升 32%',
        '试点扩展到 3 家医院'
      ],
      link: '#',
      linkLabel: '阅读完整案例'
    },
    fieldnotes: {
      artLabel: '05 — 编辑设计',
      role: '设计师 & 开发者',
      timeframe: '2023',
      services: ['编辑设计', '前端开发', '内容管理'],
      summary: '一本慢读的手艺随笔期刊，读起来更接近纸面，而非信息流。',
      challenge: '网页上的长文阅读常常沿用社交媒体的模式——无限滚动、卡片、打断。',
      approach: '一栏、一种字体、一个强调色。阅读进度放在页边；脚注就地展开；没有乞求注意力的分享栏。',
      results: [
        '平均阅读时长 9 分钟',
        '订阅转化率 11%',
        '被两家设计媒体推荐'
      ],
      link: '#',
      linkLabel: '访问期刊'
    },
    loop: {
      artLabel: '06 — 电商工具包',
      role: '设计系统工程师',
      timeframe: '2022',
      services: ['设计系统', '前端开发', '文档'],
      summary: '一套无障碍的电商工具包，让小商家在一个下午就能开出自己的店铺。',
      challenge: '商家们把模板、插件和自定义 CSS 拼在一起，结果是缓慢、不一致，且往往难以访问。',
      approach: '一套可换主题的组件包，默认值合理、内置键盘支持，文档写给店主看，而不是写给开发者看。',
      results: [
        '店铺平均 4 小时内上线',
        '开箱即符合 WCAG 2.1 AA',
        '一年内 12000+ 家活跃店铺'
      ],
      link: '#',
      linkLabel: '了解工具包'
    }
  };

  var dialog = document.getElementById('project-dialog');
  var dialogArt = document.getElementById('dialog-art');
  var dialogArtLabel = document.getElementById('dialog-art-label');
  var dialogCloseBtn = document.getElementById('dialog-close');
  var dialogScroll = document.getElementById('dialog-scroll');
  var dialogSections = document.getElementById('dialog-sections');
  var dialogTags = document.getElementById('dialog-tags');
  var dialogLink = document.getElementById('dialog-link');
  var dialogLinkLabel = document.getElementById('dialog-link-label');

  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-project]'));
  var cardBySlug = new Map();
  cards.forEach(function (card) {
    cardBySlug.set(card.dataset.project, card);
    card.addEventListener('click', function () {
      openProject(card.dataset.project);
    });
  });

  var currentSlug = null;
  var pushedHistoryEntry = false;
  var bodyOverflow = '';
  var closingTimer = 0;
  var isClosing = false;

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function renderTags(tagString) {
    if (!dialogTags) return;
    dialogTags.replaceChildren();
    tagString.split('·').map(function (tag) {
      return tag.trim();
    }).filter(Boolean).forEach(function (tag) {
      var chip = document.createElement('span');
      chip.className = 'tag';
      chip.textContent = tag;
      dialogTags.appendChild(chip);
    });
  }

  function renderSections(data) {
    if (!dialogSections) return;
    dialogSections.replaceChildren();

    [
      ['挑战', data.challenge],
      ['方案', data.approach]
    ].forEach(function (block) {
      var section = document.createElement('section');
      var heading = document.createElement('h3');
      heading.className = 'dialog-section-title';
      heading.textContent = block[0];
      var paragraph = document.createElement('p');
      paragraph.className = 'dialog-section-copy';
      paragraph.textContent = block[1];
      section.append(heading, paragraph);
      dialogSections.appendChild(section);
    });

    var outcome = document.createElement('section');
    var heading = document.createElement('h3');
    heading.className = 'dialog-section-title';
    heading.textContent = '成果';
    var list = document.createElement('ul');
    list.className = 'dialog-results';
    data.results.forEach(function (result, index) {
      var item = document.createElement('li');
      var marker = document.createElement('span');
      marker.className = 'result-index';
      marker.textContent = String(index + 1).padStart(2, '0');
      var text = document.createElement('span');
      text.textContent = result;
      item.append(marker, text);
      list.appendChild(item);
    });
    outcome.append(heading, list);
    dialogSections.appendChild(outcome);
  }

  function populate(slug, card) {
    var data = PROJECTS[slug];
    var art = card.dataset.art || 'art-rings';

    setText('dialog-title', card.dataset.title || '');
    setText('dialog-client', [card.dataset.client, card.dataset.year].filter(Boolean).join(' · '));
    setText('dialog-summary', data.summary);
    setText('dialog-role', data.role);
    setText('dialog-timeframe', data.timeframe);
    setText('dialog-services', data.services.join(', '));

    if (dialogArt) {
      dialogArt.className = 'card-art dialog-art ' + art;
      if (dialogArtLabel) dialogArtLabel.textContent = data.artLabel;
    }
    if (dialogLink) dialogLink.href = data.link;
    if (dialogLinkLabel) dialogLinkLabel.textContent = data.linkLabel;

    renderSections(data);
    renderTags(card.dataset.tags || '');
  }

  function openProject(slug, options) {
    var opts = options || {};
    var card = cardBySlug.get(slug);
    var data = PROJECTS[slug];
    if (!dialog || !card || !data) return;

    window.clearTimeout(closingTimer);
    isClosing = false;

    populate(slug, card);
    if (dialogScroll) dialogScroll.scrollTop = 0;

    if (!dialog.open) {
      bodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      window.requestAnimationFrame(function () {
        dialog.classList.add('is-open');
      });
    } else {
      dialog.classList.add('is-open');
    }

    currentSlug = slug;
    window.requestAnimationFrame(function () {
      if (dialogCloseBtn) dialogCloseBtn.focus({ preventScroll: true });
    });

    if (opts.updateHistory !== false && window.location.hash !== '#work/' + slug) {
      window.history.pushState({ project: slug }, '', '#work/' + slug);
      pushedHistoryEntry = true;
    }
  }

  function finishClose() {
    isClosing = false;
    if (dialog && dialog.open) dialog.close();
    document.body.style.overflow = bodyOverflow;
    currentSlug = null;
  }

  function closeDialog() {
    if (!dialog || !dialog.open || isClosing) return;
    isClosing = true;
    dialog.classList.remove('is-open');
    if (prefersReducedMotion) {
      finishClose();
    } else {
      window.clearTimeout(closingTimer);
      closingTimer = window.setTimeout(finishClose, 280);
    }
  }

  function requestClose() {
    if (!dialog || !dialog.open) return;
    if (pushedHistoryEntry && window.location.hash.indexOf('#work/') === 0) {
      pushedHistoryEntry = false;
      window.history.back();
      return;
    }
    if (window.location.hash.indexOf('#work/') === 0) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    closeDialog();
  }

  function slugFromHash() {
    var match = window.location.hash.match(/^#work\/([a-z0-9-]+)$/i);
    return match ? match[1].toLowerCase() : null;
  }

  function syncFromHash() {
    var slug = slugFromHash();
    if (slug && PROJECTS[slug]) {
      if (slug !== currentSlug) openProject(slug, { updateHistory: false });
      return;
    }
    if (currentSlug) closeDialog();
    pushedHistoryEntry = false;
  }

  if (dialog) {
    if (dialogCloseBtn) {
      dialogCloseBtn.addEventListener('click', requestClose);
    }
    dialog.addEventListener('cancel', function (event) {
      event.preventDefault();
      requestClose();
    });
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) requestClose();
    });
    dialog.addEventListener('close', function () {
      dialog.classList.remove('is-open');
      document.body.style.overflow = bodyOverflow;
      currentSlug = null;
    });
  }

  if (dialogLink) {
    dialogLink.addEventListener('click', function (event) {
      if (dialogLink.getAttribute('href') === '#') event.preventDefault();
    });
  }

  window.addEventListener('popstate', syncFromHash);
  window.addEventListener('hashchange', syncFromHash);

  var initialSlug = slugFromHash();
  if (initialSlug && PROJECTS[initialSlug]) {
    openProject(initialSlug, { updateHistory: false });
    pushedHistoryEntry = false;
  }
})();