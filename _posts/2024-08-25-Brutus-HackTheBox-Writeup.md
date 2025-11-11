---
categories:
  - DFIR
tags:
  - HackTheBox
  - LogAnalysis
---
## Scenario
In this very easy Sherlock, you will familiarize yourself with Unix auth.log and wtmp logs. We'll explore a scenario where a Confluence server was brute-forced via its SSH service. After gaining access to the server, the attacker performed additional activities, which we can track using auth.log. Although auth.log is primarily used for brute-force analysis, we will delve into the full potential of this artifact in our investigation, including aspects of privilege escalation, persistence, and even some visibility into command execution.

## Questions
### Analyzing the auth.log, can you identify the IP address used by the attacker to carry out a brute force attack?

Looking at the `auth.log` file we can see multiple attempts of using the `admin` username on different port numbers. The attacker was attempting to brute force an `ssh` service. 

![](https://i.imgur.com/r4fNGZ2.png)

### The brute force attempts were successful, and the attacker gained access to an account on the server. What is the username of this account?

You can search for a specific keyword that would entail that the attacker has successfully logged in. Keywords such as '**Connected**', '**successful**', '**Accepted**', I chose the latter. 

![](https://i.imgur.com/ScF41Y9.png)

### Can you identify the timestamp when the attacker manually logged in to the server to carry out their objectives?

I first filtered the `auth.log` file to view only the accepted logins. The output shows four attempts. The first one is not a manual login by the attacker; it’s the login attempt made by the brute-force tool the attacker used. Only after that did the attacker manually log in.

![](https://i.imgur.com/yDLMNoq.png)

To obtain the exact timestamp, we need to extract it from the `wtmp` file. This file records login and logout attempts on the system and is located at `/var/log/wtmp`. Unlike the `auth.log` file, you can't read `wtmp` directly. Instead, we'll use the `utmpdump` command to parse it. This will provide us with the precise timestamp of the manual login.
 ![](https://i.imgur.com/Die6hCZ.png)

### SSH login sessions are tracked and assigned a session number upon login. What is the session number assigned to the attacker's session for the user account from Question 2?

Looking back at the `auth.log` we can see the session number assigned. 

![](https://i.imgur.com/8tUyW7q.png)

### The attacker added a new user as part of their persistence strategy on the server and gave this new user account higher privileges. What is the name of this account?

In the `auth.log`, right after the system assigned the user a session ID of 37, we see logs related to adding a user and setting up its group

![](https://i.imgur.com/YmEOfkT.png)

### What is the MITRE ATT&CK sub-technique ID used for persistence?

We know that the attacker created a new local account as a means of establishing persistence on the compromised host.

So going to the [ATT&CK Matrix](https://attack.mitre.org/matrices/enterprise/) under the Persistence technique `T1136` there is a sub-technique of using a local account with the ID of `T1136.001`

![](https://i.imgur.com/aNEmxIM.png)

![](https://i.imgur.com/xFGXmeM.png)

### How long did the attacker's first SSH session last based on the previously confirmed authentication time and session ending within the auth.log? (seconds)

We already obtained the timestamp in question 3. Now, we can calculate the difference between when the session was created and when the user logged out.

![](https://i.imgur.com/gfG4OgI.png)

### The attacker logged into their backdoor account and utilized their higher privileges to download a script. What is the full command executed using sudo?

The `auth.log` recorded the command because it was executed with `sudo` privileges, which required authentication. By examining the last part of the logs, we can see that the backdoor account `cyberjunkie` ran a command.

![](https://i.imgur.com/zW4VwM6.png)

The attacker downloaded a bash script named `linper.sh`, which was used to establish persistence on the Linux system.