---
layout: page
title: All Posts
description: Complete collection of blog posts, writeups, and technical articles
permalink: /posts/
---

<div id="filterContainer" data-filter-container></div>

<section>
  <div class="writeup-grid">
    {% for post in site.posts %}
      <article class="card writeup-card" data-href="{{ post.url | relative_url }}" data-filter-item data-title="{{ post.title | escape }}" data-excerpt="{{ post.excerpt | strip_html | escape }}" data-categories="{% for cat in post.categories %}{{ cat | escape }}{% unless forloop.last %},{% endunless %}{% endfor %}" data-year="{{ post.date | date: '%Y' }}">
        {% include post-cover.html post=post %}
        <div class="writeup-card-body">
          <h3 class="card-title">
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h3>
          {% if post.excerpt %}
            <div class="card-excerpt">
              {{ post.excerpt | strip_html | truncatewords: 30 }}
            </div>
          {% endif %}
          {% if post.tags %}
            <div class="writeup-card-tags">
              {% for tag in post.tags limit:3 %}
                <a href="{{ site.baseurl }}/tags/{{ tag | slugify }}" class="tag">{{ tag }}</a>
              {% endfor %}
              {% assign tag_count = post.tags | size %}
              {% if tag_count > 3 %}<span class="tag tag-more">+{{ tag_count | minus: 3 }}</span>{% endif %}
            </div>
          {% endif %}
          <div class="writeup-card-meta">
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
          </div>
        </div>
      </article>
    {% endfor %}
  </div>
</section>
