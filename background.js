// 内置测试号码（使用明显假号 / 预留段，避免误填真实号码）
const BUILTIN_PHONES = [
  { id: "phone_US", title: "🇺🇸: +1 202-555-0125", value: "+1 202-555-0125" },
  { id: "phone_HK", title: "🇭🇰: +852 9123 4567", value: "+852 9123 4567" },
  { id: "phone_TW", title: "🇹🇼: +886 912 345 678", value: "+886 912 345 678" },
  { id: "phone_JP", title: "🇯🇵: +81 90 1234 5678", value: "+81 90 1234 5678" },
  { id: "phone_TH", title: "🇹🇭: +66 81 234 5678", value: "+66 81 234 5678" },
  { id: "phone_FR", title: "🇫🇷: +33 6 12 34 56 78", value: "+33 6 12 34 56 78" }
];

const DEFAULT_SETTINGS = {
  emailPrefix: "0x_",
  emailDomain: "text.com",
  customSnippets: []
};

const MENU = {
  root: "root_quick_test_data",
  fillForm: "fill_form",
  email: "email_random",
  textRoot: "text_root",
  text100: "text_100",
  text200: "text_200",
  phoneRoot: "phone_root"
};

// 页面任意位置都可打开（不只输入框）
const MENU_CONTEXTS = ["all"];

let cachedSettings = { ...DEFAULT_SETTINGS };

initMenus();

chrome.runtime.onInstalled.addListener(() => {
  initMenus();
});

chrome.runtime.onStartup.addListener(() => {
  initMenus();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  if (!changes.emailPrefix && !changes.emailDomain && !changes.customSnippets) return;
  initMenus();
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.type !== "rebuildMenus") return;
  initMenus()
    .then(() => sendResponse({ ok: true }))
    .catch(() => sendResponse({ ok: false }));
  return true;
});

async function initMenus() {
  await loadSettings();
  await rebuildContextMenus();
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab || tab.id == null) return;

  const menuId = String(info.menuItemId);
  const payload = resolveFillPayload(menuId);
  if (!payload) return;

  await broadcastFill(tab.id, payload);
});

async function loadSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  cachedSettings = {
    emailPrefix: String(stored.emailPrefix || DEFAULT_SETTINGS.emailPrefix),
    emailDomain: String(stored.emailDomain || DEFAULT_SETTINGS.emailDomain),
    customSnippets: normalizeSnippets(stored.customSnippets)
  };
  return cachedSettings;
}

function createMenu(properties) {
  return new Promise((resolve) => {
    chrome.contextMenus.create(properties, () => {
      void chrome.runtime.lastError;
      resolve();
    });
  });
}

async function rebuildContextMenus() {
  await chrome.contextMenus.removeAll();

  await createMenu({
    id: MENU.root,
    title: "0xFill - Quick Fill",
    contexts: MENU_CONTEXTS
  });

  await createMenu({
    id: MENU.fillForm,
    parentId: MENU.root,
    title: "One Click Fill",
    contexts: MENU_CONTEXTS
  });

  await createMenu({
    id: MENU.email,
    parentId: MENU.root,
    title: "Random Email",
    contexts: MENU_CONTEXTS
  });

  await createMenu({
    id: MENU.textRoot,
    parentId: MENU.root,
    title: "Random Text",
    contexts: MENU_CONTEXTS
  });

  await createMenu({
    id: MENU.text100,
    parentId: MENU.textRoot,
    title: "100 Characters",
    contexts: MENU_CONTEXTS
  });

  await createMenu({
    id: MENU.text200,
    parentId: MENU.textRoot,
    title: "200 Characters",
    contexts: MENU_CONTEXTS
  });

  await createMenu({
    id: MENU.phoneRoot,
    parentId: MENU.root,
    title: "Test Phone Numbers",
    contexts: MENU_CONTEXTS
  });

  for (const item of BUILTIN_PHONES) {
    await createMenu({
      id: item.id,
      parentId: MENU.phoneRoot,
      title: item.title,
      contexts: MENU_CONTEXTS
    });
  }

  // 自定义最多三层：父菜单 → 子选项/子菜单 → 孙子选项
  for (const group of cachedSettings.customSnippets) {
    const children = group.children || [];
    if (children.length === 0) continue;

    const groupMenuId = `custom_group_${group.id}`;
    await createMenu({
      id: groupMenuId,
      parentId: MENU.root,
      title: String(group.title).slice(0, 64),
      contexts: MENU_CONTEXTS
    });

    for (const child of children) {
      if (child.type === "submenu") {
        const items = child.items || [];
        if (!items.length) continue;
        const subMenuId = `custom_sub_${group.id}_${child.id}`;
        await createMenu({
          id: subMenuId,
          parentId: groupMenuId,
          title: String(child.title).slice(0, 64),
          contexts: MENU_CONTEXTS
        });
        for (const item of items) {
          await createMenu({
            id: `custom_item_${group.id}_${child.id}_${item.id}`,
            parentId: subMenuId,
            title: String(item.value).slice(0, 64),
            contexts: MENU_CONTEXTS
          });
        }
        continue;
      }

      await createMenu({
        id: `custom_item_${group.id}_${child.id}`,
        parentId: groupMenuId,
        title: String(child.value).slice(0, 64),
        contexts: MENU_CONTEXTS
      });
    }
  }
}

