const DEFAULT_SETTINGS = {
  emailPrefix: "0x_",
  emailDomain: "text.com",
  customSnippets: []
};

const I18N = {
  en: {
    pageTitle: "0xFill Settings",
    badge: "Settings",
    subtitle: "Test data generated locally · Nothing is uploaded",
    languageLabel: "Language",
    emailTitle: "Random email",
    emailHint: "Prefix + 6 random characters + @domain",
    prefix: "Prefix",
    domain: "Domain",
    snippetsTitle: "Custom snippets",
    snippetsHint: "Supports up to three levels. Select a group to expand and edit it.",
    parentMenuName: "Parent menu name",
    parentMenuPlaceholder: "e.g. Test accounts",
    childItemsOptional: "Child items (optional, one per line)",
    submenus: "Submenus",
    submenuComposerHint: "Add submenus now without saving the parent menu first.",
    addAnotherSubmenu: "Add another submenu",
    add: "Add",
    addChildItem: "Add child item",
    addNestedItem: "Add nested item",
    emptySnippets: "No custom snippets yet",
    howToUse: "How to use",
    howToUseHint: "Fill data from the context menu without leaving the page.",
    tip1: "Right-click anywhere on a page and select “0xFill - Quick Fill.”",
    tip2: "“One Click Fill” finds the form near where you right-clicked and skips passwords, verification codes, and card numbers.",
    tip3: "Email addresses and phone numbers replace the entire field by default; selected text is replaced instead.",
    tip4: "Random text is inserted at the cursor without clearing the field.",
    tip5: "Custom menus support up to three levels: parent menu → child item or submenu → nested item.",
    tip6: "Click the extension icon anytime to open this settings page.",
    footerNote: "Save your changes to sync them with the context menu.",
    saveSettings: "Save settings",
    childItems: "Child items",
    cancel: "Cancel",
    delete: "Delete",
    noChildItems: "No child items yet",
    noSubmenus: "No submenus yet",
    noNestedItems: "No nested items yet",
    leafPlaceholder: "One item per line, e.g. alice@test.com",
    submenuNamePlaceholder: "Submenu name, e.g. Admin",
    nestedItemsPlaceholder: "Nested items, one per line",
    addNestedPlaceholder: "Add nested items, one per line",
    addSubmenu: "Add submenu",
    untitled: "Untitled",
    untitledParen: "(Untitled)",
    untitledSubmenu: "Untitled submenu",
    needChildItem: "Enter at least one child item.",
    needParentName: "Enter a parent menu name.",
    needSubmenuComplete: "Enter a submenu name and at least one nested item.",
    needNestedItem: "Enter at least one nested item.",
    needChildOrSubmenu: "Add at least one child item or one complete submenu.",
    statusDeleted: "Deleted. Save changes to update the context menu.",
    statusAdded: "Added. Save changes to update the context menu.",
    statusSaved: "Settings saved. Context menu updated.",
    previewPrefix: "Preview: "
  },
  zh: {
    pageTitle: "0xFill 设置",
    badge: "设置",
    subtitle: "本地生成测试数据 · 不上传任何内容",
    languageLabel: "语言",
    emailTitle: "随机邮箱",
    emailHint: "前缀 + 6 位随机字符 + @域名",
    prefix: "前缀",
    domain: "域名",
    snippetsTitle: "自定义片段",
    snippetsHint: "最多三层。点击一组即可展开编辑。",
    parentMenuName: "父菜单名",
    parentMenuPlaceholder: "例如：测试账号",
    childItemsOptional: "子选项（可选，每行一条）",
    submenus: "子菜单",
    submenuComposerHint: "创建时即可一起添加，不必先保存父菜单。",
    addAnotherSubmenu: "再加一个子菜单",
    add: "添加",
    addChildItem: "添加子选项",
    addNestedItem: "添加嵌套项",
    emptySnippets: "暂无自定义片段",
    howToUse: "使用说明",
    howToUseHint: "通过右键菜单即可填充，无需离开当前页面。",
    tip1: "在页面任意位置右键，选择 “0xFill - Quick Fill”。",
    tip2: "“One Click Fill” 会按右键位置定位表单，并跳过密码、验证码和卡号。",
    tip3: "邮箱和电话号码默认覆盖整个输入框；如已选中文字，则只替换选区。",
    tip4: "随机文案会插入到光标处，不会清空整个输入框。",
    tip5: "自定义菜单最多三层：父菜单 → 子选项或子菜单 → 嵌套项。",
    tip6: "随时点击扩展图标即可打开本设置页。",
    footerNote: "保存后才会同步到右键菜单。",
    saveSettings: "保存设置",
    childItems: "子选项",
    cancel: "取消",
    delete: "删除",
    noChildItems: "暂无子选项",
    noSubmenus: "暂无子菜单",
    noNestedItems: "暂无嵌套项",
    leafPlaceholder: "每行一条，例如 alice@test.com",
    submenuNamePlaceholder: "子菜单名，例如：管理员",
    nestedItemsPlaceholder: "嵌套项，每行一条",
    addNestedPlaceholder: "添加嵌套项，每行一条",
    addSubmenu: "添加子菜单",
    untitled: "未命名",
    untitledParen: "(未命名)",
    untitledSubmenu: "未命名子菜单",
    needChildItem: "请至少填写一条子选项。",
    needParentName: "请填写父菜单名。",
    needSubmenuComplete: "请填写子菜单名称，并至少添加一条嵌套项。",
    needNestedItem: "请至少填写一条嵌套项。",
    needChildOrSubmenu: "请至少添加一条子选项，或一个完整子菜单。",
    statusDeleted: "已删除，保存后才会更新右键菜单。",
    statusAdded: "已添加，保存后才会更新右键菜单。",
    statusSaved: "已保存，右键菜单已更新。",
    previewPrefix: "预览："
  }
};

