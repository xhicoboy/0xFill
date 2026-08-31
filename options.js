const DEFAULT_SETTINGS = {
  emailPrefix: "0x_",
  emailDomain: "text.com",
  customSnippets: [],
  cardKit: {
    firstName: "Alex",
    lastName: "Tester",
    fullName: "Alex Tester",
    cardNumber: "4242424242424242",
    cardExp: "12/30",
    cardCvv: "123"
  },
  extraCardKits: [],
  extraCardGroupTitle: ""
};

const I18N = {
  en: {
    pageTitle: "0xFill Settings",
    badge: "Settings",
    subtitle: "Test data generated locally · Nothing is uploaded",
    languageLabel: "Language",
    themeLabel: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    emailTitle: "Random Email",
    emailHint: "Used by “Random Email”. Prefix + 6 random characters + @domain",
    prefix: "Prefix",
    domain: "Domain",
    cardKitTitle: "Card Fill Form",
    cardKitHint: "Values for the “Card Fill Form” menu item. Empty fields fall back to built-in defaults. Fills billing name and test card fields in the page or nested iframe. One Click Fill still skips card numbers.",
    cardFirstName: "First name",
    cardLastName: "Last name",
    cardFullName: "Cardholder name",
    cardNumber: "Card number",
    cardExp: "Expiry (MM/YY)",
    cardCvv: "CVV",
    addCard: "Add card",
    cardMenuName: "Menu name",
    cardMenuNamePlaceholder: "e.g. Visa test card",
    extraCardHint: "This name appears next to “Card Fill Form”. Extra cards are nested under it.",
    extraCardGroupName: "Group name",
    extraCardGroupPlaceholder: "e.g. Test cards",
    extraCardGroupDefault: "Test cards",
    extraCardNeedName: "Enter a menu name to show this card in the context menu.",
    needCardGroupName: "Enter a group name for extra cards.",
    snippetsTitle: "Custom menus",
    snippetsHint: "Add a parent menu and one item per line. Expand a group to edit it, or add a submenu for a third level.",
    parentMenuName: "Parent menu name",
    parentMenuPlaceholder: "e.g. Test accounts",
    childItemsLabel: "Child items (one per line)",
    childItemsPlaceholder: "alice@test.com\nbob@test.com",
    submenus: "Submenus",
    add: "Add",
    addChildItem: "Add child item",
    addNestedItem: "Add nested item",
    emptySnippets: "No custom menus yet",
    howToUse: "How to use",
    howToUseHint: "Fill data from the context menu without leaving the page.",
    tip1: "Right-click anywhere on a page and select “0xFill - Quick Fill.”",
    tip2: "“One Click Fill” finds the form near where you right-clicked, checks visible checkboxes, and skips passwords, verification codes, and card numbers.",
    tip3: "Email addresses and phone numbers replace the entire field by default; selected text is replaced instead.",
    tip4: "Random text is inserted at the cursor without clearing the field.",
    tip5: "Custom menus start as a parent with one item per line. Expand a group to edit it or add a submenu.",
    tip6: "Click the extension icon for the popup. Open Settings from there anytime.",
    footerNote: "Changes sync to the context menu immediately.",
    childItems: "Child items",
    cancel: "Cancel",
    delete: "Delete",
    noChildItems: "No child items yet",
    noNestedItems: "No nested items yet",
    leafPlaceholder: "One item per line, e.g. alice@test.com",
    submenuNamePlaceholder: "Submenu name, e.g. Admin",
    nestedItemsPlaceholder: "Nested items, one per line",
    addNestedPlaceholder: "Add nested items, one per line",
    addSubmenu: "Add submenu",
    untitledParen: "(Untitled)",
    untitledSubmenu: "Untitled submenu",
    needChildItem: "Enter at least one child item",
    needParentName: "Enter a parent menu name",
    needSubmenuComplete: "Enter a submenu name and at least one nested item",
    needNestedItem: "Enter at least one nested item",
    statusDeleted: "Deleted. Context menu updated",
    statusAdded: "Added. Context menu updated",
    statusAddedTo: "Added to “{title}”, Context menu updated",
    statusSaving: "Saving…",
    statusSaved: "Saved. Context menu updated",
    statusCopied: "Card number copied",
    previewPrefix: "Preview: "
  },
  zh: {
    pageTitle: "0xFill 设置",
    badge: "设置",
    subtitle: "本地生成测试数据 · 不上传任何内容",
    languageLabel: "语言",
    themeLabel: "风格",
    themeLight: "浅色",
    themeDark: "深色",
    themeSystem: "跟随系统",
    emailTitle: "Random Email",
    emailHint: "对应右键菜单 “Random Email”，前缀 + 6 位随机字符 + @域名。",
    prefix: "前缀",
    domain: "域名",
    cardKitTitle: "Card Fill Form",
    cardKitHint: "对应右键菜单 “Card Fill Form”，留空则回到内置默认值，会填写页面或嵌套 iframe 里的账单姓名和测试卡信息，One Click Fill 仍会跳过卡号。",
    cardFirstName: "名",
    cardLastName: "姓",
    cardFullName: "持卡人姓名",
    cardNumber: "卡号",
    cardExp: "有效期（MM/YY）",
    cardCvv: "CVV",
    addCard: "新增卡",
    cardMenuName: "菜单名称",
    cardMenuNamePlaceholder: "例如：Visa 测试卡",
    extraCardHint: "这个名称和 “Card Fill Form” 平级，额外的卡都放在它下面，点开后再选卡填充。",
    extraCardGroupName: "分组名称",
    extraCardGroupPlaceholder: "例如：测试卡",
    extraCardGroupDefault: "测试卡",
    extraCardNeedName: "填写菜单名称后，才会出现在右键菜单里。",
    needCardGroupName: "请填写额外卡的分组名称。",
    snippetsTitle: "自定义菜单",
    snippetsHint: "先写父菜单名，再每行一条；点开一组可编辑，或添加子菜单作为第三层。",
    parentMenuName: "父菜单名",
    parentMenuPlaceholder: "例如：测试账号",
    childItemsLabel: "子选项（每行一条）",
    childItemsPlaceholder: "alice@test.com\nbob@test.com",
    submenus: "子菜单",
    add: "添加",
    addChildItem: "添加子选项",
    addNestedItem: "添加嵌套项",
    emptySnippets: "暂无自定义菜单",
    howToUse: "使用说明",
    howToUseHint: "通过右键菜单即可填充，无需离开当前页面。",
    tip1: "在页面任意位置右键，选择 “0xFill - Quick Fill”。",
    tip2: "“One Click Fill” 会按右键位置定位表单，勾选可见复选框，并跳过密码、验证码和卡号。",
    tip3: "邮箱和电话号码默认覆盖整个输入框；如已选中文字，则只替换选区。",
    tip4: "随机文案会插入到光标处，不会清空整个输入框。",
    tip5: "自定义菜单默认是父菜单 + 每行一条，展开后可编辑，或添加子菜单。",
    tip6: "点击扩展图标打开快捷弹窗，再从弹窗进入本设置页。",
    footerNote: "更改会立即同步到右键菜单。",
    childItems: "子选项",
    cancel: "取消",
    delete: "删除",
    noChildItems: "暂无子选项",
    noNestedItems: "暂无嵌套项",
    leafPlaceholder: "每行一条，例如 alice@test.com",
    submenuNamePlaceholder: "子菜单名，例如：管理员",
    nestedItemsPlaceholder: "嵌套项，每行一条",
    addNestedPlaceholder: "添加嵌套项，每行一条",
    addSubmenu: "添加子菜单",
    untitledParen: "(未命名)",
    untitledSubmenu: "未命名子菜单",
    needChildItem: "请至少填写一条子选项",
    needParentName: "请填写父菜单名",
    needSubmenuComplete: "请填写子菜单名称，并至少添加一条嵌套项",
    needNestedItem: "请至少填写一条嵌套项",
    statusDeleted: "已删除，右键菜单已更新",
    statusAdded: "已添加，右键菜单已更新",
    statusAddedTo: "已添加到 “{title}”，右键菜单已更新",
    statusSaving: "保存中…",
    statusSaved: "已保存，右键菜单已更新",
    statusCopied: "卡号已复制",
    previewPrefix: "预览："
  }
};

