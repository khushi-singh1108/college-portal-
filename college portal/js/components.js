// UI Components Module
const Components = {
    // Create card (Glassmorphism style)
    createCard(title, content, actions = '') {
        return `
            <div class="card">
                ${title || actions ? `
                    <div class="card-header">
                        <h3 class="card-title">${title}</h3>
                        <div class="card-actions">${actions}</div>
                    </div>
                ` : ''}
                <div class="card-content">
                    ${content}
                </div>
            </div>
        `;
    },

    // Create circular progress (Glowing neon style)
    createCircularProgress(percentage, label) {
        const offset = 528 - (528 * percentage) / 100;
        return `
            <div class="circular-progress-container">
                <div class="circular-progress">
                    <svg>
                        <circle class="bg" cx="90" cy="90" r="84"></circle>
                        <circle class="progress" cx="90" cy="90" r="84" style="stroke-dashoffset: ${offset}"></circle>
                    </svg>
                    <div class="progress-value">${percentage}%</div>
                </div>
                <div class="progress-label">${label}</div>
            </div>
        `;
    },

    // Create premium stat item
    createStatItem(label, value, description = '') {
        return `
            <div class="stat-item">
                <div class="stat-header">${label}</div>
                <div class="stat-main">${value}</div>
                ${description ? `<div class="stat-description">${description}</div>` : ''}
            </div>
        `;
    },

    // Create modern table
    createModernTable(headers, rows) {
        const headerRow = `
            <div class="table-row header">
                ${headers.map(h => `<div>${h}</div>`).join('')}
            </div>
        `;

        const contentRows = rows.map(row => `
            <div class="table-row">
                ${row.map(cell => `<div>${cell}</div>`).join('')}
            </div>
        `).join('');

        return `
            <div class="modern-table">
                ${headerRow}
                <div class="table-body">
                    ${contentRows}
                </div>
            </div>
        `;
    },

    // Create status badge
    createStatusBadge(text, status = 'verified') {
        const statusClass = status.toLowerCase() === 'verified' ? 'status-verified' : 'status-pending';
        return `<span class="status-badge ${statusClass}">${text}</span>`;
    },

    // Create modal
    createModal(id, title, content, footer = '') {
        return `
            <div class="modal-overlay" id="${id}" style="display:none">
                <div class="modal bounceIn">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" onclick="Components.closeModal('${id}')">×</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${footer ? `
                        <div class="modal-footer">
                            ${footer}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    // Show modal
    showModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'flex';
            modal.querySelector('.modal').style.animation = 'fadeInUp 0.3s ease';
        }
    },

    // Close modal
    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'none';
    },

    // Create badge (Legacy)
    createBadge(text, variant = 'primary') {
        return `<span class="badge badge-${variant}">${text}</span>`;
    },

    // Create button
    createButton(text, variant = 'primary', onclick = '', size = '') {
        const sizeClass = size ? `btn-${size}` : '';
        return `<button class="btn btn-${variant} ${sizeClass}" onclick="${onclick}">${text}</button>`;
    },

    // Create notice item
    createNoticeItem(notice) {
        return `
            <div class="notice-item" style="background:rgba(255,255,255,0.02); margin-top:12px; border-radius:12px; border-left:4px solid var(--primary)">
                <div class="notice-header">
                    <div class="notice-title" style="color:white; font-size:15px">${notice.title}</div>
                    ${this.createStatusBadge(notice.priority, notice.priority === 'high' ? 'pending' : 'verified')}
                </div>
                <div class="notice-content" style="color:var(--text-secondary); font-size:13px">${notice.content}</div>
                <div class="notice-date" style="color:var(--text-muted); font-size:11px">${this.formatDate(notice.date)}</div>
            </div>
        `;
    },

    // Create timetable item
    createTimetableItem(item) {
        return `
            <div class="timetable-item" style="background:rgba(255,255,255,0.02); border:1px solid var(--glass-border); border-radius:16px; padding:16px; margin-top:12px">
                <div style="display:flex; justify-content:space-between; align-items:center">
                    <div>
                        <div class="timetable-subject" style="color:white; font-size:16px">${item.subject}</div>
                        <div class="timetable-teacher" style="color:var(--text-secondary); font-size:13px">${item.teacher}</div>
                    </div>
                    <div style="text-align:right">
                        <div class="timetable-hours" style="color:var(--primary); font-weight:800">${item.startTime}</div>
                        <div class="timetable-room" style="color:var(--text-muted); font-size:12px">${item.room}</div>
                    </div>
                </div>
            </div>
        `;
    },

    // Format date
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    // Calculate percentage
    calculatePercentage(obtained, total) {
        return Math.round((obtained / total) * 100);
    },

    // Get initials
    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    },

    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 16px 32px;
            background: rgba(30, 41, 59, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid var(--primary);
            color: white;
            border-radius: 100px;
            box-shadow: 0 10px 40px -10px var(--primary-glow);
            z-index: 10000;
            animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 700;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.5s';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    },

    // Create form group
    createFormGroup(label, input) {
        return `
            <div class="form-group">
                <label>${label}</label>
                ${input}
            </div>
        `;
    },

    // Create select (Restyled)
    createSelect(id, options, value = '') {
        return `
            <select id="${id}" style="width: 100%; padding: 14px 18px; background: rgba(15, 23, 42, 0.5); border: 1px solid var(--glass-border); border-radius: 12px; font-size: 15px; color: var(--text-primary); transition: all 0.3s;">
                ${options.map(opt => `
                    <option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>
                        ${opt.label}
                    </option>
                `).join('')}
            </select>
        `;
    },

    // Create input (Restyled)
    createInput(id, type = 'text', placeholder = '', value = '') {
        return `
            <input 
                type="${type}" 
                id="${id}" 
                placeholder="${placeholder}" 
                value="${value}"
                style="width: 100%; padding: 14px 18px; background: rgba(15, 23, 42, 0.5); border: 1px solid var(--glass-border); border-radius: 12px; font-size: 15px; color: var(--text-primary); transition: all 0.3s;"
            >
        `;
    },

    // Create textarea (Restyled)
    createTextarea(id, placeholder = '', value = '') {
        return `
            <textarea 
                id="${id}" 
                placeholder="${placeholder}"
                style="width: 100%; padding: 14px 18px; background: rgba(15, 23, 42, 0.5); border: 1px solid var(--glass-border); border-radius: 12px; font-size: 15px; color: var(--text-primary); transition: all 0.3s; min-height: 120px; resize: vertical;"
            >${value}</textarea>
        `;
    }
};

// Add CSS animations (Premium)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes bounceIn {
        0% { transform: scale(0.9); opacity: 0; }
        70% { transform: scale(1.05); }
        100% { transform: scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);
