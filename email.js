// Function to handle email change
function changeEmail() {
  var newEmail = document.getElementById('newEmail').value;
  var user = firebase.auth().currentUser;

  if (user) {
      user.updateEmail(newEmail).then(function() {
          // Update email in 'users' collection
          updateUserEmail(user.uid, newEmail)
              .then(function() {
                  console.log("User email updated successfully.");

                  // Update email in 'sellers' collection
                  updateSellerEmail(user.uid, newEmail)
                      .then(function() {
                          console.log("Seller email updated successfully.");
                      })
                      .catch(function(error) {
                          console.error("Error updating seller email:", error);
                      });
              })
              .catch(function(error) {
                  console.error("Error updating user email:", error);
              });
      }).catch(function(error) {
          console.error("Error updating email:", error);
      });
  } else {
      console.error("No user signed in.");
  }
}
