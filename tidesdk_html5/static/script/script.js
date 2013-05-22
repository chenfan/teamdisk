function change_page( page )
{
	location = page + '.html';
}

function convertSize(size) {
    if(!size) {
        return '0 Bytes';
    }
    var sizeNames = [' Bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
    var i = Math.floor(Math.log(size)/Math.log(1024));
    var p = (i > 1) ? 2 : 0;
    return (size/Math.pow(1024, Math.floor(i))).toFixed(p) + sizeNames[i];
}

function get_xml_prase(uri,type,dav_header,data)
{
	var auth = 'Basic password';
	var hd = {'Authorization': auth};
	hd['tide'] = type;
	var rs = [];
	var dt = arguments[4] ? arguments[4] : 'xml';
	if(dav_header){
		for(var key in dav_header){
			hd[key] = dav_header[key];
		}
	}
	jQuery.ajax({
	    url: 'http://domain.1kapp.com' + uri,
	    type: 'POST',
	    async  : false,
	    dataType: dt,
	    data:data,
	    headers: hd,
	    success: function(xml) {
	        $.xmlns["D"] = "DAV:";
	 		len = uri.length;
	        $(xml).find("D|response").each(function(k,v){
	        	var target = $(this);  
	            var href=target.find("D|href").text();
	            if(href == uri) return true;
	            var name = href.substr(len);
				var d = new Date(Date.parse(target.find("D|getlastmodified").text())); 
	            var lastmodifiled=(d.getFullYear())+"-"+(d.getMonth()+1)+"-"+(d.getDate()+1)+"   "+(d.getHours()+1)+":"+(d.getMinutes()+1)+":"+d.getSeconds();
	            var length=target.find("D|getcontentlength").text();
	            var contenttype=target.find("D|getcontenttype").text();
				var file_type='';
				var collection = target.find("D|collection");
	            switch(contenttype)
				{
				case '':
				  if(collection.length>0){
				      file_type = 'folder'
				  }else{
					  file_type = 'file'
					  var i = name.lastIndexOf(".");
					  var ext = name.substring(i+1);
					  if(ext == 'zip'){
						file_type = 'file_zip'
					  }
					  if(ext == 'pdf'){
						file_type = 'file_pdf'
					  }
				  }
				  break;
				case 'image/jpeg':
				case 'image/png':
				  file_type = 'image_default_highlight'
				  break;
				default:
				  file_type = 'file'
				}
	            
	            var id= ids(name);
	            rs.push({'id':id,'name':name,'href':href,'lastmodifiled':lastmodifiled,'length':convertSize(length),'contenttype':file_type,'collection':collection.length});
	        });
		},
	    error: function(XMLHttpRequest, textStatus, errorThrown) {
	    }

		});
	return rs;
}

var timer = null; 
function do_click(event,href) {
	clearTimeout(timer);
	if (event.detail == 2) 
		return 
	timer = setTimeout(function() { 
		folder_list(href);
	}, 300); 
}

function do_dblclick(event,href) { 
	clearTimeout(timer);
	down_load(href);
	//window.location.href = 'http://user:pass@domain.1kapp.com'+href;
}

var download_folder;
function _download(folder)
{	
	download_folder = folder[0]+'\\';
    /*                           
	var auth = 'Basic password';
	var hd = {'Authorization': auth};
	var rs = [];
	jQuery.ajax({
	    url: href,
	    type: 'GET',
	    async  : false,
	    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	    headers: hd,

        beforeSend: function (xhr) {
            xhr.overrideMimeType('text/plain; charset=UTF-8')
        },
	    success: function(xml) {

		},
	    error: function(XMLHttpRequest, textStatus, errorThrown) {
	        alert(errorThrown);
	    }

	});
	return rs;
	*/
}

function down_load(href)
{
	if(  href== '' )
	{
		alert("文件路径不能为空");
		return false;
	}
	var urlParts = href.split('/'),
	var filename = urlParts[urlParts.length - 1];
	filename = decodeURIComponent(filename);
	Ti.UI.currentWindow.openFolderChooserDialog(_download);

	var file = Ti.Filesystem.getFile(download_folder, filename);
	if(file.exists(download_folder + filename))
	{
		if(!confirm("存在相同的文件名,是否覆盖?")){
			return false;
		}
	}
	var httpClient = Ti.Network.createHTTPClient();
	httpClient.setBasicCredentials('admin','1234');
	httpClient.open('GET', 'http://webdav.1kapp.com'+href);
	httpClient.receive(function(data) {
		var urlParts = this.url.split('/'),
		filename = urlParts[urlParts.length - 1];

		var fileStream = file.open(Ti.Filesystem.MODE_APPEND);
		fileStream.write(data);
		fileStream.close();
		
	});
	
	$("#download_content").show();
	
	var o = $("#progress");
	var d=new Date();
	var id = d.getTime();
	var progress = o.append('<li id="box_'+id+'"><div class="progress progress-info progress-striped"><div class="bar" style="width: 100%">download file : '+filename+'</div></div></li>');
	var delayRemove = function(id,delay){
		return setTimeout(function(){$('#box_'+id).fadeOut(2000);},delay);
	}
	delayRemove(id,2000);
}


function setting_download()
{
	Ti.UI.currentWindow.openFolderChooserDialog(_download);
	alert(Ti.API.application.dataPath);
	var files = Ti.Filesystem.getFile(Ti.API.application.dataPath, "user.properties");
	if(files.exists()) {
		alert(1);
	}
	return false;
	var Properties;
	Properties = Ti.App.loadProperties(files);
	
	Properties.setString('download_folder',download_folder);
	alert(download_folder);
	//making sure that the property values are saved to the file object
	Properties.saveTo(file);
	//null out file object as pointer not used anymore
	file = null;
}


function folder_list(uri)
{
	uri = uri?uri:'/'
	if(uri == '/'){
		$("#parent_link").hide();
	}else{
		$("#parent_link").show();
	}
	$("#path").html( uri);
	$("#box_path").val( uri);
	var data ='<?xml version="1.0"?><a:propfind xmlns:a="DAV:"><a:prop><a:getcontenttype/></a:prop><a:prop><a:resourcetype/></a:prop><a:prop><a:getcontentlength/></a:prop><a:prop><a:getlastmodified/></a:prop></a:propfind>';
	var rs = get_xml_prase(uri,'propfind','',data);
	$("#folder_list").html( $.tmpl("folder_list_tpl" , {'items':rs}) );
	$("#folder_grid").html( $.tmpl("folder_grid_tpl" , {'items':rs}) );
	$("#box_folder_list_move").html( $.tmpl("box_list_tpl" , {'items':rs}) );
	$("#box_folder_list_copy").html( $.tmpl("box_list_tpl" , {'items':rs}) );
	bind_element();
	reset_tool_bar();
	
}

function bind_element()
{
	$(".file-item").on({'mouseenter':function()
	{
		$(this).find('.file_manage').css('display','inline-block');
		$(this).find('.file_size').css('display','none');
	},
	'mouseleave': function ()
	{
		$(this).find('.file_manage').css('display','none');
		$(this).find('.file_size').css('display','inline-block');
	}
	});
	
    var path = $("#path").html();
    $(".dir_name").on({'click':function(e)
	{
		var href = $(this).attr('rel');
		do_click(e,path+href);
	}
	});
	$(".file_name").on({
	'dblclick': function (e)
	{
		var href =  $(this).attr('rel');
		do_dblclick(e,path+href);
	}
	});

	var listView = $('tbody#folder_list');
	var gridView = $('ul#folder_grid');
	var listViewCheckBoxes = listView.find('input[type=checkbox]');
	var gridViewCheckBoxes = gridView.find('input[type=checkbox]');

	
	var targetGrid = $('ul#folder_grid');
	targetGrid.unbind().on({
		'mouseover':function(e){
			e.stopPropagation();
			var target = $(e.target).closest('div.thumb-grid');
			if(target.length){
				target.find('.grid_checkbox').show();
			}
		},
		'mouseout':function(e){
			e.stopPropagation();
			var target = $(e.target).closest('div.thumb-grid');
			if(target.length){
				var checkBox = target.find('.grid_checkbox');
				if(checkBox.length){
					var state = checkBox.attr('data-checked');
					if(!state || state == 'hide'){
						checkBox.hide();
					}else{
						checkBox.show();
					}

				}
			}
		},
		'click':function(e){
			e.stopPropagation();

	    	var target = $(e.target);
	    	var parentNode = target.closest('div.thumb-grid');
	    	var checkBox = target.closest('.grid_checkbox');
	    	if(checkBox.length){
				var current = target.closest('input[type=checkbox]');
				if(current.length){
					if(listViewCheckBoxes.length !== gridViewCheckBoxes.length){return;}
					
					var tarPath = current.val();
					var tarState = !!current.prop('checked');
					if(!tarState){
						current.closest('.grid_checkbox').hide();		
					}
					gridViewCheckBoxes.each(function(k,v){
						var item = $(v);
						var itemPath = item.val();
						if(itemPath == tarPath){
							var remote = listViewCheckBoxes.eq(k);
							remote.prop('checked',tarState);
							//CSS
						}
					});
					checkNumber();
				}

		    	var state = checkBox.attr('data-checked');

		    	if(!state || state == 'hide'){
		    		checkBox.attr('data-checked', 'show');
		    		parentNode.addClass('thumb-grid-hover');
		    	}else{
		    		checkBox.attr('data-checked','hide');
		    		parentNode.removeClass('thumb-grid-hover');
		    	}

	    	}
		}
	});

	listView.unbind().on('click',function(e){
		var target = $(e.target).closest('input[type=checkbox]');
		if(target.length){
			
			var tarPath = target.val();
			listViewCheckBoxes.each(function(k,v){
				var item = $(v);
				var itemPath = item.val();
				var tarState = !!target.prop('checked');
				if(itemPath == tarPath){
					var remote = gridViewCheckBoxes.eq(k);
					remote.prop('checked',tarState);
					//CSS
					if(tarState){
						remote.closest('.grid_checkbox').attr('data-checked', 'show').show();
						remote.closest('div.thumb-grid').addClass('thumb-grid-hover');
					}else{
						remote.closest('.grid_checkbox').attr('data-checked', 'hide').hide();
						remote.closest('div.thumb-grid').removeClass('thumb-grid-hover');
					
					}
				}
			});
			checkNumber();
		}
	});

	function checkNumber(){
		var target = listView.find('input[type=checkbox]:checked');
		var hasChecked = target.length;
		var tarDIV = target.closest('td').next('td').find("div[class=dir_name]");
		$('span#file_num').text(hasChecked);
		if(hasChecked>0){
	    	$("#tool_bar").fadeIn("slow");
    	}else{
    		$("#tool_bar").fadeOut("slow");
    	}
    	if(hasChecked>1){
	    	$("#tool_rename").addClass('disabled');
			
    	}else{
    		$("#tool_rename").removeClass('disabled');
		}
		if(tarDIV.length > 0){
			$("#tool_download").addClass('disabled');
		}
	}
}

function change_view(type)
{
	$('#list_view').hide();
	$('#grid_view').hide();
	$('#'+type+'_view').show();
	$('#list_view_tab').removeClass('active btn-info');
	$('#grid_view_tab').removeClass('active btn-info');
	$('#'+type+'_view_tab').addClass('active btn-info');
}

function reset_tool_bar()
{
	$("#file_num").html(0);
	$("#tool_bar").hide();
	$("#tool_rename").removeClass('disabled');
	$("#tool_download").removeClass('disabled');
}

function box_folder_list(uri)
{
	uri = uri?uri:'/'
	$("#box_path").val( uri);
	var data ='<?xml version="1.0"?><a:propfind xmlns:a="DAV:"><a:prop><a:getcontenttype/></a:prop><a:prop><a:resourcetype/></a:prop><a:prop><a:getcontentlength/></a:prop><a:prop><a:getlastmodified/></a:prop></a:propfind>';
	var rs = get_xml_prase(uri,'propfind','',data);
	$("#box_folder_list_move").html( $.tmpl("box_list_tpl" , {'items':rs}) );
	$("#box_folder_list_copy").html( $.tmpl("box_list_tpl" , {'items':rs}) );
}

function box_parent_foler_list()
{
	var uri = $("#box_path").val();
	if(uri == '/') return false;
	uri = uri.substr(0,uri.length-1);
	pos = uri.lastIndexOf('/')
	uri = uri.slice(0,pos+1)
	box_folder_list(uri)
}

function parent_list()
{
	var uri = $("#path").html();
	if(uri == '/') return false;
	uri = uri.substr(0,uri.length-1);
	pos = uri.lastIndexOf('/')
	uri = uri.slice(0,pos+1)
	folder_list(uri)
	reset_tool_bar();
}

function mkcol()
{
	var name = $('#col-name').val();
	if(  name== '' )
	{
		alert("密码不能为空");
		return false;
	}
	name = name+'/'
	var path = $("#path").html();
	dir = path+encodeURIComponent(name);
	get_xml_prase(dir,'mkcol',false,false,'text');
	$('#mkcol').modal('hide');
	var d = new Date(); 
	var lastmodifiled=(d.getMonth()+1)+"月"+(d.getDate()+1)+"日 "+(d.getHours()+1)+":"+(d.getMinutes()+1)+"分"+d.getSeconds()+"秒";
	var rs = [{'name':name,'href':dir,'lastmodifiled':lastmodifiled,'length':'','contenttype':'folder',collection:1}];
	$("#folder_list").append( $.tmpl("folder_list_tpl" , {'items':rs}) );
	$("#folder_grid").append( $.tmpl("folder_grid_tpl" , {'items':rs}) );
	bind_element();
}

function move()
{
	var dest_path = $('#box_path').val();
	$("input[type=checkbox][name=file_id[]][checked=true]").each(function(){
		var href = this.val()
	});
}

function dav_del(href,name,cf)
{
	if(  href== '' )
	{
		alert("密码不能为空");
		return false;
	}
	if(cf){
		if(confirm('确认删除？')){
			get_xml_prase(href,'delete',false,false,'text');
		}else{
		 return false;
		}
	}else{
		get_xml_prase(href,'delete',false,false,'text');
		
	}
	id= ids(name);
	$("#"+id).remove();
}

function ids(str)
{
	str = encodeURI(str);
	str = str.replace(/[\.\/%_:-]/g,'');
	return str;
}

function dav_moveorcopy(href,Destination,method)
{
	if(  href== '' )
	{
		alert("文件路径不能为空");
		return false;
	}
	if(  Destination== '' )
	{
		alert("目标路径不能为空");
		return false;
	}
	var hd = {
		'Destination':Destination
	};
	
	get_xml_prase(href,method,hd,false,'text');
}


function tool_moveorcopy(method)
{
	var dest_path = $('#box_path').val();
	$("input[type=checkbox][name=file_id[]][checked=true]").each(function()
	{
		var href = $(this).val();
		var len =$("#path").html().length;
		var name = href.substr(len);
		dav_moveorcopy(href,dest_path+encodeURIComponent(name),method);
	})
	$('#box_list_folder_'+method).modal('hide');
	folder_list(dest_path);
		reset_tool_bar();
}

function tool_down_load()
{
	$("input[type=checkbox][name=file_id[]][checked=true]").each(function()
	{
		var href = $(this).val();
		down_load(href);
	})
	reset_tool_bar();
}

function item_moveorcopy(name,method)
{
	var id = ids(name);
	$("#"+id+" :input[type=checkbox][name=file_id[]]")[0].checked = true;
	$('#box_list_folder_'+method).modal('show');
}


function tool_del()
{
	if(confirm('确认删除？')){
		var path = $('#path').val();
		$("input[type=checkbox][name=file_id[]][checked=true]").each(function()
		{
			var href = $(this).val();
			var len =$("#path").html().length;
			var name = href.substr(len);
			dav_del(href,name,false);
		})
	}else{
	 return false;
	}
}

function item_rename(name,id,content)
{
	var path = $("#path").html();
	var newname = $("#edit_name_"+id).val();
	dav_moveorcopy(path+name,path+encodeURIComponent(newname),'move');
	folder_list($('#path').html())
}

function rename_form(name)
{
	var id = ids(name)
	var name = $('#'+id+'_name').text();
	var content = $('#'+id+'_name').html();
	$('#'+id+'_name').html('<div class="input-append" style="float: left;height:20px;width:80%"><input class="input" value="'+name+'" id="edit_name_'+id+'" type="text" style="margin-bottom:0px;width:60%"><span class="add-on" onclick="cancle_rename(\''+encodeURI(content)+'\',\''+id+'\')" style="cursor: pointer;">取消</span><span class="add-on" onclick="item_rename(\''+name+'\',\''+id+'\',\''+encodeURI(content)+'\')" style="cursor: pointer;">确定</span></div>');

}

function cancle_rename(content,id)
{
	content = decodeURI(content);
	$('#'+id+'_name').html(content);
	var path = $("#path").html();
	$(".dir_name").on({'click':function(e)
	{
		var href = $(this).attr('rel');
		do_click(e,path+href);
	}
	});
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

