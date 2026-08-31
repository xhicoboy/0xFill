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

const MENU = {
  root: "root_quick_test_data",
  fillForm: "fill_form",
  fillCard: "fill_card",
  extraCardRoot: "extra_card_root",
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
  if (changes.emailPrefix || changes.emailDomain || changes.customSnippets || changes.extraCardKits || changes.extraCardGroupTitle) {
    initMenus();
    return;
  }
  if (changes.cardKit) loadSettings();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || !message.type) return;

  if (message.type === "rebuildMenus") {
    initMenus()
      .then(() => sendResponse({ ok: true }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }
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

  if (payload.type === "fillCard") {
    await sendCardFillToAllFrames(tab.id, payload);
    return;
  }

  await sendFillToFrame(tab.id, info.frameId ?? 0, payload);
});

async function loadSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  cachedSettings = {
    emailPrefix: sanitizeEmailPrefix(stored.emailPrefix) || DEFAULT_SETTINGS.emailPrefix,
    emailDomain: normalizeEmailDomain(stored.emailDomain),
    customSnippets: normalizeSnippets(stored.customSnippets),
    cardKit: normalizeCardKit(stored.cardKit),
    extraCardKits: normalizeExtraCardKits(stored.extraCardKits),
    extraCardGroupTitle: String(stored.extraCardGroupTitle || "").trim()
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

  await createMenu({
    id: MENU.fillCard,
    parentId: MENU.root,
    title: "Card Fill Form",
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

  const extraCards = (cachedSettings.extraCardKits || []).filter((card) => String(card.title || "").trim());
  const extraGroupTitle = String(cachedSettings.extraCardGroupTitle || "").trim();
  if (extraGroupTitle && extraCards.length > 0) {
    await createMenu({
      id: MENU.extraCardRoot,
      parentId: MENU.root,
      title: extraGroupTitle.slice(0, 64),
      contexts: MENU_CONTEXTS
    });
    for (const card of extraCards) {
      await createMenu({
        id: `extra_card_${card.id}`,
        parentId: MENU.extraCardRoot,
        title: String(card.title).slice(0, 64),
        contexts: MENU_CONTEXTS
      });
    }
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

  if (menuId === MENU.fillCard) {
    return { type: "fillCard", kit: buildCardKit() };
  }

  if (menuId.startsWith("extra_card_")) {
    const cardId = menuId.slice("extra_card_".length);
    const card = (cachedSettings.extraCardKits || []).find((item) => item.id === cardId);
    if (card) {
      return { type: "fillCard", kit: extraCardKit(card) };
    }
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
    username: `0xfill_${rand}`,
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

function buildCardKit() {
  return { ...normalizeCardKit(cachedSettings.cardKit) };
}

function normalizeCardKit(raw) {
  const src = raw && typeof raw === "object" ? raw : {};
  const defaults = DEFAULT_SETTINGS.cardKit;
  return {
    firstName: String(src.firstName || defaults.firstName),
    lastName: String(src.lastName || defaults.lastName),
    fullName: String(src.fullName || defaults.fullName),
    cardNumber: String(src.cardNumber || defaults.cardNumber),
    cardExp: String(src.cardExp || defaults.cardExp),
    cardCvv: String(src.cardCvv || defaults.cardCvv)
  };
}

function normalizeExtraCardKits(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || item.id == null) return null;
      const title = String(item.title || "").trim();
      if (!title) return null;
      return {
        id: String(item.id),
        title: title.slice(0, 64),
        firstName: String(item.firstName || "").trim(),
        lastName: String(item.lastName || "").trim(),
        fullName: String(item.fullName || "").trim(),
        cardNumber: String(item.cardNumber || "").trim(),
        cardExp: String(item.cardExp || "").trim(),
        cardCvv: String(item.cardCvv || "").trim()
      };
    })
    .filter(Boolean);
}

function extraCardKit(card) {
  const base = buildCardKit();
  return {
    firstName: String(card.firstName || "").trim() || base.firstName,
    lastName: String(card.lastName || "").trim() || base.lastName,
    fullName: String(card.fullName || "").trim() || base.fullName,
    cardNumber: String(card.cardNumber || "").trim() || base.cardNumber,
    cardExp: String(card.cardExp || "").trim() || base.cardExp,
    cardCvv: String(card.cardCvv || "").trim() || base.cardCvv
  };
}

function sendMessageToFrame(tabId, frameId, payload) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, payload, { frameId }, () => {
      resolve(!chrome.runtime.lastError);
    });
  });
}

