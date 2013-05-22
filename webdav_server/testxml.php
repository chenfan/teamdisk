<?php
$str = '<?xml version="1.0"?><d:propfind xmlns:d="DAV:"><d:prop><d:getlastmodified/><d:getcontentlength/></d:prop></d:propfind>';
$dd2 = new DOMDocument();
$dd2->loadXML($str,LIBXML_NOWARNING | LIBXML_NOERROR);

if ($error = libxml_get_last_error()) {
   var_dump($error);
}
echo 111;