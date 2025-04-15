// 统计管理页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化Chart.js插件(如果存在)
    if (window.Chart && window.ChartDataLabels) {
        Chart.register(ChartDataLabels);
        console.log("已注册Chart.js数据标签插件");
    }
    
    // 初始化全局变量以保存图表引用
    window.mainChart = null;
    
    // 初始化日期范围为"今天"，并高亮按钮
    initDateRange('today');
    highlightRangeButton('today');
    
    // 初始化图表
    window.mainChart = initChart();
    
    // 加载初始数据
    loadStatisticsData();
    
    // 初始化查询按钮事件
    document.getElementById('queryBtn').addEventListener('click', function(e) {
        e.preventDefault();
        loadStatisticsData();
    });
    
    // 初始化重置按钮事件
    document.getElementById('resetBtn').addEventListener('click', function() {
        document.getElementById('statisticsForm').reset();
        initDateRange('today');
        highlightRangeButton('today');
        loadStatisticsData();
    });
    
    // 初始化快捷日期范围选择按钮
    const rangeButtons = document.querySelectorAll('[data-range]');
    rangeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const range = this.getAttribute('data-range');
            console.log("按钮点击: " + range); // 调试日志
            initDateRange(range);
            highlightRangeButton(range);
            loadStatisticsData();
        });
    });
    
    // 初始化图表类型切换
    document.getElementById('chartType').addEventListener('change', function() {
        updateChartType(window.mainChart, this.value);
    });
    
    // 初始化数据类型切换
    document.getElementById('dataType').addEventListener('change', function() {
        toggleTableColumns(this.value);
    });
    
    // 初始化下载按钮
    document.getElementById('downloadChart').addEventListener('click', function() {
        downloadChart(window.mainChart);
    });
    
    // 初始化导出按钮
    document.getElementById('exportExcel').addEventListener('click', function() {
        exportToExcel();
    });
    
    document.getElementById('exportPdf').addEventListener('click', function() {
        exportToPdf();
    });

    // 页面加载后重新绑定按钮事件
    document.getElementById('range-today')?.addEventListener('click', function() {
        initDateRange('today');
        highlightRangeButton('today');
        loadStatisticsData();
    });
    
    document.getElementById('range-yesterday')?.addEventListener('click', function() {
        initDateRange('yesterday');
        highlightRangeButton('yesterday');
        loadStatisticsData();
    });
    
    document.getElementById('range-thisWeek')?.addEventListener('click', function() {
        initDateRange('thisWeek');
        highlightRangeButton('thisWeek');
        loadStatisticsData();
    });
    
    document.getElementById('range-lastWeek')?.addEventListener('click', function() {
        initDateRange('lastWeek');
        highlightRangeButton('lastWeek');
        loadStatisticsData();
    });
    
    document.getElementById('range-thisMonth')?.addEventListener('click', function() {
        initDateRange('thisMonth');
        highlightRangeButton('thisMonth');
        loadStatisticsData();
    });
    
    document.getElementById('range-lastMonth')?.addEventListener('click', function() {
        initDateRange('lastMonth');
        highlightRangeButton('lastMonth');
        loadStatisticsData();
    });
    
    document.getElementById('range-last3Months')?.addEventListener('click', function() {
        initDateRange('last3Months');
        highlightRangeButton('last3Months');
        loadStatisticsData();
    });
    
    document.getElementById('range-thisYear')?.addEventListener('click', function() {
        initDateRange('thisYear');
        highlightRangeButton('thisYear');
        loadStatisticsData();
    });
});

// 高亮选中的时间范围按钮
function highlightRangeButton(rangeType) {
    console.log("高亮按钮: " + rangeType); // 调试日志
    
    // 移除所有按钮的高亮
    const rangeButtons = document.querySelectorAll('[data-range]');
    rangeButtons.forEach(button => {
        button.classList.remove('active');
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-primary');
    });
    
    // 给选中的按钮添加高亮
    const activeButton = document.querySelector(`[data-range="${rangeType}"]`);
    if (activeButton) {
        activeButton.classList.add('active', 'btn-primary');
        activeButton.classList.remove('btn-outline-primary');
        console.log("按钮已高亮: ", activeButton);
    } else {
        console.error("未找到按钮: " + rangeType);
    }
}

// 初始化日期范围
function initDateRange(rangeType) {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    switch(rangeType) {
        case 'today':
            // 今天
            break;
        case 'yesterday':
            // 昨天
            startDate.setDate(now.getDate() - 1);
            endDate.setDate(now.getDate() - 1);
            break;
        case 'thisWeek':
            // 本周（周一到今天）
            const day = now.getDay() || 7;
            startDate.setDate(now.getDate() - day + 1);
            break;
        case 'lastWeek':
            // 上周（上周一到上周日）
            const lastWeekDay = now.getDay() || 7;
            startDate.setDate(now.getDate() - lastWeekDay - 6);
            endDate.setDate(now.getDate() - lastWeekDay);
            break;
        case 'thisMonth':
            // 本月（1号到今天）
            startDate.setDate(1);
            break;
        case 'lastMonth':
            // 上月（上月1号到上月最后一天）
            startDate.setMonth(now.getMonth() - 1);
            startDate.setDate(1);
            endDate.setDate(0);
            break;
        case 'last3Months':
            // 近3个月
            startDate.setMonth(now.getMonth() - 3);
            break;
        case 'thisYear':
            // 今年（1/1到今天）
            startDate.setMonth(0);
            startDate.setDate(1);
            break;
        default:
            // 默认本月
            startDate.setDate(1);
    }
    
    // 格式化日期为YYYY-MM-DD
    startDateInput.value = formatDateForInput(startDate);
    endDateInput.value = formatDateForInput(endDate);
}

// 格式化日期为YYYY-MM-DD
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 初始化图表
function initChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: '新增简历',
                    data: [],
                    borderColor: 'rgb(13, 110, 253)',
                    backgroundColor: 'rgba(13, 110, 253, 0.2)',
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 3,
                    fill: true
                },
                {
                    label: '沟通',
                    data: [],
                    borderColor: 'rgb(108, 117, 125)',
                    backgroundColor: 'rgba(108, 117, 125, 0.2)',
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 3,
                    fill: true
                },
                {
                    label: '推荐',
                    data: [],
                    borderColor: 'rgb(13, 202, 240)',
                    backgroundColor: 'rgba(13, 202, 240, 0.2)',
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 3,
                    fill: true
                },
                {
                    label: '面试安排',
                    data: [],
                    borderColor: 'rgb(255, 193, 7)',
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 3,
                    fill: true
                },
                {
                    label: '面试通过',
                    data: [],
                    borderColor: 'rgb(25, 135, 84)',
                    backgroundColor: 'rgba(25, 135, 84, 0.2)',
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 3,
                    fill: true
                },
                {
                    label: '成单',
                    data: [],
                    borderColor: 'rgb(220, 53, 69)',
                    backgroundColor: 'rgba(220, 53, 69, 0.2)',
                    tension: 0.3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    color: '#000',
                    anchor: 'end',
                    align: 'top',
                    offset: 10,
                    formatter: function(value) {
                        return value;
                    },
                    font: {
                        weight: 'bold',
                        size: 10
                    },
                    display: function(context) {
                        const dataset = context.dataset;
                        const data = dataset.data;
                        if (data.length === 0) return false;
                        
                        const sum = data.reduce((acc, val) => acc + val, 0);
                        const avg = sum / data.length;
                        
                        return context.dataIndex % 2 === 0 && data[context.dataIndex] > avg/2;
                    }
                },
                title: {
                    display: true,
                    text: '数据趋势分析',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 14
                        }
                    },
                    margin: {
                        bottom: 30
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    padding: 10,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    borderColor: 'rgba(255,255,255,0.2)',
                    borderWidth: 1,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw !== null ? context.raw : 'N/A';
                            return label;
                        }
                    }
                }
            },
            layout: {
                padding: {
                    top: 30,
                    right: 10,
                    bottom: 10,
                    left: 10
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        precision: 0,
                        padding: 10
                    },
                    suggestedMax: 25
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            hover: {
                mode: 'nearest',
                intersect: false
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear'
                },
                y: {
                    duration: 1000,
                    easing: 'easeInOutQuad'
                }
            }
        }
    });
}

