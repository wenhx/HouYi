// 用户管理页面脚本
// 模拟数据
window.mockData = {
    users: [
        {
            id: 1,
            username: 'admin',
            passwordSummary: '******',
            name: '管理员',
            gender: 0,
            email: 'admin@example.com',
            phone: '13800000000',
            role: 0,
            joinTime: new Date('2023-01-01'),
            leaveTime: null,
            createTime: new Date('2023-01-01')
        },
        {
            id: 2,
            username: 'manager1',
            passwordSummary: '******',
            name: '张经理',
            gender: 0,
            email: 'manager1@example.com',
            phone: '13800000001',
            role: 1,
            joinTime: new Date('2023-02-01'),
            leaveTime: null,
            createTime: new Date('2023-02-01')
        },
        {
            id: 3,
            username: 'recruiter1',
            passwordSummary: '******',
            name: '李招聘',
            gender: 1,
            email: 'recruiter1@example.com',
            phone: '13800000002',
            role: 2,
            joinTime: new Date('2023-03-01'),
            leaveTime: null,
            createTime: new Date('2023-03-01')
        }
    ]
};

// 当前过滤条件
const filterConditions = {
    role: null  // 默认不过滤角色
};

// 当前排序设置
const currentSort = {
    field: 'createTime', // 默认按创建时间排序
    direction: 'desc'    // 默认降序排列
};

