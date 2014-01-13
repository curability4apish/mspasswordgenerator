var seed;
var siteCode;
var chars;
var size;

var digest;

var isAdvSetting = true;
var isSaveMainCode = false;

onAdvSettingClick();

onSizeChanged(16);
onCharsChanged();
loadSeed();

document.getElementById("mainCode").onkeyup = onMainCodeChanged;
document.getElementById("siteCode").onkeyup = onSiteCodeChanged;
document.getElementById("sizeBar").onchange = onSizeBarChanged;
document.getElementById("sizeNum").onchange = onSizeNumChanged;
document.getElementById("charsNumber").onchange = onCharsChanged;
document.getElementById("charsLowercase").onchange = onCharsChanged;
document.getElementById("charsUppercase").onchange = onCharsChanged;
document.getElementById("charsSymbol").onchange = onCharsChanged;
document.getElementById("isSaveMainCode").onchange = onSaveMainCodeChanged;
document.getElementById("password").onclick = onPasswordClick;
document.getElementById("advSettingLink").onclick = onAdvSettingClick;

function onMainCodeChanged(){
	seed = wrap(sha1(document.getElementById("mainCode").value), ")!@#$%^&*(ABCDEF");
	seed = wrap(sha1(seed), ")!@#$%^&*(ABCDEF");
	if(isSaveMainCode) {
		window.localStorage.setItem("pw.seed", seed);
	}
	
	updateDigest();
}
function onSiteCodeChanged(){
	siteCode = document.getElementById("siteCode").value.toLowerCase();
	loadSiteConfig();
	
	updateDigest();
}
function onSizeBarChanged(){
	onSizeChanged(document.getElementById('sizeBar').value);
}
function onSizeNumChanged(){
	onSizeChanged(document.getElementById('sizeNum').value);
}
function onSizeChanged(value){
	document.getElementById('sizeNum').value = value;
	document.getElementById('sizeBar').value = value;
	size = value;
	
	updatePassword();
}
function onCharsChanged(){
	chars = ""
		+ (document.getElementById("charsUppercase").checked ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" :
			(document.getElementById("charsLowercase").checked ? "abcdefghijklmnopqrstuvwxyz" : 
				(document.getElementById("charsNumber").checked ? "01234567890123456789012345" : "01234567890123456789012345")
			)
		)
		+ (document.getElementById("charsLowercase").checked ? "abcdefghijklmnopqrstuvwxyz" :
			(document.getElementById("charsUppercase").checked ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : 
				(document.getElementById("charsNumber").checked ? "01234567890123456789012345" : "01234567890123456789012345")
			)
		)
		+ (document.getElementById("charsNumber").checked ? "0123456789" :
			(document.getElementById("charsLowercase").checked ? "abcdefghij" : 
				(document.getElementById("charsUppercase").checked ? "ABCDEFGHIJ" : "0123456789")
			)
		)
		+ (document.getElementById("charsSymbol").checked ? "._" :
			(document.getElementById("charsNumber").checked ? "00" : 
				(document.getElementById("charsLowercase").checked ? "aa" :
					(document.getElementById("charsUppercase").checked ? "AA" : "00")
				)
			)
		);

	updatePassword();
}

function onPasswordClick(){
	saveSiteConfig();
	
	document.getElementById("password").select();
}

function onAdvSettingClick(){
	isAdvSetting = !isAdvSetting;
	document.getElementById("advSettingLink").innerHTML = isAdvSetting ? "[-]" : "[+]";
	document.getElementById("advSetting").style.display = isAdvSetting ? "block" : "none";
	document.getElementsByTagName("html")[0].className = isAdvSetting ? "opened" : "closed";
}

function onSaveMainCodeChanged(){
	isSaveMainCode = document.getElementById("isSaveMainCode").checked;

	window.localStorage.setItem("pw.isSaveMainCode", isSaveMainCode?"true":"false");
	
	if(!isSaveMainCode) {
		window.localStorage.removeItem("pw.seed");
	}
	else {
		if(seed) {
			window.localStorage.setItem("pw.seed", seed);
		}
	}
}

function updateDigest(){
	digest = sha1(seed+siteCode);
	
	updatePassword();
}

function updatePassword() {
	if(digest) {
		document.getElementById("password").value = wrap(digest, chars, size);
	}
}

function loadSeed(){
	document.getElementById("mainCode").focus();
	isSaveMainCode = getLocalStorageItem("pw.isSaveMainCode", false) == "true";
	if(!isSaveMainCode) {
		return;
	}
	
	document.getElementById("isSaveMainCode").checked = true;
	onSaveMainCodeChanged();
	seed = getLocalStorageItem("pw.seed", null);
	if(seed != null) {
		var node = document.getElementById("mainCode");
		node.value = "Change Saved Key";
		node.type = "text";
		node.onclick = resetMainCode;
		document.getElementById("siteCode").focus();
	}
}
function resetMainCode(){
	var node = document.getElementById("mainCode");
	node.value = "";
	node.type = "password";
	node.onclick = null;
}

function saveSiteConfig(){
	var config = {
		"size":size-0,
		"charsNumberChecked":document.getElementById("charsNumber").checked,
		"charsLowercaseChecked":document.getElementById("charsLowercase").checked,
		"charsUppercaseChecked":document.getElementById("charsUppercase").checked,
		"charsSymbolChecked":document.getElementById("charsSymbol").checked
	};
	var siteId = wrap(sha1(siteCode), "0123456789abcdef");
	window.localStorage.setItem("pw.site."+siteId, JSON.stringify(config));
}
function loadSiteConfig() {
	var siteId = wrap(sha1(siteCode), "0123456789abcdef");
	var configStr = getLocalStorageItem("pw.site."+siteId, null);
	var config = (configStr!=null) ? JSON.parse(configStr) : {
		"size":16,
		"charsNumberChecked":true,
		"charsLowercaseChecked":true,
		"charsUppercaseChecked":true,
		"charsSymbolChecked":true
	};
	
	onSizeChanged(config.size);
	
	document.getElementById("charsNumber").checked = config.charsNumberChecked;
	document.getElementById("charsLowercase").checked = config.charsLowercaseChecked;
	document.getElementById("charsUppercase").checked = config.charsUppercaseChecked;
	document.getElementById("charsSymbol").checked = config.charsSymbolChecked;
	onCharsChanged();
}

function getLocalStorageItem(key, defaultValue) {
	var value = window.localStorage.getItem(key);
	return value==null ? defaultValue : value;
}