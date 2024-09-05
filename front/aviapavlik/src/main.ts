import { open_mainwindow } from './mainwindow.ts';
import { open_flightwindow } from './flightwindow.ts';
import { open_ticketwindow } from './ticketwindow.ts';
import { open_signwindow } from './signwindow.ts';
import { send_notification, hide_notification } from './utils.ts';

import './style.css';


let mainwindow_button: HTMLElement | null;
let flightwindow_button: HTMLElement | null;
let ticketwindow_button: HTMLElement | null;
let signwindow_button: HTMLElement | null;
let notification_button: HTMLElement | null;


window.addEventListener('DOMContentLoaded', () => {
    open_mainwindow();
    // open_flightwindow();
    // open_signwindow();

    if (sessionStorage.getItem('username') != null) {
        send_notification(`Вы вошли как: ${sessionStorage.getItem('username')}`)
    }

    mainwindow_button = document.querySelector('#mainwindow-button');
    flightwindow_button = document.querySelector('#flightwindow-button');
    ticketwindow_button = document.querySelector('#ticketwindow-button');
    signwindow_button = document.querySelector('#signwindow-button');
    notification_button = document.querySelector('#notification-text');

    mainwindow_button?.addEventListener('click', (e) => {
        e.preventDefault();
        open_mainwindow();
    });
    flightwindow_button?.addEventListener('click', (e) => {
        e.preventDefault();
        open_flightwindow();
    });
    ticketwindow_button?.addEventListener('click', (e) => {
        e.preventDefault();
        open_ticketwindow();
    });
    signwindow_button?.addEventListener('click', (e) => {
        e.preventDefault();
        open_signwindow();
    });
    notification_button?.addEventListener('click', (e) => {
        e.preventDefault();
        hide_notification();
    });
});
