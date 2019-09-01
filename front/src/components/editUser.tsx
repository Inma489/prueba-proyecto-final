import React from "react";
import { IUser, IDecoded } from "../interfaces";
import { RouteComponentProps } from "react-router";
import * as actions from "../actions";
import { connect } from "react-redux";
import { IGlobalState } from "../reducers";
import { Link } from "react-router-dom";
import "../css/editUser.css";

interface IPropsGlobal {
  token: string;
  users: IUser[];
  decoded: IDecoded;
  updateUser: (user: IUser, user_id: string) => void;
  setDecoded: (decoded: IDecoded) => void;
}

const EditUser: React.FC<
  IPropsGlobal & RouteComponentProps<{ userId: string }>
> = props => {
  const { Icon } = require("react-materialize");
  const [file, setFile] = React.useState();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [updated, setUpdated] = React.useState(false);
  const inputFileRef = React.createRef<any>();

  const handleFileUpload = (event: any) => setFile(event.target.files[0]);

  const updateFile = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFile(event.target.files![0]);

  const updateUsername = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(event.target.value);

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);

  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(event.target.value);

  const user = React.useMemo(
    // aqui cogemos de redux los usuarios
    () => props.users.find(u => u._id === props.match.params.userId),
    [props.match.params.userId, props.users]
  );

  React.useEffect(() => {
    /*el useEffect es para que me guarde los hooks de inicio cuando cambie el user.
            el useEffect es para cuando el memo cambie el user, es decir, cuando cambie el user.
            Aunque siempre se hacen la primera vez aunque no cambie lo que hay dentro del array, porque al iniciarse
            siempre lo hacen. SIEMPRE SE EJECUTA LA POR LO MENOS LA PRIMERA VEZ*/
    if (user) {
      setUsername(user.username);
      setEmail(user.email);

      // setPassword(user.password);// me da problemas al darle al boton editar metiendole le setPassword
    }
  }, [user]); // cada vez que el user cambie, es decir, cada vez que vaya a modificiar mi username

  if (!user) {
    /* esto se hacae porque puede ser que renderice y aún no tena ningún user, entonces hacemos un 
            return null y no me haria el return de mi variable user que estaria vacio, pero los gauardo en mis hooks.
            Asi en el value de mis inputs pongo mis hooks que estan iniciadas ya, porque nos hemos asegurado de que 
            user exista y entonces en useEffect ya inició todos los hooks*/

    return null;
  }
  // esto es para la foto de perfil del usuario
  // const send = () => {
  //   const data = new FormData();
  //   data.append("file", file);
  //   fetch("http://localhost:8080/api/users/uploadAvatar", {
  //     method: "POST",
  //     headers: {
  //       Authorization: "Bearer " + props.token
  //     },
  //     body: data
  //   }).then(() => setUpdated(v => !v));
  // };

  const edit = () => {
    const data = new FormData();
    data.append("_id", "" + user._id);
    if (file) {
      data.append("file", file);
    } else {
      data.append("file", "");
    }
    data.append("username", username);
    data.append("email", email);
    data.append("password", password);
    if (props.decoded.admin || props.decoded._id === user._id) {
      fetch("http://localhost:8080/api/users/" + user._id, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + props.token
        },
        body: data
      })
        .then(res => {
          if (res.ok) {
            res
              .json()
              .then(user => {
                console.log(user);
                props.setDecoded(user);
                props.updateUser(user, user._id);

                props.history.push("/myProfile"); // me redirije a mi pagina showUsers
              })
              .catch(err => {
                console.log("error " + err);
              });
          } else {
            // res.send("error");
            console.log("error");
          }
        })
        .catch(err => {
          //   response.status(400).send("error editar ," + err);
          console.log("error editar ," + err);
        });
    }
  };

  return (
    // aqui pondremos el nuevo formulario metido en card
<div className="usersBackground">
    <div className="section container caja1">
      <div className="row">
        <div className="col s12 m8">
          <div className="row card-panel formulario">
            <div className="input-field col s12">
              <div className="row">
                <div className="col s12">
                  <label>Username</label>
                  <input
                    value={username}
                    onChange={updateUsername}
                    type="text"
                    className="validate"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <label>Email</label>
                  <input
                    value={email}
                    onChange={updateEmail}
                    type="email"
                    className="validate"
                    required
                  />
                </div>
              </div>
            </div>
            <Link
              to={"/users"}
              onClick={edit}
              className="waves-effect waves-light btn left"
            >
              <Icon>save</Icon>
            </Link>

            <Link to={"/users"} className="waves-effect waves-light btn btnRight">
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
  users: state.users
});

const mapDispatchToProps = {
  updateUser: actions.updateUser,
  setDecoded: actions.setDecoded
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditUser);
