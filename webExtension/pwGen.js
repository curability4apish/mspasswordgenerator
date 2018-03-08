var PwGen = {
	masterHash:'',
	siteKey:'',
	chars:'',
	size:16,
	isForceAllSet:false,
	
	digest:[],
	password:'',
	
	charsetFlag:0xf,
	charsetResults:[
		'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		'abcdefghijklmnopqrstuvwxyz',
		'0123456789',
		'._',
	],
	charsets:[
		'0123456789',
		'abcdefghijklmnopqrstuvwxyz',
		'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		'._',
	],
	charsetPrioritys:[
		[2,1,0,3],
		[1,2,0,3],
		[0,1,2,3],
		[3,0,1,2],
	],
	
	listeners:[],
};

PwGen.addListener = function(l) {
	this.listeners.push(l);
};

PwGen.setMasterKey = function(value) {
	value = wrapper.wrap16(sha1.digest(value), ')!@#$%^&*(ABCDEF');
	value = wrapper.wrap16(sha1.digest(value), ')!@#$%^&*(ABCDEF');
	this.setMasterHash(value);
};
PwGen.setMasterHash = function(value) {
	this.masterHash = value;
	this.updateDigest();
};
PwGen.setSiteKey = function(value) {
	this.siteKey = value.toLowerCase();
	this.updateDigest();
};
PwGen.setSize = function(value) {
	this.size = value;
	if(this.size < 4) this.size=4;
	if(this.size > 28) this.size=28;
	
	this.updatePassword();
};
PwGen.setCharsetFlag = function(value) {
	this.charsetFlag = value;
	
	this.chars = '';
	this.charsetPrioritys.forEach((item, index)=>{
		let length = this.charsets[item[0]].length;

		let i;
		for(i=0;i<item.length;++i) {
			if((value>>item[i]) & 1) break;
		}
		
		let cs = this.charsets[item[i%this.charsets.length]];
		
		//downward compatibility
		if(item[0]==3 && i!=0) {
			cs = cs[0]+cs[0];
		}
		
		while(cs.length < length) {
			cs += cs;
		}
		cs = cs.substr(0, length);
		
		this.charsetResults[index] = cs;
		this.chars += cs;
	});
	
	this.updatePassword();
};
PwGen.setIsForceAllSet = function(value) {
	this.isForceAllSet = value;
	
	this.updatePassword();
};

PwGen.updateDigest = function() {
	this.digest = sha1.digest(this.masterHash+this.siteKey);
	
	this.updatePassword();
};
PwGen.updatePassword = function() {
	let pw = wrapper.wrap64(this.digest, this.chars, this.size);
	if(this.isForceAllSet) {
		let str = '';
		this.charsetResults.forEach((item,i)=>{
			str += wrapper.wrap64(this.digest, item)[i];
		});
		pw = str + pw.substr(str.length);
	}
	this.listeners.forEach((item)=>{
		item(pw);
	});
};

