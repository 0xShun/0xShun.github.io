---
# the default layout is 'page'
icon: fas fa-info-circle
order: 4
---

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/dheereshagrwal/colored-icons@1.7.5/src/app/ci.min.css"
/>
<head>
  <meta name="google-site-verification" content="NejdknhKiHzLZiCyOKd_SAwShQnvov1fOSF8EnTd5wQ" />
</head>
#  I'm Shun

<br>

[![Typing SVG](https://readme-typing-svg.herokuapp.com?color=ffffff&lines=Security+Researcher;Software+Engineer;DFIR+Aspirant;Python+Developer;Network+Engineer;Electronics+Nerd;)](https://git.io/typing-svg)

Cybersecurity professional interested in Malware Reverse Engineering, Digital Forensics & Incident Response (DFIR), and Binary Analysis with a touch of machine learning applications in cybersecurity ^^

Regular CTF participant, continuously developing both offensive and defensive skills. Currently spending too much time poking at android malware samples and learning how AI models can be used in on-device(android) malware detection

### Socials

<table>
    <tr style="background-color:transparent">
        <td valign="top" width="100%">
         <a href="mailto:shawnmichaelsudaria@proton.me">Protonmail</a>
            <br>
         <a href="https://x.com/__5hun__">Twitter</a>
            <br>
         <a href="https://www.linkedin.com/in/shawn-michael-sudaria-397a33319/">LinkedIn</a>
            <br>
         <a href="https://tryhackme.com/p/5hun">TryHackMe</a>
            <br>
</td>
</tr>
</table>

---

### Certifications

<div class="certifications-grid">
  {% assign certification_files = site.static_files | sort: "path" %}
  {% for certification in certification_files %}
    {% if certification.path contains "/assets/img/certifications/" %}
      {% assign extension = certification.extname | downcase %}
      {% if extension == ".jpg" or extension == ".jpeg" or extension == ".png" or extension == ".gif" or extension == ".webp" %}
        <figure class="certification-item">
          <img src="{{ certification.path | relative_url }}" alt="{{ certification.name }} certification" loading="lazy">
        </figure>
      {% endif %}
    {% endif %}
  {% endfor %}
  <div class="certification-text">ISC2 CC</div>
</div>

---

### Achievements

#### Champion, HackForGov Regionals 2025

> Champion for the regional Hack4Gov, Top 1 Individually. Represented Region 8 in the National Leg

#### Champion, Byte Forward Hackathon 2025

> Competed as team captain of Team Excelr8 in the first-ever Byte Forward hackathon Visayas leg at Palo, Leyte. Our team placed first, winning 50,000 pesos and qualified to represent our region at the national stage.

#### 4th place, rSCENE Hackathon 2025

> Competed as team captain of Team Excelr8 in the first-ever rSCENE hackathon in Catbalogan City. Our team placed 4th out of 13 teams from across the region and was awarded 10,000 pesos. We developed a solution that enables local artists to gain public attention while allowing venue owners to rent their spaces to these artists.

#### Top 6, HackForGov Finals 2024

> Competed as a member of team ACES, a wildcard team composed of top performing individuals from Region 1, Region 2, CAR, and Region 8 (me). Placed 6th out of 20 teams from different regions across the country. Held at Parañaque City, organized by the Department of Information and Communications Technology of the Philippines.

#### Finalist, Trend Micro CTF Finals 2024

> Competed as a team captain of team Katipwneros in a Capture The Flag (CTF) competition organized by Trend Micro.

#### 2nd Runner Up, HackForGov Regionals 2024

> Competed as a team captain of team PWNED in a Capture The Flag (CTF) competition. Hosted by the Department of Information and Communications Technology of the Philippines. Was an individual top scorer and picked to be part of a wildcard team for the nationals.

#### 2nd Runner Up, HackForGov Regionals 2023

> Competed as a member of team Hydra in a Capture The Flag (CTF) competition. Hosted by the Department of Information and Communications Technology of the Philippines.
