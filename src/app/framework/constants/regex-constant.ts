export const RegexPattern = {
    allCharPattern: /^([a-zA-Z0-9!@#$%^&*(){}_+:;'"[\]<>?/.\\,|=\-`~]+\s)*[a-zA-Z0-9!@#$%^&*(){}_+:;'"[\]<>?/.\\,|=\-`~]+$/,
    allIntegers: /^([0-9])+$/,
    namePattern: `[^0-9\\r\\n\\t|\"]+$`,
    email: /^[a-z0-9._%+'-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
}