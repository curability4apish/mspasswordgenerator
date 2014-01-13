function sha1(str) {
	var bs = toByteCodes(str);
	bs = appendPadding(bs);
	var ws = toWords(bs);
	var digest = process(ws);
	return digest;
}

function toByteCodes(str) {
	var len = str.length;
	var bs = Array(len);
	for(var i=0;i<len;++i) {
		bs[i] = str.charCodeAt(i);
	}
	return bs;
}

function appendPadding(bs) {
	var len = bs.length*8;
	var padLen = (Math.ceil((len+65)/512)*512 - len) / 8;
	var pad = Array(padLen);
	pad[0] = 0x80;
	for(var i=1;i<padLen-8;++i) {
		pad[i] = 0;
	}
	for(var i=padLen-1;i>=padLen-8;--i) {
		pad[i] = len & 0xff;
		len = len >> 8;
	}
	bs = bs.concat(pad);
	return bs;
}

function toWords(bs) {
	var len = bs.length/4;
	var ws = Array(len);
	for(var i=0;i<len;++i) {
		ws[i] = (bs[i*4+0] << 24) | (bs[i*4+1] << 16) | (bs[i*4+2] << 8) | (bs[i*4+3] << 0);
	}
	return ws;
}

function process(ws) {
	var h0 = 1732584193;
	var h1 = -271733879;
	var h2 = -1732584194;
	var h3 = 271733878;
	var h4 = -1009589776;
	var a=0;
	var b=0;
	var c=0;
	var d=0;
	var e=0;
	for(var ci=0;ci<ws.length;ci+=16) {
		var w = Array(80);
		for(var i=0;i<16;++i) {
			w[i] = ws[ci+i];
		}
		for(var i=16;i<80;++i) {
			w[i] = rotl( w[i-3] ^ w[i-8] ^ w[i-14] ^ w[i-16], 1);
		}
		a = h0;
		b = h1;
		c = h2;
		d = h3;
		e = h4;
		
		var f=0;
		var k=0;
		for(var i=0;i<80;++i) {
			if(i<20) {
				f = (b&c)|((~b)&d);
				k = 1518500249;
			}
			else if(i<40) {
				f = b^c^d;
				k = 1859775393;
			}
			else if(i<60) {
				f = (b&c)|(b&d)|(c&d);
				k = -1894007588;
			}
			else if(i<80) {
				f = b^c^d;
				k = -899497514;
			}
			
			var temp = rotl(a,5)+f+e+k+w[i];
			
			e=d;
			d=c;
			c=rotl(b,30);
			b=a;
			a=temp;
		}
		
		h0+=a;
		h1+=b;
		h2+=c;
		h3+=d;
		h4+=e;
	}
	
	return Array(h0,h1,h2,h3,h4);
}

function rotl(w, len) {
	return (w << len) | (w >>> (32-len));
}

function wrap(digest, chars, len) {
	var result = "";
	var charSize = chars.length;
	if(charSize < 2) {
		return wrap(digest, "0123456789abcdef", len);
	}
	
	var dws = Array(digest.length*2);
	for(var i=0;i<digest.length;++i) {
		dws[i*2] = (digest[i]>>16) & 0xffff;
		dws[i*2+1] = digest[i] & 0xffff;
	}
	result = wrapDws(dws, chars, "");

	if(len > 0) {
		result = result.substring(0,len);
	}
	return result;
}

function wrapDws(dws, chars, result) {
	var len = dws.length;
	if(len <= 0) {
		return result;
	}
	
	var charSize = chars.length;
	var buf = Array(len);
	var mod = 0;
	for(var i=0;i<len;++i) {
		w = (mod << 16) | dws[i];
		buf[i] = Math.floor(w/charSize);
		mod = w%charSize;
	}
	if(buf[0] <= 0) {
		buf.shift();
	}
	
	result = chars.charAt(mod) + result;
	return wrapDws(buf, chars, result);
}