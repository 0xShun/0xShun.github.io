---
categories:
  - CTF Writeup
  - Steganography
tags:
  - picoCTF
---


>**Description**
>Download this image and find the flag.
>[Image](https://artifacts.picoctf.net/c/422/pico.flag.png)


  > **Hints**
  > We know the end of the message will be $t3go

Seeing how this challenge provides an image and is titled $t3go i.e Steganography,  it's pretty obvious how we would go about this.

To put the tools I used into a list, in this challenge I used `strings`, `exiftool`, and `zsteg`.

The first utility I used was `strings` with `grep picoCTF` to check if the flag is hidden as text inside the file. NO LUCK :<

![](https://cdn-images-1.medium.com/max/2000/1*IZbCpE1z5v3exkzVderhng.png)

I then tried using `exiftool` to see if the flag is hidden as a metadata. Again NO LUCK!

![](https://cdn-images-1.medium.com/max/2000/1*GMeeh6pDXsyoteOP9UAquA.png)

Finally, I used `zteg`; which is a tool created by the `_zed-0xff_`. Just like the other Steganography tools it detects hidden data inside PND and BMP.

Nonetheless, I typed `zsteg pico.flag.png` and the flag appeared.

![](https://cdn-images-1.medium.com/max/2472/1*taaXhRdegFiQOZGFp3zXlA.png)

`Flag: picoCTF{7h3r3_15_n0_5p00n_a1062667}`
