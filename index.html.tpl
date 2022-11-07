<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="theme-color" content="#6d6d6d">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        <title><%= htmlWebpackPlugin.options.title %></title>
    </head>
    <body class="center cool cool-color" onload="OmniDashboard.start();"
          data-gradients="cool-gradient-green,cool-gradient-violet,cool-gradient-crazy">
        <noscript>Sorry, your browser does not support JavaScript.</noscript>
        <div id="app" class="app app-stores">
            <overlay ref="overlay"></overlay>
            <login ref="login"></login>
            <message class="container dynamic" ref="message"></message>
            <stores class="container dynamic" ref="stores"></stores>
            <notice ref="notice" v-if="false"></notice>
        </div>
    </body>
</html>
