import { Chat } from './chat.ts';


export async function open_chatwindow() {
    if (!sessionStorage.getItem('username')) {
        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div class="mainwindow-container">
            <div class="flex-column-center">
                <h1>Чтобы подключиться к чату, необходимо авторизироваться</h1>
            </div>
        </div>
        `;

        return;
    }

    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div class="main-chat-container">
    <div class="flex-column-center">
        <div class="chat-container">
            <div class="chat-messages flex-column-center" id="chat-messages">
            </div>

            <div class="chat-input">
                <input type="text" id="message-input" placeholder="Напишите сообщение...">
                <button id="send-message-button">Отправить</button>
            </div>
        </div>
    </div>
    </div>
    `;

    const socket_url = 'ws://127.0.0.1:8000/ws/chat/1/?token=' + sessionStorage.getItem('access');
    new Chat(socket_url, 'chat-messages', 'message-input');
}
