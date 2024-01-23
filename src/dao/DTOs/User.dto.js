class UserDTO {
  constructor(userInfo) {
    this.first_name = userInfo?.first_name;
    this.last_name = userInfo?.last_name;
    this.email = userInfo?.email;
    this.age = userInfo?.age;
    this.role = "user";
  }
}

export default UserDTO;
