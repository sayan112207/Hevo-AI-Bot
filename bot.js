<script>
    // Injecting styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        #chatbot-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #0078FF;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 9999; /* Very high to stay above all elements */
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }

        #chatbot-container {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 400px;
            height: 600px;
            background: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            overflow: hidden;
            z-index: 9999;
            display: none;
            transition: all 0.3s ease; /* Smooth transitions */
        }

        #chatbot-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }

        #chatbot-close {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: transparent;
            color: #555;
            border: none;
            font-size: 18px;
            cursor: pointer;
            z-index: 10001; /* Higher than the container for focus */
        }

        #chatbot-close:hover {
            color: #f00;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
            #chatbot-container {
                width: 90%; /* Use 90% of the screen width */
                height: 70%; /* Adjust height for smaller screens */
                bottom: 10px;
                right: 5%;
            }
        }

        @media (max-width: 480px) {
            #chatbot-container {
                width: 90%; /* Full-width on very small screens */
                height: 85%; /* Adjust height further */
                bottom: 0;
                right: 0;
                border-radius: 0; /* Remove rounded corners for better fit */
            }

            #chatbot-toggle {
                width: 40px; /* Smaller toggle button */
                height: 40px;
                font-size: 20px;
                bottom: 10px;
                right: 10px;
            }
        }
    `;
    document.head.appendChild(style);

    // Adding chatbot container and toggle button
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.innerHTML = `
        <button id="chatbot-close">✖️</button>
        <iframe id="chatbot-iframe" src="https://hevo-ai-bot.streamlit.app/?embed=true&embed_options=light_theme"></iframe>
    `;
    document.body.appendChild(chatbotContainer);

    // Create the chatbot toggle button
    const chatbotToggle = document.createElement('button');
    chatbotToggle.id = 'chatbot-toggle'; 

     // Add an image to the button
    const chatbotIcon = document.createElement('img');
    chatbotIcon.src = 'https://res.cloudinary.com/hevo/image/upload/v1685872557/hevo-learn-1/Hevo-Brand-Logo.png';
    chatbotIcon.alt = 'Chatbot Icon'; // Alternative text for accessibility
    chatbotIcon.style.width = '55px'; // Set the width of the image
    chatbotIcon.style.height = '55px'; // Set the height of the image

    chatbotToggle.appendChild(chatbotIcon); // Add the image to the button

    // Append the button to the body
    document.body.appendChild(chatbotToggle);

    // Adding functionality for toggle and close buttons
    chatbotToggle.addEventListener('click', function () {
        const container = document.getElementById('chatbot-container');
        container.style.display = container.style.display === 'none' || container.style.display === '' ? 'block' : 'none';
    });

    document.getElementById('chatbot-close').addEventListener('click', function () {
        document.getElementById('chatbot-container').style.display = 'none';
    });
</script>
