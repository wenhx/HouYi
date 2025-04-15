// 推荐页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 从URL获取职位ID
    const urlParams = new URLSearchParams(window.location.search);
    const positionId = parseInt(urlParams.get('positionId'));
    
    if (positionId) {
        // 加载职位信息
        loadPositionData(positionId);
        
        // 加载推荐数据
        loadRecommendationData(positionId);
        
        // 初始化添加推荐按钮
        document.getElementById('addRecommendBtn').addEventListener('click', function() {
            openAddRecommendationModal(positionId);
        });
        
        // 初始化智能推荐按钮
        document.getElementById('autoRecommendBtn').addEventListener('click', function() {
            generateAutoRecommendations(positionId);
        });
        
        // 初始化保存推荐按钮
        document.getElementById('saveRecommendationBtn').addEventListener('click', function() {
            saveRecommendation(positionId);
        });
        
        // 初始化匹配分数滑块
        const scoreSlider = document.getElementById('recommend-score');
        const scoreValue = document.getElementById('recommend-score-value');
        if (scoreSlider && scoreValue) {
            scoreSlider.addEventListener('input', function() {
                scoreValue.textContent = this.value + '%';
            });
        }
    } else {
        // 如果没有职位ID，显示错误信息
        document.getElementById('position-title').textContent = '未找到职位';
        document.getElementById('recommendation-container').innerHTML = `
            <div class="alert alert-warning" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i> 未指定职位ID，请从职位管理页面选择一个职位进行推荐。
                <div class="mt-3">
                    <a href="position.html" class="btn btn-primary">
                        <i class="bi bi-arrow-left me-1"></i> 返回职位列表
                    </a>
                </div>
            </div>
        `;
    }
    
    // 初始化每页显示数量选择器
    initPageSize(function(page) {
        if (positionId) {
            loadRecommendationData(positionId, page);
        }
    });
});

// 加载职位信息
function loadPositionData(positionId) {
    // 查找职位
    const position = window.mockData.positions.find(position => position.id === positionId);
    
    if (position) {
        // 更新职位信息
        document.getElementById('position-title').textContent = position.title;
        document.getElementById('position-company').textContent = position.company;
        document.getElementById('position-status-badge').innerHTML = getStatusBadge(position.status);
        document.getElementById('position-recruiter').textContent = position.recruiter;
        document.getElementById('position-create-time').textContent = formatDate(position.createTime);
        document.getElementById('position-contact').textContent = position.customerContact;
        document.getElementById('position-contact-method').textContent = position.contactMethod;
        document.getElementById('position-requirements').textContent = position.requirements;
        
        // 更新页面标题
        document.title = `${position.title} - 人才推荐`;
    } else {
        // 如果找不到职位，显示错误信息
        document.getElementById('position-title').textContent = '未找到职位';
        document.getElementById('recommendation-container').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i> 找不到ID为 ${positionId} 的职位。
                <div class="mt-3">
                    <a href="position.html" class="btn btn-primary">
                        <i class="bi bi-arrow-left me-1"></i> 返回职位列表
                    </a>
                </div>
            </div>
        `;
    }
}

// 加载推荐数据
function loadRecommendationData(positionId, page) {
    const recommendationContainer = document.getElementById('recommendation-container');
    
    // 清空容器
    recommendationContainer.innerHTML = '';
    
    // 如果没有推荐数据，先生成模拟数据
    if (!window.mockData.recommendations || window.mockData.recommendations.length === 0) {
        window.mockData.recommendations = [];
    }
    
    // 过滤出当前职位的推荐
    const recommendations = window.mockData.recommendations.filter(rec => rec && rec.positionId === positionId);
    
    // 根据当前页面大小和页码计算显示的数据
    const pageSize = parseInt(document.getElementById('pageSize')?.value || 10);
    const currentPage = page || 1; // 使用传入的页码或默认为第一页
    
    // 计算当前页面应该显示的数据范围
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, recommendations.length);
    
    // 检查是否有推荐数据
    if (recommendations.length === 0) {
        recommendationContainer.innerHTML = `
            <div class="alert alert-info" role="alert">
                <i class="bi bi-info-circle me-2"></i> 暂无推荐数据。
                <div class="mt-2">
                    您可以点击"添加推荐"手动添加推荐人才，或者点击"智能推荐"自动生成推荐。
                </div>
            </div>
        `;
    } else {
        // 显示推荐数据
        for (let i = startIndex; i < endIndex; i++) {
            const recommendation = recommendations[i];
            const resume = window.mockData.resumes.find(r => r.id === recommendation.resumeId);
            
            if (resume) {
                // 创建推荐卡片
                const card = document.createElement('div');
                card.className = 'card mb-3 recommendation-card';
                
                // 设置匹配得分样式
                let scoreClass = 'low';
                if (recommendation.score >= 80) {
                    scoreClass = 'high';
                } else if (recommendation.score >= 60) {
                    scoreClass = 'medium';
                }
                
                // 设置卡片内容
                card.innerHTML = `
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-1 d-flex align-items-center justify-content-center">
                                <div class="match-score ${scoreClass}">
                                    ${recommendation.score}%
                                </div>
                            </div>
                            <div class="col-md-8">
                                <h5 class="card-title">${resume.name} <small class="text-muted">（${getGenderText(resume.gender)}，${resume.age}岁）</small></h5>
                                <p class="card-text mb-1">
                                    <i class="bi bi-briefcase me-1"></i> ${resume.position} | 
                                    <i class="bi bi-book me-1"></i> ${getDegreeText(resume.degree)} | 
                                    <i class="bi bi-clock-history me-1"></i> ${getExperienceText(resume.experience)} | 
                                    <i class="bi bi-geo-alt me-1"></i> ${resume.city}
                                </p>
                                <p class="card-text mt-2">
                                    <strong>推荐理由：</strong> ${recommendation.comment || '无'}
                                </p>
                            </div>
                            <div class="col-md-3 text-end d-flex align-items-center justify-content-end">
                                <div>
                                    <button type="button" class="btn btn-sm btn-outline-primary me-1 btn-view-resume" data-id="${resume.id}">
                                        <i class="bi bi-eye"></i> 查看简历
                                    </button>
                                    <button type="button" class="btn btn-sm btn-outline-success me-1 btn-arrange-interview" 
                                        data-resume-id="${resume.id}" data-position-id="${positionId}">
                                        <i class="bi bi-calendar-plus"></i> 安排面试
                                    </button>
                                    <button type="button" class="btn btn-sm btn-outline-danger btn-remove-recommendation" 
                                        data-id="${recommendation.id}">
                                        <i class="bi bi-x-circle"></i> 移除
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // 将卡片添加到容器
                recommendationContainer.appendChild(card);
            }
        }
        
        // 初始化操作按钮事件
        initViewResumeButtons();
        initArrangeInterviewButtons();
        initRemoveRecommendationButtons();
    }
    
    // 使用通用分页功能更新分页信息
    updatePaginationInfo(recommendations.length, pageSize, currentPage, function(newPage) {
        loadRecommendationData(positionId, newPage);
    });
}

