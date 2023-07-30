interface UserModel {
  email: string;
  name: string;
  _id: string;
  isActivated: boolean;
  status: string;
}

export default class UserDto {
  email;
  id;
  isActivated;
  name;
  status;
  constructor(model: UserModel) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.name = model.name;
    this.status = model.status;
  }
}
