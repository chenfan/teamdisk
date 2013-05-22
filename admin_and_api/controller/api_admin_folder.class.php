<?php
//错误码 1xx 是用户相关
//2xx 是文件夹

if( !defined('IN') ) die('bad request');
include_once( AROOT . 'controller'.DS.'api_admin.class.php' );

class api_admin_folderController extends api_adminController
{
	function __construct($name=null)
	{
		parent::__construct();
		if(!$name)
			$this->name = $this->folder_name(v('name'));
		else
			$this->name = $name;

	}
	
	private function folder_name($name)
	{

		$dir = basename(s(t($name)));

		if(!$dir)
			return false;
		else
			return $dir;
	}
	
	function delete()
	{
		$data = array(  );
		$fid = get_var("select id from folder where name='".$this->name."'");
		if($fid && $this->name){
			$path = AROOT .'public/'.$this->name;
			if (true)//file_exists($path))
			{
				//$dir = rmdir($path);
				$sql = "delete from folder where name='".$this->name."'";
				$db = run_sql($sql);
				if($db && $dir){
					$data['code'] = 0;
					$data['message'] = 'folder delete succ';
					$data['data'][] = array('id'=>$fid,'name'=>$this->name);
				}
			}else{
				$data['code'] = 201;
				$data['message'] = 'folder not exest';
			}
			
		}else{
			$data['code'] = 201;
			$data['message'] = 'folder not exest';
		}
		render( $data , 'rest' );
	}
	
	function create($inner=false,$type=false)
	{
		$data = array();
		$stat = get_var("select 1 from folder where name='".$this->name."'");
		if(!$stat && $this->name){
			$path = AROOT .'public/'.$this->name;
			if (!file_exists($path))
			{
				$path = mb_convert_encoding($path,'gbk','utf8');
				$dir = mkdir($path, 0777,true);
				if(!$type)
					$type = 'public';
				$sql = "insert into folder (name,status) values ('".$this->name."','".$type."')";
				$db = run_sql($sql);
				if($db && $dir){
					$data['code'] = 0;
					$data['message'] = 'folder create succ';
				}
			}
			
		}else{
			$data['code'] = 201;
			$data['message'] = 'folder exest';
		}
		if($inner)
			return json_encode($data);
		else
			render( $data , 'rest' );

	}
	
	function update()
	{
		$data = array();
		$newname = $this->folder_name(v('newname'));
		if(!$newname){
			$data['code'] = 207;
			$data['message'] = 'new folder name error';
			render( $data , 'rest' );
			die();
		}
		run_sql("update folder set name='".$newname."' where name='".$this->name."'");
		$path = AROOT .'public/'.$this->name;
		$newpath = AROOT .'public/'.$newname;
		//在window下测试报错
		//rename($path,$newpath);
		$data['code'] = 0;
		$data['message'] = 'rename succ!';
		render( $data , 'rest' );
	}
	
	function getlist()
	{
		$data = array();
		$sql = "select * from folder where status='public'";
		
		$list = get_data($sql);
		if($list){
			$data['code'] = 0;
			$data['message'] = 'folder list';
			$data['data'] = $list;
		}
		render( $data , 'rest' );
	}
	
	function getinfo()
	{
		$data = array();
		render( $data , 'rest' );
	}
	
	function userlist()
	{
		$data = array();
		
		$sql = "select users.username,users.id from folder,folder_user,users where folder.id=folder_user.id and folder_user.uid=users.id and folder.name='".$this->name."'";
		$data['code'] = 0;
		$data['message'] = 'folder list';
		$fold_user = get_data($sql);
		$user = get_data('select username,id from users');
		$data['data']= array();
		foreach($user as $u){
			if($fold_user && in_array($u, $fold_user)){
				$data['data'][] =array('username'=>$u['username'],'id'=>$u['id'],'pri'=>true);
			}else{
				$data['data'][] =array('username'=>$u['username'],'id'=>$u['id'],'pri'=>false);
			}

		}
		render( $data , 'rest' );
	}
	
	function adduser()
	{
		$data = array();

		$users = v('users');
		if(is_array($users)){
			$folder_id = get_var("select id from folder where folder.name='".$this->name."'");
			//$users = get_line("select uid from folder_user where id='".$folder_id."'");
			$sql = "insert into folder_user(id,uid) values ";
			foreach($users as $u){
				//if(in_array($u,$users))
					//continue;
				$sql .="('".$folder_id."','".$u."'),";
				
			}
			$sql = substr($sql, 0, -1); 
			$sql .= ")";
			$add = run_sql($sql);
			$data['code'] = 0;
			$data['message'] = 'add folder user succ!';
		}else{
			$data['code'] = 203;
			$data['message'] = 'error';
		}
		
		render( $data , 'rest' );
	}

	function update_user()
	{
		$data = array();

		$users = explode(',',s(substr(t(v('users')),1)));
		if(is_array($users)){
			$folder_id = get_var("select id from folder where folder.name='".$this->name."'");
			run_sql("delete from folder_user where id='".$folder_id."'");
			$num = count($users);
			run_sql("update folder set member='".$num."' where folder.name='".$this->name."'");
			$sql = "insert into folder_user(id,uid) values ";
			foreach($users as $u){
				$sql .="('".$folder_id."','".$u."'),";
				
			}
			$sql = substr($sql, 0, -1); 
			$add = run_sql($sql);
			$data['code'] = 0;
			$data['message'] = 'add folder user succ!';
		}else{
			$data['code'] = 203;
			$data['message'] = 'error';
		}
		
		render( $data , 'rest' );
	}
}
	