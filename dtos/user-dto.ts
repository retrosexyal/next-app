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
  isTeacher;
  constructor(model: UserModel, isTeacher = false) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.name = model.name;
    this.status = model.status;
    this.isTeacher = isTeacher;
  }
}
