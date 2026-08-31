// content.js - 单字段填充 + 一键填充当前表单（兼容 React/Vue）

if (!window.__oxfillInitialized) {
  window.__oxfillInitialized = true;

  const SKIP_TYPE = new Set([
    "button",
    "checkbox",
    "color",
    "file",
    "hidden",
    "image",
    "radio",
    "range",
    "reset",
    "submit",
    "password"
  ]);

  const SKIP_HINT =
    /password|passwd|pwd|captcha|recaptcha|hcaptcha|verifycode|verification|otp|2fa|mfa|authcode|sms.?code|email.?code|cvv|cvc|csc|card.?number|credit.?card|debit.?card|pan\b|ssn|social.?security|身份证|验证码|密码|信用卡|银行卡/i;

  function isEditableElement(el) {
    if (!el || !el.isConnected) return false;
    if (el.disabled || el.readOnly) return false;

    const tag = (el.tagName || "").toLowerCase();
    if (tag === "textarea") return true;
    if (tag === "input") {
      const type = (el.type || "text").toLowerCase();
      return !SKIP_TYPE.has(type);
    }

    return Boolean(el.isContentEditable);
  }

  const FILL_CAP_MS = 400;
  const FILL_MIN_MS = 80;
  const FILL_MS_PER_CHAR = 24;
  const FILL_GAP_MS = 40;
  let fillGeneration = 0;
  let lastEditable = null;
  let uiLang = "en";

  const TOAST_I18N = {
    en: {
      needInput: "0xFill: Click an input field first, or choose “One Click Fill” from the context menu.",
      fillForm: "0xFill: Filled {filled} {filledUnit} (skipped {skipped} {skippedUnit})",
      fillCard: "0xFill: Card form filled ({filled} {filledUnit})"
    },
    zh: {
      needInput: "0xFill: 请先点击输入框，或从右键菜单选择 “One Click Fill”。",
      fillForm: "0xFill: 已填写 {filled} 个字段（跳过 {skipped} 个）",
      fillCard: "0xFill: 已填写卡信息（{filled} 个字段）"
    }
  };

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

  function tToast(key, vars) {
    let text = (TOAST_I18N[uiLang] || TOAST_I18N.en)[key] ?? TOAST_I18N.en[key] ?? key;
    if (vars) {
      Object.keys(vars).forEach((name) => {
        text = text.split(`{${name}}`).join(String(vars[name]));
      });
    }
    return text;
  }

  function fieldUnit(count) {
    return count === 1 ? "field" : "fields";
  }

  uiLang = detectBrowserLanguage();
  chrome.storage.sync.get({ uiLanguage: null }, (stored) => {
    uiLang = resolveUiLanguage(stored.uiLanguage);
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync" || !changes.uiLanguage) return;
    uiLang = resolveUiLanguage(changes.uiLanguage.newValue);
  });

  document.addEventListener("focusin", (event) => {
    if (isEditableElement(event.target)) lastEditable = event.target;
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || !message.type) return;

    if (message.type === "fillText") {
      const text = String(message.text ?? "");
      const insertMode = message.insertMode === true;
      const el = takeArmedEditable();
      if (!el) {
        showToast(tToast("needInput"));
        sendResponse({ ok: false });
        return;
      }
      const isCurrent = beginFillSession();
      fillElement(el, text, insertMode, isCurrent).then(() => {
        sendResponse({ ok: true });
      });
      return true;
    }

    if (message.type === "fillForm") {
      const anchor =
        (isEditableElement(document.activeElement) && document.activeElement) ||
        (lastEditable && isEditableElement(lastEditable) && lastEditable) ||
        document.body;

      fillCurrentForm(anchor, message.kit || {}).then((result) => {
        showToast(tToast("fillForm", {
          filled: result.filled,
          filledUnit: fieldUnit(result.filled),
          skipped: result.skipped,
          skippedUnit: fieldUnit(result.skipped)
        }));
        sendResponse({ ok: true, ...result });
      });
      return true;
    }

    if (message.type === "fillCard") {
      fillCardForm(message.kit || {}).then((result) => {
        sendResponse({ ok: true, ...result });
      });
      return true;
    }
  });

  globalThis.__oxfillFillCard = function (kit) {
    return fillCardForm(kit || {});
  };

  function takeArmedEditable() {
    if (isEditableElement(document.activeElement)) {
      lastEditable = document.activeElement;
      return document.activeElement;
    }
    if (lastEditable && isEditableElement(lastEditable)) {
      return lastEditable;
    }
    lastEditable = null;
    return null;
  }

  function setNativeValue(el, value) {
    const proto =
      el.tagName.toLowerCase() === "textarea"
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
    if (descriptor && descriptor.set) {
      descriptor.set.call(el, value);
    } else {
      el.value = value;
    }
  }

  function dispatchInputEvents(el) {
    el.dispatchEvent(new Event("input", { bubbles: true }));
    try {
      el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText" }));
    } catch (_e) {
      // 旧环境可能不支持 InputEvent
    }
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function beginFillSession() {
    const generation = ++fillGeneration;
    return () => generation === fillGeneration;
  }

  function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function fillDurationMs(length) {
    if (length <= 1) return FILL_MIN_MS;
    return Math.min(FILL_CAP_MS, Math.max(FILL_MIN_MS, length * FILL_MS_PER_CHAR));
  }

  function canTypewriter(el) {
    const tag = (el.tagName || "").toLowerCase();
    if (tag === "textarea") return true;
    if (tag !== "input") return false;
    const type = (el.type || "text").toLowerCase();
    return type === "text" || type === "search" || type === "email" || type === "tel" || type === "url" || type === "";
  }

  function fillElement(el, text, insertMode = false, isCurrent = () => true) {
    const tag = (el.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") {
      return insertTextIntoInputOrTextarea(el, text, insertMode, isCurrent);
    }
    if (el.isContentEditable) {
      return insertTextIntoContentEditable(el, text, insertMode, isCurrent);
    }
    if (tag === "select") {
      return fillSelectAnimated(el, text, isCurrent);
    }
    return Promise.resolve();
  }

  function commitInputValue(el, nextValue, cursor) {
    setNativeValue(el, nextValue);
    try {
      if (typeof cursor === "number") el.setSelectionRange(cursor, cursor);
    } catch (_e) {
      // number/email 等类型可能不支持 selectionRange
    }
    dispatchInputEvents(el);
  }

  // insertMode: true = 在光标/选区处插入；false = 有选区则替换选区，否则整框覆盖
  async function insertTextIntoInputOrTextarea(el, text, insertMode = false, isCurrent = () => true) {
    el.focus();
    try {
      el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    } catch (_e) {}

    const value = el.value || "";
    let start = typeof el.selectionStart === "number" ? el.selectionStart : value.length;
    let end = typeof el.selectionEnd === "number" ? el.selectionEnd : value.length;
    const hasSelection = start !== end;

    if (!insertMode && !hasSelection) {
      start = 0;
      end = value.length;
    }

    const prefix = value.slice(0, start);
    const suffix = value.slice(end);
    const typed = String(text ?? "");

    if (!canTypewriter(el) || typed.length <= 1) {
      commitInputValue(el, prefix + typed + suffix, start + typed.length);
      return;
    }

    const stepMs = fillDurationMs(typed.length) / typed.length;
    for (let i = 1; i <= typed.length; i += 1) {
      if (!isCurrent() || !el.isConnected) return;
      const nextValue = prefix + typed.slice(0, i) + suffix;
      commitInputValue(el, nextValue, start + i);
      if (i < typed.length) await sleep(stepMs);
    }
  }

  async function insertTextIntoContentEditable(el, text, insertMode = false, isCurrent = () => true) {
    if (!isCurrent()) return;
    el.focus();
    try {
      el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    } catch (_e) {}

    const typed = String(text ?? "");
    const selection = window.getSelection();
    const hasRange = selection && selection.rangeCount > 0;
    const range = hasRange ? selection.getRangeAt(0) : null;
    const hasSelection = Boolean(range && !range.collapsed);

    if (!insertMode && !hasSelection && typed.length > 1) {
      const stepMs = fillDurationMs(typed.length) / typed.length;
      for (let i = 1; i <= typed.length; i += 1) {
        if (!isCurrent() || !el.isConnected) return;
        el.textContent = typed.slice(0, i);
        dispatchInputEvents(el);
        if (i < typed.length) await sleep(stepMs);
      }
      return;
    }

    if (!insertMode && !hasSelection) {
      el.textContent = typed;
      dispatchInputEvents(el);
      return;
    }

    if (!range) {
      el.appendChild(document.createTextNode(typed));
      dispatchInputEvents(el);
      return;
    }

    range.deleteContents();
    const node = document.createTextNode(typed);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    dispatchInputEvents(el);
  }

  async function fillSelectAnimated(el, preferred, isCurrent = () => true) {
    if (!isCurrent()) return false;
    return fillSelect(el, preferred);
  }

  function fillSelect(el, preferred) {
    const options = Array.from(el.options || []);
    if (!options.length) return false;

    let match = null;
    if (preferred) {
      const needle = String(preferred).toLowerCase();
      match = options.find(
        (opt) =>
          !opt.disabled &&
          (String(opt.value).toLowerCase() === needle ||
            String(opt.text).toLowerCase().includes(needle))
      );
    }
    if (!match) {
      match = options.find((opt) => !opt.disabled && String(opt.value).trim() !== "");
    }
    if (!match) match = options.find((opt) => !opt.disabled) || options[0];

    el.value = match.value;
    dispatchInputEvents(el);
    return true;
  }

  function isVisible(el) {
    if (!el || !el.isConnected) return false;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function isCheckableVisible(el) {
    if (isVisible(el)) return true;
    if (!el || !el.isConnected) return false;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    const label =
      el.closest("label") ||
      (el.id ? document.querySelector(`label[for="${cssEscape(el.id)}"]`) : null);
    return Boolean(label && isVisible(label));
  }

  function isCheckboxInput(el) {
    return (el.tagName || "").toLowerCase() === "input" && (el.type || "").toLowerCase() === "checkbox";
  }

  function checkCheckbox(el) {
    if (el.checked) return false;
    el.click();
    if (el.checked) return true;

    const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "checked");
    if (descriptor && descriptor.set) {
      descriptor.set.call(el, true);
    } else {
      el.checked = true;
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return el.checked;
  }

  function getLabelText(el) {
    if (el.id) {
      const byFor = document.querySelector(`label[for="${cssEscape(el.id)}"]`);
      if (byFor) return byFor.textContent || "";
    }
    const wrapped = el.closest("label");
    if (wrapped) return wrapped.textContent || "";
    return el.getAttribute("aria-label") || "";
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
      return window.CSS.escape(value);
    }
    return String(value).replace(/["\\]/g, "\\$&");
  }

  function getFieldHint(el) {
    return [
      el.getAttribute("autocomplete") || "",
      el.getAttribute("name") || "",
      el.getAttribute("id") || "",
      el.getAttribute("placeholder") || "",
      el.getAttribute("aria-label") || "",
      el.className || "",
      getLabelText(el)
    ]
      .join(" ")
      .toLowerCase();
  }

  function isSupportedField(el) {
    if (!el || !el.isConnected || el.disabled || el.readOnly) return false;

    const tag = (el.tagName || "").toLowerCase();
    if (tag === "textarea" || tag === "select") return true;
    if (tag === "input") {
      const type = (el.type || "text").toLowerCase();
      if (type === "hidden" || type === "button" || type === "submit" || type === "reset" || type === "image" || type === "file" || type === "color" || type === "range") {
        return false;
      }
      return true;
    }
    return Boolean(el.isContentEditable);
  }

  function isSensitiveField(el) {
    const tag = (el.tagName || "").toLowerCase();
    if (tag === "input") {
      const type = (el.type || "text").toLowerCase();
      if (type === "password" || type === "radio") return true;
    }
    return SKIP_HINT.test(getFieldHint(el));
  }

  function classifyField(el) {
    const tag = (el.tagName || "").toLowerCase();
    const type = tag === "input" ? (el.type || "text").toLowerCase() : tag;
    const hint = getFieldHint(el);
    const ac = (el.getAttribute("autocomplete") || "").toLowerCase();

    if (type === "email" || ac.includes("email") || /e-?mail|邮箱|邮件/.test(hint)) {
      return "email";
    }
    if (
      type === "tel" ||
      ac.includes("tel") ||
      /phone|mobile|cellphone|tel\b|电话|手机|手机号/.test(hint)
    ) {
      return "phone";
    }
    if (type === "url" || ac.includes("url") || /website|homepage|url|网站|主页/.test(hint)) {
      return "url";
    }
    if (type === "date" || type === "month" || /birthday|birth|日期|生日/.test(hint)) {
      return type === "month" ? "month" : "date";
    }
    if (type === "datetime-local" || type === "time") {
      return type === "time" ? "time" : "datetime";
    }
    if (type === "number" || type === "range") {
      return "number";
    }
    if (
      ac === "given-name" ||
      ac === "fname" ||
      /first.?name|given.?name|名(?!字)|firstname/.test(hint)
    ) {
      return "firstName";
    }
    if (ac === "family-name" || /last.?name|family.?name|surname|姓/.test(hint)) {
      return "lastName";
    }
    if (ac === "name" || /full.?name|real.?name|姓名|名字|用户名(?!.*邮箱)/.test(hint)) {
      if (/user.?name|login|account|账号|用户名/.test(hint) && !/姓名|名字|full.?name/.test(hint)) {
        return "username";
      }
      return "fullName";
    }
    if (/user.?name|login.?name|account|账号|用户名/.test(hint)) {
      return "username";
    }
    if (ac.includes("organization") || /company|organization|corp|公司|企业/.test(hint)) {
      return "company";
    }
    if (
      ac.includes("address-line") ||
      ac === "street-address" ||
      /address|street|地址|街道/.test(hint)
    ) {
      return "address";
    }
    if (ac.includes("address-level2") || /city|城市|市/.test(hint)) {
      return "city";
    }
    if (ac.includes("address-level1") || /state|province|province|州|省/.test(hint)) {
      return "state";
    }
    if (ac.includes("postal-code") || /zip|postal|邮编/.test(hint)) {
      return "zip";
    }
    if (ac.includes("country") || /country|国家/.test(hint)) {
      return "country";
    }
    if (tag === "textarea" || /message|comment|remark|描述|备注|留言|简介/.test(hint)) {
      return "longText";
    }
    if (tag === "select") {
      return "select";
    }
    return "shortText";
  }

  function valueForKind(kind, kit) {
    switch (kind) {
      case "email":
        return kit.email || "";
      case "phone":
        return kit.phone || "";
      case "url":
        return kit.url || "https://example.com";
      case "date":
        return kit.date || "";
      case "month":
        return kit.month || "";
      case "datetime":
        return kit.datetime || "";
      case "time":
        return kit.time || "10:30";
      case "number":
        return kit.number || "42";
      case "firstName":
        return kit.firstName || "Alex";
      case "lastName":
        return kit.lastName || "Tester";
      case "fullName":
        return kit.fullName || "Alex Tester";
      case "username":
        return kit.username || "oxfill_user";
      case "company":
        return kit.company || "0xFill Test Co";
      case "address":
        return kit.address || "123 Test Street";
      case "city":
        return kit.city || "Testville";
      case "state":
        return kit.state || "CA";
      case "zip":
        return kit.zip || "90210";
      case "country":
        return kit.country || "US";
      case "longText":
        return kit.longText || "This is sample text generated by 0xFill for form testing.";
      case "select":
        return kit.country || "US";
      case "shortText":
      default:
        return kit.shortText || "Test data";
    }
  }

  function collectCandidates(root) {
    const list = root.querySelectorAll("input, textarea, select, [contenteditable=''], [contenteditable='true']");
    return Array.from(list);
  }

  function resolveFormRoot(anchor) {
    if (anchor && typeof anchor.closest === "function") {
      const form = anchor.closest("form");
      if (form) return form;

      let node = anchor.parentElement;
      while (node && node !== document.documentElement) {
        const count = collectCandidates(node).filter(
          (el) => isSupportedField(el) && isVisible(el) && !isSensitiveField(el)
        ).length;
        if (count >= 2) return node;
        node = node.parentElement;
      }
    }
    return document.body || document.documentElement;
  }

  async function fillCurrentForm(anchor, kit) {
    const root = resolveFormRoot(anchor);
    const candidates = collectCandidates(root);
    const isCurrent = beginFillSession();
    let filled = 0;
    let skipped = 0;

    for (const el of candidates) {
      if (!isCurrent()) break;
      if (!isSupportedField(el)) continue;

      if (isCheckboxInput(el)) {
        if (!isCheckableVisible(el) || el.disabled) continue;
        if (checkCheckbox(el)) {
          filled += 1;
          await sleep(FILL_GAP_MS);
        }
        continue;
      }

      if (!isVisible(el)) continue;

      if (isSensitiveField(el)) {
        skipped += 1;
        continue;
      }

      const kind = classifyField(el);
      const value = valueForKind(kind, kit);
      if (!value && kind !== "select") {
        skipped += 1;
        continue;
      }

      const tag = (el.tagName || "").toLowerCase();
      if (tag === "select") {
        await fillSelectAnimated(el, value, isCurrent);
      } else if (tag === "input" || tag === "textarea") {
        await insertTextIntoInputOrTextarea(el, value, false, isCurrent);
      } else if (el.isContentEditable) {
        await insertTextIntoContentEditable(el, value, false, isCurrent);
      } else {
        skipped += 1;
        continue;
      }
      filled += 1;
      await sleep(FILL_GAP_MS);
    }

    return { filled, skipped };
  }

  function classifyCardField(el) {
    const id = String(el.id || "").toLowerCase();
    const name = String(el.getAttribute("name") || "").toLowerCase();
    const ac = String(el.getAttribute("autocomplete") || "").toLowerCase();
    const placeholder = String(el.getAttribute("placeholder") || "").toLowerCase();

    if (id === "firstname" || placeholder === "first name") return "firstName";
    if (id === "lastname" || placeholder === "last name") return "lastName";
    if (
      id === "fullname" ||
      name === "cc-name" ||
      ac === "cc-name" ||
      placeholder.includes("cardholder")
    ) {
      return "fullName";
    }
    if (
      id === "cardnumber" ||
      name === "cc-number" ||
      ac === "cc-number" ||
      placeholder.includes("card number")
    ) {
      return "cardNumber";
    }
    if (
      id === "expmonthyear" ||
      name === "cc-exp" ||
      ac === "cc-exp" ||
      /mm\s*\/\s*yy/.test(placeholder)
    ) {
      return "cardExp";
    }
    if (
      id === "cvv" ||
      name === "cc-csc" ||
      ac === "cc-csc" ||
      /cvv|cvc|csc/.test(id) ||
      /cvv|cvc/.test(placeholder)
    ) {
      return "cardCvv";
    }
    return null;
  }

  async function fillCardForm(kit) {
    const root =
      document.getElementById("payment-collect") ||
      document.querySelector(".payment-form") ||
      document.body;
    const candidates = collectCandidates(root);
    const isCurrent = beginFillSession();
    let filled = 0;

    for (const el of candidates) {
      if (!isCurrent()) break;
      if (!el || !el.isConnected || el.disabled) continue;
      if (!isVisible(el)) continue;

      const kind = classifyCardField(el);
      if (!kind) continue;
      const value = kit[kind];
      if (!value) continue;

      await insertTextIntoInputOrTextarea(el, value, false, isCurrent);
      filled += 1;
      await sleep(FILL_GAP_MS);
    }

    if (filled > 0) {
      showToast(tToast("fillCard", {
        filled,
        filledUnit: fieldUnit(filled)
      }));
    }
    return { filled };
  }

  function showToast(text) {
    const old = document.getElementById("oxfill-toast");
    if (old) old.remove();

    const toast = document.createElement("div");
    toast.id = "oxfill-toast";
    toast.textContent = text;
    Object.assign(toast.style, {
      position: "fixed",
      right: "16px",
      bottom: "16px",
      zIndex: "2147483647",
      maxWidth: "320px",
      padding: "10px 14px",
      borderRadius: "10px",
      background: "rgba(22, 163, 74, 0.95)",
      color: "#fff",
      fontSize: "13px",
      lineHeight: "1.4",
      boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      fontFamily: 'Segoe UI, PingFang SC, Microsoft YaHei, sans-serif'
    });
    document.documentElement.appendChild(toast);
    window.setTimeout(() => {
      toast.remove();
    }, 2600);
  }
}
