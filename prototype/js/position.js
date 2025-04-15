// 职位管理页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 加载职位数据
    loadPositionData();
    
    // 初始化添加职位按钮
    document.getElementById('savePositionBtn').addEventListener('click', savePosition);
    
    // 初始化编辑职位按钮
    document.getElementById('updatePositionBtn').addEventListener('click', updatePosition);
    
    // 初始化每页显示数量选择器
    initPageSize(loadPositionData);
    
    // 填充公司下拉菜单
    fillCompanySelects();
    
    // 初始化表格排序功能
    initTableSort();
    
    // 初始化状态筛选
    initStatusFilter();
    
    // 测试教育经历和工作经历是否正确生成
    testEducationAndWorkExperience();
});

// 测试教育经历和工作经历数据
function testEducationAndWorkExperience() {
    // 检查数据是否存在
    if (window.mockData.educations && window.mockData.educations.length > 0) {
        console.log(`已成功生成 ${window.mockData.educations.length} 条教育经历数据`);
        
        // 分析每个简历的教育经历数量
        const resumeEduCount = {};
        window.mockData.educations.forEach(edu => {
            if (!resumeEduCount[edu.resumeId]) {
                resumeEduCount[edu.resumeId] = 0;
            }
            resumeEduCount[edu.resumeId]++;
        });
        
        console.log(`简历教育经历统计:`, resumeEduCount);
    } else {
        console.warn('未找到教育经历数据');
    }
    
    if (window.mockData.workExperiences && window.mockData.workExperiences.length > 0) {
        console.log(`已成功生成 ${window.mockData.workExperiences.length} 条工作经历数据`);
        
        // 分析每个简历的工作经历数量
        const resumeWorkCount = {};
        window.mockData.workExperiences.forEach(work => {
            if (!resumeWorkCount[work.resumeId]) {
                resumeWorkCount[work.resumeId] = 0;
            }
            resumeWorkCount[work.resumeId]++;
        });
        
        console.log(`简历工作经历统计:`, resumeWorkCount);
    } else {
        console.warn('未找到工作经历数据');
    }
}

// 填充公司下拉菜单
function fillCompanySelects() {
    // 获取客户数据
    const customers = window.mockData.customers;
    
    // 获取下拉菜单元素
    const addCompanySelect = document.getElementById('company');
    const editCompanySelect = document.getElementById('edit-company');
    
    // 清空现有选项，保留第一个默认选项
    addCompanySelect.innerHTML = '<option value="">选择公司</option>';
    editCompanySelect.innerHTML = '<option value="">选择公司</option>';
    
    // 填充客户选项
    customers.forEach(customer => {
        // 添加到"添加"表单
        const addOption = document.createElement('option');
        addOption.value = customer.name;
        addOption.textContent = customer.name;
        addCompanySelect.appendChild(addOption);
        
        // 添加到"编辑"表单
        const editOption = document.createElement('option');
        editOption.value = customer.name;
        editOption.textContent = customer.name;
        editCompanySelect.appendChild(editOption);
    });
}

// 初始化表格排序功能
function initTableSort() {
    const sortableHeaders = document.querySelectorAll('th[data-sortable="true"]');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const field = this.getAttribute('data-field');
            let sortDirection = 'asc';
            
            // 判断当前排序方向
            if (this.classList.contains('sorting-asc')) {
                sortDirection = 'desc';
            } else if (this.classList.contains('sorting-desc')) {
                sortDirection = 'asc';
            }
            
            // 更新排序图标
            updateSortIcons(this, sortDirection);
            
            // 重新加载数据
            loadPositionData(1, field, sortDirection);
        });
    });
}

// 更新排序图标
function updateSortIcons(activeHeader, direction) {
    // 移除所有表头的排序类
    document.querySelectorAll('th[data-sortable="true"]').forEach(header => {
        header.classList.remove('sorting-asc', 'sorting-desc');
        header.classList.add('sorting');
    });
    
    // 为当前活动的表头添加排序类
    if (activeHeader) {
        activeHeader.classList.add(`sorting-${direction}`);
    }
}

// 初始化状态筛选功能
function initStatusFilter() {
    const statusDropdownItems = document.querySelectorAll('th[data-field="status"] .dropdown-item');
    statusDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 更新活动状态
            statusDropdownItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            // 获取筛选值
            const filterText = this.textContent.trim();
            let statusFilter = null;
            
            if (filterText !== '所有状态') {
                switch (filterText) {
                    case '关闭': statusFilter = 0; break;
                    case '开放': statusFilter = 1; break;
                    case '暂停': statusFilter = 2; break;
                    case '完成': statusFilter = 3; break;
                }
            }
            
            // 重新加载数据
            loadPositionData(1, null, null, statusFilter);
        });
    });
}

