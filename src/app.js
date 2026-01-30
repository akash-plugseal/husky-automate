console.log("app")


const sum = (num1, num2) =>{
    if(typeof num1 !== 'number' || typeof num2 !== 'number'){
        console.log("must be a number")
        return;
    }
    return num1 + num2;
}

sum(12, 32);