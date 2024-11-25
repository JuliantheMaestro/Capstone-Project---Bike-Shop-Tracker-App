//Corrects the phone number input from users


function phoneFormat(input) {
    
    input = input.replace(/\D/g, "")

    input = input.substring(0,10)

    let size = input.length
    if (size === 0) {
        return input
    }else if(size < 4) {
        return '(' + input
    }else if(size < 7) {
        return '(' + input.substring(0,3) + ') ' + input.substring(3,6)
    }else {
        return '(' + input.substring(0,3) + ') ' + input.substring(3,6) + '-' + input.substring(6,10)
    }

}


document.getElementById("input-phonenumber").addEventListener('keyup', function() {
    let phoneNumber = document.getElementById("input-phonenumber")
    phoneNumber.value = phoneFormat(phoneNumber.value)
})