// 加载职位数据
function loadPositionData(page, sortField, sortDirection, statusFilter) {
    const positionTableBody = document.getElementById('positionTableBody');
    
    // 清空表格
    positionTableBody.innerHTML = '';
    
    // 获取所有职位数据
    let positions = window.mockData.positions;
    
    // 应用状态筛选
    if (statusFilter !== null && statusFilter !== undefined) {
        positions = positions.filter(position => position.status === statusFilter);
    }
    
    // 应用排序
    if (sortField) {
        positions.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            
            // 特殊处理日期字段
            if (sortField === 'createTime') {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
            }
            
            // 比较值
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    // 顾问名字数组
    const consultantNames = [
        "张明", "李志强", "王静", "陈涛", "林小华", 
        "赵雪", "刘伟", "黄晓明", "吴思思", "钱亮"
    ];
    
    // 根据当前页面大小和页码计算显示的数据
    const pageSize = parseInt(document.getElementById('pageSize')?.value || 10);
    const currentPage = page || 1; // 使用传入的页码或默认为第一页
    
    // 计算当前页面应该显示的数据范围
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, positions.length);
    
    // 遍历数据并创建表格行
    for (let i = startIndex; i < endIndex; i++) {
        const position = positions[i];
        // 随机选择一个顾问名字
        const randomConsultant = consultantNames[Math.floor(Math.random() * consultantNames.length)];
        
        // 创建表格行
        const row = document.createElement('tr');
        
        // 设置行内容
        row.innerHTML = `
            <td>${position.id}</td>
            <td>${position.title}</td>
            <td>${position.company}</td>
            <td>${getStatusBadge(position.status)}</td>
            <td>${Math.floor(Math.random() * 5) + 1}</td>
            <td>${randomConsultant}</td>
            <td>${position.customerContact}</td>
            <td>${position.contactMethod || '-'}</td>
            <td>${formatDate(position.createTime)}</td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary btn-view" data-id="${position.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-info btn-recommendation" data-id="${position.id}" title="查看推荐">
                        <i class="bi bi-people"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-success btn-edit" data-id="${position.id}" data-bs-toggle="modal" data-bs-target="#editPositionModal">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-delete" data-id="${position.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        // 将行添加到表格
        positionTableBody.appendChild(row);
    }
    
    // 使用通用分页功能更新分页信息
    updatePaginationInfo(positions.length, pageSize, currentPage, 
                        (page) => loadPositionData(page, sortField, sortDirection, statusFilter));
    
    // 初始化操作按钮事件
    initViewButtons();
    initEditButtons();
    initDeleteButtons();
    initRecommendationButtons();
}

// 添加新职位
function savePosition() {
    // 获取表单数据
    const formData = {
        id: window.mockData.positions.length + 1,
        title: document.getElementById('title').value,
        company: document.getElementById('company').value,
        recruiter: parseInt(document.getElementById('recruiter').value),
        // 客户设置为1，保持兼容性
        customer: 1,
        customerContact: document.getElementById('customerContact').value,
        contactMethod: document.getElementById('contactMethod').value,
        status: parseInt(document.getElementById('status').value),
        requirements: document.getElementById('requirements').value,
        createTime: new Date()
    };
    
    // 添加到模拟数据
    window.mockData.positions.unshift(formData);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
    modal.hide();
    
    // 重新加载数据
    loadPositionData();
    
    // 重置表单
    document.getElementById('addPositionForm').reset();
}

// 更新职位
function updatePosition() {
    // 获取职位ID
    const positionId = parseInt(document.getElementById('edit-id').value);
    
    // 查找职位索引
    const positionIndex = window.mockData.positions.findIndex(position => position.id === positionId);
    
    if (positionIndex !== -1) {
        // 更新数据
        window.mockData.positions[positionIndex] = {
            ...window.mockData.positions[positionIndex],
            title: document.getElementById('edit-title').value,
            company: document.getElementById('edit-company').value,
            recruiter: parseInt(document.getElementById('edit-recruiter').value),
            // 保留原客户数据
            customerContact: document.getElementById('edit-customerContact').value,
            contactMethod: document.getElementById('edit-contactMethod').value,
            status: parseInt(document.getElementById('edit-status').value),
            requirements: document.getElementById('edit-requirements').value
        };
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('editPositionModal'));
        modal.hide();
        
        // 重新加载数据
        loadPositionData();
    }
}

// 初始化查看按钮
function initViewButtons() {
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const positionId = parseInt(this.getAttribute('data-id'));
            viewPosition(positionId);
        });
    });
}

// 初始化编辑按钮
function initEditButtons() {
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const positionId = parseInt(this.getAttribute('data-id'));
            fillEditForm(positionId);
        });
    });
}

// 初始化删除按钮
function initDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const positionId = parseInt(this.getAttribute('data-id'));
            deletePosition(positionId);
        });
    });
}

// 初始化查看推荐按钮
function initRecommendationButtons() {
    const recommendationButtons = document.querySelectorAll('.btn-recommendation');
    recommendationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const positionId = parseInt(this.getAttribute('data-id'));
            viewRecommendation(positionId);
        });
    });
}

// 查看职位详情
function viewPosition(positionId) {
    // 查找职位
    const position = window.mockData.positions.find(position => position.id === positionId);
    
    if (position) {
        // 填充职位详情模态框
        document.getElementById('view-id').textContent = position.id;
        document.getElementById('view-title').textContent = position.title;
        document.getElementById('view-company').textContent = position.company;
        document.getElementById('view-status-badge').innerHTML = getStatusBadge(position.status);
        document.getElementById('view-recruiter').textContent = position.recruiter || '-';
        
        document.getElementById('view-customer-contact').textContent = position.customerContact || '-';
        document.getElementById('view-contact-method').textContent = position.contactMethod || '-';
        document.getElementById('view-requirements').textContent = position.requirements || '无职位要求信息';
        document.getElementById('view-create-time').textContent = formatDate(position.createTime);
        
        // 初始化编辑按钮事件
        document.getElementById('editFromViewBtn').onclick = function() {
            // 关闭查看模态框
            const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewModal'));
            viewModal.hide();
            
            // 填充并打开编辑模态框
            fillEditForm(positionId);
            const editModal = new bootstrap.Modal(document.getElementById('editPositionModal'));
            editModal.show();
        };
        
        // 显示模态框
        const modal = new bootstrap.Modal(document.getElementById('viewModal'));
        modal.show();
    }
}

// 填充编辑表单
function fillEditForm(positionId) {
    // 查找职位
    const position = window.mockData.positions.find(position => position.id === positionId);
    
    if (position) {
        // 填充表单字段
        document.getElementById('edit-id').value = position.id;
        document.getElementById('edit-title').value = position.title;
        document.getElementById('edit-company').value = position.company;
        document.getElementById('edit-recruiter').value = position.recruiter;
        // 移除客户设置
        document.getElementById('edit-customerContact').value = position.customerContact;
        document.getElementById('edit-contactMethod').value = position.contactMethod;
        document.getElementById('edit-status').value = position.status;
        document.getElementById('edit-requirements').value = position.requirements;
    }
}

// 删除职位
function deletePosition(positionId) {
    // 查找职位
    const position = window.mockData.positions.find(position => position.id === positionId);
    
    if (position) {
        // 使用通用确认删除模态框
        window.showDeleteConfirmModal(
            '确认删除',
            `<p>您确定要删除 <strong>${position.title}</strong> (${position.company}) 职位吗？</p>`,
            function() {
                // 查找职位索引
                const positionIndex = window.mockData.positions.findIndex(pos => pos.id === positionId);
                
                if (positionIndex !== -1) {
                    // 从数组中删除
                    window.mockData.positions.splice(positionIndex, 1);
                    
                    // 重新加载数据
                    loadPositionData();
                }
            }
        );
    }
}

// 查看职位推荐人才
function viewRecommendation(positionId) {
    // 查找职位
    const position = window.mockData.positions.find(position => position.id === positionId);
    
    if (position) {
        // 跳转到推荐人才页面
        window.location.href = `recommendation.html?positionId=${positionId}`;
    }
}

// 获取状态徽章
function getStatusBadge(status) {
    const badges = [
        '<span class="badge bg-danger">关闭</span>',
        '<span class="badge bg-success">开放</span>',
        '<span class="badge bg-warning">暂停</span>',
        '<span class="badge bg-info">完成</span>'
    ];
    return badges[status] || '<span class="badge bg-secondary">未知</span>';
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