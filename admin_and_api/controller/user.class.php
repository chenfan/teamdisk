<?php
if( !defined('IN') ) die('bad request');
include_once( AROOT . 'controller'.DS.'app.class.php' );

class userController extends appController
{
	function __construct()
	{
		// 载入默认的
		parent::__construct();
        session_start();
	}
	
	public function index()
	{
		include_once( AROOT . 'controller'.DS.'api_admin_folder.class.php' );
		$folder = new api_admin_folderController();
		echo $folder->getlist();

		render( $this->data );
	}

	public function logout()
	{
		session_unset();
		header('Location: /');
	}
    
}

	