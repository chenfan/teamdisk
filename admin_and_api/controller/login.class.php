<?php
if( !defined('IN') ) die('bad request');
include_once( AROOT . 'controller'.DS.'app.class.php' );

class loginController extends appController
{
	function __construct()
	{
		// 载入默认的
		parent::__construct();
	}
        
    public function index()
	{
		if(ss('uid')) {
			header('Location: /?c=default&a=main');
		}
        $this->data['side']=true;
		$this->data['title'] = $this->data['top_title'] = '首页';
		render( $this->data );
	}
    
    public function login()
	{
		$u=t(v('uname'));
		$p=t(v('psw'));
		
		if(true !== $this->loginCheck($u,$p))
		{
			return ajax_json(array('title'=>'登录失败:','status'=>1,'msg'=>'用户名或者密码错误!'));
		}


//		$p=md5(v('psw'));
		$sql="select name from admin_user as u where u.name=".s($u);
		$result=get_line($sql);
        //var_dump($result);
		if(!$result)
			return ajax_json(array('title'=>'登录失败:','status'=>1,'msg'=>'用户名或者密码错误1!'));
		elseif($result['status'] == 'delete')
			return ajax_json(array('title'=>'登录失败:','status'=>1,'msg'=>'用户已经被封禁!'));
		elseif($result['status'] == 'active')
		{
			ss_set('uid',$result['id']);
			ss_set('email',$result['email']);
			ss_set('nickname',$result['nickname']);
			ss_set('uname',$u);
			admin_log($result['id'],"登录后台管理系统.");
			return ajax_json(array('title'=>'登录成功:','status'=>0,'msg'=>'您已成功登录!'));
		}
	}
		
	function loginCheck($un,$pw)
	{
		return true;
		$sql = "";
		

	}
}