const emailPrefixInput = document.getElementById("emailPrefix");
const emailDomainInput = document.getElementById("emailDomain");
const emailPreview = document.getElementById("emailPreview");
const snippetTitleInput = document.getElementById("snippetTitle");
const snippetValueInput = document.getElementById("snippetValue");
const addSnippetBtn = document.getElementById("addSnippetBtn");
const snippetList = document.getElementById("snippetList");
const emptySnippets = document.getElementById("emptySnippets");
const statusEl = document.getElementById("status");
const languageSelect = document.getElementById("language");
const cardFirstNameInput = document.getElementById("cardFirstName");
const cardLastNameInput = document.getElementById("cardLastName");
const cardFullNameInput = document.getElementById("cardFullName");
const cardNumberInput = document.getElementById("cardNumber");
const cardExpInput = document.getElementById("cardExp");
const cardCvvInput = document.getElementById("cardCvv");
const addCardKitBtn = document.getElementById("addCardKitBtn");
const extraCardList = document.getElementById("extraCardList");
const extraCardGroupTitleInput = document.getElementById("extraCardGroupTitle");
const extraCardGroupHint = document.getElementById("extraCardGroupHint");
const extraCardGroupError = document.getElementById("extraCardGroupError");
const howToUseToggle = document.getElementById("howToUseToggle");
const howToUseBody = document.getElementById("howToUseBody");

let currentLang = "en";
let snippets = [];
let expandedGroupId = null;
let groupAddMode = null;
let submenuAddId = null;
let lastCardExpValue = "";
let cardholderManual = false;
let extraCardKits = [];
const extraCardholderManual = new Map();
let expandedExtraCardId = null;
let persistDirty = false;
let persistChain = Promise.resolve();
const THEME_MODES = ["light", "dark", "system"];
let currentThemeMode = "light";
const systemThemeMql = window.matchMedia("(prefers-color-scheme: dark)");

init();

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

function t(key) {
  const table = I18N[currentLang] || I18N.en;
  return table[key] ?? I18N.en[key] ?? key;
}

function applyStaticI18n() {
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  document.title = t("pageTitle");
  languageSelect.value = currentLang;
  languageSelect.setAttribute("aria-label", t("languageLabel"));
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
}

function resolvedTheme(mode) {
  if (mode === "light" || mode === "dark") return mode;
  return systemThemeMql.matches ? "dark" : "light";
}

function applyTheme(mode) {
  currentThemeMode = THEME_MODES.includes(mode) ? mode : "light";
  const theme = resolvedTheme(currentThemeMode);
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.themeMode = currentThemeMode;
  try {
    localStorage.setItem("oxfill-theme", currentThemeMode);
  } catch (_e) {}
  document.querySelectorAll("[data-theme-choice]").forEach((btn) => {
    const active = btn.dataset.themeChoice === currentThemeMode;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function bindThemeSwitch() {
  document.querySelectorAll("[data-theme-choice]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      applyTheme(btn.dataset.themeChoice);
      await chrome.storage.sync.set({ uiTheme: currentThemeMode });
    });
  });
  const onSystemChange = () => {
    if (currentThemeMode === "system") applyTheme("system");
  };
  if (systemThemeMql.addEventListener) {
    systemThemeMql.addEventListener("change", onSystemChange);
  } else if (systemThemeMql.addListener) {
    systemThemeMql.addListener(onSystemChange);
  }
}

