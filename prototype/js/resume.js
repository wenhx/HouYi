// 简历管理页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 加载简历数据
    loadResumeData();
    
    // 初始化添加简历按钮
    document.getElementById('saveResumeBtn').addEventListener('click', saveResume);
    
    // 初始化编辑简历按钮
    document.getElementById('updateResumeBtn').addEventListener('click', updateResume);
    
    // 初始化保存沟通记录按钮事件
    document.getElementById('saveCommunicationBtn').addEventListener('click', saveCommunication);
    
    // 初始化保存推荐按钮事件
    document.getElementById('saveRecommendBtn').addEventListener('click', saveRecommend);
    
    // 监听页面大小变更
    initPageSize(loadResumeData);
    
    // 初始化表格排序
    initTableSort();
    
    // 初始化工作经历保存按钮
    document.getElementById('saveWorkExperienceBtn').addEventListener('click', saveWorkExperience);
    
    // 初始化教育经历保存按钮
    document.getElementById('saveEducationBtn').addEventListener('click', saveEducation);
    
    // 初始化工作经历的"至今"复选框事件
    document.getElementById('work-current').addEventListener('change', function() {
        const endDateInput = document.getElementById('work-end-date');
        endDateInput.disabled = this.checked;
        if (this.checked) {
            endDateInput.value = '';
        }
    });
    
    // 初始化模态框居中显示
    initModalCentering();
});

// 当前排序状态
let currentSort = {
    field: 'updateTime', // 默认按更新时间排序
    direction: 'desc'    // 默认降序排序
};

// 初始化表格排序
function initTableSort() {
    const sortableHeaders = document.querySelectorAll('th[data-sortable="true"]');
    
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const field = this.getAttribute('data-field') || this.textContent.trim().toLowerCase();
            
            // 更新排序方向
            if (currentSort.field === field) {
                // 如果点击的是当前排序字段，则切换排序方向
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                // 如果点击的是新字段，则设置为该字段的降序排序
                currentSort.field = field;
                currentSort.direction = 'desc';
            }
            
            // 更新排序图标
            updateSortIcons();
            
            // 重新加载数据
            loadResumeData();
        });
    });
    
    // 设置初始排序图标
    updateSortIcons();
}

// 更新排序图标
function updateSortIcons() {
    const sortableHeaders = document.querySelectorAll('th[data-sortable="true"]');
    
    sortableHeaders.forEach(header => {
        // 移除所有排序类
        header.classList.remove('sorting-asc', 'sorting-desc');
        
        const field = header.getAttribute('data-field');
        
        if (field === currentSort.field) {
            header.classList.add(`sorting-${currentSort.direction}`);
        }
    });
}

