from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
client = OpenAI()

@app.route('/generate', methods=['POST'])
def generate_text():
    # Extract the conversation history from the request
    conversation = request.json.get('conversation', [])
    
    # Prepare the messages for the OpenAI API
    messages = [{"role": "system", "content": "You are a helpful assistant to help understand a user's preferences with regard to scheduling. You are to fully understand user's behavior with scheduling. Please say DONE when you are done. Keep responses short and concise. "},     {"role": "assistant", "content": "When do you do your best work?"},
]
    for msg in conversation:
        role = 'user' if msg['sender'] == 'user' else 'assistant'
        messages.append({"role": role, "content": 'Just stay DONE when you are done. Otherwise keep the conversation going: ' + msg['text']})

    # Send the conversation to the OpenAI API
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        generated_text = response.choices[0].message.content
        return jsonify({'response': generated_text})
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

from get_relavent_convo import get_relevant_convo
from helper import make_gpt4_call

@app.route('/get-calender-response', methods=['POST'])
def get_calender_response():
    print(request.json)
    questionaire = request.json.get('questionaire') 
    print(questionaire)
    get_convo = get_relevant_convo(str(questionaire))
    resp = make_gpt4_call('Please give me a Python list of dictionaries where each dictionary has date, title, description, time and location (can be physical location, zoom link or empty). For reference user preferences is {questionaire} and all potential calender conversations are {get_convo}')
    return resp 

if __name__ == '__main__':
    app.run(debug=True)
