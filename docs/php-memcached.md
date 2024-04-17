# PHP Memcached libraries

Amazingly the PHP memcache library is installable as a standard `dnf` package under Amazon Liunx 2023. To install it requires the following extra hoop-jumping described here:

* https://github.com/amazonlinux/amazon-linux-2023/issues/208

What follows are the steps that I've cobbled together to make things work.

First install the PHP and Memcached development libraries, then install the `memcached` library through `pecl`:

```
$> dnf install php-devel php-pear gcc

$> dnf install memcached-devel memcached libmemcached-awesome-devel libmemcached-awesome zlib-devel zlib cyrus-sasl cyrus-sasl-devel libevent libevent-devel

$> pear update-channels && pecl update-channels

$> pecl install igbinary
$> echo "extension=igbinary.so" > /etc/php.d/20-igbinary.ini

$> pecl install msgpack
$> echo "extension=msgpack.so" > /etc/php.d/20-msgpack.ini

$> pecl install --configureoptions 'enable-memcached-igbinary="yes" enable-memcached-msgpack="yes" enable-memcached-json="yes" enable-memcached-protocol="yes" enable-memcached-sasl="yes" enable-memcached-session="yes"' memcached

$> echo "extension=memcached.so" > /etc/php.d/25-memcached.ini
```

Check that memcache is installed and available to PHP:

```
php --info | grep memcache

**memcache**d
**memcache**d support => enabled
lib**memcache**d-awesome version => 1.1.4
**memcache**d.compression_factor => 1.3 => 1.3
**memcache**d.compression_threshold => 2000 => 2000
**memcache**d.compression_type => fastlz => fastlz
**memcache**d.default_binary_protocol => Off => Off
**memcache**d.default_connect_timeout => 0 => 0
**memcache**d.default_consistent_hash => Off => Off
**memcache**d.serializer => php => php
**memcache**d.sess_binary_protocol => On => On
**memcache**d.sess_connect_timeout => 0 => 0
**memcache**d.sess_consistent_hash => On => On
**memcache**d.sess_consistent_hash_type => ketama => ketama
**memcache**d.sess_lock_expire => 0 => 0
**memcache**d.sess_lock_max_wait => not set => not set
**memcache**d.sess_lock_retries => 5 => 5
**memcache**d.sess_lock_wait => not set => not set
**memcache**d.sess_lock_wait_max => 150 => 150
**memcache**d.sess_lock_wait_min => 150 => 150
**memcache**d.sess_locking => On => On
**memcache**d.sess_number_of_replicas => 0 => 0
**memcache**d.sess_persistent => Off => Off
**memcache**d.sess_prefix => memc.sess.key. => memc.sess.key.
**memcache**d.sess_randomize_replica_read => Off => Off
**memcache**d.sess_remove_failed_servers => Off => Off
**memcache**d.sess_sasl_password => no value => no value
**memcache**d.sess_sasl_username => no value => no value
**memcache**d.sess_server_failure_limit => 0 => 0
**memcache**d.store_retry_count => 0 => 0
Registered save handlers => files user **memcache**d
```

_Note: For reasons I don't understand `memcached` does not show up in a `phpinfo()` call on the web. But apparently it's there..._

Make sure to restart `php-fpm`:

```
$> systemctl restart php-fpm
```

You can test things with a simple script like this:

```
<?php

include("include/init.php");
loadlib("cache_memcache");

$key = "debug";

$rsp = cache_get($key);
dumper($rsp);

cache_set($key, time());

$rsp = cache_get($key);
dumper($rsp);
```

Which should produce something like this:

```
$> curl -s http://localhost:8008/test.php

<pre style="text-align: left;">{
    &quot;ok&quot;: 1,
    &quot;source&quot;: &quot;memcached&quot;,
    &quot;data&quot;: 1713381695
}</pre>

<pre style="text-align: left;">{
    &quot;ok&quot;: 1,
    &quot;source&quot;: &quot;local&quot;,
    &quot;data&quot;: 1713381772
}</pre>
```

Clean up:

```
$> dnf remove php-devel php-pear libzip-devel memcached-devel libmemcached-awesome-devel zlib-devel cyrus-sasl-devel libevent-devel
```