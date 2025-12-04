import { GoogleGenAI, Type } from "@google/genai";
// Access globals
const Category = (window as any).Category;
const CATEGORY_LABELS = (window as any).CATEGORY_LABELS;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const FAST_MODEL = 'gemini-2.5-flash';
const SMART_MODEL = 'gemini-3-pro-preview';

// Helper to get category label safely
const getCatLabel = (cat) => CATEGORY_LABELS[cat]?.['en'] || cat;

export const parseExpenseVoiceInput = async (text) => {
  try {
    const prompt = `
    You are an intelligent accountant. 
    Parse the user voice input into a structured transaction object.
    User Input: "${text}"
    Rules:
    1. Extract item name.
    2. Extract amount (number).
    3. DETERMINISTICALLY Identify type: 'expense' or 'income'.
       - Keywords for Income: "salary", "bonus", "profit", "sold", "received", "dividend", "薪水", "收入", "賺", "股息".
       - Default to 'expense' if unclear.
    4. Infer the BEST Category from the Category Enum based on the type.
    5. Provide 1-3 alternative plausible categories if the primary one is ambiguous or if others might fit.
    6. Return JSON.
    Current Date: ${new Date().toISOString()}
    `;

    const response = await ai.models.generateContent({
      model: FAST_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            item: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            type: { type: Type.STRING, enum: ['expense', 'income'] },
            category: { type: Type.STRING, enum: Object.keys(Category) },
            alternativeCategories: { type: Type.ARRAY, items: { type: Type.STRING, enum: Object.keys(Category) } }
          },
          required: ["item", "amount", "category", "type"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    if (result.item && result.amount) {
      return {
        transaction: {
          item: result.item,
          amount: result.amount,
          type: result.type,
          category: result.category,
          timestamp: new Date().toISOString()
        },
        alternatives: (result.alternativeCategories || [])
      };
    }
    return null;

  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return null;
  }
};

export const generateSpendingInsight = async (transactions) => {
  if (transactions.length === 0) return null;

  try {
    const validTrans = transactions.filter(t => !t.deletedAt);
    const totalIncome = validTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = validTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const catTotals = {};
    validTrans.filter(t => t.type === 'expense').forEach(t => {
        catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });
    const topCategoryEntry = Object.entries(catTotals).sort((a: any, b: any) => b[1] - a[1])[0];
    const topCategory = topCategoryEntry ? `${getCatLabel(topCategoryEntry[0])} ($${topCategoryEntry[1]})` : 'None';

    const recentHistory = validTrans
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 15)
        .map(e => `[${e.type}] ${e.item}: $${e.amount} (${getCatLabel(e.category)})`)
        .join('; ');

    const prompt = `
    Role: Personal Financial Advisor for a mobile app "LazyLedger".
    Financial Context:
    - Total Income: $${totalIncome}
    - Total Expense: $${totalExpense}
    - Net Balance: $${balance}
    - Top Expense Category: ${topCategory}
    - Recent Activity: ${recentHistory}
    Task:
    Provide a concise, insightful, and friendly financial summary (1-2 sentences).
    Output Format: JSON with "zh" (Traditional Chinese, Taiwan phrasing) and "en".
    `;

    const response = await ai.models.generateContent({
      model: SMART_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            zh: { type: Type.STRING, description: "Traditional Chinese insight" },
            en: { type: Type.STRING, description: "English insight" }
          },
          required: ["zh", "en"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    if (result.zh && result.en) {
        return {
            zh: result.zh,
            en: result.en,
            timestamp: Date.now()
        };
    }
    return null;

  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return {
        zh: "目前無法連接 AI 分析，請稍後再試。",
        en: "AI analysis is currently unavailable. Please try again later.",
        timestamp: Date.now()
    };
  }
};

(window as any).parseExpenseVoiceInput = parseExpenseVoiceInput;
(window as any).generateSpendingInsight = generateSpendingInsight;