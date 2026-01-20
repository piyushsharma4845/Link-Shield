from flask import Blueprint, render_template, request, jsonify
from core.scanner import LinkScanner

# We use a Blueprint to keep our code modular
web_bp = Blueprint('web_routes', __name__)
scanner = LinkScanner()

@web_bp.route('/')
def home():
    return render_template('index.html')

@web_bp.route('/api/scan', methods=['POST'])
def handle_scan():
    data = request.json
    url_to_check = data.get('url')
    result = scanner.scan(url_to_check)
    return jsonify(result)