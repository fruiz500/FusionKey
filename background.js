//deletes cached password after 5 minutes unless reset. Also used to open a chat-containing tab
chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
		
			if (request.newtab == "helpTab") {								//to open extra tab for help. Not used
                chrome.tabs.create({url: 'helpSynth.html'});

           }else if(request.newtab == "chatTab") {							//to open a chat in a separate tab
				var typetoken = request.typetoken;
				chrome.tabs.create({url: 'chat.html#' + typetoken});			//this one loads inside an iframe so other extensions can't see the content
			}
      }
);

chrome.alarms.onAlarm.addListener(function(result){
	if(result.name == "FKAlarm"){
		chrome.storage.session.clear();
		chrome.runtime.sendMessage({message: "delete_keys"}, function(response) {
			var lastError = chrome.runtime.lastError;
			if (lastError) {
				console.log(lastError.message);
				// 'Could not establish connection. Receiving end does not exist.'
				return;
			}
			// Success, do something with response...
		})
	}
});