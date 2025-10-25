const toggleButton = document.getElementById('theme-toggle');
const STORAGE_KEY = 'site-theme';

if (toggleButton) {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    applyTheme(initialTheme);

    toggleButton.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem(STORAGE_KEY, nextTheme);
    });
}

function applyTheme(theme) {
    const enableDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', enableDark);
    toggleButton?.setAttribute('aria-pressed', enableDark.toString());
}

// Real-time Clock Functionality with Typing and Erasing Effect
let typingInterval;
let currentDisplayText = '';
let targetText = '';
let typingIndex = 0;
let isTyping = false;
let isErasing = false;

function getCurrentTimeString() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    // Convert to 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Hour '0' should be '12'
    const hoursString = hours.toString();
    
    return `${hoursString}:${minutes} ${ampm}?`;
}

function typeCharacter() {
    const clockElement = document.getElementById('current-time');
    if (!clockElement) return;

    if (!isErasing) {
        // Typing forward
        if (typingIndex < targetText.length) {
            currentDisplayText = targetText.substring(0, typingIndex + 1);
            clockElement.textContent = currentDisplayText;
            typingIndex++;
        } else {
            // Typing complete, wait then start erasing
            clearInterval(typingInterval);
            setTimeout(() => {
                isErasing = true;
                typingInterval = setInterval(typeCharacter, 100); // Faster erasing
            }, 2000); // Wait 2 seconds before erasing
        }
    } else {
        // Erasing backward
        if (currentDisplayText.length > 0) {
            currentDisplayText = currentDisplayText.substring(0, currentDisplayText.length - 1);
            clockElement.textContent = currentDisplayText;
        } else {
            // Erasing complete, start typing again
            clearInterval(typingInterval);
            isErasing = false;
            isTyping = false;
            typingIndex = 0;
            
            // Wait a moment then start typing again
            setTimeout(startTypingEffect, 500);
        }
    }
}

function startTypingEffect() {
    if (isTyping) return;
    
    const clockElement = document.getElementById('current-time');
    if (!clockElement) return;

    isTyping = true;
    isErasing = false;
    targetText = getCurrentTimeString();
    currentDisplayText = '';
    typingIndex = 0;
    
    // Clear current text
    clockElement.textContent = '';
    
    // Start typing character by character
    typingInterval = setInterval(typeCharacter, 150); // 150ms between characters when typing
}

function updateClock() {
    // Update target text every second, but only if not currently typing/erasing
    const newTargetText = getCurrentTimeString();
    if (!isTyping && !isErasing && newTargetText !== targetText) {
        targetText = newTargetText;
        startTypingEffect();
    }
}

// Initialize clock when page loads
document.addEventListener('DOMContentLoaded', function() {
    startTypingEffect(); // Start initial typing effect
    setInterval(updateClock, 1000); // Check for updates every second
    
    // Initialize search functionality
    initializeProjectSearch();
    initializeBooksSearch();
    
    // Initialize book loading state immediately
    initializeBookLoadingState();
    
    // Load book covers from API
    loadBookCovers();
    
    // Initialize form data persistence
    initializeFormPersistence();
    
    // Initialize enhanced form handling
    initializeFormHandling();
    
    // Initialize TBR (To Be Read) system
    initializeTBRSystem();
});