// 加载统计数据
function loadStatisticsData() {
    const startDateStr = document.getElementById('startDate').value;
    const endDateStr = document.getElementById('endDate').value;
    const dataType = document.getElementById('dataType').value;
    const groupBy = document.getElementById('groupBy').value;
    const consultant = document.getElementById('consultant').value;
    
    console.log("加载数据, 日期范围: " + startDateStr + " 到 " + endDateStr); // 调试日志
    
    if (!startDateStr || !endDateStr) {
        alert('请选择开始和结束日期');
        return;
    }
    
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    if (startDate > endDate) {
        alert('开始日期不能大于结束日期');
        return;
    }
    
    try {
        // 确保模拟数据已初始化
        if (!window.mockData) {
            console.log("初始化模拟数据");
            // 如果mockData.js未正确加载，初始化空的模拟数据对象
            window.mockData = {
                resumes: [],
                positions: [],
                interviews: []
            };
            
            // 这里可以添加一些基本的模拟数据，如果mockData.js未加载
            for (let i = 0; i < 100; i++) {
                const date = new Date();
                date.setDate(date.getDate() - Math.floor(Math.random() * 365));
                
                window.mockData.resumes.push({
                    id: i,
                    createTime: date
                });
                
                if (i < 50) {
                    window.mockData.positions.push({
                        id: i,
                        createTime: date
                    });
                }
                
                if (i < 80) {
                    window.mockData.interviews.push({
                        id: i,
                        createTime: date,
                        status: Math.floor(Math.random() * 5)
                    });
                }
            }
        }
        
        // 获取模拟数据
        const { resumes, positions, interviews } = window.mockData;
        console.log(`已获取模拟数据: ${resumes.length}份简历, ${positions.length}个职位, ${interviews.length}次面试`);
        
        // 按日期过滤数据
        const filteredResumes = resumes.filter(r => isDateInRange(r.createTime, startDate, endDate));
        const filteredPositions = positions.filter(p => isDateInRange(p.createTime, startDate, endDate));
        const filteredInterviews = interviews.filter(i => isDateInRange(i.createTime, startDate, endDate));
        
        // 统计摘要数据
        updateSummaryCards(filteredResumes, filteredPositions, filteredInterviews);
        
        // 按选择的分组方式进行统计
        const statisticsData = generateStatisticsData(
            filteredResumes, 
            filteredPositions, 
            filteredInterviews,
            startDate,
            endDate,
            groupBy
        );
        
        // 更新图表
        updateChart(window.mainChart, statisticsData, groupBy);
        
        // 更新表格
        updateTable(statisticsData);
        
    } catch (error) {
        console.error("加载数据时出错:", error);
        // 即使出错也继续显示模拟数据
        updateSummaryCards([], [], []);
        updateChart(window.mainChart, [], groupBy);
        updateTable([]);
    }
}

// 判断日期是否在范围内
function isDateInRange(date, startDate, endDate) {
    const d = new Date(date);
    // 设置时间为0点0分0秒，以便只比较日期部分
    d.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    
    // 设置结束日期为23:59:59，以便包含结束日期当天的所有数据
    const endDateCopy = new Date(endDate);
    endDateCopy.setHours(23, 59, 59, 999);
    
    return d >= startDate && d <= endDateCopy;
}

// 更新统计摘要卡片
function updateSummaryCards(resumes, positions, interviews) {
    // 获取已选日期范围类型
    const activeRangeButton = document.querySelector('[data-range].active');
    const rangeType = activeRangeButton ? activeRangeButton.getAttribute('data-range') : 'today';
    
    // 根据不同时间范围设置不同的数据
    let resumeCount, positionCount, interviewCount, passRate, communicationCount, recommendationCount, dealCount, recommendPassRate;
    
    // 模拟数据 - 在实际应用中这些数据应该来自后端API
    switch(rangeType) {
        case 'today':
            resumeCount = Math.floor(Math.random() * 10) + 5; // 5-14
            positionCount = Math.floor(Math.random() * 5) + 1; // 1-5
            communicationCount = Math.floor(Math.random() * 20) + 15; // 15-34
            recommendationCount = Math.floor(Math.random() * 12) + 8; // 8-19
            interviewCount = Math.floor(Math.random() * 8) + 3; // 3-10
            passRate = (Math.floor(Math.random() * 25) + 50).toFixed(1); // 50%-74.9%
            dealCount = Math.floor(Math.random() * 3) + 1; // 1-3
            break;
        case 'yesterday':
            resumeCount = Math.floor(Math.random() * 15) + 8; // 8-22
            positionCount = Math.floor(Math.random() * 7) + 2; // 2-8
            communicationCount = Math.floor(Math.random() * 25) + 20; // 20-44
            recommendationCount = Math.floor(Math.random() * 15) + 10; // 10-24
            interviewCount = Math.floor(Math.random() * 10) + 5; // 5-14
            passRate = (Math.floor(Math.random() * 25) + 50).toFixed(1); // 50%-74.9%
            dealCount = Math.floor(Math.random() * 4) + 1; // 1-4
            break;
        case 'thisWeek':
            resumeCount = Math.floor(Math.random() * 30) + 20; // 20-49
            positionCount = Math.floor(Math.random() * 10) + 5; // 5-14
            communicationCount = Math.floor(Math.random() * 60) + 50; // 50-109
            recommendationCount = Math.floor(Math.random() * 35) + 25; // 25-59
            interviewCount = Math.floor(Math.random() * 25) + 15; // 15-39
            passRate = (Math.floor(Math.random() * 25) + 50).toFixed(1); // 50%-74.9%
            dealCount = Math.floor(Math.random() * 6) + 3; // 3-8
            break;
        case 'lastWeek':
            resumeCount = Math.floor(Math.random() * 35) + 25; // 25-59
            positionCount = Math.floor(Math.random() * 12) + 8; // 8-19
            communicationCount = Math.floor(Math.random() * 70) + 60; // 60-129
            recommendationCount = Math.floor(Math.random() * 40) + 30; // 30-69
            interviewCount = Math.floor(Math.random() * 30) + 20; // 20-49
            passRate = (Math.floor(Math.random() * 25) + 50).toFixed(1); // 50%-74.9%
            dealCount = Math.floor(Math.random() * 8) + 4; // 4-11
            break;
        case 'thisMonth':
            resumeCount = Math.floor(Math.random() * 80) + 40; // 40-119
            positionCount = Math.floor(Math.random() * 25) + 15; // 15-39
            communicationCount = Math.floor(Math.random() * 200) + 150; // 150-349
            recommendationCount = Math.floor(Math.random() * 100) + 80; // 80-179
            interviewCount = Math.floor(Math.random() * 60) + 40; // 40-99
            passRate = (Math.floor(Math.random() * 25) + 50).toFixed(1); // 50%-74.9%
            dealCount = Math.floor(Math.random() * 15) + 10; // 10-24
            break;
        case 'lastMonth':
            resumeCount = Math.floor(Math.random() * 100) + 50; // 50-149
            positionCount = Math.floor(Math.random() * 30) + 20; // 20-49
            communicationCount = Math.floor(Math.random() * 250) + 180; // 180-429
            recommendationCount = Math.floor(Math.random() * 120) + 90; // 90-209
            interviewCount = Math.floor(Math.random() * 80) + 50; // 50-129
            passRate = (Math.floor(Math.random() * 25) + 50).toFixed(1); // 50%-74.9%
            dealCount = Math.floor(Math.random() * 20) + 12; // 12-31
            break;
        case 'last3Months':
            resumeCount = Math.floor(Math.random() * 250) + 150; // 150-399
            positionCount = Math.floor(Math.random() * 80) + 40; // 40-119
            communicationCount = Math.floor(Math.random() * 600) + 400; // 400-999
            recommendationCount = Math.floor(Math.random() * 300) + 200; // 200-499
            interviewCount = Math.floor(Math.random() * 200) + 100; // 100-299
            passRate = (Math.floor(Math.random() * 25) + 50).toFixed(1); // 50%-74.9%
            dealCount = Math.floor(Math.random() * 40) + 25; // 25-64
            break;
        case 'thisYear':
            resumeCount = Math.floor(Math.random() * 500) + 300; // 300-799
            positionCount = Math.floor(Math.random() * 150) + 100; // 100-249
            communicationCount = Math.floor(Math.random() * 1200) + 800; // 800-1999
            recommendationCount = Math.floor(Math.random() * 600) + 400; // 400-999
            interviewCount = Math.floor(Math.random() * 400) + 200; // 200-599
            passRate = (Math.floor(Math.random() * 25) + 50).toFixed(1); // 50%-74.9%
            dealCount = Math.floor(Math.random() * 80) + 50; // 50-129
            break;
        default:
            // 使用实际计算的数据
            resumeCount = resumes.length;
            positionCount = positions.length;
            interviewCount = interviews.length;
            communicationCount = Math.floor(Math.random() * resumeCount * 3) + resumeCount * 2; // 模拟沟通数据
            recommendationCount = Math.floor(Math.random() * resumeCount * 1.5) + Math.floor(resumeCount); // 模拟推荐数据
            dealCount = Math.floor(Math.random() * interviewCount * 0.4) + Math.floor(interviewCount * 0.1); // 模拟成单数据
            
            // 计算面试通过率
            const passedInterviews = interviews.filter(i => i.status === 2).length;
            const totalCompleted = interviews.filter(i => [2, 4].includes(i.status)).length;
            passRate = totalCompleted === 0 ? 0 : (passedInterviews / totalCompleted * 100).toFixed(1);
    }
    
    // 计算推荐通过率 - 推荐给对方公司并被接受安排后续面试的比率
    recommendPassRate = recommendationCount > 0 ? (interviewCount / recommendationCount * 100).toFixed(1) : "0.0";
    
    // 更新摘要卡片显示
    document.getElementById('resumeCount').textContent = resumeCount;
    document.getElementById('positionCount').textContent = positionCount;
    document.getElementById('communicationCount').textContent = communicationCount;
    document.getElementById('recommendationCount').textContent = recommendationCount;
    document.getElementById('interviewCount').textContent = interviewCount;
    document.getElementById('passRate').textContent = `${passRate}%`;
    document.getElementById('dealCount').textContent = dealCount;
    document.getElementById('recommendPassRate').textContent = `${recommendPassRate}%`;
    
    // 添加数字变化动画效果
    animateValue('resumeCount', 0, resumeCount, 1000);
    animateValue('positionCount', 0, positionCount, 1000);
    animateValue('communicationCount', 0, communicationCount, 1000);
    animateValue('recommendationCount', 0, recommendationCount, 1000);
    animateValue('interviewCount', 0, interviewCount, 1000);
    animateValue('passRate', 0, parseFloat(passRate), 1000, '%');
    animateValue('dealCount', 0, dealCount, 1000);
    animateValue('recommendPassRate', 0, parseFloat(recommendPassRate), 1000, '%');
}

