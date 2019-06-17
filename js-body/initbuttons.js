﻿// initialize things
window.onload = function() {

	if(isMobile){
		niceEditBtn.style.display = 'none';			//no rich text editing on mobile
		mainFile.style.display = 'none';
		selectMainBtn.style.display = 'none';
		imgSpacer.style.display = 'none';
	} else {
		previewImg.style.width = "80%";					//smaller image on PCs
		sendSMSBtn.style.display = 'none';
	}
	if(!isMobile || isChrome){						//search box in Help tab. Works on Android Chrome, but won't detect right
		helpTopMobile.style.display = 'none';
		helpTop.style.display = 'block';
		helpSpace.style.display = 'block';
	}
	if(isAndroid){										//resize shift buttons on Android
		extra2mainBtn.style.padding = '11px';
		main2extraBtn.style.padding = '11px';
	}
	if(isiOS) encodeJPGBtn.style.display = 'none';	//JPG hide does not work on iOS
	if(isiPhone || isAndroidPhone){					//to make things fit on narrow screens
		anonLabel.textContent = ' Anon.  ';
		modeLabel.style.display = 'none';
		otherLabel.style.display = 'none';
		greenLabel.textContent = 'Grn';
		customLabel.textContent = 'Cust';
		backgroundLabel.textContent = 'Bg.';
		sentencesLabel.textContent = 'Sent.';
		lockScr.style.top = "5%";
		lockScr.style.left = "5%";
		lockScr.style.width = "90%";
		lockScr.style.height = "90%";
	}
	if(isiOS && isFile){								//don't display things that don't work on iOS app
		introVideoText.style.display = 'none';
		sendSMSBtn.style.display = 'none';
	}
	
  //load field icons
	showKey.src = eyeImg;
	showIntroKey.src = eyeImg;
	showNewKeyCheck.src = eyeImg;
	showDecoyInCheck.src = eyeImg;
	showDecoyOutCheck.src = eyeImg;

  //event listeners for buttons etc.
	window.addEventListener('resize',textheight);

	mainFile.addEventListener('change', loadFileAsURL);
	mainFile.addEventListener('click', function(){this.value = '';});
	
	imgFile.addEventListener('change', loadImage);
	imgFile.addEventListener('click', function(){this.value = '';});

	imageFile.addEventListener('change', importImage);
	imageFile.addEventListener('click', function(){this.value = '';});

	imageFileEmail.addEventListener('change', importImage);
	imageFileEmail.addEventListener('click', function(){this.value = '';});

	lockFile.addEventListener('change', loadLockFile);
	lockFile.addEventListener('click', function(){this.value = '';});

    encodePNGBtn.addEventListener('click', encodePNG);

	encodeJPGBtn.addEventListener('click', encodeJPG);

    decodeImgBtn.addEventListener('click', decodeImage);

	imagePwd.addEventListener('keyup', imageKeyup);

	showLockBtn.addEventListener('click', showLock);

	selectMainBtn.addEventListener('click', selectMain);

   	clearMainBtn.addEventListener('click', clearMain);

	showLockBtnBasic.addEventListener('click', showLock);

   	decryptBtn.addEventListener('click', lockBtnAction);

	verifyBtn.addEventListener('click', signVerify);

   	main2extraBtn.addEventListener('click', main2extra);

   	decryptBtnBasic.addEventListener('click', lockBtnAction);

	decryptBtnEmail.addEventListener('click', lockBtnAction);

   	extra2mainBtn.addEventListener('click', main2extra);

   	niceEditBtn.addEventListener('click', toggleRichText);

   	chatBtn.addEventListener('click', Chat);

   	sendSMSBtn.addEventListener('click', sendSMS);

   	secretShareBtn.addEventListener('click', splitJoin);

	stegoBtn.addEventListener('click', textStego);

	stegoBtnEmail.addEventListener('click', textStego);

   	image2mainBtn.addEventListener('click', image2main);

   	lock2dirBtn.addEventListener('click', lock2dir);

   	clearLocksBtn.addEventListener('click', clearLocks);

   	addLockBtn.addEventListener('click', function(){addLock(false)});

   	removeLockBtn.addEventListener('click', removeLock);

   	resetPFSBtn.addEventListener('click', resetPFS);

   	showLockDBBtn.addEventListener('click', showLockDB);

   	mergeLockDBBtn.addEventListener('click', mergeLockDB);

   	moveLockDBBtn.addEventListener('click', moveLockDB);

   	acceptKeyBtn.addEventListener('click', acceptKey);

   	cancelKeyBtn.addEventListener('click', cancelKey);

   	skipIntroBtn.addEventListener('click', cancelKey);

   	changeNameBtn.addEventListener('click', showName);

   	changeKeyBtn.addEventListener('click', changeKey);

   	changeEmailBtn.addEventListener('click', showEmail);

   	backupSettingsBtn.addEventListener('click', moveMyself);

   	basicMode.addEventListener('click', mode2basic);

   	advancedMode.addEventListener('click', mode2adv);

	emailMode.addEventListener('click', mode2email);

	anonMode.addEventListener('click', checkboxStore);

	signedMode.addEventListener('click', checkboxStore);

	onceMode.addEventListener('click', checkboxStore);

	learnMode.addEventListener('click', checkboxStore);

	longMode.addEventListener('click', checkboxStore);

	shortMode.addEventListener('click', checkboxStore);

	compatMode.addEventListener('click', checkboxStore);

	decoyMode.addEventListener('click', checkboxStore);

	wordLockMode.addEventListener('click', checkboxStore);

	ezLokMode.addEventListener('click', checkboxStore);

   	normalLockMode.addEventListener('click', checkboxStore);

	fileMode.addEventListener('click', checkboxStore);

	binaryMode.addEventListener('click', checkboxStore);

	textMode.addEventListener('click', checkboxStore);

	chromeSyncMode.addEventListener('click', checkboxStore);

	sentenceMode.addEventListener('click', checkboxStore);

	letterMode.addEventListener('click', checkboxStore);

	invisibleMode.addEventListener('click', checkboxStore);

	wordMode.addEventListener('click', checkboxStore);

	spaceMode.addEventListener('click', checkboxStore);

   	showKey.addEventListener('click', showsec);

   	introRandomBtn.addEventListener('click', randomToken);

	clearIntroRandomBtn.addEventListener('click', clearIntroEmail);

   	randomEmailBtn.addEventListener('click', randomToken);

   	acceptEmailBtn.addEventListener('click', email2any);

   	cancelEmailBtn.addEventListener('click', cancelEmail);

   	acceptNameBtn.addEventListener('click', name2any);

   	cancelNameBtn.addEventListener('click', cancelName);

   	showIntroKey.addEventListener('click', showIntro);

   	clearIntroBtn.addEventListener('click', clearIntro);

   	suggestIntroBtn.addEventListener('click', suggestIntro);

   	showlockIntroBtn.addEventListener('click', initUser);

   	showDecoyInCheck.addEventListener('click', showDecoyIn);

   	submitDecoyBtn.addEventListener('click', submitDecoy);

   	cancelDecoyBtn.addEventListener('click', cancelDecoy);

   	showDecoyOutCheck.addEventListener('click', showDecoyOut);

   	submitDecoy2Btn.addEventListener('click', submitDecoy);

   	cancelDecoy2Btn.addEventListener('click', cancelDecoy);

   	submitPartsBtn.addEventListener('click', submitParts);

   	cancelPartsBtn.addEventListener('click', cancelPartsIn);

	closeLockdirBtn.addEventListener('click', lock2dir);

   	submitChatBtn.addEventListener('click', makeChat);

	lockList.addEventListener('change', fillBox);
	
	lockList.addEventListener('click', updateButtons);

   	resetListBtn.addEventListener('click', resetList);

	resetIdentBtn.addEventListener('click', resetIdentity);

	main2lockBtn.addEventListener('click', main2lock);

	lock2mainBtn.addEventListener('click', main2lock);

   	newUserBtn.addEventListener('click', newUser);

   	submitKeyChangeBtn.addEventListener('click', changeKey);

   	cancelKeyChangeBtn.addEventListener('click', cancelKeyChange);

   	showNewKeyCheck.addEventListener('click', showNewKey);

	gotointro2.addEventListener('click', go2intro2);

   	backtointro1.addEventListener('click', go2intro2);

   	gotointro3.addEventListener('click', go2intro3);

   	backtointro2.addEventListener('click', go2intro3);

   	gotointro4.addEventListener('click', go2intro4);

   	backtointro3.addEventListener('click', go2intro4);

   	gotointro5.addEventListener('click', go2intro5);

   	backtointro4.addEventListener('click', go2intro5);

   	mainBox.addEventListener('keyup', charsLeft);

	mainBox.addEventListener('paste', pasteMain);

   	decoyText.addEventListener('keyup', charsLeft);

   	chatDate.addEventListener('keyup', charsLeft);

	pwdBox.addEventListener('keyup', function(event) {pwdKeyup(event)}, false);

   	pwdIntro.addEventListener('keyup', introKeyup);

	decoyPwdIn.addEventListener('keyup', function(event) {decoyKeyup(event)}, false);

	decoyPwdOut.addEventListener('keyup', function(event) {decoyKeyupOut(event)}, false);

	partsIn.addEventListener('keyup', function(event) {partsKeyup(event)}, false);

	newKey.addEventListener('keyup', newKeyup);

	newKey2.addEventListener('keyup', function(event) {newKey2up(event)}, false);

	lockBox.addEventListener('keyup', function(event) {lockBoxKeyup(event)}, false);

	lockBox.addEventListener('paste', pasteLock);

	userNameBox.addEventListener('keyup', function(event) {nameKeyup(event)}, false);

	emailBox.addEventListener('keyup', function(event) {emailKeyup(event)}, false);

//for the rich text editor boxes and buttons
	formatBlock.addEventListener("change", function() {formatDoc('formatBlock',this[this.selectedIndex].value);this.selectedIndex=0;});
	fontName.addEventListener("change", function() {formatDoc('fontName',this[this.selectedIndex].value);this.selectedIndex=0;});
	fontSize.addEventListener("change", function() {formatDoc('fontSize',this[this.selectedIndex].value);this.selectedIndex=0;});
	foreColor.addEventListener("change", function() {formatDoc('foreColor',this[this.selectedIndex].value);this.selectedIndex=0;});
	backColor.addEventListener("change", function() {formatDoc('backColor',this[this.selectedIndex].value);this.selectedIndex=0;});

	document.images[0].addEventListener("click", function() {formatDoc('bold')});
	document.images[1].addEventListener("click", function() {formatDoc('italic')});
	document.images[2].addEventListener("click", function() {formatDoc('underline')});
	document.images[3].addEventListener("click", function() {formatDoc('strikethrough')});
	document.images[4].addEventListener("click", function() {formatDoc('subscript')});
	document.images[5].addEventListener("click", function() {formatDoc('superscript')});
	document.images[6].addEventListener("click", function() {formatDoc('justifyleft')});
	document.images[7].addEventListener("click", function() {formatDoc('justifycenter')});
	document.images[8].addEventListener("click", function() {ormatDoc('justifyright')});
	document.images[9].addEventListener("click", function() {formatDoc('justifyfull')});
	document.images[10].addEventListener("click", function() {formatDoc('insertorderedlist')});
	document.images[11].addEventListener("click", function() {formatDoc('insertunorderedlist')});
	document.images[12].addEventListener("click", function() {formatDoc('formatBlock','blockquote')});
	document.images[13].addEventListener("click", function() {formatDoc('outdent')});
	document.images[14].addEventListener("click", function() {formatDoc('indent')});
	document.images[15].addEventListener("click", function() {formatDoc('inserthorizontalrule')});
	document.images[16].addEventListener("click", function() {var sLnk=prompt('Write the URL here','http:\/\/');if(sLnk&&sLnk!=''&&sLnk!='http://'){formatDoc('createlink',sLnk)}});
	document.images[17].addEventListener("click", function() {formatDoc('unlink')});
	document.images[18].addEventListener("click", function() {formatDoc('removeFormat')});
	document.images[19].addEventListener("click", function() {formatDoc('undo')});
	document.images[20].addEventListener("click", function() {formatDoc('redo')});

//for the help screens
	var helpHeaders = document.getElementsByClassName("helpHeading");		//add listeners to all the help headers

	for (var i = 0; i < helpHeaders.length; i++) {
		helpHeaders[i].addEventListener('click', function(){openHelp(this.id.slice(1))});
	}

//fixes after inline styles were moved to css file

	lockList.style.padding = '4px';
	lockList.style.width = '30%';
	basicBtnsTop.style.display = 'block';
	mainMsg.style.minHeight = '20px';
	extraButtonsTop.style.display = 'none';
	
// special initialization for universal extension
	
	sendBtn.addEventListener('click', send2page);					//execute the action
	
	if(mainBox.textContent == '') sendBtn.style.visibility = 'hidden';		//hide blinking button if there's nothing to send
	
	isSynthHelp = false;
	
	if(!isMobile || isChrome){						//search box in Help tab. Works on Android Chrome, but won't detect right
		helpTopMobileSynth.style.display = 'none';
		helpTopSynth.style.display = 'block'
	}
	
//SynthPass interface button listeners
	okBtnSynth.addEventListener('click', doSynth);					//execute the action
	okBtnSynth.style.display = 'none';	
	row2.style.display = 'none';
	row3.style.display = 'none';
	row4.style.display = 'none';

	cancelBtnSynth.addEventListener('click', function(){window.close()});		//quit
	
	failMsg.addEventListener('click', fetchUserId);				//fetch userID anyway and display
	
	masterPwd1.addEventListener('keyup', pwdSynthKeyup, false);		//display password strength and execute on Enter
	masterPwd2.addEventListener('keyup', pwdSynthKeyup, false);
	masterPwd3.addEventListener('keyup', pwdSynthKeyup, false);
	masterPwd4.addEventListener('keyup', pwdSynthKeyup, false);
	userID.addEventListener('keyup', userKeyup, false);
	
	masterPwd1.addEventListener('focus', function(){var pwd = masterPwd1.value; if(pwd) keyStrength(pwd,true)}, false);
	masterPwd2.addEventListener('focus', function(){var pwd = masterPwd2.value; if(pwd) keyStrength(pwd,true)}, false);
	masterPwd3.addEventListener('focus', function(){var pwd = masterPwd3.value; if(pwd) keyStrength(pwd,true)}, false);
	masterPwd4.addEventListener('focus', function(){var pwd = masterPwd4.value; if(pwd) keyStrength(pwd,true)}, false);
	
	serial1.addEventListener('focus', function(){lastFocus = '1'},false);		//for storing the correct serial
	serial2.addEventListener('focus', function(){lastFocus = '2'},false);
	serial3.addEventListener('focus', function(){lastFocus = '3'},false);
	serial4.addEventListener('focus', function(){lastFocus = '4'},false);
	
	showPwdMode1.addEventListener('click', function(){showPwd('1')});				//toggle visibility of the passwords
	showPwdMode2.addEventListener('click', function(){showPwd('2')});
	showPwdMode3.addEventListener('click', function(){showPwd('3')});
	showPwdMode4.addEventListener('click', function(){showPwd('4')});
	
	okBtnHelp.addEventListener('click', doStuffHelp);								//execute
	showPwdModeHelp.addEventListener('click', function(){showPwd('Help')});
	copyBtnHelp.addEventListener('click', copyOutput);
	
	masterPwdHelp.addEventListener('keyup', pwdKeyupHelp, false);
	outputBox.addEventListener('keyup', outputKeyup, false)
	
//collect data from content script. Also triggers initialization
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    	activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {message: "start"});
	});
};

//for general directory
window.addEventListener('message', receiveMessage, false);

//gets Lock from the general directory iframe and puts it in Lock screen
function receiveMessage(evt){
  	if (evt.origin === 'https://www.passlok.com'){
    	lockBox.textContent = evt.data;
		suspendFindLock = true;
		lockMsg.textContent='Give a name to this Lock and save it. Otherwise Clear.'
  	}
}

if(!localStorage){newUser();}else if(localStorage.length == 0){newUser();};

fillNameList();

initTabs('PLtabs');																	//initialize tabs
initTabs('SPtabs');
spTab1.className = 'selected';
mainTabSynth.className = 'tabContent';

var time10 = hashTime10();													//get milliseconds for 10 wiseHash at iter = 10

//end of body script.