const emailPrefixInput = document.getElementById("emailPrefix");
const emailDomainInput = document.getElementById("emailDomain");
const emailPreview = document.getElementById("emailPreview");
const snippetTitleInput = document.getElementById("snippetTitle");
const snippetValueInput = document.getElementById("snippetValue");
const addSnippetBtn = document.getElementById("addSnippetBtn");
const addSubmenuDraftBtn = document.getElementById("addSubmenuDraftBtn");
const submenuDraftList = document.getElementById("submenuDraftList");
const snippetList = document.getElementById("snippetList");
const emptySnippets = document.getElementById("emptySnippets");
const saveBtn = document.getElementById("saveBtn");
const statusEl = document.getElementById("status");
const languageSelect = document.getElementById("language");

let currentLang = "en";
let snippets = [];
let submenuDrafts = [{ key: "d_init", title: "", values: "" }];
let expandedGroupId = null;
let groupAddMode = null;
let submenuAddId = null;

init();

function detectBrowserLanguage() {
  const lang = String(navigator.language || "en").toLowerCase();
  return lang.startsWith("zh") ? "zh" : "en";
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

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
}

function formatItemCount(count) {
  if (currentLang === "zh") return `${count} 项`;
  return count === 1 ? "1 item" : `${count} items`;
}

function formatSubmenuCount(count) {
  if (currentLang === "zh") return `${count} 个子菜单`;
  return count === 1 ? "1 submenu" : `${count} submenus`;
}

async function init() {
  const stored = await chrome.storage.sync.get({
    ...DEFAULT_SETTINGS,
    uiLanguage: null
  });
  currentLang = stored.uiLanguage === "zh" || stored.uiLanguage === "en"
    ? stored.uiLanguage
    : detectBrowserLanguage();

  emailPrefixInput.value = stored.emailPrefix || DEFAULT_SETTINGS.emailPrefix;
  emailDomainInput.value = stored.emailDomain || DEFAULT_SETTINGS.emailDomain;
  snippets = normalizeSnippets(stored.customSnippets);

  applyStaticI18n();
  renderPreview();
  renderSnippets();
  renderSubmenuDrafts();
  await requestRebuildMenus();

  emailPrefixInput.addEventListener("input", renderPreview);
  emailDomainInput.addEventListener("input", renderPreview);
  addSubmenuDraftBtn.addEventListener("click", () => {
    submenuDrafts.push({ key: createId("d_"), title: "", values: "" });
    renderSubmenuDrafts();
  });
  addSnippetBtn.addEventListener("click", addParentMenu);
  saveBtn.addEventListener("click", saveSettings);
  languageSelect.addEventListener("change", async () => {
    currentLang = languageSelect.value === "zh" ? "zh" : "en";
    await chrome.storage.sync.set({ uiLanguage: currentLang });
    applyStaticI18n();
    renderPreview();
    renderSnippets();
    renderSubmenuDrafts();
  });
}

