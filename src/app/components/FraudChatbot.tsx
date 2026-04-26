import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, ShieldAlert, ShieldCheck, Send, Bot, AlertTriangle, ChevronDown, Lock, Search, Activity } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getTransactionHistory, TransactionEntry } from './walletUtils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isAlert?: boolean;
  isActionCard?: boolean;
  timestamp: Date;
  actionType?: 'freeze_card' | 'recent_activity' | 'spending_anomaly';
  transactions?: TransactionEntry[];
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'bot',
    text: 'Hello! I am your PaySphere Secure AI. I monitor your account 24/7 to prevent fraudulent activities. How can I assist you today?',
    timestamp: new Date(),
  }
];

const QUICK_ACTIONS = [
  { id: '1', label: 'Check Recent Activity', icon: Search },
  { id: '2', label: 'Freeze My Card', icon: Lock },
  { id: '3', label: 'Check For Anomalies', icon: Activity },
  { id: '4', label: 'Report Fraud', icon: AlertTriangle },
];

export function FraudChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [hasUnreadAlert, setHasUnreadAlert] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnreadAlert(false);
    }
  }, [messages, isOpen, isTyping]);

  // Simulate a fraud alert after 15 seconds of opening the app
  useEffect(() => {
    const timer = setTimeout(() => {
      const alertMsg: Message = {
        id: Date.now().toString(),
        sender: 'bot',
        text: '⚠️ URGENT: We detected an unusual transaction attempt of ₹25,000 at "Global Electronics". Did you authorize this?',
        isAlert: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, alertMsg]);
      if (!isOpen) {
        setHasUnreadAlert(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const processBotResponse = (userInput: string) => {
    setIsTyping(true);
    const lowerInput = userInput.toLowerCase();
    
    setTimeout(() => {
      let botResponse = 'I am analyzing your request to ensure your account security...';
      let actionType: Message['actionType'] = undefined;
      let transactions: TransactionEntry[] | undefined = undefined;
      let isAlert = false;
      
      if (lowerInput.includes('no') || lowerInput.includes('did not') || lowerInput.includes('block') || lowerInput.includes('unauthorized')) {
        botResponse = 'Understood. I have blocked the transaction of ₹25,000 and temporarily locked your card. Your funds are safe. Would you like me to issue a replacement card?';
        actionType = 'freeze_card';
      } else if (lowerInput.includes('yes') || lowerInput.includes('authorized') || lowerInput.includes('i did')) {
        botResponse = 'Thank you for confirming. I have marked this transaction as trusted and it will be processed shortly. Stay safe!';
      } else if (lowerInput.includes('fraud') || lowerInput.includes('scam') || lowerInput.includes('report')) {
        botResponse = 'I take fraud reports very seriously. Please do not share your OTP with anyone. I can freeze your account right now if you wish. Type "FREEZE" to confirm.';
        isAlert = true;
      } else if (lowerInput.includes('freeze')) {
        botResponse = 'Your account has been successfully frozen to prevent further unauthorized transactions. Please contact support at 1-800-PAY-SAFE to verify your identity and unfreeze it.';
        actionType = 'freeze_card';
      } else if (lowerInput.includes('recent') || lowerInput.includes('activity') || lowerInput.includes('history')) {
        const history = getTransactionHistory().slice(0, 3);
        if (history.length > 0) {
          botResponse = 'Here are your most recent transactions. Do you recognize all of these?';
          transactions = history;
          actionType = 'recent_activity';
        } else {
          botResponse = 'You currently have no recent transactions on record.';
        }
      } else if (lowerInput.includes('anomalies') || lowerInput.includes('anomaly') || lowerInput.includes('unusual')) {
        const history = getTransactionHistory();
        const largeTransactions = history.filter(t => t.amount > 5000);
        if (largeTransactions.length > 0) {
          botResponse = `I found ${largeTransactions.length} unusually large transaction(s) recently. Please review them carefully.`;
          transactions = largeTransactions.slice(0, 3);
          actionType = 'spending_anomaly';
          isAlert = true;
        } else {
          botResponse = 'I have scanned your recent activity. Good news! No anomalies or suspicious patterns were found.';
        }
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date(),
        actionType,
        transactions,
        isAlert
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    processBotResponse(userMsg.text);
  };

  const handleQuickAction = (actionLabel: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: actionLabel,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    processBotResponse(actionLabel);
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        className={cn(
          "fixed bottom-24 right-4 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95",
          hasUnreadAlert ? "bg-red-500 animate-pulse" : "bg-primary-600"
        )}
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {hasUnreadAlert ? (
          <ShieldAlert className="w-7 h-7 text-white" />
        ) : (
          <Bot className="w-7 h-7 text-white" />
        )}
        {hasUnreadAlert && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 border-2 border-white rounded-full"></span>
        )}
      </motion.button>

      {/* Chat Window Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.3 }}
            className="fixed bottom-0 right-0 left-0 sm:left-auto sm:right-4 sm:bottom-24 z-[70] w-full sm:w-[380px] h-[600px] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-surface-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-700 to-primary-900 p-4 text-white flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <ShieldCheck className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">PaySphere AI Secure</h3>
                  <p className="text-xs text-primary-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Actively monitoring
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-surface-50 p-4 overflow-y-auto flex flex-col gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex flex-col", msg.sender === 'user' ? "items-end" : "items-start")}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "max-w-[85%] rounded-2xl p-3 text-sm shadow-sm",
                      msg.sender === 'user' 
                        ? "bg-primary-600 text-white rounded-br-sm" 
                        : msg.isAlert
                          ? "bg-red-50 text-red-900 border border-red-200 rounded-bl-sm"
                          : "bg-white text-surface-800 border border-surface-200 rounded-bl-sm"
                    )}
                  >
                    {msg.isAlert && (
                      <div className="flex items-center gap-1.5 mb-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Security Alert
                      </div>
                    )}
                    <p className="leading-relaxed">{msg.text}</p>
                    
                    {/* Action Cards (Transactions) */}
                    {msg.transactions && msg.transactions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.transactions.map((tx, idx) => (
                          <div key={idx} className="bg-white/80 border border-surface-200 rounded-lg p-2 flex justify-between items-center text-xs shadow-sm">
                            <div>
                              <div className="font-bold text-surface-900">{tx.serviceName || tx.category}</div>
                              <div className="text-surface-500">{tx.date.split(',')[0]}</div>
                            </div>
                            <div className="font-bold text-red-600">-₹{tx.amount}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Cards (Frozen Card) */}
                    {msg.actionType === 'freeze_card' && (
                      <div className="mt-3 bg-red-100 border border-red-300 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center shrink-0">
                          <Lock className="w-4 h-4 text-red-700" />
                        </div>
                        <div className="text-xs text-red-800">
                          <strong>Card Locked</strong>
                          <div className="opacity-80">Your physical and virtual cards have been suspended.</div>
                        </div>
                      </div>
                    )}

                    <span className={cn(
                      "text-[10px] block mt-1.5 opacity-70",
                      msg.sender === 'user' ? "text-right text-primary-100" : "text-left text-surface-400"
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start">
                  <div className="bg-white border border-surface-200 rounded-2xl rounded-bl-sm p-4 shadow-sm flex items-center gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-surface-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-surface-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-surface-400 rounded-full" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (Chips) */}
            {messages[messages.length - 1]?.sender === 'bot' && !isTyping && (
              <div className="px-3 pb-3 bg-surface-50 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                {QUICK_ACTIONS.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.label)}
                    className="flex-shrink-0 flex items-center gap-1.5 bg-white border border-primary-200 text-primary-700 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm hover:bg-primary-50 transition-colors"
                  >
                    <action.icon className="w-3.5 h-3.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-surface-200 z-10">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask PaySphere AI..."
                  className="flex-1 bg-surface-100 border-transparent focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100 rounded-full px-4 py-2 text-sm transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors shrink-0 shadow-sm"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
