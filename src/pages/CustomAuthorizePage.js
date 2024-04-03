import CustomPage from "pages/CustomPage";

class CustomAuthorizePage extends CustomPage {
  constructor(props) {
    super(props);
    if (!this.getAccountState().hasLogon()) {
      this.setRedirectUrl("/login");
    }
  }
}

export default CustomAuthorizePage;
