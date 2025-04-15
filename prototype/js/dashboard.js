// 图表数据和初始化
document.addEventListener('DOMContentLoaded', function() {
    // 生成过去30天的日期标签
    const dateLabels = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dateLabels.push(`${date.getMonth() + 1}/${date.getDate()}`);
    }
    
    // 生成随机数据
    const resumeData = Array.from({length: 30}, () => Math.floor(Math.random() * 8) + 1);
    const communicationData = Array.from({length: 30}, () => Math.floor(Math.random() * 6) + 1);
    const recommendationData = Array.from({length: 30}, () => Math.floor(Math.random() * 5));
    const interviewData = Array.from({length: 30}, () => Math.floor(Math.random() * 4));
    const dealData = Array.from({length: 30}, () => Math.floor(Math.random() * 2));
    
    // 计算7天平均值用于趋势线
    const getMovingAverage = (data, window) => {
        return data.map((val, idx, arr) => {
            if (idx < window - 1) return null;
            const sum = arr.slice(idx - window + 1, idx + 1).reduce((a, b) => a + b, 0);
            return sum / window;
        });
    };
    
    // 计算7日移动平均
    const resumeAvgData = getMovingAverage(resumeData, 7);
    const communicationAvgData = getMovingAverage(communicationData, 7);
    const recommendationAvgData = getMovingAverage(recommendationData, 7);
    const interviewAvgData = getMovingAverage(interviewData, 7);
    const dealAvgData = getMovingAverage(dealData, 7);
    
    // 通用图表选项
    const getChartOptions = (title) => {
        return {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                title: {
                    display: false,
                    text: title
                }
            },
            scales: {
                x: {
                    ticks: {
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 10
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        };
    };
    
    // 简历趋势图
    const resumeChart = document.getElementById('resumeChart');
    if (resumeChart) {
        const ctx = resumeChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dateLabels,
                datasets: [
                    {
                        label: '简历数量',
                        data: resumeData,
                        backgroundColor: 'rgba(0, 123, 255, 0.6)',
                        borderColor: '#007bff',
                        borderWidth: 1,
                        barPercentage: 0.6,
                        categoryPercentage: 0.8
                    },
                    {
                        label: '7日平均',
                        data: resumeAvgData,
                        type: 'line',
                        borderColor: '#007bff',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: getChartOptions('简历数量趋势')
        });
    }
    
    // 沟通趋势图
    const communicationChart = document.getElementById('communicationChart');
    if (communicationChart) {
        const ctx = communicationChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dateLabels,
                datasets: [
                    {
                        label: '沟通数量',
                        data: communicationData,
                        backgroundColor: 'rgba(32, 201, 151, 0.6)',
                        borderColor: '#20c997',
                        borderWidth: 1,
                        barPercentage: 0.6,
                        categoryPercentage: 0.8
                    },
                    {
                        label: '7日平均',
                        data: communicationAvgData,
                        type: 'line',
                        borderColor: '#20c997',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: getChartOptions('沟通数量趋势')
        });
    }
    
    // 推荐趋势图
    const recommendationChart = document.getElementById('recommendationChart');
    if (recommendationChart) {
        const ctx = recommendationChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dateLabels,
                datasets: [
                    {
                        label: '推荐数量',
                        data: recommendationData,
                        backgroundColor: 'rgba(253, 126, 20, 0.6)',
                        borderColor: '#fd7e14',
                        borderWidth: 1,
                        barPercentage: 0.6,
                        categoryPercentage: 0.8
                    },
                    {
                        label: '7日平均',
                        data: recommendationAvgData,
                        type: 'line',
                        borderColor: '#fd7e14',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: getChartOptions('推荐数量趋势')
        });
    }
    
    // 面试趋势图
    const interviewChart = document.getElementById('interviewChart');
    if (interviewChart) {
        const ctx = interviewChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dateLabels,
                datasets: [
                    {
                        label: '面试数量',
                        data: interviewData,
                        backgroundColor: 'rgba(255, 193, 7, 0.6)',
                        borderColor: '#ffc107',
                        borderWidth: 1,
                        barPercentage: 0.6,
                        categoryPercentage: 0.8
                    },
                    {
                        label: '7日平均',
                        data: interviewAvgData,
                        type: 'line',
                        borderColor: '#ffc107',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: getChartOptions('面试数量趋势')
        });
    }
    
    // 成单趋势图
    const dealChart = document.getElementById('dealChart');
    if (dealChart) {
        const ctx = dealChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dateLabels,
                datasets: [
                    {
                        label: '成单数量',
                        data: dealData,
                        backgroundColor: 'rgba(23, 162, 184, 0.6)',
                        borderColor: '#17a2b8',
                        borderWidth: 1,
                        barPercentage: 0.6,
                        categoryPercentage: 0.8
                    },
                    {
                        label: '7日平均',
                        data: dealAvgData,
                        type: 'line',
                        borderColor: '#17a2b8',
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: getChartOptions('成单数量趋势')
        });
    }
    
    // 简历状态饼图
    const resumeStatusChart = document.getElementById('resumeStatusChart');
    if (resumeStatusChart) {
        const statusCtx = resumeStatusChart.getContext('2d');
        
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: ['新简历', '筛选中', '面试中', '已录用', '已拒绝'],
                datasets: [{
                    data: [25, 40, 15, 10, 10],
                    backgroundColor: [
                        '#007bff',
                        '#fd7e14',
                        '#ffc107',
                        '#28a745',
                        '#dc3545'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            font: {
                                size: 11
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
});

// 移动端侧边栏切换
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('show');
} 