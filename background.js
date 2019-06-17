//deletes cached password after 5 minutes unless reset. Also used to open a chat-containing tab
chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {

			if(request.message == "reset_timer"){ resetPwdTimer();			//reset timer to erase cached Master Password

			}else if(request.message == "reset_now"){ resetNow();					//same but effective immediately

			}
			
			if (request.newtab == "helpTab") {								//to open extra tab for help. Not used
                chrome.tabs.create({url: 'helpSynth.html'});
                sendResponse({farewell: "goodbye"});
           }else if(request.newtab == "chatTab") {							//to open a chat in a separate tab
				var typetoken = request.typetoken;
				chrome.tabs.create({url: 'chat.html#' + typetoken});			//this one loads inside an iframe so other extensions can't see the content
				sendResponse({farewell: "goodbye"});
			}
      }
);

var bgPage = chrome.extension.getBackgroundPage(),
	pwdTimer = 0;

//deletes keys after 5 minutes	
function resetPwdTimer(){
	clearTimeout(pwdTimer);
	pwdTimer = setTimeout(function(){
		bgPage.masterPwd = '';
		bgPage.keySgn = '';
		bgPage.keyDH = '';
		bgPage.keyDir = '';
		bgPage.myEmail = '';
		bgPage.myLock = '';
		bgPage.myLockStr = '';
		bgPage.myezLock = '';
		bgPage.userName = '';
	}, 300000)
}

//deletes keys immediately
function resetNow(){
	clearTimeout(pwdTimer);
		bgPage.masterPwd = '';
		bgPage.keySgn = '';
		bgPage.keyDH = '';
		bgPage.keyDir = '';
		bgPage.myEmail = '';
		bgPage.myLock = '';
		bgPage.myLockStr = '';
		bgPage.myezLock = '';
		bgPage.userName = '';
}