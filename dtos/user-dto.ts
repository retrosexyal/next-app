interface UserModel {
  email: string;
  name: string;
  _id: string;
  isActivated: boolean;
}

export default class UserDto {
  email;
  id;
  isActivated;
  name;
  constructor(model: UserModel) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.name = model.name;
  }
}
