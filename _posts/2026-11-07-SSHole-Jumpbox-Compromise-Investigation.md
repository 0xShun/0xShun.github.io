---
title: "SSHole (CVE-2026-123158): Jumpbox Compromise"
categories:
  - Linux Forensics
tags:
  - CVE-2026-123158
  - SSHole
  - Linux-Forensics
  - DFIR
image: /assets/img/sshole.jpeg
summary: "An investigation into the compromise of dev-jumpbox, an Alpine Linux 3.24.3 host, through SSHole (CVE-2026-123158), an OpenSSH password authentication bypass affecting musl-based systems without PAM. This writeup follows the attack from the exposed service account to the activity that followed: a port sweep of the local subnet, a remotely fetched script, and the exfiltration and shredding of forensic evidence"
---
# Summary 

Suspicious outbound traffic was reported from a misconfigured jumpbox. Triage of the evidence shows that an attacker logged in to the service account `adminsvc` without a valid password by abusing SSHole (CVE-2026-123158), an OpenSSH authentication bypass disclosed the day before. From that session the attacker scanned a second subnet, ran a script pulled from GitHub, sent a hidden file in `/tmp` to an external domain, and shredded it.

# The Vulnerability

A jumpbox (bastion host) is a hardened entry point used to reach internal systems, so a flaw in its SSH service exposes everything behind it.

SSHole is a logic flaw in sshd's password handling. It was fixed in OpenSSH 10.6p2, released on November 5, 2026. The chain works as follows:

1. Since a 2016 timing fix (CVE-2016-6210), sshd hashes the supplied password anyway when an account has no usable password, borrowing the salt of another account.
2. On musl libc without PAM, `crypt()` fails when the password is between 257 and 1024 character long, and returns the string `*`.
3. An account locked with `*` in `/etc/shadow` stores the same string. sshd compares the two, finds a match, and reports a successful login.

Exploitation conditions:

- OpenSSH built against musl without PAM, which is the default `openssh-server` on Alpine Linux.
- Password authentication enabled (the default).
- An account whose shadow password field is exactly `*`.
- At least one other local account with a real password hash.

Accounts locked with `!` are not affected by this comparison.

# The Host

`/etc/os-release `identifies the target as Alpine Linux v3.24 (VERSION_ID 3.24.3). The syslog hostname is dev-jumpbox, and logging is handled by BusyBox syslogd. The Alpine 3.24 branch is within the range affected by the vulnerability.

![](https://i.imgur.com/7GPe9Pp.png)

# Identifying the exposed account

`/etc/shadow` shows two kinds of accounts, `root` and `adminsvc`

![](https://i.imgur.com/LKFhnbe.png)

- `root` has a SHA-512 (`$6$`) hash. This satisfies the requirement for another account with a real hash.
- System accounts (`bin`, `daemon`, `sshd`, `klogd`, and others) use `!`, which is not exploitable.
- `adminsvc` is the only account with `*` in the password field. Password login is disabled for it, so no password should ever be accepted.
# Initial Access

In `/var/log/messages`, `adminsvc` appears in a single authentication event:

![](https://i.imgur.com/HLhEM1F.png)

The login was accepted on **2026-11-06 at 11:27:08** from **192.168.72.1**. A successful password login for an account with `*` in `/etc/shadow` should not be possible, which makes this event the exploitation. The `Failed password` followed by `Accepted password` pattern is not unique to this event. Legitimate `root` logins from 192.168.72.131 show the same pattern at 06:43:00/06:43:05 and 12:28:03/12:28:06. The distinguishing factor is the account type. sshd does not log password length, so the oversized password itself is not visible in the logs. The session ended at 12:20:02 (disconnect logged from the same source and port), so it lasted about 53 minutes.
# Post Exploitation

The `adminsvc` shell history ends with `exit`, which matches the end of that session.

### Network Discovery

![](https://i.imgur.com/xkhDDCi.png)

The attacker used netcat to probe all 65535 ports on every address in 192.168.18.0/24 and filtered for open ports. Results were then written by hand with `vi scanreport.txt` and reviewed with `cat`. The report lists two hosts:

![](https://i.imgur.com/aeoirCE.png)

Both hosts expose SMB (445) and RDP (3389). Port 88 on 192.168.18.23 is the standard Kerberos port.

### Remote script execution

![](https://i.imgur.com/0pWC0AU.png)

The attacker downloaded `setup.sh` from a GitHub repository and ran it directly in bash without saving it to disk. The script contents are not part of the evidence, so its purpose cannot be determined. It is assumed that the script was used to stage the hidden file `/tmp/.devenv` that the attacker inspected afterward, but no evidence has been found to justify this assumption currently.

### Staging and exfiltration

![](https://i.imgur.com/Dty8ND4.png)

After the script ran, the attacker listed `/tmp` and checked the hidden file `/tmp/.devenv`. The file was then sent in an HTTP POST body to `https://devv.coding.eu/process`. Finally, `shred -u` overwrote and deleted the file, removing it from the host. 

# Indicators of Compromise
| Type             | Value                                                                                |
| ---------------- | ------------------------------------------------------------------------------------ |
| **Script URL**   | `https://raw.githubusercontent.com/papinyurii33/devscripts/refs/heads/main/setup.sh` |
| **Exfil URL**    | `https://devv.coding.eu/process`                                                     |

# References
- [OpenSSH Bypass: CVE-2026-123158 - OX Security](https://www.ox.security/blog/openssh-authentication-bypass-cve-2026-123158/ "null")
- [SSHhole: OpenSSH Fixes Password Bypass on Alpine Linux - SOCRadar](https://socradar.io/blog/sshole-openssh-password-bypass-alpine/ "null")
- [OpenSSH Rushes Patches for 'SSHole' Authentication Bypass - SecurityWeek](https://www.securityweek.com/openssh-rushes-patches-for-sshole-authentication-bypass/ "null")
- [CVE-2026-123158 (SSHole) Technical Breakdown - StepSecurity](https://www.stepsecurity.io/blog/cve-2026-123158-sshhole-openssh-musl-password-bypass "null")