from flask import Flask
from routes.web_routes import web_bp
from dotenv import load_dotenv

# 1. Initialize environment variables
load_dotenv()

# 2. Setup Flask App
app = Flask(__name__)

# 3. Register our Modular Routes
app.register_blueprint(web_bp)

if __name__ == '__main__':
    print("LinkShield is starting on http://127.0.0.1:5000")
    app.run(debug=True)