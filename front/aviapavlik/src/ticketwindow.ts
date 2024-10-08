import { TicketObj, UserObj, FlightObj, TicketButton, HOST_URL } from './utils.ts'


export async function delete_ticket(ticket_id: string) {
    try {
        const response = await fetch(HOST_URL + 'api/tickets/change/', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('access'),
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({'ticket_id': ticket_id}),
        });

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }

        const result = await response.json();
        const result_s = JSON.stringify(result);
        let result_json: UserObj[] = JSON.parse(result_s);
        console.log(result_json);

        open_ticketwindow();
    } catch (error) {
        console.log('unexpected error: ', error);
    }
}

export async function open_ticketwindow() {
    try {
        let current_user = '';
        let is_staff = false;
        let data = '';

        if (sessionStorage.getItem('username')) {
            current_user = sessionStorage.getItem('username')!;

            const response_user = await fetch(HOST_URL + 'api/users/find/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({'username': current_user}),
            });

            if (!response_user.ok) {
                throw new Error(`Error! status: ${response_user.status}`);
            }

            const result_user = await response_user.json();
            const result_s_user = JSON.stringify(result_user);
            let result_json_user: UserObj[] = JSON.parse(result_s_user);

            is_staff = result_json_user[0].is_staff;
        } else {
            throw new Error('Не авторизован');
        }

        const response_ticket = await fetch(HOST_URL + 'api/tickets/list/', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response_ticket.ok) {
            throw new Error(`Error! status: ${response_ticket.status}`);
        }

        const result_ticket = await response_ticket.json();
        const result_s_ticket = JSON.stringify(result_ticket);
        let result_json_ticket: TicketObj[] = JSON.parse(result_s_ticket);

        if (result_json_ticket.length == 0) {
            data = `
            <div class="mainwindow-container">
                <div class="flex-column-center">
                    <h1>Билетов нет</h1>
                </div>
            </div>
            `;
        }

        let buttons: TicketButton[] = [];

        for (let i = 0; i < result_json_ticket.length; i++) {
            if (!is_staff) {
                if (result_json_ticket[i].user != current_user) {
                    continue;
                }
            }

            const response_flight = await fetch(HOST_URL + 'api/flights/find/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({'flight_id': result_json_ticket[i].flight}),
            });

            if (!response_flight.ok) {
                throw new Error(`Error! status: ${response_flight.status}`);
            }

            const result_flight = await response_flight.json();
            const result_s_flight = JSON.stringify(result_flight);
            let result_json_flight: FlightObj[] = JSON.parse(result_s_flight);

            let date = result_json_flight[0].departure_date;
            let _date = date.split('T');
            let _time = _date[1].split('+');
            _date = _date[0].split('-');
            _time = _time[0].split(':');
            date = `${_date[2]}-${_date[1]}-${_date[0]} ${_time[0]}:${_time[1]}`;

            const response_user = await fetch(HOST_URL + 'api/users/find/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({'username': result_json_ticket[i].user}),
            });

            if (!response_user.ok) {
                throw new Error(`Error! status: ${response_user.status}`);
            }

            const result_user = await response_user.json();
            const result_s_user = JSON.stringify(result_user);
            let result_json_user: UserObj[] = JSON.parse(result_s_user);

            data += `
            <table class="flight-table">
                <tr>
                    <th>Владелец билета</th>
                    <th>${String(result_json_user[0].last_name)} ${String(result_json_user[0].first_name)} ${String(result_json_user[0].patronymic)}</th>
                </tr>
                <tr>
                    <th>Место прибытия</th>
                    <th>${String(result_json_flight[0].place_of_arrival)}</th>
                </tr>
                <tr>
                    <th>Место отправления</th>
                    <th>${String(result_json_flight[0].place_of_departure)}</th>
                </tr>
                <tr>
                    <th>Название авиакомпании</th>
                    <th>${String(result_json_flight[0].airline_name)}</th>
                </tr>
                <tr>
                    <th>Количестов мест</th>
                    <th>${String(result_json_flight[0].number_of_passengers)}</th>
                </tr>
                <tr>
                    <th>Дата отправления</th>
                    <th>${String(date)}</th>
                </tr>
                <tr>
                    <th>Идентификатор билета</th>
                    <th colspan=2>${String(result_json_ticket[i].ticket_id)}</th>
                </tr>
                <tr>
                    <th colspan="3" style="text-align: center"><button class="mainwindow-button-submit ticket-${i}" id="flightwindow-button-submit">Отменить билет</button></th>
                </tr>
            </table>
            `;

            buttons.push({id: '.ticket-' + i, ticket_id: result_json_ticket[i].ticket_id} as TicketButton);
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
                    delete_ticket(buttons[i].ticket_id);
                });
            }
        }
    } catch (error) {
        console.log('unexpected error: ', error);

        document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div class="mainwindow-container">
            <div class="flex-column-center">
                <h1>Билетов нет</h1>
            </div>
        </div>
        `;
    }
}
