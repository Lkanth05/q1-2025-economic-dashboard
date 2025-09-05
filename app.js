// Economic Dashboard Data
const economicData = {
    "gdp_data": {
        "quarter": ["Q4 2024", "Q1 2025", "Q2 2025"],
        "gdp_growth": [2.4, -0.5, 3.3],
        "consumer_spending": [4.0, 1.8, 1.6],
        "government_spending": [1.2, -1.4, -0.2],
        "investment": [7.6, 21.9, 5.7],
        "imports_growth": [-2.1, 41.3, -29.8]
    },
    "tariff_timeline": {
        "date": ["2025-02-01", "2025-03-12", "2025-04-05", "2025-04-09", "2025-08-27"],
        "event": [
            "25% tariffs on Mexico/Canada, 20% on China",
            "25% steel/aluminum tariffs", 
            "Universal 10% baseline tariff",
            "Country-specific reciprocal tariffs (up to 145% China)",
            "50% tariffs on India"
        ],
        "avg_tariff_rate": [2.5, 8.2, 15.4, 27.0, 18.6]
    },
    "trade_data": {
        "month": ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025"],
        "exports": [275.2, 278.8, 282.4, 279.1, 276.8, 279.7, 280.5],
        "imports": [298.5, 315.7, 385.4, 342.8, 333.2, 338.7, 358.8],
        "trade_deficit": [-23.3, -36.9, -103.0, -63.7, -56.4, -59.0, -78.3],
        "import_growth_mom": [5.2, 5.8, 22.1, -11.0, -2.8, 1.7, 5.9]
    },
    "inflation_data": {
        "month": ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025"],
        "consumer_expectations_1yr": [3.0, 3.2, 3.4, 3.6, 3.2, 3.0, 3.1],
        "consumer_expectations_5yr": [2.5, 2.6, 2.7, 2.8, 2.6, 2.6, 2.9],
        "actual_cpi": [2.1, 2.3, 2.5, 2.6, 2.4, 2.7, 2.7],
        "core_cpi": [2.8, 2.9, 3.0, 3.1, 2.8, 2.9, 3.1],
        "gdp_deflator": [2.2, 2.8, 3.4, 3.2, 2.9, 3.0, 3.1]
    }
};

// Chart colors
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];

// Global chart instances
const charts = {};

// Theme management
let currentTheme = 'light';

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeTabs();
    initializeCharts();
    initializeExportButtons();
});

// Theme toggle functionality - Fixed
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) {
        console.error('Theme toggle button not found');
        return;
    }
    
    // Check user's preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
        currentTheme = 'dark';
        document.documentElement.setAttribute('data-color-scheme', 'dark');
        themeToggle.innerHTML = '☀️ Light Mode';
    } else {
        currentTheme = 'light';
        document.documentElement.setAttribute('data-color-scheme', 'light');
        themeToggle.innerHTML = '🌙 Dark Mode';
    }
    
    // Add click event listener
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleTheme();
    });
}

function toggleTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (currentTheme === 'light') {
        currentTheme = 'dark';
        document.documentElement.setAttribute('data-color-scheme', 'dark');
        themeToggle.innerHTML = '☀️ Light Mode';
    } else {
        currentTheme = 'light';
        document.documentElement.setAttribute('data-color-scheme', 'light');
        themeToggle.innerHTML = '🌙 Dark Mode';
    }
    
    // Update all charts for theme change
    setTimeout(() => {
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.update === 'function') {
                updateChartTheme(chart);
                chart.update('none'); // Disable animation for theme switch
            }
        });
    }, 50);
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Remove active classes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active classes
            this.classList.add('active');
            const targetPane = document.getElementById(tabId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
            
            // Refresh charts when tab becomes visible
            setTimeout(() => {
                Object.values(charts).forEach(chart => {
                    if (chart && typeof chart.resize === 'function') {
                        chart.resize();
                    }
                });
            }, 100);
        });
    });
}

// Chart theme updates - Improved
function updateChartTheme(chart) {
    const isDark = currentTheme === 'dark';
    const textColor = isDark ? '#f5f5f5' : '#134252';
    const gridColor = isDark ? 'rgba(119, 124, 124, 0.3)' : 'rgba(94, 82, 64, 0.2)';
    
    if (chart.options) {
        // Update legend text color
        if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
            chart.options.plugins.legend.labels.color = textColor;
        }
        
        // Update scale colors
        if (chart.options.scales) {
            Object.keys(chart.options.scales).forEach(scaleKey => {
                const scale = chart.options.scales[scaleKey];
                if (scale.ticks) scale.ticks.color = textColor;
                if (scale.grid) scale.grid.color = gridColor;
                if (scale.title && scale.title.display) scale.title.color = textColor;
            });
        }
        
        // Update tooltip colors
        if (!chart.options.plugins.tooltip) {
            chart.options.plugins.tooltip = {};
        }
        chart.options.plugins.tooltip.backgroundColor = isDark ? 'rgba(38, 40, 40, 0.9)' : 'rgba(255, 255, 255, 0.9)';
        chart.options.plugins.tooltip.titleColor = textColor;
        chart.options.plugins.tooltip.bodyColor = textColor;
        chart.options.plugins.tooltip.borderColor = gridColor;
        chart.options.plugins.tooltip.borderWidth = 1;
    }
}