// 数字变化动画效果
function animateValue(elementId, start, end, duration, suffix = '') {
    const element = document.getElementById(elementId);
    const startTime = new Date().getTime();
    
    const updateValue = () => {
        const currentTime = new Date().getTime();
        const elapsed = currentTime - startTime;
        
        if (elapsed < duration) {
            const value = Math.round(easeInOutQuad(elapsed, start, end - start, duration));
            element.textContent = value + suffix;
            requestAnimationFrame(updateValue);
        } else {
            element.textContent = end + suffix;
        }
    };
    
    updateValue();
}

// 缓动函数
function easeInOutQuad(t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
}

// 生成统计数据
function generateStatisticsData(resumes, positions, interviews, startDate, endDate, groupBy) {
    const result = [];
    let currentDate = new Date(startDate);
    
    // 根据分组方式设置日期间隔
    let dateIncrement = 1; // 默认按天
    let dateFormat = 'YYYY-MM-DD';
    let groupFormat = '';
    
    if (groupBy === 'week') {
        dateIncrement = 7;
        dateFormat = 'YYYY-WW周';
        groupFormat = date => {
            const year = date.getFullYear();
            const firstDayOfYear = new Date(year, 0, 1);
            const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
            const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            return `${year}-${String(weekNumber).padStart(2, '0')}周`;
        };
    } else if (groupBy === 'month') {
        dateFormat = 'YYYY-MM';
        groupFormat = date => {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            return `${year}-${String(month).padStart(2, '0')}`;
        };
    } else {
        groupFormat = date => {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        };
    }
    
    // 按日期划分数据
    const groupedData = {};
    
    // 初始化日期分组
    if (groupBy === 'month') {
        // 按月分组
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        while (currentDate <= endDate) {
            const groupKey = groupFormat(currentDate);
            groupedData[groupKey] = {
                date: new Date(currentDate),
                resumes: 0,
                positions: 0,
                interviewScheduled: 0,
                interviewPassed: 0,
                interviewFailed: 0,
                interviewCancelled: 0
            };
            
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        }
    } else if (groupBy === 'week') {
        // 按周分组
        // 设置为本周的周一
        const day = currentDate.getDay() || 7;
        currentDate.setDate(currentDate.getDate() - day + 1);
        
        while (currentDate <= endDate) {
            const groupKey = groupFormat(currentDate);
            groupedData[groupKey] = {
                date: new Date(currentDate),
                resumes: 0,
                positions: 0,
                interviewScheduled: 0,
                interviewPassed: 0,
                interviewFailed: 0,
                interviewCancelled: 0
            };
            
            currentDate.setDate(currentDate.getDate() + 7);
        }
    } else {
        // 按日分组
        while (currentDate <= endDate) {
            const groupKey = groupFormat(currentDate);
            groupedData[groupKey] = {
                date: new Date(currentDate),
                resumes: 0,
                positions: 0,
                interviewScheduled: 0,
                interviewPassed: 0,
                interviewFailed: 0,
                interviewCancelled: 0
            };
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    
    // 统计简历数据
    resumes.forEach(resume => {
        const date = new Date(resume.createTime);
        const groupKey = groupFormat(date);
        
        if (groupedData[groupKey]) {
            groupedData[groupKey].resumes++;
        }
    });
    
    // 统计职位数据
    positions.forEach(position => {
        const date = new Date(position.createTime);
        const groupKey = groupFormat(date);
        
        if (groupedData[groupKey]) {
            groupedData[groupKey].positions++;
        }
    });
    
    // 统计面试数据
    interviews.forEach(interview => {
        const date = new Date(interview.createTime);
        const groupKey = groupFormat(date);
        
        if (groupedData[groupKey]) {
            // 按状态统计面试
            if (interview.status === 0) {
                // 已安排
                groupedData[groupKey].interviewScheduled++;
            } else if (interview.status === 2) {
                // 已通过
                groupedData[groupKey].interviewPassed++;
            } else if (interview.status === 4) {
                // 未通过
                groupedData[groupKey].interviewFailed++;
            } else if (interview.status === 3) {
                // 已取消
                groupedData[groupKey].interviewCancelled++;
            }
        }
    });
    
    // 将分组数据转换为数组
    for (const key in groupedData) {
        const data = groupedData[key];
        
        // 计算通过率
        const totalCompleted = data.interviewPassed + data.interviewFailed;
        const passRate = totalCompleted === 0 ? 0 : (data.interviewPassed / totalCompleted * 100).toFixed(1);
        
        result.push({
            date: key,
            rawDate: data.date,
            resumes: data.resumes,
            positions: data.positions,
            interviewScheduled: data.interviewScheduled,
            interviewPassed: data.interviewPassed,
            interviewFailed: data.interviewFailed,
            interviewCancelled: data.interviewCancelled,
            passRate: `${passRate}%`
        });
    }
    
    // 按日期排序
    result.sort((a, b) => a.rawDate - b.rawDate);
    
    return result;
}

// 更新图表
function updateChart(chart, data, groupBy) {
    if (!chart) {
        console.error("图表对象不存在");
        return;
    }
    
    try {
        // 获取已选日期范围类型
        const activeRangeButton = document.querySelector('[data-range].active');
        const rangeType = activeRangeButton ? activeRangeButton.getAttribute('data-range') : 'today';
        
        console.log("更新图表, 范围类型: " + rangeType); // 调试日志
        
        // 准备图表数据
        let labels, resumeData, communicationData, recommendationData, interviewData, dealData;
        
        // 特殊处理：当按月分组时，总是显示12个月数据，从4月到来年3月
        if (groupBy === 'month') {
            const labelCount = 12;
            console.log(`生成${labelCount}个数据点，分组方式: ${groupBy}, 时间范围: ${rangeType}`);
            
            // 确保标签是从4月到来年3月
            labels = ['4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月'];
            
            // 获取表格中已生成的数据，保持图表和表格数据一致
            const tableData = getTableData();
            
            if (tableData.length > 0) {
                // 使用表格数据
                resumeData = tableData.map(item => item.resumes);
                communicationData = tableData.map(item => item.communications);
                recommendationData = tableData.map(item => item.recommendations);
                interviewData = tableData.map(item => item.interviewScheduled);
                dealData = tableData.map(item => item.deals);
                
                // 如果表格数据不足12个月，填充剩余月份
                if (resumeData.length < 12) {
                    const fillCount = 12 - resumeData.length;
                    for (let i = 0; i < fillCount; i++) {
                        resumeData.push(0);
                        communicationData.push(0);
                        recommendationData.push(0);
                        interviewData.push(0);
                        dealData.push(0);
                    }
                }
            } else {
                // 如果表格数据不可用，生成随机数据
                resumeData = generateTrendData(labelCount, rangeType, 'resume');
                communicationData = generateTrendData(labelCount, rangeType, 'communication');
                recommendationData = generateTrendData(labelCount, rangeType, 'recommendation');
                interviewData = generateTrendData(labelCount, rangeType, 'interviewScheduled');
                dealData = generateTrendData(labelCount, rangeType, 'deal');
            }
        } else {
            // 对于非月度数据，使用相同的逻辑
            const labelCount = getLabelCountByRange(rangeType, groupBy);
            console.log(`生成${labelCount}个数据点，分组方式: ${groupBy}, 时间范围: ${rangeType}`);
            
            labels = generateLabels(rangeType, groupBy, labelCount);
            
            // 获取表格中已生成的数据
            const tableData = getTableData();
            
            if (tableData.length > 0) {
                // 使用表格数据
                resumeData = tableData.map(item => item.resumes);
                communicationData = tableData.map(item => item.communications);
                recommendationData = tableData.map(item => item.recommendations);
                interviewData = tableData.map(item => item.interviewScheduled);
                dealData = tableData.map(item => item.deals);
                
                // 如果表格数据长度不足，填充剩余部分
                if (resumeData.length < labelCount) {
                    const fillCount = labelCount - resumeData.length;
                    for (let i = 0; i < fillCount; i++) {
                        resumeData.push(0);
                        communicationData.push(0);
                        recommendationData.push(0);
                        interviewData.push(0);
                        dealData.push(0);
                    }
                }
            } else {
                // 如果表格数据不可用，生成随机数据
                resumeData = generateTrendData(labelCount, rangeType, 'resume');
                communicationData = generateTrendData(labelCount, rangeType, 'communication');
                recommendationData = generateTrendData(labelCount, rangeType, 'recommendation');
                interviewData = generateTrendData(labelCount, rangeType, 'interviewScheduled');
                dealData = generateTrendData(labelCount, rangeType, 'deal');
            }
        }
        
        // 计算数据的最大值，用于调整Y轴的最大值
        const allData = [...resumeData, ...communicationData, ...recommendationData, ...interviewData, ...dealData];
        const maxValue = Math.max(...allData);
        // 设置Y轴最大值为最大数据值的1.3倍，确保有足够空间
        const suggestedMax = Math.ceil(maxValue * 1.3);
        
        // 更新图表标题
        let titleText = '数据趋势分析';
        if (groupBy === 'day') {
            titleText += '（按日）';
        } else if (groupBy === 'week') {
            titleText += '（按周）';
        } else if (groupBy === 'month') {
            titleText += '（按月）';
        }
        
        // 确保图表正确初始化
        if (!chart.data || !chart.data.datasets || chart.data.datasets.length < 5) {
            console.log("重新初始化图表数据结构");
            chart.data = {
                labels: labels,
                datasets: [
                    {
                        label: '新增简历',
                        data: resumeData,
                        borderColor: 'rgb(13, 110, 253)',
                        backgroundColor: 'rgba(13, 110, 253, 0.2)',
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderWidth: 3,
                        fill: true
                    },
                    {
                        label: '沟通',
                        data: communicationData,
                        borderColor: 'rgb(108, 117, 125)',
                        backgroundColor: 'rgba(108, 117, 125, 0.2)',
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderWidth: 3,
                        fill: true
                    },
                    {
                        label: '推荐',
                        data: recommendationData,
                        borderColor: 'rgb(13, 202, 240)',
                        backgroundColor: 'rgba(13, 202, 240, 0.2)',
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderWidth: 3,
                        fill: true
                    },
                    {
                        label: '面试',
                        data: interviewData,
                        borderColor: 'rgb(255, 193, 7)',
                        backgroundColor: 'rgba(255, 193, 7, 0.2)',
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderWidth: 3,
                        fill: true
                    },
                    {
                        label: '成单',
                        data: dealData,
                        borderColor: 'rgb(220, 53, 69)',
                        backgroundColor: 'rgba(220, 53, 69, 0.2)',
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderWidth: 3,
                        fill: true
                    }
                ]
            };
        } else {
            // 更新现有图表数据
            chart.data.labels = labels;
            chart.data.datasets[0].data = resumeData;
            chart.data.datasets[1].data = communicationData;
            chart.data.datasets[2].data = recommendationData;
            chart.data.datasets[3].data = interviewData;
            chart.data.datasets[4].data = dealData;
            
            // 确保标签正确
            chart.data.datasets[0].label = '新增简历';
            chart.data.datasets[1].label = '沟通';
            chart.data.datasets[2].label = '推荐';
            chart.data.datasets[3].label = '面试';
            chart.data.datasets[4].label = '成单';
            
            // 如果有多余的数据集（之前的"面试通过"），则移除它
            if (chart.data.datasets.length > 5) {
                chart.data.datasets = chart.data.datasets.slice(0, 5);
            }
            
            // 增强图表视觉效果
            chart.data.datasets.forEach((dataset, index) => {
                switch(index) {
                    case 0: // 新增简历
                        dataset.borderColor = 'rgb(13, 110, 253)';
                        dataset.backgroundColor = 'rgba(13, 110, 253, 0.2)';
                        dataset.borderWidth = 3;
                        dataset.pointBackgroundColor = 'rgb(13, 110, 253)';
                        dataset.tension = 0.3;
                        dataset.pointRadius = 5;
                        dataset.pointHoverRadius = 7;
                        dataset.fill = true;
                        break;
                    case 1: // 沟通
                        dataset.borderColor = 'rgb(108, 117, 125)';
                        dataset.backgroundColor = 'rgba(108, 117, 125, 0.2)';
                        dataset.borderWidth = 3;
                        dataset.pointBackgroundColor = 'rgb(108, 117, 125)';
                        dataset.tension = 0.3;
                        dataset.pointRadius = 5;
                        dataset.pointHoverRadius = 7;
                        dataset.fill = true;
                        break;
                    case 2: // 推荐
                        dataset.borderColor = 'rgb(13, 202, 240)';
                        dataset.backgroundColor = 'rgba(13, 202, 240, 0.2)';
                        dataset.borderWidth = 3;
                        dataset.pointBackgroundColor = 'rgb(13, 202, 240)';
                        dataset.tension = 0.3;
                        dataset.pointRadius = 5;
                        dataset.pointHoverRadius = 7;
                        dataset.fill = true;
                        break;
                    case 3: // 面试
                        dataset.borderColor = 'rgb(255, 193, 7)';
                        dataset.backgroundColor = 'rgba(255, 193, 7, 0.2)';
                        dataset.borderWidth = 3;
                        dataset.pointBackgroundColor = 'rgb(255, 193, 7)';
                        dataset.tension = 0.3;
                        dataset.pointRadius = 5;
                        dataset.pointHoverRadius = 7;
                        dataset.fill = true;
                        break;
                    case 4: // 成单
                        dataset.borderColor = 'rgb(220, 53, 69)';
                        dataset.backgroundColor = 'rgba(220, 53, 69, 0.2)';
                        dataset.borderWidth = 3;
                        dataset.pointBackgroundColor = 'rgb(220, 53, 69)';
                        dataset.tension = 0.3;
                        dataset.pointRadius = 5;
                        dataset.pointHoverRadius = 7;
                        dataset.fill = true;
                        break;
                }
            });
        }
        
        chart.options.plugins.title.text = titleText;
        
        // 动态更新Y轴最大值
        if (chart.options.scales && chart.options.scales.y) {
            chart.options.scales.y.suggestedMax = suggestedMax;
        }
        
        // 更新图表
        chart.update();
    } catch (error) {
        console.error("更新图表时出错:", error);
        // 重新初始化图表
        window.mainChart = initChart();
        setTimeout(() => {
            updateChart(window.mainChart, data, groupBy);
        }, 100);
    }
}

// 从表格中获取数据
function getTableData() {
    const table = document.getElementById('statisticsTable');
    if (!table) return [];
    
    const tbody = table.querySelector('tbody');
    if (!tbody) return [];
    
    const rows = tbody.querySelectorAll('tr');
    if (rows.length === 0) return [];
    
    const data = [];
    
    // 获取已选的分组方式
    const groupBy = document.getElementById('groupBy').value;
    
    // 检查是否有 "月" 字符，以判断是否为月度数据
    const isMonthlyData = rows.length > 0 && rows[0].cells.length > 0 && rows[0].cells[0].textContent.includes('月');
    
    // 如果是月度数据，需确保顺序与图表一致（4月至来年3月）
    if (groupBy === 'month' && isMonthlyData) {
        // 按照显示的月份顺序获取
        const monthOrder = {'4月': 0, '5月': 1, '6月': 2, '7月': 3, '8月': 4, '9月': 5, 
                            '10月': 6, '11月': 7, '12月': 8, '1月': 9, '2月': 10, '3月': 11};
        
        // 先收集所有数据
        const tempData = [];
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 7) { // 确保有足够的单元格
                const monthText = cells[0].textContent.trim();
                
                tempData.push({
                    monthText: monthText,
                    monthIndex: monthOrder[monthText] !== undefined ? monthOrder[monthText] : 999, // 不在预期月份中的放在最后
                    date: monthText,
                    resumes: parseInt(cells[1].textContent.trim()) || 0,
                    communications: parseInt(cells[3].textContent.trim()) || 0,
                    recommendations: parseInt(cells[4].textContent.trim()) || 0,
                    interviewScheduled: parseInt(cells[6].textContent.trim()) || 0,
                    interviewPassed: parseInt(cells[7].textContent.trim()) || 0,
                    deals: parseInt(cells[5].textContent.trim()) || 0
                });
            }
        });
        
        // 根据月份顺序排序
        tempData.sort((a, b) => a.monthIndex - b.monthIndex);
        
        // 转换为最终数据
        tempData.forEach(item => {
            data.push({
                date: item.date,
                resumes: item.resumes,
                communications: item.communications,
                recommendations: item.recommendations,
                interviewScheduled: item.interviewScheduled,
                interviewPassed: item.interviewPassed,
                deals: item.deals
            });
        });
    } else {
        // 非月度数据或其他格式，按原样处理
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 7) { // 确保有足够的单元格（日期,新增简历,沟通,推荐,面试安排,面试通过,成单）
                data.push({
                    date: cells[0].textContent.trim(),
                    resumes: parseInt(cells[1].textContent.trim()) || 0,
                    communications: parseInt(cells[3].textContent.trim()) || 0,
                    recommendations: parseInt(cells[4].textContent.trim()) || 0,
                    interviewScheduled: parseInt(cells[6].textContent.trim()) || 0,
                    interviewPassed: parseInt(cells[7].textContent.trim()) || 0,
                    deals: parseInt(cells[5].textContent.trim()) || 0
                });
            }
        });
    }
    
    return data;
}

