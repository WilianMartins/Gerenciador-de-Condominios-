document.addEventListener('DOMContentLoaded', () => {
    const loginPage = document.getElementById('login-page');
    const appPage = document.getElementById('app-page');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    const sidebar = document.getElementById('sidebar');
    const sidebarToggleDesktop = document.getElementById('sidebar-toggle-desktop');
    const sidebarToggleMobile = document.getElementById('sidebar-toggle-mobile');

    const contentSections = document.querySelectorAll('.content-section');
    
    let currentUserName = 'Usuário'; 

    const themeToggleIconBtn = document.getElementById('theme-toggle-icon');
    
    function applyTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
    }

    const savedTheme = localStorage.getItem('theme') || 'light'; 
    applyTheme(savedTheme);

    if (themeToggleIconBtn) {
        themeToggleIconBtn.addEventListener('click', () => {
            let currentThemeIsDark = document.body.classList.contains('dark-mode');
            let newTheme = currentThemeIsDark ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    } else {
        console.warn("Botão de tema (theme-toggle-icon) não encontrado.");
    }

    const carouselImages = document.querySelectorAll('.login-carousel .carousel-image');
    let currentCarouselImageIndex = 0;
    let carouselInterval;
    function showCarouselImage(index) { carouselImages.forEach((img, i) => img.classList.toggle('active', i === index)); }
    function nextCarouselImage() { currentCarouselImageIndex = (currentCarouselImageIndex + 1) % carouselImages.length; showCarouselImage(currentCarouselImageIndex); }
    function startCarousel() { if (carouselImages.length > 0) { stopCarousel(); showCarouselImage(currentCarouselImageIndex); carouselInterval = setInterval(nextCarouselImage, 10000); } }
    function stopCarousel() { clearInterval(carouselInterval); }
    
    let mockTasks = [{ id: 1, description: 'Limpeza Calhas Bloco A', condominiumId: 1, condominiumName: 'Condomínio Sol Nascente', maintenanceDate: '2024-06-15', dueMonths: 6, priority: 'Alta', status: 'Concluída', providerId: 1, providerName: 'João Limpeza Total', repeat: 6, observations: 'Verificar telhas.' }];
    let mockProviders = [{ id: 1, name: 'João Limpeza Total', area: 'Limpeza Geral', phone: '(11)98765-4321', email: 'joao@limpeza.com', observations: 'Alturas.' }];
    let mockCondominiums = [{ id: 1, name: 'Condomínio Sol Nascente', address: 'Rua das Palmeiras, 123', manager: 'Sra. Helena', contact: '(31)3333-4444' }];
    let mockUsers = [{ id: 1, name: 'Admin Principal', email: 'admin@condomail.com', accessType: 'administrador' }];
    let nextTaskId = mockTasks.length > 0 ? Math.max(...mockTasks.map(t => t.id)) + 1 : 1;
    let nextProviderId = mockProviders.length > 0 ? Math.max(...mockProviders.map(p => p.id)) + 1 : 1;
    let nextCondominiumId = mockCondominiums.length > 0 ? Math.max(...mockCondominiums.map(c => c.id)) + 1 : 1;
    let nextUserId = mockUsers.length > 0 ? Math.max(...mockUsers.map(u => u.id)) + 1 : 1;


    function showPage(pageIdToShow) {
        if (!loginPage || !appPage) { console.error("CRÍTICO: loginPage ou appPage nulo."); return; }
        if (pageIdToShow === 'login') {
            loginPage.classList.add('active'); appPage.classList.remove('active'); startCarousel(); 
        } else if (pageIdToShow === 'app') {
            loginPage.classList.remove('active'); appPage.classList.add('active'); stopCarousel(); 
            const welcomeUsernameSpan = document.getElementById('welcome-username');
            if (welcomeUsernameSpan) {
                welcomeUsernameSpan.textContent = currentUserName || 'Usuário'; 
            }
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username-login');
            const emailInput = document.getElementById('email-login'); 
            
            if (usernameInput && emailInput && usernameInput.value.trim() !== '' && emailInput.value.trim() !== '') { 
                currentUserName = usernameInput.value.trim(); 
                showPage('app'); 
                navigateTo('initial-screen'); 
                loadAllData(); 
            } else {
                alert('Por favor, preencha o nome do usuário e o email.');
            }
        });
    } else { console.error("CRÍTICO: login-form não encontrado!"); }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); showPage('login'); 
            if (sidebar.classList.contains('open')) sidebar.classList.remove('open');
            sidebar.classList.remove('collapsed'); 
        });
    }
    
    function toggleSidebarDesktop() { sidebar.classList.toggle('collapsed'); }
    function toggleSidebarMobile() { sidebar.classList.toggle('open'); }

    if (sidebarToggleDesktop) sidebarToggleDesktop.addEventListener('click', toggleSidebarDesktop);
    if (sidebarToggleMobile) sidebarToggleMobile.addEventListener('click', toggleSidebarMobile);
    
    function navigateTo(targetId) {
        contentSections.forEach(section => section.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(link => { 
            link.classList.toggle('active-link', link.dataset.target === targetId);
        });

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            console.warn(`Seção '${targetId}' não encontrada. Navegando para initial-screen.`);
            document.getElementById('initial-screen').classList.add('active'); 
            document.querySelectorAll('.nav-link').forEach(link => link.classList.toggle('active-link', link.dataset.target === 'initial-screen'));
        }
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        if(link.id !== 'logout-btn') { 
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                if (targetId) navigateTo(targetId);
            });
        }
    });

    window.openModal = (modalId, itemId = null, type = null) => { 
        const modal = document.getElementById(modalId); if (!modal) return;
        const form = modal.querySelector('form'); if (form) form.reset();
        const hiddenIdField = document.getElementById(`${type}-id`); if (hiddenIdField) hiddenIdField.value = '';
        const title = modal.querySelector('h2'); if (!title) return;
        const userPasswordInput = document.getElementById('user-password');
        if (type === 'user' && userPasswordInput) { userPasswordInput.value = ''; userPasswordInput.required = !itemId; }

        if (itemId) { 
            let itemData;
            if (type === 'task') itemData = mockTasks.find(t => t.id === itemId);
            else if (type === 'provider') itemData = mockProviders.find(p => p.id === itemId);
            else if (type === 'condominium') itemData = mockCondominiums.find(c => c.id === itemId);
            else if (type === 'user') itemData = mockUsers.find(u => u.id === itemId);

            if (itemData) {
                title.textContent = `Editar`; 
                if (type === 'task') title.textContent = "Editar Tarefa"; 
                if (type === 'provider') title.textContent = "Editar Prestador";
                if (type === 'condominium') title.textContent = "Editar Condomínio";
                if (type === 'user') title.textContent = "Editar Usuário";
                
                document.getElementById(`${type}-id`).value = itemData.id;
                if (type === 'task') {
                    document.getElementById('task-description').value = itemData.description; document.getElementById('task-condominium').value = itemData.condominiumId; document.getElementById('task-maintenance-date').value = itemData.maintenanceDate; document.getElementById('task-due-months').value = itemData.dueMonths; document.getElementById('task-priority').value = itemData.priority; document.getElementById('task-status').value = itemData.status; document.getElementById('task-repeat').value = itemData.repeat || ''; document.getElementById('task-provider').value = itemData.providerId; document.getElementById('task-observations').value = itemData.observations;
                } else if (type === 'provider') {
                    document.getElementById('provider-name').value = itemData.name; document.getElementById('provider-area').value = itemData.area; document.getElementById('provider-phone').value = itemData.phone || ''; document.getElementById('provider-email').value = itemData.email || ''; document.getElementById('provider-observations').value = itemData.observations;
                } else if (type === 'condominium') {
                    document.getElementById('condominium-name').value = itemData.name; document.getElementById('condominium-address').value = itemData.address; document.getElementById('condominium-manager').value = itemData.manager; document.getElementById('condominium-contact').value = itemData.contact;
                } else if (type === 'user') {
                    document.getElementById('user-name').value = itemData.name; document.getElementById('user-email').value = itemData.email; document.getElementById('user-access-type').value = itemData.accessType;
                }
            }
        } else { 
             if (type === 'task') title.textContent = "Nova Tarefa"; 
             if (type === 'provider') title.textContent = "Novo Prestador";
             if (type === 'condominium') title.textContent = "Novo Condomínio";
             if (type === 'user') title.textContent = "Novo Usuário";
        }
        modal.style.display = 'flex';
    };
    window.closeModal = (modalId) => { 
        const modal = document.getElementById(modalId); if (modal) modal.style.display = 'none';
        const userPasswordInput = document.getElementById('user-password');
        if (modalId === 'user-modal' && userPasswordInput) userPasswordInput.required = true;
    };
    window.onclick = (event) => { if (event.target.classList.contains('modal')) closeModal(event.target.id); };
    function calculateTaskSituation(maintenanceDateStr, dueMonths) { 
        if (!maintenanceDateStr || dueMonths === null || dueMonths < 0) return { text: 'N/A', class: '' };
        const maintenanceDate = new Date(maintenanceDateStr + "T00:00:00");
        if (isNaN(maintenanceDate.getTime())) return { text: 'Data Inválida', class: 'status-overdue text-danger' };
        const dueDate = new Date(maintenanceDate); dueDate.setMonth(dueDate.getMonth() + parseInt(dueMonths));
        const today = new Date(); today.setHours(0, 0, 0, 0);
        return dueDate < today ? { text: 'Atrasado', class: 'status-overdue text-danger' } : { text: 'Em dia', class: 'status-ontime text-success' };
    }
    function populateTasksTable(tasks) { 
        const tbody = document.getElementById('tasks-table-body'); if (!tbody) return; tbody.innerHTML = ''; 
        tasks.forEach(task => {
            const situation = calculateTaskSituation(task.maintenanceDate, task.dueMonths);
            const condoName = task.condominiumName || mockCondominiums.find(c => c.id === parseInt(task.condominiumId))?.name || 'N/A';
            const providerName = task.providerName || mockProviders.find(p => p.id === parseInt(task.providerId))?.name || 'N/A';
            let nextMaintenanceDisplay = 'N/A';
            if (task.maintenanceDate && !isNaN(new Date(task.maintenanceDate + "T00:00:00").getTime())) {
                const nextMaintenance = new Date(task.maintenanceDate + "T00:00:00");
                nextMaintenance.setMonth(nextMaintenance.getMonth() + parseInt(task.dueMonths));
                nextMaintenanceDisplay = nextMaintenance.toLocaleDateString();
            }
            tbody.innerHTML += `<tr><td>${task.description || 'N/A'}</td><td>${condoName}</td><td>${task.maintenanceDate ? new Date(task.maintenanceDate + "T00:00:00").toLocaleDateString() : 'N/A'}</td><td>${nextMaintenanceDisplay} (${task.dueMonths || 0}m)</td><td>${task.priority || 'N/A'}</td><td>${task.status || 'N/A'}</td><td class="${situation.class}">${situation.text}</td><td>${providerName}</td><td><button class="actions-btn btn-edit" onclick="openModal('task-modal', ${task.id}, 'task')"><i class="fas fa-edit"></i></button><button class="actions-btn btn-delete" onclick="deleteItem(${task.id}, 'task')"><i class="fas fa-trash"></i></button></td></tr>`;
        });
    }
    function loadTasks() { populateTasksTable(mockTasks); updateDashboardCounts(); populateTaskFormDropdowns(); }
    function loadProviders() { 
        const tbody = document.getElementById('providers-table-body'); if (!tbody) return; tbody.innerHTML = ''; 
        mockProviders.forEach(provider => { tbody.innerHTML += `<tr><td>${provider.name}</td><td>${provider.area}</td><td>${provider.phone || ''} <br> ${provider.email || ''}</td><td>${provider.observations}</td><td><button class="actions-btn btn-edit" onclick="openModal('provider-modal', ${provider.id}, 'provider')"><i class="fas fa-edit"></i></button><button class="actions-btn btn-delete" onclick="deleteItem(${provider.id}, 'provider')"><i class="fas fa-trash"></i></button></td></tr>`; });
    }
    function loadCondominiums() { 
        const tbody = document.getElementById('condominiums-table-body'); if (!tbody) return; tbody.innerHTML = ''; 
        mockCondominiums.forEach(condo => { tbody.innerHTML += `<tr><td>${condo.name}</td><td>${condo.address}</td><td>${condo.manager}</td><td>${condo.contact}</td><td><button class="actions-btn btn-edit" onclick="openModal('condominium-modal', ${condo.id}, 'condominium')"><i class="fas fa-edit"></i></button><button class="actions-btn btn-delete" onclick="deleteItem(${condo.id}, 'condominium')"><i class="fas fa-trash"></i></button></td></tr>`; });
    }
    function loadUsers() {
        const tbody = document.getElementById('users-table-body'); if (!tbody) return; tbody.innerHTML = ''; 
        mockUsers.forEach(user => { tbody.innerHTML += `<tr><td>${user.name}</td><td>${user.email}</td><td>${user.accessType}</td><td><button class="actions-btn btn-edit" onclick="openModal('user-modal', ${user.id}, 'user')"><i class="fas fa-edit"></i></button><button class="actions-btn btn-delete" onclick="deleteItem(${user.id}, 'user')"><i class="fas fa-trash"></i></button></td></tr>`; });
    }
    function populateTaskFormDropdowns() { 
        const condoSelect = document.getElementById('task-condominium'); const providerSelect = document.getElementById('task-provider');
        if (condoSelect) { const currentCondoValue = condoSelect.value; condoSelect.innerHTML = '<option value="">Condomínio</option>'; mockCondominiums.forEach(condo => { condoSelect.innerHTML += `<option value="${condo.id}">${condo.name}</option>`; }); if (currentCondoValue) condoSelect.value = currentCondoValue; }
        if (providerSelect) { const currentProviderValue = providerSelect.value; providerSelect.innerHTML = '<option value="">Prestador</option>'; mockProviders.forEach(provider => { providerSelect.innerHTML += `<option value="${provider.id}">${provider.name}</option>`; }); if (currentProviderValue) providerSelect.value = currentProviderValue; }
    }
    const internalForms = Array.from(document.querySelectorAll('form')).filter(form => form.id !== 'login-form');
    internalForms.forEach(form => {
        form.addEventListener('submit', e => { 
            e.preventDefault();
            const formId = form.id;
            const idInput = form.querySelector('input[type="hidden"]');
            const id = idInput ? idInput.value : null;
            let data = {}; let type = '';
            if (formId === 'task-form') { type = 'task'; data = { description: form.elements['task-description'].value, condominiumId: parseInt(form.elements['task-condominium'].value), maintenanceDate: form.elements['task-maintenance-date'].value, dueMonths: parseInt(form.elements['task-due-months'].value), priority: form.elements['task-priority'].value, status: form.elements['task-status'].value, repeat: parseInt(form.elements['task-repeat'].value) || null, providerId: parseInt(form.elements['task-provider'].value), observations: form.elements['task-observations'].value,};
            } else if (formId === 'provider-form') { type = 'provider'; data = { name: form.elements['provider-name'].value, area: form.elements['provider-area'].value, phone: form.elements['provider-phone'].value, email: form.elements['provider-email'].value, observations: form.elements['provider-observations'].value,};
            } else if (formId === 'condominium-form') { type = 'condominium'; data = { name: form.elements['condominium-name'].value, address: form.elements['condominium-address'].value, manager: form.elements['condominium-manager'].value, contact: form.elements['condominium-contact'].value,};
            } else if (formId === 'user-form') { type = 'user'; data = { name: form.elements['user-name'].value, email: form.elements['user-email'].value, accessType: form.elements['user-access-type'].value,}; const passwordInput = form.elements['user-password']; if (!id || (passwordInput.value && passwordInput.value.trim() !== '')) data.password = passwordInput.value; if (!id && !data.password) { alert("Senha é obrigatória para novos usuários."); return; } }
            if (id) data.id = parseInt(id); console.log(`Dados do ${type}:`, data); 
            if (type === 'task') { if (id) { const i=mockTasks.findIndex(t=>t.id===data.id); if(i>-1)mockTasks[i]={...mockTasks[i],...data};} else {data.id=nextTaskId++; mockTasks.push(data);} loadTasks(); }
            else if (type === 'provider') { if (id) { const i=mockProviders.findIndex(t=>t.id===data.id); if(i>-1)mockProviders[i]={...mockProviders[i],...data};} else {data.id=nextProviderId++; mockProviders.push(data);} loadProviders(); populateTaskFormDropdowns(); }
            else if (type === 'condominium') { if (id) { const i=mockCondominiums.findIndex(t=>t.id===data.id); if(i>-1)mockCondominiums[i]={...mockCondominiums[i],...data};} else {data.id=nextCondominiumId++; mockCondominiums.push(data);} loadCondominiums(); populateTaskFormDropdowns(); }
            else if (type === 'user') { if (id) { const i=mockUsers.findIndex(t=>t.id===data.id); if(i>-1)mockUsers[i]={...mockUsers[i],...data};} else {data.id=nextUserId++; mockUsers.push(data);} loadUsers(); }
            closeModal(`${type}-modal`);
        });
    });
    window.deleteItem = (id, type) => { 
        if (!confirm('Tem certeza?')) return; console.log(`Deleting ${type} ${id}`); 
        if (type === 'task') { mockTasks = mockTasks.filter(t => t.id !== id); loadTasks();} 
        else if (type === 'provider') { mockProviders = mockProviders.filter(p => p.id !== id); loadProviders(); populateTaskFormDropdowns();} 
        else if (type === 'condominium') { mockCondominiums = mockCondominiums.filter(c => c.id !== id); loadCondominiums(); populateTaskFormDropdowns();} 
        else if (type === 'user') { mockUsers = mockUsers.filter(u => u.id !== id); loadUsers();}
    };
    function updateDashboardCounts() { 
        const pending = mockTasks.filter(t=>t.status==='Não iniciada').length;
        const inProgress = mockTasks.filter(t=>t.status==='Em andamento'||t.status==='Em execução').length;
        const completed = mockTasks.filter(t=>t.status==='Concluída').length;
        const today = new Date(); const sevenDays = new Date(); sevenDays.setDate(today.getDate()+7); today.setHours(0,0,0,0);
        const dueSoon = mockTasks.filter(t=>{if(t.status==='Concluída'||!t.maintenanceDate)return false; const mDate=new Date(t.maintenanceDate+"T00:00:00"); if(isNaN(mDate.getTime()))return false; const dDate=new Date(mDate); dDate.setMonth(dDate.getMonth()+parseInt(t.dueMonths)); return dDate>=today&&dDate<=sevenDays;}).length;
        if(document.getElementById('pending-tasks-count')) document.getElementById('pending-tasks-count').textContent=pending;
        if(document.getElementById('inprogress-tasks-count')) document.getElementById('inprogress-tasks-count').textContent=inProgress;
        if(document.getElementById('completed-tasks-count')) document.getElementById('completed-tasks-count').textContent=completed;
        if(document.getElementById('due-soon-tasks-count')) document.getElementById('due-soon-tasks-count').textContent=dueSoon;
    }
    function loadAllData() { loadCondominiums(); loadProviders(); setTimeout(() => { loadTasks(); loadUsers(); updateDashboardCounts(); }, 100); }
    if (loginPage && appPage) { showPage('login'); } else { console.error("CRÍTICO: Elementos loginPage ou appPage não encontrados no DOM!"); }
});