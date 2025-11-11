---
categories:
  - Reverse Engineering
tags:
  - Reverse Engineering
  - Linux
  - crackmes.one
---

This is a solution submitted to the crackmes.one challenge by **b4te**

# Challenge Description
Author: [b4te](https://crackmes.one/user/b4te)
Language: C/C++
Upload: 2:27 PM 05/12/2024
Platform: Unix/linux
Difficulty: 1.1
Quality: 3.8
Architecture: x86
Challenge link: https://crackmes.one/crackme/6640d1d26b8bd8ddfe33c80a
# Solution
Let's take a look at some basic information about the file

```bash
file guess_the_password 

guess_the_password: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, BuildID[sha1]=4b5316bbef627d72efaa8d38723b2e9725065ec2, for GNU/Linux 3.2.0, not stripped
```

It's a 64 bit ELF file. It's not stripped so we can see most of the original logic.

![](https://i.imgur.com/ddjThGk.png)

Looking at the main function we can see that it's using the `check` function to validate the input.

![](https://i.imgur.com/xaaoBaC.png)
Going forward, ghidra would be a useful tool to quickly identify the code.

Looking at the `check` function in ghidra we get this:
![](https://i.imgur.com/vzdo5aX.png)

Looking at the condition. It checks for three things
1. If the length of the input is 10
2. If the first character in the input is 1
3. if the 5th index is 9

With this we can try the input `1999999999`
![](https://i.imgur.com/W2FGOYF.png)

We get the correct password. 