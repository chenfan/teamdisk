/**
* Copyright (c) 2012 Software in the Public Interest (SPI) Inc.
* Copyright (c) 2012 David Pratt
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*	http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

// create and set menu
var menu = Ti.UI.createMenu(),
fileItem = Ti.UI.createMenuItem('File'),
exitItem = fileItem.addItem('Exit', function() {
  if (confirm('Are you sure you want to quit?')) {
    Ti.App.exit();
  }
});

menu.appendItem(fileItem);
Ti.UI.setMenu(menu);