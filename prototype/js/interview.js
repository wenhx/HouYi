// 面试记录页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 确保mockData已经加载
    if (!window.mockData || !window.mockData.interviews) {
        // 创建一个临时的mockData对象
        window.mockData = window.mockData || {};
        window.mockData.interviews = [];
        window.mockData.resumes = [];
        window.mockData.positions = [];
        
        // 动态加载mockData.js
        const script = document.createElement('script');
        script.src = '../js/data/mockData.js';
        script.onload = function() {
            // mockData.js加载完成后，调用加载面试数据的函数
            loadInterviewData();
            loadTodayInterviews();
            // 加载下拉选项
            loadResumeOptions();
            loadPositionOptions();
            // 初始化快速输入按钮
            initQuickLocationButtons();
        };
        document.head.appendChild(script);
    } else {
        // 如果mockData已经存在，直接加载面试数据
        loadInterviewData();
        loadTodayInterviews();
        // 加载下拉选项
        loadResumeOptions();
        loadPositionOptions();
        // 初始化快速输入按钮
        initQuickLocationButtons();
    }
    
    // 初始化添加面试按钮
    document.getElementById('saveInterviewBtn').addEventListener('click', saveInterview);
    
    // 初始化编辑面试按钮
    document.getElementById('updateInterviewBtn').addEventListener('click', updateInterview);
    
    // 初始化提交反馈按钮
    document.getElementById('submitFeedbackBtn').addEventListener('click', submitFeedback);
    
    // 初始化每页显示数量选择器
    initPageSize(loadInterviewData);
});

// 初始化每页显示数量选择器
function initPageSize(loadDataCallback) {
    const pageSizeSelector = document.getElementById('pageSize');
    if (pageSizeSelector) {
        pageSizeSelector.addEventListener('change', function() {
            // 切换每页显示数量时，重新加载数据（从第1页开始）
            loadDataCallback(1);
        });
    }
}

// 更新分页信息和分页控件
function updatePaginationInfo(totalCount, pageSize, currentPage, loadDataCallback) {
    const paginationInfo = document.querySelector('.pagination-info');
    const pagination = document.querySelector('.pagination');
    
    if (!paginationInfo || !pagination) return;
    
    // 计算总页数
    const totalPages = Math.ceil(totalCount / pageSize);
    
    // 计算当前页显示的记录范围
    const startRecord = (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalCount);
    
    // 更新分页信息文本
    paginationInfo.textContent = `显示 ${startRecord}-${endRecord} 条，共 ${totalCount} 条记录`;
    
    // 更新分页控件
    pagination.innerHTML = '';
    
    // 上一页按钮
    const prevItem = document.createElement('li');
    prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    const prevLink = document.createElement('a');
    prevLink.className = 'page-link';
    prevLink.href = '#';
    prevLink.textContent = '上一页';
    if (currentPage > 1) {
        prevLink.addEventListener('click', function(e) {
            e.preventDefault();
            loadDataCallback(currentPage - 1);
        });
    }
    prevItem.appendChild(prevLink);
    pagination.appendChild(prevItem);
    
    // 页码按钮
    // 决定显示哪些页码按钮（最多显示5个页码按钮）
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // 调整startPage，确保显示5个页码按钮（如果总页数足够）
    if (endPage - startPage < 4 && totalPages > 5) {
        startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
        const pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = '#';
        pageLink.textContent = i.toString();
        if (i !== currentPage) {
            pageLink.addEventListener('click', function(e) {
                e.preventDefault();
                loadDataCallback(i);
            });
        }
        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
    }
    
    // 下一页按钮
    const nextItem = document.createElement('li');
    nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    const nextLink = document.createElement('a');
    nextLink.className = 'page-link';
    nextLink.href = '#';
    nextLink.textContent = '下一页';
    if (currentPage < totalPages) {
        nextLink.addEventListener('click', function(e) {
            e.preventDefault();
            loadDataCallback(currentPage + 1);
        });
    }
    nextItem.appendChild(nextLink);
    pagination.appendChild(nextItem);
}

