---
categories:
  - DFIR
  - Memory Forensics
tags:
  - Volatility
  - CTI
  - Stealer
---
## Scenario

As a cybersecurity analyst for a leading financial institution, an alert from your SIEM solution has flagged unusual activity on an internal workstation. Given the sensitive financial data at risk, immediate action is required to prevent potential breaches.

Your task is to delve into the provided memory dump from the compromised system. You need to identify basic Indicators of Compromise (IOCs) and determine the extent of the intrusion. Investigate the malicious commands or files executed in the environment, and report your findings in detail to aid in remediation and enhance future defenses.

## Questions

### 1. Identifying the name of the malicious process helps in understanding the nature of the attack. What is the name of the malicious process?

Running the `windows.pstree` option on Volatility 3, I noticed that powershell ran 2 child processes

![Reveal1.png](https://i.imgur.com/xOMVLJN.png)

Although both processes are legitimate Windows utilities, there seemed to be an oddity with Powershell initiating a networking utility. Perhaps it was utilized for communication with a C2 server or another external IP address. The next step would be to view the commands that were issued, as this was a `powershell.exe`. Upon executing the `windows.cmdline` option to view the commands, I observed something on the `powershell.exe` file.

![Pasted image 20240812142809.png](https://i.imgur.com/om7LoNR.png)

Now that's a red flag. Upon [researching](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/gg651155(v=ws.11)) on what that command does I found out that `net use` is a networking utility and it can used to connect to a remote computer and download resources. In this instance, it was attempting to establish a connection to a device on port `8888` that had the IP address `45.9.74.32` in order to get resources from the `davwwwroot` directory.

I looked up the reputation of the ip address in virus total and it yielded worrying results.

![Pasted image 20240812143410.png](https://i.imgur.com/dGfcooK.png)

So now I'm sure that this is the malicious process.

### 2. Knowing the parent process ID (PID) of the malicious process aids in tracing the process hierarchy and understanding the attack flow. What is the parent PID of the malicious process?

In the previous scan result we can see the parent process ID of the `powershell.exe`

![Pasted image 20240812143605.png](https://i.imgur.com/u8ydRHs.png)

### 3. Determining the file name used by the malware for executing the second-stage payload is crucial for identifying subsequent malicious activities. What is the file name that the malware uses to execute the second-stage payload?

Taking a look at the `cmdline` results we obtained, in particular, the powershell command, `rundll32.exe`, which essentially executes a dll file, was the next command to run after the shared resources were downloaded.

![Pasted image 20240812144031.png](https://i.imgur.com/VLt8Ch3.png)

### 4. Identifying the shared directory on the remote server helps trace the resources targeted by the attacker. What is the name of the shared directory being accessed on the remote server?

I mentioned on question 1 that it downloaded a file on a shared directory using `net use`.

![Pasted image 20240812144256.png](https://i.imgur.com/SEyuIf3.png)

### 5. What is the MITRE sub-technique ID used by the malware to execute the second-stage payload?

On the sandbox analysis for that malware, on the MITRE ATT&CK matrix we see the `rundll32` on the Defense evasion and has a sub-technique ID of:

![Pasted image 20240812144803.png](https://i.imgur.com/NZCYgan.png)

### 6. Identifying the username under which the malicious process runs helps in assessing the compromised account and its potential impact. What is the username that the malicious process runs under?

The `windows.registry.userassist` option allows us to locate this. **UserAssist** keys are a registry feature in Windows that tracks programs. These also include the number of times each program has been performed, the date it was last ran, and the user's name.

![Pasted image 20240812151710.png](https://i.imgur.com/qmmWKBj.png)

### 7. Knowing the name of the malware family is essential for correlating the attack with known threats and developing appropriate defenses. What is the name of the malware family?

By searching for the `ioc:45.9.74.32` in the Threat Fox database and selecting the one that contains the number `8888`, the malware family's information are displayed.

![Pasted image 20240812151956.png](https://i.imgur.com/54qudqz.png)