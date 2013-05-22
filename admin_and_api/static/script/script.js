/* Author:

*/

function login(page)
{
	if( $('#email').val() == '' )
	{
		alert("Email不能为空");
		return false;
	} 
	if( $('#password').val() == '' )
	{
		alert("密码不能为空");
		return false;
	}
	
	$("#login_button").val('登入中­...');
	
	$.post( 'http://' + window.location.host + '/?c=api_admin&a=get_token' , {'email':$('#email').val() , 'password':$('#password').val() } , function( data )
	{
        var data_obj = jQuery.parseJSON( data );
		
		if( data_obj.error_code != 0 )
		{
			// 
			alert('错误的email地址或者密码，请重试 ');
			logout();
			//change_page( 'login' );
		}
		else
		{
			if( (parseInt(data_obj.data.uid) < 1) || ( data_obj.data.token.length < 4 ) )
				alert('服务器忙，请稍后重试~' + data_obj.data.uid + '~' + data_obj.data.token );
				
			// save token and info , redirect to path.html	
			kset( 'op_email' , $('#email').val() );
			kset( 'op_password' , $('#password').val() );
			
			kset( 'op_uid' , data_obj.data.uid );
			kset( 'op_token' , data_obj.data.token );
		
			if(page)
				change_page( page );
		}
		
	}  );	
}

function logout()
{
	window.localStorage.clear();
	change_page('login');
}

function folder_list()
{
	
	$.post( 'http://' + window.location.host  + '/?c=api_admin_folder&a=getlist' , { 'token' : kget('op_token') } , function( data )
	{
		var data_obj = jQuery.parseJSON( data );
		if( data_obj.error_code != 0 )
		{
			json_error_prase(data_obj);
			return false;
		}
		else
		{
			$("#folder_list").empty();
			//$('#user_list_tpl').tmpl(data_obj.data.items).appendTo( "#user_list" );
			$("#folder_list").html( $.tmpl("folder_list_tpl" , {'items':data_obj.data}) );
			
			
		}
		
	} );		
}
function user_list()
{
	
	$.post( 'http://' + window.location.host  + '/?c=api_admin_user&a=getlist' , { 'token' : kget('op_token') } , function( data )
	{
		var data_obj = jQuery.parseJSON( data );
		if( data_obj.error_code != 0 )
		{
			json_error_prase(data_obj);
			return false;
		}
		else
		{
			$("#user_list").html( $.tmpl("user_list_tpl" , {'items':data_obj.data}) );
			if(!$.browser.mozilla){ 
				var btns = $('button.copy');
				var clip = [];

				for(var i = 0,j = btns.length-1;i<=j;i++){
					clip[i] = new ZeroClipboard( btns[i], {
						moviePath: "static/script/ZeroClipboard.swf"
					} );
					clip[i].on( 'complete', function(client, args) {
					  alert(args.text );
					} );
					clip.on( 'mousedown', function(client) {
					  alert("mouse down");
					} );
				}
			}

		}
		
	} );		
}


function add_user()
{
	if( $('#username').val() == '' )
	{
		alert("用户名不能为空");
		return false;
	}
	
	if( $('#userpass').val() == '' )
	{
		alert("密码不能为空");
		return false;
	}
	var prifold = 'close';
	if($("#prifold").attr("checked")=='checked')
	{
		prifold = 'open';
	}
	$('#add_user_btn').val('发送中');	
		
	$.post( 'http://' + window.location.host + '/?c=api_admin_user&a=create' , {'username':$('#username').val() , 'password':$('#userpass').val() ,'prifold':prifold , 'token' : kget('op_token') } , function( data )
	{
		if( data.error_code != 0 )
		{
			json_error_prase(data);
			return false;
			
		}
		else
		{
			alert('添加成功');
			$("#user_list").append( $.tmpl("user_list_tpl" , {'items':data.data}) );
			
		}
		
	} , 'json' );		
}

