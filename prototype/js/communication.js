/**
 * 人才沟通管理页面脚本
 */

// 模拟数据
const communicationData = [
    {
        id: 1,
        talentName: "周国平",
        resumeId: "10001", 
        position: "数据架构师",
        communicationTime: "2023-06-15 10:15",
        communicationMethod: "电话",
        status: "已联系",
        followUpPerson: "王梅",
        communicationContent: "与候选人进行了初步电话沟通，介绍了公司情况和职位要求。候选人对我们公司的技术栈和发展方向很感兴趣，表示愿意参加下一步面试。目前他在现公司工作还算稳定，但对新的挑战持开放态度。薪资方面期望有25%的涨幅。",
        nextPlan: "安排技术团队进行视频面试，初步定在下周二下午。同时准备薪资方案，评估是否能满足候选人期望。",
        createTime: "2023-06-15 10:20",
        updateTime: "2023-06-15 10:20"
    },
    {
        id: 2,
        talentName: "吴德文",
        resumeId: "10002",
        position: "前端工程师",
        communicationTime: "2023-06-15 09:30",
        communicationMethod: "邮件",
        status: "已联系",
        followUpPerson: "李强",
        communicationContent: "通过邮件发送了职位描述和公司介绍，候选人回复表示有兴趣了解更多信息。他目前在一家中型互联网公司担任前端开发，对我们使用的Vue+React技术栈很感兴趣。",
        nextPlan: "安排一次电话沟通，更详细地了解候选人的技术背景和职业规划。",
        createTime: "2023-06-15 09:45",
        updateTime: "2023-06-15 09:45"
    },
    {
        id: 3,
        talentName: "李思源",
        resumeId: "10003",
        position: "全栈工程师",
        communicationTime: "2023-06-14 16:20",
        communicationMethod: "即时通讯",
        status: "有意向",
        followUpPerson: "张华",
        communicationContent: "通过即时通讯与候选人进行了深入交流，讨论了技术栈和项目经验。候选人在全栈开发方面经验丰富，尤其是Node.js和React领域。对我们的远程工作政策非常感兴趣，表示很愿意加入团队。",
        nextPlan: "安排技术面试，重点考察系统设计能力和问题解决能力。",
        createTime: "2023-06-14 16:30",
        updateTime: "2023-06-14 17:15"
    },
    {
        id: 4,
        talentName: "王子轩",
        resumeId: "10004",
        position: "安全工程师",
        communicationTime: "2023-06-14 14:45",
        communicationMethod: "电话",
        status: "无意向",
        followUpPerson: "陈明",
        communicationContent: "与候选人进行了电话沟通，介绍了安全团队的工作内容和技术挑战。候选人表示目前在现公司待遇不错，且刚刚得到晋升，短期内不考虑跳槽。",
        nextPlan: "暂时不进行进一步跟进，半年后可以再次联系。",
        createTime: "2023-06-14 15:00",
        updateTime: "2023-06-14 15:00"
    },
    {
        id: 5,
        talentName: "张晓峰",
        resumeId: "10005",
        position: "移动端开发",
        communicationTime: "2023-06-14 11:30",
        communicationMethod: "视频会议",
        status: "有意向",
        followUpPerson: "李强",
        communicationContent: "通过视频会议与候选人详细交流了移动端开发职位的要求和项目情况。候选人在iOS和Android开发方面都有扎实的经验，对Flutter和React Native也很熟悉。对我们的跨平台开发战略表示认同，并很感兴趣。",
        nextPlan: "安排与技术主管进行下一轮面试，重点讨论具体项目和技术方案。",
        createTime: "2023-06-14 12:00",
        updateTime: "2023-06-14 13:30"
    },
    {
        id: 6,
        talentName: "林文杰",
        resumeId: "10006",
        position: "Java开发工程师",
        communicationTime: "2023-06-13 15:45",
        communicationMethod: "电话",
        status: "待定",
        followUpPerson: "王梅",
        communicationContent: "电话沟通了Java开发岗位的具体要求，候选人有5年Java开发经验，主要做过电商和金融领域的项目。技术能力看起来不错，但对薪资期望较高，超出了我们的预算范围。",
        nextPlan: "与HR讨论薪资方案的调整可能性，若有空间再次联系候选人。",
        createTime: "2023-06-13 16:00",
        updateTime: "2023-06-13 16:20"
    },
    {
        id: 7,
        talentName: "陈阳光",
        resumeId: "10007",
        position: "产品经理",
        communicationTime: "2023-06-13 10:20",
        communicationMethod: "邮件",
        status: "已联系",
        followUpPerson: "张华",
        communicationContent: "通过邮件初步沟通了产品经理岗位的职责和要求。候选人在B端产品方面有丰富经验，对我们的SaaS产品很感兴趣。",
        nextPlan: "安排一次视频会议，深入了解候选人的产品思维和项目经验。",
        createTime: "2023-06-13 10:30",
        updateTime: "2023-06-13 10:30"
    },
    {
        id: 8,
        talentName: "刘芳",
        resumeId: "10008",
        position: "HR经理",
        communicationTime: "2023-06-12 14:30",
        communicationMethod: "即时通讯",
        status: "有意向",
        followUpPerson: "陈明",
        communicationContent: "与候选人通过即时通讯沟通了HR经理岗位的具体职责和团队情况。候选人有8年互联网公司HR经验，组织过多次大规模招聘活动，对人才培养和团队建设有独到见解。",
        nextPlan: "安排与公司HR总监面谈，进一步评估是否匹配。",
        createTime: "2023-06-12 14:50",
        updateTime: "2023-06-12 16:00"
    }
];

