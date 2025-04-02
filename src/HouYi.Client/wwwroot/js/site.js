// 聚焦到指定的元素
window.focusElement = function (element) {
    if (element) {
        setTimeout(() => {
            element.focus();
            
            // 如果是文本输入框，光标移到末尾
            if (element.tagName.toLowerCase() === 'input' && element.type === 'text' || 
                element.tagName.toLowerCase() === 'textarea') {
                var length = element.value ? element.value.length : 0;
                element.setSelectionRange(length, length);
            }
        }, 50);
    }
};

// 显示一个自动消失的消息
window.showToast = function (message, isError = false, duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = isError ? 'toast toast-error' : 'toast toast-success';
    toast.style.padding = '10px 15px';
    toast.style.margin = '5px 0';
    toast.style.borderRadius = '4px';
    toast.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
    toast.style.color = isError ? '#721c24' : '#155724';
    toast.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease-in';
    
    toast.textContent = message;
    
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    // 淡入
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // 设置自动消失
    setTimeout(() => {
        toast.style.opacity = '0';
        
        // 等淡出完成后移除元素
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, duration);
}; 