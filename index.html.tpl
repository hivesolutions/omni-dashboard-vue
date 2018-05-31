<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="theme-color" content="#6d6d6d">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        <title><%= htmlWebpackPlugin.options.title %></title>
    </head>
    <body class="center cool cool-color cool-gradient-crazy" onload="OmniDashboard.start();">
        <noscript>Sorry, your browser does not support JavaScript.</noscript>
        <div id="app" class="app app-stores">
            <div class="container dynamic">
                <overlay ref="overlay"></overlay>
                <login ref="login"></login>
                <stores ref="stores"></stores>
            </div>
            <button-color v-if="deferredPrompt" v-on:click="promptInstall">Install</button-color>
        </div>
    </body>
</html>
