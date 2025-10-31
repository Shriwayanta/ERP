const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const conversations = new Map();

const SYSTEM_PROMPT = `You are an AI assistant for Campus ERP system. Help with admissions, fees, hostel, exams, and library queries. Be helpful and concise.`;

exports.sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user._id.toString();
    
    const convId = conversationId || `${userId}_${Date.now()}`;
    let history = conversations.get(convId) || [];

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const conversationContext = history
      .map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.message}`)
      .join('\n');

    const fullPrompt = `${SYSTEM_PROMPT}\n\n${conversationContext}\n\nUser: ${message}\n\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    const aiMessage = result.response.text();

    history.push({ role: 'user', message, timestamp: Date.now() });
    history.push({ role: 'assistant', message: aiMessage, timestamp: Date.now() });
    
    if (history.length > 20) history = history.slice(-20);
    conversations.set(convId, history);

    res.json({
      success: true,
      data: {
        message: aiMessage,
        conversationId: convId,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'AI service error',
      error: error.message 
    });
  }
};