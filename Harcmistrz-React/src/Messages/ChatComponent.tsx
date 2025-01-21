import { useEffect, useState } from "react";
import { getConversation, getUsersToChatWith, Message, sendMessage, UserDTO } from "../components/API/messages";
import { MainBox } from "../components/shared/main-box";
import { useApi } from "../ApiContext";

const ChatComponent = () => {
    const [usersList, setUsersList] = useState<UserDTO[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");

    const currentUserId = localStorage.getItem("id");
    const API_BASE_URL = useApi();

    const fetchUserToChat = async () => {
        try {
            const usersToChat = await getUsersToChatWith(API_BASE_URL);
            if (usersToChat) {
                setUsersList(usersToChat);
            }
        }
        catch (error) {
            console.error("Błąd pobierania listy użytkowników: " + error);
        }
    }

    useEffect(() => {
        if (currentUserId) {
            fetchUserToChat();
        }
    }, [currentUserId]);


    const fetchConversation = async (otherUserId: number) => {
        const respone = await getConversation(API_BASE_URL, otherUserId);
        if (respone) {
            setMessages(respone);
        }
    }

    const handleSelectUser = (user: UserDTO) => {
        setSelectedUser(user);
        fetchConversation(user.id);
    }

    const handleSendMessage = async () => {
        if (!selectedUser || !newMessage) {
            return;
        }

        const response = await sendMessage(API_BASE_URL, {
            recipientId: selectedUser.id,
            message: newMessage
        });

        if (response) {
            setMessages([...messages, response]);
            setNewMessage("");
        }
    }


    return (
        <MainBox>
        {/* Główny kontener strony (wyśrodkowany + maks. szerokość) */}
        <div className="mx-auto w-full max-w-screen-md p-4 flex flex-col md:flex-row gap-4">
          
          {/* LEWA SEKCJA: Lista użytkowników */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-md">
            <h3 className="p-4 text-lg font-semibold border-b">
              Lista użytkowników
            </h3>
            {usersList.length === 0 && (
              <p className="p-4 text-gray-500">
                Brak użytkowników do wyświetlenia.
              </p>
            )}
            {usersList.map((user) => (
              <div
                key={user.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedUser?.id === user.id ? "bg-blue-50" : ""
                }`}
                onClick={() => handleSelectUser(user)}
              >
                <span className="font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-sm text-gray-500 ml-2">({user.role})</span>
              </div>
            ))}
          </div>
  
          {/* PRAWA SEKCJA: Okno czatu */}
          <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col">
            {selectedUser ? (
              <>
                {/* Nagłówek (użytkownik) */}
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">
                    Rozmowa z: {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                </div>
  
                {/* Lista wiadomości (z możliwością przewijania) */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex mb-2 ${
                        msg.senderId === parseInt(currentUserId!)
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.senderId === parseInt(currentUserId!)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        <p className="break-words">{msg.message}</p>
                        <span className="text-xs opacity-75 block mt-1">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
  
                {/* Pole tekstowe + przycisk wysyłania */}
                <div className="p-4 border-t flex gap-2">
                  <input
                    type="text"
                    placeholder="Wpisz wiadomość"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Wyślij
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Wybierz użytkownika z listy, aby rozpocząć czat.
                </p>
              </div>
            )}
          </div>
        </div>
      </MainBox>
    )
}
export default ChatComponent;
