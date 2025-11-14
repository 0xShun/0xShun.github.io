---
layout: page
title: Projects
description: Cybersecurity, IoT, and Data Science projects
permalink: /projects/
---

<div style="margin-bottom: 2rem;">
  <p style="font-size: 1.1rem; color: var(--text-secondary);">
    Explore my hands-on projects in cybersecurity, network security, IoT implementations, 
    malware analysis, and data analytics. Each project demonstrates practical applications 
    of security concepts and technical skills.
  </p>
</div>

<div id="filterContainer" data-filter-container></div>

<section>
  <div class="research-full-width">
    {% assign sorted_projects = site.projects | sort: 'date' | reverse %}
    {% for project in sorted_projects %}
      <article class="card project-card" 
               data-filter-item 
               data-title="{{ project.title }}" 
               data-excerpt="{{ project.description }}" 
               data-categories="{% if project.category.first %}{{ project.category | join: ',' }}{% else %}{{ project.category }}{% endif %}" 
               data-year="{{ project.date | date: '%Y' }}"
               onclick="window.open('{{ project.repo_url }}', '_blank')"
               style="cursor: pointer;">
        
        {% if project.image %}
          <div class="project-image" style="width: 100%; height: 200px; overflow: hidden; border-radius: 8px 8px 0 0; margin: -1.5rem -1.5rem 1rem -1.5rem;">
            <img src="{{ project.image | relative_url }}" 
                 alt="{{ project.title }}" 
                 style="width: 100%; height: 100%; object-fit: cover;"
                 loading="lazy">
          </div>
        {% endif %}
        
        <h3 class="card-title" style="display: flex; align-items: center; gap: 0.5rem; justify-content: space-between;">
          <span>{{ project.title }}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink: 0; color: var(--accent-primary);">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </h3>
        
        <div class="card-meta">
          <span class="card-meta-item">
            <span class="accent">📅</span>
            {{ project.date | date: "%B %Y" }}
          </span>
          
          {% if project.category %}
            {% if project.category.first %}
              <!-- Multiple categories (array) -->
              {% for cat in project.category %}
                <span class="card-meta-item category-tag">
                  <span class="accent">📁</span>
                  {{ cat }}
                </span>
              {% endfor %}
            {% else %}
              <!-- Single category (string) -->
              <span class="card-meta-item category-tag">
                <span class="accent">📁</span>
                {{ project.category }}
              </span>
            {% endif %}
          {% endif %}
        </div>
        
        <div class="card-excerpt">
          {{ project.description }}
        </div>
        
        {% if project.technologies %}
          <div class="project-tech" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem;">
            {% for tech in project.technologies %}
              <span class="tech-tag">{{ tech }}</span>
            {% endfor %}
          </div>
        {% endif %}
        
        <div style="margin-top: 1rem; color: var(--accent-primary); font-weight: 500; display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          View on GitHub
        </div>
      </article>
    {% endfor %}
  </div>
</section>

<div style="margin-top: 3rem; padding: 2rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; border-left: 3px solid var(--accent-primary);">
  <h3 style="color: var(--accent-primary); margin-bottom: 1rem;">Want to Collaborate?</h3>
  <p style="color: var(--text-secondary); margin-bottom: 1rem;">
    I'm always interested in working on new security projects and research initiatives. 
    If you have an interesting project idea or want to collaborate, feel free to reach out!
  </p>
  <a href="mailto:{{ site.social.email }}" class="accent-bg" style="display: inline-block; padding: 0.8rem 1.5rem; text-decoration: none; border-radius: 5px; font-weight: bold;">
    Contact Me
  </a>
</div>
