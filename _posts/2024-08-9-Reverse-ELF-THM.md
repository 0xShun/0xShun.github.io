---
categories:
  - CTF Writeup
  - Reversing
tags:
  - TryHackMe
---
## Crackme1
> Let's start with a basic warmup, can you run the binary?

Make the permission of the binary to executable then run it. 
![](https://i.imgur.com/pb5Dtvg.png)
## Crackme2
Find the super-secret password! and use it to obtain the flag
1. What is the super secret password ?
   Opening up ghidra, we can see the check that must be satisfied to get the flag. 
   ![](https://i.imgur.com/EY65huw.png)
2. What is the flag?
   Using the new found password with the command `./crackme2 super_secret_password` we get the flag. 

## Crackme3
> Use basic reverse engineering skills to obtain the flag

Using `strings` was a simple solution that I implemented to address this. Using the `strings` command is one of the first commands to use when given a binary and a fundamental skill in reverse engineering because it occasionally outputs passwords and other sensitive data. 

In this instance, a base64 encoded value was visible when I ran strings on the binary. 

![](https://i.imgur.com/vb4O8pR.png)

decoding this with the `base64 -d` command we get the flag. 
```bash
 echo -n "ZjByX3kwdXJfNWVjMG5kX2xlNTVvbl91bmJhc2U2NF80bGxfN2gzXzdoMW5nNQ==" | base64 -d
```

## Crackme4
> Analyze and find the password for the binary?
> What is the password?

I solved this question using GDB. The initial step involved disassembling the `main` function. At an offset of `+62` from the start of `main`, I observed a `compare_pwd` function.
![](https://i.imgur.com/oeCnzBW.png)

Looking at the assembly code for the `compare_pwd` function, I noticed it used a string comparison function. Before that, there was a `get_pwd` function which retrieves the password from the user. So, I inferred that the program first gets the password from the user and then compares it to the correct password.

![](https://i.imgur.com/PG1akRj.png)

The next step was to set a breakpoint at `0xx00000000004006d5` to inspect the values of the registers at that point. I then ran the program with `test` as the argument, which allowed me to see the password being used.

![](https://i.imgur.com/HGZUR7t.png)
There you can see that my argument `test` was being compared to the correct password `my_m0r3_secur3_pwd`

We can verify that by running it as the argument:

![](https://i.imgur.com/JT0P9D4.png)

## Crackme5
> What will be the input of the file to get output `Good game`?

> What is the input?

This is where I introduce a tool called `ltrace`. `ltrace` is a Linux utility that traces dynamic library calls made by a program during execution. It is useful for debugging, reverse engineering, and understanding how a program interacts with shared libraries. `ltrace` provides real-time visibility into function calls, their arguments, and return values.

As you can see in the 2nd argument of the `strncmp` function is the password. 

![](https://i.imgur.com/PSZgAGO.png)

## Crackme6
> Analyze the binary for the easy password

> What is the password ?

I ran Ghidra and traced the data flow. First, I observed that the `compare_pwd` function was called from `main`. Then, by examining the decompiled code of `compare_pwd`, I saw that it invoked the `my_secure_test` function. Within this function, the password is actually revealed.

![](https://i.imgur.com/VCHGqYV.png)

We can verify this by passing it to the program. 
![](https://i.imgur.com/vU0SPDf.png)
## Crackme7
> Analyze the binary to get the flag

> What is the flag?

I used ghidra to look at the decompilation of the code. There you can see that if I input `31337`, which is `0x7a69` in hex, it runs the `giveFlag()` function. 

![](https://i.imgur.com/Q8zQqjT.png)

Entering `31337` will provide the flag.

![](https://i.imgur.com/hrwz3y5.png)

## Crackme8
> Analyze the binary and obtain the flag

> What is the flag ?

This is similar to the previous question, with the only difference being that we now need to input a negative number to obtain the flag.

![](https://i.imgur.com/PprQ48f.png)
