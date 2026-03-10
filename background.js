// 所有电话号码的数据源（单一来源）
const phoneItems = [
  { id: "phone_US", title: "🇺🇸: +1 202-555-0125", value: "+1 202-555-0125" },
  { id: "phone_HK", title: "🇭🇰: +852 6123 4567", value: "+852 6123 4567" },
  { id: "phone_TW", title: "🇹🇼: +886 912 345 678", value: "+886 912 345 678" },
  { id: "phone_JP", title: "🇯🇵：+81 90 1234 5678", value: "+81 90 1234 5678" },
  { id: "phone_TH", title: "🇹🇭: +66 81 234 5678", value: "+66 81 234 5678" },
  { id: "phone_FR", title: "🇫🇷: +33 6 12 34 56 78", value: "+33 6 12 34 56 78" }
];

// 从 phoneItems 构建一个 id -> value 的映射，供菜单点击时使用
const phoneValueMap = phoneItems.reduce((map, item) => {
  map[item.id] = item.value;
  return map;
}, {});

// 创建全部右键菜单
chrome.runtime.onInstalled.addListener(() => {
  // 根菜单
  chrome.contextMenus.create({
    id: "root_quick_test_data",
    title: "0xFill - 快速填充",
    contexts: ["editable"]
  });

  // 随机测试邮箱（直接点击生成，无子菜单）
  chrome.contextMenus.create({
    id: "email_random",
    parentId: "root_quick_test_data",
    title: "E-mail",
    contexts: ["editable"]
  });

  // 子菜单：随机文案
  chrome.contextMenus.create({
    id: "text_root",
    parentId: "root_quick_test_data",
    title: "Random Text",
    contexts: ["editable"]
  });

  // 随机文案选项：100字符和200字符
  chrome.contextMenus.create({
    id: "text_100",
    parentId: "text_root",
    title: "100 Characters",
    contexts: ["editable"]
  });

  chrome.contextMenus.create({
    id: "text_200",
    parentId: "text_root",
    title: "200 Characters",
    contexts: ["editable"]
  });

  // 子菜单：多国测试号码
  chrome.contextMenus.create({
    id: "phone_root",
    parentId: "root_quick_test_data",
    title: "Phone Number",
    contexts: ["editable"]
  });

  // 每个国家对应一个子菜单项（基于 phoneItems）
  for (const item of phoneItems) {
    chrome.contextMenus.create({
      id: item.id,
      parentId: "phone_root",
      title: item.title,
      contexts: ["editable"]
    });
  }

});

// 在右键菜单被点击时触发
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab || !tab.id) return;

  const menuId = info.menuItemId;

  let textToInsert = "";

  // 如果是电话号码菜单
  if (menuId in phoneValueMap) {
    textToInsert = phoneValueMap[menuId];
  }

  // 如果是随机字母邮箱
  if (menuId === "email_random") {
    textToInsert = generateRandomEmail();
  }

  // 如果是随机文案（100字符）
  if (menuId === "text_100") {
    textToInsert = generateRandomText(100);
  }

  // 如果是随机文案（200字符）
  if (menuId === "text_200") {
    textToInsert = generateRandomText(200);
  }

  if (!textToInsert) return;

  // 判断是否为插入模式（随机文案需要插入，不覆盖）
  const isInsertMode = menuId === "text_100" || menuId === "text_200";

  // 把要填充的文本发送给当前标签页的 content script
  // 使用 callback 捕获错误，避免出现 “Receiving end does not exist” 未捕获异常
  chrome.tabs.sendMessage(
    tab.id,
    {
      type: "fillText",
      text: textToInsert,
      insertMode: isInsertMode  // 标记是否为插入模式
    },
    () => {
      // 在某些页面（如 chrome://、扩展管理页等）不会注入 content script
      // 此时 sendMessage 会报错，但属于预期情况，这里直接忽略即可
      if (chrome.runtime.lastError) {
        // console.debug('0xFill sendMessage error:', chrome.runtime.lastError.message);
      }
    }
  );
});

// 生成形如 0x_abc123@test.com 的邮箱（6 位随机字母数字）
function generateRandomEmail() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let rand = "";
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    rand += chars[idx];
  }
  return `0x_${rand}@test.com`;
}

// 生成随机英文句子（指定长度）
function generateRandomText(length) {
  // 常用英文单词库
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
  const maxSentences = length < 150 ? 3 : 6; // 100字符约3句，200字符约6句

  while (text.length < length && sentenceCount < maxSentences) {
    // 生成一个句子（3-8个单词）
    const wordCount = Math.floor(Math.random() * 6) + 3;
    const sentence = [];
    
    for (let i = 0; i < wordCount; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      sentence.push(randomWord);
    }

    // 首字母大写，添加句号
    const sentenceText = sentence.join(" ");
    const capitalizedSentence = sentenceText.charAt(0).toUpperCase() + sentenceText.slice(1) + ".";

    // 如果不是第一句，添加空格
    if (text.length > 0) {
      text += " ";
    }

    text += capitalizedSentence;
    sentenceCount++;

    // 如果已经超过目标长度，截断
    if (text.length > length) {
      text = text.substring(0, length);
      // 确保以句号结尾，如果被截断则移除最后一个不完整的单词
      const lastPeriod = text.lastIndexOf(".");
      if (lastPeriod > length * 0.7) {
        text = text.substring(0, lastPeriod + 1);
      } else {
        // 如果没有句号，找到最后一个空格并截断
        const lastSpace = text.lastIndexOf(" ");
        if (lastSpace > 0) {
          text = text.substring(0, lastSpace) + ".";
        }
      }
      break;
    }
  }

  // 如果还没达到目标长度，继续添加单词
  while (text.length < length) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const newText = text + " " + randomWord;
    if (newText.length <= length) {
      text = newText;
    } else {
      break;
    }
  }

  // 确保以句号结尾
  if (!text.endsWith(".")) {
    text += ".";
  }

  return text;
}