// 加载候选人选项
function loadResumeOptions() {
    const resumeSelects = document.querySelectorAll('#resumeId, #edit-resumeId');
    
    // 获取所有候选人数据
    const resumes = window.mockData.resumes;
    
    // 遍历所有候选人选择器
    resumeSelects.forEach(select => {
        // 保留第一个"请选择"选项
        select.innerHTML = '<option value="">请选择候选人</option>';
        
        // 添加候选人选项
        resumes.forEach(resume => {
            const option = document.createElement('option');
            option.value = resume.id;
            option.textContent = `${resume.id}-${resume.name}`;
            select.appendChild(option);
        });
    });
}

// 加载职位选项
function loadPositionOptions() {
    const positionSelects = document.querySelectorAll('#positionId, #edit-positionId');
    
    // 获取所有职位数据
    const positions = window.mockData.positions;
    
    // 遍历所有职位选择器
    positionSelects.forEach(select => {
        // 保留第一个"请选择"选项
        select.innerHTML = '<option value="">请选择职位</option>';
        
        // 添加职位选项
        positions.forEach(position => {
            const option = document.createElement('option');
            option.value = position.id;
            option.textContent = `${position.id}-${position.title}-${position.company}`;
            select.appendChild(option);
        });
    });
}

// 加载面试数据
function loadInterviewData(page) {
    const interviewTableBody = document.getElementById('interviewTableBody');
    
    // 清空表格
    interviewTableBody.innerHTML = '';
    
    // 获取所有面试数据
    const interviews = window.mockData.interviews;
    
    // 根据当前页面大小和页码计算显示的数据
    const pageSize = parseInt(document.getElementById('pageSize')?.value || 10);
    const currentPage = page || 1; // 使用传入的页码或默认为第一页
    
    // 计算当前页面应该显示的数据范围
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, interviews.length);
    
    // 遍历数据并创建表格行
    for (let i = startIndex; i < endIndex; i++) {
        const interview = interviews[i];
        
        // 创建表格行
        const row = document.createElement('tr');
        
        // 设置行内容
        row.innerHTML = `
            <td>${interview.id}</td>
            <td>${interview.resumeName}</td>
            <td>${interview.positionTitle}</td>
            <td>${formatDateTime(interview.time)}</td>
            <td>${interview.location}</td>
            <td>${getRoundText(interview.round)}</td>
            <td>${getStatusBadge(interview.status)}</td>
            <td>${formatDate(interview.createTime)}</td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary btn-view" data-id="${interview.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-success btn-edit" data-id="${interview.id}" data-bs-toggle="modal" data-bs-target="#editInterviewModal">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-info btn-feedback" data-id="${interview.id}" data-bs-toggle="modal" data-bs-target="#feedbackModal">
                        <i class="bi bi-chat-quote"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-delete" data-id="${interview.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        // 将行添加到表格
        interviewTableBody.appendChild(row);
    }
    
    // 使用通用分页功能更新分页信息
    updatePaginationInfo(interviews.length, pageSize, currentPage, loadInterviewData);
    
    // 初始化操作按钮事件
    initViewButtons();
    initEditButtons();
    initDeleteButtons();
    initFeedbackButtons();
}

// 加载今日面试安排
function loadTodayInterviews() {
    const todayInterviewTableBody = document.getElementById('todayInterviewTableBody');
    
    if (!todayInterviewTableBody) return;
    
    // 清空表格
    todayInterviewTableBody.innerHTML = '';
    
    // 获取所有面试数据
    const interviews = window.mockData.interviews;
    
    // 获取今天的日期（不包含时间）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 获取明天的日期
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // 筛选今天的面试记录
    const todayInterviews = interviews.filter(interview => {
        const interviewDate = new Date(interview.time);
        return interviewDate >= today && interviewDate < tomorrow;
    });
    
    // 按面试时间排序
    todayInterviews.sort((a, b) => new Date(a.time) - new Date(b.time));
    
    // 添加今日面试到表格
    todayInterviews.forEach(interview => {
        // 创建表格行
        const row = document.createElement('tr');
        
        // 设置行内容
        row.innerHTML = `
            <td>${interview.id}</td>
            <td>${interview.resumeName}</td>
            <td>${interview.positionTitle}</td>
            <td>${formatDateTime(interview.time)}</td>
            <td>${interview.location}</td>
            <td>${getRoundText(interview.round)}</td>
            <td>${getStatusBadge(interview.status)}</td>
            <td>${formatDate(interview.createTime)}</td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary btn-view" data-id="${interview.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-success btn-edit" data-id="${interview.id}" data-bs-toggle="modal" data-bs-target="#editInterviewModal">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-info btn-feedback" data-id="${interview.id}" data-bs-toggle="modal" data-bs-target="#feedbackModal">
                        <i class="bi bi-chat-quote"></i>
                    </button>
                </div>
            </td>
        `;
        
        // 将行添加到表格
        todayInterviewTableBody.appendChild(row);
    });
    
    // 如果没有今日面试，显示提示信息
    if (todayInterviews.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="9" class="text-center">今日暂无面试安排</td>
        `;
        todayInterviewTableBody.appendChild(row);
    }
    
    // 为今日面试表格中的按钮添加事件监听
    const todayViewButtons = todayInterviewTableBody.querySelectorAll('.btn-view');
    todayViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const interviewId = parseInt(this.getAttribute('data-id'));
            viewInterview(interviewId);
        });
    });
    
    const todayEditButtons = todayInterviewTableBody.querySelectorAll('.btn-edit');
    todayEditButtons.forEach(button => {
        button.addEventListener('click', function() {
            const interviewId = parseInt(this.getAttribute('data-id'));
            fillEditForm(interviewId);
        });
    });
    
    const todayFeedbackButtons = todayInterviewTableBody.querySelectorAll('.btn-feedback');
    todayFeedbackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const interviewId = parseInt(this.getAttribute('data-id'));
            fillFeedbackForm(interviewId);
        });
    });
}

