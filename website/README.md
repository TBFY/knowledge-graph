# Apache HTTP Server files for data.tbfy.eu
This module contains HTML and configuration files for the Apache HTTP Server 2.4 running on http://data.tbfy.eu. The HTTP server has been configured to forward proxies and reverse proxies using the Apache Module [mod_proxy](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html).

## Prerequisites
The instructions here assumes that you have the Apache HTTP Server 2.4 [installed](https://httpd.apache.org/docs/2.4/install.html).

## Configuration

### /var/www/html/
Copy the files in the folder `website/html/` to the folder `/var/www/html/` on your server (replacing any existing files).

### /etc/apache/sites-available/
Copy the files in the folder `website/conf/` to the folder `/etc/apache2/sites-available/` on your server (replacing any existing files).

Enable the following modules:
```
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo a2enmod ssl
```

Restart the Apache HTTP Server:
```
sudo systemctl restart apache2
```