async function sendFillToFrame(tabId, frameId, payload) {
  if (await sendMessageToFrame(tabId, frameId, payload)) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId, frameIds: [frameId] },
      files: ["content.js"],
      injectImmediately: true
    });
  } catch (_e) {
    if (frameId === 0) return;
    await sendFillToFrame(tabId, 0, payload);
    return;
  }

  await sendMessageToFrame(tabId, frameId, payload);
}

async function sendCardFillToAllFrames(tabId, payload) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      files: ["content.js"],
      injectImmediately: true
    });
  } catch (_e) {
    // 部分跨域 / 受限 frame 无法注入，其余 frame 仍继续
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId, allFrames: true },
      func: (kit) => {
        if (typeof globalThis.__0xfillFillCard === "function") {
          return globalThis.__0xfillFillCard(kit);
        }
        return { filled: 0 };
      },
      args: [payload.kit || {}]
    });
  } catch (_e) {
    await sendFillToFrame(tabId, 0, payload);
  }
}

function generateRandomEmail() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let rand = "";
  for (let i = 0; i < 6; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  const prefix = sanitizeEmailPrefix(cachedSettings.emailPrefix) || DEFAULT_SETTINGS.emailPrefix;
  const domain = normalizeEmailDomain(cachedSettings.emailDomain);
  return `${prefix}${rand}@${domain}`;
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

const RANDOM_SENTENCES = [
  "Please review the sample notes before submitting this form.",
  "The checkout flow needs a valid billing address before payment can continue.",
  "This is placeholder copy used to check wrapping, truncation, and character limits.",
  "Contact support if the confirmation email does not arrive within a few minutes.",
  "The shipping label should match the name on the order summary.",
  "Update the profile details and save your changes to continue.",
  "A verification code was sent to the test inbox for this session.",
  "The selected plan includes basic usage for development and QA.",
  "Enter a short description so the team can reproduce the issue.",
  "This field accepts a brief comment about the current request.",
  "Try a longer remark to see how the layout handles extra lines.",
  "The sample record is not a real customer and can be deleted later.",
  "Keep this note attached to the ticket until the review is complete.",
  "Confirm the date and time shown on the receipt before closing.",
  "Use this paragraph to verify that the textarea scrolls correctly.",
  "All values on this page are generated locally for form testing.",
  "The previous step can be skipped when the default options are fine.",
  "Please ignore this message if you did not start the signup flow.",
  "The dashboard lists recent activity for the signed-in tester.",
  "Optional comments help reviewers understand what changed.",
  "Reload the page if the preview does not match the saved draft.",
  "This sentence exists only to fill the box with readable English.",
  "A second example helps confirm that each click produces new copy.",
  "The test order can be cancelled from the confirmation screen.",
  "Leave a status update so the next person knows what to check.",
  "The search results should stay in view after the filters change.",
  "Add a delivery instruction if the package needs extra handling.",
  "The form should remain valid after you correct the highlighted fields."
];

function shuffleList(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
  }
  return copy;
}

function generateRandomText(length) {
  const pool = shuffleList(RANDOM_SENTENCES);
  let text = "";
  let index = 0;

  while (text.length < length) {
    const sentence = pool[index % pool.length];
    index += 1;
    text += (text ? " " : "") + sentence;
  }

  if (text.length > length) {
    const cut = text.lastIndexOf(".", length - 1);
    if (cut >= 0) return text.slice(0, cut + 1);
    const first = text.indexOf(".");
    if (first >= 0) return text.slice(0, first + 1);
  }

  return text;
}
