# schema

Files are names after their database cluster which is to say they are designed so that they _can_ be run on separate databases but don't have to be.

## Set up

### Database

```
$> mysql -uroot -p
mysql> CREATE DATABASE {DATABASE};

$> mysql -uroot -p {DATABASE} < schema/db_main.schema
$> mysql -uroot -p {DATABASE} < schema/db_accounts.schema 
$> mysql -uroot -p {DATABASE} < schema/db_api.schema
$> mysql -uroot -p {DATABASE} < schema/db_users.schema
$> mysql -uroot -p {DATABASE} < schema/db_tickets.schema
```

### Users

#### Before MySQL 8

```
$> mysql -uroot -p {DATABASE}
mysql> CREATE USER '{USER}'@'%s' IDENTIFIED BY '{PASSWORD}';
mysql> GRANT SELECT,INSERT,UPDATE,DELETE ON {DATABASE}.* TO '{USER}'@'%';
mysql> FLUSH PRIVILEGES;
```

#### MySQL 8 and higher

Things get a little more complicated in MySQL 8 (and higher) with the [introduction of roles](https://dev.mysql.com/blog-archive/how-to-grant-privileges-to-users-in-mysql-80/).

```
$> mysql -uroot -p {DATABASE}
mysql> CREATE USER '{USER}'@'%' IDENTIFIED BY '{PASSWORD}';
mysql> CREATE ROLE {ROLE};
mysql> GRANT SELECT,INSERT,UPDATE,DELETE ON {DATABASE}.* TO '{ROLE}';
mysql> GRANT '{ROLE}' TO '{USER}'@'%';
mysql> SET DEFAULT ROLE '{ROLE}' TO '{USER}'@'%'
```
