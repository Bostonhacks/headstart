function travelReimbursementCheck() {
    if (document.getElementById('reimbursementYes').checked) {
        document.getElementById('reimbursement-followup-questions').style.display = 'block';
    } else {
        document.getElementById('reimbursement-followup-questions').style.display = 'none';
    }
}