// 加载简历数据
function loadResumeData(page) {
    const resumeTableBody = document.getElementById('resumeTableBody');
    
    // 清空表格
    resumeTableBody.innerHTML = '';
    
    // 获取所有简历数据
    let resumes = [...window.mockData.resumes]; // 复制数组，避免修改原始数据
    
    // 根据当前排序设置对数据进行排序
    resumes.sort((a, b) => {
        let valueA, valueB;
        
        // 根据排序字段获取对应的值
        switch (currentSort.field) {
            case 'updateTime':
                valueA = new Date(a.updateTime).getTime();
                valueB = new Date(b.updateTime).getTime();
                break;
            case 'createTime':
                valueA = new Date(a.createTime).getTime();
                valueB = new Date(b.createTime).getTime();
                break;
            case '更新时间':
                valueA = new Date(a.updateTime).getTime();
                valueB = new Date(b.updateTime).getTime();
                break;
            case 'age':
                valueA = a.age;
                valueB = b.age;
                break;
            case 'name':
                valueA = a.name;
                valueB = b.name;
                break;
            case 'gender':
                valueA = a.gender;
                valueB = b.gender;
                break;
            case 'position':
                valueA = a.position;
                valueB = b.position;
                break;
            case 'salary':
                valueA = a.salary;
                valueB = b.salary;
                break;
            case 'city':
                valueA = a.city;
                valueB = b.city;
                break;
            case 'source':
                valueA = a.source;
                valueB = b.source;
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
    const endIndex = Math.min(startIndex + pageSize, resumes.length);
    
    // 遍历数据并创建表格行
    for (let i = startIndex; i < endIndex; i++) {
        const resume = resumes[i];
        
        // 创建表格行
        const row = document.createElement('tr');
        
        // 设置行内容
        row.innerHTML = `
            <td class="d-none">${resume.id}</td>
            <td title="ID: ${resume.id}">${resume.name}</td>
            <td>${getGenderText(resume.gender)}</td>
            <td>${resume.age}</td>
            <td>${resume.phone}</td>
            <td>${resume.email}</td>
            <td>${resume.position}</td>
            <td>${getStatusBadge(resume.status)}</td>
            <td>${getDegreeText(resume.degree)}</td>
            <td>${getExperienceText(resume.experience)}</td>
            <td>${resume.salary}K</td>
            <td>${resume.city}</td>
            <td>${resume.source}</td>
            <td title="创建于：${formatDate(resume.createTime)}&#13;最后更新：${formatDate(resume.updateTime)}">${formatRelativeTime(resume.updateTime)}</td>
            <td>
                <div class="btn-group" style="column-gap: 2px;">
                <button type="button" class="btn btn-sm btn-outline-info btn-detail" data-id="${resume.id}" title="查看简历详情" style="padding: 0.25rem 0.4rem;">
                        <i class="bi bi-eye"></i>
                    </button>
                <button type="button" class="btn btn-sm btn-outline-info btn-communication" data-id="${resume.id}" title="添加沟通记录" style="padding: 0.25rem 0.4rem;">
                        <i class="bi bi-telephone"></i>
                    </button>
                <button type="button" class="btn btn-sm btn-outline-warning btn-recommend" data-id="${resume.id}" title="推荐人才" style="padding: 0.25rem 0.4rem;">
                        <i class="bi bi-person-check"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-primary btn-notes" data-id="${resume.id}" title="查看备注信息" style="padding: 0.25rem 0.4rem;">
                        <i class="bi bi-sticky"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-success btn-edit" data-id="${resume.id}" data-bs-toggle="modal" data-bs-target="#editModal" style="padding: 0.25rem 0.4rem;">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-delete" data-id="${resume.id}" style="padding: 0.25rem 0.4rem;">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        // 将行添加到表格
        resumeTableBody.appendChild(row);
    }
    
    // 更新分页信息
    updatePaginationInfo(resumes.length, pageSize, currentPage);
    
    // 初始化操作按钮事件
    initViewButtons();
    initDetailButtons();
    initEditButtons();
    initDeleteButtons();
    initCommunicationButtons();
    initNotesButtons();
    initRecommendButtons();
}

// 添加新简历
function saveResume() {
    // 获取表单数据
    const formData = {
        id: window.mockData.resumes.length + 1,
        name: document.getElementById('name').value,
        gender: parseInt(document.getElementById('gender').value),
        age: parseInt(document.getElementById('age').value),
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        status: 0, // 默认为新简历
        position: document.getElementById('position').value,
        degree: parseInt(document.getElementById('degree').value),
        experience: parseInt(document.getElementById('experience').value),
        salary: Math.floor(Math.random() * 901) + 100, // 100~1000之间随机
        city: document.getElementById('city').value,
        source: document.getElementById('source').value,
        notes: document.getElementById('notes').value,
        createTime: new Date(),
        updateTime: new Date()
    };
    
    // 添加到模拟数据
    window.mockData.resumes.unshift(formData);
    
    // 保存数据到localStorage
    window.saveMockData();
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
    modal.hide();
    
    // 重新加载数据
    loadResumeData();
    
    // 重置表单
    document.getElementById('addResumeForm').reset();
}

// 更新简历
function updateResume() {
    // 获取简历ID
    const resumeId = parseInt(document.getElementById('edit-id').value);
    
    // 查找简历索引
    const resumeIndex = window.mockData.resumes.findIndex(resume => resume.id === resumeId);
    
    if (resumeIndex !== -1) {
        // 更新数据
        window.mockData.resumes[resumeIndex] = {
            ...window.mockData.resumes[resumeIndex],
            name: document.getElementById('edit-name').value,
            gender: parseInt(document.getElementById('edit-gender').value),
            age: parseInt(document.getElementById('edit-age').value),
            phone: document.getElementById('edit-phone').value,
            email: document.getElementById('edit-email').value,
            status: parseInt(document.getElementById('edit-status').value),
            position: document.getElementById('edit-position').value,
            degree: parseInt(document.getElementById('edit-degree').value),
            experience: parseInt(document.getElementById('edit-experience').value),
            city: document.getElementById('edit-city').value,
            source: document.getElementById('edit-source').value,
            notes: document.getElementById('edit-notes').value,
            updateTime: new Date()
        };
        
        // 保存数据到localStorage
        window.saveMockData();
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal.hide();
        
        // 重新加载数据
        loadResumeData();
    }
}

// 初始化查看按钮
function initViewButtons() {
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resumeId = parseInt(this.getAttribute('data-id'));
            viewResume(resumeId);
        });
    });
}

// 初始化编辑按钮
function initEditButtons() {
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resumeId = parseInt(this.getAttribute('data-id'));
            fillEditForm(resumeId);
        });
    });
}

// 初始化删除按钮
function initDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resumeId = parseInt(this.getAttribute('data-id'));
            deleteResume(resumeId);
        });
    });
}

// 查看简历详情
function viewResume(resumeId) {
    // 查找简历
    const resume = window.mockData.resumes.find(resume => resume.id === resumeId);
    
    if (resume) {
        // 在实际应用中，这里会跳转到详情页或打开详情模态框
        // 在原型中，我们只是弹出一个提示
        alert(`查看简历详情: ${resume.name}`);
    }
}

// 填充编辑表单
function fillEditForm(resumeId) {
    // 查找简历
    const resume = window.mockData.resumes.find(resume => resume.id === resumeId);
    
    if (resume) {
        // 填充表单字段
        document.getElementById('edit-id').value = resume.id;
        document.getElementById('edit-name').value = resume.name;
        document.getElementById('edit-gender').value = resume.gender;
        document.getElementById('edit-age').value = resume.age;
        document.getElementById('edit-phone').value = resume.phone;
        document.getElementById('edit-email').value = resume.email;
        document.getElementById('edit-position').value = resume.position;
        document.getElementById('edit-degree').value = resume.degree;
        document.getElementById('edit-experience').value = resume.experience;
        document.getElementById('edit-city').value = resume.city;
        document.getElementById('edit-source').value = resume.source;
        document.getElementById('edit-status').value = resume.status;
        document.getElementById('edit-salary').value = resume.salary + 'K';
        document.getElementById('edit-notes').value = resume.notes;
    }
}

// 删除简历
function deleteResume(resumeId) {
    // 查找简历
    const resume = window.mockData.resumes.find(resume => resume.id === resumeId);
    
    if (resume) {
        // 使用通用确认删除模态框
        window.showDeleteConfirmModal(
            '确认删除',
            `<p>您确定要删除 <strong>${resume.name}</strong> 的简历记录吗？</p>`,
            function() {
                // 查找简历索引
                const resumeIndex = window.mockData.resumes.findIndex(resume => resume.id === resumeId);
                
                if (resumeIndex !== -1) {
                    // 从数组中删除
                    window.mockData.resumes.splice(resumeIndex, 1);
                    
                    // 保存数据到localStorage
                    window.saveMockData();
                    
                    // 重新加载数据
                    loadResumeData();
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
                loadResumeData(newPage);
            }
        });
    });
}

// 获取学历文本
function getDegreeText(degree) {
    const degrees = ['高中', '专科', '本科', '硕士', '博士'];
    return degrees[degree] || '未知';
}

// 获取工作经验文本
function getExperienceText(experience) {
    if (experience === 0) return '应届毕业';
    if (experience === 10) return '10年以上';
    return `${experience}年`;
}

// 获取状态徽章
function getStatusBadge(status) {
    const badges = [
        '<span class="badge bg-primary">待业中</span>',
        '<span class="badge bg-danger">在职-不考虑机会</span>',
        '<span class="badge bg-warning">在职-考虑新机会</span>',
        '<span class="badge bg-secondary">未知</span>'
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

// 获取性别文本
function getGenderText(gender) {
    const genders = {
        0: '男',
        1: '女',
        2: '保密'
    };
    return genders[gender] || '未知';
}

// 相对时间格式化
function formatRelativeTime(date) {
    if (!date) return '';
    
    const now = new Date();
    const dateObj = new Date(date);
    const timeSpan = now - dateObj;
    
    // 小于10分钟显示"刚刚"
    if (timeSpan < 10 * 60 * 1000) {
        return "刚刚";
    }
    
    // 小于1小时显示"X分钟前"
    if (timeSpan < 60 * 60 * 1000) {
        return `${Math.floor(timeSpan / (60 * 1000))}分钟前`;
    }
    
    // 小于1天显示"X小时前"
    if (timeSpan < 24 * 60 * 60 * 1000) {
        return `${Math.floor(timeSpan / (60 * 60 * 1000))}小时前`;
    }
    
    // 小于7天显示"X天前"
    if (timeSpan < 7 * 24 * 60 * 60 * 1000) {
        return `${Math.floor(timeSpan / (24 * 60 * 60 * 1000))}天前`;
    }
    
    // 小于30天显示"X周前"
    if (timeSpan < 30 * 24 * 60 * 60 * 1000) {
        return `${Math.floor(timeSpan / (7 * 24 * 60 * 60 * 1000))}周前`;
    }
    
    // 小于365天显示"MM月dd日"
    if (timeSpan < 365 * 24 * 60 * 60 * 1000) {
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${month}月${day}日`;
    }
    
    // 大于等于365天显示"yyyy-MM-dd"
    return formatDate(date);
}

// 初始化备注按钮
function initNotesButtons() {
    const notesButtons = document.querySelectorAll('.btn-notes');
    notesButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const resumeId = parseInt(this.getAttribute('data-id'));
            
            // 查找简历
            const resume = window.mockData.resumes.find(resume => resume.id === resumeId);
            
            if (resume) {
                // 设置备注内容
                document.getElementById('notes-name').textContent = `${resume.name} 的备注`;
                document.getElementById('notes-content').textContent = resume.notes || '暂无备注信息';
                document.getElementById('notes-resumeId').value = resumeId;
                
                // 重置为查看模式
                setNotesModalMode('view');
                
                // 获取表格元素的位置
                const table = document.querySelector('.table');
                const tableRect = table.getBoundingClientRect();
                
                // 获取模态窗口元素
                const modalEl = document.getElementById('notesModal');
                const modalDialog = modalEl.querySelector('.modal-dialog');
                
                // 预先设置模态窗口位置，使其在表格中央
                modalDialog.style.position = 'fixed';
                modalDialog.style.margin = '0';
                modalDialog.style.transform = 'none';
                
                // 计算表格中心位置
                const tableCenter = {
                    x: tableRect.left + tableRect.width / 2,
                    y: tableRect.top + tableRect.height / 2
                };
                
                // 固定宽度为600px，获取窗口实际高度
                const modalWidth = 600;
                
                // 在打开窗口前先显示并隐藏它以获取实际高度
                modalEl.style.display = 'block';
                modalEl.style.visibility = 'hidden';
                const modalHeight = modalDialog.offsetHeight;
                modalEl.style.display = '';
                modalEl.style.visibility = '';
                
                // 设置模态窗口位置
                modalDialog.style.left = `${tableCenter.x - modalWidth / 2}px`;
                modalDialog.style.top = `${tableCenter.y - modalHeight / 2}px`;
                
                // 手动打开模态窗口
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
                
                // 在模态窗口显示后，再次调整位置以确保居中
                modalEl.addEventListener('shown.bs.modal', function() {
                    // 获取实际高度
                    const actualHeight = modalDialog.offsetHeight;
                    modalDialog.style.top = `${tableCenter.y - actualHeight / 2}px`;
                }, {once: true});
                
                // 在模态窗口关闭后清理样式
                modalEl.addEventListener('hidden.bs.modal', function() {
                    // 移除动态样式
                    modalDialog.style.position = '';
                    modalDialog.style.margin = '';
                    modalDialog.style.transform = '';
                    modalDialog.style.left = '';
                    modalDialog.style.top = '';
                    
                    // 确保背景蒙版被正确移除
                    if (document.body.classList.contains('modal-open')) {
                        document.body.classList.remove('modal-open');
                    }
                    
                    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                }, {once: true});
            }
        });
    });
    
    // 初始化编辑按钮
    document.getElementById('editNotesBtn').addEventListener('click', function() {
        const resumeId = parseInt(document.getElementById('notes-resumeId').value);
        const resume = window.mockData.resumes.find(resume => resume.id === resumeId);
        
        if (resume) {
            // 设置编辑内容
            document.getElementById('notes-edit-content').value = resume.notes || '';
            setNotesModalMode('edit');
        }
    });
    
    // 初始化保存按钮
    document.getElementById('saveNotesBtn').addEventListener('click', function() {
        const resumeId = parseInt(document.getElementById('notes-resumeId').value);
        const notes = document.getElementById('notes-edit-content').value;
        
        // 查找并更新简历
        const resumeIndex = window.mockData.resumes.findIndex(resume => resume.id === resumeId);
        if (resumeIndex !== -1) {
            window.mockData.resumes[resumeIndex].notes = notes;
            window.mockData.resumes[resumeIndex].updateTime = new Date();
            
            // 更新显示内容
            document.getElementById('notes-content').textContent = notes || '暂无备注信息';
            
            // 切换回查看模式
            setNotesModalMode('view');
        }
    });
    
    // 初始化取消按钮
    document.getElementById('cancelEditBtn').addEventListener('click', function() {
        setNotesModalMode('view');
    });
}

