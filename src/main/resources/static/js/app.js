const API_BASE = '/api';
let lastArticleId = null;
let isLoading = false;
let hasMore = true;
const PAGE_SIZE = 10;
const BOARD_ID = 1;

// DOM Elements
const galleryGrid = document.getElementById('gallery-grid');
const loadingTrigger = document.getElementById('loading-trigger');
const writeModal = document.getElementById('write-modal');
const detailModal = document.getElementById('detail-modal');
const loginModal = document.getElementById('login-modal');
const signupModal = document.getElementById('signup-modal');

// Buttons
const writeBtn = document.getElementById('write-btn');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');

// Auth State
const authButtons = document.getElementById('auth-buttons');
const userMenu = document.getElementById('user-menu');
const userNickname = document.getElementById('user-nickname');

let isLoggedIn = false;

// Init
document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
    checkLoginStatus();
    loadArticles();
    setupInfiniteScroll();
    setupEventListeners();
});

// Modal Helpers - Single source of truth
function openModal(modal) {
    if (modal) {
        console.log(`Opening modal: ${modal.id}`);
        modal.classList.remove('hidden');
        // Force layout info
        const displayStyle = window.getComputedStyle(modal).display;
        console.log(`Modal ${modal.id} display style after open: ${displayStyle}`);

        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

function closeModal(modal) {
    if (modal) {
        console.log(`Closing modal: ${modal.id}`);
        modal.classList.add('hidden');
    }
}

function closeAllModals() {
    [writeModal, detailModal, loginModal, signupModal].forEach(closeModal);
}

function checkLoginStatus() {
    const nickname = localStorage.getItem('nickname');
    if (nickname) {
        isLoggedIn = true;
        if (authButtons) authButtons.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
        if (userNickname) userNickname.textContent = `Hello, ${nickname} `;
    } else {
        isLoggedIn = false;
        if (authButtons) authButtons.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
}

function setupEventListeners() {
    if (writeBtn) writeBtn.addEventListener('click', () => openModal(writeModal));
    if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if (signupBtn) signupBtn.addEventListener('click', () => openModal(signupModal));

    document.addEventListener('click', (e) => {
        if (e.target.matches('.close-btn, .close-btn-detail, .close-btn-login, .close-btn-signup') || e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const writeForm = document.getElementById('write-form');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (writeForm) writeForm.addEventListener('submit', handlePostSubmit);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
}

// Auth Functions
async function handleSignup(e) {
    e.preventDefault();
    console.log('Handling signup...');
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const nickname = document.getElementById('signup-nickname').value;

    try {
        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, nickname })
        });

        if (response.ok) {
            console.log('Signup successful');
            closeModal(signupModal);
            openModal(loginModal);
        } else {
            console.error('Signup failed', response.status);
            alert('Signup failed.');
        }
    } catch (error) {
        console.error('Signup error', error);
        alert('Error signing up.');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    console.log('Handling login...');
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            console.log('Login successful');
            localStorage.setItem('nickname', email.split('@')[0]);
            checkLoginStatus();
            closeModal(loginModal);
        } else {
            console.error('Login failed', response.status);
            alert('Login failed. Check credentials.');
        }
    } catch (error) {
        console.error('Login error', error);
        alert('Error logging in.');
    }
}

async function handleLogout() {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
    localStorage.removeItem('nickname');
    checkLoginStatus();
    loadArticles();
}

// Infinite Scroll
function setupInfiniteScroll() {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
            loadArticles();
        }
    }, { threshold: 0.5 });

    if (loadingTrigger) observer.observe(loadingTrigger);
}

// Load Articles
async function loadArticles() {
    if (isLoading) return;
    isLoading = true;

    try {
        let url = `${API_BASE}/articles?boardId=${BOARD_ID}&pageSize=${PAGE_SIZE}`;
        if (lastArticleId) {
            url += `&lastArticleId=${lastArticleId}`;
        }

        const response = await fetch(url); // GET requests send cookies by default usually, but let's be safe if needed
        // For GET, standard fetch usually handles cookies fine on same-origin.

        if (!response.ok) {
            throw new Error(`Failed to load articles: ${response.status}`);
        }

        const articles = await response.json();

        if (articles.length < PAGE_SIZE) {
            hasMore = false;
            if (loadingTrigger) loadingTrigger.style.display = 'none';
        }

        if (articles.length > 0) {
            lastArticleId = articles[articles.length - 1].id;
            renderArticles(articles);
        }
    } catch (error) {
        console.error(error);
    } finally {
        isLoading = false;
    }
}