// Live Search Functionality for Projects
function initializeProjectSearch() {
    const searchInput = document.getElementById('project-search');
    const projectColumns = document.querySelectorAll('.project-column');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        projectColumns.forEach(project => {
            const title = project.querySelector('h3').textContent.toLowerCase();
            const description = project.querySelector('p').textContent.toLowerCase();
            const keywords = project.getAttribute('data-keywords') || '';
            
            // Combine all searchable text
            const searchableText = `${title} ${description} ${keywords}`.toLowerCase();
            
            // Check if search term matches
            const isMatch = searchableText.includes(searchTerm);
            
            // Show or hide project with animation
            if (isMatch || searchTerm === '') {
                project.classList.remove('hidden');
            } else {
                project.classList.add('hidden');
            }
        });
        
        // Check if no results found
        const visibleProjects = document.querySelectorAll('.project-column:not(.hidden)');
        const noResultsMessage = document.getElementById('no-results');
        
        if (visibleProjects.length === 0 && searchTerm !== '') {
            if (!noResultsMessage) {
                const message = document.createElement('div');
                message.id = 'no-results';
                message.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: #666; font-style: italic;">
                        No projects found matching "${searchTerm}"
                    </div>
                `;
                document.getElementById('projects-grid').appendChild(message);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    });
    
    // Clear search on Escape key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            this.dispatchEvent(new Event('input'));
            this.blur();
        }
    });
}

// Live Search Functionality for Books (similar to projects)
function initializeBooksSearch() {
    const searchInput = document.getElementById('book-search');
    const bookColumns = document.querySelectorAll('.book-column');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        bookColumns.forEach(book => {
            const title = book.querySelector('h3').textContent.toLowerCase();
            const author = book.querySelector('.author').textContent.toLowerCase();
            const description = book.querySelector('p:not(.author)').textContent.toLowerCase();
            const keywords = book.getAttribute('data-keywords') || '';
            
            // Combine all searchable text
            const searchableText = `${title} ${author} ${description} ${keywords}`.toLowerCase();
            
            // Check if search term matches
            const isMatch = searchableText.includes(searchTerm);
            
            // Show or hide book with animation
            if (isMatch || searchTerm === '') {
                book.classList.remove('hidden');
            } else {
                book.classList.add('hidden');
            }
        });
        
        // Check if no results found
        const visibleBooks = document.querySelectorAll('.book-column:not(.hidden)');
        const noResultsMessage = document.getElementById('no-books-results');
        
        if (visibleBooks.length === 0 && searchTerm !== '') {
            if (!noResultsMessage) {
                const message = document.createElement('div');
                message.id = 'no-books-results';
                message.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: #666; font-style: italic;">
                        No books found matching "${searchTerm}"
                    </div>
                `;
                document.getElementById('books-grid').appendChild(message);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    });
    
    // Clear search on Escape key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            this.dispatchEvent(new Event('input'));
            this.blur();
        }
    });
}

// Form Data Persistence with localStorage
function initializeFormPersistence() {
    const FORM_STORAGE_KEY = 'contact-form-data';
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageTextarea = document.getElementById('message');
    
    if (!form) return;
    
    // Load saved form data on page load
    function loadFormData() {
        try {
            const savedData = localStorage.getItem(FORM_STORAGE_KEY);
            if (savedData) {
                const formData = JSON.parse(savedData);
                
                if (nameInput && formData.name) {
                    nameInput.value = formData.name;
                }
                if (emailInput && formData.email) {
                    emailInput.value = formData.email;
                }
                if (messageTextarea && formData.message) {
                    messageTextarea.value = formData.message;
                }
            }
        } catch (error) {
            console.log('Error loading form data:', error);
        }
    }
    
    // Save form data to localStorage
    function saveFormData() {
        try {
            const formData = {
                name: nameInput?.value || '',
                email: emailInput?.value || '',
                message: messageTextarea?.value || ''
            };
            localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
        } catch (error) {
            console.log('Error saving form data:', error);
        }
    }
    
    // Clear form data from localStorage
    function clearFormData() {
        try {
            localStorage.removeItem(FORM_STORAGE_KEY);
        } catch (error) {
            console.log('Error clearing form data:', error);
        }
    }
    
    // Add event listeners to save data on input
    if (nameInput) {
        nameInput.addEventListener('input', saveFormData);
    }
    if (emailInput) {
        emailInput.addEventListener('input', saveFormData);
    }
    if (messageTextarea) {
        messageTextarea.addEventListener('input', saveFormData);
    }
    
    // Clear saved data when form is successfully submitted
    form.addEventListener('submit', function(e) {
        // Note: This will only clear if the form submission is successful
        // In a real application, you'd clear after confirming successful submission
        setTimeout(() => {
            clearFormData();
        }, 100);
    });
    
    // Load saved data when page loads
    loadFormData();
    
    // Optional: Clear form data when user specifically wants to reset
    // You can add a reset button if needed
    const resetButton = document.getElementById('reset-form');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            clearFormData();
            form.reset();
        });
    }
}

// Initialize book loading state immediately when page loads
function initializeBookLoadingState() {
    const bookColumns = document.querySelectorAll('.book-column');
    
    bookColumns.forEach(bookColumn => {
        const img = bookColumn.querySelector('.book-cover');
        const titleElement = bookColumn.querySelector('h3');
        const authorElement = bookColumn.querySelector('.author');
        const descriptionElement = bookColumn.querySelector('p:not(.author)');
        
        if (img) {
            // Set transparent placeholder immediately
            img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='250'%3E%3C/svg%3E";
            img.alt = "";
            img.classList.add('loading');
        }
        
        // Add skeleton loading to text elements immediately
        if (titleElement) titleElement.classList.add('skeleton', 'title');
        if (authorElement) authorElement.classList.add('skeleton', 'author');
        if (descriptionElement) descriptionElement.classList.add('skeleton', 'description');
    });
}

