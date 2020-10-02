// code for interaction with web pages, based on SynthPass code, only for universal extension
var masterPwd;

//what happens when the content or background scripts send something back
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	  
	if(request.message == "start_info"){							//initial message from content script; begins with SynthPass stuff	
		clearTimeout(startTimer);	  
		var hostParts = request.host.split('.');						//get name of the website, ignoring subdomains
		if(hostParts[hostParts.length - 1].length == 2 && hostParts[hostParts.length - 2].length < 4){			//domain name with second-level suffix
			websiteName = hostParts.slice(-3).join('.')
		}else{
			websiteName = hostParts.slice(-2).join('.')				//normal domain name
		}
		pwdNumber = Math.max(pwdNumber,request.number);
		isUserId = request.isUserId	;
  
		if(isUserId){								//userId field found, so display box, filled from storage
			displaySynth();
			userTable.style.display = 'block';
			okBtnSynth.style.display = '';
			synthMsg.textContent = "I cannot see a password to be filled, but there is an input that might take a user name"
		}

		if(pwdNumber){					             //password boxes found, so display the appropriate areas and load serial into first box
			//populate cached Key and interface	  	
			if(masterPwd){
				masterPwd1.value = masterPwd;
				showPwdMode1.style.display = 'none'
			}else{
				retrieveMaster()
			}

			displaySynth();
			pwdTable.style.display = 'block';
			userTable.style.display = 'block';
			if(!isUserId){idLabel.style.display = 'none';userID.style.display = 'none';}		//don't display user ID box if no inputs
			okBtnSynth.style.display = '';

			if(pwdNumber == 1){						//only one password box: display single input
				if(masterPwd){
					synthMsg.textContent = "Master Key still active; click OK"
				}else{
					synthMsg.textContent = "Enter Master Key and optional serial, click OK"
				}
			}else if(pwdNumber >= 2){				//2 password boxes: display two inputs and load serial on top box	  
				synthMsg.textContent = "Move the serial if the old password is not first\r\nTo take password as-is without storing, write a dash as serial\r\nTo store a password, write a plus as serial";
				row2.style.display = '';
				if(pwdNumber >= 3){					//3 boxes
					row3.style.display = '';
					if(pwdNumber == 4){				//4 boxes, which is the max
						row4.style.display = '';
					}else if(pwdNumber >= 5){		//too many boxes
						pwdTable.style.display = 'none';
						okBtnSynth.style.display = 'none';
						clipbdBtn.style.display = 'none';
						synthMsg.textContent = "Too many password fields. Try filling them manually";
					}
				}	  
			}

	//now get the serial from sync storage, and put it in the first serial box, and the userName in its place
			chrome.storage.sync.get(websiteName, function (obj){
				var serialData = obj[websiteName];
				if(serialData){
					if(serialData[0]) serial1.value = serialData[0];			//populate serial box
					if(serialData[1]) userID.value = serialData[1];		//and user ID regardless of whether it is displayed
					if(serialData[2]) pwdLength.value = serialData[2];		//and password length, if any
					if(serialData[3]) cryptoStr = serialData[3];			//put encrypted password, if any, in global variable
				}
			});
	  
	  //close everything and erase cached Master Password and encrypted stuff after five minutes
	  		setTimeout(function(){
				masterPwd = '';
				chrome.runtime.sendMessage({message: 'reset_now'});
				window.close();
			}, 300000);
			masterPwd1.focus()
		  
		}else{									//no passwords to be filled, so open the regular PassLok interface, with the main box filled
			if(!KeyStr){								//get keys from background if not already present
				pwdBox.focus();
				retrieveKeys()
			}
			displayPL();

			if(request.PLstuff.length){					//some data collected from the page, to be put in PassLok's boxes
				var length = request.PLstuff.length;
				if(length > 1){
					if(websiteName == 'google.com' | websiteName == 'live.com'){
						mainBox.innerText = request.PLstuff[0]				//innerText so line breaks are preserved. Important for text stego
					}else if(websiteName == 'yahoo.com'){
						if(request.PLstuff[0].slice(0,4) == 'Mail'){
							mainBox.innerText = request.PLstuff[1]
						}else{
							mainBox.innerText = request.PLstuff[0]
						}
					}else{
						mainBox.innerText = confirm('It seems there is more than one crypto item on the page. If you click OK, the first will be taken, otherwise the last will be taken.') ? request.PLstuff[0] : request.PLstuff[length - 1]
					}
				}else{
					mainBox.innerText = request.PLstuff[0]
				}
			}
			if(KeyStr){	
				key2any();
				getSettings();
				pasteMain()
			}
			if(request.largeInputs > 0){			//there are fillable boxes, so set flag so the Send to Page button can be displayed
				hasInputBoxes = true
			}
		}

	}else if(request.message == "keys_fromBg"){			//get cached keys from background
		if(request.KeyStr){
			KeyStr = request.KeyStr;
			KeySgn = new Uint8Array(32);				    //must be Uint8Array type
			for(var i = 0; i < 32; i++) KeySgn[i] = request.KeySgn[i];
			KeyDH = new Uint8Array(32);				    //must be Uint8Array type
			for(var i = 0; i < 32; i++) KeyDH[i] = request.KeyDH[i];
			KeyDir = new Uint8Array(32);				    //must be Uint8Array type
			for(var i = 0; i < 32; i++) KeyDir[i] = request.KeyDir[i];
			myLock = new Uint8Array(32);
			for(var i = 0; i < 32; i++) myLock[i] = request.myLock[i];
			myLockStr = request.myLockStr;
			myezLock = request.myezLock;
			myEmail = request.myEmail;
			userName = request.userName;
			locDir = request.locDir
		}
				
	}else if(request.message == "master_fromBg"){		//same for SynthPass master Password
		if(request.masterPwd){
			masterPwd = request.masterPwd;
			masterPwd1.value = masterPwd;
			showPwdMode1.style.display = 'none'
		}

	}else if(request.message == "delete_keys"){			//delete cached keys
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
		LocDir = {};
		pwdMsg.textContent = 'Your Password has expired. Please enter it again';
		pwdMsg.style.color = ''

	}else if(request.message == "done") {		//content script done, so store the serial, if any, of the password that has focus, plus the user name
		if(synthPass.style.display == 'block'){	//send SP master to background
			var pwdStr = document.getElementById("masterPwd" + lastFocus).value.trim();
			if(pwdStr){
				masterPwd = pwdStr;
				preserveMaster()
			}
    		var	serialStr = document.getElementById("serial" + lastFocus).value.trim(),
				userStr = userID.value.trim(),
				lengthStr = pwdLength.value.trim();
			if(serialStr == '-') serialStr = '';									//don't store '-' serial

		//store serial, user name, password length, and encrypted password if they exist	
			if(websiteName){										
				var jsonfile = {};
				jsonfile[websiteName] = [serialStr,userStr,lengthStr,cryptoStr];
    			chrome.storage.sync.set(jsonfile)
			}

		}else{							//send PL keys to background
			preserveKeys()
		}

		window.close()
	}
  }
)