// 添加新面试
function saveInterview() {
    // 获取表单数据
    const resumeId = parseInt(document.getElementById('resumeId').value);
    const positionId = parseInt(document.getElementById('positionId').value);
    
    // 检查是否选择了候选人和职位
    if (!resumeId || !positionId) {
        alert('请选择候选人和应聘职位');
        return;
    }
    
    // 查找对应的简历和职位信息
    const resume = window.mockData.resumes.find(r => r.id === resumeId);
    const position = window.mockData.positions.find(p => p.id === positionId);
    
    if (!resume || !position) {
        alert('简历或职位不存在，请检查选择');
        return;
    }
    
    const formData = {
        id: window.mockData.interviews.length + 1,
        resumeId: resumeId,
        resumeName: resume.name,
        positionId: positionId,
        positionTitle: position.title,
        time: new Date(document.getElementById('interviewTime').value),
        location: document.getElementById('location').value,
        round: parseInt(document.getElementById('round').value),
        status: parseInt(document.getElementById('status').value),
        feedback: document.getElementById('feedback').value,
        createTime: new Date()
    };
    
    // 添加到模拟数据
    window.mockData.interviews.unshift(formData);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('addInterviewModal'));
    if (modal) {
        modal.hide();
    } else {
        // 如果没有获取到实例，则创建一个新的实例并隐藏
        const modalElement = document.getElementById('addInterviewModal');
        const bsModal = new bootstrap.Modal(modalElement);
        bsModal.hide();
    }
    
    // 重新加载数据
    loadInterviewData();
    // 重新加载今日面试安排
    loadTodayInterviews();
    
    // 重置表单
    document.getElementById('addInterviewForm').reset();
}