// Book Cover API Integration
async function loadBookCovers() {
    const bookColumns = document.querySelectorAll('.book-column');
    
    for (const bookColumn of bookColumns) {
        const img = bookColumn.querySelector('.book-cover');
        const title = bookColumn.getAttribute('data-title') || bookColumn.querySelector('h3').textContent;
        const authorElement = bookColumn.querySelector('.author');
        const author = bookColumn.getAttribute('data-author') || 
                      (authorElement ? authorElement.textContent.replace('by ', '') : '');
        const isbn = bookColumn.getAttribute('data-isbn');
        
        // Add skeleton loading to text elements
        const titleElement = bookColumn.querySelector('h3');
        const descriptionElement = bookColumn.querySelector('p:not(.author)');
        
        if (img) {
            // Immediately set up skeleton loading state
            img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='250'%3E%3C/svg%3E";
            img.alt = "";
            img.classList.add('loading');
            
            // Add skeleton loading to text elements while image loads
            if (titleElement) titleElement.classList.add('skeleton', 'title');
            if (authorElement) authorElement.classList.add('skeleton', 'author');
            if (descriptionElement) descriptionElement.classList.add('skeleton', 'description');
            
            try {
                let coverUrl = null;
                
                // Try multiple strategies to find the book cover
                if (isbn) {
                    coverUrl = await fetchBookCoverByISBN(isbn);
                }
                
                if (!coverUrl && title && author) {
                    coverUrl = await fetchBookCoverByTitleAuthor(title, author);
                }
                
                // Additional fallback for specific books
                if (!coverUrl) {
                    coverUrl = await fetchBookCoverWithAlternativeSearch(title, author);
                }
                
                // If we found a cover, update the image
                if (coverUrl) {
                    // Ensure HTTPS for security
                    if (coverUrl.startsWith('http:')) {
                        coverUrl = coverUrl.replace('http:', 'https:');
                    }
                    
                    img.src = coverUrl;
                    img.alt = title;
                    img.onload = () => {
                        img.classList.remove('loading');
                        // Remove skeleton loading from text elements
                        if (titleElement) titleElement.classList.remove('skeleton', 'title');
                        if (authorElement) authorElement.classList.remove('skeleton', 'author');
                        if (descriptionElement) descriptionElement.classList.remove('skeleton', 'description');
                        console.log(`Loaded cover for: ${title}`);
                    };
                    img.onerror = () => {
                        img.classList.remove('loading');
                        img.classList.add('error');
                        img.alt = `Cover not available for ${title}`;
                        // Remove skeleton loading from text elements
                        if (titleElement) titleElement.classList.remove('skeleton', 'title');
                        if (authorElement) authorElement.classList.remove('skeleton', 'author');
                        if (descriptionElement) descriptionElement.classList.remove('skeleton', 'description');
                        console.log(`Failed to load cover image for: ${title}`);
                    };
                } else {
                    img.classList.remove('loading');
                    img.classList.add('error');
                    img.alt = `Cover not found for ${title}`;
                    // Remove skeleton loading from text elements
                    if (titleElement) titleElement.classList.remove('skeleton', 'title');
                    if (authorElement) authorElement.classList.remove('skeleton', 'author');
                    if (descriptionElement) descriptionElement.classList.remove('skeleton', 'description');
                    console.log(`No cover found for: ${title} by ${author}`);
                }
                
            } catch (error) {
                img.classList.remove('loading');
                img.classList.add('error');
                img.alt = `Error loading ${title}`;
                // Remove skeleton loading from text elements
                if (titleElement) titleElement.classList.remove('skeleton', 'title');
                if (authorElement) authorElement.classList.remove('skeleton', 'author');
                if (descriptionElement) descriptionElement.classList.remove('skeleton', 'description');
                console.log(`Error loading cover for ${title}:`, error);
            }
            
            // Small delay between requests to be respectful to the API
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }
}

// Fetch high-quality book cover by ISBN using multiple APIs
async function fetchBookCoverByISBN(isbn) {
    try {
        const cleanISBN = isbn.replace(/[^0-9X]/g, '');
        
        // Try Open Library first for high-quality covers
        let imageUrl = await tryOpenLibraryByISBN(cleanISBN);
        if (imageUrl) return imageUrl;
        
        // Try Google Books API with quality prioritization
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanISBN}`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const book = data.items[0];
            const imageLinks = book.volumeInfo?.imageLinks;
            
            if (imageLinks) {
                // Prioritize highest quality images and modify URLs for better resolution
                let url = imageLinks.extraLarge || 
                         imageLinks.large || 
                         imageLinks.medium || 
                         imageLinks.small || 
                         imageLinks.thumbnail || 
                         imageLinks.smallThumbnail;
                
                if (url) {
                    // Upgrade Google Books image quality
                    url = upgradeGoogleBooksImageQuality(url);
                    return url;
                }
            }
        }
        return null;
    } catch (error) {
        console.log(`Error fetching by ISBN ${isbn}:`, error);
        return null;
    }
}

// Fetch high-quality book cover by title and author using multiple APIs
async function fetchBookCoverByTitleAuthor(title, author) {
    try {
        // Try Open Library first
        let imageUrl = await tryOpenLibraryByTitle(title, author);
        if (imageUrl) return imageUrl;
        
        // Clean and encode the search terms
        const cleanTitle = title.replace(/[^\w\s]/g, '').trim();
        const cleanAuthor = author.replace(/[^\w\s]/g, '').trim();
        const query = encodeURIComponent(`intitle:${cleanTitle} inauthor:${cleanAuthor}`);
        
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=15`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            // Find the best match with highest quality image
            for (const item of data.items) {
                const bookTitle = item.volumeInfo?.title?.toLowerCase() || '';
                const bookAuthors = item.volumeInfo?.authors?.join(' ').toLowerCase() || '';
                const imageLinks = item.volumeInfo?.imageLinks;
                
                // Check for title match
                if (bookTitle.includes(cleanTitle.toLowerCase()) || 
                    cleanTitle.toLowerCase().includes(bookTitle)) {
                    
                    if (imageLinks) {
                        let url = imageLinks.extraLarge || 
                                 imageLinks.large || 
                                 imageLinks.medium || 
                                 imageLinks.small || 
                                 imageLinks.thumbnail || 
                                 imageLinks.smallThumbnail;
                        
                        if (url) {
                            return upgradeGoogleBooksImageQuality(url);
                        }
                    }
                }
            }
            
            // If no exact match, use the first result with the highest quality image
            for (const item of data.items) {
                const imageLinks = item.volumeInfo?.imageLinks;
                if (imageLinks) {
                    let url = imageLinks.extraLarge || 
                             imageLinks.large || 
                             imageLinks.medium || 
                             imageLinks.small || 
                             imageLinks.thumbnail || 
                             imageLinks.smallThumbnail;
                    
                    if (url) {
                        return upgradeGoogleBooksImageQuality(url);
                    }
                }
            }
        }
        return null;
    } catch (error) {
        console.log(`Error fetching by title/author ${title} ${author}:`, error);
        return null;
    }
}

