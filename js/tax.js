document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const financialYearSelect = document.getElementById('financialYear');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const taxComparisonBlock = document.getElementById('taxComparisonBlock');
    const savingsMessage = document.getElementById('savingsMessage');

    // Income Inputs
    const basicSalaryInput = document.getElementById('basicSalary');
    const interestIncomeInput = document.getElementById('interestIncome');
    const stcgIncomeInput = document.getElementById('stcgIncome');
    const ltcgIncomeInput = document.getElementById('ltcgIncome');
    const cryptoIncomeInput = document.getElementById('cryptoIncome');

    // Deduction Inputs
    const deductionsSection = document.getElementById('deductionsSection');
    const hraInput = document.getElementById('hra');
    const sec80cInput = document.getElementById('sec80c');
    const sec80dInput = document.getElementById('sec80d');
    const homeLoanInterestInput = document.getElementById('homeLoanInterest');
    const otherDeductionsInput = document.getElementById('otherDeductions');

    // --- TAX DATA CONFIGURATION ---
    const taxData = {
        '2025-26': {
            new: {
                slabs: [
                    { upTo: 400000, rate: 0 }, { upTo: 800000, rate: 0.05 },
                    { upTo: 1200000, rate: 0.10 }, { upTo: 1600000, rate: 0.15 },
                    { upTo: 2000000, rate: 0.20 }, { upTo: 2400000, rate: 0.25 },
                    { upTo: Infinity, rate: 0.30 }
                ],
                standardDeduction: 75000,
                rebateLimit: 1200000,
                ltcgExemption: 125000,
                basicExemptionLimit: 400000,
                stcgRate: 0.20, // Updated Rate
                ltcgRate: 0.125 // Updated Rate
            },
            old: {
                slabs: [
                    { upTo: 250000, rate: 0 }, { upTo: 500000, rate: 0.05 },
                    { upTo: 1000000, rate: 0.20 }, { upTo: Infinity, rate: 0.30 }
                ],
                standardDeduction: 50000,
                rebateLimit: 500000,
                ltcgExemption: 125000,
                basicExemptionLimit: 250000,
                stcgRate: 0.20, // Updated Rate
                ltcgRate: 0.125 // Updated Rate
            }
        },
        '2024-25': {
            // NOTE: For FY 2024-25, rates changed mid-year. This calculator uses the rates applicable from July 23, 2024 onwards for simplicity.
            new: {
                slabs: [
                    { upTo: 300000, rate: 0 }, { upTo: 600000, rate: 0.05 },
                    { upTo: 900000, rate: 0.10 }, { upTo: 1200000, rate: 0.15 },
                    { upTo: 1500000, rate: 0.20 }, { upTo: Infinity, rate: 0.30 }
                ],
                standardDeduction: 75000,
                rebateLimit: 700000,
                ltcgExemption: 125000,
                basicExemptionLimit: 300000,
                stcgRate: 0.20, // Updated Rate
                ltcgRate: 0.125 // Updated Rate
            },
            old: {
                slabs: [
                    { upTo: 250000, rate: 0 }, { upTo: 500000, rate: 0.05 },
                    { upTo: 1000000, rate: 0.20 }, { upTo: Infinity, rate: 0.30 }
                ],
                standardDeduction: 50000,
                rebateLimit: 500000,
                ltcgExemption: 125000,
                basicExemptionLimit: 250000,
                stcgRate: 0.20, // Updated Rate
                ltcgRate: 0.125 // Updated Rate
            }
        }
    };

    // --- EVENT LISTENER ---
    calculateBtn.addEventListener('click', displayComparison);

    // --- MAIN DISPLAY FUNCTION ---
    function displayComparison() {
        const fy = financialYearSelect.value;
        const oldRegimeResult = calculateTaxLiability('old');
        const newRegimeResult = calculateTaxLiability('new');

        const f = (n) => `₹ ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const regimeConfig = taxData[fy]['new'];

        taxComparisonBlock.innerHTML = `
            <div class="tax-comparison-container">
                <div class="tax-comparison-column">
                    <div class="tax-column-header">Old Regime</div>
                    <div class="tax-row"><span>Gross Income:</span> <span>${f(oldRegimeResult.grossIncome)}</span></div>
                    <div class="tax-row"><span>Deductions:</span> <span>-${f(oldRegimeResult.totalDeductions)}</span></div>
                    <div class="tax-row summary"><span>Taxable Income:</span> <span>${f(oldRegimeResult.taxableIncome)}</span></div>
                    <div class="tax-breakdown-header">Tax Calculation</div>
                    <div class="tax-row small"><span>Slab Tax:</span> <span>${f(oldRegimeResult.normalTax)}</span></div>
                    <div class="tax-row small"><span>STCG Tax (${regimeConfig.stcgRate * 100}%):</span> <span>${f(oldRegimeResult.stcgTax)}</span></div>
                    <div class="tax-row small"><span>LTCG Tax (${regimeConfig.ltcgRate * 100}%):</span> <span>${f(oldRegimeResult.ltcgTax)}</span></div>
                    <div class="tax-row small"><span>Crypto Tax (30%):</span> <span>${f(oldRegimeResult.cryptoTax)}</span></div>
                    <div class="tax-row"><span>Surcharge:</span> <span>+${f(oldRegimeResult.surcharge)}</span></div>
                    <div class="tax-row"><span>Cess (4%):</span> <span>+${f(oldRegimeResult.cess)}</span></div>
                    <div class="tax-row total"><span>Total Tax:</span> <span>${f(oldRegimeResult.totalTax)}</span></div>
                </div>
                <div class="tax-comparison-column">
                    <div class="tax-column-header">New Regime</div>
                    <div class="tax-row"><span>Gross Income:</span> <span>${f(newRegimeResult.grossIncome)}</span></div>
                    <div class="tax-row"><span>Deductions:</span> <span>-${f(newRegimeResult.totalDeductions)}</span></div>
                    <div class="tax-row summary"><span>Taxable Income:</span> <span>${f(newRegimeResult.taxableIncome)}</span></div>
                    <div class="tax-breakdown-header">Tax Calculation</div>
                    <div class="tax-row small"><span>Slab Tax:</span> <span>${f(newRegimeResult.normalTax)}</span></div>
                    <div class="tax-row small"><span>STCG Tax (${regimeConfig.stcgRate * 100}%):</span> <span>${f(newRegimeResult.stcgTax)}</span></div>
                    <div class="tax-row small"><span>LTCG Tax (${regimeConfig.ltcgRate * 100}%):</span> <span>${f(newRegimeResult.ltcgTax)}</span></div>
                    <div class="tax-row small"><span>Crypto Tax (30%):</span> <span>${f(newRegimeResult.cryptoTax)}</span></div>
                    <div class="tax-row"><span>Surcharge:</span> <span>+${f(newRegimeResult.surcharge)}</span></div>
                    <div class="tax-row"><span>Cess (4%):</span> <span>+${f(newRegimeResult.cess)}</span></div>
                    <div class="tax-row total"><span>Total Tax:</span> <span>${f(newRegimeResult.totalTax)}</span></div>
                </div>
            </div>
        `;

        const savings = Math.abs(oldRegimeResult.totalTax - newRegimeResult.totalTax);
        if (oldRegimeResult.totalTax < newRegimeResult.totalTax) {
            savingsMessage.innerHTML = `🏆 By choosing the <strong>Old Regime</strong>, you save <span class="savings-amount">${f(savings)}</span>.`;
        } else if (newRegimeResult.totalTax < oldRegimeResult.totalTax) {
            savingsMessage.innerHTML = `🏆 By choosing the <strong>New Regime</strong>, you save <span class="savings-amount">${f(savings)}</span>.`;
        } else {
            savingsMessage.textContent = `Tax is the same under both regimes.`;
        }

        resultsContainer.style.display = 'block';
    }

    // --- CORE CALCULATION ENGINE ---
    function calculateTaxLiability(regime) {
        const fy = financialYearSelect.value;
        const regimeConfig = taxData[fy][regime];

        // --- Incomes ---
        const grossSalary = Number(basicSalaryInput.value) || 0;
        const interestIncome = Number(interestIncomeInput.value) || 0;
        const stcg = Number(stcgIncomeInput.value) || 0;
        const ltcg = Number(ltcgIncomeInput.value) || 0;
        const cryptoIncome = Number(cryptoIncomeInput.value) || 0;
        const grossIncome = grossSalary + interestIncome + stcg + ltcg + cryptoIncome;

        // --- Deductions ---
        let totalDeductions = 0;
        if (grossSalary > 0) {
            totalDeductions += regimeConfig.standardDeduction;
        }
        if (regime === 'old') {
            totalDeductions += Number(hraInput.value) || 0;
            totalDeductions += Math.min(Number(sec80cInput.value) || 0, 150000);
            totalDeductions += Number(sec80dInput.value) || 0;
            totalDeductions += Math.min(Number(homeLoanInterestInput.value) || 0, 200000);
            totalDeductions += Number(otherDeductionsInput.value) || 0;
        }
        
        const netTaxableIncome = Math.max(0, grossIncome - totalDeductions);

        // --- Rebate under 87A ---
        if (netTaxableIncome <= regimeConfig.rebateLimit) {
            return { grossIncome, totalDeductions, taxableIncome: netTaxableIncome, normalTax: 0, stcgTax: 0, ltcgTax: 0, cryptoTax: 0, incomeTax: 0, surcharge: 0, cess: 0, totalTax: 0 };
        }

        // --- Tax on Crypto (calculated separately as it cannot be adjusted) ---
        const cryptoTax = cryptoIncome * 0.30;

        // --- Income eligible for slab rates and adjustments ---
        const normalIncomeBeforeDeductions = grossSalary + interestIncome;
        const normalTaxableIncome = Math.max(0, normalIncomeBeforeDeductions - totalDeductions);

        // --- Adjustment of Basic Exemption Limit ---
        let unexhaustedExemption = Math.max(0, regimeConfig.basicExemptionLimit - normalTaxableIncome);

        // Adjust against LTCG first
        let taxableLTCG = Math.max(0, ltcg - regimeConfig.ltcgExemption);
        const ltcgAdjustment = Math.min(taxableLTCG, unexhaustedExemption);
        taxableLTCG -= ltcgAdjustment;
        unexhaustedExemption -= ltcgAdjustment;

        // Adjust remaining against STCG
        let taxableSTCG = stcg;
        const stcgAdjustment = Math.min(taxableSTCG, unexhaustedExemption);
        taxableSTCG -= stcgAdjustment;

        // --- Tax Calculation on Adjusted Incomes ---
        const ltcgTax = taxableLTCG * regimeConfig.ltcgRate;
        const stcgTax = taxableSTCG * regimeConfig.stcgRate;
        
        // --- Tax on Normal Income (Slab rates) ---
        const normalTax = calculateSlabTax(normalTaxableIncome, regimeConfig);
        
        const incomeTax = normalTax + stcgTax + ltcgTax + cryptoTax;

        // --- Surcharge & Cess ---
        const surcharge = calculateSurcharge(netTaxableIncome, incomeTax);
        const taxBeforeCess = incomeTax + surcharge;
        const cess = taxBeforeCess * 0.04;
        const totalTax = taxBeforeCess + cess;

        return {
            grossIncome,
            totalDeductions,
            taxableIncome: netTaxableIncome,
            normalTax,
            stcgTax,
            ltcgTax,
            cryptoTax,
            incomeTax,
            surcharge,
            cess,
            totalTax
        };
    }

    function calculateSlabTax(income, regimeConfig) {
        if (income <= 0) return 0;
        let tax = 0;
        let remainingIncome = income;

        for (let i = 0; i < regimeConfig.slabs.length; i++) {
            const slab = regimeConfig.slabs[i];
            const prevSlabLimit = i === 0 ? 0 : regimeConfig.slabs[i - 1].upTo;
            if (remainingIncome > 0) {
                const taxableInSlab = Math.min(remainingIncome, slab.upTo - prevSlabLimit);
                tax += taxableInSlab * slab.rate;
                remainingIncome -= taxableInSlab;
                if (remainingIncome <= 0) break;
            }
        }
        return tax;
    }
    
    function calculateSurcharge(taxableIncome, tax) {
        let surcharge = 0;
        if (taxableIncome > 50000000) surcharge = tax * 0.37;
        else if (taxableIncome > 20000000) surcharge = tax * 0.25;
        else if (taxableIncome > 10000000) surcharge = tax * 0.15;
        else if (taxableIncome > 5000000) surcharge = tax * 0.10;
        return surcharge;
    }
});