function formatItemCount(count) {
  if (currentLang === "zh") return `${count} 项`;
  return count === 1 ? "1 item" : `${count} items`;
}

function formatSubmenuCount(count) {
  if (currentLang === "zh") return `${count} 个子菜单`;
  return count === 1 ? "1 submenu" : `${count} submenus`;
}

function composeName(first, last) {
  return `${String(first || "").trim()} ${String(last || "").trim()}`.replace(/\s+/g, " ").trim();
}

function extraCardComposedFullName(card) {
  const defaults = readCardKitFromInputs();
  const first = String(card.firstName || "").trim();
  const last = String(card.lastName || "").trim();
  if (!first && !last) return "";
  return composeName(first || defaults.firstName, last || defaults.lastName);
}

function composeCardholder() {
  return composeName(cardFirstNameInput.value, cardLastNameInput.value);
}

function onNamePartInput(event) {
  event.target.value = sanitizePersonName(event.target.value, 64);
  if (!cardholderManual) {
    cardFullNameInput.value = composeCardholder();
  }
  schedulePersist();
}

function onFullNameInput() {
  cardFullNameInput.value = sanitizePersonName(cardFullNameInput.value, 96);
  cardholderManual = cardFullNameInput.value.trim() !== composeCardholder();
  schedulePersist();
}

async function init() {
  const stored = await chrome.storage.sync.get({
    ...DEFAULT_SETTINGS,
    uiLanguage: null,
    uiTheme: "light"
  });
  currentLang = resolveUiLanguage(stored.uiLanguage);

  emailPrefixInput.value = sanitizeEmailPrefix(stored.emailPrefix) || DEFAULT_SETTINGS.emailPrefix;
  emailDomainInput.value = normalizeEmailDomain(stored.emailDomain);
  fillCardKitInputs(stored.cardKit);
  extraCardKits = parseExtraCardKits(stored.extraCardKits);
  extraCardGroupTitleInput.value = String(stored.extraCardGroupTitle || "");
  snippets = normalizeSnippets(stored.customSnippets);
  applyTheme(THEME_MODES.includes(stored.uiTheme) ? stored.uiTheme : "light");

  applyStaticI18n();
  renderPreview();
  renderSnippets();
  renderExtraCards();
  if (syncAutoGroupTitle()) persistNow();

  emailPrefixInput.addEventListener("input", () => {
    emailPrefixInput.value = sanitizeEmailPrefix(emailPrefixInput.value);
    renderPreview();
    schedulePersist();
  });
  emailDomainInput.addEventListener("input", () => {
    emailDomainInput.value = sanitizeEmailDomainInput(emailDomainInput.value);
    renderPreview();
    schedulePersist();
  });
  emailDomainInput.addEventListener("blur", () => {
    const next = normalizeEmailDomain(emailDomainInput.value);
    if (emailDomainInput.value !== next) {
      emailDomainInput.value = next;
      renderPreview();
    }
  });
  cardFirstNameInput.addEventListener("input", onNamePartInput);
  cardLastNameInput.addEventListener("input", onNamePartInput);
  cardFullNameInput.addEventListener("input", onFullNameInput);
  cardExpInput.addEventListener("input", () => {
    applyCardExpFormat();
    schedulePersist();
  });
  cardNumberInput.addEventListener("input", () => {
    cardNumberInput.value = digitsOnly(cardNumberInput.value, 19);
    schedulePersist();
  });
  cardNumberInput.addEventListener("dblclick", () => {
    copyCardNumberFromInput(cardNumberInput);
  });
  cardCvvInput.addEventListener("input", schedulePersist);
  extraCardGroupTitleInput.addEventListener("input", () => {
    syncExtraCardGroupUi();
    schedulePersist();
  });
  addCardKitBtn.addEventListener("click", addExtraCard);
  addSnippetBtn.addEventListener("click", addParentMenu);
  howToUseToggle.addEventListener("click", () => {
    const open = howToUseToggle.getAttribute("aria-expanded") === "true";
    howToUseToggle.setAttribute("aria-expanded", open ? "false" : "true");
    howToUseBody.hidden = open;
  });
  bindThemeSwitch();
  languageSelect.addEventListener("change", async () => {
    currentLang = languageSelect.value === "zh" ? "zh" : "en";
    await chrome.storage.sync.set({ uiLanguage: currentLang });
    applyStaticI18n();
    const groupTitleChanged = syncAutoGroupTitle();
    renderPreview();
    renderSnippets();
    renderExtraCards();
    if (groupTitleChanged) persistNow();
  });
  bindPersistFlush();
}

function isEditingField(el = document.activeElement) {
  if (!el) return false;
  const tag = el.tagName;
  if (tag !== "INPUT" && tag !== "TEXTAREA") return false;
  const type = String(el.type || "text").toLowerCase();
  return type !== "button" && type !== "submit" && type !== "reset";
}

function schedulePersist() {
  persistDirty = true;
}

function persistNow(message) {
  persistDirty = false;
  return persistSettings(message);
}

function flushPersistWhenIdle() {
  if (!persistDirty || isEditingField()) return;
  persistNow();
}

function bindPersistFlush() {
  document.addEventListener("focusout", () => {
    window.setTimeout(flushPersistWhenIdle, 0);
  });
  window.addEventListener("pagehide", () => {
    if (persistDirty) persistNow();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && persistDirty) persistNow();
  });
}

function persistSettings(message) {
  persistChain = persistChain.then(() => writeSettings(message), () => writeSettings(message));
  return persistChain;
}

