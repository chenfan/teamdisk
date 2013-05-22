<?php
if( !defined('IN') ) die('bad request');
include_once( CROOT . 'controller' . DS . 'core.class.php' );

class appController extends coreController
{
	function __construct()
	{
		// 载入默认的
		parent::__construct();
		$a = g('a');
        $c = g('c');
        session_start();
        if(!ss('uid') && $c != 'login'){
            header('Location: /?c=login');
            exit();
            
        }
	}
	// login check or something
	
	
}


?>