// 人才数据映射，用于添加沟通记录时自动填充简历编号
const talentMap = {
    "1": { name: "周国平", resumeId: "10001" },
    "2": { name: "吴德文", resumeId: "10002" },
    "3": { name: "李思源", resumeId: "10003" },
    "4": { name: "王子轩", resumeId: "10004" },
    "5": { name: "张晓峰", resumeId: "10005" }
};

// 初始化window.mockData对象，如果它不存在
if (!window.mockData) {
    window.mockData = {};
}

// 初始化职位数据，如果它不存在
if (!window.mockData.positions) {
    window.mockData.positions = [
        { id: 1, title: "数据架构师", company: "阿里巴巴", status: 1 },
        { id: 2, title: "前端工程师", company: "腾讯", status: 1 },
        { id: 3, title: "全栈工程师", company: "字节跳动", status: 1 },
        { id: 4, title: "安全工程师", company: "华为", status: 1 },
        { id: 5, title: "移动端开发", company: "小米", status: 1 },
        { id: 6, title: "Java开发工程师", company: "京东", status: 1 },
        { id: 7, title: "产品经理", company: "网易", status: 1 },
        { id: 8, title: "HR经理", company: "美团", status: 1 }
    ];
}

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化表格排序
    initTableSorting();
    
    // 绑定模态框事件
    bindModalEvents();
    
    // 绑定筛选事件
    bindFilterEvents();
    
    // 填充职位下拉菜单
    fillPositionDropdowns();
    
    // 加载沟通数据到表格
    loadCommunicationData();
});

/**
 * 填充职位下拉菜单
 */
function fillPositionDropdowns() {
    // 获取职位数据
    const positions = window.mockData?.positions || [];
    
    // 获取下拉菜单元素
    const addPositionSelect = document.getElementById('position');
    const editPositionSelect = document.getElementById('edit-position');
    
    if (positions.length > 0 && addPositionSelect && editPositionSelect) {
        // 清空现有选项，保留第一个默认选项
        addPositionSelect.innerHTML = '<option value="">选择职位</option>';
        editPositionSelect.innerHTML = '<option value="">选择职位</option>';
        
        // 填充职位选项
        positions.forEach(position => {
            if (position.status === 1) { // 只添加状态为"开放"的职位
                // 添加到"添加"表单
                const addOption = document.createElement('option');
                addOption.value = position.title;
                addOption.textContent = `${position.title} (${position.company})`;
                addPositionSelect.appendChild(addOption);
                
                // 添加到"编辑"表单
                const editOption = document.createElement('option');
                editOption.value = position.title;
                editOption.textContent = `${position.title} (${position.company})`;
                editPositionSelect.appendChild(editOption);
            }
        });
    } else {
        console.warn('无法获取职位数据或未找到下拉菜单元素');
        
        // 添加一些默认职位作为备选
        const defaultPositions = [
            "数据架构师",
            "前端工程师",
            "全栈工程师",
            "安全工程师",
            "移动端开发",
            "Java开发工程师",
            "产品经理",
            "HR经理"
        ];
        
        if (addPositionSelect && editPositionSelect) {
            // 添加默认职位选项
            defaultPositions.forEach(title => {
                // 添加到"添加"表单
                const addOption = document.createElement('option');
                addOption.value = title;
                addOption.textContent = title;
                addPositionSelect.appendChild(addOption);
                
                // 添加到"编辑"表单
                const editOption = document.createElement('option');
                editOption.value = title;
                editOption.textContent = title;
                editPositionSelect.appendChild(editOption);
            });
        }
    }
}

