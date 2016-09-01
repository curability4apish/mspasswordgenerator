var CfgAdapter = {};

CfgAdapter.load = function(siteKey) {
	let result = this.v1.load(siteKey);
	if(result) return result;
	
	result = this.v0.load(siteKey);
	if(result) {
		this.v1.save(siteKey, result);
		this.v0.remove(siteKey);
		return result;
	}
	
	return {
		size:16,
		charsetFlag:0xf,
	};
};
CfgAdapter.save = function(siteKey, cfg) {
	this.v1.save(siteKey, cfg);
};


CfgAdapter.v0 = {};

CfgAdapter.v0.getStgKey = function(siteKey) {
	return 'pw.site.' + wrapper.wrap16(sha1.digest(siteKey));
};
CfgAdapter.v0.load = function(siteKey) {
	let result = localStorage.getItem(this.getStgKey(siteKey));
	if(!result) return null;
	
	result = JSON.parse(result);
	let flag = result.charsNumberChecked
		| (result.charsLowercaseChecked << 1)
		| (result.charsUppercaseChecked << 2)
		| (result.charsSymbolChecked << 3)
	;
	result = {
		size:result.size,
		charsetFlag:flag,
		isForceAllSet:0,
	};
	return result;
};
CfgAdapter.v0.remove = function(siteKey) {
	localStorage.removeItem(this.getStgKey(siteKey));
};


CfgAdapter.v1 = {};

CfgAdapter.v1.getStgKey = function(siteKey) {
	return 'siteCfg.' + wrapper.wrap64(sha1.digest(siteKey));
};
CfgAdapter.v1.load = function(siteKey) {
	return JSON.parse(localStorage.getItem(this.getStgKey(siteKey)));
};
CfgAdapter.v1.save = function(siteKey, cfg) {
	localStorage.setItem(this.getStgKey(siteKey), JSON.stringify(cfg));
};
CfgAdapter.v1.remove = function(siteKey) {
	localStorage.removeItem(this.getStgKey(siteKey));
};
