/*
filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net
*/
(function() {

	// getElementById
	function $id(id) {
		return document.getElementById(id);
	}
	// file drag hover
	function FileDragHover(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}


	// file selection
	function FileSelectHandler(e) {

		// cancel event and hover styling
		//FileDragHover(e);

		// fetch FileList object
		var files = e.target.files || e.originalEvent.dataTransfer.files;
		$("#download_content").show();
		// process all File objects
		//var d = new Date(); 
		//var lastmodifiled=(d.getMonth()+1)+"月"+(d.getDate()+1)+"日 "+(d.getHours()+1)+"时"+(d.getMinutes()+1)+"分"+d.getSeconds()+"秒";
		//var lasttime = lastmodifiled;
		for (var i = 0, f; f = files[i]; i++) {
			//ParseFile(f);
			
			//var id = ids(f.name);
			//$("#progress").append( $.tmpl("download_list_tpl" , {'items':[{'id':id,'name':f.name,'lastmodifiled':lasttime,'length':f.size,'contenttype':f.type}]}) );
			UploadFile(f);
		}

	}

	// upload JPEG files
	function UploadFile(file) {
		/*
		// following line is not necessary: prevents running on SitePoint servers
		if (location.host.indexOf("sitepointstatic") >= 0) return

		var xhr = new XMLHttpRequest();
		if (xhr.upload  && file.size <= $id("MAX_FILE_SIZE").value) {

			// create progress bar
			var o = $id("progress");
			var progress = o.appendChild(document.createElement("li"));
			progress.appendChild(document.createTextNode("upload " + file.name));


			// progress bar
			xhr.upload.addEventListener("progress", function(e) {
				var pc = parseInt(100 - (e.loaded / e.total * 100));
				progress.style.backgroundPosition = pc + "% 0";
			}, false);

			// file received/failed
			var path = 'http://webdav.1kapp.com'+$("#path").html();
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState == 4) {
					progress.className = (xhr.status == 201 ? "success" : "failure");
					var id = ids(file.name);
					var lasttime = (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString()
					var rs = $.tmpl("folder_list_tpl" , {'items':[{'name':file.name,'href':path+file.name,'lastmodifiled':lasttime,'length':file.size,'collection':0}]});
					$("#folder_list").append( rs );
					bind_element();
					//$("#box_"+id).remove().delay(5000);
				}
			};
			// start upload
			xhr.open("PUT", path+file.name, true);
			xhr.setRequestHeader("X_FILENAME", file.name);
			xhr.setRequestHeader('Authorization','Basic YWRtaW46MTIzNA==');
			xhr.setRequestHeader('tide','PUT');
			xhr.setRequestHeader('Content-Length','3185');
			xhr.send(file);
		}
		*/
		//Create the HTTP Client
		var client = Ti.Network.createHTTPClient({
			onload: function(e) {
				//request complete do something with data
				//assuming that we are not working with XML
				Ti.API.INFO('Response received '+this.responseText);
			},
			onerror: function(e) {
				//error received, do something
			},
			onreadystatechange : function(e) {
				if (this.readyState == 4) {
					alert(2)
				}
			},
		});
		
		client.setCredentials( '', '' );
		//Specify request type and open 
		var path = 'http://webdav.1kapp.com'+$("#path").html();
		// create progress bar
		var file_name = file.name;
		var rs = get_xml_prase($("#path").html(),'propfind','','');
		var name_encode = encodeURIComponent(file.name)
		var d = new Date(); 
		var lasttime = (d.getFullYear())+"-"+(d.getMonth()+1)+"-"+(d.getDate())+" "+(d.getHours())+":"+(d.getMinutes()+1)+":"+d.getSeconds();
		for ( var i = 0; i < rs.length; i++ ) {
			if(rs[i].name == name_encode.toLocaleLowerCase()){
				if(confirm("存在相同的文件名,是否继续上传?")){
					file_name=lasttime+'_'+file_name;
				}else{
					return false;
				}
			}
		}
		client.onload = function()
		{
			
			var id = ids(file_name);
			var o = $("#progress");
			var progress = o.append('<li id="box_'+id+'"><div class="progress progress-info progress-striped"><div class="bar" style="width: 10%">upload file : '+file_name+'</div></div></li>');
			progress.find('.bar').width('100%');
			progress.className = ((client.status == 201 || client.status == null)? "success" : "failure");
			
			
			var i = file_name.lastIndexOf(".");
			var ext = file_name.substring(i+1);
			var file_type = 'file';
			var delayRemove = function(id,delay){
				return setTimeout(function(){$('#box_'+id).fadeOut(2000);},delay);
			}
			if(ext == 'zip'){
				file_type = 'file_zip'
			}
			if(ext == 'pdf'){
				file_type = 'file_pdf'
			}
			if(ext == 'txt'){
				file_type = 'file_pdf'
			}
			if(ext == 'jpg' || ext == 'png'){
				file_type = 'image_default_highlight'
			}
			var rs = $.tmpl("folder_list_tpl" , {'items':[{'id':id,'name':file_name,'href':$("#path").html()+file.name,'lastmodifiled':lasttime,'length':convertSize(file.size),'collection':0,'contenttype':file_type}]});
			$("#folder_list").append( rs );
			bind_element();
			delayRemove(id, 2000);
		}
		
		client.open('PUT', path+encodeURIComponent(file_name));
		//var file_path = file.path.substring()
		var fil = Ti.Filesystem.getFile(file.path);
		var stream = fil.open(Ti.Filesystem.MODE_READ);
		var data = stream.read();

		//Send request
		client.send(data);

	}
	// initialize
	function Init() {

		var fileselect = $id("fileselect"),
			filedrag = $id("view_drop");
		fileselect.addEventListener("change", FileSelectHandler, false);
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {
			filedrag.addEventListener("dragover", FileDragHover, false);
			filedrag.addEventListener("dragleave", FileDragHover, false);
			filedrag.addEventListener("drop", FileSelectHandler, false);
		}

	}
	// call initialization file
	if (window.File && window.FileList ) {
		Init();
	}

/*
var fil = Ti.Filesystem.getFile('C:\\Users\\sina\\Desktop\\','bbb.jpg');
var stream = fil.open(Ti.Filesystem.MODE_READ);
var a = stream.read();

console.log(a)




*/

function dropfix() { 
    var bind_object = document, 
            files = [], 
            wait = 0; 
 
    bind_object.ondragenter = bind_object.ondragover = function (e) { 
        e.preventDefault(); 
        e.stopPropagation(); 
        e.dataTransfer.effectAllowed = 'all'; 
        e.dataTransfer.dropEffect = 'all'; 
        if (e.dataTransfer.files.length) { 
            files = e.dataTransfer.files; 
            wait = 0; 
        } 
    }; 
 
    bind_object.onmousemove = function (e) { 
        if (files.length == 0) return; 
        wait++; 
        if (wait > 5) { 
            var evt = document.createEvent('CustomEvent'); 
            evt.initCustomEvent('drop'); 
            evt.dataTransfer = { 
                files:files 
            }; 
            files = []; 
            wait = 0; 
            bind_object.dispatchEvent(evt); 
        } 
    }; 
} 
 
dropfix(); 
 
$(document).bind('drop', function (e) { 
        FileSelectHandler(e)
});


})();