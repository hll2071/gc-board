const API_BASE = '/api';
let lastArticleId = null;
let isLoading = false;
let hasMore = true;
const PAGE_SIZE = 10;
const BOARD_ID = 1; // Default board ID

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
const closeBtn = document.querySelector('.close-btn');
const closeBtnDetail = document.querySelector('.close-btn-detail');

// Forms
const writeForm = document.getElementById('write-form');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Auth State
const authButtons = document.getElementById('auth-buttons');
const userMenu = document.getElementById('user-menu');
const userNickname = document.getElementById('user-nickname');

let isLoggedIn = false;

// Init
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadArticles();
    setupInfiniteScroll();
    setupEventListeners();
});

function checkLoginStatus() {
    const nickname = localStorage.getItem('nickname');
    if (nickname) {
        isLoggedIn = true;
        authButtons.classList.add('hidden');
        userMenu.classList.remove('hidden');
        userNickname.textContent = `Hello, ${nickname} `;
    } else {
        isLoggedIn = false;
        authButtons.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
}

// Event Listeners
function setupEventListeners() {
    // Modals
    if (writeBtn) writeBtn.addEventListener('click', () => writeModal.classList.remove('hidden'));
    loginBtn.addEventListener('click', () => loginModal.classList.remove('hidden'));
    signupBtn.addEventListener('click', () => signupModal.classList.remove('hidden'));

    // Close Buttons
    document.querySelectorAll('.close-btn, .close-btn-detail, .close-btn-login, .close-btn-signup').forEach(btn => {
        btn.addEventListener('click', () => {
            writeModal.classList.add('hidden');
            detailModal.classList.add('hidden');
            loginModal.classList.add('hidden');
            signupModal.classList.add('hidden');
        });
    });

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Forms
    writeForm.addEventListener('submit', handlePostSubmit);
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
}

// Auth Functions
async function handleSignup(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const nickname = document.getElementById('signup-nickname').value;

    try {
        const response = await fetch(`${API_BASE} /auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, nickname })
        });

        if (response.ok) {
            alert('Signup successful! Please login.');
            signupModal.classList.add('hidden');
            loginModal.classList.remove('hidden');
        } else {
            alert('Signup failed.');
        }
    } catch (error) {
        console.error(error);
        alert('Error signing up.');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE} /auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            // In a real app, we would get user info from response. 
            // Here we just simulate by saving email as nickname for demo if not returned
            // But let's assume login is strictly session based.
            // We will store a flag.
            localStorage.setItem('nickname', email.split('@')[0]);
            checkLoginStatus();
            loginModal.classList.add('hidden');
        } else {
            alert('Login failed.');
        }
    } catch (error) {
        console.error(error);
        alert('Error logging in.');
    }
}

async function handleLogout() {
    await fetch(`${API_BASE} /auth/logout`, { method: 'POST' });
    localStorage.removeItem('nickname');
    checkLoginStatus();
    window.location.reload();
}

// Infinite Scroll
function setupInfiniteScroll() {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
            loadArticles();
        }
    }, { threshold: 0.5 });

    observer.observe(loadingTrigger);
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

        const response = await fetch(url);
        const articles = await response.json();

        if (articles.length < PAGE_SIZE) {
            hasMore = false;
            loadingTrigger.style.display = 'none';
        }

        if (articles.length > 0) {
            lastArticleId = articles[articles.length - 1].id;
            renderArticles(articles);
        }
    } catch (error) {
        console.error('Failed to load articles:', error);
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
    if (!isLoggedIn) {
        alert('Please login first.');
        return;
    }

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageUrl = document.getElementById('imageUrl').value;

    try {
        const response = await fetch(`${API_BASE}/articles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                content,
                imageUrl,
                boardId: BOARD_ID,
                // writerId is handled by session in backend
            })
        });

        if (response.ok) {
            writeModal.classList.add('hidden');
            writeForm.reset();
            // Reset and reload
            galleryGrid.innerHTML = '';
            lastArticleId = null;
            hasMore = true;
            loadingTrigger.style.display = 'block';
            loadArticles();
        } else {
            alert('Failed to create post. Are you logged in?');
        }
    } catch (error) {
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

        // Setup comment form
        const commentForm = document.getElementById('comment-form');
        commentForm.onsubmit = (e) => handleCommentSubmit(e, articleId);

        detailModal.classList.remove('hidden');
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
        div.style.marginLeft = `${(comment.path.length / 5 - 1) * 20}px`; // Indent based on depth

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
            // writerId handled by session
            parentPath
        })
    });
}

window.deleteComment = async (commentId, articleId) => {
    if (!confirm('Delete this comment?')) return;
    await fetch(`${API_BASE}/comments/${commentId}`, { method: 'DELETE' });
    loadComments(articleId);
}
