import { forwardRef } from "react";
import {
  Delete,
  Email,
  Eye,
  Lock,
  Profile,
  Profile_focused,
  Home,
  Home_focused,
  Notification,
  Notification_focused,
  Search,
  Search_focused,
  Chef,
  Arrow_left,
  Arrow_right,
  Trash,
  Cook,
} from "@/assets/icons";
import { colors } from "@/theme/colors";

type SVGIcon = React.FunctionComponent<React.SVGAttributes<SVGElement>>;

enum Icons {
  eye = "eye",
  email = "email",
  profile = "profile",
  profile_focused = "profile_focused",
  arrow_left = "arrow_left",
  arrow_right = "arrow_right",
  lock = "lock",
  delete = "delete",
  home = "home",
  home_focused = "home_focused",
  notification = "notification",
  notification_focused = "notification_focused",
  search = "search",
  search_focused = "search_focused",
  chef = "chef",
  trash = "trash",
  cook = "cook",
}

type IconMap = {
  [key in Icons]: SVGIcon;
};

const icons: IconMap = {
  eye: Eye,
  email: Email,
  profile: Profile,
  profile_focused: Profile_focused,
  arrow_left: Arrow_left,
  arrow_right: Arrow_right,
  lock: Lock,
  delete: Delete,
  home: Home,
  home_focused: Home_focused,
  notification: Notification,
  notification_focused: Notification_focused,
  search: Search,
  search_focused: Search_focused,
  chef: Chef,
  trash: Trash,
  cook: Cook,
};

interface RNIconProps {
  name: Icons;
}

const RNIcon = forwardRef((props: RNIconProps, ref) => {
  const IconComponent = icons[props.name];
  return (
    <IconComponent
      color={colors.greyscale500}
      {...props}
    />
  );
}) as SVGIcon;

export default RNIcon;
