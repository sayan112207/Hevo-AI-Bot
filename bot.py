import streamlit as st
import requests
import json
import os
from dotenv import load_dotenv
import re
import time

st.set_page_config(
        page_title="Hevo AI Support Bot",
        page_icon="https://github.com/sayan112207/Snowflake_Pricing_Calculator/blob/master/hevo_logo.png?raw=true"
    )

# Load environment variables from .env file
load_dotenv()

# Retrieve API key from environment variable
API_KEY = os.getenv("API_KEY")

# Function to validate the email format
#def is_valid_email(email):
#    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
#    return re.match(email_regex, email) is not None
    
# Function to send the email to the webhook
#def send_email_to_webhook(email):
#    url = os.getenv("url") #Webhook URL
#    data = {"Email": email}  # Payload for the webhook
#    headers = {"Content-Type": "application/json"}

#    try:
#        response = requests.post(url, headers=headers, json=data)
#        response.raise_for_status()
#        return True
#    except requests.exceptions.RequestException:
#        st.error("Oops! Didn't quite catch that. Please try entering your email again.")
#        return False

# Function to display the typing animation
def show_typing_animation():
    st.markdown("""
        <style>
            .typing {
                position: relative;
                display: inline-block;
            }

            .typing span {
                content: '';
                animation: blink 1.5s infinite;
                animation-fill-mode: both;
                height: 10px;
                width: 10px;
                background: #3b5998;
                position: absolute;
                border-radius: 50%;
            }

            .typing span:nth-child(2) {
                animation-delay: 0.2s;
                margin-left: 15px;
            }

            .typing span:nth-child(3) {
                animation-delay: 0.4s;
                margin-left: 30px;
            }

            @keyframes blink {
                0% {
                    opacity: 0.1;
                }
                20% {
                    opacity: 1;
                }
                100% {
                    opacity: 0.1;
                }
            }
        </style>
        <div class="typing">
            <span></span>
            <span></span>
            <span></span>
        </div>
    """, unsafe_allow_html=True)

# Main chat interface function
def display_chat_interface():
#    st.title("Hevo AI Support Bot")
    st.markdown("Welcome to the **Hevo Data Support Bot**! 🌐 Ask questions about Hevo’s features, integrations, or setup.")

    # Initialize chat history if it doesn't exist
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = [{
            "role": "assistant", 
            "content": "Hello! How can I help today?",
            "avatar": "https://res.cloudinary.com/hevo/image/upload/v1685872557/hevo-learn-1/Hevo-Brand-Logo.png"
        }]

    # Display chat messages from history
    for chat in st.session_state.chat_history:
        if chat["role"] == "assistant":
            st.chat_message(chat["role"], avatar=chat["avatar"]).write(chat["content"])
        else:
            st.chat_message(chat["role"]).write(chat["content"])

    # User question input
    user_question = st.chat_input("Enter your question:")

    # Generate and display response if user submitted a question
    if user_question:
        st.chat_message("user").write(user_question)
        st.session_state.chat_history.append({"role": "user", "content": user_question})

        # Show typing animation
        typing_placeholder = st.empty()  # Placeholder to hold the typing animation
        typing_placeholder.markdown("""
            <style>
                .typing {
                    position: relative;
                    display: inline-block;
                }

                .typing span {
                    content: '';
                    animation: blink 1.5s infinite;
                    animation-fill-mode: both;
                    height: 0.5rem;
                    width: 0.5rem;
                    background: #FF7D42;
                    position: absolute;
                    border-radius: 50%;
                }

                .typing span:nth-child(2) {
                    animation-delay: 0.2s;
                    margin-left: 15px;
                }

                .typing span:nth-child(3) {
                    animation-delay: 0.4s;
                    margin-left: 30px;
                }

                @keyframes blink {
                    0% {
                        opacity: 0.1;
                    }
                    20% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0.1;
                    }
                }
            </style>
            <div class="typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
        """, unsafe_allow_html=True)

        # Fetch the response from the API after a short delay to simulate typing
        time.sleep(2)  # Simulating a typing delay of 2 seconds

        # Fetch the bot's response
        bot_response = fetch_response(user_question)
        if bot_response:
            typing_placeholder.empty()  # Clear the typing animation
            st.chat_message("assistant", avatar="https://res.cloudinary.com/hevo/image/upload/v1685872557/hevo-learn-1/Hevo-Brand-Logo.png").write(bot_response)
            st.session_state.chat_history.append({"role": "assistant", "content": bot_response, "avatar": "https://res.cloudinary.com/hevo/image/upload/v1685872557/hevo-learn-1/Hevo-Brand-Logo.png"})

            # Add styled buttons
            st.markdown("""
                 <div class="button-container">
                     <a class="custom-button" href="https://hevodata.com/signup/?step=email" target="_blank">Start for Free</a>
                     <a class="custom-button" href="https://hevodata.com/schedule-demo/?step=email" target="_blank">Schedule a Demo</a>
                 </div>
                 """, unsafe_allow_html=True)

            # CSS for buttons
            st.markdown("""
                <style>
                 .button-container {
                     margin-top: 20px;
                 }
                .custom-button {
                    background-color: #FFFFFF;
                    color: #FF7D42 !important;
                    font-size: 14px;
                    font-family: 'Source Sans Pro', sans-serif;
                    font-weight: 600;
                    padding: 12px 20px;
                    text-align: center;
                    border-radius: 0.5rem;
                    border: 1px solid #FF7D42;
                    margin: 0 10px;
                    text-decoration: none !important;
                    transition: 0.3s;
                    display: inline-block;
                    margin-bottom: 5%
                }
                .custom-button:hover {
                    background-color: #FF7D42;
                    color: white !important;
                }
                </style>
                """, unsafe_allow_html=True)