// 打开添加推荐模态框
function openAddRecommendationModal(positionId) {
    // 获取所有简历数据
    const resumes = window.mockData.resumes;
    
    // 获取已推荐的简历ID列表
    const recommendedResumeIds = window.mockData.recommendations
        .filter(rec => rec.positionId === positionId)
        .map(rec => rec.resumeId);
    
    // 填充简历选择下拉框
    const resumeSelect = document.getElementById('recommend-resume');
    resumeSelect.innerHTML = '<option value="">-- 请选择简历 --</option>';
    
    // 只显示未推荐的简历
    resumes.filter(resume => !recommendedResumeIds.includes(resume.id))
        .forEach(resume => {
            const option = document.createElement('option');
            option.value = resume.id;
            option.textContent = `${resume.name} - ${resume.position} (${getDegreeText(resume.degree)}, ${getExperienceText(resume.experience)})`;
            resumeSelect.appendChild(option);
        });
    
    // 重置表单
    document.getElementById('recommend-score').value = 75;
    document.getElementById('recommend-score-value').textContent = '75%';
    document.getElementById('recommend-comment').value = '';
    
    // 打开模态框
    const modal = new bootstrap.Modal(document.getElementById('addRecommendationModal'));
    modal.show();
}

// 保存推荐
function saveRecommendation(positionId) {
    // 获取表单数据
    const resumeId = parseInt(document.getElementById('recommend-resume').value);
    const score = parseInt(document.getElementById('recommend-score').value);
    const comment = document.getElementById('recommend-comment').value;
    
    // 验证表单
    if (!resumeId) {
        alert('请选择一个简历');
        return;
    }
    
    // 创建新的推荐数据
    const newRecommendation = {
        id: window.mockData.recommendations.length + 1,
        positionId: positionId,
        resumeId: resumeId,
        score: score,
        comment: comment,
        createdBy: '当前用户',
        createTime: new Date()
    };
    
    // 添加到模拟数据
    window.mockData.recommendations.push(newRecommendation);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('addRecommendationModal'));
    modal.hide();
    
    // 重新加载数据
    loadRecommendationData(positionId);
}

