import Email from '../assets/icons/email.svg';
import Eye from '../assets/icons/eye.svg';

const icons = {
  email: Email,
  eye: Eye,
  // Add other icons to this map
};

//@ts-ignore
export default function Icon({ name, ...props }) {
  //@ts-ignore
  const IconComponent = icons[name];
  return IconComponent ? <IconComponent {...props} /> : null;
}
