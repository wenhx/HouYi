/**
 * 标签页管理系统
 * 用于管理所有打开的标签页，支持打开新标签页、关闭标签页、切换标签页
 */

// 已打开的标签页记录，用于检查是否已经打开
const openedTabs = {
    'dashboard': true // 默认打开的数据看板标签页
};

// 当前活动的标签页ID
let activeTabId = 'dashboard-tab';

// 当页面加载完成后初始化事件监听
document.addEventListener('DOMContentLoaded', function() {
    // 为侧边栏的所有链接添加点击事件
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取页面标识和标题
            const page = this.getAttribute('data-page');
            const title = this.getAttribute('data-title');
            
            // 处理点击事件
            handleNavLinkClick(page, title);
            
            // 更新侧边栏选中状态
            updateSidebarActive(this);
        });
    });
});

/**
 * 处理导航链接点击事件
 * @param {string} page 页面的标识符或URL
 * @param {string} title 标签页的标题
 */
function handleNavLinkClick(page, title) {
    // 如果标签页已经打开，则切换到该标签页
    if (openedTabs[page]) {
        const tabId = page === 'dashboard' ? 'dashboard-tab' : `tab-${page.replace(/\//g, '-').replace(/\.html$/, '')}`;
        activateTab(tabId);
        return;
    }
    
    // 创建新标签页
    openTab(page, title);
}

/**
 * 更新侧边栏选中状态
 * @param {Element} clickedLink 被点击的链接元素
 */
function updateSidebarActive(clickedLink) {
    // 移除所有active类
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 为点击的链接添加active类
    clickedLink.classList.add('active');
}

/**
 * 打开新标签页
 * @param {string} page 页面的标识符或URL
 * @param {string} title 标签页的标题
 */
function openTab(page, title) {
    // 记录新标签页
    openedTabs[page] = true;
    
    // 生成唯一的标签页ID
    const tabId = page === 'dashboard' ? 'dashboard-tab' : `tab-${page.replace(/\//g, '-').replace(/\.html$/, '')}`;
    const contentId = page === 'dashboard' ? 'dashboard-content' : `content-${page.replace(/\//g, '-').replace(/\.html$/, '')}`;
    
    // 创建标签页标题
    const tabsNav = document.getElementById('mainTabs');
    const tabItem = document.createElement('li');
    tabItem.className = 'nav-item';
    tabItem.setAttribute('role', 'presentation');
    
    tabItem.innerHTML = `
        <button class="nav-link" id="${tabId}" data-bs-toggle="tab" data-bs-target="#${contentId}" 
                type="button" role="tab" aria-controls="${contentId}" aria-selected="false">
            ${title}
            <span class="close-tab" onclick="closeTab('${tabId}', event)">✕</span>
        </button>
    `;
    tabsNav.appendChild(tabItem);
    
    // 创建标签页内容容器
    const tabContent = document.getElementById('mainTabContent');
    const contentDiv = document.createElement('div');
    contentDiv.className = 'tab-pane fade';
    contentDiv.id = contentId;
    contentDiv.setAttribute('role', 'tabpanel');
    contentDiv.setAttribute('aria-labelledby', tabId);
    
    // 对于dashboard，直接使用已经存在的内容
    if (page === 'dashboard') {
        // 仪表板已经存在，不需要做任何事情
    } else {
        // 使用iframe加载页面内容
        contentDiv.innerHTML = `
            <div class="iframe-container" style="height: calc(100vh - 150px);">
                <iframe src="${page}" title="${title}" class="w-100 h-100 border-0" allowfullscreen></iframe>
            </div>
        `;
        tabContent.appendChild(contentDiv);
    }
    
    // 激活新标签页
    activateTab(tabId);
    
    // 如果打开的标签页数量大于1，显示所有关闭按钮
    updateCloseButtons();
}

/**
 * 激活指定的标签页
 * @param {string} tabId 要激活的标签页ID
 */
function activateTab(tabId) {
    // 获取标签页元素
    const tabElement = document.getElementById(tabId);
    if (!tabElement) return;
    
    // 存储当前活动的标签页ID
    activeTabId = tabId;
    
    // 创建一个新的Bootstrap Tab实例并显示
    const tab = new bootstrap.Tab(tabElement);
    tab.show();
}

/**
 * 关闭标签页
 * @param {string} tabId 要关闭的标签页ID
 * @param {Event} event 事件对象
 */
function closeTab(tabId, event) {
    // 阻止事件冒泡
    if (event) {
        event.stopPropagation();
    }
    
    // 不允许关闭最后一个标签页
    if (Object.keys(openedTabs).length <= 1) {
        return;
    }
    
    // 获取标签页元素和内容元素
    const tabElement = document.getElementById(tabId);
    if (!tabElement) return;
    
    // 获取内容ID和页面标识
    const contentId = tabElement.getAttribute('data-bs-target').substring(1);
    let pageKey = '';
    
    if (tabId === 'dashboard-tab') {
        pageKey = 'dashboard';
    } else {
        // 从tabId反向计算page key
        pageKey = tabId.replace('tab-', '').replace(/-/g, '/') + '.html';
    }
    
    // 如果正在关闭当前活动的标签页，则需要激活另一个标签页
    if (tabId === activeTabId) {
        // 查找下一个要激活的标签页
        const tabs = document.querySelectorAll('#mainTabs .nav-link');
        let nextTabId = null;
        
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].id === tabId) {
                // 尝试激活下一个标签页，如果没有则激活上一个
                if (i < tabs.length - 1) {
                    nextTabId = tabs[i + 1].id;
                } else if (i > 0) {
                    nextTabId = tabs[i - 1].id;
                }
                break;
            }
        }
        
        // 激活找到的标签页
        if (nextTabId) {
            activateTab(nextTabId);
        }
    }
    
    // 移除标签页和内容元素
    tabElement.parentNode.remove();
    const contentElement = document.getElementById(contentId);
    if (contentElement) {
        contentElement.remove();
    }
    
    // 更新打开的标签页记录
    delete openedTabs[pageKey];
    
    // 更新关闭按钮的显示状态
    updateCloseButtons();
    
    // 更新侧边栏活动状态
    updateSidebarFromTab();
}

/**
 * 更新关闭按钮的显示状态
 * 当只有一个标签页时隐藏关闭按钮，多个标签页时显示关闭按钮
 */
function updateCloseButtons() {
    const closeButtons = document.querySelectorAll('.close-tab');
    const tabCount = Object.keys(openedTabs).length;
    
    closeButtons.forEach(button => {
        if (tabCount <= 1) {
            button.classList.add('d-none');
        } else {
            button.classList.remove('d-none');
        }
    });
}

/**
 * 根据当前活动的标签页更新侧边栏的选中状态
 */
function updateSidebarFromTab() {
    // 获取当前活动的标签页
    const activeTab = document.querySelector('.nav-link.active');
    if (!activeTab) return;
    
    let pageKey = '';
    if (activeTab.id === 'dashboard-tab') {
        pageKey = 'dashboard';
    } else {
        // 从tabId提取页面标识
        pageKey = activeTab.id.replace('tab-', '').replace(/-/g, '/') + '.html';
    }
    
    // 在侧边栏中查找并激活对应的链接
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageKey) {
            link.classList.add('active');
        }
    });
} 