// 设置备注模态窗口模式（查看或编辑）
function setNotesModalMode(mode) {
    const viewElements = document.querySelectorAll('.view-mode');
    const editElements = document.querySelectorAll('.edit-mode');
    
    if (mode === 'edit') {
        viewElements.forEach(el => el.style.display = 'none');
        editElements.forEach(el => el.style.display = 'block');
    } else {
        viewElements.forEach(el => el.style.display = 'block');
        editElements.forEach(el => el.style.display = 'none');
    }
}

// 初始化沟通记录按钮
function initCommunicationButtons() {
    const communicationButtons = document.querySelectorAll('.btn-communication');
    communicationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const resumeId = parseInt(this.getAttribute('data-id'));
            prepareAddCommunication(resumeId);
            
            // 使用Bootstrap内置功能打开模态窗口
            const modalEl = document.getElementById('communicationModal');
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        });
    });
}

// 准备添加沟通记录
function prepareAddCommunication(resumeId) {
    // 查找简历
    const resume = window.mockData.resumes.find(resume => resume.id === resumeId);
    
    if (resume) {
        // 设置简历ID
        document.getElementById('communication-resumeId').value = resumeId;
        
        // 设置默认日期为当前时间
        const now = new Date();
        const dateTimeLocal = now.toISOString().slice(0, 16);
        document.getElementById('communication-date').value = dateTimeLocal;
        
        // 重置表单
        document.getElementById('communication-type').value = '电话';
        document.getElementById('communication-content').value = '';
        document.getElementById('communication-result').value = '待定';
        document.getElementById('communication-notes').value = '';
        
        // 加载意向职位下拉列表
        loadPositionsForCommunication();
    }
}

