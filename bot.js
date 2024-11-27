<script>
        // Injecting styles dynamically
        const style = document.createElement('style');
        style.textContent = `
            /* Chatbot Toggle Button */
            #chatbot-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #0078FF;
                color: white;
                border: none;
                border-radius: 50%;
                width: 55px;
                height: 55px;
                cursor: pointer;
                box-shadow: 0px 12px 42px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                z-index: 9999;
                outline: none;
            }
    
            #chatbot-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0px 14px 46px rgba(0, 0, 0, 0.4);
            }
    
            #chatbot-toggle img {
                width: 32px;
                height: 32px;
            }
    
            /* Notification Dot */
            #chatbot-toggle .notification-dot {
                position: absolute;
                top: 0;
                right: 0;
                width: 12px;
                height: 12px;
                background-color: red;
                border-radius: 50%;
                display: none; /* Hidden initially */
            }
    
            /* Chatbot Message Popup */
            #chatbot-message {
                position: fixed;
                bottom: 30px;
                right: 85px;
                background-color: #FFFFFF;
                color: black;
                padding: 10px 15px;
                border-radius: 8px;
                display: none; /* Hidden initially */
                z-index: 9998;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
    
            #chatbot-message.show {
                display: block;
            }
    
            /* Chatbot Container */
            #chatbot-container {
                position: fixed;
                bottom: 80px;
                right: 20px;
                width: 400px;
                height: 600px;
                background: white;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                border-radius: 12px;
                overflow: hidden;
                z-index: 9999;
                display: none;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
            }
    
            #chatbot-container.show {
                display: block;
                opacity: 1;
                transform: translateY(0);
            }
    
            #chatbot-iframe {
                width: 100%;
                height: 100%;
                border: none;
            }
    
            /* Chatbot Close Button */
            #chatbot-close {
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: transparent;
                border: none;
                cursor: pointer;
                width: 24px;
                height: 24px;
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                transition: transform 0.2s ease;
                outline: none;
            }
    
            #chatbot-close img {
                width: 100%;
                height: 100%;
            }
    
            #chatbot-close:hover {
                transform: scale(1.2);
            }
    
            /* Responsive Styles */
            @media (max-width: 768px) {
                #chatbot-container {
                    display: none; /* Hide chatbot for tablets */
                }
                #chatbot-toggle {
                    display: none; /* Hide the icon for smaller screens */
                }
                #chatbot-message {
                    display: none; /* Hide the message for smaller screens */
                }
            }
    
            @media (max-width: 480px) {
                #chatbot-container {
                    display: none; /* Hide chatbot for phones */
                }
                #chatbot-toggle {
                    display: none; /* Hide the icon for smaller screens */
                }
                #chatbot-message {
                    display: none; /* Hide the message for phones */
                }
            }
        `;
        document.head.appendChild(style);
    
        // Function to create the chatbot
        const createChatbot = () => {
            // Chatbot container
            const chatbotContainer = document.createElement('div');
            chatbotContainer.id = 'chatbot-container';
            chatbotContainer.innerHTML = `
                <button id="chatbot-close">
                    <img src="https://res.cloudinary.com/hevo/image/upload/v1732688360/close_uldhpd.svg" alt="Close" />
                </button>
                <iframe id="chatbot-iframe" src="https://hevo-ai-bot.streamlit.app/?embed=true&embed_options=light_theme"></iframe>
            `;
            document.body.appendChild(chatbotContainer);

            // Chatbot toggle button
            const chatbotToggle = document.createElement('button');
            chatbotToggle.id = 'chatbot-toggle';

            // Toggle button icon
            const chatbotIcon = document.createElement('img');
            chatbotIcon.src = 'https://res.cloudinary.com/hevo/image/upload/v1732686674/chat-icon_vyff6v.svg';
            chatbotIcon.alt = 'Chatbot';
            chatbotToggle.appendChild(chatbotIcon);

            // Notification Dot
            const notificationDot = document.createElement('div');
            notificationDot.className = 'notification-dot';
            chatbotToggle.appendChild(notificationDot);

            // Create the chatbot message (but conditionally display it)
            const chatbotMessage = document.createElement('div');
            chatbotMessage.id = 'chatbot-message';
            chatbotMessage.textContent = 'Hi! How can I help you today?';
            document.body.appendChild(chatbotMessage);

            // Append toggle button
            document.body.appendChild(chatbotToggle);

            // Initialize message display logic
            let messageTimeout;
            const showMessage = () => {
                if (window.innerWidth > 1024) {
                    // Show the message only on larger screens
                    chatbotMessage.classList.add('show');
                    notificationDot.style.display = 'block';

                    // Automatically hide message after 10 seconds
                    messageTimeout = setTimeout(() => {
                        chatbotMessage.classList.remove('show');
                    }, 10000); // Display for 10 seconds
                } else {
                    // Immediately hide the message on smaller screens
                    chatbotMessage.classList.remove('show');
                    notificationDot.style.display = 'none';
                    clearTimeout(messageTimeout);
                }
            };

            // Event listeners
            chatbotToggle.addEventListener('click', toggleChatbot);
            document.getElementById('chatbot-close')?.addEventListener('click', closeChatbot);

            // Show the message initially (for larger screens)
            showMessage();

            // Handle window resize to hide the message dynamically
            window.addEventListener('resize', showMessage);
        };

        const toggleChatbot = () => {
            const container = document.getElementById('chatbot-container');
            const notificationDot = document.querySelector('#chatbot-toggle .notification-dot');
            const chatbotMessage = document.getElementById('chatbot-message');

            // Toggle the chatbot container visibility
            container.classList.toggle('show');

            // Hide the notification dot and message when the chatbot is opened
            if (notificationDot) {
                notificationDot.style.display = 'none'; // Hide notification dot
            }
            if (chatbotMessage) {
                chatbotMessage.classList.remove('show'); // Hide notification message
            }
        };

        const closeChatbot = () => {
            const container = document.getElementById('chatbot-container');
            container.classList.remove('show');
        };

        // Initialize chatbot
        createChatbot();
    </script>
