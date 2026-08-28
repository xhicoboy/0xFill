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

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || !message.type) return;

    if (message.type === "fillText") {
      const text = String(message.text ?? "");
      const insertMode = message.insertMode === true;
      const el = takeArmedEditable();
      if (!el) {
        showToast("0xFill: Click an input field first, or choose “One Click Fill” from the context menu.");
        sendResponse({ ok: false });
        return;
      }
      fillElement(el, text, insertMode);
      sendResponse({ ok: true });
      return;
    }

    if (message.type === "fillForm") {
      const anchor =
        (isEditableElement(document.activeElement) && document.activeElement) ||
        document.body;

      const result = fillCurrentForm(anchor, message.kit || {});
      const filledLabel = `${result.filled} ${result.filled === 1 ? "field" : "fields"}`;
      const skippedLabel = `${result.skipped} ${result.skipped === 1 ? "field" : "fields"}`;
      showToast(`0xFill: Filled ${filledLabel}; skipped ${skippedLabel}.`);
      sendResponse({ ok: true, ...result });
      return;
    }

    if (message.type === "fillCard") {
      const result = fillCardForm(message.kit || {});
      sendResponse({ ok: true, ...result });
    }
  });

  globalThis.__oxfillFillCard = function (kit) {
    return fillCardForm(kit || {});
  };

  function takeArmedEditable() {
    if (isEditableElement(document.activeElement)) {
      return document.activeElement;
    }
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

  function fillElement(el, text, insertMode = false) {
    const tag = (el.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") {
      insertTextIntoInputOrTextarea(el, text, insertMode);
    } else if (el.isContentEditable) {
      insertTextIntoContentEditable(el, text, insertMode);
    } else if (tag === "select") {
      fillSelect(el, text);
    }
  }

  // insertMode: true = 在光标/选区处插入；false = 有选区则替换选区，否则整框覆盖
  function insertTextIntoInputOrTextarea(el, text, insertMode = false) {
    el.focus();

    const value = el.value || "";
    let start = typeof el.selectionStart === "number" ? el.selectionStart : value.length;
    let end = typeof el.selectionEnd === "number" ? el.selectionEnd : value.length;
    const hasSelection = start !== end;

    if (!insertMode && !hasSelection) {
      start = 0;
      end = value.length;
    }

    const nextValue = value.slice(0, start) + text + value.slice(end);
    setNativeValue(el, nextValue);

    const cursor = start + text.length;
    try {
      el.setSelectionRange(cursor, cursor);
    } catch (_e) {
      // number/email 等类型可能不支持 selectionRange
    }

    dispatchInputEvents(el);
  }

  function insertTextIntoContentEditable(el, text, insertMode = false) {
    el.focus();

    const selection = window.getSelection();
    const hasRange = selection && selection.rangeCount > 0;
    const range = hasRange ? selection.getRangeAt(0) : null;
    const hasSelection = Boolean(range && !range.collapsed);

    if (!insertMode && !hasSelection) {
      el.textContent = text;
      dispatchInputEvents(el);
      return;
    }

    if (!range) {
      el.appendChild(document.createTextNode(text));
      dispatchInputEvents(el);
      return;
    }

    range.deleteContents();
    const node = document.createTextNode(text);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    dispatchInputEvents(el);
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

  function fillCurrentForm(anchor, kit) {
    const root = resolveFormRoot(anchor);
    const candidates = collectCandidates(root);
    let filled = 0;
    let skipped = 0;

    for (const el of candidates) {
      if (!isSupportedField(el)) continue;

      if (isCheckboxInput(el)) {
        if (!isCheckableVisible(el) || el.disabled) continue;
        if (checkCheckbox(el)) filled += 1;
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
        fillSelect(el, value);
      } else if (tag === "input" || tag === "textarea") {
        insertTextIntoInputOrTextarea(el, value, false);
      } else if (el.isContentEditable) {
        insertTextIntoContentEditable(el, value, false);
      } else {
        skipped += 1;
        continue;
      }
      filled += 1;
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

  function fillCardForm(kit) {
    const root =
      document.getElementById("payment-collect") ||
      document.querySelector(".payment-form") ||
      document.body;
    const candidates = collectCandidates(root);
    let filled = 0;

    for (const el of candidates) {
      if (!el || !el.isConnected || el.disabled) continue;
      if (!isVisible(el)) continue;

      const kind = classifyCardField(el);
      if (!kind) continue;
      const value = kit[kind];
      if (!value) continue;

      insertTextIntoInputOrTextarea(el, value, false);
      filled += 1;
    }

    if (filled > 0) {
      showToast(`0xFill: Card form filled (${filled} ${filled === 1 ? "field" : "fields"}).`);
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
