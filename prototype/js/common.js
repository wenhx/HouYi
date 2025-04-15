// 通用功能：分页、搜索、排序、每页显示数量选择

document.addEventListener('DOMContentLoaded', function() {
    // 初始化每页显示数量选择器
    initPageSizeSelector();
    
    // 初始化搜索功能
    initSearch();
    
    // 初始化排序功能
    initSort();
    
    // 初始化删除确认
    initDeleteConfirmation();
    
    // 初始化编辑表单的数据加载
    initEditFormData();
    
    // 初始化表头过滤
    initTableHeaderFilters();
});

// 初始化每页显示数量选择器
function initPageSizeSelector() {
    // 判断当前页面是否已经有自定义的页面大小处理器
    const pageWithCustomHandler = [
        'position.html', // 职位管理页面
        'interview.html', // 面试管理页面
        'resume.html',    // 人才库页面
        'customer.html',  // 客户管理页面
        'user.html',      // 用户管理页面
        // 其他使用了initPageSize的页面可以在此处添加
    ];
    
    // 检查当前页面是否在自定义处理列表中
    const currentPath = window.location.pathname;
    for (const pagePath of pageWithCustomHandler) {
        if (currentPath.includes(pagePath)) {
            return; // 如果当前页面有自定义处理，则跳过common.js中的通用处理
        }
    }
    
    const pageSizeSelector = document.getElementById('pageSize');
    if (pageSizeSelector) {
        pageSizeSelector.addEventListener('change', function() {
            // 在实际应用中，这里会刷新数据
            // 在原型中，我们直接刷新页面或模拟刷新
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('pageSize', this.value);
            window.location.href = currentUrl.toString();
        });
    }
}

// 初始化搜索功能
function initSearch() {
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="search"]');
            const searchValue = searchInput.value.trim();
            
            // 在实际应用中，这里会触发搜索请求
            // 在原型中，我们模拟刷新表格数据
            filterTableData(searchValue);
        });
    }
}

// 模拟表格数据过滤
function filterTableData(keyword) {
    if (!keyword) {
        document.querySelectorAll('tbody tr').forEach(row => {
            row.style.display = '';
        });
        updatePagination(document.querySelectorAll('tbody tr').length);
        return;
    }
    
    let visibleCount = 0;
    document.querySelectorAll('tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(keyword.toLowerCase())) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    updatePagination(visibleCount);
}

// 更新分页信息
function updatePagination(totalItems) {
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
        const pageSize = parseInt(document.getElementById('pageSize')?.value || 10);
        const totalPages = Math.ceil(totalItems / pageSize);
        paginationInfo.textContent = `显示 ${Math.min(totalItems, 1)}-${Math.min(totalItems, pageSize)} 条，共 ${totalItems} 条记录`;
        
        // 更新分页按钮
        const pagination = document.querySelector('.pagination');
        if (pagination) {
            let paginationHTML = '';
            
            paginationHTML += '<li class="page-item"><a class="page-link" href="#">首页</a></li>';
            paginationHTML += '<li class="page-item"><a class="page-link" href="#">上一页</a></li>';
            
            for (let i = 1; i <= Math.min(totalPages, 5); i++) {
                paginationHTML += `<li class="page-item ${i === 1 ? 'active' : ''}"><a class="page-link" href="#">${i}</a></li>`;
            }
            
            paginationHTML += '<li class="page-item"><a class="page-link" href="#">下一页</a></li>';
            paginationHTML += '<li class="page-item"><a class="page-link" href="#">末页</a></li>';
            
            pagination.innerHTML = paginationHTML;
            
            // 添加分页点击事件
            pagination.querySelectorAll('.page-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    // 在实际应用中，这里会触发页面切换
                    // 在原型中，我们只是更新活动状态
                    if (!this.textContent.includes('页')) {
                        pagination.querySelectorAll('.page-item').forEach(item => item.classList.remove('active'));
                        this.parentNode.classList.add('active');
                    }
                });
            });
        }
    }
}

