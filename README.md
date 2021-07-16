# loginsession
//A simple app to demonstrate session management in nodejs
The user is prompted to either login or register in homepage
Clcking on either will redirect to corresponding page
When the user tries to register existing user, or without username etc.. The error is handled by using a label to tell the user what he is doing wrong.
When the user completes registration he is automatically redirected to the protected page ,refreshing this page doesnt have any efffect .Thus session is managed.
The user can click on the logout button to delete the current session and logout.
Similary the Errors arrising with logins are also handled with a label ,And on succsessful login user is redirected to protectedpage.
If the user tries to directly access the protected page without creating a session ,the user is redirected to login page.
