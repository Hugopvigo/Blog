---
external: false
title: "Habilitar HSTS en tu web"
description: "Guia de como habilitar HSTS"
date: 2025-02-08
---

## ¿Qué es HSTS?

Vamos a lo más importante. ¿Qué es HSTS y para qué sirve. **HSTS** son las siglas de `HTTP Strict Transport Security`. Es una directiva de seguridad web que le dice a los navegadores que solo se conecten a un sitio web a través de HTTPS, nunca HTTP. Esto ayuda a proteger a los usuarios, evitando el tan denostado puerto 80.

## ¿Para qué sirve HSTS?

HSTS sirve para proteger a los usuarios de tu sitio web de varios tipos de ataques, incluyendo:

1. Ataques de _"man-in-the-middle"_: Un atacante puede interceptar el tráfico entre el usuario y tu sitio web y robar información confidencial, como contraseñas o datos de tarjetas de crédito. HSTS ayuda a prevenir esto al asegurar que todas las conexiones se realicen a través de HTTPS, que está encriptado y es más difícil de interceptar.
2. Ataques de _"cookie hijacking"_: Los atacantes pueden robar las cookies de los usuarios y usarlas para acceder a sus cuentas o realizar otras acciones maliciosas. HSTS ayuda a prevenir esto al asegurar que todas las cookies se transmitan a través de HTTPS, lo que las hace más difíciles de robar.
3. Ataques de _"SSL stripping"_: Un atacante puede intentar degradar la conexión de un usuario de HTTPS a HTTP, lo que le permite interceptar el tráfico y robar información confidencial. HSTS ayuda a prevenir esto al instruir al navegador para que solo se conecte a través de HTTPS.

## Por qué usarlo

Pues resumiendo, por **seguridad y confianza.**

## ¿Cómo instalarlo?

Las siguientes instrucciones son para un servidor **Apache** (Si usas NGIX u otro, tendrás que buscar la documentación)

Encabezado de seguridad a implementar:
`Strict-Transport-Security: max-age=31536000; includeSubDomains`

```
sudo nano /etc/apache2/apache2.conf
```

```
<IfModule mod_headers.c>
    # Forzar HTTPS con HSTS
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains" env=HTTPS
</IfModule>
```


Luego recuerda añadirlo también en la configuración de tu sitio web. Por ejemplo, si usas un Wordpress estará en:

```
/etc/apache2/sites-available/wordpress.conf
```

```
    # HSTS (Strict Transport Security)
    <IfModule mod_headers.c>
        Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    </IfModule>
```

_(Dentro del VirtualHost)_

```
sudo a2enmod headers
sudo systemctl restart apache2
```
![HSTS](/images/HSTS.png)

Para verificar si lo hace bien. Si hay respuesta y devuelve un 301, está correcto.
```
curl -I https://tu_web.com | grep Strict-Transport-Security
```
```
curl -I http://tu_web.com
```
