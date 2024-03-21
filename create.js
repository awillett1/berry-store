/*
// Check if Firebase app has already been initialized
if (!firebaseInstance) {
    // Fetch firebaseConfig from server and initialize Firebase
    document.addEventListener('DOMContentLoaded', async function () {
        try {
            // Fetch Firebase configuration from the server
            const response = await fetch('https://berry-commerce-default-rtdb.firebaseio.com/appConfigurations/firebaseConfig.json');
            const firebaseConfig = await response.json();

            // Initialize Firebase with the fetched configuration
            firebaseInstance = firebase.initializeApp(firebaseConfig);

            // Continue with the rest of your code
            const registrationForm = document.getElementById('registrationForm');
            registrationForm.addEventListener('submit', handleRegistration);

        } catch (error) {
            console.error('Error fetching or initializing Firebase:', error);
            // Handle errors, e.g., prevent further execution or show an error message
        }
    });
}

async function handleRegistration(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('registrationEmail').value;
    const password = document.getElementById('registrationPassword').value;
    const role = document.querySelector('input[name="role"]:checked').value; // Get the selected role

    try {
        // Create a new user with email/password
        const userCredential = await firebaseInstance.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log('User registered successfully:', user.email);

        // Get a reference to the Firestore database
        const firestore = firebaseInstance.firestore();

        // Store user information in Firestore under the "users" collection
        await firestore.collection('users').doc(user.uid).set({
            email: email,
            role: role
        });

        // Redirect the user to index.html or any other desired page upon successful registration
        window.location.href = 'index.html';
        alert('Registration successful! You can now log in with your new account.');
        alert('Selected Role: ' + role);

    } catch (error) {
        console.error('Error registering user:', error.message);

        // Check if the error is due to an existing email address
        if (error.code === 'auth/email-already-in-use') {
            alert('This email address is already in use. Please use a different email or log in.');
        } else {
            // Handle other registration errors
            alert('Registration failed. Please try again.');
        }
    }
}

function showRegistrationForm() {
    // Toggle the display of the registration section
    document.getElementById('roleSelectionForm').style.display = 'none';
    document.getElementById('registrationSection').style.display = 'block';
}
*/


/* // MARCH 20 - WORKS BUT NO VERIFICATION CODE
async function handleRegistration(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('registrationEmail').value;
    const password = document.getElementById('registrationPassword').value;
    const role = document.querySelector('input[name="role"]:checked').value; // Get the selected role

    try {
        // Create a new user with email/password
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log('User registered successfully:', user.email);

        // Get a reference to the Firestore database
        const firestore = firebase.firestore();

        // Store user information in Firestore under the "users" collection
        await firestore.collection('users').doc(user.uid).set({
            email: email,
            role: role
        });

        // Redirect the user to index.html or any other desired page upon successful registration
        window.location.href = 'index.html';
        alert('Registration successful! You can now log in with your new account.');
        alert('Selected Role: ' + role);

    } catch (error) {
        console.error('Error registering user:', error.message);

        // Check if the error is due to an existing email address
        if (error.code === 'auth/email-already-in-use') {
            alert('This email address is already in use. Please use a different email or log in.');
        } else {
            // Handle other registration errors
            alert('Registration failed. Please try again.');
        }
    }
}

function showRegistrationForm() {
    // Toggle the display of the registration section
    document.getElementById('roleSelectionForm').style.display = 'none';
    document.getElementById('registrationSection').style.display = 'block';
}
*/

// seller.js 

document.addEventListener('DOMContentLoaded', function () {
    const nextButton = document.getElementById('nextButton');
    nextButton.addEventListener('click', handleRoleSelection);
});

function handleRoleSelection() {
    const selectedRole = document.querySelector('input[name="role"]:checked').value;

    // Hide the role selection form
    const roleSelectionSection = document.getElementById('roleSelectionSection');
    roleSelectionSection.style.display = 'none';

    // Display the registration form
    const registrationSection = document.getElementById('registrationSection');
    registrationSection.style.display = 'block';

    // Transfer the selected role to the registration form
    const userRoleInput = document.getElementById('userRole');
    userRoleInput.value = selectedRole;

    // Show/hide verification code field based on selected role
    const verificationCodeContainer = document.getElementById('verificationCodeContainer');
    if (selectedRole === 'user') {
        verificationCodeContainer.style.display = 'none';
    } else {
        verificationCodeContainer.style.display = 'block';
    }

    // Prevent default form submission
    const registrationForm = document.getElementById('registrationForm');
    registrationForm.addEventListener('submit', handleRegistration);
}

async function handleRegistration(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('registrationEmail').value;
    const password = document.getElementById('registrationPassword').value;
    const selectedRole = document.getElementById('userRole').value;

    try {
        // Register user with email/password
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log('User registered successfully:', user.email);

        // Get a reference to the Firestore database
        const firestore = firebase.firestore();

        // Store user data in Firestore
        if (selectedRole === 'user') {
            await firestore.collection('users').doc(user.uid).set({
                email: email,
                role: selectedRole,
                // Add other user data if needed
            });
        } else {
            const verificationCode = document.getElementById('verificationCode').value;
            // Check if verification code matches the stored code
            const verificationDoc = await firestore.collection('verificationCodes').doc(email).get();
            if (verificationDoc.exists) {
                const storedVerificationCode = verificationDoc.data().code;
                if (verificationCode === storedVerificationCode) {
                    await firestore.collection('sellers').doc(user.uid).set({
                        email: email,
                        role: selectedRole,
                        verificationCode: verificationCode,
                        // Add other seller data if needed
                    });
                } else {
                    alert('Verification code is incorrect. Registration failed.');
                    return;
                }
            } else {
                alert('No verification code found for this email. Registration failed.');
                return;
            }
        }

        // Redirect the user to index.html or any other desired page upon successful registration
        window.location.href = 'index.html';
        alert('Registration successful!');
    } catch (error) {
        console.error('Error registering user:', error.message);

        // Handle registration errors
        if (error.code === 'auth/email-already-in-use') {
            alert('Email address is already in use. Please use a different email or log in.');
        } else {
            alert('Registration failed. Please try again.');
        }
    }
}