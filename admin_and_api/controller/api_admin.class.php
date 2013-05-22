<?php
if( !defined('IN') ) die('bad request');
include_once( AROOT . 'controller'.DS.'api.class.php' );

class api_adminController extends apiController
{
	function __construct()
	{
		parent::__construct();
		if(g('c') !== 'get_token'){
			$permit = $this->check_admin_permit();
			if(!permit){
				$data['code'] = 101;
				$data['message'] = 'not permit';

				render( $data , 'rest' );
			}
		}
	}

	private function check_admin_permit()
	{
		$token = v($token);
		if(!$token)
			return false;
		session_id($token);
		session_start();
		$role = $_SESSION['role'];
		if($role = 'admin')
			return true;
		else
			return false;
	}
	
	function get_token()
	{
		$user = t(v('email'));
		$pass = t(v('password'));
		$realm = 'SabreDAV';
		$digit = md5($user.':'.$realm.':'.$pass);
		$sql = "select id from users where username='".$user."' and digesta1='".$digit."'";
		$user = get_var($sql);
		if($user){
			session_start();
			$data['code'] = 0;
			$data['message'] = 'get token succ';
			$data['data']['token'] = session_id();
			$data['data']['uid'] = $user;
			
		}else{
			$data['code'] = 201;
			$data['message'] = 'user not exest';
		}
		render( $data , 'rest' );
	}

}
	