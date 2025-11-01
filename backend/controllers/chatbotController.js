const conversations = new Map();

exports.sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user?._id?.toString() || 'guest_' + Date.now();
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    const msg = message.toLowerCase();
    let response = '';

    // Smart responses based on keywords
    if (msg.includes('date') || msg.includes('today')) {
      const today = new Date().toLocaleDateString('en-IN', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      response = `📅 Today is ${today}`;
    }
    else if (msg.includes('fee') || msg.includes('payment') || msg.includes('pay')) {
      response = "💰 **Fee Information**\n\nTo check your fees:\n1. Go to Fee Management module\n2. View your total fees, paid amount, and dues\n3. Make online payments\n4. Download receipts\n\nNeed help with payment? Contact accounts@college.edu";
    } 
    else if (msg.includes('exam') || msg.includes('test') || msg.includes('result') || msg.includes('grade')) {
      response = "📝 **Examination Details**\n\nFor exam information:\n1. Visit Examination Management module\n2. Check exam schedules\n3. View results and grades\n4. Download hall tickets\n\nGood luck with your exams! 🎓";
    }
    else if (msg.includes('application') || msg.includes('admission') || msg.includes('pending')) {
      response = "🎓 **Check Pending Application**\n\nTo check your application status:\n1. Go to Student Admission module\n2. Enter your application ID\n3. View current status\n4. Upload any pending documents\n\nApplication tracking: admissions@college.edu";
    }
    else if (msg.includes('hostel') || msg.includes('room')) {
      response = "🏠 **Hostel Information**\n\nHostel services:\n1. Check room allocation in Hostel Management\n2. Request maintenance\n3. View hostel rules\n4. Contact warden\n\nHostel Warden: hostel@college.edu";
    }
    else if (msg.includes('library') || msg.includes('book')) {
      response = "📚 **Library Services**\n\nLibrary features:\n1. Search books in Library Management\n2. Check issued books\n3. Renew borrowings\n4. Pay fines online\n\nLibrary hours: 8 AM - 8 PM";
    }
    else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      response = "👋 Hello! I'm your Campus ERP AI Assistant.\n\nI can help you with:\n• Fees & Payments 💰\n• Examinations 📝\n• Applications 🎓\n• Hostel 🏠\n• Library 📚\n\nWhat do you need help with?";
    }
    else if (msg.includes('help')) {
      response = "🤖 **How I Can Help**\n\nI can assist you with:\n• 💰 Fee Management - 'Check my fees'\n• 📝 Examinations - 'Exam schedule'\n• 🎓 Admissions - 'Pending application'\n• 🏠 Hostel - 'Room details'\n• 📚 Library - 'Borrow books'\n\nJust ask me anything!";
    }
    else {
      response = "I can help you with:\n\n💰 **Fees** - 'Check my fees'\n📝 **Exams** - 'Exam schedule'\n🎓 **Admissions** - 'Application status'\n🏠 **Hostel** - 'Room details'\n📚 **Library** - 'Borrow books'\n\nWhat do you need help with?";
    }

    // Store conversation
    const convId = conversationId || `${userId}_${Date.now()}`;
    let history = conversations.get(convId) || [];
    history.push({ role: 'user', message, timestamp: Date.now() });
    history.push({ role: 'assistant', message: response, timestamp: Date.now() });
    if (history.length > 20) history = history.slice(-20);
    conversations.set(convId, history);

    res.json({
      success: true,
      data: {
        message: response,
        conversationId: convId,
        timestamp: Date.now()
      }
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Chatbot service error'
    });
  }
};

exports.getConversationHistory = async (req, res) => {
  try {
    const { conversationId } = req.query;
    const history = conversations.get(conversationId) || [];
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};