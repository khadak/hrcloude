var empData = "empData",
    empDataArray = [];
function init (){
    var empDetails = localStorage.getItem(empData);

    if(empDetails) {
        empDataArray = JSON.parse(empDetails)
        for(var j =0; j<empDataArray.length; j++){
            _createEmployeeCart(empDataArray[j]);
        }
    }
    else {
        showAddEmpSection();
    }
}
function showAddEmpSection() {
    var element = document.getElementById("addEmpButton");
    element.classList.remove("js-hidden");
}
function _hideEmployeeCart() {
    var element =  document.getElementById("employeeInput");
    element.classList.remove("transition");
    _clearData();
}
function _showEmpInput (obj) {
    if(obj) {
        document.getElementById("fName").value = obj.name;
        document.getElementById("eId").value  = obj.email;
        document.getElementById("gSalary").value = obj.salary;
        document.getElementById("investment").value = obj.investment;
        document.getElementById("tIncome").value = obj.income;
        document.getElementById("tPayable").value = obj.payable;
    }
    var element =  document.getElementById("employeeInput");
        element.classList.add("transition");
        element.classList.remove("js-hidden");
}
function _nameValidate() {
    var name =  document.getElementById("fName").value,
        nameValidate = document.getElementById("nameValidate");
    if (!name){
        nameValidate.style.display = "block";
        return false;
    }
    else {
        nameValidate.style.display = "none";
        return true;
    }

}
function _emailValidate() {
    var email =  document.getElementById("eId").value,
        emailCheck = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        emailValidate = document.getElementById("emailValidate");
    if (!email){
        emailValidate.style.display = "block";
        return false;
    }
    else if(emailCheck.test(email)){
        emailValidate.style.display = "none";
        return true
    } else {
        emailValidate.style.display = "block";
        return false;
    }
}
function _salaryValidate() {
    var salary =  document.getElementById("gSalary").value,
        salaryValidate = document.getElementById("salaryValidate");
    if (!salary){
        salaryValidate.style.display = "block";
        return false;
    }
    else {
        salaryValidate.style.display = "none";
        return true;
    }
}
function _investmentValidate() {
    var investment = document.getElementById("investment").value,
        investmentValidationElm  =document.getElementById("investmentValidation");

    if(investment.length){
        if ( parseInt(investment) <= 150000){
            investmentValidationElm.style.display = "none";
            return true;
        }
        else {
            investmentValidationElm.style.display = "block";
            return false;
        }
    }else{
        return true;
    }

}
function _submitEmpData () {

    var nameValidation = _nameValidate();
    var emailValidation = _emailValidate();
    var salaryValidation = _salaryValidate();
    var isValidInvestmentValidation = _investmentValidate();

    // if (!(name && email && salary && isValidInvestment)){
    //     _nameValidate();
    //     _emailValidate();
    //     _salaryValidate();
    //     _investmentValidate();
    //     return false;
    // }

    if(nameValidation && emailValidation &&  salaryValidation &&  isValidInvestmentValidation){

        var name =  document.getElementById("fName").value,
            email =  document.getElementById("eId").value,
            salary =  document.getElementById("gSalary").value,
            investment = document.getElementById("investment").value,
            income =  document.getElementById("tIncome").value,
            payable =  document.getElementById("tPayable").value,
            flag = false;


        for(var i=0;i<empDataArray.length; i++){
            if(empDataArray[i].email === email){
                flag = true;

                empDataArray[i].name = name;
                empDataArray[i].email = email;
                empDataArray[i].salary = salary;
                empDataArray[i].investment = investment;
                empDataArray[i].income = income;
                empDataArray[i].payable = payable;

                _clearData();

            }
        }

        if(!flag){
            var empObj = {
                name: name,
                email: email,
                salary: salary,
                investment: investment,
                income: income,
                payable: payable
            }
            var element =  document.getElementById("employeeInput");
            element.classList.add("js-hidden");

            var element1 =  document.getElementById("addEmpButton");
            element1.classList.add("js-hidden");

            empDataArray.push(empObj);

            _createEmployeeCart(empObj);
        }
        else{
            document.getElementById("employeDetails").innerHTML = "";
            for(var j =0; j<empDataArray.length; j++){
                _createEmployeeCart(empDataArray[j]);
            }
        }
        window.localStorage.setItem('empData', JSON.stringify(empDataArray));

        _clearData();
        _hideEmployeeCart();
    }
}


