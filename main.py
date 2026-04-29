from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route("/")
def home():
    return "🚀 VIRALFLOW AI SYSTEM RUNNING"

@app.route("/run")
def run():
    return "✅ System triggered"

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    idea = data.get("idea", "")

    return jsonify({
        "idea": idea,
        "script": f"🔥 Viral content for: {idea}"
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
