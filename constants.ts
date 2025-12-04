// Access globals
const Category = (window as any).Category;

export const LOCALIZATION = {
  app_name: { 'zh-TW': '懶人語音記帳', 'en': 'LazyLedger' },
  home_today: { 'zh-TW': '總資產概覽', 'en': "Total Balance" }, 
  button_voice: { 'zh-TW': '語音記帳', 'en': 'Voice Input' },
  button_cancel: { 'zh-TW': '取消', 'en': 'Cancel' },
  button_save: { 'zh-TW': '儲存', 'en': 'Save' },
  button_restore: { 'zh-TW': '復原', 'en': 'Restore' },
  tab_home: { 'zh-TW': '首頁', 'en': 'Home' },
  tab_calendar: { 'zh-TW': '日曆', 'en': 'Calendar' },
  tab_tools: { 'zh-TW': '工具', 'en': 'Tools' },
  tab_stats: { 'zh-TW': '統計', 'en': 'Stats' },
  tab_settings: { 'zh-TW': '設定', 'en': 'Settings' },
  type_expense: { 'zh-TW': '支出', 'en': 'Expense' },
  type_income: { 'zh-TW': '收入', 'en': 'Income' },
  hero_income: { 'zh-TW': '收入', 'en': 'Income' },
  hero_expense: { 'zh-TW': '支出', 'en': 'Expense' },
  status_active: { 'zh-TW': '記帳中', 'en': 'Active' },
  label_items: { 'zh-TW': '筆', 'en': 'items' },
  tool_trash: { 'zh-TW': '垃圾桶', 'en': 'Trash Bin' },
  tool_subs: { 'zh-TW': '訂閱管理', 'en': 'Subscriptions' },
  tool_travel: { 'zh-TW': '旅行模式', 'en': 'Travel Mode' },
  trash_empty: { 'zh-TW': '垃圾桶是空的', 'en': 'Trash is empty' },
  trash_auto_delete: { 'zh-TW': '項目將在 48 小時後永久刪除', 'en': 'Items deleted permanently after 48h' },
  sub_title: { 'zh-TW': '固定訂閱', 'en': 'Recurring' },
  sub_add: { 'zh-TW': '新增訂閱', 'en': 'Add Subscription' },
  sub_cycle_monthly: { 'zh-TW': '每月', 'en': 'Monthly' },
  travel_active: { 'zh-TW': '旅行中', 'en': 'On Trip' },
  travel_set: { 'zh-TW': '設定旅行', 'en': 'Set Trip' },
  travel_total: { 'zh-TW': '旅費總計', 'en': 'Trip Total' },
  voice_listening: { 'zh-TW': '請說話...', 'en': 'Listening...' },
  voice_processing: { 'zh-TW': 'AI 分析中...', 'en': 'AI Processing...' },
  voice_hint: { 'zh-TW': '試試：「薪水入帳五萬」或「午餐一百」', 'en': 'Try: "Salary 5000" or "Lunch 100"' },
  voice_error: { 'zh-TW': '聽不清楚，請重試', 'en': 'Could not understand, please try again' },
  stats_weekly: { 'zh-TW': '本週趨勢', 'en': 'Weekly Trend' },
  stats_monthly: { 'zh-TW': '本月總覽', 'en': 'Monthly Overview' },
  stats_insight_title: { 'zh-TW': 'AI 財務分析', 'en': 'AI Financial Insight' },
  stats_categories: { 'zh-TW': '消費類別', 'en': 'Categories' },
  stats_top: { 'zh-TW': '前', 'en': 'Top' },
  stats_no_data: { 'zh-TW': '尚無支出資料', 'en': 'No expense data recorded' },
  settings_language: { 'zh-TW': '語言 / Language', 'en': 'Language' },
  settings_sound: { 'zh-TW': '按鈕音效風格', 'en': 'Button Sound Style' },
  settings_theme: { 'zh-TW': '主題模式', 'en': 'Theme Mode' },
  settings_reset: { 'zh-TW': '清除所有資料', 'en': 'Reset All Data' },
  theme_light: { 'zh-TW': '淺色', 'en': 'Light' },
  theme_dark: { 'zh-TW': '深色', 'en': 'Dark' }
};

