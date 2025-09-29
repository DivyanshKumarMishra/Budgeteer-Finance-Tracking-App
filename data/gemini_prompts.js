export const receipt_scan_prompt = `Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object`;

export const generateMonthlyReportPrompt = (stats, month) => {
  return `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: ₹${Number(stats.totalIncome)?.toFixed(2)}
    - Total Expenses: ₹${Number(stats.totalExpenses)?.toFixed(2)}
    - Net Income: ₹${Number(stats.totalIncome - stats.totalExpenses)?.toFixed(2)}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(
        ([category, amount]) => `${category}: ₹${Number(amount)?.toFixed(2)}`
      )
      .join(', ')}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;
};