function renderArticles(articles) {
    articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${article.imageUrl}" alt="${article.title}" class="card-image" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
            <div class="card-content">
                <h3 class="card-title">${article.title}</h3>
                <div class="card-meta">By User ${article.writerId}</div>
            </div>
        `;
        card.addEventListener('click', () => openDetail(article.id));
        galleryGrid.appendChild(card);
    });
}

// Create Post
async function handlePostSubmit(e) {
    e.preventDefault();
    console.log('Handling post submit...');
    if (!isLoggedIn) {
        alert('Please login first.');
        return;
    }

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageUrl = document.getElementById('imageUrl').value;

    try {
        console.log('Sending post request...');
        const response = await fetch(`${API_BASE}/articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                content,
                imageUrl,
                boardId: BOARD_ID
            })
        });

        if (response.ok) {
            console.log('Post created successfully');
            closeModal(writeModal);
            // Reset and reload
            galleryGrid.innerHTML = '';
            lastArticleId = null;
            hasMore = true;
            if (loadingTrigger) loadingTrigger.style.display = 'block';
            loadArticles();
        } else {
            console.error('Post creation failed', response.status);
            alert('Failed to create post. Status: ' + response.status);
        }
    } catch (error) {
        console.error('Post creation error', error);
        alert('Failed to create post');
    }
}

// Article Detail & Comments
async function openDetail(articleId) {
    try {
        const response = await fetch(`${API_BASE}/articles/${articleId}`);
        const article = await response.json();

        const detailContent = document.getElementById('detail-content');
        detailContent.innerHTML = `
            <img src="${article.imageUrl}" style="width:100%; border-radius:8px; margin-bottom:20px;">
            <h2>${article.title}</h2>
            <p style="color:#ccc; margin-bottom:20px;">${article.content}</p>
        `;

        loadComments(articleId);

        const commentForm = document.getElementById('comment-form');
        commentForm.onsubmit = (e) => handleCommentSubmit(e, articleId);

        openModal(detailModal);
    } catch (error) {
        console.error(error);
    }
}

async function loadComments(articleId) {
    const list = document.getElementById('comments-list');
    list.innerHTML = 'Loading comments...';

    try {
        const response = await fetch(`${API_BASE}/comments?articleId=${articleId}`);
        const comments = await response.json();
        renderComments(comments, list, articleId);
    } catch (error) {
        list.innerHTML = 'Failed to load comments.';
    }
}

function renderComments(comments, container, articleId) {
    container.innerHTML = '';
    comments.forEach(comment => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.style.marginLeft = `${(comment.path.length / 5 - 1) * 20}px`;

        if (comment.deleted) {
            div.innerHTML = `<div class="comment-content" style="color:#666;">(Deleted Comment)</div>`;
        } else {
            div.innerHTML = `
                <div class="comment-header">User ${comment.writerId}</div>
                <div class="comment-content">${comment.content}</div>
                <button class="reply-btn" onclick="showReplyForm(${comment.id}, '${comment.path}', ${articleId})">Reply</button>
                <button class="delete-btn" onclick="deleteComment(${comment.id}, ${articleId})">Delete</button>
                <div id="reply-form-${comment.id}"></div>
            `;
        }
        container.appendChild(div);
    });
}

async function handleCommentSubmit(e, articleId) {
    e.preventDefault();
    if (!isLoggedIn) {
        alert('Please login first.');
        return;
    }
    const input = document.getElementById('comment-input');
    await postComment(articleId, input.value, null);
    input.value = '';
    loadComments(articleId);
}

window.showReplyForm = (commentId, path, articleId) => {
    if (!isLoggedIn) {
        alert('Please login first.');
        return;
    }
    const container = document.getElementById(`reply-form-${commentId}`);
    container.innerHTML = `
        <div class="reply-form">
            <input type="text" id="reply-input-${commentId}" placeholder="Write a reply...">
            <button class="btn-secondary" onclick="submitReply(${articleId}, ${commentId}, '${path}')">Submit</button>
        </div>
    `;
}

window.submitReply = async (articleId, commentId, parentPath) => {
    const input = document.getElementById(`reply-input-${commentId}`);
    await postComment(articleId, input.value, parentPath);
    loadComments(articleId);
}

async function postComment(articleId, content, parentPath) {
    await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content,
            articleId,
            parentPath
        })
    });
}

window.deleteComment = async (commentId, articleId) => {
    if (!confirm('Delete this comment?')) return;
    await fetch(`${API_BASE}/comments/${commentId}`, { method: 'DELETE' });
    loadComments(articleId);
}
