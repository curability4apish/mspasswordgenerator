var seed;
var siteCode;
var chars;
var size;

var digest;

var isSaveMainCode = false;

onSizeChanged(16);
onCharsChanged();
loadSeed();

function onMainCodeChanged(value){
	seed = wrap(sha1(value), ")!@#$%^&*(ABCDEF");
	seed = wrap(sha1(seed), ")!@#$%^&*(ABCDEF");
	if(isSaveMainCode) {
		window.localStorage.setItem("pw.seed", seed);
	}
	
	updateDigest();
}
function onSiteCodeChanged(value){
	siteCode = value.toLowerCase();
	loadSiteConfig();
	
	updateDigest();
}
function onSizeChanged(value){
	document.getElementById('size').value = value;
	size = value;
	
	updatePassword();
}
function onCharsChanged(){
	chars = ""
    	+ (document.getElementById("uppercase").checked ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" :
			(document.getElementById("lowercase").checked ? "abcdefghijklmnopqrstuvwxyz" : 
				(document.getElementById("number").checked ? "01234567890123456789012345" : "01234567890123456789012345")
			)
		)
		+ (document.getElementById("lowercase").checked ? "abcdefghijklmnopqrstuvwxyz" :
			(document.getElementById("uppercase").checked ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : 
				(document.getElementById("number").checked ? "01234567890123456789012345" : "01234567890123456789012345")
			)
		)
        + (document.getElementById("number").checked ? "0123456789" :
    		(document.getElementById("lowercase").checked ? "abcdefghij" : 
				(document.getElementById("uppercase").checked ? "ABCDEFGHIJ" : "0123456789")
			)
		)
		+ (document.getElementById("symbol").checked ? "._" :
			(document.getElementById("number").checked ? "00" : 
				(document.getElementById("lowercase").checked ? "aa" :
					(document.getElementById("uppercase").checked ? "AA" : "00")
				)
			)
		);

	updatePassword();
}

function onPasswordClick(node){
	saveSiteConfig();
	
	node.select();
}

function onSaveMainCodeChanged(value){
	isSaveMainCode = value;
	document.getElementById("isSaveMainCode").checked = isSaveMainCode;
	
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
	
	onSaveMainCodeChanged(true);
	seed = getLocalStorageItem("pw.seed", null);
	if(seed != null) {
		var node = document.getElementById("mainCode");
		node.value = "Change Saved Code";
		node.type = "text";
		node.setAttribute("onclick", "resetMainCode();");
		document.getElementById("siteCode").focus();
	}
}
function resetMainCode(){
	var node = document.getElementById("mainCode");
	node.value = "";
	node.type = "password";
	node.setAttribute("onclick", "");
}

function saveSiteConfig(){
	var config = {
		"size":size-0,
		"numberChecked":document.getElementById("number").checked,
		"lowercaseChecked":document.getElementById("lowercase").checked,
		"uppercaseChecked":document.getElementById("uppercase").checked,
		"symbolChecked":document.getElementById("symbol").checked
	};
	var siteId = wrap(sha1(siteCode), "0123456789abcdef");
	window.localStorage.setItem("pw.site."+siteId, JSON.stringify(config));
}
function loadSiteConfig() {
	var siteId = wrap(sha1(siteCode), "0123456789abcdef");
	var configStr = getLocalStorageItem("pw.site."+siteId, null);
	var config = (configStr!=null) ? JSON.parse(configStr) : {
		"size":16,
		"numberChecked":true,
		"lowercaseChecked":true,
		"uppercaseChecked":true,
		"symbolChecked":true
	};
	
	onSizeChanged(config.size);
	
	document.getElementById("number").checked = config.numberChecked;
	document.getElementById("lowercase").checked = config.lowercaseChecked;
	document.getElementById("uppercase").checked = config.uppercaseChecked;
	document.getElementById("symbol").checked = config.symbolChecked;
	onCharsChanged();
}

function getLocalStorageItem(key, defaultValue) {
	var value = window.localStorage.getItem(key);
	return value==null ? defaultValue : value;
}