# schema

Files are names after their database cluster which is to say they are designed so that they _can_ be run on separate databases but don't have to be.

## Set up

```
$> mysql -uroot -p
mysql> CREATE DATABASE {DATABASE};

$> mysql -uroot -p {DATABASE} < schema/db_main.schema 
$> mysql -uroot -p {DATABASE} < schema/db_api.schema
$> mysql -uroot -p {DATABASE} < schema/db_tickets.schema

$> mysql -uroot -p {DATABASE}
mysql> CREATE USER '{USER}'@'%s' IDENTIFIED BY '{PASSWORD}';
mysql> GRANT SELECT,INSERT,UPDATE,DELETE ON {DATABASE}.* TO '{USER}'@'%';
mysql> FLUSH PRIVILEGES;
```