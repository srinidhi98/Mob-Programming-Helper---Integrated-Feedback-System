import { Session } from "../class/Session";
import "./Header.css";

interface HeaderProps{
  session: Session;
  show_code: boolean;
}

function Header(props: HeaderProps) {
  //console.log(props);
  return (
    <div className="Header">
      <h1>Desktop Application</h1>
      {props.show_code && props.session.code &&
      <>
        <h2>Session Code: {props.session.code}</h2>
      </>
      }
    </div>
  );
}

export default Header;
