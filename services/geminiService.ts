import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Difficulty, SQLProblem, Language, HintRequest, TableColumn } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is not set in environment variables.");
    throw new Error("API_KEY not configured. Please set the API_KEY environment variable.");
  }
  return apiKey;
};

let ai: GoogleGenAI | null = null;
try {
    ai = new GoogleGenAI({ apiKey: getApiKey() });
} catch (e) {
    // Error logged by getApiKey
}

const generateProblemPrompt = (difficulty: Difficulty, language: Language): string => {
  const langName = language === Language.PT ? "Portuguese" : "English";

  return `
You are an expert SQL problem generator for a learning application.
Your goal is to create diverse, educational, and high-quality SQL challenges.
The user has selected the difficulty level: ${difficulty}.
The problem should be presented entirely in ${langName}.

Please generate a single SQL problem.
The response MUST be a valid JSON object adhering EXACTLY to the following TypeScript interface structure:

interface SQLProblem {
  tableName: string; // e.g., "Products", "LibraryBooks", "FlightBookings". Use varied and realistic names.
  tableSchema: Array<{
    columnName: string; // e.g., "ProductID", "BookTitle", "FlightID"
    dataType: string; // e.g., "INTEGER PRIMARY KEY", "TEXT NOT NULL", "DATE", "DECIMAL(10,2)"
    description?: string; // A brief, clear description of the column in ${langName}. e.g., "Unique identifier for the product", "Title of the book"
  }>;
  sampleData?: Array<Record<string, string | number | boolean | null>>; // 2-4 rows of realistic sample data. Keys must match columnNames. Highly recommended for context.
  problemStatement: string; // The SQL question to be solved, written clearly in ${langName}. e.g., "List all books published after 2020 by authors from the USA."
  expectedSolution: string; // The single, correct, and executable SQL query to solve the problemStatement. Use generic SQL dialect (SQLite compatible). Use single quotes for string literals. No comments or explanations in this SQL string.
  difficulty: "${difficulty}"; // Echo back the provided difficulty.
}

General Guidelines for Quality:
- Problem Scenarios: Create problems for diverse domains (e-commerce, library, social media, HR). Avoid overly simplistic scenarios.
- Table Structures: Vary column count and types. Include primary keys. Implicit foreign keys are good (e.g., UserID in an Orders table).
- Data Variety: If sampleData is provided, ensure it's realistic and illustrative, covering potential edge cases relevant to the difficulty.
- Descriptions: Provide clear \`description\` for each column in \`tableSchema\` in ${langName}. This is crucial for the user.
- Problem Statement Clarity: Ensure the problem statement is unambiguous and directly leads to the expected solution.

Constraints for different difficulties:
- Easy: SELECT (specific columns, *), WHERE (simple conditions: >, <, =, LIKE, IN, BETWEEN, IS NULL), ORDER BY, LIMIT. Single table.
  Example (${langName}): "List the names and prices of products cheaper than $50, ordered by price descending."
- Medium: JOINs (INNER, LEFT), Aggregate functions (COUNT, SUM, AVG, MAX, MIN) with GROUP BY, HAVING. Subqueries (non-correlated) in WHERE/SELECT. Up to two tables.
  Example (${langName}): "Find the email addresses of customers who placed more than 3 orders."
- Advanced: Complex multi-table JOINs, Correlated subqueries, Window functions (ROW_NUMBER, RANK), CTEs. Complex aggregations, date/time or string functions.
  Example (${langName}): "For each department, identify the employee with the highest salary. Display department name, employee name, and salary."

Generate the SQL problem now. Difficulty: ${difficulty}. Language: ${langName}.

IMPORTANT:
1.  The entire output MUST be a single, valid JSON object.
2.  Do NOT wrap the JSON in markdown fences (like \`\`\`json ... \`\`\`).
3.  All string values within the JSON (especially in 'problemStatement', 'tableSchema.description', 'tableName', 'columnName', and 'sampleData' values if they are strings) MUST be correctly JSON-escaped. This means:
    - Double quotes (") inside strings must be escaped as \\".
    - Backslashes (\\) inside strings must be escaped as \\\\.
    - Newline characters inside strings must be escaped as \\n.
    - Tabs inside strings must be escaped as \\t.
    - Other control characters (like carriage returns \\r, form feeds \\f, backspaces \\b) must also be escaped.
    Example of a correctly escaped string: "This is a string with a \\"quote\\" and a newline\\ncharacter."
4.  \`tableSchema.description\` and \`problemStatement\` must be in ${langName}.
`;
};