function resolveFillPayload(menuId) {
  if (menuId === MENU.fillForm) {
    return { type: "fillForm", kit: buildFormKit() };
  }

  const phone = BUILTIN_PHONES.find((item) => item.id === menuId);
  if (phone) {
    return { type: "fillText", text: phone.value, insertMode: false };
  }

  if (menuId === MENU.email) {
    return { type: "fillText", text: generateRandomEmail(), insertMode: false };
  }

  if (menuId === MENU.text100) {
    return { type: "fillText", text: generateRandomText(100), insertMode: true };
  }

  if (menuId === MENU.text200) {
    return { type: "fillText", text: generateRandomText(200), insertMode: true };
  }

  if (menuId.startsWith("custom_item_")) {
    const text = findCustomItemValue(menuId);
    if (text != null) {
      return { type: "fillText", text, insertMode: false };
    }
  }

  return null;
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
    if (!items.length) return null;
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
        if (!children.length) return null;
        return { id, title: title || "Untitled", children };
      }

      if (Array.isArray(item.items)) {
        const children = item.items
          .map((child, index) => normalizeChild(child, id, index))
          .filter(Boolean);
        if (!children.length) return null;
        return { id, title: title || children[0].value || "Untitled", children };
      }

      if (item.value != null && String(item.value).trim()) {
        return {
          id,
          title: title || String(item.value),
          children: [{ type: "leaf", id: `${id}_0`, value: String(item.value) }]
        };
      }

      return null;
    })
    .filter(Boolean);
}

function findCustomItemValue(menuId) {
  const rest = menuId.slice("custom_item_".length);
  for (const group of cachedSettings.customSnippets) {
    for (const child of group.children || []) {
      if (child.type === "leaf" && rest === `${group.id}_${child.id}`) {
        return String(child.value);
      }
      if (child.type === "submenu") {
        for (const item of child.items || []) {
          if (rest === `${group.id}_${child.id}_${item.id}`) {
            return String(item.value);
          }
        }
      }
    }
  }
  return null;
}

function buildFormKit() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8);

  return {
    email: generateRandomEmail(),
    phone: BUILTIN_PHONES[0].value,
    url: "https://example.com",
    date: `${yyyy}-${mm}-${dd}`,
    month: `${yyyy}-${mm}`,
    datetime: `${yyyy}-${mm}-${dd}T${hh}:${mi}`,
    time: `${hh}:${mi}`,
    number: "42",
    firstName: "Alex",
    lastName: "Tester",
    fullName: "Alex Tester",
    username: `oxfill_${rand}`,
    company: "0xFill Test Co",
    address: "123 Test Street",
    city: "Testville",
    state: "CA",
    zip: "90210",
    country: "US",
    shortText: "Test data",
    longText: "This is sample text generated by 0xFill for form testing."
  };
}

async function broadcastFill(tabId, payload) {
  let frames = null;
  try {
    frames = await chrome.webNavigation.getAllFrames({ tabId });
  } catch (_e) {
    frames = null;
  }

  if (!frames || frames.length === 0) {
    chrome.tabs.sendMessage(tabId, payload, () => void chrome.runtime.lastError);
    return;
  }

  for (const frame of frames) {
    chrome.tabs.sendMessage(tabId, payload, { frameId: frame.frameId }, () => {
      void chrome.runtime.lastError;
    });
  }
}

function generateRandomEmail() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let rand = "";
  for (let i = 0; i < 6; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  const prefix = cachedSettings.emailPrefix || "0x_";
  const domain = cachedSettings.emailDomain || "text.com";
  return `${prefix}${rand}@${domain}`;
}

function generateRandomText(length) {
  const words = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
    "hello", "world", "test", "data", "sample", "text", "example",
    "this", "is", "a", "random", "sentence", "generated", "by", "0xFill",
    "development", "testing", "application", "software", "programming",
    "computer", "technology", "internet", "web", "browser", "extension",
    "user", "interface", "design", "function", "feature", "system",
    "code", "project", "work", "time", "day", "night", "morning",
    "afternoon", "evening", "week", "month", "year", "today", "tomorrow",
    "good", "great", "excellent", "wonderful", "amazing", "fantastic",
    "beautiful", "nice", "perfect", "awesome", "incredible", "outstanding"
  ];

  let text = "";
  let sentenceCount = 0;
  const maxSentences = length < 150 ? 3 : 6;

  while (text.length < length && sentenceCount < maxSentences) {
    const wordCount = Math.floor(Math.random() * 6) + 3;
    const sentence = [];
    for (let i = 0; i < wordCount; i++) {
      sentence.push(words[Math.floor(Math.random() * words.length)]);
    }

    const sentenceText = sentence.join(" ");
    const capitalized =
      sentenceText.charAt(0).toUpperCase() + sentenceText.slice(1) + ".";

    if (text.length > 0) text += " ";
    text += capitalized;
    sentenceCount++;

    if (text.length > length) {
      text = text.substring(0, length);
      const lastPeriod = text.lastIndexOf(".");
      if (lastPeriod > length * 0.7) {
        text = text.substring(0, lastPeriod + 1);
      } else {
        const lastSpace = text.lastIndexOf(" ");
        if (lastSpace > 0) text = text.substring(0, lastSpace) + ".";
      }
      break;
    }
  }

  while (text.length < length) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const next = text + " " + randomWord;
    if (next.length <= length) text = next;
    else break;
  }

  if (!text.endsWith(".")) text += ".";
  return text;
}