// 通用确认删除模态框
window.showDeleteConfirmModal = function(title, message, confirmCallback) {
    // 检查是否已存在确认模态框
    let confirmModal = document.getElementById('deleteConfirmModal');
    
    // 如果不存在，创建模态框元素
    if (!confirmModal) {
        const modalHTML = `
        <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-labelledby="deleteConfirmModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteConfirmModalLabel">确认删除</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>您确定要删除吗？</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" id="confirmDeleteBtn">确认删除</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        // 将模态框添加到 body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        confirmModal = document.getElementById('deleteConfirmModal');
    }
    
    // 设置标题和消息
    confirmModal.querySelector('.modal-title').textContent = title;
    confirmModal.querySelector('.modal-body').innerHTML = message;
    
    // 获取模态框实例
    const modal = new bootstrap.Modal(confirmModal);
    
    // 绑定确认按钮事件
    const confirmBtn = confirmModal.querySelector('#confirmDeleteBtn');
    
    // 移除之前可能存在的事件监听器
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // 添加新的事件监听器
    newConfirmBtn.addEventListener('click', function() {
        if (typeof confirmCallback === 'function') {
            confirmCallback();
        }
        
        // 关闭模态框
        modal.hide();
    });
    
    // 显示模态框
    modal.show();
};

document.addEventListener('DOMContentLoaded', function() {
    // 加载用户数据
    loadUserData();
    
    // 初始化添加用户按钮
    document.getElementById('saveUserBtn').addEventListener('click', saveUser);
    
    // 初始化编辑用户按钮
    document.getElementById('updateUserBtn').addEventListener('click', updateUser);
    
    // 监听页面大小变更
    initPageSize(loadUserData);
    
    // 初始化角色筛选下拉菜单
    initRoleFilter();
    
    // 初始化表格排序
    initTableSort();
});

// 初始化角色筛选
function initRoleFilter() {
    const dropdownItems = document.querySelectorAll('.dropdown-menu .dropdown-item');
    
    dropdownItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 更新样式
            dropdownItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 设置过滤条件
            if (index === 0) {
                // "所有角色"选项
                filterConditions.role = null;
            } else {
                // 角色选项，索引-1 对应实际角色值
                filterConditions.role = index - 1;
            }
            
            // 重新加载数据
            loadUserData();
        });
    });
}

// 初始化表格排序
function initTableSort() {
    const sortableHeaders = document.querySelectorAll('th[data-sortable="true"]');
    
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const field = this.getAttribute('data-field');
            
            // 检查是否点击当前排序字段
            if (currentSort.field === field) {
                // 切换排序方向
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                // 新的排序字段，默认降序
                currentSort.field = field;
                currentSort.direction = 'desc';
            }
            
            // 更新排序图标
            updateSortIcons();
            
            // 重新加载数据
            loadUserData();
        });
    });
    
    // 初始化时设置排序图标
    updateSortIcons();
}

// 更新排序图标
function updateSortIcons() {
    const sortableHeaders = document.querySelectorAll('th[data-sortable="true"]');
    
    sortableHeaders.forEach(header => {
        // 移除之前的排序类
        header.classList.remove('sorting-asc', 'sorting-desc');
        
        const field = header.getAttribute('data-field');
        
        // 为当前排序字段添加排序方向类
        if (field === currentSort.field) {
            header.classList.add(`sorting-${currentSort.direction}`);
        }
    });
}

// 加载用户数据
function loadUserData(page) {
    const userTableBody = document.getElementById('userTableBody');
    
    // 清空表格
    userTableBody.innerHTML = '';
    
    // 获取所有用户数据
    let users = [...window.mockData.users]; // 复制数组，避免修改原始数据
    
    // 应用角色过滤
    if (filterConditions.role !== null) {
        users = users.filter(user => user.role === filterConditions.role);
    }
    
    // 根据当前排序设置对数据进行排序
    users.sort((a, b) => {
        let valueA, valueB;
        
        // 根据排序字段获取对应的值
        switch (currentSort.field) {
            case 'createTime':
                valueA = new Date(a.createTime).getTime();
                valueB = new Date(b.createTime).getTime();
                break;
            case 'lastLogin':
                // 模拟数据中没有这个字段，使用创建时间代替
                valueA = new Date(a.createTime).getTime();
                valueB = new Date(b.createTime).getTime();
                break;
            case 'role':
                valueA = a.role;
                valueB = b.role;
                break;
            default:
                valueA = a[currentSort.field];
                valueB = b[currentSort.field];
                break;
        }
        
        // 根据排序方向返回比较结果
        if (currentSort.direction === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
    
    // 根据当前页面大小和页码计算显示的数据
    const pageSize = parseInt(document.getElementById('pageSize')?.value || 10);
    const currentPage = page || 1; // 使用传入的页码或默认为第一页
    
    // 计算当前页面应该显示的数据范围
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, users.length);
    
    // 遍历数据并创建表格行
    for (let i = startIndex; i < endIndex; i++) {
        const user = users[i];
        
        // 创建表格行
        const row = document.createElement('tr');
        
        // 设置行内容 - 修改为匹配HTML中的表头字段
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${getRoleText(user.role)}</td>
            <td>技术部</td>
            <td><span class="badge bg-success">正常</span></td>
            <td>${formatDate(new Date())}</td>
            <td>${formatDate(user.createTime)}</td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary btn-view" data-id="${user.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-success btn-edit" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#editUserModal">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-delete" data-id="${user.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        // 将行添加到表格
        userTableBody.appendChild(row);
    }
    
    // 更新分页信息
    updatePaginationInfo(users.length, pageSize, currentPage);
    
    // 初始化操作按钮事件
    initViewButtons();
    initEditButtons();
    initDeleteButtons();
}

// 添加新用户
function saveUser() {
    // 获取表单数据
    const formData = {
        id: window.mockData.users.length + 1,
        username: document.getElementById('username').value,
        passwordSummary: '******', // 实际应用中会进行密码加密
        name: document.getElementById('name').value,
        gender: parseInt(document.getElementById('gender').value),
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        role: parseInt(document.getElementById('role').value),
        joinTime: new Date(),
        leaveTime: null,
        createTime: new Date()
    };
    
    // 添加到模拟数据
    window.mockData.users.unshift(formData);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
    modal.hide();
    
    // 重新加载数据
    loadUserData();
    
    // 重置表单
    document.getElementById('addUserForm').reset();
}

// 更新用户
function updateUser() {
    // 获取用户ID
    const userId = parseInt(document.getElementById('edit-id').value);
    
    // 查找用户索引
    const userIndex = window.mockData.users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
        const password = document.getElementById('edit-password').value;
        
        // 更新数据
        window.mockData.users[userIndex] = {
            ...window.mockData.users[userIndex],
            username: document.getElementById('edit-username').value,
            // 只有在输入密码时才更新密码
            passwordSummary: password ? '******' : window.mockData.users[userIndex].passwordSummary,
            name: document.getElementById('edit-name').value,
            gender: parseInt(document.getElementById('edit-gender').value),
            email: document.getElementById('edit-email').value,
            phone: document.getElementById('edit-phone').value,
            role: parseInt(document.getElementById('edit-role').value)
        };
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        modal.hide();
        
        // 重新加载数据
        loadUserData();
    }
}

// 初始化查看按钮
function initViewButtons() {
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            viewUser(userId);
        });
    });
}

// 初始化编辑按钮
function initEditButtons() {
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            fillEditForm(userId);
        });
    });
}

// 初始化删除按钮
function initDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            deleteUser(userId);
        });
    });
}

// 查看用户详情
function viewUser(userId) {
    // 查找用户
    const user = window.mockData.users.find(user => user.id === userId);
    
    if (user) {
        // 在实际应用中，这里会跳转到详情页或打开详情模态框
        // 在原型中，我们只是弹出一个提示
        alert(`查看用户详情: ${user.name} (${user.username})`);
    }
}

// 填充编辑表单
function fillEditForm(userId) {
    // 查找用户
    const user = window.mockData.users.find(user => user.id === userId);
    
    if (user) {
        // 填充表单字段
        document.getElementById('edit-id').value = user.id;
        document.getElementById('edit-username').value = user.username;
        document.getElementById('edit-password').value = ''; // 不回显密码
        document.getElementById('edit-name').value = user.name;
        document.getElementById('edit-gender').value = user.gender;
        document.getElementById('edit-email').value = user.email;
        document.getElementById('edit-phone').value = user.phone;
        document.getElementById('edit-role').value = user.role;
    }
}

// 删除用户
function deleteUser(userId) {
    // 查找用户
    const user = window.mockData.users.find(user => user.id === userId);
    
    if (user) {
        // 使用通用确认删除模态框
        window.showDeleteConfirmModal(
            '确认删除',
            `<p>您确定要删除用户 <strong>${user.name}</strong> (${user.username}) 吗？</p>`,
            function() {
                // 查找用户索引
                const userIndex = window.mockData.users.findIndex(u => u.id === userId);
                
                if (userIndex !== -1) {
                    // 从数组中删除
                    window.mockData.users.splice(userIndex, 1);
                    
                    // 重新加载数据
                    loadUserData();
                }
            }
        );
    }
}

// 更新分页信息
function updatePaginationInfo(totalItems, pageSize, currentPage) {
    const paginationInfo = document.querySelector('.pagination-info');
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    
    paginationInfo.textContent = `显示 ${startItem}-${endItem} 条，共 ${totalItems} 条记录`;
    
    // 更新分页按钮
    const totalPages = Math.ceil(totalItems / pageSize);
    const pagination = document.querySelector('.pagination');
    
    let paginationHTML = '';
    
    // 首页按钮
    paginationHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="1" ${currentPage === 1 ? 'tabindex="-1" aria-disabled="true"' : ''}>首页</a>
    </li>`;
    
    // 上一页按钮
    paginationHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}" ${currentPage === 1 ? 'tabindex="-1" aria-disabled="true"' : ''}>上一页</a>
    </li>`;
    
    // 页码按钮
    const maxPages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        paginationHTML += `<li class="page-item ${isActive ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}" ${isActive ? 'aria-current="page"' : ''}>${i}</a>
        </li>`;
    }
    
    // 下一页按钮
    paginationHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'tabindex="-1" aria-disabled="true"' : ''}>下一页</a>
    </li>`;
    
    // 末页按钮
    paginationHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${totalPages}" ${currentPage === totalPages ? 'tabindex="-1" aria-disabled="true"' : ''}>末页</a>
    </li>`;
    
    pagination.innerHTML = paginationHTML;
    
    // 添加分页点击事件
    pagination.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.getAttribute('aria-disabled') === 'true') {
                return;
            }
            
            const newPage = parseInt(this.getAttribute('data-page'));
            if (!isNaN(newPage)) {
                loadUserData(newPage);
            }
        });
    });
}

// 初始化页面大小选择
function initPageSize(callback) {
    const pageSizeSelect = document.getElementById('pageSize');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', function() {
            if (typeof callback === 'function') {
                callback();
            }
        });
    }
}

// 获取角色文本
function getRoleText(role) {
    const roles = [
        '<span class="badge bg-danger">管理员</span>',
        '<span class="badge bg-primary">招聘经理</span>',
        '<span class="badge bg-success">招聘专员</span>'
    ];
    return roles[role] || '<span class="badge bg-secondary">未知</span>';
}

// 格式化日期
function formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
} 