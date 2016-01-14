var seed;
var siteCode;
var chars;
var size;

var digest;

var isAdvSetting = true;
onAdvSettingClick();

onSizeChanged(16);
onCharsChanged();

function onMainCodeChanged(value){
	seed = wrap(sha1(value), ")!@#$%^&*(ABCDEF");
	seed = wrap(sha1(seed), ")!@#$%^&*(ABCDEF");
	
	updateDigest();
}
function onSiteCodeChanged(value){
	siteCode = value.toLowerCase();
	
	updateDigest();
}
function onSizeChanged(value){
	document.getElementById("sizeBar").value = value;
	document.getElementById("sizeNum").value = value;
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
	node.select();
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

function onAdvSettingClick(){
	isAdvSetting = !isAdvSetting;
	document.getElementById("advSettingLink").innerHTML = isAdvSetting ? "[-]" : "[+]";
	document.getElementById("advSetting").style.display = isAdvSetting ? "block" : "none";
}