// 加载职位列表用于沟通记录
function loadPositionsForCommunication() {
    const positionSelect = document.getElementById('communication-position');
    
    // 清空现有选项，只保留"请选择..."
    while (positionSelect.options.length > 1) {
        positionSelect.remove(1);
    }
    
    // 确保职位数据存在
    if (window.mockData && window.mockData.positions) {
        // 从职位数据中获取职位列表并添加到下拉框
        window.mockData.positions.forEach(position => {
            const option = document.createElement('option');
            option.value = `${position.id}-${position.title}-${position.company}`;
            option.textContent = `${position.id}-${position.title}-${position.company}`;
            positionSelect.appendChild(option);
        });
    } else {
        // 如果没有职位数据，添加一些默认值
        const defaultPositions = [
            {id: 1, title: '前端开发工程师', company: '腾讯科技'},
            {id: 2, title: '后端开发工程师', company: '阿里巴巴'},
            {id: 3, title: '全栈开发工程师', company: '百度'},
            {id: 4, title: 'UI设计师', company: '字节跳动'},
            {id: 5, title: '产品经理', company: '美团'},
            {id: 6, title: '项目经理', company: '京东'},
            {id: 7, title: '测试工程师', company: '小米'},
            {id: 8, title: '运维工程师', company: '华为'},
            {id: 9, title: '数据分析师', company: '网易'},
            {id: 10, title: '人力资源专员', company: '滴滴出行'}
        ];
        
        defaultPositions.forEach(position => {
            const option = document.createElement('option');
            option.value = `${position.id}-${position.title}-${position.company}`;
            option.textContent = `${position.id}-${position.title}-${position.company}`;
            positionSelect.appendChild(option);
        });
    }
}

// 保存沟通记录
function saveCommunication() {
    // 获取表单数据
    const formData = {
        id: window.mockData.communications.length + 1,
        resumeId: parseInt(document.getElementById('communication-resumeId').value),
        type: document.getElementById('communication-type').value,
        date: new Date(document.getElementById('communication-date').value),
        content: document.getElementById('communication-content').value,
        result: document.getElementById('communication-result').value,
        notes: document.getElementById('communication-notes').value,
        position: document.getElementById('communication-position').value
    };
    
    // 添加到模拟数据
    window.mockData.communications.push(formData);
    
    // 更新简历的更新时间
    const resumeIndex = window.mockData.resumes.findIndex(resume => resume.id === formData.resumeId);
    if (resumeIndex !== -1) {
        window.mockData.resumes[resumeIndex].updateTime = new Date();
    }
    
    // 保存数据到localStorage
    window.saveMockData();
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('communicationModal'));
    modal.hide();
    
    // 显示成功提示
    alert('沟通记录已保存成功！');
    
    // 重新加载数据以更新时间戳
    loadResumeData();
}

// 初始化简历详情按钮事件
function initDetailButtons() {
    // 使用事件委托，在表格容器上监听点击事件
    const tableBody = document.getElementById('resumeTableBody');
    
    // 移除之前可能存在的事件监听器（通过克隆和替换节点）
    const newTableBody = tableBody.cloneNode(true);
    tableBody.parentNode.replaceChild(newTableBody, tableBody);
    
    // 为新的表格体添加事件监听
    document.getElementById('resumeTableBody').addEventListener('click', function(event) {
        // 向上遍历查找最近的按钮元素
        let target = event.target;
        
        // 如果点击的是图标，需要找到其父按钮
        if (target.tagName.toLowerCase() === 'i') {
            target = target.parentNode;
        }
        
        // 检查是否点击了详情按钮
        if (target.classList.contains('btn-detail')) {
            const resumeId = parseInt(target.getAttribute('data-id'));
            showResumeDetail(resumeId);
        }
    });
}

// 显示简历详情
function showResumeDetail(resumeId) {
    // 获取简历数据
    const resume = window.mockData.resumes.find(r => r.id === resumeId);
    if (!resume) return;
    
    // 填充简历详情
    document.getElementById('detail-name').textContent = resume.name;
    document.getElementById('detail-gender').textContent = getGenderText(resume.gender);
    document.getElementById('detail-age').textContent = resume.age;
    document.getElementById('detail-phone').textContent = resume.phone;
    document.getElementById('detail-email').textContent = resume.email;
    document.getElementById('detail-city').textContent = resume.city;
    document.getElementById('detail-position').textContent = resume.position;
    document.getElementById('detail-degree').textContent = getDegreeText(resume.degree);
    document.getElementById('detail-experience').textContent = getExperienceText(resume.experience);
    document.getElementById('detail-salary').textContent = resume.salary + 'K';
    document.getElementById('detail-source').textContent = resume.source;
    document.getElementById('detail-status').textContent = getStatusText(resume.status);
    document.getElementById('detail-updateTime').textContent = formatDate(resume.updateTime);
    document.getElementById('detail-notes').textContent = resume.notes || '暂无备注';
    
    // 加载工作经历
    loadWorkExperiences(resumeId);
    
    // 加载教育经历
    loadEducationExperiences(resumeId);
    
    // 设置添加工作经历按钮的事件
    document.getElementById('addWorkExperienceBtn').onclick = function() {
        // 不关闭简历详情模态框，直接打开工作经历模态框
        prepareAddWorkExperience(resumeId);
        
        // 手动打开模态框
        const modalEl = document.getElementById('workExperienceModal');
        const modal = new bootstrap.Modal(modalEl);
        
        // 直接显示模态框，centerModal已通过show.bs.modal事件绑定
        modal.show();
    };
    
    // 设置添加教育经历按钮的事件
    document.getElementById('addEducationBtn').onclick = function() {
        // 不关闭简历详情模态框，直接打开教育经历模态框
        prepareAddEducation(resumeId);
        
        // 手动打开模态框
        const modalEl = document.getElementById('educationModal');
        const modal = new bootstrap.Modal(modalEl);
        
        // 直接显示模态框，centerModal已通过show.bs.modal事件绑定
        modal.show();
    };
    
    // 显示模态框
    const resumeDetailModalElement = document.getElementById('resumeDetailModal');
    let resumeDetailModal = bootstrap.Modal.getInstance(resumeDetailModalElement);
    
    // 如果模态框实例不存在，则创建新实例
    if (!resumeDetailModal) {
        resumeDetailModal = new bootstrap.Modal(resumeDetailModalElement);
    }
    
    // 在模态窗口关闭后清理
    resumeDetailModalElement.addEventListener('hidden.bs.modal', function() {
        // 确保背景蒙版被正确移除
        if (document.body.classList.contains('modal-open')) {
            document.body.classList.remove('modal-open');
        }
        
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    }, {once: true});
    
    resumeDetailModal.show();
}