// High-quality alternative search strategy for difficult-to-find books
async function fetchBookCoverWithAlternativeSearch(title, author) {
    try {
        // Try multiple high-quality sources
        const searches = [
            `${title} ${author}`,
            `${title}`,
            `${author} ${title.split(' ')[0]}`, // First word of title + author
        ];
        
        for (const searchTerm of searches) {
            // Try Open Library search
            let imageUrl = await tryOpenLibrarySearch(searchTerm);
            if (imageUrl) return imageUrl;
            
            // Try Google Books with enhanced quality
            const query = encodeURIComponent(searchTerm);
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`);
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                for (const item of data.items) {
                    const imageLinks = item.volumeInfo?.imageLinks;
                    if (imageLinks) {
                        let url = imageLinks.extraLarge || 
                                 imageLinks.large || 
                                 imageLinks.medium || 
                                 imageLinks.small || 
                                 imageLinks.thumbnail || 
                                 imageLinks.smallThumbnail;
                        
                        if (url) {
                            return upgradeGoogleBooksImageQuality(url);
                        }
                    }
                }
            }
            
            // Small delay between search attempts
            await new Promise(resolve => setTimeout(resolve, 150));
        }
        
        return null;
    } catch (error) {
        console.log(`Error in alternative search for ${title}:`, error);
        return null;
    }
}

// ============ HIGH-QUALITY IMAGE ENHANCEMENT FUNCTIONS ============

// Upgrade Google Books image URLs to highest quality
function upgradeGoogleBooksImageQuality(url) {
    if (!url) return url;
    
    // Remove zoom parameters and set to maximum resolution
    let enhancedUrl = url.replace(/&zoom=\d+/g, '');
    enhancedUrl = enhancedUrl.replace(/&img=\d+/g, '');
    
    // Add high-quality parameters
    if (enhancedUrl.includes('books.google.com')) {
        // Request maximum size and quality
        if (!enhancedUrl.includes('zoom=')) {
            enhancedUrl += '&zoom=1';
        }
        // Remove small image constraints
        enhancedUrl = enhancedUrl.replace(/&w=\d+/g, '');
        enhancedUrl = enhancedUrl.replace(/&h=\d+/g, '');
        enhancedUrl = enhancedUrl.replace(/=s\d+/g, '=s1000'); // Max size
    }
    
    return enhancedUrl;
}

// Try Open Library API for high-quality covers by ISBN
async function tryOpenLibraryByISBN(isbn) {
    try {
        // Open Library provides high-quality covers
        const sizes = ['L', 'M', 'S']; // Large, Medium, Small
        
        for (const size of sizes) {
            const url = `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
            
            // Test if the image exists and loads
            if (await testImageExists(url)) {
                return url;
            }
        }
        return null;
    } catch (error) {
        console.log(`Error with Open Library ISBN ${isbn}:`, error);
        return null;
    }
}

