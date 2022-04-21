//encrypt main box with myLock in order to make an invitation
function makeInvitation(){
	if(mainBox.textContent.trim() != ''){
		var reply = confirm('Do you want the contents of the main box to be encrypted and added to an invitation message? This will encourage the recipients to try FusionKey, but be aware that the encrypted contents WILL NOT BE SECURE.');
		if (!reply) return;	
		var text = mainBox.innerHTML.trim(),
			nonce = nacl.randomBytes(9),
			nonce24 = makeNonce24(nonce),
			cipherStr = myezLock + '//////' + nacl.util.encodeBase64(concatUint8Arrays([128],concatUint8Arrays(nonce,PLencrypt(text,nonce24,myLock,true)))).replace(/=+$/,'');			//this includes compression
		mainBox.textContent = '';
		var prefaceMsg = document.createElement('div');
		prefaceMsg.textContent = "The gibberish link below contains a message from me that has been encrypted with FusionKey, a free extension that you can get at the Chrome and Firefox web stores. There is also PassLok Privacy and PassLok for Email at the same stores, plus the standalone PassLok web app at https://passlok.com/app.\r\n\r\nTo decrypt it, install FusionKey, reload this page, and then click the FusionKey logo on the upper right of your browser. You will be asked to supply a Master Key, which will not be stored or sent anywhere. You must remember your Master Key, but you can change it later if you want. When asked whether to accept my new Password (which you don't know), go ahead and click OK. You can also decrypt the invitation by pasting it into your favorite version of PassLok:";
		var initialTag = document.createElement('pre'),
			invBody = document.createElement('pre'),
			finalTag = document.createElement('pre');
		initialTag.textContent = "----------begin invitation message encrypted with FusionKey--------==";
		invBody.textContent = cipherStr.match(/.{1,80}/g).join("\r\n");
		finalTag.textContent = "==---------end invitation message encrypted with FusionKey-----------";
		mainBox.appendChild(prefaceMsg);
		mainBox.appendChild(initialTag);
		mainBox.appendChild(invBody);
		mainBox.appendChild(finalTag);
		mainMsg.textContent = "Invitation created and ready to be copied. Invitations are ";
		updateButtons();
		if(hasInputBoxes){
			sendBtn.style.visibility = 'visible';
			mainMsg.textContent = "Invitation created and ready to put in the page. Invitations are ";
		}
		var blinker = document.createElement('span');
		blinker.className = "blink";
		blinker.textContent = "NOT SECURELY ENCRYPTED";
		mainMsg.appendChild(blinker);
		return cipherStr
	}else{
		return ''
	}
}

//calls texting app
function sendSMS(){
    if(learnMode.checked){
        var reply = confirm("The default texting app will now open. You need to have copied your short encrypted message to the clipboard before doing this, if you want to send one. This only works on smartphones. Cancel if this is not what you want.");
        if(!reply) return
    }
    if(sendSMSBtn.textContent == 'Save'){
        saveFiles()
    }else{
        selectMain();
        window.open("SMS:","_parent")
    }
}

//decrypts a chat invite if found, then opens chat screen, otherwise makes one
function Chat(){
	var text = mainBox.innerHTML.trim();

	if(text.match('==') && text.split('==')[0].slice(-4) == 'chat'){		//there is already a chat invitation, so open it
		var msg = text.split('==')[1],
			type = msg.charAt(0);
		unlock(type,msg,lockBox.innerHTML.replace(/\n/g,'<br>').trim());
		return
	}

	var listArray = lockBox.innerHTML.replace(/\n/g,'<br>').trim().split('<br>').filter(Boolean);
	if(learnMode.checked){
		var reply = confirm("A special encrypted item will be made, inviting the selected recipients to a secure chat session. Cancel if this is not what you want.");
		if(!reply) return
	}

	if(listArray.length == 0 || (listArray.length == 1 && listArray[0] == 'myself')){
		mainMsg.textContent = 'Please select those invited to chat';
		return
	}
	if(longMode.checked) listArray = listArray.concat('myself');								//make sure 'myself' is on the list, unless it's not a multi-recipient message
	listArray = listArray.filter(function(elem, pos, self) {return self.indexOf(elem) == pos;});  			//remove duplicates and nulls
	listArray = listArray.filter(function(n){return n});
	lockBox.innerText = listArray.join('\n');
	openClose('shadow');
	openClose('chatDialog');												//stop to get chat type
	chatDate.value = mainBox.textContent.trim().slice(0,43);
}

//continues making a chat invite after the user has chosen the chat type
function makeChat(){
	closeBox();
	if(dataChat.checked){					//A to C for Muaz Khan's WebRTC chat, D for Jitsi
		var type = 'A'
	}else if (audioChat.checked){
		var type = 'B'
	}else if (videoChat.checked){
		var type = 'C'
	}else{
		var type = 'D'
	}
	var date = chatDate.value.slice(0,43);						//can't do encodeURI here because this will be decrypted by decryptList, which doesn't expect it
	if(date.trim() == '') date = 'noDate';
	while(date.length < 43) date += ' ';
	var password = nacl.util.encodeBase64(nacl.randomBytes(32)).replace(/=+$/,''),
		chatRoom = makeChatRoom();
	lock(lockBox.innerHTML.replace(/\n/g,'<br>').replace(/<br>$/,"").trim(),date + type + chatRoom + '?' + password);	//date msg + info to be sent to chat page
	if(!longMode.checked) main2chat(type + chatRoom + password);
//	setTimeout(function(){
//			if(emailMode.checked) sendMail()		//no email in FusionKey
//	},50)
}

//makes a mostly anonymous chatRoom name from four words in the wordlist
function makeChatRoom(){
	var wordlist = wordListExp.toString().slice(1,-2).split('|'),
		name = '';
	for(var i = 0; i < 4; i++){
		name += capitalizeFirstLetter(replaceVariants(wordlist[randomIndex()]))
	}
	return name
}

//capitalizes first letter, the better to blend into Jitsi
function capitalizeFirstLetter(str) {
  return str[0].toUpperCase() + str.slice(1);
}

//returns a random index for wordlist
function randomIndex(){
	return Math.floor(Math.random()*wordLength)
}

//detects if there is a chat link in the main box, and opens the Chat window
function openChat(){
	var typetoken = mainBox.textContent.trim();
	if (typetoken.slice(-44,-43) == '?' && !typetoken.slice(43).match(/[^A-Za-z0-9+\/?]/)){			//chat data detected, so open chat
		mainBox.textContent = '';
		var date = typetoken.slice(0,43).trim(),									//the first 43 characters are for the date and time etc.
			chatToken = decodeURI(typetoken.slice(43));
		if(date != 'noDate'){
			var msgStart = "This chat invitation says:\n\n " + date + " \n\n"
		}else{
			var msgStart = ""
		}
		var reply = confirm(msgStart + "If you go ahead, the chat session will open now.\nWARNING: this involves going online, which might give away your location. If you cancel, a link for the chat will be made.");
		if(!reply){
			var chatLink = document.createElement('a');
			chatLink.href = 'https://passlok.com/chat/chat.html#' + chatToken;
			chatLink.textContent = 'Right-click to open the chat';
			mainBox.textContent = '';
			mainBox.appendChild(chatLink);
			return
		}
		if(isSafari || isIE || isiOS){
			mainMsg.textContent = 'Sorry, but chat is not yet supported by your browser or OS';
			return
		}
		main2chat(chatToken)
	}
}