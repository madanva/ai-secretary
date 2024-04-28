from constants import GPT4_CONTEXT_LENGTH
import os
import requests
import tiktoken

def num_tokens_from_string(string: str, encoding_name: str = 'cl100k_base') -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens

def get_response_from_llama3(prompt: str) -> str:
    """Get response from LLaMA model using the Groq API."""
    groq_api_key = os.getenv("GROQ_API_KEY")
    headers = {
        'Authorization': f'Bearer {groq_api_key}',
        'Content-Type': 'application/json'
    }
    payload = {
        "model_name": "llama3-8b-8192",
        "prompt": prompt,
        "temperature": 0
    }
    response = requests.post("https://api.groq.com/llm/v1/predict", json=payload, headers=headers)
    
    if response.status_code == 200:
        return response.json().get('response', 'No response in payload')
    else:
        return f"Error: {response.status_code}, Message: {response.text}"

def read_files_from_directory(directory: str):
    """Reads all text files from a given directory and returns their content."""
    files_content = []
    for filename in os.listdir(directory):
        if filename.endswith('.txt'):
            try:
                with open(os.path.join(directory, filename), 'r', encoding='utf-8') as file:
                    files_content.append(file.read())
            except IOError as e:
                print(f"Failed to read {filename}: {e}")
    return files_content

def get_relevant_convo(questionnaire: str, data_dir: str = 'data'):
    relevant_convo = ""
    total_available_tokens = GPT4_CONTEXT_LENGTH - num_tokens_from_string(questionnaire)
    files_content = read_files_from_directory(data_dir)
    
    for content in files_content:
        prompt = f"Please answer yes if the following message is relevant to scheduling my calendar and no if it is not. For reference, you have {total_available_tokens} tokens. {content}"
        response = get_response_from_llama3(prompt=prompt).lower()
        if response == "yes":
            token_count = num_tokens_from_string(content)
            if total_available_tokens >= token_count:
                total_available_tokens -= token_count
                relevant_convo += f'{content}\n'
            else:
                break  # Stop if there isn't enough token space for the next content
    return relevant_convo