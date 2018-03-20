{% extends "layout.html.tpl" %}
{% block title %}Omni Dashboard{% endblock %}
{% block content %}
    {% raw %}
        <div id="app" class="app">
            <div class="container">
                <store></store>
            </div>
        </div>
    {% endraw %}
{% endblock %}
