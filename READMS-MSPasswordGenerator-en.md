# MSPasswordGenerator

MS Password Generator is a high-strength password generator that can create unique high-strength passwords for each Internet service, reducing the damage caused by the leakage of a single website password.

## Online version
https://ayukawayen.github.io/MSPasswordGenerator/

## Algorithm
**Password** = substr(conv64(sha1(concat(sHex(sha1(sHex(sha1(**MasterKey**)))), toLower(**SiteKey**)))), 0, **PwLen* *);
You can use a SHA-1 hasher (such as [Tools4noobs](https://www.tools4noobs.com/online_php_functions/sha1)) and a Base64 encoder (such as [tomeko.net](https://tomeko.net/ online_tools/hex_to_base64.php)) to assist in generating passwords.

Take MasterKey = **password**, SiteKey = **Google**, PwLen = **16** as an example:

1. Take the SHA-1 hash of the MasterKey.

 sha1(**password**) = `0x5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8`

1. Convert the result to hexadecimal and encode it as `)!@#$%^&*(ABCDEF`. *(This is equivalent to pressing Shift on a standard keyboard to enter the hexadecimal code.)*

 sHex(`0x5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8`) = `%BAA^!E$C(B(#F#F)^*@@%)B^CF*##!B&EE^*FD*`

1. Take the SHA-1 hash of the result.

 sha1(`%BAA^!E$C(B(#F#F)^*@@%)B^CF*##!B&EE^*FD*`) = `0xae9a64452aec3535a5d6114406417a31bb37ae7b`

1. Convert the result to hexadecimal and encode it as `)!@#$%^&*(ABCDEF`.

 sHex(`0xae9a64452aec3535a5d6114406417a31bb37ae7b`) = `AE(A^$$%@AEC#%#%A%D^!!$$)^$!&A#!BB#&AE&B`

1. Add the lowercase SiteKey to the result.

 concat(`AE(A^$$%@AEC#%#%A%D^!!$$)^$!&A#!BB#&AE&B`, **google**) = `AE(A^$$ %@AEC#%#%A%D^!!$$)^$!&A#!BB#&AE&Bgoogle`

1. Take the SHA-1 hash of the result.

 sha1(`AE(A^$$%@AEC#%#%A%D^!!$$)^$!&A#!BB#&AE&Bgoogle`) = `0xca82058e6197229178510908de8e6e7aa132a3f5`

1. Convert the result to base 64 and encode it as [A-Z][a-z][0-9][._] . *(This is equivalent to filling 0x00 before the result, encoding it with Base64, and then removing the first letter A of the Base64 string.)*

 conv64(`0xca82058e6197229178510908de8e6e7aa132a3f5`) = `MqCBY5hlyKReFEJCN6ObnqhMqP1`

 *Note: base64(`0x00ca82058e6197229178510908de8e6e7aa132a3f5`) = `AMqCBY5hlyKReFEJCN6ObnqhMqP1`*

1. Take out the first PwLen letters of the result of the previous step to get the final password.

 substr(`MqCBY5hlyKReFEJCN6ObnqhMqP1`, 0, **16**) = `MqCBY5hlyKReFEJC`
