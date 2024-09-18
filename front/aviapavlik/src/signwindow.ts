import { get_token, HOST_URL, send_notification, UserObj } from './utils.ts'


export let signwindow_button_submit: HTMLButtonElement | null;
export let signup_button: HTMLElement | null;


export async function open_signwindow() {
    if (sessionStorage.getItem('username')) {
        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div class="mainwindow-container">
            <div class="flex-column-center">
                <h2>Вы уже вошли</h2>
                <button class="mainwindow-button-submit" id="signwindow-button-logout">Выйти</button>
            </div>
        </div>
        `;

        let signwindow_button_logout = document.querySelector('#signwindow-button-logout');
        signwindow_button_logout?.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.clear();
            open_signwindow();
        });

        return;
    }


    try {
        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div class="mainwindow-container">
            <div class="flex-column-center">
                <h2 class="signwindow-title">Вход</h2>
                <form>
                    <table class="mainwindow-table">
                        <tr>
                            <th>Username</th>
                            <th><input id="signwindow-input-username" required/ ></th>
                        </tr>
                        <tr>
                            <th>Password</th>
                            <th><input id="signwindow-input-password" required/ ></th>
                        </tr>
                        <tr>
                            <th colspan="3" style="text-align: center"><button class="mainwindow-button-submit" id="signwindow-button-submit" type="submit">Войти</button></th>
                        </tr>
                    </table>
                </form>
                <div class="no-clickable" id="signup-button" style="text-align: center">
                    <h2>Регистрация</h2>
                </div>
            </div>
        </div>
        `;
        signwindow_button_submit = document.querySelector('#signwindow-button-submit');

        signwindow_button_submit?.addEventListener('click', (e) => {
            e.preventDefault();

            let username = document.querySelector('#signwindow-input-username') as HTMLInputElement;
            let password = document.querySelector('#signwindow-input-password') as HTMLInputElement;

            if (username.value && password.value) {
                get_token(username.value, password.value).then(() =>{
                    send_notification(`Вы вошли как: ${sessionStorage.getItem('username')}`);
                    open_signwindow();
                }).catch(() => {
                    send_notification('Не верные данные');
                });
            } else {
                send_notification('Введите username и password');
            }
        });
        
        signup_button = document.querySelector('#signup-button');

        signup_button?.addEventListener('click', (e) => {
            e.preventDefault();

            document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
            <div class="mainwindow-container">
                <div class="flex-column-center">
                    <h2 class="signwindow-title">Регистрация</h2>
                    <form>
                        <table class="mainwindow-table">
                            <tr>
                                <th>Username *</th>
                                <th><input id="signupwindow-input-username" required/ ></th>
                            </tr>
                            <tr>
                                <th>Password *</th>
                                <th><input id="signupwindow-input-password" required/ ></th>
                            </tr>
                            <tr>
                                <th>Имя *</th>
                                <th><input id="signupwindow-input-first-name" required/ ></th>
                            </tr>
                            <tr>
                                <th>Фамилия *</th>
                                <th><input id="signupwindow-input-last-name" required/ ></th>
                            </tr>
                            <tr>
                                <th>Отчество</th>
                                <th><input id="signupwindow-input-patronymic"/ ></th>
                            </tr>
                            <tr>
                                <th colspan="3" style="text-align: center"><button class="mainwindow-button-submit" id="signupwindow-button-submit" type="submit">Зарегистрироваться</button></th>
                            </tr>
                        </table>
                    </form>
                    <div class="no-clickable" id="signinwindow-button" style="text-align: center">
                        <h2>Вход</h2>
                    </div>
                </div>
            </div>
            `;

            let signinwindow_button = document.querySelector('#signinwindow-button');
            signinwindow_button?.addEventListener('click', (e) => {
                e.preventDefault();
                open_signwindow();
            });
            let signupwindow_button_submit = document.querySelector('#signupwindow-button-submit');
            signupwindow_button_submit?.addEventListener('click', (e) => {
                e.preventDefault();

                let username = document.querySelector('#signupwindow-input-username') as HTMLInputElement;
                let password = document.querySelector('#signupwindow-input-password') as HTMLInputElement;
                let first_name = document.querySelector('#signupwindow-input-first-name') as HTMLInputElement;
                let last_name = document.querySelector('#signupwindow-input-last-name') as HTMLInputElement;
                let patronymic = document.querySelector('#signupwindow-input-patronymic') as HTMLInputElement;

                console.log(username.value, password.value, first_name.value, last_name.value, patronymic.value);
                if (!patronymic.value) {
                    patronymic.value = '';
                }

                if (username.value && password.value && first_name.value && last_name.value) {
                    register(username.value, password.value, first_name.value, last_name.value, patronymic.value).then(() => {
                        send_notification('Успешная регистрация');
                        open_signwindow();
                    }).catch(() => {
                        send_notification('Ошибка регистрации');
                    });
                } else {
                    send_notification('Введите все обязательные данные')
                }
            });
        });
    } catch (error) {
        console.log('unexpected error: ', error);

        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div class="mainwindow-container">
            <div class="flex-column-center">
                <h1>Ошибка входа</h1>
            </div>
        </div>
        `;
    }
}

export async function register(username: string, password: string, first_name: string, last_name: string, patronymic: string) {
    const response = await fetch(HOST_URL + 'api/users/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({'username': username, 'password': password, 'first_name': first_name, 'last_name': last_name, 'patronymic': patronymic}),
    });

    if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    const result_s = JSON.stringify(result);
    let result_json: UserObj = JSON.parse(result_s);

    console.log(result_json);
}
