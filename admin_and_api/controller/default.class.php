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
		//include_once( AROOT . 'controller'.DS.'api_admin_folder.class.php' );
		//$folder = new api_admin_folderController();
		//echo $folder->getlist();die();
		if(ss('uid')) {
			header('Location: /?c=default&a=main');
		}
        $this->data['side']=true;
		$this->data['title'] = $this->data['top_title'] = '首页';
		render( $this->data );
	}

	public function main()
	{
		if( !v('old') ){
			header('Location: /?c=appstore&a=applist&r='.rand());
			return;
		}
		$this->data['title']=$this->data['top_title']='主面板';
		render($this->data);
	}

	public function logout()
	{
		session_unset();
		header('Location: /');
	}

    public function permit_list()
	{
		//$this->['elem'] = g('elem');
        //$sql = "select * from role";
        render($this->data);
	}
   
    
    public function permit_mng()
	{
		$uid = intval(v('uid'));
        $sql = "select u.nickname as name,log.* from admin_userlog as log,admin_user as u where u.id=log.uid";
        if($uid)
            $sql .=" where uid=".$uid;
        $this->data['admin_log'] = get_data($sql);
        render($this->data);
	}

    
}

	