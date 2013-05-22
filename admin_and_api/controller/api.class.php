<?php
if( !defined('IN') ) die('bad request');
include_once( CROOT . 'controller' . DS . 'core.class.php' );

class apiController extends coreController
{
	function __construct()
	{
		// 载入默认的
		parent::__construct();
	}

	// login check or something
}


?>