// 初始化排序功能
function initSort() {
    const sortableHeaders = document.querySelectorAll('th[data-sortable="true"]');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // 移除其他列的排序状态
            sortableHeaders.forEach(h => {
                if (h !== this) {
                    h.classList.remove('sorting_asc', 'sorting_desc');
                    h.classList.add('sorting');
                }
            });
            
            // 切换当前列的排序状态
            if (this.classList.contains('sorting') || this.classList.contains('sorting_desc')) {
                this.classList.remove('sorting', 'sorting_desc');
                this.classList.add('sorting_asc');
                sortTable(this.cellIndex, 'asc');
            } else {
                this.classList.remove('sorting', 'sorting_asc');
                this.classList.add('sorting_desc');
                sortTable(this.cellIndex, 'desc');
            }
        });
    });
}

// 表格排序功能
function sortTable(columnIndex, direction) {
    const table = document.querySelector('table.table');
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // 根据指定列的内容对行进行排序
    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[columnIndex]?.textContent.trim() || '';
        const cellB = rowB.cells[columnIndex]?.textContent.trim() || '';
        
        // 尝试数字比较
        const numA = parseFloat(cellA);
        const numB = parseFloat(cellB);
        
        if (!isNaN(numA) && !isNaN(numB)) {
            return direction === 'asc' ? numA - numB : numB - numA;
        }
        
        // 字符串比较
        return direction === 'asc' 
            ? cellA.localeCompare(cellB, 'zh-CN') 
            : cellB.localeCompare(cellA, 'zh-CN');
    });
    
    // 重新排列行
    rows.forEach(row => tbody.appendChild(row));
}

// 初始化删除确认
function initDeleteConfirmation() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('确定要删除此项吗？此操作无法撤销。')) {
                // 在实际应用中，这里会发送删除请求
                // 在原型中，我们直接移除这一行
                this.closest('tr').remove();
                
                // 更新分页信息
                updatePagination(document.querySelectorAll('tbody tr').length);
            }
        });
    });
}

// 初始化编辑表单的数据加载
function initEditFormData() {
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取当前行的数据
            const row = this.closest('tr');
            const cells = row.querySelectorAll('td');
            
            // 找到编辑模态框
            const editModal = document.getElementById('editModal');
            if (editModal) {
                // 在实际应用中，这里会根据实体类型设置不同的字段
                // 在原型中，我们模拟设置一些通用字段
                const form = editModal.querySelector('form');
                if (form) {
                    // 设置ID
                    const idField = form.querySelector('[name="id"]');
                    if (idField) {
                        idField.value = cells[0]?.textContent.trim() || '';
                    }
                    
                    // 设置名称字段
                    const nameField = form.querySelector('[name="name"]');
                    if (nameField) {
                        nameField.value = cells[1]?.textContent.trim() || '';
                    }
                    
                    // 设置状态选择
                    const statusField = form.querySelector('[name="status"]');
                    if (statusField) {
                        const statusText = cells[2]?.textContent.trim() || '';
                        Array.from(statusField.options).forEach(option => {
                            if (option.textContent.trim() === statusText) {
                                option.selected = true;
                            }
                        });
                    }
                }
                
                // 打开模态框
                const modal = new bootstrap.Modal(editModal);
                modal.show();
            }
        });
    });
}

// 初始化表头过滤功能
function initTableHeaderFilters() {
    // 获取所有表头中的下拉菜单
    const headerDropdowns = document.querySelectorAll('th .dropdown-menu');
    
    headerDropdowns.forEach(dropdown => {
        const filterItems = dropdown.querySelectorAll('.dropdown-item');
        const headerButton = dropdown.previousElementSibling;
        const originalHeaderText = headerButton.textContent.trim();
        
        // 为每个下拉项添加点击事件
        filterItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // 防止冒泡
                
                // 移除所有活动状态
                filterItems.forEach(i => i.classList.remove('active'));
                
                // 设置当前项为活动状态
                this.classList.add('active');
                
                // 更新表头按钮文本
                const selectedText = this.textContent.trim();
                if (selectedText.includes('所有')) {
                    headerButton.textContent = originalHeaderText;
                } else {
                    headerButton.textContent = selectedText;
                }
                
                // 应用过滤
                applyTableFilter(originalHeaderText, selectedText);
                
                // 手动关闭下拉菜单
                dropdown.style.display = 'none';
                
                // 延迟恢复下拉菜单的hover展开功能
                setTimeout(() => {
                    dropdown.style.display = '';
                }, 100);
            });
        });
    });
}