export const generateSqlProblem = async (difficulty: Difficulty, language: Language): Promise<SQLProblem> => {
  if (!ai) throw new Error("Gemini AI client not initialized. Check API Key.");

  try {
    const prompt = generateProblemPrompt(difficulty, language);
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) jsonStr = match[2].trim();
    
    const parsedProblem: SQLProblem = JSON.parse(jsonStr);

    if (!parsedProblem.tableName || !parsedProblem.tableSchema || !parsedProblem.problemStatement || !parsedProblem.expectedSolution || !parsedProblem.difficulty) {
        throw new Error("Generated problem is missing required fields from AI.");
    }
    if (parsedProblem.difficulty !== difficulty) {
        console.warn(`Requested difficulty ${difficulty} but AI returned problem for ${parsedProblem.difficulty}. Using AI's version.`);
    }
    if (!Array.isArray(parsedProblem.tableSchema) || parsedProblem.tableSchema.some(col => !col.columnName || !col.dataType)) {
        throw new Error("Generated problem has invalid tableSchema structure from AI.");
    }
    return parsedProblem;

  } catch (error) {
    console.error("Error generating SQL problem with Gemini:", error);
    let errorMessage = "Failed to generate SQL problem from AI.";
    if (error instanceof Error) {
        errorMessage += ` Details: ${error.message}`;
        if (error.message.includes("API_KEY")) throw error;
    } else {
        errorMessage += ` Details: ${String(error)}`;
    }
    throw new Error(errorMessage);
  }
};


const generateHintPrompt = (hintRequest: HintRequest, language: Language): string => {
  const langName = language === Language.PT ? "Portuguese" : "English";
  const schemaString = hintRequest.tableSchema.map(col => `  - ${col.columnName} (${col.dataType})${col.description ? ': ' + col.description : ''}`).join('\\n');

  return `
You are an SQL teaching assistant. The user is working on an SQL problem and needs a hint.
The problem difficulty is: ${hintRequest.difficulty}.
The hint should be provided in ${langName}.

Problem Details:
Table Name: ${hintRequest.tableName}
Table Schema (descriptions in ${langName}):
${schemaString}
Problem Statement (in ${langName}): ${hintRequest.problemStatement}

Your task is to provide one concise, helpful hint in ${langName} that guides the user towards the solution WITHOUT giving away the full answer or specific SQL code.
The hint should be appropriate for the problem's difficulty level (${hintRequest.difficulty}).
Focus on:
- Suggesting a general SQL concept or clause that might be useful (e.g., "Consider how you might combine data from tables," or "Think about how to filter results after grouping.").
- Pointing to a key part of the problem statement they should focus on.
- AVOID phrases like "You should use..." or "The query needs...". Instead, use guiding questions or gentle suggestions like "It might be helpful to think about..." or "Have you considered...?".

The hint must be a single, short sentence or two.
Example hints (for different problems):
- Easy: "Remember to look at the condition for filtering product prices."
- Medium: "Think about which type of JOIN would be most appropriate to see all customers, even those without orders."
- Advanced: "Consider how window functions could help you rank items within categories."

Generate a single hint now in ${langName} for a ${hintRequest.difficulty} level problem.
The output should be a plain text string, not JSON.
`;
};

export const generateSqlHint = async (hintRequest: HintRequest, language: Language): Promise<string> => {
  if (!ai) throw new Error("Gemini AI client is not initialized. Check API Key.");

  try {
    const prompt = generateHintPrompt(hintRequest, language);
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        temperature: 0.6, 
        topP: 0.9,
        topK: 30,
      }
    });

    const hintText = response.text.trim();
    if (!hintText) {
      throw new Error("AI returned an empty hint.");
    }
    return hintText;

  } catch (error) {
    console.error("Error generating SQL hint with Gemini:", error);
    let errorMessage = "Failed to generate hint from AI.";
     if (error instanceof Error) {
        errorMessage += ` Details: ${error.message}`;
        if (error.message.includes("API_KEY")) throw error;
    } else {
        errorMessage += ` Details: ${String(error)}`;
    }
    throw new Error(errorMessage);
  }
};