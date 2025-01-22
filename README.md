## About
Forked from Ayukawayen/MSPasswordGenerator.

## Changelog
* Remove memorability of `Main Key`

This feature stores 'Main Key` in plaintext in `localStorage` poses security concern. So, the checkbox and access to localStorage has been removed. It's a trade-off for security.

* Salting

Recommend users to configure their salt in `pwGen.js` to enhanec complexity and prevent pre-calculated attack in case your `Main Key` is very weak.

```
PwGen.updateDigest = function() {
	this.digest = sha256.digest(this.mainHash+this.siteKey+ "Your 64-bit salt");
	
	this.updatePassword();
};
```

## Plans
* The encryption algorithm needs rigorous inspection.
