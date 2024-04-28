from openai import OpenAI 

client = OpenAI()
def make_gpt4_call(prompt):
    messages = [{"role": "assistant", "content": {prompt}}]
    response = client.chat.completions.create(
        model="gpt-4-turbo",
        messages=messages
    )
    generated_text = response.choices[0].message.content
    return generated_text