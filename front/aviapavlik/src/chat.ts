import { HOST_URL } from "./utils";

interface SenderMessage {
    senderId: string;
    message: string;
}

interface Sender {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
}

interface Message {
    content: string;
    sender: Sender;
    updated_at: string;
    messageId: number;
    file: string|null;
}


export class Chat {
    private socket: WebSocket;
    private chat_messages: HTMLElement;
    private message_input: HTMLInputElement;

    constructor(socket_url: string, chat_messages_id: string, message_input_id: string) {
        // Инициализация переменных
        this.socket = new WebSocket(socket_url);
        this.chat_messages = document.getElementById(chat_messages_id) as HTMLElement;
        this.message_input = document.getElementById(message_input_id) as HTMLInputElement;

        // Настройка обработчиков событий для WebSocket
        this.socket.onopen = this.on_open.bind(this);
        this.socket.onmessage = this.on_message.bind(this);
        this.socket.onclose = this.on_close.bind(this);
        this.socket.onerror = this.on_error.bind(this);

        // Настройка обработчика для отправки сообщений
        document.getElementById("send-message-button")?.addEventListener("click", () => {
            this.send_message();
        });

        this.message_input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                this.send_message();
            }
        });

        this.fetch_chat_history();
    }

    private on_open() {
        console.log("Соединение с WebSocket установлено.");
    }

    private on_message(event: MessageEvent) {
        const data: Message = JSON.parse(event.data);
        this.display_message(data);
    }

    private on_close() {
        console.log("Соединение с WebSocket закрыто.");
    }

    private on_error(error: Event) {
        console.error("Ошибка WebSocket:", error);
    }

    private send_message() {
        const message_text = this.message_input.value.trim();
        if (sessionStorage.getItem('user_id')) {
            if (message_text) {
                // Формируем сообщение и отправляем его
                const message: SenderMessage = {
                    senderId: sessionStorage.getItem('user_id')!,
                    message: message_text,
                };
                this.socket.send(JSON.stringify(message));
                this.message_input.value = ''; // Очищаем поле ввода
            }
        }
    }

    private display_message(message: Message) {
        // Создаем элементы для сообщения
        const message_element = document.createElement("div");
        message_element.classList.add("message");

        const username_element = document.createElement("div");
        username_element.classList.add("username");
        username_element.textContent = message.sender.username;

        const text_element = document.createElement("div");
        text_element.classList.add("content");
        text_element.textContent = message.content;

        const time_element = document.createElement("div");
        time_element.classList.add("time");
        // time_element.textContent = new Date(message.updated_at).toLocaleTimeString();
        const date = new Date(message.updated_at);
        const day = String(date.getDate()).padStart(2, '0'); // День с ведущим нулем
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц с ведущим нулем (месяцы начинаются с 0)
        const hours = String(date.getHours()).padStart(2, '0'); // Часы с ведущим нулем
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Минуты с ведущим нулем

        time_element.textContent = `${day}.${month} ${hours}:${minutes}`;

        // Добавляем элементы в DOM
        message_element.appendChild(username_element);
        message_element.appendChild(text_element);
        message_element.appendChild(time_element);
        this.chat_messages.appendChild(message_element);
        this.chat_messages.scrollTop = this.chat_messages.scrollHeight;
    }

    private async fetch_chat_history() {
        try {
            const response = await fetch(HOST_URL + 'api/chats/1/messages/', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('access'),
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error("Ошибка при загрузке истории сообщений");
            }
            const messages = await response.json();
            messages.forEach((message: Message) => {
                this.display_message(message);
            });
        } catch (error) {
            console.error("Ошибка:", error);
        }
    }
}
