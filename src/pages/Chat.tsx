import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/lib/auth";
import { findAvailableUser, createChatRoom, sendMessage, subscribeToMessages, ChatMessage } from "@/lib/chat";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'stranger';
  timestamp: Date;
  sender_id?: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatType, interests } = location.state || { chatType: 'text', interests: [] };
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatRoom, setChatRoom] = useState<any>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initializeChat = async () => {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/chat');
        return;
      }
      
      setCurrentUser(user);
      
      // Find available user to chat with
      try {
        const availableUserId = await findAvailableUser(user.id, interests);
        
        if (availableUserId) {
          // Create chat room
          const room = await createChatRoom(user.id, availableUserId);
          setChatRoom(room);
          setPartnerId(availableUserId);
          setIsConnecting(false);
          setIsConnected(true);
          
          // Subscribe to messages
          const subscription = subscribeToMessages(room.id, (message: ChatMessage) => {
            if (message.sender_id !== user.id) {
              const newMessage: Message = {
                id: message.id,
                text: message.text,
                sender: 'stranger',
                timestamp: new Date(message.created_at),
                sender_id: message.sender_id
              };
              setMessages(prev => [...prev, newMessage]);
            }
          });
          
          toast.success("Connected to a stranger!");
        } else {
          setIsConnecting(false);
          toast.error("No users available right now. Please try again later.");
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        setIsConnecting(false);
        toast.error("Failed to connect. Please try again.");
      }
    };
    
    initializeChat();
  }, [navigate, interests]);

  const sendUserMessage = async () => {
    if (!currentMessage.trim() || !isConnected || !chatRoom || !currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      sender_id: currentUser.id
    };

    setMessages(prev => [...prev, newMessage]);
    
    try {
      await sendMessage(chatRoom.id, currentUser.id, currentMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message");
    }
    
    setCurrentMessage("");
  };

  const handleDisconnect = async () => {
    if (chatRoom) {
      // Update room status
      await supabase
        .from('chat_rooms')
        .update({ is_active: false })
        .eq('id', chatRoom.id);
    }
    
    setIsConnected(false);
    setChatRoom(null);
    setPartnerId(null);
    toast.info("Chat ended");
  };

  const handleNewChat = async () => {
    if (chatRoom) {
      await supabase
        .from('chat_rooms')
        .update({ is_active: false })
        .eq('id', chatRoom.id);
    }
    
    setMessages([]);
    setChatRoom(null);
    setPartnerId(null);
    setIsConnecting(true);
    setIsConnected(false);
    
    // Find new user
    try {
      const availableUserId = await findAvailableUser(currentUser.id, interests);
      
      if (availableUserId) {
        const room = await createChatRoom(currentUser.id, availableUserId);
        setChatRoom(room);
        setPartnerId(availableUserId);
        setIsConnecting(false);
        setIsConnected(true);
        
        const subscription = subscribeToMessages(room.id, (message: ChatMessage) => {
          if (message.sender_id !== currentUser.id) {
            const newMessage: Message = {
              id: message.id,
              text: message.text,
              sender: 'stranger',
              timestamp: new Date(message.created_at),
              sender_id: message.sender_id
            };
            setMessages(prev => [...prev, newMessage]);
          }
        });
        
        toast.success("Connected to a new stranger!");
      } else {
        setIsConnecting(false);
        toast.error("No users available right now.");
      }
    } catch (error) {
      console.error('Error finding new chat:', error);
      setIsConnecting(false);
      toast.error("Failed to find new chat.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendUserMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border px-4 py-3 flex justify-between items-center bg-background">
          <div>
            <h1 className="text-lg font-bold text-primary">Omegle</h1>
            <p className="text-xs text-muted-foreground">
              {isConnecting ? "Looking for someone you can chat with..." : 
               isConnected ? "You're now chatting with a random stranger. Say hi!" : 
               "Not connected"}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleNewChat}
              disabled={isConnecting}
              className="text-xs px-2 py-1"
            >
              New
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDisconnect}
              disabled={!isConnected}
              className="text-xs px-2 py-1"
            >
              Stop
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
              className="text-xs px-2 py-1"
            >
              Home
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {isConnecting && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Looking for someone you can chat with...</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div key={message.id} className="text-sm">
                <div>
                  <span className={message.sender === 'user' ? 'text-primary font-medium' : 'text-destructive font-medium'}>
                    {message.sender === 'user' ? 'You:' : 'Stranger:'}
                  </span>
                  <span className="ml-2 text-foreground">{message.text}</span>
                </div>
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-border p-4 bg-background">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Say something..." : "Connect to start chatting"}
                disabled={!isConnected}
                className="flex-1 px-3 py-2 border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
              />
              <Button 
                onClick={sendUserMessage}
                disabled={!isConnected || !currentMessage.trim()}
                className="bg-primary hover:bg-primary-hover text-primary-foreground px-6"
              >
                Send
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {interests.length > 0 && `You both like: ${interests.join(", ")}`}
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="w-80 bg-muted p-4 border-l">
        <h3 className="font-semibold text-lg mb-4 text-foreground">Chat Tips</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="p-3 bg-background rounded">
            <h4 className="font-medium text-foreground mb-1">🛡️ Stay Safe</h4>
            <p>Never share personal information like your full name, address, or phone number.</p>
          </div>
          
          <div className="p-3 bg-background rounded">
            <h4 className="font-medium text-foreground mb-1">🤝 Be Respectful</h4>
            <p>Treat others with kindness and respect. Everyone deserves a positive experience.</p>
          </div>
          
          <div className="p-3 bg-background rounded">
            <h4 className="font-medium text-foreground mb-1">💬 Start Conversations</h4>
            <p>Ask open-ended questions about shared interests to keep the chat flowing.</p>
          </div>
          
          <div className="p-3 bg-background rounded">
            <h4 className="font-medium text-foreground mb-1">🚫 Report Issues</h4>
            <p>If someone makes you uncomfortable, disconnect immediately and report if needed.</p>
          </div>
          
          <div className="p-3 bg-background rounded">
            <h4 className="font-medium text-foreground mb-1">🎯 Premium Features</h4>
            <p>Upgrade to premium for country and gender filters for better matches.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;