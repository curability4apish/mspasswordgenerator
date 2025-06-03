## About
Forked from [Ayukawayen/MSPasswordGenerator](https://github.com/curability4apish/Traceless-Vault/blob/master/READMS-MSPasswordGenerator-en.md). mspasswordgenerator is a high-strength password generator that creates unique, high-strength passwords for each network service, reducing the damage that can be done when a single site's password is compromised. It doesn't require internet or `localStorage`, which make your password management genuinely traceless.

Download the root directory [here](https://github.com/download-directory/download-directory.github.io).

## Demo
![image](https://github.com/user-attachments/assets/d250879f-9e0f-4011-a6c3-45b06cc9650d)


## Warnings
This repository is still in beta. If the leak of your passwords can pose threat to your safety, privacy or property, you should enable two-factor authentication.

## Changelog
* Remove memorability of `Main Key`

This feature stores `Main Key` in plaintext in `localStorage` and poses security concern. The checkbox and accessibility to localStorage has been removed as a trade-off for security.

* Salting

Recommend users set their unique `salt` in `pwGen.js` to add an extra protection and prevent pre-calculated attack in case your `Main Key` is very weak. But that doesn't mean you can allow `Main Key` to be weak, because `salt` is stored in plaintext.

```
PwGen.updateDigest = function() {
	this.digest = sha256.digest(this.mainHash+this.siteKey+ "Your 64-bit salt");
	
	this.updatePassword();
};
```
Please see my another [repository](https://github.com/curability4apish/BogoTRNG) for salt generation.
* Encryption Algorithm

SHA-1 has been replaced with SHA-256.

## Plans
* The encryption algorithm needs rigorous inspection.
* Change sha256 to original sha1 if I have no idea on the evaluation of the algorithm.