async function writeSettings(message) {
  setStatus(t("statusSaving"), { persist: true });
  await chrome.storage.sync.set({
    emailPrefix: sanitizeEmailPrefix(emailPrefixInput.value) || DEFAULT_SETTINGS.emailPrefix,
    emailDomain: normalizeEmailDomain(emailDomainInput.value),
    customSnippets: snippets,
    cardKit: readCardKitFromInputs(),
    extraCardKits: serializeExtraCards(),
    extraCardGroupTitle: extraCardGroupTitleInput.value.trim()
  });
  setStatus(message || t("statusSaved"));
}

function normalizeLeaves(raw, fallbackId) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((child) => child && child.value != null && String(child.value).trim())
    .map((child, index) => ({
      id: String(child.id || `${fallbackId}_${index}`),
      value: String(child.value)
    }));
}

function normalizeChild(child, fallbackId, index) {
  if (!child) return null;
  const id = String(child.id || `${fallbackId}_${index}`);

  if (child.type === "submenu" || (Array.isArray(child.items) && child.title)) {
    const items = normalizeLeaves(child.items, id);
    if (!items.length && !String(child.title || "").trim()) return null;
    return {
      type: "submenu",
      id,
      title: String(child.title || "Untitled submenu"),
      items
    };
  }

  if (child.value != null && String(child.value).trim()) {
    return { type: "leaf", id, value: String(child.value) };
  }

  return null;
}

function normalizeSnippets(raw) {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (!item || item.id == null) return null;
      const id = String(item.id);
      const title = String(item.title || "").trim();

      if (Array.isArray(item.children)) {
        const children = item.children
          .map((child, index) => normalizeChild(child, id, index))
          .filter(Boolean);
        return { id, title: title || "Untitled", children };
      }

      if (Array.isArray(item.items)) {
        const children = item.items
          .map((child, index) => normalizeChild(child, id, index))
          .filter(Boolean);
        if (!children.length && !title) return null;
        return { id, title: title || children[0]?.value || "Untitled", children };
      }

      if (item.value != null && String(item.value).trim()) {
        return {
          id,
          title: title || String(item.value),
          children: [{ type: "leaf", id: `${id}_0`, value: String(item.value) }]
        };
      }

      if (title) return { id, title, children: [] };
      return null;
    })
    .filter(Boolean);
}