/**
 * 初始化表格排序功能
 */
function initTableSorting() {
    const tableHeaders = document.querySelectorAll('th[data-sortable="true"]');
    
    tableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // 移除所有表头的排序样式
            tableHeaders.forEach(th => {
                th.classList.remove('sorting-asc', 'sorting-desc');
            });
            
            // 设置当前排序方向
            if (this.classList.contains('sorting-asc')) {
                this.classList.add('sorting-desc');
            } else {
                this.classList.add('sorting-asc');
            }
            
            // 获取排序列和字段
            const field = this.getAttribute('data-field');
            const isAscending = this.classList.contains('sorting-asc');
            
            // 执行排序
            sortTable(field, isAscending);
        });
    });
    
    // 页面加载时默认按沟通时间降序排序
    const timeHeader = document.querySelector('th[data-field="communicationTime"]');
    if (timeHeader) {
        // 确保它有降序排序样式
        timeHeader.classList.add('sorting-desc');
        sortTable('communicationTime', false);
    }
}

/**
 * 表格排序功能
 * @param {string} field - 排序字段
 * @param {boolean} ascending - 是否升序
 */
function sortTable(field, ascending) {
    const tbody = document.getElementById('communicationTableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // 根据字段获取单元格的索引
    let columnIndex;
    switch(field) {
        case 'communicationTime':
            columnIndex = 4;
            break;
        case 'status':
            columnIndex = 6;
            break;
        default:
            columnIndex = 4; // 默认按沟通时间
    }
    
    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent.trim();
        const cellB = b.cells[columnIndex].textContent.trim();
        
        // 如果是日期字段，使用日期比较
        if (field === 'communicationTime') {
            const dateA = new Date(cellA);
            const dateB = new Date(cellB);
            return ascending ? dateA - dateB : dateB - dateA;
        }
        
        // 否则使用字符串比较
        return ascending ? 
            cellA.localeCompare(cellB, 'zh-CN') : 
            cellB.localeCompare(cellA, 'zh-CN');
    });
    
    // 重新添加排序后的行到表格
    rows.forEach(row => tbody.appendChild(row));
}

/**
 * 绑定模态框事件
 */
