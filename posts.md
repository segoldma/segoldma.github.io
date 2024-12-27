---
layout: page
title: Posts
permalink: /posts/
---

{% for post in site.posts %}
{{ post.date | date: "%b %-d, %Y" }}
### [{{ post.title }}]({{ post.url | relative_url }}) 

{% if post.description %}{{ post.description }}{% endif %}

{% endfor %} 