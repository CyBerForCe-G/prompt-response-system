# frontend.py

import streamlit as st
import requests
import pandas as pd

# Replace with your NestJS backend URL
backend_url = "http://localhost:3000/prompt-response"

def fetch_distinct_values(field):
    response = requests.get(f"{backend_url}/distinct/{field}")
    if response.status_code == 200:
        return response.json()
    else:
        return []

# Function to fetch OpenAI response
def get_openai_response(prompt):
    response = requests.post(
        f"{backend_url}/get-response",
        json={"prompt": prompt}
    )
    return response.json()['response']

# Function to update MongoDB with a new prompt
def update_mongodb(prompt, response):
    requests.post(
        f"{backend_url}/get-response",
        json={"prompt": prompt, "response": response}
    )

def fetch_filtered_data(user, modelMachine, startDate, endDate):
    # Call the NestJS backend API with the filter options
    response = requests.get(
        f"{backend_url}/get-response",
        params={'user': user, 'modelMachine': modelMachine,
                'startDate': startDate, 'endDate': endDate}
    )

    # Parse the JSON response into a list of dictionaries
    if response.status_code == 200:
        return response.json()
    else:
        return []
# Streamlit app
def main():
    st.title('OpenAI Prompt Generator')

    # Prompt input
    prompt = st.text_area('Enter your prompt here:', '')

    # Button to get OpenAI response
    if st.button('Get OpenAI Response'):
        # Call OpenAI API and update MongoDB
        openai_response = get_openai_response(prompt)
        st.write('OpenAI Response:', openai_response)
        update_mongodb(prompt, openai_response)

    # Filter accordion
    with st.expander('Filter Options', expanded=False):
        # Dropdown for User
        user_options = fetch_distinct_values('user')
        selected_user = st.selectbox('Select User', user_options, index=0)

        # Dropdown for Model Machine
        modelMachine_options = fetch_distinct_values('modelMachine')
        selected_modelMachine = st.selectbox('Select Model Machine', modelMachine_options, index=0)

        # Date inputs
        start_date = st.date_input('Start Date')
        end_date = st.date_input('End Date')

        # Button to trigger the filter
        if st.button('Filter'):
            # Call the NestJS backend API with the filter options
            filtered_data = fetch_filtered_data(selected_user, selected_modelMachine, start_date, end_date)
            
            # Display the filtered data in a table
            if filtered_data:
                st.write('Filtered Users:')
                st.write(pd.DataFrame(filtered_data))
            else:
                st.write('No data found with the specified filters.')

if __name__ == "__main__":
    main()