// 应用表格过滤
function applyTableFilter(columnName, filterValue) {
    const rows = document.querySelectorAll('tbody tr');
    const isAllFilter = filterValue.includes('所有');
    
    let columnIndex = -1;
    
    // 查找列索引
    document.querySelectorAll('th').forEach((th, index) => {
        const thText = th.textContent.trim();
        if (thText.includes(columnName)) {
            columnIndex = index;
        }
    });
    
    if (columnIndex === -1 || isAllFilter) {
        // 如果是"所有"过滤或找不到列，显示所有行
        rows.forEach(row => row.style.display = '');
        return;
    }
    
    // 过滤表格行
    rows.forEach(row => {
        const cell = row.cells[columnIndex];
        const cellText = cell.textContent.trim();
        
        if (cellText.includes(filterValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    // 更新分页信息
    updatePagination(document.querySelectorAll('tbody tr:not([style*="display: none"])').length);
}

/**
 * 统一的分页功能
 * 通用的分页信息更新函数
 * @param {Number} totalItems - 总条目数
 * @param {Number} pageSize - 每页显示数量
 * @param {Number} currentPage - 当前页码
 * @param {Function} loadDataCallback - 加载数据的回调函数，接收页码参数
 */
function updatePaginationInfo(totalItems, pageSize, currentPage, loadDataCallback) {
    // 更新分页信息文本
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
        const startItem = (currentPage - 1) * pageSize + 1;
        const endItem = Math.min(currentPage * pageSize, totalItems);
        
        paginationInfo.textContent = `显示 ${startItem}-${endItem} 条，共 ${totalItems} 条记录`;
    }
    
    // 更新分页按钮
    const totalPages = Math.ceil(totalItems / pageSize);
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
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
    if (typeof loadDataCallback === 'function') {
        pagination.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (this.getAttribute('aria-disabled') === 'true') {
                    return;
                }
                
                const newPage = parseInt(this.getAttribute('data-page'));
                if (!isNaN(newPage)) {
                    loadDataCallback(newPage);
                }
            });
        });
    }
}

// 通用的页面大小初始化函数，供各个页面调用
function initPageSize(loadDataCallback) {
    const pageSizeSelector = document.getElementById('pageSize');
    if (pageSizeSelector) {
        pageSizeSelector.addEventListener('change', function() {
            const pageSize = parseInt(this.value);
            // 调用回调函数加载数据，传入1表示回到第一页
            if (typeof loadDataCallback === 'function') {
                loadDataCallback(1);
            }
        });
    }
}

// 重置模拟数据函数
function resetMockData() {
    try {
        // 清除本地存储中的数据
        localStorage.removeItem('recruitmentSystemData');
        
        // 重新加载页面以重新生成数据
        window.location.reload();
        
        return true;
    } catch (error) {
        console.error('重置模拟数据失败:', error);
        return false;
    }
}

// 向window对象添加重置函数，使其在全局可访问
window.resetMockData = resetMockData;

// 显示通用确认删除模态框
function showDeleteConfirmModal(title, content, onConfirm) {
    // 检查是否已存在确认框，如果存在则移除
    const existingModal = document.getElementById('confirmDeleteModal');
    if (existingModal) {
        document.body.removeChild(existingModal);
    }

    // 创建确认删除的模态框
    const confirmModal = document.createElement('div');
    confirmModal.className = 'modal fade';
    confirmModal.id = 'confirmDeleteModal';
    confirmModal.setAttribute('tabindex', '-1');
    confirmModal.setAttribute('aria-labelledby', 'confirmDeleteModalLabel');
    confirmModal.setAttribute('aria-hidden', 'true');
    
    confirmModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmDeleteModalLabel">${title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ${content}
                    <p class="text-danger">此操作无法撤销。</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteBtn">确认删除</button>
                </div>
            </div>
        </div>
    `;
    
    // 添加到文档
    document.body.appendChild(confirmModal);
    
    // 显示模态框
    const modal = new bootstrap.Modal(confirmModal);
    modal.show();
    
    // 绑定确认删除按钮事件
    document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
        // 执行删除操作
        onConfirm();
        
        // 隐藏模态框
        modal.hide();
    });
    
    // 模态框关闭后移除DOM
    confirmModal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(confirmModal);
    });
}

// 向window对象添加确认删除模态框函数，使其在全局可访问
window.showDeleteConfirmModal = showDeleteConfirmModal; 