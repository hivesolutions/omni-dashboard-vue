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
            <Overlay ref="overlay"></Overlay>
            <Login ref="login"></Login>
            <Message class="container dynamic" ref="message"></Message>
            <Stores class="container dynamic" ref="stores"></Stores>
            <Notice ref="notice" v-if="false"></Notice>
        </div>
    </body>
</html>
