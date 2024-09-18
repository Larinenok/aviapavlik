import { FlightObj, TicketObj, FlightButton, HOST_URL } from './utils.ts'
import { open_ticketwindow } from './ticketwindow.ts';


async function create_ticket(username: string, flight_id: string) {
    try {
        const response = await fetch(HOST_URL + 'api/tickets/change/', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('access'),
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({'user': username, 'flight': flight_id}),
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        const result_s = JSON.stringify(result);
        let result_json: TicketObj[] = JSON.parse(result_s);

        console.log(result_json)
    } catch (error) {
        console.log('unexpected error: ', error);
    }
}


export async function open_flightwindow(place_of_departure = '', place_of_arrival = '') {
    try {
        const response = await fetch(HOST_URL + 'api/flights/list/', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        const result_s = JSON.stringify(result);
        let result_json: FlightObj[] = JSON.parse(result_s);
        let data = '';

        if (result_json.length == 0) {
            data = `
            <div class="mainwindow-container">
                <div class="flex-column-center">
                    <h1>Билетов нет</h1>
                </div>
            </div>
            `;
        }

        let buttons: FlightButton[] = [];

        for (let i = 0; i < result_json.length; i++) {
            if (place_of_departure != place_of_arrival) {
                if (
                    place_of_departure != result_json[i].place_of_departure ||
                    place_of_arrival != result_json[i].place_of_arrival
                ) {
                    console.log(place_of_departure, result_json[i].place_of_departure);
                    console.log(place_of_arrival, result_json[i].place_of_arrival);
                    continue;
                }
            }

            let date = result_json[i].departure_date;
            let _date = date.split('T');
            let _time = _date[1].split('+');
            _date = _date[0].split('-');
            _time = _time[0].split(':');
            date = `${_date[2]}-${_date[1]}-${_date[0]} ${_time[0]}:${_time[1]}`;

            data += `
            <table class="flight-table">
                <tr>
                    <th>Место отправления</th>
                    <th>${String(result_json[i].place_of_departure)}</th>
                </tr>
                <tr>
                    <th>Место прибытия</th>
                    <th>${String(result_json[i].place_of_arrival)}</th>
                </tr>
                <tr>
                    <th>Название авиакомпании</th>
                    <th>${String(result_json[i].airline_name)}</th>
                </tr>
                <tr>
                    <th>Количестов мест</th>
                    <th>${String(result_json[i].number_of_passengers)}</th>
                </tr>
                <tr>
                    <th>Дата отправления</th>
                    <th>${String(date)}</th>
                </tr>
                <tr>
                    <th colspan="3" style="text-align: center"><button class="mainwindow-button-submit ticket-${i}" id="flightwindow-button-submit">Купить билет</button></th>
                </tr>
            </table>
            `;

            buttons.push({id: '.ticket-' + i, flight_id: result_json[i].flight_id} as FlightButton);
        }

        if (data == '') {
            data = `
            <h2>Таких рейсов нет</h2>
            `;
        }

        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div class="flex-row-center">
            <div class="flex-column-center">
                ${data}
            </div>
        </div>
        `;

        if (sessionStorage.getItem('username')) {
            for (let i = 0; i < buttons.length; i++) {
                let ticket_button = document.querySelector<HTMLButtonElement>(buttons[i].id);

                ticket_button?.addEventListener('click', (e) => {
                    e.preventDefault();
                    create_ticket(sessionStorage.getItem('username')!, buttons[i].flight_id);
                });
            }
        }
    } catch (error) {
        console.log('unexpected error: ', error);

        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div class="mainwindow-container">
            <div class="flex-column-center">
                <h1>Ошибка получения данных</h1>
            </div>
        </div>
        `;
    }

    let flightwindow_button_submit = document.querySelectorAll<HTMLButtonElement>('#flightwindow-button-submit');

    for (let i = 0; i < flightwindow_button_submit.length; i++) {
        flightwindow_button_submit[i].addEventListener('click', (e) => {
            e.preventDefault();
            open_ticketwindow();
        });
    }
}
