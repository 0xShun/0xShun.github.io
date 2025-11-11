---
layout: page
title: All Posts
description: Complete collection of blog posts, writeups, and technical articles
permalink: /posts/
---

<div id="filterContainer" data-filter-container></div>

<section>
  <div class="research-full-width">
    {% for post in site.posts %}
      <article class="card" data-filter-item data-title="{{ post.title }}" data-excerpt="{{ post.excerpt | strip_html }}" data-categories="{% for cat in post.categories %}{{ cat }}{% unless forloop.last %},{% endunless %}{% endfor %}" data-year="{{ post.date | date: '%Y' }}">
        <h3 class="card-title">
          <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </h3>
        
        <div class="card-meta">
          <span class="card-meta-item">
            {{ post.date | date: "%B %d, %Y" }}
          </span>
          
          {% if post.categories %}
            <span class="card-meta-item">
              {% for category in post.categories %}
                <a href="{{ site.baseurl }}/categories/{{ category | slugify }}" class="category">{{ category }}</a>
              {% endfor %}
            </span>
          {% endif %}
        </div>
        
        {% if post.tags %}
          <div class="card-tags-top">
            {% assign tag_count = post.tags | size %}
            {% for tag in post.tags limit:3 %}
              <a href="{{ site.baseurl }}/tags/{{ tag | slugify }}" class="tag">{{ tag }}</a>
            {% endfor %}
            {% if tag_count > 3 %}
              <span class="tag tag-more">+{{ tag_count | minus: 3 }}</span>
            {% endif %}
          </div>
        {% endif %}
        
        {% if post.excerpt %}
          <div class="card-excerpt">
            {{ post.excerpt | strip_html | truncatewords: 30 }}
          </div>
        {% endif %}
      </article>
    {% endfor %}
  </div>
</section>
