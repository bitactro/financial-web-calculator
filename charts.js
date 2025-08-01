let loanChart, sipChart;

function formatAmount(value) {
    if (value >= 10000000) return (value / 10000000).toFixed(2) + ' Cr';
    if (value >= 100000) return (value / 100000).toFixed(2) + ' L';
    if (value >= 1000) return (value / 1000).toFixed(0) + ' K';
    return value.toFixed(0);
}

function drawLoanChart(amt, interest) {
    if (loanChart) loanChart.destroy();
    loanChart = new Chart(document.getElementById('loanChart'), {
        type: 'bar',
        data: {
            labels: ['Amount Breakdown'],
            datasets: [{
                label: 'Principal',
                data: [amt],
                backgroundColor: '#4b6cb7',
                borderRadius: 4
            }, {
                label: 'Interest',
                data: [interest],
                backgroundColor: '#f39c12',
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + formatAmount(context.raw);
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + formatAmount(value);
                        }
                    }
                },
                y: {
                    stacked: true,
                    display: false
                }
            }
        }
    });
}

function drawSIPChart(invested, profit) {
    if (sipChart) sipChart.destroy();
    sipChart = new Chart(document.getElementById('sipChart'), {
        type: 'bar',
        data: {
            labels: ['Amount Breakdown'],
            datasets: [{
                label: 'Invested Amount',
                data: [invested],
                backgroundColor: '#27ae60',
                borderRadius: 4
            }, {
                label: 'Profit',
                data: [profit],
                backgroundColor: '#8e44ad',
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + formatAmount(context.raw);
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + formatAmount(value);
                        }
                    }
                },
                y: {
                    stacked: true,
                    display: false
                }
            }
        }
    });
}