export const SOUND_STYLES = {
  glass: { 'en': 'Soft Glass Tap', 'zh-TW': '柔和玻璃敲擊' },
  digital: { 'en': 'Digital Pulse', 'zh-TW': '數位脈衝' },
  thump: { 'en': 'Haptic Thump', 'zh-TW': '低頻觸感' },
  clean: { 'en': 'Clean Click', 'zh-TW': '清脆點擊' },
  bubble: { 'en': 'Bubble Pop', 'zh-TW': '泡泡彈跳' },
  air: { 'en': 'Minimal Air Whisper', 'zh-TW': '極簡氣音' },
  pixel: { 'en': 'Retro Pixel Beep', 'zh-TW': '復古像素音' },
  chime: { 'en': 'Luxury Chime', 'zh-TW': '高質感風鈴' },
  wood: { 'en': 'Wooden Tick', 'zh-TW': '木質點擊' },
  spark: { 'en': 'Energetic Spark', 'zh-TW': '電光火花音' },
  mute: { 'en': 'No Sound', 'zh-TW': '無音效' }
};

export const CATEGORY_LABELS = {
  [Category.Food]: { 'zh-TW': '食物', 'en': 'Food' },
  [Category.Clothing]: { 'zh-TW': '衣服', 'en': 'Clothing' },
  [Category.Housing]: { 'zh-TW': '居住', 'en': 'Housing' },
  [Category.Transportation]: { 'zh-TW': '交通', 'en': 'Trans' },
  [Category.Entertainment]: { 'zh-TW': '娛樂', 'en': 'Fun' },
  [Category.Shopping]: { 'zh-TW': '購物', 'en': 'Shop' },
  [Category.Essentials]: { 'zh-TW': '必需品', 'en': 'Needs' },
  [Category.Others]: { 'zh-TW': '其他', 'en': 'Others' },
  [Category.Salary]: { 'zh-TW': '薪水', 'en': 'Salary' },
  [Category.Investment]: { 'zh-TW': '投資', 'en': 'Invest' },
  [Category.Gift]: { 'zh-TW': '禮金', 'en': 'Gift' },
  [Category.SideHustle]: { 'zh-TW': '副業', 'en': 'Side Job' },
};

export const CATEGORY_COLORS = {
    [Category.Food]: 'bg-orange-500',
    [Category.Clothing]: 'bg-pink-500',
    [Category.Housing]: 'bg-blue-500',
    [Category.Transportation]: 'bg-indigo-500',
    [Category.Entertainment]: 'bg-purple-500',
    [Category.Shopping]: 'bg-red-500',
    [Category.Essentials]: 'bg-teal-500',
    [Category.Others]: 'bg-gray-500',
    [Category.Salary]: 'bg-yellow-500',
    [Category.Investment]: 'bg-green-500',
    [Category.Gift]: 'bg-rose-500',
    [Category.SideHustle]: 'bg-cyan-500',
};

export const CATEGORY_ICONS = {
    [Category.Food]: '🍜',
    [Category.Clothing]: '👕',
    [Category.Housing]: '🏠',
    [Category.Transportation]: '🚕',
    [Category.Entertainment]: '🎮',
    [Category.Shopping]: '🛍️',
    [Category.Essentials]: '🧻',
    [Category.Others]: '📄',
    [Category.Salary]: '💰',
    [Category.Investment]: '📈',
    [Category.Gift]: '🎁',
    [Category.SideHustle]: '⚡️',
};

export const MOCK_INITIAL_DATA = [
  { id: '1', item: '午餐', amount: 120, timestamp: new Date().toISOString(), category: Category.Food, type: 'expense' },
  { id: '2', item: '捷運', amount: 35, timestamp: new Date().toISOString(), category: Category.Transportation, type: 'expense' },
  { id: '3', item: '薪水', amount: 50000, timestamp: new Date(Date.now() - 86400000).toISOString(), category: Category.Salary, type: 'income' },
];

(window as any).LOCALIZATION = LOCALIZATION;
(window as any).SOUND_STYLES = SOUND_STYLES;
(window as any).CATEGORY_LABELS = CATEGORY_LABELS;
(window as any).CATEGORY_COLORS = CATEGORY_COLORS;
(window as any).CATEGORY_ICONS = CATEGORY_ICONS;
(window as any).MOCK_INITIAL_DATA = MOCK_INITIAL_DATA;