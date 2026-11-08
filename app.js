(function () {
  "use strict";
  var awards = window.ECON_DATA || [];
  var byYear = new Map(awards.map(function (a) { return [a.year, a]; }));
  var categories = ["全部主题", "金融市场", "宏观政策", "计量方法", "博弈与制度", "增长与发展", "行为与决策"];
  var colors = {
    "金融市场": ["#315e48", "#e6eee4"], "宏观政策": ["#967344", "#f1eadd"], "计量方法": ["#5b6f8c", "#e7ecf3"],
    "博弈与制度": ["#71608b", "#ede7f2"], "增长与发展": ["#637843", "#eaf0df"], "行为与决策": ["#c25a3b", "#f9e9e0"]
  };
  var paths = {
    investing: { name: "让投资更有依据", symbol: "↗", caption: "从风险、收益到人的判断，建立投资的基本框架。", years: [1990, 2013, 2002, 2017, 2003, 1997, 2022], labels: ["先学会怎样分散风险", "再看价格反映了什么", "认识不确定决策中的偏差", "检查自己的心理账户", "理解风险如何随时间变化", "进入衍生品的定价世界", "把金融危机放回全景"] },
    macro: { name: "看懂政策与经济", symbol: "◎", caption: "把货币、预期、周期与长期增长连成一条线。", years: [1969, 1976, 1995, 1999, 2004, 2011, 2026, 2025], labels: ["经济怎样成为可以研究的模型", "货币与消费如何影响经济", "人们会对政策作出反应", "把资本流动和汇率纳入分析", "理解政策承诺与经济周期", "区分相关性和政策因果", "从微观决策理解宏观稳定", "最终回到持续增长从何而来"] },
    decisions: { name: "理解人怎样做决定", symbol: "⇄", caption: "从有限理性走到激励、博弈与制度设计。", years: [1978, 2002, 1994, 2001, 2007, 2016, 2020], labels: ["承认信息和精力有限", "看见风险判断中的心理机制", "考虑对手也在考虑你", "信息不对称怎样改变交易", "从参与者行为倒推规则", "把激励和控制权写进合同", "把理论带进真实拍卖设计"] }
  };
  var labDefinitions = {
    portfolio: { title: "分散投资实验", award: 1990, subtitle: "改变相关性，看两项资产怎样组成一个组合。" },
    game: { title: "博弈选择实验", award: 1994, subtitle: "当每个人都考虑自己的收益，结果会怎样？" },
    behavior: { title: "风险决策实验", award: 2002, subtitle: "同样的期望值，换一种表达，你还会怎样选择？" },
    bank: { title: "银行流动性实验", award: 2022, subtitle: "长期资产和随时可取的存款，怎样产生期限错配？" }
  };
  var state = { query: "", category: "全部主题", decade: "all", finance: "all", sort: "desc", limit: 12 };
  var progress = readProgress();
  var labState = { kind: "portfolio", weight: 50, rho: 30, a: "合作", b: "合作", frame: "gain", probability: 90, choice: null, withdrawal: 30, recovery: 80 };
  var main = document.getElementById("main");
  var toastTimer;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function sourceUrl(s) { try { var u = new URL(s); return u.protocol === "https:" ? esc(u.href) : "#about"; } catch (e) { return "#about"; } }
  function readProgress() {
    try {
      var v = JSON.parse(localStorage.getItem("economics-atlas-progress-v1") || "{}");
      return { learned: Array.isArray(v.learned) ? v.learned.filter(function (y) { return byYear.has(y); }) : [], saved: Array.isArray(v.saved) ? v.saved.filter(function (y) { return byYear.has(y); }) : [] };
    } catch (e) { return { learned: [], saved: [] }; }
  }
  function saveProgress() { try { localStorage.setItem("economics-atlas-progress-v1", JSON.stringify(progress)); } catch (e) { toast("浏览器未允许保存，当前学习状态仅在本次会话保留"); } updateHeader(); }
  function updateHeader() { document.getElementById("header-progress").textContent = progress.learned.length; }
  function toast(message) { var node = document.getElementById("toast"); node.textContent = message; node.classList.add("visible"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { node.classList.remove("visible"); }, 2600); }
  function uniqueCount() { return new Set(awards.flatMap(function (a) { return a.names; })).size; }
  function categoryStyle(a) { var c = colors[a.category] || colors["金融市场"]; return "--card-color:" + c[0] + ";--card-soft:" + c[1]; }
  function heroArt() {
    return '<div class="hero-art"><div class="art-card"><div class="art-heading"><span><i></i> 一张图，看见思想的力量</span><b>IDEAS → UNDERSTANDING</b></div><div class="art-number">1969<small>— ' + (awards.at(-1) || { year: 2026 }).year + ' · 持续演进的经济学</small></div><svg class="hero-chart" viewBox="0 0 480 235" role="img" aria-label="示意图：理解风险、市场和选择的不同路径"><defs><pattern id="dot-grid" width="19" height="19" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#c9d0be"/></pattern></defs><rect x="20" y="15" width="440" height="183" fill="url(#dot-grid)"/><path d="M34 188H450M34 188V28" fill="none" stroke="#a9b39c" stroke-width="1"/><path d="M35 181C90 183 116 170 147 150S219 119 251 113S312 103 340 83S399 40 448 29" stroke="#315e48" fill="none" stroke-width="2.5"/><path d="M35 181C111 183 132 157 175 161S245 154 285 118S357 105 385 93S420 90 448 74" stroke="#d85a37" fill="none" stroke-width="2.5"/><path d="M35 181C102 181 129 171 172 173S252 158 295 154S384 142 448 123" stroke="#a79a69" fill="none" stroke-width="2" stroke-dasharray="5 5"/><circle cx="340" cy="83" r="5" fill="#315e48" stroke="#e9ede1" stroke-width="3"/><rect x="309" y="48" width="104" height="25" rx="3" fill="#fffef9"/><text x="320" y="64" font-size="10" fill="#315e48">把问题，变成理解</text><text x="34" y="216" font-size="10" fill="#78816d">从一个好问题开始</text><text x="363" y="216" font-size="10" fill="#78816d">走向自己的判断</text></svg><div class="art-bottom"><strong>不是只认识名字，更要读懂思想。</strong><span>中文原创教学 · 图形为示意</span></div></div><div class="art-note"><span>' + awards.length + ' IDEAS</span>每一届，都能从这里开始。</div></div>';
  }
  function routeCards() {
    return Object.keys(paths).map(function (key, i) { var p = paths[key]; return '<a class="route" href="#path/' + key + '"><div class="route-top"><span>LEARNING PATH / 0' + (i + 1) + '</span><span class="route-icon">' + p.symbol + '</span></div><h3>' + p.name + '</h3><p>' + p.caption + '</p><div class="route-bottom"><span>' + p.years.length + ' 个主题 · 按问题循序学习</span><span>↗</span></div></a>'; }).join("");
  }
  function renderHome() {
    document.body.classList.remove("read-mode"); document.title = "经济学的答案 · 诺奖中文学习图谱";
    main.innerHTML = '<div class="container fade-in"><section class="hero"><div><div class="eyebrow"><span class="tiny-square"></span> A CHINESE GUIDE TO NOBEL IDEAS</div><h1>每一届诺奖，<br>都有一个值得<br><em>弄懂的问题。</em></h1><p class="hero-description">从市场为什么波动，到人为什么会选错。<br>把深刻的经济学，用中文讲清楚，再动手试一试。</p><div class="hero-actions"><a class="button" href="#archive">探索历届诺奖 <span>↗</span></a><a class="button secondary" href="#paths">不知道从哪开始？</a></div><div class="hero-stats"><div class="hero-stat"><strong>' + awards.length + '</strong><span>届完整解读</span></div><div class="hero-stat"><strong>' + uniqueCount() + '</strong><span>位获奖学者</span></div><div class="hero-stat"><strong>04</strong><span>个动手实验</span></div></div></div>' + heroArt() + '</section><div class="intro-strip"><span><strong>每一届都包含</strong>　 核心思想 / 通俗案例 / 简化应用 / 适用边界 / 小练习 / 原始资料</span><span class="strip-right">READ IT. TRY IT. QUESTION IT.</span></div><section id="paths" class="section"><div class="section-heading"><div><span class="eyebrow">FIND YOUR STARTING POINT</span><h2>从一个你关心的问题开始</h2><p>不必从第一页读到最后一页。先找到自己的入口。</p></div><a class="text-link" href="#archive">或者，按年份探索 ↗</a></div><div class="routes">' + routeCards() + '</div></section><section id="archive" class="section"><div class="section-heading archive-heading"><div><span class="eyebrow">THE COMPLETE COLLECTION · 1969—2026</span><h2>一届一届，读懂经济学</h2><p>覆盖全部获奖年份，也标明它们与金融的不同距离。</p></div><span class="eyebrow">持续补充的学习图谱</span></div><div class="archive-tools"><label class="search-wrap"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="搜索年份、学者，或你关心的问题…" aria-label="搜索历届诺奖" value="' + esc(state.query) + '"></label><select id="decade" aria-label="按年代筛选"><option value="all">全部年代</option>' + [1960, 1970, 1980, 1990, 2000, 2010, 2020].map(function (d) { return '<option value="' + d + '"' + (String(d) === state.decade ? " selected" : "") + '>' + d + ' 年代</option>'; }).join("") + '</select><select id="finance" aria-label="按金融关联筛选"><option value="all">全部金融关联</option>' + ["直接相关", "研究工具", "理解背景"].map(function (s) { return '<option' + (s === state.finance ? " selected" : "") + '>' + s + '</option>'; }).join("") + '</select><select id="sort" aria-label="排序方式"><option value="desc"' + (state.sort === "desc" ? " selected" : "") + '>从新到旧</option><option value="asc"' + (state.sort === "asc" ? " selected" : "") + '>从首届开始</option></select></div><div class="filter-row" role="group" aria-label="主题筛选">' + categories.map(function (c) { return '<button class="filter' + (state.category === c ? " active" : "") + '" data-category="' + c + '" aria-pressed="' + (state.category === c) + '">' + c + '</button>'; }).join("") + '</div><div class="filter-state"><span id="result-count" role="status" aria-live="polite"></span><button class="reset-filter" id="reset-filters">清除筛选</button></div><div class="award-grid" id="award-grid"></div><div class="load-area" id="load-area"></div></section><section id="labs" class="lab-intro"><div><span class="eyebrow">LESS READING. MORE UNDERSTANDING.</span><h2>把理论放进实验里。</h2><p>改一改参数，看看结果为什么变了。<br>4 个简化模型，帮助建立直觉，而非预测真实市场。</p></div><div class="lab-list">' + Object.keys(labDefinitions).map(function (k) { var l = labDefinitions[k]; return '<a class="lab-link" href="#lab/' + k + '"><span>' + l.title + '<small>关联 ' + l.award + ' 年获奖思想</small></span><span>↗</span></a>'; }).join("") + '</div></section><section id="about" class="about-section"><div><span class="eyebrow">A NOTE FROM THE ATLAS</span><h2>读懂，不止于读过。</h2></div><div><p>这是一个独立的中文经济学学习项目，以瑞典中央银行纪念阿尔弗雷德·诺贝尔经济学奖为线索，覆盖 1969—2026 年全部 ' + awards.length + ' 届。获奖事实与年份以官方资料为准；中文解释、案例、应用关联和练习是本站的教学整理，不是官方授奖词逐字翻译。</p><p>每届正文都附原始来源。2026 年依据瑞典皇家科学院与瑞典央行公告收录。金融关联是编辑分类，并非官方分类。互动模型与数值均为教学假设；相关性、估计误差、交易限制与制度差异会影响实际应用。</p><p>学习记录仅保存在当前浏览器，不上传服务器。本站不提供实时行情、买卖信号或收益保证，也不要求注册、上传持仓或连接券商。资料核验日期：2026 年 11 月 6 日。</p><a href="https://www.nobelprize.org/prizes/lists/all-prizes-in-economic-sciences/" target="_blank" rel="noopener noreferrer">查看诺奖官方档案 ↗</a></div></section></div>';
    bindArchive(); renderCards();
  }
  function filteredAwards() {
    var q = state.query.toLowerCase().trim();
    return awards.filter(function (a) {
      var searchable = [a.year, a.title, a.names.join(" "), a.category, a.finance, a.award, a.question, a.intuition, a.example, a.applications.join(" "), a.limits.join(" "), a.keywords.join(" ")].join(" ").toLowerCase();
      return (!q || searchable.includes(q)) && (state.category === "全部主题" || a.category === state.category) && (state.decade === "all" || Math.floor(a.year / 10) * 10 === Number(state.decade)) && (state.finance === "all" || a.finance === state.finance);
    }).sort(function (a, b) { return state.sort === "asc" ? a.year - b.year : b.year - a.year; });
  }
  function awardCard(a) {
    var saved = progress.saved.includes(a.year), learned = progress.learned.includes(a.year);
    return '<article class="award-card" style="' + categoryStyle(a) + '"><button class="save-button' + (saved ? " saved" : "") + '" data-save="' + a.year + '" aria-label="' + (saved ? "取消收藏" : "收藏") + a.year + '年" aria-pressed="' + saved + '">' + (saved ? "★" : "☆") + '</button><button class="award-open" data-award="' + a.year + '" aria-label="阅读' + a.year + '年：' + esc(a.title) + '"><div class="card-top"><span class="card-year">' + a.year + '</span><span class="card-category">' + esc(a.category) + '</span></div><h3>' + esc(a.title) + '</h3><p class="card-names">' + esc(a.names.join(" / ")) + '</p><p class="card-question">' + esc(a.question) + '</p></button><div class="card-bottom"><span class="' + (learned ? "learned-badge" : "") + '">' + (learned ? "✓ 已学过" : esc(a.finance)) + '</span><button data-award="' + a.year + '">读懂这一届 ↗</button></div></article>';
  }
  function renderCards() {
    var grid = document.getElementById("award-grid"); if (!grid) return;
    var data = filteredAwards();
    document.getElementById("result-count").innerHTML = '找到 <strong>' + data.length + '</strong> 届 / 全部 ' + awards.length + ' 届';
    grid.innerHTML = data.length ? data.slice(0, state.limit).map(awardCard).join("") : '<div class="empty-state"><h3>暂时没有找到匹配的主题</h3><p>试试“风险”“博弈”“1990”，或清除筛选条件。</p><button class="button secondary" data-reset>查看全部年份</button></div>';
    document.getElementById("load-area").innerHTML = data.length > state.limit ? '<button class="button secondary" id="load-more">继续探索更多年份 <span>↓</span></button><span>已展示 ' + Math.min(state.limit, data.length) + ' / ' + data.length + ' 届</span>' : data.length ? '<span>已展示全部 ' + data.length + ' 届。每一届，都有自己的问题与答案。</span>' : "";
    var more = document.getElementById("load-more"); if (more) more.onclick = function () { state.limit += 12; renderCards(); };
    bindAwardButtons(grid); var reset = grid.querySelector("[data-reset]"); if (reset) reset.onclick = resetFilters;
  }
  function bindAwardButtons(parent) {
    parent.querySelectorAll("[data-award]").forEach(function (b) { b.onclick = function () { var d = document.getElementById("learning-dialog"); if (d.open) d.close(); location.hash = "award/" + b.dataset.award; }; });
    parent.querySelectorAll("[data-save]").forEach(function (b) { b.onclick = function () { toggleSave(Number(b.dataset.save)); }; });
  }
  function bindArchive() {
    document.getElementById("search").oninput = function (e) { state.query = e.target.value; state.limit = 12; renderCards(); };
    ["decade", "finance", "sort"].forEach(function (key) { document.getElementById(key).onchange = function (e) { state[key] = e.target.value; state.limit = 12; renderCards(); }; });
    document.querySelectorAll("[data-category]").forEach(function (b) { b.onclick = function () { state.category = b.dataset.category; state.limit = 12; document.querySelectorAll("[data-category]").forEach(function (x) { x.classList.toggle("active", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); renderCards(); }; });
    document.getElementById("reset-filters").onclick = resetFilters;
  }
  function resetFilters() { state = { query: "", category: "全部主题", decade: "all", finance: "all", sort: "desc", limit: 12 }; renderHome(); document.getElementById("archive").scrollIntoView(); }
  function toggleSave(year) {
    var i = progress.saved.indexOf(year); if (i === -1) progress.saved.push(year); else progress.saved.splice(i, 1);
    saveProgress(); toast(i === -1 ? "已加入收藏，可以在“我的学习”里找到" : "已取消收藏");
    if (document.getElementById("award-grid")) renderCards();
    document.querySelectorAll("[data-article-save]").forEach(function (b) { b.textContent = progress.saved.includes(year) ? "★ 已收藏" : "☆ 收藏本届"; });
  }
  function relatedLab(year) {
    if ([1981, 1985, 1990].includes(year)) return "portfolio";
    if ([1994, 2005, 2007, 2020].includes(year)) return "game";
    if ([1978, 2002, 2017].includes(year)) return "behavior";
    if (year === 2022) return "bank";
    return null;
  }
  function renderArticle(year) {
    var a = byYear.get(year); if (!a) return renderNotFound();
    document.body.classList.add("read-mode"); document.title = a.year + " · " + a.title + "｜经济学的答案";
    var lab = relatedLab(year), previous = byYear.get(year - 1), next = byYear.get(year + 1);
    main.innerHTML = '<div class="article-container fade-in"><div class="article-breadcrumb"><a href="#archive">← 返回历届诺奖</a><span>学习图谱 / ' + esc(a.category) + ' / ' + a.year + '</span></div><div class="article-layout"><aside class="article-aside"><div class="year-large">' + a.year + '</div><p>瑞典央行纪念诺贝尔<br>经济学奖</p><nav class="toc" aria-label="本届内容目录"><a href="#section-award">01 一句话读懂</a><a href="#section-idea">02 理论本身</a><a href="#section-example">03 看一个例子</a><a href="#section-use">04 可以怎么用</a><a href="#section-limits">05 理解它的边界</a><a href="#section-exercise">06 动脑试一试</a><a href="#section-sources">07 原始资料</a></nav></aside><article><header class="article-header"><span class="eyebrow">ONE PRIZE, ONE GOOD QUESTION</span><h1>' + esc(a.title) + '</h1><p class="article-names">' + esc(a.names.join(" · ")) + '</p><div class="article-tags"><span>' + esc(a.category) + '</span><span>金融关联：' + esc(a.finance) + '</span>' + a.keywords.map(function (k) { return '<span>' + esc(k) + '</span>'; }).join("") + '</div><div class="article-question">' + esc(a.question) + '</div></header><section class="article-section" id="section-award"><span class="section-no">01 / THE CONTRIBUTION</span><h2>先用一句话读懂</h2><p>' + esc(a.award) + '</p></section><section class="article-section" id="section-idea"><span class="section-no">02 / THE IDEA ITSELF</span><h2>理论本身，到底在说什么？</h2><p>' + esc(a.intuition) + '</p></section><section class="article-section" id="section-example"><span class="section-no">03 / MAKE IT CONCRETE</span><h2>放到一个简单的情境里</h2><div class="example-box"><span>教学假设 · 不是真实市场数据</span><p>' + esc(a.example) + '</p></div></section><section class="article-section" id="section-use"><span class="section-no">04 / HOW TO USE IT</span><h2>可以怎么用？</h2><div class="application-list">' + a.applications.map(function (t) { return '<div class="application-item">' + esc(t) + '</div>'; }).join("") + '</div><p class="source-note">本节是基于理论的教学延伸，并非授奖机构的投资建议或策略有效性保证。</p>' + (lab ? '<div class="related-lab"><div><p>把这个问题，放进实验里。</p><small>' + labDefinitions[lab].title + ' · 简化模型</small></div><a class="button secondary" href="#lab/' + lab + '">动手试一试 ↗</a></div>' : "") + '</section><section class="article-section" id="section-limits"><span class="section-no">05 / KNOW THE BOUNDARIES</span><h2>理解它，也要理解它的边界</h2><ul class="limits-list">' + a.limits.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("") + '</ul></section><section class="article-section" id="section-exercise"><span class="section-no">06 / THINK FOR YOURSELF</span><h2>动脑试一试</h2><div class="exercise-box"><p>' + esc(a.exercise.question) + '</p><details><summary>想好了？展开参考解析</summary><p>' + esc(a.exercise.answer) + '</p></details></div></section><section class="article-section" id="section-sources"><span class="section-no">07 / GO TO THE SOURCE</span><h2>继续读原始资料</h2><div class="source-list">' + a.sources.map(function (s) { return '<a target="_blank" rel="noopener noreferrer" href="' + sourceUrl(s.url) + '">' + esc(s.label) + ' ↗</a>'; }).join("") + '</div><p class="source-note">获奖事实以官方资料为准；本页为独立中文教学整理。术语和案例已经简化，深入研究请返回原始文献。</p></section><div class="article-actions"><button class="button orange" id="mark-learned">' + (progress.learned.includes(year) ? "✓ 已学过 · 点击撤销" : "✓ 标记为已学过") + '</button><button class="button secondary" data-article-save>' + (progress.saved.includes(year) ? "★ 已收藏" : "☆ 收藏本届") + '</button><button class="button secondary" id="copy-link">复制本届链接 ↗</button></div><div class="article-next">' + (previous ? '<a href="#award/' + previous.year + '"><small>← 上一届 · ' + previous.year + '</small>' + esc(previous.title) + '</a>' : '<span></span>') + (next ? '<a href="#award/' + next.year + '"><small>下一届 · ' + next.year + ' →</small>' + esc(next.title) + '</a>' : '<a href="#archive">返回全部年份 →</a>') + '</div></article></div></div>';
    document.querySelectorAll(".toc a").forEach(function (l) { l.onclick = function (e) { e.preventDefault(); document.querySelector(l.getAttribute("href")).scrollIntoView({ behavior: "smooth" }); }; });
    document.getElementById("mark-learned").onclick = function (e) { var index = progress.learned.indexOf(year); if (index === -1) progress.learned.push(year); else progress.learned.splice(index, 1); saveProgress(); e.currentTarget.textContent = progress.learned.includes(year) ? "✓ 已学过 · 点击撤销" : "✓ 标记为已学过"; toast(progress.learned.includes(year) ? "学习进度已保存在当前浏览器" : "已撤销本届学习标记"); };
    document.querySelector("[data-article-save]").onclick = function () { toggleSave(year); };
    document.getElementById("copy-link").onclick = async function () { try { if (!navigator.clipboard) throw new Error("Unavailable"); await navigator.clipboard.writeText(location.href); toast("本届链接已复制"); } catch (e) { toast("请复制浏览器地址栏中的本届链接"); } };
  }
  function renderPath(key) {
    var p = paths[key]; if (!p) return renderNotFound();
    document.body.classList.remove("read-mode"); document.title = p.name + "｜经济学的答案";
    main.innerHTML = '<div class="container path-page fade-in"><div class="page-topline"><a href="#paths">← 返回学习路线</a><span>LEARNING PATH</span></div><span class="eyebrow">不赶进度，先建立理解。</span><h1>' + p.name + '</h1><p class="lead">' + p.caption + ' 按下面的顺序阅读；每一届都包含案例、应用边界和小练习，学过的内容会自动在这里标记。</p><div class="path-header-actions"><a class="button" href="#award/' + p.years.find(function (y) { return !progress.learned.includes(y); }) + '">继续这条路线 <span>↗</span></a></div><div class="path-timeline">' + p.years.map(function (year, i) { var a = byYear.get(year); if (!a) return ""; return '<a class="path-step" href="#award/' + year + '"><span class="step-number">' + (progress.learned.includes(year) ? "✓" : String(i + 1).padStart(2, "0")) + '</span><div><h2>' + esc(p.labels[i]) + '</h2><p>' + esc(a.title) + ' · ' + esc(a.names.join(" / ")) + '</p></div><span class="step-year">' + year + '</span></a>'; }).join("") + '</div></div>';
    var routeButton = document.querySelector(".path-header-actions a");
    if (p.years.every(function (y) { return progress.learned.includes(y); })) { routeButton.href = "#award/" + p.years[0]; routeButton.textContent = "已完成这条路线 · 重新温习 ↗"; }
  }
  function renderNotFound() { main.innerHTML = '<div class="container empty-state"><h1>这页还不在图谱中</h1><p>从已核实的获奖年份开始探索吧。</p><a class="button" href="#archive">返回历届诺奖</a></div>'; }
  function showLearning() {
    var dialog = document.getElementById("learning-dialog");
    document.getElementById("learning-content").innerHTML = '<div class="learning-summary"><strong>' + progress.learned.length + ' / ' + awards.length + '</strong><span>届已学过</span><div class="learning-progress"><div style="width:' + (100 * progress.learned.length / Math.max(1, awards.length)) + '%"></div></div></div><p class="learning-subtitle">收藏的内容 · ' + progress.saved.length + '</p><div class="learning-list">' + (progress.saved.length ? progress.saved.slice().reverse().map(learningRow).join("") : '<p class="privacy-note">点击卡片上的 ☆，把感兴趣的主题留在这里。</p>') + '</div><p class="learning-subtitle">已经学过 · ' + progress.learned.length + '</p><div class="learning-list">' + (progress.learned.length ? progress.learned.slice().reverse().map(learningRow).join("") : '<p class="privacy-note">阅读一届后，点击“标记为已学过”记录进度。</p>') + '</div><p class="privacy-note">这些记录只保存在当前浏览器；更换设备、清除站点数据后不会同步。无需注册。</p>';
    bindAwardButtons(document.getElementById("learning-content")); if (!dialog.open) dialog.showModal();
  }
  function learningRow(year) { var a = byYear.get(year); return a ? '<button data-award="' + year + '"><span>' + year + ' · ' + esc(a.title) + '</span><small>阅读 ↗</small></button>' : ""; }
  function renderLab(kind) {
    if (!labDefinitions[kind]) return renderNotFound();
    labState.kind = kind; document.body.classList.remove("read-mode"); document.title = labDefinitions[kind].title + "｜经济学的答案";
    main.innerHTML = '<div class="container lab-page fade-in"><div class="page-topline"><a href="#labs">← 返回实验入口</a><a href="#award/' + labDefinitions[kind].award + '">阅读 ' + labDefinitions[kind].award + ' 年的理论 ↗</a></div><span class="eyebrow">THE ECONOMICS LAB · 教学模型</span><h1>把一个变量，亲手改一改。</h1><p class="lead">这里的数值是用于理解原理的假设，不是真实市场数据。看清模型的机制，也记得观察它省略了什么。</p><div class="lab-tabs" role="group" aria-label="选择实验">' + Object.keys(labDefinitions).map(function (k) { return '<button class="' + (kind === k ? "active" : "") + '" data-lab-tab="' + k + '" aria-pressed="' + (kind === k) + '">' + labDefinitions[k].title + '</button>'; }).join("") + '</div><div id="lab-content"></div></div>';
    document.querySelectorAll("[data-lab-tab]").forEach(function (b) { b.onclick = function () { location.hash = "lab/" + b.dataset.labTab; }; });
    if (kind === "portfolio") renderPortfolioLab();
    if (kind === "game") renderGameLab();
    if (kind === "behavior") renderBehaviorLab();
    if (kind === "bank") renderBankLab();
  }
  function rangeControl(id, label, min, max, value, left, right) { return '<div class="control"><label for="' + id + '">' + label + '<strong id="' + id + '-value"></strong></label><input type="range" id="' + id + '" min="' + min + '" max="' + max + '" value="' + value + '"><div class="range-hints"><span>' + left + '</span><span>' + right + '</span></div></div>'; }
  function renderPortfolioLab() {
    document.getElementById("lab-content").innerHTML = '<div class="lab-workspace"><div class="lab-controls"><span class="eyebrow">1990 · HARRY MARKOWITZ</span><h2>两项资产，怎样一起波动？</h2><p>资产 A：预期收益 8%，波动率 20%。<br>资产 B：预期收益 12%，波动率 30%。<br>改变配置和相关性，看看组合会发生什么。</p>' + rangeControl("weight", "资产 A 的资金比例", 0, 100, labState.weight, "全部配置 B", "全部配置 A") + rangeControl("rho", "两项资产收益的相关性", -100, 100, labState.rho, "−1 · 完全反向", "+1 · 完全同向") + '</div><div class="lab-visual"><svg id="portfolio-chart" viewBox="0 0 500 310" role="img" aria-label="不同资金比例下的组合风险和预期收益曲线"></svg><div class="lab-metrics" aria-live="polite"><div class="metric"><strong id="portfolio-return"></strong><span>模型预期收益</span></div><div class="metric"><strong id="portfolio-risk"></strong><span>组合波动率</span></div></div></div></div><div class="lab-explanation" id="portfolio-explanation"></div><p class="lab-assumptions">模型假设：单期、只做多、资金全部投入、不加杠杆，预期收益、波动率与相关性已知且固定，未计费用和税。波动率不是最大亏损，也不是最大回撤；历史估计不等于未来真实参数。</p><p class="lab-note">这是均值—方差框架下的简化教学计算。<a href="#award/1990">回到 1990 年，读懂理论与边界 ↗</a></p>';
    ["weight", "rho"].forEach(function (id) { document.getElementById(id).oninput = function (e) { labState[id] = Number(e.target.value); updatePortfolio(); }; }); updatePortfolio();
  }
  function updatePortfolio() {
    var w = labState.weight / 100, r = labState.rho / 100, result = EconModels.portfolio(w, r);
    document.getElementById("weight-value").textContent = labState.weight + "%";
    document.getElementById("rho-value").textContent = r.toFixed(2);
    document.getElementById("portfolio-return").textContent = (result.expected * 100).toFixed(1) + "%";
    document.getElementById("portfolio-risk").textContent = (result.volatility * 100).toFixed(1) + "%";
    var points = [], x = function (v) { return 50 + v / .35 * 400; }, y = function (v) { return 260 - (v - .06) / .08 * 220; };
    for (var i = 0; i <= 100; i++) { var p = EconModels.portfolio(i / 100, r); points.push(x(p.volatility).toFixed(2) + "," + y(p.expected).toFixed(2)); }
    var chart = '<rect x="50" y="30" width="400" height="230" fill="#f5f3ed"/>';
    [0, 10, 20, 30].forEach(function (n) { var px = x(n / 100); chart += '<line x1="' + px + '" y1="30" x2="' + px + '" y2="260" stroke="#e0e3d8"/><text x="' + px + '" y="282" text-anchor="middle" font-size="10" fill="#858b7a">' + n + '%</text>'; });
    [8, 10, 12].forEach(function (n) { var py = y(n / 100); chart += '<line x1="50" y1="' + py + '" x2="450" y2="' + py + '" stroke="#e0e3d8"/><text x="37" y="' + (py + 4) + '" text-anchor="end" font-size="10" fill="#858b7a">' + n + '%</text>'; });
    chart += '<text x="50" y="17" font-size="10" fill="#858b7a">预期收益</text><text x="425" y="304" font-size="10" fill="#858b7a">波动率 →</text><polyline points="' + points.join(" ") + '" fill="none" stroke="#315e48" stroke-width="3"/><circle cx="' + x(.2) + '" cy="' + y(.08) + '" r="4" fill="#315e48"/><text x="' + (x(.2) + 10) + '" y="' + (y(.08) + 17) + '" font-size="10" fill="#6e7966">资产 A</text><circle cx="' + x(.3) + '" cy="' + y(.12) + '" r="4" fill="#315e48"/><text x="' + (x(.3) - 12) + '" y="' + (y(.12) - 13) + '" font-size="10" fill="#6e7966">资产 B</text><circle cx="' + x(result.volatility) + '" cy="' + y(result.expected) + '" r="8" fill="#d85a37" stroke="#fffef9" stroke-width="3"/>';
    document.getElementById("portfolio-chart").innerHTML = chart;
    document.getElementById("portfolio-explanation").textContent = "当前 A 占 " + labState.weight + "%，B 占 " + (100 - labState.weight) + "%。预期收益按权重加权；组合波动还受共同波动影响。在其他参数不变时，把相关性调低，可以观察分散效果。图中的每一点代表一种配置，不是未来市场路径。";
  }
  function choiceButtons(group, values, selected) { return '<div class="choice-buttons">' + values.map(function (v) { return '<button data-choice-group="' + group + '" data-choice-value="' + v + '" class="' + (selected === v ? "selected" : "") + '" aria-pressed="' + (selected === v) + '">' + v + '</button>'; }).join("") + '</div>'; }
  function renderGameLab() {
    var score = EconModels.game(labState.a, labState.b);
    document.getElementById("lab-content").innerHTML = '<div class="lab-workspace"><div class="lab-controls"><span class="eyebrow">1994 · NON-COOPERATIVE GAMES</span><h2>各自最优，会一起更好吗？</h2><p>两位参与者同时选择。积分仅表示这个假设游戏里的收益，不代表所有现实合作或竞争情境。</p><div class="control"><label>你的选择</label>' + choiceButtons("a", ["合作", "竞争"], labState.a) + '</div><div class="control"><label>对方的选择</label>' + choiceButtons("b", ["合作", "竞争"], labState.b) + '</div></div><div class="lab-visual"><h3>格子中的积分依次是：你 / 对方</h3><table class="payoff-table"><thead><tr><th>你的选择 ↓</th><th>对方合作</th><th>对方竞争</th></tr></thead><tbody>' + ["合作", "竞争"].map(function (a) { return '<tr><th>' + a + '</th>' + ["合作", "竞争"].map(function (b) { var v = EconModels.game(a, b); return '<td class="' + (labState.a === a && labState.b === b ? "highlight" : "") + '"><b>' + v[0] + ' / ' + v[1] + '</b>' + (a === "竞争" && b === "竞争" ? "本例纳什均衡" : a === "合作" && b === "合作" ? "共同收益更高" : "单方改变选择") + '</td>'; }).join("") + '</tr>'; }).join("") + '</tbody></table><div class="lab-metrics"><div class="metric"><strong>' + score[0] + '</strong><span>你的积分</span></div><div class="metric"><strong>' + score[1] + '</strong><span>对方的积分</span></div></div></div></div><div class="lab-explanation">在这组特定收益下，无论对方选择什么，自己选“竞争”都能获得更高积分。因此“竞争 / 竞争”是纳什均衡：谁单独改成合作都会吃亏。但它的共同收益低于“合作 / 合作”。均衡描述单独改变策略的动机，并不等于集体最优。</div><p class="lab-assumptions">模型假设：同时行动、一次性互动、双方知道收益表、以自身积分为目标。重复互动、可执行的协议、信息和信任，都可能改变结果。这个演示不是企业定价或现实投资的通用规则。</p>';
    document.querySelectorAll("[data-choice-group]").forEach(function (b) { b.onclick = function () { labState[b.dataset.choiceGroup] = b.dataset.choiceValue; renderGameLab(); }; });
  }
  function renderBehaviorLab() {
    var sign = labState.frame === "gain" ? 1 : -1, p = labState.probability, amount = p * 10;
    var sure = sign === 1 ? "确定获得 " + amount + " 元" : "确定损失 " + amount + " 元";
    var risky = p + "% 概率" + (sign === 1 ? "获得" : "损失") + " 1,000 元";
    document.getElementById("lab-content").innerHTML = '<div class="lab-workspace"><div class="lab-controls"><span class="eyebrow">2002 · DECISIONS UNDER UNCERTAINTY</span><h2>换个表达，你会改主意吗？</h2><p>先在收益情境做选择，再切换到损失情境。两个情境分别有自己的选择题；观察你的偏好有没有变化。</p><div class="choice-buttons"><button data-frame="gain" class="' + (sign === 1 ? "selected" : "") + '">收益情境</button><button data-frame="loss" class="' + (sign === -1 ? "selected" : "") + '">损失情境</button></div>' + rangeControl("probability", "概率方案中，事件发生的概率", 10, 100, p, "10%", "100%") + '<div class="choice-buttons"><button data-risk-choice="sure" class="' + (labState.choice === "sure" ? "selected" : "") + '">选择确定方案</button><button data-risk-choice="risky" class="' + (labState.choice === "risky" ? "selected" : "") + '">选择概率方案</button></div></div><div class="lab-visual"><div class="behavior-card"><small>方案 A · 确定</small><strong>' + (sign * amount).toLocaleString() + ' 元</strong><p>' + sure + '</p></div><div class="behavior-card" style="margin-top:13px"><small>方案 B · 不确定</small><strong>' + p + '% / ' + (100 - p) + '%</strong><p>' + risky + '，其余情况为 0 元</p></div></div></div><div class="lab-explanation">' + (labState.choice ? "你选择了" + (labState.choice === "sure" ? "确定方案" : "概率方案") + "。" : "先按自己的直觉做一个选择。") + '本题两种方案的金额期望值相同，都是 ' + (sign * amount) + ' 元；但风险分布不同。卡尼曼与合作者研究了参考点、损失和概率判断如何影响选择。风险厌恶本身不等于错误，单次选择也不能诊断你的理性程度。</div><p class="lab-assumptions">这是风险选择的简化思考题，不是完整前景理论参数估计。没有真实支付；收入、财富、效用和个人约束均未建模。2002 年另一位获奖者史密斯的贡献是实验经济学，不能与卡尼曼的贡献混为一谈。</p>';
    document.getElementById("probability-value").textContent = p + "%";
    document.getElementById("probability").oninput = function (e) {
      labState.probability = Number(e.target.value);
      var chance = labState.probability, value = chance * 10, direction = labState.frame === "gain" ? 1 : -1;
      var cards = document.querySelectorAll(".behavior-card");
      document.getElementById("probability-value").textContent = chance + "%";
      cards[0].querySelector("strong").textContent = (direction * value).toLocaleString() + " 元";
      cards[0].querySelector("p").textContent = "确定" + (direction === 1 ? "获得 " : "损失 ") + value + " 元";
      cards[1].querySelector("strong").textContent = chance + "% / " + (100 - chance) + "%";
      cards[1].querySelector("p").textContent = chance + "% 概率" + (direction === 1 ? "获得" : "损失") + " 1,000 元，其余情况为 0 元";
      document.querySelector(".lab-explanation").textContent = (labState.choice ? "你选择了" + (labState.choice === "sure" ? "确定方案" : "概率方案") + "。" : "先按自己的直觉做一个选择。") + "本题两种方案的金额期望值相同，都是 " + (direction * value) + " 元；但风险分布不同。卡尼曼与合作者研究了参考点、损失和概率判断如何影响选择。风险厌恶本身不等于错误，单次选择也不能诊断你的理性程度。";
    };
    document.querySelectorAll("[data-frame]").forEach(function (b) { b.onclick = function () { labState.frame = b.dataset.frame; labState.choice = null; renderBehaviorLab(); }; });
    document.querySelectorAll("[data-risk-choice]").forEach(function (b) { b.onclick = function () { labState.choice = b.dataset.riskChoice; renderBehaviorLab(); }; });
  }
  function renderBankLab() {
    document.getElementById("lab-content").innerHTML = '<div class="lab-workspace"><div class="lab-controls"><span class="eyebrow">2022 · BANKS AND FINANCIAL CRISES</span><h2>资产还在，为什么付不出钱？</h2><p>假设银行有 100 单位存款，对应 20 单位现金和 80 单位长期贷款。贷款到期按面值回收，但提前出售会打折。</p>' + rangeControl("withdrawal", "本轮客户要取走的存款", 0, 100, labState.withdrawal, "0 单位", "100 单位") + rangeControl("recovery", "长期贷款提前出售的回收率", 50, 100, labState.recovery, "50% · 折价大", "100% · 无折价") + '</div><div class="lab-visual"><div class="bank-bars"><div class="bank-bar"><label>本轮提款需求 <span id="bank-demand"></span></label><div class="bar-track"><div class="bar-fill orange" id="demand-bar"></div></div></div><div class="bank-bar"><label>现有现金 <span>20 单位</span></label><div class="bar-track"><div class="bar-fill" style="width:20%"></div></div></div><div class="bank-bar"><label>现金＋全部贷款立即变现 <span id="bank-available"></span></label><div class="bar-track"><div class="bar-fill" id="available-bar"></div></div></div></div><div class="big-result" id="bank-shortage"></div><div class="big-caption">本轮即时支付缺口（单位）</div></div></div><div class="lab-explanation" id="bank-explanation"></div><p class="lab-assumptions">仅为资产变现与提款压力的静态算术演示，不是完整的戴蒙德—迪布维格模型。未建模资本缓冲、信用损失、存款保险、央行援助和客户策略。“本轮能支付”不等于银行长期安全；折价损失也可能影响偿付能力。</p>';
    ["withdrawal", "recovery"].forEach(function (id) { document.getElementById(id).oninput = function (e) { labState[id] = Number(e.target.value); updateBank(); }; }); updateBank();
  }
  function updateBank() {
    var r = EconModels.bank(labState.withdrawal, labState.recovery / 100);
    document.getElementById("withdrawal-value").textContent = labState.withdrawal + " 单位";
    document.getElementById("recovery-value").textContent = labState.recovery + "%";
    document.getElementById("bank-demand").textContent = r.demand.toFixed(0) + " 单位";
    document.getElementById("bank-available").textContent = r.available.toFixed(1) + " 单位";
    document.getElementById("demand-bar").style.width = r.demand + "%";
    document.getElementById("available-bar").style.width = r.available + "%";
    document.getElementById("bank-shortage").textContent = r.shortage.toFixed(1);
    document.getElementById("bank-explanation").textContent = (r.shortage > 0 ? "即使把长期贷款全部折价出售，也无法覆盖本轮提款。" : r.demand <= 20 ? "现金可以覆盖本轮提款，不需要提前出售贷款。" : "本轮提款可被覆盖，但需要提前出售部分长期贷款。") + " 在当前假设下，需要出售面值 " + r.sold.toFixed(1) + " 单位的贷款，产生 " + r.loss.toFixed(1) + " 单位折价损失。这说明“长期资产有价值”和“现在有足够现金”是两个不同问题。";
  }
  function route() {
    var hash;
    try { hash = decodeURIComponent(location.hash.slice(1) || "home"); } catch (e) { hash = "home"; }
    if (hash.startsWith("award/")) { renderArticle(Number(hash.split("/")[1])); window.scrollTo(0, 0); }
    else if (hash.startsWith("path/")) { renderPath(hash.split("/")[1]); window.scrollTo(0, 0); }
    else if (hash.startsWith("lab/")) { renderLab(hash.split("/")[1]); window.scrollTo(0, 0); }
    else { renderHome(); if (["archive", "paths", "labs", "about"].includes(hash)) requestAnimationFrame(function () { var target = document.getElementById(hash); if (target) target.scrollIntoView(); }); else window.scrollTo(0, 0); }
    updateHeader();
  }
  document.getElementById("my-learning").onclick = showLearning;
  document.getElementById("close-learning").onclick = function () { document.getElementById("learning-dialog").close(); };
  document.getElementById("learning-dialog").addEventListener("click", function (e) { if (e.target === e.currentTarget) { var r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.currentTarget.close(); } });
  window.addEventListener("hashchange", route);
  route();
})();
