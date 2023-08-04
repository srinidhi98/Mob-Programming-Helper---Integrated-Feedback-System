import os
from dotenv import load_dotenv
from flask import Flask

from apis.v1.endpoints import api_v1

load_dotenv()

app = Flask(__name__)
app.register_blueprint(api_v1, url_prefix='/api/v1')

port = os.getenv('ML_API_PORT', 3001)

@app.route('/')
def index():
	return 'Machine Learning API is online!'

if __name__ == "__main__":
	print(f'ML API started on http://localhost:{port}')
	app.run(host='0.0.0.0', port=port)
