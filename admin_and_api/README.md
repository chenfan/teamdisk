# 后台管理和api

本目录代码是后台管理功能，后台的操作都是直接调用api,目前这些api都是给管理员用的。如果有功能扩充，可以添加api。

所有的api继承父类api.class.php。如admin的api为api_admin.class.php,扩充管理员api功能可继承此类

使用后台请先倒入数据库结构文件db.sql。