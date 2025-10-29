from flask import Blueprint, jsonify, request
from backend.models import Task
from backend.app import db

task_routes = Blueprint('task_routes', __name__)

# Add new task
@task_routes.route('/tasks', methods=['POST'])
def add_task():
    data = request.json
    new_task = Task(
        title=data['title'],
        description=data['description'],
        priority=data['priority'],
        due_date=data['due_date'],
        status=data['status']
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Task added successfully"}), 201


# Get all tasks 
@task_routes.route('/tasks', methods=['GET'])
def get_tasks():
    status = request.args.get('status')
    priority = request.args.get('priority')

    query = Task.query
    if status:
        query = query.filter_by(status=status)
    if priority:
        query = query.filter_by(priority=priority)

    tasks = query.order_by(Task.due_date.asc()).all()
    return jsonify([task.to_dict() for task in tasks])


# Get task by ID
@task_routes.route('/tasks/<int:id>', methods=['GET'])
def get_task_by_id(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task.to_dict())


# Update task status
@task_routes.route('/tasks/<int:id>', methods=['PATCH'])
def update_task(id):
    data = request.get_json()
    task = Task.query.get_or_404(id)

    if 'status' in data:
        task.status = data['status']
    if 'priority' in data:
        task.priority = data['priority']

    db.session.commit()
    return jsonify({"message": "Task updated successfully"})



# Insights route
@task_routes.route('/insights', methods=['GET'])
def insights():
    total = Task.query.count()
    high = Task.query.filter_by(priority='High').count()
    medium = Task.query.filter_by(priority='Medium').count()
    low = Task.query.filter_by(priority='Low').count()
    pending = Task.query.filter_by(status='Pending').count()
    completed = Task.query.filter_by(status='Completed').count()

    #  Message Logic
    if total == 0:
        message = "No tasks available."
    elif completed == total:
        message = "🎉 All tasks are completed!"
    elif pending == total:
        message = f"You have {pending} pending task{'s' if pending > 1 else ''}."
    else:
        message = f"You have {total} tasks — {completed} completed and {pending} still pending."

    return jsonify({
        "total_tasks": total,
        "pending": pending,
        "completed": completed,
        "priority_distribution": {
            "high": high,
            "medium": medium,
            "low": low
        },
        "message": message
    })



