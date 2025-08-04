import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage, ChatRoom } from '../../../types/chat';
import { chatService } from '../../../services/chat';

interface ChatState {
  messages: Record<number, ChatMessage[]>;
  chatRooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  isLoading: boolean;
  
  // Actions
  setMessages: (roomId: number, messages: ChatMessage[]) => void;
  addMessage: (roomId: number, message: ChatMessage) => void;
  setChatRooms: (rooms: ChatRoom[]) => void;
  setCurrentRoom: (room: ChatRoom | null) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: (roomId: number) => void;
  loadRoomMessages: (roomId: number) => Promise<void>;
}

// 클라이언트 사이드에서만 persist 미들웨어 사용
const createChatStore = () => {
  if (typeof window !== 'undefined') {
    return create<ChatState>()(
      persist(
        (set) => ({
          messages: {},
          chatRooms: [],
          currentRoom: null,
          isLoading: false,

          setMessages: (roomId, messages) => set((state) => ({ 
            messages: { ...state.messages, [roomId]: messages } 
          })),
          addMessage: (roomId, message) => set((state) => ({ 
            messages: { 
              ...state.messages, 
              [roomId]: [...(state.messages[roomId] || []), message] 
            } 
          })),
          setChatRooms: (rooms) => set({ chatRooms: rooms }),
          setCurrentRoom: (room) => set({ currentRoom: room }),
          setLoading: (loading) => set({ isLoading: loading }),
          clearMessages: (roomId) => set((_state) => ({ 
            messages: { ..._state.messages, [roomId]: [] } 
          })),
          
          // 채팅방 메시지 로드 함수 추가
          loadRoomMessages: async (roomId: number) => {
            console.log(`Loading messages for room ${roomId}...`);
            set({ isLoading: true });
            
            try {
              // 백엔드에서 메시지 요청
              const messages = await chatService.getChatMessages(roomId);
              console.log(`Loaded messages for room ${roomId}:`, messages);
              
              // 받은 메시지를 스토어에 저장
              if (messages && Array.isArray(messages)) {
                set((state) => ({ 
                  messages: { ...state.messages, [roomId]: messages } 
                }));
                console.log(`Stored ${messages.length} messages for room ${roomId}`);
              }
            } catch (error) {
              console.error(`Failed to load messages for room ${roomId}:`, error);
            } finally {
              set({ isLoading: false });
            }
          },
        }),
        {
          name: 'chat-storage', // localStorage 키 이름
          partialize: (state) => ({
            chatRooms: state.chatRooms,
            currentRoom: state.currentRoom,
            messages: state.messages, // 메시지도 저장하도록 변경
          }),
        }
      )
    );
  } else {
    // 서버 사이드에서는 persist 없이 생성
    return create<ChatState>()((set) => ({
      messages: {},
      chatRooms: [],
      currentRoom: null,
      isLoading: false,

      setMessages: (roomId, messages) => set((state) => ({ 
        messages: { ...state.messages, [roomId]: messages } 
      })),
      addMessage: (roomId, message) => set((state) => ({ 
        messages: { 
          ...state.messages, 
          [roomId]: [...(state.messages[roomId] || []), message] 
        } 
      })),
      setChatRooms: (rooms) => set({ chatRooms: rooms }),
      setCurrentRoom: (room) => set({ currentRoom: room }),
      setLoading: (loading) => set({ isLoading: loading }),
      clearMessages: (roomId) => set((state) => ({ 
        messages: { ...state.messages, [roomId]: [] } 
      })),
      
      loadRoomMessages: async (roomId: number) => {
        console.log(`Loading messages for room ${roomId}...`);
        set({ isLoading: true });
        
        try {
          // 백엔드에서 메시지 요청
          const messages = await chatService.getChatMessages(roomId);
          console.log(`Loaded messages for room ${roomId}:`, messages);
          
          // 받은 메시지를 스토어에 저장
          if (messages && Array.isArray(messages)) {
            set((state) => ({ 
              messages: { ...state.messages, [roomId]: messages } 
            }));
            console.log(`Stored ${messages.length} messages for room ${roomId}`);
          }
        } catch (error) {
          console.error(`Failed to load messages for room ${roomId}:`, error);
        } finally {
          set({ isLoading: false });
        }
      },
    }));
  }
};

export const useChatStore = createChatStore(); 