// 根据时间范围获取标签数量
function getLabelCountByRange(rangeType, groupBy) {
    // 确保无论什么范围，按月至少显示6个月，按周至少显示8周，按日至少显示15天
    const minMonths = 6;
    const minWeeks = 8;
    const minDays = 15;

    switch (rangeType) {
        case 'today':
            return groupBy === 'hour' ? 24 : Math.max(1, minDays);
        case 'yesterday':
            return groupBy === 'hour' ? 24 : Math.max(1, minDays);
        case 'thisWeek':
            return groupBy === 'day' ? Math.max(7, minDays) : (groupBy === 'week' ? Math.max(1, minWeeks) : Math.max(1, minMonths));
        case 'lastWeek':
            return groupBy === 'day' ? Math.max(7, minDays) : (groupBy === 'week' ? Math.max(1, minWeeks) : Math.max(1, minMonths));
        case 'thisMonth':
            return groupBy === 'day' ? Math.max(30, minDays) : (groupBy === 'week' ? Math.max(4, minWeeks) : Math.max(1, minMonths));
        case 'lastMonth':
            return groupBy === 'day' ? Math.max(30, minDays) : (groupBy === 'week' ? Math.max(4, minWeeks) : Math.max(1, minMonths));
        case 'last3Months':
            return groupBy === 'day' ? Math.max(90, minDays) : (groupBy === 'week' ? Math.max(12, minWeeks) : Math.max(3, minMonths));
        case 'thisYear':
            return groupBy === 'month' ? 12 : (groupBy === 'week' ? Math.max(52, minWeeks) : Math.max(365, minDays));
        default:
            return groupBy === 'month' ? Math.max(12, minMonths) : (groupBy === 'week' ? Math.max(12, minWeeks) : Math.max(30, minDays));
    }
}

