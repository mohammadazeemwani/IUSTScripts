const selectMenu = document.querySelector('#cphMain_ddlTopic');

const topicsValues = [...selectMenu.querySelectorAll('option')].map(option => option.value);

const topicToSend = 0;

if (topicToSend < topicsValues.length) {
  
  if (topicToSend > 0) {
    selectMenu.value = topicsValues[topicToSend];
  }
  
  const submitButton = document.querySelector("#cphMain_btnSubmit")
  submitButton.click();
} else {
  console.log("All submitted already")
}


topicToSend++;