// 加载工作经历
function loadWorkExperiences(resumeId) {
    const workExperienceList = document.getElementById('workExperienceList');
    const noWorkExperienceMsg = document.getElementById('noWorkExperienceMsg');
    
    // 清空工作经历列表
    workExperienceList.innerHTML = '';
    workExperienceList.appendChild(noWorkExperienceMsg);
    
    // 确保workExperiences数组存在
    if (!window.mockData.workExperiences) {
        window.mockData.workExperiences = [];
        return;
    }
    
    // 获取当前简历的所有工作经历
    const workExperiences = window.mockData.workExperiences.filter(w => w.resumeId === resumeId);
    
    // 按工作开始时间倒序排序
    workExperiences.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    
    if (workExperiences.length === 0) {
        // 如果没有工作经历，显示提示信息
        noWorkExperienceMsg.style.display = 'block';
    } else {
        // 隐藏提示信息
        noWorkExperienceMsg.style.display = 'none';
        
        // 创建工作经历列表
        workExperiences.forEach(work => {
            const workItem = document.createElement('div');
            workItem.className = 'card mb-3 shadow-sm';
            
            // 格式化日期
            const startDate = formatDate(work.startDate);
            const endDate = work.current ? '至今' : formatDate(work.endDate);
            
            workItem.innerHTML = `
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <div>
                        <span class="fw-bold">${work.company}</span>
                        <span class="badge bg-primary ms-2">${work.position}</span>
                    </div>
                    <div>
                        <small class="me-2">${startDate} - ${endDate}</small>
                        <button type="button" class="btn btn-sm btn-outline-primary edit-work-btn me-1" data-id="${work.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger delete-work-btn" data-id="${work.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    ${work.department ? `<p class="card-text"><small class="text-muted">部门: ${work.department}</small></p>` : ''}
                    <p class="card-text">${work.description || '无工作描述'}</p>
                </div>
            `;
            
            workExperienceList.appendChild(workItem);
            
            // 添加编辑按钮事件
            workItem.querySelector('.edit-work-btn').addEventListener('click', function() {
                const workId = parseInt(this.getAttribute('data-id'));
                editWorkExperience(workId, resumeId);
            });
            
            // 添加删除按钮事件
            workItem.querySelector('.delete-work-btn').addEventListener('click', function() {
                const workId = parseInt(this.getAttribute('data-id'));
                deleteWorkExperience(workId, resumeId);
            });
        });
    }
}

// 加载教育经历
function loadEducationExperiences(resumeId) {
    const educationList = document.getElementById('educationList');
    const noEducationMsg = document.getElementById('noEducationMsg');
    
    // 清空教育经历列表
    educationList.innerHTML = '';
    educationList.appendChild(noEducationMsg);
    
    // 确保educations数组存在
    if (!window.mockData.educations) {
        window.mockData.educations = [];
        return;
    }
    
    // 获取当前简历的所有教育经历
    const educations = window.mockData.educations.filter(edu => edu.resumeId === resumeId);
    
    // 按教育结束时间倒序排序
    educations.sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
    
    if (educations.length === 0) {
        // 如果没有教育经历，显示提示信息
        noEducationMsg.style.display = 'block';
    } else {
        // 隐藏提示信息
        noEducationMsg.style.display = 'none';
        
        // 创建教育经历列表
        educations.forEach(edu => {
            const eduItem = document.createElement('div');
            eduItem.className = 'card mb-3 shadow-sm';
            
            // 格式化日期
            const startDate = formatDate(edu.startDate);
            const endDate = formatDate(edu.endDate);
            
            eduItem.innerHTML = `
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                    <div>
                        <span class="fw-bold">${edu.school}</span>
                        <span class="badge bg-success ms-2">${getDegreeText(edu.degree)}</span>
                    </div>
                    <div>
                        <small class="me-2">${startDate} - ${endDate}</small>
                        <button type="button" class="btn btn-sm btn-outline-primary edit-education-btn me-1" data-id="${edu.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-danger delete-education-btn" data-id="${edu.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <p class="card-text">专业: ${edu.major}</p>
                </div>
            `;
            
            educationList.appendChild(eduItem);
            
            // 添加编辑按钮事件
            eduItem.querySelector('.edit-education-btn').addEventListener('click', function() {
                const eduId = parseInt(this.getAttribute('data-id'));
                editEducation(eduId, resumeId);
            });
            
            // 添加删除按钮事件
            eduItem.querySelector('.delete-education-btn').addEventListener('click', function() {
                const eduId = parseInt(this.getAttribute('data-id'));
                deleteEducation(eduId, resumeId);
            });
        });
    }
}