function bindModalEvents() {
    // 添加沟通记录
    const addModal = document.getElementById('addModal');
    if (addModal) {
        addModal.addEventListener('show.bs.modal', function() {
            // 重置表单
            document.getElementById('addCommunicationForm').reset();
            
            // 设置默认日期时间为当前时间
            const now = new Date();
            const datetimeLocal = now.toISOString().slice(0, 16);
            document.getElementById('communicationTime').value = datetimeLocal;
        });
        
        // 保存按钮事件
        document.getElementById('saveCommunicationBtn').addEventListener('click', function() {
            // 这里添加表单验证和数据保存逻辑
            const form = document.getElementById('addCommunicationForm');
            if (form.checkValidity()) {
                // 模拟添加数据成功
                alert('添加沟通记录成功！');
                
                // 关闭模态框
                const modal = bootstrap.Modal.getInstance(addModal);
                modal.hide();
                
                // 刷新页面或局部刷新表格
                // window.location.reload();
            } else {
                // 触发表单验证
                form.reportValidity();
            }
        });
    }
    
    // 查看沟通记录
    const viewModal = document.getElementById('viewModal');
    if (viewModal) {
        viewModal.addEventListener('show.bs.modal', function(event) {
            // 获取触发按钮
            const button = event.relatedTarget;
            // 获取数据ID
            const id = button.getAttribute('data-id');
            
            // 查找相应的数据
            const record = communicationData.find(item => item.id == id);
            
            if (record) {
                // 填充数据到模态框
                document.getElementById('view-talentName').textContent = record.talentName;
                document.getElementById('view-resumeId').textContent = record.resumeId;
                document.getElementById('view-position').textContent = record.position;
                document.getElementById('view-communicationTime').textContent = record.communicationTime;
                document.getElementById('view-communicationMethod').textContent = record.communicationMethod;
                
                const statusSpan = document.getElementById('view-status');
                statusSpan.textContent = record.status;
                
                // 根据状态设置不同的样式
                statusSpan.className = 'badge';
                if (record.status === '已联系') {
                    statusSpan.classList.add('bg-primary');
                } else if (record.status === '有意向') {
                    statusSpan.classList.add('bg-success');
                } else if (record.status === '无意向') {
                    statusSpan.classList.add('bg-danger');
                } else if (record.status === '待定') {
                    statusSpan.classList.add('bg-warning');
                }
                
                document.getElementById('view-followUpPerson').textContent = record.followUpPerson;
                document.getElementById('view-createTime').textContent = record.createTime;
                document.getElementById('view-updateTime').textContent = record.updateTime;
                document.getElementById('view-communicationContent').textContent = record.communicationContent;
                document.getElementById('view-nextPlan').textContent = record.nextPlan;
            }
        });
    }
    
    // 编辑沟通记录
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.addEventListener('show.bs.modal', function(event) {
            // 获取触发按钮
            const button = event.relatedTarget;
            // 获取数据ID
            const id = button.getAttribute('data-id');
            
            // 查找相应的数据
            const record = communicationData.find(item => item.id == id);
            
            if (record) {
                // 设置ID
                document.getElementById('edit-id').value = record.id;
                
                // 填充数据到表单
                document.getElementById('edit-talentName').textContent = record.talentName;
                document.getElementById('edit-resumeId').textContent = record.resumeId;
                
                const positionSelect = document.getElementById('edit-position');
                // 找到匹配的职位选项
                let positionFound = false;
                for (let i = 0; i < positionSelect.options.length; i++) {
                    if (positionSelect.options[i].value === record.position) {
                        positionSelect.selectedIndex = i;
                        positionFound = true;
                        break;
                    }
                }
                
                // 如果找不到匹配的职位，添加一个新选项
                if (!positionFound && record.position) {
                    const newOption = document.createElement('option');
                    newOption.value = record.position;
                    newOption.textContent = record.position;
                    positionSelect.appendChild(newOption);
                    positionSelect.value = record.position;
                }
                
                // 转换时间格式为datetime-local支持的格式
                const communicationTime = new Date(record.communicationTime.replace(' ', 'T'));
                const datetimeLocal = communicationTime.toISOString().slice(0, 16);
                document.getElementById('edit-communicationTime').value = datetimeLocal;
                
                const methodSelect = document.getElementById('edit-communicationMethod');
                for (let i = 0; i < methodSelect.options.length; i++) {
                    if (methodSelect.options[i].value === record.communicationMethod) {
                        methodSelect.selectedIndex = i;
                        break;
                    }
                }
                
                const statusSelect = document.getElementById('edit-status');
                for (let i = 0; i < statusSelect.options.length; i++) {
                    if (statusSelect.options[i].value === record.status) {
                        statusSelect.selectedIndex = i;
                        break;
                    }
                }
                
                const followUpSelect = document.getElementById('edit-followUpPerson');
                for (let i = 0; i < followUpSelect.options.length; i++) {
                    if (followUpSelect.options[i].value === record.followUpPerson) {
                        followUpSelect.selectedIndex = i;
                        break;
                    }
                }
                
                document.getElementById('edit-communicationContent').value = record.communicationContent;
                document.getElementById('edit-nextPlan').value = record.nextPlan;
            }
        });
        
        // 更新按钮事件
        document.getElementById('updateCommunicationBtn').addEventListener('click', function() {
            // 这里添加表单验证和数据更新逻辑
            const form = document.getElementById('editCommunicationForm');
            if (form.checkValidity()) {
                // 模拟更新数据成功
                alert('更新沟通记录成功！');
                
                // 关闭模态框
                const modal = bootstrap.Modal.getInstance(editModal);
                modal.hide();
                
                // 刷新页面或局部刷新表格
                // window.location.reload();
            } else {
                // 触发表单验证
                form.reportValidity();
            }
        });
    }
}

/**
 * 绑定筛选事件
 */