// Try Open Library API for high-quality covers by title/author
async function tryOpenLibraryByTitle(title, author) {
    try {
        // Search Open Library for the book
        const query = encodeURIComponent(`${title} ${author}`);
        const response = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=5`);
        const data = await response.json();
        
        if (data.docs && data.docs.length > 0) {
            for (const book of data.docs) {
                if (book.cover_i) {
                    // Try different sizes, starting with largest
                    const sizes = ['L', 'M', 'S'];
                    for (const size of sizes) {
                        const url = `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`;
                        if (await testImageExists(url)) {
                            return url;
                        }
                    }
                }
            }
        }
        return null;
    } catch (error) {
        console.log(`Error with Open Library title search for ${title}:`, error);
        return null;
    }
}

// General Open Library search
async function tryOpenLibrarySearch(searchTerm) {
    try {
        const query = encodeURIComponent(searchTerm);
        const response = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=3`);
        const data = await response.json();
        
        if (data.docs && data.docs.length > 0) {
            for (const book of data.docs) {
                if (book.cover_i) {
                    const url = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
                    if (await testImageExists(url)) {
                        return url;
                    }
                }
            }
        }
        return null;
    } catch (error) {
        console.log(`Error with Open Library search for ${searchTerm}:`, error);
        return null;
    }
}

// Test if an image URL exists and loads successfully
async function testImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        
        // Timeout after 3 seconds
        setTimeout(() => resolve(false), 3000);
    });
}

// ============ TBR (TO BE READ) FUNCTIONALITY ============

// TBR localStorage management
const TBR_STORAGE_KEY = 'tbr-books';

