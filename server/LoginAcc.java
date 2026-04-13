package com.mycompany.chatapplication;

public class Login {
    
    private String username;
    private String password;
    private String cellPhone;
    
    Login(String username, String password, String cellPhone){
        this.username = username;
        this.password = password;
        this.cellPhone = cellPhone;
    }
   
    public boolean checkUserName() {
        return username.contains("_") && username.length() <= 5;
    }
    
    public boolean checkPasswordComplexity() {
        if (password.length() < 8) return false;
        boolean hasUpper   = false;
        boolean hasDigit   = false;
        boolean hasSpecial = false;

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) 
                hasUpper   = true;
            if (Character.isDigit(c))    
                hasDigit   = true;
            if (!Character.isLetterOrDigit(c))
                hasSpecial = true;
        }
        
        return hasUpper && hasDigit && hasSpecial;
    }
    
    public boolean checkCellPhoneNumber() {
        return cellPhone.matches("^\\+27\\d{9}$");
    }

    public String registerUser() {
       if (!checkUserName()){
           return "Username is not correctly formatted; please ensurethat your username contains an underscore and is no ore than five characters in length";
       }
       if(!checkPasswordComplexity()){
           return "Password is not correctly formatte; please ensure that the password contains atleast eight characters; a capital letter, a number, and a special character.";
       }
       if(!checkCellPhoneNumber()){
           return "CellPhone incorrectly formatted or does not contain international code.";
       }
        return "Account successfully created.";
    }
  
    public boolean loginUser(String inputUser, String inputPass) {
        return inputUser.equals(username) && inputPass.equals(password);
    }

    public String returnLoginStatus(String inputUser, String inputPass) {
        if (loginUser(inputUser, inputPass)) {
            return "Welcome back! Login successful.";
        } else {
            return "Incorrect username or password. Please try again.";
        }
    }
}

public class ChatApplication {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in); // initialize scanner -- taking user input 
        Login reg = null; // assigning the reg with value of null 
        
        System.out.println("Create an account.\n");
        
        while (true) {
            System.out.print("Enter a Username: ");
            String username = scanner.nextLine();
           
            System.out.print("Enter a Password: ");
            String password = scanner.nextLine();
           
            System.out.print("Enter a CellNo: ");
            String cellNo = scanner.nextLine();
           
            reg = new Login(username, password, cellNo); // assigning the variable reg to the class login-- initilizing the login class
           
            String SignUpCheck = reg.registerUser();
            System.out.println(SignUpCheck); // prints out the return statement from registerUser method in Login class
         
            if (SignUpCheck.contains("successfully")){
                break;
            }
        }

        System.out.println("Please login.\n");
        boolean loggedIn = false; // user doesn't have accsess to resources within the platform... 

        do {
            System.out.print("Enter a Username: ");
            String usernameLogin = scanner.nextLine();
           
            System.out.print("Enter a Password: ");
            String passwordLogin = scanner.nextLine();
           
            String LoginMsg = reg.returnLoginStatus(usernameLogin, passwordLogin);
            System.out.println(LoginMsg);
           
            if(LoginMsg.contains("Welcome")){
                loggedIn = true;
            }
                 
        } while (!loggedIn);
      
        scanner.close();
    }
}


