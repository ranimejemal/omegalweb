import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id: string;
  text: string;
  sender_id: string;
  room_id: string;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  is_active: boolean;
}

export const createChatRoom = async (user1Id: string, user2Id: string) => {
  const { data, error } = await supabase
    .from('chat_rooms')
    .insert({
      user1_id: user1Id,
      user2_id: user2Id,
      is_active: true
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const findAvailableUser = async (currentUserId: string, interests: string[] = []) => {
  // This is a simplified matching algorithm
  // In a real app, you'd want more sophisticated matching
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('user_id')
    .neq('user_id', currentUserId)
    .limit(10);

  if (error) throw error;
  
  if (profiles && profiles.length > 0) {
    // Return a random user for now
    const randomIndex = Math.floor(Math.random() * profiles.length);
    return profiles[randomIndex].user_id;
  }
  
  return null;
};

export const sendMessage = async (roomId: string, senderId: string, text: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      room_id: roomId,
      sender_id: senderId,
      text: text
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const subscribeToMessages = (roomId: string, callback: (message: ChatMessage) => void) => {
  return supabase
    .channel(`chat_room_${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        callback(payload.new as ChatMessage);
      }
    )
    .subscribe();
};