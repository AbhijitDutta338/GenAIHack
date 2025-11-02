import React, { useState, useRef, useEffect } from 'react';

const FounderChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! I'm your StartupMatch AI assistant. I can help you with:",
      options: [
        "💡 Improving your readiness score",
        "🎯 Finding the right VCs",
        "📊 Understanding metrics",
        "📄 Document preparation"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('readiness') || lowerMessage.includes('score')) {
      return {
        text: "To improve your readiness score:\n\n1. **Complete your profile** (70% target)\n   - Fill in all company details\n   - Add team information\n   - Update financial data\n\n2. **Upload key documents** (55% target)\n   - Pitch deck (most important!)\n   - Financial projections\n   - Product roadmap\n\n3. **Update metrics regularly** (62% target)\n   - MRR/ARR\n   - Growth rate\n   - Customer count\n\nWould you like specific tips on any of these?"
      };
    } else if (lowerMessage.includes('vc') || lowerMessage.includes('investor')) {
      return {
        text: "I can help you find the right VCs! Check out the **Recommended VCs** section on your dashboard.\n\nEach VC shows:\n- Match score based on your profile\n- Investment thesis fit\n- Typical check size\n- Portfolio companies\n\nPro tip: Focus on VCs with 75%+ match score first. They're most likely to be interested in your startup!"
      };
    } else if (lowerMessage.includes('metric') || lowerMessage.includes('mrr') || lowerMessage.includes('arr')) {
      return {
        text: "**Key Metrics Investors Look For:**\n\n💰 **MRR/ARR**: Monthly/Annual Recurring Revenue\n- Shows revenue stability\n- Update monthly\n\n📈 **Growth Rate**: Month-over-month growth\n- Target: 15-25% for seed stage\n- 10-15% for Series A+\n\n⏰ **Runway**: Months of cash remaining\n- Minimum: 12-18 months\n- Start raising when 6-9 months left\n\n👥 **Customer Count**: Total active users/customers\n- Shows market validation\n\nNeed help calculating any of these?"
      };
    } else if (lowerMessage.includes('document') || lowerMessage.includes('pitch') || lowerMessage.includes('deck')) {
      return {
        text: "**Essential Documents for Fundraising:**\n\n1. **Pitch Deck** (10-15 slides)\n   - Problem & Solution\n   - Market size\n   - Product demo\n   - Business model\n   - Team\n   - Financials\n   - Ask\n\n2. **Financial Model** (3-5 years)\n   - Revenue projections\n   - Expense breakdown\n   - Cash flow\n\n3. **One-Pager** (1 page summary)\n4. **Product Demo/Video**\n5. **Data Room** (for DD phase)\n\nClick the **Documents** button to upload yours!"
      };
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return {
        text: "Hello! 👋 How can I help you today?",
        options: [
          "💡 Improving readiness score",
          "🎯 Finding the right VCs",
          "📊 Understanding metrics",
          "📄 Document preparation"
        ]
      };
    } else if (lowerMessage.includes('thank')) {
      return {
        text: "You're welcome! Feel free to ask me anything else. Good luck with your fundraising! 🚀"
      };
    } else {
      return {
        text: "I can help you with:\n\n• Improving your readiness score\n• Finding matching VCs\n• Understanding key metrics\n• Preparing documents\n• Fundraising strategy\n\nWhat would you like to know more about?",
        options: [
          "💡 Readiness score tips",
          "🎯 VC matching",
          "📊 Metrics guidance",
          "📄 Document checklist"
        ]
      };
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputValue
    };
    setMessages(prev => [...prev, userMessage]);

    // Clear input
    setInputValue('');

    // Simulate bot thinking and response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: botResponse.text,
        options: botResponse.options
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleOptionClick = (option) => {
    const cleanOption = option.replace(/[💡🎯📊📄]/g, '').trim();
    setInputValue(cleanOption);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            fontSize: '28px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            zIndex: 999
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.1)';
            e.target.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
          }}
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '380px',
          height: '600px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 999
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🤖
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '16px' }}>AI Assistant</div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>Always here to help</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: '#f9fafb'
          }}>
            {messages.map((message) => (
              <div key={message.id} style={{ marginBottom: '16px' }}>
                {message.type === 'bot' ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      flexShrink: 0
                    }}>
                      🤖
                    </div>
                    <div>
                      <div style={{
                        backgroundColor: 'white',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        borderTopLeftRadius: '4px',
                        color: '#374151',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                        whiteSpace: 'pre-line'
                      }}>
                        {message.text}
                      </div>
                      {message.options && (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          marginTop: '12px'
                        }}>
                          {message.options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleOptionClick(option)}
                              style={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                color: '#374151',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f3f4f6';
                                e.target.style.borderColor = '#3b82f6';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'white';
                                e.target.style.borderColor = '#e5e7eb';
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      borderTopRightRadius: '4px',
                      fontSize: '14px',
                      maxWidth: '70%',
                      lineHeight: '1.5'
                    }}>
                      {message.text}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '16px',
            backgroundColor: 'white',
            borderTop: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                style={{
                  padding: '12px 20px',
                  backgroundColor: inputValue.trim() ? '#3b82f6' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FounderChatbot;