// Initialize all charts
function initializeCharts() {
    createOverviewChart();
    createGDPTrendChart();
    createGDPComponentsChart();
    createTariffTimelineChart();
    createTradeBalanceChart();
    createImportGrowthChart();
    createInflationExpectationsChart();
    createInflationComponentsChart();
    createCorrelationScatterChart();
}

// Overview Chart - GDP Components Impact
function createOverviewChart() {
    const ctx = document.getElementById('overviewChart');
    if (!ctx) return;
    
    charts.overview = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: economicData.gdp_data.quarter,
            datasets: [
                {
                    label: 'Consumer Spending',
                    data: economicData.gdp_data.consumer_spending,
                    backgroundColor: chartColors[0],
                    borderColor: chartColors[0],
                    borderWidth: 1
                },
                {
                    label: 'Government Spending',
                    data: economicData.gdp_data.government_spending,
                    backgroundColor: chartColors[1],
                    borderColor: chartColors[1],
                    borderWidth: 1
                },
                {
                    label: 'Investment',
                    data: economicData.gdp_data.investment,
                    backgroundColor: chartColors[2],
                    borderColor: chartColors[2],
                    borderWidth: 1
                },
                {
                    label: 'Import Growth Impact',
                    data: economicData.gdp_data.imports_growth.map(x => x * -0.1), // Approximate GDP impact
                    backgroundColor: chartColors[3],
                    borderColor: chartColors[3],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Growth Rate (%)',
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    grid: {
                        color: currentTheme === 'dark' ? 'rgba(119, 124, 124, 0.3)' : 'rgba(94, 82, 64, 0.2)'
                    }
                }
            }
        }
    });
}

// GDP Trend Chart
function createGDPTrendChart() {
    const ctx = document.getElementById('gdpTrendChart');
    if (!ctx) return;
    
    charts.gdpTrend = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: economicData.gdp_data.quarter,
            datasets: [{
                label: 'GDP Growth (%)',
                data: economicData.gdp_data.gdp_growth,
                borderColor: chartColors[0],
                backgroundColor: chartColors[0] + '20',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: chartColors[0],
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'GDP Growth: ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Growth Rate (%)',
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    grid: {
                        borderDash: [5, 5],
                        color: currentTheme === 'dark' ? 'rgba(119, 124, 124, 0.3)' : 'rgba(94, 82, 64, 0.2)'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                }
            }
        }
    });
}

// GDP Components Chart
function createGDPComponentsChart() {
    const ctx = document.getElementById('gdpComponentsChart');
    if (!ctx) return;
    
    const q1Data = {
        'Consumer Spending': economicData.gdp_data.consumer_spending[1],
        'Government Spending': economicData.gdp_data.government_spending[1],
        'Investment': economicData.gdp_data.investment[1],
        'Net Exports Impact': -4.1 // Calculated from import surge
    };
    
    charts.gdpComponents = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(q1Data),
            datasets: [{
                data: Object.values(q1Data).map(x => Math.abs(x)),
                backgroundColor: chartColors.slice(0, 4),
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = Object.values(q1Data)[context.dataIndex];
                            return context.label + ': ' + value.toFixed(1) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Tariff Timeline Chart
function createTariffTimelineChart() {
    const ctx = document.getElementById('tariffTimelineChart');
    if (!ctx) return;
    
    // Create monthly data for better visualization
    const monthlyTariffs = [2.5, 2.5, 8.2, 15.4, 27.0, 27.0, 18.6];
    const monthlyImports = economicData.trade_data.imports;
    
    charts.tariffTimeline = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: economicData.trade_data.month,
            datasets: [
                {
                    label: 'Average Tariff Rate (%)',
                    data: monthlyTariffs,
                    borderColor: chartColors[2],
                    backgroundColor: chartColors[2] + '20',
                    borderWidth: 3,
                    fill: false,
                    yAxisID: 'y'
                },
                {
                    label: 'Import Volume ($B)',
                    data: monthlyImports,
                    borderColor: chartColors[0],
                    backgroundColor: chartColors[0] + '20',
                    borderWidth: 3,
                    fill: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Tariff Rate (%)',
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    grid: {
                        color: currentTheme === 'dark' ? 'rgba(119, 124, 124, 0.3)' : 'rgba(94, 82, 64, 0.2)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Import Volume ($B)',
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                }
            }
        }
    });
}

// Trade Balance Chart
function createTradeBalanceChart() {
    const ctx = document.getElementById('tradeBalanceChart');
    if (!ctx) return;
    
    charts.tradeBalance = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: economicData.trade_data.month,
            datasets: [
                {
                    label: 'Exports ($B)',
                    data: economicData.trade_data.exports,
                    borderColor: chartColors[4],
                    backgroundColor: chartColors[4] + '20',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Imports ($B)',
                    data: economicData.trade_data.imports,
                    borderColor: chartColors[0],
                    backgroundColor: chartColors[0] + '20',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Trade Deficit ($B)',
                    data: economicData.trade_data.trade_deficit,
                    borderColor: chartColors[2],
                    backgroundColor: chartColors[2] + '20',
                    borderWidth: 3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value (Billions USD)',
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    grid: {
                        color: currentTheme === 'dark' ? 'rgba(119, 124, 124, 0.3)' : 'rgba(94, 82, 64, 0.2)'
                    }
                }
            }
        }
    });
}

