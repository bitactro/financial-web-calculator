const sipAmount=document.getElementById('sipAmount'),sipAmountNum=document.getElementById('sipAmountNum');
const sipRate=document.getElementById('sipRate'),sipRateNum=document.getElementById('sipRateNum');
const sipYears=document.getElementById('sipYears'),sipYearsNum=document.getElementById('sipYearsNum');
const sipMode=document.getElementById('sipMode');
const sipMaturity=document.getElementById('sipMaturity'),sipProfit=document.getElementById('sipProfit');

// Remove existing event listeners
sipAmount.removeEventListener('input', syncSIPInput);
sipAmountNum.removeEventListener('input', syncSIPInput);

function syncSIPInput(e){
  if (e.target.id === 'sipRate' || e.target.id === 'sipRateNum' || 
      e.target.id === 'sipYears' || e.target.id === 'sipYearsNum') {
    // Handle rate and years inputs as before
    let min = 1;
    let max = (e.target.id.includes('Rate')) ? 70 : 50;
    let value = Math.max(min, Math.min(max, Math.abs(+e.target.value || 0)));
    e.target.value = value;
    if(e.target.type === 'range') e.target.nextElementSibling.value = value;
    else e.target.previousElementSibling.value = value;
    calculateSIP();
  }
}

// Handle amount slider input
sipAmount.addEventListener('input', function(e) {
  let min = 500;
  let sliderMax = 1500000;
  let value = Math.max(min, Math.min(sliderMax, Math.abs(+e.target.value || 0)));
  e.target.value = value;
  sipAmountNum.value = value;
  calculateSIP();
});

// Handle amount number input
sipAmountNum.addEventListener('input', function(e) {
  const inputMax = 500000000;
  let value = e.target.value;
  
  // Allow empty value during input
  if (value === '') {
    sipAmount.value = 500; // Keep slider at minimum
    calculateSIP();
    return;
  }

  // If there's a value, enforce maximum limit
  value = Math.min(inputMax, Math.abs(+value || 0));
  e.target.value = value;
  
  // Update slider if value is within its range
  if (value <= 1500000) {
    sipAmount.value = value;
  } else {
    sipAmount.value = 1500000;
  }
  calculateSIP();
});

// Handle amount input blur (when focus leaves the input)
sipAmountNum.addEventListener('blur', function(e) {
  let value = e.target.value;
  
  // If empty or less than minimum when leaving field, set to minimum
  if (value === '' || +value < 500) {
    value = 500;
  }
  
  // Enforce limits
  value = Math.max(500, Math.min(500000000, +value));
  e.target.value = value;
  
  // Update slider if within its range
  if (value <= 1500000) {
    sipAmount.value = value;
  } else {
    sipAmount.value = 1500000;
  }
  calculateSIP();
});

sipAmount.addEventListener('input',syncSIPInput);
sipAmountNum.addEventListener('input',syncSIPInput);
sipRate.addEventListener('input',syncSIPInput);
sipRateNum.addEventListener('input', function(e) {
  // Allow free decimal editing
  let val = e.target.value;
  if(val === "") return;
  // Only update slider if valid number
  if(!isNaN(Number(val))) {
    let min = 1, max = 70;
    let num = Math.max(min, Math.min(max, Number(val)));
    sipRate.value = num;
    calculateSIP();
  }
});
sipRateNum.addEventListener('blur', function(e) {
  let val = e.target.value;
  if(val === "" || isNaN(Number(val))) {
    e.target.value = 1;
    sipRate.value = 1;
    calculateSIP();
    return;
  }
  let min = 1, max = 70;
  let num = Math.max(min, Math.min(max, Number(val)));
  e.target.value = num;
  sipRate.value = num;
  calculateSIP();
});
sipYears.addEventListener('input',syncSIPInput);
sipYearsNum.addEventListener('input',syncSIPInput);
sipMode.addEventListener('change',calculateSIP);

function formatIndianHRV(num) {
  num = Number(num);
  if (num >= 10000000) return (num/10000000).toFixed(2) + ' crore';
  if (num >= 100000) return (num/100000).toFixed(2) + ' lakh';
  if (num >= 1000) return (num/1000).toFixed(2) + ' Thousand';
  return num.toString();
}

function calculateSIP(){
  let amt = +sipAmountNum.value; // Use number input value for calculation
  if (amt < 500) amt = 500;
  if (amt > 500000000) amt = 500000000;
  sipAmountNum.value = amt;
  // Only update slider if amount is within its range
  if (amt <= 1500000) {
    sipAmount.value = amt;
  }
  let rate = +sipRate.value/100, years = +sipYears.value;
  if(amt<1||rate<=0||rate>200||years<=0){
    sipMaturity.textContent='Invalid inputs'; sipProfit.textContent='';
    return;
  }
  if(sipMode.value==='monthly'){
    let n=years*12,R=rate/12;
    let fv=amt*( (Math.pow(1+R,n)-1)*(1+R)/R );
    let invested=amt*n,profit=fv-invested;
    sipMaturity.textContent='Maturity: ₹'+fv.toFixed(2)+' ('+formatIndianHRV(fv)+')';
    sipProfit.textContent='Profit: ₹'+profit.toFixed(2)+' ('+formatIndianHRV(profit)+')';
    drawSIPChart(invested,profit);
  }else{
    let fv=amt*Math.pow(1+rate,years);
    let profit=fv-amt;
    sipMaturity.textContent='Maturity: ₹'+fv.toFixed(2)+' ('+formatIndianHRV(fv)+')';
    sipProfit.textContent='Profit: ₹'+profit.toFixed(2)+' ('+formatIndianHRV(profit)+')';
    drawSIPChart(amt,profit);
  }
  sipMaturity.classList.add('highlight-result');
  sipProfit.classList.add('highlight-result');
}
calculateSIP();
