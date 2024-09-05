import { open_flightwindow } from "./flightwindow";


export let mainwindow_button_submit: HTMLButtonElement | null;


export async function open_mainwindow() {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <div class="mainwindow-container">
        <div class="flex-column-center">
            <h1 class="mainwindow-placeholder">Покупка авиабилетов онлайн</h1>
            <div class="flex-row-center">
                <table class="mainwindow-table">
                    <tr>
                        <th>Место отправления</th>
                        <th>
                            <select id="mainwindow-departure">
                                <option>Томск</option>
                                <option>Москва</option>
                                <option>Санкт-Петербург</option>
                            </select>
                        </th>
                    </tr>
                    <tr>
                        <th>Место прибытия</th>
                        <th>
                            <select id="mainwindow-arrival">
                                <option>Москва</option>
                                <option>Санкт-Петербург</option>
                                <option>Томск</option>
                            </select>
                        </th>
                    </tr>
                    <tr>
                        <th colspan="3" style="text-align: center"><button class="mainwindow-button-submit" id="mainwindow-button-submit">Найти</button></th>
                    </tr>
                </table>
            </div>
        </div>
      </div>
    `;

    mainwindow_button_submit = document.querySelector('#mainwindow-button-submit');
    let mainwindow_departure = document.querySelector<HTMLSelectElement>('#mainwindow-departure');
    let mainwindow_arrival = document.querySelector<HTMLSelectElement>('#mainwindow-arrival');

    mainwindow_button_submit?.addEventListener('click', (e) => {
        e.preventDefault();
        open_flightwindow(mainwindow_departure?.value, mainwindow_arrival?.value);
    });
}
