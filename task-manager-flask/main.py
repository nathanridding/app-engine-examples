from flask import Flask, render_template, url_for, request, redirect
from datetime import datetime
from google.cloud import datastore

app = Flask(__name__)
datastore_client = datastore.Client()
datastore_kind = 'task-manager'


def get_all_tasks():
    query = datastore_client.query(kind=datastore_kind)
    query.order = ["time_created"]
    tasks = list(query.fetch())
    return(tasks)


def get_task_by_id(id):
    with datastore_client.transaction():
        key = datastore_client.key(datastore_kind, id)
        task = datastore_client.get(key)
        return(task)


@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        task_content = request.form['content']

        try:
            entity = datastore.Entity(key=datastore_client.key(datastore_kind))
            entity.update({
                'content': task_content,
                'time_created': datetime.utcnow()
            })
            datastore_client.put(entity)
            return redirect('/')
        except:
            return('There was an error adding your task')

    else:
        tasks = get_all_tasks()
        return render_template('index.html', tasks=tasks)


@app.route('/delete/<int:id>')
def delete(id):
    task = get_task_by_id(id)
    try:
        datastore_client.delete(task)
        return redirect('/')
    except:
        return('There was an error deleting your task')


@app.route('/update/<int:id>', methods=['POST', 'GET'])
def update(id):
    task = get_task_by_id(id)
    if request.method == 'POST':
        new_content = request.form['content']
        try:
            task["content"] = new_content
            datastore_client.put(task)
            return redirect('/')
        except:
            return('There was an error updating your task')
    else:
        return render_template('update.html', task=task)


if __name__ == "__main__":
    app.run(debug=True)
