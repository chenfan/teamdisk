# webdav服务端

基于sabredav进行的开发。通过PHP来模拟webdav服务器端，完成对文件的操作。

对sabredav做了一些变更，并添加了用户权限功能，添加了不同用户对目录的操作权限。

服务端认证采用的digital方式，用户名密码通过数据库中读取。因此需要先安装后台管理模板，导入数据库db.sql文件。

同时部分改动是针对tidesdk客户端做的优化，对其他webdav客户端软件没有影响。

sarbdav的主文件是根目录下的index.php，可以通过配置来改变服务器端的行为，更多功能可以参考官网。


# What is SabreDAV

SabreDAV allows you to easily add WebDAV support to a PHP application. SabreDAV is meant to cover the entire standard, and attempts to allow integration using an easy to understand API.