// 更新面试
function updateInterview() {
    // 获取面试ID
    const interviewId = parseInt(document.getElementById('edit-id').value);
    const resumeId = parseInt(document.getElementById('edit-resumeId').value);
    const positionId = parseInt(document.getElementById('edit-positionId').value);
    
    // 检查是否选择了候选人和职位
    if (!resumeId || !positionId) {
        alert('请选择候选人和应聘职位');
        return;
    }
    
    // 查找对应的简历和职位信息
    const resume = window.mockData.resumes.find(r => r.id === resumeId);
    const position = window.mockData.positions.find(p => p.id === positionId);
    
    if (!resume || !position) {
        alert('简历或职位不存在，请检查选择');
        return;
    }
    
    // 查找面试索引
    const interviewIndex = window.mockData.interviews.findIndex(interview => interview.id === interviewId);
    
    if (interviewIndex !== -1) {
        // 更新数据
        window.mockData.interviews[interviewIndex] = {
            ...window.mockData.interviews[interviewIndex],
            resumeId: resumeId,
            resumeName: resume.name,
            positionId: positionId,
            positionTitle: position.title,
            time: new Date(document.getElementById('edit-interviewTime').value),
            location: document.getElementById('edit-location').value,
            round: parseInt(document.getElementById('edit-round').value),
            status: parseInt(document.getElementById('edit-status').value),
            feedback: document.getElementById('edit-feedback').value
        };
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('editInterviewModal'));
        if (modal) {
            modal.hide();
        } else {
            // 如果没有获取到实例，则创建一个新的实例并隐藏
            const modalElement = document.getElementById('editInterviewModal');
            const bsModal = new bootstrap.Modal(modalElement);
            bsModal.hide();
        }
        
        // 重新加载数据
        loadInterviewData();
        // 重新加载今日面试安排
        loadTodayInterviews();
    }
}

// 初始化查看按钮
function initViewButtons() {
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const interviewId = parseInt(this.getAttribute('data-id'));
            viewInterview(interviewId);
        });
    });
}

// 初始化编辑按钮
function initEditButtons() {
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const interviewId = parseInt(this.getAttribute('data-id'));
            fillEditForm(interviewId);
        });
    });
}

// 初始化删除按钮
function initDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const interviewId = parseInt(this.getAttribute('data-id'));
            deleteInterview(interviewId);
        });
    });
}

// 初始化反馈按钮
function initFeedbackButtons() {
    const feedbackButtons = document.querySelectorAll('.btn-feedback');
    feedbackButtons.forEach(button => {
        button.addEventListener('click', function() {
            const interviewId = parseInt(this.getAttribute('data-id'));
            fillFeedbackForm(interviewId);
        });
    });
}

// 查看面试详情
function viewInterview(interviewId) {
    // 查找面试
    const interview = window.mockData.interviews.find(interview => interview.id === interviewId);
    
    if (interview) {
        // 在实际应用中，这里会跳转到详情页或打开详情模态框
        // 在原型中，我们只是弹出一个提示
        alert(`查看面试详情: ID ${interview.id} - ${interview.location} - ${formatDateTime(interview.time)}`);
    }
}

// 填充编辑表单
function fillEditForm(interviewId) {
    // 查找面试
    const interview = window.mockData.interviews.find(interview => interview.id === interviewId);
    
    if (interview) {
        // 填充表单字段
        document.getElementById('edit-id').value = interview.id;
        document.getElementById('edit-resumeId').value = interview.resumeId;
        document.getElementById('edit-positionId').value = interview.positionId;
        document.getElementById('edit-interviewTime').value = formatDateTimeForInput(interview.time);
        document.getElementById('edit-location').value = interview.location;
        document.getElementById('edit-round').value = interview.round;
        document.getElementById('edit-status').value = interview.status;
        document.getElementById('edit-feedback').value = interview.feedback;
    }
}

// 填充反馈表单
function fillFeedbackForm(interviewId) {
    // 查找面试
    const interview = window.mockData.interviews.find(interview => interview.id === interviewId);
    
    if (interview) {
        // 填充表单字段
        document.getElementById('feedback-id').value = interview.id;
        document.getElementById('feedback-resumeId').value = interview.resumeId;
        document.getElementById('feedback-positionId').value = interview.positionId;
        document.getElementById('feedback-interviewTime').value = formatDateTimeForInput(interview.time);
        document.getElementById('feedback-location').value = interview.location;
        document.getElementById('feedback-round').value = interview.round;
        document.getElementById('feedback-status').value = interview.status;
        document.getElementById('feedback-feedback').value = interview.feedback;
    }
}

