<?php

define('SABRE_MYSQLDSN','mysql:host=w.rdc.sae.com.cn;port:3307;dbname=app_qyappwebdav');
define('SABRE_MYSQLUSER','kappyyn1yn');
define('SABRE_MYSQLPASS','yh20j4zz0h5j250kilww1ihwihh31hw4hk3hli3w');

set_include_path(__DIR__ . '/../lib/' . PATH_SEPARATOR . __DIR__ . PATH_SEPARATOR . get_include_path());

include '../vendor/autoload.php';
echo 111;
include './Sabre/DAVServerTest.php';
echo 111;
date_default_timezone_set('GMT');
echo 111;
define("SABRE_TEMPDIR",dirname(__FILE__) . '/temp/');

// If sqlite is not available, this constant is used to skip the relevant
// tests
define('SABRE_HASSQLITE',in_array('sqlite',PDO::getAvailableDrivers()));
define('SABRE_HASMYSQL', in_array('mysql',PDO::getAvailableDrivers()) && defined('SABRE_MYSQLDSN') && defined('SABRE_MYSQLUSER') && defined('SABRE_MYSQLPASS'));

if (!file_exists(SABRE_TEMPDIR)) mkdir(SABRE_TEMPDIR);
if (file_exists('.sabredav')) unlink('.sabredav');
echo 111;