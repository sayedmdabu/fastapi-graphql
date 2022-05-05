ready(() => {

  (document.querySelector('.send-feedback-form') || missing).addEventListener('submit', (event) => {
    document.querySelector('.thankyou-message').textContent = '';
    event.preventDefault();
    fetch('/feedback/add/', {
      method: 'POST',
      headers: {'X-CSRFToken': generated_csrf_token},
      body: JSON.stringify({
        email: document.querySelector('.email-input').value,
        feedback: document.querySelector('.feedback-input').value,
        url: location.href
      })
    }).then(() => {
      toggleModal('Thank You!', null);
    }).catch(() => {
      toggleModal('Something went wrong.<br>Please email your feedback to us.');
    });
  });

});

function toggleModal(message) {
  $('#feedbackModal').modal('hide');
  $('#thankyouModal').modal('show');
  document.querySelector('.email-input').value = '';
  document.querySelector('.feedback-input').value = '';
  document.querySelector('.thankyou-message').textContent = message;
}
