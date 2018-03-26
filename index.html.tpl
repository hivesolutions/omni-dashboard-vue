<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, minimum-scale=1, maximum-scale=1" />
        <title><%= htmlWebpackPlugin.options.title %></title>
    </head>
    <body class="center cool cool-color cool-gradient-crazy" onload="OmniDashboard.start();">
        <div id="app" class="app app-stores container dynamic">
            <overlay ref="overlay"></overlay>
            <stores ref="stores"></stores>
        </div>
    </body>
</html>
