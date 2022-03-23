# shopify_faq
step1: npm install pm2
pm2 start app  <pm2 start app.js>
start file nodejs <for http://localhost:port>
  
step2: 
edit /etc/apache2/site-avaliable/servername.conf

<VirtualHost *:80>
  ServerName local0pm2node.com
ServerAlias www.local0pm2node.com
  ProxyPreserveHost On
  ProxyPass / http://localhost:8080/
  ProxyPassReverse / http://localhost:8080/
</VirtualHost>



step3: sudo a2enmod proxy
        sudo a2enmod proxy_http
        
        
        
/**
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    ServerName ci.company.com
    ServerAlias ci
    ProxyRequests Off
    <Proxy *>
        Order deny,allow
        Allow from all
    </Proxy>
    ProxyPreserveHost on
    ProxyPass / http://localhost:8080/
</VirtualHost>
/** ??????
