{% extends "layout.html.tpl" %}
{% block title %}Omni Dashboard{% endblock %}
{% block content %}
    {% raw %}
        <div id="app" class="app stores container dynamic" style="max-width: 320px;">
            <store></store>
            <div class="footer">Updated 20/03 17.32</div>
            <div class="selectors">
                <span class="selected">&middot;</span>
                <span>&middot;</span>
                <span>&middot;</span>
            </div>
        </div>
    {% endraw %}
{% endblock %}