function add_folder()
{
	if( $('#foldername').val() == '' )
	{
		alert("用户名不能为空");
		return false;
	}
		
	$.post( 'http://' + window.location.host + '/?c=api_admin_folder&a=create' , {'name':$('#foldername').val() , 'token' : kget('op_token') } , function( data )
	{
		var data_obj = jQuery.parseJSON( data );
		if( data_obj.error_code != 0 )
		{
			json_error_prase(data_obj);
			return false;	
		}
		else
		{
			alert('目录添加成功');
			$("#folder_list").append( $.tmpl("folder_list_tpl" , {'items':data.data}) );
		}
		
	} , 'json' );		
}

function get_randpass()
{
	
	$.post( 'http://' + window.location.host  + '/?c=api_admin_user&a=randpassword' , { 'token' : kget('op_token') } , function( data )
	{
		
		var data_obj = jQuery.parseJSON( data );
		
		if( data_obj.error_code != 0 )
		{
			json_error_prase(data_obj);
			return false;
		}
		else
		{
			$("#userpass").val(data_obj.data);
			
			
		}
		
	} );	
}



function change_page( page )
{
	location = page + '.html';
}


function kset( key , value )
{
	window.localStorage.setItem( key , value );
}

function kget( key  )
{
	return window.localStorage.getItem( key );
}

function kremove( key )
{
	window.localStorage.removeItem( key );
}

function buddy_search()
{
	$('#buddy_key').bind( 'keyup keydown' , function(evt)
	{
		if( $('#buddy_key').val() != '' )
		{
			$('#user_list li.user').each(function()
			{
				if( ($(this).attr('user').indexOf( $('#buddy_key').val() ) < 0))
					$(this).css('display','none');
				else
					$(this).css('display','block');
			});
		}
		else
		{
			$('#user_list li.user').each(function()
			{
				$(this).css('display','block');
			});
		}
	});
} 

function edit_pass(id)
{
	var pass = $('#lipassword'+id).html();
	$('#lipassword'+id).html('<div class="input-append" style="float: right;"><input class="input" value="'+pass+'" id="edit_lipass'+id+'" type="text" style="margin-bottom:0px"><span class="add-on" onclick="cancle_pass(\''+pass+'\',\''+id+'\')" style="cursor: pointer;">取消</span></div>');
	$('#pencil'+id).css('display','none');
	$('#ok'+id).css('display','block');
}

function cancle_pass(pass,id)
{
	$('#lipassword'+id).html(pass);
	$('#pencil'+id).css('display','block');
	$('#ok'+id).css('display','none');
}


function succ_pass(id)
{
	$('#lipassword'+id).html($("#edit_lipass"+id).val());
	$('#pencil'+id).css('display','block');
	$('#ok'+id).css('display','none');
}

function save_pass(username,id)
{
	if( $('#edit_lipass'+id).val() == '' )
	{
		alert("密码不能为空");
		return false;
	}
	$.post( 'http://' + window.location.host  + '/?c=api_admin_user&a=update' , { 'token' : kget('op_token'),'username':username ,'password':$('#edit_lipass'+id).val()} , function( data )
	{
		
		var data_obj = jQuery.parseJSON( data );
		
		if( data_obj.error_code != 0 )
		{
			json_error_prase(data_obj);
			return false;
		}
		else
		{
			succ_pass(id);
		}
		
	} );	
}


function delete_user(username)
{	
	$.post( 'http://' + window.location.host  + '/?c=api_admin_user&a=delete' , { 'token' : kget('op_token'),'username':username } , function( data )
	{
		
		var data_obj = jQuery.parseJSON( data );
		
		if( data_obj.error_code != 0 )
		{
			json_error_prase(data_obj);
			return false;
		}
		else
		{
			alert('删除成功');
			$("#u_"+username).remove();
		}
		
	} );	
}

function delete_folder(name)
{
	$.post( 'http://' + window.location.host  + '/?c=api_admin_folder&a=delete' , { 'token' : kget('op_token'),'name':name } , function( data )
	{
		
		var data_obj = jQuery.parseJSON( data );
		
		if( data_obj.error_code != 0 )
		{
			json_error_prase(data_obj);
			return false;
		}
		else
		{
			alert('删除成功');
			$("#fold_"+name).remove();
		}
		
	} );	
}

