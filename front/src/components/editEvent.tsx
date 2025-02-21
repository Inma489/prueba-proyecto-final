import React from "react";
import { IDecoded, IEvent } from "../interfaces";
import * as actions from "../actions";
import { RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";

import { Link } from "react-router-dom";
import "../css/editEvent.css";

interface IPropsGlobal {
  token: string;
  decoded: IDecoded;
  events: IEvent[];
  updateEvent: (event: IEvent, event_id: string) => void;
}

const EditEvent: React.FC<
  IPropsGlobal & RouteComponentProps<{ eventId: string }>
> = props => {
  const { Icon } = require("react-materialize");
  const [file, setFile] = React.useState();
  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState("");
  const [place, setPlace] = React.useState("");
  const [time, setTime] = React.useState("");
  const [description, setDescription] = React.useState("");

  const updateFile = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFile(event.target.files![0]);

  const updateName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const updateDate = (event: React.ChangeEvent<HTMLInputElement>) =>
    setDate(event.target.value);

  const updatePlace = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPlace(event.target.value);

  const updateTime = (event: React.ChangeEvent<HTMLInputElement>) =>
    setTime(event.target.value);

  const updateDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setDescription(event.target.value);

  const event = React.useMemo(
    // aqui cogemos de redux los events
    () => props.events.find(e => e._id === props.match.params.eventId),
    [props.match.params.eventId, props.events]
  );

  React.useEffect(() => {
    /*el useEffect  SIEMPRE SE EJECUTA AL MENOS UNA VEZ*/
    if (event) {
      setName(event.name);
      setDate(event.date);
      setPlace(event.place);
      setTime(event.time);
      setDescription(event.description);
    }
  }, [event]);

  if (!event) {
    return null;
  }

  const editEvent = (event_id: string) => {
    const data = new FormData();
    data.append("file", file);
    data.append("name", name);
    data.append("date", date);
    data.append("place", place);
    data.append("time", time);
    data.append("description", description);

    fetch("http://localhost:8080/api/events/" + event_id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + props.token
      },
      body: data
    }).then(res => {
      if (res.ok) {
        res.json().then(e => {
          props.updateEvent(e, event_id);
          props.history.push("/events/");
        });
      }
    });
  };

  return (
    <div className="editBackground">
      <div className=" section container contEdit">
        <div className="row">
          <div className="col s9 m8">
            <div className="row card-panel">
              <div className="input-field col s11">
                <img
                  className="responsive-img"
                  width="300"
                  src={
                    event.filename
                      ? "http://localhost:8080/uploads/events/" +
                        event.filename +
                        "?" +
                        Date()
                      : "/image/largee.gif"
                  }
                  alt=""
                />
                <div className="file-field input-field">
                  <div className="btn">
                    <Icon>add_a_photo</Icon>
                    <input
                      type="file"
                      onChange={updateFile}
                      accept=".jpg"
                      required
                    />
                  </div>
                  <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                  </div>
                </div>

                <div className="row">
                  <label className="letterss">Title</label>
                  <input
                    type="text"
                    onChange={updateName}
                    placeholder="Title"
                    value={name}
                    className="validate"
                    required
                  />
                </div>

                <div className="row">
                  <label className="letterss">Date</label>
                  <input
                    type="text"
                    onChange={updateDate}
                    value={date}
                    placeholder="Date"
                    className="validate"
                    required
                  />
                </div>

                <div className="row">
                  <label className="letterss">Place</label>
                  <input
                    type="text"
                    onChange={updatePlace}
                    value={place}
                    placeholder="Place"
                    className="validate"
                    required
                  />
                </div>

                <div className="row">
                  <label className="letterss">Time</label>
                  <input
                    type="text"
                    onChange={updateTime}
                    value={time}
                    placeholder="Time"
                    className="validate"
                    required
                  />
                </div>

                <div className="row">
                  <label className="letterss">Description</label>
                  <textarea
                    onChange={updateDescription}
                    value={description}
                    placeholder="Description"
                    className="materialize-textarea"
                    data-length="120"
                    required
                  />
                </div>
              </div>
              <Link
                to="/events"
                onClick={() => editEvent(event._id)}
                className="waves-effect waves-light btn btnevent"
              >
                <Icon>save</Icon>
              </Link>

              <Link
                to={"/events"}
                className="waves-effect waves-light btn btncancelEvent"
              >
                <Icon>cancel</Icon>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state: IGlobalState) => ({
  token: state.token,
  decoded: state.decoded,
  events: state.events
});
const mapDispatchToProps = {
  updateEvent: actions.updateEvent
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditEvent);
