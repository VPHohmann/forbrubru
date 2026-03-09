// ===== CONFIGURAÇÃO DA API =====
// 👇 COLE A SUA URL DENTRO DAS ASPAS ABAIXO
const API_URL = 'https://script.google.com/macros/s/AKfycbzB7DC5uaL74_uelben1wwswa915fRzWntXeE43_dH_ZD_v7k0FVhVA-jem933m_Ic/exec';

// ===== VERIFICAÇÃO DE LOGIN =====
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('cofre-logado');
    if (isLoggedIn === 'true') {
        document.getElementById('passwordScreen').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        loadMemories();
    }
});

// ===== SISTEMA DE MEMÓRIAS =====
let memories = [];
let editingId = null;

// Carregar memórias da API
async function loadMemories() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        memories = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Erro ao carregar memórias:', error);
        memories = [];
    }
    displayHistoriaTimeline();
}

// Mostrar timeline principal
function displayHistoriaTimeline() {
    const timeline = document.getElementById('historiaTimeline');
    timeline.innerHTML = '';

    if (memories.length === 0) {
        timeline.innerHTML = `
            <div style="text-align: center; color: var(--muted-text); padding: 40px;">
                <i class="fas fa-heart" style="font-size: 48px; color: var(--blue-purple); margin-bottom: 20px;"></i>
                <p>Nenhuma memória adicionada ainda...</p>
                <p>Clique no botão abaixo para começar! 💕</p>
            </div>
        `;
        return;
    }

    const sortedMemories = [...memories].sort((a, b) => {
        const dateA = a.date.split('/').reverse().join('-');
        const dateB = b.date.split('/').reverse().join('-');
        return new Date(dateA) - new Date(dateB);
    });

    sortedMemories.forEach((memory, index) => {
        const position = index % 2 === 0 ? 'left' : 'right';
        const authorClass = memory.author === 'Bruna' ? 'bruna' : 'vanessa';
        const authorName = memory.author === 'Bruna' ? 'Bruna 💚' : 'Vanessa 💜';

        const memoryElement = document.createElement('div');
        memoryElement.className = `timeline-item ${position}`;
        memoryElement.id = `memory-${memory.id}`;
        memoryElement.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-date">📅 ${memory.date} ${memory.time !== '00:00' ? `⏰ ${memory.time}` : ''}</div>
                <h3>${memory.title}</h3>
                <p>${memory.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <div>
                        <span class="memory-tag">🏷️ ${memory.theme}</span>
                        <span class="memory-author author-badge-timeline ${authorClass}">✍️ ${authorName}</span>
                    </div>
                    <div class="memory-actions">
                        <button class="edit-memory" onclick="editMemory('${memory.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-memory" onclick="deleteMemory('${memory.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        timeline.appendChild(memoryElement);
    });
}

// Mostrar memórias filtradas por tema
function filterByTheme(theme) {
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const container = document.getElementById('filteredMemories');
    if (theme === 'all') {
        container.innerHTML = `<div class="empty-filter"><p>Selecione um tema para ver as memórias</p></div>`;
        return;
    }

    const themeMemories = memories.filter(m => m.theme === theme);
    if (themeMemories.length === 0) {
        container.innerHTML = `<div class="empty-filter"><p>Nenhuma memória com o tema "${theme}" ainda...</p></div>`;
        return;
    }

    themeMemories.sort((a, b) => {
        const dateA = a.date.split('/').reverse().join('-');
        const dateB = b.date.split('/').reverse().join('-');
        return new Date(dateB) - new Date(dateA);
    });

    let html = '<div class="memories-list-vertical">';
    themeMemories.forEach(memory => {
        const authorClass = memory.author === 'Bruna' ? 'bruna' : 'vanessa';
        const authorName = memory.author === 'Bruna' ? 'Bruna 💚' : 'Vanessa 💜';
        html += `
            <div class="memory-list-item">
                <div class="memory-list-header">
                    <span class="memory-list-date">📅 ${memory.date}</span>
                    <span class="memory-list-theme">🏷️ ${memory.theme}</span>
                </div>
                <h3 class="memory-list-title">${memory.title}</h3>
                <p class="memory-list-description">${memory.description}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <span class="memory-author author-badge-timeline ${authorClass}">✍️ ${authorName}</span>
                    <div>
                        <button class="edit-memory" onclick="editMemory('${memory.id}')"><i class="fas fa-edit"></i></button>
                        <button class="delete-list-btn" onclick="deleteMemory('${memory.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// Controle do formulário
function toggleForm() {
    const form = document.getElementById('memoryForm');
    if (form.style.display === 'none') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
        if (editingId) cancelEdit();
    }
}

function cancelEdit() {
    editingId = null;
    document.getElementById('formTitle').textContent = '📝 Nova memória';
    document.getElementById('memoryDate').value = '';
    document.getElementById('memoryTime').value = '';
    document.getElementById('memoryTitle').value = '';
    document.getElementById('memoryDescription').value = '';
    document.getElementById('memoryTheme').value = 'Conhecimento';
    document.querySelector('input[name="author"][value="Bruna"]').checked = true;
}

function editMemory(id) {
    const memory = memories.find(m => m.id === id);
    if (!memory) return;
    editingId = id;
    document.getElementById('formTitle').textContent = '✏️ Editando memória';
    document.getElementById('memoryDate').value = formatDateForInput(memory.date);
    document.getElementById('memoryTime').value = memory.time || '';
    document.getElementById('memoryTitle').value = memory.title;
    document.getElementById('memoryDescription').value = memory.description;
    document.getElementById('memoryTheme').value = memory.theme;
    const authorRadio = document.querySelector(`input[name="author"][value="${memory.author}"]`);
    if (authorRadio) authorRadio.checked = true;
    document.getElementById('memoryForm').style.display = 'block';
    document.getElementById('memoryForm').scrollIntoView({ behavior: 'smooth' });
}

function formatDateForInput(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}

function addEmoji(emoji) {
    document.getElementById('memoryDescription').value += emoji;
}

// Salvar nova memória ou atualizar existente (via API)
async function saveMemory() {
    const date = document.getElementById('memoryDate').value;
    const time = document.getElementById('memoryTime').value;
    const title = document.getElementById('memoryTitle').value;
    const theme = document.getElementById('memoryTheme').value;
    const description = document.getElementById('memoryDescription').value;
    const author = document.querySelector('input[name="author"]:checked').value;

    if (!date || !title || !description || !theme) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const memoryData = {
        id: editingId || Date.now().toString(),
        date: formatDate(date),
        time: time || '00:00',
        title: title,
        theme: theme,
        description: description,
        author: author
    };

    try {
        const response = await fetch(API_URL, {
            method: editingId ? 'PUT' : 'POST',
            body: JSON.stringify(memoryData)
        });
        const result = await response.json();
        if (result.status === 'success') {
            showNotification(editingId ? '✏️ Memória atualizada!' : '✨ Memória adicionada!');
            await loadMemories();
        } else {
            showNotification('❌ Erro ao salvar');
        }
    } catch (error) {
        showNotification('❌ Erro de conexão');
    }

    cancelEdit();
    document.getElementById('memoryForm').style.display = 'none';
}

function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Deletar memória (via API)
async function deleteMemory(id) {
    if (!confirm('Tem certeza que quer apagar essa memória?')) return;

    try {
        const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.status === 'success') {
            showNotification('📝 Memória removida');
            await loadMemories();
            const activeFilter = document.querySelector('.theme-btn.active');
            if (activeFilter && activeFilter.textContent !== 'Todos') {
                filterByTheme(activeFilter.textContent);
            }
        } else {
            showNotification('❌ Erro ao deletar');
        }
    } catch (error) {
        showNotification('❌ Erro de conexão');
    }
}

// ===== FUNÇÕES DE LOGIN (RESTAURADAS!) =====
function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    const errorMessage = document.getElementById('errorMessage');
    
    const senhaSecreta = "Brunessa40";
    
    if (password === senhaSecreta) {
        localStorage.setItem('cofre-logado', 'true');
        document.getElementById('passwordScreen').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        loadMemories();
    } else {
        errorMessage.textContent = '❌ Senha incorreta. Tente novamente!';
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('passwordInput');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (!passwordInput || !toggleIcon) return;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function goToHome() {
    window.location.href = 'index.html';
}

// Notificação
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: linear-gradient(135deg, var(--blue-purple), var(--blue-green));
        color: white; padding: 15px 25px; border-radius: 10px;
        box-shadow: var(--shadow-heavy); z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}