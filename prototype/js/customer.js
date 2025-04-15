// 客户管理页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 加载客户数据
    loadCustomerData();
    
    // 初始化添加客户按钮
    document.getElementById('saveCustomerBtn').addEventListener('click', saveCustomer);
    
    // 初始化编辑客户按钮
    document.getElementById('updateCustomerBtn').addEventListener('click', updateCustomer);
    
    // 监听页面大小变更
    initPageSize(loadCustomerData);
});

// 加载客户数据
function loadCustomerData(page) {
    const customerTableBody = document.getElementById('customerTableBody');
    
    // 清空表格
    customerTableBody.innerHTML = '';
    
    // 获取所有客户数据
    const customers = window.mockData.customers;
    
    // 根据当前页面大小和页码计算显示的数据
    const pageSize = parseInt(document.getElementById('pageSize')?.value || 10);
    const currentPage = page || 1; // 使用传入的页码或默认为第一页
    
    // 计算当前页面应该显示的数据范围
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, customers.length);
    
    // 遍历数据并创建表格行
    for (let i = startIndex; i < endIndex; i++) {
        const customer = customers[i];
        
        // 为了丰富模拟数据，为客户添加一些属性
        const contactPerson = customer.contactPerson || `联系人${Math.floor(Math.random() * 10) + 1}`;
        const phone = customer.phone || `1381234${(1000 + customer.id).toString().substring(1)}`;
        const email = customer.email || `contact@${customer.name.toLowerCase().replace(/[^\w]/g, '')}.com`;
        const address = customer.address || `${['北京', '上海', '广州', '深圳', '杭州'][Math.floor(Math.random() * 5)]}市...`;
        
        // 创建表格行
        const row = document.createElement('tr');
        
        // 设置行内容
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${contactPerson}</td>
            <td>${phone}</td>
            <td>${email}</td>
            <td>${address}</td>
            <td>${formatDate(customer.createTime)}</td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary btn-view" data-id="${customer.id}">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-success btn-edit" data-id="${customer.id}" data-bs-toggle="modal" data-bs-target="#editModal">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-delete" data-id="${customer.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        // 将行添加到表格
        customerTableBody.appendChild(row);
    }
    
    // 更新分页信息
    updatePaginationInfo(customers.length, pageSize, currentPage);
    
    // 初始化操作按钮事件
    initViewButtons();
    initEditButtons();
    initDeleteButtons();
}

// 添加新客户
function saveCustomer() {
    // 获取表单数据
    const formData = {
        id: window.mockData.customers.length + 1,
        name: document.getElementById('name').value,
        contactPerson: document.getElementById('contactPerson').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        description: document.getElementById('description').value,
        createTime: new Date()
    };
    
    // 添加到模拟数据
    window.mockData.customers.unshift(formData);
    
    // 关闭模态框
    const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
    modal.hide();
    
    // 重新加载数据
    loadCustomerData();
    
    // 重置表单
    document.getElementById('addCustomerForm').reset();
}

// 更新客户
function updateCustomer() {
    // 获取客户ID
    const customerId = parseInt(document.getElementById('edit-id').value);
    
    // 查找客户索引
    const customerIndex = window.mockData.customers.findIndex(customer => customer.id === customerId);
    
    if (customerIndex !== -1) {
        // 更新数据
        window.mockData.customers[customerIndex] = {
            ...window.mockData.customers[customerIndex],
            name: document.getElementById('edit-name').value,
            contactPerson: document.getElementById('edit-contactPerson').value,
            phone: document.getElementById('edit-phone').value,
            email: document.getElementById('edit-email').value,
            address: document.getElementById('edit-address').value,
            description: document.getElementById('edit-description').value
        };
        
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal.hide();
        
        // 重新加载数据
        loadCustomerData();
    }
}

// 初始化查看按钮
function initViewButtons() {
    const viewButtons = document.querySelectorAll('.btn-view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const customerId = parseInt(this.getAttribute('data-id'));
            viewCustomer(customerId);
        });
    });
}

// 初始化编辑按钮
function initEditButtons() {
    const editButtons = document.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const customerId = parseInt(this.getAttribute('data-id'));
            fillEditForm(customerId);
        });
    });
}

// 初始化删除按钮
function initDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const customerId = parseInt(this.getAttribute('data-id'));
            deleteCustomer(customerId);
        });
    });
}

// 查看客户详情
function viewCustomer(customerId) {
    // 查找客户
    const customer = window.mockData.customers.find(customer => customer.id === customerId);
    
    if (customer) {
        // 在实际应用中，这里会跳转到详情页或打开详情模态框
        // 在原型中，我们只是弹出一个提示
        alert(`查看客户详情: ${customer.name}`);
    }
}

// 填充编辑表单
function fillEditForm(customerId) {
    // 查找客户
    const customer = window.mockData.customers.find(customer => customer.id === customerId);
    
    if (customer) {
        // 填充表单字段
        document.getElementById('edit-id').value = customer.id;
        document.getElementById('edit-name').value = customer.name;
        document.getElementById('edit-contactPerson').value = customer.contactPerson || '';
        document.getElementById('edit-phone').value = customer.phone || '';
        document.getElementById('edit-email').value = customer.email || '';
        document.getElementById('edit-address').value = customer.address || '';
        document.getElementById('edit-description').value = customer.description || '';
    }
}

// 删除客户
function deleteCustomer(customerId) {
    // 查找客户
    const customer = window.mockData.customers.find(customer => customer.id === customerId);
    
    if (customer) {
        // 使用通用确认删除模态框
        window.showDeleteConfirmModal(
            '确认删除',
            `<p>您确定要删除客户 <strong>${customer.name}</strong> 吗？</p>`,
            function() {
                // 查找客户索引
                const customerIndex = window.mockData.customers.findIndex(cust => cust.id === customerId);
                
                if (customerIndex !== -1) {
                    // 从数组中删除
                    window.mockData.customers.splice(customerIndex, 1);
                    
                    // 重新加载数据
                    loadCustomerData();
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
                loadCustomerData(newPage);
            }
        });
    });
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