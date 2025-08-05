import axios from 'axios';
 
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
 
type ChatHistory = { role: 'user' | 'model'; parts: { text: string }[] }[];

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  id: string;
}

export interface ArticleDetail {
    markdown: string;
    imageUrl: string;
}
 
const curatedImageMap: { [key: string]: string } = {
  'default': 'https://images.pexels.com/photos/3985325/pexels-photo-3985325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'sunscreen': 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'hydration': 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'acne': 'https://images.pexels.com/photos/8122396/pexels-photo-8122396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'cleansing': 'https://images.pexels.com/photos/3762464/pexels-photo-3762464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'retinol': 'https://images.pexels.com/photos/7262988/pexels-photo-7262988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'labels': 'https://images.pexels.com/photos/7262403/pexels-photo-7262403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
};

 
export const getGeminiChatResponse = async (
  history: ChatHistory,
  newMessage: string
): Promise<string> => {
  try {
    const payload = {
      contents: [...history, { role: 'user', parts: [{ text: newMessage }] }],
      systemInstruction: {
        parts: [{
          text: "You are 'Dermacare AI', a helpful and knowledgeable assistant specializing in dermatology and skincare. Provide clear, concise, and safe information. Always include a disclaimer that your advice is not a substitute for professional medical consultation. Do not provide dosage information for prescriptions. Format your responses using Markdown for better readability."
        }]
      }
    };
    const response = await axios.post(API_URL, payload);
    const botResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!botResponse) {
      return "I'm sorry, I couldn't generate a response. Please try again.";
    }
    return botResponse;
  } catch (error) {
    console.error('Error calling Gemini API for chat:', error);
    return "I'm having trouble connecting to my knowledge base right now. Please check your internet connection and try again.";
  }
};
 
export const getNewQuizQuestions = async (
  language: 'English' | 'Amharic',
  answeredQuestionIds: string[]
): Promise<QuizQuestion[] | null> => {
  const prompt = `
    You are a helpful quiz generator.
    Your task is to generate 15 unique, multiple-choice questions about general skincare knowledge.
    The questions should be in the ${language} language.
    Topics should be diverse: ingredients (retinol, vitamin C), sunscreen facts, cleansing methods, common skin myths.
    IMPORTANT: Your response MUST be ONLY a valid JSON array of objects. Do NOT include "json" or markdown fences.
    Each object must have keys: "question", "options" (an array of exactly 4 strings), and "correct_answer".
  `;
  try {
    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });
    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) throw new Error("AI response was empty.");
    const allGeneratedQuestions: Omit<QuizQuestion, 'id'>[] = JSON.parse(responseText);
    if (!Array.isArray(allGeneratedQuestions)) throw new Error("Parsed response is not an array.");
    const newQuestions = allGeneratedQuestions
      .map(q => ({ ...q, id: (q.question.length + q.options.join('').length).toString() }))
      .filter(q => !answeredQuestionIds.includes(q.id));
    return newQuestions.slice(0, 5);
  } catch (error) {
    console.error("Error fetching or parsing quiz questions:", error);
    return null;
  }
};
 
export const getArticleDetail = async (
  topicId: string,
  language: 'English' | 'Amharic'
): Promise<ArticleDetail> => {
  const prompt = `
    You are a helpful assistant for a skin health app.
    TASK: Provide a detailed article and a single, relevant keyword for the topic: "${topicId}".
    The article must be in the ${language} language.
    RULES:
    1. Your response MUST be ONLY a valid JSON object.
    2. The JSON object must have two keys: "markdown" and "keyword".
    3. The "markdown" value must be a single string containing the full article, formatted with Markdown.
    4. The "keyword" value must be a single, lowercase English word that best represents the topic (e.g., "sunscreen", "acne", "hydration", "retinol").
  `;
  try {
    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" },
    });
    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) throw new Error("AI response was empty.");
    const parsedResponse = JSON.parse(responseText);
    const keyword = parsedResponse.keyword || 'default';
    const imageUrl = curatedImageMap[keyword] || curatedImageMap['default'];
    return {
        markdown: parsedResponse.markdown || "Details could not be fetched.",
        imageUrl: imageUrl
    };
  } catch (error) {
    console.error("Error fetching article detail:", error);
    return {
        markdown: "An error occurred while fetching details. Please check your connection and try again.",
        imageUrl: curatedImageMap['default']
    };
  }
};