function preserveMaster(){
	if(masterPwd){
		chrome.runtime.sendMessage({message: "reset_timer"});			//reset auto timer on background page
		chrome.runtime.sendMessage({message: "preserve_master", masterPwd: masterPwd})
	}
}

function preserveKeys(){
	if(KeyStr){
		chrome.runtime.sendMessage({message: "reset_timer"});			//reset auto timer on background page
		chrome.runtime.sendMessage({message: 'preserve_keys', KeyStr: KeyStr, KeySgn: KeySgn, KeyDH: KeyDH, KeyDir: KeyDir, myEmail: myEmail, myLock: myLock, myLockStr: myLockStr, myezLock: myezLock, userName: userName, locDir: locDir});
	}
}

function retrieveMaster(){
	chrome.runtime.sendMessage({message: 'retrieve_master'})
}

function retrieveKeys(){
	chrome.runtime.sendMessage({message: 'retrieve_keys'})
}

//now that the receiving code is in place, begin by retrieving data stored in background page
retrieveMaster();
retrieveKeys();

//global variables that will be used in computations
var websiteName, pwdNumber = 0, hasInputBoxes, cryptoStr = '';

//gets executed with the OK button
function doSynth(clipOn) {
	var pwdStr1 = masterPwd1.value.trim(),			//get passwords and serials
		serialStr1 = serial1.value.trim(),
		pwdStr2 = masterPwd2.value.trim(),
		serialStr2 = serial2.value,					//not trimmed so spaces mean "no serial" rather than "repeat serial"
		pwdStr3 = masterPwd3.value.trim(),
		serialStr3 = serial3.value,
		pwdStr4 = masterPwd4.value.trim(),
		serialStr4 = serial4.value,
		userStr = userID.value.trim(),
		lengthStr = pwdLength.value.replace(/ /g,'');
		
	if(pwdTable.style.display == 'block' && !pwdStr1 && row2.style.display == 'none'){		//no password in single box
		synthMsg.textContent = "Please enter something or click Cancel";
		return
	}else if(pwdNumber == 1 && serialStr1 == '-' && !cryptoStr){							//raw password to be used, send user back to webpage
		synthMsg.textContent = "If you do not want to synthesize the password, better to enter it directly on the webpage";
		serial1.value = '';
		return
	}
	
	//detect special in "length" box
	if(!lengthStr){												//default length is 44
		lengthStr = 44
	}else if(lengthStr.toLowerCase().match(/al/)){			//alphanumeric case
		var isAlpha = true;
		var digits = lengthStr.match(/[0-9]/g);					//extract digits, default is 44
		lengthStr = digits ? digits.join('') : 44
	}else if(lengthStr.toLowerCase().match(/pin|num/)){		//numeric case
		var isPin = true;
		var digits = lengthStr.match(/[0-9]/g);					//extract digits, default is 4
		lengthStr = digits ? digits.join('') : 4
	}else{															//general case, which may include special characters
		var spChars = lengthStr.match(/[^A-Za-z0-9]/g);			//detect special characters and add them to the alphabet
		if(spChars) base = base62 + spChars.join('');
		var digits = lengthStr.match(/[0-9]/g);					//extract digits, default is 44
		lengthStr = digits ? digits.join('') : 44
	}
	
	synthMsg.style.color = '';
	blinkMsg(synthMsg);
	
	setTimeout(function(){														//the rest after a 0 ms delay
		if(pwdTable.style.display == 'block'){					//do passwords if the boxes are displayed, otherwise, just userName
			var pwdOut = [],			//compute the new password into an array
				newPwd = pwdSynth(1,pwdStr1,serialStr1,isPin,isAlpha);
			if(!newPwd) return;								//bail out if just erasing stored password
			pwdOut.push(newPwd.slice(0,lengthStr));

			if(clipOn) copyStr(newPwd.slice(0,lengthStr));	//copy this one to clipboard if so directed
	
	//fill missing inputs and compute the rest of the passwords
			if(pwdNumber > 1){
				if(!pwdStr2) pwdStr2 = pwdStr1;
				if(!serialStr2) serialStr2 = serialStr1;
				newPwd = (serial2.value == serial1.value) && (pwdStr2 == pwdStr1) && serialStr2 != '+' ? pwdOut[0] : pwdSynth(2,pwdStr2,serialStr2,isPin,isAlpha);
				pwdOut.push(newPwd.slice(0,lengthStr))
			}
			if(pwdNumber > 2){
				if(!pwdStr3) pwdStr3 = pwdStr2;
				if(!serialStr3) serialStr3 = serialStr2;
				newPwd = (serial3.value == serial2.value) && (pwdStr3 == pwdStr2) ? pwdOut[1] : pwdSynth(3,pwdStr3,serialStr3,isPin,isAlpha);
				pwdOut.push(newPwd.slice(0,lengthStr))
			}
			if(pwdNumber > 3){
				if(!pwdStr4) pwdStr4 = pwdStr3;
				if(!serialStr4) serialStr4 = serialStr3;
				newPwd = (serial4.value == serial3.value) && (pwdStr4 == pwdStr3) ? pwdOut[2] : pwdSynth(4,pwdStr4,serialStr4,isPin,isAlpha);
				pwdOut.push(newPwd.slice(0,lengthStr))
			}
	  	}
		//send new passwords to page
		if(userTable.style.display == 'block'){
    		chrome.tabs.sendMessage(activeTab.id, {message: "clicked_OK", passwords: pwdOut, userName: userStr})
		}else{
			chrome.tabs.sendMessage(activeTab.id, {message: "clicked_OK", passwords: pwdOut})
		}
		
		setTimeout(function(){				//close window after 2 seconds in case the content script does not reply
			window.close();
	  	}, 2000);
	},0)
}

