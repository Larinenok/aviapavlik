export interface FlightObj {
    flight_id: string;
    place_of_departure: string;
    place_of_arrival: string;
    airline_name: string;
    number_of_passengers: Number;
    departure_date: string;
}

export interface TicketObj {
    ticket_id: string;
    user: string;
    flight: string;
}

export interface UserObj {
    username: string;
    first_name: string;
    last_name: string;
    patronymic: string;
    is_staff: boolean;
}

export interface TokenObj {
    access: string;
    refresh: string;
    username: string;
}

export interface FlightButton {
    id: string;
    flight_id: string;
}

export interface TicketButton {
    id: string;
    ticket_id: string;
}


export const HOST_URL = 'http://127.0.0.1:8000/'


export async function get_token(username: string, password: string) {
    const response = await fetch(HOST_URL + 'api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({'username': username, 'password': password}),
    });

    if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    const result_s = JSON.stringify(result);
    let result_json: TokenObj = JSON.parse(result_s);

    sessionStorage.setItem('access', result_json.access);
    sessionStorage.setItem('refresh', result_json.refresh);
    sessionStorage.setItem('username', result_json.username);
}

export async function send_notification(text: string) {
    console.log(`notification: ${text}`)

    document.querySelector<HTMLDivElement>('#notification-container')!.setAttribute('class', `notification-container notification-container-animation-in`);
    document.querySelector<HTMLHRElement>('#notification-text')!.innerHTML = `${text}`;

    let counter = 4;
    let intervalId = setInterval(() => {
            counter = counter - 1;
            console.log(counter);
            if(counter === 0) {
                clearInterval(intervalId)
                hide_notification();
            }
        }, 1000);
}

export async function hide_notification() {
    document.querySelector<HTMLDivElement>('#notification-container')!.setAttribute('class', `notification-container notification-container-animation-out`);
}
