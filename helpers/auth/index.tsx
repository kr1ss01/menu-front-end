// ? Verify Email Is Valid
export const verifyEmail = (email: string): boolean => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const isMatch = email.match(emailRegex);

    if (isMatch) { 
        return true 
    } else { 
        return false 
    }
}

// ? Verify Password Fullfills Criteria
export const verifyPassword = (pwd: string): boolean => {
    const pwdRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    const isMatch = pwd.match(pwdRegex);

    if (isMatch) { 
        return true 
    } else { 
        return false 
    }
}

// ? Verify Username Fullfills Criteria
export const verifyUsername = (uid: string): boolean => {
    const uidRegex = new RegExp('^[a-zA-Z0-9_]+$');

    const isMatch = uid.match(uidRegex);

    if (isMatch) { 
        return true 
    } else { 
        return false 
    }
}

// ? Verify Full Name Fullfills Criteria
export const verifyFullName = (fname: string): boolean => {
    const fnameRegex = new RegExp('^[α-ωΑ-Ωa-zA-Z ]*$');

    const isMatch = fname.match(fnameRegex);

    if (isMatch) { 
        return true 
    } else { 
        return false 
    }
}

// ? Verify Age Fullfills Criteria
export const verifyAge = (age: string): boolean => {
    const ageRegex = new RegExp('^[0-9]*$');

    const isMatch = age.match(ageRegex);

    if (isMatch) { 
        return true 
    } else { 
        return false 
    }
}

// ? Verify String Consists Of Only Capitals
export const checkCapitalCharacters = (pwd: string) => {
    const cRegEx = new RegExp('[A-Z]');

    const isMatch = pwd.match(cRegEx);

    return isMatch ? true : false;
}

// ? Verify String Consists Of Only Small Chars
export const checkSmallCharacters = (pwd: string) => {
    const cRegEx = new RegExp('[a-z]');

    const isMatch = pwd.match(cRegEx);

    return isMatch ? true : false;
}

// ? Verify String Is Only Numbers
export const checkNumber = (pwd: string) => {
    const nRegEx = new RegExp('[0-9]');

    const isMatch = pwd.match(nRegEx);

    return isMatch ? true : false;
}

// ? Verify String Has Special Characters
export const checkSpecialCharacters = (pwd: string) => {
    const sRegEx = new RegExp('[!@#\$%\^&\*]');

    const isMatch = pwd.match(sRegEx);

    return isMatch ? true : false;
}