function update_admin_pass()
{
	if( $('#pass').val() == '' )
	{
		alert("密码不能为空");
		return false;
	}
	if( $('#newpass').val() == '' )
	{
		alert("密码不能为空");
		return false;
	}
	if( $('#renewpass').val() == '' )
	{
		alert("密码不能为空");
		return false;
	}
	if( $('#newpass').val() !== $('#renewpass').val() )
	{
		alert("两次密码输入不同");
		return false;
	}
	$.post( 'http://' + window.location.host  + '/?c=api_admin_user&a=update_admin' , { 'token' : kget('op_token'),'username':'admin' ,'password':$('#pass').val(),'newpassword':$('#newpass').val()} , function( data )
	{
		
		var data_obj = jQuery.parseJSON( data );
		
		if( data_obj.error_code != 0 )
		{
			json_error_prase(data_obj);
			return false;
		}
		else
		{
			alert('密码修改成功');
			change_page('index');
		}
		
	} );	
}

function save_folder_name(name,id)
{
	if( $('#edit_lipass'+id).val() == '' )
	{
		alert("文件夹名称不能为空");
		return false;
	}
	$.post( 'http://' + window.location.host  + '/?c=api_admin_folder&a=update' , { 'token' : kget('op_token'),'name':name ,'newname':$('#edit_lipass'+id).val()} , function( data )
	{
		
		var data_obj = jQuery.parseJSON( data );
		
		if( data_obj.error_code != 0 )
		{
			json_error_prase(data_obj);
			return false;
		}
		else
		{
			alert('文件夹名称修改成功');
			change_page('folder');
		}
		
	} );	
}
function show_user(name)
{
	
	$.post( 'http://' + window.location.host  + '/?c=api_admin_folder&a=userlist' , { 'token' : kget('op_token'),'name':name  } , function( data )
	{
		
		var data_obj = jQuery.parseJSON( data );
		
		if( data_obj.error_code != 0 )
		{
			json_error_prase(data_obj);
			return false;
		}
		else
		{
			$(".arrow_div").each(function(k,v){$(v).css('display','none');});
			$("#arrow_"+name).css('display','block');
			$("#folder_user").css('display','block');
			$("#user_list").html( $.tmpl("user_list_tpl" , {'items':data_obj.data}) );
			$("#user_num").html($("li[data-user='choice']").length);
			$("#check_all").on('click',function(){
			    if(this.checked){
			        $("li.userlist").each(function(k,v){$(v).attr('data-user','choice');$(v).css('background-color','#e5e5e5');});
			        $("#user_num").html($("li[data-user='choice']").length);
			    }else{
			        $("li.userlist").each(function(k,v){$(v).attr('data-user','');$(v).css('background-color','#f5f5f5');});
			        $("#user_num").html('0');

			    }
		    });
		    $("#user_update_btn").on('click',function(){
				update_folder_user(name);
			})
		}
		
	} );		
}

function json_error_prase(data_obj){
	if( data_obj.err_code == 10001 )
	{
		alert('授权过期，请重新登录');
		change_page('login');
	}
	else
	{
		alert(data_obj.error_message);
	}
			
}


function choice_user(user)
{

	if($('#user'+user).attr('data-user') == 'choice'){
		$('#user'+user).css('background-color','#f5f5f5');
		$('#user'+user).attr('data-user','');
	}else{
		$('#user'+user).css('background-color','#e5e5e5');
		$('#user'+user).attr('data-user','choice');
	}
	$("#user_num").html($("li[data-user='choice']").length);
}

function copy_user(id)
{
	window.clipboardData.setData("Text", $('#lipassword'+id).html()+$('#liusername'+id).html());
    alert("复制成功");
}

function update_folder_user(name)
{
	var users = '';
	$("li[data-user='choice']").each(function(k,v){ users += ','+$(v).attr('data-uid');});
	$.post( 'http://' + window.location.host  + '/?c=api_admin_folder&a=update_user' , { 'token' : kget('op_token'),'users':users ,'name':name } , function( data )
	{
		
		var data_obj = jQuery.parseJSON( data );
		
		if( data_obj.error_code != 0 )
		{
			json_error_prase(data_obj);
			return false;
		}
		else
		{
			alert('用户更新成功');
			change_page('folder');
		}
		
	} );	
}