// 编辑工作经历
function editWorkExperience(workId, resumeId) {
    // 查找工作经历
    const workExperience = window.mockData.workExperiences.find(w => w.id === workId);
    
    if (workExperience) {
        // 先关闭简历详情模态框
        const detailModal = bootstrap.Modal.getInstance(document.getElementById('resumeDetailModal'));
        detailModal.hide();
        
        // 延迟一下再打开工作经历模态框，避免冲突
        setTimeout(() => {
            // 设置工作经历ID
            document.getElementById('work-resumeId').value = resumeId;
            
            // 填充表单数据
            document.getElementById('work-company').value = workExperience.company;
            document.getElementById('work-position').value = workExperience.position;
            document.getElementById('work-department').value = workExperience.department || '';
            
            // 格式化日期为YYYY-MM-DD格式
            const startDateObj = new Date(workExperience.startDate);
            const startDateFormatted = startDateObj.toISOString().split('T')[0];
            document.getElementById('work-start-date').value = startDateFormatted;
            
            // 设置是否为当前工作
            const isCurrent = workExperience.current;
            document.getElementById('work-current').checked = isCurrent;
            
            // 设置结束日期
            const endDateInput = document.getElementById('work-end-date');
            endDateInput.disabled = isCurrent;
            
            if (!isCurrent && workExperience.endDate) {
                const endDateObj = new Date(workExperience.endDate);
                const endDateFormatted = endDateObj.toISOString().split('T')[0];
                endDateInput.value = endDateFormatted;
            } else {
                endDateInput.value = '';
            }
            
            // 设置工作描述
            document.getElementById('work-description').value = workExperience.description || '';
            
            // 修改保存按钮行为
            const saveBtn = document.getElementById('saveWorkExperienceBtn');
            saveBtn.setAttribute('data-mode', 'edit');
            saveBtn.setAttribute('data-id', workId);
            
            // 修改标题
            document.getElementById('workExperienceModalLabel').textContent = '编辑工作经历';
            
            // 确保模态框背景正确移除
            document.body.classList.remove('modal-open');
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            
            // 手动打开模态框
            const modalEl = document.getElementById('workExperienceModal');
            const modal = new bootstrap.Modal(modalEl);
            
            // 直接显示模态框，centerModal已通过show.bs.modal事件绑定
            modal.show();
        }, 500);
    }
}

// 编辑教育经历
function editEducation(eduId, resumeId) {
    // 查找教育经历
    const education = window.mockData.educations.find(edu => edu.id === eduId);
    
    if (education) {
        // 先关闭简历详情模态框
        const detailModal = bootstrap.Modal.getInstance(document.getElementById('resumeDetailModal'));
        detailModal.hide();
        
        // 延迟一下再打开教育经历模态框，避免冲突
        setTimeout(() => {
            // 设置教育经历ID
            document.getElementById('education-resumeId').value = resumeId;
            
            // 填充表单数据
            document.getElementById('education-school').value = education.school;
            document.getElementById('education-degree').value = education.degree;
            document.getElementById('education-major').value = education.major;
            
            // 格式化日期为YYYY-MM-DD格式
            const startDateObj = new Date(education.startDate);
            const startDateFormatted = startDateObj.toISOString().split('T')[0];
            document.getElementById('education-start-date').value = startDateFormatted;
            
            const endDateObj = new Date(education.endDate);
            const endDateFormatted = endDateObj.toISOString().split('T')[0];
            document.getElementById('education-end-date').value = endDateFormatted;
            
            // 修改保存按钮行为
            const saveBtn = document.getElementById('saveEducationBtn');
            saveBtn.setAttribute('data-mode', 'edit');
            saveBtn.setAttribute('data-id', eduId);
            
            // 修改标题
            document.getElementById('educationModalLabel').textContent = '编辑教育经历';
            
            // 确保模态框背景正确移除
            document.body.classList.remove('modal-open');
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            
            // 手动打开模态框
            const modalEl = document.getElementById('educationModal');
            const modal = new bootstrap.Modal(modalEl);
            
            // 直接显示模态框，centerModal已通过show.bs.modal事件绑定
            modal.show();
        }, 500);
    }
}

// 保存工作经历后的处理
function saveWorkExperienceSuccess(resumeId) {
    // 刷新工作经历列表
    loadWorkExperiences(resumeId);
    
    // 不需要重新打开简历详情模态框，因为它已经打开了
}

// 保存教育经历后的处理
function saveEducationSuccess(resumeId) {
    // 刷新教育经历列表
    loadEducationExperiences(resumeId);
    
    // 不需要重新打开简历详情模态框，因为它已经打开了
}

// 保存工作经历
function saveWorkExperience() {
    // 获取表单数据
    const formData = {
        id: document.getElementById('work-id')?.value || window.mockData.workExperiences.length + 1,
        resumeId: parseInt(document.getElementById('work-resumeId').value),
        company: document.getElementById('work-company').value,
        position: document.getElementById('work-position').value,
        department: document.getElementById('work-department').value,
        startDate: new Date(document.getElementById('work-start-date').value),
        current: document.getElementById('work-current').checked,
        description: document.getElementById('work-description').value,
        createTime: new Date()
    };
    
    // 设置结束日期，如果"至今"被选中则为null
    if (formData.current) {
        formData.endDate = null;
    } else {
        const endDateValue = document.getElementById('work-end-date').value;
        formData.endDate = endDateValue ? new Date(endDateValue) : null;
    }
    
    // 检查是否是编辑模式
    const isEdit = document.getElementById('work-id')?.value;
    
    if (isEdit) {
        // 编辑模式 - 更新现有记录
        const index = window.mockData.workExperiences.findIndex(work => work.id === parseInt(isEdit));
        if (index !== -1) {
            window.mockData.workExperiences[index] = formData;
        }
    } else {
        // 新增模式 - 添加新记录
        window.mockData.workExperiences.push(formData);
    }
    
    // 更新简历的更新时间
    const resumeIndex = window.mockData.resumes.findIndex(resume => resume.id === formData.resumeId);
    if (resumeIndex !== -1) {
        window.mockData.resumes[resumeIndex].updateTime = new Date();
    }
    
    // 保存数据到localStorage
    window.saveMockData();
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('workExperienceModal'));
    modal.hide();
    
    // 显示成功提示和重新加载工作经历列表
    saveWorkExperienceSuccess(formData.resumeId);
}

// 保存教育经历
function saveEducation() {
    // 获取表单数据
    const formData = {
        id: document.getElementById('education-id')?.value || window.mockData.educations.length + 1,
        resumeId: parseInt(document.getElementById('education-resumeId').value),
        school: document.getElementById('education-school').value,
        degree: parseInt(document.getElementById('education-degree').value),
        major: document.getElementById('education-major').value,
        startDate: new Date(document.getElementById('education-start-date').value),
        endDate: new Date(document.getElementById('education-end-date').value),
        createTime: new Date()
    };
    
    // 检查是否是编辑模式
    const isEdit = document.getElementById('education-id')?.value;
    
    if (isEdit) {
        // 编辑模式 - 更新现有记录
        const index = window.mockData.educations.findIndex(edu => edu.id === parseInt(isEdit));
        if (index !== -1) {
            window.mockData.educations[index] = formData;
        }
    } else {
        // 新增模式 - 添加新记录
        window.mockData.educations.push(formData);
    }
    
    // 更新简历的更新时间
    const resumeIndex = window.mockData.resumes.findIndex(resume => resume.id === formData.resumeId);
    if (resumeIndex !== -1) {
        window.mockData.resumes[resumeIndex].updateTime = new Date();
    }
    
    // 保存数据到localStorage
    window.saveMockData();
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('educationModal'));
    modal.hide();
    
    // 显示成功提示和重新加载教育经历列表
    saveEducationSuccess(formData.resumeId);
}

