---
categories:
  - DFIR
  - Network Forensics
tags:
  - TryHackMe
  - wireshark
---

## Scenario

Eric Fischer from the Purchasing Department at Bartell Ltd has received an email from a known contact with a Word document attachment.  Upon opening the document, he accidentally clicked on "Enable Content."  The SOC Department immediately received an alert from the endpoint agent that Eric's workstation was making suspicious connections outbound. The pcap was retrieved from the network sensor and handed to you for analysis.

**Task**: Investigate the packet capture and uncover the malicious activities.

\*Credit goes to [Brad Duncan](https://www.malware-traffic-analysis.net/) for capturing the traffic and sharing the pcap packet capture with InfoSec community.

NOTE: DO NOT directly interact with any domains and IP addresses in this challenge.

## Q & A

### 1. What was the date and time for the first HTTP connection to the malicious IP? (**answer format**: yyyy-mm-dd hh:mm:ss)

We first add a column for the Coordinated Universal Time.
![](https://i.imgur.com/LbrH5IG.png)

We then filter for `http` and see the first displayed packet.
![](https://i.imgur.com/59yfoYc.png)

### 2. What is the name of the zip file that was downloaded?

For this we can see the files that can be exported by going `File => Export Objects => HTTP`. On that list we see the file name called `documents.zip`
![](https://i.imgur.com/DUkQNJi.png)

### 3. What was the domain hosting the malicious zip file?

I got this by doing a Packet list search for the string `documents.zip`. Do this by clicking `ctrl+f`, it opens a new bar.
![](https://i.imgur.com/tSLtFA4.png)
After that we can follow its HTTP stream and see the web request sent with the domain.
![](https://i.imgur.com/eYswafQ.png)

### 4. Without downloading the file, what is the name of the file in the zip file?

Looking at server response on the `http` stream we just followed we see a `chart-1530076591.xls` written along the bytes.
![](https://i.imgur.com/oWFEGCT.png)

### 5. What is the name of the webserver of the malicious IP from which the zip file was downloaded?

Looking at the server response headers, we see the name of the server
![](https://i.imgur.com/lfLDgGN.png)

### 6. What is the version of the webserver from the previous question?

We can see that in the `x-powered-by` header
![](https://i.imgur.com/l9NkeYA.png)

## TO BE CONTINUED

### 7. Malicious files were downloaded to the victim host from multiple domains. What were the three domains involved with this activity?

### 8. Which certificate authority issued the SSL certificate to the first domain from the previous question?

### 9. What are the two IP addresses of the Cobalt Strike servers? Use VirusTotal (the Community tab) to confirm if IPs are identified as Cobalt Strike C2 servers. (answer format: enter the IP addresses in sequential order)

### 10. What is the Host header for the first Cobalt Strike IP address from the previous question?

### 11. What is the domain name for the first IP address of the Cobalt Strike server? You may use VirusTotal to confirm if it's the Cobalt Strike server (check the Community tab).

### 12. What is the domain name of the second Cobalt Strike server IP?  You may use VirusTotal to confirm if it's the Cobalt Strike server (check the Community tab).

### 13. What is the domain name of the post-infection traffic?

### 14. What are the first eleven characters that the victim host sends out to the malicious domain involved in the post-infection traffic?

### 15. What was the length for the first packet sent out to the C2 server?

### 16. What was the Server header for the malicious domain from the previous question?

### 17. The malware used an API to check for the IP address of the victim’s machine. What was the date and time when the DNS query for the IP check domain occurred? (**answer format**: yyyy-mm-dd hh:mm:ss UTC)

### 18. What was the domain in the DNS query from the previous question?

### 19. Looks like there was some malicious spam (malspam) activity going on. What was the first MAIL FROM address observed in the traffic?

### 20. How many packets were observed for the SMTP traffic?

Filtering for `smtp` we can see below the number of displayed packets for that protocol.
s
