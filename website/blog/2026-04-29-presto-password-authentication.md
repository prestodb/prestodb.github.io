---
author: Pratyaksh Sharma
authorURL: https://www.linkedin.com/in/pratyaksh-sharma-60593769/
title: Password Authentication setup on Local
---

Authentication and authorization are two main pillars for data security. While a Presto cluster can be set up to run 
without authentication for development purposes, production clusters must be secured at all times. Setting up secure clusters 
comes with its own challenges in terms of the involved setup and configuration changes. In this blog, we try to set up a secure Presto
cluster on a local machine using password file based authentication and resolve the errors incrementally that come along the way. 

## Target audience

1. Anyone who is interested in setting up secure Presto clusters from scratch, particularly those not familiar with SSL connections.  

## Expectations

1. Configure a Presto cluster to authenticate users with password file based authentication on a local machine.
2. Verify that once the Presto cluster is secured, no user is able to connect to the server without authenticating themselves. 

## Background

Troubleshooting SSL handshake related errors can be overwhelming: most of the errors are not obvious, and Google searches can frequently give unsatisfactory answers.
Before dealing with these errors, it is recommended to have good knowledge of 
1. What happens in a typical SSL handshake?
2. How are TLS connections different from mTLS connections?
3. What is a keystore and a truststore?
4. What is the role of keystore and truststore in SSL connections?
5. Basic Java tools like `keytool` for managing keystores, truststores and certificates.

This article will introduce these topics before we begin setting up the Presto server.

## SSL Handshakes

Let us start with some theory that I feel is important to understand before going to hands on. 
SSL handshakes are a mechanism by which client and server establish the trust and logistics required to secure their connection 
over the network. SSL handshake involves many steps, but we go over only the ones relevant for this blog: 

 - Client provides a list of possible SSL versions and cipher suites to use.
 - Server agrees on a particular SSL version and cipher suite, responding with its certificate from its keystore.
 - Client verifies the authenticity of this certificate by checking it against a list of trusted Certificate Authorities (CAs) using its truststore.
 
### Keystore and Truststore

Keystore and Truststore are used to manage the keys and certificates required for secure communication. 
* The Keystore stores your private keys and the corresponding public certificates. During a SSL handshake, the Presto server
uses its keystore to present its identity to the client such as Presto CLI. 
* A truststore stores only public certificates, typically from trusted Certificate Authorities. Clients such as Presto CLI
will make use of its truststore to verify the certificate presented by the Presto coordinator. If the server's certificate or
the corresponding CA is not in the client's truststore, the connection fails with `SSLHandshakeException`.

It is important to note that Java provides default truststore (`cacerts`) but there is no default keystore. So during a handshake, 
the connection can succeed when the server presents a certificate which is issued by well known CAs because the certificates issued by these CAs are 
already present in the default truststore. When testing, the certificate could be a self-signed one, and 
a custom truststore will be needed which contains the presented certificate.

### TLS and mTLS

mTLS stands for mutual TLS (Transport Layer Security). The key difference between TLS and mTLS is that TLS uses a one way handshake where only the
server presents its certificate to the client and the client verifies that certificate using its truststore. However, mTLS
adds a mandatory second step where the client also presents its certificate to the server, allowing the server to authenticate 
the client, ensuring a strict two-way, zero trust security. 
In a TLS handshake, the client only needs a truststore to verify the server's identity, while in a mTLS handshake, both server and client 
need a keystore and truststore to present the certificate and verify the other's identity. 

#### Can keystore and truststore be the same?

Because both a keystore and truststore are needed in an mTLS handshake for both the involved parties, this raises the obvious question - 
**Do keystore and truststore need to be different? Can they use the same file?** 

Technically, a keystore and truststore can use the same physical file as they both use the same underlying formats
and management tools like the `Java Keytool`. However, it is recommended to keep them separate due to the following reasons:

 - **Security Risk**: Truststore often have lower security requirements since they only contain public data. If you combine them,
anyone with access to truststore can access your highly sensitive private keys as well.
 - **Maintenance**: Keeping keystore and truststore separate makes it easier to manage the certificates especially when certificates are rotated
at regular intervals.
 - **Default Values**: Java provides a default truststore, but there is no default keystore. 

### Keytool

