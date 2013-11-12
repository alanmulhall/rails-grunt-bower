Quick Prototype using Grunt and Bower with Rails
--------

![Grunt](grunt.png)
![Bower](bower.png)

You will need to create a grunt-aws.json file with your s3 key, secret and bucket

    {
      "key": "your key",
      "secret": "your secret",
      "bucket": "your bucket name"
    }

**You will need to:**

1. Have node.js and npm install
2. Add grunt-aws.json to the project root
3. npm install -g grunt-cli
4. npm install -g bower
5. bower install

**Some things the Gruntfile does:**

1. Runs jshint, code coverage and code quality for Javascript
2. Concats and minifies Javascript
3. Uses karam test runner to run Jasmine tests
4. Uses compass to compile Scss files
5. Runs retire.js to check for security vunerabilities
6. Creates documentation for CSS and Javascript using Docco style comments
7. Has a task to compile and push production assets to S3, which can be set up as
   a git pre-commit hook
