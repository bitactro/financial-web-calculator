// Configuration settings for the application
const config = {
    domain: 'bitactro.com',
    appName: 'Bitactro',
    appDescription: 'Free online calculators for SIP investment planning and home loan EMI calculation',
    appLogoPath: '/logo.png',
    socialPreviewImage: '/calculator-preview.jpg'
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}
