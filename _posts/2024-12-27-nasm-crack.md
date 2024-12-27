---
categories:
  - Reverse Engineering
tags:
  - Reverse Engineering
  - Linux
  - crackmes.one
---
This is a solution submitted to the crackmes.one challenge by **BitFriends**
# Challenge Description
Author: [BitFriends](https://crackmes.one/user/BitFriends)
Language: Assembler
Upload: 7:05 PM 04/25/2020
Platform: Unix/linux
Difficulty: 1.0
Quality: 4.0
Architecture: x86-64
Challenge link: https://crackmes.one/crackme/5ea48a1433c5d47611746436

# Solution
Looking at the info of the file we see that its a 64 bit ELF file that is not stripped which is useful because we get to see most of the original code.

![](Pasted%20image%2020241227233458.png)

Unlike other high-level programming languages like C/C++, this program was written in Nasm.  I used pwndbg to look at the assembly code. Looking at the `info functions` we see that there are two `correct_func` and `_start`. The latter is promising, looking at its code we see this:

![](Pasted%20image%2020241228000431.png)

The line at `+79` looks interesting. Let's set a break point and run the program and see the values at the register at that point. 

![](Pasted%20image%2020241228000846.png)

Now we can see that our input is saved in the `rsi` register, while the value being compared is kept in the `rdi` register.

Passing the value at the `rdi` register we can confirm that it is the correct password. 

![](Pasted%20image%2020241228001145.png)