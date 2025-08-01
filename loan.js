let emiData=[],emiPage=0;
const amountEl=document.getElementById('loanAmount'), amountNum=document.getElementById('loanAmountNum');
const rateEl=document.getElementById('loanRate'), rateNum=document.getElementById('loanRateNum');
const yearsEl=document.getElementById('loanYears'), yearsNum=document.getElementById('loanYearsNum');
const emiEl=document.getElementById('loanEMI'), interestEl=document.getElementById('loanInterest'), totalEl=document.getElementById('loanTotal');
const emiTable=document.getElementById('emiTable').querySelector('tbody');

function syncLoanInput(e){
  let min, max;
  if(e.target.id === 'loanAmount' || e.target.id === 'loanAmountNum') {
    min = 0; max = 500000000;
  } else if(e.target.id === 'loanRate' || e.target.id === 'loanRateNum') {
    min = 1; max = 25;
  } else if(e.target.id === 'loanYears' || e.target.id === 'loanYearsNum') {
    min = 1; max = 35;
  }
  let value = Number(e.target.value);
  value = Math.max(min, Math.min(max, value));
  e.target.value = value;
  if(e.target.type==='range') e.target.nextElementSibling.value = value;
  else e.target.previousElementSibling.value = value;
  calculateLoan();
}

amountEl.addEventListener('input', function() {
  updateLoanAmountFormatted();
});
amountEl.addEventListener('input',syncLoanInput);
amountNum.addEventListener('input', function(e) {
  let raw = unformatNumber(e.target.value);
  if(e.target.value === "") {
    amountEl.value = "";
    return;
  }
  let min = 0, max = 500000000;
  let num = Math.max(min, Math.min(max, Number(raw)));
  amountEl.value = Math.min(num, 30000000);
  calculateLoan();
});
amountNum.addEventListener('blur', function(e) {
  let raw = unformatNumber(e.target.value);
  if(e.target.value === "" || isNaN(Number(raw)) || Number(raw) < 0) {
    e.target.value = "";
    amountEl.value = "";
    calculateLoan();
    return;
  }
  let min = 0, max = 500000000;
  let num = Math.max(min, Math.min(max, Number(raw)));
  e.target.value = formatIndianNumber(num);
  amountEl.value = Math.min(num, 30000000);
  calculateLoan();
});
rateEl.addEventListener('input',syncLoanInput);
rateNum.addEventListener('input', function(e) {
  // Allow free decimal editing
  let val = e.target.value;
  if(val === "") return;
  // Only update slider if valid number
  if(!isNaN(Number(val))) {
    let min = 1, max = 25;
    let num = Math.max(min, Math.min(max, Number(val)));
    rateEl.value = num;
    calculateLoan();
  }
});
rateNum.addEventListener('blur', function(e) {
  let val = e.target.value;
  if(val === "" || isNaN(Number(val))) {
    e.target.value = 1;
    rateEl.value = 1;
    calculateLoan();
    return;
  }
  let min = 1, max = 25;
  let num = Math.max(min, Math.min(max, Number(val)));
  e.target.value = num;
  rateEl.value = num;
  calculateLoan();
});
yearsEl.addEventListener('input',syncLoanInput);
yearsNum.addEventListener('input',syncLoanInput);

function formatIndianNumber(x) {
  x = x.toString().replace(/[^\d]/g, '');
  let lastThree = x.substring(x.length - 3);
  let otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers !== '')
    lastThree = ',' + lastThree;
  return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
}

function unformatNumber(x) {
  return x.replace(/[^\d]/g, '');
}

function updateLoanAmountInput(e) {
  let raw = unformatNumber(e.target.value);
  let min = 0, max = 500000000;
  let num = Math.max(min, Math.min(max, Number(raw)));
  e.target.value = formatIndianNumber(num);
  amountEl.value = Math.min(num, 30000000);
  calculateLoan();
}

function updateLoanAmountFromSlider(e) {
  let num = Math.max(10000, Math.min(30000000, Number(e.target.value)));
  amountNum.value = formatIndianNumber(num);
  calculateLoan();
}

