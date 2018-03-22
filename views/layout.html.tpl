<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        <title>{% block title %}{% endblock %}</title>
        {% block javascript %}
            <script src="/static/dist/bundle.js"></script>
        {% endblock %}
    </head>
    <body class="center cool cool-color cool-gradient-crazy" onload="OmniDashboard.start();">
        {% block content %}{% endblock %}
    </body>
</html>