// 删除面试
function deleteInterview(interviewId) {
    // 查找面试记录
    const interview = window.mockData.interviews.find(interview => interview.id === interviewId);
    
    if (interview) {
        // 使用通用确认删除模态框
        if (confirm(`您确定要删除 ${interview.resumeName} 在 ${formatDateTime(interview.time)} 的面试记录吗？`)) {
            // 查找面试索引
            const interviewIndex = window.mockData.interviews.findIndex(itv => itv.id === interviewId);
            
            if (interviewIndex !== -1) {
                // 从数组中删除
                window.mockData.interviews.splice(interviewIndex, 1);
                
                // 重新加载数据
                loadInterviewData();
                // 重新加载今日面试安排
                loadTodayInterviews();
            }
        }
    }
}

// 获取轮次文本
function getRoundText(round) {
    const rounds = ['第一轮', '第二轮', '第三轮', '终面'];
    return rounds[round - 1] || '未知';
}

// 获取状态徽章
function getStatusBadge(status) {
    const badges = [
        '<span class="badge bg-warning">已安排</span>',
        '<span class="badge bg-secondary">未知</span>',
        '<span class="badge bg-success">已通过</span>',
        '<span class="badge bg-danger">已取消</span>',
        '<span class="badge bg-secondary">未通过</span>'
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
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 格式化日期时间
function formatDateTime(date) {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 格式化日期时间用于输入框
function formatDateTimeForInput(date) {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// 提交面试反馈
function submitFeedback() {
    // 获取面试ID
    const interviewId = parseInt(document.getElementById('feedback-id').value);
    
    // 查找面试索引
    const interviewIndex = window.mockData.interviews.findIndex(interview => interview.id === interviewId);
    
    if (interviewIndex !== -1) {
        // 更新反馈和状态
        window.mockData.interviews[interviewIndex] = {
            ...window.mockData.interviews[interviewIndex],
            status: parseInt(document.getElementById('feedback-status').value),
            feedback: document.getElementById('feedback-feedback').value
        };
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
        if (modal) {
            modal.hide();
        } else {
            // 如果没有获取到实例，则创建一个新的实例并隐藏
            const modalElement = document.getElementById('feedbackModal');
            const bsModal = new bootstrap.Modal(modalElement);
            bsModal.hide();
        }
        
        // 重新加载数据
        loadInterviewData();
        // 重新加载今日面试安排
        loadTodayInterviews();
    }
}

// 初始化快速输入面试地点按钮
function initQuickLocationButtons() {
    // 添加面试模态框中的快速输入按钮
    const quickLocationButtons = document.querySelectorAll('.quick-location');
    quickLocationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const locationValue = this.getAttribute('data-value');
            document.getElementById('location').value = locationValue;
        });
    });
    
    // 添加面试模态框中的线下面试按钮
    const quickLocationOfflineButton = document.querySelector('.quick-location-offline');
    if (quickLocationOfflineButton) {
        quickLocationOfflineButton.addEventListener('click', function() {
            const locationInput = document.getElementById('location');
            locationInput.value = '';  // 清空输入内容
            locationInput.focus();     // 聚焦输入框
        });
    }
    
    // 编辑面试模态框中的快速输入按钮
    const editQuickLocationButtons = document.querySelectorAll('.edit-quick-location');
    editQuickLocationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const locationValue = this.getAttribute('data-value');
            document.getElementById('edit-location').value = locationValue;
        });
    });
    
    // 编辑面试模态框中的线下面试按钮
    const editQuickLocationOfflineButton = document.querySelector('.edit-quick-location-offline');
    if (editQuickLocationOfflineButton) {
        editQuickLocationOfflineButton.addEventListener('click', function() {
            const locationInput = document.getElementById('edit-location');
            locationInput.value = '';  // 清空输入内容
            locationInput.focus();     // 聚焦输入框
        });
    }
} 