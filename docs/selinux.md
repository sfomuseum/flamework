# SELinux

If you are using SELinux you will need to ensure the following changes are in place:

## MySQL

```
$> sudo setsebool -P httpd_can_network_connect_db 1
```

## HTTP Requests

If your application needs to do HTTP(s) requests, for example to a remote Elastic/OpenSearch endpoint, you'll need to enable `http_can_network_connect`.

```
$> $setsebool -P httpd_can_network_connect 1
```

## Smarty / Templates

```
$> sudo semanage fcontext -a -t httpd_sys_rw_content_t "/usr/local/flamework/www/templates_c(/.*)?"
$> sudo restorecon -R -v /usr/local/flamework/www/templates_c
```

## See also

* https://selinuxproject.org/page/Main_Page