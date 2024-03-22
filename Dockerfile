FROM public.ecr.aws/amazonlinux/amazonlinux:2023-minimal

# https://docs.aws.amazon.com/linux/al2023/ug/minimal-container.html
# https://docs.aws.amazon.com/linux/al2023/ug/ec2-lamp-amazon-linux-2023.html
# https://docs.aws.amazon.com/linux/al2023/ug/SSL-on-amazon-linux-2023.html

# https://github.com/exflickr/flamework/blob/php8_upgrade/Dockerfile
# https://github.com/exflickr/flamework/blob/php8_upgrade/tests/docker/entrypoint.sh

RUN dnf install -y gcc && dnf clean all

# Kernel patching is not available for amazonlinux:2023-minimal
# https://docs.aws.amazon.com/linux/al2023/ug/al2023-container-ami.html

# SELinux is not available for amazonlinux:2023-minimal
# https://docs.aws.amazon.com/linux/al2023/ug/al2023-container-ami.html

RUN dnf install -y httpd php-fpm php-mysqli php-json php php-devel mariadb105-server

# Setup automatic security updates

COPY dnf/dnf-sec-update.sh /etc/cron.daily/dnf-sec-update.sh
RUN chmod 755 /etc/cron.daily/dnf-sec-update.sh

# Set up Flamework stuff

RUN mkdir -p /usr/local/flamework/www
RUN mkdir -p /usr/local/flamework/schema

COPY www /usr/local/flamework/www/
COPY schema /usr/local/flamework/schema/
COPY httpd/flamework.conf /etc/httpd/conf.d/

RUN chown apache /usr/local/flamework/www/templates_c

RUN systemctl enable httpd

# Setup and start MySQL (MariaDB) stuff

# Does not work - something something something
#
# RUN mysql -e 'CREATE DATABASE IF NOT EXISTS flamework;'

RUN systemctl enable mariadb