// 获取状态文本（不带badge样式）
function getStatusText(status) {
    switch (parseInt(status)) {
        case 0: return '待业中';
        case 1: return '在职-不考虑机会';
        case 2: return '在职-考虑新机会';
        case 3: return '未知';
        default: return '未知';
    }
}

// 获取沟通结果的样式类
function getResultBadgeClass(result) {
    switch (result) {
        case '有意向': return 'bg-success';
        case '无意向': return 'bg-danger';
        case '待定': return 'bg-warning';
        case '未响应': return 'bg-secondary';
        case '进一步沟通': return 'bg-info';
        default: return 'bg-primary';
    }
}

// 准备添加工作经历
function prepareAddWorkExperience(resumeId) {
    // 设置简历ID
    document.getElementById('work-resumeId').value = resumeId;
    
    // 重置表单
    document.getElementById('workExperienceForm').reset();
    
    // 默认启用结束日期输入框
    document.getElementById('work-end-date').disabled = false;
    
    // 重置保存按钮状态
    const saveBtn = document.getElementById('saveWorkExperienceBtn');
    saveBtn.removeAttribute('data-mode');
    saveBtn.removeAttribute('data-id');
    
    // 重置标题
    document.getElementById('workExperienceModalLabel').textContent = '添加工作经历';
}

// 准备添加教育经历
function prepareAddEducation(resumeId) {
    // 设置简历ID
    document.getElementById('education-resumeId').value = resumeId;
    
    // 重置表单
    document.getElementById('educationForm').reset();
    
    // 设置默认学历为本科
    document.getElementById('education-degree').value = '2';
    
    // 重置保存按钮状态
    const saveBtn = document.getElementById('saveEducationBtn');
    saveBtn.removeAttribute('data-mode');
    saveBtn.removeAttribute('data-id');
    
    // 重置标题
    document.getElementById('educationModalLabel').textContent = '添加教育经历';
}

// 初始化所有模态框的居中显示
function initModalCentering() {
    // 获取工作经历和教育经历模态框
    const workExperienceModal = document.getElementById('workExperienceModal');
    const educationModal = document.getElementById('educationModal');
    
    // 为模态框添加show.bs.modal事件监听器，在显示前进行居中
    if (workExperienceModal) {
        workExperienceModal.addEventListener('show.bs.modal', centerModal);
    }
    
    if (educationModal) {
        educationModal.addEventListener('show.bs.modal', centerModal);
    }
}

// 将模态窗口居中显示
function centerModal() {
    const modalDialog = this.querySelector('.modal-dialog');
    if (!modalDialog) return;
    
    // 重置之前可能存在的样式
    modalDialog.style.position = '';
    modalDialog.style.top = '';
    modalDialog.style.left = '';
    modalDialog.style.transform = '';
    modalDialog.style.margin = '';
    
    // 设置完全居中样式
    modalDialog.style.position = 'fixed';
    modalDialog.style.top = '50%';
    modalDialog.style.left = '50%';
    modalDialog.style.transform = 'translate(-50%, -50%)';
    modalDialog.style.margin = '0';
    
    // 确保工作经历和教育经历模态框有更高的z-index，使其在简历详情模态框之上
    if (this.id === 'workExperienceModal' || this.id === 'educationModal') {
        this.style.zIndex = '1070'; // 比简历详情模态框高
    } else {
        this.style.zIndex = '1060'; // Bootstrap默认模态框z-index为1050
    }
}

// 初始化推荐按钮
function initRecommendButtons() {
    const recommendButtons = document.querySelectorAll('.btn-recommend');
    recommendButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resumeId = parseInt(this.getAttribute('data-id'));
            prepareAddRecommend(resumeId);
            
            // 获取表格元素的位置
            const table = document.querySelector('.table');
            const tableRect = table.getBoundingClientRect();
            
            // 获取模态窗口元素
            const modalEl = document.getElementById('recommendModal');
            const modalDialog = modalEl.querySelector('.modal-dialog');
            
            // 预先设置模态窗口位置，使其在表格中央
            modalDialog.style.position = 'fixed';
            modalDialog.style.margin = '0';
            modalDialog.style.transform = 'none';
            
            // 计算表格中心位置
            const tableCenter = {
                x: tableRect.left + tableRect.width / 2,
                y: tableRect.top + tableRect.height / 2
            };
            
            // 固定宽度为600px，获取窗口实际高度
            const modalWidth = 600;
            
            // 在打开窗口前先显示并隐藏它以获取实际高度
            modalEl.style.display = 'block';
            modalEl.style.visibility = 'hidden';
            const modalHeight = modalDialog.offsetHeight;
            modalEl.style.display = '';
            modalEl.style.visibility = '';
            
            // 设置模态窗口位置
            modalDialog.style.left = `${tableCenter.x - modalWidth / 2}px`;
            modalDialog.style.top = `${tableCenter.y - modalHeight / 2}px`;
            
            // 手动打开模态窗口
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
            
            // 在模态窗口显示后，再次调整位置以确保居中
            modalEl.addEventListener('shown.bs.modal', function() {
                // 获取实际高度
                const actualHeight = modalDialog.offsetHeight;
                modalDialog.style.top = `${tableCenter.y - actualHeight / 2}px`;
            }, {once: true});
            
            // 在模态窗口关闭后清理样式
            modalEl.addEventListener('hidden.bs.modal', function() {
                // 移除动态样式
                modalDialog.style.position = '';
                modalDialog.style.margin = '';
                modalDialog.style.transform = '';
                modalDialog.style.left = '';
                modalDialog.style.top = '';
                
                // 确保背景蒙版被正确移除
                if (document.body.classList.contains('modal-open')) {
                    document.body.classList.remove('modal-open');
                }
                
                document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            }, {once: true});
        });
    });
}

