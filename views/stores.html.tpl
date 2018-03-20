{% extends "layout.html.tpl" %}
{% block title %}Omni Dashboard{% endblock %}
{% block content %}
    {% raw %}
        <div id="app" class="app container dynamic" style="max-width: 320px;">
            <store></store>
        </div>
    {% endraw %}
{% endblock %}
