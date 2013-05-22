<?php
if( !defined('IN') ) die('bad request');
include_once( AROOT . 'controller'.DS.'api_admin.class.php' );

class api_admin_userController extends api_adminController
{
	function __construct()
	{
		parent::__construct();
		$this->name = s(t(v('username')));
	}

	function delete()
	{
		$data = array(  );
		$uid = get_var("select id from users where username='".$this->name."'");
		if($uid && $this->name){
			$sql = "delete from users where username='".$this->name."'";
			$db = run_sql($sql);
			if($db){
				$data['code'] = 0;
				$data['message'] = 'user delete succ';
				$data['data'][] = array('id'=>$uid,'username'=>$this->name);
			}
			
		}else{
			$data['code'] = 201;
			$data['message'] = 'user not exest';
		}
		render( $data , 'rest' );
	}
	
	function create($inner=false)
	{
		$data = array();
		$pass = s(t(v('password')));
		$pri = s(t(v('prifold')));
		$stat = get_var("select 1 from users where username='".$this->name."'");
		if(!$stat && $this->name){
			if($pri == 'open'){
				include_once( AROOT . 'controller'.DS.'api_admin_folder.class.php' );
				$folder = new api_admin_folderController($this->name);
				$rs = $folder->create(true,'private');
			}
			$digest = md5($this->name.':'.'SabreDAV'.':'.$pass);
			$sql = "insert into users (username,password,digesta1) values ('".$this->name."','".$pass."','".$digest."')";
			$db = run_sql($sql);
			if($db){
				$data['code'] = 0;
				$data['data'][] = array('id'=>last_id(),'username'=>$this->name,'password'=>$pass);
			}
		}else{
			$data['code'] = 301;
			$data['message'] = 'user exesit';
		}
		if($inner)
			return json_encode($data);
		else
			render( $data , 'rest' );
	}
	
	function update()
	{
		$data = array();
		$pass = s(t(v('password')));
		$digest = md5($this->name.':SabreDAV:'.$pass);
		$sql = "update users set password='".$pass."',digesta1='".$digest."' where username='".$this->name."'";
		//echo $sql;
		$rs = run_sql($sql);
		if($rs){
			$data['code'] = 0;
			$data['message'] = 'users list';
			$data['data'] = $list;
		}
		render( $data , 'rest' );
	}

	function update_admin()
	{
		$data = array();
		$pass = s(t(v('password')));
		$newpass = s(t(v('newpassword')));
		$digest = md5('admin:SabreDAV:'.$pass);
		$admin = get_var("select 1 from users where username='admin' and digesta1='".$digest."'");
		if(!$admin){
			$data['code'] = 306;
			$data['message'] = '原始密码错误';
			render( $data , 'rest' );
			die();
		}
		$newdigest = md5('admin:SabreDAV:'.$pass);
		$sql = "update users set password='".$pass."',digesta1='".$newdigest."' where username='admin'";
		$rs = run_sql($sql);
		if($rs){
			$data['code'] = 0;
			$data['message'] = 'succ!';
			$data['data'] = $list;
		}
		render( $data , 'rest' );
	}
	
	function getlist()
	{
		$data = array();
		$sql = "select * from users where username!='admin'";
		
		$list = get_data($sql);
		if($list){
			$data['code'] = 0;
			$data['message'] = 'users list';
			$data['data'] = $list;
		}
		render( $data , 'rest' );
	}
	
	function getinfo()
	{
		$data = array();
		render( $data , 'rest' );
	}

	function randpassword()
	{
		$data['code'] = 0;
		$data['message'] = 'users list';
		$data['data'] = substr(md5(uniqid()),0,10);
		render( $data , 'rest' );
	}
}
	