function calculateLoan(){
  let P = Number(unformatNumber(amountNum.value));
  let maxInput = 500000000;
  if (P > maxInput) P = maxInput;
  amountNum.value = formatIndianNumber(P);
  amountEl.value = Math.min(P, 30000000);
  let r = +rateEl.value/12/100, N = +yearsEl.value*12;
  if(P<1||r<=0||r>35||N<=0){
    emiEl.textContent='Invalid inputs'; interestEl.textContent=''; totalEl.textContent='';
    return;
  }
  let EMI=P*r*Math.pow(1+r,N)/(Math.pow(1+r,N)-1);
  let totalPay=EMI*N, totalInt=totalPay-P;
  emiEl.textContent='EMI: ₹'+EMI.toFixed(2);
  interestEl.textContent='Total Interest: ₹'+totalInt.toFixed(2);
  totalEl.textContent='Total Payable: ₹'+totalPay.toFixed(2);
  drawLoanChart(P,totalInt);
  generateEMIData(P,r,N,EMI);
  renderEMITable();
}
calculateLoan();

function generateEMIData(P,r,N,EMI){
  emiData=[]; let balance=P;
  for(let m=1;m<=N;m++){
    let interest=balance*r, principal=EMI-interest;
    balance-=principal;
    emiData.push([m,EMI,principal,interest,Math.max(balance,0)]);
  }
  emiPage=0;
}

function renderEMITable(){
  emiTable.innerHTML='';
  loadMoreEMI();
}

function loadMoreEMI(){
  let start=emiPage*10; emiPage++; let end=emiPage*10;
  for(let i=start;i<end && i<emiData.length;i++){
    let row=emiData[i];
    let tr='<tr>'+row.map(n=>'<td>'+ (n.toFixed ? n.toFixed(2):n) +'</td>').join('')+'</tr>';
    emiTable.insertAdjacentHTML('beforeend',tr);
  }
}

amountNum.addEventListener('input', function(e) {
  let raw = unformatNumber(e.target.value);
  if(e.target.value === "") {
    amountEl.value = "";
    return;
  }
  let min = 0, max = 500000000;
  let num = Math.max(min, Math.min(max, Number(raw)));
  amountEl.value = Math.min(num, 30000000);
  calculateLoan();
});
amountNum.addEventListener('blur', function(e) {
  let raw = unformatNumber(e.target.value);
  if(e.target.value === "" || isNaN(Number(raw)) || Number(raw) < 0) {
    e.target.value = "";
    amountEl.value = "";
    calculateLoan();
    return;
  }
  let min = 0, max = 500000000;
  let num = Math.max(min, Math.min(max, Number(raw)));
  e.target.value = formatIndianNumber(num);
  amountEl.value = Math.min(num, 30000000);
  calculateLoan();
});
amountEl.addEventListener('input', updateLoanAmountFromSlider);
rateEl.addEventListener('input', function(e) {
  let min = 1, max = 25;
  let value = Math.max(min, Math.min(max, Number(e.target.value)));
  rateEl.value = value;
  rateNum.value = value;
  calculateLoan();
});
rateNum.addEventListener('input', function(e) {
  // Allow free decimal editing
  let val = e.target.value;
  if(val === "") return;
  // Only update slider if valid number
  if(!isNaN(Number(val))) {
    let min = 1, max = 25;
    let num = Math.max(min, Math.min(max, Number(val)));
    rateEl.value = num;
    calculateLoan();
  }
});
rateNum.addEventListener('blur', function(e) {
  let val = e.target.value;
  if(val === "" || isNaN(Number(val))) {
    e.target.value = 1;
    rateEl.value = 1;
    calculateLoan();
    return;
  }
  let min = 1, max = 25;
  let num = Math.max(min, Math.min(max, Number(val)));
  e.target.value = num;
  rateEl.value = num;
  calculateLoan();
});
yearsEl.addEventListener('input', function(e) {
  let min = 1, max = 35;
  let value = Math.max(min, Math.min(max, Number(e.target.value)));
  yearsEl.value = value;
  yearsNum.value = value;
  calculateLoan();
});
yearsNum.addEventListener('input', function(e) {
  let min = 1, max = 35;
  let value = Math.max(min, Math.min(max, Number(e.target.value)));
  yearsNum.value = value;
  yearsEl.value = value;
  calculateLoan();
});
