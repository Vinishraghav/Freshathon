from flask import Flask, render_template_string

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Eventsphere Test</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container mt-5">
            <div class="card">
                <div class="card-body">
                    <h1 class="card-title">Eventsphere Test Page</h1>
                    <p class="card-text">If you can see this, the Flask server is working correctly!</p>
                    <a href="#" class="btn btn-primary">Test Button</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    """)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
