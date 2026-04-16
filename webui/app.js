const metrics = [
  { label: "今日销售额", value: "¥ 2,418,600", delta: "+12.6%" },
  { label: "待开票金额", value: "¥ 863,200", delta: "-3.1%" },
  { label: "采购到货率", value: "96.2%", delta: "+1.8%" },
  { label: "应收账款周转", value: "35 天", delta: "-2 天" }
];

const modules = [
  { name: "财务与税务", desc: "支持中国会计科目、电子发票、税务申报辅助" },
  { name: "销售管理", desc: "多渠道订单汇总，支持微信/企业微信客户触达" },
  { name: "采购与供应链", desc: "供应商评级、到货预警、跨仓协同补货" },
  { name: "生产与排产", desc: "按班组能力动态排程，实时反馈工单异常" },
  { name: "人力与考勤", desc: "对接钉钉/飞书，适配中国法定节假日与社保规则" },
  { name: "客服与售后", desc: "工单统一处理，客户情绪与复购机会识别" }
];

const agents = [
  {
    name: "财税合规 Agent",
    role: "负责总账、税务异常识别、发票核验",
    tags: ["税务", "发票", "合规"],
    sla: "15 分钟"
  },
  {
    name: "销售增长 Agent",
    role: "负责线索评分、报价建议、回款风险提醒",
    tags: ["销售", "报价", "回款"],
    sla: "10 分钟"
  },
  {
    name: "采购优化 Agent",
    role: "负责供应商比价、库存预测、缺料预警",
    tags: ["采购", "库存", "预测"],
    sla: "20 分钟"
  },
  {
    name: "生产排产 Agent",
    role: "负责工单分解、班组排产、瓶颈分析",
    tags: ["生产", "工单", "排产"],
    sla: "25 分钟"
  },
  {
    name: "客服体验 Agent",
    role: "负责售后工单、情绪分析、满意度提升",
    tags: ["客服", "售后", "体验"],
    sla: "8 分钟"
  }
];

function renderMetrics() {
  const metricGrid = document.querySelector("#metricGrid");
  metrics.forEach((m) => {
    const div = document.createElement("div");
    div.className = "metric-item";
    div.innerHTML = `<span>${m.label}</span><strong>${m.value}</strong><small>${m.delta}</small>`;
    metricGrid.appendChild(div);
  });
}

function renderModules() {
  const moduleGrid = document.querySelector("#moduleGrid");
  modules.forEach((m) => {
    const div = document.createElement("div");
    div.className = "module-item";
    div.innerHTML = `<h3>${m.name}</h3><p>${m.desc}</p>`;
    moduleGrid.appendChild(div);
  });
}

function renderAgents() {
  const agentList = document.querySelector("#agentList");
  agents.forEach((a) => {
    const div = document.createElement("div");
    div.className = "agent-item";
    div.innerHTML = `
      <h4>${a.name}</h4>
      <small>${a.role}</small>
      <div class="agent-tags">${a.tags.map((t) => `<span>${t}</span>`).join("")}</div>
      <small>SLA: ${a.sla}</small>
    `;
    agentList.appendChild(div);
  });
}

function inferAgent(taskText) {
  const text = taskText.trim();
  if (!text) return null;

  const mapping = [
    { keywords: ["税", "发票", "申报", "合规"], agent: "财税合规 Agent" },
    { keywords: ["销售", "报价", "客户", "回款"], agent: "销售增长 Agent" },
    { keywords: ["采购", "缺料", "库存", "供应商"], agent: "采购优化 Agent" },
    { keywords: ["排产", "工单", "生产", "班组"], agent: "生产排产 Agent" }
  ];

  for (const item of mapping) {
    if (item.keywords.some((k) => text.includes(k))) {
      return item.agent;
    }
  }

  return "客服体验 Agent";
}

function appendTimeline(title, desc) {
  const timeline = document.querySelector("#timeline");
  const template = document.querySelector("#timelineItemTemplate");
  const node = template.content.cloneNode(true);
  node.querySelector("strong").textContent = title;
  node.querySelector("p").textContent = desc;
  node.querySelector("small").textContent = new Date().toLocaleString("zh-CN", { hour12: false });
  timeline.prepend(node);
}

function bindEvents() {
  document.querySelector("#syncBtn").addEventListener("click", () => {
    appendTimeline("系统事件", "已触发与 ERPNext 数据同步（演示模式）");
  });

  document.querySelector("#assignBtn").addEventListener("click", () => {
    const input = document.querySelector("#taskInput");
    const task = input.value;
    const selected = inferAgent(task);

    if (!selected) {
      appendTimeline("分派失败", "请先输入任务描述。");
      return;
    }

    appendTimeline(
      "任务分派完成",
      `任务已分派给 ${selected}：${task.slice(0, 40)}${task.length > 40 ? "..." : ""}`
    );
  });
}

renderMetrics();
renderModules();
renderAgents();
bindEvents();
