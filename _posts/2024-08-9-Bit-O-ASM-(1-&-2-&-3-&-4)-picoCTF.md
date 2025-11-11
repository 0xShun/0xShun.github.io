---
categories:
  - CTF Writeup
  - Reversing
tags:
  - Assembly
---

> This [site](https://wiki.osdev.org/CPU_Registers_x86-64) is a great reference point for x86_64 CPU architecture registers.

## Bit-O-Asm 1

> **Description**
> Can you figure out what is in the `eax` register? Put your answer in the picoCTF flag format: `picoCTF{n}` where `n` is the contents of the `eax` register in the decimal number base. If the answer was `0x11` your flag would be `picoCTF{17}`. Download the assembly dump [here](https://artifacts.picoctf.net/c/509/disassembler-dump0_a.txt).

The assembly dump:

```c
<+0>:     endbr64
<+4>:     push   rbp
<+5>:     mov    rbp,rsp
<+8>:     mov    DWORD PTR [rbp-0x4],edi
<+11>:    mov    QWORD PTR [rbp-0x10],rsi
<+15>:    mov    eax,0x30
<+20>:    pop    rbp
<+21>:    ret
```

Looking at the offset `<+15>` we can see that a constant is being loaded into the `eax` register. hex `0x30` is `48` in decimal.

## Bit-O-Asm 2

> **Description**
> Can you figure out what is in the `eax` register? Put your answer in the picoCTF flag format: `picoCTF{n}` where `n` is the contents of the `eax` register in the decimal number base. If the answer was `0x11` your flag would be `picoCTF{17}`. Download the assembly dump [here](https://artifacts.picoctf.net/c/510/disassembler-dump0_b.txt).

The assembly dump:

```c
<+0>:     endbr64
<+4>:     push   rbp
<+5>:     mov    rbp,rsp
<+8>:     mov    DWORD PTR [rbp-0x14],edi
<+11>:    mov    QWORD PTR [rbp-0x20],rsi
<+15>:    mov    DWORD PTR [rbp-0x4],0x9fe1a
<+22>:    mov    eax,DWORD PTR [rbp-0x4]
<+25>:    pop    rbp
<+26>:    ret

```

On the offset `<+15>` we can see that the `0x9fe1a` is being stored at 4 bytes(`0x4`) below the base pointer(`rbp`), that's the `[rbp-0x4]`.

Then on the offset `<+22>` we can see that that value stored in the `[rbp-0x4]` is being moved/stored in the`eax` register. So we know that value `0x9fe1a`, which is `654874` in decimal, is being stored in the `eax` register when the instruction at `<+22>` is read.

## Bit-O-Asm 3

> **Description**
> Can you figure out what is in the `eax` register? Put your answer in the picoCTF flag format: `picoCTF{n}` where `n` is the contents of the `eax` register in the decimal number base. If the answer was `0x11` your flag would be `picoCTF{17}`. Download the assembly dump [here](https://artifacts.picoctf.net/c/530/disassembler-dump0_c.txt).

The assembly dump:

```c
<+0>:     endbr64
<+4>:     push   rbp
<+5>:     mov    rbp,rsp
<+8>:     mov    DWORD PTR [rbp-0x14],edi
<+11>:    mov    QWORD PTR [rbp-0x20],rsi
<+15>:    mov    DWORD PTR [rbp-0xc],0x9fe1a
<+22>:    mov    DWORD PTR [rbp-0x8],0x4
<+29>:    mov    eax,DWORD PTR [rbp-0xc]
<+32>:    imul   eax,DWORD PTR [rbp-0x8]
<+36>:    add    eax,0x1f5
<+41>:    mov    DWORD PTR [rbp-0x4],eax
<+44>:    mov    eax,DWORD PTR [rbp-0x4]
<+47>:    pop    rbp
<+48>:    ret
```

We see that in the offset `<+15>` the value `0x9fe1a` is being stored in the `[rbp-0xc]` and at `<+22>` the value `0x4` is being stored in the `[rbp-0x8]`. Then on `<+29>` the value at `[rbp-0xc]` is now being moved to the `eax` register. On the next line, we see that the current value in the `eax` register is being multiplied by the value in the `[rbp-0x8]`

So `0x9fe1a` is `654874` in decimal and `0x4` is `4` in decimal. Multiply those we get `2619496` which is `0x27F868` in hex. So now we know that on offset `<+32>` the current value of `eax` would be `0x27F868`.

On `<+36>`, the current value of `eax` is being added to `0x1f5` and that gives us `2619997` which is `0x27FA5D` in hex. The next 2 lines isn't anything too significant because it only stores the final value back to the `eax` register without any processing of the value.

## Bit-O-Asm 4

> **Description**
> Can you figure out what is in the `eax` register? Put your answer in the picoCTF flag format: `picoCTF{n}` where `n` is the contents of the `eax` register in the decimal number base. If the answer was `0x11` your flag would be `picoCTF{17}`. Download the assembly dump [here](https://artifacts.picoctf.net/c/511/disassembler-dump0_d.txt).

The assembly dump:

```c
<+0>:     endbr64
<+4>:     push   rbp
<+5>:     mov    rbp,rsp
<+8>:     mov    DWORD PTR [rbp-0x14],edi
<+11>:    mov    QWORD PTR [rbp-0x20],rsi
<+15>:    mov    DWORD PTR [rbp-0x4],0x9fe1a
<+22>:    cmp    DWORD PTR [rbp-0x4],0x2710
<+29>:    jle    0x55555555514e <main+37>
<+31>:    sub    DWORD PTR [rbp-0x4],0x65
<+35>:    jmp    0x555555555152 <main+41>
<+37>:    add    DWORD PTR [rbp-0x4],0x65
<+41>:    mov    eax,DWORD PTR [rbp-0x4]
<+44>:    pop    rbp
<+45>:    ret
```

In the code at `<+15>` we see `0x9fe1a` being moved to the `rbp-0x4` then on the next line it is being compared to the constant `0x2710`. Then on `<+29>` there is a jump instruction, `jle` means "jump if less than or equal". It that line it will cause the program to jump to the `0x55555555514e` which is `<main+37>` location if the previous line resulted in the first operand(`rbp-0x4`) being less than or equal to `0x2710` else it will just read the next line of code.

In this case the value at `rbp-0x4`, which is `654874` in decimal, is greater than `0x2710`, which is `10000` in decimal. Resulting in the jump not occurring. So the next line of code is read, which in this case will subtract the value at `rbp-0x4` to `0x65`, resulting in `0x9fdb5` as difference. Lastly it will read the `jmp` instruction which will jump to the `0x555555555152` address and in that address it will store the current value of `rbp-0x4` to the `eax` register. Hence, the final value would be the decimal equivalent to the last calculation.

Thanks for reading :>

{% include comments.html %}
