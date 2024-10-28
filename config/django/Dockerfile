FROM python:3.11-bullseye

ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app/avia

# Копируем файл requirements.txt
COPY ./back/avia/requirements.txt .

RUN pip3 install --no-cache-dir -r requirements.txt

COPY ./back/avia /app/avia

COPY ./back/avia/init-commands.sh /app/avia
RUN chmod +x /app/avia/init-commands.sh

WORKDIR /app/avia
ENTRYPOINT ["/app/avia/init-commands.sh"]