// Import Growth Chart
function createImportGrowthChart() {
    const ctx = document.getElementById('importGrowthChart');
    if (!ctx) return;
    
    charts.importGrowth = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: economicData.trade_data.month,
            datasets: [{
                label: 'Import Growth MoM (%)',
                data: economicData.trade_data.import_growth_mom,
                backgroundColor: economicData.trade_data.import_growth_mom.map(val => 
                    val > 0 ? chartColors[0] : chartColors[2]
                ),
                borderColor: economicData.trade_data.import_growth_mom.map(val => 
                    val > 0 ? chartColors[0] : chartColors[2]
                ),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Growth Rate (%)',
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    grid: {
                        color: currentTheme === 'dark' ? 'rgba(119, 124, 124, 0.3)' : 'rgba(94, 82, 64, 0.2)'
                    }
                }
            }
        }
    });
}

// Inflation Expectations Chart
function createInflationExpectationsChart() {
    const ctx = document.getElementById('inflationExpectationsChart');
    if (!ctx) return;
    
    charts.inflationExpectations = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: economicData.inflation_data.month,
            datasets: [
                {
                    label: '1-Year Expectations',
                    data: economicData.inflation_data.consumer_expectations_1yr,
                    borderColor: chartColors[1],
                    backgroundColor: chartColors[1] + '20',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: '5-Year Expectations',
                    data: economicData.inflation_data.consumer_expectations_5yr,
                    borderColor: chartColors[6],
                    backgroundColor: chartColors[6] + '20',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Actual CPI',
                    data: economicData.inflation_data.actual_cpi,
                    borderColor: chartColors[0],
                    backgroundColor: chartColors[0] + '20',
                    borderWidth: 3,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Inflation Rate (%)',
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    grid: {
                        color: currentTheme === 'dark' ? 'rgba(119, 124, 124, 0.3)' : 'rgba(94, 82, 64, 0.2)'
                    }
                }
            }
        }
    });
}

// Inflation Components Chart
function createInflationComponentsChart() {
    const ctx = document.getElementById('inflationComponentsChart');
    if (!ctx) return;
    
    charts.inflationComponents = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: economicData.inflation_data.month,
            datasets: [
                {
                    label: 'Core CPI',
                    data: economicData.inflation_data.core_cpi,
                    borderColor: chartColors[2],
                    backgroundColor: chartColors[2] + '20',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'GDP Deflator',
                    data: economicData.inflation_data.gdp_deflator,
                    borderColor: chartColors[4],
                    backgroundColor: chartColors[4] + '20',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Headline CPI',
                    data: economicData.inflation_data.actual_cpi,
                    borderColor: chartColors[0],
                    backgroundColor: chartColors[0] + '20',
                    borderWidth: 3,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Inflation Rate (%)',
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    grid: {
                        color: currentTheme === 'dark' ? 'rgba(119, 124, 124, 0.3)' : 'rgba(94, 82, 64, 0.2)'
                    }
                }
            }
        }
    });
}

// Correlation Scatter Chart
function createCorrelationScatterChart() {
    const ctx = document.getElementById('correlationScatterChart');
    if (!ctx) return;
    
    // Create scatter plot data for tariff vs import correlation
    const monthlyTariffs = [2.5, 2.5, 8.2, 15.4, 27.0, 27.0, 18.6];
    const scatterData = monthlyTariffs.map((tariff, index) => ({
        x: tariff,
        y: economicData.trade_data.imports[index]
    }));
    
    charts.correlationScatter = new Chart(ctx.getContext('2d'), {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Tariff Rate vs Import Volume',
                data: scatterData,
                backgroundColor: chartColors[0],
                borderColor: chartColors[0],
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Tariff: ${context.parsed.x}%, Imports: $${context.parsed.y}B`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Average Tariff Rate (%)',
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    grid: {
                        color: currentTheme === 'dark' ? 'rgba(119, 124, 124, 0.3)' : 'rgba(94, 82, 64, 0.2)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Import Volume (Billions USD)',
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    ticks: {
                        color: currentTheme === 'dark' ? '#f5f5f5' : '#134252'
                    },
                    grid: {
                        color: currentTheme === 'dark' ? 'rgba(119, 124, 124, 0.3)' : 'rgba(94, 82, 64, 0.2)'
                    }
                }
            }
        }
    });
}

// Export functionality
function initializeExportButtons() {
    const exportButtons = document.querySelectorAll('.export-btn');
    
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const chartId = this.dataset.chart;
            const chart = charts[chartId.replace('Chart', '')];
            
            if (chart) {
                const url = chart.toBase64Image('image/png', 1.0);
                const link = document.createElement('a');
                link.download = `${chartId}_export.png`;
                link.href = url;
                link.click();
            }
        });
    });
}