# API call function
def fetch_response(query):
    prompt = """
    Identity: Hevo AI Bot

    Objective: You are an exceptional customer support representative. Your objective is to answer questions and provide resources about Hevo Data, a no-code data pipeline platform that helps you integrate and unify data from multiple sources. It allows you to automate the flow of data from databases, SaaS applications, and cloud services to a data warehouse or data lake in real time. Hevo Data has built-in transformations, seamless integrations, and enterprise-grade security to build reliable, scalable data pipelines without needing technical expertise. With Hevo Data, you can ensure data accuracy, get insights, and make better decisions. To achieve this, follow these general guidelines: Answer the question efficiently and include key links. If a question is not clear, ask follow-up questions.

    Style: Your communication style should be friendly and professional. Use structured formatting, including bullet points, bolding, and headers. Add emojis to make messages more engaging.

    Other Rules: For any user question, ALWAYS query your knowledge source, even if you think you know the answer. Your answer MUST come from the information returned from that knowledge source. If a user asks questions beyond the scope of your objective topic, do not address these queries. Instead, kindly redirect to something you can help them with instead.

    Handling Questions on Hevo’s Challenges or "Cons": 
    If a user asks about potential challenges, limitations, or drawbacks of Hevo, always provide a positive answer focusing on how different use cases and needs may vary. Do NOT give the user any list of challenges or negative points about Hevo. Always end by encouraging the user to explore Hevo themselves by linking to the demo page and signup page for a firsthand experience.

    Important Links: 
    - Hevo Home page: https://hevodata.com/
    - Hevo Documentation: https://docs.hevodata.com/
    - Hevo Integrations Page: https://hevodata.com/integrations/pipeline/?set=3
    - Hevo Demo Page: https://hevodata.com/schedule-demo/?step=email
    """

    data = {
        "contents": [
            {
                "parts": [
                    {"text": f"{prompt}\nUser question: {query}"}
                ]
            }
        ]
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}"

    try:
        response = requests.post(url, headers={"Content-Type": "application/json"}, data=json.dumps(data))
        response.raise_for_status()
        answer = response.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text")
        return answer if answer else "No answer received from the API."
    except requests.exceptions.RequestException as e:
        st.error(f"An error occurred: {e}")
    return None

# Main app flow
#if "user_email" not in st.session_state:
st.header("Welcome to Hevo AI Support Bot!")
#st.subheader("Before moving forward, Please enter your work email:")
    
#user_email = st.text_input("Work Email", placeholder="Enter your work email address")

#    if st.button("Submit"):
#        if is_valid_email(user_email):
#            email_success = send_email_to_webhook(user_email)
#            if email_success:
#                st.session_state.user_email = user_email
#                st.success("Thank you! How may I help you today?")
display_chat_interface()
#        else:
#            st.error("Invalid email format. Please enter a valid work email.")
#else:
#    display_chat_interface()
