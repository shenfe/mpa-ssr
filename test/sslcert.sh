#!/bin/bash

＃ 参考：http://www.jianshu.com/p/853099ae2edd

＃ 1. 生成私钥key文件
openssl genrsa 1024 > sslcert/private.pem

＃ 2. 通过私钥文件生成CSR证书签名
openssl req -new -key sslcert/private.pem -out sslcert/csr.pem

＃ 3. 通过私钥文件和CSR证书签名生成证书文件
openssl x509 -req -days 365 -in sslcert/csr.pem -signkey sslcert/private.pem -out sslcert/file.crt