async function requestRebuildMenus() {
  try {
    await chrome.runtime.sendMessage({ type: "rebuildMenus" });
  } catch (_e) {
    // service worker 未就绪时由后台冷启动兜底
  }
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

  if (child.type === "submenu" || Array.isArray(child.items) && child.title) {
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
  const prefix = emailPrefixInput.value.trim() || "0x_";
  const domain = emailDomainInput.value.trim() || "text.com";
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

    const header = document.createElement("button");
    header.type = "button";
    header.className = "snippet-header";
    header.setAttribute("aria-expanded", isOpen ? "true" : "false");
    header.addEventListener("click", () => toggleGroup(group.id));

    const chevron = document.createElement("span");
    chevron.className = "snippet-chevron";
    chevron.setAttribute("aria-hidden", "true");

    const title = document.createElement("div");
    title.className = "snippet-title";
    title.append(group.title || t("untitledParen"));

    const meta = document.createElement("span");
    meta.className = "snippet-meta";
    const submenuCount = countSubmenus(group);
    const itemLabel = formatItemCount(countLeaves(group));
    meta.textContent =
      submenuCount > 0
        ? `${itemLabel} · ${formatSubmenuCount(submenuCount)}`
        : itemLabel;

    const count = document.createElement("span");
    count.className = "snippet-count";
    count.textContent = String(countLeaves(group));

    header.appendChild(chevron);
    header.appendChild(title);
    header.appendChild(meta);
    header.appendChild(count);

    const removeBtn = makeButton("btn danger", t("delete"), (event) => {
      event.stopPropagation();
      snippets = snippets.filter((s) => s.id !== group.id);
      if (expandedGroupId === group.id) expandedGroupId = null;
      renderSnippets();
      setStatus(t("statusDeleted"));
    });
    removeBtn.classList.add("snippet-delete");

    const row = document.createElement("div");
    row.className = "snippet-row";
    row.appendChild(header);
    row.appendChild(removeBtn);
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
        renderValueRow(child.value, () => {
          group.children = group.children.filter((item) => item.id !== child.id);
          renderSnippets();
          setStatus(t("statusDeleted"));
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
          setStatus(t("statusAdded"));
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

  if (!submenus.length) {
    const empty = document.createElement("p");
    empty.className = "snippet-empty";
    empty.textContent = t("noSubmenus");
    section.appendChild(empty);
  } else {
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

function renderValueRow(text, onRemove) {
  const row = document.createElement("li");
  const value = document.createElement("code");
  value.className = "snippet-value";
  value.textContent = text;
  row.appendChild(value);
  row.appendChild(makeButton("btn danger", t("delete"), onRemove));
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
      setStatus(t("statusAdded"));
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
  const title = document.createElement("div");
  title.className = "snippet-title";
  title.textContent = submenu.title;
  header.appendChild(title);
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
      setStatus(t("statusDeleted"));
    })
  );
  wrap.appendChild(header);

  const grandList = document.createElement("ul");
  grandList.className = "snippet-items";
  if (!submenu.items.length) {
    const empty = document.createElement("p");
    empty.className = "snippet-empty";
    empty.textContent = t("noNestedItems");
    wrap.appendChild(empty);
  } else {
    for (const item of submenu.items) {
      grandList.appendChild(
        renderValueRow(item.value, () => {
          submenu.items = submenu.items.filter((leaf) => leaf.id !== item.id);
          if (submenu.items.length === 0) {
            group.children = group.children.filter((child) => child.id !== submenu.id);
          }
          renderSnippets();
          setStatus(t("statusDeleted"));
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
          setStatus(t("statusAdded"));
          return true;
        }
      })
    );
  }

  return wrap;
}

function collectSubmenusFromDrafts() {
  const drafts = Array.from(submenuDraftList.querySelectorAll(".submenu-draft"));
  return drafts
    .map((row) => {
      const title = row.querySelector(".submenu-draft-title").value.trim();
      const values = parseValues(row.querySelector(".submenu-draft-values").value);
      if (!title && !values.length) return null;
      return { title, values };
    })
    .filter(Boolean);
}

function renderSubmenuDrafts() {
  submenuDraftList.innerHTML = "";
  submenuDrafts.forEach((draft, index) => {
    const row = document.createElement("div");
    row.className = "submenu-draft";
    row.dataset.key = draft.key;

    const head = document.createElement("div");
    head.className = "submenu-draft-head";

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.className = "submenu-draft-title";
    titleInput.maxLength = 64;
    titleInput.placeholder = t("submenuNamePlaceholder");
    titleInput.value = draft.title;
    titleInput.addEventListener("input", () => {
      draft.title = titleInput.value;
    });

    head.appendChild(titleInput);
    if (submenuDrafts.length > 1) {
      head.appendChild(
        makeButton("btn danger", t("delete"), () => {
          submenuDrafts = submenuDrafts.filter((item) => item.key !== draft.key);
          renderSubmenuDrafts();
        })
      );
    }
    row.appendChild(head);

    const valuesInput = document.createElement("textarea");
    valuesInput.className = "submenu-draft-values";
    valuesInput.rows = 3;
    valuesInput.placeholder = t("nestedItemsPlaceholder");
    valuesInput.value = draft.values;
    valuesInput.addEventListener("input", () => {
      draft.values = valuesInput.value;
    });
    row.appendChild(valuesInput);
    submenuDraftList.appendChild(row);
  });
}

function resetComposer() {
  snippetTitleInput.value = "";
  snippetValueInput.value = "";
  submenuDrafts = [{ key: createId("d_"), title: "", values: "" }];
  renderSubmenuDrafts();
}

function addParentMenu() {
  const title = snippetTitleInput.value.trim();
  const values = parseValues(snippetValueInput.value);
  const submenus = collectSubmenusFromDrafts();

  if (!title) {
    setStatus(t("needParentName"));
    return;
  }

  const incomplete = submenus.find((item) => !item.title || !item.values.length);
  if (incomplete) {
    setStatus(t("needSubmenuComplete"));
    return;
  }

  const children = [
    ...values.map((value) => ({ type: "leaf", id: createId("i_"), value })),
    ...submenus.map((item) => ({
      type: "submenu",
      id: createId("s_"),
      title: item.title,
      items: item.values.map((value) => ({ id: createId("i_"), value }))
    }))
  ];

  if (!children.length) {
    setStatus(t("needChildOrSubmenu"));
    return;
  }

  const existing = snippets.find((group) => group.title === title);
  if (existing) {
    existing.children.push(...children);
    expandedGroupId = existing.id;
    groupAddMode = null;
    submenuAddId = null;
  } else {
    const group = {
      id: createId("g_"),
      title,
      children
    };
    snippets.push(group);
    expandedGroupId = group.id;
    groupAddMode = null;
    submenuAddId = null;
  }

  resetComposer();
  renderSnippets();
  setStatus(t("statusAdded"));
}

async function saveSettings() {
  const emailPrefix = emailPrefixInput.value.trim() || DEFAULT_SETTINGS.emailPrefix;
  const emailDomain = emailDomainInput.value.trim() || DEFAULT_SETTINGS.emailDomain;

  await chrome.storage.sync.set({
    emailPrefix,
    emailDomain,
    customSnippets: snippets
  });
  await requestRebuildMenus();

  emailPrefixInput.value = emailPrefix;
  emailDomainInput.value = emailDomain;
  renderPreview();
  setStatus(t("statusSaved"));
}

function setStatus(text) {
  statusEl.textContent = text;
  window.clearTimeout(setStatus._timer);
  setStatus._timer = window.setTimeout(() => {
    statusEl.textContent = "";
  }, 2500);
}