The Keytool command is a key and certificate management utility provided by Java as part of its releases. Please refer to the 
[official documentation](https://docs.oracle.com/javase/8/docs/technotes/tools/unix/keytool.html) and [Introduction to Keytool](https://www.baeldung.com/keytool-intro)
for more information.

## Set up Presto on a local machine

Use Intellij IDEA for setting up Presto on local. See [Building Presto](https://github.com/prestodb/presto?tab=readme-ov-file#building-presto)
for instructions. 

## Set up password file based authentication

Having almost no idea about how SSL connection works internally, I performed these steps:

1. Created a `password.db` file for configuring `test` user using the commands: 

```java
pratyakshsharma@Pratyakshs-MacBook-Pro Documents % vi password.db 
pratyakshsharma@Pratyakshs-MacBook-Pro Documents % htpasswd -B -C 10 password.db test
New password:
Re-type new password:
Adding password for user test
```

I was not sure if a keystore path was needed for the Presto coordinator, so I added only these configurations to `config.properties`: 

```java
http-server.https.enabled=true
http-server.https.port=8443
http-server.authentication.type=PASSWORD
```

I created a new `password-authenticator.properties` file: 

```java
password-authenticator.name=file
file.password-file=/Users/pratyakshsharma/Documents/password.db
```

When I tried to start the Presto server, this error appeared: 

```java
1) [Guice/ErrorInCustomProvider]: NullPointerException
  while locating HttpServerProvider
  at HttpServerModule.configure(HttpServerModule.java:54)
  while locating HttpServer

Learn more:
  https://github.com/google/guice/wiki/ERROR_IN_CUSTOM_PROVIDER
Caused by: NullPointerException
	at java.base/Objects.requireNonNull(Objects.java:208)
	at java.base/UnixFileSystem.getPath(UnixFileSystem.java:263)
	at java.base/Path.of(Path.java:147)
	at HttpServer.tryLoadPemKeyStore(HttpServer.java:526)
	at HttpServer.<init>(HttpServer.java:238)
	at HttpServerProvider.get(HttpServerProvider.java:145)
	at HttpServerProvider.get(HttpServerProvider.java:43)
	at ProviderInternalFactory.provision(ProviderInternalFactory.java:86)
	at BoundProviderFactory.provision(BoundProviderFactory.java:72)
	at ProviderInternalFactory$1.call(ProviderInternalFactory.java:67)
	at ProvisionListenerStackCallback$Provision.provision(ProvisionListenerStackCallback.java:109)
	at LifeCycleModule.provision(LifeCycleModule.java:53)
	at ProvisionListenerStackCallback$Provision.provision(ProvisionListenerStackCallback.java:117)
	at ProvisionListenerStackCallback.provision(ProvisionListenerStackCallback.java:66)
	at ProviderInternalFactory.circularGet(ProviderInternalFactory.java:62)
	at BoundProviderFactory.get(BoundProviderFactory.java:59)
	at ProviderToInternalFactoryAdapter.get(ProviderToInternalFactoryAdapter.java:40)
	at SingletonScope$1.get(SingletonScope.java:169)
	at InternalFactoryToProviderAdapter.get(InternalFactoryToProviderAdapter.java:45)
	at InternalInjectorCreator.loadEagerSingletons(InternalInjectorCreator.java:213)
	at InternalInjectorCreator.injectDynamically(InternalInjectorCreator.java:186)
	at InternalInjectorCreator.build(InternalInjectorCreator.java:113)
	at Guice.createInjector(Guice.java:87)
	at Bootstrap.initialize(Bootstrap.java:263)
	at PrestoServer.run(PrestoServer.java:169)
	at PrestoServer.main(PrestoServer.java:103)
```

On checking the line of code which was throwing the `NullPointerException`, I figured out a keystore was needed for the http-server. So I created a keystore on the local system with the following commands: 

```java
pratyakshsharma@Pratyakshs-MacBook-Pro presto-https % keytool -genkeypair -alias presto -keyalg RSA -keystore keystore.jks
Enter keystore password:  
Re-enter new password: 
What is your first and last name?
  [Unknown]:  pratyaksh sharma
What is the name of your organizational unit?
  [Unknown]:  
What is the name of your organization?
  [Unknown]:  
What is the name of your City or Locality?
  [Unknown]:  
What is the name of your State or Province?
  [Unknown]:  
What is the two-letter country code for this unit?
  [Unknown]:  
Is CN=pratyaksh sharma, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown correct?
  [no]:  yes

Enter key password for <presto>
	(RETURN if same as keystore password):  

Warning:
The JKS keystore uses a proprietary format. It is recommended to migrate to PKCS12 which is an industry standard format using "keytool -importkeystore -srckeystore keystore.jks -destkeystore keystore.jks -deststoretype pkcs12".
```

Then I added two new properties in `config.properties`: 

```java
http-server.https.keystore.path=/Users/pratyakshsharma/Documents/presto-https/keystore.jks
http-server.https.keystore.key=password
```

Then I tried again to start the Presto server, and the following error was displayed: 

```java
2026-04-14T14:33:18.767+0545	INFO	main	com.facebook.presto.server.security.PasswordAuthenticatorManager	-- Loading password authenticator --
2026-04-14T14:33:18.767+0545	ERROR	main	com.facebook.presto.server.PrestoServer	Password authenticator file is not registered
java.lang.IllegalStateException: Password authenticator file is not registered
	at com.google.common.base.Preconditions.checkState(Preconditions.java:601)
	at com.facebook.presto.server.security.PasswordAuthenticatorManager.loadPasswordAuthenticator(PasswordAuthenticatorManager.java:73)
	at com.facebook.presto.server.PrestoServer.run(PrestoServer.java:209)
	at com.facebook.presto.server.PrestoServer.main(PrestoServer.java:103)
```

This is because `PasswordAuthenticatorPlugin` is not registered with the server. To fix this, I added this line to `plugin.bundles` in `config.properties`: 

```java
../presto-password-authenticators/pom.xml
```

When I tried again, the server started successfully.

```java
2026-04-16T12:14:39.909+0545	INFO	main	com.facebook.presto.server.PrestoServer	======== SERVER STARTED ========
```

Next I tried to run Presto CLI and the following error appeared: 

```java
pratyakshsharma@Pratyakshs-MacBook-Pro presto % presto-cli/target/presto-cli-0.297-SNAPSHOT-executable.jar --user test --password
Password:
        Exception in thread "main" java.lang.IllegalArgumentException: Authentication using username/password requires HTTPS to be enabled
        at com.google.common.base.Preconditions.checkArgument(Preconditions.java:143)
        at com.facebook.presto.cli.QueryRunner.setupBasicAuth(QueryRunner.java:166)
        at com.facebook.presto.cli.QueryRunner.<init>(QueryRunner.java:95)
        at com.facebook.presto.cli.Console.run(Console.java:143)
        at com.facebook.presto.cli.Presto.main(Presto.java:31)

```

To enable HTTPS as the error suggested, I had to include the `--server` flag with an HTTPS endpoint because it uses `http://localhost:8080` by default.

I ran the new command - 

```java
pratyakshsharma@Pratyakshs-MacBook-Pro presto % presto-cli/target/presto-cli-0.297-SNAPSHOT-executable.jar --user test --server https://localhost:8443 --password
Password: 
presto> 
```

And that was successful! 

I was able to access the interactive shell, but when I tried to run a simple query such as ``show catalogs``, I hit another error:

```java
presto> show catalogs;
Error running command: javax.net.ssl.SSLHandshakeException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
```

For authentication related errors, you will not see any stacktrace on the Presto console because the query does not reach the Presto coordinator.

On exploring a bit, I figured out that the Common Name that I had used in my certificate in keystore was not correct and it needs to be the unqualified hostname of the
Presto coordinator. So I created a fresh keystore as below:

```java
pratyakshsharma@Pratyakshs-MacBook-Pro presto-https % hostname
Pratyakshs-MacBook-Pro.local
```

```java
pratyakshsharma@Pratyakshs-MacBook-Pro presto-https % keytool -genkeypair -alias presto -keyalg RSA -keystore keystore1.jks 
Enter keystore password:  
Re-enter new password: 
What is your first and last name?
  [Unknown]:  Pratyakshs-MacBook-Pro.local
What is the name of your organizational unit?
  [Unknown]:  
What is the name of your organization?
  [Unknown]:  
What is the name of your City or Locality?
  [Unknown]:  
What is the name of your State or Province?
  [Unknown]:  
What is the two-letter country code for this unit?
  [Unknown]:  
Is CN=Pratyakshs-MacBook-Pro.local, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown correct?
  [no]:  yes

Enter key password for <presto>
	(RETURN if same as keystore password):  

Warning:
The JKS keystore uses a proprietary format. It is recommended to migrate to PKCS12 which is an industry standard format using "keytool -importkeystore -srckeystore keystore1.jks -destkeystore keystore1.jks -deststoretype pkcs12".
```

I updated the value of the property in `config.properties`:

```java
http-server.https.keystore.path=/Users/pratyakshsharma/Documents/presto-https/keystore1.jks
```

and restarted the server.

On trying the query on Presto CLI again, the same error appeared as before:

```java
presto> show catalogs;
Error running command: javax.net.ssl.SSLHandshakeException: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target
```

This error was super confusing and gave no direct idea of what might have gone wrong. At this point I almost gave up, and I created an issue on [Presto GitHub](https://github.com/prestodb/presto/issues/27485).

While waiting for suggestions on the raised ticket, I started reading further about the [Java Truststore File for TLS](https://prestodb.io/docs/current/security/tls.html#java-truststore-file-for-tls) in the Presto documentation, and I found out that _For the Presto CLI to trust the Presto coordinator, the coordinator’s certificate must be imported to the CLI’s truststore._

I followed the documentation in [Importing self-signed certificates from a Presto (Java) server to a Java Truststore](https://www.ibm.com/docs/en/software-hub/5.1.x?topic=administering-importing-self-signed-certificates-truststore) to import the server's certificate to the CLI's truststore. 

While the Presto server was running, I ran these commands: 

```java
pratyakshsharma@Pratyakshs-MacBook-Pro presto-https % echo QUIT | openssl s_client -showcerts -connect localhost:8443 | awk '/-----BEGIN CERTIFICATE-----/ {p=1}; p; /-----END CERTIFICATE-----/ {p=0}' > presto.cert
Connecting to ::1
Can't use SSL_get_servername
depth=0 C=Unknown, ST=Unknown, L=Unknown, O=Unknown, OU=Unknown, CN=Pratyakshs-MacBook-Pro.local
verify error:num=18:self-signed certificate
verify return:1
depth=0 C=Unknown, ST=Unknown, L=Unknown, O=Unknown, OU=Unknown, CN=Pratyakshs-MacBook-Pro.local
verify return:1
DONE
```

```java
pratyakshsharma@Pratyakshs-MacBook-Pro presto-https % keytool -import -alias presto-cert -file ./presto.cert -keystore ./presto-truststore.jks
Enter keystore password:  
Re-enter new password: 
Owner: CN=Pratyakshs-MacBook-Pro.local, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown
Issuer: CN=Pratyakshs-MacBook-Pro.local, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown
Serial number: cfbc633
Valid from: Wed Apr 01 21:19:34 IST 2026 until: Tue Jun 30 21:19:34 IST 2026
Certificate fingerprints:
	 SHA1: D8:C6:0D:DB:15:FC:EA:0E:C4:03:B3:B7:5F:3A:AB:42:A5:2A:A5:D3
	 SHA256: DA:AD:9F:03:6A:A1:6E:8B:FC:0C:EC:C1:C8:5E:23:07:8D:06:38:D7:48:75:F3:7F:92:D9:86:46:72:33:5D:AA
Signature algorithm name: SHA256withRSA
Subject Public Key Algorithm: 2048-bit RSA key
Version: 3

Extensions: 

#1: ObjectId: 2.5.29.14 Criticality=false
SubjectKeyIdentifier [
KeyIdentifier [
0000: 1B 94 02 F7 C4 0B 85 AC   55 DE 9E 5C E2 00 43 0A  ........U..\..C.
0010: 3B ED A6 29                                        ;..)
]
]

Trust this certificate? [no]:  yes
Certificate was added to keystore
```

Next I started the Presto CLI and included the truststore related flags: 

```java
pratyakshsharma@Pratyakshs-MacBook-Pro presto % presto-cli/target/presto-cli-0.297-SNAPSHOT-executable.jar --server https://localhost:8443 --truststore-path /Users/pratyakshsharma/Documents/presto-https/presto-truststore.jks --truststore-password password --user test --password
Password:
presto>
```

However, on running `show catalogs`, I hit another error:

```java
presto> show catalogs;
Error running command: javax.net.ssl.SSLPeerUnverifiedException: Hostname localhost not verified:
    certificate: sha256/7HpqT7WDjK7UF+pwa/snkEhUEXWp8WmmJwPp7nWnhyc=
    DN: CN=Pratyakshs-MacBook-Pro.local, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown
    subjectAltNames: []
presto> 
presto>
```

This error was more obvious than the previously encountered ones: the certificate included in the truststore had to have `localhost` as the CN.

I repeated the steps already performed earlier, but using `localhost` as the CN this time.

1. Generate self-signed certificate for Presto coordinator
```java
pratyakshsharma@Pratyakshs-MacBook-Pro presto-https % keytool -genkeypair -alias presto -keyalg RSA -keystore keystore_localhost.jks
Enter keystore password:  
Re-enter new password: 
What is your first and last name?
  [Unknown]:  localhost
What is the name of your organizational unit?
  [Unknown]:  
What is the name of your organization?
  [Unknown]:  
What is the name of your City or Locality?
  [Unknown]:  
What is the name of your State or Province?
  [Unknown]:  
What is the two-letter country code for this unit?
  [Unknown]:  
Is CN=localhost, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown correct?
  [no]:  yes

Enter key password for <presto>
	(RETURN if same as keystore password):  

Warning:
The JKS keystore uses a proprietary format. It is recommended to migrate to PKCS12 which is an industry standard format using "keytool -importkeystore -srckeystore keystore_localhost.jks -destkeystore keystore_localhost.jks -deststoretype pkcs12".
```

2. Update the property in `config.properties`: 

```java
http-server.https.keystore.path=/Users/pratyakshsharma/Documents/presto-https/keystore_localhost.jks
```

and restarted the server.

3. Import the keystore certificate to the CLI's truststore using the following commands:

```java
pratyakshsharma@Pratyakshs-MacBook-Pro presto-https % echo QUIT | openssl s_client -showcerts -connect localhost:8443 | awk '/-----BEGIN CERTIFICATE-----/ {p=1}; p; /-----END CERTIFICATE-----/ {p=0}' > presto1.cert
Connecting to ::1
Can't use SSL_get_servername
depth=0 C=Unknown, ST=Unknown, L=Unknown, O=Unknown, OU=Unknown, CN=localhost
verify error:num=18:self-signed certificate
verify return:1
depth=0 C=Unknown, ST=Unknown, L=Unknown, O=Unknown, OU=Unknown, CN=localhost
verify return:1
DONE
```

```java
pratyakshsharma@Pratyakshs-MacBook-Pro presto-https % keytool -import -alias presto-cert -file ./presto1.cert -keystore ./presto1-truststore.jks
Enter keystore password:  
Re-enter new password: 
Owner: CN=localhost, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown
Issuer: CN=localhost, OU=Unknown, O=Unknown, L=Unknown, ST=Unknown, C=Unknown
Serial number: 3aff7a41
Valid from: Wed Apr 01 23:37:53 IST 2026 until: Tue Jun 30 23:37:53 IST 2026
Certificate fingerprints:
	 SHA1: 77:C6:D5:EE:49:44:BE:2F:D8:B8:5C:A4:7A:5B:91:54:7A:08:73:97
	 SHA256: 9D:89:93:EB:E9:C7:6E:98:37:27:F0:1B:54:41:38:C1:AB:66:63:59:61:D2:3B:26:E4:49:92:13:75:53:8C:4F
Signature algorithm name: SHA256withRSA
Subject Public Key Algorithm: 2048-bit RSA key
Version: 3

Extensions: 

#1: ObjectId: 2.5.29.14 Criticality=false
SubjectKeyIdentifier [
KeyIdentifier [
0000: 93 07 D0 04 B7 02 73 B9   E0 9B F7 8F 06 0A C4 85  ......s.........
0010: A7 43 20 A2                                        .C .
]
]

Trust this certificate? [no]:  yes
Certificate was added to keystore
```

4. Restart the Presto CLI and run `show catalogs` query, everything worked like a charm:

```java
pratyakshsharma@Pratyakshs-MacBook-Pro presto % presto-cli/target/presto-cli-0.297-SNAPSHOT-executable.jar --server https://localhost:8443 --truststore-path /Users/pratyakshsharma/Documents/presto-https/presto1-truststore.jks --truststore-password password --user test --password
Password: 
presto> show catalogs;
   Catalog   
-------------
 blackhole   
 delta       
 druid       
 example     
 hana        
 hive        
 hudi        
 iceberg     
 jmx         
 localfile   
 memory      
 mysql       
 pinot       
 postgresql  
 prometheus  
 singlestore 
 sqlserver   

Query 20260401_181326_00000_3qt9p, FINISHED, 1 node
Splits: 19 total, 19 done (100.00%)
[Latency: client-side: 0:03, server-side: 0:02] [0 rows, 0B] [0 rows/s, 0B/s]

presto> exit;
```

To verify that any user cannot access my cluster without authentication, I tried the Presto CLI command without providing `--user` and `--password` flags. As expected, it did not allow me to run any query. 

```java
pratyakshsharma@Pratyakshs-MacBook-Pro presto % presto-cli/target/presto-cli-0.297-SNAPSHOT-executable.jar --server https://localhost:8443 --truststore-path /Users/pratyakshsharma/Documents/presto-https/presto1-truststore.jks --truststore-password password                      
presto> show catalogs;
Error running command: Authentication failed: Unauthorized
presto> exit
```

Upon reading further, I found this super useful link about [SSL Handshake Failures](https://www.baeldung.com/java-ssl-handshake-failures) that talks about the different errors which are encountered when setting up SSL connections. I encourage everyone to give it a read. 