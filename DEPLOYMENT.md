# StreetForge: деплой на VPS

Гайд для **Ubuntu 24.04 LTS**, Nginx, PHP-FPM 8.4 и SQLite. Проект: `/var/www/streetforge`, ветка `main`, репозиторий [SHENiiDEV/streetforge](https://github.com/SHENiiDEV/streetforge.git).

Пример домена — `streetforge.co.uk`. Если домен другой, замените его во всех командах, `.env` и Nginx-конфиге. Для Debian установка PHP отличается: Ubuntu PPA туда добавлять нельзя.

Сценарий рассчитан на новый VPS. Если сайт уже работает, переходите к разделу «Обновление»: не клонируйте репозиторий поверх существующей установки и не пересоздавайте базу или `APP_KEY`.

## 1. Подготовка сервера

Нужен пользователь с `sudo`. A-запись домена должна указывать на IPv4 VPS; AAAA добавляйте только при работающем IPv6. В firewall сервера и панели VPS откройте HTTP/HTTPS и сохраните доступ к вашему SSH-порту. Отдельный сервер базы данных не нужен.

Установка пакетов, включая сторонний [PHP PPA Ondřej Surý](https://launchpad.net/~ondrej/+archive/ubuntu/php):

```bash
sudo apt update
sudo apt install -y software-properties-common ca-certificates curl git unzip acl nginx sqlite3
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update
sudo apt install -y php8.4-cli php8.4-fpm php8.4-sqlite3 php8.4-mbstring php8.4-xml php8.4-curl php8.4-zip php8.4-bcmath php8.4-gd php8.4-intl composer
sudo update-alternatives --set php /usr/bin/php8.4
sudo systemctl enable --now nginx php8.4-fpm
php8.4 -v
composer --version
```

Сборке Vite нужен современный Node.js. Здесь устанавливается Node.js 24 через репозиторий [NodeSource](https://github.com/nodesource/distributions):

```bash
curl -fsSL https://deb.nodesource.com/setup_24.x -o /tmp/streetforge-node-setup.sh
sudo bash /tmp/streetforge-node-setup.sh
sudo apt install -y nodejs
node --version
npm --version
```

Создайте пользователя деплоя, если его ещё нет:

```bash
sudo adduser deploy
sudo usermod -aG www-data deploy
sudo install -d -o deploy -g www-data -m 2755 /var/www/streetforge
```

PHP-FPM и очередь ниже работают от `www-data`; Git, Composer и npm — от `deploy`. Стандартный пул `/etc/php/8.4/fpm/pool.d/www.conf` должен использовать пользователя/группу `www-data` и сокет `/run/php/php8.4-fpm.sock`.

## 2. Клонирование проекта

Войдите в оболочку пользователя `deploy`:

```bash
sudo -iu deploy
cd /var/www/streetforge
git clone --branch main https://github.com/SHENiiDEV/streetforge.git .
cp .env.example .env
chmod 640 .env
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
composer check-platform-reqs --no-dev
```

Для приватного репозитория настройте отдельный read-only deploy key GitHub или безопасную авторизацию Git. Не записывайте токен в URL репозитория.

Дайте `www-data` доступ к записи только в runtime-каталоги. ACL также сохранят доступ `deploy` к созданным файлам:

```bash
mkdir -p storage/fonts
setfacl -R -m u:deploy:rwX,u:www-data:rwX storage bootstrap/cache
find storage bootstrap/cache -type d -exec setfacl -m d:u:deploy:rwx,d:u:www-data:rwx {} +
```

Не используйте `chmod -R 777` и не делайте весь код доступным для записи веб-серверу.

## 3. SQLite: существующая или новая база

В проекте используется SQLite. В этом гайде путь к файлу — `/var/www/streetforge/database/database.sqlite`, стандартное расположение Laravel. Если рабочая база уже находится в другом месте, сохраните её путь и подставьте его в `.env` и команды резервного копирования ниже.

**При переносе действующего сайта:** до миграций перенесите согласованную резервную копию существующей базы в этот путь, исходный `APP_KEY` и `storage/app`, включая инвойсы. Создавайте копию исходной базы командой `sqlite3 /путь/к/исходной/базе.sqlite ".backup '/путь/к/копии.sqlite'"`. Не копируйте только основной файл работающей базы обычным `cp`: свежие изменения могут находиться в WAL. Во время окончательного переноса остановите записи на исходном сайте и его очередь, чтобы после снимка не потерять новые платежи.

**Только для новой установки без существующих данных**, в оболочке `deploy`:

```bash
cd /var/www/streetforge
test -e database/database.sqlite || touch database/database.sqlite
```

Для новой и перенесённой базы настройте права из оболочки `deploy`:

```bash
cd /var/www/streetforge
chmod 660 database/database.sqlite
setfacl -m u:www-data:rw database/database.sqlite
setfacl -m u:www-data:rwx database
php8.4 -m | grep -E 'pdo_sqlite|sqlite3'
```

PHP-FPM и worker должны иметь право записи не только в файл, но и в его родительский каталог: SQLite создаёт рядом journal/WAL/SHM-файлы. Каталог `database` находится вне Nginx document root и не публикуется в интернете.

При переносе резервной копии через `sudo` сначала верните владельца файла: `sudo chown deploy:www-data /var/www/streetforge/database/database.sqlite`. Никогда не подменяйте рабочую базу пустым файлом и не добавляйте её в Git.

См. [настройку SQLite в Laravel](https://laravel.com/framework/docs/13.x/database#sqlite-configuration) и [CLI SQLite](https://www.sqlite.org/cli.html).

## 4. Настройка .env

От пользователя `deploy`:

```bash
cd /var/www/streetforge
nano .env
```

Основные параметры:

```dotenv
APP_NAME="StreetForge"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://streetforge.co.uk
APP_LOCALE=en
APP_FALLBACK_LOCALE=en

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=warning

DB_CONNECTION=sqlite
DB_DATABASE=/var/www/streetforge/database/database.sqlite
DB_FOREIGN_KEYS=true

SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
SESSION_DOMAIN=null
CACHE_STORE=database
QUEUE_CONNECTION=database
FILESYSTEM_DISK=public

COMPANY_NAME="YOUR_LEGAL_COMPANY_NAME"
COMPANY_NUMBER="YOUR_COMPANY_NUMBER"
COMPANY_ADDRESS="YOUR_REGISTERED_ADDRESS"
COMPANY_EMAIL="support@streetforge.co.uk"

MAIL_MAILER=smtp
MAIL_SCHEME=smtps
MAIL_HOST=mail.privateemail.com
MAIL_PORT=465
MAIL_USERNAME=support@streetforge.co.uk
MAIL_PASSWORD="YOUR_SMTP_PASSWORD"
MAIL_FROM_ADDRESS=support@streetforge.co.uk
MAIL_FROM_NAME="${COMPANY_NAME}"

COREFY_API_URL=https://api.sterling-pay.com
COREFY_ACCOUNT_ID="YOUR_ACCOUNT_ID"
COREFY_API_KEY="YOUR_API_KEY"
COREFY_WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET"
COREFY_SERVICE_CODE=payment_card_eur_hpp
COREFY_SIGNATURE_ALGORITHM=corefy
COREFY_LOG_ENABLED=true

VITE_APP_NAME="${APP_NAME}"
```

Удалите старый `DB_URL`, если он задан: он может переопределить выбранное соединение. Для SQLite параметры `DB_HOST`, `DB_PORT`, `DB_USERNAME` и `DB_PASSWORD` не нужны.

Впишите реальные юридические реквизиты: они попадут на сайт, в письма и PDF. Настройки SMTP выше относятся к PrivateEmail на порту 465; для другого провайдера используйте его настройки. Текущий `config/mail.php` читает `MAIL_SCHEME`, а не `MAIL_ENCRYPTION`.

`QUEUE_CONNECTION=database` переносит отправку писем в фоновую очередь. Её worker настраивается ниже. `sync` из `.env.example` для этого сценария заменяется.

Corefy работает в live-режиме, новые платежи — только EUR. API URL, service code и секрет подписи должны соответствовать вашему договору с провайдером. `APP_URL` должен быть публичным HTTPS-доменом без завершающего `/`.

**Только для совершенно новой установки** с пустым `APP_KEY`:

```bash
php8.4 artisan key:generate --force --no-interaction
```

При переносе или обновлении сохраняйте существующий ключ. `.env` не коммитится.

## 5. Сборка, база и начальные данные

В оболочке `deploy`:

```bash
cd /var/www/streetforge
npm ci --include=dev
npm run build
```

Vite находится в devDependencies, поэтому `npm ci --omit=dev` перед сборкой не подходит. На VPS не нужен постоянно работающий `npm run dev`.

Далее в административной оболочке:

```bash
cd /var/www/streetforge
sudo -u www-data php8.4 artisan migrate --force --no-interaction
sudo php8.4 artisan storage:link --no-interaction
sudo -u www-data php8.4 artisan optimize
```

`storage:link` выполняется с `sudo`, поскольку создаёт ссылку внутри `public`, где у `www-data` намеренно нет прав записи. Остальные runtime-команды выполняются от `www-data`.

Не запускайте `composer run setup`: этот сценарий предназначен для первоначальной разработки и включает генерацию ключа.

**Начальные игровые данные:** текущий `DatabaseSeeder` создаёт не только каталог машин и трасс, но и демо-аккаунты с известными паролями, балансы и примерные платежи. Не запускайте `db:seed` или `migrate --seed` на production. Для новой пустой базы до открытия игры нужно импортировать подготовленный игровой каталог либо добавить отдельный production-сидер без демо-пользователей и платежей. В текущем репозитории отдельного такого сидера нет. При переносе существующей рабочей базы каталог уже будет в перенесённом файле SQLite.

## 6. Nginx

Создайте файл `/etc/nginx/sites-available/streetforge`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name streetforge.co.uk;
    root /var/www/streetforge/public;
    index index.php;
    charset utf-8;

    access_log /var/log/nginx/streetforge-access.log;
    error_log /var/log/nginx/streetforge-error.log;
    client_max_body_size 10m;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PDF хранятся на public-диске, но выдаются только через Laravel с проверкой владельца.
    location ^~ /storage/invoices/ {
        return 404;
    }

    location ^~ /build/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /index.php {
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root/index.php;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_hide_header X-Powered-By;
        fastcgi_buffer_size 32k;
        fastcgi_buffers 8 32k;
        fastcgi_busy_buffers_size 64k;
    }

    location ~ \.php(?:/|$) {
        return 404;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt { access_log off; log_not_found off; }
}
```

Активируйте конфигурацию, если ссылки ещё нет:

```bash
sudo ln -s /etc/nginx/sites-available/streetforge /etc/nginx/sites-enabled/streetforge
sudo nginx -t
sudo systemctl reload nginx
```

Document root должен заканчиваться на `/public`. Настройка основана на [рекомендациях Laravel для Nginx](https://laravel.com/framework/docs/13.x/deployment#nginx).

## 7. HTTPS

После настройки DNS и открытия порта 80:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d streetforge.co.uk --redirect
sudo systemctl enable --now certbot.timer
sudo certbot renew --dry-run
```

Certbot добавит HTTPS и перенаправление HTTP → HTTPS. См. [документацию nginx-плагина Certbot](https://eff-certbot.readthedocs.io/en/stable/using.html#nginx).

Если нужен также `www`, сначала настройте его DNS, добавьте имя в `server_name`, затем запросите сертификат на оба имени. В `APP_URL` оставьте один выбранный основной домен.

При прямом подключении Nginx → PHP-FPM дополнительные настройки proxy не нужны. Если впереди CDN или reverse proxy, настройте доверенные прокси Laravel для его конкретных адресов и корректное определение HTTPS.

## 8. Постоянный worker очереди

Создайте `/etc/systemd/system/streetforge-queue.service`:

```ini
[Unit]
Description=StreetForge Laravel queue worker
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/streetforge
ExecStart=/usr/bin/php8.4 /var/www/streetforge/artisan queue:work database --queue=default --sleep=3 --tries=3 --backoff=30 --timeout=60 --max-time=3600
Restart=always
RestartSec=5
KillSignal=SIGTERM
TimeoutStopSec=120
UMask=0027

[Install]
WantedBy=multi-user.target
```

Запуск:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now streetforge-queue
sudo systemctl status streetforge-queue --no-pager
```

Очередь, таблицы `jobs` и `failed_jobs` уже предусмотрены миграциями. Worker завершает долгоживущий процесс раз в час, а systemd запускает его снова.

В `routes/console.php` сейчас нет периодических задач: cron для scheduler не требуется. Команда `payments:reconcile` запускается вручную.

## 9. Проверка запуска

```bash
curl -I https://streetforge.co.uk
curl -I https://streetforge.co.uk/up
sudo systemctl status php8.4-fpm nginx streetforge-queue --no-pager
```

В браузере проверьте вход, смену языка, профиль, каталог машин и страницу пополнения. При HTTPS cookie сессии должны сохраняться.

Для Corefy:

- Callback URL: `https://streetforge.co.uk/topup/webhook`.
- URL должен быть доступен провайдеру без Basic Auth и без challenge-страницы CDN.
- Запросы без корректной подписи возвращают 403 — это ожидаемо.
- Возврат с HPP сам по себе не подтверждает оплату: её подтверждает подписанный webhook и приватный API.
- Live-проверка с картой — реальное списание; выполняйте её отдельным осознанным действием.
- У Paid скачивается PDF, у Pending кнопки скачивания нет; ссылка на чужой инвойс недоступна.

Журналы:

```bash
sudo tail -n 100 /var/www/streetforge/storage/logs/laravel.log
sudo tail -n 100 /var/log/nginx/streetforge-error.log
sudo journalctl -u streetforge-queue -n 100 --no-pager
```

Диагностика Corefy — `storage/logs/corefy-YYYY-MM-DD.log`. Файлы имеют права 0600; просматривайте через `sudo`. Не публикуйте `.env`, файлы и резервные копии базы и журналы с персональными данными.

## 10. Обновление из main

Это простой деплой с коротким режимом обслуживания, без обещания zero downtime. Перед изменениями сохраните проверяемый бэкап SQLite, `.env` и `storage/app` вне web-root. Сохраните хеш текущего коммита. Не выполняйте `migrate:fresh`.

Перед обновлением проверьте в оболочке `deploy`:

```bash
cd /var/www/streetforge
git status --short
git rev-parse HEAD
git fetch origin
```

Рабочее дерево должно быть чистым. Затем в административной оболочке остановите приём запросов и worker, дождитесь его остановки:

```bash
cd /var/www/streetforge
sudo -u www-data php8.4 artisan down --retry=60
sudo systemctl stop streetforge-queue
```

В той же административной оболочке создайте резервную копию. Путь к исходной базе должен совпадать с `DB_DATABASE`:

```bash
STREETFORGE_BACKUP_DIR="/var/backups/streetforge/$(date -u +%Y%m%dT%H%M%SZ)"
sudo install -d -m 700 "$STREETFORGE_BACKUP_DIR"
sudo test -f /var/www/streetforge/database/database.sqlite
sudo sqlite3 /var/www/streetforge/database/database.sqlite ".backup '$STREETFORGE_BACKUP_DIR/database.sqlite'"
sudo sqlite3 "$STREETFORGE_BACKUP_DIR/database.sqlite" 'PRAGMA integrity_check;'
sudo cp /var/www/streetforge/.env "$STREETFORGE_BACKUP_DIR/.env"
sudo tar -C /var/www/streetforge -czf "$STREETFORGE_BACKUP_DIR/storage-app.tar.gz" storage/app
```

`integrity_check` должен вернуть `ok`. При любой ошибке остановитесь и не выполняйте миграции. Копию храните также вне VPS; доступ к ней ограничен владельцем каталога. Старые снимки не заменяются этим обновлением: для каждого создаётся отдельный каталог.


В оболочке `deploy` выполните последовательно, останавливаясь при первой ошибке:

```bash
cd /var/www/streetforge
git pull --ff-only origin main
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction
composer check-platform-reqs --no-dev
npm ci --include=dev
npm run build
```

Затем в административной оболочке:

```bash
cd /var/www/streetforge
sudo -u www-data php8.4 artisan config:clear
sudo -u www-data php8.4 artisan migrate --force --no-interaction
sudo -u www-data php8.4 artisan optimize
sudo systemctl reload php8.4-fpm
sudo systemctl start streetforge-queue
sudo -u www-data php8.4 artisan up
```

Повторите проверки из раздела 9. При смене `.env` заново кешируйте конфигурацию и перезапускайте worker. Повторно генерировать `APP_KEY`, копировать `.env.example` поверх `.env` или запускать сидер не нужно.

Пока включён maintenance mode, webhook может получить 503. Если уведомление не повторилось, после обновления выполните сверку существующего платежа:

```bash
cd /var/www/streetforge
sudo -u www-data php8.4 artisan payments:reconcile TOP_ORDER_REFERENCE
```

Если создание HPP завершилось таймаутом и ID не сохранился, возьмите реальный ID из кабинета Corefy:

```bash
sudo -u www-data php8.4 artisan payments:reconcile TOP_ORDER_REFERENCE --invoice=cpi_REAL_ID
```

Сверка не создаёт новое списание. Не подставляйте номер PDF `INV-…` вместо Corefy ID.

При неудаче оставьте maintenance mode, изучите ошибку и восстановите совместимый релиз. Откат Git не откатывает схему и данные: применённые миграции требуют отдельного плана восстановления. Не восстанавливайте старую копию SQLite поверх новых платежей без их сверки.

## 11. Частые ошибки

### Permission denied после установки от root

Если лог, кеш или SQLite принадлежат `root`, запустите следующий блок **от root**. Он не создаёт, не очищает и не заменяет базу. Если файла базы нет, блок останавливается: сначала найдите и перенесите существующую базу или выполните шаг новой установки из раздела 3. При другом `DB_DATABASE` замените путь ниже.

```bash
bash <<'BASH'
set -e
cd /var/www/streetforge
if [ ! -f database/database.sqlite ]; then
    echo 'База database/database.sqlite отсутствует. Остановлено без создания пустой базы.'
    exit 1
fi
mkdir -p storage/logs storage/framework/cache/data storage/framework/sessions storage/framework/views storage/fonts bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
find storage bootstrap/cache -type d -exec chmod 2770 {} +
find storage bootstrap/cache -type f -exec chmod 660 {} +
chown www-data:www-data database/database.sqlite
chmod 660 database/database.sqlite
chgrp www-data database
chmod g+rwx database
chgrp www-data .env
chmod 640 .env
sudo -u www-data php8.4 artisan config:clear
sudo -u www-data php8.4 artisan migrate --force --no-interaction
php8.4 artisan storage:link --no-interaction
sudo -u www-data php8.4 artisan optimize
BASH
```

Не передавайте `www-data` владение всем репозиторием. Если после исправления остаётся ошибка чтения, проверьте проход по родительским каталогам командой `namei -l /var/www/streetforge/database/database.sqlite` и чтение `.env` пользователем `www-data`.


| Симптом | Что проверить |
| --- | --- |
| 502 Bad Gateway | Запущен ли `php8.4-fpm`, совпадает ли сокет с Nginx-конфигом |
| 500 | `laravel.log`, расширение `pdo_sqlite`, путь `DB_DATABASE`, права файла базы, `storage` и `bootstrap/cache` |
| SQLite: readonly database / unable to open database | Абсолютный путь, наличие файла, права `www-data` на файл и родительский каталог |
| SQLite: database is locked | Долгие записи/параллельные worker; не удаляйте WAL/SHM-файлы, оставьте один worker и изучите активные процессы |
| 419 / выход из аккаунта | HTTPS, `APP_URL`, secure cookie, таблицу `sessions`, постоянный `APP_KEY` |
| Vite manifest not found / пустая страница | Успешность `npm ci --include=dev` и `npm run build`, файл `public/build/manifest.json` |
| Браузер пытается подключиться к Vite dev server | Удалите оставшийся от разработки `public/hot`; в production он не нужен |
| Нет письма после оплаты | `streetforge-queue`, SMTP, `sudo -u www-data php8.4 artisan queue:failed` |
| Paid, но проблема с PDF | Логи, расширение GD, права записи и каталог `storage/fonts` |
| Не обновились настройки .env | Повторите `config:clear`, `optimize`, перезапуск worker |
| Платёж остался Pending | Логи Corefy, доступность webhook, подпись; затем `payments:reconcile` |

Для production не запускаются `artisan serve`, `composer run dev` и `npm run dev`. Запросы обслуживают Nginx и PHP-FPM, фоновые письма — systemd worker.