// 生成标签
function generateLabels(rangeType, groupBy, count) {
    const labels = [];
    const now = new Date();
    
    if (groupBy === 'month') {
        // 按月生成标签，始终显示完整的12个月，从4月到来年3月
        const monthNames = ['4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月'];
        
        if (count >= 12) {
            // 如果需要12个月，就直接返回完整的月份数组
            return [...monthNames];
        } else {
            // 否则选择最近的几个月
            const currentMonth = now.getMonth();
            for (let i = 0; i < count; i++) {
                const monthIndex = (currentMonth - i + 12) % 12;
                labels.unshift(monthNames[monthIndex]);
            }
        }
    } else if (groupBy === 'week') {
        // 按周生成标签，确保至少显示4周
        count = Math.max(count, 4);
        for (let i = 0; i < count; i++) {
            labels.unshift(`第${i+1}周`);
        }
    } else {
        // 按日生成标签
        if (rangeType === 'today' || rangeType === 'yesterday') {
            // 今天或昨天按小时显示
            for (let i = 0; i < 24; i++) {
                labels.push(`${i}时`);
            }
        } else {
            // 其他情况按日期显示，确保至少显示7天
            count = Math.max(count, 7);
            for (let i = 0; i < count; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                labels.unshift(`${date.getMonth()+1}/${date.getDate()}`);
            }
        }
    }
    
    return labels;
}

