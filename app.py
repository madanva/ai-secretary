from flask import Flask, request, jsonify
from openai import OpenAI

app = Flask(__name__)
client = OpenAI()

@app.route('/generate', methods=['POST'])
def generate_text():
    # Extract the conversation history from the request
    conversation = request.json.get('conversation', [])
    
    # Prepare the messages for the OpenAI API
    messages = []
    for msg in conversation:
        role = 'user' if msg['sender'] == 'user' else 'assistant'
        messages.append({"role": role, "content": msg['text']})

    # Send the conversation to the OpenAI API
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        generated_text = response['choices'][0]['text']
        return jsonify({'response': generated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
