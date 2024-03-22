# Install

```
$> sudo dnf install -y httpd php-fpm php-mysqli php-json php php-devel wget lynx
```

```
$> sudo systemctl start httpd
$> sudo systemctl enable httpd
$> sudo systemctl is-enabled httpd

$> curl http://localhost
<html><body><h1>It works!</h1></body></html>
```

```
$> sudo dnf install mariadb105-server
```
