## About
Forked from [Ayukawayen/MSPasswordGenerator](https://github.com/curability4apish/Traceless-Vault/blob/master/README-MSPasswordGenerator.md). Traceless-Vault is a high-strength password generator that creates unique, high-strength passwords for each network service, reducing the damage that can be done when a single site's password is compromised. It doesn't require internet or `localStorage`, which make them genuinely traceless.

## Changelog
* Remove memorability of `Main Key`

This feature stores `Main Key` in plaintext in `localStorage` poses security concern. So, the checkbox and access to localStorage has been removed. It's a trade-off for security.

* Salting

Recommend users to configure their unique salt in `pwGen.js` to enhanec complexity and prevent pre-calculated attack in case your `Main Key` is very weak. But that doesn't mean you can have easily guessable `Main Key`.

```
PwGen.updateDigest = function() {
	this.digest = sha256.digest(this.mainHash+this.siteKey+ "Your 64-bit salt");
	
	this.updatePassword();
};
```
* Encryption Algorithm

SHA-1 has been replaced with SHA-256.

## Plans
* The encryption algorithm needs rigorous inspection.
