# App Engine Examples

Example HTML applications that can be deployed using Google Cloud App Engine

## Applications

* **hello-world** - Template HTML files to display hello world page
* **tetris** - Tetris app created uisng HTML, CSS, and JavaScript

## Deployment

From the relevant folder for an application, run the following commands

* `dev_appserver.py app.yaml` - Used to test the application locally before deployment, requires the [Google Cloud CLI](https://cloud.google.com/sdk/docs) for App Engine to be installed. More information can be found [here](https://cloud.google.com/appengine/docs/standard/python/tools/using-local-server)
* `gcloud app deploy --project <PROJECT_ID>` - Used to deploy the application to App Engine for the specified project
* `gcloud app browse --project <PROJECT_ID>` - Used to browse to the application webpage for the specified project