// Get TBR list from localStorage
function getTBRList() {
    const stored = localStorage.getItem(TBR_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Save TBR list to localStorage
function saveTBRList(tbrList) {
    localStorage.setItem(TBR_STORAGE_KEY, JSON.stringify(tbrList));
}

// Add book to TBR list
function addToTBR(bookId) {
    const tbrList = getTBRList();
    if (!tbrList.includes(bookId)) {
        tbrList.push(bookId);
        saveTBRList(tbrList);
    }
}

// Remove book from TBR list
function removeFromTBR(bookId) {
    const tbrList = getTBRList();
    const index = tbrList.indexOf(bookId);
    if (index > -1) {
        tbrList.splice(index, 1);
        saveTBRList(tbrList);
    }
}

// Check if book is in TBR list
function isInTBR(bookId) {
    return getTBRList().includes(bookId);
}

// Update button appearance based on TBR status
function updateTBRButton(button, bookId) {
    const isAdded = isInTBR(bookId);
    const textSpan = button.querySelector('.tbr-text');
    const iconSpan = button.querySelector('.tbr-icon');
    
    if (isAdded) {
        button.classList.add('added');
        textSpan.textContent = 'Added to TBR';
        iconSpan.style.display = 'inline';
    } else {
        button.classList.remove('added');
        textSpan.textContent = 'Add to TBR';
        iconSpan.style.display = 'none';
    }
}

// Initialize TBR functionality
function initializeTBRSystem() {
    const tbrButtons = document.querySelectorAll('.tbr-btn');
    
    tbrButtons.forEach(button => {
        const bookId = button.dataset.bookId;
        
        // Set initial state
        updateTBRButton(button, bookId);
        
        // Add click event listener
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isCurrentlyInTBR = isInTBR(bookId);
            
            if (isCurrentlyInTBR) {
                removeFromTBR(bookId);
                console.log(`Removed "${bookId}" from TBR list`);
                updateTBRButtonWithNotification(button, bookId, false);
            } else {
                addToTBR(bookId);
                console.log(`Added "${bookId}" to TBR list`);
                updateTBRButtonWithNotification(button, bookId, true);
            }
            
            // Add click animation
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
        });
        
        // Add hover effects
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Log current TBR list for debugging
    console.log('Current TBR list:', getTBRList());
}

// ============ TOAST NOTIFICATION SYSTEM ============

let toastCounter = 0;

// Show toast notification
function showToast(type, title, message, duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toastId = `toast-${++toastCounter}`;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.id = toastId;
    
    // Choose icon based on type
    let icon = '';
    switch (type) {
        case 'success':
            icon = '✓';
            break;
        case 'error':
            icon = '✕';
            break;
        case 'info':
            icon = 'ℹ';
            break;
        default:
            icon = '•';
    }
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="hideToast('${toastId}')" aria-label="Close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto-hide after duration
    setTimeout(() => {
        hideToast(toastId);
    }, duration);
}

// Hide specific toast
function hideToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

// ============ ENHANCED FORM HANDLING ============

// Initialize enhanced form handling
function initializeFormHandling() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-contact');
    
    if (!form || !statusDiv || !submitButton) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const message = formData.get('message')?.trim();
        
        // Validate form
        const validation = validateForm(name, email, message);
        if (!validation.isValid) {
            showFormStatus('error', validation.message);
            showToast('error', 'Validation Error', validation.message);
            return;
        }
        
        // Show loading state
        showFormStatus('loading', 'Sending your message...');
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        try {
            // Simulate API call (replace with actual endpoint)
            await simulateFormSubmission(name, email, message);
            
            // Success
            showFormStatus('success', 'Thank you! Your message has been sent successfully.');
            showToast('success', 'Message Sent!', 'Thank you for contacting me. I\'ll get back to you soon.');
            
            // Clear form
            form.reset();
            
            // Clear localStorage
            localStorage.removeItem('contact-form-data');
            
        } catch (error) {
            // Error
            const errorMessage = error.message || 'Failed to send message. Please try again later.';
            showFormStatus('error', errorMessage);
            showToast('error', 'Send Failed', errorMessage);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    });
}

// Validate form data
function validateForm(name, email, message) {
    if (!name) {
        return { isValid: false, message: 'Please enter your name.' };
    }
    
    if (!email) {
        return { isValid: false, message: 'Please enter your email address.' };
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, message: 'Please enter a valid email address.' };
    }
    
    if (!message) {
        return { isValid: false, message: 'Please enter your message.' };
    }
    
    if (message.length < 10) {
        return { isValid: false, message: 'Message must be at least 10 characters long.' };
    }
    
    return { isValid: true };
}

// Show form status message
function showFormStatus(type, message) {
    const statusDiv = document.getElementById('form-status');
    if (!statusDiv) return;
    
    statusDiv.className = `form-status ${type}`;
    statusDiv.textContent = message;
    statusDiv.classList.add('show');
    
    // Auto-hide after 5 seconds for non-error messages
    if (type !== 'error') {
        setTimeout(() => {
            statusDiv.classList.remove('show');
        }, 5000);
    }
}

// Simulate form submission (replace with actual API call)
async function simulateFormSubmission(name, email, message) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Randomly succeed or fail for demo purposes
            // In real implementation, this would be an actual API call
            const success = Math.random() > 0.1; // 90% success rate
            
            if (success) {
                resolve();
            } else {
                reject(new Error('Network error. Please check your connection and try again.'));
            }
        }, 2000); // 2 second delay to simulate network request
    });
}

// ============ ENHANCED TBR NOTIFICATIONS ============

// Enhanced TBR button update with notifications
function updateTBRButtonWithNotification(button, bookId, wasAdded) {
    updateTBRButton(button, bookId);
    
    if (wasAdded) {
        const bookTitle = button.closest('.book-column').querySelector('h3').textContent;
        showToast('success', 'Added to TBR!', `"${bookTitle}" has been added to your reading list.`);
    } else {
        const bookTitle = button.closest('.book-column').querySelector('h3').textContent;
        showToast('info', 'Removed from TBR', `"${bookTitle}" has been removed from your reading list.`);
    }
}
