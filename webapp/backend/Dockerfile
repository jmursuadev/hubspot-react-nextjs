FROM php:8.2-fpm

# Install required packages including libu2f-udev
RUN apt-get update && apt-get install -y \
    curl \
    zip \
    unzip \
    wget

## Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . /var/www/backend

# Set working directory
WORKDIR /var/www/backend

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN cd /var/www/backend

# Install composer dependencies
RUN chmod -R 755 /var/www/backend
RUN chown -R www-data:www-data /var/www/backend
RUN composer validate
RUN composer update

CMD bash -c "composer install --no-interaction && php-fpm -F -R"