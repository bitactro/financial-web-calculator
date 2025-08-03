function formatIndianNumber(num) {
    // This function is now here to be accessible by all scripts
    return num.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
    });
}

function getShareableLink() {
    const params = new URLSearchParams();
    
    // Check if it's the loan calculator page
    if (document.getElementById('loanAmountNum')) {
        params.set('active', 'loan');
        params.set('loan_amount', document.getElementById('loanAmountNum').value.replace(/,/g, ''));
        params.set('loan_rate', document.getElementById('loanRateNum').value);
        params.set('loan_years', document.getElementById('loanYearsNum').value);
    } 
    // Check if it's the SIP calculator page
    else if (document.getElementById('sipAmountNum')) {
        params.set('active', 'sip');
        const sipMode = document.getElementById('sipMode').value;
        params.set('sip_mode', sipMode);
        params.set('sip_amount', document.getElementById('sipAmountNum').value.replace(/,/g, ''));
        params.set('sip_rate', document.getElementById('sipRateNum').value);
        params.set('sip_years', document.getElementById('sipYearsNum').value);
    }
    // Check if it's the Tax Calculator page
    else if (document.getElementById('basicSalary')) {
        params.set('active', 'tax');
        params.set('fy', document.getElementById('financialYear').value);
        params.set('salary', document.getElementById('basicSalary').value);
        params.set('interest', document.getElementById('interestIncome').value);
        params.set('stcg', document.getElementById('stcgIncome').value);
        params.set('ltcg', document.getElementById('ltcgIncome').value);
        params.set('crypto', document.getElementById('cryptoIncome').value);
        // Old regime deductions
        params.set('hra', document.getElementById('hra').value);
        params.set('sec80c', document.getElementById('sec80c').value);
        params.set('sec80d', document.getElementById('sec80d').value);
        params.set('homeloan', document.getElementById('homeLoanInterest').value);
        params.set('otherded', document.getElementById('otherDeductions').value);
    }
    
    return params.toString();
}


function getCalculationShareText() {
    let shareText = '';
    
    // Loan Calculator Text
    if (document.getElementById('loanAmountNum')) {
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
    }
    // SIP Calculator Text
    else if (document.getElementById('sipAmountNum')) {
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
     // Tax Calculator Text
    else if (document.getElementById('basicSalary')) {
        const savings = document.getElementById('savingsMessage').textContent;
        shareText = `🧾 My Income Tax Calculation:\n\n${savings}\n\n`;
    }
    
    if (shareText) {
        shareText += `\nCalculate at: ${window.location.origin}${window.location.pathname}?${getShareableLink()}`;
    }
    
    return shareText;
}

async function shareCalculation() {
    const shareText = getCalculationShareText();
    if (!shareText) return;

    const shareUrl = `${window.location.origin}${window.location.pathname}?${getShareableLink()}`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Financial Calculator Results',
                text: shareText,
                url: shareUrl
            });
        } catch (err) {
            // Fallback if user cancels share
            console.log('Share was cancelled or failed', err);
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