// 生成趋势数据
function generateTrendData(count, rangeType, dataType) {
    const data = [];
    
    // 根据数据类型设置基数和波动范围
    let baseValue, fluctuationRange;
    
    switch (dataType) {
        case 'resume':
            baseValue = rangeType === 'today' || rangeType === 'yesterday' ? 2 : 8;
            fluctuationRange = rangeType === 'today' || rangeType === 'yesterday' ? 4 : 15;
            break;
        case 'position':
            baseValue = rangeType === 'today' || rangeType === 'yesterday' ? 1 : 5;
            fluctuationRange = rangeType === 'today' || rangeType === 'yesterday' ? 2 : 10;
            break;
        case 'communication':
            baseValue = rangeType === 'today' || rangeType === 'yesterday' ? 8 : 25;
            fluctuationRange = rangeType === 'today' || rangeType === 'yesterday' ? 10 : 30;
            break;
        case 'recommendation':
            baseValue = rangeType === 'today' || rangeType === 'yesterday' ? 5 : 15;
            fluctuationRange = rangeType === 'today' || rangeType === 'yesterday' ? 7 : 20;
            break;
        case 'deal':
            baseValue = rangeType === 'today' || rangeType === 'yesterday' ? 1 : 3;
            fluctuationRange = rangeType === 'today' || rangeType === 'yesterday' ? 2 : 8;
            break;
        case 'interviewScheduled':
            baseValue = rangeType === 'today' || rangeType === 'yesterday' ? 2 : 6;
            fluctuationRange = rangeType === 'today' || rangeType === 'yesterday' ? 3 : 12;
            break;
        case 'interviewPassed':
            baseValue = rangeType === 'today' || rangeType === 'yesterday' ? 1 : 4;
            fluctuationRange = rangeType === 'today' || rangeType === 'yesterday' ? 2 : 8;
            break;
        default:
            baseValue = 5;
            fluctuationRange = 10;
    }
    
    // 对月度数据使用固定的季节性模式
    if (count === 12) {
        // 为不同数据类型设置不同的季节性模式 - 按照4月到来年3月的顺序排列
        let seasonalFactors;
        
        switch (dataType) {
            case 'resume': // 人才库新增 - 春节后(1-3月)和毕业季(6-7月)较高
                seasonalFactors = [9, 7, 10, 15, 12, 8, 6, 5, 4, 3, 7, 12];
                break;
            case 'position': // 职位发布 - 年初(1-3月)和下半年(8-10月)较高
                seasonalFactors = [3, 2, 2, 3, 5, 8, 6, 3, 1, 4, 5, 6];
                break;
            case 'communication': // 沟通 - 与简历新增相关但数量略多
                seasonalFactors = [30, 22, 28, 40, 35, 26, 20, 18, 15, 12, 25, 35];
                break;
            case 'recommendation': // 推荐 - 与职位发布和沟通相关
                seasonalFactors = [18, 14, 18, 24, 20, 18, 15, 10, 8, 8, 16, 22];
                break;
            case 'deal': // 成单 - 与面试通过相关但略有延迟
                seasonalFactors = [3, 2, 2, 3, 5, 6, 4, 3, 1, 1, 2, 4];
                break;
            case 'interviewScheduled': // 面试安排 - 与职位发布相关但略有延迟
                seasonalFactors = [5, 4, 3, 4, 6, 9, 7, 4, 2, 3, 6, 8];
                break;
            case 'interviewPassed': // 面试通过 - 与面试安排相关
                seasonalFactors = [3, 2, 2, 3, 4, 5, 4, 2, 1, 2, 3, 5];
                break;
            case 'interviewFailed': // 面试失败
                seasonalFactors = [2, 1, 1, 1, 2, 3, 2, 1, 1, 1, 2, 3];
                break;
            case 'interviewCancelled': // 面试取消
                seasonalFactors = [0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0];
                break;
            default:
                seasonalFactors = [1.4, 1.6, 1.8, 1.9, 1.7, 1.4, 1.1, 0.9, 0.8, 0.7, 0.9, 1.2];
        }
        
        // 添加一些随机波动，但保持基本形状
        for (let i = 0; i < count; i++) {
            // 增加一些随机性 (0.85-1.15)
            const randomFactor = 0.85 + Math.random() * 0.3;
            const value = Math.max(1, Math.floor(seasonalFactors[i] * randomFactor));
            data.push(value);
        }
    } 
    // 对年度数据增加季节性趋势 - 兼容旧代码
    else if (rangeType === 'thisYear' && count === 12) {
        // 简单的季节性模式，调整为4月到来年3月的顺序
        const seasonalFactors = [1.4, 1.6, 1.8, 1.9, 1.7, 1.4, 1.1, 0.9, 0.8, 0.7, 0.9, 1.2];
        
        for (let i = 0; i < count; i++) {
            const seasonal = seasonalFactors[i];
            const randomFactor = 0.8 + Math.random() * 0.4; // 增加一些随机性 (0.8-1.2)
            const value = Math.floor((baseValue + Math.random() * fluctuationRange) * seasonal * randomFactor);
            data.push(value);
        }
    } else {
        // 生成随机趋势
        let previousValue = baseValue + Math.floor(Math.random() * fluctuationRange);
        data.push(previousValue);
        
        for (let i = 1; i < count; i++) {
            // 添加一些趋势性（有60%概率跟随前一天的趋势，增强趋势连贯性）
            const trend = Math.random() > 0.4 ? 1 : -1;
            const change = Math.floor(Math.random() * fluctuationRange / 2) * trend;
            
            // 确保不会低于基础值的一半
            let newValue = Math.max(Math.floor(baseValue/2), previousValue + change);
            
            // 对特定时间范围增加特定模式
            if (dataType === 'resume' && (rangeType === 'thisWeek' || rangeType === 'lastWeek')) {
                // 工作日比周末更活跃
                if (i % 7 === 5 || i % 7 === 6) { // 周末
                    newValue = Math.floor(newValue * 0.7);
                } else if (i % 7 === 1 || i % 7 === 2) { // 周一周二
                    newValue = Math.floor(newValue * 1.2); // 周初更活跃
                }
            }
            
            // 添加随机峰值 (10%概率)
            if (Math.random() < 0.1) {
                newValue = Math.floor(newValue * (1.5 + Math.random() * 0.5)); // 增加50%-100%
            }
            
            data.push(newValue);
            previousValue = newValue;
        }
    }
    
    return data;
}

