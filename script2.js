
        document.addEventListener('DOMContentLoaded', function() {
            // Elements
            const loadingEl = document.getElementById('loading');
            const errorEl = document.getElementById('error');
            const errorMessageEl = document.getElementById('error-message');
            const jokeDisplayEl = document.getElementById('joke-display');
            const categoryBadgeEl = document.getElementById('category-badge');
            const jokeSetupEl = document.getElementById('joke-setup');
            const jokeDividerEl = document.getElementById('joke-divider');
            const jokeDeliveryEl = document.getElementById('joke-delivery');
            const newJokeBtn = document.getElementById('new-joke-btn');
            const tryAgainBtn = document.getElementById('try-again');
            const likeBtn = document.getElementById('like-btn');
            const likeCountEl = document.getElementById('like-count');
            const bookmarkBtn = document.getElementById('bookmark-btn');
            const speakBtn = document.getElementById('speak-btn');
            const shareBtn = document.getElementById('share-btn');
            
            // State
            let currentJoke = null;
            let likes = 0;
            let bookmarked = false;
            let xhr = null;
            
            // Category to emoji mapping
            const categoryEmojis = {
                'Programming': '💻',
                'Miscellaneous': '🎭',
                'Pun': '🎯',
                'Spooky': '👻',
                'Christmas': '🎄',
                'Dark': '🌑'
            };
            
            // Fetch a joke
            function fetchJoke() {
                showLoading();
                
                // Cancel any existing request
                if (xhr) {
                    xhr.abort();
                }
                
                // Create new XMLHttpRequest (pure AJAX as required)
                xhr = new XMLHttpRequest();
                xhr.open('GET', 'https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun?safe-mode');
                
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            currentJoke = response;
                            displayJoke(currentJoke);
                            resetInteractions();
                        } catch (e) {
                            showError('Failed to parse joke data');
                        }
                    } else {
                        showError('Failed to fetch joke');
                    }
                };
                
                xhr.onerror = function() {
                    showError('Network error occurred');
                };
                
                xhr.send();
            }
            
            // Display joke
            function displayJoke(joke) {
                // Hide loading and error
                loadingEl.classList.add('hidden');
                errorEl.classList.add('hidden');
                
                // Show joke display
                jokeDisplayEl.classList.remove('hidden');
                
                // Set category badge
                if (joke.category) {
                    const emoji = categoryEmojis[joke.category] || '🎭';
                    categoryBadgeEl.textContent = `${emoji} ${joke.category}`;
                }
                
                // Display joke based on type
                if (joke.type === 'single') {
                    jokeSetupEl.textContent = joke.joke;
                    jokeDividerEl.classList.add('hidden');
                    jokeDeliveryEl.classList.add('hidden');
                } else {
                    jokeSetupEl.textContent = joke.setup;
                    jokeDividerEl.classList.remove('hidden');
                    jokeDeliveryEl.classList.remove('hidden');
                    jokeDeliveryEl.textContent = joke.delivery;
                }
                
                // Add fade-in animation
                jokeDisplayEl.classList.add('fade-in');
                setTimeout(() => {
                    jokeDisplayEl.classList.remove('fade-in');
                }, 500);
            }
            
            // Show loading state
            function showLoading() {
                loadingEl.classList.remove('hidden');
                errorEl.classList.add('hidden');
                jokeDisplayEl.classList.add('hidden');
            }
            
            // Show error state
            function showError(message) {
                loadingEl.classList.add('hidden');
                errorEl.classList.remove('hidden');
                jokeDisplayEl.classList.add('hidden');
                errorMessageEl.textContent = message;
            }
            
            // Reset interactions
            function resetInteractions() {
                likes = 0;
                bookmarked = false;
                likeCountEl.classList.add('hidden');
                likeCountEl.textContent = '0';
                likeBtn.classList.remove('filled-like');
                bookmarkBtn.classList.remove('filled-bookmark');
            }
            
            // Handle like button
            function handleLike() {
                likes++;
                likeCountEl.textContent = likes;
                likeCountEl.classList.remove('hidden');
                likeBtn.classList.add('filled-like');
            }
            
            // Handle bookmark button
            function handleBookmark() {
                bookmarked = !bookmarked;
                if (bookmarked) {
                    bookmarkBtn.classList.add('filled-bookmark');
                } else {
                    bookmarkBtn.classList.remove('filled-bookmark');
                }
            }
            
            // Speak joke
            function speakJoke() {
                if (!currentJoke) return;
                
                const text = currentJoke.type === 'single' 
                    ? currentJoke.joke 
                    : `${currentJoke.setup}... ${currentJoke.delivery}`;
                    
                const utterance = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(utterance);
            }
            
            // Share joke (copy to clipboard)
            function shareJoke() {
                if (!currentJoke) return;
                
                const text = currentJoke.type === 'single' 
                    ? currentJoke.joke 
                    : `${currentJoke.setup}... ${currentJoke.delivery}`;
                    
                // Create a temporary input element to copy text
                const tempInput = document.createElement('input');
                tempInput.value = text;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                // Show a temporary message
                alert('Joke copied to clipboard!');
            }
            
            // Event listeners
            newJokeBtn.addEventListener('click', fetchJoke);
            tryAgainBtn.addEventListener('click', fetchJoke);
            likeBtn.addEventListener('click', handleLike);
            bookmarkBtn.addEventListener('click', handleBookmark);
            speakBtn.addEventListener('click', speakJoke);
            shareBtn.addEventListener('click', shareJoke);
            
            // Initial joke fetch
            fetchJoke();
        });
