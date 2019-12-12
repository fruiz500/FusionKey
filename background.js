//deletes cached password after 5 minutes unless reset. Also used to open a chat-containing tab
chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
		
			if (request.newtab == "helpTab") {								//to open extra tab for help. Not used
                chrome.tabs.create({url: 'helpSynth.html'});

           }else if(request.newtab == "chatTab") {							//to open a chat in a separate tab
				var typetoken = request.typetoken;
				chrome.tabs.create({url: 'chat.html#' + typetoken});			//this one loads inside an iframe so other extensions can't see the content

		   }else if(request.message == "preserve_master"){				//cache SynthPass master Password
			   masterPwd = request.masterPwd;
			   resetKeyTimer()

			}else if(request.message == "preserve_keys"){				//cache keys from popup, so they are available from it loads again
				KeyStr = request.KeyStr;
				KeySgn = request.KeySgn;
				KeyDH = request.KeyDH;
				KeyDir = request.KeyDir;
				myEmail = request.myEmail;
				myLock = request.myLock;
				myLockStr = request.myLockStr;
				myezLock = request.myezLock;
				userName = request.userName;
				locDir = request.locDir;
				resetKeyTimer()
				
			}else if(request.message == "retrieve_master"){
				chrome.runtime.sendMessage({message: 'master_fromBg', masterPwd: masterPwd});
				resetKeyTimer()

			}else if(request.message == "retrieve_keys"){				//send cached keys to popup
				chrome.runtime.sendMessage({message: 'keys_fromBg', KeyStr: KeyStr, KeySgn: KeySgn, KeyDH: KeyDH, KeyDir: KeyDir, myEmail: myEmail, myLock: myLock, myLockStr: myLockStr, myezLock: myezLock, userName: userName, locDir: locDir});
				resetKeyTimer()

			}else if(request.message == "reset_timer"){
				resetKeyTimer();			//reset timer to erase cached keys

			}else if(request.message == "reset_now"){ 
				resetNow();					//same but effective immediately

			}
      }
);

//global variables to store in background, since popup is ephemeral
var masterPwd, KeyStr, KeySgn, KeyDH, KeyDir, myEmail, myLock, myLockStr, myezLock, userName, locDir;

var	keyTimer = 0;

//deletes keys after 5 minutes	
function resetKeyTimer(){
	var period = 300000;
	clearTimeout(keyTimer);

	//start timer to reset keys
	keyTimer = setTimeout(function() {
		resetNow();
		chrome.runtime.sendMessage({message: 'delete_keys'})		//also delete in popup
	}, period)
}

//deletes keys immediately
function resetNow(){
	masterPwd = '';
	KeyStr = '';
	KeySgn = '';
	KeyDH = '';
	KeyDir = '';
	myEmail = '';
	myLock = '';
	myLockStr = '';
	myezLock = '';
	userName = '';
	locDir = {}
}