// 更新图表类型
function updateChartType(chart, type) {
    if (!chart) {
        console.error("图表对象不存在");
        return;
    }
    
    // 保存当前数据
    const labels = chart.data.labels;
    const resumeData = chart.data.datasets[0].data;
    const communicationData = chart.data.datasets[1].data;
    const recommendationData = chart.data.datasets[2].data;
    const interviewScheduledData = chart.data.datasets[3].data;
    const interviewPassedData = chart.data.datasets[4].data;
    const dealData = chart.data.datasets[5].data;
    
    // 销毁当前图表
    chart.destroy();
    
    // 根据类型创建新的图表配置
    let newConfig;
    
    if (type === 'line') {
        // 线图配置
        newConfig = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '新增简历',
                        data: resumeData,
                        borderColor: 'rgb(13, 110, 253)',
                        backgroundColor: 'rgba(13, 110, 253, 0.2)',
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderWidth: 3,
                        fill: true
                    },
                    {
                        label: '沟通',
                        data: communicationData,
                        borderColor: 'rgb(108, 117, 125)',
                        backgroundColor: 'rgba(108, 117, 125, 0.2)',
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderWidth: 3,
                        fill: true
                    },
                    {
                        label: '推荐',
                        data: recommendationData,
                        borderColor: 'rgb(13, 202, 240)',
                        backgroundColor: 'rgba(13, 202, 240, 0.2)',
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderWidth: 3,
                        fill: true
                    },
                    {
                        label: '面试安排',
                        data: interviewScheduledData,
                        borderColor: 'rgb(255, 193, 7)',
                        backgroundColor: 'rgba(255, 193, 7, 0.2)',
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderWidth: 3,
                        fill: true
                    },
                    {
                        label: '面试通过',
                        data: interviewPassedData,
                        borderColor: 'rgb(25, 135, 84)',
                        backgroundColor: 'rgba(25, 135, 84, 0.2)',
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderWidth: 3,
                        fill: true
                    },
                    {
                        label: '成单',
                        data: dealData,
                        borderColor: 'rgb(220, 53, 69)',
                        backgroundColor: 'rgba(220, 53, 69, 0.2)',
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        borderWidth: 3,
                        fill: true
                    }
                ]
            },
            options: getChartOptions('line')
        };
    } else if (type === 'bar') {
        // 柱状图配置
        newConfig = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '新增简历',
                        data: resumeData,
                        backgroundColor: 'rgba(13, 110, 253, 0.7)',
                        borderColor: 'rgb(13, 110, 253)',
                        borderWidth: 1
                    },
                    {
                        label: '沟通',
                        data: communicationData,
                        backgroundColor: 'rgba(108, 117, 125, 0.7)',
                        borderColor: 'rgb(108, 117, 125)',
                        borderWidth: 1
                    },
                    {
                        label: '推荐',
                        data: recommendationData,
                        backgroundColor: 'rgba(13, 202, 240, 0.7)',
                        borderColor: 'rgb(13, 202, 240)',
                        borderWidth: 1
                    },
                    {
                        label: '面试安排',
                        data: interviewScheduledData,
                        backgroundColor: 'rgba(255, 193, 7, 0.7)',
                        borderColor: 'rgb(255, 193, 7)',
                        borderWidth: 1
                    },
                    {
                        label: '面试通过',
                        data: interviewPassedData,
                        backgroundColor: 'rgba(25, 135, 84, 0.7)',
                        borderColor: 'rgb(25, 135, 84)',
                        borderWidth: 1
                    },
                    {
                        label: '成单',
                        data: dealData,
                        backgroundColor: 'rgba(220, 53, 69, 0.7)',
                        borderColor: 'rgb(220, 53, 69)',
                        borderWidth: 1
                    }
                ]
            },
            options: getChartOptions('bar')
        };
    } else if (type === 'pie' || type === 'doughnut') {
        // 计算各个分类的合计值
        const resumeTotal = resumeData.reduce((a, b) => a + b, 0);
        const communicationTotal = communicationData.reduce((a, b) => a + b, 0);
        const recommendationTotal = recommendationData.reduce((a, b) => a + b, 0);
        const interviewScheduledTotal = interviewScheduledData.reduce((a, b) => a + b, 0);
        const interviewPassedTotal = interviewPassedData.reduce((a, b) => a + b, 0);
        const dealTotal = dealData.reduce((a, b) => a + b, 0);
        
        // 饼图或环形图配置
        newConfig = {
            type: type,
            data: {
                labels: ['新增简历', '沟通', '推荐', '面试安排', '面试通过', '成单'],
                datasets: [{
                    data: [resumeTotal, communicationTotal, recommendationTotal, interviewScheduledTotal, interviewPassedTotal, dealTotal],
                    backgroundColor: [
                        'rgba(13, 110, 253, 0.7)',  // 新增简历
                        'rgba(108, 117, 125, 0.7)', // 沟通
                        'rgba(13, 202, 240, 0.7)',  // 推荐
                        'rgba(255, 193, 7, 0.7)',   // 面试安排
                        'rgba(25, 135, 84, 0.7)',   // 面试通过
                        'rgba(220, 53, 69, 0.7)'    // 成单
                    ],
                    borderColor: [
                        'rgb(13, 110, 253)',  // 新增简历
                        'rgb(108, 117, 125)', // 沟通
                        'rgb(13, 202, 240)',  // 推荐
                        'rgb(255, 193, 7)',   // 面试安排
                        'rgb(25, 135, 84)',   // 面试通过
                        'rgb(220, 53, 69)'    // 成单
                    ],
                    borderWidth: 1
                }]
            },
            options: getChartOptions(type)
        };
    } else if (type === 'radar') {
        // 计算各个分类的合计值
        const resumeTotal = resumeData.reduce((a, b) => a + b, 0);
        const communicationTotal = communicationData.reduce((a, b) => a + b, 0);
        const recommendationTotal = recommendationData.reduce((a, b) => a + b, 0);
        const interviewScheduledTotal = interviewScheduledData.reduce((a, b) => a + b, 0);
        const interviewPassedTotal = interviewPassedData.reduce((a, b) => a + b, 0);
        const dealTotal = dealData.reduce((a, b) => a + b, 0);
        
        // 雷达图配置
        newConfig = {
            type: 'radar',
            data: {
                labels: ['新增简历', '沟通', '推荐', '面试安排', '面试通过', '成单'],
                datasets: [{
                    label: '数据统计',
                    data: [resumeTotal, communicationTotal, recommendationTotal, interviewScheduledTotal, interviewPassedTotal, dealTotal],
                    fill: true,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgb(54, 162, 235)',
                    pointBackgroundColor: 'rgb(54, 162, 235)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(54, 162, 235)'
                }]
            },
            options: getChartOptions('radar')
        };
    }
    
    // 创建新的图表
    window.mainChart = new Chart(document.getElementById('mainChart'), newConfig);
    
    return window.mainChart;
}