// 准备添加推荐
function prepareAddRecommend(resumeId) {
    // 设置简历ID
    document.getElementById('recommend-resumeId').value = resumeId;
    
    // 重置表单
    document.getElementById('recommendForm').reset();
    
    // 加载职位列表
    loadPositionsForRecommend();
    
    // 重置标题
    document.getElementById('recommendModalLabel').textContent = '推荐人才';
}

// 加载职位列表用于推荐
function loadPositionsForRecommend() {
    const positionSelect = document.getElementById('recommend-position');
    
    // 清空现有选项，只保留"请选择..."
    while (positionSelect.options.length > 1) {
        positionSelect.remove(1);
    }
    
    // 确保职位数据存在
    if (window.mockData && window.mockData.positions) {
        // 从职位数据中获取职位列表并添加到下拉框
        window.mockData.positions.forEach(position => {
            const option = document.createElement('option');
            option.value = `${position.id}-${position.title}-${position.company}`;
            option.textContent = `${position.id}-${position.title}-${position.company}`;
            positionSelect.appendChild(option);
        });
    } else {
        // 如果没有职位数据，添加一些默认值
        const defaultPositions = [
            {id: 1, title: '前端开发工程师', company: '腾讯科技'},
            {id: 2, title: '后端开发工程师', company: '阿里巴巴'},
            {id: 3, title: '全栈开发工程师', company: '百度'},
            {id: 4, title: 'UI设计师', company: '字节跳动'},
            {id: 5, title: '产品经理', company: '美团'},
            {id: 6, title: '项目经理', company: '京东'},
            {id: 7, title: '测试工程师', company: '小米'},
            {id: 8, title: '运维工程师', company: '华为'},
            {id: 9, title: '数据分析师', company: '网易'},
            {id: 10, title: '人力资源专员', company: '滴滴出行'}
        ];
        
        defaultPositions.forEach(position => {
            const option = document.createElement('option');
            option.value = `${position.id}-${position.title}-${position.company}`;
            option.textContent = `${position.id}-${position.title}-${position.company}`;
            positionSelect.appendChild(option);
        });
    }
}

// 保存推荐
function saveRecommend() {
    // 获取表单数据
    const resumeId = parseInt(document.getElementById('recommend-resumeId').value);
    const position = document.getElementById('recommend-position').value;
    const comment = document.getElementById('recommend-content').value;
    
    // 验证表单
    if (!position || !comment) {
        alert('请填写所有必填字段');
        return;
    }
    
    // 从选择的职位值中提取职位ID、职位名称和公司
    const [positionId, positionTitle, company] = position.split('-');
    
    // 设置职位ID为数字类型
    let positionIdToUse = parseInt(positionId);
    
    // 查找职位是否存在
    const existingPosition = window.mockData.positions.find(p => p.id === positionIdToUse);
    
    // 如果职位不存在，创建一个新职位
    if (!existingPosition) {
        window.mockData.positions.push({
            id: positionIdToUse,
            title: positionTitle,
            company: company,
            status: 1, // 默认为开放状态
            recruiter: 1, // 默认招聘人员
            createTime: new Date()
        });
    }
    
    // 生成随机匹配分数(60-95)
    const score = Math.floor(Math.random() * 36) + 60;
    
    // 创建推荐对象
    const recommendation = {
        id: (window.mockData.recommendations?.length || 0) + 1,
        positionId: positionIdToUse,
        resumeId: resumeId,
        score: score,
        comment: comment,
        createdBy: '招聘顾问',
        createTime: new Date()
    };
    
    // 确保recommendations数组存在
    if (!window.mockData.recommendations) {
        window.mockData.recommendations = [];
    }
    
    // 添加到模拟数据
    window.mockData.recommendations.unshift(recommendation);
    
    // 更新简历的更新时间
    const resumeIndex = window.mockData.resumes.findIndex(resume => resume.id === resumeId);
    if (resumeIndex !== -1) {
        window.mockData.resumes[resumeIndex].updateTime = new Date();
    }
    
    // 保存数据到localStorage
    window.saveMockData();
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('recommendModal'));
    modal.hide();
    
    // 显示成功提示
    alert('推荐已添加成功！');
    
    // 重新加载数据以更新时间戳
    loadResumeData();
}

// 删除工作经历
function deleteWorkExperience(workId, resumeId) {
    // 查找工作经历
    const workExperience = window.mockData.workExperiences.find(work => work.id === workId);
    
    if (workExperience) {
        // 使用通用确认删除模态框
        window.showDeleteConfirmModal(
            '确认删除',
            `<p>您确定要删除在 <strong>${workExperience.company}</strong> 的工作经历吗？</p>`,
            function() {
                // 找到要删除的工作经历索引
                const index = window.mockData.workExperiences.findIndex(work => work.id === workId);
                
                if (index !== -1) {
                    // 从数组中移除
                    window.mockData.workExperiences.splice(index, 1);
                    
                    // 更新简历的更新时间
                    const resumeIndex = window.mockData.resumes.findIndex(resume => resume.id === resumeId);
                    if (resumeIndex !== -1) {
                        window.mockData.resumes[resumeIndex].updateTime = new Date();
                    }
                    
                    // 保存数据到localStorage
                    window.saveMockData();
                    
                    // 重新加载工作经历列表
                    loadWorkExperiences(resumeId);
                }
            }
        );
    }
}

// 删除教育经历
function deleteEducation(eduId, resumeId) {
    // 查找教育经历
    const education = window.mockData.educations.find(edu => edu.id === eduId);
    
    if (education) {
        // 使用通用确认删除模态框
        window.showDeleteConfirmModal(
            '确认删除',
            `<p>您确定要删除在 <strong>${education.school}</strong> 的教育经历吗？</p>`,
            function() {
                // 找到要删除的教育经历索引
                const index = window.mockData.educations.findIndex(edu => edu.id === eduId);
                
                if (index !== -1) {
                    // 从数组中移除
                    window.mockData.educations.splice(index, 1);
                    
                    // 更新简历的更新时间
                    const resumeIndex = window.mockData.resumes.findIndex(resume => resume.id === resumeId);
                    if (resumeIndex !== -1) {
                        window.mockData.resumes[resumeIndex].updateTime = new Date();
                    }
                    
                    // 保存数据到localStorage
                    window.saveMockData();
                    
                    // 重新加载教育经历列表
                    loadEducationExperiences(resumeId);
                }
            }
        );
    }
} 