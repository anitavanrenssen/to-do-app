export class Task {
  constructor(taskid, taskname, taskdate) {
    this._taskid = taskid;
    this._taskname = taskname;
    this._taskdate = taskdate;
  }
  get taskid() {
    return this._taskid;
  }

  set taskid(newtaskid) {
    this._taskid = newtaskid;
  }

  get taskname() {
    return this._taskname;
  }

  set taskname(newtaskname) {
    this._taskname = newtaskname;
  }

  get taskdate() {
    return this._taskdate;
  }

  set taskdate(newtaskdate) {
    this._taskid = newtaskdate;
  }
}