// 更新表格
function updateTable(data) {
    const tableBody = document.getElementById('statisticsTableBody');
    tableBody.innerHTML = '';
    
    // 获取已选日期范围类型
    const activeRangeButton = document.querySelector('[data-range].active');
    const rangeType = activeRangeButton ? activeRangeButton.getAttribute('data-range') : 'today';
    const groupBy = document.getElementById('groupBy').value;
    
    // 生成模拟数据
    let tableData = [];
    
    // 固定的月份数组，确保一致性
    const monthNames = ['4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月'];
    
    if (data.length === 0 || true) { // 使用模拟数据进行演示
        // 对于月度数据，始终使用完整的12个月
        if (groupBy === 'month') {
            const labelCount = 12; // 强制使用12个月
            
            // 生成基础数据
            const resumeData = generateTrendData(labelCount, rangeType, 'resume');
            const positionData = generateTrendData(labelCount, rangeType, 'position');
            const communicationData = generateTrendData(labelCount, rangeType, 'communication');
            const recommendationData = generateTrendData(labelCount, rangeType, 'recommendation');
            const dealData = generateTrendData(labelCount, rangeType, 'deal');
            
            // 构建表格数据，确保面试相关数据之间的逻辑关系
            for (let i = 0; i < labelCount; i++) {
                // 首先确定面试总数（安排数）
                const interviewScheduled = Math.floor(Math.random() * 15) + 5 + Math.floor(recommendationData[i] * 0.4); // 与推荐数量有一定关联
                
                // 计算各种状态的面试数量，确保总和等于安排数
                const interviewCancelled = Math.floor(interviewScheduled * (Math.random() * 0.2 + 0.05)); // 取消占5%-25%
                const interviewCompleted = interviewScheduled - interviewCancelled; // 已完成的面试 = 总数 - 取消数
                
                // 通过率在50%-75%之间随机
                const passRateValue = Math.random() * 25 + 50;
                const interviewPassed = Math.round(interviewCompleted * passRateValue / 100);
                const interviewFailed = interviewCompleted - interviewPassed;
                
                // 确保至少有一个通过和一个未通过（如果有完成的面试）
                if (interviewCompleted > 1 && interviewPassed === 0) {
                    interviewPassed = 1;
                    interviewFailed = interviewCompleted - 1;
                } else if (interviewCompleted > 1 && interviewFailed === 0) {
                    interviewFailed = 1;
                    interviewPassed = interviewCompleted - 1;
                }
                
                // 验证数据一致性
                const totalInterviews = interviewPassed + interviewFailed + interviewCancelled;
                if (totalInterviews !== interviewScheduled) {
                    console.warn("面试数据不一致，进行修正", totalInterviews, interviewScheduled);
                    // 如果有不一致，调整passed值使总数一致
                    interviewPassed = interviewScheduled - interviewFailed - interviewCancelled;
                }
                
                // 计算通过率
                const passRate = interviewCompleted > 0 ? (interviewPassed / interviewCompleted * 100).toFixed(1) : "0.0";
                
                // 确保成单数不超过面试通过数
                const deals = Math.min(dealData[i], interviewPassed);
                
                tableData.push({
                    date: monthNames[i],
                    resumes: resumeData[i],
                    positions: positionData[i],
                    communications: communicationData[i],
                    recommendations: recommendationData[i],
                    deals: deals,
                    interviewScheduled: interviewScheduled,
                    interviewPassed: interviewPassed,
                    interviewFailed: interviewFailed,
                    interviewCancelled: interviewCancelled,
                    passRate: `${passRate}%`
                });
            }
        } else {
            // 非月度数据
            const labelCount = Math.min(getLabelCountByRange(rangeType, groupBy), 10); // 限制表格行数
            const labels = generateLabels(rangeType, groupBy, labelCount);
            
            // 生成基础数据
            const resumeData = generateTrendData(labelCount, rangeType, 'resume');
            const positionData = generateTrendData(labelCount, rangeType, 'position');
            const communicationData = generateTrendData(labelCount, rangeType, 'communication');
            const recommendationData = generateTrendData(labelCount, rangeType, 'recommendation');
            const dealData = generateTrendData(labelCount, rangeType, 'deal');
            
            // 构建表格数据，确保面试相关数据之间的逻辑关系
            for (let i = 0; i < labelCount; i++) {
                // 首先确定面试总数（安排数）
                const interviewScheduled = Math.floor(Math.random() * 15) + 5 + Math.floor(recommendationData[i] * 0.4); // 与推荐数量有一定关联
                
                // 计算各种状态的面试数量，确保总和等于安排数
                const interviewCancelled = Math.floor(interviewScheduled * (Math.random() * 0.2 + 0.05)); // 取消占5%-25%
                const interviewCompleted = interviewScheduled - interviewCancelled; // 已完成的面试 = 总数 - 取消数
                
                // 通过率在50%-75%之间随机
                const passRateValue = Math.random() * 25 + 50;
                const interviewPassed = Math.round(interviewCompleted * passRateValue / 100);
                const interviewFailed = interviewCompleted - interviewPassed;
                
                // 确保至少有一个通过和一个未通过（如果有完成的面试）
                if (interviewCompleted > 1 && interviewPassed === 0) {
                    interviewPassed = 1;
                    interviewFailed = interviewCompleted - 1;
                } else if (interviewCompleted > 1 && interviewFailed === 0) {
                    interviewFailed = 1;
                    interviewPassed = interviewCompleted - 1;
                }
                
                // 验证数据一致性
                const totalInterviews = interviewPassed + interviewFailed + interviewCancelled;
                if (totalInterviews !== interviewScheduled) {
                    console.warn("面试数据不一致，进行修正", totalInterviews, interviewScheduled);
                    // 如果有不一致，调整passed值使总数一致
                    interviewPassed = interviewScheduled - interviewFailed - interviewCancelled;
                }
                
                // 计算通过率
                const passRate = interviewCompleted > 0 ? (interviewPassed / interviewCompleted * 100).toFixed(1) : "0.0";
                
                // 确保成单数不超过面试通过数
                const deals = Math.min(dealData[i], interviewPassed);
                
                tableData.push({
                    date: labels[i],
                    resumes: resumeData[i],
                    positions: positionData[i],
                    communications: communicationData[i],
                    recommendations: recommendationData[i],
                    deals: deals,
                    interviewScheduled: interviewScheduled,
                    interviewPassed: interviewPassed,
                    interviewFailed: interviewFailed,
                    interviewCancelled: interviewCancelled,
                    passRate: `${passRate}%`
                });
            }
        }
    } else {
        // 使用传入的数据
        if (groupBy === 'month') {
            // 确保月度数据按照4月到来年3月的顺序排列
            const sortedData = new Array(12).fill(null);
            
            data.forEach(item => {
                const monthText = item.date;
                const monthIndex = monthNames.indexOf(monthText);
                
                if (monthIndex !== -1 && monthIndex < 12) {
                    sortedData[monthIndex] = item;
                }
            });
            
            // 过滤掉空值并设置为最终数据
            tableData = sortedData.filter(item => item !== null);
        } else {
            tableData = data;
        }
    }
    
    let totalResumes = 0;
    let totalPositions = 0;
    let totalCommunications = 0;
    let totalRecommendations = 0;
    let totalDeals = 0;
    let totalScheduled = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalCancelled = 0;
    
    tableData.forEach(item => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.resumes}</td>
            <td>${item.positions}</td>
            <td>${item.communications}</td>
            <td>${item.recommendations}</td>
            <td>${item.deals}</td>
            <td>${item.interviewScheduled}</td>
            <td>${item.interviewPassed}</td>
            <td>${item.interviewFailed}</td>
            <td>${item.interviewCancelled}</td>
            <td>${item.passRate}</td>
        `;
        
        tableBody.appendChild(row);
        
        // 累加总数
        totalResumes += item.resumes;
        totalPositions += item.positions;
        totalCommunications += item.communications;
        totalRecommendations += item.recommendations;
        totalDeals += item.deals;
        totalScheduled += item.interviewScheduled;
        totalPassed += item.interviewPassed;
        totalFailed += item.interviewFailed;
        totalCancelled += item.interviewCancelled;
    });
    
    // 再次验证总计数据的一致性
    if (totalScheduled !== (totalPassed + totalFailed + totalCancelled)) {
        console.warn("总计数据不一致，尝试修正");
        // 修正可能的小数点误差
        totalPassed = totalScheduled - totalFailed - totalCancelled;
    }
    
    // 更新表格底部汇总数据
    document.getElementById('totalResume').textContent = totalResumes;
    document.getElementById('totalPosition').textContent = totalPositions;
    document.getElementById('totalCommunication').textContent = totalCommunications;
    document.getElementById('totalRecommendation').textContent = totalRecommendations;
    document.getElementById('totalDeal').textContent = totalDeals;
    document.getElementById('totalInterview').textContent = totalScheduled;
    document.getElementById('totalPass').textContent = totalPassed;
    document.getElementById('totalFail').textContent = totalFailed;
    document.getElementById('totalCancel').textContent = totalCancelled;
    
    // 计算平均通过率
    const totalCompleted = totalPassed + totalFailed;
    const avgPassRate = totalCompleted === 0 ? 0 : (totalPassed / totalCompleted * 100).toFixed(1);
    document.getElementById('avgPassRate').textContent = `${avgPassRate}%`;
}

// 根据数据类型显示/隐藏表格列
function toggleTableColumns(dataType) {
    const table = document.getElementById('statisticsTable');
    const rows = table.querySelectorAll('tr');
    
    // 所有列的索引（从0开始）
    const resumeCol = 1;
    const positionCol = 2;
    const communicationCol = 3;
    const recommendationCol = 4;
    const dealCol = 5;
    const interviewCols = [6, 7, 8, 9, 10]; // 面试相关列
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        
        if (dataType === 'all') {
            // 显示所有列
            cells.forEach(cell => cell.style.display = '');
        } else if (dataType === 'resume') {
            // 只显示日期和人才库列
            cells.forEach((cell, index) => {
                if (index === 0 || index === resumeCol) {
                    cell.style.display = '';
                } else {
                    cell.style.display = 'none';
                }
            });
        } else if (dataType === 'position') {
            // 只显示日期和职位列
            cells.forEach((cell, index) => {
                if (index === 0 || index === positionCol) {
                    cell.style.display = '';
                } else {
                    cell.style.display = 'none';
                }
            });
        } else if (dataType === 'recommendation') {
            // 只显示日期、沟通和推荐列
            cells.forEach((cell, index) => {
                if (index === 0 || index === communicationCol || index === recommendationCol || index === dealCol) {
                    cell.style.display = '';
                } else {
                    cell.style.display = 'none';
                }
            });
        } else if (dataType === 'interview') {
            // 只显示日期和面试相关列
            cells.forEach((cell, index) => {
                if (index === 0 || interviewCols.includes(index)) {
                    cell.style.display = '';
                } else {
                    cell.style.display = 'none';
                }
            });
        }
    });
}

// 下载图表为图片
function downloadChart(chart) {
    const link = document.createElement('a');
    link.download = '数据趋势图.png';
    link.href = chart.toBase64Image();
    link.click();
}

// 导出为Excel
function exportToExcel() {
    alert('导出Excel功能将在实际应用中实现');
    // 实际应用中，这里会调用后端API或使用前端库实现Excel导出
}

// 导出为PDF
function exportToPdf() {
    alert('导出PDF功能将在实际应用中实现');
    // 实际应用中，这里会调用后端API或使用前端库实现PDF导出
} 