# flamework

A hard-fork for the `exflickr/flamework` project updated to work with PHP 8, Smarty 5 and ElasticSearch/OpenSearch in addition to MySQL.

## Motivation

This is a hard-fork for the `exflickr/flamework` project updated to work with PHP 8, Smarty 5 and ElasticSearch/OpenSearch in addition to MySQL. It also includes libraries and web pages for managing an OAuth2-based API and access tokens.

## Compatibility

This code has been updated to work with PHP 8.2 or higher and Smarty 5.0 or higher.

## Documentation

Documentation is incomplete. For the time have a look at the [docs](docs} folder.

* [Design Philosophy](docs/philosophy.md)
* [Database Model](docs/database_model.md)
* [Install (for `dnf` based systems)](docs/install.md)
* [Known Gotchas and Fixes for SELinux](docs/selinux.md)

## Docker

Sort of. There is an in-progress [Dockerfile](Dockerfile) for building a container using a minimal Amazon Linux 2023 distribution but it is incomplete and does not support using local (external to the container) code or databases.

## See also

* https://github.com/exflickr/flamework
* https://smarty-php.github.io/smarty/5.x
* https://www.php.net
