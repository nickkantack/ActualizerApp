
# Actualizer App
This app is an experimental, one-stop app for tracking and performing forms of mental training in which I'm interested (e.g. language learning, memorization techniques, mental math, etc.). Much of the code is copied or adapted from [this tutorial](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps).

### Local development

To run the server locally,
1. Open a terminal and change the working directory to the directory of this file.
1. Run `python3 -m http.server`

Note that in local development it is expected to get an error message in the browser from the service worker to the effect `sw.js:1 Uncaught (in promise) TypeError: Failed to execute 'addAll' on 'Cache': Request failed`. Adding files to the cache is only needed when the app is pulled from a remote server, but is not needed during local development (we are ok with the service worker having to go to the local server for every file load instead of the cache).

/Users/kantackn/.nvm/versions/node/v18.18.2/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/Users/kantackn/.toolbox/bin:/Users/kantackn/Library/Python/3.8/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/Users/kantackn/Library/Application Support/JetBrains/Toolbox/scripts