import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

interface PropsType {
  clickable?: "clickable" | "none";
  classNameEdit?: string;
}
function Logo({ clickable = "clickable", classNameEdit }: PropsType) {
  if (clickable && clickable === "none") {
    return (
      <div
        className={cn("w-13 h-13 rounded-full overflow-hidden ", classNameEdit)}
      >
        <img
          src="/navbar/logo.jpg"
          className="w-full h-full object-cover object-center"
          alt="logo"
        />
      </div>
    );
  } else {
    return (
      <Link to="/">
        <div
          className={cn(
            "w-13 h-13 rounded-full overflow-hidden ",
            classNameEdit,
          )}
        >
          <img
            src="/navbar/logo.jpg"
            className="w-full h-full object-cover object-center"
            alt="logo"
          />
        </div>
      </Link>
    );
  }
}

export default Logo;