function _calculateTax() {
    var salary =  document.getElementById("gSalary").value,
        investment = document.getElementById("investment").value,
        tIncome = document.getElementById("tIncome"),
        tPayable = document.getElementById("tPayable"),
        totalTaxAmt = 0,
        taxableIncome = salary - investment,
        isSalaryValid = (salary > 0 || investment < salary || investment <= 150000),
        isNoTaxIncome = (taxableIncome <= 250000),
        isFirstTaxSlab = (taxableIncome >= 250000) && (taxableIncome <= 500000),
        isSecondTaxSlab = (taxableIncome >= 500000) && (taxableIncome <= 1000000),
        isLastTaxSlab = (taxableIncome >= 1000000);
    if (isSalaryValid) {
        if (isNoTaxIncome) {
            tIncome.value = "";
            tPayable.value = "";
            return true;
        }
        else if (isFirstTaxSlab) {
            tIncome.value = taxableIncome;
            totalTaxAmt = Math.round(taxableIncome * 0.05);
            tPayable.value = totalTaxAmt;

        }
        else if (isSecondTaxSlab) {
            tIncome.value = taxableIncome;
            totalTaxAmt = Math.round(taxableIncome * 0.2);
            tPayable.value = totalTaxAmt;
        }
        else if (isLastTaxSlab) {
            tIncome.value = taxableIncome;
            totalTaxAmt = Math.round(taxableIncome * 0.3);
            tPayable.value = totalTaxAmt;
        }
    }
    else {
        document.getElementById("salaryValidate").style.display = "block";
    }
    _salaryValidate();
    _investmentValidate();

}

function _createEmployeeCart (empObj){
    var mainnode  = document.getElementById("employeDetails"),
        nodeWrap = document.createElement("div"),
        nodeEmpDetails = document.createElement("div"),
        nodeTaxDetails = document.createElement("div"),
        nodeImg = document.createElement("div"),
        nodeName = document.createElement("div"),
        nodeEdit = document.createElement("div"),
        nodeDesignation = document.createElement("div"),
        nodeTaxIncome =  document.createElement("div"),
        nodeTaxPayable = document.createElement("div"),
        element =  document.getElementById("addEmployee");

    element.classList.remove("js-hidden");
    nodeImg.innerHTML = "<img src='../images/emp-1.png' data-rjs=\"3\">";
    nodeName.innerHTML = empObj.name;
    nodeEdit.innerText = " ";
    nodeDesignation.innerText = "UI Developer";
    nodeTaxIncome.innerHTML = empObj.income;
    nodeTaxPayable.innerHTML = empObj.payable;

    mainnode.appendChild(nodeWrap).classList.add("profile");
    nodeWrap.appendChild(nodeImg).classList.add("profile__pic");
    nodeWrap.appendChild(nodeEmpDetails).classList.add("profile__details");
    nodeEmpDetails.appendChild(nodeName).classList.add("profile__name");
    nodeEmpDetails.appendChild(nodeEdit).classList.add("profile__edit");
    nodeEmpDetails.appendChild(nodeDesignation).classList.add("profile__designation");
    nodeEmpDetails.appendChild(nodeTaxDetails).classList.add("profile__tax-details");
    nodeTaxDetails.appendChild(nodeTaxIncome).classList.add("profile__tax-income");
    nodeTaxDetails.appendChild(nodeTaxPayable).classList.add("profile__tax-payable");

    nodeEdit.onclick = function(){
        _showEmpInput(empObj)
    }
}
function _clearData() {
    document.getElementById("fName").value = "";
    document.getElementById("eId").value ="";
    document.getElementById("gSalary").value ="";
    document.getElementById("investment").value ="";
    document.getElementById("tIncome").value ="";
    document.getElementById("tPayable").value ="";
    document.getElementById("nameValidate").style.display = "none";
    document.getElementById("emailValidate").style.display = "none";
    document.getElementById("salaryValidate").style.display = "none";
    document.getElementById("investmentValidation").style.display = "none";
}
init();