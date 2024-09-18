from django.core.management.base import BaseCommand
from django.core.mail import send_mail


class Command(BaseCommand):
    help = "Отправить тестовое сообщение на почту"

    def add_arguments(self, parser):
        parser.add_argument("--mail", type=str)
        parser.add_argument("--subject", type=str)
        parser.add_argument("--message", type=str)

    def handle(self, *args, **options):
        subject = 'Тест'
        message = 'Тест'
        mail = 'larinenok03@gmail.com'

        if options['subject']:
            subject = options['subject']
        if options['message']:
            message = options['message']
        if options['mail']:
            mail = options['mail']

        send_mail(subject, message, 'olegins03@gmail.com', [mail])