function bindFilterEvents() {
    // 搜索表单提交事件
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const searchText = this.querySelector('input[type="search"]').value.trim();
            if (searchText) {
                alert(`搜索关键词: ${searchText}`);
            } else {
                alert('请输入搜索关键词');
            }
        });
    }
    
    // 沟通结果筛选下拉菜单事件
    const statusFilterItems = document.querySelectorAll('th[data-field="status"] .dropdown-item');
    statusFilterItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有选项的active类
            statusFilterItems.forEach(i => i.classList.remove('active'));
            
            // 给当前选项添加active类
            this.classList.add('active');
            
            // 获取选中的状态值
            const selectedText = this.textContent.trim();
            const selectedStatus = selectedText === '所有结果' ? 'all' : selectedText;
            
            // 筛选表格行
            filterTableByStatus(selectedStatus);
        });
    });
}

/**
 * 根据选中的状态筛选表格
 * @param {string} status 选中的状态值
 */
function filterTableByStatus(status) {
    const tableRows = document.querySelectorAll('#communicationTableBody tr');
    
    tableRows.forEach(row => {
        const statusCell = row.querySelector('td:nth-child(7)');
        if (!statusCell) return;
        
        const statusText = statusCell.textContent.trim();
        
        if (status === 'all' || statusText === status) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // 更新分页信息
    updateFilteredRowCount();
}

/**
 * 更新筛选后的行数信息
 */
function updateFilteredRowCount() {
    const visibleRows = document.querySelectorAll('#communicationTableBody tr[style=""]').length || 
                        document.querySelectorAll('#communicationTableBody tr:not([style*="display: none"])').length;
    const totalRows = document.querySelectorAll('#communicationTableBody tr').length;
    
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
        if (visibleRows === totalRows) {
            paginationInfo.textContent = `显示 1-${visibleRows} 条，共 ${totalRows} 条记录`;
        } else {
            paginationInfo.textContent = `筛选显示 ${visibleRows} 条，共 ${totalRows} 条记录`;
        }
    }
}

/**
 * 加载沟通数据到表格
 */
function loadCommunicationData() {
    const communicationTableBody = document.getElementById('communicationTableBody');
    
    if (communicationTableBody) {
        // 清空表格
        communicationTableBody.innerHTML = '';
        
        // 添加沟通记录数据
        communicationData.forEach(record => {
            const row = document.createElement('tr');
            
            // 创建单元格并添加数据
            row.innerHTML = `
                <td>${record.id}</td>
                <td>${record.talentName}</td>
                <td>${record.position}</td>
                <td>${record.resumeId}</td>
                <td>${record.communicationTime}</td>
                <td>${record.communicationMethod}</td>
                <td><span class="badge ${getResultBadgeClass(record.status)}">${record.status}</span></td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button type="button" class="btn btn-outline-secondary" data-id="${record.id}" data-bs-toggle="modal" data-bs-target="#editCommunicationModal">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button type="button" class="btn btn-outline-danger delete-btn" data-id="${record.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            // 添加行到表格
            communicationTableBody.appendChild(row);
        });
        
        // 数据加载完成后，应用默认排序（按沟通时间降序）
        sortTable('communicationTime', false);
        
        // 绑定删除按钮事件
        initDeleteButtons();
    }
}

/**
 * 初始化删除按钮事件
 */
function initDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteCommunication(id);
        });
    });
}

/**
 * 删除沟通记录
 */
function deleteCommunication(id) {
    // 查找沟通记录
    const record = communicationData.find(item => item.id === id);
    
    if (record) {
        // 使用通用确认删除模态框
        window.showDeleteConfirmModal(
            '确认删除',
            `<p>您确定要删除 <strong>${record.talentName}</strong> 的沟通记录吗？</p>`,
            function() {
                // 查找记录索引
                const recordIndex = communicationData.findIndex(item => item.id === id);
                
                if (recordIndex !== -1) {
                    // 从数组中删除
                    communicationData.splice(recordIndex, 1);
                    
                    // 重新加载数据
                    loadCommunicationData();
                }
            }
        );
    }
}

/**
 * 获取沟通结果的徽章样式类
 */
function getResultBadgeClass(status) {
    switch(status) {
        case '有意向':
            return 'bg-success';
        case '无意向':
            return 'bg-danger';
        case '待定':
            return 'bg-warning';
        case '未响应':
            return 'bg-secondary';
        case '进一步沟通':
            return 'bg-primary';
        default:
            return 'bg-secondary';
    }
} 