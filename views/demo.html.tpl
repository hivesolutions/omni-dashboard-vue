{% extends "layout.html.tpl" %}
{% block title %}Simple Demo{% endblock %}
{% block content %}
    {% raw %}
        <div id="app" class="app demo container">
            <h1>{{message}}</h1>
            <h2 class="details">{{details}}</h2>
            <div class="users">
                <user v-for="user in users"
                      v-bind:user="user"
                      v-bind:key="user.id">
                </user>
            </div>
            <div class="buttons">
                <span class="button" v-on:click="retryRemote">Re-load</span>
            </div>
        </div>
    {% endraw %}
{% endblock %}
