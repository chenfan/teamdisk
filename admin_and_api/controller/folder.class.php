<?php
if( !defined('IN') ) die('bad request');
include_once( AROOT . 'controller'.DS.'app.class.php' );

class defaultController extends appController
{
	function __construct()
	{
		// 载入默认的
		parent::__construct();
        session_start();
	}
	
	public function index()
	{
        $this->data['side']=true;
		$this->data['title'] = $this->data['top_title'] = '首页';
		render( $this->data );
	}
    
}

	