// 自动生成推荐
function generateAutoRecommendations(positionId) {
    // 获取职位信息
    const position = window.mockData.positions.find(position => position.id === positionId);
    
    if (!position) {
        return;
    }
    
    // 获取所有简历
    const resumes = window.mockData.resumes;
    
    // 获取已推荐的简历ID列表
    const recommendedResumeIds = window.mockData.recommendations
        .filter(rec => rec.positionId === positionId)
        .map(rec => rec.resumeId);
    
    // 筛选未推荐的简历
    const availableResumes = resumes.filter(resume => !recommendedResumeIds.includes(resume.id));
    
    // 如果没有可用简历，显示提示
    if (availableResumes.length === 0) {
        alert('没有可推荐的简历');
        return;
    }
    
    // 模拟智能匹配算法，选择最匹配的简历（这里只是简单随机选择5个）
    const selectedCount = Math.min(5, availableResumes.length);
    const selectedResumes = [];
    
    // 复制一份可用简历数组，避免修改原数组
    const tempResumes = [...availableResumes];
    
    for (let i = 0; i < selectedCount; i++) {
        // 随机选择一个索引
        const randomIndex = Math.floor(Math.random() * tempResumes.length);
        
        // 获取对应的简历并从临时数组中移除
        const selectedResume = tempResumes.splice(randomIndex, 1)[0];
        
        // 添加到已选择数组
        selectedResumes.push(selectedResume);
    }
    
    // 为每个选中的简历创建推荐
    selectedResumes.forEach(resume => {
        // 生成随机匹配分数（60-95之间）
        const score = Math.floor(Math.random() * 36) + 60;
        
        // 根据职位和简历生成推荐理由
        const reasons = [
            `${resume.name}的${resume.position}经验与${position.title}岗位要求匹配度高。`,
            `${resume.name}具备${position.title}所需的技能和经验。`,
            `${resume.name}的教育背景和工作经历与${position.title}职位需求相符。`,
            `${resume.name}在${resume.position}领域有丰富经验，适合${position.title}职位。`,
            `${resume.name}的专业技能与${position.title}岗位要求高度匹配。`
        ];
        
        // 随机选择一个推荐理由
        const randomReasonIndex = Math.floor(Math.random() * reasons.length);
        const comment = reasons[randomReasonIndex];
        
        // 创建新的推荐数据
        const newRecommendation = {
            id: window.mockData.recommendations.length + 1,
            positionId: positionId,
            resumeId: resume.id,
            score: score,
            comment: comment,
            createdBy: 'AI智能推荐',
            createTime: new Date()
        };
        
        // 添加到模拟数据
        window.mockData.recommendations.push(newRecommendation);
    });
    
    // 重新加载数据
    loadRecommendationData(positionId);
    
    // 显示提示
    alert(`已自动推荐${selectedCount}位候选人`);
}

// 初始化查看简历按钮
function initViewResumeButtons() {
    const viewResumeButtons = document.querySelectorAll('.btn-view-resume');
    viewResumeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resumeId = parseInt(this.getAttribute('data-id'));
            // 在实际应用中，这里应该跳转到简历详情页
            // 在原型中，我们只是显示一个提示
            alert(`查看简历ID：${resumeId}的详细信息`);
            // window.location.href = `resume-detail.html?id=${resumeId}`;
        });
    });
}

// 初始化安排面试按钮
function initArrangeInterviewButtons() {
    const arrangeInterviewButtons = document.querySelectorAll('.btn-arrange-interview');
    arrangeInterviewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resumeId = parseInt(this.getAttribute('data-resume-id'));
            const positionId = parseInt(this.getAttribute('data-position-id'));
            // 在实际应用中，这里应该跳转到面试安排页面
            // 在原型中，我们只是显示一个提示
            alert(`为简历ID：${resumeId}，职位ID：${positionId}安排面试`);
            // window.location.href = `interview-create.html?resumeId=${resumeId}&positionId=${positionId}`;
        });
    });
}

// 初始化移除推荐按钮
function initRemoveRecommendationButtons() {
    const removeButtons = document.querySelectorAll('.btn-remove-recommendation');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const recommendationId = parseInt(this.getAttribute('data-id'));
            
            // 获取当前职位ID
            const urlParams = new URLSearchParams(window.location.search);
            const positionId = parseInt(urlParams.get('positionId'));
            
            // 查找推荐记录
            const recommendation = window.mockData.recommendations.find(rec => rec.id === recommendationId);
            
            if (recommendation) {
                // 查找简历和职位信息，用于显示更有意义的确认消息
                const resume = window.mockData.resumes.find(r => r.id === recommendation.resumeId);
                const position = window.mockData.positions.find(p => p.id === recommendation.positionId);
                
                if (resume && position) {
                    // 使用通用确认删除模态框
                    window.showDeleteConfirmModal(
                        '确认移除推荐',
                        `<p>您确定要移除 <strong>${resume.name}</strong> 对 <strong>${position.title}</strong> 的推荐吗？</p>`,
                        function() {
                            // 在推荐数组中查找并移除
                            const recommendationIndex = window.mockData.recommendations.findIndex(rec => rec.id === recommendationId);
                            if (recommendationIndex !== -1) {
                                window.mockData.recommendations.splice(recommendationIndex, 1);
                                
                                // 重新加载数据
                                loadRecommendationData(positionId);
                            }
                        }
                    );
                }
            }
        });
    });
}

// 获取性别文本
function getGenderText(gender) {
    const genders = ['男', '女', '保密'];
    return genders[gender] || '未知';
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