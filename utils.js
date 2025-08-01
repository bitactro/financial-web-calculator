function formatIndianNumber(num) {
    return num.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
    });
}

function getCalculationShareText() {
    // Get active calculator and its values
    const openCard = document.querySelector('.card-content.open');
    if (!openCard) return null;
    
    const cardHeader = openCard.previousElementSibling.textContent;
    let shareText = '';
    
    if (cardHeader.includes('Home Loan')) {
        const amount = document.getElementById('loanAmountNum').value.replace(/,/g, '');
        const rate = document.getElementById('loanRateNum').value;
        const years = document.getElementById('loanYearsNum').value;
        const emi = document.getElementById('loanEMI').textContent;
        const interest = document.getElementById('loanInterest').textContent;
        const total = document.getElementById('loanTotal').textContent;
        
        shareText = `🏠 Home Loan Calculation:\n\n`;
        shareText += `Principal: ₹${formatIndianNumber(amount)}\n`;
        shareText += `Interest Rate: ${rate}%\n`;
        shareText += `Tenure: ${years} years\n\n`;
        shareText += `${emi}\n`;
        shareText += `${interest}\n`;
        shareText += `${total}\n`;
        
    } else if (cardHeader.includes('SIP')) {
        const mode = document.getElementById('sipMode').value;
        const amount = document.getElementById('sipAmountNum').value.replace(/,/g, '');
        const rate = document.getElementById('sipRateNum').value;
        const years = document.getElementById('sipYearsNum').value;
        const maturity = document.getElementById('sipMaturity').textContent;
        const profit = document.getElementById('sipProfit').textContent;
        
        shareText = `📈 ${mode === 'monthly' ? 'Monthly SIP' : 'Lumpsum'} Calculation:\n\n`;
        shareText += `${mode === 'monthly' ? 'Monthly Investment' : 'One-time Investment'}: ₹${formatIndianNumber(amount)}\n`;
        shareText += `Expected Return Rate: ${rate}% per year\n`;
        shareText += `Investment Period: ${years} years\n\n`;
        shareText += `${maturity}\n`;
        shareText += `${profit}\n`;
    }
    
    if (shareText) {
        shareText += `\nCalculate at: ${window.location.origin}${window.location.pathname}?${getShareableLink()}`;
    }
    
    return shareText;
}

async function shareCalculation() {
    const shareText = getCalculationShareText();
    if (!shareText) return;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Financial Calculator Results',
                text: shareText
            });
        } catch (err) {
            fallbackShare(shareText);
        }
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('Results copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy:', err);
        prompt('Copy this text:', text);
    }
    document.body.removeChild(textarea);
}

function downloadEMICsv(){
    let csv="Month,EMI,Principal,Interest,Balance\n";
    emiData.forEach(r=>csv+=`${r[0]},${r[1].toFixed(2)},${r[2].toFixed(2)},${r[3].toFixed(2)},${r[4].toFixed(2)}\n`);
    let blob=new Blob([csv],{type:"text/csv"});
    let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download="emi_schedule.csv";a.click();
}