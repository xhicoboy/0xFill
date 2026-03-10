// content.js - 负责记录用户右键/聚焦的输入框，并在收到后台消息时将文本插入到该输入框中

let lastEditableElement = null;

// 判断一个元素是否为我们关心的可编辑元素（input/textarea 或 contenteditable）
function isEditableElement(el) {
  if (!el) return false;
  if (el.disabled || el.readOnly) return false;

  const tag = (el.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea") {
    return true;
  }

  if (el.isContentEditable) {
    return true;
  }

  return false;
}

// 监听 focus，记录最近一次获得焦点的可编辑元素
document.addEventListener(
  "focus",
  (event) => {
    const target = event.target;
    if (isEditableElement(target)) {
      lastEditableElement = target;
    }
  },
  true // 使用捕获阶段，能更早捕获到事件
);

// 监听 contextmenu（右键菜单弹出前），记录最近一次在其上右键的可编辑元素
document.addEventListener(
  "contextmenu",
  (event) => {
    const target = event.target;
    if (isEditableElement(target)) {
      lastEditableElement = target;
    }
  },
  true
);

// 处理来自 background.js 的填充消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== "fillText") {
    return;
  }

  const text = String(message.text ?? "");
  const insertMode = message.insertMode === true;  // 是否为插入模式

  // 优先使用我们记录的 lastEditableElement，其次尝试使用 document.activeElement
  let el = lastEditableElement || document.activeElement;
  if (!isEditableElement(el)) {
    return;
  }

  const tag = (el.tagName || "").toLowerCase();

  if (tag === "input" || tag === "textarea") {
    insertTextIntoInputOrTextarea(el, text, insertMode);
  } else if (el.isContentEditable) {
    insertTextIntoContentEditable(el, text, insertMode);
  }
});

// 在 input/textarea 中填充文本
// insertMode: true 表示插入模式（不覆盖原有内容），false 表示覆盖模式
function insertTextIntoInputOrTextarea(el, text, insertMode = false) {
  const value = el.value || "";

  if (insertMode) {
    // 插入模式：在光标位置插入文本，如果没有光标则在末尾追加
    const start = typeof el.selectionStart === "number" ? el.selectionStart : value.length;
    const end = typeof el.selectionEnd === "number" ? el.selectionEnd : value.length;

    const before = value.slice(0, start);
    const after = value.slice(end);

    el.value = before + text + after;

    // 设置光标位置到插入文本之后
    const newCursorPos = start + text.length;
    try {
      el.setSelectionRange(newCursorPos, newCursorPos);
    } catch (e) {
      // 某些类型 input 可能不支持 selectionRange，忽略即可
    }
  } else {
    // 覆盖模式：直接覆盖整个内容
    el.value = text;
    
    // 设置光标位置到文本末尾
    const newCursorPos = text.length;
    try {
      el.setSelectionRange(newCursorPos, newCursorPos);
    } catch (e) {
      // 某些类型 input 可能不支持 selectionRange，忽略即可
    }
  }

  // 触发 input 事件，以便页面上的框架/监听器可以感知到值的变化
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

// 在 contenteditable 元素中填充文本
// insertMode: true 表示插入模式（不覆盖原有内容），false 表示覆盖模式
function insertTextIntoContentEditable(el, text, insertMode = false) {
  el.focus();

  if (insertMode) {
    // 插入模式：在光标处插入文本
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // 如果没有光标，在末尾追加
      el.innerText += text;
    } else {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      // 将光标移动到插入文本之后
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    // 覆盖模式：直接覆盖整个内容
    el.innerText = text;
  }

  // 触发 input 事件
  el.dispatchEvent(new Event("input", { bubbles: true }));
}


