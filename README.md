# App Engine Examples

Example applications that can be deployed using Google Cloud App Engine

## Applications

* **hello-world** - Template HTML files to display `Hello World!`
* **[tetris-javascript](https://gcp-workshop-nathan.nw.r.appspot.com/)** - Tetris app created uisng HTML and JavaScript
* **[task-manager-flask](https://alpine-practice-351115.nw.r.appspot.com/)** - To Do List / Task Manager app created using Flask and Cloud Datastore

## Deployment

From the relevant folder for an application, run the following commands

* `dev_appserver.py app.yaml` - Test the application locally before deployment, requires the [Google Cloud CLI](https://cloud.google.com/sdk/docs) for App Engine to be installed. More information can be found [here](https://cloud.google.com/appengine/docs/standard/python/tools/using-local-server)
* `gcloud app deploy --project <PROJECT_ID>` - Deploy the application to App Engine for the specified project
* `gcloud app browse --project <PROJECT_ID>` - Browse to the application webpage for the specified project
