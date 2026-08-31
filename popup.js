const I18N = {
  en: {
    subtitle: "Local test data · Nothing is uploaded",
    settings: "Settings",
    lead: "Right-click anywhere on a page and choose 0xFill to insert test data or fill the current form in one click.",
    point1: "One Click Fill completes visible fields and skips passwords, codes, and card numbers.",
    point2: "Random Email, text, and phone numbers go into the field you are using.",
    point3: "Customize email, cards, and menus in Settings.",
    openSettings: "Open settings"
  },
  zh: {
    subtitle: "本地生成测试数据 · 不上传",
    settings: "设置",
    lead: "在页面任意位置右键，选择 0xFill，即可插入测试数据或一键填充当前表单。",
    point1: "One Click Fill 会填写可见字段，并跳过密码、验证码和卡号。",
    point2: "随机邮箱、文案和测试号码会填入当前正在使用的输入框。",
    point3: "可在设置里自定义邮箱、卡信息和菜单。",
    openSettings: "设置"
  }
};

const THEME_MODES = ["light", "dark", "system"];
const systemThemeMql = window.matchMedia("(prefers-color-scheme: dark)");

let currentLang = "en";

init();

function t(key) {
  const table = I18N[currentLang] || I18N.en;
  return table[key] ?? I18N.en[key] ?? key;
}

function detectBrowserLanguage() {
  let raw = "";
  try {
    raw = chrome.i18n.getUILanguage();
  } catch (_e) {}
  if (!raw) {
    raw = (navigator.languages && navigator.languages[0]) || navigator.language || "";
  }
  const lang = String(raw).toLowerCase().replace(/_/g, "-");
  return lang === "zh" || lang.startsWith("zh-") ? "zh" : "en";
}

function resolveUiLanguage(stored) {
  return stored === "zh" || stored === "en" ? stored : detectBrowserLanguage();
}

function resolvedTheme(mode) {
  if (mode === "light" || mode === "dark") return mode;
  return systemThemeMql.matches ? "dark" : "light";
}

function applyTheme(mode) {
  const next = THEME_MODES.includes(mode) ? mode : "light";
  document.documentElement.dataset.theme = resolvedTheme(next);
  document.documentElement.dataset.themeMode = next;
}

function applyStaticI18n() {
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });
}

async function init() {
  const stored = await chrome.storage.sync.get({ uiLanguage: null, uiTheme: "light" });
  currentLang = resolveUiLanguage(stored.uiLanguage);
  applyTheme(stored.uiTheme);
  applyStaticI18n();

  document.getElementById("openSettings").addEventListener("click", openSettings);
  document.getElementById("openSettingsFooter").addEventListener("click", openSettings);
}

function openSettings() {
  chrome.runtime.openOptionsPage();
}
