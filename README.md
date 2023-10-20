# MSPasswordGenerator
MS Password Generator是一個高強度密碼產生器，能為每個網路服務創建專屬的高強度密碼，降低單一網站密碼外洩時的傷害。

## Online version
https://ayukawayen.github.io/MSPasswordGenerator/

## Algorithm
**Password** = substr(conv64(sha1(concat(sHex(sha1(sHex(sha1(**MasterKey**)))), toLower(**SiteKey**)))), 0, **PwLen**);
可使用SHA-1雜湊器(如：[Tools4noobs](https://www.tools4noobs.com/online_php_functions/sha1))和Base64編碼器(如：[tomeko.net](https://tomeko.net/online_tools/hex_to_base64.php))來輔助產生密碼。

以MasterKey = **password**, SiteKey = **Google**, PwLen = **16**為例：

1. 對MasterKey取SHA-1雜湊。

   sha1(**password**) = `0x5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8`

1. 將其結果轉為16進位，以`)!@#$%^&*(ABCDEF`編碼。 *(相當於在標準鍵盤上按著Shift輸入16進位碼。)*

   sHex(`0x5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8`) = `%BAA^!E$C(B(#F#F)^*@@%)B^CF*##!B&EE^*FD*`

1. 對其結果取SHA-1雜湊。

   sha1(`%BAA^!E$C(B(#F#F)^*@@%)B^CF*##!B&EE^*FD*`) = `0xae9a64452aec3535a5d6114406417a31bb37ae7b`

1. 將其結果轉為16進位，以`)!@#$%^&*(ABCDEF`編碼。

   sHex(`0xae9a64452aec3535a5d6114406417a31bb37ae7b`) = `AE(A^$$%@AEC#%#%A%D^!!$$)^$!&A#!BB#&AE&B`

1. 在其結果後接上小寫的SiteKey。

   concat(`AE(A^$$%@AEC#%#%A%D^!!$$)^$!&A#!BB#&AE&B`, **google**) = `AE(A^$$%@AEC#%#%A%D^!!$$)^$!&A#!BB#&AE&Bgoogle`

1. 對其結果取SHA-1雜湊。

   sha1(`AE(A^$$%@AEC#%#%A%D^!!$$)^$!&A#!BB#&AE&Bgoogle`) = `0xca82058e6197229178510908de8e6e7aa132a3f5`

1. 將其結果轉為64進位，以`[A-Z][a-z][0-9][._]`編碼。 *(相當於在結果前填上0x00後以Base64編碼，再將Base64字串第一個字母A去掉。)*

   conv64(`0xca82058e6197229178510908de8e6e7aa132a3f5`) = `MqCBY5hlyKReFEJCN6ObnqhMqP1`

   *註：base64(`0x00ca82058e6197229178510908de8e6e7aa132a3f5`) = `AMqCBY5hlyKReFEJCN6ObnqhMqP1`*

1. 取出前一步的結果的最前PwLen個字母，得到最終密碼。

   substr(`MqCBY5hlyKReFEJCN6ObnqhMqP1`, 0, **16**) = `MqCBY5hlyKReFEJC`
