var sha1 = {};

sha1.digest = function(str) {
	let bs = this.padding(this.toBytes(str));
	let ws = this.toWords(bs);
	let digest = this.process(ws);
	
	return digest;
};

sha1.toBytes = function(str) {
	let result = [];
	for(let i=0;i<str.length;++i) {
		result.push(str.charCodeAt(i));
	}
	return result;
};
sha1.padding = function(bs) {
	let len = bs.length*8;
	let padLen = (Math.ceil((len+65)/512)*512 - 64 - len) / 8;
	
	bs.push(0x80);
	for(let i=1;i<padLen;++i) {
		bs.push(0);
	}
	
	for(let i=0;i<4;++i) {
		bs.push(0);
	}
	for(let i=0;i<4;++i) {
		bs.push((len>>8*(7-i)) & 0xff);
	}
	return bs;
};

sha1.toWords = function(bs) {
	let len = bs.length/4;
	let ws = [];
	for(let i=0;i<len;++i) {
		ws[i] = 0;
		for(let j=0;j<4;++j) {
			ws[i] |= (bs[i*4+j] << ((3-j)*8));
		}
	}
	return ws;
};
sha1.process = function(ws) {
	let h0 = 1732584193;
	let h1 = -271733879;
	let h2 = -1732584194;
	let h3 = 271733878;
	let h4 = -1009589776;
	let a=0;
	let b=0;
	let c=0;
	let d=0;
	let e=0;
	for(let wi=0;wi<ws.length;wi+=16) {
		let w = [];
		for(var i=0;i<16;++i) {
			w[i] = ws[wi+i];
		}
		for(var i=16;i<80;++i) {
			w[i] = this.rotl( w[i-3] ^ w[i-8] ^ w[i-14] ^ w[i-16], 1);
		}
		a = h0;
		b = h1;
		c = h2;
		d = h3;
		e = h4;
		
		let f=0;
		let k=0;
		for(let i=0;i<80;++i) {
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
			
			let temp = this.rotl(a,5)+f+e+k+w[i];
			
			e=d;
			d=c;
			c=this.rotl(b,30);
			b=a;
			a=temp;
		}
		
		h0+=a;
		h1+=b;
		h2+=c;
		h3+=d;
		h4+=e;
	}
	
	return [h0,h1,h2,h3,h4];
};

sha1.rotl = function(w, len) {
	return (w << len) | (w >>> (32-len));
};

var wrapper = {};

wrapper.wrap16 = function(ws, chars, length){
	chars = chars || '0123456789abcdef';
	while(chars.length < 16) {
		chars += chars;
	}
	
	let result = '';
	ws.forEach((w)=>{
		for(let i=0;i<8;++i) {
			let ci = (w>>((7-i)*4)) & 0xf;
			result += chars[ci];
		}
	});

	if(length) {
		result = result.substring(0,length);
	}
	return result;
};

wrapper.wrap64 = function(ws, chars, length){
	chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._';
	while(chars.length < 64) {
		chars += chars;
	}
	
	let result = '';
	
	let bs = [];
	ws.forEach((w)=>{
		bs.push((w>>16)&0xffff);
		bs.push(w&0xffff);
	});
	bs.reverse();
	
	let buffer = 0;
	let bufferLen = 0;
	
	bs.forEach((b,i,a)=>{
		buffer |= (b << bufferLen);
		bufferLen += 16;
		while(bufferLen >= ((i>=a.length-1)?1:6) ) {
			result = chars[buffer&0x3f] + result;
			buffer >>= 6;
			bufferLen -= 6;
		}
	});

	if(length) {
		result = result.substring(0,length);
	}
	return result;
};
