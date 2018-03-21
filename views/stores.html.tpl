{% extends "layout.html.tpl" %}
{% block title %}Omni Dashboard{% endblock %}
{% block content %}
    {% raw %}
        <div id="app" class="app stores container dynamic" style="max-width: 320px;">
            <carousel>
                <slide v-for="store in stores">
                    <store v-bind:store="store"></store>
                </slide>
            </carousel>
            <div class="footer">Updated 20/03 17.32</div>
            <div class="selectors">
                <span v-for="store in stores">&middot;</span>
            </div>
        </div>
    {% endraw %}
{% endblock %}