//this for the Send to Page button in the PassLok interface
function send2page(){
	setTimeout(function(){
		chrome.tabs.sendMessage(activeTab.id, {message: "clicked_OK", PLoutput: mainBox.innerHTML})
		
		setTimeout(function(){				//close window after 2 seconds in case the content script does not reply
			window.close();
	  	}, 2000);
	},0)
}

//asks for password again, presumably under different identity
function resetIdentity(){
	pwdBox.value = '';
	KeyStr = '';
	KeyDir = '';
	KeySgn = '';
	KeyDH = '';
	myEmail = '';
	myLock = '';
	locDir = {};
	myLockStr = '';
	myezLock = '';
	userName = '';
	chrome.runtime.sendMessage({message: "reset_now"});			//delete everything in background page
	keyScr.style.display = 'block';
	shadow.style.display = 'block';
	pwdMsg.textContent = 'Select Identity and enter Master Key';
	pwdMsg.style.color = ''
}

//synthesizes a new password, or stores and retrieves one provided by user
function pwdSynth(boxNumber, pwd, serial, isPin, isAlpha){
	if(!pwd){
		synthMsg.textContent = "Please write your Master Password";
		return
	}
	if(serial == '-'){						//special case to delete stored password, and using Master Password directly in a change password case
		if(!confirm("A dash in the serial box tells me that you want to erase a stored password. Click OK if this is what you want.")) return false;
		cryptoStr = '';					//reset stored password
		serial = '';
		serial1.value = ''; serial2.value = '';serial3.value = ''; serial4.value = '';
		var userStr = userName.value.trim(),
			lengthStr = pwdLength.value.trim(),
			jsonfile = {};
		jsonfile[websiteName] = [serial,userStr,lengthStr,cryptoStr];		//and now erase from storage
    	chrome.storage.sync.set(jsonfile);
		synthMsg.textContent = "The stored password has been deleted";
		if(pwdNumber == 1){
			return false
		}else{
			return pwd						//keep going is this is part of a password change
		}
	}else if(serial == '+'){						//use stored password				
		if(cryptoStr && (boxNumber == 1 || !document.getElementById('serial' + boxNumber).value)){						//already stored in encrypted form: decrypt it
			var cipher = nacl.util.decodeBase64(cryptoStr),
				nonce = cipher.slice(0,9),												//no marker byte
				nonce24 = makeNonce24(nonce),
				cipher2 = cipher.slice(9),
				KeyDir = wiseHash(pwd,websiteName),
				plain = nacl.secretbox.open(cipher2,nonce24,KeyDir);
			if(plain){
				return nacl.util.encodeUTF8(plain)
			}else{
				synthMsg.textContent = "Decryption of stored password has failed"
				return false
			}
		}else{								//not stored or these are extra boxes, so ask for it, encrypt it, to be saved at the end
			var plainStr = prompt("Please enter a password to remember for this website");
			if(!plainStr){
				synthMsg.textContent = "Password store canceled";
				return false
			}else{																	//encrypt user-supplied password
				var	nonce = nacl.randomBytes(9),
					nonce24 = makeNonce24(nonce),
					plain =	 nacl.util.decodeUTF8(plainStr),
					KeyDir = wiseHash(pwd,websiteName),
					cipher = nacl.secretbox(plain,nonce24,KeyDir);
				cryptoStr = nacl.util.encodeBase64(concatUint8Arrays(nonce,cipher)).replace(/=+$/,'')
				return plainStr
			}
		}
	//the rest of the options are synthesized through wiseHash
		
	}else if(isPin){				//return only decimal digits, with equal probability
		cryptoStr = '';
		return nacl.util.encodeBase64(wiseHash(pwd,websiteName + serial.trim())).replace(/[AaBbC]/g,'0').replace(/[cDdEe]/g,'1').replace(/[FfGgH]/g,'2').replace(/[hIiJj]/g,'3').replace(/[KkLlM]/g,'4').replace(/[mNnOo]/g,'5').replace(/[PpQqR]/g,'6').replace(/[rSsTt]/g,'7').replace(/[UuVvW]/g,'8').replace(/[wXxYy]/g,'9').match(/[0-9]/g).join('')
	}else if(isAlpha){						//replace extra base64 characters with letters
		cryptoStr = '';
		return nacl.util.encodeBase64(wiseHash(pwd,websiteName + serial.trim())).replace(/\+/g,'a').replace(/\//g,'b').replace(/=/,'c')
	}else{
		cryptoStr = '';
		if(base == base62){				//replace some base64 characters with default special characters
			return nacl.util.encodeBase64(wiseHash(pwd,websiteName + serial.trim())).replace(/[+/=Aa]/g,'_').replace(/[BbCc]/,'!').replace(/[DdEe]/,'#')
		}else{								//change base in order to include the special characters, with equal probability
			return base.charAt(62) + changeBase(nacl.util.encodeBase64(wiseHash(pwd,websiteName + serial.trim())).replace(/=$/g,''), base64, base) 				//use at least the first of the characters on the list
		}
	}
}

//displays SynthPass interface
function displaySynth(){
	passLok.style.display = 'none';
	synthPass.style.display = 'block';
	document.body.style.height = ''
}

//displays PassLok interface
function displayPL(){
	passLok.style.display = 'block';
	synthPass.style.display = 'none';
	document.body.style.height = '580px'
}

//fetches userId and displays in box so it can be added
function fetchUserId(){
	userTable.style.display = 'block';
	lengthLabel.style.display = 'none';
	pwdLength.style.display = 'none';
	synthMsg.textContent = "There was no user ID stored";

	//now get the userName from storage, and put it in its place
	chrome.storage.sync.get(websiteName, function (obj){
		var serialData = obj[websiteName];
		if(serialData){
			if(serialData[1]){userID.value = serialData[1];		//fill user ID
			okBtn.style.display = '';
			synthMsg.textContent = "Click OK to put it in the page"
			}
		}
	})
}

//this for showing and hiding text in the Password boxes
function showSynthPwd(number){
	var pwdEl = document.getElementById('masterPwd' + number),
		imgEl = document.getElementById('showPwdMode' + number);
	if(pwdEl.type == "password"){
		pwdEl.type = "text";
		imgEl.src = "images/hide-24.png"
	}else{
		pwdEl.type = "password";
		imgEl.src = "images/eye-24.png"
	}
}

var lastFocus = '1';			//default is first row

//displays Keys strength and executes on Enter
function pwdSynthKeyup(evt){
	evt = evt || window.event;
	var key = evt.keyCode || evt.which || evt.keyChar,
		pwdEl = document.activeElement;
	lastFocus = pwdEl.id.slice(-1);					//get last focused row
	if(!pwdEl.value){									//display Show label and checkbox if empty (hidden for cached password)
		showPwdMode1.style.display = ''
	}
	if(key == 13){doSynth()} else{
		 if(pwdEl.value.trim()){
			 keyStrength(pwdEl.value,'synth')
		 }else{
			 synthMsg.textContent = "Please enter the Master Key";
			 synthMsg.style.color = ''
		 }
	}
}

function userKeyup(evt){
	evt = evt || window.event;
	var key = evt.keyCode || evt.which || evt.keyChar;
	if(key == 13) doStuff()
}

//for cases with user-specified special characters
var base62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
	base = base62;
	
//to select the result in Help synthesizer
function copyOutput(){
  if(outputBox.textContent.trim() != ''){
    var range, selection;
    if(document.body.createTextRange){
        range = document.body.createTextRange();
        range.moveToElementText(outputBox);
        range.select()
    }else if (window.getSelection){
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(outputBox);
        selection.removeAllRanges();
        selection.addRange(range)
    }
	document.execCommand('copy');
	outputBox.textContent = '';
	helpMsg.textContent = "Output copied to clipboard"
  }
}

//this part of the code is to synthesize passwords using the fields in the last Help item
function doStuffHelp(e) {
	websiteName = siteName.value.toLowerCase();			//get all the data
	var	pwdStr = masterPwdHelp.value,	
		serialStr = serialHelp.value,
		lengthStr = pwdLengthHelp.value.replace(/ /g,'');
		
	if(!pwdStr){																//no password in box
		helpMsg.textContent = "Please enter your master Password";
		return
	}
	if(!websiteName){																//no website in box
		helpMsg.textContent = "Please enter the website name as name.suffix or name.suffix.countryID";
		return
	}
	var websiteParts = websiteName.split('.');
	if(websiteParts.length != 2 && !(websiteParts.length == 3 && websiteParts[2].length == 2)){
		helpMsg.textContent = "The website name should contain only two or three pieces of text with dots between them";
		return
	}
	if(websiteParts.length == 3 && websiteParts[1].length > 3) websiteName = websiteParts.slice(-2).join('.'); //correction for long STL

	//detect special in "length" box
	if(!lengthStr){												//default length is 44
		lengthStr = 44
	}else if(lengthStr.toLowerCase().match(/al/)){			//alphanumeric case
		var isAlpha = true;
		var digits = lengthStr.match(/[0-9]/g);					//extract digits, default is 44
		lengthStr = digits ? digits.join('') : 44
	}else if(lengthStr.toLowerCase().match(/pin|num/)){		//numeric case
		var isPin = true;
		var digits = lengthStr.match(/[0-9]/g);					//extract digits, default is 4
		lengthStr = digits ? digits.join('') : 4
	}else{															//general case, which may include special characters
		var spChars = lengthStr.match(/[^A-Za-z0-9]/g);			//detect special characters and add them to the alphabet
		if(spChars) base = base62 + spChars.join('');
		var digits = lengthStr.match(/[0-9]/g);					//extract digits, default is 44
		lengthStr = digits ? digits.join('') : 44
	}

	helpMsg.style.color = '';
	blinkMsg(helpMsg);
	
	setTimeout(function(){														//the rest after a 10 ms delay
		helpMsg.textContent = "Password synthesized. Copy it now";
		outputBox.textContent = pwdSynth(0,pwdStr,serialStr,isPin,isAlpha).slice(0,lengthStr);
		masterPwdHelp.value = '';
		siteName.value = '';
		websiteName = '';
		pwdLengthHelp.value = '';
		serialHelp.value = '';
	},10);
}

//to display password strength
function pwdKeyupHelp(evt){
	evt = evt || window.event;
	var key = evt.keyCode || evt.which || evt.keyChar;
	if(key == 13){doStuffHelp()} else{
		 if(masterPwdHelp.value){
			 keyStrength(masterPwdHelp.value,'help')
		 }else{
			 helpMsg.textContent = "Please enter the Master Key"
		 }
	}
}

//displays output password length
function outputKeyup(){
	helpMsg.textContent = "Output is " + outputBox.textContent.length + " characters long"
}

//for copying the result to clipboard. Uses invisible input element.
function copyStr(string){
	var box = document.createElement('textarea');
	box.value = string;
	document.body.appendChild(box);
	box.focus();
	box.select();
	document.execCommand('copy');
	document.body.removeChild(box)
}