function parseValues(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function createId(prefix = "") {
  return `${prefix}${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function countLeaves(group) {
  return (group.children || []).reduce((sum, child) => {
    if (child.type === "submenu") return sum + (child.items || []).length;
    return sum + 1;
  }, 0);
}

function countSubmenus(group) {
  return (group.children || []).filter((child) => child.type === "submenu").length;
}

function toggleGroup(id) {
  if (expandedGroupId === id) {
    expandedGroupId = null;
    groupAddMode = null;
    submenuAddId = null;
  } else {
    expandedGroupId = id;
    groupAddMode = null;
    submenuAddId = null;
  }
  renderSnippets();
}

function renderPreview() {
  const prefix = sanitizeEmailPrefix(emailPrefixInput.value) || DEFAULT_SETTINGS.emailPrefix;
  const domain = sanitizeEmailDomainInput(emailDomainInput.value) || DEFAULT_SETTINGS.emailDomain;
  emailPreview.textContent = `${t("previewPrefix")}${prefix}abc123@${domain}`;
}

function makeButton(className, text, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = className;
  btn.textContent = text;
  btn.addEventListener("click", onClick);
  return btn;
}

function renderSnippets() {
  snippetList.innerHTML = "";
  emptySnippets.hidden = snippets.length > 0;
  if (expandedGroupId && !snippets.some((group) => group.id === expandedGroupId)) {
    expandedGroupId = null;
  }

  for (const group of snippets) {
    const isOpen = expandedGroupId === group.id;
    const li = document.createElement("li");
    li.className = `snippet-group${isOpen ? " is-open" : ""}`;

    const row = document.createElement("div");
    row.className = "snippet-row";
    row.addEventListener("click", (event) => {
      if (event.target.closest("input, textarea, button")) return;
      toggleGroup(group.id);
    });

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "snippet-toggle";
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggleBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleGroup(group.id);
    });

    const chevron = document.createElement("span");
    chevron.className = "snippet-chevron";
    chevron.setAttribute("aria-hidden", "true");
    toggleBtn.appendChild(chevron);

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.className = "snippet-title-input";
    titleInput.maxLength = 64;
    titleInput.value = group.title || "";
    titleInput.placeholder = t("untitledParen");
    titleInput.addEventListener("click", (event) => event.stopPropagation());
    titleInput.addEventListener("input", () => {
      group.title = titleInput.value;
      schedulePersist();
    });

    const meta = document.createElement("span");
    meta.className = "snippet-meta";
    const submenuCount = countSubmenus(group);
    const itemLabel = formatItemCount(countLeaves(group));
    meta.textContent =
      submenuCount > 0
        ? `${itemLabel} · ${formatSubmenuCount(submenuCount)}`
        : itemLabel;

    const removeBtn = makeButton("btn danger snippet-delete", t("delete"), (event) => {
      event.stopPropagation();
      snippets = snippets.filter((s) => s.id !== group.id);
      if (expandedGroupId === group.id) expandedGroupId = null;
      renderSnippets();
      persistNow(t("statusDeleted"));
    });

    row.append(toggleBtn, titleInput, meta, removeBtn);
    li.appendChild(row);

    const body = document.createElement("div");
    body.className = "snippet-body";
    if (!isOpen) body.hidden = true;

    const leaves = group.children.filter((child) => child.type !== "submenu");
    const submenus = group.children.filter((child) => child.type === "submenu");
    body.appendChild(renderLeafSection(group, leaves));
    body.appendChild(renderSubmenuSection(group, submenus));
    li.appendChild(body);
    snippetList.appendChild(li);
  }
}

function renderLeafSection(group, leaves) {
  const section = document.createElement("section");
  section.className = "snippet-section";

  const head = document.createElement("div");
  head.className = "snippet-section-head";
  const label = document.createElement("h4");
  label.textContent = t("childItems");
  head.appendChild(label);
  head.appendChild(
    makeButton("btn ghost", groupAddMode === "leaf" ? t("cancel") : t("addChildItem"), () => {
      groupAddMode = groupAddMode === "leaf" ? null : "leaf";
      renderSnippets();
    })
  );
  section.appendChild(head);

  if (!leaves.length) {
    const empty = document.createElement("p");
    empty.className = "snippet-empty";
    empty.textContent = t("noChildItems");
    section.appendChild(empty);
  } else {
    const list = document.createElement("ul");
    list.className = "snippet-items";
    for (const child of leaves) {
      list.appendChild(
        renderValueRow(child, (value) => {
          child.value = value;
          schedulePersist();
        }, () => {
          group.children = group.children.filter((item) => item.id !== child.id);
          renderSnippets();
          persistNow(t("statusDeleted"));
        })
      );
    }
    section.appendChild(list);
  }

  if (groupAddMode === "leaf") {
    section.appendChild(
      renderInlineForm({
        placeholder: t("leafPlaceholder"),
        confirmText: t("addChildItem"),
        onSubmit: (text) => {
          const values = parseValues(text);
          if (!values.length) {
            setStatus(t("needChildItem"));
            return false;
          }
          for (const value of values) {
            group.children.push({ type: "leaf", id: createId("i_"), value });
          }
          groupAddMode = null;
          persistNow(t("statusAdded"));
          return true;
        }
      })
    );
  }

  return section;
}

function renderSubmenuSection(group, submenus) {
  const section = document.createElement("section");
  section.className = "snippet-section";

  const head = document.createElement("div");
  head.className = "snippet-section-head";
  const label = document.createElement("h4");
  label.textContent = t("submenus");
  head.appendChild(label);
  head.appendChild(
    makeButton("btn ghost", groupAddMode === "submenu" ? t("cancel") : t("addSubmenu"), () => {
      groupAddMode = groupAddMode === "submenu" ? null : "submenu";
      renderSnippets();
    })
  );
  section.appendChild(head);

  if (submenus.length) {
    const list = document.createElement("div");
    list.className = "snippet-submenu-list";
    for (const submenu of submenus) {
      list.appendChild(renderSubmenu(group, submenu));
    }
    section.appendChild(list);
  }

  if (groupAddMode === "submenu") {
    section.appendChild(renderSubmenuCreateForm(group));
  }

  return section;
}

function renderValueRow(item, onChange, onRemove) {
  const row = document.createElement("li");
  const input = document.createElement("input");
  input.type = "text";
  input.className = "snippet-value-input";
  input.value = item.value || "";
  input.addEventListener("input", () => onChange(input.value));
  row.append(input, makeButton("btn danger", t("delete"), onRemove));
  return row;
}

function renderInlineForm({ placeholder, confirmText, onSubmit }) {
  const form = document.createElement("div");
  form.className = "inline-form";
  const textarea = document.createElement("textarea");
  textarea.rows = 3;
  textarea.placeholder = placeholder;
  const actions = document.createElement("div");
  actions.className = "inline-form-actions";
  actions.appendChild(
    makeButton("btn primary", confirmText, () => {
      if (onSubmit(textarea.value)) renderSnippets();
    })
  );
  form.appendChild(textarea);
  form.appendChild(actions);
  return form;
}

function renderSubmenuCreateForm(group) {
  const form = document.createElement("div");
  form.className = "inline-form";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.maxLength = 64;
  titleInput.placeholder = t("submenuNamePlaceholder");
  const textarea = document.createElement("textarea");
  textarea.rows = 3;
  textarea.placeholder = t("nestedItemsPlaceholder");
  const actions = document.createElement("div");
  actions.className = "inline-form-actions";
  actions.appendChild(
    makeButton("btn primary", t("addSubmenu"), () => {
      const title = titleInput.value.trim();
      const values = parseValues(textarea.value);
      if (!title || !values.length) {
        setStatus(t("needSubmenuComplete"));
        return;
      }
      group.children.push({
        type: "submenu",
        id: createId("s_"),
        title,
        items: values.map((value) => ({ id: createId("i_"), value }))
      });
      groupAddMode = null;
      renderSnippets();
      persistNow(t("statusAdded"));
    })
  );
  form.appendChild(titleInput);
  form.appendChild(textarea);
  form.appendChild(actions);
  return form;
}

function renderSubmenu(group, submenu) {
  const wrap = document.createElement("article");
  wrap.className = "snippet-sub";

  const header = document.createElement("div");
  header.className = "snippet-subhead";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.className = "snippet-title-input";
  titleInput.maxLength = 64;
  titleInput.value = submenu.title || "";
  titleInput.placeholder = t("untitledSubmenu");
  titleInput.addEventListener("input", () => {
    submenu.title = titleInput.value;
    schedulePersist();
  });
  header.appendChild(titleInput);
  header.appendChild(
    makeButton("btn ghost", submenuAddId === submenu.id ? t("cancel") : t("addNestedItem"), () => {
      submenuAddId = submenuAddId === submenu.id ? null : submenu.id;
      renderSnippets();
    })
  );
  header.appendChild(
    makeButton("btn danger", t("delete"), () => {
      group.children = group.children.filter((item) => item.id !== submenu.id);
      if (submenuAddId === submenu.id) submenuAddId = null;
      renderSnippets();
      persistNow(t("statusDeleted"));
    })
  );
  wrap.appendChild(header);

  if (!submenu.items.length) {
    const empty = document.createElement("p");
    empty.className = "snippet-empty";
    empty.textContent = t("noNestedItems");
    wrap.appendChild(empty);
  } else {
    const grandList = document.createElement("ul");
    grandList.className = "snippet-items";
    for (const item of submenu.items) {
      grandList.appendChild(
        renderValueRow(item, (value) => {
          item.value = value;
          schedulePersist();
        }, () => {
          submenu.items = submenu.items.filter((leaf) => leaf.id !== item.id);
          renderSnippets();
          persistNow(t("statusDeleted"));
        })
      );
    }
    wrap.appendChild(grandList);
  }

  if (submenuAddId === submenu.id) {
    wrap.appendChild(
      renderInlineForm({
        placeholder: t("addNestedPlaceholder"),
        confirmText: t("addNestedItem"),
        onSubmit: (text) => {
          const values = parseValues(text);
          if (!values.length) {
            setStatus(t("needNestedItem"));
            return false;
          }
          for (const value of values) {
            submenu.items.push({ id: createId("i_"), value });
          }
          submenuAddId = null;
          persistNow(t("statusAdded"));
          return true;
        }
      })
    );
  }

  return wrap;
}

function resetComposer() {
  snippetTitleInput.value = "";
  snippetValueInput.value = "";
}

function addParentMenu() {
  const title = snippetTitleInput.value.trim();
  const values = parseValues(snippetValueInput.value);

  if (!title) {
    setStatus(t("needParentName"));
    return;
  }

  if (!values.length) {
    setStatus(t("needChildItem"));
    return;
  }

  const children = values.map((value) => ({ type: "leaf", id: createId("i_"), value }));
  const existing = snippets.find((group) => group.title === title);
  let message = t("statusAdded");

  if (existing) {
    existing.children.push(...children);
    expandedGroupId = existing.id;
    message = t("statusAddedTo").replace("{title}", existing.title);
  } else {
    const group = {
      id: createId("g_"),
      title,
      children
    };
    snippets.push(group);
    expandedGroupId = group.id;
  }

  groupAddMode = null;
  submenuAddId = null;
  resetComposer();
  renderSnippets();
  persistNow(message);
}

function readCardKitFromInputs() {
  const defaults = DEFAULT_SETTINGS.cardKit;
  return {
    firstName: cardFirstNameInput.value.trim() || defaults.firstName,
    lastName: cardLastNameInput.value.trim() || defaults.lastName,
    fullName: cardFullNameInput.value.trim() || defaults.fullName,
    cardNumber: cardNumberInput.value.trim() || defaults.cardNumber,
    cardExp: cardExpInput.value.trim() || defaults.cardExp,
    cardCvv: cardCvvInput.value.trim() || defaults.cardCvv
  };
}

function addExtraCard() {
  const card = {
    id: createId("c_"),
    title: "",
    firstName: "",
    lastName: "",
    fullName: "",
    cardNumber: "",
    cardExp: "",
    cardCvv: ""
  };
  extraCardKits.push(card);
  expandedExtraCardId = card.id;
  syncAutoGroupTitle();
  renderExtraCards();
  persistNow(t("statusAdded"));
  const nameInput = extraCardList.querySelector(".extra-card-item.is-open .extra-card-name");
  if (nameInput) nameInput.focus();
}

function parseExtraCardKits(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || item.id == null) return null;
      return {
        id: String(item.id),
        title: String(item.title || "").slice(0, 64),
        firstName: sanitizePersonName(item.firstName, 64),
        lastName: sanitizePersonName(item.lastName, 64),
        fullName: sanitizePersonName(item.fullName, 96),
        cardNumber: String(item.cardNumber || ""),
        cardExp: String(item.cardExp || ""),
        cardCvv: String(item.cardCvv || "")
      };
    })
    .filter(Boolean);
}

function serializeExtraCards() {
  return extraCardKits.map((item) => ({
    id: String(item.id),
    title: String(item.title || "").trim().slice(0, 64),
    firstName: sanitizePersonName(item.firstName, 64).trim(),
    lastName: sanitizePersonName(item.lastName, 64).trim(),
    fullName: sanitizePersonName(item.fullName, 96).trim(),
    cardNumber: String(item.cardNumber || "").trim(),
    cardExp: String(item.cardExp || "").trim(),
    cardCvv: String(item.cardCvv || "").trim()
  }));
}

function extraCardGroupDefaults() {
  return [...new Set(
    Object.values(I18N)
      .map((table) => table.extraCardGroupDefault)
      .filter(Boolean)
  )];
}

function isAutoGroupTitle(value) {
  const title = String(value || "").trim();
  return !title || extraCardGroupDefaults().includes(title);
}

function syncAutoGroupTitle() {
  if (extraCardKits.length === 0) return false;
  if (!isAutoGroupTitle(extraCardGroupTitleInput.value)) return false;
  const next = t("extraCardGroupDefault");
  if (extraCardGroupTitleInput.value.trim() === next) return false;
  extraCardGroupTitleInput.value = next;
  return true;
}

function defaultCardPlaceholders() {
  const kit = readCardKitFromInputs();
  return {
    firstName: kit.firstName,
    lastName: kit.lastName,
    fullName: kit.fullName,
    cardNumber: kit.cardNumber,
    cardExp: kit.cardExp,
    cardCvv: kit.cardCvv
  };
}

function extraCardLast4Label(cardNumber) {
  const tail = cardNumberTail(cardNumber) || cardNumberTail(readCardKitFromInputs().cardNumber);
  return tail ? `•••• ${tail}` : "";
}

function cardNumberTail(value) {
  const digits = digitsOnly(value, 19);
  if (digits.length >= 4) return digits.slice(-4);
  return "";
}

function syncExtraCardGroupUi() {
  const wrap = extraCardGroupTitleInput.closest(".extra-card-group");
  wrap.hidden = extraCardKits.length === 0;
  const missing = extraCardKits.length > 0 && !extraCardGroupTitleInput.value.trim();
  extraCardGroupError.hidden = !missing;
  extraCardGroupHint.hidden = missing;
  extraCardGroupError.textContent = missing ? t("needCardGroupName") : "";
}

function renderExtraCards() {
  extraCardList.innerHTML = "";
  extraCardKits.forEach((card, index) => {
    extraCardList.appendChild(renderExtraCardItem(card, index));
  });
  syncExtraCardGroupUi();
}

function applyExtraCardExpanded() {
  extraCardList.querySelectorAll(".extra-card-item").forEach((el) => {
    const open = el.dataset.cardId === expandedExtraCardId;
    el.classList.toggle("is-open", open);
    const btn = el.querySelector(".extra-card-toggle");
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function toggleExtraCard(id) {
  expandedExtraCardId = expandedExtraCardId === id ? null : id;
  applyExtraCardExpanded();
}

function expandExtraCard(id) {
  if (expandedExtraCardId === id) return;
  expandedExtraCardId = id;
  applyExtraCardExpanded();
}

function renderExtraCardItem(card, index) {
  const isOpen = expandedExtraCardId === card.id;
  const titled = Boolean(String(card.title || "").trim());
  const li = document.createElement("li");
  li.className = `extra-card-item${isOpen ? " is-open" : ""}`;
  li.dataset.cardId = card.id;
  if (!extraCardholderManual.has(card.id)) {
    extraCardholderManual.set(
      card.id,
      String(card.fullName || "").trim() !== extraCardComposedFullName(card)
    );
  }
  const placeholders = defaultCardPlaceholders();

  const summary = document.createElement("div");
  summary.className = "extra-card-summary";
  summary.addEventListener("click", (event) => {
    if (event.target.closest("input, button")) return;
    toggleExtraCard(card.id);
  });

  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "extra-card-toggle";
  toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  toggleBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleExtraCard(card.id);
  });
  const chevron = document.createElement("span");
  chevron.className = "snippet-chevron";
  chevron.setAttribute("aria-hidden", "true");
  toggleBtn.appendChild(chevron);

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "extra-card-name";
  nameInput.maxLength = 64;
  nameInput.autocomplete = "off";
  nameInput.placeholder = t("cardMenuNamePlaceholder");
  nameInput.value = card.title || "";
  nameInput.addEventListener("click", (event) => event.stopPropagation());
  nameInput.addEventListener("focus", () => expandExtraCard(card.id));
  nameInput.addEventListener("input", () => {
    extraCardKits[index].title = nameInput.value;
    const hint = li.querySelector(".extra-card-need-name");
    if (hint) hint.hidden = Boolean(nameInput.value.trim());
    schedulePersist();
  });

  const last4 = document.createElement("span");
  last4.className = "extra-card-last4";
  last4.textContent = extraCardLast4Label(card.cardNumber);

  const removeBtn = makeButton("btn danger", t("delete"), (event) => {
    event.stopPropagation();
    extraCardKits = extraCardKits.filter((item) => item.id !== card.id);
    extraCardholderManual.delete(card.id);
    if (expandedExtraCardId === card.id) expandedExtraCardId = null;
    renderExtraCards();
    persistNow(t("statusDeleted"));
  });

  summary.append(toggleBtn, nameInput, last4, removeBtn);
  li.appendChild(summary);

  const needName = document.createElement("p");
  needName.className = "extra-card-need-name";
  needName.textContent = t("extraCardNeedName");
  needName.hidden = titled;
  li.appendChild(needName);

  const body = document.createElement("div");
  body.className = "extra-card-body";
  const inner = document.createElement("div");
  inner.className = "extra-card-body-inner";
  const fields = document.createElement("div");
  fields.className = "extra-card-fields";
  fields.append(
    makeExtraCardField(index, "cardNumber", t("cardNumber"), placeholders.cardNumber, 19, last4),
    makeExtraCardExpField(index, placeholders.cardExp),
    makeExtraCardField(index, "cardCvv", t("cardCvv"), placeholders.cardCvv, 4),
    makeExtraCardField(index, "firstName", t("cardFirstName"), placeholders.firstName, 64),
    makeExtraCardField(index, "lastName", t("cardLastName"), placeholders.lastName, 64),
    makeExtraCardField(index, "fullName", t("cardFullName"), placeholders.fullName, 96)
  );
  inner.appendChild(fields);
  body.appendChild(inner);
  li.appendChild(body);
  return li;
}

function syncExtraCardholder(index, changedKey, root) {
  const card = extraCardKits[index];
  if (!card) return;
  const composed = extraCardComposedFullName(card);
  if (changedKey === "fullName") {
    extraCardholderManual.set(card.id, String(card.fullName || "").trim() !== composed);
    return;
  }
  if (extraCardholderManual.get(card.id)) return;
  card.fullName = composed;
  const fullInput = root && root.querySelector('[data-card-field="fullName"]');
  if (fullInput) fullInput.value = composed;
}

function makeExtraCardField(index, key, labelText, placeholder, maxLength, last4El) {
  const field = document.createElement("div");
  field.className = "field";
  const label = document.createElement("label");
  label.textContent = labelText;
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = maxLength;
  input.autocomplete = "off";
  input.placeholder = placeholder;
  input.dataset.cardField = key;
  input.value = extraCardKits[index][key] || "";
  if (key === "firstName" || key === "lastName" || key === "fullName") {
    input.value = sanitizePersonName(input.value, maxLength);
    extraCardKits[index][key] = input.value;
  }
  if (key === "cardNumber") {
    input.inputMode = "numeric";
    input.value = digitsOnly(input.value, maxLength);
    extraCardKits[index][key] = input.value;
    input.addEventListener("dblclick", () => {
      copyCardNumberFromInput(input);
    });
  }
  input.addEventListener("input", () => {
    if (key === "cardNumber") {
      input.value = digitsOnly(input.value, maxLength);
      if (last4El) last4El.textContent = extraCardLast4Label(input.value);
    }
    if (key === "firstName" || key === "lastName" || key === "fullName") {
      input.value = sanitizePersonName(input.value, maxLength);
    }
    extraCardKits[index][key] = input.value;
    if (key === "firstName" || key === "lastName" || key === "fullName") {
      syncExtraCardholder(index, key, field.closest(".extra-card-item"));
    }
    schedulePersist();
  });
  field.append(label, input);
  return field;
}

function makeExtraCardExpField(index, placeholder) {
  const field = document.createElement("div");
  field.className = "field";
  const label = document.createElement("label");
  label.textContent = t("cardExp");
  const input = document.createElement("input");
  input.type = "text";
  input.inputMode = "numeric";
  input.maxLength = 5;
  input.autocomplete = "off";
  input.placeholder = placeholder;
  input.dataset.expPrev = "";
  const formatted = formatCardExpInput(extraCardKits[index].cardExp || "", "");
  input.value = formatted;
  input.dataset.expPrev = formatted;
  extraCardKits[index].cardExp = formatted;
  input.addEventListener("input", () => {
    const next = formatCardExpInput(input.value, input.dataset.expPrev || "");
    input.value = next;
    input.dataset.expPrev = next;
    extraCardKits[index].cardExp = next;
    schedulePersist();
  });
  field.append(label, input);
  return field;
}

function fillCardKitInputs(raw) {
  const kit = { ...DEFAULT_SETTINGS.cardKit, ...(raw && typeof raw === "object" ? raw : {}) };
  cardFirstNameInput.value = sanitizePersonName(kit.firstName, 64) || DEFAULT_SETTINGS.cardKit.firstName;
  cardLastNameInput.value = sanitizePersonName(kit.lastName, 64) || DEFAULT_SETTINGS.cardKit.lastName;
  cardFullNameInput.value = sanitizePersonName(kit.fullName, 96) || DEFAULT_SETTINGS.cardKit.fullName;
  cardNumberInput.value = digitsOnly(kit.cardNumber || DEFAULT_SETTINGS.cardKit.cardNumber, 19);
  cardCvvInput.value = kit.cardCvv || DEFAULT_SETTINGS.cardKit.cardCvv;
  lastCardExpValue = "";
  cardExpInput.value = kit.cardExp || DEFAULT_SETTINGS.cardKit.cardExp;
  applyCardExpFormat();
  cardholderManual = cardFullNameInput.value.trim() !== composeCardholder();
}

function applyCardExpFormat() {
  const formatted = formatCardExpInput(cardExpInput.value, lastCardExpValue);
  cardExpInput.value = formatted;
  lastCardExpValue = formatted;
}

function sanitizeEmailPrefix(value) {
  return String(value || "")
    .replace(/[^a-zA-Z0-9._+-]/g, "")
    .slice(0, 4);
}

function sanitizeEmailDomainInput(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/^[^a-z0-9]+/, "")
    .slice(0, 64);
}

function normalizeEmailDomain(value) {
  const domain = sanitizeEmailDomainInput(value).replace(/\.+$/g, "");
  if (/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(domain)) {
    return domain;
  }
  return DEFAULT_SETTINGS.emailDomain;
}

function sanitizePersonName(value, maxLength) {
  const next = String(value || "")
    .replace(/\p{Script=Han}/gu, "")
    .replace(/\p{Nd}/gu, "");
  return typeof maxLength === "number" ? next.slice(0, maxLength) : next;
}

function digitsOnly(value, maxLength) {
  return String(value || "").replace(/\D/g, "").slice(0, maxLength);
}

function copyCardNumberFromInput(input) {
  const value = digitsOnly(input.value, 19) || digitsOnly(input.placeholder, 19);
  if (!value) return;
  input.select();
  const done = () => setStatus(t("statusCopied"));
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value).then(done).catch(() => {
      if (document.execCommand("copy")) done();
    });
    return;
  }
  if (document.execCommand("copy")) done();
}

function formatCardExpInput(raw, previous) {
  const current = String(raw || "");
  const prev = String(previous || "");
  let digits = current.replace(/\D/g, "").slice(0, 4);
  const prevDigits = prev.replace(/\D/g, "");
  const hadSlash = prev.includes("/");
  const hasSlash = current.includes("/");

  if (hadSlash && !hasSlash && digits.length === 2 && prevDigits.length >= 2) {
    digits = digits.slice(0, 1);
  }

  digits = normalizeCardMonthDigits(digits);

  if (digits.length <= 1) return digits;
  if (digits.length === 2) return `${digits}/`;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function normalizeCardMonthDigits(digits) {
  if (!digits) return "";

  const first = digits[0];
  if (first >= "2" && first <= "9") {
    return `0${digits}`.slice(0, 4);
  }

  if (first === "0") {
    if (digits.length === 1) return "0";
    if (digits[1] === "0") return "0";
    return digits.slice(0, 4);
  }

  if (digits.length === 1) return "1";
  if (digits[1] > "2") return "1";
  return digits.slice(0, 4);
}

function setStatus(text, { persist } = {}) {
  window.clearTimeout(setStatus._timer);
  if (!text) {
    statusEl.classList.remove("is-visible");
    statusEl.textContent = "";
    return;
  }
  statusEl.textContent = text;
  statusEl.classList.add("is-visible");
  if (persist) return;
  setStatus._timer = window.setTimeout(() => {
    statusEl.classList.remove("is-visible");
  }, 2500);
}
