/**

* =====================================================
* QuantumTrader-AI
* STAGE 37C — AUTH MANAGER
* =====================================================
* 
* Purpose:
* Handles user session state for mobile app.
* 
* =====================================================
  */

export class AuthManager {

constructor() {
this.token = null;
this.user = null;
}

login(token, user) {
this.token = token;
this.user = user;

return {
  status: "AUTH_SUCCESS",
  user
};

}

logout() {
this.token = null;
this.user = null;

return {
  status: "LOGGED_OUT"
};

}

isAuthenticated() {
return !!this.token;
}
}
