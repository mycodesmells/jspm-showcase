# Getting Started With JSPM

The same says it all - it's yet another package manager for your Java Script dependencies. So why on Earth would you want to go down that road again? Learn have another tool that can do the same stuff? You are absolutely right, you don't. But if you give me a couple of minutes, I can show you that JSPM is just a bit more. And you're going to love that _a bit_ a lot!

### JPM vs the field

We have already seen two JS package managers - the ubiquitous **npm** and the simple **Bower**. So how JSPM matches against those guys?

Well, you probably already know, that npm is the most popular tool now, and it has been designed primarily for backend Node JS deps. You can use those packages on your frontend as well (as a part of Node's probably most important concept of backend-frontend code sharing), but it's not as easy and natural. You not only have to install the packages via npm, but also somehow include them in your frontend scripts (eg. using Webpack). It just ain't cool, right?

As for npm you it might be hard to make a fair comparison to JSPM, when it comes to Bower you should have no excuses. In my opinion (please correct me if I'm wrong), it is just a simple download tool. It is useful because you don't have to remember all the URLs for jQuery and underscore, but that's all. What would you want more from your frontend package manager? Well... Once you go JSPM, you won't look back.

### Quick start with JSPM

First, we need to install JSPM via npm. It is recommended to have it installed both globally (for more convenient bash use) and locally (to have it available wherever you install your project). You might want to have `package.json` file created, as with any JS project:

    cd path/to/jspm_project
    npm install -g jspm
    npm install jspm --save-dev

Now you want to initialize the JSPM's part of your project. Fortunately, there is a configuration wizard, very similar to that of `npm init`:

    $ jspm init

    Package.json file does not exist, create it? [yes]:
    Would you like jspm to prefix the jspm package.json properties under jspm? [yes]:
    Enter server baseURL (public folder path) [./]:
    Enter jspm packages folder [./jspm_packages]:scripts/jspm_packages
    Enter config file path [./config.js]:
    Configuration file config.js doesn't exist, create it? [yes]:
    Enter client baseURL (public folder URL) [/]:
    Do you wish to use a transpiler? [yes]:
    Which ES6 transpiler would you like to use, Babel, TypeScript or Traceur? [babel]:
    ...
    ok   Loader files downloaded successfully

If you read the output carefully, you are probably amazed aready. The last question suggests, that there will be some kind of ES6 transipiler. Is it for real? It absolutely is! You no longer have to think about transpiling your scripts before publishing them, it can be done on the fly! I bet you don't remember about Bower any more at this point.

Note that I didn't use the default value when asked for jspm packages folder (I went with `scripts/jspm_packages`). At this point you should also notice that a file called `config.js` hsa been created. It's safe to say that its content should not concern you that much at this point.

### Practictal example

If you recall, I wrote [a post](https://github.com/mycodesmells/highcharts-introduction) on creating a simple chart using Highcharts library. Can we do this using JSPM. Do you really need to ask?

First, let's install highcharts. It is available via Github, so we can install it like this:

    $ jspm install github:highcharts/highcharts jquery
         Looking up github:highcharts/highcharts
         Updating registry cache...
    ok   Installed highcharts/highcharts as github:highcharts/highcharts@^4.2.1 (4.2.1)
    ok   Install tree has no forks.
    ...
    ok   Install complete.

It's just like installing via Bower, so we don't loose anything here. The Highcharts package has been downloaded, as we requested, to `./scripts/jspm_packages/github/highcharts`. What you might want to check, is that is also visible in your top-level `package.json` file:

    {
      "name": "jspm-showcase",
      ...
      "jspm": {
        ...
        "dependencies": {
          "highcharts/highcharts": "github:highcharts/highcharts@^4.2.1",
          "jquery": "npm:jquery@^2.2.0"
        },
        ...
      }
    }

Its path starts with 'github:', but its name is actually just `highcharts/highcharts`. We will be using it in our scripts.

Now we need to write some code of our own. We should start by creating some entry point. We'll use `scripts/app` script for this:

    // scripts/app
    console.log('Howdy!')

And finally, it's time for our index.html to cap things off. To have it all working correctly, we need to do three things:

- import JSPM's system.js package loader
- import JSPM's configuration (aw, that's what that `config.js` was for...)
- initialize our application by importing `scripts/app.js`

It should look like this:

    <!doctype html>
    <html lang="en">
    ...
    <script src="jspm_packages/system.js"></script>
    <script src="config.js"></script>
    <script>
        System.import('scripts/app')
    </script>
    ...
    </html>

If you run this code now in your browser, you should see our cute greeting. You may notice that after changing the code it just takes a page refresh to see those changes applied.

That was fun, but we still have embarrassingly zero charts on the page. We'll just copy the code from that Highcharts post, and import it into our `scripts/app.js`.

`scripts/data.js`:

    let DATA_SERIES = [...];
    export default DATA_SERIES;

`scripts/app.js`:

    import $ from 'npm:jquery@2.2.0'
    import Highcharts from 'highcharts/highcharts'
    import data from './data';

    Highcharts.setOptions({
        lang: {
            decimalPoint: "."
        }
    });

    $(function () {
        $("#chartContainer").highcharts({
            title: {
                text: 'NBA Scorers throughout career'
            },
            series: []
        });

        var chart = $("#chartContainer").highcharts();

        fetchData((allSeries) => {
            allSeries.forEach((serie, index) => {
                setTimeout(chart.addSeries.bind(chart, serie), 2000*index);
            })
        });
    });

    function fetchData(callback) {
        callback(data);
    }

**Note** that I explicitly used `Highcharts` variable to set some options. Even if I didn't I would need to import the library, so that it is included in my output script. Without mentioning the package in your imports, JSPM does not know that you will need it. If you have some annoying lint tool that does not allow you to import unused variables (congrats on good practices), you should go with:

    import 'highcharts/highcharts'

Last but not least, we need to remember about adding a `<div>` for our chart into `index.html`. The final result should look like this (after a couple of seconds of dynamic loading):

<img src="https://raw.githubusercontent.com/mycodesmells/jspm-showcase/master/posts/images/final-result.png"/>

You can check out full source code of this example [on Github](https://github.com/mycodesmells/jspm-showcase).
