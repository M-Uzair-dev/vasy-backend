export const validateMobile = (mobileNumber) => {
    const mobileRegex = /^[0-9]{10,15}$/;
    return mobileRegex.test(mobileNumber);
};

export const validateDOB = (dob) => {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    const date = new Date(dob);
    return dobRegex.test(dob) && !isNaN(date.getTime());
};

export const validateCNIC = (cnic) => {
    const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
    return cnicRegex.test(cnic);
};
